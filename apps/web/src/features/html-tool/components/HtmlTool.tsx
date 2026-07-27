"use client";

import { useState, type ChangeEvent } from "react";
import { ArrowRightLeft, Check, Copy, Trash2 } from "lucide-react";

const SAMPLE = `<button class="btn">Save & Continue</button>`;

function encodeHtml(value: string) {
  const div = document.createElement("div");
  div.innerText = value;
  return div.innerHTML;
}

function decodeHtml(value: string) {
  const div = document.createElement("div");
  div.innerHTML = value;
  return div.textContent || "";
}

export function HtmlTool() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setOutput(encodeHtml(input))} className="btn btn--primary">
          <ArrowRightLeft size={15} strokeWidth={1.75} />
          Encode
        </button>
        <button type="button" onClick={() => setOutput(decodeHtml(input))} className="btn btn--secondary">
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
          <label htmlFor="html-input">Input</label>
          <textarea
            id="html-input"
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            rows={12}
            className="field w-full resize-y"
            style={{ height: "auto", padding: "var(--space-md)", fontFamily: "var(--font-mono)" }}
          />
        </div>
        <div>
          <label htmlFor="html-output">Output</label>
          <textarea
            id="html-output"
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
