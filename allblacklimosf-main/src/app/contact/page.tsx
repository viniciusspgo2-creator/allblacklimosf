import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site-data";
import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact All Black Limo SF in San Francisco",
  description:
    "Contact All Black Limo SF for airport transfers, executive transportation, hourly chauffeur service, private itineraries, group travel, and events.",
  keywords: [
    "contact All Black Limo SF",
    "San Francisco chauffeur quote",
    "SFO airport transfer request",
    "Bay Area transportation contact",
  ],
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact All Black Limo SF",
          url: `${siteUrl}/contact`,
          mainEntity: {
            "@type": "Organization",
            name: site.name,
            telephone: site.phoneHref,
            email: site.email,
            contactPoint: [{
              "@type": "ContactPoint",
              telephone: site.phoneHref,
              contactType: "reservations",
              areaServed: "US",
              availableLanguage: ["English", "Spanish", "French", "German", "Portuguese"],
            }],
          },
        }}
      />
      <section className="page-hero contact-hero">
        <div className="page-hero__media">
          <Image
            src="/images/fleet-mercedes-benz-s-class.webp"
            alt="Mercedes-Benz S-Class ready for professional transportation"
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
              <span>Contact</span>
            </div>
            <span className="eyebrow">Direct assistance</span>
            <h1 className="page-title">
              Tell us where you need to be.
              <br />
              <em>We&apos;ll handle the rest.</em>
            </h1>
            <p>
              Whether you need an airport transfer, executive transportation, hourly chauffeur service, a private itinerary, or transportation for a group or event, our team is ready to coordinate every detail.
              <br /><br />
              Contact us directly or submit your request below. For immediate or last-minute transportation needs, please call or text our team.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="site-shell">
          <div className="contact-cards">
            <a className="contact-card" href={`tel:${site.phoneHref}`} data-reveal>
              <i className="fa-solid fa-phone" />
              <small>Call or text anytime</small>
              <span>{site.phoneDisplay}</span>
            </a>
            <a className="contact-card" href={`mailto:${site.email}`} data-reveal data-reveal-delay="1">
              <i className="fa-solid fa-envelope" />
              <small>Email</small>
              <span>{site.email}</span>
            </a>
            <div className="contact-card" data-reveal data-reveal-delay="2">
              <i className="fa-solid fa-location-dot" />
              <small>Service region</small>
              <span>San Francisco<br />& Bay Area</span>
            </div>
          </div>

          <div className="form-layout">
            <ContactForm />
            <aside className="booking-aside" data-reveal data-reveal-delay="1">
              <div className="booking-aside__image">
                <Image
                  src="/images/fleet-audi-a6.webp"
                  alt="Black Audi A6 for executive transportation"
                  loading="lazy"
                  width={1264}
                  height={848}
                />
              </div>
              <div className="booking-aside__content">
                <span className="section-kicker">Need a quote?</span>
                <h3>Send the full itinerary once.</h3>
                <p>The ride request form includes the date, locations, passenger count, luggage, service, and vehicle preference we need to understand the journey.</p>
                <Link className="button button--gold" href="/book-now">
                  Open ride request <i className="fa-solid fa-arrow-right" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
