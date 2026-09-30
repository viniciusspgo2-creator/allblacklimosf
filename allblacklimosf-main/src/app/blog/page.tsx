import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/blog";
import { JsonLd } from "@/components/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chauffeur & Bay Area Travel Blog | All Black Limo SF",
  description:
    "Guides on SFO airport transfers, executive transportation, Napa & Sonoma wine country trips, weddings, events, and choosing the right chauffeur service in San Francisco.",
  keywords: [
    "San Francisco chauffeur blog",
    "SFO airport transfer guide",
    "Napa wine tour chauffeur",
    "Bay Area black car service",
    "executive transportation",
  ],
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "All Black Limo SF Blog",
          url: `${siteUrl}/blog`,
          publisher: { "@id": `${siteUrl}/#business` },
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.excerpt,
            image: `${siteUrl}${p.coverImage}`,
            url: `${siteUrl}/blog/${p.slug}`,
            datePublished: p.publishedAt || p.createdAt,
            dateModified: p.createdAt,
            author: { "@type": "Organization", name: p.author },
            publisher: { "@id": `${siteUrl}/#business` },
            mainEntityOfPage: `${siteUrl}/blog/${p.slug}`,
          })),
        }}
      />
      <section className="page-hero">
        <div className="page-hero__media">
          <Image
            src="/images/fleet-cadillac-escalade-esv.webp"
            alt="Premium chauffeur fleet from All Black Limo SF"
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
              <span>Blog</span>
            </div>
            <span className="eyebrow">Chauffeur guides &amp; Bay Area travel</span>
            <h1 className="page-title">
              Read before
              <br />
              <em>you reserve.</em>
            </h1>
            <p>
              Practical guides on SFO airport transfers, corporate transportation, Napa &amp; Sonoma wine country, weddings, events, and how to choose the right chauffeur service in San Francisco.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="site-shell">
          <div className="section__header" data-reveal>
            <div>
              <span className="section-kicker">Latest articles</span>
              <h2 className="section-title">
                Insights for
                <br />
                <em>premium travel.</em>
              </h2>
            </div>
          </div>
          {posts.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No articles published yet. Please check back soon.</p>
          ) : (
            <div className="blog-grid">
              {posts.map((post, i) => (
                <article
                  key={post.slug}
                  className="blog-card"
                  data-reveal
                  data-reveal-delay={String(i % 4)}
                >
                  <Link href={`/blog/${post.slug}`} className="blog-card__image">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={800}
                      height={450}
                      loading={i < 3 ? "eager" : "lazy"}
                    />
                  </Link>
                  <div className="blog-card__body">
                    <span className="blog-card__category">{post.category}</span>
                    <h3 className="blog-card__title">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                    <div className="blog-card__meta">
                      <i className="fa-solid fa-clock" />
                      <span>{post.readMinutes} min read</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.author}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
