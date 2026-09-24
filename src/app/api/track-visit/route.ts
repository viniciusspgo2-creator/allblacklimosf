import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getTodayParts(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const tmp = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = (tmp.getUTCDay() + 6) % 7;
  tmp.setUTCDate(tmp.getUTCDate() - dayNum + 3);
  const firstThursday = tmp.valueOf();
  tmp.setUTCMonth(0, 1);
  if (tmp.getUTCDay() !== 4) {
    tmp.setUTCMonth(0, 1 + ((4 - tmp.getUTCDay()) + 7) % 7);
  }
  const week = String(1 + Math.ceil((firstThursday - tmp.valueOf()) / 604800000)).padStart(2, "0");
  const year = String(y);
  const month = `${y}-${m}`;
  const day = `${y}-${m}-${d}`;
  return { day, week: `${year}-${week}`, month, year };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = String(body.path || "").slice(0, 200);
    const referrer = String(body.referrer || "").slice(0, 300);
    const userAgent = String(body.userAgent || "").slice(0, 400);

    if (!path) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    if (!isDbConfigured()) {
      return NextResponse.json({ ok: true, tracked: false });
    }

    try {
      await db.visit.create({
        data: { path, referrer, userAgent },
      });
    } catch (e) {
      console.error("[track-visit] create failed", e);
    }

    try {
      const parts = getTodayParts();
      const existing = await db.visitCounter.findUnique({ where: { id: "global" } });
      if (!existing) {
        await db.visitCounter.create({
          data: {
            id: "global",
            total: 1,
            day: parts.day,
            week: parts.week,
            month: parts.month,
            year: parts.year,
            dayCount: 1,
            weekCount: 1,
            monthCount: 1,
            yearCount: 1,
          },
        });
      } else {
        const data: Record<string, unknown> = {
          total: { increment: 1 },
        };
        if (existing.day !== parts.day) {
          data.day = parts.day;
          data.dayCount = 1;
        } else {
          data.dayCount = { increment: 1 };
        }
        if (existing.week !== parts.week) {
          data.week = parts.week;
          data.weekCount = 1;
        } else {
          data.weekCount = { increment: 1 };
        }
        if (existing.month !== parts.month) {
          data.month = parts.month;
          data.monthCount = 1;
        } else {
          data.monthCount = { increment: 1 };
        }
        if (existing.year !== parts.year) {
          data.year = parts.year;
          data.yearCount = 1;
        } else {
          data.yearCount = { increment: 1 };
        }
        await db.visitCounter.update({
          where: { id: "global" },
          data: data as never,
        });
      }
    } catch (e) {
      console.error("[track-visit] counter update failed", e);
    }

    return NextResponse.json({ ok: true, tracked: true });
  } catch (e) {
    console.error("[track-visit] error", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
