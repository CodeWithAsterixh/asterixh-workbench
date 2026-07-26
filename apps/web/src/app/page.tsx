import { ArrowRight, BookOpenText, Compass, Layers3, ShieldCheck, Workflow } from "lucide-react";
import { Reveal, AnimatedCounter, MagneticButton } from "@/lib/animations";
import { FeaturedToolCard } from "@/components/FeaturedToolCard";
import { featuredTools, tools } from "@/data/tools";
import {
  architectureLayers,
  launchPrinciples,
  roadmapPhases,
} from "@/data/platform-blueprint";

const metrics = [
  { target: tools.length, suffix: "", label: "Live tools today" },
  { target: 7, suffix: "", label: "Current categories" },
  { target: 0, suffix: "", label: "Login walls" },
  { target: 100, suffix: "%", label: "Browser-first" },
];

export default function HomePage() {
  return (
    <>
      <section data-theme="shell" className="relative overflow-hidden pt-32 pb-24">
        <div className="container flex flex-col gap-8">
          <Reveal>
            <span className="eyebrow">Workbench - browser tools platform</span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-display-lg mt-4 max-w-4xl">
              Small tools now. A larger browser platform next.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="lead mt-6 max-w-3xl">
              Workbench is evolving from a compact tools site into a browser-first platform
              built around speed, privacy, accessibility, SEO, and reusable architecture.
              Every tool should solve one problem well, stay fast on mobile, and remain easy to
              expand into a much larger cluster.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <MagneticButton to="/strategy" variant="primary" size="lg">
                Read the blueprint
                <BookOpenText size={16} strokeWidth={1.75} />
              </MagneticButton>
              <MagneticButton to="/tools" variant="secondary" size="lg">
                <Compass size={16} strokeWidth={1.75} />
                Browse the tools
              </MagneticButton>
              <MagneticButton to="/tools/video-to-frames" variant="secondary" size="lg">
                Open a live tool
                <ArrowRight size={16} strokeWidth={1.75} />
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      <section data-theme="shell" className="section border-y border-[var(--border)]">
        <div className="container grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <Reveal key={metric.label}>
              <AnimatedCounter
                target={metric.target}
                suffix={metric.suffix}
                className="text-display-md font-mono"
              />
              <p className="text-secondary text-sm mt-2">{metric.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section data-theme="shell" className="section">
        <div className="container">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">Launch principles</span>
            <h2 className="text-display-md mt-4 max-w-2xl">
              The platform is designed around trust before monetization.
            </h2>
            <p className="lead max-w-2xl">
              Phase 1 is about audience growth: no login walls, no ads, no limits, and no
              compromise on performance. The codebase should make later monetization possible,
              but invisible until the product has earned it.
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-14">
            {launchPrinciples.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <div className="card h-full">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-[var(--accent)]" />
                    <h3 className="text-display-sm" style={{ fontSize: "1.5rem" }}>
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
            <span className="eyebrow">Platform architecture</span>
            <h2 className="text-display-md mt-4 max-w-2xl">
              Reusable systems keep the site fast as it grows.
            </h2>
            <p className="lead max-w-2xl">
              The blueprint calls for a worker-first processing model, a shared tool manifest,
              structured content generation, and SEO that is designed into every page from day
              one.
            </p>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2 mt-14">
            {architectureLayers.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <div className="card h-full">
                  <div className="flex items-center gap-3">
                    <Layers3 size={18} className="text-[var(--accent)]" />
                    <h3 className="text-display-sm" style={{ fontSize: "1.5rem" }}>
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
            <span className="eyebrow">Current bench</span>
            <h2 className="text-display-md mt-4 max-w-2xl">
              The live tools are the first cluster of the larger system.
            </h2>
            <p className="lead max-w-2xl">
              The site already has a strong seed set. The strategy is to grow from here by
              adding more linked tools, support content, and category depth instead of isolated
              pages.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {featuredTools.map((tool, i) => (
              <Reveal key={tool.slug} delay={i * 0.08}>
                <FeaturedToolCard tool={tool} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-12">
              <MagneticButton to="/tools" variant="secondary" size="lg">
                <Compass size={16} strokeWidth={1.75} />
                See every live tool
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      <section data-theme="shell" className="section" style={{ background: "var(--surface-raised)" }}>
        <div className="container">
          <Reveal className="flex flex-col gap-5">
            <span className="eyebrow">Roadmap</span>
            <h2 className="text-display-md mt-4 max-w-2xl">
              Build the audience first, then scale the platform and monetization hooks.
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
            <span className="eyebrow">Next step</span>
            <h2 className="text-display-sm mt-5 max-w-xl">
              Use the blueprint to steer the project, then keep shipping the tools.
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <MagneticButton to="/strategy" variant="primary" size="lg">
              Read the blueprint
              <ArrowRight size={16} strokeWidth={1.75} />
            </MagneticButton>
            <MagneticButton to="/tools" variant="secondary" size="lg">
              Browse tools
            </MagneticButton>
          </div>
        </div>
      </section>
    </>
  );
}
