"use client";

import { useState, type ChangeEvent } from "react";
import { Copy, Trash2 } from "lucide-react";

const SAMPLE_TEXT =
  "Workbench turns browser tasks into focused tools. Paste in a draft, a note, or an article and get an instant read on length, structure, and reading time.";

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

function countSentences(text: string) {
  if (!text.trim()) return 0;
  return text.match(/[.!?]+(?:\s|$)/g)?.length ?? 1;
}

export function WordCounterTool() {
  const [text, setText] = useState(SAMPLE_TEXT);

  const words = countWords(text);
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const lines = text.length ? text.split(/\r\n|\r|\n/).length : 0;
  const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).filter(Boolean).length : 0;
  const sentences = countSentences(text);
  const readingTime = words > 0 ? Math.max(1, Math.ceil(words / 200)) : 0;

  const copyText = async () => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setText(SAMPLE_TEXT)} className="btn btn--secondary">
          Load sample
        </button>
        <button type="button" onClick={() => setText("")} className="btn btn--ghost">
          <Trash2 size={15} strokeWidth={1.75} />
          Clear
        </button>
        <button type="button" onClick={copyText} className="btn btn--primary">
          <Copy size={15} strokeWidth={1.75} />
          Copy text
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <label htmlFor="word-counter-input">Text</label>
          <textarea
            id="word-counter-input"
            value={text}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
            rows={18}
            className="field w-full resize-y"
            style={{ height: "auto", padding: "var(--space-md)" }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
          {[
            { label: "Words", value: words },
            { label: "Characters", value: characters },
            { label: "Characters no spaces", value: charactersNoSpaces },
            { label: "Lines", value: lines },
            { label: "Paragraphs", value: paragraphs },
            { label: "Sentences", value: sentences },
            { label: "Reading time", value: readingTime > 0 ? `${readingTime} min` : "0 min" },
          ].map((item) => (
            <div key={item.label} className="card">
              <span className="eyebrow">{item.label}</span>
              <p className="mt-3 text-sm font-mono">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
