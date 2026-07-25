"use client";

import { useState, type ChangeEvent } from "react";
import { RotateCcw, Shrink } from "lucide-react";
import { FileDropzone } from "@/components/tool-ui/FileDropzone";
import { ProgressBar } from "@/components/tool-ui/ProgressBar";
import { ZipDownloadCard } from "@/components/tool-ui/ZipDownloadCard";
import { Reveal } from "@/lib/animations";
import { useImageCompressor } from "../lib/useImageCompressor";
import { formatBytes, type FrameMimeType } from "@workbench-tools/video-to-frames";

const FORMAT_OPTIONS: { value: FrameMimeType; label: string }[] = [
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/png", label: "PNG" },
];

export function ImageCompressorTool() {
  const { status, results, progress, zipResult, error, compress, compileZip, reset } = useImageCompressor();

  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<FrameMimeType>("image/webp");
  const [quality, setQuality] = useState(0.75);
  const [maxWidth, setMaxWidth] = useState(2000);

  const isBusy = status === "compressing" || status === "zipping";
  const hasResult = status === "ready" || status === "zipping" || status === "zip-ready";

  const totalOriginal = results.reduce((sum, r) => sum + r.originalBytes, 0);
  const totalCompressed = results.reduce((sum, r) => sum + r.compressedBytes, 0);
  const savedPct = totalOriginal > 0 ? Math.round((1 - totalCompressed / totalOriginal) * 100) : 0;

  const handleReset = () => {
    reset();
    setFiles([]);
  };

  return (
    <div className="flex flex-col gap-8">
      {!hasResult && (
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="h-full">
              <FileDropzone
                accept="image/*"
                multiple
                onFiles={setFiles}
                disabled={isBusy}
                title="Drop images, or click to browse"
                hint={files.length > 0 ? `${files.length} selected` : "PNG, JPEG, or WebP — any number of files"}
              />
            </div>

            <div className="card flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="format">Output format</label>
                  <select
                    id="format"
                    className="field"
                    value={format}
                    disabled={isBusy}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormat(e.target.value as FrameMimeType)}
                  >
                    {FORMAT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="max-width">Max width</label>
                  <input
                    id="max-width"
                    type="number"
                    min={100}
                    step={100}
                    value={maxWidth}
                    disabled={isBusy}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMaxWidth(Number(e.target.value) || 2000)}
                    className="field"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="quality">Quality</label>
                  <div className="flex items-center gap-3">
                    <input
                      id="quality"
                      type="range"
                      min={0.3}
                      max={1}
                      step={0.05}
                      value={quality}
                      disabled={isBusy || format === "image/png"}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setQuality(Number(e.target.value))}
                      className="w-full accent-[var(--accent)]"
                    />
                    <span className="timecode w-12 text-right">{Math.round(quality * 100)}%</span>
                  </div>
                  {format === "image/png" && <p className="timecode mt-1">PNG is lossless — quality doesn&apos;t apply</p>}
                </div>
              </div>

              <button
                type="button"
                onClick={() => void compress(files, { format, quality, maxWidth })}
                disabled={files.length === 0 || isBusy}
                className="btn btn--primary w-full mt-8 disabled:opacity-50"
              >
                <Shrink size={15} strokeWidth={1.75} />
                Compress {files.length > 0 ? `${files.length} image${files.length === 1 ? "" : "s"}` : ""}
              </button>
            </div>
          </div>
        </Reveal>
      )}

      {status === "compressing" && (
        <div className="card">
          <ProgressBar label="Compressing" completed={progress?.completed ?? 0} total={progress?.total ?? files.length} />
        </div>
      )}

      {error && (
        <div className="card" style={{ borderColor: "var(--alert)" }}>
          <p className="text-sm" style={{ color: "var(--alert)" }}>
            {error}
          </p>
        </div>
      )}

      {hasResult && (
        <Reveal>
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <span className="eyebrow">
                {results.length} images &middot; {savedPct}% smaller
              </span>
              <button type="button" onClick={handleReset} className="btn btn--ghost text-sm">
                <RotateCcw size={14} strokeWidth={1.75} />
                Start over
              </button>
            </div>

            <div className="card flex flex-col gap-3">
              {results.map((r) => {
                const pct = r.originalBytes > 0 ? Math.round((1 - r.compressedBytes / r.originalBytes) * 100) : 0;
                return (
                  <div key={r.name} className="flex items-center gap-4 pb-3 border-b border-[var(--border)] last:border-0 last:pb-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.dataUrl} alt={r.name} className="w-12 h-12 object-cover flex-shrink-0" style={{ border: "1px solid var(--border)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)] truncate">{r.name}</p>
                      <p className="timecode mt-1">
                        {formatBytes(r.originalBytes)} &rarr; {formatBytes(r.compressedBytes)}
                      </p>
                    </div>
                    <span className="badge" style={pct > 0 ? { borderColor: "var(--success)", color: "var(--success)" } : undefined}>
                      {pct > 0 ? `-${pct}%` : "same size"}
                    </span>
                  </div>
                );
              })}
            </div>

            <ZipDownloadCard
              status={status === "zip-ready" ? "ready" : status === "zipping" ? "compiling" : "idle"}
              fileCount={results.length}
              totalSizeBytes={totalCompressed}
              progress={progress}
              progressLabel="Compiling archive"
              result={zipResult}
              onCompile={() => void compileZip()}
              compileLabel="Compile to zip"
            />
          </div>
        </Reveal>
      )}
    </div>
  );
}
