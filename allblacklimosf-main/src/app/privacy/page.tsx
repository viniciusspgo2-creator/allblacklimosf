import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy information for visitors and customers who contact All Black Limo SF through this website.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="page-hero page-hero--compact">
      <div className="page-hero__media">
        <Image src="/images/hero-poster.webp" alt="" width={1280} height={720} priority />
      </div>
      <div className="site-shell page-hero__inner">
        <div className="page-hero__copy" data-reveal>
          <div className="breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Privacy</span>
          </div>
          <span className="eyebrow">Website information</span>
          <h1 className="page-title">Privacy<br /><em>Policy.</em></h1>
          <p>Last updated August 28, 2026.</p>
        </div>
      </div>

      <section className="section section--light">
        <article className="site-shell legal-content">
          <p>This policy explains how All Black Limo SF handles information submitted through this website. It applies to website inquiries and ride requests and may be updated as the website or service process changes.</p>

          <h2>Information you provide</h2>
          <p>When you request a ride or send a message, you may provide your name, email address, telephone number, passenger and luggage counts, pickup and destination information, travel date and time, flight details, vehicle preference, and itinerary notes.</p>

          <h2>How information is used</h2>
          <p>We use submitted information to respond to inquiries, assess vehicle and service availability, prepare quotes, coordinate requested transportation, maintain business records, prevent misuse of website forms, and meet applicable legal or operational requirements.</p>

          <h2>Sharing and service providers</h2>
          <p>Information may be shared with people or service providers involved in responding to or fulfilling an authorized transportation request. We do not ask you to submit payment card information through the public website forms.</p>

          <h2>Website data</h2>
          <p>The website does not intentionally place advertising or behavioral tracking cookies. If you choose a language other than English, that preference is stored locally in your browser so the website can keep the selected language. The web host may also process standard technical logs such as IP address, browser type, requested page, and time of access for security and operation.</p>

          <h2>Retention and security</h2>
          <p>Information is retained only as reasonably needed for communication, service coordination, business records, dispute resolution, security, or legal obligations. No internet transmission or storage method can be guaranteed completely secure.</p>

          <h2>Your choices</h2>
          <p>You may ask about the personal information associated with your inquiry or request a correction or deletion where applicable, subject to legitimate business and legal retention needs.</p>

          <h2>Contact</h2>
          <p>For privacy questions, email <a href={`mailto:${site.email}`}>{site.email}</a> or call <a href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>.</p>
        </article>
      </section>
    </section>
  );
}
