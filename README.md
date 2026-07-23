# Workbench

A home for small, sharp browser tools. First one on the bench: **Video →
Frames**, which slices a video into a preloaded, zip-ready frame sequence
entirely client-side.

This is a fresh project — the only things carried over from the old
prototype are the scroll/animation primitives and the video-to-frames
extraction logic, both rebuilt into the structure below.

## Structure

This is a pnpm workspace with two packages:

```
workbench/
├── apps/
│   └── web/                        Next.js 16 site (App Router, TS, Tailwind v4)
│       ├── src/app/                Routes: / , /tools , /tools/video-to-frames
│       ├── src/components/         Header, Footer, ToolCard (site chrome)
│       ├── src/features/
│       │   └── video-to-frames/    This tool's UI: components/ + lib/
│       ├── src/lib/animations/     Scroll/motion primitives (Reveal, StickyScroll,
│       │                           ScrollFrameStory, SpinViewer, CursorFollower, …)
│       ├── src/data/               tools.ts (tool registry), process-frames.ts
│       └── public/tools/video-to-frames/   Per-tool static assets (sample clip)
│
└── packages/
    └── video-to-frames/            @workbench-tools/video-to-frames — standalone
                                     npm package with the same extraction engine
```

Every tool gets this same three-part shape: a route under `app/tools/<slug>`,
a feature folder under `src/features/<slug>` (components + lib), and — where
it makes sense to reuse outside this site — a standalone package under
`packages/<slug>`.

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
  what shows up on `/` and `/tools`. Add an entry there (and a route +
  feature folder) to add a new tool.

## The tool: Video → Frames

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
`Blob` + object URL.
