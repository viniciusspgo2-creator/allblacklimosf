"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site-data";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function BookingNoticeModal({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.classList.add("booking-notice-open");
      dialogRef.current?.focus();
    } else {
      document.body.classList.remove("booking-notice-open");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="booking-notice-modal is-visible"
      id="booking_notice"
      aria-hidden="false"
      style={{ display: "grid" }}
    >
      <div
        className="booking-notice-modal__backdrop"
        data-booking-notice-close
        onClick={onClose}
      />
      <div
        className="booking-notice-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking_notice_title"
        aria-describedby="booking_notice_text"
        tabIndex={-1}
        ref={dialogRef}
      >
        <button
          className="booking-notice-modal__close"
          type="button"
          aria-label="Close notice"
          data-booking-notice-close
          onClick={onClose}
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
        <div className="booking-notice-modal__icon" aria-hidden="true">
          <i className="fa-regular fa-clock" />
        </div>
        <span className="eyebrow">Reservation timing</span>
        <h2 id="booking_notice_title">Advance notice required</h2>
        <p id="booking_notice_text">
          Online reservations must be made at least 12 hours in advance.<br /><br />
          For transportation needed within the next 12 hours, please call us directly to check availability and make your reservation.<br /><br />
          {site.phoneDisplay}
        </p>
        <div className="booking-notice-modal__contacts" aria-label="Contact options">
          <a className="booking-notice-modal__contact" href={`mailto:${site.email}`}>
            <i className="fa-solid fa-envelope" aria-hidden="true" />
            {site.email}
          </a>
          <a className="booking-notice-modal__contact" href={`tel:${site.phoneHref}`}>
            <i className="fa-solid fa-phone" aria-hidden="true" />
            {site.phoneDisplay}
          </a>
        </div>
        <div className="booking-notice-modal__actions">
          <button className="button button--outline" type="button" data-booking-notice-close onClick={onClose}>
            Choose another time
          </button>
          <a className="button button--gold" href={`tel:${site.phoneHref}`}>
            Call for an urgent ride <i className="fa-solid fa-phone" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
