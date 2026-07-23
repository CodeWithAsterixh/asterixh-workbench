"use client";

import { useEffect, useState } from "react";
import { useScroll, useSpring, motion } from "motion/react";

/**
 * Thin progress bar fixed to the top of the viewport, tracking scroll position.
 *
 * Any section that sits on a light "paper" surface can opt into inverting
 * the bar color (so it stays visible against the dark accent) by adding a
 * `data-progress-invert` attribute:
 *
 *   <section data-progress-invert>...</section>
 *
 * This keeps the component decoupled from any specific page's section IDs.
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.5 });
  const [onInvertedSection, setOnInvertedSection] = useState(false);

  useEffect(() => {
    const invertTargets = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-progress-invert]"));

    const handleScroll = () => {
      const targets = invertTargets();
      if (targets.length === 0) {
        setOnInvertedSection(false);
        return;
      }
      const overlapping = targets.some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= 0 && rect.bottom >= 2;
      });
      setOnInvertedSection(overlapping);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left transition-colors duration-300 scroll-progress-bar"
      style={{
        scaleX,
        backgroundColor: onInvertedSection ? "var(--accent-secondary)" : "var(--accent)",
      }}
    />
  );
}
