"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";

export default function VisitsPage() {
  const [data, setData] = useState<{
    total?: number; day?: number; week?: number; month?: number;
    topPaths?: Array<[string, number]>;
    hours?: number[];
    recent?: Array<{ path: string; at: string }>;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/visits")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const maxHour = Math.max(...(data.hours || [0]), 1);
  const maxPath = Math.max(...(data.topPaths || []).map(([, n]) => n), 1);

  return (
    <AdminShell>
      <div className="admin-main__header">
        <div>
          <div className="admin-main__title">Visit Counter</div>
          <div className="admin-main__subtitle">Real-time site analytics from the visit tracker.</div>
        </div>
      </div>

      <div className="admin-stats" style={{ marginBottom: 24 }}>
        <Stat label="Total visits" value={data.total ?? 0} />
        <Stat label="Today" value={data.day ?? 0} />
        <Stat label="This week" value={data.week ?? 0} />
        <Stat label="This month" value={data.month ?? 0} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>
        <div className="admin-card">
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--white)", marginBottom: 16 }}>Top paths (7 days)</h3>
          {(data.topPaths || []).length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No visits recorded yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {(data.topPaths || []).map(([path, n]) => (
                <div key={path}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "#d8d4cb", fontFamily: "monospace" }}>{path}</span>
                    <strong style={{ color: "var(--gold-bright)" }}>{n}</strong>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(n / maxPath) * 100}%`, background: "linear-gradient(90deg, var(--gold), var(--gold-bright))" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-card">
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--white)", marginBottom: 16 }}>Visits by hour (UTC, 7 days)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 3, marginBottom: 8 }}>
            {(data.hours || new Array(24).fill(0)).slice(0, 12).map((n, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ height: 80, background: "rgba(255,255,255,0.05)", borderRadius: 3, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                  <div style={{ width: "100%", height: `${(n / maxHour) * 100}%`, background: "linear-gradient(180deg, var(--gold-bright), var(--gold-deep))", minHeight: n > 0 ? 2 : 0 }} />
                </div>
                <small style={{ color: "var(--muted)", fontSize: 9 }}>{i}</small>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 3 }}>
            {(data.hours || new Array(24).fill(0)).slice(12, 24).map((n, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ height: 80, background: "rgba(255,255,255,0.05)", borderRadius: 3, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                  <div style={{ width: "100%", height: `${(n / maxHour) * 100}%`, background: "linear-gradient(180deg, var(--gold-bright), var(--gold-deep))", minHeight: n > 0 ? 2 : 0 }} />
                </div>
                <small style={{ color: "var(--muted)", fontSize: 9 }}>{i + 12}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--white)", marginBottom: 14 }}>Recent visits</h3>
        {loading ? (
          <div style={{ color: "var(--muted)" }}><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }} /> Loading…</div>
        ) : (data.recent || []).length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No recent visits recorded.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Time</th><th>Path</th></tr>
            </thead>
            <tbody>
              {(data.recent || []).map((v, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 12 }}>{new Date(v.at).toLocaleString()}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{v.path}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="admin-stat">
      <div className="admin-stat__label">{label}</div>
      <div className="admin-stat__value">{value.toLocaleString()}</div>
    </div>
  );
}
