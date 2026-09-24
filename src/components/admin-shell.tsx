"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "fa-chart-line" },
  { href: "/admin/bookings", label: "Bookings", icon: "fa-calendar-check" },
  { href: "/admin/messages", label: "Messages", icon: "fa-envelope" },
  { href: "/admin/blog", label: "Blog", icon: "fa-pen-nib" },
  { href: "/admin/visits", label: "Visit Counter", icon: "fa-chart-simple" },
  { href: "/admin/seo", label: "SEO", icon: "fa-magnifying-glass-chart" },
  { href: "/admin/settings", label: "Settings", icon: "fa-gear" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Probe to verify auth state
    fetch("/api/admin/stats", { method: "GET" })
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "unauthorized") {
          router.push("/admin");
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        // DB might not be configured — still show the shell with empty state
        setChecking(false);
      });
  }, [router]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#050505", color: "var(--muted)" }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }} />
        Loading admin…
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <Image src="/images/all-black-limo-logo.png" alt="All Black Limo" width={36} height={31} />
          <div>
            <strong style={{ display: "block", color: "var(--white)", fontSize: 13 }}>All Black Limo</strong>
            <small style={{ color: "var(--muted)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin Panel</small>
          </div>
        </div>
        <nav className="admin-sidebar__nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar__link${pathname === item.href ? " is-active" : ""}`}
            >
              <i className={`fa-solid ${item.icon}`} />
              <span>{item.label}</span>
            </Link>
          ))}
          <button onClick={logout} className="admin-sidebar__link" style={{ marginTop: 8, background: "transparent", border: 0, width: "100%", textAlign: "left", cursor: "pointer" }}>
            <i className="fa-solid fa-arrow-right-from-bracket" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
