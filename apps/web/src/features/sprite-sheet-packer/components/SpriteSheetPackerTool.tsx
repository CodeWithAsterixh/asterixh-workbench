"use client";

import { useState, type ChangeEvent } from "react";
import { RotateCcw, LayoutGrid } from "lucide-react";
import { FileDropzone } from "@/components/tool-ui/FileDropzone";
import { ProgressBar } from "@/components/tool-ui/ProgressBar";
import { ZipDownloadCard } from "@/components/tool-ui/ZipDownloadCard";
import { Reveal } from "@/lib/animations";
import { useSpritePacker } from "../lib/useSpritePacker";

export function SpriteSheetPackerTool() {
  const { status, result, progress, zipResult, error, pack, compileZip, reset } = useSpritePacker();
  const [files, setFiles] = useState<File[]>([]);
  const [padding, setPadding] = useState(4);

  const isBusy = status === "packing" || status === "zipping";
  const hasResult = status === "ready" || status === "zipping" || status === "zip-ready";

  const handleReset = () => {
    reset();
    setFiles([]);
  };

  return (
    <div className="flex flex-col gap-8">
      {!hasResult && (
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <FileDropzone
              accept="image/*"
              multiple
              onFiles={setFiles}
              disabled={isBusy}
              title="Drop images, or click to browse"
              hint={files.length > 0 ? `${files.length} selected` : "Any order \u2014 packed left to right, top to bottom"}
            />

            <div className="card">
              <label htmlFor="padding">Padding between frames</label>
              <div className="flex items-center gap-3">
                <input
                  id="padding"
                  type="range"
                  min={0}
                  max={32}
                  value={padding}
                  disabled={isBusy}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPadding(Number(e.target.value))}
                  className="w-full accent-[var(--accent)]"
                />
                <span className="timecode w-12 text-right">{padding}px</span>
              </div>

              <button
                type="button"
                onClick={() => void pack(files, padding)}
                disabled={files.length === 0 || isBusy}
                className="btn btn--primary w-full mt-8 disabled:opacity-50"
              >
                <LayoutGrid size={15} strokeWidth={1.75} />
                Pack {files.length > 0 ? `${files.length} image${files.length === 1 ? "" : "s"}` : ""}
              </button>
            </div>
          </div>
        </Reveal>
      )}

      {status === "packing" && (
        <div className="card">
          <ProgressBar label="Reading images" completed={progress?.completed ?? 0} total={progress?.total ?? files.length} />
        </div>
      )}

      {error && (
        <div className="card" style={{ borderColor: "var(--alert)" }}>
          <p className="text-sm" style={{ color: "var(--alert)" }}>
            {error}
          </p>
        </div>
      )}

      {hasResult && result && (
        <Reveal>
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <span className="eyebrow">
                {result.frames.length} frames &middot; {result.width}&times;{result.height}
              </span>
              <button type="button" onClick={handleReset} className="btn btn--ghost text-sm">
                <RotateCcw size={14} strokeWidth={1.75} />
                Start over
              </button>
            </div>

            <div className="panel-frame p-4 flex items-center justify-center" style={{ background: "var(--surface-sunken)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.dataUrl} alt="Packed sprite sheet" className="max-w-full" style={{ imageRendering: "pixelated" }} />
            </div>

            <ZipDownloadCard
              status={status === "zip-ready" ? "ready" : status === "zipping" ? "compiling" : "idle"}
              fileCount={2}
              progress={progress}
              progressLabel="Compiling archive"
              result={zipResult}
              onCompile={() => void compileZip()}
              compileLabel="Download sheet + manifest"
            />
          </div>
        </Reveal>
      )}
    </div>
  );
}
