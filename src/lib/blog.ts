import { db, isDbConfigured } from "@/lib/db";
import { blogSeed } from "@/lib/blog-seed";

export type BlogPostPublic = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string;
  author: string;
  readMinutes: number;
  publishedAt: string | null;
  createdAt: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
};

/** Returns published blog posts. Uses DB if available, else seed data. */
export async function getPublishedPosts(): Promise<BlogPostPublic[]> {
  if (!isDbConfigured()) {
    return blogSeed.map((p) => ({
      id: `seed-${p.slug}`,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage,
      category: p.category,
      tags: p.tags,
      author: p.author,
      readMinutes: p.readMinutes,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      seoKeywords: p.seoKeywords,
    }));
  }
  try {
    const posts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });
    if (posts.length === 0) {
      return blogSeed.map((p) => ({
        id: `seed-${p.slug}`,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        coverImage: p.coverImage,
        category: p.category,
        tags: p.tags,
        author: p.author,
        readMinutes: p.readMinutes,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        seoKeywords: p.seoKeywords,
      }));
    }
    return posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage,
      category: p.category,
      tags: p.tags,
      author: p.author,
      readMinutes: p.readMinutes,
      publishedAt: p.publishedAt ? p.publishedAt.toISOString() : p.createdAt.toISOString(),
      createdAt: p.createdAt.toISOString(),
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      seoKeywords: p.seoKeywords,
    }));
  } catch (e) {
    console.error("[blog] getPublishedPosts error", e);
    return blogSeed.map((p) => ({
      id: `seed-${p.slug}`,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage,
      category: p.category,
      tags: p.tags,
      author: p.author,
      readMinutes: p.readMinutes,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      seoKeywords: p.seoKeywords,
    }));
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPostPublic | null> {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.slug === slug) || null;
}
