"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { blogSeed } from "@/lib/blog-seed";

type Post = {
  id: string; slug: string; title: string; excerpt: string; content: string;
  coverImage: string; category: string; tags: string; author: string;
  readMinutes: number; published: boolean; featured: boolean;
  seoTitle: string | null; seoDescription: string | null; seoKeywords: string | null;
  createdAt: string;
};

const emptyPost: Omit<Post, "id" | "createdAt"> = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "Guides",
  tags: "",
  author: "All Black Limo SF",
  readMinutes: 6,
  published: false,
  featured: false,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
};

export default function BlogAdminPage() {
  const [items, setItems] = useState<Post[]>([]);
  const [editing, setEditing] = useState<(Omit<Post, "id" | "createdAt">) & { id?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    fetch("/api/admin/blog?all=1")
      .then((r) => r.json())
      .then((data) => { setItems(data.items || []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function newPost() {
    setEditing({ ...emptyPost });
  }

  async function savePost() {
    if (!editing) return;
    setSaving(true);
    try {
      const method = editing.id ? "PATCH" : "POST";
      const res = await fetch("/api/admin/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (res.ok) {
        setEditing(null);
        load();
      }
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this blog post permanently?")) return;
    await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
    load();
  }

  async function togglePublish(p: Post) {
    await fetch("/api/admin/blog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, published: !p.published }),
    });
    load();
  }

  async function seedBlog() {
    if (!confirm("This will insert the 6 strategic SEO articles into the database. Continue?")) return;
    for (const p of blogSeed) {
      await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...p,
          published: true,
        }),
      });
    }
    load();
  }

  return (
    <AdminShell>
      <div className="admin-main__header">
        <div>
          <div className="admin-main__title">Blog</div>
          <div className="admin-main__subtitle">Write, edit, and publish articles.</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {items.length === 0 && (
            <button onClick={seedBlog} className="button button--outline button--compact" style={{ fontSize: 11 }}>
              <i className="fa-solid fa-seedling" /> Seed 6 SEO articles
            </button>
          )}
          <button onClick={newPost} className="button button--gold button--compact" style={{ fontSize: 11 }}>
            <i className="fa-solid fa-plus" /> New post
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: "var(--muted)" }}><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }} /> Loading…</div>
      ) : items.length === 0 ? (
        <div className="admin-card">
          <p style={{ color: "var(--muted)" }}>No blog posts yet. Click &ldquo;Seed 6 SEO articles&rdquo; to insert the strategic starter content, or &ldquo;New post&rdquo; to write your own.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Status</th><th>Created</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.title}</strong><br />
                    <small style={{ color: "var(--muted)" }}>/{p.slug}</small>
                  </td>
                  <td>{p.category}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${p.published ? "done" : "archived"}`}>{p.published ? "published" : "draft"}</span>
                    {p.featured && <span className="admin-badge admin-badge--done" style={{ marginLeft: 4, background: "rgba(215,181,99,0.16)", color: "var(--gold-bright)" }}>featured</span>}
                  </td>
                  <td>{new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button onClick={() => setEditing({ ...p })} className="admin-sidebar__link" style={{ padding: "5px 10px", border: "1px solid var(--line)", borderRadius: 6, background: "transparent", color: "var(--gold-bright)", cursor: "pointer", fontSize: 11 }}>Edit</button>
                    <button onClick={() => togglePublish(p)} className="admin-sidebar__link" style={{ padding: "5px 10px", border: "1px solid var(--line)", borderRadius: 6, background: "transparent", color: "var(--muted)", cursor: "pointer", fontSize: 11 }}>{p.published ? "Unpublish" : "Publish"}</button>
                    <button onClick={() => deletePost(p.id)} className="admin-sidebar__link" style={{ padding: "5px 10px", border: "1px solid var(--line)", borderRadius: 6, background: "transparent", color: "#f0a8a1", cursor: "pointer", fontSize: 11 }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="booking-notice-modal is-visible" style={{ display: "grid" }} onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div className="booking-notice-modal__dialog" style={{ maxWidth: 720, padding: 28, maxHeight: "88vh", overflowY: "auto" }} role="dialog" aria-modal="true" tabIndex={-1}>
            <button className="booking-notice-modal__close" type="button" aria-label="Close" onClick={() => setEditing(null)}><i className="fa-solid fa-xmark" /></button>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 16 }}>{editing.id ? "Edit post" : "New post"}</h2>

            <div className="admin-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label>Title *</label>
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <label>Slug *</label>
                <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="my-article-slug" />
              </div>
              <div>
                <label>Category</label>
                <input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label>Excerpt (used in blog cards &amp; SEO description)</label>
                <textarea value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={2} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label>Content (Markdown — # ## ###, lists, links, blockquotes)</label>
                <textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={14} style={{ fontFamily: "monospace", fontSize: 13 }} />
              </div>
              <div>
                <label>Cover image (path under /images/)</label>
                <input value={editing.coverImage} onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })} placeholder="/images/fleet-cadillac-escalade-esv.webp" />
              </div>
              <div>
                <label>Tags (comma-separated)</label>
                <input value={editing.tags} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} />
              </div>
              <div>
                <label>Author</label>
                <input value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} />
              </div>
              <div>
                <label>Read minutes</label>
                <input type="number" min={1} max={60} value={editing.readMinutes} onChange={(e) => setEditing({ ...editing, readMinutes: Number(e.target.value) })} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label>SEO title (overrides default)</label>
                <input value={editing.seoTitle || ""} onChange={(e) => setEditing({ ...editing, seoTitle: e.target.value })} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label>SEO description</label>
                <textarea value={editing.seoDescription || ""} onChange={(e) => setEditing({ ...editing, seoDescription: e.target.value })} rows={2} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label>SEO keywords (comma-separated)</label>
                <input value={editing.seoKeywords || ""} onChange={(e) => setEditing({ ...editing, seoKeywords: e.target.value })} />
              </div>
              <div style={{ gridColumn: "1 / -1", display: "flex", gap: 18, alignItems: "center", marginTop: 8 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 0 }}>
                  <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                  Published
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 0 }}>
                  <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                  Featured
                </label>
              </div>
              <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, marginTop: 10 }}>
                <button onClick={savePost} className="button button--gold" disabled={saving || !editing.title || !editing.slug || !editing.content}>
                  {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Saving…</> : <><i className="fa-solid fa-floppy-disk" /> Save post</>}
                </button>
                <button onClick={() => setEditing(null)} className="button button--outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
