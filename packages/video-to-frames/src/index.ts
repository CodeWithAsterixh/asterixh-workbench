import { extractFrames, disposeFrames } from "./extract";
import { compileFramesToZip } from "./zip";
import type { FrameExtractionOptions, VideoToFramesResult, ZipOptions } from "./types";

/**
 * The one-call API: give it a video (File, Blob, or URL) and options, get
 * back a preloaded frame sequence plus a `toZip()` you can call whenever
 * you're ready to compile + download.
 *
 * @example
 * ```ts
 * import { videoToFrames } from "@workbench-tools/video-to-frames";
 *
 * const result = await videoToFrames(file, {
 *   frameCount: 48,
 *   onProgress: (p) => console.log(p.stage, p.completed, "/", p.total),
 * });
 *
 * // frames are already decoded and ready to render
 * result.frames.forEach((f) => gallery.appendChild(f.image!));
 *
 * const zip = await result.toZip({ filename: "product-spin" });
 * console.log(zip.formattedSize); // known before download() is called
 * zip.download();
 * ```
 */
export async function videoToFrames(
  source: File | Blob | string,
  options: FrameExtractionOptions,
): Promise<VideoToFramesResult> {
  const { frames, video } = await extractFrames(source, options);
  const totalSizeBytes = frames.reduce((sum, frame) => sum + frame.sizeBytes, 0);

  return {
    frames,
    video,
    totalSizeBytes,
    toZip: (zipOptions?: ZipOptions) => compileFramesToZip(frames, zipOptions),
    dispose: () => disposeFrames(frames),
  };
}

export { extractFrames, disposeFrames } from "./extract";
export { compileFramesToZip, triggerDownload } from "./zip";
export { downloadFrame, downloadAllFramesSequentially } from "./download";
export { formatBytes } from "./format";

export type {
  FrameExtractionOptions,
  FrameMimeType,
  ExtractionStage,
  ExtractionProgress,
  ExtractedFrame,
  VideoInfo,
  VideoToFramesResult,
  ZipStage,
  ZipProgress,
  ZipOptions,
  ZipMetadata,
  ZipResult,
} from "./types";
