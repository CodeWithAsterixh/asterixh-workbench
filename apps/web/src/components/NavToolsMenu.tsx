"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { categories } from "@/data/categories";
import { toolsByCategory } from "@/data/tools";
import { MagneticButton } from "@/lib/animations";

export function NavToolsMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // A small delay before closing prevents the menu from snapping
  // shut when the cursor briefly leaves the trigger on the way to the panel.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, []);

  // Keyboard and outside-click fallbacks
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  // Cleanup timer on unmount
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
        data-cursor="link"
      >
        Tools
        <ChevronDown
          size={13}
          strokeWidth={1.75}
          style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 0.2s" }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-full flex flex-col gap-5 left-1/2 max-h-[calc(100dvh-var(--header-height))] -translate-x-1/2 mt-4 panel-frame overflow-y-auto p-6 min-w-fit"
            style={{ width: "98dvw", background: "var(--surface-raised)" }}
            // Keep the menu open while the cursor is inside it
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="flex flex-row flex-wrap gap-x-8 gap-y-8">
              {categories.map((category) => (
                <div key={category.id} className="min-w-46 flex flex-col gap-2">
                  <span className="timecode block mb-3">{category.label}</span>
                  <ul className="flex flex-col gap-2">
                    {
                      toolsByCategory(category.id).length > 5 ? <>
                      {toolsByCategory(category.id).slice(0, 5).map((tool) => (
                        <li key={tool.slug}>
                          <Link
                            href={tool.href}
                            onClick={() => setOpen(false)}
                            className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                            data-cursor="link"
                          >
                            {tool.name}
                          </Link>
                        </li>
                      ))}
                      
                        <li>
                          <Link
                            href={`/tools#${category.id}`}
                            onClick={() => setOpen(false)}
                            className="text-sm flex items-center gap-2 text-(--accent)!"
                            data-cursor="link"
                          >
                            View all {category.id} tools <ArrowRight size={12}/>
                          </Link>
                        </li>
                      </>:<>
                      {toolsByCategory(category.id).map((tool) => (
                          <li key={tool.slug}>
                            <Link
                              href={tool.href}
                              onClick={() => setOpen(false)}
                              className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                              data-cursor="link"
                            >
                              {tool.name}
                            </Link>
                          </li>
                        ))}
                      </>
                    }
                  </ul>
                </div>
              ))}
            </div>

            <div className="divider" />

            <div className="w-full flex items-center justify-center">
              <MagneticButton href="/tools" variant="accent" onClick={() => setOpen(false)}>
              Browse every tool &rarr;
            </MagneticButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
