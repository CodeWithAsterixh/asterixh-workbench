export interface ToolSpec {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: "live" | "in-progress";
  tags: string[];
  href: string;
}

export const tools: ToolSpec[] = [
  {
    slug: "video-to-frames",
    name: "Video \u2192 Frames",
    tagline: "Slice any video into a numbered, zip-ready frame sequence.",
    description:
      "Drop in a video, pick a frame count, and get back a preloaded set of frames \u2014 trimmed, sized, and ready to compile into a single .zip. Runs entirely in your browser; nothing is uploaded.",
    status: "live",
    tags: ["video", "images", "zip"],
    href: "/tools/video-to-frames",
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    tagline: "Batch-shrink images without a visible quality hit.",
    description: "Client-side batch compression with a live before/after size comparison.",
    status: "in-progress",
    tags: ["images"],
    href: "#",
  },
  {
    slug: "gif-maker",
    name: "GIF Maker",
    tagline: "Turn a clip or an image sequence into a looping GIF.",
    description: "Built on the same frame-extraction engine as Video \u2192 Frames.",
    status: "in-progress",
    tags: ["video", "images"],
    href: "#",
  },
];

export function getTool(slug: string): ToolSpec | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export const liveTools = tools.filter((tool) => tool.status === "live");
