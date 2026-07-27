"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Copy, RotateCcw, Sparkles } from "lucide-react";
import { Reveal } from "@/lib/animations";

type CssMode =
  | "glassmorphism"
  | "neumorphism"
  | "gradient"
  | "grid"
  | "flexbox"
  | "clamp"
  | "aspect-ratio"
  | "clip-path"
  | "mask"
  | "animation"
  | "keyframe"
  | "transform"
  | "filter";

interface CssWorkbenchToolProps {
  mode: CssMode;
  title: string;
  summary: string;
}

const MODE_LABEL: Record<CssMode, string> = {
  glassmorphism: "Glassmorphism",
  neumorphism: "Neumorphism",
  gradient: "Gradient",
  grid: "Grid",
  flexbox: "Flexbox",
  clamp: "Clamp",
  "aspect-ratio": "Aspect ratio",
  "clip-path": "Clip path",
  mask: "Mask",
  animation: "Animation",
  keyframe: "Keyframes",
  transform: "Transform",
  filter: "Filter",
};

const ALIGN_OPTIONS = ["stretch", "start", "center", "end"] as const;
const JUSTIFY_OPTIONS = ["start", "center", "space-between", "space-around", "space-evenly"] as const;

export function CssWorkbenchTool({ mode, title, summary }: CssWorkbenchToolProps) {
  const [primary, setPrimary] = useState("#f2d8a6");
  const [secondary, setSecondary] = useState("#f6f1e6");
  const [accent, setAccent] = useState("#b37d28");
  const [angle, setAngle] = useState(135);
  const [radius, setRadius] = useState(28);
  const [blur, setBlur] = useState(20);
  const [gap, setGap] = useState(20);
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(2);
  const [align, setAlign] = useState<(typeof ALIGN_OPTIONS)[number]>("center");
  const [justify, setJustify] = useState<(typeof JUSTIFY_OPTIONS)[number]>("space-between");
  const [minSize, setMinSize] = useState(1);
  const [preferredSize, setPreferredSize] = useState(2.5);
  const [maxSize, setMaxSize] = useState(4.5);
  const [aspectWidth, setAspectWidth] = useState(16);
  const [aspectHeight, setAspectHeight] = useState(9);
  const [translateX, setTranslateX] = useState(14);
  const [translateY, setTranslateY] = useState(12);
  const [scale, setScale] = useState(1.08);
  const [rotate, setRotate] = useState(-8);
  const [skewX, setSkewX] = useState(4);
  const [skewY, setSkewY] = useState(0);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1.1);
  const [saturate, setSaturate] = useState(1.05);
  const [hue, setHue] = useState(0);
  const [duration, setDuration] = useState(6);
  const [easing, setEasing] = useState("cubic-bezier(0.22, 1, 0.36, 1)");
  const [clipPoints, setClipPoints] = useState("50% 0%, 100% 20%, 82% 100%, 0% 86%, 0% 15%");
  const [maskStops, setMaskStops] = useState("transparent 0%, black 30%, black 70%, transparent 100%");

  const code = useMemo(() => {
    switch (mode) {
      case "glassmorphism":
        return `.glass {\n  background: linear-gradient(${angle}deg, ${primary}, ${secondary});\n  backdrop-filter: blur(${blur}px);\n  border: 1px solid color-mix(in srgb, ${accent} 30%, transparent);\n  border-radius: ${radius}px;\n  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.12);\n}`;
      case "neumorphism":
        return `.neo {\n  background: ${secondary};\n  border-radius: ${radius}px;\n  box-shadow: 12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.68);\n}`;
      case "gradient":
        return `.gradient {\n  background: linear-gradient(${angle}deg, ${primary}, ${secondary}, ${accent});\n  border-radius: ${radius}px;\n}`;
      case "grid":
        return `.grid {\n  display: grid;\n  grid-template-columns: repeat(${columns}, minmax(0, 1fr));\n  grid-template-rows: repeat(${rows}, minmax(0, 1fr));\n  gap: ${gap}px;\n}`;
      case "flexbox":
        return `.flex-row {\n  display: flex;\n  align-items: ${align};\n  justify-content: ${justify};\n  gap: ${gap}px;\n}`;
      case "clamp":
        return `font-size: clamp(${minSize}rem, ${preferredSize}vw, ${maxSize}rem);`;
      case "aspect-ratio":
        return `aspect-ratio: ${aspectWidth} / ${aspectHeight};`;
      case "clip-path":
        return `clip-path: polygon(${clipPoints});`;
      case "mask":
        return `mask-image: linear-gradient(180deg, ${maskStops});\n-webkit-mask-image: linear-gradient(180deg, ${maskStops});`;
      case "animation":
        return `.float {\n  animation: float ${duration}s ${easing} infinite;\n}\n@keyframes float {\n  0%, 100% { transform: translateY(0px); }\n  50% { transform: translateY(-18px); }\n}`;
      case "keyframe":
        return `@keyframes pulse {\n  0% { transform: scale(1); opacity: 0.8; }\n  50% { transform: scale(1.06); opacity: 1; }\n  100% { transform: scale(1); opacity: 0.8; }\n}`;
      case "transform":
        return `.tilt {\n  transform: translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg) skew(${skewX}deg, ${skewY}deg);\n}`;
      case "filter":
        return `.filtered {\n  filter: brightness(${brightness}) contrast(${contrast}) saturate(${saturate}) hue-rotate(${hue}deg);\n}`;
      default:
        return "";
    }
  }, [
    accent,
    align,
    angle,
    aspectHeight,
    aspectWidth,
    blur,
    columns,
    contrast,
    duration,
    easing,
    gap,
    hue,
    justify,
    maskStops,
    maxSize,
    minSize,
    mode,
    primary,
    preferredSize,
    radius,
    rotate,
    rows,
    saturate,
    scale,
    secondary,
    skewX,
    skewY,
    translateX,
    translateY,
    brightness,
    clipPoints,
  ]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
  };

  const previewStyle: CSSProperties = useMemo(() => {
    switch (mode) {
      case "glassmorphism":
        return {
          background: `linear-gradient(${angle}deg, ${primary}, ${secondary})`,
          borderRadius: radius,
          backdropFilter: `blur(${blur}px)`,
          border: `1px solid color-mix(in srgb, ${accent} 28%, transparent)`,
        };
      case "neumorphism":
        return {
          background: secondary,
          borderRadius: radius,
          boxShadow: "12px 12px 24px rgba(0,0,0,0.14), -12px -12px 24px rgba(255,255,255,0.75)",
        };
      case "gradient":
        return { background: `linear-gradient(${angle}deg, ${primary}, ${secondary}, ${accent})`, borderRadius: radius };
      case "grid":
        return {
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gap,
        };
      case "flexbox":
        return { display: "flex", alignItems: align, justifyContent: justify, gap };
      case "clamp":
        return { fontSize: `clamp(${minSize}rem, ${preferredSize}vw, ${maxSize}rem)` };
      case "aspect-ratio":
        return { aspectRatio: `${aspectWidth} / ${aspectHeight}` };
      case "clip-path":
        return { clipPath: `polygon(${clipPoints})` };
      case "mask":
        return { WebkitMaskImage: `linear-gradient(180deg, ${maskStops})`, maskImage: `linear-gradient(180deg, ${maskStops})` };
      case "animation":
        return { animation: `workbench-float ${duration}s ${easing} infinite` };
      case "keyframe":
        return { animation: `workbench-pulse ${duration}s ${easing} infinite` };
      case "transform":
        return { transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg) skew(${skewX}deg, ${skewY}deg)` };
      case "filter":
        return { filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturate}) hue-rotate(${hue}deg)` };
      default:
        return {};
    }
  }, [
    angle,
    align,
    aspectHeight,
    aspectWidth,
    blur,
    clipPoints,
    columns,
    contrast,
    duration,
    easing,
    gap,
    hue,
    justify,
    maskStops,
    maxSize,
    minSize,
    mode,
    primary,
    preferredSize,
    radius,
    rotate,
    rows,
    saturate,
    scale,
    secondary,
    skewX,
    skewY,
    translateX,
    translateY,
    brightness,
    accent,
  ]);

  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] items-start">
          <div className="card flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="eyebrow">{MODE_LABEL[mode]}</p>
                <h2 className="text-lg text-[var(--text-primary)] mt-2">{title}</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2">{summary}</p>
              </div>
              <span className="badge">
                <Sparkles size={12} strokeWidth={1.75} />
                CSS preview
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {(mode === "glassmorphism" || mode === "gradient" || mode === "neumorphism") && (
                <>
                  <div>
                    <label className="timecode">Primary</label>
                    <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} className="field mt-2 h-11 p-2" />
                  </div>
                  <div>
                    <label className="timecode">Secondary</label>
                    <input type="color" value={secondary} onChange={(e) => setSecondary(e.target.value)} className="field mt-2 h-11 p-2" />
                  </div>
                </>
              )}

              {(mode === "glassmorphism" || mode === "gradient" || mode === "animation" || mode === "transform") && (
                <div className="md:col-span-2">
                  <label className="timecode">Angle</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input type="range" min={0} max={360} step={1} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
                    <span className="timecode w-12 text-right">{angle}°</span>
                  </div>
                </div>
              )}

              {(mode === "glassmorphism" || mode === "neumorphism") && (
                <div className="md:col-span-2">
                  <label className="timecode">Blur</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input type="range" min={0} max={50} step={1} value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
                    <span className="timecode w-12 text-right">{blur}px</span>
                  </div>
                </div>
              )}

              {(mode === "glassmorphism" || mode === "neumorphism" || mode === "gradient" || mode === "aspect-ratio" || mode === "clip-path") && (
                <div className="md:col-span-2">
                  <label className="timecode">Corner radius</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input type="range" min={0} max={64} step={1} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
                    <span className="timecode w-12 text-right">{radius}px</span>
                  </div>
                </div>
              )}

              {mode === "grid" && (
                <>
                  <div>
                    <label className="timecode">Columns</label>
                    <input type="number" min={1} value={columns} onChange={(e) => setColumns(Number(e.target.value) || 1)} className="field mt-2" />
                  </div>
                  <div>
                    <label className="timecode">Rows</label>
                    <input type="number" min={1} value={rows} onChange={(e) => setRows(Number(e.target.value) || 1)} className="field mt-2" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="timecode">Gap</label>
                    <div className="flex items-center gap-3 mt-2">
                      <input type="range" min={0} max={48} step={1} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
                      <span className="timecode w-12 text-right">{gap}px</span>
                    </div>
                  </div>
                </>
              )}

              {mode === "flexbox" && (
                <>
                  <div>
                    <label className="timecode">Align items</label>
                    <select value={align} onChange={(e) => setAlign(e.target.value as typeof align)} className="field mt-2">
                      {ALIGN_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="timecode">Justify content</label>
                    <select value={justify} onChange={(e) => setJustify(e.target.value as typeof justify)} className="field mt-2">
                      {JUSTIFY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="timecode">Gap</label>
                    <div className="flex items-center gap-3 mt-2">
                      <input type="range" min={0} max={48} step={1} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
                      <span className="timecode w-12 text-right">{gap}px</span>
                    </div>
                  </div>
                </>
              )}

              {mode === "clamp" && (
                <>
                  <div>
                    <label className="timecode">Min rem</label>
                    <input type="number" min={0.25} step={0.1} value={minSize} onChange={(e) => setMinSize(Number(e.target.value) || 1)} className="field mt-2" />
                  </div>
                  <div>
                    <label className="timecode">Preferred vw</label>
                    <input type="number" min={0.25} step={0.1} value={preferredSize} onChange={(e) => setPreferredSize(Number(e.target.value) || 1)} className="field mt-2" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="timecode">Max rem</label>
                    <input type="number" min={0.25} step={0.1} value={maxSize} onChange={(e) => setMaxSize(Number(e.target.value) || 1)} className="field mt-2" />
                  </div>
                </>
              )}

              {mode === "aspect-ratio" && (
                <>
                  <div>
                    <label className="timecode">Width</label>
                    <input type="number" min={1} value={aspectWidth} onChange={(e) => setAspectWidth(Number(e.target.value) || 1)} className="field mt-2" />
                  </div>
                  <div>
                    <label className="timecode">Height</label>
                    <input type="number" min={1} value={aspectHeight} onChange={(e) => setAspectHeight(Number(e.target.value) || 1)} className="field mt-2" />
                  </div>
                </>
              )}

              {(mode === "clip-path" || mode === "mask") && (
                <div className="md:col-span-2">
                  <label className="timecode">{mode === "clip-path" ? "Polygon points" : "Mask stops"}</label>
                  <input
                    type="text"
                    value={mode === "clip-path" ? clipPoints : maskStops}
                    onChange={(e) => (mode === "clip-path" ? setClipPoints(e.target.value) : setMaskStops(e.target.value))}
                    className="field mt-2 font-mono text-xs"
                  />
                </div>
              )}

              {mode === "transform" && (
                <>
                  <div>
                    <label className="timecode">Translate X</label>
                    <input type="number" value={translateX} onChange={(e) => setTranslateX(Number(e.target.value) || 0)} className="field mt-2" />
                  </div>
                  <div>
                    <label className="timecode">Translate Y</label>
                    <input type="number" value={translateY} onChange={(e) => setTranslateY(Number(e.target.value) || 0)} className="field mt-2" />
                  </div>
                  <div>
                    <label className="timecode">Scale</label>
                    <input type="number" value={scale} onChange={(e) => setScale(Number(e.target.value) || 1)} step={0.01} className="field mt-2" />
                  </div>
                  <div>
                    <label className="timecode">Rotate</label>
                    <input type="number" value={rotate} onChange={(e) => setRotate(Number(e.target.value) || 0)} className="field mt-2" />
                  </div>
                  <div>
                    <label className="timecode">Skew X</label>
                    <input type="number" value={skewX} onChange={(e) => setSkewX(Number(e.target.value) || 0)} className="field mt-2" />
                  </div>
                  <div>
                    <label className="timecode">Skew Y</label>
                    <input type="number" value={skewY} onChange={(e) => setSkewY(Number(e.target.value) || 0)} className="field mt-2" />
                  </div>
                </>
              )}

              {(mode === "animation" || mode === "keyframe") && (
                <>
                  <div>
                    <label className="timecode">Duration</label>
                    <input type="number" min={0.5} step={0.25} value={duration} onChange={(e) => setDuration(Number(e.target.value) || 1)} className="field mt-2" />
                  </div>
                  <div>
                    <label className="timecode">Easing</label>
                    <input type="text" value={easing} onChange={(e) => setEasing(e.target.value)} className="field mt-2 font-mono text-xs" />
                  </div>
                </>
              )}

              {mode === "filter" && (
                <>
                  <div>
                    <label className="timecode">Brightness</label>
                    <input type="number" min={0} max={3} step={0.05} value={brightness} onChange={(e) => setBrightness(Number(e.target.value) || 1)} className="field mt-2" />
                  </div>
                  <div>
                    <label className="timecode">Contrast</label>
                    <input type="number" min={0} max={3} step={0.05} value={contrast} onChange={(e) => setContrast(Number(e.target.value) || 1)} className="field mt-2" />
                  </div>
                  <div>
                    <label className="timecode">Saturate</label>
                    <input type="number" min={0} max={3} step={0.05} value={saturate} onChange={(e) => setSaturate(Number(e.target.value) || 1)} className="field mt-2" />
                  </div>
                  <div>
                    <label className="timecode">Hue rotate</label>
                    <input type="number" min={-180} max={180} step={1} value={hue} onChange={(e) => setHue(Number(e.target.value) || 0)} className="field mt-2" />
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={copyCode} className="btn btn--primary">
                <Copy size={15} strokeWidth={1.75} />
                Copy CSS
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrimary("#f2d8a6");
                  setSecondary("#f6f1e6");
                  setAccent("#b37d28");
                  setAngle(135);
                  setRadius(28);
                  setBlur(20);
                  setGap(20);
                  setColumns(3);
                  setRows(2);
                  setAlign("center");
                  setJustify("space-between");
                  setMinSize(1);
                  setPreferredSize(2.5);
                  setMaxSize(4.5);
                  setAspectWidth(16);
                  setAspectHeight(9);
                  setTranslateX(14);
                  setTranslateY(12);
                  setScale(1.08);
                  setRotate(-8);
                  setSkewX(4);
                  setSkewY(0);
                  setBrightness(1);
                  setContrast(1.1);
                  setSaturate(1.05);
                  setHue(0);
                  setDuration(6);
                  setEasing("cubic-bezier(0.22, 1, 0.36, 1)");
                  setClipPoints("50% 0%, 100% 20%, 82% 100%, 0% 86%, 0% 15%");
                  setMaskStops("transparent 0%, black 30%, black 70%, transparent 100%");
                }}
                className="btn btn--ghost"
              >
                <RotateCcw size={14} strokeWidth={1.75} />
                Reset
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="card">
              <p className="eyebrow">Preview</p>
              <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-2)] min-h-72 flex items-center justify-center p-8">
                {(mode === "animation" || mode === "keyframe") && (
                  <style>{`
                    @keyframes workbench-float {
                      0%, 100% { transform: translateY(0px); opacity: 0.9; }
                      50% { transform: translateY(-18px); opacity: 1; }
                    }
                    @keyframes workbench-pulse {
                      0%, 100% { transform: scale(1); opacity: 0.8; }
                      50% { transform: scale(1.06); opacity: 1; }
                    }
                  `}</style>
                )}
                <div
                  className="w-full max-w-md min-h-44 flex items-center justify-center text-center text-[var(--text-primary)]"
                  style={{
                    ...previewStyle,
                    backgroundColor: mode === "neumorphism" ? secondary : undefined,
                    color: mode === "mask" ? "var(--surface)" : "var(--text-primary)",
                    boxShadow: mode === "neumorphism" ? "12px 12px 24px rgba(0,0,0,0.14), -12px -12px 24px rgba(255,255,255,0.75)" : undefined,
                    padding: 24,
                  }}
                >
                  <div className={mode === "animation" || mode === "keyframe" || mode === "transform" || mode === "filter" ? "w-28 h-28 rounded-[24px] bg-[var(--accent)]/20 border border-[var(--accent)]/30" : "w-full"}>
                    <div className="h-full w-full flex items-center justify-center rounded-[20px] bg-white/20">
                      <span className="text-sm font-medium">Workbench UI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <p className="eyebrow">Generated CSS</p>
              <pre className="mt-4 overflow-x-auto rounded-[var(--radius-md)] bg-[var(--surface-2)] p-4 text-xs leading-6 text-[var(--text-primary)]">
                <code>{code}</code>
              </pre>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
