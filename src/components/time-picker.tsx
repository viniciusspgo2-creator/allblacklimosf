"use client";

import { useState, useRef, useEffect } from "react";

type TimePickerProps = {
  id: string;
  hour: string; // "" or "1".."12"
  minute: string; // "" or "0".."59"
  period: "AM" | "PM" | "";
  onChange: (hour: string, minute: string, period: "AM" | "PM") => void;
};

const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
const HOURS_12 = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const HOURS_24 = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

function to24(hour12: number, period: "AM" | "PM"): number {
  return period === "PM" ? (hour12 % 12) + 12 : hour12 % 12;
}

function from24(hour24: number): { hour12: number; period: "AM" | "PM" } {
  const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour12, period };
}

function snapMinute(m: number): number {
  return Math.round(m / 5) * 5 % 60;
}

export function TimePicker({ id, hour, minute, period, onChange }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"12h" | "24h">("12h");
  // Draft values edited inside the panel; only applied on Save.
  const [draftHour, setDraftHour] = useState(12);
  const [draftMinute, setDraftMinute] = useState(0);
  const [draftPeriod, setDraftPeriod] = useState<"AM" | "PM">("PM");
  const boxRef = useRef<HTMLDivElement>(null);
  const hourColRef = useRef<HTMLDivElement>(null);
  const minuteColRef = useRef<HTMLDivElement>(null);

  const hasValue = hour !== "" && minute !== "" && period !== "";
  const display = hasValue
    ? `${hour.padStart(2, "0")}:${minute.padStart(2, "0")} ${period}`
    : "Select time";

  function openPicker() {
    // Start the draft from the current value (or noon when nothing is set).
    const h = hour ? Number(hour) : 12;
    const m = minute !== "" ? snapMinute(Number(minute)) : 0;
    const p: "AM" | "PM" = period === "AM" || period === "PM" ? period : "PM";
    setDraftHour(h);
    setDraftMinute(m);
    setDraftPeriod(p);
    setOpen(true);
  }

  // Scroll the selected values into view when the panel opens.
  useEffect(() => {
    if (!open) return;
    const scrollToSelected = (col: HTMLDivElement | null) => {
      const el = col?.querySelector<HTMLElement>("[data-selected='true']");
      el?.scrollIntoView({ block: "center" });
    };
    // Wait a tick so the panel is laid out.
    const t = setTimeout(() => {
      scrollToSelected(hourColRef.current);
      scrollToSelected(minuteColRef.current);
    }, 0);
    return () => clearTimeout(t);
  }, [open, mode]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const selectedHour24 = to24(draftHour, draftPeriod);
  const hourOptions = mode === "12h" ? HOURS_12 : HOURS_24;

  function hourIsSelected(h: string): boolean {
    return mode === "12h" ? Number(h) === draftHour : Number(h) === selectedHour24;
  }

  function pickHour(h: string) {
    if (mode === "12h") {
      setDraftHour(Number(h));
    } else {
      const { hour12, period } = from24(Number(h));
      setDraftHour(hour12);
      setDraftPeriod(period);
    }
  }

  function save() {
    onChange(String(draftHour), String(draftMinute).padStart(2, "0"), draftPeriod);
    setOpen(false);
  }

  return (
    <div className="time-picker" ref={boxRef}>
      <button
        id={id}
        type="button"
        className="time-picker__field"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openPicker())}
      >
        <span className={hasValue ? "time-picker__value" : "time-picker__placeholder"}>{display}</span>
        <i className="fa-regular fa-clock" aria-hidden="true" />
      </button>
      {open && (
        <div className="time-picker__panel" role="dialog" aria-label="Pickup time">
          <div className="time-picker__header">
            <span>Pickup Time</span>
            <div className="time-picker__mode" role="group" aria-label="Time format">
              <button
                type="button"
                className={mode === "24h" ? "is-active" : ""}
                onClick={() => setMode("24h")}
              >
                24h
              </button>
              <button
                type="button"
                className={mode === "12h" ? "is-active" : ""}
                onClick={() => setMode("12h")}
              >
                12h
              </button>
            </div>
          </div>
          <div className="time-picker__columns">
            <div className="time-picker__column" ref={hourColRef} aria-label="Hour">
              {hourOptions.map((h) => (
                <button
                  key={h}
                  type="button"
                  data-selected={hourIsSelected(h)}
                  className={hourIsSelected(h) ? "is-selected" : ""}
                  onClick={() => pickHour(h)}
                >
                  {h}
                </button>
              ))}
            </div>
            <div className="time-picker__column" ref={minuteColRef} aria-label="Minute">
              {MINUTES.map((m) => (
                <button
                  key={m}
                  type="button"
                  data-selected={Number(m) === draftMinute}
                  className={Number(m) === draftMinute ? "is-selected" : ""}
                  onClick={() => setDraftMinute(Number(m))}
                >
                  {m}
                </button>
              ))}
            </div>
            {mode === "12h" && (
              <div className="time-picker__column time-picker__column--period" aria-label="AM or PM">
                {(["AM", "PM"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    data-selected={p === draftPeriod}
                    className={p === draftPeriod ? "is-selected" : ""}
                    onClick={() => setDraftPeriod(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button type="button" className="time-picker__save" onClick={save}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}
