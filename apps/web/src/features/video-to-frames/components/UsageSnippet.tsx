const SNIPPET = `import { videoToFrames } from "@workbench-tools/video-to-frames";

const result = await videoToFrames(file, {
  frameCount: 48,
  onProgress: (p) => console.log(p.stage, p.completed, "/", p.total),
});

// frames are already decoded — drop them straight into the DOM
result.frames.forEach((f) => gallery.appendChild(f.image));

const zip = await result.toZip({ filename: "my-frames" });
console.log(zip.fileCount, zip.formattedSize); // known before download()
zip.download();`;

export function UsageSnippet() {
  return (
    <div>
      <span className="eyebrow">Same engine, as code</span>
      <h3 className="text-display-sm mt-4 mb-3" style={{ fontSize: "1.75rem" }}>
        Everything above is one package
      </h3>
      <p className="lead mb-6">
        This page is a thin UI over{" "}
        <code>@workbench-tools/video-to-frames</code>, a standalone,
        browser-only npm package. Drop it into your own project for the
        same extraction, preloading, and zip-with-metadata behavior.
      </p>
      <pre>
        <code>{SNIPPET}</code>
      </pre>
    </div>
  );
}
