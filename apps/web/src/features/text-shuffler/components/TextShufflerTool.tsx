"use client";

import { useState, type ChangeEvent } from "react";
import { Shuffle, Copy, Check } from "lucide-react";
import { DELIMITER_PRESETS, shuffleText, type ShuffleOutcome } from "../lib/shuffle-text";
import { cn } from "@/lib/utils";

const SAMPLE_TEXT =
  "the crown of life, not hurt at all by the second death, the hidden manna, the authority to rule all nations with an iron scepter, name written in the book of life, write on him God’s name, the name of the Holy City, the new Jerusalem, and Jesus’ new name";

export function TextShufflerTool() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [delimiter, setDelimiter] = useState(",");
  const [trimPieces, setTrimPieces] = useState(true);
  const [outcome, setOutcome] = useState<ShuffleOutcome | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShuffle = () => {
    setOutcome(shuffleText(text, delimiter, trimPieces));
  };

  const handleCopy = async () => {
    if (!outcome) return;
    await navigator.clipboard.writeText(outcome.result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const delimiterPreview = JSON.stringify(delimiter);
  const canShuffle = text.trim().length > 0 && delimiter !== "";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <label htmlFor="shuffle-input">Text</label>
        <textarea
          id="shuffle-input"
          value={text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
          rows={6}
          className="field w-full resize-y"
          style={{ height: "auto", padding: "var(--space-md)" }}
        />
      </div>

      <div className="card flex flex-col gap-6">
        <label>Split &amp; join with</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {DELIMITER_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setDelimiter(preset.value)}
              className={cn("badge", delimiter === preset.value ? "badge--accent" : "")}
              style={{ cursor: "pointer" }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={delimiter}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDelimiter(e.target.value)}
            placeholder="Custom delimiter"
            className="field flex-1"
            style={{ fontFamily: "var(--font-mono)" }}
          />
          <span className="timecode whitespace-nowrap">currently {delimiterPreview}</span>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            id="trim-pieces"
            type="checkbox"
            checked={trimPieces}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTrimPieces(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          <label htmlFor="trim-pieces" className="mb-0" style={{ textTransform: "none" }}>
            Trim whitespace from each piece
          </label>
        </div>

        <button type="button" onClick={handleShuffle} disabled={!canShuffle} className="btn btn--primary w-full mt-6 disabled:opacity-50">
          <Shuffle size={15} strokeWidth={1.75} />
          Shuffle
        </button>
        {delimiter === "" && <p className="timecode mt-2">An empty delimiter shuffles individual characters.</p>}
      </div>

      {outcome && (
        <div className="flex flex-col gap-6">
          {outcome.pieces.length <= 1 ? (
            <div className="card" style={{ borderColor: "var(--alert)" }}>
              <p className="text-sm" style={{ color: "var(--alert)" }}>
                That delimiter only produced {outcome.pieces.length} piece{outcome.pieces.length === 1 ? "" : "s"} —
                nothing to shuffle. Try a different delimiter.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="eyebrow">{outcome.pieces.length} pieces shuffled</span>
                <button type="button" onClick={handleCopy} className="btn btn--secondary text-sm">
                  {copied ? <Check size={14} strokeWidth={1.75} /> : <Copy size={14} strokeWidth={1.75} />}
                  {copied ? "Copied" : "Copy result"}
                </button>
              </div>

              <div className="card">
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-(--text-primary)">{outcome.result}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {outcome.shuffled.map((piece, i) => (
                  <span key={`${piece}-${i}`} className="badge">
                    {piece || "—"}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
