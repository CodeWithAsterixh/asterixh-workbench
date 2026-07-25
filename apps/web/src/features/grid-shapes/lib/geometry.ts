/**
 * Turns a set of filled grid cells into a smooth SVG path outline, with
 * every boundary corner \u2014 convex (outer) AND concave (inner notches) \u2014
 * rounded by a configurable radius.
 *
 * The approach, in short:
 *  1. Every filled cell contributes a unit edge on each side that faces an
 *     empty cell (or the edge of the grid). Shared edges between two filled
 *     cells cancel out, so what's left is exactly the boundary.
 *  2. Those unit edges are linked tip-to-tail into closed loops (one per
 *     outer contour or hole).
 *  3. Walking each loop, any point where the direction changes is a "real"
 *     corner; anywhere it doesn't is just a pass-through point on a
 *     straight run.
 *  4. Each corner is drawn as a quadratic B\u00e9zier curve *using the original
 *     sharp corner as the control point*. That single trick is what makes
 *     both convex and concave corners round correctly with no special-casing:
 *     a quadratic curve is always pulled toward its control point, so it
 *     naturally bulges inward for an outer corner and outward (filling the
 *     notch) for an inner one.
 *  5. Radii are clamped per edge \u2014 if two neighboring corners would ask
 *     for more radius than the edge between them is long, both are scaled
 *     down proportionally, the same way CSS border-radius resolves
 *     overlapping corners on a box.
 */

export type CellKey = string;

export function cellKey(row: number, col: number): CellKey {
  return `${row},${col}`;
}

export function parseCellKey(key: CellKey): { row: number; col: number } {
  const [row, col] = key.split(",").map(Number);
  return { row: row!, col: col! };
}

interface Direction {
  dx: number;
  dy: number;
}

interface UnitEdge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  ownerKey: CellKey;
}

interface Corner {
  x: number;
  y: number;
  inDir: Direction;
  outDir: Direction;
  ownerKey: CellKey;
}

/** Every filled cell emits an edge on each side that isn't shared with another filled cell. */
function collectBoundaryEdges(filled: Set<CellKey>): UnitEdge[] {
  const edges: UnitEdge[] = [];

  for (const key of filled) {
    const { row: r, col: c } = parseCellKey(key);

    if (!filled.has(cellKey(r - 1, c))) edges.push({ x1: c, y1: r, x2: c + 1, y2: r, ownerKey: key }); // top
    if (!filled.has(cellKey(r, c + 1))) edges.push({ x1: c + 1, y1: r, x2: c + 1, y2: r + 1, ownerKey: key }); // right
    if (!filled.has(cellKey(r + 1, c))) edges.push({ x1: c + 1, y1: r + 1, x2: c, y2: r + 1, ownerKey: key }); // bottom
    if (!filled.has(cellKey(r, c - 1))) edges.push({ x1: c, y1: r + 1, x2: c, y2: r, ownerKey: key }); // left
  }

  return edges;
}

/** Links unit edges (each walked clockwise around its owning cell) into closed boundary loops. */
function linkLoops(edges: UnitEdge[]): UnitEdge[][] {
  const byStart = new Map<string, UnitEdge[]>();
  for (const edge of edges) {
    const k = `${edge.x1},${edge.y1}`;
    const list = byStart.get(k);
    if (list) list.push(edge);
    else byStart.set(k, [edge]);
  }

  const used = new Set<UnitEdge>();
  const loops: UnitEdge[][] = [];

  for (const seed of edges) {
    if (used.has(seed)) continue;
    const startKey = `${seed.x1},${seed.y1}`;
    const loop: UnitEdge[] = [];
    let current: UnitEdge | undefined = seed;

    while (current) {
      loop.push(current);
      used.add(current);
      const nextKey: string = `${current.x2},${current.y2}`;
      if (nextKey === startKey) break;
      const candidates: UnitEdge[] = byStart.get(nextKey) ?? [];
      current = candidates.find((e: UnitEdge) => !used.has(e));
    }

    if (loop.length >= 4) loops.push(loop);
  }

  return loops;
}

/** Reduces a loop's full unit-edge chain down to just the points where direction actually changes. */
function extractCorners(loop: UnitEdge[]): Corner[] {
  const n = loop.length;
  const corners: Corner[] = [];

  for (let i = 0; i < n; i++) {
    const curr = loop[i]!;
    const prev = loop[(i - 1 + n) % n]!;
    const inDir: Direction = { dx: prev.x2 - prev.x1, dy: prev.y2 - prev.y1 };
    const outDir: Direction = { dx: curr.x2 - curr.x1, dy: curr.y2 - curr.y1 };
    if (inDir.dx !== outDir.dx || inDir.dy !== outDir.dy) {
      corners.push({ x: curr.x1, y: curr.y1, inDir, outDir, ownerKey: curr.ownerKey });
    }
  }

  return corners;
}

const fmt = (n: number): string => n.toFixed(2);

function buildLoopPath(
  corners: Corner[],
  radiusForOwner: (key: CellKey) => number,
  cellSize: number,
  offsetCol: number,
  offsetRow: number,
): string {
  const n = corners.length;

  const px = (i: number) => (corners[i]!.x - offsetCol) * cellSize;
  const py = (i: number) => (corners[i]!.y - offsetRow) * cellSize;

  const rawRadius = corners.map((c) => Math.max(0, radiusForOwner(c.ownerKey)));

  const edgeLength = corners.map((_, i) => {
    const j = (i + 1) % n;
    return Math.abs(px(j) - px(i)) + Math.abs(py(j) - py(i));
  });

  // If two neighboring corners' radii would overlap on the edge between
  // them, scale both down proportionally \u2014 same resolution CSS uses for
  // border-radius overlap on a box, applied per edge instead of globally.
  const edgeScale = edgeLength.map((len, i) => {
    const r1 = rawRadius[i]!;
    const r2 = rawRadius[(i + 1) % n]!;
    const sum = r1 + r2;
    return sum > len && sum > 0 ? len / sum : 1;
  });

  const effRadius = corners.map((_, i) => {
    const scaleIn = edgeScale[(i - 1 + n) % n]!;
    const scaleOut = edgeScale[i]!;
    return rawRadius[i]! * Math.min(scaleIn, scaleOut, 1);
  });

  const inPoint = (i: number) => {
    const c = corners[i]!;
    const r = effRadius[i]!;
    return { x: px(i) - c.inDir.dx * r, y: py(i) - c.inDir.dy * r };
  };
  const outPoint = (i: number) => {
    const c = corners[i]!;
    const r = effRadius[i]!;
    return { x: px(i) + c.outDir.dx * r, y: py(i) + c.outDir.dy * r };
  };

  const start = outPoint(0);
  let d = `M ${fmt(start.x)} ${fmt(start.y)}`;

  for (let step = 1; step <= n; step++) {
    const i = step % n;
    const inP = inPoint(i);
    const outP = outPoint(i);
    d += ` L ${fmt(inP.x)} ${fmt(inP.y)} Q ${fmt(px(i))} ${fmt(py(i))} ${fmt(outP.x)} ${fmt(outP.y)}`;
  }

  return `${d} Z`;
}

export interface ShapePathResult {
  /** SVG path `d` data, ready to drop into a <path>. Empty string if nothing is filled. */
  path: string;
  /** Tight bounding box around the filled cells, in px at the given cell size. */
  width: number;
  height: number;
}

export function buildShapePath(
  filled: Set<CellKey>,
  cellSize: number,
  defaultRadius: number,
  cellRadiusOverrides: Map<CellKey, number>,
): ShapePathResult {
  if (filled.size === 0) {
    return { path: "", width: 0, height: 0 };
  }

  let minRow = Infinity;
  let minCol = Infinity;
  let maxRow = -Infinity;
  let maxCol = -Infinity;
  for (const key of filled) {
    const { row, col } = parseCellKey(key);
    minRow = Math.min(minRow, row);
    minCol = Math.min(minCol, col);
    maxRow = Math.max(maxRow, row);
    maxCol = Math.max(maxCol, col);
  }

  const edges = collectBoundaryEdges(filled);
  const loops = linkLoops(edges);
  const radiusForOwner = (key: CellKey) => cellRadiusOverrides.get(key) ?? defaultRadius;

  const path = loops
    .map((loop) => extractCorners(loop))
    .filter((corners) => corners.length >= 4)
    .map((corners) => buildLoopPath(corners, radiusForOwner, cellSize, minCol, minRow))
    .join(" ");

  return {
    path,
    width: (maxCol - minCol + 1) * cellSize,
    height: (maxRow - minRow + 1) * cellSize,
  };
}
