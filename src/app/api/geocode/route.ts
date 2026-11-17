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
    // Results are sorted by distance to San Francisco, so when a place name
    // exists in several cities (Union Square, Washington Square...), the
    // San Francisco one comes first instead of New York.
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
      const SF_LAT = 37.7749;
      const SF_LON = -122.4194;
      features.sort((a: { geometry?: { coordinates?: [number, number] } }, b: { geometry?: { coordinates?: [number, number] } }) => {
        const da = distance(a?.geometry?.coordinates);
        const db = distance(b?.geometry?.coordinates);
        return da - db;
      });
      function distance(coords?: [number, number]) {
        if (!Array.isArray(coords) || coords.length < 2) return Infinity;
        const dLat = coords[1] - SF_LAT;
        const dLon = coords[0] - SF_LON;
        return dLat * dLat + dLon * dLon;
      }
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
