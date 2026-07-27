"use client";

import { canvasToBlob, containScale, loadImageFromFile, extensionForMime } from "@/lib/canvas-utils";

export type ImageMode =
  | "resize"
  | "crop"
  | "rotate"
  | "flip"
  | "blur"
  | "sharpen"
  | "convert"
  | "background-removal"
  | "split"
  | "merge"
  | "collage";

export type ImageMimeType = "image/jpeg" | "image/png" | "image/webp";

export interface ImageWorkbenchOptions {
  width: number;
  height: number;
  angle: number;
  blur: number;
  quality: number;
  format: ImageMimeType;
  rows: number;
  cols: number;
  tolerance: number;
  background: string;
  flipHorizontal: boolean;
  flipVertical: boolean;
}

export interface ProcessedImage {
  name: string;
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

export interface ImageWorkbenchResult {
  items: ProcessedImage[];
  totalBytes: number;
}

const DEFAULT_SHARPEN_KERNEL = [
  [0, -1, 0],
  [-1, 5, -1],
  [0, -1, 0],
];

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const value =
    clean.length === 3
      ? clean
          .split("")
          .map((part) => part + part)
          .join("")
      : clean;
  const parsed = Number.parseInt(value, 16);
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is unavailable in this browser.");
  return ctx;
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

function sharpenImageData(imageData: ImageData): ImageData {
  const { width, height, data } = imageData;
  const output = new ImageData(width, height);
  const out = output.data;

  const sample = (x: number, y: number): [number, number, number, number] => {
    const px = clamp(x, 0, width - 1);
    const py = clamp(y, 0, height - 1);
    const idx = (py * width + px) * 4;
    return [data[idx]!, data[idx + 1]!, data[idx + 2]!, data[idx + 3]!];
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const weight = DEFAULT_SHARPEN_KERNEL[ky + 1]![kx + 1]!;
          const [sr, sg, sb, sa] = sample(x + kx, y + ky);
          r += sr * weight;
          g += sg * weight;
          b += sb * weight;
          a += sa;
        }
      }
      const idx = (y * width + x) * 4;
      out[idx] = clamp(Math.round(r), 0, 255);
      out[idx + 1] = clamp(Math.round(g), 0, 255);
      out[idx + 2] = clamp(Math.round(b), 0, 255);
      out[idx + 3] = clamp(Math.round(a / 9), 0, 255);
    }
  }

  return output;
}

function drawContain(ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number) {
  const scale = containScale(img.naturalWidth, img.naturalHeight, width, height);
  const dw = Math.max(1, Math.round(img.naturalWidth * scale));
  const dh = Math.max(1, Math.round(img.naturalHeight * scale));
  const dx = Math.round((width - dw) / 2);
  const dy = Math.round((height - dh) / 2);
  ctx.drawImage(img, dx, dy, dw, dh);
}

async function renderSingle(
  file: File,
  mode: ImageMode,
  options: ImageWorkbenchOptions,
): Promise<ProcessedImage[]> {
  const img = await loadImageFromFile(file);
  const outputs: ProcessedImage[] = [];
  const baseName = file.name.replace(/\.[^.]+$/, "");

  const createOutput = async (canvas: HTMLCanvasElement, suffix: string, mimeType: ImageMimeType = options.format) => {
    const blob = await canvasToBlob(canvas, mimeType, mimeType === "image/png" ? undefined : options.quality);
    outputs.push({
      name: `${baseName}-${suffix}.${extensionForMime(mimeType)}`,
      blob,
      url: URL.createObjectURL(blob),
      width: canvas.width,
      height: canvas.height,
    });
  };

  if (mode === "split") {
    const rows = Math.max(1, options.rows);
    const cols = Math.max(1, options.cols);
    const tileW = Math.max(1, Math.floor(img.naturalWidth / cols));
    const tileH = Math.max(1, Math.floor(img.naturalHeight / rows));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const canvas = createCanvas(tileW, tileH);
        const ctx = getContext(canvas);
        ctx.drawImage(img, col * tileW, row * tileH, tileW, tileH, 0, 0, tileW, tileH);
        await createOutput(canvas, `tile-${row + 1}-${col + 1}`);
      }
    }

    return outputs;
  }

  if (mode === "resize") {
    const scale = containScale(img.naturalWidth, img.naturalHeight, options.width, options.height);
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = createCanvas(width, height);
    const ctx = getContext(canvas);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);
    await createOutput(canvas, "resize");
    return outputs;
  }

  if (mode === "crop") {
    const targetRatio = options.width / options.height;
    const sourceRatio = img.naturalWidth / img.naturalHeight;
    let sx = 0;
    let sy = 0;
    let sw = img.naturalWidth;
    let sh = img.naturalHeight;

    if (sourceRatio > targetRatio) {
      sw = Math.round(img.naturalHeight * targetRatio);
      sx = Math.round((img.naturalWidth - sw) / 2);
    } else {
      sh = Math.round(img.naturalWidth / targetRatio);
      sy = Math.round((img.naturalHeight - sh) / 2);
    }

    const canvas = createCanvas(options.width, options.height);
    const ctx = getContext(canvas);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, options.width, options.height);
    await createOutput(canvas, "crop");
    return outputs;
  }

  if (mode === "rotate") {
    const angle = (options.angle * Math.PI) / 180;
    const sin = Math.abs(Math.sin(angle));
    const cos = Math.abs(Math.cos(angle));
    const width = Math.ceil(img.naturalWidth * cos + img.naturalHeight * sin);
    const height = Math.ceil(img.naturalWidth * sin + img.naturalHeight * cos);
    const canvas = createCanvas(width, height);
    const ctx = getContext(canvas);
    ctx.translate(width / 2, height / 2);
    ctx.rotate(angle);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    await createOutput(canvas, `rotate-${Math.abs(options.angle)}`);
    return outputs;
  }

  if (mode === "flip") {
    const canvas = createCanvas(img.naturalWidth, img.naturalHeight);
    const ctx = getContext(canvas);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(options.flipHorizontal ? -1 : 1, options.flipVertical ? -1 : 1);
    ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2);
    ctx.restore();
    await createOutput(canvas, "flip");
    return outputs;
  }

  if (mode === "blur") {
    const scale = containScale(img.naturalWidth, img.naturalHeight, options.width, options.height);
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = createCanvas(width, height);
    const ctx = getContext(canvas);
    ctx.filter = `blur(${Math.max(0, options.blur)}px)`;
    ctx.drawImage(img, 0, 0, width, height);
    ctx.filter = "none";
    await createOutput(canvas, "blur");
    return outputs;
  }

  if (mode === "sharpen") {
    const canvas = createCanvas(img.naturalWidth, img.naturalHeight);
    const ctx = getContext(canvas);
    ctx.drawImage(img, 0, 0);
    const sharpened = sharpenImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.putImageData(sharpened, 0, 0);
    await createOutput(canvas, "sharpen");
    return outputs;
  }

  if (mode === "convert") {
    const canvas = createCanvas(img.naturalWidth, img.naturalHeight);
    const ctx = getContext(canvas);
    ctx.drawImage(img, 0, 0);
    await createOutput(canvas, "convert");
    return outputs;
  }

  if (mode === "background-removal") {
    const canvas = createCanvas(img.naturalWidth, img.naturalHeight);
    const ctx = getContext(canvas);
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const [tr, tg, tb] = hexToRgb(options.background);
    const threshold = Math.max(0, options.tolerance);

    for (let i = 0; i < imageData.data.length; i += 4) {
      const dr = imageData.data[i]! - tr;
      const dg = imageData.data[i + 1]! - tg;
      const db = imageData.data[i + 2]! - tb;
      const distance = Math.sqrt(dr * dr + dg * dg + db * db);
      if (distance <= threshold) {
        imageData.data[i + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    await createOutput(canvas, "cutout", "image/png");
    return outputs;
  }

  const canvas = createCanvas(img.naturalWidth, img.naturalHeight);
  const ctx = getContext(canvas);
  ctx.drawImage(img, 0, 0);
  await createOutput(canvas, "image");
  return outputs;
}

async function renderBatch(files: File[], mode: ImageMode, options: ImageWorkbenchOptions): Promise<ProcessedImage[]> {
  if (files.length === 0) return [];

  if (mode === "merge" || mode === "collage") {
    const images = await Promise.all(files.map(async (file) => ({ file, img: await loadImageFromFile(file) })));
    const cols = mode === "merge" ? Math.max(1, images.length) : Math.max(1, options.cols);
    const rows = mode === "merge" ? 1 : Math.ceil(images.length / cols);
    const cellW = Math.max(...images.map((entry) => entry.img.naturalWidth));
    const cellH = Math.max(...images.map((entry) => entry.img.naturalHeight));
    const canvas = createCanvas(cellW * cols, cellH * rows);
    const ctx = getContext(canvas);
    ctx.fillStyle = options.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingQuality = "high";

    images.forEach(({ img }, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = col * cellW;
      const y = row * cellH;
      const scale = mode === "merge" ? containScale(img.naturalWidth, img.naturalHeight, cellW - 24, cellH - 24) : containScale(img.naturalWidth, img.naturalHeight, cellW - 24, cellH - 24);
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const dx = x + Math.round((cellW - w) / 2);
      const dy = y + Math.round((cellH - h) / 2);
      ctx.drawImage(img, dx, dy, w, h);
    });

    const blob = await canvasToBlob(canvas, options.format, options.format === "image/png" ? undefined : options.quality);
    return [
      {
        name: `collage.${extensionForMime(options.format)}`,
        blob,
        url: URL.createObjectURL(blob),
        width: canvas.width,
        height: canvas.height,
      },
    ];
  }

  const results: ProcessedImage[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i]!;
    const outputs = await renderSingle(file, mode, options);
    results.push(...outputs);
  }
  return results;
}

export async function runImageWorkbench(
  files: File[],
  mode: ImageMode,
  options: ImageWorkbenchOptions,
): Promise<ImageWorkbenchResult> {
  const items = await renderBatch(files, mode, options);
  return {
    items,
    totalBytes: items.reduce((sum, item) => sum + item.blob.size, 0),
  };
}
