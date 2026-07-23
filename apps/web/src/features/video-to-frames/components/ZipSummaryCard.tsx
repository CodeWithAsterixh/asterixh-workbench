"use client";

import { Archive, Download, CheckCircle2 } from "lucide-react";
import { ProgressStatus } from "./ProgressStatus";
import { formatBytes, type ZipProgress, type ZipResult } from "@workbench-tools/video-to-frames";
import type { ToolStatus } from "../lib/useVideoToFrames";

const STAGE_LABEL: Record<ZipProgress["stage"], string> = {
  preparing: "Reading frames",
  compressing: "Compressing archive",
  finalizing: "Finalizing zip",
  done: "Done",
};

interface ZipSummaryCardProps {
  status: ToolStatus;
  frameCount: number;
  totalSizeBytes: number;
  zipProgress: ZipProgress | null;
  zipResult: ZipResult | null;
  onCompile: () => void;
}

export function ZipSummaryCard({
  status,
  frameCount,
  totalSizeBytes,
  zipProgress,
  zipResult,
  onCompile,
}: ZipSummaryCardProps) {
  if (status === "zip-ready" && zipResult) {
    return (
      <div className="card" style={{ borderColor: "var(--accent)" }}>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 size={18} strokeWidth={1.5} className="text-[var(--accent)]" />
          <span className="eyebrow">Ready to download</span>
        </div>

        <dl className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <dt className="timecode mb-1">Files</dt>
            <dd className="text-sm text-[var(--text-primary)]">{zipResult.fileCount}</dd>
          </div>
          <div>
            <dt className="timecode mb-1">Size</dt>
            <dd className="text-sm text-[var(--text-primary)]">{zipResult.formattedSize}</dd>
          </div>
          <div>
            <dt className="timecode mb-1">Format</dt>
            <dd className="text-sm text-[var(--text-primary)]">.zip</dd>
          </div>
        </dl>

        <button type="button" onClick={zipResult.download} className="btn btn--accent w-full">
          <Download size={15} strokeWidth={1.75} />
          Download {zipResult.filename}
        </button>
      </div>
    );
  }

  if (status === "zipping") {
    return (
      <div className="card">
        <ProgressStatus
          label={zipProgress ? STAGE_LABEL[zipProgress.stage] : "Preparing"}
          completed={zipProgress?.completed ?? 0}
          total={zipProgress?.total ?? frameCount}
        />
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="eyebrow">Step 4</span>
          <p className="text-sm text-[var(--text-primary)] mt-2">
            {frameCount} frames &middot; {formatBytes(totalSizeBytes)} uncompressed
          </p>
        </div>
        <button type="button" onClick={onCompile} className="btn btn--secondary">
          <Archive size={15} strokeWidth={1.75} />
          Compile to zip
        </button>
      </div>
    </div>
  );
}
