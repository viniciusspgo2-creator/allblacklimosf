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

    // A booking must be persisted before it can be acknowledged to the customer.
    // Without this check it could appear successful while never reaching the admin panel.
    if (!isDbConfigured() || !process.env.RESEND_API_KEY) {
      console.error("[booking] DATABASE_URL or RESEND_API_KEY is not configured");
      return NextResponse.json({ ok: false, status: "service_unavailable" }, { status: 503 });
    }

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
      return NextResponse.json({ ok: false, status: "error" }, { status: 500 });
    }

    try {
      await sendBookingNotification({
        firstName,
        lastName,
        email,
        phone,
        serviceType,
        vehicleType,
        pickupDate: finalDate,
        pickupTime: usTimeStr,
        passengers,
        luggage,
        pickupAddress,
        dropoffAddress,
        flightNumber,
        hours,
        couponCode,
        notes,
        distanceKm,
        durationMin,
      });
    } catch (e) {
      console.error("[booking] notification email failed", e);
      return NextResponse.json({ ok: false, status: "notification_error" }, { status: 502 });
    }

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

type BookingNotification = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceType: string;
  vehicleType: string;
  pickupDate: string;
  pickupTime: string;
  passengers: number;
  luggage: number;
  pickupAddress: string;
  dropoffAddress: string;
  flightNumber: string;
  hours: number | null;
  couponCode: string;
  notes: string;
  distanceKm: number | null;
  durationMin: number | null;
};

async function sendBookingNotification(booking: BookingNotification) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.BOOKING_NOTIFICATION_EMAIL || "allblacklimosf@gmail.com";
  const sender = process.env.RESEND_FROM_EMAIL || "All Black Limo SF <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  };
  const escapeHtml = (value: string) =>
    value.replace(/[&<>'"]/g, (character) => htmlEntities[character] || character);

  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-weight:600">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${escapeHtml(value || "—")}</td></tr>`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#111827">
      <h1 style="font-size:22px;margin-bottom:6px">New reservation request</h1>
      <p style="margin-top:0;color:#6b7280">A new request was saved in the All Black Limo SF admin panel.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${row("Passenger", `${booking.firstName} ${booking.lastName}`)}
        ${row("Customer email", booking.email)}
        ${row("Phone", booking.phone)}
        ${row("Service", booking.serviceType)}
        ${row("Vehicle", booking.vehicleType)}
        ${row("Pickup", `${booking.pickupDate} at ${booking.pickupTime}`)}
        ${row("Passengers", String(booking.passengers))}
        ${row("Luggage", String(booking.luggage))}
        ${row("Pickup address", booking.pickupAddress)}
        ${row("Destination", booking.dropoffAddress)}
        ${row("Flight number", booking.flightNumber)}
        ${row("Estimated hours", booking.hours == null ? "" : String(booking.hours))}
        ${row("Distance", booking.distanceKm == null ? "" : `${booking.distanceKm.toFixed(1)} km`)}
        ${row("Duration", booking.durationMin == null ? "" : `${booking.durationMin} min`)}
        ${row("Coupon", booking.couponCode)}
        ${row("Notes", booking.notes)}
      </table>
    </div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: booking.email,
      subject: `[New booking] ${booking.firstName} ${booking.lastName} — ${booking.pickupDate}`,
      html,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Resend returned ${response.status}: ${details.slice(0, 300)}`);
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
