"use client";

import { useState, type ChangeEvent } from "react";
import { Check, Copy, ArrowRightLeft, Trash2 } from "lucide-react";
import { decodeBase64, encodeBase64 } from "@/features/dev-toolkit/lib/dev-toolkit";

const SAMPLE = "Workbench keeps browser utilities fast and private.";

export function Base64Tool() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    try {
      setOutput(encodeBase64(input));
      setError(null);
    } catch {
      setError("Could not encode the current text.");
    }
  };

  const handleDecode = () => {
    try {
      setOutput(decodeBase64(input));
      setError(null);
    } catch {
      setError("That input is not valid Base64.");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={handleEncode} className="btn btn--primary">
          <ArrowRightLeft size={15} strokeWidth={1.75} />
          Encode
        </button>
        <button type="button" onClick={handleDecode} className="btn btn--secondary">
          <ArrowRightLeft size={15} strokeWidth={1.75} />
          Decode
        </button>
        <button type="button" onClick={copyOutput} className="btn btn--secondary">
          {copied ? <Check size={15} strokeWidth={1.75} /> : <Copy size={15} strokeWidth={1.75} />}
          {copied ? "Copied" : "Copy output"}
        </button>
        <button
          type="button"
          onClick={() => {
            setInput("");
            setOutput("");
            setError(null);
          }}
          className="btn btn--ghost"
        >
          <Trash2 size={15} strokeWidth={1.75} />
          Clear
        </button>
      </div>

      {error && (
        <div className="card" style={{ borderColor: "var(--alert)", color: "var(--alert)" }}>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label htmlFor="base64-input">Input</label>
          <textarea
            id="base64-input"
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            rows={14}
            className="field w-full resize-y"
            style={{ height: "auto", padding: "var(--space-md)" }}
          />
        </div>

        <div>
          <label htmlFor="base64-output">Output</label>
          <textarea
            id="base64-output"
            value={output}
            readOnly
            rows={14}
            className="field w-full resize-y"
            style={{ height: "auto", padding: "var(--space-md)", fontFamily: "var(--font-mono)" }}
          />
        </div>
      </div>
    </div>
  );
}
