import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on the featured post, scroll down the article grid, and back to the top.
export default defineScene({
  url: "/pages/preview/blog-page/view",
  viewport: { width: 1280, height: 960 },
  duration: 7.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const s = path(t, [[0.0, { x: 0, y: 0 }], [2.4, { x: 0, y: 0 }], [3.6, { x: 0, y: 332 }], [4.8, { x: 0, y: 332 }], [5.9, { x: 0, y: 0 }]]);
    if (s) await page.evaluate((y) => window.scrollTo(0, y), s.y);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 640, y: 390 }],
      [1.2, { x: 642, y: 391 }],
      [2.4, { x: 640, y: 600 }],
      [2.7, { x: 642, y: 601 }],
      [3.9, { x: 1019, y: 560 }],
      [4.2, { x: 1021, y: 561 }],
      [5.4, { x: 1200, y: 945 }],
      [5.7, { x: 1320, y: 1040 }],
    ]);
    if (p && t <= 5.7) await page.mouse.move(p.x, p.y);
    if (t > 5.7 && t < 5.76) await hideCursor(page);
  },
});
