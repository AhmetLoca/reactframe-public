"use client";

import * as React from "react";

const GA_ID = "G-LC1BS2SMJG";
const STORAGE_KEY = "reactframe-cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function load() {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // gtag.js reads the `arguments` object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

// Google Analytics loads only after the visitor accepts cookies in <CookieConsent />, either on an
// earlier visit (stored choice) or right now (its consent event). Page views on client-side
// navigation come from GA4's enhanced measurement (browser history changes).
export function GoogleAnalytics() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (localStorage.getItem(STORAGE_KEY) === "accepted") load();
    const onConsent = (e: Event) => {
      if ((e as CustomEvent).detail === "accepted") load();
    };
    window.addEventListener("reactframe-cookie-consent", onConsent);
    return () => window.removeEventListener("reactframe-cookie-consent", onConsent);
  }, []);
  return null;
}
