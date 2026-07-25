import { loadImageFromFile, canvasToBlob } from "@/lib/canvas-utils";

export interface SpriteFrame {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PackResult {
  blob: Blob;
  dataUrl: string;
  manifest: string;
  width: number;
  height: number;
  frames: SpriteFrame[];
}

/**
 * Packs images into a uniform grid — every cell sized to the largest
 * source image, so the manifest's per-frame coordinates line up cleanly.
 * Not a bin-packer (no rotation, no variable cell sizes); for uneven
 * source sizes that leaves some padding, which is the trade for a manifest
 * simple enough to hand-write a sprite reader against.
 */
export async function packSprites(
  files: File[],
  padding: number,
  onProgress?: (completed: number, total: number) => void,
): Promise<PackResult> {
  const images: { name: string; img: HTMLImageElement }[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i]!;
    const img = await loadImageFromFile(file);
    images.push({ name: file.name, img });
    onProgress?.(i + 1, files.length);
  }

  const cellW = Math.max(...images.map((i) => i.img.naturalWidth)) + padding * 2;
  const cellH = Math.max(...images.map((i) => i.img.naturalHeight)) + padding * 2;
  const cols = Math.ceil(Math.sqrt(images.length));
  const rows = Math.ceil(images.length / cols);
  const width = cols * cellW;
  const height = rows * cellH;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is unavailable in this browser.");

  const frames: SpriteFrame[] = [];
  images.forEach(({ name, img }, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * cellW + padding;
    const y = row * cellH + padding;
    ctx.drawImage(img, x, y, img.naturalWidth, img.naturalHeight);
    frames.push({ name, x, y, w: img.naturalWidth, h: img.naturalHeight });
  });

  const blob = await canvasToBlob(canvas, "image/png");
  const manifest = JSON.stringify(
    { meta: { image: "sprite-sheet.png", size: { w: width, h: height }, frameCount: frames.length } , frames },
    null,
    2,
  );

  return { blob, dataUrl: URL.createObjectURL(blob), manifest, width, height, frames };
}
