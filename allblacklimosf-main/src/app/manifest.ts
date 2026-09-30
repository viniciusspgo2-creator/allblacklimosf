import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "All Black Limo SF — San Francisco Chauffeur & Black Car Service",
    short_name: "All Black Limo SF",
    description:
      "Private chauffeur service, airport transfers, corporate transportation, and premium fleet across San Francisco and the Bay Area.",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#080808",
    orientation: "portrait-primary",
    categories: ["travel", "business", "lifestyle"],
    icons: [
      {
        src: "/images/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/images/all-black-limo-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Request a ride",
        url: "/book-now",
        description: "Start a chauffeur ride request",
      },
      {
        name: "View fleet",
        url: "/fleet",
        description: "Explore the premium vehicle fleet",
      },
      {
        name: "Contact",
        url: "/contact",
        description: "Get in touch with All Black Limo SF",
      },
    ],
  };
}
