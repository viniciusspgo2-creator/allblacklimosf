import Link from "next/link";
import Image from "next/image";
import { services, serviceAreas } from "@/lib/site-data";
import { JsonLd } from "@/components/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chauffeur Services in San Francisco & Bay Area",
  description:
    "Explore dedicated airport transfer, corporate, hourly chauffeur, point-to-point, roadshow, Wine Country, special occasion, and group transportation services.",
  keywords: [
    "San Francisco chauffeur services",
    "SFO transfer",
    "corporate transportation Bay Area",
    "Napa chauffeur",
    "group transportation San Francisco",
  ],
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const serviceList = Object.values(services);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "All Black Limo SF Services",
          itemListElement: serviceList.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.nav,
            url: `${siteUrl}/services/${s.slug}`,
          })),
        }}
      />
      <section className="page-hero">
        <div className="page-hero__media">
          <Image
            src="/images/fleet-cadillac-lyriq.webp"
            alt="Cadillac LYRIQ from the All Black Limo SF premium fleet"
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
              <span>Services</span>
            </div>
            <span className="eyebrow">Tailored ground transportation</span>
            <h1 className="page-title">
              One journey at a time.
              <br />
              <em>Precisely planned.</em>
            </h1>
            <p>Explore the service format that best matches your schedule, passengers, and purpose. Every option leads to a dedicated page with practical details.</p>
            <Link className="button button--gold" href="/book-now">
              Request a tailored quote <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <nav className="service-nav-strip" aria-label="Service pages">
        <div className="site-shell service-nav-strip__inner">
          {serviceList.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`}>{s.nav}</Link>
          ))}
        </div>
      </nav>

      <section className="section section--dark">
        <div className="site-shell">
          <div className="section__header" data-reveal>
            <div>
              <span className="section-kicker">Explore every service</span>
              <h2 className="section-title">
                Built for the way
                <br />
                <em>your day actually moves.</em>
              </h2>
              <p className="section-copy">Airport arrivals, executive calendars, celebrations, group movements, and flexible days each need a different transportation plan.</p>
            </div>
            <span className="section__number" aria-hidden="true">08</span>
          </div>

          <div className="services-showcase">
            {serviceList.map((s, i) => (
              <Link
                key={s.slug}
                className="service-tile service-tile--link"
                href={`/services/${s.slug}`}
                data-reveal
                data-reveal-delay={String((i % 4))}
                aria-label={`Open ${s.nav} service page`}
              >
                <div className="service-tile__top">
                  <span className="service-tile__icon"><i className={`fa-solid ${s.icon}`} /></span>
                  <span className="service-tile__index">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <h3>{s.nav}</h3>
                  <p>{s.short}</p>
                  <span className="text-link">Open service page <i className="fa-solid fa-arrow-right" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="site-shell">
          <div className="section__header" data-reveal>
            <div>
              <span className="section-kicker section-kicker--dark">Choosing the right format</span>
              <h2 className="section-title section-title--dark">
                A clearer request creates
                <br />
                <em>a smoother ride.</em>
              </h2>
            </div>
          </div>
          <div className="process-grid" style={{ borderColor: "var(--line-dark)", background: "var(--line-dark)" }}>
            <article className="process-card" style={{ background: "#f9f6ef", color: "var(--ink)" }} data-reveal>
              <span className="process-card__number">01</span>
              <h3>Direct transfer</h3>
              <p style={{ color: "var(--muted-dark)" }}>Choose point-to-point or airport transfer when pickup, destination, and timing are clearly defined.</p>
            </article>
            <article className="process-card" style={{ background: "#f9f6ef", color: "var(--ink)" }} data-reveal data-reveal-delay="1">
              <span className="process-card__number">02</span>
              <h3>Flexible itinerary</h3>
              <p style={{ color: "var(--muted-dark)" }}>Choose hourly chauffeur service for several stops, waiting time, or a schedule that may change.</p>
            </article>
            <article className="process-card" style={{ background: "#f9f6ef", color: "var(--ink)" }} data-reveal data-reveal-delay="2">
              <span className="process-card__number">03</span>
              <h3>Coordinated movement</h3>
              <p style={{ color: "var(--muted-dark)" }}>Choose event or group transportation when several passengers, vehicles, or time windows must work together.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--paper-deep">
        <div className="site-shell location-band" data-reveal>
          <div className="location-band__image">
            <Image
              src="/images/city-drive.webp"
              alt="Black luxury vehicle traveling through San Francisco"
              loading="lazy"
              width={1280}
              height={720}
            />
          </div>
          <div className="location-band__copy">
            <span className="section-kicker section-kicker--dark">Service area</span>
            <h2>San Francisco<br />and beyond.</h2>
            <p>Request service throughout the Bay Area, Silicon Valley, major regional airports, and Wine Country. Long-distance and custom itineraries are reviewed individually.</p>
            <div className="area-cloud" aria-label="Common service areas">
              {serviceAreas.map((a) => <span key={a}>{a}</span>)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
