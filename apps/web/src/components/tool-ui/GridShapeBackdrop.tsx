import { buildShapePath, cellKey, type CellKey } from "@/features/grid-shapes/lib/geometry";

interface BackdropShapeSpec {
  pattern: string[];
  x: number;
  y: number;
  scale: number;
  fill: string;
  stroke: string;
  opacity: number;
  radius: number;
}

function filledCells(pattern: string[]): Set<CellKey> {
  const cells = new Set<CellKey>();
  pattern.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      if (row[c] === "#") cells.add(cellKey(r, c));
    }
  });
  return cells;
}

const SHAPES: BackdropShapeSpec[] = [
  {
    pattern: [
      "..###..",
      ".#####.",
      "#######",
      ".#####.",
      "..###..",
    ],
    x: 72,
    y: 72,
    scale: 2.4,
    fill: "rgba(184, 134, 58, 0.18)",
    stroke: "rgba(184, 134, 58, 0.24)",
    opacity: 0.7,
    radius: 1.2,
  },
  {
    pattern: [
      "###...",
      "###...",
      "###...",
      "...###",
      "...###",
      "...###",
    ],
    x: 1020,
    y: 120,
    scale: 2.2,
    fill: "rgba(66, 146, 198, 0.12)",
    stroke: "rgba(66, 146, 198, 0.24)",
    opacity: 0.55,
    radius: 1,
  },
  {
    pattern: [
      ".####.",
      "######",
      "##..##",
      "##..##",
      "######",
      ".####.",
    ],
    x: 220,
    y: 300,
    scale: 2,
    fill: "rgba(255, 255, 255, 0.04)",
    stroke: "rgba(255, 255, 255, 0.12)",
    opacity: 0.6,
    radius: 1,
  },
];

export function GridShapeBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 720" preserveAspectRatio="none">
        {SHAPES.map((shape, index) => {
          const cells = filledCells(shape.pattern);
          const result = buildShapePath(cells, 22, shape.radius, new Map());
          if (!result.path) return null;
          return (
            <g
              key={index}
              transform={`translate(${shape.x}, ${shape.y}) scale(${shape.scale})`}
              opacity={shape.opacity}
              style={{ mixBlendMode: "screen" }}
            >
              <path d={result.path} fill={shape.fill} stroke={shape.stroke} strokeWidth={1.5} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
