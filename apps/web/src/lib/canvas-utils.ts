/** Loads a File/Blob into a decoded, ready-to-draw HTMLImageElement. */
export async function loadImageFromFile(file: File | Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    if (typeof img.decode === "function") {
      try {
        await img.decode();
        return img;
      } catch {
        // fall through to the load-event path below
      }
    }
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Couldn't load "${file instanceof File ? file.name : "image"}".`));
    });
    return img;
  } finally {
    // The image has already decoded its pixel data into a bitmap by this
    // point, so it's safe to revoke — the <img> keeps rendering fine.
    URL.revokeObjectURL(url);
  }
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas failed to encode this image."))),
      type,
      quality,
    );
  });
}

/** Scale factor that fits sourceW×sourceH within maxW×maxH without upscaling. */
export function containScale(sourceW: number, sourceH: number, maxW?: number, maxH?: number): number {
  let scale = 1;
  if (maxW) scale = Math.min(scale, maxW / sourceW);
  if (maxH) scale = Math.min(scale, maxH / sourceH);
  return scale;
}

export function extensionForMime(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  return map[mimeType] ?? "png";
}
