/**
 * @workbench-tools/video-to-frames
 *
 * Browser-only. Every type here assumes it's running in a DOM environment
 * (HTMLVideoElement, HTMLCanvasElement, Blob, URL.createObjectURL). There
 * is no server/Node build target — see README for details.
 */

export type FrameMimeType = "image/jpeg" | "image/png" | "image/webp";

export interface FrameExtractionOptions {
  /** How many evenly-spaced frames to pull from the usable range of the video. */
  frameCount: number;
  /** Skip this fraction of the video at the start (0-1). Useful for avoiding fade-ins. */
  trimStart?: number;
  /** Skip this fraction of the video at the end (0-1). Useful for avoiding fade-outs. */
  trimEnd?: number;
  /** Output image format for each frame. Defaults to "image/jpeg". */
  mimeType?: FrameMimeType;
  /** 0-1 encoder quality. Only applies to jpeg/webp. Defaults to 0.9. */
  quality?: number;
  /** Downscale frames so neither dimension exceeds this, preserving aspect ratio. */
  maxWidth?: number;
  /** Downscale frames so neither dimension exceeds this, preserving aspect ratio. */
  maxHeight?: number;
  /**
   * Whether to preload each frame as a real HTMLImageElement before resolving,
   * so callers can drop `frame.image` straight into the DOM with zero decode
   * delay. Defaults to true. Turn off if you only need bytes (e.g. server-side
   * relaying, or building your own zip elsewhere) and want to skip the extra
   * decode pass.
   */
  preload?: boolean;
  /** Called as extraction proceeds. Fires once per stage transition and once per frame. */
  onProgress?: (progress: ExtractionProgress) => void;
  /** Abort the extraction (and any in-flight preloading) early. */
  signal?: AbortSignal;
}

export type ExtractionStage = "loading-video" | "extracting" | "preloading" | "done";

export interface ExtractionProgress {
  stage: ExtractionStage;
  /** Units completed within the current stage. */
  completed: number;
  /** Units total within the current stage. */
  total: number;
}

export interface ExtractedFrame {
  /** 0-based position in the sequence. */
  index: number;
  /** Ready-to-render `<img src>` value. */
  dataUrl: string;
  /** Raw encoded bytes — what actually gets zipped. */
  blob: Blob;
  width: number;
  height: number;
  /** Byte size of `blob`, i.e. the real encoded size, not the base64 string length. */
  sizeBytes: number;
  /** Timestamp in the source video this frame was captured at. */
  timestampSeconds: number;
  /**
   * A preloaded, decode-complete image element — present when `preload`
   * (default true) is on. Safe to append to the DOM immediately.
   */
  image?: HTMLImageElement;
}

export interface VideoInfo {
  width: number;
  height: number;
  duration: number;
}

export type ZipStage = "preparing" | "compressing" | "finalizing" | "done";

export interface ZipProgress {
  stage: ZipStage;
  completed: number;
  total: number;
}

export interface ZipOptions {
  /** Base filename, without extension. Defaults to "frames". */
  filename?: string;
  /** Deflate level 0 (store) \u2013 9 (max compression). Defaults to 6. */
  compressionLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /** Zero-padded frame filenames, e.g. frame-001.jpg. Defaults to true. */
  padIndex?: boolean;
  onProgress?: (progress: ZipProgress) => void;
}

export interface ZipMetadata {
  fileCount: number;
  /** Sum of each frame's encoded byte size before compression. */
  uncompressedBytes: number;
  /** Final .zip size in bytes \u2014 known before any download is triggered. */
  zipSizeBytes: number;
  /** Human-readable size, e.g. "8.4 MB". */
  formattedSize: string;
  mimeType: "application/zip";
  filename: string;
  createdAt: string;
}

export interface ZipResult extends ZipMetadata {
  blob: Blob;
  /** Object URL for the zip \u2014 valid until `revoke()` is called. */
  url: string;
  /** Triggers a normal browser file-save for the zip. */
  download: () => void;
  /** Revokes the object URL. Call this once you're done with `url`/`download`. */
  revoke: () => void;
}

export interface VideoToFramesResult {
  frames: ExtractedFrame[];
  video: VideoInfo;
  /** Sum of `frame.sizeBytes` across every frame \u2014 known immediately, before any zip is built. */
  totalSizeBytes: number;
  /** Compiles every frame into a downloadable zip, with its own progress + metadata. */
  toZip: (options?: ZipOptions) => Promise<ZipResult>;
  /** Revokes every frame's object/data URL and preloaded image, freeing memory. */
  dispose: () => void;
}
