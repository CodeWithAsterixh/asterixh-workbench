# Workbench

A home for small, sharp browser tools — thirteen of them, so far. Every one
runs entirely client-side: nothing you feed them is uploaded anywhere.

| Tool | What it does |
| --- | --- |
| Video →Frames | Video →preloaded, zip-ready frame sequence |
| Image Compressor | Batch recompress with live before/after size |
| Favicon Generator | One image →full icon set + manifest, zipped |
| Sprite Sheet Packer | Images →one packed sheet + JSON manifest |
| Contact Sheet | Images →one labeled grid PNG |
| Design Token Extractor | Image →dominant palette →CSS/Tailwind/JSON |
| GIF Maker | Images →looping animated GIF |
| PDF Split & Merge | Merge PDFs or split one into pages |
| QR Code Generator | Text/URL →downloadable PNG or SVG |
| JSON Formatter | Format, minify, validate with line/column errors |
| Regex Tester | Live match highlighting + capture groups |
| Dev Toolkit | Base64, SHA hashing, UUIDs |
| Text Shuffler | Split text on any delimiter, shuffle, rejoin |

This is a fresh project — the only things carried over from the old
prototype were the scroll/animation primitives and the video-to-frames
extraction logic, both rebuilt into the structure below.

## Structure

This is a pnpm workspace with two packages:

```
workbench/
├── apps/
│   └── web/                        Next.js 16 site (App Router, TS, Tailwind v4)
│       ├── src/app/tools/          One route per tool (see table above)
│       ├── src/components/         Header, Footer, ToolCard, ToolPageShell (site chrome)
│       ├── src/components/tool-ui/ Shared building blocks: FileDropzone, ProgressBar,
│       │                           ZipDownloadCard — used by most of the newer tools
│       ├── src/features/<slug>/    Each tool's UI: components/ + lib/
│       ├── src/lib/animations/     Scroll/motion primitives (Reveal, StickyScroll,
│       │                           ScrollFrameStory, SpinViewer, CursorFollower, …)
│       ├── src/lib/browser-zip.ts  Shared client-side zip compiler (fflate)
│       ├── src/lib/canvas-utils.ts Shared image-loading/canvas helpers
│       ├── src/data/               tools.ts (tool registry), process-frames.ts
│       └── public/tools/<slug>/    Per-tool static assets (e.g. the sample clip)
│
└── packages/
    └── video-to-frames/            @workbench-tools/video-to-frames — standalone
                                     npm package with the video tool's extraction engine
```

Every tool gets this same three-part shape: a route under `app/tools/<slug>`
using the shared `ToolPageShell`, a feature folder under `src/features/<slug>`
(components + lib), and — where it makes sense to reuse outside this site — a
standalone package under `packages/<slug>` (so far, just video-to-frames).

## Getting started

```bash
pnpm install
pnpm dev          # runs apps/web on localhost:3000
```

Other scripts:

```bash
pnpm build            # builds the package, then the site
pnpm build:package    # builds just @workbench-tools/video-to-frames
pnpm typecheck         # tsc --noEmit across every workspace package
pnpm lint              # eslint for apps/web
```

## The site

- **Design system** — two token-driven themes sharing one semantic
  vocabulary (`--surface`, `--text-primary`, `--accent`, …): a dark "shell"
  for marketing/discovery pages, and a light "paper" workspace scoped to a
  tool's own page. See `apps/web/src/app/tokens-*.css`.
- **Motion** — `src/lib/animations` holds the reusable primitives: `Reveal`
  (scroll-triggered fade/slide), `Parallax`/`useParallax`, `StickyScroll` /
  `StickyCard` (pinned-while-scrolled layouts), `ZoomScroll`, `ScrollFrameStory`
  (the homepage's signature effect — scrubs a frame sequence and chapter
  copy off one scroll value), `SpinViewer` (drag-to-rotate frame viewer),
  `ScrollProgressBar`, `SplitHeading`, `CursorFollower`, `AnimatedCounter`,
  and `MagneticButton`/`useMagnetic`.
- **Tool registry** — `src/data/tools.ts` is the single source of truth for
  what shows up on `/` and `/tools`. Add an entry there (plus a route +
  feature folder) to add a new tool.
- **Shared tool infrastructure** — most tools beyond the first lean on three
  things so they don't reinvent the same UI: `components/tool-ui/FileDropzone`,
  `components/tool-ui/ZipDownloadCard`, and `lib/browser-zip.ts` (the same
  "prepare everything, then hand back a sized, downloadable result" shape
  used throughout).

## The flagship tool: Video → Frames

- **UI**: `apps/web/src/features/video-to-frames` — a drop zone, frame
  count/trim/format controls, a live progress bar through extraction's
  three stages, a preview grid of preloaded frames, and a zip step that
  shows file count + exact size *before* the download starts.
- **Engine**: `packages/video-to-frames` — the actual browser-side
  extraction + zip-compilation logic, published as a standalone,
  framework-agnostic npm package. The web app depends on it via the
  workspace (`workspace:*`); anyone else can `npm install
  @workbench-tools/video-to-frames` directly. Full API docs live in that
  package's own README.

```ts
import { videoToFrames } from "@workbench-tools/video-to-frames";

const result = await videoToFrames(file, { frameCount: 48 });
const zip = await result.toZip({ filename: "my-frames" });
console.log(zip.fileCount, zip.formattedSize); // known before download()
zip.download();
```

Nothing here touches a server: extraction runs against a hidden
`<video>` + `<canvas>`, and the zip is compiled in-memory with
[fflate](https://github.com/101arrowz/fflate) and handed back as a
`Blob` + object URL. The other eleven tools follow the same rule — canvas,
Web Crypto, [pdf-lib](https://github.com/Hopding/pdf-lib),
[gifenc](https://github.com/mattdesl/gifenc), and
[qrcode](https://github.com/soldair/node-qrcode) all run client-side too.

