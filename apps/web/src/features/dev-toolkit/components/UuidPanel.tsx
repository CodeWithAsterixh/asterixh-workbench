"use client";

import { useState, type ChangeEvent } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { generateUuids } from "../lib/dev-toolkit";

export function UuidPanel() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() => generateUuids(5));
  const [copiedAll, setCopiedAll] = useState(false);

  const regenerate = () => setUuids(generateUuids(count));

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="uuid-count" className="mb-0">
            Count
          </label>
          <input
            id="uuid-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCount(Number(e.target.value) || 1)}
            className="field"
            style={{ width: "5rem" }}
          />
        </div>
        <button type="button" onClick={regenerate} className="btn btn--primary">
          <RefreshCw size={15} strokeWidth={1.75} />
          Generate
        </button>
        <button type="button" onClick={handleCopyAll} className="btn btn--secondary">
          {copiedAll ? <Check size={15} strokeWidth={1.75} /> : <Copy size={15} strokeWidth={1.75} />}
          {copiedAll ? "Copied" : "Copy all"}
        </button>
      </div>

      <div className="card flex flex-col gap-2">
        {uuids.map((id) => (
          <code key={id} className="text-sm">
            {id}
          </code>
        ))}
      </div>
    </div>
  );
}
