"use client";

import { useEffect, useState } from "react";

interface BackgroundVideoProps {
  src: string;
  poster: string;
  className?: string;
}

export function BackgroundVideo({ src, poster, className }: BackgroundVideoProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reducedMotion) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt="" aria-hidden="true" className={className} />;
  }

  return (
    <video autoPlay muted loop playsInline poster={poster} className={className}>
      <source src={src} type="video/mp4" />
    </video>
  );
}
