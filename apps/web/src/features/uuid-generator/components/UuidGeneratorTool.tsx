"use client";

import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";

const DEFAULT_COUNT = 8;

function buildBatch(count: number) {
  return Array.from({ length: count }, () => crypto.randomUUID());
}

export function UuidGeneratorTool() {
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [values, setValues] = useState<string[]>(() => buildBatch(DEFAULT_COUNT));
  const [copied, setCopied] = useState(false);

  const regenerate = () => {
    setValues(buildBatch(count));
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(values.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2">
          <label htmlFor="uuid-count">How many UUIDs?</label>
          <input
            id="uuid-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
            className="field w-32"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={regenerate} className="btn btn--primary">
            <RefreshCw size={15} strokeWidth={1.75} />
            Generate
          </button>
          <button type="button" onClick={copyAll} className="btn btn--secondary">
            {copied ? <Check size={15} strokeWidth={1.75} /> : <Copy size={15} strokeWidth={1.75} />}
            {copied ? "Copied" : "Copy all"}
          </button>
        </div>
      </div>

      <div className="card flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <span className="eyebrow">Generated locally</span>
          <span className="timecode">{values.length} UUIDs</span>
        </div>

        <div className="grid gap-3">
          {values.map((value, index) => (
            <div key={value} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="timecode">#{index + 1}</span>
                <code className="text-sm break-all">{value}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
