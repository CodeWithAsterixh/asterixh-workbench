"use client";

import { useState, type ChangeEvent } from "react";
import { RotateCcw, Palette, Copy, Check, Download } from "lucide-react";
import { FileDropzone } from "@/components/tool-ui/FileDropzone";
import { Reveal } from "@/lib/animations";
import { useDesignTokens } from "../lib/useDesignTokens";

const FORMAT_TABS = [
  { id: "css", label: "CSS" },
  { id: "tailwind", label: "Tailwind" },
  { id: "json", label: "JSON" },
] as const;

type FormatTab = (typeof FORMAT_TABS)[number]["id"];

export function DesignTokensTool() {
  const { status, palette, error, css, tailwind, json, extract, downloadAll, reset } = useDesignTokens();
  const [colorCount, setColorCount] = useState(6);
  const [tab, setTab] = useState<FormatTab>("css");
  const [copied, setCopied] = useState(false);

  const isBusy = status === "extracting";
  const hasResult = status === "ready";
  const output = tab === "css" ? css : tab === "tailwind" ? tailwind : json;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      {!hasResult && (
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <FileDropzone
              accept="image/*"
              onFiles={(files) => files[0] && void extract(files[0], colorCount)}
              disabled={isBusy}
              title="Drop an image, or click to browse"
              hint="Any photo, screenshot, or illustration"
              icon={<Palette size={28} strokeWidth={1.25} className="text-[var(--text-tertiary)]" />}
            />

            <div className="card">
              <label htmlFor="color-count">Colors to extract</label>
              <div className="flex items-center gap-3">
                <input
                  id="color-count"
                  type="range"
                  min={3}
                  max={10}
                  value={colorCount}
                  disabled={isBusy}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setColorCount(Number(e.target.value))}
                  className="w-full accent-[var(--accent)]"
                />
                <span className="timecode w-6 text-right">{colorCount}</span>
              </div>
              <p className="timecode mt-4">Drop an image on the left to extract its palette.</p>
            </div>
          </div>
        </Reveal>
      )}

      {isBusy && (
        <div className="card">
          <span className="eyebrow">Extracting palette</span>
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
              <span className="eyebrow">{palette.length} colors extracted</span>
              <button type="button" onClick={reset} className="btn btn--ghost text-sm">
                <RotateCcw size={14} strokeWidth={1.75} />
                Start over
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {palette.map((c) => (
                <div key={c.hex} className="flex flex-col items-center gap-2">
                  <div className="w-full aspect-square panel-frame" style={{ background: c.hex }} />
                  <code className="timecode">{c.hex}</code>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                <div className="flex gap-2">
                  {FORMAT_TABS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTab(t.id)}
                      className="btn btn--ghost"
                      style={{
                        borderBottom: `2px solid ${tab === t.id ? "var(--accent)" : "transparent"}`,
                        color: tab === t.id ? "var(--text-primary)" : undefined,
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={handleCopy} className="btn btn--secondary">
                  {copied ? <Check size={15} strokeWidth={1.75} /> : <Copy size={15} strokeWidth={1.75} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre>
                <code>{output}</code>
              </pre>
            </div>

            <button type="button" onClick={() => void downloadAll()} className="btn btn--accent w-full sm:w-auto">
              <Download size={15} strokeWidth={1.75} />
              Download all formats (.zip)
            </button>
          </div>
        </Reveal>
      )}
    </div>
  );
}
