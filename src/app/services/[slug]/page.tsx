import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { services, serviceList } from "@/lib/site-data";
import { JsonLd } from "@/components/json-ld";
import { FaqAccordion } from "@/components/faq-accordion";
import type { Metadata } from "next";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return serviceList.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = services[slug];
  if (!service) {
    return {
      title: "Service not found",
      robots: { index: false, follow: true },
    };
  }
  return {
    title: service.title,
    description: `${service.short} All Black Limo SF serves San Francisco and the wider Bay Area.`,
    keywords: [
      service.nav,
      "San Francisco chauffeur",
      "Bay Area black car service",
      "All Black Limo SF",
      "professional chauffeur transportation",
    ],
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: service.title,
      description: service.short,
      images: [{ url: service.image, width: 1536, height: 960, alt: service.title }],
      type: "article",
    },
  };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = services[slug];
  if (!service) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              name: service.title,
              serviceType: service.nav,
              provider: { "@id": `${siteUrl}/#business` },
              areaServed: ["San Francisco", "San Francisco Bay Area", "Northern California"],
              description: service.short,
              url: `${siteUrl}/services/${service.slug}`,
              image: `${siteUrl}${service.image}`,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
                { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
                { "@type": "ListItem", position: 3, name: service.nav, item: `${siteUrl}/services/${service.slug}` },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: service.faq.map(([q, a]) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: a },
              })),
            },
          ],
        }}
      />
      <section className="page-hero">
        <div className="page-hero__media">
          <Image
            src={service.image}
            alt={service.title}
            width={1536}
            height={960}
            priority
          />
        </div>
        <div className="site-shell page-hero__inner">
          <div className="page-hero__copy" data-reveal>
            <div className="breadcrumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/services">Services</Link>
              <span>/</span>
              <span>{service.nav}</span>
            </div>
            <span className="eyebrow">{service.eyebrow}</span>
            <h1 className="page-title">{service.title}</h1>
            <p>{service.intro}</p>
            <Link
              className="button button--gold"
              href={`/book-now?service=${encodeURIComponent(service.nav)}`}
            >
              Request this service <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <nav className="service-nav-strip" aria-label="Service pages">
        <div className="site-shell service-nav-strip__inner">
          {serviceList.map((item) => (
            <Link
              key={item.slug}
              className={item.slug === service.slug ? "is-current" : ""}
              href={`/services/${item.slug}`}
            >
              {item.nav}
            </Link>
          ))}
        </div>
      </nav>

      <section className="section section--light">
        <div className="site-shell service-overview">
          <div data-reveal>
            <span className="section-kicker section-kicker--dark">Service guide</span>
            <h2 className="section-title section-title--dark service-overview__title">
              {service.detailTitle}
            </h2>
            <div className="best-for" aria-label="Best suited for">
              {service.bestFor.map((u) => <span key={u}>{u}</span>)}
            </div>
          </div>
          <div className="service-overview__body" data-reveal data-reveal-delay="1">
            {service.detailCopy.map((p, i) => <p key={i}>{p}</p>)}
            <div className="highlight-grid">
              {service.highlights.map((h) => (
                <div key={h} className="highlight-card">
                  <i className="fa-solid fa-check" />
                  <strong>{h}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="site-shell">
          <div className="section__header" data-reveal>
            <div>
              <span className="section-kicker">How it works</span>
              <h2 className="section-title">
                A simple request.
                <br />
                <em>A considered plan.</em>
              </h2>
            </div>
            <span className="section__number" aria-hidden="true">03</span>
          </div>
          <div className="process-grid">
            {service.process.map(([stepTitle, stepCopy], index) => (
              <article
                key={stepTitle}
                className="process-card"
                data-reveal
                data-reveal-delay={String(index)}
              >
                <span className="process-card__number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{stepTitle}</h3>
                <p>{stepCopy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="site-shell faq-layout">
          <div className="faq-intro" data-reveal>
            <span className="section-kicker section-kicker--dark">Service questions</span>
            <h2 className="section-title section-title--dark">
              Know what to
              <br />
              <em>expect.</em>
            </h2>
            <p className="section-copy section-copy--dark">
              For a detail not covered here, contact us directly and include your travel date and party size.
            </p>
          </div>
          <FaqAccordion items={service.faq} />
        </div>
      </section>
    </>
  );
}
