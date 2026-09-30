import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import {
  cleanLine,
  cleanText,
  validateEmail,
  getRequestContext,
  isSameSiteRequest,
  rateLimitCheck,
  checkHoneypotAndTiming,
} from "@/lib/form-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const ctx = getRequestContext(request);

    if (!isSameSiteRequest(ctx)) {
      return NextResponse.json({ ok: false, status: "invalid" }, { status: 400 });
    }
    if (!rateLimitCheck("contact", ctx.ip)) {
      return NextResponse.json({ ok: false, status: "rate_limited" }, { status: 429 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const submittedAt = body.submitted_at
      ? Number(body.submitted_at)
      : undefined;
    const hp = checkHoneypotAndTiming(body, submittedAt);
    if (!hp.ok) {
      return NextResponse.json({ ok: false, status: "invalid", reason: hp.reason }, { status: 400 });
    }

    const name = cleanLine(body.name, 120);
    const email = validateEmail(body.email);
    const phone = cleanLine(body.phone, 40);
    const subject = cleanLine(body.subject, 100);
    const message = cleanText(body.message, 2000);
    const consent = body.consent === "1" || body.consent === 1 || body.consent === true;

    if (!name || !email || !subject || !message || !consent) {
      return NextResponse.json({ ok: false, status: "invalid" }, { status: 400 });
    }

    if (isDbConfigured()) {
      try {
        await db.contactMessage.create({
          data: {
            name,
            email,
            phone,
            subject,
            message,
            consent,
            ip: ctx.ip,
            userAgent: ctx.userAgent,
            status: "new",
          },
        });
      } catch (e) {
        console.error("[contact] db insert failed", e);
      }
    }

    return NextResponse.json({ ok: true, status: "success" });
  } catch (e) {
    console.error("[contact] error", e);
    return NextResponse.json({ ok: false, status: "error" }, { status: 500 });
  }
}
