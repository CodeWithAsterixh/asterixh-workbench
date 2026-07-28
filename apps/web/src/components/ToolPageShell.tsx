"use client";

import Link from "next/link";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/lib/animations";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { getHowItWorks } from "@/data/how-it-works";
import { getTool, type ToolSpec } from "@/data/tools";
import { getCategory } from "@/data/categories";

interface ToolPageShellProps {
  title: string;
  description: string;
  badge?: string;
  /** Tool registry slug — looks up this tool's Input/Output/Steps content. */
  slug?: string;
  children: ReactNode;
}

function HeroGraphic({ category, slug }: { category: string; slug?: string }) {
  if (slug === "grid-shapes") {
    return (
      <svg className="w-[200px] h-[200px]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-grid-dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="var(--text-tertiary)" opacity="0.25" />
          </pattern>
          <linearGradient id="hero-shape-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-secondary)" />
          </linearGradient>
          <filter id="hero-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <rect width="200" height="200" fill="url(#hero-grid-dots)" />
        <path
          d="M 40,40 L 140,40 Q 160,40 160,60 L 160,100 Q 160,120 140,120 L 100,120 Q 80,120 80,140 L 80,160 Q 80,180 60,180 L 40,180 Q 20,180 20,160 L 20,60 Q 20,40 40,40 Z"
          fill="url(#hero-shape-grad)"
          fillOpacity="0.12"
          stroke="url(#hero-shape-grad)"
          strokeWidth="2.5"
          filter="url(#hero-glow)"
        />
        <rect x="40" y="40" width="20" height="20" stroke="var(--border-strong)" strokeWidth="0.75" strokeDasharray="2 2" fill="none" />
        <rect x="60" y="40" width="20" height="20" stroke="var(--border-strong)" strokeWidth="0.75" strokeDasharray="2 2" fill="none" />
        <rect x="80" y="40" width="20" height="20" stroke="var(--border-strong)" strokeWidth="0.75" strokeDasharray="2 2" fill="none" />
        <g transform="translate(140, 60)" className="animate-pulse">
          <circle cx="0" cy="0" r="4" fill="var(--accent-secondary)" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke="var(--accent-secondary)" strokeWidth="1" opacity="0.6" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="var(--accent-secondary)" strokeWidth="1" opacity="0.6" />
        </g>
      </svg>
    );
  }

  if (slug === "design-tokens") {
    return (
      <svg className="w-[200px] h-[200px]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hero-token-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-secondary)" />
          </linearGradient>
        </defs>
        {/* Overlapping swatches layout representing k-means clustering */}
        <circle cx="65" cy="100" r="28" fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="28" fill="var(--accent-secondary)" fillOpacity="0.2" stroke="var(--accent-secondary)" strokeWidth="1.5" />
        <circle cx="135" cy="100" r="28" fill="var(--alert)" fillOpacity="0.15" stroke="var(--alert)" strokeWidth="1.5" />
        
        {/* Technical connector guide lines */}
        <path d="M 65,100 L 135,100" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3" />
        
        {/* Swatch centers */}
        <circle cx="65" cy="100" r="4" fill="var(--accent)" />
        <circle cx="100" cy="100" r="4" fill="var(--accent-secondary)" />
        <circle cx="135" cy="100" r="4" fill="var(--alert)" />

        {/* Outer orbital rings */}
        <circle cx="100" cy="100" r="64" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
      </svg>
    );
  }

  if (category === "images") {
    return (
      <svg className="w-[200px] h-[200px]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="img-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-secondary)" />
          </linearGradient>
        </defs>
        <rect x="15" y="15" width="170" height="170" rx="12" stroke="var(--border-strong)" strokeWidth="1.5" />
        <path d="M 30,25 L 25,25 L 25,30" stroke="var(--accent)" strokeWidth="2" />
        <path d="M 170,25 L 175,25 L 175,30" stroke="var(--accent)" strokeWidth="2" />
        <path d="M 30,175 L 25,175 L 25,170" stroke="var(--accent)" strokeWidth="2" />
        <path d="M 170,175 L 175,175 L 175,170" stroke="var(--accent)" strokeWidth="2" />
        <circle cx="130" cy="70" r="16" fill="url(#img-grad)" fillOpacity="0.12" stroke="var(--accent)" strokeWidth="1.5" />
        <path d="M 25,155 L 75,95 Q 85,85 95,95 L 135,140" stroke="var(--accent-secondary)" strokeWidth="2" fill="var(--accent-secondary)" fillOpacity="0.1" />
        <path d="M 85,155 L 125,115 Q 133,107 141,115 L 175,155" stroke="var(--accent)" strokeWidth="1.5" fill="var(--accent)" fillOpacity="0.08" />
      </svg>
    );
  }

  if (category === "video") {
    return (
      <svg className="w-[200px] h-[200px]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="vid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-secondary)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
        <rect x="15" y="30" width="170" height="110" rx="8" stroke="var(--border-strong)" strokeWidth="1.5" />
        <polygon points="90,70 120,85 90,100" fill="url(#vid-grad)" fillOpacity="0.12" stroke="url(#vid-grad)" strokeWidth="2" strokeLinejoin="round" />
        <rect x="25" y="15" width="10" height="6" rx="1" fill="var(--border-strong)" opacity="0.5" />
        <rect x="55" y="15" width="10" height="6" rx="1" fill="var(--border-strong)" opacity="0.5" />
        <rect x="85" y="15" width="10" height="6" rx="1" fill="var(--border-strong)" opacity="0.5" />
        <rect x="115" y="15" width="10" height="6" rx="1" fill="var(--border-strong)" opacity="0.5" />
        <rect x="145" y="15" width="10" height="6" rx="1" fill="var(--border-strong)" opacity="0.5" />
        <rect x="15" y="155" width="170" height="8" rx="4" fill="var(--border)" />
        <rect x="15" y="155" width="100" height="8" rx="4" fill="var(--accent-secondary)" />
        <circle cx="115" cy="159" r="6" fill="var(--accent)" />
      </svg>
    );
  }

  if (category === "audio") {
    return (
      <svg className="w-[200px] h-[200px]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="25" y1="100" x2="25" y2="100" stroke="var(--border-strong)" strokeWidth="4" strokeLinecap="round" />
        <line x1="40" y1="70" x2="40" y2="130" stroke="var(--accent-secondary)" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        <line x1="55" y1="50" x2="55" y2="150" stroke="var(--accent-secondary)" strokeWidth="4" strokeLinecap="round" />
        <line x1="70" y1="80" x2="70" y2="120" stroke="var(--accent-secondary)" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
        <line x1="85" y1="40" x2="85" y2="160" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" />
        <line x1="100" y1="60" x2="100" y2="140" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
        <line x1="115" y1="30" x2="115" y2="170" stroke="var(--accent-secondary)" strokeWidth="4" strokeLinecap="round" />
        <line x1="130" y1="70" x2="130" y2="130" stroke="var(--accent-secondary)" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        <line x1="145" y1="90" x2="145" y2="110" stroke="var(--accent-secondary)" strokeWidth="4" strokeLinecap="round" />
        <line x1="160" y1="100" x2="160" y2="100" stroke="var(--border-strong)" strokeWidth="4" strokeLinecap="round" />
        <line x1="85" y1="20" x2="85" y2="180" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    );
  }

  if (category === "documents") {
    return (
      <svg className="w-[200px] h-[200px]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="50" y="20" width="110" height="140" rx="6" fill="var(--surface-sunken)" stroke="var(--border-strong)" strokeWidth="1.5" />
        <line x1="70" y1="45" x2="140" y2="45" stroke="var(--border-strong)" strokeWidth="1.5" />
        <line x1="70" y1="65" x2="120" y2="65" stroke="var(--border-strong)" strokeWidth="1.5" />
        <rect x="30" y="40" width="110" height="140" rx="6" fill="var(--surface-raised)" stroke="var(--accent)" strokeWidth="1.5" />
        <line x1="50" y1="65" x2="120" y2="65" stroke="var(--accent)" strokeWidth="2" opacity="0.6" />
        <line x1="50" y1="85" x2="100" y2="85" stroke="var(--accent-secondary)" strokeWidth="2" opacity="0.6" />
        <line x1="50" y1="105" x2="120" y2="105" stroke="var(--border-strong)" strokeWidth="1.5" />
        <line x1="50" y1="125" x2="80" y2="125" stroke="var(--border-strong)" strokeWidth="1.5" />
        <rect x="95" y="145" width="35" height="20" rx="4" fill="var(--accent)" fillOpacity="0.1" stroke="var(--accent)" strokeWidth="1" />
        <text x="103" y="158" fill="var(--accent)" fontSize="9" fontWeight="bold" fontFamily="var(--font-mono)">PDF</text>
      </svg>
    );
  }

  if (category === "design") {
    return (
      <svg className="w-[200px] h-[200px]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Graphic design layout rules blueprint */}
        <line x1="20" y1="100" x2="180" y2="100" stroke="var(--border-strong)" strokeWidth="0.75" strokeDasharray="3 3" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="var(--border-strong)" strokeWidth="0.75" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="45" stroke="var(--accent)" strokeWidth="1.5" fill="var(--accent)" fillOpacity="0.04" />
        <rect x="65" y="65" width="70" height="70" rx="8" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
        <polygon points="100,45 145,135 55,135" stroke="var(--text-tertiary)" strokeWidth="1" opacity="0.6" />
      </svg>
    );
  }

  return (
    <svg className="w-[200px] h-[200px]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="code-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-secondary)" />
        </linearGradient>
      </defs>
      <rect x="15" y="30" width="170" height="140" rx="8" fill="var(--surface-sunken)" stroke="var(--border-strong)" strokeWidth="1.5" />
      <circle cx="35" cy="45" r="4" fill="#ff5f56" />
      <circle cx="49" cy="45" r="4" fill="#ffbd2e" />
      <circle cx="63" cy="45" r="4" fill="#27c93f" />
      <path d="M 40,85 L 60,65 L 40,45" transform="translate(0, 30)" stroke="url(#code-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="75" y="90" width="60" height="8" rx="2" fill="var(--accent-secondary)" fillOpacity="0.6" />
      <rect x="40" y="115" width="100" height="6" rx="2" fill="var(--border-strong)" />
      <rect x="40" y="135" width="80" height="6" rx="2" fill="var(--border-strong)" />
    </svg>
  );
}

function getToolCardSpecs(tool: ToolSpec) {
  const categoryLabel = getCategory(tool.category).label;
  
  const engineMap: Record<string, string> = {
    images: "GPU Canvas Core",
    video: "HTML5 Video Renderer",
    audio: "Web Audio Context",
    documents: "Local PDF Sandbox",
    dev: "Browser Sandbox Engine",
    design: "Client Style Generator"
  };
  
  const engine = engineMap[tool.category] || "Local JS Sandbox";
  
  return {
    title: tool.name,
    subtitle: categoryLabel.toUpperCase(),
    text: tool.description,
    badges: [...tool.tags.slice(0, 2).map((t) => t.toUpperCase()), "LOCAL"],
    engine: engine
  };
}

/**
 * Every tool page shares this shape: a dark "shell" hero (breadcrumb, title,
 * description), a light "paper" workspace holding the actual tool UI, and —
 * when a slug is given — a "How it works" section (input, output, steps)
 * back on the dark shell. See tokens-color.css for why the theme flips here.
 */
export function ToolPageShell({ title, description, badge = "Live", slug, children }: ToolPageShellProps) {
  const cleanTitle = JSON.parse(`"${title}"`);
  const tool = slug ? getTool(slug) : undefined;
  const details = tool ? getHowItWorks(tool) : undefined;
  
  // Dynamically resolve card spec text from tool specs
  const cardSpecs = tool
    ? getToolCardSpecs(tool)
    : {
        title: title,
        subtitle: "UTILITY",
        text: description,
        badges: ["TOOL", "LOCAL"],
        engine: "Local Sandbox"
      };

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1200, h: 580 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ w: width, h: height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const w = size.w;
  const h = size.h;
  const cw = 400; // Fixed width of notch
  const ch = 150; // Fixed height of notch
  const r = 32;   // Outer corner radius
  const cr = 32;  // Inner (concave) corner radius

  // Compute the path with mathematically constant notch dimensions
  const path = `
    M ${r},0
    L ${w - r},0
    Q ${w},0 ${w},${r}
    L ${w},${h - ch - cr}
    Q ${w},${h - ch} ${w - cr},${h - ch}
    L ${w - cw + cr},${h - ch}
    Q ${w - cw},${h - ch} ${w - cw},${h - ch + cr}
    L ${w - cw},${h - r}
    Q ${w - cw},${h} ${w - cw - r},${h}
    L ${r},${h}
    Q 0,${h} 0,${h - r}
    L 0,${r}
    Q 0,0 ${r},0
    Z
  `;

  return (
    <>
      <section data-theme="shell" className="relative py-2 px-4 bg-(--text-primary)!">
          <div ref={containerRef} className="relative pt-[calc(var(--header-height)+2rem)] lg:pt-[calc(var(--header-height)+2rem)] flex flex-col justify-around lg:block h-[calc((100dvh-var(--header-height)))] rounded-[2rem] border border-[var(--border)] lg:border-none bg-gradient-to-br from-[var(--surface-raised)] to-[var(--surface)] lg:bg-none p-6 md:p-12 lg:p-16">
            {/* Dynamic SVG background with notch only on lg and up */}
            <div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0">
              <svg className="w-full h-full text-[var(--surface-raised)] fill-current stroke-[var(--border)] stroke-1" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                <path d={path} vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center lg:h-full">
              {/* Left Column: Hero Text */}
              <div className="lg:col-span-8">
                <Reveal className="flex flex-col gap-4">
                  <nav className="timecode mb-2" aria-label="Breadcrumb">
                    <Link href="/tools" className="hover:text-[var(--text-primary)] transition-colors">
                      Tools
                    </Link>{" "}
                    / {title}
                  </nav>
                  <span className="badge badge--live w-fit">{badge}</span>
                  <h1 className="text-display-lg mt-2 max-w-2xl font-bold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                    {cleanTitle}
                  </h1>
                  <p className="lead mt-2 text-secondary max-w-xl">{description}</p>
                </Reveal>
              </div>

              {/* Right Column: Complex Tool-Specific SVG Graphic */}
              <div className="hidden lg:col-span-4 lg:flex flex-col justify-start items-end h-full pt-4 pr-6 pb-24 z-10">
                <Reveal delay={0.15}>
                  <div className="relative p-6 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-sunken)] shadow-xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)] to-transparent opacity-[0.03]"></div>
                    <HeroGraphic category={tool?.category || "default"} slug={tool?.slug} />
                  </div>
                </Reveal>
              </div>
            </div>

            {/* Bottom Right Floating Tool-Specific Specs Card (floating inside the notch with perfect uniform margins) */}
            <div data-theme="paper" className="mt-8 lg:mt-0 lg:absolute lg:right-4 lg:bottom-4 lg:w-[368px] lg:h-[118px] bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl p-5 flex flex-col justify-between shadow-lg z-20">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-[var(--accent)] font-semibold" style={{ color: "var(--accent)" }}>{cardSpecs.title}</span>
                <span className="text-[9px] timecode uppercase tracking-wider">{cardSpecs.subtitle}</span>
              </div>
              
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-2 mt-1">
                <span className="text-[10px] timecode uppercase">{cardSpecs.engine}</span>
                <a
                  href="#tool-workspace"
                  className="btn btn--primary py-1 px-3 text-[10px] font-mono tracking-wider text-center flex items-center justify-center gap-1 leading-none h-7 rounded-[var(--radius-control)] cursor-pointer"
                  style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
                >
                  Use Tool <ArrowRight size={10} />
                </a>
              </div>
            </div>
          </div>
      </section>

      <div data-theme="paper" id="tool-workspace">
        <section className="section--tight" style={{ background: "var(--surface)", color: "var(--text-primary)" }}>
          <div className="container">
            <div className="text-[var(--text-primary)]">{children}</div>
          </div>
        </section>
      </div>

      {details && tool && (
        <HowItWorksSection tool={tool} input={details.input} output={details.output} steps={details.steps} />
      )}
    </>
  );
}
