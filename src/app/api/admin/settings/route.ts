import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: true, db: false, settings: {} });
  }
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ ok: false, status: "unauthorized" }, { status: 401 });
  }
  try {
    const rows = await db.siteSetting.findMany();
    const settings: Record<string, string> = {};
    for (const r of rows) settings[r.key] = r.value;
    return NextResponse.json({ ok: true, db: true, settings });
  } catch (e) {
    console.error("[admin/settings] list error", e);
    return NextResponse.json({ ok: true, db: true, settings: {} });
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
    const body = (await request.json().catch(() => ({}))) as { settings?: Record<string, string> };
    if (!body.settings || typeof body.settings !== "object") {
      return NextResponse.json({ ok: false, status: "invalid" }, { status: 400 });
    }
    const ops = Object.entries(body.settings).map(([key, value]) => {
      const k = String(key).slice(0, 120);
      const v = String(value ?? "").slice(0, 5000);
      return db.siteSetting.upsert({
        where: { key: k },
        create: { id: k, key: k, value: v },
        update: { value: v },
      });
    });
    await Promise.all(ops);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/settings] save error", e);
    return NextResponse.json({ ok: false, status: "error" }, { status: 500 });
  }
}
