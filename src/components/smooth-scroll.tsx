"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

// Lenis virtualizes scroll position itself, so Next.js's default
// scroll-to-top-on-navigation never reaches it — without this, a new
// page opens at whatever scroll offset the previous page was left at.
function ResetScrollOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        anchors: true,
      }}
    >
      <ResetScrollOnNavigate />
      {children}
    </ReactLenis>
  );
}
