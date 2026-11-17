"use client";

import { useState, useRef, useEffect } from "react";

type DatePickerProps = {
  id: string;
  value: string; // "" or "yyyy-mm-dd"
  min: string; // "yyyy-mm-dd" (today)
  onChange: (iso: string) => void;
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseIso(iso: string): { y: number; m: number; d: number } | null {
  const parts = iso.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  return { y: parts[0], m: parts[1], d: parts[2] };
}

function toIso(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function formatDisplay(iso: string): string {
  const p = parseIso(iso);
  if (!p) return "";
  return new Date(p.y, p.m - 1, p.d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function monthLabel(y: number, m: number): string {
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function DatePicker({ id, value, min, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(0);
  const [viewMonth, setViewMonth] = useState(0);
  // Draft day picked inside the panel; only applied on Save (same pattern as TimePicker).
  const [draft, setDraft] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  const hasValue = value !== "";
  const display = hasValue ? formatDisplay(value) : "Select date";

  const minParsed = parseIso(min);
  const minYear = minParsed?.y ?? new Date().getFullYear();
  const minMonth = minParsed?.m ?? new Date().getMonth() + 1;

  function openPicker() {
    // Start the draft from the current value (or today when nothing is set).
    const base = parseIso(value) || parseIso(min) || { y: minYear, m: minMonth, d: 1 };
    setDraft(value && value >= min ? value : min);
    setViewYear(base.y);
    setViewMonth(base.m);
    setOpen(true);
  }

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

  function shiftMonth(delta: number) {
    let y = viewYear;
    let m = viewMonth + delta;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    // Never go before the current month (past dates are disabled anyway).
    if (y < minYear || (y === minYear && m < minMonth)) return;
    setViewYear(y);
    setViewMonth(m);
  }

  const atMinMonth = viewYear === minYear && viewMonth === minMonth;
  const firstWeekday = new Date(viewYear, viewMonth - 1, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const cells: Array<{ day: number; iso: string } | null> = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, iso: toIso(viewYear, viewMonth, d) });

  function save() {
    if (draft) onChange(draft);
    setOpen(false);
  }

  function goToday() {
    setDraft(min);
    setViewYear(minYear);
    setViewMonth(minMonth);
  }

  return (
    <div className="date-picker" ref={boxRef}>
      <button
        id={id}
        type="button"
        className="date-picker__field"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openPicker())}
      >
        <span className={hasValue ? "date-picker__value" : "date-picker__placeholder"}>{display}</span>
        <i className="fa-regular fa-calendar" aria-hidden="true" />
      </button>
      {open && (
        <div className="date-picker__panel" role="dialog" aria-label="Pickup date">
          <div className="date-picker__header">
            <span>{monthLabel(viewYear, viewMonth)}</span>
            <div className="date-picker__nav" role="group" aria-label="Change month">
              <button
                type="button"
                aria-label="Previous month"
                disabled={atMinMonth}
                onClick={() => shiftMonth(-1)}
              >
                <i className="fa-solid fa-chevron-left" aria-hidden="true" />
              </button>
              <button type="button" aria-label="Next month" onClick={() => shiftMonth(1)}>
                <i className="fa-solid fa-chevron-right" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="date-picker__weekdays" aria-hidden="true">
            {WEEKDAYS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
          <div className="date-picker__grid">
            {cells.map((c, i) =>
              c === null ? (
                <span key={`blank-${i}`} className="date-picker__blank" />
              ) : (
                <button
                  key={c.iso}
                  type="button"
                  disabled={c.iso < min}
                  data-today={c.iso === min}
                  className={[
                    c.iso === draft ? "is-selected" : "",
                    c.iso === min ? "is-today" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setDraft(c.iso)}
                >
                  {c.day}
                </button>
              ),
            )}
          </div>
          <div className="date-picker__footer">
            <button type="button" className="date-picker__today" onClick={goToday}>
              Today
            </button>
            <button type="button" className="date-picker__save" onClick={save}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
