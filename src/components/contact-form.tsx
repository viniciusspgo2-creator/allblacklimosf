"use client";

import { useState } from "react";
import { site } from "@/lib/site-data";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "invalid" | "error">("idle");
  const [submittedAt, setSubmittedAt] = useState<number>(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot
    if (String(fd.get("website") || "")) {
      setStatus("invalid");
      return;
    }

    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      subject: fd.get("subject"),
      message: fd.get("message"),
      consent: fd.get("consent") ? "1" : "",
      website: fd.get("website") || "",
      submitted_at: submittedAt || Math.floor(Date.now() / 1000),
    };

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.status === "success") {
        setStatus("success");
        form.reset();
      } else {
        setStatus(data.status === "invalid" ? "invalid" : "error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="form-card" data-reveal>
      <h2>Send a message</h2>
      <p className="form-card__intro">
        For a detailed ride request, use the reservation form so we receive the complete itinerary.
      </p>

      {status === "success" && (
        <div className="alert alert--success" role="status">
          <i className="fa-solid fa-circle-check" /> Your message was received. We&apos;ll respond using the contact details provided.
        </div>
      )}
      {status === "invalid" && (
        <div className="alert alert--error" role="alert">
          <i className="fa-solid fa-circle-exclamation" /> Please complete the required fields and try again.
        </div>
      )}
      {status === "error" && (
        <div className="alert alert--error" role="alert">
          <i className="fa-solid fa-circle-exclamation" /> We could not send your message. Please call us directly.
        </div>
      )}

      <form className="form-grid" onSubmit={handleSubmit} data-submit-form>
        <input type="hidden" name="submitted_at" value={submittedAt} />
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="contact_website">Website</label>
          <input id="contact_website" type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="field">
          <label htmlFor="contact_name">Name *</label>
          <input id="contact_name" type="text" name="name" maxLength={120} autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="contact_email">Email *</label>
          <input id="contact_email" type="email" name="email" maxLength={160} autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="contact_phone">Phone</label>
          <input id="contact_phone" type="tel" name="phone" maxLength={40} autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor="contact_subject">Topic *</label>
          <select id="contact_subject" name="subject" required defaultValue="">
            <option value="">Select a topic</option>
            <option>Ride or quote question</option>
            <option>Corporate transportation</option>
            <option>Event or group planning</option>
            <option>Fleet question</option>
            <option>Other</option>
          </select>
        </div>
        <div className="field field--full">
          <label htmlFor="contact_message">Message *</label>
          <textarea id="contact_message" name="message" maxLength={2000} required />
        </div>
        <label className="checkbox-field">
          <input type="checkbox" name="consent" value="1" required />
          <span>I agree that these details may be used to respond to my inquiry.</span>
        </label>
        <div className="form-actions">
          <small>For urgent or same-day transportation, call directly.</small>
          <button className="button button--gold" type="submit" disabled={status === "submitting"}>
            Send message <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
        <p className="field-hint" aria-hidden="true">
          Need urgent help? Call <a href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>.
        </p>
      </form>
    </div>
  );
}
