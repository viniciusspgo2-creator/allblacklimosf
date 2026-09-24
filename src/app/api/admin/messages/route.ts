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
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "";
  const limit = Math.min(Number(searchParams.get("limit") || 100), 200);

  try {
    const items = await db.contactMessage.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return NextResponse.json({ ok: true, items });
  } catch (e) {
    console.error("[admin/messages] list error", e);
    return NextResponse.json({ ok: false, items: [] }, { status: 500 });
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
    const body = (await request.json().catch(() => ({}))) as { id?: string; status?: string };
    if (!body.id || !body.status) {
      return NextResponse.json({ ok: false, status: "invalid" }, { status: 400 });
    }
    const allowed = ["new", "read", "replied", "archived"];
    if (!allowed.includes(body.status)) {
      return NextResponse.json({ ok: false, status: "invalid_status" }, { status: 400 });
    }
    const updated = await db.contactMessage.update({
      where: { id: body.id },
      data: { status: body.status },
    });
    return NextResponse.json({ ok: true, item: updated });
  } catch (e) {
    console.error("[admin/messages] update error", e);
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
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/messages] delete error", e);
    return NextResponse.json({ ok: false, status: "error" }, { status: 500 });
  }
}
