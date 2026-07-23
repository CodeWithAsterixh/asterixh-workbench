"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useRef } from "react";
import { useParallax, type ParallaxOptions } from "./useParallax";

export interface ParallaxProps extends Omit<ParallaxOptions, "target"> {
  children: ReactNode;
  className?: string;
  /** Whether the parallax effect should be applied to the container itself as target */
  selfTarget?: boolean;
}

/**
 * A wrapper component that applies a parallax effect to its children.
 * Uses the element itself as the scroll target by default (selfTarget),
 * otherwise tracks the closest scroll container.
 */
export function Parallax({
  children,
  className,
  offset = ["start end", "end start"],
  range = [-100, 100],
  spring = { stiffness: 400, damping: 90 },
  respectReducedMotion = true,
  selfTarget = true,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const y = useParallax({
    target: selfTarget ? ref : undefined,
    offset,
    range,
    spring,
    respectReducedMotion,
  });

  const prefersReducedMotion = useReducedMotion();
  const shouldDisable = respectReducedMotion && prefersReducedMotion;

  return (
    <motion.div ref={ref} className={className} style={{ y: shouldDisable ? 0 : y }} initial={false}>
      {children}
    </motion.div>
  );
}
