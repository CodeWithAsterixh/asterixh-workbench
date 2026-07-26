"use client";

import { useState } from "react";
import { ArrowLeftRight, Copy } from "lucide-react";

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return null;
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) return null;
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function linearize(value: number) {
  const channel = value / 255;
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  return 0.2126 * linearize(rgb.r) + 0.7152 * linearize(rgb.g) + 0.0722 * linearize(rgb.b);
}

function contrastRatio(foreground: string, background: string) {
  const l1 = luminance(foreground);
  const l2 = luminance(background);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

function formatRatio(value: number) {
  return value.toFixed(2);
}

export function ColorContrastCheckerTool() {
  const [foreground, setForeground] = useState("#0f172a");
  const [background, setBackground] = useState("#f8fafc");

  const ratio = contrastRatio(foreground, background);
  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3;
  const aaaNormal = ratio >= 7;

  const copyRatio = async () => {
    await navigator.clipboard.writeText(formatRatio(ratio));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setForeground(background);
            setBackground(foreground);
          }}
          className="btn btn--secondary"
        >
          <ArrowLeftRight size={15} strokeWidth={1.75} />
          Swap
        </button>
        <button type="button" onClick={copyRatio} className="btn btn--primary">
          <Copy size={15} strokeWidth={1.75} />
          Copy ratio
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card flex flex-col gap-4">
          <label htmlFor="foreground">Foreground color</label>
          <div className="flex items-center gap-3">
            <input
              id="foreground"
              type="color"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="h-12 w-16 rounded-xl border border-[var(--border)] bg-transparent p-1"
            />
            <input
              type="text"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="field flex-1 font-mono"
            />
          </div>
        </div>

        <div className="card flex flex-col gap-4">
          <label htmlFor="background">Background color</label>
          <div className="flex items-center gap-3">
            <input
              id="background"
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="h-12 w-16 rounded-xl border border-[var(--border)] bg-transparent p-1"
            />
            <input
              type="text"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="field flex-1 font-mono"
            />
          </div>
        </div>
      </div>

      <div
        className="rounded-[var(--radius-2xl)] border border-[var(--border)] p-10"
        style={{ background: background, color: foreground }}
      >
        <span className="eyebrow" style={{ color: foreground }}>
          Preview
        </span>
        <h2 className="text-display-md mt-4 max-w-2xl" style={{ color: foreground }}>
          Accessible text should remain readable at a glance.
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed" style={{ color: foreground }}>
          This preview shows the current foreground and background pair exactly as they will
          appear in a UI, so you can judge whether the contrast feels strong enough.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card">
          <span className="eyebrow">Contrast ratio</span>
          <p className="mt-3 text-sm font-mono">{formatRatio(ratio)}:1</p>
        </div>
        <div className="card">
          <span className="eyebrow">AA normal text</span>
          <p className="mt-3 text-sm">{aaNormal ? "Pass" : "Fail"}</p>
        </div>
        <div className="card">
          <span className="eyebrow">AA large text</span>
          <p className="mt-3 text-sm">{aaLarge ? "Pass" : "Fail"}</p>
        </div>
        <div className="card">
          <span className="eyebrow">AAA normal text</span>
          <p className="mt-3 text-sm">{aaaNormal ? "Pass" : "Fail"}</p>
        </div>
      </div>
    </div>
  );
}
