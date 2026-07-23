"use client";

import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import { type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

export interface ZoomScrollProps {
  children: ReactNode;
  className?: string;
  /** Height of the scroll container to dictate animation duration */
  containerHeight?: string;
  /** Scale range [startScale, endScale] */
  scaleRange?: [number, number];
  /** Opacity range [startOpacity, endOpacity] */
  opacityRange?: [number, number];
}

/**
 * Pins its content while scaling it up as the section scrolls through view —
 * a "zoom in" effect driven entirely by scroll position.
 */
export function ZoomScroll({
  children,
  className,
  containerHeight = "150vh",
  scaleRange = [0.8, 1.1],
  opacityRange = [0.5, 1],
}: ZoomScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const prefersReducedMotion = useReducedMotion();

  const rawScale = useTransform(scrollYProgress, [0, 0.5], scaleRange);
  const scale = useSpring(rawScale, { stiffness: 400, damping: 90 });

  const rawOpacity = useTransform(scrollYProgress, [0, 0.5], opacityRange);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)} style={{ height: containerHeight }}>
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{
            scale: prefersReducedMotion ? 1 : scale,
            opacity: prefersReducedMotion ? 1 : rawOpacity,
          }}
          className="w-full h-full flex items-center justify-center"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
