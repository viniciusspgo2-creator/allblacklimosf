import Link from "next/link";
import Image from "next/image";
import { services, fleet, homeFaq, serviceAreas } from "@/lib/site-data";
import { site } from "@/lib/site-data";
import { JsonLd } from "@/components/json-ld";
import { FaqAccordion } from "@/components/faq-accordion";
import { LazyVideo } from "@/components/lazy-video";

export default function HomePage() {
  const serviceIndex = (slug: string) =>
    Object.keys(services).indexOf(slug) + 1;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: homeFaq.map(([q, a]) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }}
      />

      <section className="hero" aria-label="All Black Limo SF luxury transportation">
        <div className="hero__media" aria-hidden="true">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/hero-poster.webp"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__grain" aria-hidden="true" />

        <div className="site-shell hero__content">
          <div className="hero__copy">
            <span className="eyebrow">Private chauffeur service · San Francisco</span>
            <h1 className="display-title">
              More than a ride.
              <br />
              <em>A composed arrival.</em>
            </h1>
            <p className="hero__lead">
              Private chauffeur service tailored around your itinerary, with professional chauffeurs, attentive coordination, and a premium fleet for every occasion.
            </p>
            <div className="hero__actions">
              <Link className="button button--gold" href="/book-now">
                Request your ride <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
              <Link className="button button--outline" href="/fleet">
                Explore the fleet <i className="fa-solid fa-car-side" aria-hidden="true" />
              </Link>
            </div>
            <ul className="hero__assurance" aria-label="Service highlights">
              <li><i className="fa-solid fa-clock" /> 24/7 reservation assistance</li>
              <li><i className="fa-solid fa-location-dot" /> San Francisco Bay Area</li>
              <li><i className="fa-solid fa-user-tie" /> Professional chauffeurs</li>
            </ul>
          </div>
        </div>

        <Link className="hero__booking-card" href="/services/airport-transfers">
          <span>
            <small>Landing in the Bay Area?</small>
            <strong>Your chauffeur is ready when you land.</strong>
          </span>
          <i className="fa-solid fa-plane-arrival" aria-hidden="true" />
        </Link>
      </section>

      <section className="trust-strip" aria-label="Why choose All Black Limo SF">
        <div className="site-shell trust-strip__inner">
          <div className="trust-item">
            <span className="trust-item__icon"><i className="fa-solid fa-calendar-check" /></span>
            <span>
              <strong>24/7 reservation support</strong>
              <span>Direct assistance whenever you need us.</span>
            </span>
          </div>
          <div className="trust-item">
            <span className="trust-item__icon"><i className="fa-solid fa-user-shield" /></span>
            <span>
              <strong>Professional chauffeurs</strong>
              <span>Experienced, discreet, and service-focused.</span>
            </span>
          </div>
          <div className="trust-item">
            <span className="trust-item__icon"><i className="fa-solid fa-route" /></span>
            <span>
              <strong>Flight monitoring</strong>
              <span>Real-time tracking for airport pickups.</span>
            </span>
          </div>
          <div className="trust-item">
            <span className="trust-item__icon"><i className="fa-solid fa-car-rear" /></span>
            <span>
              <strong>Premium fleet</strong>
              <span>Executive sedans, SUVs, Escalades &amp; Sprinters.</span>
            </span>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="site-shell split-story">
          <div className="split-story__media" data-reveal>
            <Image
              src="/images/fleet-cadillac-escalade-esv.webp"
              alt="Black Cadillac Escalade ESV from the All Black Limo SF premium fleet"
              loading="lazy"
              width={1264}
              height={848}
            />
            <div className="media-seal" aria-hidden="true">
              <span>San Francisco · Bay Area</span>
            </div>
          </div>
          <div className="split-story__copy" data-reveal data-reveal-delay="1">
            <span className="section-kicker section-kicker--dark">The All Black standard</span>
            <h2 className="section-title section-title--dark">
              Luxury transportation,
              <br />
              <em>executed with precision.</em>
            </h2>
            <p>
              At All Black Limo SF, every journey is planned around your schedule, privacy, and expectations. From the moment your reservation is confirmed, our team coordinates every detail to deliver a seamless and dependable experience.
            </p>
            <p>
              From SFO airport transfers and private aviation to corporate roadshows, executive transportation, special events, and private journeys through Napa and Sonoma, our chauffeurs provide the professionalism and discretion our clients expect.
            </p>
            <ul className="feature-lines">
              <li><i className="fa-solid fa-check" /> Professional Chauffeurs</li>
              <li><i className="fa-solid fa-check" /> 24/7 Reservation Support</li>
              <li><i className="fa-solid fa-check" /> Premium Executive Fleet</li>
              <li><i className="fa-solid fa-check" /> Real-Time Flight Monitoring</li>
            </ul>
            <Link className="button button--dark" href="/about">
              Discover our approach <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="site-shell">
          <div className="section__header" data-reveal>
            <div>
              <span className="section-kicker">Services for every itinerary</span>
              <h2 className="section-title">
                One standard of service.
                <br />
                <em>Many reasons to travel.</em>
              </h2>
              <p className="section-copy">
                Choose a focused service page to see how we plan each type of journey, what information we need, and which format may fit best.
              </p>
            </div>
            <span className="section__number" aria-hidden="true">01</span>
          </div>

          <div className="services-showcase">
            {Object.values(services).map((s, i) => (
              <Link
                key={s.slug}
                className="service-tile service-tile--link"
                href={`/services/${s.slug}`}
                data-reveal
                data-reveal-delay={(i % 4).toString()}
                aria-label={`View ${s.nav} service`}
              >
                <div className="service-tile__top">
                  <span className="service-tile__icon">
                    <i className={`fa-solid ${s.icon}`} />
                  </span>
                  <span className="service-tile__index">
                    {String(serviceIndex(s.slug)).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3>{s.nav}</h3>
                  <p>{s.short}</p>
                  <span className="text-link">
                    View service <i className="fa-solid fa-arrow-right" />
                  </span>
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
              <span className="section-kicker section-kicker--dark">A vehicle for the moment</span>
              <h2 className="section-title section-title--dark">
                Presence on the outside.
                <br />
                <em>Quiet comfort within.</em>
              </h2>
              <p className="section-copy section-copy--dark">
                Explore representative premium categories for individual, family, executive, and group transportation.
              </p>
            </div>
            <Link className="button button--dark" href="/fleet">
              View full fleet <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>

          <div className="fleet-scroll">
            {fleet.slice(0, 4).map((v, i) => (
              <article
                key={v.name}
                className="fleet-card"
                data-reveal
                data-reveal-delay={String(i)}
              >
                <div className="fleet-card__image">
                  <Image
                    src={v.image}
                    alt={v.name}
                    loading="lazy"
                    width={1200}
                    height={750}
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
            Fleet availability and passenger or luggage capacity can vary by vehicle configuration. The exact vehicle category is confirmed with each reservation.
          </p>
        </div>
      </section>

      <section className="video-story">
        <LazyVideo
          src="/closing-video.mp4"
          poster="/images/fleet-cadillac-escalade-esv.webp"
          className=""
        />
        <div className="site-shell video-story__inner">
          <div className="video-story__copy" data-reveal>
            <span className="section-kicker">Precision in motion</span>
            <h2 className="section-title">
              Premium transportation
              <br />
              that moves <em>with your schedule.</em>
            </h2>
            <p>
              From airport arrivals and executive meetings to private events and nights in the city, every movement is coordinated around your timing, comfort, and expectations.
            </p>
            <Link className="button button--gold" href="/services">
              Find your service <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="site-shell signature-grid">
          <div data-reveal>
            <span className="section-kicker">Designed around you</span>
            <h2 className="section-title">
              A refined experience
              <br />
              from request to <em>arrival.</em>
            </h2>
            <div className="signature-list">
              <article className="signature-item">
                <span className="signature-item__number">01</span>
                <div>
                  <h3>Clear coordination</h3>
                  <p>We ask for the details that influence timing, pickup, vehicle category, and passenger comfort.</p>
                </div>
              </article>
              <article className="signature-item">
                <span className="signature-item__number">02</span>
                <div>
                  <h3>Purposeful vehicle matching</h3>
                  <p>The right category depends on the occasion, passenger count, luggage, and the shape of the itinerary.</p>
                </div>
              </article>
              <article className="signature-item">
                <span className="signature-item__number">03</span>
                <div>
                  <h3>Professional presence</h3>
                  <p>Private chauffeured transportation should feel attentive without feeling intrusive.</p>
                </div>
              </article>
            </div>
          </div>
          <aside className="quote-panel" data-reveal data-reveal-delay="1">
            <i className="fa-solid fa-quote-left" aria-hidden="true" />
            <blockquote>
              &ldquo;The difference is not only where the car takes you. It is how composed the entire journey feels.&rdquo;
            </blockquote>
            <p>ALL BLACK LIMO SF · SERVICE PHILOSOPHY</p>
          </aside>
        </div>
      </section>

      <section className="section section--light">
        <div className="site-shell faq-layout">
          <div className="faq-intro" data-reveal>
            <span className="section-kicker section-kicker--dark">Before you reserve</span>
            <h2 className="section-title section-title--dark">
              Questions,
              <br />
              <em>answered clearly.</em>
            </h2>
            <p className="section-copy section-copy--dark">
              Need help choosing between point-to-point and hourly service? Call us and we&apos;ll help shape the request.
            </p>
          </div>
          <FaqAccordion items={homeFaq} />
        </div>
      </section>

      {/* Hidden structured areas for SEO without altering the visual */}
      <section className="sr-only" aria-hidden="true">
        <h2>Service areas we cover</h2>
        <ul>
          {serviceAreas.map((a) => <li key={a}>{a}</li>)}
        </ul>
        <p>Reservation assistance: {site.phoneDisplay}. Email: {site.email}.</p>
      </section>
    </>
  );
}
