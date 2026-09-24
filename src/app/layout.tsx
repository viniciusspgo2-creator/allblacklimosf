import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { site } from "@/lib/site-data";
import { JsonLd } from "@/components/json-ld";
import { PublicChrome } from "@/components/public-chrome";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "San Francisco Chauffeur & Black Car Service | All Black Limo SF",
    template: "%s | All Black Limo SF",
  },
  description:
    "Professional chauffeur service, airport transfers, corporate transportation, private itineraries, and premium vehicles across San Francisco and the Bay Area.",
  keywords: [
    "San Francisco chauffeur service",
    "SFO airport transfer",
    "black car service San Francisco",
    "corporate transportation",
    "Bay Area limo service",
    "All Black Limo SF",
  ],
  authors: [{ name: "All Black Limo SF" }],
  creator: "All Black Limo SF",
  publisher: "All Black Limo SF",
  applicationName: "All Black Limo SF",
  generator: "Next.js",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "All Black Limo SF",
    title: "San Francisco Chauffeur & Black Car Service | All Black Limo SF",
    description:
      "Private chauffeur service tailored around your itinerary, with professional chauffeurs, attentive coordination, and a premium fleet for every occasion.",
    images: [
      {
        url: "/images/fleet-cadillac-escalade-esv.webp",
        width: 1264,
        height: 848,
        alt: "All Black Limo SF premium chauffeur fleet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "San Francisco Chauffeur & Black Car Service | All Black Limo SF",
    description:
      "Private chauffeur service tailored around your itinerary, with professional chauffeurs, attentive coordination, and a premium fleet for every occasion.",
    images: ["/images/fleet-cadillac-escalade-esv.webp"],
  },
  icons: {
    icon: [{ url: "/images/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/images/all-black-limo-logo.png" }],
  },
  manifest: "/manifest.webmanifest",
  category: "travel",
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#080808" />
        <meta name="author" content="All Black Limo SF" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="San Francisco" />
        <meta name="geo.position" content="37.7749;-122.4194" />
        <meta name="ICBM" content="37.7749, -122.4194" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <link rel="stylesheet" href="/styles/style.css" />
        {/* Enable reveal-on-scroll animations. This inline script runs before
            paint to add the 'reveal-ready' class, which hides [data-reveal]
            elements. If JS fails, the class is never added and content stays
            visible (no hidden content). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('reveal-ready');",
          }}
        />
        <link rel="icon" href="/images/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/all-black-limo-logo.png" />
        <link rel="mask-icon" href="/images/favicon.svg" color="#d7b563" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="All Black Limo SF Blog"
          href="/blog/rss.xml"
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "LocalBusiness",
                "@id": `${siteUrl}/#business`,
                name: site.name,
                legalName: "All Black Limo SF",
                url: siteUrl,
                logo: `${siteUrl}/images/all-black-limo-logo.png`,
                image: `${siteUrl}/images/fleet-cadillac-escalade-esv.webp`,
                telephone: site.phoneHref,
                email: site.email,
                priceRange: "$$$",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "San Francisco",
                  addressRegion: "CA",
                  addressCountry: "US",
                },
                areaServed: [
                  "San Francisco",
                  "San Francisco Bay Area",
                  "Northern California",
                  "Napa Valley",
                  "Sonoma",
                  "Silicon Valley",
                  "Marin",
                ],
                sameAs: [site.instagram],
                openingHoursSpecification: [
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ],
                    opens: "00:00",
                    closes: "23:59",
                  },
                ],
                contactPoint: [
                  {
                    "@type": "ContactPoint",
                    telephone: site.phoneHref,
                    contactType: "reservations",
                    areaServed: "US",
                    availableLanguage: ["English", "Spanish", "French", "German", "Portuguese"],
                  },
                ],
              },
              {
                "@type": "WebSite",
                "@id": `${siteUrl}/#website`,
                url: siteUrl,
                name: site.name,
                publisher: { "@id": `${siteUrl}/#business` },
                inLanguage: "en-US",
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${siteUrl}/blog?q={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@type": "Organization",
                "@id": `${siteUrl}/#organization`,
                name: site.name,
                url: siteUrl,
                logo: `${siteUrl}/images/all-black-limo-logo.png`,
                sameAs: [site.instagram],
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: site.phoneHref,
                  contactType: "customer service",
                  areaServed: "US",
                },
              },
            ],
          }}
        />
      </head>
      <body
        className={`${cormorant.variable} ${manrope.variable} antialiased`}
        style={{ background: "var(--ink)", color: "var(--white)" }}
      >
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <PublicChrome>{children}</PublicChrome>
        <Toaster />
        {/* i18n translator (language switcher). Reveal animations, FAQ accordion,
            and video lazy-loading are handled by React components. */}
        <script src="/scripts/i18n.js" defer />
        {/* Analytics placeholder (GTM/GA4 ready) */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
            }}
          />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}',{send_page_view:true});`,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
