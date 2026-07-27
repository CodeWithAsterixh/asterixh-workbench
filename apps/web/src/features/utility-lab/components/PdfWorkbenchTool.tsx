"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileText, RotateCcw, ArrowUp, ArrowDown, Wrench, ScanText } from "lucide-react";
import { FileDropzone } from "@/components/tool-ui/FileDropzone";
import { ProgressBar } from "@/components/tool-ui/ProgressBar";
import { ZipDownloadCard } from "@/components/tool-ui/ZipDownloadCard";
import { Reveal } from "@/lib/animations";
import { triggerDownload } from "@/lib/browser-zip";
import { formatBytes } from "@workbench-tools/video-to-frames";
import { getPageCount } from "@/features/pdf-tools/lib/pdf-operations";
import { runPdfWorkbench, type PdfMode, type PdfWorkbenchOptions, type PdfWorkbenchResult } from "../lib/pdf-workbench";

interface PdfWorkbenchToolProps {
  mode: PdfMode;
  title: string;
  summary: string;
}

const MODE_LABEL: Record<PdfMode, string> = {
  compress: "Compress",
  rotate: "Rotate",
  reorder: "Reorder",
  watermark: "Watermark",
  unlock: "Unlock",
  protect: "Protect",
  "images-to-pdf": "Images to PDF",
  "pdf-to-images": "PDF to images",
  ocr: "OCR",
};

export function PdfWorkbenchTool({ mode, title, summary }: PdfWorkbenchToolProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "working" | "ready" | "error">("idle");
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PdfWorkbenchResult | null>(null);
  const [angle, setAngle] = useState(90);
  const [quality, setQuality] = useState(0.74);
  const [watermark, setWatermark] = useState("Workbench");
  const [password, setPassword] = useState("");
  const [outputFormat, setOutputFormat] = useState<PdfWorkbenchOptions["outputFormat"]>("image/jpeg");
  const [pageCount, setPageCount] = useState(0);
  const [pageOrder, setPageOrder] = useState<number[]>([]);

  const isBusy = status === "working";
  const multipleFiles = mode === "images-to-pdf";
  const primaryFile = files[0] ?? null;

  useEffect(() => {
    if (mode !== "reorder" || !primaryFile) {
      setPageCount(0);
      setPageOrder([]);
      return;
    }

    let cancelled = false;
    void getPageCount(primaryFile)
      .then((count) => {
        if (cancelled) return;
        setPageCount(count);
        setPageOrder(Array.from({ length: count }, (_, index) => index));
      })
      .catch(() => {
        if (!cancelled) {
          setPageCount(0);
          setPageOrder([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mode, primaryFile]);

  const options = useMemo(
    () => ({ angle, quality, watermark, password, outputFormat }),
    [angle, outputFormat, password, quality, watermark],
  );

  const handleMovePage = (index: number, direction: -1 | 1) => {
    setPageOrder((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  };

  const handleRun = async () => {
    if (files.length === 0) return;
    setStatus("working");
    setError(null);
    setProgress({ completed: 0, total: Math.max(1, files.length) });
    setResult(null);

    try {
      const output = await runPdfWorkbench(mode, files, options, pageOrder, (completed, total) => setProgress({ completed, total }));
      setResult(output);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't process that PDF.");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(null);
    setError(null);
    setResult(null);
    setPageCount(0);
    setPageOrder([]);
  };

  const handleDownload = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    triggerDownload(url, result.filename);
    URL.revokeObjectURL(url);
  };

  const handleDownloadText = () => {
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
                <p className="eyebrow">{MODE_LABEL[mode]}</p>
                <h2 className="text-lg text-[var(--text-primary)] mt-2">{title}</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2">{summary}</p>
              </div>
              <span className="badge">{files.length > 0 ? `${files.length} input${files.length === 1 ? "" : "s"}` : "Fast PDF tools"}</span>
            </div>

            <FileDropzone
              accept={multipleFiles ? "image/*" : "application/pdf"}
              multiple={multipleFiles}
              onFiles={setFiles}
              disabled={isBusy}
              title={
                multipleFiles
                  ? "Drop images, or click to browse"
                  : mode === "reorder"
                    ? "Drop a PDF, or click to browse"
                    : "Drop a PDF, or click to browse"
              }
              hint={
                multipleFiles
                  ? files.length > 0
                    ? `${files.length} selected`
                    : "PNG or JPEG images work best"
                  : primaryFile
                    ? primaryFile.name
                    : "Everything stays local"
              }
            />

            <div className="grid gap-5 md:grid-cols-2">
              {(mode === "compress" || mode === "pdf-to-images" || mode === "unlock" || mode === "protect" || mode === "ocr") && (
                <>
                  <div>
                    <label className="timecode">Output format</label>
                    <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as PdfWorkbenchOptions["outputFormat"])} className="field mt-2" disabled={isBusy}>
                      <option value="image/jpeg">JPEG</option>
                      <option value="image/webp">WebP</option>
                      <option value="image/png">PNG</option>
                    </select>
                  </div>
                  <div>
                    <label className="timecode">Quality</label>
                    <div className="flex items-center gap-3 mt-2">
                      <input type="range" min={0.25} max={1} step={0.01} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-[var(--accent)]" disabled={isBusy} />
                      <span className="timecode w-12 text-right">{Math.round(quality * 100)}%</span>
                    </div>
                  </div>
                </>
              )}

              {(mode === "rotate" || mode === "compress" || mode === "unlock" || mode === "protect" || mode === "pdf-to-images" || mode === "ocr") && (
                <div className="md:col-span-2">
                  <label className="timecode">Password or angle</label>
                  {mode === "rotate" ? (
                    <div className="flex items-center gap-3 mt-2">
                      <input type="range" min={-180} max={180} step={1} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-[var(--accent)]" disabled={isBusy} />
                      <span className="timecode w-12 text-right">{angle}°</span>
                    </div>
                  ) : (
                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="field mt-2" placeholder={mode === "unlock" ? "Optional password" : "Optional password / hint"} disabled={isBusy} />
                  )}
                </div>
              )}

              {(mode === "watermark" || mode === "protect") && (
                <div className="md:col-span-2">
                  <label className="timecode">Watermark text</label>
                  <input type="text" value={watermark} onChange={(e) => setWatermark(e.target.value)} className="field mt-2" placeholder="Workbook draft" disabled={isBusy} />
                </div>
              )}
            </div>

            {mode === "reorder" && pageCount > 0 && (
              <div className="card flex flex-col gap-2">
                <p className="eyebrow">{pageCount} pages</p>
                {pageOrder.map((page, index) => (
                  <div key={page} className="flex items-center gap-3 pb-2 border-b border-[var(--border)] last:border-0 last:pb-0">
                    <span className="timecode w-6">{String(page + 1).padStart(2, "0")}</span>
                    <span className="text-sm text-[var(--text-primary)] flex-1">Page {page + 1}</span>
                    <button type="button" onClick={() => handleMovePage(index, -1)} disabled={index === 0} className="btn btn--ghost disabled:opacity-30" style={{ height: "1.75rem", width: "1.75rem", padding: 0 }}>
                      <ArrowUp size={13} strokeWidth={1.75} />
                    </button>
                    <button type="button" onClick={() => handleMovePage(index, 1)} disabled={index === pageOrder.length - 1} className="btn btn--ghost disabled:opacity-30" style={{ height: "1.75rem", width: "1.75rem", padding: 0 }}>
                      <ArrowDown size={13} strokeWidth={1.75} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => void handleRun()} disabled={isBusy || files.length === 0} className="btn btn--primary disabled:opacity-50">
                <Wrench size={15} strokeWidth={1.75} />
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
                <ProgressBar label="Processing PDF" completed={progress?.completed ?? 0} total={progress?.total ?? 1} />
              </div>
            )}

            {error && (
              <div className="card" style={{ borderColor: "var(--alert)" }}>
                <p className="text-sm" style={{ color: "var(--alert)" }}>
                  {error}
                </p>
              </div>
            )}

            {result?.kind === "pdf" && result.blob && (
              <div className="card flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <FileText size={18} strokeWidth={1.5} className="text-[var(--accent)]" />
                  <span className="eyebrow">Ready to download</span>
                </div>
                <p className="text-sm text-[var(--text-primary)]">
                  {result.filename} &middot; {result.sizeLabel ?? formatBytes(result.blob.size)}
                </p>
                <button type="button" onClick={handleDownload} className="btn btn--accent w-full sm:w-auto">
                  <Download size={15} strokeWidth={1.75} />
                  Download PDF
                </button>
              </div>
            )}

            {result?.kind === "zip" && result.zip && (
              <ZipDownloadCard
                status="ready"
                fileCount={result.itemCount ?? 0}
                result={result.zip}
                onCompile={() => {}}
                compileLabel="Download images"
              />
            )}

            {result?.kind === "text" && result.text && (
              <div className="card flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <ScanText size={18} strokeWidth={1.5} className="text-[var(--accent)]" />
                  <span className="eyebrow">OCR output</span>
                </div>
                <textarea className="field min-h-72 font-mono text-xs" readOnly value={result.text} />
                <button type="button" onClick={handleDownloadText} className="btn btn--secondary w-full sm:w-auto">
                  <Download size={15} strokeWidth={1.75} />
                  Download text file
                </button>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
