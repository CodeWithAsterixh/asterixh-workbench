"use client";

import { Archive, Download, CheckCircle2 } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import type { CompiledZip } from "@/lib/browser-zip";
import { formatBytes } from "@workbench-tools/video-to-frames";

interface ZipDownloadCardProps {
  status: "idle" | "compiling" | "ready";
  fileCount: number;
  totalSizeBytes?: number;
  progress?: { completed: number; total: number } | null;
  progressLabel?: string;
  result: CompiledZip | null;
  onCompile: () => void;
  compileLabel?: string;
}

export function ZipDownloadCard({
  status,
  fileCount,
  totalSizeBytes,
  progress,
  progressLabel = "Compiling archive",
  result,
  onCompile,
  compileLabel = "Compile to zip",
}: ZipDownloadCardProps) {
  if (status === "ready" && result) {
    return (
      <div className="card" style={{ borderColor: "var(--accent)" }}>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 size={18} strokeWidth={1.5} className="text-[var(--accent)]" />
          <span className="eyebrow">Ready to download</span>
        </div>

        <dl className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <dt className="timecode mb-1">Files</dt>
            <dd className="text-sm text-[var(--text-primary)]">{result.fileCount}</dd>
          </div>
          <div>
            <dt className="timecode mb-1">Size</dt>
            <dd className="text-sm text-[var(--text-primary)]">{result.formattedSize}</dd>
          </div>
          <div>
            <dt className="timecode mb-1">Format</dt>
            <dd className="text-sm text-[var(--text-primary)]">.zip</dd>
          </div>
        </dl>

        <button type="button" onClick={result.download} className="btn btn--accent w-full">
          <Download size={15} strokeWidth={1.75} />
          Download {result.filename}
        </button>
      </div>
    );
  }

  if (status === "compiling") {
    return (
      <div className="card">
        <ProgressBar label={progressLabel} completed={progress?.completed ?? 0} total={progress?.total ?? fileCount} />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-[var(--text-primary)]">
            {fileCount} {fileCount === 1 ? "file" : "files"}
            {typeof totalSizeBytes === "number" && <> &middot; {formatBytes(totalSizeBytes)} uncompressed</>}
          </p>
        </div>
        <button type="button" onClick={onCompile} disabled={fileCount === 0} className="btn btn--secondary disabled:opacity-50">
          <Archive size={15} strokeWidth={1.75} />
          {compileLabel}
        </button>
      </div>
    </div>
  );
}
