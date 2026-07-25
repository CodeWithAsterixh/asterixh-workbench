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
    name: "Video →Frames",
    tagline: "Slice any video into a numbered, zip-ready frame sequence.",
    description:
      "Drop in a video, pick a frame count, and get back a preloaded set of frames — trimmed, sized, and ready to compile into a single .zip. Runs entirely in your browser; nothing is uploaded.",
    status: "live",
    tags: ["video", "images", "zip"],
    href: "/tools/video-to-frames",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    tagline: "Format, minify, and validate JSON with a line/column pointer.",
    description: "Paste in JSON, format or minify it, and catch syntax errors instantly.",
    status: "live",
    tags: ["dev", "text"],
    href: "/tools/json-formatter",
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    tagline: "Live match highlighting with capture groups broken out.",
    description: "Write a pattern, toggle flags, and see every match highlighted as you type.",
    status: "live",
    tags: ["dev", "text"],
    href: "/tools/regex-tester",
  },
  {
    slug: "dev-toolkit",
    name: "Dev Toolkit",
    tagline: "Base64, SHA hashing, and UUIDs in one place.",
    description: "Encode/decode Base64, hash text with SHA-1/256/384/512, and generate UUIDs.",
    status: "live",
    tags: ["dev", "text"],
    href: "/tools/dev-toolkit",
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    tagline: "Batch-shrink images without a visible quality hit.",
    description: "Client-side batch compression with a live before/after size comparison.",
    status: "live",
    tags: ["images"],
    href: "/tools/image-compressor",
  },
  {
    slug: "favicon-generator",
    name: "Favicon Generator",
    tagline: "One image in, every icon size out — zipped.",
    description: "Generates the full favicon/app-icon set from a single image, with a manifest and copy-paste HTML.",
    status: "live",
    tags: ["images", "zip"],
    href: "/tools/favicon-generator",
  },
  {
    slug: "sprite-sheet-packer",
    name: "Sprite Sheet Packer",
    tagline: "Pack images into one sheet plus a JSON manifest.",
    description: "For game dev and CSS sprite animations — pack multiple images into a grid with frame coordinates.",
    status: "live",
    tags: ["images", "zip"],
    href: "/tools/sprite-sheet-packer",
  },
  {
    slug: "contact-sheet",
    name: "Contact Sheet",
    tagline: "Stitch a batch of images into one labeled grid.",
    description: "A shareable storyboard/contact sheet from a folder of images — one PNG out.",
    status: "live",
    tags: ["images"],
    href: "/tools/contact-sheet",
  },
  {
    slug: "design-tokens",
    name: "Design Token Extractor",
    tagline: "Pull a color palette out of an image.",
    description: "Extracts the dominant colors from an image and exports them as CSS variables, Tailwind config, or JSON.",
    status: "live",
    tags: ["images", "design"],
    href: "/tools/design-tokens",
  },
  {
    slug: "pdf-tools",
    name: "PDF Split & Merge",
    tagline: "Combine or break apart PDFs, entirely client-side.",
    description: "Merge multiple PDFs into one, or split pages out — no upload.",
    status: "live",
    tags: ["pdf", "zip"],
    href: "/tools/pdf-tools",
  },
  {
    slug: "gif-maker",
    name: "GIF Maker",
    tagline: "Turn a batch of images into a looping GIF.",
    description: "Order your frames, set the delay and loop count, and export an animated GIF.",
    status: "live",
    tags: ["images"],
    href: "/tools/gif-maker",
  },
  {
    slug: "qr-code",
    name: "QR Code Generator",
    tagline: "Text or a link, straight to a downloadable QR code.",
    description: "Generates a QR code as PNG or SVG, with adjustable error correction and colors.",
    status: "live",
    tags: ["images", "dev"],
    href: "/tools/qr-code",
  },
  {
    slug: "text-shuffler",
    name: "Text Shuffler",
    tagline: "Split on any delimiter, shuffle, rejoin.",
    description: "Pick a delimiter, split your text into pieces, shuffle them, and rejoin into a new order.",
    status: "live",
    tags: ["text"],
    href: "/tools/text-shuffler",
  },
];

export function getTool(slug: string): ToolSpec | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export const liveTools = tools.filter((tool) => tool.status === "live");
