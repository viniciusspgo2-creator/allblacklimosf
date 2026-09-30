"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Fire-and-forget visit tracker. Records a visit for the current path
 * on initial load. Failures are silent — this never blocks UX.
 */
export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    // Don't track admin pages
    if (pathname.startsWith("/admin")) return;
    // Don't track API or static asset routes
    if (pathname.startsWith("/api") || pathname.startsWith("/_next")) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer:
          typeof document !== "undefined" ? document.referrer || "" : "",
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent || "" : "",
      }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => {
      // Silent
    });

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
