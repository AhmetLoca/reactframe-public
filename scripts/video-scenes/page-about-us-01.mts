import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Scroll down through the timeline and team, then back to the top.
export default defineScene({
  url: "/pages/preview/about-us-01/view",
  viewport: { width: 1280, height: 960 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const s = path(t, [[0.0, { x: 0, y: 0 }], [1.2, { x: 0, y: 0 }], [3.0, { x: 0, y: 135 }], [4.2, { x: 0, y: 135 }], [5.8, { x: 0, y: 0 }]]);
    if (s) await page.evaluate((y) => window.scrollTo(0, y), s.y);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 640, y: 300 }],
      [1.2, { x: 642, y: 301 }],
      [1.9, { x: 900, y: 700 }],
      [2.2, { x: 902, y: 701 }],
      [2.9, { x: 1200, y: 945 }],
      [3.2, { x: 1320, y: 1040 }],
    ]);
    if (p && t <= 3.2) await page.mouse.move(p.x, p.y);
    if (t > 3.2 && t < 3.26) await hideCursor(page);
  },
});
