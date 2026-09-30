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

    // Photon accepts a "lat" and "lon" parameter to bias results toward a location.
    // We bias toward San Francisco (37.7749, -122.4194) for the limo service.
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q + ", USA")}&limit=6&lat=37.7749&lon=-122.4194`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { "Accept": "application/json", "User-Agent": "AllBlackLimoSF/1.0" },
      });
      clearTimeout(timeout);
      const data = await res.json();
      // Return the full Photon response (features + properties)
      return NextResponse.json(data || { features: [] });
    } catch (e) {
      clearTimeout(timeout);
      console.error("[geocode] failed", e);
      return NextResponse.json({ features: [], error: "geocode_failed" });
    }
  } catch (e) {
    return NextResponse.json({ features: [], error: "geocode_failed" });
  }
}
