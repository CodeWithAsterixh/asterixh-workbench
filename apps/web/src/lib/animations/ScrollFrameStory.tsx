"use client";

import { useRef, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { cn } from "@/lib/utils";

export interface FrameStoryChapter {
  eyebrow: string;
  title: string;
  body: string;
}

interface ScrollFrameStoryProps {
  /** Ordered sequence of frame image URLs, scrubbed across the pinned scroll range. */
  frames: string[];
  /** Text chapters synced to even segments of the same scroll range. */
  chapters: FrameStoryChapter[];
  alt: string;
  className?: string;
}

/**
 * The site's signature scroll effect: pins a section for `chapters.length`
 * viewport heights and, as the person scrolls through it, scrubs a
 * preloaded frame sequence on one side while swapping chapter copy on the
 * other — both driven by the same scroll progress value, just sampled at
 * different resolutions (many frames, few chapters).
 */
export function ScrollFrameStory({ frames, chapters, alt, className }: ScrollFrameStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameCount = frames.length;
  const chapterCount = chapters.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndexMV = useTransform(scrollYProgress, [0, 1], [0, Math.max(0, frameCount - 1)]);
  const [frameIndex, setFrameIndex] = useState(0);
  useMotionValueEvent(frameIndexMV, "change", (v) => {
    setFrameIndex(Math.min(frameCount - 1, Math.max(0, Math.round(v))));
  });

  const chapterIndexMV = useTransform(scrollYProgress, [0, 1], [0, Math.max(0, chapterCount - 1)]);
  const [chapterIndex, setChapterIndex] = useState(0);
  useMotionValueEvent(chapterIndexMV, "change", (v) => {
    setChapterIndex(Math.min(chapterCount - 1, Math.max(0, Math.round(v))));
  });

  const activeChapter = chapters[chapterIndex];
  const activeFrame = frames[frameIndex];

  return (
    <section
      ref={containerRef}
      className={cn("relative", className)}
      style={{ height: `${chapterCount * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
          <div className="relative order-2 lg:order-1 min-h-[14rem]">
            {chapters.map((chapter, i) => (
              <div
                key={chapter.title}
                className={cn(
                  "transition-opacity duration-500 flex flex-col gap-5",
                  i === chapterIndex ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none",
                )}
                aria-hidden={i !== chapterIndex}
              >
                <span className="eyebrow mb-5">{chapter.eyebrow}</span>
                <h3 className="text-display-sm mt-5 mb-5">{chapter.title}</h3>
                <p className="lead">{chapter.body}</p>
              </div>
            ))}

            <div className="flex gap-2 pt-14" role="presentation">
              {chapters.map((chapter, i) => (
                <span
                  key={chapter.title}
                  className="h-[2px] flex-1 max-w-10 transition-colors duration-300"
                  style={{ background: i === chapterIndex ? "var(--accent)" : "var(--border)" }}
                />
              ))}
            </div>
          </div>

          <div className="relative order-1 lg:order-2 aspect-square panel-frame overflow-hidden">
            {activeFrame && (
              <img
                src={activeFrame}
                alt={activeChapter ? `${alt} — ${activeChapter.title}` : alt}
                className="w-full h-full object-cover"
                draggable={false}
              />
            )}
            <div className="absolute bottom-3 right-3 timecode bg-[var(--surface)]/90 px-2 py-1">
              {String(frameIndex + 1).padStart(3, "0")} / {String(frameCount).padStart(3, "0")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
