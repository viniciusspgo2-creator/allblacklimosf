import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site-data";
import { ClosingCta } from "@/components/closing-cta";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <>
      <ClosingCta />
      <footer className="site-footer">
        <div className="site-shell">
          <div className="footer__grid">
            <div className="footer__brand">
              <Link
                className="footer__logo notranslate"
                href="/"
                aria-label="All Black Limo home"
                translate="no"
              >
                <Image
                  src="/images/all-black-limo-logo.png"
                  alt="All Black Limo"
                  width={674}
                  height={577}
                />
              </Link>
              <p>
                Private chauffeur and black car service for San Francisco,
                Silicon Valley, Wine Country, and the wider Bay Area.
              </p>
              <div className="footer__social" aria-label="Social media">
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="All Black Limo SF on Instagram"
                >
                  <i className="fa-brands fa-instagram" />
                </a>
              </div>
            </div>

            <div>
              <h3>Company</h3>
              <ul className="footer__links">
                <li><Link href="/about">About us</Link></li>
                <li><Link href="/fleet">Our fleet</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3>Popular services</h3>
              <ul className="footer__links">
                <li><Link href="/services/airport-transfers">Airport transfers</Link></li>
                <li><Link href="/services/corporate-transportation">Corporate travel</Link></li>
                <li><Link href="/services/hourly-chauffeur">Hourly chauffeur</Link></li>
                <li><Link href="/services/wine-country-tours">Napa &amp; Sonoma</Link></li>
                <li><Link href="/services/special-occasions">Special occasions</Link></li>
              </ul>
            </div>

            <div>
              <h3>Contact</h3>
              <ul className="footer__contact">
                <li>
                  <i className="fa-solid fa-phone" />
                  <a href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>
                </li>
                <li>
                  <i className="fa-solid fa-envelope" />
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
                <li>
                  <i className="fa-solid fa-location-dot" />
                  <span>{site.location}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer__bottom">
            <p>&copy; {year} All Black Limo SF. All rights reserved.</p>
            <div>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      <div className="mobile-action-bar" aria-label="Quick actions">
        <a href={`tel:${site.phoneHref}`}>
          <i className="fa-solid fa-phone" />
          <span>Call</span>
        </a>
        <Link className="mobile-action-bar__primary" href="/book-now">
          <i className="fa-solid fa-calendar-check" />
          <span>Request ride</span>
        </Link>
      </div>
    </>
  );
}
