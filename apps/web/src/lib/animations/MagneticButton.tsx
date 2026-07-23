"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useMagnetic } from "./useMagnetic";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "md" | "lg";
  className?: string;
  strength?: number;
  type?: "button" | "submit";
  disabled?: boolean;
}

const variantClasses: Record<NonNullable<MagneticButtonProps["variant"]>, string> = {
  primary: "btn btn--primary",
  secondary: "btn btn--secondary",
  accent: "btn btn--accent",
  ghost: "btn btn--ghost",
};

/**
 * A CTA button that gently pulls toward the cursor when hovered (magnetic
 * effect), with a spring-based release on mouse leave. Renders as a
 * <Link>, <a>, or <button> depending on props — except when disabled,
 * which always forces real <button disabled> semantics regardless of
 * to/href (a disabled Link/anchor can still be reached and activated via
 * keyboard in some browsers; a disabled button genuinely can't).
 */
export function MagneticButton({
  children,
  to,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  strength = 0.25,
  type = "button",
  disabled = false,
}: MagneticButtonProps) {
  const magnetic = useMagnetic(strength, 80);

  const classes = cn(
    "group/magnetic relative inline-flex items-center justify-center select-none",
    variantClasses[variant],
    size === "lg" ? "btn--lg" : "",
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    className,
  );

  const content = (
    <motion.div
      onMouseMove={disabled ? undefined : magnetic.onMouseMove}
      onMouseLeave={disabled ? undefined : magnetic.onMouseLeave}
      style={disabled ? undefined : magnetic.style}
      className="relative"
      data-magnetic
    >
      <div className={classes} onClick={disabled ? undefined : onClick} aria-disabled={disabled || undefined}>
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </div>
    </motion.div>
  );

  if (disabled) {
    return (
      <button type={type} disabled className="inline-block bg-transparent p-0 border-0 outline-none">
        {content}
      </button>
    );
  }

  if (to) {
    return (
      <Link href={to} className={cn("inline-block", className)}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={cn("inline-block", className)}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className="inline-block bg-transparent p-0 border-0 outline-none">
      {content}
    </button>
  );
}
