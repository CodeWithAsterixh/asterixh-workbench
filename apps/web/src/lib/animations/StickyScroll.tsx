"use client";

import { type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

export interface StickyScrollProps {
  /** The scrolling content (e.g. text steps) */
  content: ReactNode;
  /** The sticky content (e.g. visual/preview) */
  stickyContent: ReactNode;
  className?: string;
  contentClassName?: string;
  stickyClassName?: string;
  /** Offset from the top for the sticky element */
  topOffset?: number;
}

/**
 * A two-column sticky scroll section: one column scrolls (typically text
 * steps) while the other stays pinned in place (typically a visual).
 */
export function StickyScroll({
  content,
  stickyContent,
  className,
  contentClassName,
  stickyClassName,
  topOffset = 100,
}: StickyScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-start",
        className,
      )}
    >
      <div className={cn("relative", contentClassName)}>{content}</div>

      <div className={cn("hidden lg:block sticky self-start", stickyClassName)} style={{ top: topOffset }}>
        {stickyContent}
      </div>
    </div>
  );
}
