/**
 * Lightweight security helpers ported from includes/form-security.php
 * - same-site check via Sec-Fetch-Site header
 * - honeypot + timing check
 * - in-memory rate limit (per IP) — works on Vercel for warm instances
 */

const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 8;

type RateBucket = { count: number; first: number; last: number };

// Use globalThis so the bucket survives HMR in dev and is shared across warm invocations.
const rateMap = (globalThis as unknown as { __rateMap?: Map<string, RateBucket> }).__rateMap
  ?? new Map<string, RateBucket>();
(globalThis as unknown as { __rateMap?: Map<string, RateBucket> }).__rateMap = rateMap;

function getClientIp(request: Request): string {
  const headers = new Headers(request.headers);
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export function getRequestContext(request: Request) {
  const headers = new Headers(request.headers);
  const ip = getClientIp(request);
  const userAgent = headers.get("user-agent") || "";
  const origin = headers.get("origin") || "";
  const referer = headers.get("referer") || "";
  const fetchSite = headers.get("sec-fetch-site") || "";
  const host = headers.get("host") || "";
  return { ip, userAgent, origin, referer, fetchSite, host };
}

export function isSameSiteRequest(ctx: ReturnType<typeof getRequestContext>): boolean {
  if (ctx.fetchSite === "cross-site") return false;
  if (ctx.fetchSite === "same-origin" || ctx.fetchSite === "same-site") return true;

  // Fall back to host check against origin/referer
  const siteHost = ctx.host.split(":")[0]!.toLowerCase();
  if (!siteHost) return true; // Local dev / direct access

  for (const value of [ctx.origin, ctx.referer]) {
    if (!value) continue;
    try {
      const u = new URL(value);
      const reqHost = u.host.split(":")[0]!.toLowerCase();
      if (reqHost && reqHost !== siteHost) return false;
    } catch {
      continue;
    }
  }
  return true;
}

export function rateLimitCheck(formName: string, ip: string): boolean {
  const key = `${formName}|${ip}`;
  const now = Date.now();
  const bucket = rateMap.get(key);

  if (!bucket || now - bucket.first > RATE_WINDOW_MS) {
    rateMap.set(key, { count: 1, first: now, last: now });
    return true;
  }
  if (bucket.count >= RATE_MAX) return false;
  bucket.count += 1;
  bucket.last = now;
  return true;
}

export function checkHoneypotAndTiming(
  body: Record<string, unknown>,
  submittedAt: number | undefined
): { ok: true } | { ok: false; reason: string } {
  if (body.website && String(body.website).trim() !== "") {
    return { ok: false, reason: "honeypot" };
  }
  if (!submittedAt || Number.isNaN(submittedAt)) {
    return { ok: false, reason: "timing_invalid" };
  }
  const elapsed = Date.now() / 1000 - submittedAt;
  if (elapsed < 2) return { ok: false, reason: "timing_too_fast" };
  if (elapsed > 86400) return { ok: false, reason: "timing_too_slow" };
  return { ok: true };
}

/** Sanitize a single-line string */
export function cleanLine(value: unknown, max = 220): string {
  if (typeof value !== "string") return "";
  let v = value.trim();
  v = v.replace(/[\0\r\n]/g, " ");
  v = v.replace(/<[^>]*>/g, "");
  return v.slice(0, max);
}

/** Sanitize a multi-line block of text */
export function cleanText(value: unknown, max = 2000): string {
  if (typeof value !== "string") return "";
  let v = value.trim();
  v = v.replace(/\0/g, "");
  v = v.replace(/<[^>]*>/g, "");
  return v.slice(0, max);
}

export function validateEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  // RFC-ish + length guard
  if (v.length > 160) return null;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(v) ? v : null;
}

export function validatePhone(value: string): boolean {
  const digits = value.replace(/\D+/g, "");
  return digits.length >= 7 && digits.length <= 16;
}

export function validateUsDate(value: string): { year: number; month: number; day: number } | null {
  const trimmed = value.trim();
  let month: number, day: number, year: number;
  const compact = trimmed.match(/^(\d{2})(\d{2})(\d{4})$/);
  const separated = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (compact) {
    month = Number(compact[1]); day = Number(compact[2]); year = Number(compact[3]);
  } else if (separated) {
    month = Number(separated[1]); day = Number(separated[2]); year = Number(separated[3]);
  } else {
    return null;
  }
  const test = new Date(Date.UTC(year, month - 1, day));
  if (
    year < 2000 ||
    test.getUTCFullYear() !== year ||
    test.getUTCMonth() !== month - 1 ||
    test.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

export function validateTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}
