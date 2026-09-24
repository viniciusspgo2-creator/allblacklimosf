import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Allow og:image, sitemap, robots etc. to be served from public/
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  // Headers for security + SEO (defensive on Vercel)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    // SEO: legacy .php URLs → clean Next.js URLs
    return [
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/about.php", destination: "/about", permanent: true },
      { source: "/services.php", destination: "/services", permanent: true },
      { source: "/fleet.php", destination: "/fleet", permanent: true },
      { source: "/contact.php", destination: "/contact", permanent: true },
      { source: "/book-now.php", destination: "/book-now", permanent: true },
      { source: "/privacy.php", destination: "/privacy", permanent: true },
      { source: "/terms.php", destination: "/terms", permanent: true },
      { source: "/services/:slug.php", destination: "/services/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
