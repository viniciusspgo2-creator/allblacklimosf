import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns the driving route between two coordinates.
 * Uses OSRM's free public demo server (no API key needed).
 * Falls back to a straight-line (haversine) estimate if OSRM fails.
 *
 * Response shape:
 *  { ok: true, distanceKm, durationMin, miles, geometry: [[lat,lng], ...] }
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromLat = searchParams.get("fromLat");
    const fromLng = searchParams.get("fromLng");
    const toLat = searchParams.get("toLat");
    const toLng = searchParams.get("toLng");

    if (!fromLat || !fromLng || !toLat || !toLng) {
      return NextResponse.json({ ok: false, error: "missing_coords" }, { status: 400 });
    }

    const fromLatN = parseFloat(fromLat);
    const fromLngN = parseFloat(fromLng);
    const toLatN = parseFloat(toLat);
    const toLngN = parseFloat(toLng);

    if ([fromLatN, fromLngN, toLatN, toLngN].some((n) => Number.isNaN(n))) {
      return NextResponse.json({ ok: false, error: "invalid_coords" }, { status: 400 });
    }

    // Try OSRM (free, no key). Format: /route/v1/driving/{lng},{lat};{lng},{lat}
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${fromLngN},${fromLatN};${toLngN},${toLatN}?overview=full&geometries=geojson&steps=false`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(osrmUrl, {
        signal: controller.signal,
        headers: { "User-Agent": "AllBlackLimoSF/1.0" },
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const route = data?.routes?.[0];
        if (route && route.geometry?.coordinates) {
          // OSRM returns coordinates as [lng, lat]; convert to [lat, lng] for Leaflet
          const geometry: [number, number][] = route.geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]]
          );
          const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
          const durationMin = Math.round(route.duration / 60);
          const miles = Math.round(distanceKm * 0.621371 * 10) / 10;

          return NextResponse.json({
            ok: true,
            source: "osrm",
            distanceKm,
            miles,
            durationMin,
            geometry,
          });
        }
      }
    } catch (e) {
      clearTimeout(timeout);
      console.error("[route] osrm failed", e);
    }

    // Fallback: straight-line haversine + estimated duration
    const km = haversine(fromLatN, fromLngN, toLatN, toLngN);
    const miles = Math.round(km * 0.621371 * 10) / 10;
    const min = Math.max(5, Math.round((km / 45) * 60));
    const geometry: [number, number][] = [
      [fromLatN, fromLngN],
      [toLatN, toLngN],
    ];

    return NextResponse.json({
      ok: true,
      source: "estimate",
      distanceKm: km,
      miles,
      durationMin: min,
      geometry,
    });
  } catch (e) {
    console.error("[route] error", e);
    return NextResponse.json({ ok: false, error: "route_failed" }, { status: 500 });
  }
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
