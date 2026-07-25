import { loadImageFromFile, canvasToBlob } from "@/lib/canvas-utils";

export interface ContactSheetOptions {
  columns: number;
  thumbSize: number;
  title?: string;
}

export interface ContactSheetResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
}

const PADDING = 16;
const LABEL_HEIGHT = 22;
const HEADER_HEIGHT = 56;

export async function buildContactSheet(
  files: File[],
  options: ContactSheetOptions,
  onProgress?: (completed: number, total: number) => void,
): Promise<ContactSheetResult> {
  const { columns, thumbSize, title } = options;
  const rows = Math.ceil(files.length / columns);
  const headerHeight = title ? HEADER_HEIGHT : PADDING;
  const cellStride = thumbSize + LABEL_HEIGHT + PADDING;
  const width = columns * (thumbSize + PADDING) + PADDING;
  const height = headerHeight + rows * cellStride + PADDING;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is unavailable in this browser.");

  // Exported artifacts stay on a neutral light background regardless of
  // the site's own theme \u2014 this is a shareable image, not UI chrome.
  ctx.fillStyle = "#f4f1e6";
  ctx.fillRect(0, 0, width, height);

  if (title) {
    ctx.fillStyle = "#17150f";
    ctx.font = "600 20px system-ui, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(title, PADDING, HEADER_HEIGHT / 2);
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]!;
    const img = await loadImageFromFile(file);

    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const sx = (img.naturalWidth - side) / 2;
    const sy = (img.naturalHeight - side) / 2;

    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = PADDING + col * (thumbSize + PADDING);
    const y = headerHeight + row * cellStride;

    ctx.drawImage(img, sx, sy, side, side, x, y, thumbSize, thumbSize);
    ctx.strokeStyle = "rgba(23,21,15,0.15)";
    ctx.strokeRect(x, y, thumbSize, thumbSize);

    ctx.fillStyle = "#423d30";
    ctx.font = "11px monospace";
    ctx.textBaseline = "top";
    const label = truncateLabel(file.name, thumbSize, ctx);
    ctx.fillText(label, x, y + thumbSize + 6);

    onProgress?.(i + 1, files.length);
  }

  const blob = await canvasToBlob(canvas, "image/png");
  return { blob, dataUrl: URL.createObjectURL(blob), width, height };
}

function truncateLabel(name: string, maxWidth: number, ctx: CanvasRenderingContext2D): string {
  if (ctx.measureText(name).width <= maxWidth) return name;
  let truncated = name;
  while (truncated.length > 1 && ctx.measureText(`${truncated}\u2026`).width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated}\u2026`;
}
