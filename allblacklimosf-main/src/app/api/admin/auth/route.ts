import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { hasAnyAdmin, hashPassword, newToken, verifyPassword, SESSION_COOKIE, SESSION_TTL_DAYS } from "@/lib/admin-auth";
import { validateEmail, getRequestContext, rateLimitCheck } from "@/lib/form-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!isDbConfigured()) {
      return NextResponse.json(
        { ok: false, status: "db_unavailable", message: "DATABASE_URL is not configured." },
        { status: 503 }
      );
    }
    const ctx = getRequestContext(request);
    if (!rateLimitCheck("admin_login", ctx.ip)) {
      return NextResponse.json({ ok: false, status: "rate_limited" }, { status: 429 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const email = validateEmail(body.email);
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ ok: false, status: "invalid" }, { status: 400 });
    }

    if (!(await hasAnyAdmin())) {
      return NextResponse.json(
        { ok: false, status: "not_setup", message: "Admin account does not exist yet. Please complete first-access setup." },
        { status: 404 }
      );
    }

    const admin = await db.adminUser.findUnique({ where: { email } });
    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return NextResponse.json({ ok: false, status: "invalid" }, { status: 401 });
    }

    const token = newToken();
    const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
    await db.adminSession.create({
      data: { token, adminId: admin.id, expiresAt },
    });

    const res = NextResponse.json({ ok: true, status: "ok", email: admin.email });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
    });
    return res;
  } catch (e) {
    console.error("[admin/auth] error", e);
    return NextResponse.json({ ok: false, status: "error" }, { status: 500 });
  }
}

// Helper exported for the logout route to rotate any stale password hash format.
export { hashPassword };
