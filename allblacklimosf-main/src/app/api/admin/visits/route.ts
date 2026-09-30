import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

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
  try {
    const total = await db.visit.count();
    const counter = (await db.visitCounter.findUnique({ where: { id: "global" } })) || {
      total: 0, dayCount: 0, weekCount: 0, monthCount: 0, yearCount: 0,
    };
    // Top paths in last 7 days
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recent = await db.visit.findMany({
      where: { createdAt: { gte: since } },
      select: { path: true, createdAt: true },
      take: 5000,
      orderBy: { createdAt: "desc" },
    });
    const byPath = new Map<string, number>();
    for (const v of recent) {
      byPath.set(v.path, (byPath.get(v.path) || 0) + 1);
    }
    const topPaths = Array.from(byPath.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    // Hour-of-day histogram (UTC)
    const hours = new Array(24).fill(0);
    for (const v of recent) {
      const h = new Date(v.createdAt).getUTCHours();
      hours[h] += 1;
    }

    return NextResponse.json({
      ok: true,
      total,
      day: counter.dayCount,
      week: counter.weekCount,
      month: counter.monthCount,
      year: counter.yearCount,
      topPaths,
      hours,
      recent: recent.slice(0, 50).map((v) => ({
        path: v.path,
        at: v.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("[admin/visits] error", e);
    return NextResponse.json({ ok: false, status: "error" }, { status: 500 });
  }
}
