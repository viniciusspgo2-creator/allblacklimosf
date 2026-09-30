import Link from "next/link";

export function ClosingCta() {
  return (
    <section className="closing-cta" aria-label="Booking call to action">
      <div className="closing-cta__glow" aria-hidden="true" />
      <div className="site-shell closing-cta__inner">
        <div>
          <span className="eyebrow">Your itinerary deserves precision</span>
          <h2>
            Move through the Bay Area
            <br />
            <em>on your terms.</em>
          </h2>
        </div>
        <div className="closing-cta__action">
          <p>
            Tell us where, when, and how many passengers. We&apos;ll help match the right service and vehicle.
          </p>
          <Link className="button button--gold" href="/book-now">
            Request your ride <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
