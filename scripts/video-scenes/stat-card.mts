import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const reset = (page: import("playwright-core").Page) => page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());

// Scrub across the sparkline (crosshair follows the points), leave, then replay the entrance: the
// value counts up and the line draws in again.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.6,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 230, y: 470 }],
      [0.6, { x: 268, y: 368 }],
      [1.8, { x: 532, y: 355 }],
      [2.1, { x: 532, y: 355 }],
      [2.5, { x: 640, y: 470 }],
      [2.8, { x: 740, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(2.85)) await hideCursor(page);
    if (at(3.0)) await reset(page);
  },
});
