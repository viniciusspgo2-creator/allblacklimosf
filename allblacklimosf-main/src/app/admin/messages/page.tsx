"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";

type Message = {
  id: string;
  name: string; email: string; phone: string;
  subject: string; message: string;
  status: string; createdAt: string;
};

export default function MessagesPage() {
  const [items, setItems] = useState<Message[]>([]);
  const [filter, setFilter] = useState("new");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  function load(f: string) {
    setLoading(true);
    fetch(`/api/admin/messages?status=${f}&limit=200`)
      .then((r) => r.json())
      .then((data) => { setItems(data.items || []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    // Defer to avoid cascading renders
    Promise.resolve().then(() => load(filter));
  }, [filter]);

  async function updateStatus(id: string, status: string) {
    const res = await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      load(filter);
      if (selected?.id === id) setSelected({ ...selected, status });
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this message permanently?")) return;
    const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      load(filter);
      if (selected?.id === id) setSelected(null);
    }
  }

  return (
    <AdminShell>
      <div className="admin-main__header">
        <div>
          <div className="admin-main__title">Messages</div>
          <div className="admin-main__subtitle">Contact form inquiries.</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["new", "read", "replied", "archived"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`admin-sidebar__link${filter === f ? " is-active" : ""}`}
              style={{ padding: "8px 12px", border: "1px solid var(--line)", borderRadius: 8, background: filter === f ? "rgba(215,181,99,0.12)" : "transparent", color: filter === f ? "var(--gold-bright)" : "var(--muted)", textTransform: "capitalize", cursor: "pointer", fontSize: 11 }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ color: "var(--muted)" }}><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }} /> Loading…</div>
      ) : items.length === 0 ? (
        <div className="admin-card"><p style={{ color: "var(--muted)" }}>No {filter} messages yet.</p></div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>From</th>
                <th>Topic</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id}>
                  <td>{new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                  <td><strong>{m.name}</strong><br /><small style={{ color: "var(--muted)" }}>{m.email}{m.phone ? ` · ${m.phone}` : ""}</small></td>
                  <td>{m.subject}</td>
                  <td style={{ maxWidth: 320, color: "var(--muted)" }}>{m.message.slice(0, 100)}{m.message.length > 100 ? "…" : ""}</td>
                  <td><span className={`admin-badge admin-badge--${m.status === "new" ? "new" : m.status === "replied" ? "done" : "archived"}`}>{m.status}</span></td>
                  <td>
                    <button onClick={() => { setSelected(m); if (m.status === "new") updateStatus(m.id, "read"); }} className="admin-sidebar__link" style={{ padding: "6px 10px", border: "1px solid var(--line)", borderRadius: 6, background: "transparent", color: "var(--gold-bright)", cursor: "pointer", fontSize: 11 }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="booking-notice-modal is-visible" style={{ display: "grid" }} onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="booking-notice-modal__dialog" style={{ maxWidth: 540, padding: 28 }} role="dialog" aria-modal="true" tabIndex={-1}>
            <button className="booking-notice-modal__close" type="button" aria-label="Close" onClick={() => setSelected(null)}><i className="fa-solid fa-xmark" /></button>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 6 }}>{selected.subject}</h2>
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 16 }}>
              From <strong style={{ color: "var(--white)" }}>{selected.name}</strong> · {selected.email} · {selected.phone || "No phone"}<br />
              Received {new Date(selected.createdAt).toLocaleString()}
            </p>
            <div style={{ padding: 18, border: "1px solid var(--line)", borderRadius: 12, background: "rgba(255,255,255,0.02)", color: "#d8d4cb", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {selected.message}
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`} className="button button--gold button--compact" style={{ fontSize: 11 }}>
                <i className="fa-solid fa-reply" /> Reply by email
              </a>
              <button onClick={() => updateStatus(selected.id, "replied")} className="button button--outline button--compact" style={{ fontSize: 11 }}>Mark replied</button>
              <button onClick={() => updateStatus(selected.id, "archived")} className="button button--outline button--compact" style={{ fontSize: 11 }}>Archive</button>
              <button onClick={() => remove(selected.id)} className="button button--outline button--compact" style={{ fontSize: 11, color: "#f0a8a1" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
