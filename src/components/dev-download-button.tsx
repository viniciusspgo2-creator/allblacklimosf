"use client";

import { useEffect, useState } from "react";

/**
 * Temporary download button — visible ONLY in local development.
 * Automatically hides in production (Vercel) via process.env.NODE_ENV check.
 * This component is excluded from the production build entirely.
 */
export function DevDownloadButton() {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Double-check: hide if production (both at build time and runtime)
  const isDev = process.env.NODE_ENV === "development";
  if (!isDev) return null;

  async function downloadProject() {
    setDownloading(true);
    setStatus("Packaging project…");
    try {
      const res = await fetch("/api/dev-download", { method: "POST" });
      if (!res.ok) throw new Error("Failed to package");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "all-black-limo-sf.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatus("Download started!");
      setTimeout(() => setStatus(null), 3000);
    } catch (e) {
      setStatus("Error: " + (e as Error).message);
      setTimeout(() => setStatus(null), 5000);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        zIndex: 9999,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {open && (
        <div
          style={{
            marginBottom: 8,
            padding: 16,
            borderRadius: 12,
            background: "rgba(8, 8, 8, 0.95)",
            border: "1px solid rgba(215, 181, 99, 0.3)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
            color: "#fff",
            fontSize: 13,
            maxWidth: 320,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8, color: "#d7b563", fontSize: 14 }}>
            📦 Download Project (DEV ONLY)
          </div>
          <p style={{ margin: "0 0 12px", color: "#a9a59d", fontSize: 12, lineHeight: 1.5 }}>
            Creates a ZIP with all source files (excludes node_modules, .next, .git, dev.log).
            This button disappears automatically on Vercel production deploy.
          </p>
          {status && (
            <div style={{ marginBottom: 8, padding: "8px 10px", borderRadius: 8, background: "rgba(215,181,99,0.1)", color: "#d7b563", fontSize: 12 }}>
              {status}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={downloadProject}
              disabled={downloading}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 8,
                border: 0,
                background: downloading ? "#555" : "linear-gradient(135deg, #f0d995, #d7b563)",
                color: "#080808",
                fontWeight: 700,
                fontSize: 12,
                cursor: downloading ? "wait" : "pointer",
              }}
            >
              {downloading ? (
                <span><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 6 }} /> Packaging…</span>
              ) : (
                <span><i className="fa-solid fa-download" style={{ marginRight: 6 }} /> Download ZIP</span>
              )}
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "transparent",
                color: "#a9a59d",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 18px",
            borderRadius: 999,
            border: "1px solid rgba(215, 181, 99, 0.4)",
            background: "rgba(8, 8, 8, 0.9)",
            backdropFilter: "blur(12px)",
            color: "#d7b563",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
          title="Download project source (dev only)"
        >
          <i className="fa-solid fa-download" />
          Download
        </button>
      )}
    </div>
  );
}
