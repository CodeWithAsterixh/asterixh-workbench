"use client";

import { useState, type ChangeEvent } from "react";
import { ArrowRightLeft, Check, Copy, Trash2 } from "lucide-react";

const SAMPLE = "https://workbench.tools/search?q=browser tools&section=home";

export function UrlTool() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const encode = () => {
    setOutput(encodeURIComponent(input));
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch {
      setOutput("Invalid URI component");
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
        <button type="button" onClick={encode} className="btn btn--primary">
          <ArrowRightLeft size={15} strokeWidth={1.75} />
          Encode
        </button>
        <button type="button" onClick={decode} className="btn btn--secondary">
          <ArrowRightLeft size={15} strokeWidth={1.75} />
          Decode
        </button>
        <button type="button" onClick={copyOutput} className="btn btn--secondary">
          {copied ? <Check size={15} strokeWidth={1.75} /> : <Copy size={15} strokeWidth={1.75} />}
          {copied ? "Copied" : "Copy output"}
        </button>
        <button type="button" onClick={() => { setInput(""); setOutput(""); }} className="btn btn--ghost">
          <Trash2 size={15} strokeWidth={1.75} />
          Clear
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label htmlFor="url-input">Input</label>
          <textarea
            id="url-input"
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            rows={12}
            className="field w-full resize-y"
            style={{ height: "auto", padding: "var(--space-md)", fontFamily: "var(--font-mono)" }}
          />
        </div>
        <div>
          <label htmlFor="url-output">Output</label>
          <textarea
            id="url-output"
            value={output}
            readOnly
            rows={12}
            className="field w-full resize-y"
            style={{ height: "auto", padding: "var(--space-md)", fontFamily: "var(--font-mono)" }}
          />
        </div>
      </div>
    </div>
  );
}
