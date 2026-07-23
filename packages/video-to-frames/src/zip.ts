import { zipSync, type Zippable } from "fflate";
import type { ExtractedFrame, ZipMetadata, ZipOptions, ZipResult } from "./types";
import { formatBytes } from "./format";

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function extensionFor(mimeType: string): string {
  return EXTENSION_BY_MIME[mimeType] ?? "jpg";
}

function frameFilename(frame: ExtractedFrame, digits: number, padIndex: boolean): string {
  const n = padIndex ? String(frame.index + 1).padStart(digits, "0") : String(frame.index + 1);
  return `frame-${n}.${extensionFor(frame.blob.type)}`;
}

/**
 * Compiles extracted frames into a single .zip Blob. All metadata the
 * caller needs to show a "ready to download" state — file count, exact
 * zip size, a formatted size string — is computed and returned *before*
 * `download()` is ever called, so a download button can show real numbers
 * up front instead of a spinner with no information.
 *
 * Progress runs through three stages:
 *  - "preparing"   — reading each frame's encoded bytes (real, chunked, per-frame)
 *  - "compressing" — deflating the archive (fast; reported as a single step)
 *  - "finalizing"  — wrapping the result in a Blob + object URL
 */
export async function compileFramesToZip(
  frames: ExtractedFrame[],
  options: ZipOptions = {},
): Promise<ZipResult> {
  if (frames.length === 0) {
    throw new Error("No frames to zip.");
  }

  const {
    filename = "frames",
    compressionLevel = 6,
    padIndex = true,
    onProgress,
  } = options;

  const digits = String(frames.length).length;
  const zippable: Zippable = {};
  let uncompressedBytes = 0;

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i]!;
    const bytes = new Uint8Array(await frame.blob.arrayBuffer());
    zippable[frameFilename(frame, digits, padIndex)] = bytes;
    uncompressedBytes += bytes.byteLength;
    onProgress?.({ stage: "preparing", completed: i + 1, total: frames.length });
  }

  onProgress?.({ stage: "compressing", completed: 0, total: 1 });
  const zipBytes = zipSync(zippable, { level: compressionLevel });
  onProgress?.({ stage: "compressing", completed: 1, total: 1 });

  onProgress?.({ stage: "finalizing", completed: 0, total: 1 });
  const blob = new Blob([zipBytes as unknown as BlobPart], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const finalFilename = filename.endsWith(".zip") ? filename : `${filename}.zip`;

  const metadata: ZipMetadata = {
    fileCount: frames.length,
    uncompressedBytes,
    zipSizeBytes: blob.size,
    formattedSize: formatBytes(blob.size),
    mimeType: "application/zip",
    filename: finalFilename,
    createdAt: new Date().toISOString(),
  };
  onProgress?.({ stage: "finalizing", completed: 1, total: 1 });
  onProgress?.({ stage: "done", completed: frames.length, total: frames.length });

  return {
    ...metadata,
    blob,
    url,
    download: () => triggerDownload(url, finalFilename),
    revoke: () => URL.revokeObjectURL(url),
  };
}

export function triggerDownload(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
