import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Scroll to the open positions, filter to Design, then back to All and up to the top. The values
// marquee never stops, so the seam is crossfaded.
export default defineScene({
  url: "/pages/preview/career-page-02/view",
  viewport: { width: 1280, height: 960 },
  duration: 7.6,
  loopBlend: 0.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const s = path(t, [[0.0, { x: 0, y: 0 }], [1.2, { x: 0, y: 0 }], [2.2, { x: 0, y: 230 }], [5.4, { x: 0, y: 230 }], [6.5, { x: 0, y: 0 }]]);
    if (s) await page.evaluate((y) => window.scrollTo(0, y), s.y);
    const p = path(t, [
      [0.6, { x: 1320, y: 1040 }],
      [1.2, { x: 640, y: 500 }],
      [1.5, { x: 642, y: 501 }],
      [2.5, { x: 229, y: 621 }],
      [2.8, { x: 231, y: 622 }],
      [3.8, { x: 59, y: 621 }],
      [4.1, { x: 61, y: 622 }],
      [5.1, { x: 640, y: 500 }],
      [5.4, { x: 642, y: 501 }],
      [6.4, { x: 1200, y: 945 }],
      [6.7, { x: 1320, y: 1040 }],
    ]);
    if (p && t <= 6.7) await page.mouse.move(p.x, p.y);
    if (at(2.65) || at(3.95)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (t > 6.7 && t < 6.76) await hideCursor(page);
  },
});
