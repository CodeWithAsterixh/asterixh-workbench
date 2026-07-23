"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  as?: "div" | "section" | "span" | "p" | "h1" | "h2" | "h3";
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A generic scroll-triggered reveal animation. Fades and slides content in
 * as it enters the viewport, respecting reduced-motion preferences.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  yOffset = 30,
  duration = 0.7,
  once = false,
  amount = 0.2,
  as = "div",
}: RevealProps) {
  const Tag = motion[as] as ElementType;
  const prefersReducedMotion = useReducedMotion();

  const initial = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: yOffset };
  const whileInView = prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <Tag
      className={cn(className)}
      initial={initial}
      whileInView={whileInView}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}
