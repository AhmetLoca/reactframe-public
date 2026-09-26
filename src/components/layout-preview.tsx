"use client";

import * as React from "react";
import { FileCode2, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeSurface } from "@/components/code-block";
import { CodeTab, DEVICES, DeviceIcon, type ComponentCode, type Device } from "@/components/component-preview";
import { InstallCommand } from "@/components/install-command";
import { PageUsage, getPagePackages } from "@/components/page-usage";
import { cn } from "@/lib/utils";
import { isCheckoutLive, pageCheckoutLinks } from "@/lib/checkout-links";
import { BuyButton } from "@/components/buy-button";

// A full template/page is naturally much taller than any single component
// preview, so — unlike DeviceFramePreview, which grows to fit content up
// to a cap — this always renders at a fixed "browser window" height and
// lets the iframe scroll internally. That reads as a device canvas you're
// looking *into*, not a page that keeps growing underneath the tabs.
const FRAME_HEIGHT = 820;

// Placeholder shown blurred behind the "coming soon" notice on the Code
// tab — never real source, just enough shape to read as code.
const CODE_PLACEHOLDER = `export default function Page() {
  return (
    <>
      <AnnouncementBanner />
      <AnimatedStats />
      <FeatureShowcase />
      {/* ...composed from ReactFrame components */}
    </>
  );
}
`;

function DeviceFrame({ slug, basePath, width }: { slug: string; basePath: string; width: string }) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  // Shared between the two effects below (IntersectionObserver + the
  // window wheel listener need to read/write the same flag, and a ref is
  // how that stays in sync without re-subscribing either listener on
  // every render).
  const lockedRef = React.useRef(false);

  // The iframe reports back once it can't consume wheel input itself
  // (already at its own top/bottom edge) — see PreviewViewFrame. That
  // leftover is what actually resumes the outer page's own scroll. It
  // also means the frame no longer has anything left to give in that
  // direction, so release the lock below — otherwise the very next tick
  // would route into the iframe again, bounce right back as another 100%
  // overflow, and so on, just adding a wasted round-trip per tick instead
  // of scrolling.
  React.useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === "loca-preview-wheel" && e.data.slug === slug) {
        lockedRef.current = false;
        window.scrollBy({ top: e.data.deltaY });
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [slug]);

  // Relying on the cursor sitting precisely over the iframe box falls
  // apart in practice — decouple capture from cursor position instead:
  // once the frame crosses into being the dominant thing in the
  // viewport, lock onto it and intercept wheel input at the window level
  // (capture phase) regardless of where the cursor is, handing it into
  // the iframe via postMessage until the message handler above releases
  // the lock.
  //
  // The lock only engages on a genuine crossing into the dominant band
  // (ratio was below 0.6, now at/above it) — not on every observer
  // callback while already there. Forwarding a tick that overflows moves
  // the outer page (to apply the leftover), which re-fires the observer
  // at essentially the same ratio; re-locking on that non-crossing
  // recompute would immediately try to route the next tick into an
  // already-exhausted iframe again, stalling scroll just past the frame
  // instead of continuing through it.
  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let lastRatio = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6 && lastRatio < 0.6) lockedRef.current = true;
        lastRatio = entry.intersectionRatio;
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    );
    io.observe(wrapper);

    const onWheel = (e: WheelEvent) => {
      if (!lockedRef.current) return;
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      win.postMessage({ type: "loca-preview-scroll-into", slug, deltaY: e.deltaY }, "*");
    };
    window.addEventListener("wheel", onWheel, { capture: true, passive: false });

    return () => {
      io.disconnect();
      window.removeEventListener("wheel", onWheel, { capture: true });
    };
  }, [slug]);

  return (
    <div
      ref={wrapperRef}
      className="relative mx-auto overflow-hidden rounded-xl border border-border bg-card transition-[width] duration-300 ease-signature"
      style={{ width, maxWidth: "100%", height: FRAME_HEIGHT }}
    >
      <iframe ref={iframeRef} src={`${basePath}/${slug}/view`} title={`${slug} preview`} className="block h-full w-full border-none" />
    </div>
  );
}

export function LayoutPreview({
  slug,
  basePath,
  kind = "template",
  code,
}: {
  slug: string;
  basePath: string;
  /** Used only in the Code tab's "coming soon" copy. */
  kind?: "template" | "page";
  /** Real source for the Code tab. Without it the tab shows the "coming soon" notice. */
  code?: ComponentCode | null;
}) {
  const [device, setDevice] = React.useState<Device>("desktop");
  // Only Pro pages have an entry; their `code` arrives as null (see getPageCode).
  const checkout = kind === "page" ? pageCheckoutLinks[slug] : undefined;

  return (
    <Tabs defaultValue="preview" className="w-full gap-4">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>

      <TabsContent value="preview">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
          {(Object.keys(DEVICES) as Device[]).map((key) => (
            <button
              key={key}
              onClick={() => setDevice(key)}
              aria-pressed={device === key}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                device === key
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:border-foreground/30",
              )}
            >
              <DeviceIcon device={key} />
              {DEVICES[key].label}
            </button>
          ))}
          </div>
          {checkout && (
            <BuyButton checkout={checkout} />
          )}
        </div>

        <div
          className="overflow-x-auto"
          style={
            device === "desktop"
              ? undefined
              : { backgroundImage: "radial-gradient(rgb(from var(--foreground) r g b / 0.12) 1px, transparent 1px)", backgroundSize: "12px 12px" }
          }
        >
          <DeviceFrame slug={slug} basePath={basePath} width={DEVICES[device].width} />
        </div>
      </TabsContent>

      <TabsContent value="code">
        {code ? (
          <>
            {kind === "page" && (
              <>
                {getPagePackages(code.tsTailwind).length > 0 && (
                  <div className="mb-4">
                    <InstallCommand slug={slug} free packages={getPagePackages(code.tsTailwind)} />
                  </div>
                )}
                <div className="mb-4">
                  <PageUsage slug={slug} source={code.tsTailwind} />
                </div>
              </>
            )}
            <CodeTab slug={slug} code={code} />
          </>
        ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="px-4 py-3">
            <span className="text-sm font-semibold text-foreground">Code</span>
          </div>
          <div className="relative">
            <div aria-hidden className="pointer-events-none opacity-40 blur-sm select-none">
              <CodeSurface code={CODE_PLACEHOLDER} bare />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/60 px-6 text-center backdrop-blur-[2px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
                {checkout ? <Lock className="h-4 w-4" /> : <FileCode2 className="h-4 w-4" />}
              </div>
              {checkout ? (
                <>
                  <p className="max-w-xs text-sm text-foreground/70">
                    {isCheckoutLive(checkout) ? "This page's source code is available as a one-time purchase." : "This page's source code will be available as a one-time purchase soon."}
                  </p>
                  <BuyButton checkout={checkout} size="sm" className="py-2" />
                </>
              ) : (
                <p className="max-w-xs text-sm text-foreground/70">
                  The full source for this
                  {" "}
                  {kind}
                  {" "}
                  is coming soon, for now, browse the components it&apos;s built from.
                </p>
              )}
            </div>
          </div>
        </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
