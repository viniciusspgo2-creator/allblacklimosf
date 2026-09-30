import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site-data";
import { JsonLd } from "@/components/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About All Black Limo SF Chauffeur Service",
  description:
    "Discover how All Black Limo SF coordinates professional chauffeurs, premium vehicles, airport transfers, executive travel, and private transportation.",
  keywords: [
    "All Black Limo SF",
    "professional chauffeurs San Francisco",
    "luxury transportation company",
    "Bay Area black car service",
  ],
  alternates: { canonical: "/about" },
};

const values: Array<[string, string, string]> = [
  ["fa-stopwatch", "Respect for time", "The itinerary guides the service. We ask about timing early so the transportation plan supports the day."],
  ["fa-eye", "Attention without intrusion", "Premium service should be present when needed and discreet throughout the journey."],
  ["fa-comments", "Clear communication", "A smoother ride begins with complete information, direct answers, and confirmed expectations."],
  ["fa-gem", "Considered presentation", "Vehicle category, arrival, and chauffeur presence all contribute to the way the experience feels."],
];

export default function AboutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About All Black Limo SF",
          description:
            "All Black Limo SF coordinates professional chauffeurs, premium vehicles, airport transfers, executive travel, and private transportation.",
          url: `${siteUrl}/about`,
          mainEntity: {
            "@type": "Organization",
            name: site.name,
            url: siteUrl,
            foundingLocation: "San Francisco, California",
            email: site.email,
            telephone: site.phoneHref,
            sameAs: [site.instagram],
          },
        }}
      />
      <section className="page-hero">
        <div className="page-hero__media">
          <Image
            src="/images/fleet-lincoln-navigator.webp"
            alt="Black Lincoln Navigator ready for professional chauffeur service"
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
              <span>About</span>
            </div>
            <span className="eyebrow">The All Black standard</span>
            <h1 className="page-title">
              Professional in presence.
              <br />
              <em>Personal in service.</em>
            </h1>
            <p>
              We believe premium transportation should remove friction from the day — with a clear plan, attentive communication, and a private vehicle ready for its purpose.
            </p>
            <Link className="button button--gold" href="/book-now">
              Plan your journey <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="site-shell split-story">
          <div className="split-story__media" data-reveal>
            <Image
              src="/images/fleet-audi-a6.webp"
              alt="Black Audi A6 for executive transportation in San Francisco"
              loading="lazy"
              width={1264}
              height={848}
            />
            <div className="media-seal"><span>Every ride · Intentionally planned</span></div>
          </div>
          <div className="split-story__copy" data-reveal data-reveal-delay="1">
            <span className="section-kicker section-kicker--dark">Why we exist</span>
            <h2 className="section-title section-title--dark">
              To make every journey feel
              <br />
              <em>effortless.</em>
            </h2>
            <p>All Black Limo SF was built around a simple principle: exceptional transportation should feel seamless from the moment you book until the moment you arrive.</p>
            <p>Behind every journey is careful coordination — the right vehicle, a professional chauffeur, precise timing, real-time communication, and the flexibility to adapt when plans change.</p>
            <p>Whether it&apos;s an airport transfer, executive itinerary, private aviation movement, corporate event, or a day in Wine Country, our team manages the details so our clients can focus on what matters to them.</p>
            <p>Professional service. Discreet execution. Reliable transportation throughout San Francisco, the Bay Area, and Northern California.</p>
            <Link className="button button--dark" href="/services">
              Explore our services <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="site-shell">
          <div className="section__header" data-reveal>
            <div>
              <span className="section-kicker">What defines the experience</span>
              <h2 className="section-title">
                Quiet confidence,
                <br />
                <em>built on details.</em>
              </h2>
            </div>
            <span className="section__number">04</span>
          </div>
          <div className="services-showcase">
            {values.map(([icon, title, copy], index) => (
              <article
                key={title}
                className="service-tile"
                data-reveal
                data-reveal-delay={String(index)}
              >
                <div className="service-tile__top">
                  <span className="service-tile__icon">
                    <i className={`fa-solid ${icon}`} />
                  </span>
                  <span className="service-tile__index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div><h3>{title}</h3><p>{copy}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper-deep">
        <div className="site-shell location-band" data-reveal>
          <div className="location-band__image">
            <Image
              src="/images/fleet-mercedes-benz-s-class.webp"
              alt="Black Mercedes-Benz S-Class executive sedan"
              loading="lazy"
              width={1264}
              height={848}
            />
          </div>
          <div className="location-band__copy">
            <span className="section-kicker section-kicker--dark">Local perspective</span>
            <h2>One region.<br />Many rhythms.</h2>
            <p>Airport traffic, downtown appointments, Silicon Valley schedules, Marin gatherings, and Wine Country itineraries each create different demands. We shape the request around where the day is actually going.</p>
            <div className="area-cloud">
              <span>San Francisco</span>
              <span>Silicon Valley</span>
              <span>Marin</span>
              <span>East Bay</span>
              <span>Napa</span>
              <span>Sonoma</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
