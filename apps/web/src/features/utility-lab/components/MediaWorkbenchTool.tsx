"use client";

import { useMemo, useState } from "react";
import { Download, RotateCcw, Scissors, Volume2, Film, Music2, Replace } from "lucide-react";
import { FileDropzone } from "@/components/tool-ui/FileDropzone";
import { ProgressBar } from "@/components/tool-ui/ProgressBar";
import { ZipDownloadCard } from "@/components/tool-ui/ZipDownloadCard";
import { Reveal } from "@/lib/animations";
import { triggerDownload } from "@/lib/browser-zip";
import { formatBytes } from "@workbench-tools/video-to-frames";
import { runMediaWorkbench, type AudioMode, type MediaKind, type MediaWorkbenchOptions, type MediaWorkbenchResult, type VideoMode } from "../lib/media-workbench";

interface MediaWorkbenchToolProps {
  kind: MediaKind;
  mode: VideoMode | AudioMode;
  title: string;
  summary: string;
}

const VIDEO_OUTPUTS = [
  { value: "video/webm", label: "WebM" },
  { value: "video/mp4", label: "MP4" },
];

const AUDIO_OUTPUTS = [
  { value: "audio/wav", label: "WAV" },
  { value: "audio/webm", label: "WebM" },
  { value: "audio/ogg", label: "Ogg" },
  { value: "audio/mpeg", label: "MP3" },
];

const MODE_LABEL: Record<VideoMode | AudioMode, string> = {
  convert: "Convert",
  trim: "Trim",
  crop: "Crop",
  resize: "Resize",
  reverse: "Reverse",
  "audio-extract": "Extract audio",
  boost: "Boost",
  "noise-reduction": "Noise reduction",
  join: "Join",
  split: "Split",
};

export function MediaWorkbenchTool({ kind, mode, title, summary }: MediaWorkbenchToolProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "working" | "ready" | "error">("idle");
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MediaWorkbenchResult | null>(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [fps, setFps] = useState(30);
  const [outputMime, setOutputMime] = useState(kind === "video" ? "video/webm" : "audio/wav");
  const [gain, setGain] = useState(1.25);
  const [chunks, setChunks] = useState(4);

  const isBusy = status === "working";
  const accept = kind === "video" ? "video/*" : "audio/*";
  const multiple = mode === "join" || mode === "split";

  const options = useMemo(
    () => ({ start, end, width, height, fps, outputMime, gain, chunks }),
    [chunks, end, fps, gain, height, outputMime, start, width],
  );

  const handleRun = async () => {
    if (files.length === 0) return;
    setStatus("working");
    setError(null);
    setProgress({ completed: 0, total: Math.max(1, files.length) });
    setResult(null);

    try {
      const next = await runMediaWorkbench(kind, mode, files, options);
      setResult(next);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't process that file.");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(null);
    setStatus("idle");
  };

  const handleDownload = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    triggerDownload(url, result.filename);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] items-start">
          <div className="card flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="eyebrow">{kind === "video" ? "Video" : "Audio"} · {MODE_LABEL[mode]}</p>
                <h2 className="text-lg text-[var(--text-primary)] mt-2">{title}</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2">{summary}</p>
              </div>
              <span className="badge">{files.length > 0 ? `${files.length} input${files.length === 1 ? "" : "s"}` : "Browser native"}</span>
            </div>

            <FileDropzone
              accept={accept}
              multiple={multiple}
              onFiles={setFiles}
              disabled={isBusy}
              title={kind === "video" ? "Drop a video, or click to browse" : multiple ? "Drop audio files, or click to browse" : "Drop an audio file, or click to browse"}
              hint={files.length > 0 ? `${files.length} selected` : "Fast local processing with native browser APIs"}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="timecode">Start (seconds)</label>
                <input type="number" min={0} step={0.1} value={start} onChange={(e) => setStart(Number(e.target.value) || 0)} className="field mt-2" disabled={isBusy} />
              </div>
              <div>
                <label className="timecode">End (seconds)</label>
                <input type="number" min={0} step={0.1} value={end} onChange={(e) => setEnd(Number(e.target.value) || 0)} className="field mt-2" disabled={isBusy} />
              </div>

              {kind === "video" && (
                <>
                  <div>
                    <label className="timecode">Width</label>
                    <input type="number" min={1} value={width} onChange={(e) => setWidth(Number(e.target.value) || 1)} className="field mt-2" disabled={isBusy} />
                  </div>
                  <div>
                    <label className="timecode">Height</label>
                    <input type="number" min={1} value={height} onChange={(e) => setHeight(Number(e.target.value) || 1)} className="field mt-2" disabled={isBusy} />
                  </div>
                  <div>
                    <label className="timecode">FPS</label>
                    <input type="number" min={1} max={60} value={fps} onChange={(e) => setFps(Number(e.target.value) || 30)} className="field mt-2" disabled={isBusy} />
                  </div>
                  <div>
                    <label className="timecode">Video format</label>
                    <select value={outputMime} onChange={(e) => setOutputMime(e.target.value)} className="field mt-2" disabled={isBusy}>
                      {VIDEO_OUTPUTS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {kind === "audio" && (
                <>
                  <div>
                    <label className="timecode">Gain</label>
                    <input type="number" min={0.25} step={0.05} value={gain} onChange={(e) => setGain(Number(e.target.value) || 1)} className="field mt-2" disabled={isBusy} />
                  </div>
                  <div>
                    <label className="timecode">Chunks</label>
                    <input type="number" min={2} max={12} value={chunks} onChange={(e) => setChunks(Number(e.target.value) || 4)} className="field mt-2" disabled={isBusy} />
                  </div>
                  <div>
                    <label className="timecode">Audio format</label>
                    <select value={outputMime} onChange={(e) => setOutputMime(e.target.value)} className="field mt-2" disabled={isBusy}>
                      {AUDIO_OUTPUTS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => void handleRun()} disabled={isBusy || files.length === 0} className="btn btn--primary disabled:opacity-50">
                {kind === "video" ? <Film size={15} strokeWidth={1.75} /> : <Music2 size={15} strokeWidth={1.75} />}
                {MODE_LABEL[mode]}
              </button>
              <button type="button" onClick={handleReset} className="btn btn--ghost">
                <RotateCcw size={14} strokeWidth={1.75} />
                Reset
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {status === "working" && (
              <div className="card">
                <ProgressBar label="Processing media" completed={progress?.completed ?? 0} total={progress?.total ?? 1} />
              </div>
            )}

            {error && (
              <div className="card" style={{ borderColor: "var(--alert)" }}>
                <p className="text-sm" style={{ color: "var(--alert)" }}>
                  {error}
                </p>
              </div>
            )}

            {result?.kind === "file" && result.blob && (
              <div className="card flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Replace size={18} strokeWidth={1.5} className="text-[var(--accent)]" />
                  <span className="eyebrow">Ready to download</span>
                </div>
                <p className="text-sm text-[var(--text-primary)]">
                  {result.filename} · {formatBytes(result.blob.size)}
                </p>
                <button type="button" onClick={handleDownload} className="btn btn--accent w-full sm:w-auto">
                  <Download size={15} strokeWidth={1.75} />
                  Download file
                </button>
                {result.note && <p className="timecode">{result.note}</p>}
              </div>
            )}

            {result?.kind === "zip" && result.zip && (
              <ZipDownloadCard status="ready" fileCount={result.zip.fileCount} result={result.zip} onCompile={() => {}} compileLabel="Download archive" />
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
