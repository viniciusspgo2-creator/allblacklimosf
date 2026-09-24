import Link from "next/link";
import Image from "next/image";
import { BookingWizard } from "@/components/booking-wizard";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/lib/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Chauffeur Ride in San Francisco",
  description:
    "Request an airport transfer, professional chauffeur, executive vehicle, hourly service, private itinerary, or group transportation quote from All Black Limo SF.",
  keywords: [
    "book San Francisco chauffeur",
    "request SFO airport transfer",
    "black car reservation",
    "All Black Limo SF booking",
  ],
  alternates: { canonical: "/book-now" },
};

export default function BookNowPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Private Chauffeur Ride Request",
          serviceType: "Black Car Service",
          provider: { "@id": `${siteUrl}/#business` },
          areaServed: ["San Francisco", "Bay Area", "Northern California"],
          url: `${siteUrl}/book-now`,
          description:
            "Premium 3-step ride request: passenger information, trip details with map, and ride preferences.",
        }}
      />

      <section className="page-hero page-hero--compact">
        <div className="page-hero__media">
          <Image
            src="/images/fleet-lincoln-navigator.webp"
            alt="Black Lincoln Navigator available for chauffeur service"
            width={1264}
            height={848}
            priority
          />
        </div>
        <div className="site-shell page-hero__inner">
          <div className="page-hero__copy" data-reveal>
            <div className="breadcrumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Request a ride</span>
            </div>
            <span className="eyebrow">Tell us about the journey</span>
            <h1 className="page-title">
              Your ride begins
              <br />
              with the <em>right details.</em>
            </h1>
            <p>
              Complete the request below. Availability, itinerary, vehicle category, and quote are reviewed before your reservation is confirmed.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="site-shell">
          <BookingWizard />
        </div>
      </section>

      <section className="section section--light">
        <div className="site-shell split-story">
          <div className="split-story__copy" data-reveal>
            <span className="section-kicker section-kicker--dark">A premium booking experience</span>
            <h2 className="section-title section-title--dark">
              Reserve like a
              <br />
              <em>concierge client.</em>
            </h2>
            <p style={{ color: "var(--muted-dark)", marginTop: 16 }}>
              Our booking flow is designed for executives, frequent travelers, and clients who expect precision. From pickup to destination, every detail is considered before the chauffeur arrives.
            </p>
            <ul className="feature-lines" style={{ marginTop: 22 }}>
              <li><i className="fa-solid fa-check" /> Three-step wizard</li>
              <li><i className="fa-solid fa-check" /> Interactive map with route preview</li>
              <li><i className="fa-solid fa-check" /> Address autocomplete</li>
              <li><i className="fa-solid fa-check" /> Real-time trip summary</li>
            </ul>
          </div>
          <div className="split-story__media" data-reveal data-reveal-delay="1">
            <Image
              src="/images/fleet-cadillac-escalade-esv.webp"
              alt="Cadillac Escalade ESV ready for a private ride"
              width={1264}
              height={848}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Sticky CTA bar */}
      <section className="section section--dark" style={{ paddingTop: 0 }}>
        <div className="booking-cta-bar">
          <small className="booking-cta-bar__note">
            For urgent or same-day transportation, call us directly.
          </small>
          <div className="booking-cta-bar__actions">
            <Link href={`tel:${site.phoneHref}`} className="button button--outline button--compact">
              <i className="fa-solid fa-phone" /> {site.phoneDisplay}
            </Link>
            <Link href={`mailto:${site.email}`} className="button button--outline button--compact">
              <i className="fa-solid fa-envelope" /> {site.email}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
