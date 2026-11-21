"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export type Consent = { necessary: true; analytics: boolean };
export const consentKey = "privacy-consent-v1";

export function Analytics() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const sync = () => {
      try {
        const consent = JSON.parse(localStorage.getItem(consentKey) ?? "{}") as Partial<Consent>;
        setAllowed(consent.analytics === true && navigator.doNotTrack !== "1");
      } catch {
        setAllowed(false);
      }
    };
    sync();
    window.addEventListener("consent-updated", sync);
    return () => window.removeEventListener("consent-updated", sync);
  }, []);

  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!allowed || !websiteId) return null;
  return (
    <Script
      src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "https://cloud.umami.is/script.js"}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}

export function trackEvent(name: string, data?: Record<string, string>) {
  const umami = (window as Window & { umami?: { track: (name: string, data?: Record<string, string>) => void } }).umami;
  umami?.track(name, data);
}
