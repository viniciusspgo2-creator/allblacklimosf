"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";

type Stats = {
  bookingsNew?: number; bookingsTotal?: number;
  messagesNew?: number; messagesTotal?: number;
  blogPublished?: number; blogTotal?: number;
  visitsTotal?: number; visitsToday?: number; visitsWeek?: number; visitsMonth?: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({});
  const [db, setDb] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats || {});
        setDb(!!data.db);
      })
      .catch(() => {});
  }, []);

  return (
    <AdminShell>
      <div className="admin-main__header">
        <div>
          <div className="admin-main__title">Dashboard</div>
          <div className="admin-main__subtitle">Overview of bookings, messages, blog posts, and site visits.</div>
        </div>
        {db === false && (
          <div className="alert alert--error" role="alert" style={{ maxWidth: 380, fontSize: 12 }}>
            <i className="fa-solid fa-circle-exclamation" /> DATABASE_URL is not configured. Set it on Vercel to enable persistence.
          </div>
        )}
      </div>

      <div className="admin-stats" style={{ marginBottom: 28 }}>
        <Stat label="Bookings (new)" value={stats.bookingsNew ?? 0} delta="Open to review" icon="fa-calendar-check" />
        <Stat label="Bookings (total)" value={stats.bookingsTotal ?? 0} delta="All-time" icon="fa-calendar-days" />
        <Stat label="Messages (new)" value={stats.messagesNew ?? 0} delta="Open to review" icon="fa-envelope" />
        <Stat label="Messages (total)" value={stats.messagesTotal ?? 0} delta="All-time" icon="fa-inbox" />
        <Stat label="Blog published" value={stats.blogPublished ?? 0} delta={`${stats.blogTotal ?? 0} total drafts+published`} icon="fa-pen-nib" />
        <Stat label="Visits (total)" value={stats.visitsTotal ?? 0} delta="All tracked visits" icon="fa-chart-simple" />
        <Stat label="Visits today" value={stats.visitsToday ?? 0} delta="Last 24h" icon="fa-clock" />
        <Stat label="Visits this week" value={stats.visitsWeek ?? 0} delta="Last 7d" icon="fa-calendar-week" />
        <Stat label="Visits this month" value={stats.visitsMonth ?? 0} delta="Last 30d" icon="fa-calendar" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
        <div className="admin-card">
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, marginBottom: 14, color: "var(--white)" }}>Recent actions</h3>
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10, margin: 0 }}>
            <li><Link href="/admin/bookings" style={{ color: "var(--gold-bright)", display: "inline-flex", alignItems: "center", gap: 10 }}><i className="fa-solid fa-arrow-right" /> Review new bookings</Link></li>
            <li><Link href="/admin/messages" style={{ color: "var(--gold-bright)", display: "inline-flex", alignItems: "center", gap: 10 }}><i className="fa-solid fa-arrow-right" /> Read new messages</Link></li>
            <li><Link href="/admin/blog" style={{ color: "var(--gold-bright)", display: "inline-flex", alignItems: "center", gap: 10 }}><i className="fa-solid fa-arrow-right" /> Write a blog post</Link></li>
            <li><Link href="/admin/seo" style={{ color: "var(--gold-bright)", display: "inline-flex", alignItems: "center", gap: 10 }}><i className="fa-solid fa-arrow-right" /> Update SEO meta tags</Link></li>
            <li><Link href="/admin/settings" style={{ color: "var(--gold-bright)", display: "inline-flex", alignItems: "center", gap: 10 }}><i className="fa-solid fa-arrow-right" /> Manage site content & banners</Link></li>
          </ul>
        </div>

        <div className="admin-card">
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, marginBottom: 14, color: "var(--white)" }}>Quick stats</h3>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7 }}>
            The visit counter records every public page load. Bookings and messages persist to PostgreSQL. Blog posts can be drafted and published from this panel.
          </p>
          <Link href="/" className="button button--outline button--compact" style={{ marginTop: 14 }}>
            <i className="fa-solid fa-arrow-up-right-from-square" /> View public site
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value, delta, icon }: { label: string; value: number; delta: string; icon: string }) {
  return (
    <div className="admin-stat">
      <div className="admin-stat__label">
        <i className={`fa-solid ${icon}`} style={{ marginRight: 6, color: "var(--gold)" }} />
        {label}
      </div>
      <div className="admin-stat__value">{value.toLocaleString()}</div>
      <div className="admin-stat__delta">{delta}</div>
    </div>
  );
}
