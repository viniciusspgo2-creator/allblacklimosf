import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Returns dashboard summary stats: bookings, messages, blog posts, visits. */
export async function GET(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({
      ok: true,
      db: false,
      stats: {
        bookingsNew: 0,
        bookingsTotal: 0,
        messagesNew: 0,
        messagesTotal: 0,
        blogPublished: 0,
        blogTotal: 0,
        visitsTotal: 0,
        visitsToday: 0,
        visitsWeek: 0,
        visitsMonth: 0,
      },
    });
  }
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ ok: false, status: "unauthorized" }, { status: 401 });
  }
  try {
    const [
      bookingsNew, bookingsTotal,
      messagesNew, messagesTotal,
      blogPublished, blogTotal,
      counter, visitTotal,
    ] = await Promise.all([
      db.booking.count({ where: { status: "new" } }),
      db.booking.count(),
      db.contactMessage.count({ where: { status: "new" } }),
      db.contactMessage.count(),
      db.blogPost.count({ where: { published: true } }),
      db.blogPost.count(),
      db.visitCounter.findUnique({ where: { id: "global" } }),
      db.visit.count(),
    ]);

    return NextResponse.json({
      ok: true,
      db: true,
      stats: {
        bookingsNew, bookingsTotal,
        messagesNew, messagesTotal,
        blogPublished, blogTotal,
        visitsTotal: visitTotal,
        visitsToday: counter?.dayCount || 0,
        visitsWeek: counter?.weekCount || 0,
        visitsMonth: counter?.monthCount || 0,
      },
    });
  } catch (e) {
    console.error("[admin/stats] error", e);
    return NextResponse.json({
      ok: true,
      db: true,
      stats: {
        bookingsNew: 0, bookingsTotal: 0, messagesNew: 0, messagesTotal: 0,
        blogPublished: 0, blogTotal: 0, visitsTotal: 0,
        visitsToday: 0, visitsWeek: 0, visitsMonth: 0,
      },
    });
  }
}
