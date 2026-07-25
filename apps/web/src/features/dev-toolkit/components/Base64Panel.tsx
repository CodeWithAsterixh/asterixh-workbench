"use client";

import { useState, type ChangeEvent } from "react";
import { ArrowDownUp, AlertTriangle } from "lucide-react";
import { encodeBase64, decodeBase64 } from "../lib/dev-toolkit";

export function Base64Panel() {
  const [plain, setPlain] = useState("Workbench runs entirely in your browser.");
  const [encoded, setEncoded] = useState(() => encodeBase64("Workbench runs entirely in your browser."));
  const [error, setError] = useState<string | null>(null);

  const handlePlainChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setPlain(next);
    setError(null);
    try {
      setEncoded(encodeBase64(next));
    } catch {
      setError("Couldn't encode that text.");
    }
  };

  const handleEncodedChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setEncoded(next);
    try {
      setPlain(decodeBase64(next));
      setError(null);
    } catch {
      setError("That doesn't look like valid base64.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div>
          <label htmlFor="b64-plain">Plain text</label>
          <textarea
            id="b64-plain"
            value={plain}
            onChange={handlePlainChange}
            rows={8}
            spellCheck={false}
            className="field w-full resize-y"
            style={{ height: "auto", padding: "var(--space-md)" }}
          />
        </div>
        <div>
          <label htmlFor="b64-encoded">Base64</label>
          <textarea
            id="b64-encoded"
            value={encoded}
            onChange={handleEncodedChange}
            rows={8}
            spellCheck={false}
            className="field w-full resize-y"
            style={{ height: "auto", padding: "var(--space-md)", fontFamily: "var(--font-mono)" }}
          />
        </div>
      </div>
      <p className="timecode flex items-center gap-2">
        <ArrowDownUp size={13} strokeWidth={1.75} />
        Edit either side \u2014 the other updates automatically
      </p>
      {error && (
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--alert)" }}>
          <AlertTriangle size={14} strokeWidth={1.75} />
          {error}
        </div>
      )}
    </div>
  );
}
