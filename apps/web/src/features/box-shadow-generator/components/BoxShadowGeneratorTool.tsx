"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export function BoxShadowGeneratorTool() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(20);
  const [blur, setBlur] = useState(40);
  const [spread, setSpread] = useState(-12);
  const [opacity, setOpacity] = useState(0.2);
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  const css = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px rgba(23, 21, 15, ${opacity})`;

  const copyCss = async () => {
    await navigator.clipboard.writeText(`box-shadow: ${css};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copyCss} className="btn btn--primary">
          <Copy size={15} strokeWidth={1.75} />
          {copied ? "Copied" : "Copy CSS"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card flex flex-col gap-4">
          {[
            { label: "X offset", value: x, setter: setX, min: -80, max: 80, step: 1 },
            { label: "Y offset", value: y, setter: setY, min: -80, max: 80, step: 1 },
            { label: "Blur", value: blur, setter: setBlur, min: 0, max: 120, step: 1 },
            { label: "Spread", value: spread, setter: setSpread, min: -80, max: 80, step: 1 },
            { label: "Opacity", value: opacity, setter: setOpacity, min: 0, max: 1, step: 0.01 },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between">
                <label>{item.label}</label>
                <span className="timecode">{String(item.value)}</span>
              </div>
              <input
                type="range"
                min={item.min}
                max={item.max}
                step={item.step}
                value={item.value}
                onChange={(e) => item.setter(Number(e.target.value))}
                className="w-full"
              />
            </div>
          ))}
          <label className="flex items-center gap-3 mt-2">
            <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} />
            Inset shadow
          </label>
        </div>

        <div className="card flex flex-col gap-4">
          <span className="eyebrow">Preview</span>
          <div className="grid place-items-center rounded-[var(--radius-sharp)] border border-[var(--border)] bg-[var(--surface-sunken)] p-10">
            <div
              className="h-40 w-40 rounded-[var(--radius-sharp)] bg-[var(--surface-raised)]"
              style={{ boxShadow: css }}
            />
          </div>
          <p className="text-sm text-secondary">box-shadow: {css};</p>
        </div>
      </div>
    </div>
  );
}
