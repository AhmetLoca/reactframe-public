import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Scroll down through the sections (the sticky sidebar tracks the one in view), then back to the top.
export default defineScene({
  url: "/pages/preview/terms-of-service/view",
  viewport: { width: 1280, height: 960 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const s = path(t, [[0.0, { x: 0, y: 0 }], [1.0, { x: 0, y: 0 }], [2.6, { x: 0, y: 760 }], [3.4, { x: 0, y: 760 }], [4.8, { x: 0, y: 0 }]]);
    if (s) await page.evaluate((y) => window.scrollTo(0, y), s.y);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 126, y: 242 }],
      [4.4, { x: 128, y: 244 }],
      [5.0, { x: 1200, y: 945 }],
      [5.3, { x: 1320, y: 1040 }],
    ]);
    if (p && t <= 5.3) await page.mouse.move(p.x, p.y);
    if (t > 5.3 && t < 5.36) await hideCursor(page);
  },
});
