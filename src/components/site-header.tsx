"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site, serviceList } from "@/lib/site-data";

const languages = [
  { code: "EN", value: "en", flag: "/images/flags/en.svg", label: "English" },
  { code: "FR", value: "fr", flag: "/images/flags/fr.svg", label: "Français" },
  { code: "DE", value: "de", flag: "/images/flags/de.svg", label: "Deutsch" },
  { code: "ES", value: "es", flag: "/images/flags/es.svg", label: "Español" },
  { code: "PT", value: "pt", flag: "/images/flags/pt.svg", label: "Português" },
];

const navItems = [
  { label: "Home", href: "/", section: "home" },
  { label: "About", href: "/about", section: "about" },
  { label: "Services", href: "/services", section: "services" },
  { label: "Fleet", href: "/fleet", section: "fleet" },
  { label: "Blog", href: "/blog", section: "blog" },
  { label: "Contact", href: "/contact", section: "contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [langCode, setLangCode] = useState("EN");
  const [langFlag, setLangFlag] = useState("/images/flags/en.svg");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 22);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Sync language from localStorage if i18n.js set it
    try {
      const stored = window.localStorage.getItem("abl_language") || "en";
      const opt = languages.find((l) => l.value === stored) || languages[0];
      // Defer setState to avoid cascading renders
      Promise.resolve().then(() => {
        setLang(stored);
        setLangCode(opt.code);
        setLangFlag(opt.flag);
      });
    } catch {
      // ignore
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    Promise.resolve().then(() => {
      setMobileOpen(false);
      setSubmenuOpen(false);
    });
  }, [pathname]);

  const isActive = (section: string) => {
    if (section === "home") return pathname === "/";
    return pathname.startsWith(`/${section}`);
  };

  return (
    <>
      <div className="service-bar">
        <div className="site-shell service-bar__inner">
          <p>
            <span className="status-dot" aria-hidden="true" />
            Reservation assistance available 24/7
          </p>
          <div className="service-bar__contact">
            <a href={`tel:${site.phoneHref}`}>
              <i className="fa-solid fa-phone" />
              {site.phoneDisplay}
            </a>
            <span aria-hidden="true">·</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
      </div>

      <header className={`site-header${scrolled ? " is-scrolled" : ""}`} data-header>
        <div className="site-shell header__inner">
          <Link
            className="brand notranslate"
            href="/"
            aria-label="All Black Limo home"
            translate="no"
          >
            <Image
              className="brand__logo"
              src="/images/all-black-limo-logo.png"
              alt="All Black Limo"
              width={674}
              height={577}
              priority
            />
          </Link>

          <nav
            className={`primary-nav${mobileOpen ? " is-open" : ""}`}
            id="primary-navigation"
            aria-label="Primary navigation"
            aria-hidden={mobileOpen ? "false" : undefined}
          >
            <ul className="nav-list">
              {navItems.slice(0, 2).map((item) => (
                <li key={item.section}>
                  <Link
                    className={`nav-link${isActive(item.section) ? " is-active" : ""}`}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="nav-item--has-menu">
                <div className="nav-link-group">
                  <Link
                    className={`nav-link${isActive("services") ? " is-active" : ""}`}
                    href="/services"
                  >
                    Services
                  </Link>
                  <button
                    className="submenu-toggle"
                    type="button"
                    aria-expanded={submenuOpen}
                    aria-controls="services-menu"
                    aria-label="Open services menu"
                    onClick={() => setSubmenuOpen((v) => !v)}
                  >
                    <i className="fa-solid fa-chevron-down" aria-hidden="true" />
                  </button>
                </div>
                <div
                  className={`mega-menu${submenuOpen ? " is-open" : ""}`}
                  id="services-menu"
                >
                  <div className="mega-menu__intro">
                    <span className="eyebrow">Tailored transportation</span>
                    <strong>Choose the service that fits your itinerary.</strong>
                    <Link href="/services">
                      Explore all services <i className="fa-solid fa-arrow-right" />
                    </Link>
                  </div>
                  <div className="mega-menu__links">
                    {serviceList.map((s) => (
                      <Link key={s.slug} href={`/services/${s.slug}`}>
                        <i className={`fa-solid ${s.icon}`} aria-hidden="true" />
                        <span>
                          <strong>{s.nav}</strong>
                          <small>{s.short}</small>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
              {navItems.slice(3).map((item) => (
                <li key={item.section}>
                  <Link
                    className={`nav-link${isActive(item.section) ? " is-active" : ""}`}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__actions">
            <div
              className={`language-switcher notranslate${langOpen ? " is-open" : ""}`}
              translate="no"
            >
              <button
                className="language-switcher__trigger"
                type="button"
                aria-expanded={langOpen}
                aria-controls="language-menu"
                aria-label="Change language"
                onClick={() => setLangOpen((v) => !v)}
              >
                <Image src={langFlag} alt="" width={20} height={14} />
                <strong>{langCode}</strong>
                <i className="fa-solid fa-chevron-down" aria-hidden="true" />
              </button>
              <div
                className="language-switcher__menu"
                id="language-menu"
                role="menu"
              >
                {languages.map((l) => (
                  <button
                    key={l.value}
                    type="button"
                    role="menuitem"
                    data-language={l.value}
                    data-flag-src={l.flag}
                    className={l.value === lang ? "is-active" : ""}
                    aria-current={l.value === lang ? "true" : "false"}
                    onClick={() => {
                      setLang(l.value);
                      setLangCode(l.code);
                      setLangFlag(l.flag);
                      setLangOpen(false);
                      try {
                        window.localStorage.setItem("abl_language", l.value);
                      } catch {}
                      // Trigger original i18n.js translator if loaded
                      const w = window as unknown as {
                        AllBlackI18n?: { apply: (lang: string) => void };
                      };
                      w.AllBlackI18n?.apply(l.value);
                    }}
                  >
                    <Image src={l.flag} alt="" width={20} height={14} />
                    {" "}
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            <Link
              className="button button--gold button--compact"
              href="/book-now"
            >
              Request a ride <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
            <button
              className={`menu-toggle${mobileOpen ? " is-active" : ""}`}
              type="button"
              aria-controls="primary-navigation"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
