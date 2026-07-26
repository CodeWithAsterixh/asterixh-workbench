"use client";

import { useState } from "react";
import { ArrowLeftRight, Copy } from "lucide-react";

const DEFAULT_START = "2026-07-26T09:00";
const DEFAULT_END = "2026-07-27T11:30";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatLocalInput(date: Date) {
  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
  ].join("");
}

function parseDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function breakdown(durationMs: number) {
  const totalSeconds = Math.floor(Math.abs(durationMs) / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, totalSeconds };
}

export function DateDifferenceTool() {
  const [start, setStart] = useState(DEFAULT_START);
  const [end, setEnd] = useState(DEFAULT_END);

  const startDate = parseDate(start);
  const endDate = parseDate(end);
  const valid = Boolean(startDate && endDate);
  const diffMs = valid && startDate && endDate ? endDate.getTime() - startDate.getTime() : 0;
  const breakdownValue = breakdown(diffMs);
  const direction = diffMs >= 0 ? "later than" : "earlier than";

  const summary = valid
    ? `The second date is ${Math.abs(breakdownValue.totalSeconds)} seconds ${direction} the first date.`
    : "Enter two valid dates.";

  const copySummary = async () => {
    if (!valid) return;
    await navigator.clipboard.writeText(summary);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setStart(end);
            setEnd(start);
          }}
          className="btn btn--secondary"
        >
          <ArrowLeftRight size={15} strokeWidth={1.75} />
          Swap
        </button>
        <button type="button" onClick={copySummary} className="btn btn--primary">
          <Copy size={15} strokeWidth={1.75} />
          Copy summary
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card flex flex-col gap-4">
          <label htmlFor="date-start">Start date and time</label>
          <input
            id="date-start"
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="field"
          />
        </div>

        <div className="card flex flex-col gap-4">
          <label htmlFor="date-end">End date and time</label>
          <input
            id="date-end"
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="field"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card">
          <span className="eyebrow">Days</span>
          <p className="mt-3 text-sm font-mono">{valid ? breakdownValue.days : "Invalid dates"}</p>
        </div>
        <div className="card">
          <span className="eyebrow">Hours</span>
          <p className="mt-3 text-sm font-mono">{valid ? breakdownValue.hours : "Invalid dates"}</p>
        </div>
        <div className="card">
          <span className="eyebrow">Minutes</span>
          <p className="mt-3 text-sm font-mono">{valid ? breakdownValue.minutes : "Invalid dates"}</p>
        </div>
        <div className="card">
          <span className="eyebrow">Seconds</span>
          <p className="mt-3 text-sm font-mono">{valid ? breakdownValue.seconds : "Invalid dates"}</p>
        </div>
      </div>

      <div className="card">
        <span className="eyebrow">Difference</span>
        <p className="mt-3 text-sm">
          {valid
            ? `${formatLocalInput(startDate!)} to ${formatLocalInput(endDate!)} is ${Math.abs(
                breakdownValue.totalSeconds,
              )} seconds total.`
            : "Pick two valid timestamps to see the result."}
        </p>
      </div>
    </div>
  );
}
