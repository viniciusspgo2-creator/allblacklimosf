import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { JsonLd } from "@/components/json-ld";
import type { Metadata } from "next";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    if (!post) {
      return { title: "Article not found", robots: { index: false, follow: true } };
    }
    return {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      keywords: post.seoKeywords ? post.seoKeywords.split(",").map((s) => s.trim()) : [],
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        type: "article",
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        url: `/blog/${slug}`,
        images: [{ url: post.coverImage, width: 800, height: 450, alt: post.title }],
        publishedTime: post.publishedAt || post.createdAt,
        authors: [post.author],
      },
      twitter: {
        card: "summary_large_image",
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        images: [post.coverImage],
      },
    };
  } catch {
    return { title: "Article", robots: { index: false, follow: true } };
  }
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "";

  const related = (await getPublishedPosts())
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: `${siteUrl}${post.coverImage}`,
          url: `${siteUrl}/blog/${post.slug}`,
          datePublished: post.publishedAt || post.createdAt,
          dateModified: post.createdAt,
          author: { "@type": "Organization", name: post.author },
          publisher: { "@id": `${siteUrl}/#business` },
          mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${post.slug}` },
          keywords: post.tags,
          articleSection: post.category,
          wordCount: post.content.split(/\s+/).length,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
            { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}/blog/${post.slug}` },
          ],
        }}
      />

      <section className="page-hero page-hero--compact">
        <div className="page-hero__media">
          <Image src={post.coverImage} alt={post.title} width={1264} height={848} priority />
        </div>
        <div className="site-shell page-hero__inner">
          <div className="page-hero__copy" data-reveal>
            <div className="breadcrumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/blog">Blog</Link>
              <span>/</span>
              <span>{post.category}</span>
            </div>
            <span className="eyebrow">{post.category}</span>
            <h1 className="page-title">{post.title}</h1>
            <p>
              {dateStr && <>{dateStr} · </>}
              {post.readMinutes} min read · By {post.author}
            </p>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="site-shell">
          <MarkdownRenderer content={post.content} />

          <div style={{ marginTop: "60px", padding: "28px", border: "1px solid var(--line-dark)", borderRadius: "20px", background: "#0c0c0a", textAlign: "center", maxWidth: 760, marginInline: "auto" }}>
            <span className="eyebrow" style={{ color: "var(--gold-on-light)", justifyContent: "center" }}>Ready to reserve?</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 600, color: "var(--white)", marginTop: 8 }}>
              Let&apos;s plan your journey.
            </h2>
            <p style={{ color: "var(--muted)", marginTop: 10 }}>
              Tell us where, when, and how many passengers — we&apos;ll match the right service and vehicle.
            </p>
            <Link className="button button--gold" href="/book-now" style={{ marginTop: 18 }}>
              Request your ride <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>

          {related.length > 0 && (
            <div style={{ marginTop: 80 }}>
              <div className="section__header" data-reveal>
                <div>
                  <span className="section-kicker section-kicker--dark">Keep reading</span>
                  <h2 className="section-title section-title--dark">Related articles</h2>
                </div>
              </div>
              <div className="blog-grid">
                {related.map((p, i) => (
                  <article key={p.slug} className="blog-card" data-reveal data-reveal-delay={String(i)}>
                    <Link href={`/blog/${p.slug}`} className="blog-card__image">
                      <Image src={p.coverImage} alt={p.title} width={800} height={450} loading="lazy" />
                    </Link>
                    <div className="blog-card__body">
                      <span className="blog-card__category">{p.category}</span>
                      <h3 className="blog-card__title">
                        <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                      </h3>
                      <p className="blog-card__excerpt">{p.excerpt}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
