import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { SESSION_COOKIE, requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (admin && isDbConfigured()) {
    // Delete all sessions for this admin (logout everywhere).
    await db.adminSession.deleteMany({ where: { adminId: admin.adminId } }).catch(() => {});
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
