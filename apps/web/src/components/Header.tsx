"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/lib/animations";
import { liveTools } from "@/data/tools";

const navLinks = [{ href: "/tools", label: "Tools" }];

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
        "site-header fixed top-0 left-0 right-0 transition-colors duration-300",
        scrolled
          ? "bg-[var(--surface)]/90 backdrop-blur border-b border-[var(--border)]"
          : "bg-transparent border-b border-transparent",
      )}
      style={{ height: "var(--header-height)" }}
    >
      <div className="container h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" data-cursor="link">
          <span className="font-mono text-xs text-[var(--accent)]">#</span>
          <span className="font-serif text-lg tracking-tight text-[var(--text-primary)]">Workbench</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              data-cursor="link"
            >
              {link.label}
            </Link>
          ))}
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
          >
            <nav className="container py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-mono text-sm uppercase tracking-widest text-[var(--text-secondary)]"
                >
                  {link.label}
                </Link>
              ))}
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
