"use client";

import { motion, type Variants } from "motion/react";
import type { ElementType } from "react";

interface SplitHeadingProps {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
}

const container: Variants = {
  hidden: {},
  visible: (delay: number = 0) => ({
    transition: { staggerChildren: 0.07, delayChildren: delay },
  }),
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

export function SplitHeading({ text, as = "h1", className, delay = 0 }: SplitHeadingProps) {
  const words = text.split(" ");
  // Render the real semantic tag — reset.css already binds the display font
  // to h1/h2/h3 by tag name, so no manual font-family class is needed here.
  const Tag = motion[as] as ElementType;

  return (
    <Tag className={className} variants={container} initial="hidden" animate="visible" custom={delay} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
          <motion.span className="inline-block" variants={word}>
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
