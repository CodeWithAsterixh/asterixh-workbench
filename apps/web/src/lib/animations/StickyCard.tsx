"use client";

import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import { type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

export interface StickyCardProps {
  children: ReactNode;
  className?: string;
  /** Index of the card to calculate top offset for stacking */
  index?: number;
  /** Base top offset (e.g., header height) */
  topOffset?: number;
  /** Additional offset per card */
  stackOffset?: number;
}

/**
 * A card that sticks to the top of the viewport and stacks with other
 * StickyCards, scaling down slightly as subsequent cards scroll over it.
 */
export function StickyCard({
  children,
  className,
  index = 0,
  topOffset = 100,
  stackOffset = 30,
}: StickyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start start", "end start"],
  });

  const prefersReducedMotion = useReducedMotion();

  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const scale = useSpring(rawScale, { stiffness: 400, damping: 40 });
  const rawOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

  const topPosition = topOffset + index * stackOffset;

  return (
    <motion.div
      ref={cardRef}
      className={cn("sticky", className)}
      style={{
        top: topPosition,
        scale: prefersReducedMotion ? 1 : scale,
        opacity: prefersReducedMotion ? 1 : rawOpacity,
        zIndex: index,
      }}
    >
      {children}
    </motion.div>
  );
}
