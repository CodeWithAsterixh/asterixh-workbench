import type { FrameStoryChapter } from "@/lib/animations";

const GRID = 8; // 8x8 = 64 cells, revealed progressively as "frames" advance
const SIZE = 800;
const CELL = SIZE / GRID;
const GAP = 3;

// Deterministic per-cell hash so each tile has a fixed identity (no flicker
// between frames) — only its reveal state changes as progress advances.
function hashCell(i: number): number {
  let h = i * 2654435761;
  h = (h ^ (h >>> 15)) >>> 0;
  return h / 4294967295;
}

function tileFill(cellIndex: number): string {
  const t = hashCell(cellIndex);
  // Blend between two blueprint/brass tones so the revealed grid reads as
  // a coherent (if abstract) image rather than random noise.
  const hue = 205 - t * 35; // 170–205: blueprint range with a warm brass drift
  const light = 22 + t * 14;
  return `hsl(${hue.toFixed(0)} 28% ${light.toFixed(0)}%)`;
}

function buildFrameSvg(index: number, total: number): string {
  const progress = total <= 1 ? 1 : index / (total - 1);
  const cellCount = GRID * GRID;
  const revealed = Math.round(progress * cellCount);

  let cells = "";
  for (let i = 0; i < cellCount; i++) {
    const col = i % GRID;
    const row = Math.floor(i / GRID);
    const x = col * CELL + GAP / 2;
    const y = row * CELL + GAP / 2;
    const w = CELL - GAP;
    const isRevealed = i < revealed;
    cells += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${w.toFixed(1)}" fill="${
      isRevealed ? tileFill(i) : "rgba(231,228,216,0.035)"
    }" />`;
  }

  const ticks = Array.from({ length: 24 }, (_, i) => {
    const filled = i / 24 <= progress;
    const x = 40 + i * ((SIZE - 80) / 23);
    return `<rect x="${x.toFixed(1)}" y="${SIZE - 34}" width="2" height="${
      filled ? 14 : 8
    }" fill="${filled ? "#d9b273" : "rgba(231,228,216,0.25)"}" />`;
  }).join("");

  const zipOpacity = Math.max(0, (progress - 0.82) / 0.18);
  const zipGlyph =
    zipOpacity > 0
      ? `<g opacity="${zipOpacity.toFixed(2)}" transform="translate(${SIZE - 118}, 40)">
           <rect x="0" y="0" width="72" height="56" rx="2" fill="none" stroke="#d9b273" stroke-width="2.5" />
           <line x1="36" y1="0" x2="36" y2="56" stroke="#d9b273" stroke-width="2.5" stroke-dasharray="6 6" />
           <text x="36" y="76" text-anchor="middle" font-family="monospace" font-size="13" fill="#cdc7b3" letter-spacing="2">ZIP</text>
         </g>`
      : "";

  const label = String(index + 1).padStart(3, "0");
  const totalLabel = String(total).padStart(3, "0");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
    <rect width="${SIZE}" height="${SIZE}" fill="#11161c" />
    <g>${cells}</g>
    ${zipGlyph}
    <g opacity="0.55">${ticks}</g>
    <text x="40" y="72" font-family="monospace" font-size="16" fill="#8fb2c7" letter-spacing="4">FRAME</text>
    <text x="40" y="${SIZE - 56}" font-family="monospace" font-size="46" fill="#f4f1e6" letter-spacing="2">${label}</text>
    <text x="${40 + String(label).length * 27 + 14}" y="${SIZE - 56}" font-family="monospace" font-size="22" fill="#938d76">/ ${totalLabel}</text>
  </svg>`;
}

export function generateFrameDataUri(index: number, total: number): string {
  const svg = buildFrameSvg(index, total);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function buildProcessFrames(total: number): string[] {
  return Array.from({ length: total }, (_, i) => generateFrameDataUri(i, total));
}

export const heroFrameCount = 60;

export const heroChapters: FrameStoryChapter[] = [
  {
    eyebrow: "Step 01",
    title: "Drop in a video",
    body: "Any file your browser can decode. It's read locally — nothing leaves your machine until you choose to export something.",
  },
  {
    eyebrow: "Step 02",
    title: "Pick a frame count",
    body: "Set exactly how many frames you want, trim dead air off either end, and choose a format. Workbench samples evenly across the range.",
  },
  {
    eyebrow: "Step 03",
    title: "Every frame, preloaded",
    body: "Each frame is decoded the moment it's extracted, so the preview grid fills in with zero flash and zero lazy-load stutter.",
  },
  {
    eyebrow: "Step 04",
    title: "One zip, sized before you commit",
    body: "Frames compile into a single archive. File count and exact size are shown before the download starts \u2014 not after.",
  },
];
