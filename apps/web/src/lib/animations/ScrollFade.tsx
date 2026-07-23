"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

interface ScrollFadeProps {
  children: ReactNode;
  className?: string;
}

export function ScrollFade({ children, className }: ScrollFadeProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map progress to opacity: enters faint -> full mid-viewport -> fades on exit.
  const rawOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.2, 1, 1, 0.2]);
  const opacity = useSpring(rawOpacity, { stiffness: 100, damping: 25, mass: 0.5 });

  return (
    <motion.div ref={ref} className={className} style={{ opacity }}>
      {children}
    </motion.div>
  );
}
