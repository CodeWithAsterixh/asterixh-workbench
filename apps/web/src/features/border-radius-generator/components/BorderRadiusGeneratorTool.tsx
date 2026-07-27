"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export function BorderRadiusGeneratorTool() {
  const [tl, setTl] = useState(24);
  const [tr, setTr] = useState(24);
  const [br, setBr] = useState(24);
  const [bl, setBl] = useState(24);
  const [copied, setCopied] = useState(false);

  const value = `${tl}px ${tr}px ${br}px ${bl}px`;

  const copyCss = async () => {
    await navigator.clipboard.writeText(`border-radius: ${value};`);
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
            { label: "Top left", value: tl, setter: setTl },
            { label: "Top right", value: tr, setter: setTr },
            { label: "Bottom right", value: br, setter: setBr },
            { label: "Bottom left", value: bl, setter: setBl },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between">
                <label>{item.label}</label>
                <span className="timecode">{item.value}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="160"
                value={item.value}
                onChange={(e) => item.setter(Number(e.target.value))}
                className="w-full"
              />
            </div>
          ))}
        </div>

        <div className="card flex flex-col gap-4">
          <span className="eyebrow">Preview</span>
          <div
            className="h-72 border border-[var(--border)] bg-[var(--surface-sunken)]"
            style={{ borderRadius: value }}
          />
          <p className="text-sm text-secondary">border-radius: {value};</p>
        </div>
      </div>
    </div>
  );
}
