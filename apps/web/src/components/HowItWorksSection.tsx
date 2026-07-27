import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, BookOpenText, LayoutGrid, Sparkles } from "lucide-react";
import { Reveal } from "@/lib/animations";
import { getCategory } from "@/data/categories";
import { tools, type ToolSpec } from "@/data/tools";
import type { HowItWorks } from "@/data/how-it-works";

interface HowItWorksSectionProps extends HowItWorks {
  tool: ToolSpec;
}

function buildArticles(tool: ToolSpec, categoryLabel: string) {
  const noun = tool.name.replace(/\s*[→-]\s*/g, " ");
  return [
    {
      title: `What ${noun} is best for`,
      body: `A concise guide to the jobs this tool handles well and the kinds of inputs it expects.`,
      tag: "Overview",
    },
    {
      title: `How to get cleaner results with ${noun}`,
      body: `Practical tips for preparing input, avoiding common mistakes, and copying output faster.`,
      tag: "Workflow",
    },
    {
      title: `${categoryLabel} patterns around ${noun}`,
      body: `A wider look at adjacent tools, related workflows, and where this utility fits in the cluster.`,
      tag: "Related",
    },
  ];
}

export function HowItWorksSection({ tool, input, output, steps }: HowItWorksSectionProps) {
  const category = getCategory(tool.category);
  const relatedTools = tools.filter((item) => item.category === tool.category && item.slug !== tool.slug).slice(0, 4);
  const articles = buildArticles(tool, category.label);

  return (
    <section data-theme="shell" className="section" style={{ color: "var(--text-primary)" }}>
      <div className="container">
        <Reveal className="flex flex-col gap-5">
          <span className="eyebrow">How it works</span>
          <h2 className="text-display-md mt-4 max-w-3xl">
            Everything you need to understand the tool, the workflow, and what to read next.
          </h2>
          <p className="lead max-w-2xl">
            Each tool page now includes the working surface plus a supporting story: input,
            output, steps, related tools, and article ideas that help the page stand on its own.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="card h-full">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <ArrowDownToLine size={16} strokeWidth={1.75} className="text-[var(--accent-secondary)]" />
                  <span className="eyebrow">Input</span>
                </div>
                <span className="timecode">{category.label}</span>
              </div>
              <p className="mt-5 text-secondary text-sm leading-relaxed">{input}</p>

              <div className="mt-8 rounded-[var(--radius-sharp)] border border-[var(--border)] bg-[var(--surface-sunken)] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="eyebrow">Tool profile</span>
                    <h3 className="mt-3 text-display-sm" style={{ fontSize: "1.6rem" }}>
                      {tool.name}
                    </h3>
                  </div>
                  <span className="badge badge--live">Local</span>
                </div>
                <p className="mt-4 text-sm text-secondary leading-relaxed">{tool.description}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Category", value: category.label },
                    { label: "Tags", value: tool.tags.slice(0, 3).join(" / ") || "none" },
                    { label: "Mode", value: "Browser-side" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[var(--radius-sharp)] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
                      <div className="timecode">{item.label}</div>
                      <div className="mt-2 text-sm text-[var(--text-primary)]">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="card h-full">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <ArrowUpFromLine size={16} strokeWidth={1.75} className="text-[var(--accent)]" />
                  <span className="eyebrow">Output</span>
                </div>
                <Sparkles size={16} className="text-[var(--accent)]" />
              </div>
              <p className="mt-5 text-secondary text-sm leading-relaxed">{output}</p>

              <div className="mt-8 rounded-[var(--radius-sharp)] border border-[var(--border)] bg-[var(--surface-sunken)] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="eyebrow">Processing path</span>
                    <h3 className="mt-3 text-display-sm" style={{ fontSize: "1.6rem" }}>
                      {tool.name} workflow
                    </h3>
                  </div>
                  <LayoutGrid size={16} className="text-[var(--accent-secondary)]" />
                </div>

                <div className="mt-6 grid gap-3">
                  {["Validate input", "Process locally", "Review output", "Copy or export"].map((stage, index) => (
                    <div key={stage} className="flex items-center gap-3 rounded-[var(--radius-sharp)] border border-[var(--border)] bg-[var(--surface-raised)] p-3">
                      <span className="timecode">0{index + 1}</span>
                      <span className="text-sm">{stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06}>
              <div className="card h-full">
                <span className="timecode">Step {String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 mb-3" style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>
                  {step.title}
                </h3>
                <p className="text-secondary text-sm leading-relaxed">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="card h-full">
              <div className="flex items-center gap-2">
                <BookOpenText size={16} strokeWidth={1.75} className="text-[var(--accent-secondary)]" />
                <span className="eyebrow">Supporting articles</span>
              </div>
              <div className="mt-6 grid gap-4">
                {articles.map((article) => (
                  <div key={article.title} className="rounded-[var(--radius-sharp)] border border-[var(--border)] bg-[var(--surface-sunken)] p-4">
                    <div className="timecode">{article.tag}</div>
                    <h3 className="mt-3 text-lg">{article.title}</h3>
                    <p className="mt-2 text-sm text-secondary leading-relaxed">{article.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="card h-full">
              <div className="flex items-center gap-2">
                <LayoutGrid size={16} strokeWidth={1.75} className="text-[var(--accent)]" />
                <span className="eyebrow">Related tools</span>
              </div>
              <div className="mt-6 grid gap-3">
                {relatedTools.length > 0 ? (
                  relatedTools.map((related) => (
                    <Link
                      key={related.slug}
                      href={related.href}
                      className="rounded-[var(--radius-sharp)] border border-[var(--border)] bg-[var(--surface-sunken)] p-4 transition-colors hover:border-[var(--accent-secondary)]"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-base">{related.name}</h3>
                          <p className="mt-2 text-sm text-secondary">{related.tagline}</p>
                        </div>
                        <span className="timecode">{related.category}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-secondary leading-relaxed">
                    This tool is the first in its cluster. More related tools will appear here as the category grows.
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
