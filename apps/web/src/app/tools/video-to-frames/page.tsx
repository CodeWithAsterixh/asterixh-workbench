import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/lib/animations";
import { VideoToFramesTool } from "@/features/video-to-frames";

export const metadata: Metadata = {
  title: "Video \u2192 Frames \u2014 Workbench",
  description:
    "Turn a video into a preloaded, zip-ready frame sequence \u2014 entirely in your browser. No upload, nothing leaves your machine.",
};

export default function VideoToFramesPage() {
  return (
    <>
      <section data-theme="shell" className="pt-48 pb-28">
        <div className="container">
          <Reveal>
            <nav className="timecode mb-8" aria-label="Breadcrumb">
              <Link href="/tools" className="hover:text-[var(--text-primary)] transition-colors">
                Tools
              </Link>{" "}
              / Video &rarr; Frames
            </nav>
            <span className="badge badge--live">Live</span>
            <h1 className="text-display-lg mt-8 max-w-3xl">Video &rarr; Frames</h1>
            <p className="lead mt-8">
              Drop in a video, pick a frame count, and get back a preloaded set of frames \u2014
              trimmed, sized, and ready to compile into a single .zip. Runs entirely in your
              browser; nothing is uploaded.
            </p>
          </Reveal>
        </div>
      </section>

      <div data-theme="paper">
        <section className="section--tight" style={{ background: "var(--surface)" }}>
          <div className="container">
            <VideoToFramesTool />
          </div>
        </section>
      </div>
    </>
  );
}
