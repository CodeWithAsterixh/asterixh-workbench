"use client";

import { useState, type ChangeEvent } from "react";
import { RotateCcw, Film, ArrowUp, ArrowDown, X, Download } from "lucide-react";
import { FileDropzone } from "@/components/tool-ui/FileDropzone";
import { ProgressBar } from "@/components/tool-ui/ProgressBar";
import { Reveal } from "@/lib/animations";
import { useGifMaker } from "../lib/useGifMaker";

export function GifMakerTool() {
  const { status, progress, error, gifUrl, gifSize, build, download, reset } = useGifMaker();
  const [files, setFiles] = useState<File[]>([]);
  const [width, setWidth] = useState(360);
  const [delayMs, setDelayMs] = useState(200);
  const [loop, setLoop] = useState(true);

  const isBusy = status === "building";
  const hasResult = status === "ready";

  const handleReset = () => {
    reset();
    setFiles([]);
  };

  const addFiles = (incoming: File[]) => setFiles((prev) => [...prev, ...incoming]);

  const moveFile = (index: number, dir: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  };

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-8">
      {!hasResult && (
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-4">
              <FileDropzone
                accept="image/*"
                multiple
                onFiles={addFiles}
                disabled={isBusy}
                title="Drop images, or click to browse"
                hint="Order below becomes animation order"
              />

              {files.length > 0 && (
                <div className="card flex flex-col gap-2">
                  {files.map((file, i) => (
                    <div key={`${file.name}-${i}`} className="flex items-center gap-3 pb-2 border-b border-[var(--border)] last:border-0 last:pb-0">
                      <span className="timecode w-6">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-sm text-[var(--text-primary)] flex-1 truncate">{file.name}</span>
                      <button type="button" onClick={() => moveFile(i, -1)} disabled={i === 0} className="btn btn--ghost disabled:opacity-30" style={{ height: "1.75rem", width: "1.75rem", padding: 0 }}>
                        <ArrowUp size={13} strokeWidth={1.75} />
                      </button>
                      <button type="button" onClick={() => moveFile(i, 1)} disabled={i === files.length - 1} className="btn btn--ghost disabled:opacity-30" style={{ height: "1.75rem", width: "1.75rem", padding: 0 }}>
                        <ArrowDown size={13} strokeWidth={1.75} />
                      </button>
                      <button type="button" onClick={() => removeFile(i)} className="btn btn--ghost" style={{ height: "1.75rem", width: "1.75rem", padding: 0 }}>
                        <X size={13} strokeWidth={1.75} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="gif-width">Width</label>
                  <div className="flex items-center gap-3">
                    <input
                      id="gif-width"
                      type="range"
                      min={120}
                      max={640}
                      step={20}
                      value={width}
                      disabled={isBusy}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setWidth(Number(e.target.value))}
                      className="w-full accent-[var(--accent)]"
                    />
                    <span className="timecode w-14 text-right">{width}px</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="gif-delay">Frame delay</label>
                  <div className="flex items-center gap-3">
                    <input
                      id="gif-delay"
                      type="range"
                      min={40}
                      max={1000}
                      step={20}
                      value={delayMs}
                      disabled={isBusy}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDelayMs(Number(e.target.value))}
                      className="w-full accent-[var(--accent)]"
                    />
                    <span className="timecode w-14 text-right">{delayMs}ms</span>
                  </div>
                </div>

                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    id="gif-loop"
                    type="checkbox"
                    checked={loop}
                    disabled={isBusy}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLoop(e.target.checked)}
                    className="accent-[var(--accent)]"
                  />
                  <label htmlFor="gif-loop" className="mb-0" style={{ textTransform: "none" }}>
                    Loop forever
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void build(files, { width, delayMs, repeat: loop ? 0 : -1 })}
                disabled={files.length === 0 || isBusy}
                className="btn btn--primary w-full mt-8 disabled:opacity-50"
              >
                <Film size={15} strokeWidth={1.75} />
                Build GIF {files.length > 0 ? `from ${files.length} image${files.length === 1 ? "" : "s"}` : ""}
              </button>
            </div>
          </div>
        </Reveal>
      )}

      {isBusy && (
        <div className="card">
          <ProgressBar label="Encoding frames" completed={progress?.completed ?? 0} total={progress?.total ?? files.length} />
        </div>
      )}

      {error && (
        <div className="card" style={{ borderColor: "var(--alert)" }}>
          <p className="text-sm" style={{ color: "var(--alert)" }}>
            {error}
          </p>
        </div>
      )}

      {hasResult && gifUrl && (
        <Reveal>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="eyebrow">{gifSize}</span>
              <button type="button" onClick={handleReset} className="btn btn--ghost text-sm">
                <RotateCcw size={14} strokeWidth={1.75} />
                Start over
              </button>
            </div>

            <div className="panel-frame p-4 flex items-center justify-center" style={{ background: "var(--surface-sunken)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gifUrl} alt="Generated GIF" className="max-w-full" />
            </div>

            <button type="button" onClick={download} className="btn btn--accent w-full sm:w-auto">
              <Download size={15} strokeWidth={1.75} />
              Download workbench.gif
            </button>
          </div>
        </Reveal>
      )}
    </div>
  );
}
