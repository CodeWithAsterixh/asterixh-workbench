"use client";

import { useState, type ChangeEvent } from "react";
import { AlignLeft, Minimize2, Copy, Check, Trash2, AlertTriangle } from "lucide-react";
import { formatJson, minifyJson, tryParseJson, countKeys } from "../lib/format-json";

const SAMPLE = `{
  "tool": "JSON Formatter",
  "runsIn": "your browser",
  "formats": ["pretty", "minified"],
  "tags": [1, 2, 3]
}`;

export function JsonFormatterTool() {
  const [value, setValue] = useState(SAMPLE);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const outcome = tryParseJson(value);
  const isValid = value.trim().length === 0 || !outcome.error;
  const keyCount = outcome.data !== undefined ? countKeys(outcome.data) : 0;

  const handleFormat = () => {
    const result = formatJson(value);
    if (result.error) {
      setError(result.position ? `${result.error} (line ${result.position.line}, column ${result.position.column})` : result.error);
      return;
    }
    setError(null);
    setValue(result.formatted ?? value);
  };

  const handleMinify = () => {
    const result = minifyJson(value);
    if (result.error) {
      setError(result.position ? `${result.error} (line ${result.position.line}, column ${result.position.column})` : result.error);
      return;
    }
    setError(null);
    setValue(result.minified ?? value);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`badge ${isValid ? "badge--live" : ""}`} style={!isValid ? { borderColor: "var(--alert)", color: "var(--alert)" } : undefined}>
            {isValid ? "Valid JSON" : "Invalid JSON"}
          </span>
          {isValid && outcome.data !== undefined && <span className="timecode">{keyCount} keys</span>}
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleFormat} className="btn btn--primary">
            <AlignLeft size={15} strokeWidth={1.75} />
            Format
          </button>
          <button type="button" onClick={handleMinify} className="btn btn--secondary">
            <Minimize2 size={15} strokeWidth={1.75} />
            Minify
          </button>
          <button type="button" onClick={handleCopy} className="btn btn--secondary">
            {copied ? <Check size={15} strokeWidth={1.75} /> : <Copy size={15} strokeWidth={1.75} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => {
              setValue("");
              setError(null);
            }}
            className="btn btn--ghost"
          >
            <Trash2 size={15} strokeWidth={1.75} />
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="card flex items-start gap-3" style={{ borderColor: "var(--alert)" }}>
          <AlertTriangle size={16} strokeWidth={1.75} className="mt-0.5 flex-shrink-0" style={{ color: "var(--alert)" }} />
          <p className="text-sm" style={{ color: "var(--alert)" }}>
            {error}
          </p>
        </div>
      )}

      <textarea
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
        spellCheck={false}
        rows={20}
        className="field w-full resize-y"
        style={{ height: "auto", padding: "var(--space-md)", fontFamily: "var(--font-mono)", lineHeight: "var(--leading-snug)" }}
        placeholder="Paste JSON here"
        aria-label="JSON input"
      />
    </div>
  );
}
