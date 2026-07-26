import type { Metadata } from "next";
import { ArrowRight, Layers3, ShieldCheck, Workflow } from "lucide-react";
import { MagneticButton, Reveal } from "@/lib/animations";
import {
  architectureLayers,
  launchPrinciples,
  roadmapPhases,
  targetCategoryClusters,
} from "@/data/platform-blueprint";
import { tools } from "@/data/tools";

export const metadata: Metadata = {
  title: "Strategy - Workbench",
  description:
    "The product strategy for Workbench: browser-first tools, worker-based processing, platform architecture, SEO, and phased growth.",
};

const metrics = [
  { value: tools.length, label: "Live tools today" },
  { value: 7, label: "Current categories" },
  { value: 500, label: "Long-term tool target" },
];

export default function StrategyPage() {
  return (
    <>
      <section data-theme="shell" className="pt-48 pb-24">
        <div className="container">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">Product strategy</span>
            <h1 className="text-display-lg mt-4 max-w-4xl">
              Workbench is a browser-based application platform, not just a list of pages.
            </h1>
            <p className="lead mt-6 max-w-3xl">
              The goal is to build a large collection of high-quality browser tools that feel
              fast, trustworthy, and easy to discover. The site should scale into hundreds of
              tools, articles, and internal links without losing the clean experience that makes
              the first version useful.
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3 mt-12">
            {metrics.map((metric) => (
              <Reveal key={metric.label}>
                <div className="card">
                  <span className="text-display-md font-mono">{metric.value}</span>
                  <p className="text-secondary text-sm mt-2">{metric.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section data-theme="shell" className="section" style={{ background: "var(--surface-raised)" }}>
        <div className="container">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">Launch principles</span>
            <h2 className="text-display-md mt-4 max-w-2xl">
              Trust is the product. Revenue comes later.
            </h2>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-14">
            {launchPrinciples.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <div className="card h-full">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-[var(--accent)]" />
                    <h3 className="text-display-sm" style={{ fontSize: "1.45rem" }}>
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-secondary mt-4 text-sm leading-relaxed">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section data-theme="shell" className="section">
        <div className="container">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">Architecture</span>
            <h2 className="text-display-md mt-4 max-w-2xl">
              Reusable systems keep every new tool from becoming a one-off project.
            </h2>
            <p className="lead max-w-2xl">
              Each tool should ship with the same underlying contract: metadata, SEO, inputs,
              outputs, docs, examples, and a worker path for heavy work.
            </p>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2 mt-14">
            {architectureLayers.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <div className="card h-full">
                  <div className="flex items-center gap-3">
                    <Layers3 size={18} className="text-[var(--accent)]" />
                    <h3 className="text-display-sm" style={{ fontSize: "1.45rem" }}>
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-secondary mt-4 text-sm leading-relaxed">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section data-theme="shell" className="section" style={{ background: "var(--surface-raised)" }}>
        <div className="container">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">Category clusters</span>
            <h2 className="text-display-md mt-4 max-w-2xl">
              Build in clusters so each page strengthens the others.
            </h2>
            <p className="lead max-w-2xl">
              The long-term plan is to grow broad, linked families of tools instead of isolated
              pages. That is what creates topic authority and makes the site easier to navigate.
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-14">
            {targetCategoryClusters.map((category, index) => (
              <Reveal key={category.name} delay={index * 0.04}>
                <div className="card h-full">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-display-sm" style={{ fontSize: "1.4rem" }}>
                      {category.name}
                    </h3>
                    <span className="timecode">{category.target}</span>
                  </div>
                  <p className="text-secondary mt-4 text-sm leading-relaxed">{category.examples}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section data-theme="shell" className="section">
        <div className="container">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">Roadmap</span>
            <h2 className="text-display-md mt-4 max-w-2xl">
              Grow the audience first, then expand the platform, then turn on monetization.
            </h2>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3 mt-14">
            {roadmapPhases.map((phase, index) => (
              <Reveal key={phase.name} delay={index * 0.05}>
                <div className="card h-full">
                  <div className="flex items-center gap-3">
                    <Workflow size={18} className="text-[var(--accent)]" />
                    <h3 className="text-display-sm" style={{ fontSize: "1.35rem" }}>
                      {phase.name}
                    </h3>
                  </div>
                  <p className="text-secondary mt-4 text-sm leading-relaxed">{phase.summary}</p>
                  <ul className="mt-5 space-y-3 text-sm text-[var(--text-secondary)]">
                    {phase.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span className="text-[var(--accent)] mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section data-theme="shell" className="section border-t border-[var(--border)]">
        <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10">
          <div>
            <span className="eyebrow">Action</span>
            <h2 className="text-display-sm mt-5 max-w-xl">
              Keep the blueprint visible, then keep building tools that fit it.
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <MagneticButton to="/tools" variant="primary" size="lg">
              Browse the tools
              <ArrowRight size={16} strokeWidth={1.75} />
            </MagneticButton>
          </div>
        </div>
      </section>
    </>
  );
}
