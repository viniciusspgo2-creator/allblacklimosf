import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Terms",
  description: "Website and ride-request terms for All Black Limo SF.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="page-hero__media">
          <Image src="/images/hero-poster.webp" alt="" width={1280} height={720} priority />
        </div>
        <div className="site-shell page-hero__inner">
          <div className="page-hero__copy" data-reveal>
            <div className="breadcrumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Terms</span>
            </div>
            <span className="eyebrow">Website information</span>
            <h1 className="page-title">Website<br /><em>Terms.</em></h1>
            <p>Last updated August 28, 2026.</p>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <article className="site-shell legal-content">
          <p>These terms govern use of this website and the submission of transportation inquiries. Final transportation services may be subject to additional quote, reservation, payment, cancellation, passenger, and vehicle terms communicated during confirmation.</p>

          <h2>Ride requests are not instant confirmations</h2>
          <p>Submitting a website form does not create a confirmed reservation. A ride is confirmed only after availability, itinerary, vehicle category, pricing, and any applicable terms are reviewed and expressly accepted through the reservation process.</p>

          <h2>Accurate information</h2>
          <p>You agree to provide accurate passenger, luggage, contact, location, flight, timing, and itinerary information. Material changes may affect availability, vehicle suitability, timing, and pricing.</p>

          <h2>Vehicles and capacity</h2>
          <p>Website images and model names may represent a category rather than a guaranteed specific vehicle. Actual capacity depends on the vehicle configuration, passenger needs, and luggage. Confirmed vehicle details govern the reservation.</p>

          <h2>Pricing, payment, and cancellation</h2>
          <p>Pricing is provided during the quote or reservation process. Any payment schedule, deposit, waiting-time, overtime, change, no-show, or cancellation terms should be reviewed before accepting the reservation. Do not submit card information through the public contact or ride-request forms.</p>

          <h2>Website content</h2>
          <p>We aim to keep the website accurate and useful, but service descriptions, fleet availability, operating areas, and content may change. Vehicle availability, model year, configuration, passenger capacity, and luggage capacity are confirmed through the reservation process.</p>

          <h2>Acceptable use</h2>
          <p>You may not misuse the website, attempt unauthorized access, interfere with its operation, submit malicious content, impersonate another person, or use the forms for spam or unlawful activity.</p>

          <h2>Contact</h2>
          <p>Questions about these terms can be sent to <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
        </article>
      </section>
    </>
  );
}
