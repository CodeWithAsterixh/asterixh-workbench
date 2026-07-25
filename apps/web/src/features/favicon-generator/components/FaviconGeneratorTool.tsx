"use client";

import { RotateCcw } from "lucide-react";
import { FileDropzone } from "@/components/tool-ui/FileDropzone";
import { ProgressBar } from "@/components/tool-ui/ProgressBar";
import { ZipDownloadCard } from "@/components/tool-ui/ZipDownloadCard";
import { Reveal } from "@/lib/animations";
import { useFaviconGenerator } from "../lib/useFaviconGenerator";

export function FaviconGeneratorTool() {
  const { status, icons, progress, zipResult, error, generate, compileZip, reset } = useFaviconGenerator();

  const isBusy = status === "generating" || status === "zipping";
  const hasResult = status === "ready" || status === "zipping" || status === "zip-ready";

  return (
    <div className="flex flex-col gap-8">
      {!hasResult && (
        <Reveal>
          <FileDropzone
            accept="image/*"
            onFiles={(files) => files[0] && void generate(files[0])}
            disabled={isBusy}
            title="Drop a square-ish source image, or click to browse"
            hint="PNG or JPEG, ideally 512\u00d7512 or larger"
          />
        </Reveal>
      )}

      {status === "generating" && (
        <div className="card">
          <ProgressBar label="Generating icon sizes" completed={progress?.completed ?? 0} total={progress?.total ?? 6} />
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
              <span className="eyebrow">{icons.length} sizes generated</span>
              <button type="button" onClick={reset} className="btn btn--ghost text-sm">
                <RotateCcw size={14} strokeWidth={1.75} />
                Start over
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {icons.map((icon) => (
                <div key={icon.filename} className="card flex flex-col items-center text-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={icon.dataUrl}
                    alt={`${icon.size}\u00d7${icon.size} icon`}
                    width={Math.min(icon.size, 64)}
                    height={Math.min(icon.size, 64)}
                    style={{ imageRendering: icon.size <= 32 ? "pixelated" : "auto" }}
                  />
                  <div>
                    <p className="text-sm text-[var(--text-primary)]">
                      {icon.size}\u00d7{icon.size}
                    </p>
                    <p className="timecode mt-1">{icon.purpose}</p>
                  </div>
                </div>
              ))}
            </div>

            <ZipDownloadCard
              status={status === "zip-ready" ? "ready" : status === "zipping" ? "compiling" : "idle"}
              fileCount={icons.length + 2}
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
