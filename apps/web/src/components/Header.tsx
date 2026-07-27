"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/lib/animations";
import { NavToolsMenu } from "@/components/NavToolsMenu";
import { liveTools } from "@/data/tools";
import { categories } from "@/data/categories";
import { toolsByCategory } from "@/data/tools";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const featuredTool = liveTools[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-theme="shell"
      className={cn(
        "site-header fixed transition-colors duration-300",
        scrolled
          ? "bg-[var(--surface)]/90 backdrop-blur top-0 border-b left-0 right-0  border-[var(--border)]"
          : "bg-transparent border-b backdrop-blur-xs w-[90vw] top-2 left-1/2 -translate-x-1/2 border-transparent",
      )}
      style={{ height: "var(--header-height)" }}
    >
      <div className="container h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" data-cursor="link">
          <span className="font-mono text-xs text-[var(--accent)]">#</span>
          <span className="font-serif text-lg tracking-tight text-[var(--text-primary)]">Workbench</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavToolsMenu />
          {featuredTool && (
            <MagneticButton to={featuredTool.href} variant="secondary">
              Open {featuredTool.name}
            </MagneticButton>
          )}
        </nav>

        <button
          type="button"
          className="md:hidden text-[var(--text-primary)]"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-[var(--surface)] border-b border-[var(--border)]"
            style={{ maxHeight: "calc(100dvh - var(--header-height))", overflowY: "auto" }}
          >
            <nav className="container py-6 flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <Link
                  href="/tools"
                  onClick={() => setOpen(false)}
                  className="text-sm text-[var(--text-primary)]"
                >
                  All tools
                </Link>
              </div>

              {categories.map((category) => {
                const categoryTools = toolsByCategory(category.id);
                if (categoryTools.length === 0) return null;
                return (
                  <div key={category.id}>
                    <span className="timecode block mb-3">{category.label}</span>
                    <ul className="flex flex-col gap-3">
                      {categoryTools.map((tool) => (
                        <li key={tool.slug}>
                          <Link
                            href={tool.href}
                            onClick={() => setOpen(false)}
                            className="text-sm text-[var(--text-secondary)]"
                          >
                            {tool.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              {featuredTool && (
                <Link href={featuredTool.href} onClick={() => setOpen(false)} className="btn btn--primary w-full">
                  Open {featuredTool.name}
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
