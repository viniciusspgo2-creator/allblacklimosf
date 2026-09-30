"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";

type Booking = {
  id: string;
  firstName: string; lastName: string; email: string; phone: string;
  serviceType: string; vehicleType: string;
  pickupDate: string; pickupTime: string;
  passengers: number; luggage: number;
  pickupAddress: string; dropoffAddress: string;
  flightNumber: string | null; hours: number | null;
  couponCode: string | null; notes: string | null;
  status: string; createdAt: string;
  distanceKm: number | null; durationMin: number | null;
};

export default function BookingsPage() {
  const [items, setItems] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("new");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);

  function load(f: string) {
    setLoading(true);
    fetch(`/api/admin/bookings?status=${f}&limit=200`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    Promise.resolve().then(() => load(filter));
  }, [filter]);

  async function updateStatus(id: string, status: string) {
    const res = await fetch("/api/admin/bookings", {
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
    if (!confirm("Delete this booking permanently?")) return;
    const res = await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      load(filter);
      if (selected?.id === id) setSelected(null);
    }
  }

  return (
    <AdminShell>
      <div className="admin-main__header">
        <div>
          <div className="admin-main__title">Bookings</div>
          <div className="admin-main__subtitle">Manage incoming ride requests.</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["new", "review", "confirmed", "completed", "cancelled"].map((f) => (
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
        <div className="admin-card">
          <p style={{ color: "var(--muted)" }}>No {filter} bookings yet.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Passenger</th>
                <th>Service</th>
                <th>Pickup</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id}>
                  <td>{new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}<br /><small style={{ color: "var(--muted)" }}>{b.pickupDate} · {b.pickupTime}</small></td>
                  <td>
                    <strong>{b.firstName} {b.lastName}</strong><br />
                    <small style={{ color: "var(--muted)" }}>{b.email}<br />{b.phone}</small>
                  </td>
                  <td>{b.serviceType}<br /><small style={{ color: "var(--muted)" }}>{b.vehicleType || "Auto"}</small></td>
                  <td>
                    <small>{b.pickupAddress}</small><br />
                    <small style={{ color: "var(--muted)" }}>→ {b.dropoffAddress}</small>
                  </td>
                  <td><span className={`admin-badge admin-badge--${b.status === "new" ? "new" : b.status === "completed" || b.status === "confirmed" ? "done" : "archived"}`}>{b.status}</span></td>
                  <td>
                    <button onClick={() => setSelected(b)} className="admin-sidebar__link" style={{ padding: "6px 10px", border: "1px solid var(--line)", borderRadius: 6, background: "transparent", color: "var(--gold-bright)", cursor: "pointer", fontSize: 11 }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="booking-notice-modal is-visible" style={{ display: "grid" }} onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="booking-notice-modal__dialog" style={{ maxWidth: 540, padding: 28, maxHeight: "85vh", overflowY: "auto" }} role="dialog" aria-modal="true" tabIndex={-1}>
            <button className="booking-notice-modal__close" type="button" aria-label="Close" onClick={() => setSelected(null)}><i className="fa-solid fa-xmark" /></button>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 8 }}>{selected.firstName} {selected.lastName}</h2>
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 18 }}>
              Submitted {new Date(selected.createdAt).toLocaleString()}
            </p>
            <dl style={{ display: "grid", gap: 10, margin: 0 }}>
              <Item label="Email" value={selected.email} />
              <Item label="Phone" value={selected.phone} />
              <Item label="Service" value={selected.serviceType} />
              <Item label="Vehicle" value={selected.vehicleType || "Recommendation requested"} />
              <Item label="Pickup date" value={selected.pickupDate} />
              <Item label="Pickup time" value={selected.pickupTime} />
              <Item label="Passengers" value={String(selected.passengers)} />
              <Item label="Luggage" value={String(selected.luggage)} />
              <Item label="Pickup" value={selected.pickupAddress} />
              <Item label="Destination" value={selected.dropoffAddress} />
              <Item label="Flight number" value={selected.flightNumber || "—"} />
              <Item label="Estimated hours" value={selected.hours ? String(selected.hours) : "—"} />
              <Item label="Distance" value={selected.distanceKm != null ? `${selected.distanceKm.toFixed(1)} km` : "—"} />
              <Item label="Duration" value={selected.durationMin != null ? `${selected.durationMin} min` : "—"} />
              <Item label="Coupon" value={selected.couponCode || "—"} />
              <Item label="Notes" value={selected.notes || "—"} />
            </dl>
            <div style={{ marginTop: 22, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => updateStatus(selected.id, "review")} className="button button--outline button--compact" style={{ fontSize: 11 }}>Mark as review</button>
              <button onClick={() => updateStatus(selected.id, "confirmed")} className="button button--outline button--compact" style={{ fontSize: 11 }}>Confirm</button>
              <button onClick={() => updateStatus(selected.id, "completed")} className="button button--outline button--compact" style={{ fontSize: 11 }}>Mark completed</button>
              <button onClick={() => updateStatus(selected.id, "cancelled")} className="button button--outline button--compact" style={{ fontSize: 11 }}>Cancel</button>
              <button onClick={() => remove(selected.id)} className="button button--outline button--compact" style={{ fontSize: 11, color: "#f0a8a1" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt style={{ color: "var(--muted)", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>{label}</dt>
      <dd style={{ margin: "0 0 8px", color: "var(--white)", fontSize: 14, wordBreak: "break-word" }}>{value}</dd>
    </>
  );
}
