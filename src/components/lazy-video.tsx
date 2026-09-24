"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  ariaLabel?: string;
};

/**
 * Lazy-loads a video only when it scrolls near the viewport.
 * Replaces the data-lazy-video logic from main.js.
 * Autoplay + muted + loop + playsInline for background videos.
 */
export function LazyVideo({ src, poster, className, ariaLabel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const loadVideo = (video: HTMLVideoElement) => {
      if (loadedRef.current) return;
      loadedRef.current = true;
      const source = video.querySelector("source");
      if (source) {
        source.setAttribute("src", src);
      }
      video.load();
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    };

    if (reducedMotion) {
      // Don't autoplay; just show poster
      return;
    }

    if (!("IntersectionObserver" in window)) {
      // No IO support — load immediately
      loadVideo(video);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          loadVideo(video);
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "320px 0px" }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={className}
    >
      <source data-src={src} type="video/mp4" />
    </video>
  );
}
