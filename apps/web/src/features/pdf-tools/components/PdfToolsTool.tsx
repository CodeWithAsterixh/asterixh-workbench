"use client";

import { useState } from "react";
import { RotateCcw, Combine, Scissors, ArrowUp, ArrowDown, X, Download } from "lucide-react";
import { FileDropzone } from "@/components/tool-ui/FileDropzone";
import { ProgressBar } from "@/components/tool-ui/ProgressBar";
import { ZipDownloadCard } from "@/components/tool-ui/ZipDownloadCard";
import { Reveal } from "@/lib/animations";
import { usePdfTools } from "../lib/usePdfTools";
import { formatBytes } from "@workbench-tools/video-to-frames";

const MODES = [
  { id: "merge", label: "Merge", icon: Combine },
  { id: "split", label: "Split", icon: Scissors },
] as const;

type Mode = (typeof MODES)[number]["id"];

export function PdfToolsTool() {
  const { status, progress, error, mergedSize, zipResult, runMerge, downloadMerged, runSplit, reset } = usePdfTools();
  const [mode, setMode] = useState<Mode>("merge");
  const [files, setFiles] = useState<File[]>([]);

  const isBusy = status === "working";
  const hasResult = status === "ready";

  const handleModeChange = (next: Mode) => {
    reset();
    setFiles([]);
    setMode(next);
  };

  const handleReset = () => {
    reset();
    setFiles([]);
  };

  const addFiles = (incoming: File[]) => {
    setFiles((prev) => (mode === "merge" ? [...prev, ...incoming] : incoming));
  };

  const moveFile = (index: number, dir: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-2 border-b border-[var(--border)]">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => handleModeChange(m.id)}
            className="btn btn--ghost"
            style={{
              borderBottom: `2px solid ${mode === m.id ? "var(--accent)" : "transparent"}`,
              color: mode === m.id ? "var(--text-primary)" : undefined,
            }}
          >
            <m.icon size={15} strokeWidth={1.75} />
            {m.label}
          </button>
        ))}
      </div>

      {!hasResult && (
        <Reveal>
          <div className="flex flex-col gap-6">
            <FileDropzone
              accept="application/pdf"
              multiple={mode === "merge"}
              onFiles={addFiles}
              disabled={isBusy}
              title={mode === "merge" ? "Drop PDFs, or click to browse" : "Drop a PDF, or click to browse"}
              hint={mode === "merge" ? "Add as many as you like — reorder them below" : "Every page becomes its own PDF"}
            />

            {mode === "merge" && files.length > 0 && (
              <div className="card flex flex-col gap-2">
                {files.map((file, i) => (
                  <div key={`${file.name}-${i}`} className="flex items-center gap-3 pb-2 border-b border-[var(--border)] last:border-0 last:pb-0">
                    <span className="timecode w-6">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm text-[var(--text-primary)] flex-1 truncate">{file.name}</span>
                    <span className="timecode">{formatBytes(file.size)}</span>
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

            <button
              type="button"
              onClick={() => (mode === "merge" ? void runMerge(files) : files[0] && void runSplit(files[0]))}
              disabled={isBusy || (mode === "merge" ? files.length < 2 : files.length === 0)}
              className="btn btn--primary w-full sm:w-auto disabled:opacity-50"
            >
              {mode === "merge" ? <Combine size={15} strokeWidth={1.75} /> : <Scissors size={15} strokeWidth={1.75} />}
              {mode === "merge" ? `Merge ${files.length} PDFs` : "Split into pages"}
            </button>
            {mode === "merge" && files.length === 1 && <p className="timecode">Add at least one more PDF to merge.</p>}
          </div>
        </Reveal>
      )}

      {isBusy && (
        <div className="card">
          <ProgressBar label={mode === "merge" ? "Merging" : "Splitting"} completed={progress?.completed ?? 0} total={progress?.total ?? files.length} />
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
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Done</span>
              <button type="button" onClick={handleReset} className="btn btn--ghost text-sm">
                <RotateCcw size={14} strokeWidth={1.75} />
                Start over
              </button>
            </div>

            {mode === "merge" && mergedSize && (
              <div className="card">
                <p className="text-sm text-[var(--text-primary)] mb-4">merged.pdf &middot; {mergedSize}</p>
                <button type="button" onClick={downloadMerged} className="btn btn--accent w-full sm:w-auto">
                  <Download size={15} strokeWidth={1.75} />
                  Download merged.pdf
                </button>
              </div>
            )}

            {mode === "split" && (
              <ZipDownloadCard status="ready" fileCount={zipResult?.fileCount ?? 0} result={zipResult} onCompile={() => {}} />
            )}
          </div>
        </Reveal>
      )}
    </div>
  );
}
