import type { Page } from "playwright-core";

export interface Pt {
  x: number;
  y: number;
}

export interface FrameCtx {
  /** Frame index, 0-based. */
  f: number;
  /** Time in seconds. */
  t: number;
  fps: number;
  page: Page;
  /** True on the single frame closest to `seconds`. */
  at: (seconds: number) => boolean;
}

export interface Scene {
  viewport: { width: number; height: number };
  /** Clip length in seconds. */
  duration: number;
  /** Runs once per frame, before the frame is captured. Move the mouse, click, type. */
  frame: (ctx: FrameCtx) => Promise<void> | void;
  /**
   * For components that never come back to their first frame (shaders, free-running loops): record
   * this many extra seconds and crossfade them over the start, so the clip loops without a seam.
   * Keep the cursor hidden in the first and last `loopBlend` seconds, or it ghosts.
   */
  loopBlend?: number;
  /** Route to record instead of /preview/video/<slug>, e.g. "/pages/preview/about-us/view". */
  url?: string;
}

export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Cursor position at time `t` along keyframes [[seconds, point], ...]. Returns
 * null before the first keyframe (cursor still hidden, so the clip starts on
 * the same frame as the static thumbnail) and holds the last point after it.
 */
export function path(t: number, keys: [number, Pt][]): Pt | null {
  if (t < keys[0][0]) return null;
  for (let i = 1; i < keys.length; i++) {
    const [t0, p0] = keys[i - 1];
    const [t1, p1] = keys[i];
    if (t <= t1) {
      const k = ease((t - t0) / (t1 - t0));
      return { x: lerp(p0.x, p1.x, k), y: lerp(p0.y, p1.y, k) };
    }
  }
  return keys[keys.length - 1][1];
}

export function defineScene(scene: Scene): Scene {
  return scene;
}

/**
 * Motion starts its hardware-accelerated (WAAPI) animations with a startTime
 * taken from the faked performance.now(), while document.timeline keeps real
 * time, so they sit at a negative currentTime and never visibly progress while
 * recording. Call once per frame: every animation is paused and stepped by
 * exactly one frame, and finished once it reaches its end so motion's
 * completion handlers still run.
 */
export async function stepWebAnimations(page: Page, fps: number) {
  await page.evaluate((dt) => {
    for (const a of document.getAnimations()) {
      if (a.playState === "finished") continue;
      // Scroll- and view-driven animations run on their scroll timeline, not on time; leave them.
      if (a.timeline && !(a.timeline instanceof DocumentTimeline)) continue;
      const end = Number(a.effect?.getComputedTiming().endTime ?? 0);
      const next = Math.max(0, Number(a.currentTime ?? 0)) + dt;
      if (a.playState !== "paused") a.pause();
      if (next >= end) a.finish();
      else a.currentTime = next;
    }
  }, 1000 / fps);
}

/**
 * Chrome drops mousemove events once the pointer leaves the viewport, so the
 * Stage's fake cursor would freeze at the edge. Call after the exit path to
 * park it off-screen, so the last frame matches the cursor-free first frame.
 */
export async function hideCursor(page: Page) {
  await page.evaluate(() => window.dispatchEvent(new MouseEvent("mousemove", { clientX: -100, clientY: -100 })));
}

/**
 * Pans the stage's `#video-camera` element vertically, for scenes whose
 * popover would otherwise fall off the bottom of the frame. Returning to 0
 * before the end keeps the last frame identical to the static thumbnail.
 */
export async function panCamera(page: Page, y: number) {
  await page.evaluate((dy) => {
    const el = document.getElementById("video-camera");
    if (el) el.style.translate = `0 ${dy}px`;
  }, y);
}
