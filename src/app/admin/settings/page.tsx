"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { blogSeed } from "@/lib/blog-seed";

const settingsGroups = [
  {
    title: "Hero section (home page)",
    fields: [
      { key: "hero_eyebrow", label: "Eyebrow text" },
      { key: "hero_title_line1", label: "Title line 1" },
      { key: "hero_title_line2_em", label: "Title line 2 (emphasized)" },
      { key: "hero_lead", label: "Lead paragraph" },
      { key: "hero_cta_primary", label: "Primary CTA label" },
      { key: "hero_cta_secondary", label: "Secondary CTA label" },
    ],
  },
  {
    title: "Hero media",
    fields: [
      { key: "hero_video_url", label: "Hero video URL (path or full URL)", type: "video" },
      { key: "hero_poster_url", label: "Hero poster image URL" },
    ],
  },
  {
    title: "Closing video (lower section, home page)",
    fields: [
      { key: "closing_video_url", label: "Closing video URL", type: "video" },
      { key: "closing_eyebrow", label: "Eyebrow text" },
      { key: "closing_title", label: "Title" },
      { key: "closing_title_em", label: "Title emphasized part" },
      { key: "closing_lead", label: "Lead paragraph" },
      { key: "closing_cta", label: "CTA label" },
    ],
  },
  {
    title: "Booking notice modal",
    fields: [
      { key: "booking_notice_title", label: "Title" },
      { key: "booking_notice_text", label: "Body text (use \\n for line breaks)" },
      { key: "booking_notice_phone", label: "Phone (display)" },
    ],
  },
  {
    title: "Company contact",
    fields: [
      { key: "contact_phone_display", label: "Phone (display)" },
      { key: "contact_phone_href", label: "Phone (tel: link)" },
      { key: "contact_email", label: "Email" },
      { key: "contact_location", label: "Location" },
      { key: "contact_instagram", label: "Instagram URL" },
    ],
  },
  {
    title: "Social media preview",
    fields: [
      { key: "og_title", label: "Open Graph title" },
      { key: "og_description", label: "Open Graph description" },
      { key: "og_image_url", label: "Open Graph image URL" },
    ],
  },
];

export default function SettingsAdminPage() {
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

  async function seedAll() {
    if (!confirm("This will insert the 6 SEO blog articles. Continue?")) return;
    for (const p of blogSeed) {
      await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, published: true }),
      });
    }
    alert("Blog articles seeded.");
  }

  return (
    <AdminShell>
      <div className="admin-main__header">
        <div>
          <div className="admin-main__title">Site Settings</div>
          <div className="admin-main__subtitle">Manage banners, hero/closing video URLs, copy, and contact details.</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={seedAll} className="button button--outline button--compact" style={{ fontSize: 11 }}>
            <i className="fa-solid fa-seedling" /> Seed blog articles
          </button>
          <button onClick={save} className="button button--gold button--compact" disabled={saving}>
            {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Saving…</> : <><i className="fa-solid fa-floppy-disk" /> Save changes</>}
          </button>
        </div>
      </div>

      {saved && (
        <div className="alert alert--success" role="status" style={{ marginBottom: 18 }}>
          <i className="fa-solid fa-circle-check" /> Settings saved.
        </div>
      )}
      {db === false && (
        <div className="alert alert--error" role="alert" style={{ marginBottom: 18 }}>
          <i className="fa-solid fa-circle-exclamation" /> Database not configured. Set DATABASE_URL on Vercel to persist settings.
        </div>
      )}

      {settingsGroups.map((group) => (
        <div key={group.title} className="admin-card" style={{ marginBottom: 18 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--white)", marginBottom: 14 }}>{group.title}</h3>
          <div className="admin-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {group.fields.map((f) => (
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
          {group.title === "Hero media" && values.hero_video_url && (
            <div style={{ marginTop: 12 }}>
              <video src={values.hero_video_url} controls muted playsInline style={{ maxWidth: 320, borderRadius: 10, border: "1px solid var(--line)" }} />
            </div>
          )}
          {group.title === "Closing video (lower section, home page)" && values.closing_video_url && (
            <div style={{ marginTop: 12 }}>
              <video src={values.closing_video_url} controls muted playsInline style={{ maxWidth: 320, borderRadius: 10, border: "1px solid var(--line)" }} />
            </div>
          )}
        </div>
      ))}

      <div className="admin-card">
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--white)", marginBottom: 12 }}>Tip: banner & hero video defaults</h3>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7 }}>
          The hero video currently plays <code style={{ color: "var(--gold-bright)" }}>/hero-video.mp4</code> and the closing video plays <code style={{ color: "var(--gold-bright)" }}>/closing-video.mp4</code>.
          To swap videos, upload the new file to <code>/public</code> and update the paths here, or paste a full URL (e.g. from a CDN).
        </p>
      </div>
    </AdminShell>
  );
}
