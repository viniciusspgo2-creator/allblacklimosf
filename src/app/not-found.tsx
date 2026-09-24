import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested page could not be found.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="page-hero">
      <div className="page-hero__media">
        <Image src="/images/fleet-audi-a6.webp" alt="" width={1264} height={848} priority />
      </div>
      <div className="site-shell page-hero__inner">
        <div className="page-hero__copy" data-reveal>
          <span className="eyebrow">404 · Wrong turn</span>
          <h1 className="page-title">
            This route
            <br />
            <em>doesn&apos;t exist.</em>
          </h1>
          <p>The page may have moved. Return home or go directly to the ride request.</p>
          <div className="hero__actions">
            <Link className="button button--gold" href="/">
              Return home <i className="fa-solid fa-arrow-right" />
            </Link>
            <Link className="button button--outline" href="/book-now">
              Request a ride
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
