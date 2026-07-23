import type { ExtractedFrame } from "./types";
import { triggerDownload } from "./zip";

/** Triggers a browser download for a single extracted frame. */
export function downloadFrame(frame: ExtractedFrame, filenamePrefix = "frame"): void {
  const ext = frame.blob.type.split("/")[1] ?? "jpg";
  const name = `${filenamePrefix}-${String(frame.index + 1).padStart(3, "0")}.${ext}`;
  triggerDownload(frame.dataUrl, name);
}

/**
 * Triggers a separate download per frame, with a short delay between each
 * (browsers throttle or silently block rapid-fire simultaneous downloads).
 * Prefer `compileFramesToZip` + `.download()` for anything more than a
 * handful of frames — one file beats a folder full of loose images.
 */
export async function downloadAllFramesSequentially(
  frames: ExtractedFrame[],
  filenamePrefix = "frame",
  delayMs = 150,
): Promise<void> {
  for (const frame of frames) {
    downloadFrame(frame, filenamePrefix);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
