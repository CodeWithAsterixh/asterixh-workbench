"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Scissors, ScanSearch, Sparkles, MoveHorizontal, MoveVertical, Images, Crop, FlipHorizontal2, ArrowUpDown, RefreshCcw, Minimize2, Palette } from "lucide-react";
import { FileDropzone } from "@/components/tool-ui/FileDropzone";
import { ZipDownloadCard } from "@/components/tool-ui/ZipDownloadCard";
import { Reveal } from "@/lib/animations";
import { compileToZip, type CompiledZip } from "@/lib/browser-zip";
import { formatBytes } from "@workbench-tools/video-to-frames";
import { runImageWorkbench, type ImageMimeType, type ImageMode, type ProcessedImage } from "../lib/image-workbench";

interface ImageWorkbenchToolProps {
  mode: ImageMode;
  title: string;
  summary: string;
  acceptMultiple?: boolean;
  formatLabel?: string;
}

const MODE_LABEL: Record<ImageMode, string> = {
  resize: "Resize",
  crop: "Crop",
  rotate: "Rotate",
  flip: "Flip",
  blur: "Blur",
  sharpen: "Sharpen",
  convert: "Convert",
  "background-removal": "Background cutout",
  split: "Split",
  merge: "Merge",
  collage: "Collage",
};

const FORMAT_OPTIONS: { value: ImageMimeType; label: string }[] = [
  { value: "image/webp", label: "WebP" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
];

function ToolIcon({ mode }: { mode: ImageMode }) {
  switch (mode) {
    case "crop":
      return <Crop size={16} strokeWidth={1.75} />;
    case "rotate":
      return <ArrowUpDown size={16} strokeWidth={1.75} />;
    case "flip":
      return <FlipHorizontal2 size={16} strokeWidth={1.75} />;
    case "blur":
      return <ScanSearch size={16} strokeWidth={1.75} />;
    case "sharpen":
      return <Sparkles size={16} strokeWidth={1.75} />;
    case "convert":
      return <RefreshCcw size={16} strokeWidth={1.75} />;
    case "background-removal":
      return <Palette size={16} strokeWidth={1.75} />;
    case "split":
      return <Scissors size={16} strokeWidth={1.75} />;
    case "merge":
    case "collage":
      return <Images size={16} strokeWidth={1.75} />;
    case "resize":
    default:
      return <MoveHorizontal size={16} strokeWidth={1.75} />;
  }
}

export function ImageWorkbenchTool({ mode, title, summary, acceptMultiple = true, formatLabel = "Export format" }: ImageWorkbenchToolProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [status, setStatus] = useState<"idle" | "working" | "ready" | "zipping">("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
  const [zipResult, setZipResult] = useState<CompiledZip | null>(null);
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(1280);
  const [angle, setAngle] = useState(90);
  const [blur, setBlur] = useState(10);
  const [quality, setQuality] = useState(0.84);
  const [format, setFormat] = useState<ImageMimeType>("image/webp");
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [tolerance, setTolerance] = useState(72);
  const [background, setBackground] = useState("#ffffff");
  const [flipHorizontal, setFlipHorizontal] = useState(true);
  const [flipVertical, setFlipVertical] = useState(false);

  const isBusy = status === "working" || status === "zipping";
  const multiFile = acceptMultiple || mode === "merge" || mode === "collage" || mode === "split";

  const options = useMemo(
    () => ({ width, height, angle, blur, quality, format, rows, cols, tolerance, background, flipHorizontal, flipVertical }),
    [angle, background, blur, cols, flipHorizontal, flipVertical, format, height, quality, rows, tolerance, width, mode],
  );

  const handleRun = async () => {
    if (files.length === 0) return;
    setStatus("working");
    setError(null);
    setZipResult(null);
    setProgress({ completed: 0, total: files.length });

    try {
      const result = await runImageWorkbench(files, mode, options);
      setResults(result.items);
      setStatus("ready");
      setProgress({ completed: files.length, total: files.length });
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Couldn't process those images.");
    }
  };

  const handleCompileZip = async () => {
    if (results.length === 0) return;
    setStatus("zipping");
    try {
      const filesForZip = await Promise.all(
        results.map(async (item) => ({ name: item.name, data: new Uint8Array(await item.blob.arrayBuffer()) })),
      );
      const zip = await compileToZip(filesForZip);
      setZipResult(zip);
      setStatus("ready");
    } catch (err) {
      setStatus("ready");
      setError(err instanceof Error ? err.message : "Couldn't build the zip.");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setError(null);
    setProgress(null);
    zipResult?.revoke();
    setZipResult(null);
    setStatus("idle");
  };

  const totalBytes = results.reduce((sum, item) => sum + item.blob.size, 0);
  const singleResult = results.length === 1 ? results[0] : null;

  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] items-start">
          <div className="card flex flex-col gap-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="eyebrow">{MODE_LABEL[mode]}</p>
                <h2 className="text-lg text-[var(--text-primary)] mt-2">{title}</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2">{summary}</p>
              </div>
              <span className="badge">{results.length > 0 ? `${results.length} output${results.length === 1 ? "" : "s"}` : "Fast browser canvas"}</span>
            </div>

            <FileDropzone
              accept="image/*"
              multiple={multiFile}
              onFiles={setFiles}
              disabled={isBusy}
              title={multiFile ? "Drop image files, or click to browse" : "Drop an image, or click to browse"}
              hint={files.length > 0 ? `${files.length} selected` : "PNG, JPEG, or WebP files work best"}
            />

            <div className="grid gap-5 md:grid-cols-2">
              {(mode === "resize" || mode === "crop" || mode === "blur") && (
                <>
                  <div>
                    <label className="timecode">Width</label>
                    <input type="number" min={1} value={width} onChange={(e) => setWidth(Number(e.target.value) || 1)} className="field mt-2" disabled={isBusy} />
                  </div>
                  <div>
                    <label className="timecode">Height</label>
                    <input type="number" min={1} value={height} onChange={(e) => setHeight(Number(e.target.value) || 1)} className="field mt-2" disabled={isBusy} />
                  </div>
                </>
              )}

              {mode === "rotate" && (
                <div className="md:col-span-2">
                  <label className="timecode">Angle</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input type="range" min={-180} max={180} step={1} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-[var(--accent)]" disabled={isBusy} />
                    <span className="timecode w-12 text-right">{angle}°</span>
                  </div>
                </div>
              )}

              {mode === "blur" && (
                <div className="md:col-span-2">
                  <label className="timecode">Blur strength</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input type="range" min={0} max={48} step={1} value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-[var(--accent)]" disabled={isBusy} />
                    <span className="timecode w-12 text-right">{blur}px</span>
                  </div>
                </div>
              )}

              {mode === "background-removal" && (
                <>
                  <div>
                    <label className="timecode">Background color</label>
                    <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="field mt-2 h-11 p-2" disabled={isBusy} />
                  </div>
                  <div>
                    <label className="timecode">Tolerance</label>
                    <div className="flex items-center gap-3 mt-2">
                      <input type="range" min={0} max={220} step={1} value={tolerance} onChange={(e) => setTolerance(Number(e.target.value))} className="w-full accent-[var(--accent)]" disabled={isBusy} />
                      <span className="timecode w-12 text-right">{tolerance}</span>
                    </div>
                  </div>
                </>
              )}

              {(mode === "split" || mode === "merge" || mode === "collage") && (
                <>
                  <div>
                    <label className="timecode">Columns</label>
                    <input type="number" min={1} value={cols} onChange={(e) => setCols(Number(e.target.value) || 1)} className="field mt-2" disabled={isBusy} />
                  </div>
                  <div>
                    <label className="timecode">Rows</label>
                    <input type="number" min={1} value={rows} onChange={(e) => setRows(Number(e.target.value) || 1)} className="field mt-2" disabled={isBusy} />
                  </div>
                </>
              )}

              {(mode === "convert" || mode === "resize" || mode === "blur" || mode === "background-removal" || mode === "merge" || mode === "collage") && (
                <div>
                  <label className="timecode">{formatLabel}</label>
                  <select value={format} onChange={(e) => setFormat(e.target.value as ImageMimeType)} className="field mt-2" disabled={isBusy || mode === "background-removal"}>
                    {FORMAT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(mode === "flip" || mode === "merge" || mode === "collage") && (
                <div className="md:col-span-2 flex flex-wrap gap-3">
                  <label className="btn btn--ghost">
                    <input type="checkbox" checked={flipHorizontal} onChange={(e) => setFlipHorizontal(e.target.checked)} className="mr-2" /> Horizontal
                  </label>
                  <label className="btn btn--ghost">
                    <input type="checkbox" checked={flipVertical} onChange={(e) => setFlipVertical(e.target.checked)} className="mr-2" /> Vertical
                  </label>
                </div>
              )}

              {(mode === "convert" || mode === "resize" || mode === "blur" || mode === "sharpen" || mode === "merge" || mode === "collage") && (
                <div className="md:col-span-2">
                  <label className="timecode">Quality</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input type="range" min={0.35} max={1} step={0.01} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-[var(--accent)]" disabled={isBusy || mode === "convert" && format === "image/png"} />
                    <span className="timecode w-12 text-right">{Math.round(quality * 100)}%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => void handleRun()} disabled={isBusy || files.length === 0} className="btn btn--primary disabled:opacity-50">
                <ToolIcon mode={mode} />
                {MODE_LABEL[mode]} {files.length > 0 ? `${files.length} file${files.length === 1 ? "" : "s"}` : ""}
              </button>
              <button type="button" onClick={handleReset} className="btn btn--ghost">
                <RotateCcw size={14} strokeWidth={1.75} />
                Reset
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="card">
              <p className="eyebrow">Result</p>
              <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden bg-[var(--surface-2)] min-h-60 flex items-center justify-center">
                {singleResult ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={singleResult.url} alt={singleResult.name} className="max-w-full max-h-[24rem] object-contain" />
                ) : (
                  <div className="px-6 py-10 text-center">
                    <p className="text-sm text-[var(--text-primary)]">Your processed output will appear here.</p>
                    <p className="timecode mt-2">The tool keeps everything local to the browser.</p>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="card" style={{ borderColor: "var(--alert)" }}>
                <p className="text-sm" style={{ color: "var(--alert)" }}>
                  {error}
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="card flex flex-col gap-3">
                {results.map((item) => (
                  <div key={item.url} className="flex items-center gap-3 pb-3 border-b border-[var(--border)] last:border-0 last:pb-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.name} className="w-14 h-14 object-cover rounded-[var(--radius-sm)] border border-[var(--border)]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)] truncate">{item.name}</p>
                      <p className="timecode mt-1">
                        {item.width} × {item.height} · {formatBytes(item.blob.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <ZipDownloadCard
              status={zipResult ? "ready" : status === "zipping" ? "compiling" : "idle"}
              fileCount={results.length}
              totalSizeBytes={totalBytes}
              progress={progress}
              result={zipResult}
              onCompile={() => void handleCompileZip()}
              compileLabel="Compile outputs"
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
