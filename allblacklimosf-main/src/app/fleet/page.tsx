import Link from "next/link";
import Image from "next/image";
import { fleet } from "@/lib/site-data";
import { JsonLd } from "@/components/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luxury Fleet for San Francisco Transportation",
  description:
    "Explore the All Black Limo SF fleet: Cadillac Escalade ESV, Audi A6, Cadillac LYRIQ, premium SUVs, Mercedes-Benz S-Class, Sprinters, minibuses, and buses.",
  keywords: [
    "San Francisco limo fleet",
    "Cadillac Escalade ESV chauffeur",
    "Mercedes-Benz S-Class chauffeur",
    "executive Sprinter",
    "Bay Area group transportation",
  ],
  alternates: { canonical: "/fleet" },
};

export default function FleetPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "All Black Limo SF Premium Fleet",
          itemListElement: fleet.map((v, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: v.name,
            description: v.feature,
            image: `${siteUrl}${v.image}`,
          })),
        }}
      />
      <section className="page-hero">
        <div className="page-hero__media">
          <Image
            src="/images/fleet-cadillac-escalade-esv.webp"
            alt="Cadillac Escalade ESV from the All Black Limo SF fleet"
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
              <span>Fleet</span>
            </div>
            <span className="eyebrow">Premium vehicle categories</span>
            <h1 className="page-title">
              A fleet selected for
              <br />
              <em>every journey.</em>
            </h1>
            <p>From executive sedans and premium SUVs to Cadillac Escalades, Sprinters, and group transportation, our fleet is selected around your passengers, luggage, itinerary, and level of service.</p>
            <Link className="button button--gold" href="/book-now">
              Request a vehicle <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Fleet qualities">
        <div className="site-shell trust-strip__inner">
          <div className="trust-item">
            <span className="trust-item__icon"><i className="fa-solid fa-couch" /></span>
            <span><strong>Executive comfort</strong><span>Premium vehicles for business and private travel.</span></span>
          </div>
          <div className="trust-item">
            <span className="trust-item__icon"><i className="fa-solid fa-suitcase-rolling" /></span>
            <span><strong>Luggage ready</strong><span>The right capacity for passengers and luggage.</span></span>
          </div>
          <div className="trust-item">
            <span className="trust-item__icon"><i className="fa-solid fa-people-group" /></span>
            <span><strong>Group transportation</strong><span>Sprinters and larger vehicles for groups and events.</span></span>
          </div>
          <div className="trust-item">
            <span className="trust-item__icon"><i className="fa-solid fa-shield-halved" /></span>
            <span><strong>Professionally presented</strong><span>Clean, maintained, and prepared for every journey.</span></span>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="site-shell">
          <div className="section__header" data-reveal>
            <div>
              <span className="section-kicker section-kicker--dark">The All Black fleet</span>
              <h2 className="section-title section-title--dark">
                Choose by experience,
                <br />
                <em>capacity, and purpose.</em>
              </h2>
              <p className="section-copy section-copy--dark">
                Tell us your passenger count, luggage, itinerary, and service expectations. Our team will help match the right vehicle to the journey.
              </p>
            </div>
          </div>

          <div className="fleet-grid">
            {fleet.map((v, index) => (
              <article key={v.name} className="fleet-card" data-reveal data-reveal-delay={String(index % 4)}>
                <div className="fleet-card__image">
                  <Image
                    src={v.image}
                    alt={v.name}
                    loading={index < 3 ? "eager" : "lazy"}
                    width={1536}
                    height={960}
                  />
                  <span className="fleet-card__badge">{v.class}</span>
                </div>
                <div className="fleet-card__body">
                  <h3>{v.name}</h3>
                  <span className="fleet-card__class">{v.class}</span>
                  <div className="fleet-card__meta">
                    <span><i className="fa-solid fa-user-group" />{v.passengers}</span>
                    <span><i className="fa-solid fa-suitcase-rolling" />{v.luggage}</span>
                  </div>
                  <p>{v.feature}</p>
                  <Link
                    className="text-link"
                    href={`/book-now?vehicle=${encodeURIComponent(v.name)}`}
                  >
                    Request this vehicle <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="fleet-note">
            Vehicle availability and passenger or luggage capacity may vary by configuration. The exact vehicle and operating capacity are confirmed with your reservation.
          </p>
        </div>
      </section>

      <section className="section section--dark">
        <div className="site-shell service-overview">
          <div data-reveal>
            <span className="section-kicker">How we match a vehicle</span>
            <h2 className="section-title">
              Space is only
              <br />
              <em>part of the decision.</em>
            </h2>
          </div>
          <div className="service-overview__body" data-reveal data-reveal-delay="1">
            <p style={{ color: "var(--muted)" }}>
              Passenger count, checked luggage, carry-ons, child seating requests, accessibility considerations, desired cabin style, and total travel time all influence the recommendation.
            </p>
            <p style={{ color: "var(--muted)" }}>
              For airport and group requests, exact numbers are especially important. Selecting a vehicle only by advertised seat count can leave insufficient luggage space.
            </p>
            <Link className="button button--gold" href="/book-now">
              Tell us what you need <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
