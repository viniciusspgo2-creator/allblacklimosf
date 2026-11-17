import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Server-side geocode proxy using the free Photon / Komoot API.
 * Returns features with full OSM properties for category detection.
 *
 * Photon API docs: https://photon.komoot.io/
 * Properties include: name, street, housenumber, city, town, village,
 * state, postcode, country, osm_key, osm_value, osm_id.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    if (q.trim().length < 3) {
      return NextResponse.json({ features: [] });
    }

    // Photon accepts "lat" and "lon" to bias results toward a location.
    // We bias toward San Francisco (37.7749, -122.4194) for the limo service.
    //
    // DO NOT append ", USA" to the query: it makes Photon match the token
    // "USA" as text, so "Union Square, USA" returned businesses with USA in
    // the name (Rookie USA, Mediamakers USA) and pushed Union Square SF out
    // of the top 6. Without the suffix, SF shows up.
    //
    // Results are re-ranked so San Francisco comes first, then California,
    // then the rest — preserving Photon's own order inside each group.
    // (Sorting by raw distance to SF broke exact matches: the "Post Street"
    // street centroid sits closer to downtown than "333 Post Street", and
    // the Fairmont taxi stand sits closer than the hotel itself.)
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=8&lat=37.7749&lon=-122.4194`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { "Accept": "application/json", "User-Agent": "AllBlackLimoSF/1.0" },
      });
      clearTimeout(timeout);
      const data = await res.json();
      const features = Array.isArray(data?.features) ? data.features : [];
      const rank = (f: { properties?: Record<string, string | undefined> }) => {
        const p = f.properties || {};
        const city = (p.city || p.town || "").toLowerCase();
        const state = (p.state || "").toLowerCase();
        if (city === "san francisco") return 0;
        if (state === "california" || state === "ca") return 1;
        return 2;
      };
      // Stable sort: Array.prototype.sort is stable, so Photon's text-match
      // order is kept inside each group.
      features.sort((a, b) => rank(a) - rank(b));
      // Return the full Photon response (features + properties)
      return NextResponse.json({ ...data, features });
    } catch (e) {
      clearTimeout(timeout);
      console.error("[geocode] failed", e);
      return NextResponse.json({ features: [], error: "geocode_failed" });
    }
  } catch (e) {
    return NextResponse.json({ features: [], error: "geocode_failed" });
  }
}
