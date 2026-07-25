"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { AlertTriangle } from "lucide-react";
import { runRegex } from "../lib/run-regex";

const FLAG_OPTIONS: { flag: string; label: string; hint: string }[] = [
  { flag: "g", label: "g", hint: "global — find all matches" },
  { flag: "i", label: "i", hint: "case-insensitive" },
  { flag: "m", label: "m", hint: "multiline ^$" },
  { flag: "s", label: "s", hint: "dot matches newline" },
  { flag: "u", label: "u", hint: "unicode" },
];

const SAMPLE_TEXT = `Contact us at hello@workbench.dev or sales@workbench.dev.
Order #4821 shipped on 2026-07-18.`;

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("[\\w.+-]+@[\\w-]+\\.[\\w.-]+");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState(SAMPLE_TEXT);

  const result = useMemo(() => runRegex(pattern, flags, text), [pattern, flags, text]);

  const toggleFlag = (flag: string) => {
    setFlags((prev) => (prev.includes(flag) ? prev.replace(flag, "") : prev + flag));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="card">
        <label htmlFor="pattern">Pattern</label>
        <div className="flex items-center gap-2">
          <span className="timecode">/</span>
          <input
            id="pattern"
            type="text"
            value={pattern}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPattern(e.target.value)}
            className="field flex-1"
            style={{ fontFamily: "var(--font-mono)" }}
            spellCheck={false}
            placeholder="pattern"
          />
          <span className="timecode">/{flags}</span>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          {FLAG_OPTIONS.map((opt) => (
            <label key={opt.flag} className="flex items-center gap-2 cursor-pointer" style={{ textTransform: "none" }}>
              <input
                type="checkbox"
                checked={flags.includes(opt.flag)}
                onChange={() => toggleFlag(opt.flag)}
                className="accent-[var(--accent)]"
              />
              <span className="timecode" style={{ textTransform: "none" }}>
                {opt.label} <span className="text-secondary">{opt.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {result.error && (
        <div className="card flex items-start gap-3" style={{ borderColor: "var(--alert)" }}>
          <AlertTriangle size={16} strokeWidth={1.75} className="mt-0.5 flex-shrink-0" style={{ color: "var(--alert)" }} />
          <p className="text-sm" style={{ color: "var(--alert)" }}>
            {result.error}
          </p>
        </div>
      )}

      <div>
        <label htmlFor="test-text">Test string</label>
        <textarea
          id="test-text"
          value={text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
          rows={6}
          spellCheck={false}
          className="field w-full resize-y"
          style={{ height: "auto", padding: "var(--space-md)" }}
        />
      </div>

      <div className="card">
        <span className="eyebrow">
          {result.matches.length} {result.matches.length === 1 ? "match" : "matches"}
        </span>
        <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-(--text-primary)">
          {result.segments.map((seg, i) =>
            seg.matched ? (
              <mark key={i} style={{ background: "var(--accent)", color: "var(--accent-contrast)", padding: "0 2px" }}>
                {seg.text}
              </mark>
            ) : (
              <span key={i}>{seg.text}</span>
            ),
          )}
        </p>
      </div>

      {result.matches.length > 0 && (
        <div className="card">
          <span className="eyebrow mb-4 block">Match details</span>
          <div className="flex flex-col gap-4">
            {result.matches.map((m, i) => (
              <div key={i} className="pb-4 border-b border-[var(--border)] last:border-0 last:pb-0">
                <div className="flex items-center justify-between text-(--accent)">
                  <code className="text-sm">{m.match || "—"}</code>
                  <span className="timecode">at {m.index}</span>
                </div>
                {m.groups.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {m.groups.map((g, gi) => (
                      <span key={gi} className="badge">
                        ${gi + 1}: {g || "—"}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
