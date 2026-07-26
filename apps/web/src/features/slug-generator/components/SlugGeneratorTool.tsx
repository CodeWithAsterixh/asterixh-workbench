"use client";

import { useState, type ChangeEvent } from "react";
import { Check, Copy, Trash2 } from "lucide-react";

const SAMPLE = "Build Better Browser Tools Fast";

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function SlugGeneratorTool() {
  const [text, setText] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);

  const slug = slugify(text);

  const copySlug = async () => {
    if (!slug) return;
    await navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copySlug} className="btn btn--primary">
          {copied ? <Check size={15} strokeWidth={1.75} /> : <Copy size={15} strokeWidth={1.75} />}
          {copied ? "Copied" : "Copy slug"}
        </button>
        <button type="button" onClick={() => setText(SAMPLE)} className="btn btn--secondary">
          Load sample
        </button>
        <button type="button" onClick={() => setText("")} className="btn btn--ghost">
          <Trash2 size={15} strokeWidth={1.75} />
          Clear
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <label htmlFor="slug-input">Text</label>
          <textarea
            id="slug-input"
            value={text}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
            rows={10}
            className="field w-full resize-y"
            style={{ height: "auto", padding: "var(--space-md)" }}
          />
        </div>

        <div className="card flex flex-col gap-4">
          <span className="eyebrow">Slug output</span>
          <p className="break-all rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 text-sm font-mono">
            {slug || "slug-preview"}
          </p>
          <p className="text-secondary text-sm leading-relaxed">
            The generator removes punctuation, collapses whitespace, strips accents, and keeps
            only lowercase letters, numbers, and hyphens.
          </p>
        </div>
      </div>
    </div>
  );
}
