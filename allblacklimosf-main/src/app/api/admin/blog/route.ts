import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { cleanLine, cleanText } from "@/lib/form-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, status: "db_unavailable" }, { status: 503 });
  }
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ ok: false, status: "unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const includeUnpublished = searchParams.get("all") === "1";

  try {
    const items = await db.blogPost.findMany({
      where: includeUnpublished ? undefined : { published: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json({ ok: true, items });
  } catch (e) {
    console.error("[admin/blog] list error", e);
    return NextResponse.json({ ok: false, items: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, status: "db_unavailable" }, { status: 503 });
  }
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ ok: false, status: "unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const slug = cleanLine(body.slug, 160).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const title = cleanLine(body.title, 200);
    const excerpt = cleanLine(body.excerpt, 320);
    const content = cleanText(body.content, 200000);
    const coverImage = cleanLine(body.coverImage, 500);
    const category = cleanLine(body.category, 80) || "Guides";
    const tags = cleanLine(body.tags, 200);
    const author = cleanLine(body.author, 120) || "All Black Limo SF";
    const readMinutes = Math.max(1, Math.min(60, Number(body.readMinutes) || 6));
    const published = !!body.published;
    const featured = !!body.featured;
    const seoTitle = body.seoTitle ? cleanLine(body.seoTitle, 200) : null;
    const seoDescription = body.seoDescription ? cleanLine(body.seoDescription, 320) : null;
    const seoKeywords = body.seoKeywords ? cleanLine(body.seoKeywords, 200) : null;

    if (!slug || !title || !excerpt || !content) {
      return NextResponse.json({ ok: false, status: "invalid" }, { status: 400 });
    }

    const created = await db.blogPost.create({
      data: {
        slug, title, excerpt, content, coverImage, category, tags, author,
        readMinutes, published, featured,
        seoTitle, seoDescription, seoKeywords,
        publishedAt: published ? new Date() : null,
      },
    });
    return NextResponse.json({ ok: true, item: created });
  } catch (e) {
    console.error("[admin/blog] create error", e);
    return NextResponse.json({ ok: false, status: "error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, status: "db_unavailable" }, { status: 503 });
  }
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ ok: false, status: "unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const id = String(body.id || "");
    if (!id) return NextResponse.json({ ok: false, status: "invalid" }, { status: 400 });

    const data: Record<string, unknown> = {};
    if (typeof body.title === "string") data.title = cleanLine(body.title, 200);
    if (typeof body.excerpt === "string") data.excerpt = cleanLine(body.excerpt, 320);
    if (typeof body.content === "string") data.content = cleanText(body.content, 200000);
    if (typeof body.coverImage === "string") data.coverImage = cleanLine(body.coverImage, 500);
    if (typeof body.category === "string") data.category = cleanLine(body.category, 80);
    if (typeof body.tags === "string") data.tags = cleanLine(body.tags, 200);
    if (typeof body.author === "string") data.author = cleanLine(body.author, 120);
    if (body.readMinutes !== undefined) data.readMinutes = Math.max(1, Math.min(60, Number(body.readMinutes) || 6));
    if (typeof body.slug === "string") {
      data.slug = cleanLine(body.slug, 160).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    }
    if (typeof body.published === "boolean") {
      data.published = body.published;
      if (body.published) data.publishedAt = new Date();
    }
    if (typeof body.featured === "boolean") data.featured = body.featured;
    if (body.seoTitle !== undefined) data.seoTitle = body.seoTitle ? cleanLine(body.seoTitle, 200) : null;
    if (body.seoDescription !== undefined) data.seoDescription = body.seoDescription ? cleanLine(body.seoDescription, 320) : null;
    if (body.seoKeywords !== undefined) data.seoKeywords = body.seoKeywords ? cleanLine(body.seoKeywords, 200) : null;

    const updated = await db.blogPost.update({ where: { id }, data });
    return NextResponse.json({ ok: true, item: updated });
  } catch (e) {
    console.error("[admin/blog] update error", e);
    return NextResponse.json({ ok: false, status: "error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, status: "db_unavailable" }, { status: 503 });
  }
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ ok: false, status: "unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, status: "invalid" }, { status: 400 });
    await db.blogPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/blog] delete error", e);
    return NextResponse.json({ ok: false, status: "error" }, { status: 500 });
  }
}
