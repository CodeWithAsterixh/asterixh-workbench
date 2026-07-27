"use client";

import { useMemo, useState } from "react";
import { Copy, Download, Sparkles } from "lucide-react";
import { Reveal } from "@/lib/animations";
import { triggerDownload } from "@/lib/browser-zip";
import { getGeneratorSpec } from "../lib/specs";
import type { GeneratorField, GeneratorValues } from "../lib/common";

interface CodeGeneratorToolProps {
  slug: string;
}

function initialValues(fields: GeneratorField[]): GeneratorValues {
  return Object.fromEntries(fields.map((field) => [field.key, field.defaultValue])) as GeneratorValues;
}

function firstString(values: GeneratorValues, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = values[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return fallback;
}

function firstNumber(values: GeneratorValues, keys: string[], fallback = 0): number {
  for (const key of keys) {
    const value = values[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return fallback;
}

function firstColor(values: GeneratorValues, keys: string[], fallback = "#f2d8a6"): string {
  for (const key of keys) {
    const value = values[key];
    if (typeof value === "string" && value.startsWith("#")) return value;
  }
  return fallback;
}

function renderFileTree(specName: string, fileName: string, outputLabel: string, values: GeneratorValues) {
  const name = firstString(values, ["projectName", "name", "title"], specName);
  const lines = [
    `${name}/`,
    "  app/",
    "    layout.tsx",
    "    page.tsx",
    "  components/",
    `  ${fileName}`,
  ];
  return (
    <div className="space-y-3">
      <p className="eyebrow">Project structure</p>
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-sunken)] p-5 font-mono text-xs leading-6 text-[var(--text-secondary)]">
        {lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
        <p className="timecode">Starter mode</p>
        <p className="mt-2 text-sm text-[var(--text-primary)]">{outputLabel}</p>
      </div>
    </div>
  );
}

function renderPreview(spec: NonNullable<ReturnType<typeof getGeneratorSpec>>, values: GeneratorValues) {
  const accent = firstColor(values, ["accent", "primary"], "#c07d2d");
  const primary = firstColor(values, ["primary"], accent);
  const secondary = firstColor(values, ["secondary", "surface"], "#f6efe3");
  const title = firstString(values, ["headline", "title", "projectName", "name", "label"], spec.name);
  const subtitle = firstString(values, ["subhead", "body", "subtitle", "description"], spec.description);
  const cta = firstString(values, ["cta", "label", "action"], "Copy");
  const widgets = firstNumber(values, ["widgets"], 4);
  const radius = firstNumber(values, ["radius"], 24);
  const spacing = firstNumber(values, ["spacing", "gap"], 24);

  switch (spec.previewKind) {
    case "swatches":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Primary", value: primary },
            { label: "Secondary", value: secondary },
            { label: "Accent", value: accent },
            { label: "Surface", value: "#fffaf2" },
          ].map((item) => (
            <div key={item.label} className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]">
              <div className="h-28" style={{ background: item.value }} />
              <div className="p-4">
                <p className="eyebrow">{item.label}</p>
                <p className="timecode mt-2">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      );
    case "theme":
      return (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-sunken)] p-5">
          <div className="rounded-[28px] border border-[var(--border)] overflow-hidden">
            <div className="h-24" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} />
            <div className="space-y-3 bg-[var(--surface-raised)] p-5">
              <p className="eyebrow">Theme preview</p>
              <h3 className="text-xl text-[var(--text-primary)]">{title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
              <button type="button" className="btn btn--primary" style={{ borderRadius: `${radius}px` }}>
                {cta}
              </button>
            </div>
          </div>
        </div>
      );
    case "layout":
      return (
        <div className="space-y-4">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-sunken)] p-5">
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(4, Math.max(2, widgets))}, minmax(0, 1fr))` }}>
              {Array.from({ length: Math.max(2, widgets) }, (_, index) => (
                <div key={index} className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
                  <div className="h-2 w-12 rounded-full bg-[var(--accent)]/50" />
                  <div className="mt-4 h-16 rounded-[14px] bg-[var(--surface-sunken)]" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
            <p className="eyebrow">Spacing preview</p>
            <div className="mt-4 flex gap-4">
              <div className="h-12 w-12 rounded-full bg-[var(--accent)]" style={{ opacity: 0.7 }} />
              <div className="h-12 w-12 rounded-full bg-[var(--accent)]" style={{ opacity: 0.35 }} />
              <div className="h-12 w-12 rounded-full bg-[var(--accent)]" style={{ opacity: 0.18 }} />
            </div>
            <p className="timecode mt-4">Radius {radius}px · Gap {spacing}px</p>
          </div>
        </div>
      );
    case "component":
      return (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-sunken)] p-5">
          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-raised)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Preview</p>
                <h3 className="mt-3 text-xl text-[var(--text-primary)]">{title}</h3>
                <p className="mt-3 text-sm text-[var(--text-secondary)]">{subtitle}</p>
              </div>
              <span className="badge">Live</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="btn btn--primary" style={{ borderRadius: `${radius}px`, background: accent }}>
                {cta}
              </button>
              <button type="button" className="btn btn--ghost" style={{ borderRadius: `${radius}px` }}>
                Secondary
              </button>
            </div>
          </div>
        </div>
      );
    case "file-tree":
      return renderFileTree(spec.name, spec.fileName, spec.outputLabel, values);
    case "code":
    default:
      return (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-sunken)] p-5">
          <p className="eyebrow">Output preview</p>
          <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-raised)] p-4 font-mono text-xs leading-6 text-[var(--text-secondary)]">
            <div>{title}</div>
            <div className="mt-3 h-px bg-[var(--border)]" />
            <div className="mt-3">Code will appear in the output panel.</div>
          </div>
        </div>
      );
  }
}

function downloadText(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  triggerDownload(url, filename);
  URL.revokeObjectURL(url);
}

export function CodeGeneratorTool({ slug }: CodeGeneratorToolProps) {
  const spec = getGeneratorSpec(slug);

  if (!spec) {
    return (
      <div className="card">
        <p className="text-sm text-[var(--text-secondary)]">That generator is not available right now.</p>
      </div>
    );
  }

  const [values, setValues] = useState<GeneratorValues>(() => initialValues(spec.fields));
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => spec.buildOutput(values), [spec, values]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const setValue = (key: string, value: GeneratorValues[string]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] items-start">
          <div className="card flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="eyebrow">{spec.cluster === "tailwind" ? "Tailwind CSS" : "Next.js"}</p>
                <h2 className="text-lg text-[var(--text-primary)] mt-2">{spec.name}</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2">{spec.description}</p>
              </div>
              <span className="badge">
                <Sparkles size={12} strokeWidth={1.75} />
                {spec.outputLabel}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {spec.fields.map((field) => (
                <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                  <label className="timecode">{field.label}</label>
                  {field.type === "text" && (
                    <input
                      type="text"
                      value={String(values[field.key] ?? "")}
                      placeholder={field.placeholder}
                      onChange={(e) => setValue(field.key, e.target.value)}
                      className="field mt-2"
                    />
                  )}
                  {field.type === "textarea" && (
                    <textarea
                      value={String(values[field.key] ?? "")}
                      rows={field.rows ?? 4}
                      placeholder={field.placeholder}
                      onChange={(e) => setValue(field.key, e.target.value)}
                      className="field mt-2"
                    />
                  )}
                  {field.type === "number" && (
                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={Number(values[field.key] ?? field.defaultValue)}
                      onChange={(e) => setValue(field.key, Number(e.target.value))}
                      className="field mt-2"
                    />
                  )}
                  {field.type === "color" && (
                    <input
                      type="color"
                      value={String(values[field.key] ?? field.defaultValue)}
                      onChange={(e) => setValue(field.key, e.target.value)}
                      className="field mt-2 h-11 p-2"
                    />
                  )}
                  {field.type === "select" && (
                    <select
                      value={String(values[field.key] ?? field.defaultValue)}
                      onChange={(e) => setValue(field.key, e.target.value)}
                      className="field mt-2"
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {field.type === "toggle" && (
                    <label className="mt-2 flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(values[field.key] ?? field.defaultValue)}
                        onChange={(e) => setValue(field.key, e.target.checked)}
                        className="h-4 w-4"
                      />
                      {Boolean(values[field.key] ?? field.defaultValue) ? "Enabled" : "Disabled"}
                    </label>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={handleCopy} className="btn btn--primary">
                <Copy size={15} strokeWidth={1.75} />
                {copied ? "Copied" : "Copy output"}
              </button>
              <button type="button" onClick={() => downloadText(spec.fileName, output)} className="btn btn--ghost">
                <Download size={15} strokeWidth={1.75} />
                Download snippet
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="card">{renderPreview(spec, values)}</div>
            <div className="card flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <span className="eyebrow">{spec.outputLabel}</span>
                <span className="timecode">{spec.fileName}</span>
              </div>
              <pre className="overflow-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-sunken)] p-4 text-xs leading-6 text-[var(--text-secondary)]">
                <code>{output}</code>
              </pre>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
