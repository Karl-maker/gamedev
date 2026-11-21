"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { consentKey } from "@/components/analytics/analytics";

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(!localStorage.getItem(consentKey)), 0);
    const showChoices = () => setOpen(true);
    window.addEventListener("privacy-choices-open", showChoices);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("privacy-choices-open", showChoices);
    };
  }, []);

  function save(analytics: boolean) {
    localStorage.setItem(consentKey, JSON.stringify({ necessary: true, analytics, savedAt: new Date().toISOString() }));
    window.dispatchEvent(new Event("consent-updated"));
    setOpen(false);
  }

  if (!open) return null;
  return (
    <section className="cookie-banner" role="region" aria-live="polite" aria-labelledby="cookie-title">
      <div>
        <strong id="cookie-title">Your privacy, your choice</strong>
        <p>We use essential storage for site preferences. Optional analytics helps us improve the site and only loads with your permission.</p>
        <Link href="/cookies">Cookie details</Link>
      </div>
      <div className="cookie-actions">
        <button className="button button-ghost" onClick={() => save(false)}>Essential only</button>
        <button className="button button-primary" onClick={() => save(true)}>Allow analytics</button>
      </div>
    </section>
  );
}
