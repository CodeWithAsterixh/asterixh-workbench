"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { categories } from "@/data/categories";
import { toolsByCategory } from "@/data/tools";

export function NavToolsMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
        data-cursor="link"
      >
        Tools
        <ChevronDown size={13} strokeWidth={1.75} style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 0.2s" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 panel-frame p-6"
            style={{ width: "42rem", maxWidth: "calc(100vw - 3rem)", background: "var(--surface-raised)" }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6">
              {categories.map((category) => (
                <div key={category.id}>
                  <span className="timecode block mb-3">{category.label}</span>
                  <ul className="flex flex-col gap-2">
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
                  </ul>
                </div>
              ))}
            </div>

            <div className="divider my-5" />

            <Link
              href="/tools"
              onClick={() => setOpen(false)}
              className="text-sm text-[var(--accent-secondary)] hover:text-[var(--accent)] transition-colors"
              data-cursor="link"
            >
              Browse every tool &rarr;
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
