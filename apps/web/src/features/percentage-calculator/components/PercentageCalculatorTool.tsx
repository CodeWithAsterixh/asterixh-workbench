"use client";

import { useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";

type Operation = "of" | "increase" | "decrease";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
  }).format(value);
}

export function PercentageCalculatorTool() {
  const [amount, setAmount] = useState("250");
  const [percentage, setPercentage] = useState("15");
  const [operation, setOperation] = useState<Operation>("of");
  const [copied, setCopied] = useState(false);

  const base = Number(amount);
  const rate = Number(percentage);
  const valid = Number.isFinite(base) && Number.isFinite(rate);
  const delta = valid ? (base * rate) / 100 : 0;
  const finalValue =
    operation === "of" ? delta : operation === "increase" ? base + delta : base - delta;

  const summary = valid
    ? operation === "of"
      ? `${formatNumber(rate)}% of ${formatNumber(base)} = ${formatNumber(delta)}`
      : operation === "increase"
        ? `${formatNumber(base)} increased by ${formatNumber(rate)}% = ${formatNumber(finalValue)}`
        : `${formatNumber(base)} decreased by ${formatNumber(rate)}% = ${formatNumber(finalValue)}`
    : "Enter valid numbers";

  const copySummary = async () => {
    if (!valid) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card flex flex-col gap-4">
          <label htmlFor="amount">Base amount</label>
          <input
            id="amount"
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="field"
          />
        </div>

        <div className="card flex flex-col gap-4">
          <label htmlFor="percentage">Percentage</label>
          <input
            id="percentage"
            type="number"
            step="any"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            className="field"
          />
        </div>
      </div>

      <div className="card flex flex-col gap-4">
        <label>Operation</label>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { id: "of", label: "Percent of amount" },
            { id: "increase", label: "Increase by %" },
            { id: "decrease", label: "Decrease by %" },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setOperation(option.id as Operation)}
              className="rounded-2xl border px-4 py-3 text-left transition-colors"
              style={{
                borderColor: operation === option.id ? "var(--accent)" : "var(--border)",
                background: operation === option.id ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent",
              }}
            >
              <span className="block text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copySummary} className="btn btn--primary">
          {copied ? <Check size={15} strokeWidth={1.75} /> : <Copy size={15} strokeWidth={1.75} />}
          {copied ? "Copied" : "Copy summary"}
        </button>
        <button
          type="button"
          onClick={() => {
            setAmount("250");
            setPercentage("15");
            setOperation("of");
          }}
          className="btn btn--secondary"
        >
          <RotateCcw size={15} strokeWidth={1.75} />
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <span className="eyebrow">Percentage value</span>
          <p className="mt-3 text-sm font-mono">{valid ? formatNumber(delta) : "Enter valid numbers"}</p>
        </div>
        <div className="card">
          <span className="eyebrow">Final amount</span>
          <p className="mt-3 text-sm font-mono">{valid ? formatNumber(finalValue) : "Enter valid numbers"}</p>
        </div>
        <div className="card">
          <span className="eyebrow">Formula</span>
          <p className="mt-3 text-sm">{valid ? summary : "The calculator updates as you type."}</p>
        </div>
      </div>
    </div>
  );
}
