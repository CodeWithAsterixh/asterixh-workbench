export const FRAME_COUNT_MIN = 4;
export const FRAME_COUNT_MAX = 240;
export const FRAME_COUNT_DEFAULT = 48;

export const FORMAT_OPTIONS = [
  { value: "image/jpeg", label: "JPEG", extension: "jpg" },
  { value: "image/png", label: "PNG", extension: "png" },
  { value: "image/webp", label: "WebP", extension: "webp" },
] as const;

export const MAX_UPLOAD_BYTES = 500 * 1024 * 1024; // 500 MB — a practical browser-memory ceiling

export const SAMPLE_VIDEO_URL = "/tools/video-to-frames/sample.mp4";
export const SAMPLE_VIDEO_LABEL = "Sample clip (generative test pattern, ~1.3 MB)";
