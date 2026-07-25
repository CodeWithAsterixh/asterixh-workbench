"use client";

import { useState, type ChangeEvent } from "react";
import { RotateCcw, Grid3x3, Download } from "lucide-react";
import { FileDropzone } from "@/components/tool-ui/FileDropzone";
import { ProgressBar } from "@/components/tool-ui/ProgressBar";
import { Reveal } from "@/lib/animations";
import { useContactSheet } from "../lib/useContactSheet";

export function ContactSheetTool() {
  const { status, result, progress, error, build, download, reset } = useContactSheet();
  const [files, setFiles] = useState<File[]>([]);
  const [columns, setColumns] = useState(4);
  const [title, setTitle] = useState("Contact Sheet");

  const isBusy = status === "building";
  const hasResult = status === "ready";

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
              hint={files.length > 0 ? `${files.length} selected` : "Arranged in the order you select them"}
            />

            <div className="card h-full min-h-fit flex flex-col gap-6 justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title">Title</label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    disabled={isBusy}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    className="field"
                  />
                </div>
                <div>
                  <label htmlFor="columns">Columns</label>
                  <div className="flex items-center gap-3 py-3">
                    <input
                      id="columns"
                      type="range"
                      min={2}
                      max={8}
                      value={columns}
                      disabled={isBusy}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setColumns(Number(e.target.value))}
                      className="w-full accent-[var(--accent)]"
                    />
                    <span className="timecode w-6 text-right">{columns}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void build(files, { columns, thumbSize: 220, title })}
                disabled={files.length === 0 || isBusy}
                className="btn btn--primary w-full mt-8 disabled:opacity-50"
              >
                <Grid3x3 size={15} strokeWidth={1.75} />
                Build sheet {files.length > 0 ? `from ${files.length} image${files.length === 1 ? "" : "s"}` : ""}
              </button>
            </div>
          </div>
        </Reveal>
      )}

      {status === "building" && (
        <div className="card">
          <ProgressBar label="Placing images" completed={progress?.completed ?? 0} total={progress?.total ?? files.length} />
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
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <span className="eyebrow">
                {result.width}&times;{result.height}px
              </span>
              <button type="button" onClick={handleReset} className="btn btn--ghost text-sm">
                <RotateCcw size={14} strokeWidth={1.75} />
                Start over
              </button>
            </div>

            <div className="panel-frame p-4" style={{ background: "var(--surface-sunken)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.dataUrl} alt="Contact sheet" className="w-full" />
            </div>

            <button type="button" onClick={download} className="btn btn--accent w-full sm:w-auto">
              <Download size={15} strokeWidth={1.75} />
              Download contact-sheet.png
            </button>
          </div>
        </Reveal>
      )}
    </div>
  );
}
