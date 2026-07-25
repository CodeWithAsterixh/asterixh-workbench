import { GIFEncoder, quantize, applyPalette } from "gifenc";
import { loadImageFromFile } from "@/lib/canvas-utils";

export interface GifOptions {
  /** Output width in px; height is derived from the first frame's aspect ratio. */
  width: number;
  delayMs: number;
  /** 0 = loop forever, -1 = play once, N = repeat N times. */
  repeat: number;
}

export async function buildGif(
  files: File[],
  options: GifOptions,
  onProgress?: (completed: number, total: number) => void,
): Promise<Uint8Array> {
  if (files.length === 0) throw new Error("Add at least one image.");

  const { width, delayMs, repeat } = options;
  const gif = GIFEncoder();

  const firstImg = await loadImageFromFile(files[0]!);
  const aspect = firstImg.naturalHeight / firstImg.naturalWidth;
  const height = Math.max(1, Math.round(width * aspect));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D context is unavailable in this browser.");

  for (let i = 0; i < files.length; i++) {
    const img = i === 0 ? firstImg : await loadImageFromFile(files[i]!);

    // Cover-fit: scale to fill the output frame, center-cropping any excess,
    // so every source image — whatever its own size — lands consistently.
    const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const dx = (width - drawW) / 2;
    const dy = (height - drawH) / 2;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, dx, dy, drawW, drawH);

    const { data } = ctx.getImageData(0, 0, width, height);
    const palette = quantize(data, 256);
    const index = applyPalette(data, palette);

    gif.writeFrame(index, width, height, {
      palette,
      delay: delayMs,
      ...(i === 0 ? { repeat } : {}),
    });

    onProgress?.(i + 1, files.length);
  }

  gif.finish();
  return gif.bytes();
}
