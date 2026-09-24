"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";

const seoFields = [
  { key: "seo_site_title", label: "Default site title (used when page doesn't override)", type: "text" },
  { key: "seo_site_description", label: "Default site description", type: "textarea" },
  { key: "seo_default_keywords", label: "Default keywords (comma-separated)", type: "text" },
  { key: "seo_og_image", label: "Open Graph image (path or URL)", type: "text" },
  { key: "seo_twitter_handle", label: "Twitter handle (e.g. @allblacklimosf)", type: "text" },
  { key: "seo_gsc_verification", label: "Google Search Console verification meta tag value", type: "text" },
  { key: "seo_bing_verification", label: "Bing Webmaster verification value", type: "text" },
  { key: "seo_gtm_id", label: "Google Tag Manager ID (GTM-XXXXXX)", type: "text" },
  { key: "seo_ga4_id", label: "Google Analytics 4 ID (G-XXXXXXXX)", type: "text" },
  { key: "seo_canonical_domain", label: "Canonical domain (https://...)", type: "text" },
  { key: "seo_geo_region", label: "Geo region (e.g. US-CA)", type: "text" },
  { key: "seo_geo_lat", label: "Latitude", type: "text" },
  { key: "seo_geo_lng", label: "Longitude", type: "text" },
  { key: "seo_structured_data_enabled", label: "Enable structured data globally (true/false)", type: "text" },
];

export default function SeoAdminPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [db, setDb] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setValues(data.settings || {});
        setDb(!!data.db);
      })
      .catch(() => {});
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: values }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <div className="admin-main__header">
        <div>
          <div className="admin-main__title">SEO Settings</div>
          <div className="admin-main__subtitle">Enterprise SEO configuration. Saved to the database and applied across the site.</div>
        </div>
        <button onClick={save} className="button button--gold button--compact" disabled={saving}>
          {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Saving…</> : <><i className="fa-solid fa-floppy-disk" /> Save changes</>}
        </button>
      </div>

      {saved && (
        <div className="alert alert--success" role="status" style={{ marginBottom: 18 }}>
          <i className="fa-solid fa-circle-check" /> SEO settings saved.
        </div>
      )}

      {db === false && (
        <div className="alert alert--error" role="alert" style={{ marginBottom: 18 }}>
          <i className="fa-solid fa-circle-exclamation" /> Database not configured. Set DATABASE_URL on Vercel to persist settings.
        </div>
      )}

      <div className="admin-card">
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--white)", marginBottom: 14 }}>Default metadata</h3>
        <div className="admin-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {seoFields.map((f) => (
            <div key={f.key} style={{ gridColumn: f.type === "textarea" ? "1 / -1" : undefined }}>
              <label>{f.label}</label>
              {f.type === "textarea" ? (
                <textarea rows={3} value={values[f.key] || ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
              ) : (
                <input value={values[f.key] || ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 18 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--white)", marginBottom: 12 }}>SEO features already implemented</h3>
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8, margin: 0, color: "#d8d4cb", fontSize: 13, lineHeight: 1.7 }}>
          <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> Unique title & description per page</li>
          <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> Canonical URLs (absolute)</li>
          <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> Open Graph + Twitter Cards</li>
          <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> JSON-LD: LocalBusiness, Organization, WebSite, WebPage, BreadcrumbList, FAQPage, Service, SportsEvent, BlogPosting</li>
          <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> Dynamic sitemap.xml (auto-includes blog posts)</li>
          <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> robots.txt (allows Googlebot/Bingbot, blocks /admin & /api)</li>
          <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> 301 redirects from legacy .php URLs</li>
          <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> Web App Manifest</li>
          <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> RSS feed for blog (/blog/rss.xml)</li>
          <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> Lazy-loaded images and videos</li>
          <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> Single H1 per page, structured H2/H3 hierarchy</li>
          <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> Geo tags (US-CA, San Francisco coordinates)</li>
          <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)</li>
          <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> Google Analytics 4 + GTM ready (set IDs above or via NEXT_PUBLIC_* env vars)</li>
        </ul>
      </div>
    </AdminShell>
  );
}
