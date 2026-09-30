"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VisitTracker } from "@/components/visit-tracker";
import { RevealInitializer } from "@/components/reveal-initializer";
import { DevDownloadButton } from "@/components/dev-download-button";
import { useEffect } from "react";

/**
 * Wraps public page content with the site header, footer, visit tracker,
 * and reveal-on-scroll animation initializer.
 *
 * On /admin routes, renders children untouched so the admin panel gets
 * its own full-screen layout via AdminShell.
 *
 * Also sets a body class based on the current route for targeted CSS
 * (e.g., "booking-page" on /book-now to hide the mobile action bar).
 *
 * The DevDownloadButton is included only in development — it automatically
 * returns null in production (Vercel) via process.env.NODE_ENV check.
 */
export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const isBooking = pathname === "/book-now";

  useEffect(() => {
    if (isBooking) {
      document.body.classList.add("booking-page");
    } else {
      document.body.classList.remove("booking-page");
    }
    return () => {
      document.body.classList.remove("booking-page");
    };
  }, [isBooking]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
      <VisitTracker />
      <RevealInitializer />
      <DevDownloadButton />
    </>
  );
}
