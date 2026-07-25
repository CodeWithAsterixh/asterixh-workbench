"use client";

import type { ChangeEvent } from "react";
import { Download, FileImage } from "lucide-react";
import { useQrCode } from "../lib/useQrCode";
import type { ErrorCorrectionLevel } from "../lib/generate-qr";

const ERROR_LEVELS: { value: ErrorCorrectionLevel; label: string }[] = [
  { value: "L", label: "L \u2014 low (7%)" },
  { value: "M", label: "M \u2014 medium (15%)" },
  { value: "Q", label: "Q \u2014 quartile (25%)" },
  { value: "H", label: "H \u2014 high (30%)" },
];

export function QrCodeTool() {
  const { options, update, setErrorCorrectionLevel, pngUrl, error, downloadPng, downloadSvg } = useQrCode();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="card">
        <label htmlFor="qr-text">Text or URL</label>
        <textarea
          id="qr-text"
          value={options.text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => update("text", e.target.value)}
          rows={3}
          spellCheck={false}
          className="field w-full resize-y"
          style={{ height: "auto", padding: "var(--space-md)" }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div>
            <label htmlFor="ec-level">Error correction</label>
            <select
              id="ec-level"
              className="field"
              value={options.errorCorrectionLevel}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setErrorCorrectionLevel(e.target.value as ErrorCorrectionLevel)}
            >
              {ERROR_LEVELS.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="qr-size">Size</label>
            <div className="flex items-center gap-3">
              <input
                id="qr-size"
                type="range"
                min={128}
                max={1024}
                step={32}
                value={options.size}
                onChange={(e: ChangeEvent<HTMLInputElement>) => update("size", Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
              <span className="timecode w-14 text-right">{options.size}px</span>
            </div>
          </div>

          <div>
            <label htmlFor="dark-color">Foreground</label>
            <div className="flex items-center gap-2">
              <input
                id="dark-color"
                type="color"
                value={options.darkColor}
                onChange={(e: ChangeEvent<HTMLInputElement>) => update("darkColor", e.target.value)}
                style={{ width: "2.75rem", height: "2.75rem", padding: 0, border: "1px solid var(--border)", background: "none" }}
              />
              <code className="timecode">{options.darkColor}</code>
            </div>
          </div>

          <div>
            <label htmlFor="light-color">Background</label>
            <div className="flex items-center gap-2">
              <input
                id="light-color"
                type="color"
                value={options.lightColor}
                onChange={(e: ChangeEvent<HTMLInputElement>) => update("lightColor", e.target.value)}
                style={{ width: "2.75rem", height: "2.75rem", padding: 0, border: "1px solid var(--border)", background: "none" }}
              />
              <code className="timecode">{options.lightColor}</code>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm mt-4" style={{ color: "var(--alert)" }}>
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="panel-frame p-6 flex items-center justify-center" style={{ background: options.lightColor, minHeight: "16rem", width: "100%" }}>
          {pngUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pngUrl} alt="Generated QR code" style={{ maxWidth: "100%", height: "auto" }} />
          ) : (
            <div className="flex flex-col items-center gap-2 text-[var(--text-tertiary)]">
              <FileImage size={28} strokeWidth={1.25} />
              <p className="timecode">Enter text to generate a code</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 w-full">
          <button type="button" onClick={downloadPng} disabled={!pngUrl} className="btn btn--accent flex-1 disabled:opacity-50">
            <Download size={15} strokeWidth={1.75} />
            Download PNG
          </button>
          <button type="button" onClick={() => void downloadSvg()} disabled={!pngUrl} className="btn btn--secondary flex-1 disabled:opacity-50">
            <Download size={15} strokeWidth={1.75} />
            Download SVG
          </button>
        </div>
      </div>
    </div>
  );
}
