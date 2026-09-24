"use client";

import { useEffect, useRef, useState } from "react";
import type * as LeafletNS from "leaflet";

type Props = {
  pickup: [number, number] | null;
  destination: [number, number] | null;
  onRoute?: (info: RouteInfo) => void;
};

export type RouteInfo = {
  distanceKm: number;
  miles: number;
  durationMin: number;
  source: "osrm" | "estimate" | "none";
  hasRoute: boolean;
};

type LatLng = [number, number];

/**
 * Premium Leaflet map with real driving route, animated dotted line,
 * and custom gold markers. Uses OSRM for accurate distance/time.
 */
export function TripMap({ pickup, destination, onRoute }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const markerARef = useRef<unknown>(null);
  const markerBRef = useRef<unknown>(null);
  const routeRef = useRef<unknown>(null);
  const routeShadowRef = useRef<unknown>(null);
  const pickupCircleRef = useRef<unknown>(null);
  const destCircleRef = useRef<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Init map once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const L = (await import("leaflet")).default;
        delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
        if (cancelled || !containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current, {
          center: [37.7749, -122.4194],
          zoom: 11,
          scrollWheelZoom: true,
          zoomControl: true,
          attributionControl: true,
        });
        // Premium dark theme tiles — Esri World Dark Gray (completely free, no API key)
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
          attribution: '&copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
          maxZoom: 16,
        }).addTo(map);
        // Reference layer (labels, boundaries) on top of the base
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
          maxZoom: 16,
          attribution: "",
        }).addTo(map);

        // Move zoom control to right side
        map.zoomControl.setPosition("topright");

        mapRef.current = map;
      } catch (e) {
        console.error("[TripMap] init failed", e);
        setError("Map unavailable");
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        try {
          (mapRef.current as { remove: () => void }).remove();
        } catch {
          // ignore
        }
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers + route when pickup/destination change
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!mapRef.current) return;
      const L = (await import("leaflet")).default;
      if (cancelled) return;
      const map = mapRef.current as LeafletNS.Map;

      // Clear previous layers
      const clearLayer = (ref: React.MutableRefObject<unknown>) => {
        if (ref.current) {
          map.removeLayer(ref.current as LeafletNS.Layer);
          ref.current = null;
        }
      };
      clearLayer(markerARef);
      clearLayer(markerBRef);
      clearLayer(routeRef);
      clearLayer(routeShadowRef);
      clearLayer(pickupCircleRef);
      clearLayer(destCircleRef);

      if (pickup) {
        const goldIcon = L.divIcon({
          className: "abl-marker abl-marker--pickup",
          html: `<div class="abl-marker__pin abl-marker__pin--pickup">
                   <i class="fa-solid fa-location-dot"></i>
                   <span class="abl-marker__label">PICKUP</span>
                 </div>`,
          iconSize: [44, 56],
          iconAnchor: [22, 50],
        });
        markerARef.current = L.marker(pickup, { icon: goldIcon }).addTo(map);
        // Pulsing circle around pickup
        pickupCircleRef.current = L.circle(pickup, {
          radius: 250,
          color: "#d7b563",
          weight: 1,
          fillColor: "#d7b563",
          fillOpacity: 0.08,
          className: "abl-route-pulse",
        }).addTo(map);
      }

      if (destination) {
        const destIcon = L.divIcon({
          className: "abl-marker abl-marker--destination",
          html: `<div class="abl-marker__pin abl-marker__pin--dest">
                   <i class="fa-solid fa-flag-checkered"></i>
                   <span class="abl-marker__label">DROP-OFF</span>
                 </div>`,
          iconSize: [44, 56],
          iconAnchor: [22, 50],
        });
        markerBRef.current = L.marker(destination, { icon: destIcon }).addTo(map);
        destCircleRef.current = L.circle(destination, {
          radius: 250,
          color: "#f0d995",
          weight: 1,
          fillColor: "#f0d995",
          fillOpacity: 0.08,
          className: "abl-route-pulse-dest",
        }).addTo(map);
      }

      if (pickup && destination) {
        setLoading(true);
        // Fetch the real driving route
        try {
          const url = `/api/route?fromLat=${pickup[0]}&fromLng=${pickup[1]}&toLat=${destination[0]}&toLng=${destination[1]}`;
          const res = await fetch(url, { signal: AbortSignal.timeout(7000) });
          const data = await res.json();

          if (cancelled) return;

          if (data.ok && data.geometry && data.geometry.length > 1) {
            const geometry: LatLng[] = data.geometry;

            // Shadow line (subtle dark glow under the route)
            routeShadowRef.current = L.polyline(geometry, {
              color: "#000",
              weight: 8,
              opacity: 0.45,
              lineCap: "round",
              lineJoin: "round",
            }).addTo(map);

            // Animated dotted gold route line
            routeRef.current = L.polyline(geometry, {
              color: "#d7b563",
              weight: 4,
              opacity: 0.95,
              dashArray: "10 8",
              lineCap: "round",
              lineJoin: "round",
              className: "abl-route-line",
            }).addTo(map);

            // Fit bounds to the route
            try {
              const bounds = (routeRef.current as unknown as { getBounds: () => LeafletNS.LatLngBounds }).getBounds();
              map.fitBounds(bounds, {
                padding: [80, 80],
                maxZoom: 14,
              });
            } catch {
              // ignore
            }

            if (onRoute) {
              onRoute({
                distanceKm: data.distanceKm,
                miles: data.miles,
                durationMin: data.durationMin,
                source: data.source,
                hasRoute: true,
              });
            }
          } else {
            // Fallback to straight line
            drawStraightLine(L, map, pickup, destination, onRoute);
          }
        } catch (e) {
          console.error("[TripMap] route fetch failed", e);
          drawStraightLine(L, map, pickup, destination, onRoute);
        } finally {
          if (!cancelled) setLoading(false);
        }
      } else if (pickup) {
        map.setView(pickup, 13);
        if (onRoute) onRoute({ distanceKm: 0, miles: 0, durationMin: 0, source: "none", hasRoute: false });
      } else if (destination) {
        map.setView(destination, 13);
        if (onRoute) onRoute({ distanceKm: 0, miles: 0, durationMin: 0, source: "none", hasRoute: false });
      } else {
        if (onRoute) onRoute({ distanceKm: 0, miles: 0, durationMin: 0, source: "none", hasRoute: false });
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickup, destination]);

  function drawStraightLine(
    L: typeof LeafletNS,
    map: LeafletNS.Map,
    pickup: LatLng,
    destination: LatLng,
    onRoute?: (info: RouteInfo) => void
  ) {
    const line = L.polyline([pickup, destination], {
      color: "#d7b563",
      weight: 4,
      opacity: 0.9,
      dashArray: "10 8",
      lineCap: "round",
      className: "abl-route-line",
    }).addTo(map);
    routeRef.current = line;
    try {
      map.fitBounds((line as unknown as { getBounds: () => LeafletNS.LatLngBounds }).getBounds(), {
        padding: [80, 80],
        maxZoom: 13,
      });
    } catch {
      // ignore
    }
    const km = haversine(pickup[0], pickup[1], destination[0], destination[1]);
    const miles = Math.round(km * 0.621371 * 10) / 10;
    const min = Math.max(5, Math.round((km / 45) * 60));
    if (onRoute) {
      onRoute({ distanceKm: km, miles, durationMin: min, source: "estimate", hasRoute: true });
    }
  }

  return (
    <>
      <div ref={containerRef} style={{ width: "100%", height: "100%", minHeight: 460 }} />
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 1000,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 999,
            background: "rgba(8,8,8,0.86)",
            border: "1px solid rgba(215,181,99,0.32)",
            color: "var(--gold-bright)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            backdropFilter: "blur(10px)",
          }}
        >
          <i className="fa-solid fa-spinner fa-spin" />
          Calculating route…
        </div>
      )}
      {error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            color: "var(--muted)",
            fontSize: 12,
          }}
        >
          {error}
        </div>
      )}
    </>
  );
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
