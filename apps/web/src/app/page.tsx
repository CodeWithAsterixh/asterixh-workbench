import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import {
  Reveal,
  SplitHeading,
  ScrollFrameStory,
  StickyScroll,
  MagneticButton,
  AnimatedCounter,
} from "@/lib/animations";
import { ToolCard } from "@/components/ToolCard";
import { tools } from "@/data/tools";
import { buildProcessFrames, heroChapters, heroFrameCount } from "@/data/process-frames";

const capabilities = [
  {
    title: "Nothing uploaded",
    body: "The video never leaves your device. Extraction runs against a canvas element, entirely client-side.",
  },
  {
    title: "Exact frame count",
    body: "Anywhere from 4 to 240 frames, sampled evenly across the range you choose.",
  },
  {
    title: "Trim both ends",
    body: "Skip fade-ins and fade-outs without re-encoding anything — just a start and end percentage.",
  },
  {
    title: "Every frame preloaded",
    body: "Each frame decodes the moment it's extracted, so the preview grid never flashes or lazy-loads.",
  },
  {
    title: "One zip, sized up front",
    body: "File count and exact byte size are ready before download() is ever called, not after.",
  },
];

const stats = [
  { target: 13, suffix: "", label: "Tools live on the bench" },
  { target: 0, suffix: "", label: "Files uploaded to a server, ever" },
  { target: 100, suffix: "%", label: "Runs in your browser" },
];

export default function HomePage() {
  const processFrames = buildProcessFrames(heroFrameCount);

  return (
    <>
      <section data-theme="shell" className="relative h-dvh pt-32 overflow-hidden">
        <div className="container flex flex-col pb-22 gap-5">
          <Reveal>
            <span className="eyebrow">Workbench &middot; 13 tools live</span>
          </Reveal>

          <SplitHeading
            as="h1"
            text="Small tools. Sharp edges."
            className="text-display-lg mt-8 max-w-4xl"
          />

          <Reveal delay={0.3}>
            <p className="lead mt-10">
              Workbench is a growing set of single-purpose browser tools — no accounts, no
              uploads, no server round-trip. From slicing video into frames to formatting JSON,
              everything here runs entirely on your machine.
            </p>
          </Reveal>

          <Reveal delay={0.45}>
            <div className="flex flex-wrap items-center gap-5 mt-14">
              <MagneticButton to="/tools/video-to-frames" variant="primary" size="lg">
                Open Video &rarr; Frames
                <ArrowRight size={16} strokeWidth={1.75} />
              </MagneticButton>
              <MagneticButton to="/tools" variant="secondary" size="lg">
                <Compass size={16} strokeWidth={1.75} />
                Browse all tools
              </MagneticButton>
            </div>
          </Reveal>
        </div>

        <div className="tick-rule mt-32" />
      </section>

      <ScrollFrameStory
        frames={processFrames}
        chapters={heroChapters}
        alt="Abstract visualization of a video frame being extracted"
        className="bg-[var(--surface)]"
      />

      <section data-theme="shell" className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Under the hood</span>
            <h2 className="text-display-md mt-6 max-w-2xl">Built for the person doing the work</h2>
          </Reveal>

          <div className="mt-20">
            <StickyScroll
              topOffset={200}
              content={
                <div className="flex flex-col gap-20 pb-32">
                  {capabilities.map((item, index) => (
                    <Reveal key={item.title} once amount={0.5}>
                      <span className="timecode">{"//"} 0{index + 1}</span>
                      <h3 className="text-display-sm mt-4 mb-4" style={{ fontSize: "1.75rem" }}>
                        {item.title}
                      </h3>
                      <p className="lead">{item.body}</p>
                    </Reveal>
                  ))}
                </div>
              }
              stickyContent={
                <div className="panel-frame p-8 w-full h-[50vh] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow">Console</span>
                    <span className="badge badge--live">Live</span>
                  </div>
                  <pre className="border-0 bg-transparent p-0 text-sm leading-relaxed">
                    <code>
                      {"$ workbench extract clip.mp4 --frames 48\n"}
                      {"> loading-video     done\n"}
                      {"> extracting        48/48\n"}
                      {"> preloading        48/48\n"}
                      {"> toZip()           8.4 MB\n"}
                      {"> ready to download"}
                    </code>
                  </pre>
                  <span className="timecode">workbench-frames.zip</span>
                </div>
              }
            />
          </div>
        </div>
      </section>

      <section data-theme="shell" className="section" style={{ background: "var(--surface-raised)" }}>
        <div className="container flex flex-col gap-4">
          <Reveal>
            <span className="eyebrow">The shop floor</span>
            <h2 className="text-display-md mt-6 max-w-2xl">Thirteen tools live. More on the bench.</h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
            {tools.map((tool, i) => (
              <Reveal key={tool.slug} delay={i * 0.08}>
                <ToolCard tool={tool} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section data-theme="shell" className="section--tight">
        <div className="container grid grid-cols-1 sm:grid-cols-3 gap-12">
          {stats.map((stat) => (
            <Reveal key={stat.label}>
              <AnimatedCounter
                target={stat.target}
                suffix={stat.suffix}
                className="text-display-md font-mono"
              />
              <p className="text-secondary text-sm mt-2">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section data-theme="shell" className="section border-t border-[var(--border)]">
        <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-12">
          <div>
            <span className="eyebrow">Get to work</span>
            <h2 className="text-display-sm mt-6 max-w-md">Ready to pick up a tool?</h2>
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
