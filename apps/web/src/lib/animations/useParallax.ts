"use client";

import { useScroll, useTransform, useSpring, useReducedMotion, MotionValue, type UseScrollOptions } from "motion/react";
import type { RefObject } from "react";

export interface ParallaxOptions {
  /** The target element to track for scroll offset */
  target?: RefObject<HTMLElement | null>;
  /** Scroll offset configuration e.g., ["start end", "end start"] */
  offset?: UseScrollOptions["offset"];
  /** Output range mapping to scroll progress [0, 1] */
  range?: number[];
  /** Animation easing curve (spring config) or false to disable spring */
  spring?: { stiffness?: number; damping?: number; mass?: number } | false;
  /** Disables parallax if user prefers reduced motion */
  respectReducedMotion?: boolean;
}

export function useParallax({
  target,
  offset = ["start end", "end start"],
  range = [-100, 100],
  spring = { stiffness: 400, damping: 90 },
  respectReducedMotion = true,
}: ParallaxOptions): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target,
    offset,
  });

  const prefersReducedMotion = useReducedMotion();
  const shouldDisable = respectReducedMotion && prefersReducedMotion;

  const rawTransform = useTransform(scrollYProgress, [0, 1], range);

  const springTransform = useSpring(rawTransform, spring || undefined);

  // Return rawTransform directly if spring is disabled, else springTransform.
  // If reduced motion is preferred, return a static value (0).
  const motionValue = spring === false ? rawTransform : springTransform;
  const disabledTransform = useTransform(scrollYProgress, () => 0);

  return shouldDisable ? disabledTransform : motionValue;
}
