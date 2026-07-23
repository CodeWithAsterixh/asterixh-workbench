"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Dropzone } from "./Dropzone";
import { OptionsPanel } from "./OptionsPanel";
import { ProgressStatus } from "./ProgressStatus";
import { FrameGrid } from "./FrameGrid";
import { ZipSummaryCard } from "./ZipSummaryCard";
import { UsageSnippet } from "./UsageSnippet";
import { useVideoToFrames } from "../lib/useVideoToFrames";
import { FRAME_COUNT_DEFAULT, SAMPLE_VIDEO_URL } from "../lib/config";
import type { ExtractionStage, FrameMimeType } from "@workbench-tools/video-to-frames";
import { Reveal } from "@/lib/animations";

const EXTRACTION_STAGE_LABEL: Record<ExtractionStage, string> = {
  "loading-video": "Reading video",
  extracting: "Extracting frames",
  preloading: "Preloading previews",
  done: "Done",
};

export function VideoToFramesTool() {
  const {
    status,
    frames,
    totalSizeBytes,
    extractionProgress,
    zipProgress,
    zipResult,
    error,
    extract,
    compileZip,
    reset,
  } = useVideoToFrames();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [source, setSource] = useState<File | string | null>(null);
  const [frameCount, setFrameCount] = useState(FRAME_COUNT_DEFAULT);
  const [format, setFormat] = useState<FrameMimeType>("image/jpeg");
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  const isBusy = status === "extracting" || status === "zipping";
  const hasResult = status === "ready" || status === "zipping" || status === "zip-ready";

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setSource(file);
  };

  const handleUseSample = () => {
    setSelectedFile(null);
    setSource(SAMPLE_VIDEO_URL);
  };

  const handleExtract = () => {
    if (!source) return;
    void extract(source, { frameCount, trimStart, trimEnd, mimeType: format, quality: 0.9 });
  };

  const handleReset = () => {
    reset();
    setSelectedFile(null);
    setSource(null);
  };

  return (
    <div className="flex flex-col gap-10">
      {!hasResult && (
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Dropzone
              selectedFile={selectedFile}
              onFileSelected={handleFileSelected}
              onUseSample={handleUseSample}
              disabled={isBusy}
            />
            <OptionsPanel
              frameCount={frameCount}
              onFrameCountChange={setFrameCount}
              format={format}
              onFormatChange={setFormat}
              trimStart={trimStart}
              trimEnd={trimEnd}
              onTrimStartChange={setTrimStart}
              onTrimEndChange={setTrimEnd}
              onExtract={handleExtract}
              canExtract={Boolean(source)}
              disabled={isBusy}
            />
          </div>
        </Reveal>
      )}

      {status === "extracting" && (
        <div className="card">
          <ProgressStatus
            label={extractionProgress ? EXTRACTION_STAGE_LABEL[extractionProgress.stage] : "Starting"}
            completed={extractionProgress?.completed ?? 0}
            total={extractionProgress?.total ?? frameCount}
          />
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
            <div className="flex items-center justify-between">
              <span className="eyebrow">
                {frames.length} frames extracted
              </span>
              <button type="button" onClick={handleReset} className="btn btn--ghost text-sm">
                <RotateCcw size={14} strokeWidth={1.75} />
                Start over
              </button>
            </div>

            <FrameGrid frames={frames} />

            <ZipSummaryCard
              status={status}
              frameCount={frames.length}
              totalSizeBytes={totalSizeBytes}
              zipProgress={zipProgress}
              zipResult={zipResult}
              onCompile={() => void compileZip({ filename: "workbench-frames" })}
            />
          </div>
        </Reveal>
      )}

      <div className="divider" />

      <UsageSnippet />
    </div>
  );
}
