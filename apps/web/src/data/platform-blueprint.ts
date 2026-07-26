export const launchPrinciples = [
  {
    title: "Fast loading",
    body: "Core content should land quickly, with lightweight pages, static rendering where possible, and no extra work before the user can start.",
  },
  {
    title: "Privacy first",
    body: "Browser processing should be the default for sensitive inputs so users do not need to trust a server just to get a useful result.",
  },
  {
    title: "No login required",
    body: "The platform should be usable immediately, with no account wall, no paywall, and no artificial friction in the first phase.",
  },
  {
    title: "Mobile friendly",
    body: "Every layout should remain usable on a small screen, even when the desktop version includes richer navigation or side panels.",
  },
  {
    title: "Accessible by default",
    body: "Keyboard navigation, screen reader support, visible focus, and reduced motion should be treated as baseline requirements.",
  },
  {
    title: "Reusable architecture",
    body: "Every tool should sit on the same manifest, worker, documentation, and SEO model so the site can scale without becoming fragile.",
  },
];

export const architectureLayers = [
  {
    title: "Browser processing engine",
    body: "CPU-heavy work should run off the main thread with workers, chunked processing, cancellation, and progress updates.",
  },
  {
    title: "Tool manifest",
    body: "Each tool should define its metadata, inputs, outputs, categories, schema, docs, and related links through one shared contract.",
  },
  {
    title: "Content engine",
    body: "Tool pages and support articles should be generated from structured content so one tool can become many discoverable pages.",
  },
  {
    title: "SEO and linking layer",
    body: "Titles, descriptions, canonical URLs, schema, and internal links should be designed before a tool ships, not patched in later.",
  },
];

export const targetCategoryClusters = [
  { name: "Developer", target: "80-100 tools", examples: "JSON, encoding, hashing, identifiers, JWT, networking" },
  { name: "CSS", target: "40-50 tools", examples: "Layout builders, gradients, filters, animation generators" },
  { name: "Tailwind CSS", target: "50+ tools", examples: "Themes, palettes, component generators, responsive builders" },
  { name: "Next.js", target: "40+ tools", examples: "Boilerplates, route helpers, config builders, auth templates" },
  { name: "Design", target: "40-50 tools", examples: "Palettes, SVG tools, tokens, theme previews" },
  { name: "Images", target: "60+ tools", examples: "Compress, resize, crop, convert, sprite sheets, favicon flows" },
  { name: "PDF", target: "40 tools", examples: "Merge, split, compress, rotate, OCR, extract pages" },
  { name: "Video", target: "30 tools", examples: "Frames, GIFs, trim, crop, convert, extract audio" },
  { name: "Audio", target: "25 tools", examples: "Trim, convert, boost, split, join, noise reduction" },
  { name: "Text", target: "40 tools", examples: "Word counts, markdown, slugging, diffs, line cleanup" },
  { name: "Calculators", target: "60+ tools", examples: "Tax, loan, BMI, time, currency, percentages, conversion" },
];

export const roadmapPhases = [
  {
    name: "Phase 1 - Audience growth",
    summary: "Build trust, search visibility, and repeat usage before adding monetization.",
    points: [
      "No login requirement.",
      "No ads by default.",
      "No usage limits.",
      "No watermarks or artificial delays.",
      "Strong internal linking and supporting articles.",
    ],
  },
  {
    name: "Phase 2 - Platform expansion",
    summary: "Turn each category into a linked cluster of tools, guides, and examples.",
    points: [
      "Reuse the same page shell for every tool.",
      "Generate support articles from structured content.",
      "Add worker pools for heavier workloads.",
      "Keep the interface responsive during large jobs.",
    ],
  },
  {
    name: "Phase 3 - Monetization readiness",
    summary: "Reserve placements now so revenue can turn on later without a redesign.",
    points: [
      "Lazy-load ad slots and sponsored placements.",
      "Keep core tool execution ahead of monetization scripts.",
      "Use affiliate, premium export, and template hooks only when the audience is ready.",
    ],
  },
];

