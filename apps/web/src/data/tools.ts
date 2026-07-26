import type { CategoryId } from "@/data/categories";

export interface ToolSpec {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: "live" | "in-progress";
  tags: string[];
  href: string;
  category: CategoryId;
  /** Shown in the homepage's showcase — one flagship tool per category. */
  featured?: boolean;
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
    category: "video",
    featured: true,
  },
  {
    slug: "gif-maker",
    name: "GIF Maker",
    tagline: "Turn a batch of images into a looping GIF.",
    description: "Order your frames, set the delay and loop count, and export an animated GIF.",
    status: "live",
    tags: ["images"],
    href: "/tools/gif-maker",
    category: "video",
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    tagline: "Batch-shrink images without a visible quality hit.",
    description: "Client-side batch compression with a live before/after size comparison.",
    status: "live",
    tags: ["images"],
    href: "/tools/image-compressor",
    category: "images",
    featured: true,
  },
  {
    slug: "sprite-sheet-packer",
    name: "Sprite Sheet Packer",
    tagline: "Pack images into one sheet plus a JSON manifest.",
    description: "For game dev and CSS sprite animations \u2014 pack multiple images into a grid with frame coordinates.",
    status: "live",
    tags: ["images", "zip"],
    href: "/tools/sprite-sheet-packer",
    category: "images",
  },
  {
    slug: "contact-sheet",
    name: "Contact Sheet",
    tagline: "Stitch a batch of images into one labeled grid.",
    description: "A shareable storyboard/contact sheet from a folder of images \u2014 one PNG out.",
    status: "live",
    tags: ["images"],
    href: "/tools/contact-sheet",
    category: "images",
  },
  {
    slug: "favicon-generator",
    name: "Favicon Generator",
    tagline: "One image in, every icon size out \u2014 zipped.",
    description: "Generates the full favicon/app-icon set from a single image, with a manifest and copy-paste HTML.",
    status: "live",
    tags: ["images", "zip"],
    href: "/tools/favicon-generator",
    category: "icons-graphics",
    featured: true,
  },
  {
    slug: "qr-code",
    name: "QR Code Generator",
    tagline: "Text or a link, straight to a downloadable QR code.",
    description: "Generates a QR code as PNG or SVG, with adjustable error correction and colors.",
    status: "live",
    tags: ["images", "dev"],
    href: "/tools/qr-code",
    category: "icons-graphics",
  },
  {
    slug: "grid-shapes",
    name: "Grid Shapes",
    tagline: "Paint a grid, get a smooth SVG shape back.",
    description: "Fill cells on a grid and get a single SVG path with every corner \u2014 outer and inner \u2014 rounded automatically.",
    status: "live",
    tags: ["design", "svg"],
    href: "/tools/grid-shapes",
    category: "design",
    featured: true,
  },
  {
    slug: "design-tokens",
    name: "Design Token Extractor",
    tagline: "Pull a color palette out of an image.",
    description: "Extracts the dominant colors from an image and exports them as CSS variables, Tailwind config, or JSON.",
    status: "live",
    tags: ["images", "design"],
    href: "/tools/design-tokens",
    category: "design",
  },
  {
    slug: "pdf-tools",
    name: "PDF Split & Merge",
    tagline: "Combine or break apart PDFs, entirely client-side.",
    description: "Merge multiple PDFs into one, or split pages out \u2014 no upload.",
    status: "live",
    tags: ["pdf", "zip"],
    href: "/tools/pdf-tools",
    category: "documents",
    featured: true,
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    tagline: "Format, minify, and validate JSON with a line/column pointer.",
    description: "Paste in JSON, format or minify it, and catch syntax errors instantly.",
    status: "live",
    tags: ["dev", "text"],
    href: "/tools/json-formatter",
    category: "developer",
    featured: true,
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    tagline: "Live match highlighting with capture groups broken out.",
    description: "Write a pattern, toggle flags, and see every match highlighted as you type.",
    status: "live",
    tags: ["dev", "text"],
    href: "/tools/regex-tester",
    category: "developer",
  },
  {
    slug: "dev-toolkit",
    name: "Dev Toolkit",
    tagline: "Base64, SHA hashing, and UUIDs in one place.",
    description: "Encode/decode Base64, hash text with SHA-1/256/384/512, and generate UUIDs.",
    status: "live",
    tags: ["dev", "text"],
    href: "/tools/dev-toolkit",
    category: "developer",
  },
  {
    slug: "base64-tool",
    name: "Base64 Encoder/Decoder",
    tagline: "Turn text into Base64 and back again.",
    description: "Encode any text to Base64 or decode it back to readable text in a browser-native workflow.",
    status: "live",
    tags: ["dev", "encoding"],
    href: "/tools/base64-tool",
    category: "developer",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    tagline: "Generate a batch of RFC 4122 UUIDs instantly.",
    description: "Create any number of browser-native UUIDs and copy the full batch in one go.",
    status: "live",
    tags: ["dev", "identifiers"],
    href: "/tools/uuid-generator",
    category: "developer",
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    tagline: "Convert between Unix time and human-readable dates.",
    description: "Translate local dates, UTC strings, Unix seconds, and Unix milliseconds in both directions.",
    status: "live",
    tags: ["dev", "time"],
    href: "/tools/timestamp-converter",
    category: "developer",
  },
  {
    slug: "color-contrast-checker",
    name: "Color Contrast Checker",
    tagline: "Check accessible color pairs at a glance.",
    description: "Measure contrast ratios, preview foreground and background pairs, and see WCAG pass/fail results instantly.",
    status: "live",
    tags: ["design", "accessibility"],
    href: "/tools/color-contrast-checker",
    category: "design",
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    tagline: "Find a percentage, add it, or subtract it.",
    description: "Calculate percentage values, increases, and decreases with a clean numeric workflow.",
    status: "live",
    tags: ["math", "calculators"],
    href: "/tools/percentage-calculator",
    category: "calculators",
  },
  {
    slug: "date-difference-calculator",
    name: "Date Difference Calculator",
    tagline: "Measure the gap between two dates.",
    description: "Compare two timestamps and see the difference in days, hours, minutes, and seconds.",
    status: "live",
    tags: ["calculators", "time"],
    href: "/tools/date-difference-calculator",
    category: "calculators",
  },
  {
    slug: "text-shuffler",
    name: "Text Shuffler",
    tagline: "Split on any delimiter, shuffle, rejoin.",
    description: "Pick a delimiter, split your text into pieces, shuffle them, and rejoin into a new order.",
    status: "live",
    tags: ["text"],
    href: "/tools/text-shuffler",
    category: "text",
    featured: true,
  },
  {
    slug: "slug-generator",
    name: "Slug Generator",
    tagline: "Turn headings into clean URL slugs.",
    description: "Convert titles and headings into lowercase, URL-safe slugs with hyphens and no punctuation.",
    status: "live",
    tags: ["text", "seo"],
    href: "/tools/slug-generator",
    category: "text",
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    tagline: "Count words, characters, lines, and reading time.",
    description: "Analyze a block of text with live counts for words, characters, lines, paragraphs, and reading time.",
    status: "live",
    tags: ["text", "reading"],
    href: "/tools/word-counter",
    category: "text",
  },
];

export function getTool(slug: string): ToolSpec | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function toolsByCategory(id: CategoryId): ToolSpec[] {
  return tools.filter((tool) => tool.category === id);
}

export const liveTools = tools.filter((tool) => tool.status === "live");
export const featuredTools = tools.filter((tool) => tool.featured);
