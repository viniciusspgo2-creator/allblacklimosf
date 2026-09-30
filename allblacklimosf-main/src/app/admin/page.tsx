"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminEntryPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"loading" | "login" | "setup" | "db_unavailable">("loading");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/setup", { method: "GET" }).catch(() => {}).finally(() => {});
    // Check whether any admin exists by attempting login with empty creds.
    fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "_probe@allblacklimo.local", password: "_probe" }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "db_unavailable") setMode("db_unavailable");
        else if (data.status === "not_setup") setMode("setup");
        else setMode("login");
      })
      .catch(() => setMode("login"));
  }, []);

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        router.push("/admin/dashboard");
        return;
      }
      setError(data.message || "Could not complete setup.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        router.push("/admin/dashboard");
        return;
      }
      setError(data.message || "Invalid email or password.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "linear-gradient(160deg, #080808, #14110c)", padding: 22 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <Link href="/" style={{ display: "grid", placeItems: "center", marginBottom: 18 }}>
          <Image src="/images/all-black-limo-logo.png" alt="All Black Limo SF" width={88} height={76} />
        </Link>
        <div style={{
          padding: 30, borderRadius: 18,
          background: "rgba(20,18,14,0.92)",
          border: "1px solid rgba(215,181,99,0.22)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}>
          <span className="eyebrow" style={{ marginBottom: 12, justifyContent: "center" }}>
            <i className="fa-solid fa-lock" /> Admin access
          </span>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: 28, fontWeight: 600,
            color: "var(--white)", textAlign: "center", marginBottom: 8,
            letterSpacing: "-0.02em",
          }}>
            {mode === "setup" ? "Create your admin account" : mode === "login" ? "Sign in to continue" : mode === "db_unavailable" ? "Database not configured" : "Loading…"}
          </h1>
          <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, marginBottom: 22 }}>
            {mode === "setup" && "First-access setup. Create a password to manage bookings, blog, SEO, and site settings."}
            {mode === "login" && "Enter your credentials to access the admin panel."}
            {mode === "db_unavailable" && "Set DATABASE_URL (PostgreSQL) on Vercel to enable the admin panel."}
          </p>

          {error && (
            <div className="alert alert--error" role="alert" style={{ marginBottom: 14 }}>
              <i className="fa-solid fa-circle-exclamation" /> {error}
            </div>
          )}

          {mode === "loading" && (
            <div style={{ textAlign: "center", color: "var(--muted)" }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }} />
              Checking admin state…
            </div>
          )}

          {mode === "db_unavailable" && (
            <div style={{ display: "grid", gap: 10 }}>
              <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
                The admin panel requires a PostgreSQL database (Neon, Supabase, or any Postgres provider). Set the
                <code style={{ color: "var(--gold-bright)", margin: "0 4px" }}>DATABASE_URL</code>
                environment variable on Vercel and redeploy. The build script automatically creates the tables.
              </p>
              <Link href="/" className="button button--outline" style={{ marginTop: 8 }}>
                <i className="fa-solid fa-arrow-left" /> Back to site
              </Link>
            </div>
          )}

          {mode === "setup" && (
            <form onSubmit={handleSetup} style={{ display: "grid", gap: 14 }}>
              <div className="field field--premium">
                <label>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Administrator" required />
              </div>
              <div className="field field--premium">
                <label>Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
              </div>
              <div className="field field--premium">
                <label>Password (min 8 chars) *</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} required />
              </div>
              <div className="field field--premium">
                <label>Confirm password *</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" minLength={8} required />
              </div>
              <button className="button button--gold" type="submit" disabled={submitting}>
                {submitting ? <><i className="fa-solid fa-spinner fa-spin" /> Creating…</> : <><i className="fa-solid fa-shield-halved" /> Create admin account</>}
              </button>
            </form>
          )}

          {mode === "login" && (
            <form onSubmit={handleLogin} style={{ display: "grid", gap: 14 }}>
              <div className="field field--premium">
                <label>Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
              </div>
              <div className="field field--premium">
                <label>Password *</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
              </div>
              <button className="button button--gold" type="submit" disabled={submitting}>
                {submitting ? <><i className="fa-solid fa-spinner fa-spin" /> Signing in…</> : <><i className="fa-solid fa-arrow-right-to-bracket" /> Sign in</>}
              </button>
            </form>
          )}
        </div>
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 11, marginTop: 16 }}>
          All Black Limo SF · Admin Panel
        </p>
      </div>
    </div>
  );
}
