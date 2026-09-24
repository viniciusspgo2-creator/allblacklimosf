"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  id: string;
  placeholder?: string;
  value: string;
  onSelect: (address: string, coords: [number, number] | null) => void;
  variant?: "pickup" | "destination";
};

type Suggestion = {
  label: string;
  lat: number | null;
  lon: number | null;
  category: Category;
  icon: string;
  primary: string;
  secondary: string;
};

type Category = "airport" | "hotel" | "landmark" | "restaurant" | "transport" | "address" | "place";

function categorize(props: Record<string, string | undefined>): { category: Category; icon: string } {
  const osmId = props.osm_id || "";
  const osmValue = props.osm_value || "";
  const osmKey = props.osm_key || "";
  const name = (props.name || "").toLowerCase();

  // Airport detection
  if (
    osmKey === "aeroway" ||
    osmValue === "aerodrome" ||
    osmValue === "airport" ||
    name.includes("airport") ||
    name.includes("intl") ||
    /\b(sfo|oak|sjc|lax|jfk|lga)\b/i.test(name)
  ) {
    return { category: "airport", icon: "fa-plane-arrival" };
  }
  // Hotel
  if (osmValue === "hotel" || osmKey === "tourism" && (osmValue === "hotel" || osmValue === "motel" || osmValue === "guest_house") || name.includes("hotel") || name.includes("resort")) {
    return { category: "hotel", icon: "fa-hotel" };
  }
  // Restaurant
  if (osmKey === "amenity" && (osmValue === "restaurant" || osmValue === "cafe" || osmValue === "bar") || name.includes("restaurant")) {
    return { category: "restaurant", icon: "fa-utensils" };
  }
  // Landmark
  if (osmKey === "tourism" || osmValue === "attraction" || osmValue === "museum" || osmValue === "viewpoint" || name.includes("tower") || name.includes("bridge") || name.includes("square") || name.includes("park") || name.includes("stadium")) {
    return { category: "landmark", icon: "fa-landmark" };
  }
  // Transport hub (train station, bus)
  if (osmKey === "railway" || osmValue === "station" || osmValue === "bus_station" || name.includes("station") || name.includes("terminal")) {
    return { category: "transport", icon: "fa-train" };
  }
  // Default
  return { category: "place", icon: "fa-location-dot" };
}

function buildLabel(props: Record<string, string | undefined>): { primary: string; secondary: string } {
  const name = props.name || "";
  const street = props.street || "";
  const housenumber = props.housenumber || "";
  const city = props.city || props.town || props.village || props.hamlet || "";
  const state = props.state || "";
  const postcode = props.postcode || "";

  let primary = name || street;
  if (!primary && housenumber) primary = `${housenumber} ${street}`.trim();
  if (!primary) primary = city || "Location";

  let secondary = [name && street ? `${housenumber} ${street}`.trim() : "", city, state, postcode].filter(Boolean).join(", ");
  if (!secondary) secondary = [city, state].filter(Boolean).join(", ");
  if (!secondary) secondary = props.country || "";

  return { primary, secondary };
}

export function AddressAutocomplete({ id, placeholder, value, onSelect, variant = "pickup" }: Props) {
  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  function search(q: string) {
    if (q.trim().length < 3) {
      setItems([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`, { signal: AbortSignal.timeout(4000) });
        const data = await res.json();
        const features: Array<{ properties?: Record<string, string | undefined>; geometry?: { coordinates?: [number, number] } }> =
          Array.isArray(data?.features) ? data.features : [];
        const list: Suggestion[] = features.map((f) => {
          const props = f.properties || {};
          const geo = f.geometry || {};
          const { category, icon } = categorize(props);
          const { primary, secondary } = buildLabel(props);
          const label = [primary, secondary].filter(Boolean).join(", ");
          const coords: [number, number] | null =
            Array.isArray(geo.coordinates) && geo.coordinates.length === 2
              ? [geo.coordinates[1], geo.coordinates[0]]
              : null;
          return { label, lat: coords ? coords[0] : null, lon: coords ? coords[1] : null, category, icon, primary, secondary };
        });
        setItems(list);
        setOpen(list.length > 0);
        setActive(-1);
      } catch {
        setItems([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 280);
  }

  function choose(s: Suggestion) {
    setText(s.label);
    setOpen(false);
    setActive(-1);
    const coords: [number, number] | null =
      s.lat != null && s.lon != null ? [s.lat, s.lon] : null;
    onSelect(s.label, coords);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || items.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      choose(items[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const variantIcon = variant === "pickup" ? "fa-circle-dot" : "fa-flag-checkered";
  const variantColor = variant === "pickup" ? "var(--gold-bright)" : "var(--muted)";

  return (
    <div className="address-autocomplete-wrapper" ref={boxRef}>
      <div className="address-autocomplete__icon" aria-hidden="true">
        <i className={`fa-solid ${variantIcon}`} style={{ color: variantColor }} />
      </div>
      <input
        id={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          search(e.target.value);
        }}
        onKeyDown={onKeyDown}
        onFocus={() => { if (items.length > 0) setOpen(true); }}
      />
      {loading && (
        <div className="address-autocomplete__spinner" aria-hidden="true">
          <i className="fa-solid fa-spinner fa-spin" />
        </div>
      )}
      {(open || loading) && (
        <div className="address-suggestions" style={{ display: open || loading ? "block" : "none" }}>
          {loading && items.length === 0 && (
            <div className="address-suggestion-item address-suggestion-item--loading">
              <i className="fa-solid fa-spinner fa-spin" />
              <span>Searching locations…</span>
            </div>
          )}
          {!loading &&
            items.map((s, i) => (
              <div
                key={i}
                className={`address-suggestion-item${i === active ? " is-active" : ""}`}
                onClick={() => choose(s)}
                onMouseEnter={() => setActive(i)}
              >
                <span className="address-suggestion-item__icon">
                  <i className={`fa-solid ${s.icon}`} />
                </span>
                <span className="address-suggestion-item__body">
                  <strong className="address-suggestion-item__primary">{s.primary}</strong>
                  <small className="address-suggestion-item__secondary">{s.secondary}</small>
                </span>
                <span className="address-suggestion-item__category">{s.category}</span>
              </div>
            ))}
          {!loading && items.length === 0 && text.trim().length >= 3 && (
            <div className="address-suggestion-item address-suggestion-item--empty">
              <i className="fa-solid fa-magnifying-glass" />
              <span>No matches. Try a different search.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
