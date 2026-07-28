"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Sparkles, Compass } from "lucide-react";
import { Reveal, MagneticButton } from "@/lib/animations";

// Fixed dimensions we know at author-time
const ILLUSTRATION_TOP   = 24;  // pt-6
const ILLUSTRATION_H     = 160; // svg height
const GAP_ABOVE_NOTCH    = 28;  // breathing room between illustration and notch edge
const CARD_BOTTOM_MARGIN = 20;  // bottom-5
const CARD_TOP_MARGIN    = 20;  // gap inside the notch above the card
const MIN_CARD_H         = 240; // never shrink the card below this
const NOTCH_W            = 460; // fixed notch width
const CORNER_R           = 32;

export function HomepageHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1200, h: 620 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry?.contentRect || { width: 0, height: 0 };
      setSize({ w: width, h: height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;

  // ── Dynamic notch height ─────────────────────────────────────────────────
  // The notch top edge must sit BELOW the illustration.
  // notchTopY  = top of illustration + its height + breathing gap
  const notchTopY = ILLUSTRATION_TOP + ILLUSTRATION_H + GAP_ABOVE_NOTCH; // ≈ 212 px
  // ch = distance from notchTopY to the bottom of the container
  const ch = Math.max(h - notchTopY, MIN_CARD_H + CARD_BOTTOM_MARGIN + CARD_TOP_MARGIN);
  // Actual card height fills the notch minus top/bottom margins
  const cardH = ch - CARD_BOTTOM_MARGIN - CARD_TOP_MARGIN;

  const cw = NOTCH_W;
  const r  = CORNER_R;
  const cr = CORNER_R;

  const path = `
    M ${r},0
    L ${w - r},0 Q ${w},0 ${w},${r}
    L ${w},${h - ch - cr}
    Q ${w},${h - ch} ${w - cr},${h - ch}
    L ${w - cw + cr},${h - ch}
    Q ${w - cw},${h - ch} ${w - cw},${h - ch + cr}
    L ${w - cw},${h - r}
    Q ${w - cw},${h} ${w - cw - r},${h}
    L ${r},${h} Q 0,${h} 0,${h - r}
    L 0,${r} Q 0,0 ${r},0 Z
  `;

  return (
    <section data-theme="shell" className="relative pt-2 pb-10 min-h-dvh px-4 bg-(--text-primary)!">
      <div className="w-full">
        <div
          ref={containerRef}
          className="relative flex flex-col pt-[calc(var(--header-height)+2rem)] justify-around lg:block h-[calc((100dvh-1rem))] min-h-fit gap-10 lg:gap-0 rounded-[2rem] border border-[var(--border)] lg:border-none bg-gradient-to-br from-[var(--surface-raised)] to-[var(--surface)] lg:bg-none p-6 md:p-12 lg:p-16"
        >
          {/* Dynamic SVG — dark shell with computed bottom-right notch */}
          <div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0">
            <svg
              className="w-full h-full text-[var(--surface-raised)] fill-current stroke-[var(--border)] stroke-1"
              viewBox={`0 0 ${w} ${h}`}
              preserveAspectRatio="none"
            >
              <path d={path} vectorEffect="non-scaling-stroke" />
            </svg>
          </div>

          {/* ── Main grid ─────────────────────────────────────── */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-full">

            {/* Left — Headline + CTAs */}
            <div className="lg:col-span-7 flex flex-col justify-center gap-6">
              <Reveal>
                <span className="eyebrow">Workbench Platform</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="text-display-sm max-w-2xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Small browser tools, built to feel like a serious platform.
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="lead max-w-xl text-secondary">
                  Workbench is a focused collection of browser-first utilities for developers,
                  designers, creators, and everyday internet work. Quick to load, easy to use,
                  readable on any screen, and structured so every new tool fits the same system.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <MagneticButton to="/tools" variant="primary" size="lg">
                    Browse all tools <Compass size={16} strokeWidth={1.75} />
                  </MagneticButton>
                  <MagneticButton to="/tools/video-to-frames" variant="secondary" size="lg">
                    Open a live tool <ArrowRight size={16} strokeWidth={1.75} />
                  </MagneticButton>
                </div>
              </Reveal>
            </div>

            {/*
              Right — Illustration.
              Absolutely positioned so its bottom is PINNED to notchTopY,
              keeping it fully inside the dark shell region above the notch.
            */}
            <div className="hidden lg:block lg:col-span-5 z-10">
              <div
                className="absolute right-6"
                style={{ top: `${ILLUSTRATION_TOP}px` }}
              >
                <Reveal delay={0.15}>
                  <svg
                    width="360"
                    height={ILLUSTRATION_H}
                    viewBox="0 0 360 160"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="home-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--accent)" />
                        <stop offset="100%" stopColor="var(--accent-secondary)" />
                      </linearGradient>
                    </defs>
                    {/* Faint grid overlay */}
                    <rect x="0" y="0" width="360" height="160" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.15" />
                    <line x1="180" y1="0" x2="180" y2="160" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3" opacity="0.2" />

                    {/* Node 1 — Code Terminal */}
                    <rect x="10" y="20" width="140" height="100" rx="8" fill="var(--surface-sunken)" stroke="var(--border-strong)" strokeWidth="1.25" />
                    <circle cx="25" cy="33" r="3" fill="#ff5f56" />
                    <circle cx="35" cy="33" r="3" fill="#ffbd2e" />
                    <circle cx="45" cy="33" r="3" fill="#27c93f" />
                    <path d="M 25,60 L 35,50 L 25,40" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="45" y="47" width="40" height="5" rx="1.5" fill="var(--accent-secondary)" fillOpacity="0.6" />
                    <rect x="25" y="72" width="80" height="4" rx="1.5" fill="var(--border-strong)" opacity="0.7" />
                    <rect x="25" y="84" width="60" height="4" rx="1.5" fill="var(--border-strong)" opacity="0.7" />
                    <rect x="25" y="96" width="70" height="4" rx="1.5" fill="var(--border-strong)" opacity="0.5" />

                    {/* Node 2 — Waveform */}
                    <rect x="190" y="20" width="160" height="100" rx="10" fill="var(--surface-sunken)" stroke="var(--accent-secondary)" strokeWidth="1.25" />
                    <path d="M 205,70 L 220,50 L 235,95 L 250,58 L 265,80 L 280,70 L 340,70" stroke="url(#home-glow-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="265" cy="80" r="4" fill="var(--accent)" />

                    {/* Connector dash */}
                    <path d="M 150,70 L 190,70" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
                  </svg>
                </Reveal>
              </div>
            </div>
          </div>

          {/*
            ── "Built for Speed" card ──────────────────────────────
            Absolutely positioned inside the notch.
            Height = cardH, computed so its top sits at the notch boundary.
          */}
          <div
            data-theme="paper"
            className="mt-8 lg:mt-0 lg:absolute lg:right-5 lg:bottom-5 bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xl z-20 w-full lg:w-[420px] flex flex-col"
            style={{ height: `fit-content` }}
          >
            {/* ── Header ──────────────────────────────────────── */}
            <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-[var(--border)]">
              <div className="flex flex-col gap-1">
                <span className="eyebrow font-semibold" style={{ color: "var(--accent)" }}>
                  Built for speed
                </span>
                <h3
                  className="text-[1.1rem] font-bold text-[var(--text-primary)] leading-snug"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Browser work, without the clutter.
                </h3>
              </div>
            </div>

            {/* ── 2 × 2 Checklist grid (equal-height cells) ── */}
            <div className="grid grid-cols-2 gap-px bg-[var(--border)] flex-1 min-h-fit">
              {[
                "Tools that solve one problem well",
                "Content that explains the workflow clearly",
                "Layouts that stay readable on light and dark surfaces",
                "Architecture that can grow without redesigns",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-[var(--surface-sunken)] p-4 text-[11.5px] text-[var(--text-secondary)] leading-relaxed flex items-start"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* ── Footer ──────────────────────────────────────── */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border)] bg-[var(--surface-raised)] shrink-0">
              <span className="text-[10px] timecode uppercase tracking-wider">100% Client-Side</span>
              <Link
                href="/tools"
                className="btn btn--primary text-[10px] font-mono tracking-wider flex items-center gap-1.5 px-4 h-8 rounded-[var(--radius-control)]"
                style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
              >
                Browse Catalog <ArrowRight size={11} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
