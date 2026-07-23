# @workbench-tools/video-to-frames

Turn a video into a preloaded sequence of frame images — entirely in the
browser, no server, no upload. Compile the result into a `.zip` with the
size known before the download starts.

This is the same engine behind the **Video → Frames** tool on
[Workbench](../../apps/web), extracted as a standalone, framework-agnostic
package so it can be dropped into any browser project.

> **Browser-only.** This package needs `<video>`, `<canvas>`, and `Blob` —
> it does not run in Node or during a server render (e.g. Next.js Server
> Components). Call it from client-side code only.

## Install

```bash
npm install @workbench-tools/video-to-frames
```

## Quick start

```ts
import { videoToFrames } from "@workbench-tools/video-to-frames";

const input = document.querySelector("input[type=file]") as HTMLInputElement;
const file = input.files![0];

const result = await videoToFrames(file, {
  frameCount: 48,
  trimStart: 0.02,
  trimEnd: 0.02,
  mimeType: "image/jpeg",
  quality: 0.9,
  onProgress: (p) => console.log(`${p.stage}: ${p.completed}/${p.total}`),
});

// Every frame is already decoded and ready to render — no flash, no
// lazy-load stutter.
for (const frame of result.frames) {
  document.getElementById("gallery")!.appendChild(frame.image!);
}

console.log(result.totalSizeBytes); // known immediately, before any zip exists

// Compile to a zip whenever you're ready. Metadata (file count, exact
// zip size, a formatted string) is all resolved before download() fires.
const zip = await result.toZip({
  filename: "product-spin",
  onProgress: (p) => console.log(`zip ${p.stage}: ${p.completed}/${p.total}`),
});

console.log(zip.fileCount, zip.formattedSize); // "48  8.4 MB"
zip.download();

// Clean up when you're done with the frames/zip in memory.
zip.revoke();
result.dispose();
```

You can also pass a remote video URL instead of a `File`:

```ts
const result = await videoToFrames("https://example.com/clip.mp4", {
  frameCount: 24,
});
```

(The source video must allow CORS if it's cross-origin — the browser's
canvas will otherwise refuse to read pixel data from it.)

## API

### `videoToFrames(source, options): Promise<VideoToFramesResult>`

The one-call API described above.

| Option        | Type                                              | Default       | Notes                                             |
| ------------- | -------------------------------------------------- | ------------- | -------------------------------------------------- |
| `frameCount`  | `number`                                          | —             | Required. Evenly spaced across the usable range.  |
| `trimStart`   | `number` (0–1)                                    | `0`           | Skip this fraction at the start.                  |
| `trimEnd`     | `number` (0–1)                                    | `0`           | Skip this fraction at the end.                    |
| `mimeType`    | `"image/jpeg" \| "image/png" \| "image/webp"`     | `"image/jpeg"`| Applies to every frame.                           |
| `quality`     | `number` (0–1)                                    | `0.9`         | jpeg/webp only.                                   |
| `maxWidth`    | `number`                                          | —             | Downscales, preserving aspect ratio.              |
| `maxHeight`   | `number`                                          | —             | Downscales, preserving aspect ratio.              |
| `preload`     | `boolean`                                         | `true`        | Decode each frame into an `HTMLImageElement` up front. |
| `onProgress`  | `(progress: ExtractionProgress) => void`          | —             | Fires per stage transition and per frame.         |
| `signal`      | `AbortSignal`                                     | —             | Cancels extraction between frames.                |

`VideoToFramesResult`:

- `frames: ExtractedFrame[]` — `{ index, dataUrl, blob, width, height, sizeBytes, timestampSeconds, image? }`
- `video: { width, height, duration }`
- `totalSizeBytes: number`
- `toZip(options?): Promise<ZipResult>`
- `dispose(): void`

### `toZip(options?): Promise<ZipResult>`

| Option              | Type                                     | Default     |
| ------------------- | ----------------------------------------- | ----------- |
| `filename`          | `string`                                  | `"frames"`  |
| `compressionLevel`  | `number` (0–9)                            | `6`         |
| `padIndex`          | `boolean`                                 | `true`      |
| `onProgress`        | `(progress: ZipProgress) => void`         | —           |

`ZipResult` extends the metadata (`fileCount`, `uncompressedBytes`,
`zipSizeBytes`, `formattedSize`, `mimeType`, `filename`, `createdAt`) with:

- `blob: Blob`
- `url: string` — object URL, valid until `revoke()`
- `download(): void`
- `revoke(): void`

### Lower-level exports

If you don't want the combined `videoToFrames()` wrapper:

- `extractFrames(source, options)` — just the extraction, returns `{ frames, video }`
- `compileFramesToZip(frames, options)` — zip an existing frame array
- `downloadFrame(frame, filenamePrefix?)` / `downloadAllFramesSequentially(frames, filenamePrefix?, delayMs?)`
- `disposeFrames(frames)`
- `formatBytes(bytes)`

## Why a zip, and why the metadata comes first

Firing off one download per frame gets throttled or blocked by most
browsers past a handful of files, and it leaves the person with a folder
of loose images to clean up. `toZip()` builds one archive, and resolves
its exact size and file count *before* handing back `download()` — so a
UI can show "48 frames · 8.4 MB · .zip" and let someone decide, rather
than starting a save dialog blind.

## License

MIT
