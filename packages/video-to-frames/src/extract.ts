import type { ExtractedFrame, FrameExtractionOptions, VideoInfo } from "./types";

function assertBrowser() {
  if (typeof document === "undefined") {
    throw new Error(
      "@workbench-tools/video-to-frames is browser-only (it needs <video>/<canvas>). " +
        "It can't run during a server render or in a Node process.",
    );
  }
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException("Frame extraction was aborted.", "AbortError");
  }
}

function seekTo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      resolve();
    };
    const onError = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      reject(new Error(`Failed to seek video to ${time.toFixed(2)}s.`));
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.currentTime = time;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas failed to encode this frame."))),
      type,
      quality,
    );
  });
}

async function preloadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = src;
  if (typeof img.decode === "function") {
    try {
      await img.decode();
      return img;
    } catch {
      // Some browsers throw on decode() for certain object URLs even though
      // the image is perfectly loadable — fall back to the load event below.
    }
  }
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to preload a frame image."));
  });
  return img;
}

function computeDimensions(
  sourceWidth: number,
  sourceHeight: number,
  maxWidth?: number,
  maxHeight?: number,
): { width: number; height: number } {
  let scale = 1;
  if (maxWidth) scale = Math.min(scale, maxWidth / sourceWidth);
  if (maxHeight) scale = Math.min(scale, maxHeight / sourceHeight);
  if (scale >= 1) return { width: sourceWidth, height: sourceHeight };
  return {
    width: Math.max(1, Math.round(sourceWidth * scale)),
    height: Math.max(1, Math.round(sourceHeight * scale)),
  };
}

/**
 * Extracts an evenly-spaced sequence of frames from a video, running
 * entirely in the browser via a hidden <video> + <canvas>. The source
 * video never leaves the machine unless `source` is itself a remote URL.
 */
export async function extractFrames(
  source: File | Blob | string,
  options: FrameExtractionOptions,
): Promise<{ frames: ExtractedFrame[]; video: VideoInfo }> {
  assertBrowser();

  const {
    frameCount,
    trimStart = 0,
    trimEnd = 0,
    mimeType = "image/jpeg",
    quality = 0.9,
    maxWidth,
    maxHeight,
    preload = true,
    onProgress,
    signal,
  } = options;

  if (!Number.isFinite(frameCount) || frameCount < 1) {
    throw new Error("frameCount must be at least 1.");
  }
  if (trimStart < 0 || trimStart >= 1 || trimEnd < 0 || trimEnd >= 1) {
    throw new Error("trimStart and trimEnd must each be within [0, 1).");
  }

  const isObjectSource = typeof source !== "string";
  const sourceUrl = isObjectSource ? URL.createObjectURL(source) : source;

  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  if (!isObjectSource) video.crossOrigin = "anonymous"; // only relevant for remote URLs
  video.src = sourceUrl;

  try {
    throwIfAborted(signal);

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () =>
        reject(new Error("Failed to load the video — check that the format is supported."));
    });
    onProgress?.({ stage: "loading-video", completed: 1, total: 1 });

    const duration = video.duration;
    if (!isFinite(duration) || duration <= 0) {
      throw new Error("Video has no readable duration.");
    }

    const { width, height } = computeDimensions(
      video.videoWidth,
      video.videoHeight,
      maxWidth,
      maxHeight,
    );

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context is unavailable in this browser.");

    const usableStart = duration * trimStart;
    // Small safety margin off the literal end timestamp — seeking to the
    // exact last frame is flaky (sometimes black) in some browsers.
    const usableEnd = Math.max(usableStart, duration * (1 - trimEnd) - 0.05);
    const usableDuration = usableEnd - usableStart;

    const frames: ExtractedFrame[] = [];

    for (let i = 0; i < frameCount; i++) {
      throwIfAborted(signal);

      const t =
        frameCount === 1 ? usableStart : usableStart + (usableDuration * i) / (frameCount - 1);

      await seekTo(video, t);
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(video, 0, 0, width, height);

      const blob = await canvasToBlob(canvas, mimeType, quality);
      const dataUrl = URL.createObjectURL(blob);

      frames.push({
        index: i,
        dataUrl,
        blob,
        width,
        height,
        sizeBytes: blob.size,
        timestampSeconds: t,
      });

      onProgress?.({ stage: "extracting", completed: i + 1, total: frameCount });
    }

    if (preload) {
      for (let i = 0; i < frames.length; i++) {
        throwIfAborted(signal);
        const frame = frames[i]!;
        frame.image = await preloadImage(frame.dataUrl);
        onProgress?.({ stage: "preloading", completed: i + 1, total: frames.length });
      }
    }

    onProgress?.({ stage: "done", completed: frameCount, total: frameCount });

    return { frames, video: { width: video.videoWidth, height: video.videoHeight, duration } };
  } finally {
    if (isObjectSource) URL.revokeObjectURL(sourceUrl);
  }
}

/** Revokes every frame's object URL. Call once the frames (and any zip built from them) are no longer needed. */
export function disposeFrames(frames: ExtractedFrame[]): void {
  for (const frame of frames) {
    URL.revokeObjectURL(frame.dataUrl);
  }
}
