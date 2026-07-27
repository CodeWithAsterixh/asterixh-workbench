import Link from "next/link";
import { ArrowRight, Compass, Sparkles, ShieldCheck, TimerReset } from "lucide-react";
import { Reveal, AnimatedCounter, MagneticButton } from "@/lib/animations";
import { FeaturedToolCard } from "@/components/FeaturedToolCard";
import { categories } from "@/data/categories";
import { featuredTools, tools } from "@/data/tools";

const metrics = [
  { target: tools.length, suffix: "", label: "Live tools" },
  { target: categories.length, suffix: "", label: "Current categories" },
  { target: 0, suffix: "", label: "Login walls" },
  { target: 100, suffix: "%", label: "Browser-first" },
];

const pillars = [
  {
    icon: Sparkles,
    title: "Fast and focused",
    body: "Each tool solves one task well, loads quickly, and stays out of the way once the work is done.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    body: "The browser does the heavy lifting whenever possible, so users can work without uploading sensitive content.",
  },
  {
    icon: TimerReset,
    title: "Reusable architecture",
    body: "The same layout, content model, and tool shell keep every new page consistent as the catalog grows.",
  },
];

export default function HomePage() {
  return (
    <>
      <section data-theme="shell" className="pt-32 pb-24">
        <div className="container flex flex-col gap-8">
          <Reveal>
            <span className="eyebrow">Workbench</span>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="flex flex-col gap-6">
              <Reveal delay={0.05}>
                <h1 className="text-display-lg max-w-4xl">
                  Small browser tools, built to feel like a serious platform.
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="lead max-w-3xl">
                  Workbench is a focused collection of browser-first utilities for developers,
                  designers, creators, and everyday internet work. The emphasis is simple:
                  quick to load, easy to use, readable on any screen, and structured so every new
                  tool fits the same system.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <MagneticButton to="/tools" variant="primary" size="lg">
                    Browse all tools
                    <Compass size={16} strokeWidth={1.75} />
                  </MagneticButton>
                  <MagneticButton to="/tools/video-to-frames" variant="secondary" size="lg">
                    Open a live tool
                    <ArrowRight size={16} strokeWidth={1.75} />
                  </MagneticButton>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <div className="card">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="eyebrow">Built for speed</span>
                    <h2 className="mt-4 text-display-sm" style={{ fontSize: "1.75rem" }}>
                      Browser work, without the clutter.
                    </h2>
                  </div>
                  <Sparkles size={18} className="text-[var(--accent)]" />
                </div>
                <div className="mt-6 grid gap-3">
                  {[
                    "Tools that solve one problem well",
                    "Content that explains the workflow clearly",
                    "Layouts that stay readable on light and dark surfaces",
                    "Architecture that can grow without redesigns",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[var(--radius-sharp)] border border-[var(--border)] bg-[var(--surface-sunken)] px-4 py-3 text-sm text-[var(--text-primary)]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section data-theme="shell" className="section border-y border-[var(--border)]">
        <div className="container grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <Reveal key={metric.label}>
              <div className="card">
                <AnimatedCounter
                  target={metric.target}
                  suffix={metric.suffix}
                  className="text-display-md font-mono"
                />
                <p className="text-secondary text-sm mt-2">{metric.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section data-theme="shell" className="section">
        <div className="container">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">Live tools</span>
            <h2 className="text-display-md mt-4 max-w-2xl">
              The current bench is the starting point for the larger catalog.
            </h2>
            <p className="lead max-w-2xl">
              These live tools already cover developer workflows, images, PDFs, text, and
              visual utilities. The shared structure makes it easy to add the next set without
              rebuilding the site each time.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {featuredTools.map((tool, i) => (
              <Reveal key={tool.slug} delay={i * 0.06}>
                <FeaturedToolCard tool={tool} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section data-theme="shell" className="section" style={{ background: "var(--surface-raised)" }}>
        <div className="container">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">Why it works</span>
            <h2 className="text-display-md mt-4 max-w-2xl">
              The site stays readable because every tool uses the same shell.
            </h2>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3 mt-12">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.title} delay={index * 0.05}>
                  <div className="card h-full">
                    <Icon size={18} className="text-[var(--accent)]" />
                    <h3 className="mt-5 text-display-sm" style={{ fontSize: "1.5rem" }}>
                      {pillar.title}
                    </h3>
                    <p className="text-secondary mt-4 text-sm leading-relaxed">{pillar.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section data-theme="shell" className="section">
        <div className="container">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">Browse by category</span>
            <h2 className="text-display-md mt-4 max-w-2xl">
              Every category is an entry point into a larger cluster.
            </h2>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-12">
            {categories.map((category) => (
              <Reveal key={category.id}>
                <Link
                  href={`/tools#${category.id}`}
                  className="card block h-full transition-colors hover:border-[var(--accent)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-display-sm" style={{ fontSize: "1.45rem" }}>
                      {category.label}
                    </h3>
                    <span className="timecode">Tools</span>
                  </div>
                  <p className="text-secondary mt-4 text-sm leading-relaxed">{category.description}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section data-theme="shell" className="section border-t border-[var(--border)]">
        <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10">
          <div>
            <span className="eyebrow">Next step</span>
            <h2 className="text-display-sm mt-5 max-w-xl">
              Jump into a tool and keep the work moving.
            </h2>
          </div>
          <MagneticButton to="/tools" variant="primary" size="lg">
            Browse all tools
            <ArrowRight size={16} strokeWidth={1.75} />
          </MagneticButton>
        </div>
      </section>
    </>
  );
}
