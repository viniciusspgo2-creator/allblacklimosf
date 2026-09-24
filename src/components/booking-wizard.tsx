"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { site, services as serviceMap, fleet } from "@/lib/site-data";
import { AddressAutocomplete } from "@/components/address-autocomplete";
import { TripMap } from "@/components/trip-map";
import type { RouteInfo } from "@/components/trip-map";
import { BookingNoticeModal } from "@/components/booking-notice-modal";

type Step = 1 | 2 | 3;

type PassengerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type TripInfo = {
  pickup: string;
  pickupCoords: [number, number] | null;
  destination: string;
  destinationCoords: [number, number] | null;
  distanceKm: number | null;
  miles: number | null;
  durationMin: number | null;
  routeSource: "osrm" | "estimate" | "none";
  hasRoute: boolean;
};

type RidePreferences = {
  serviceType: string;
  vehicle: string;
  pickupDate: string;
  pickupDateDisplay: string;
  pickupHour: string;
  pickupMinute: string;
  pickupPeriod: "AM" | "PM" | "";
  passengers: number;
  luggage: number;
  flightNumber: string;
  hours: string;
  couponCode: string;
  notes: string;
  consent: boolean;
};

const serviceList = Object.values(serviceMap);

export function BookingWizard() {
  const search = useSearchParams();
  const preselectedService = search.get("service") || "";
  const preselectedVehicle = search.get("vehicle") || "";

  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "too_soon" | "invalid" | "error">("idle");
  const [submittedAt] = useState<number>(Math.floor(Date.now() / 1000));

  const [passenger, setPassenger] = useState<PassengerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [trip, setTrip] = useState<TripInfo>({
    pickup: "",
    pickupCoords: null,
    destination: "",
    destinationCoords: null,
    distanceKm: null,
    miles: null,
    durationMin: null,
    routeSource: "none",
    hasRoute: false,
  });

  const [prefs, setPrefs] = useState<RidePreferences>({
    serviceType: preselectedService,
    vehicle: preselectedVehicle,
    pickupDate: "",
    pickupDateDisplay: "",
    pickupHour: "",
    pickupMinute: "",
    pickupPeriod: "",
    passengers: 1,
    luggage: 0,
    flightNumber: "",
    hours: "",
    couponCode: "",
    notes: "",
    consent: false,
  });

  // Compute pickup time ISO
  const pickupTimeIso = useMemo(() => {
    if (!prefs.pickupHour || prefs.pickupMinute === "" || !prefs.pickupPeriod) return "";
    const hour12 = Number(prefs.pickupHour);
    const hour = prefs.pickupPeriod === "PM" ? (hour12 % 12) + 12 : hour12 % 12;
    return `${String(hour).padStart(2, "0")}:${String(prefs.pickupMinute).padStart(2, "0")}`;
  }, [prefs.pickupHour, prefs.pickupMinute, prefs.pickupPeriod]);

  // Date min (today)
  const todayIso = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const goto = (target: Step, dir: "forward" | "backward") => {
    setDirection(dir);
    setStep(target);
    if (typeof window !== "undefined") {
      // Scroll to the wizard progress indicator so the user sees the step change
      const wizard = document.querySelector(".wizard");
      if (wizard) {
        const rect = wizard.getBoundingClientRect();
        const scrollTop = window.scrollY + rect.top - 80; // 80px offset for header
        window.scrollTo({ top: scrollTop, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // ---- Step 1 validation ----
  const step1Valid =
    passenger.firstName.trim().length > 0 &&
    passenger.lastName.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email) &&
    passenger.phone.replace(/\D+/g, "").length >= 7;

  // ---- Step 2 validation ----
  const step2Valid =
    trip.pickup.trim().length > 3 &&
    trip.destination.trim().length > 3;

  // ---- Step 3 validation ----
  const step3Valid =
    prefs.serviceType !== "" &&
    prefs.pickupDate !== "" &&
    pickupTimeIso !== "" &&
    prefs.passengers >= 1 &&
    prefs.consent === true;

  const isTooSoon = useMemo(() => {
    if (!prefs.pickupDate || !pickupTimeIso) return false;
    try {
      // Treat as Pacific Time (San Francisco)
      const pickupDate = new Date(`${prefs.pickupDate}T${pickupTimeIso}:00`);
      // Approximate PT offset (covers DST boundary roughly)
      const offsetMin = getPtOffsetMinutes(pickupDate);
      const pickupUtc = new Date(pickupDate.getTime() + offsetMin * 60000);
      const minPickup = new Date(Date.now() + 12 * 60 * 60 * 1000);
      return pickupUtc.getTime() < minPickup.getTime();
    } catch {
      return false;
    }
  }, [prefs.pickupDate, pickupTimeIso]);

  useEffect(() => {
    if (isTooSoon && step === 3) {
      setNoticeOpen(true);
    }
  }, [isTooSoon, step]);

  async function handleSubmit() {
    if (isTooSoon) {
      setNoticeOpen(true);
      return;
    }
    if (!step1Valid || !step2Valid || !step3Valid) {
      setStatus("invalid");
      return;
    }
    setStatus("submitting");
    try {
      const payload = {
        ...passenger,
        service_type: prefs.serviceType,
        vehicle_type: prefs.vehicle,
        pickup_date: prefs.pickupDate,
        pickup_date_display: prefs.pickupDateDisplay,
        pickup_time: pickupTimeIso,
        passengers: prefs.passengers,
        luggage: prefs.luggage,
        pickup_address: trip.pickup,
        dropoff_address: trip.destination,
        flight_number: prefs.flightNumber,
        hours: prefs.hours ? Number(prefs.hours) : "",
        coupon_code: prefs.couponCode,
        notes: prefs.notes,
        consent: prefs.consent ? "1" : "",
        website: "",
        submitted_at: submittedAt,
        distance_km: trip.distanceKm,
        duration_min: trip.durationMin,
      };
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.status === "success") {
        setStatus("success");
      } else if (data.status === "too_soon") {
        setStatus("too_soon");
        setNoticeOpen(true);
      } else if (data.status === "invalid") {
        setStatus("invalid");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-card" style={{ animation: "wizard-slide-in 480ms var(--ease)" }}>
        <div className="alert alert--success" role="status">
          <i className="fa-solid fa-circle-check" /> Your request was received. We&apos;ll review the itinerary and contact you to continue the reservation.
        </div>
        <div style={{ marginTop: 22 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "var(--white)" }}>What happens next</h3>
          <ul style={{ marginTop: 18, display: "grid", gap: 12, listStyle: "none", padding: 0 }}>
            <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> Trip details reviewed</li>
            <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> Availability checked</li>
            <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> Quote and category confirmed</li>
            <li><i className="fa-solid fa-check" style={{ color: "var(--gold)", marginRight: 10 }} /> Final reservation communication</li>
          </ul>
        </div>
        <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="button button--gold" href="/">Return home <i className="fa-solid fa-arrow-right" /></Link>
          <Link className="button button--outline" href="/fleet">Explore the fleet</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wizard">
        <div className="wizard__progress">
          {([1, 2, 3] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`wizard__step${step === s ? " is-active" : ""}${step > s ? " is-complete" : ""}`}
              onClick={() => {
                if (s < step) goto(s, "backward");
              }}
              style={{ cursor: s < step ? "pointer" : "default" }}
            >
              <div className="wizard__step-dot">
                <span className="step-number">{s}</span>
              </div>
              <div className="wizard__step-label">
                {s === 1 ? "Passenger" : s === 2 ? "Trip" : "Preferences"}
              </div>
            </div>
          ))}
        </div>

        <div className="wizard__panel" data-step={step}>
          {/* STEP 1 — Passenger Information */}
          {step === 1 && (
            <div className="form-card" style={{ animation: "wizard-slide-in 480ms var(--ease)" }}>
              <h2>Passenger information</h2>
              <p className="form-card__intro">
                Required fields are marked with an asterisk. Online ride requests must be scheduled at least 12 hours in advance. For urgent reservations, call <a href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>.
              </p>

              {status === "invalid" && (
                <div className="alert alert--error" role="alert">
                  <i className="fa-solid fa-circle-exclamation" /> Please review the required information and try again.
                </div>
              )}
              {status === "error" && (
                <div className="alert alert--error" role="alert">
                  <i className="fa-solid fa-circle-exclamation" /> We could not send the request. Please call {site.phoneDisplay}.
                </div>
              )}

              <div className="form-grid">
                <div className="field field--premium">
                  <label htmlFor="first_name">First name *</label>
                  <input
                    id="first_name"
                    type="text"
                    autoComplete="given-name"
                    maxLength={80}
                    required
                    value={passenger.firstName}
                    onChange={(e) => setPassenger({ ...passenger, firstName: e.target.value })}
                  />
                </div>
                <div className="field field--premium">
                  <label htmlFor="last_name">Last name *</label>
                  <input
                    id="last_name"
                    type="text"
                    autoComplete="family-name"
                    maxLength={80}
                    required
                    value={passenger.lastName}
                    onChange={(e) => setPassenger({ ...passenger, lastName: e.target.value })}
                  />
                </div>
                <div className="field field--premium">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    maxLength={160}
                    required
                    value={passenger.email}
                    onChange={(e) => setPassenger({ ...passenger, email: e.target.value })}
                  />
                </div>
                <div className="field field--premium">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={40}
                    placeholder="+1 (___) ___-____"
                    required
                    value={passenger.phone}
                    onChange={(e) => setPassenger({ ...passenger, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="wizard__actions">
                <Link className="button button--outline" href="/services">
                  <i className="fa-solid fa-arrow-left" /> Back to services
                </Link>
                <button
                  className="button button--gold"
                  type="button"
                  disabled={!step1Valid}
                  onClick={() => goto(2, "forward")}
                  style={{ opacity: step1Valid ? 1 : 0.5 }}
                >
                  Continue <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Trip Information */}
          {step === 2 && (
            <div className="form-layout wizard__step-content" style={{ animation: "wizard-slide-in 480ms var(--ease)" }}>
              <div className="form-card">
                <h2>Trip information</h2>
                <p className="form-card__intro">
                  Use the smart autocomplete to select your pickup and destination. As you type, suggested locations (airports, hotels, landmarks, addresses) appear with category icons. We&apos;ll trace the driving route on the map and calculate miles and travel time in real time.
                </p>

                <div className="form-grid">
                  <div className="field field--full field--premium">
                    <label htmlFor="pickup_address">Pickup location *</label>
                    <AddressAutocomplete
                      id="pickup_address"
                      variant="pickup"
                      placeholder="Airport, hotel, venue, or full address"
                      value={trip.pickup}
                      onSelect={(address, coords) =>
                        setTrip((t) => ({ ...t, pickup: address, pickupCoords: coords }))
                      }
                    />
                  </div>
                  <div className="field field--full field--premium">
                    <label htmlFor="dropoff_address">Destination *</label>
                    <AddressAutocomplete
                      id="dropoff_address"
                      variant="destination"
                      placeholder="Where would you like to arrive?"
                      value={trip.destination}
                      onSelect={(address, coords) =>
                        setTrip((t) => ({ ...t, destination: address, destinationCoords: coords }))
                      }
                    />
                  </div>
                </div>

                {/* Route summary card */}
                <div className="route-summary">
                  <div className="route-summary__header">
                    <span className="route-summary__title">
                      <i className="fa-solid fa-route" /> Route preview
                    </span>
                    {trip.hasRoute && (
                      <span className={`route-summary__badge route-summary__badge--${trip.routeSource === "osrm" ? "live" : "estimate"}`}>
                        {trip.routeSource === "osrm" ? (
                          <><i className="fa-solid fa-signal" /> Live route</>
                        ) : (
                          <><i className="fa-solid fa-compass" /> Estimated</>
                        )}
                      </span>
                    )}
                  </div>

                  <div className="route-summary__points">
                    <div className="route-summary__point route-summary__point--pickup">
                      <span className="route-summary__dot" />
                      <div>
                        <small>PICKUP</small>
                        <strong>{trip.pickup || "Not selected yet"}</strong>
                      </div>
                    </div>
                    <div className="route-summary__connector" aria-hidden="true">
                      <span />
                    </div>
                    <div className="route-summary__point route-summary__point--dest">
                      <span className="route-summary__dot route-summary__dot--dest" />
                      <div>
                        <small>DROP-OFF</small>
                        <strong>{trip.destination || "Not selected yet"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="route-summary__stats">
                    <div className="route-summary__stat">
                      <span className="route-summary__stat-label">
                        <i className="fa-solid fa-road" /> Distance
                      </span>
                      <strong className="route-summary__stat-value">
                        {trip.hasRoute && trip.miles != null ? (
                          <>
                            {trip.miles} <small>mi</small>
                            <span className="route-summary__stat-sub">{trip.distanceKm?.toFixed(1)} km</span>
                          </>
                        ) : "—"}
                      </strong>
                    </div>
                    <div className="route-summary__stat">
                      <span className="route-summary__stat-label">
                        <i className="fa-solid fa-clock" /> Est. travel time
                      </span>
                      <strong className="route-summary__stat-value">
                        {trip.hasRoute && trip.durationMin != null ? (
                          <>
                            {formatDuration(trip.durationMin)}
                          </>
                        ) : "—"}
                      </strong>
                    </div>
                  </div>

                  {trip.hasRoute && (
                    <p className="route-summary__note">
                      <i className="fa-solid fa-circle-info" />
                      Times are estimated based on optimal traffic conditions. Final quote may vary with stops, time of day, and service type.
                    </p>
                  )}
                </div>

                <div className="wizard__actions">
                  <button className="button button--outline" type="button" onClick={() => goto(1, "backward")}>
                    <i className="fa-solid fa-arrow-left" /> Back
                  </button>
                  <button
                    className="button button--gold"
                    type="button"
                    disabled={!step2Valid}
                    onClick={() => goto(3, "forward")}
                    style={{ opacity: step2Valid ? 1 : 0.5 }}
                  >
                    Continue <i className="fa-solid fa-arrow-right" />
                  </button>
                </div>
              </div>

              <div className="map-premium">
                <div className="map-premium__overlay">
                  <span className="map-premium__chip">
                    <i className="fa-solid fa-location-dot" /> San Francisco Bay Area
                  </span>
                  {trip.hasRoute && (
                    <>
                      <span className="map-premium__chip map-premium__chip--muted">
                        <i className="fa-solid fa-road" /> {trip.miles?.toFixed(1)} mi
                      </span>
                      <span className="map-premium__chip map-premium__chip--muted">
                        <i className="fa-solid fa-clock" /> {formatDuration(trip.durationMin || 0)}
                      </span>
                    </>
                  )}
                </div>
                <TripMap
                  pickup={trip.pickupCoords}
                  destination={trip.destinationCoords}
                  onRoute={(info: RouteInfo) => setTrip((t) => ({
                    ...t,
                    distanceKm: info.distanceKm,
                    miles: info.miles,
                    durationMin: info.durationMin,
                    routeSource: info.source,
                    hasRoute: info.hasRoute,
                  }))}
                />
              </div>
            </div>
          )}

          {/* STEP 3 — Ride Preferences */}
          {step === 3 && (
            <div className="form-layout wizard__step-content" style={{ animation: "wizard-slide-in 480ms var(--ease)" }}>
              <div className="form-card">
                <h2>Ride preferences</h2>
                <p className="form-card__intro">Finalize your request. We&apos;ll review availability, vehicle category, and quote before confirming the reservation.</p>

                <div className="form-grid">
                  <div className="field field--full">
                    <label>Service *</label>
                    <div className="service-picker">
                      {serviceList.map((s) => (
                        <button
                          key={s.slug}
                          type="button"
                          className={`service-picker__chip${prefs.serviceType === s.nav ? " is-selected" : ""}`}
                          onClick={() => setPrefs({ ...prefs, serviceType: s.nav })}
                        >
                          <i className={`fa-solid ${s.icon}`} />
                          {s.nav}
                        </button>
                      ))}
                      <button
                        type="button"
                        className={`service-picker__chip${prefs.serviceType === "Other" ? " is-selected" : ""}`}
                        onClick={() => setPrefs({ ...prefs, serviceType: "Other" })}
                      >
                        <i className="fa-solid fa-asterisk" />
                        Other / custom
                      </button>
                    </div>
                  </div>

                  <div className="field field--full">
                    <label>Vehicle</label>
                    <div className="vehicle-picker">
                      <button
                        type="button"
                        className={`vehicle-picker__option${prefs.vehicle === "" ? " is-selected" : ""}`}
                        onClick={() => setPrefs({ ...prefs, vehicle: "" })}
                      >
                        <span className="vehicle-picker__check"><i className="fa-solid fa-check" /></span>
                        <strong>Recommend</strong>
                        <small>Best fit auto-selected</small>
                      </button>
                      {fleet.map((v) => (
                        <button
                          key={v.name}
                          type="button"
                          className={`vehicle-picker__option${prefs.vehicle === v.name ? " is-selected" : ""}`}
                          onClick={() => setPrefs({ ...prefs, vehicle: v.name })}
                        >
                          <span className="vehicle-picker__check"><i className="fa-solid fa-check" /></span>
                          <strong>{v.name}</strong>
                          <small>{v.passengers}</small>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="field field--premium">
                    <label htmlFor="pickup_date_display">Pickup date *</label>
                    <input
                      id="pickup_date_display"
                      type="date"
                      min={todayIso}
                      value={prefs.pickupDateDisplay}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPrefs({ ...prefs, pickupDateDisplay: val, pickupDate: val });
                      }}
                      required
                    />
                  </div>
                  <div className="field field--premium">
                    <label htmlFor="pickup_time">Pickup time *</label>
                    <input
                      id="pickup_time"
                      type="time"
                      value={pickupTimeIso}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) {
                          setPrefs({ ...prefs, pickupHour: "", pickupMinute: "", pickupPeriod: "" });
                          return;
                        }
                        const [h, m] = val.split(":").map(Number);
                        const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
                        const hour12 = h % 12 === 0 ? 12 : h % 12;
                        setPrefs({
                          ...prefs,
                          pickupHour: String(hour12),
                          pickupMinute: String(m),
                          pickupPeriod: period,
                        });
                      }}
                      required
                    />
                    <small className="field-hint">San Francisco local time (PT)</small>
                  </div>

                  <div className="field field--premium">
                    <label htmlFor="passengers">Passengers *</label>
                    <input
                      id="passengers"
                      type="number"
                      min={1}
                      max={60}
                      value={prefs.passengers}
                      onChange={(e) => setPrefs({ ...prefs, passengers: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="field field--premium">
                    <label htmlFor="luggage">Luggage count</label>
                    <input
                      id="luggage"
                      type="number"
                      min={0}
                      max={80}
                      value={prefs.luggage}
                      onChange={(e) => setPrefs({ ...prefs, luggage: Number(e.target.value) })}
                    />
                  </div>

                  <div className="field field--premium">
                    <label htmlFor="flight_number">Flight number</label>
                    <input
                      id="flight_number"
                      type="text"
                      maxLength={30}
                      placeholder="If applicable"
                      value={prefs.flightNumber}
                      onChange={(e) => setPrefs({ ...prefs, flightNumber: e.target.value })}
                    />
                  </div>
                  <div className="field field--premium">
                    <label htmlFor="hours">Estimated hours</label>
                    <input
                      id="hours"
                      type="number"
                      min={1}
                      max={24}
                      placeholder="For hourly service"
                      value={prefs.hours}
                      onChange={(e) => setPrefs({ ...prefs, hours: e.target.value })}
                    />
                  </div>

                  <div className="field field--full field--premium">
                    <label htmlFor="coupon_code">Discount coupon</label>
                    <input
                      id="coupon_code"
                      type="text"
                      maxLength={40}
                      autoComplete="off"
                      placeholder="Enter your coupon code, if applicable"
                      value={prefs.couponCode}
                      onChange={(e) => setPrefs({ ...prefs, couponCode: e.target.value })}
                    />
                  </div>

                  <div className="field field--full field--premium">
                    <label htmlFor="notes">Itinerary and special requests</label>
                    <textarea
                      id="notes"
                      maxLength={2000}
                      placeholder="Stops, timing, child seating request, accessibility details, occasion, or anything else we should consider"
                      value={prefs.notes}
                      onChange={(e) => setPrefs({ ...prefs, notes: e.target.value })}
                    />
                  </div>

                  <label className="checkbox-field" style={{ gridColumn: "1 / -1" }}>
                    <input
                      type="checkbox"
                      checked={prefs.consent}
                      onChange={(e) => setPrefs({ ...prefs, consent: e.target.checked })}
                      required
                    />
                    <span>I agree that All Black Limo SF may use these details to respond to my transportation request. This form is a request, not an instant booking confirmation.</span>
                  </label>
                </div>

                <div className="wizard__actions">
                  <button className="button button--outline" type="button" onClick={() => goto(2, "backward")}>
                    <i className="fa-solid fa-arrow-left" /> Back
                  </button>
                  <button
                    className="button button--gold"
                    type="button"
                    disabled={!step3Valid || status === "submitting"}
                    onClick={handleSubmit}
                    style={{ opacity: step3Valid ? 1 : 0.6 }}
                  >
                    {status === "submitting" ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        Request Your Ride <i className="fa-solid fa-arrow-right" />
                      </>
                    )}
                  </button>
                </div>
                <small style={{ color: "var(--muted)", marginTop: 8, display: "block" }}>
                  Do not send payment card details through this form.
                </small>
              </div>

              <aside className="wizard__summary">
                <h3>Trip summary</h3>
                <dl>
                  <dt>Passenger</dt>
                  <dd>
                    {passenger.firstName || passenger.lastName
                      ? `${passenger.firstName} ${passenger.lastName}`.trim()
                      : "—"}
                  </dd>
                  <dt>Service</dt>
                  <dd>{prefs.serviceType || "—"}</dd>
                  <dt>Vehicle</dt>
                  <dd>{prefs.vehicle || "Recommend the best fit"}</dd>
                  <dt>Pickup</dt>
                  <dd>{prefs.pickupDateDisplay || "—"}{pickupTimeIso ? ` · ${pickupTimeIso}` : ""}</dd>
                  <dt>From</dt>
                  <dd style={{ wordBreak: "break-word" }}>{trip.pickup || "—"}</dd>
                  <dt>To</dt>
                  <dd style={{ wordBreak: "break-word" }}>{trip.destination || "—"}</dd>
                  <dt>Distance</dt>
                  <dd>{trip.hasRoute && trip.miles != null ? `${trip.miles} mi (${trip.distanceKm?.toFixed(1)} km)` : "—"}</dd>
                  <dt>Est. travel time</dt>
                  <dd>{trip.hasRoute && trip.durationMin != null ? formatDuration(trip.durationMin) : "—"}</dd>
                  <dt>Passengers</dt>
                  <dd>{prefs.passengers}</dd>
                  <dt>Luggage</dt>
                  <dd>{prefs.luggage}</dd>
                </dl>
                <Link
                  className="text-link"
                  href={`tel:${site.phoneHref}`}
                  style={{ marginTop: 10, display: "inline-flex" }}
                >
                  <i className="fa-solid fa-phone" /> {site.phoneDisplay}
                </Link>
              </aside>
            </div>
          )}
        </div>
      </div>

      <BookingNoticeModal open={noticeOpen} onClose={() => setNoticeOpen(false)} />
    </>
  );
}

function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = Math.round(min - h * 60);
  return `${h}h ${m}m`;
}

function getPtOffsetMinutes(date: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false, timeZoneName: "short",
  });
  const parts = dtf.formatToParts(date);
  const tzName = parts.find((p) => p.type === "timeZoneName")?.value || "";
  return tzName.includes("PDT") ? -7 * 60 : -8 * 60;
}
