"use client";

import { useMotionValue, useSpring } from "motion/react";
import React, { useCallback } from "react";

/**
 * A hook that handles magnetic behavior.
 * Computes mouse distance from the center of the element and offsets the element.
 */
export function useMagnetic(strength = 0.25, radius = 80) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 200, damping: 20, mass: 0.5 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const { clientX, clientY } = e;
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < radius) {
        x.set(distanceX * strength);
        y.set(distanceY * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    },
    [strength, radius, x, y],
  );

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return {
    onMouseMove,
    onMouseLeave,
    style: {
      x: springX,
      y: springY,
    },
  };
}
