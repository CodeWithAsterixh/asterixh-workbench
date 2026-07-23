"use client";

import { useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

interface AnimatedCounterProps {
  target: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({ target, decimals = 0, suffix = "", className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 60, damping: 20, mass: 0.8 });
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (isInView) motionValue.set(target);
  }, [isInView, motionValue, target]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = v.toFixed(decimals) + suffix;
      }
    });
    return unsubscribe;
  }, [springValue, decimals, suffix]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
