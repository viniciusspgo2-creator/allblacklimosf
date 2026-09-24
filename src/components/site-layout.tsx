import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VisitTracker } from "@/components/visit-tracker";

/**
 * Public site layout — wraps a page with the All Black Limo SF
 * header (service bar + sticky nav + mega menu + language switcher)
 * and footer (closing CTA + main footer + mobile action bar).
 *
 * Also injects the visit tracker for the admin analytics dashboard.
 */
export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
      <VisitTracker />
    </>
  );
}
