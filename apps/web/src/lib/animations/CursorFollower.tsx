"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface MagneticRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * A soft dot + ring cursor that follows the pointer with spring physics
 * and "snaps" (scales + sticks) onto any element marked with
 * data-magnetic or data-cursor="text"/"view". Desktop pointer-fine only;
 * fully inert on touch devices and respects prefers-reduced-motion.
 */
export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduced);
  }, []);
  const [variant, setVariant] = useState<"default" | "magnetic" | "text" | "link">("default");
  const [visible, setVisible] = useState(false);
  const [magneticRect, setMagneticRect] = useState<MagneticRect | null>(null);
  const [linkAnimation, setLinkAnimation] = useState<{ rect: DOMRect; entryX: number } | null>(null);
  const visibleRef = useRef(false);
  const enteredLinkRef = useRef<HTMLElement | null>(null);
  const MAGNET_EXTRA_PX = 8;

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const ringX = useSpring(mouseX, { stiffness: 300, damping: 30, mass: 0.4 });
  const ringY = useSpring(mouseY, { stiffness: 300, damping: 30, mass: 0.4 });
  const dotX = useSpring(mouseX, { stiffness: 700, damping: 40, mass: 0.2 });
  const dotY = useSpring(mouseY, { stiffness: 700, damping: 40, mass: 0.2 });

  // Dedicated motion values for cursor position/size to ensure smooth transitions
  const cursorX = useSpring(ringX.get(), { stiffness: 300, damping: 30, mass: 0.5 });
  const cursorY = useSpring(ringY.get(), { stiffness: 300, damping: 30, mass: 0.5 });
  const cursorWidth = useSpring(32, { stiffness: 300, damping: 30, mass: 0.5 });
  const cursorHeight = useSpring(32, { stiffness: 300, damping: 30, mass: 0.5 });
  const cursorMarginLeft = useSpring(-16, { stiffness: 300, damping: 30, mass: 0.5 });
  const cursorMarginTop = useSpring(-16, { stiffness: 300, damping: 30, mass: 0.5 });

  const isMagnetic = variant === "magnetic" && magneticRect;
  const isText = variant === "text";
  const isLink = variant === "link" && linkAnimation;

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      const target = e.target as HTMLElement;
      const magnetic = target.closest("[data-magnetic]");
      const textEl = target.closest("[data-cursor='text']");
      const linkEl = target.closest("a, [data-cursor='link']");

      if (magnetic) {
        setVariant("magnetic");
        const button = magnetic.querySelector(".group\\/magnetic") as HTMLElement;
        if (button) {
          const buttonRect = button.getBoundingClientRect();
          setMagneticRect({
            x: buttonRect.left + buttonRect.width / 2,
            y: buttonRect.top + buttonRect.height / 2,
            width: buttonRect.width,
            height: buttonRect.height,
          });
        }
      } else if (linkEl) {
        setVariant("link");
        if (enteredLinkRef.current !== linkEl) {
          enteredLinkRef.current = linkEl as HTMLElement;
          const rect = linkEl.getBoundingClientRect();
          setLinkAnimation({ rect, entryX: e.clientX });
        }
      } else {
        setVariant(textEl ? "text" : "default");
        setMagneticRect(null);
        enteredLinkRef.current = null;
        setLinkAnimation(null);
      }
    };

    const handleLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    window.addEventListener("mousemove", handleMove);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, [enabled, mouseX, mouseY]);

  useEffect(() => {
    if (isMagnetic && magneticRect) {
      const expandedWidth = magneticRect.width + MAGNET_EXTRA_PX * 2;
      const expandedHeight = magneticRect.height + MAGNET_EXTRA_PX * 2;
      cursorX.set(magneticRect.x);
      cursorY.set(magneticRect.y);
      cursorWidth.set(expandedWidth);
      cursorHeight.set(expandedHeight);
      cursorMarginLeft.set(-expandedWidth / 2);
      cursorMarginTop.set(-expandedHeight / 2);
    } else {
      cursorX.set(ringX.get());
      cursorY.set(ringY.get());
      cursorWidth.set(32);
      cursorHeight.set(32);
      cursorMarginLeft.set(-16);
      cursorMarginTop.set(-16);
    }
  }, [variant, magneticRect, ringX, ringY, cursorX, cursorY, cursorWidth, cursorHeight, cursorMarginLeft, cursorMarginTop, isMagnetic]);

  useEffect(() => {
    if (!isMagnetic) {
      const unsubscribeX = ringX.on("change", (v) => cursorX.set(v));
      const unsubscribeY = ringY.on("change", (v) => cursorY.set(v));
      return () => {
        unsubscribeX();
        unsubscribeY();
      };
    }
  }, [variant, ringX, ringY, cursorX, cursorY, isMagnetic]);

  if (!enabled) return null;

  return (
    <div
      className="cursor-follower pointer-events-none fixed inset-0 hidden md:block"
      style={{ mixBlendMode: "difference" }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute"
        style={{
          x: cursorX,
          y: cursorY,
          width: cursorWidth,
          height: cursorHeight,
          marginLeft: cursorMarginLeft,
          marginTop: cursorMarginTop,
        }}
        animate={{
          opacity: visible ? (isMagnetic ? 1 : isLink ? 0 : 0.6) : 0,
          scale: isText ? 3.2 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.5,
          opacity: { duration: 0.2 },
          scale: { type: "spring", stiffness: 250, damping: 20 },
        }}
      >
        {!isText && !isLink && (
          <>
            <div
              className="absolute top-0 left-0 border-t border-l border-white/80 rounded-tl-md"
              style={{ width: isMagnetic ? 20 : 10, height: isMagnetic ? 20 : 10 }}
            />
            <div
              className="absolute top-0 right-0 border-t border-r border-white/80 rounded-tr-md"
              style={{ width: isMagnetic ? 20 : 10, height: isMagnetic ? 20 : 10 }}
            />
            <div
              className="absolute bottom-0 left-0 border-b border-l border-white/80 rounded-bl-md"
              style={{ width: isMagnetic ? 20 : 10, height: isMagnetic ? 20 : 10 }}
            />
            <div
              className="absolute bottom-0 right-0 border-b border-r border-white/80 rounded-br-md"
              style={{ width: isMagnetic ? 20 : 10, height: isMagnetic ? 20 : 10 }}
            />
          </>
        )}
        {isText && <div className="absolute inset-0 rounded-md border border-white/80" />}
      </motion.div>

      <motion.div
        className="absolute rounded-full bg-white"
        style={{ x: dotX, y: dotY, width: 6, height: 6, marginLeft: -3, marginTop: -3 }}
        animate={{ opacity: visible ? 1 : 0, scale: 1 }}
        transition={{ duration: 0.15 }}
      />

      {isLink && linkAnimation && (
        <div
          style={{
            left: linkAnimation.rect.left,
            top: linkAnimation.rect.bottom + 4,
            width: linkAnimation.rect.width,
            height: 4,
            position: "absolute",
          }}
        >
          <motion.div
            className="absolute border-b border-white/80"
            style={{
              left: 0,
              top: 0,
              right: linkAnimation.rect.width - (linkAnimation.entryX - linkAnimation.rect.left),
              height: "100%",
              transformOrigin: "right",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
          <motion.div
            className="absolute border-b border-white/80"
            style={{
              left: linkAnimation.entryX - linkAnimation.rect.left,
              top: 0,
              width: linkAnimation.rect.right - linkAnimation.entryX,
              height: "100%",
              transformOrigin: "left",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </div>
      )}
    </div>
  );
}
