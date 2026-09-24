import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { hasAnyAdmin, hashPassword, newToken, SESSION_COOKIE, SESSION_TTL_DAYS } from "@/lib/admin-auth";
import { cleanLine, validateEmail, getRequestContext, rateLimitCheck } from "@/lib/form-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!isDbConfigured()) {
      return NextResponse.json(
        { ok: false, status: "db_unavailable", message: "DATABASE_URL is not configured. Set it on Vercel to enable the admin panel." },
        { status: 503 }
      );
    }

    const ctx = getRequestContext(request);
    if (!rateLimitCheck("admin_setup", ctx.ip)) {
      return NextResponse.json({ ok: false, status: "rate_limited" }, { status: 429 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const email = validateEmail(body.email);
    const name = cleanLine(body.name, 120) || "Administrator";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || password.length < 8) {
      return NextResponse.json(
        { ok: false, status: "invalid", message: "Valid email and password (8+ chars) required." },
        { status: 400 }
      );
    }

    // Refuse if any admin already exists — setup is first-access only.
    if (await hasAnyAdmin()) {
      return NextResponse.json(
        { ok: false, status: "already_setup", message: "Admin account already exists. Please log in." },
        { status: 409 }
      );
    }

    const admin = await db.adminUser.create({
      data: { email, name, passwordHash: hashPassword(password) },
    });

    const token = newToken();
    const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
    await db.adminSession.create({
      data: { token, adminId: admin.id, expiresAt },
    });

    const res = NextResponse.json({ ok: true, status: "created", email: admin.email });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
    });
    return res;
  } catch (e) {
    console.error("[admin/setup] error", e);
    return NextResponse.json({ ok: false, status: "error" }, { status: 500 });
  }
}
