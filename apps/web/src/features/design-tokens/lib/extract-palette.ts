import { loadImageFromFile } from "@/lib/canvas-utils";

interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface PaletteColor {
  hex: string;
  rgb: RGB;
  weight: number;
}

const SAMPLE_SIZE = 64;
const ITERATIONS = 8;

function distSquared(a: RGB, b: RGB): number {
  return (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2;
}

function toHex({ r, g, b }: RGB): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[clamp(r), clamp(g), clamp(b)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/** Deterministic Lloyd's k-means over a downsampled, opaque-pixel sample of the image. */
function kMeans(pixels: RGB[], k: number): { color: RGB; weight: number }[] {
  const n = pixels.length;
  if (n === 0) return [];
  const clusterCount = Math.min(k, n);

  let centroids: RGB[] = Array.from({ length: clusterCount }, (_, i) => {
    const pixel = pixels[Math.floor((i / clusterCount) * n)];
    return pixel ? { ...pixel } : { r: 0, g: 0, b: 0 };
  });
  let assignments = new Array<number>(n).fill(0);

  for (let iter = 0; iter < ITERATIONS; iter++) {
    for (let i = 0; i < n; i++) {
      let best = 0;
      let bestDist = Infinity;
      for (let c = 0; c < clusterCount; c++) {
        const centroid = centroids[c]!;
        const d = distSquared(pixels[i]!, centroid);
        if (d < bestDist) {
          bestDist = d;
          best = c;
        }
      }
      assignments[i] = best;
    }

    const sums = Array.from({ length: clusterCount }, () => ({ r: 0, g: 0, b: 0, count: 0 }));
    for (let i = 0; i < n; i++) {
      const c = assignments[i]!;
      const pixel = pixels[i]!;
      const sum = sums[c]!;
      sum.r += pixel.r;
      sum.g += pixel.g;
      sum.b += pixel.b;
      sum.count += 1;
    }
    centroids = sums.map((s, idx) => (s.count > 0 ? { r: s.r / s.count, g: s.g / s.count, b: s.b / s.count } : centroids[idx]!));
  }

  const counts = new Array(clusterCount).fill(0);
  for (const a of assignments) counts[a] += 1;

  return centroids
    .map((color, i) => ({ color, weight: counts[i]! / n }))
    .sort((a, b) => b.weight - a.weight);
}

export async function extractPalette(file: File, colorCount: number): Promise<PaletteColor[]> {
  const img = await loadImageFromFile(file);

  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context is unavailable in this browser.");
  ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

  const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
  const pixels: RGB[] = [];
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3]!;
    if (alpha < 128) continue;
    pixels.push({ r: data[i]!, g: data[i + 1]!, b: data[i + 2]! });
  }

  const clusters = kMeans(pixels, colorCount);
  return clusters.map(({ color, weight }) => ({ hex: toHex(color), rgb: color, weight }));
}

export function paletteToCss(palette: PaletteColor[]): string {
  const lines = palette.map((c, i) => `  --color-${i + 1}: ${c.hex};`);
  return `:root {\n${lines.join("\n")}\n}`;
}

export function paletteToTailwind(palette: PaletteColor[]): string {
  const lines = palette.map((c, i) => `        "extracted-${i + 1}": "${c.hex}",`);
  return `export default {\n  theme: {\n    extend: {\n      colors: {\n${lines.join("\n")}\n      },\n    },\n  },\n};`;
}

export function paletteToJson(palette: PaletteColor[]): string {
  return JSON.stringify(
    palette.map((c, i) => ({ name: `color-${i + 1}`, hex: c.hex, weight: Number(c.weight.toFixed(3)) })),
    null,
    2,
  );
}
