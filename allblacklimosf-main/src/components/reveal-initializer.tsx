"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Replaces the vanilla JS reveal-on-scroll logic from main.js.
 * Uses a MutationObserver to detect new [data-reveal] elements added to
 * the DOM (e.g., when the booking wizard changes steps) and observes them.
 *
 * If IntersectionObserver is unavailable or reduced motion is requested,
 * all elements are made visible immediately.
 */
export function RevealInitializer() {
  const pathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Make all currently-visible-in-viewport elements visible
    const makeVisibleIfIntersecting = (el: HTMLElement) => {
      if (el.classList.contains("is-visible")) return;
      if (reducedMotion || !("IntersectionObserver" in window)) {
        el.classList.add("is-visible");
        return;
      }
      const rect = el.getBoundingClientRect();
      const inViewport =
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0;
      if (inViewport) {
        // Element is already in viewport — make it visible immediately
        // (with a tiny delay for the CSS transition to play)
        requestAnimationFrame(() => {
          el.classList.add("is-visible");
        });
      } else {
        // Element is below the fold — observe it
        observerRef.current?.observe(el);
      }
    };

    const observeAll = () => {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)")
      );
      elements.forEach(makeVisibleIfIntersecting);
    };

    if (reducedMotion || !("IntersectionObserver" in window)) {
      // Make everything visible immediately
      const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    // Create the IntersectionObserver
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );
    observerRef.current = observer;

    // Observe all current [data-reveal] elements
    observeAll();

    // Use a MutationObserver to detect new [data-reveal] elements
    // added to the DOM (e.g., when wizard step changes, or when navigating
    // to a new page via client-side routing)
    const mutationObserver = new MutationObserver((mutations) => {
      let hasNewRevealElements = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return; // Element nodes only
          const el = node as HTMLElement;
          // Check if the added node itself has data-reveal
          if (typeof el.hasAttribute === "function" && el.hasAttribute("data-reveal") && !el.classList.contains("is-visible")) {
            hasNewRevealElements = true;
          }
          // Check if the added node contains data-reveal descendants
          if (typeof el.querySelectorAll === "function") {
            const descendants = el.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");
            if (descendants.length > 0) {
              hasNewRevealElements = true;
            }
          }
        });
      });
      if (hasNewRevealElements) {
        // Defer to next frame to ensure DOM is settled
        requestAnimationFrame(() => observeAll());
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
    mutationObserverRef.current = mutationObserver;

    // Also re-observe on scroll (in case elements were added but not yet in viewport)
    const onScroll = () => {
      requestAnimationFrame(() => observeAll());
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      observerRef.current = null;
      mutationObserverRef.current = null;
    };
  }, [pathname]);

  return null;
}
