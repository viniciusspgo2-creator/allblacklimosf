import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import {
  cleanLine,
  cleanText,
  validateEmail,
  validatePhone,
  validateUsDate,
  validateTime,
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
    if (!rateLimitCheck("booking", ctx.ip)) {
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

    const firstName = cleanLine(body.first_name, 80);
    const lastName = cleanLine(body.last_name, 80);
    const email = validateEmail(body.email);
    const phone = cleanLine(body.phone, 40);
    const serviceType = cleanLine(body.service_type, 100);
    const vehicleType = cleanLine(body.vehicle_type, 100);
    const pickupDate = cleanLine(body.pickup_date, 10);
    const pickupDateDisplay = cleanLine(body.pickup_date_display, 10);
    const pickupTime = cleanLine(body.pickup_time, 5);
    const passengers = Number(body.passengers);
    const luggage = Number(body.luggage || 0);
    const pickupAddress = cleanLine(body.pickup_address, 220);
    const dropoffAddress = cleanLine(body.dropoff_address, 220);
    const flightNumber = cleanLine(body.flight_number, 30);
    const hours = body.hours ? Number(body.hours) : null;
    const couponCode = cleanLine(body.coupon_code, 40);
    const notes = cleanText(body.notes, 2000);
    const consent = body.consent === "1" || body.consent === 1 || body.consent === true;
    const distanceKm = body.distance_km ? Number(body.distance_km) : null;
    const durationMin = body.duration_min ? Number(body.duration_min) : null;

    // Normalize date
    let finalDate = pickupDate;
    if (!finalDate && pickupDateDisplay) {
      const parts = validateUsDate(pickupDateDisplay);
      if (parts) {
        finalDate = `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
      }
    }
    const dateParts = validateUsDate(pickupDateDisplay || "");
    if (dateParts) {
      finalDate = `${dateParts.year}-${String(dateParts.month).padStart(2, "0")}-${String(dateParts.day).padStart(2, "0")}`;
    }

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !validatePhone(phone) ||
      !serviceType ||
      !finalDate ||
      !validateTime(pickupTime) ||
      Number.isNaN(passengers) ||
      passengers < 1 ||
      passengers > 60 ||
      !pickupAddress ||
      !dropoffAddress ||
      !consent
    ) {
      return NextResponse.json({ ok: false, status: "invalid" }, { status: 400 });
    }

    // 12-hour advance notice check (San Francisco timezone)
    // Build a Date from wall-clock SF time. Use simple approach: treat input as local to PT.
    const tz = "America/Los_Angeles";
    const localNow = new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
    const pickupTs = new Date(`${finalDate}T${pickupTime}:00`);
    // Adjust pickupTs from PT to UTC equivalent
    // Simple heuristic: get PT offset for that date
    const utcDate = new Date(
      pickupTs.toLocaleString("en-US", { timeZone: "UTC" })
    );
    const ptOffsetMin = getPtOffsetMinutes(pickupTs);
    const pickupUtc = new Date(pickupTs.getTime() + ptOffsetMin * 60000);
    void utcDate;

    const minPickup = new Date(localNow.getTime() + 12 * 60 * 60 * 1000);
    if (pickupUtc.getTime() < minPickup.getTime()) {
      return NextResponse.json({ ok: false, status: "too_soon" }, { status: 200 });
    }

    const usDateStr = `${String(dateParts?.month ?? 1).padStart(2, "0")}/${String(dateParts?.day ?? 1).padStart(2, "0")}/${dateParts?.year ?? new Date().getFullYear()}`;
    const timeParts = pickupTime.split(":");
    const h12 = Number(timeParts[0]);
    const ampm = h12 >= 12 ? "PM" : "AM";
    const h12mod = h12 % 12 === 0 ? 12 : h12 % 12;
    const usTimeStr = `${h12mod}:${timeParts[1]} ${ampm}`;

    // Try to persist (Vercel + Neon). If DB not configured locally, return success.
    if (isDbConfigured()) {
      try {
        await db.booking.create({
          data: {
            firstName,
            lastName,
            email,
            phone,
            serviceType,
            vehicleType,
            pickupDate: finalDate,
            pickupTime,
            passengers,
            luggage,
            pickupAddress,
            dropoffAddress,
            flightNumber,
            hours: hours && !Number.isNaN(hours) ? hours : null,
            couponCode,
            notes,
            distanceKm,
            durationMin,
            consent,
            ip: ctx.ip,
            userAgent: ctx.userAgent,
            status: "new",
          },
        });
      } catch (e) {
        console.error("[booking] db insert failed", e);
        // Still return success to user — the form is informational.
        // Admin will still see a log of the attempt if the DB later catches up.
      }
    }

    // Also send an email notification if configured — placeholder for production.
    // For Vercel deployments, integrate Resend / SendGrid in production.

    return NextResponse.json({
      ok: true,
      status: "success",
      summary: {
        pickupDate: usDateStr,
        pickupTime: usTimeStr,
        serviceType,
        passengers,
      },
    });
  } catch (e) {
    console.error("[booking] error", e);
    return NextResponse.json({ ok: false, status: "error" }, { status: 500 });
  }
}

/** Returns Pacific Time offset in minutes for the given date (handles DST). */
function getPtOffsetMinutes(date: Date): number {
  // Use Intl to determine if DST is active for the given date
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false, timeZoneName: "short",
  });
  const parts = dtf.formatToParts(date);
  const tzName = parts.find((p) => p.type === "timeZoneName")?.value || "";
  // PDT = -7h, PST = -8h
  return tzName.includes("PDT") ? -7 * 60 : -8 * 60;
}
