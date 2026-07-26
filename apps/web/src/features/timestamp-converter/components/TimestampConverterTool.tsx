"use client";

import { useState } from "react";
import { Check, Copy, ArrowLeftRight } from "lucide-react";

type UnixUnit = "seconds" | "milliseconds";

const DEFAULT_LOCAL = "2026-07-26T12:00";

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

function parseLocal(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseUnix(value: string, unit: UnixUnit) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return new Date(unit === "seconds" ? numeric * 1000 : numeric);
}

function toUnixString(date: Date, unit: UnixUnit) {
  return unit === "seconds" ? String(Math.floor(date.getTime() / 1000)) : String(date.getTime());
}

function copyValue(value: string, setCopied: (value: boolean) => void) {
  return navigator.clipboard.writeText(value).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  });
}

export function TimestampConverterTool() {
  const [unit, setUnit] = useState<UnixUnit>("seconds");
  const [localValue, setLocalValue] = useState(DEFAULT_LOCAL);
  const [unixValue, setUnixValue] = useState(() => {
    const date = parseLocal(DEFAULT_LOCAL);
    return date ? toUnixString(date, "seconds") : "";
  });
  const [copied, setCopied] = useState<"iso" | "unix" | null>(null);

  const currentDate = parseLocal(localValue) ?? parseUnix(unixValue, unit);
  const isValid = currentDate !== null;

  const handleLocalChange = (value: string) => {
    setLocalValue(value);
    const parsed = parseLocal(value);
    if (parsed) setUnixValue(toUnixString(parsed, unit));
  };

  const handleUnixChange = (value: string) => {
    setUnixValue(value);
    const parsed = parseUnix(value, unit);
    if (parsed) setLocalValue(formatLocalInput(parsed));
  };

  const handleUnitChange = (nextUnit: UnixUnit) => {
    setUnit(nextUnit);
    const parsed = parseLocal(localValue);
    if (parsed) setUnixValue(toUnixString(parsed, nextUnit));
  };

  const copyIso = () => {
    if (!currentDate) return;
    void copyValue(currentDate.toISOString(), (value) => setCopied(value ? "iso" : null));
  };

  const copyUnix = () => {
    if (!currentDate) return;
    void copyValue(toUnixString(currentDate, unit), (value) => setCopied(value ? "unix" : null));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card flex flex-col gap-4">
          <label htmlFor="local-time">Local date and time</label>
          <input
            id="local-time"
            type="datetime-local"
            value={localValue}
            onChange={(e) => handleLocalChange(e.target.value)}
            className="field"
          />
          <p className="timecode">Uses your browser's local time zone.</p>
        </div>

        <div className="card flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="unix-time">Unix timestamp</label>
            <div className="flex rounded-full border border-[var(--border)] p-1">
              {(["seconds", "milliseconds"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleUnitChange(option)}
                  className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]"
                  style={{
                    background: unit === option ? "var(--accent)" : "transparent",
                    color: unit === option ? "var(--surface)" : "var(--text-secondary)",
                  }}
                >
                  {option === "seconds" ? "Seconds" : "Milliseconds"}
                </button>
              ))}
            </div>
          </div>

          <input
            id="unix-time"
            type="number"
            value={unixValue}
            onChange={(e) => handleUnixChange(e.target.value)}
            className="field"
            inputMode="numeric"
          />
          <p className="timecode">Switch the unit to match your source data.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copyIso} className="btn btn--primary">
          {copied === "iso" ? <Check size={15} strokeWidth={1.75} /> : <Copy size={15} strokeWidth={1.75} />}
          {copied === "iso" ? "ISO copied" : "Copy ISO"}
        </button>
        <button type="button" onClick={copyUnix} className="btn btn--secondary">
          {copied === "unix" ? <Check size={15} strokeWidth={1.75} /> : <ArrowLeftRight size={15} strokeWidth={1.75} />}
          {copied === "unix" ? "Unix copied" : "Copy Unix"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card">
          <span className="eyebrow">ISO</span>
          <p className="mt-3 break-all text-sm font-mono">{isValid ? currentDate?.toISOString() : "Invalid date"}</p>
        </div>
        <div className="card">
          <span className="eyebrow">UTC</span>
          <p className="mt-3 text-sm">{isValid ? currentDate?.toUTCString() : "Invalid date"}</p>
        </div>
        <div className="card">
          <span className="eyebrow">Unix seconds</span>
          <p className="mt-3 text-sm font-mono">{isValid ? Math.floor(currentDate!.getTime() / 1000) : "Invalid date"}</p>
        </div>
        <div className="card">
          <span className="eyebrow">Unix milliseconds</span>
          <p className="mt-3 text-sm font-mono">{isValid ? currentDate!.getTime() : "Invalid date"}</p>
        </div>
      </div>

      <div className="card">
        <span className="eyebrow">Local preview</span>
        <p className="mt-3 text-sm">{isValid ? currentDate!.toLocaleString() : "Enter a valid date or timestamp."}</p>
      </div>
    </div>
  );
}
