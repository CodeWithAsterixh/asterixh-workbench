import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  LayoutGrid,
  Sparkles,
  Clock,
  ArrowRight,
  UploadCloud,
  Sliders,
  Cpu,
  CheckCircle2
} from "lucide-react";
import { Reveal } from "@/lib/animations";
import { getCategory } from "@/data/categories";
import { tools, type ToolSpec } from "@/data/tools";
import type { HowItWorks } from "@/data/how-it-works";

interface HowItWorksSectionProps extends HowItWorks {
  tool: ToolSpec;
}

export function buildArticles(tool: ToolSpec, categoryLabel: string) {
  const noun = tool.name.replace(/\s*[→-]\s*/g, " ");
  return [
    {
      slug: "best-use-cases",
      title: `What ${noun} is best for`,
      body: `A concise guide to the jobs this tool handles well and the kinds of inputs it expects.`,
      tag: "Overview",
      readTime: "3 min read",
      bullets: [
        "Optimal file formats and size boundaries",
        "Typical use-cases in development pipelines",
        "Common output compatibility considerations"
      ]
    },
    {
      slug: "cleaner-results",
      title: `How to get cleaner results with ${noun}`,
      body: `Practical tips for preparing input, avoiding common mistakes, and copying output faster.`,
      tag: "Workflow",
      readTime: "5 min read",
      bullets: [
        "Pre-processing files for better performance",
        "Custom configurations and advanced parameters",
        "Automation shortcuts and export commands"
      ]
    },
    {
      slug: "workflow-patterns",
      title: `${categoryLabel} patterns around ${noun}`,
      body: `A wider look at adjacent tools, related workflows, and where this utility fits in the cluster.`,
      tag: "Related",
      readTime: "4 min read",
      bullets: [
        "Chaining multiple utilities in sequence",
        "Standardizing layouts and assets across teams",
        "Scripting custom integrations locally"
      ]
    },
  ];
}

export function HowItWorksSection({ tool, input, output, steps }: HowItWorksSectionProps) {
  const category = getCategory(tool.category);
  const relatedTools = tools.filter((item) => item.category === tool.category && item.slug !== tool.slug).slice(0, 4);
  const articles = buildArticles(tool, category.label);

  return (
    <div className="flex flex-col">
      {/* SECTION 1: INPUT & OUTPUT (BEFORE/AFTER DIVISION) */}
      <section className="border-t border-[var(--border)] bg-[var(--surface-sunken)] relative overflow-hidden py-20">
        <div className="container relative z-10">
          <Reveal className="flex flex-col gap-4 mb-16 text-center items-center">
            <span className="eyebrow text-[var(--accent-secondary)]">Interface Specs</span>
            <h2 className="text-display-md font-bold mt-2 max-w-2xl leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Data Pipeline & Formats
            </h2>
            <p className="lead text-secondary max-w-xl">
              Inspect the exact payload types this local worker accepts and the optimized formats returned after compilation.
            </p>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-2 items-stretch mt-8">
            {/* Input Column (Light Theme Representation) */}
            <Reveal className="h-full">
              <div data-theme="paper" className="h-full border border-[var(--border)] bg-[var(--surface-raised)] rounded-2xl p-8 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--accent-secondary)]/10 flex items-center justify-center">
                        <ArrowDownToLine size={18} className="text-[var(--accent-secondary)]" />
                      </div>
                      <span className="eyebrow tracking-widest text-[var(--accent-secondary)] font-semibold" style={{ color: "var(--accent-secondary)" }}>Input Source</span>
                    </div>
                    <span className="badge">{category.label}</span>
                  </div>
                  <p className="text-[var(--text-primary)] text-base leading-relaxed mb-6 font-medium">
                    {input}
                  </p>
                </div>

                {/* Visual Before Representation */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-sunken)] p-6 shadow-inner">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono text-[var(--accent-secondary)] uppercase font-semibold">Source Payload</span>
                    <span className="text-[10px] timecode">Ready for Processing</span>
                  </div>
                  <div className="font-mono text-[11px] bg-[var(--surface-raised)] border border-[var(--border)] p-4 rounded-lg overflow-x-auto text-[var(--text-secondary)] whitespace-pre leading-relaxed">
{`{
  "source": "client_payload",
  "category": "${tool.category}",
  "type": "${tool.name.toLowerCase().replace(/\s/g, "-")}",
  "origin": "local_filesystem"
}`}
                  </div>
                  <div className="mt-4 flex justify-between items-center text-[10px] timecode">
                    <span>File size: Variable</span>
                    <span>Format: Web-native</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Output Column (Dark Theme Representation) */}
            <Reveal delay={0.08} className="h-full">
              <div data-theme="shell" className="h-full border border-[var(--border)] bg-[var(--surface-raised)] rounded-2xl p-8 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                        <ArrowUpFromLine size={18} className="text-[var(--accent)]" />
                      </div>
                      <span className="eyebrow tracking-widest text-[var(--accent)] font-semibold" style={{ color: "var(--accent)" }}>Output Result</span>
                    </div>
                    <span className="badge badge--live">Local Compile</span>
                  </div>
                  <p className="text-[var(--text-primary)] text-base leading-relaxed mb-6 font-medium">
                    {output}
                  </p>
                </div>

                {/* Visual After Representation */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-sunken)] p-6 shadow-inner">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono text-[var(--accent)] uppercase font-semibold">Compiled Output</span>
                    <span className="badge badge--live">Success</span>
                  </div>
                  <div className="font-mono text-[11px] bg-[var(--surface-raised)] border border-[var(--border)] p-4 rounded-lg overflow-x-auto text-[var(--text-secondary)] whitespace-pre leading-relaxed">
{`{
  "status": "compiled_successfully",
  "compression": "optimized_wasm",
  "export_format": "zip_archive",
  "dest": "browser_downloads"
}`}
                  </div>
                  <div className="mt-4 flex justify-between items-center text-[10px] timecode">
                    <span>Performance: ~0ms</span>
                    <span>Security: 100% Private</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SECTION 2: ALTERNATING STEPS TIMELINE */}
      <section className="bg-[var(--surface)] border-t border-[var(--border)] py-24">
        <div className="container">
          <Reveal className="flex flex-col gap-4 mb-20 text-center items-center">
            <span className="eyebrow text-[var(--accent)]">Execution Flow</span>
            <h2 className="text-display-md font-bold mt-2 max-w-2xl leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Step-by-Step Guide
            </h2>
            <p className="lead text-secondary max-w-xl">
              Follow this localized process pipeline to capture, configure, execute, and compile your final workspace assets.
            </p>
          </Reveal>

          {/* Vertical Alternating Timeline Container */}
          <div className="relative mt-12 max-w-5xl mx-auto">
            {/* Center Line for Timeline (Desktop Only) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-dashed border-l border-dashed border-[var(--border-strong)] transform -translate-x-1/2 z-0"></div>

            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={step.title} className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-12 items-center mb-16 md:mb-24 last:mb-0">
                  {/* Step Content Column */}
                  <div className={`order-2 ${isEven ? "md:order-1 md:text-right" : "md:order-3 md:text-left"}`}>
                    <Reveal delay={i * 0.05} className="flex flex-col gap-3">
                      <span className="text-xs font-mono text-[var(--accent-secondary)] font-semibold uppercase">0{i + 1} • Procedure</span>
                      <h3 className="text-xl font-bold font-display" style={{ fontFamily: "var(--font-display)" }}>
                        {step.title}
                      </h3>
                      <p className="text-secondary text-sm leading-relaxed max-w-md md:mx-auto md:ml-0 md:mr-0 inline-block">
                        {step.body}
                      </p>
                    </Reveal>
                  </div>

                  {/* Step Timeline Node Column (Center) */}
                  <div className="order-1 md:order-2 flex justify-start md:justify-center items-center shrink-0">
                    <div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] bg-[var(--surface-raised)] flex items-center justify-center font-mono text-xs text-[var(--text-primary)] font-bold shadow-md z-10">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Step Visual Column */}
                  <div className={`order-3 ${isEven ? "md:order-3 md:justify-start" : "md:order-1 md:justify-end"} flex items-center`}>
                    <Reveal delay={i * 0.08} className="w-full">
                      {/* Visual placeholder based on the step index */}
                      {i === 0 && (
                        <div className="border border-dashed border-[var(--border-strong)] bg-[var(--surface-sunken)] p-6 rounded-xl flex flex-col items-center justify-center gap-2 aspect-[4/3] max-w-[280px] mx-auto shadow-sm">
                          <UploadCloud size={28} className="text-secondary animate-bounce" strokeWidth={1.5} />
                          <span className="text-xs font-semibold">Drop Files Here</span>
                          <span className="text-[10px] timecode">Local browser upload</span>
                        </div>
                      )}
                      {i === 1 && (
                        <div className="border border-[var(--border)] bg-[var(--surface-sunken)] p-5 rounded-xl flex flex-col gap-4 aspect-[4/3] max-w-[280px] mx-auto justify-center shadow-sm">
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[10px] timecode"><span>Scale Factor</span><span>100%</span></div>
                            <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden"><div className="h-full w-full bg-[var(--accent)]"></div></div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[10px] timecode"><span>Quality Slider</span><span>85</span></div>
                            <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden"><div className="h-full w-[85%] bg-[var(--accent-secondary)]"></div></div>
                          </div>
                        </div>
                      )}
                      {i === 2 && (
                        <div className="border border-[var(--border)] bg-[var(--surface-sunken)] p-5 rounded-xl flex flex-col items-center justify-center gap-3 aspect-[4/3] max-w-[280px] mx-auto shadow-sm">
                          <div className="relative w-12 h-12 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-2 border-[var(--border-strong)]"></div>
                            <div className="absolute inset-0 rounded-full border-2 border-t-[var(--accent-secondary)] animate-spin"></div>
                            <Cpu size={16} className="text-[var(--accent-secondary)]" />
                          </div>
                          <span className="text-[9px] timecode uppercase tracking-widest">WASM Worker Active</span>
                        </div>
                      )}
                      {i === 3 && (
                        <div className="border border-[var(--border)] bg-[var(--surface-sunken)] p-5 rounded-xl flex flex-col justify-center gap-3 aspect-[4/3] max-w-[280px] mx-auto text-center shadow-sm">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                            <CheckCircle2 size={18} className="text-emerald-500" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold">assets_compiled.zip</div>
                            <div className="text-[10px] timecode mt-1">Ready for Download</div>
                          </div>
                        </div>
                      )}
                      {i > 3 && (
                        <div className="border border-[var(--border)] bg-[var(--surface-sunken)] p-6 rounded-xl flex items-center justify-center aspect-[4/3] max-w-[280px] mx-auto shadow-sm">
                          <Sliders size={28} className="text-[var(--accent-secondary)] animate-pulse" />
                        </div>
                      )}
                    </Reveal>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: SUPPORTING ARTICLES (BLOG PAGE VIEW) */}
      <section data-theme="paper" className="bg-[var(--surface)] border-t border-[var(--border)] py-24">
        <div className="container">
          <Reveal className="flex flex-col gap-4 mb-20 text-center items-center">
            <span className="eyebrow text-[var(--accent)]" style={{ color: "var(--accent)" }}>Knowledge Base</span>
            <h2 className="text-display-md font-bold mt-2 max-w-2xl leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Supporting Technical Articles
            </h2>
            <p className="lead text-secondary max-w-xl">
              Gain a deeper understanding of file operations, browser limitations, and performance optimizations.
            </p>
          </Reveal>

          {/* Grid layout - Blog Index Style */}
          <div className="grid gap-8 lg:grid-cols-3 mt-12 items-stretch">
            {articles.map((article, index) => (
              <Reveal key={article.title} delay={index * 0.08} className="h-full">
                <div className="group h-full flex flex-col justify-between bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-xl transition-all duration-300 rounded-2xl p-8 cursor-default">
                  <div>
                    {/* Header: Tag + Read Time */}
                    <div className="flex items-center justify-between text-xs timecode uppercase tracking-wider mb-6">
                      <span className="text-[var(--accent)] font-semibold" style={{ color: "var(--accent)" }}>{article.tag}</span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} /> {article.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <Link
                      href={`/tools/${tool.slug}/${article.slug}`}
                      className="block text-xl font-bold mb-4 font-display hover:text-[var(--accent)] transition-colors duration-200"
                      style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                    >
                      {article.title}
                    </Link>

                    {/* Summary */}
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 font-medium">
                      {article.body}
                    </p>

                    {/* Bullet checklists */}
                    <ul className="space-y-3 mb-8">
                      {article.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                          <span className="text-[var(--accent-secondary)] mt-0.5 font-bold">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer: Read Guide Button Only (User details completely removed) */}
                  <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between mt-auto w-full">
                    <span className="text-[10px] timecode uppercase">Technical Guide</span>
                    <Link
                      href={`/tools/${tool.slug}/${article.slug}`}
                      className="btn btn--secondary py-1 px-4 text-xs font-mono tracking-wider text-center flex items-center justify-center gap-1.5 h-8 rounded-[var(--radius-control)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer"
                    >
                      Read Guide <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: RELATED TOOLS SECTION */}
      <section data-theme="shell" className="bg-[var(--surface-sunken)] border-t border-[var(--border)] py-20">
        <div className="container">
          <Reveal className="flex flex-col gap-4 mb-16 text-center items-center">
            <span className="eyebrow text-[var(--accent-secondary)]">Discover More</span>
            <h2 className="text-display-md font-bold mt-2 max-w-2xl leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Explore Related Utilities
            </h2>
            <p className="lead text-secondary max-w-xl">
              Complement your workflow by pairing this tool with other local processing nodes.
            </p>
          </Reveal>

          {/* Related Tools Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {relatedTools.length > 0 ? (
              relatedTools.map((related, rIdx) => (
                <Reveal key={related.slug} delay={rIdx * 0.05}>
                  <Link
                    href={related.href}
                    className="group card flex flex-col justify-between h-full bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--accent-secondary)] hover:shadow-lg transition-all duration-300 rounded-xl p-6 cursor-pointer"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] timecode uppercase tracking-wider">{related.category}</span>
                        <span className="badge badge--live opacity-0 group-hover:opacity-100 transition-opacity">Launch</span>
                      </div>
                      <h3 className="text-lg font-bold group-hover:text-[var(--accent-secondary)] transition-colors">{related.name}</h3>
                      <p className="mt-2 text-xs text-secondary leading-normal">{related.tagline}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--accent-secondary)]">
                      <span>Explore utility</span>
                      <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </Reveal>
              ))
            ) : (
              <p className="text-sm text-secondary leading-relaxed col-span-full text-center py-6">
                This tool is the first in its cluster. More related tools will appear here as the category grows.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
