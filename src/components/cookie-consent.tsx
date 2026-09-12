"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname } from "next/navigation";
import { isChromelessPath } from "@/components/site-chrome";

const STORAGE_KEY = "reactframe-cookie-consent";
const SHOW_DELAY_MS = 1800;

export function CookieConsent() {
  const pathname = usePathname();
  const chromeless = isChromelessPath(pathname);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (chromeless) return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const id = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(id);
  }, [chromeless]);

  function decide(value: "accepted" | "rejected") {
    localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new CustomEvent("reactframe-cookie-consent", { detail: value }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed right-6 bottom-6 left-6 z-100 origin-bottom-right sm:left-auto sm:max-w-sm">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <p className="text-base font-semibold tracking-tight">Cookie preferences</p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/60">
          We use cookies to keep the site running smoothly and understand how it&rsquo;s used. Read our{" "}
          <Link href="/cookies" className="text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground">
            Cookie Policy
          </Link>
          .
        </p>

        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="flex-1 rounded-full bg-foreground/[0.06] px-4 py-2.5 text-sm font-medium text-foreground/70 transition-colors duration-300 ease-signature hover:bg-foreground/10 hover:text-foreground"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity duration-300 ease-signature hover:opacity-80"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
