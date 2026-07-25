"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { Copy, Check } from "lucide-react";
import { HASH_ALGORITHMS, hashText, type HashAlgorithm } from "../lib/dev-toolkit";

export function HashPanel() {
  const [text, setText] = useState("Workbench");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [hash, setHash] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    hashText(text, algorithm).then((result) => {
      if (!cancelled) setHash(result);
    });
    return () => {
      cancelled = true;
    };
  }, [text, algorithm]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="hash-input">Text</label>
        <textarea
          id="hash-input"
          value={text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
          rows={6}
          spellCheck={false}
          className="field w-full resize-y"
          style={{ height: "auto", padding: "var(--space-md)" }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {HASH_ALGORITHMS.map((algo) => (
          <button
            key={algo}
            type="button"
            onClick={() => setAlgorithm(algo)}
            className={`badge ${algorithm === algo ? "badge--accent" : ""}`}
            style={{ cursor: "pointer" }}
          >
            {algo}
          </button>
        ))}
      </div>

      <div className="card flex items-center justify-between gap-4">
        <code className="text-sm break-all text-(--text-primary)">{hash}</code>
        <button type="button" onClick={handleCopy} className="btn btn--secondary flex-shrink-0">
          {copied ? <Check size={15} strokeWidth={1.75} /> : <Copy size={15} strokeWidth={1.75} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="timecode">MD5 isn&apos;t offered — the Web Crypto API only implements the SHA family.</p>
    </div>
  );
}
