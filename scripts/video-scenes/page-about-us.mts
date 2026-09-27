import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Glide over the stats and the team row; the page scrolls a little to show the names, then back.
export default defineScene({
  url: "/pages/preview/about-us/view",
  viewport: { width: 1280, height: 960 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const s = path(t, [[0.0, { x: 0, y: 0 }], [2.6, { x: 0, y: 0 }], [3.6, { x: 0, y: 65 }], [4.6, { x: 0, y: 65 }], [5.4, { x: 0, y: 0 }]]);
    if (s) await page.evaluate((y) => window.scrollTo(0, y), s.y);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 776, y: 610 }],
      [1.2, { x: 778, y: 611 }],
      [1.9, { x: 1124, y: 610 }],
      [2.2, { x: 1126, y: 611 }],
      [2.9, { x: 166, y: 850 }],
      [3.2, { x: 168, y: 851 }],
      [3.9, { x: 544, y: 850 }],
      [4.2, { x: 546, y: 851 }],
      [4.9, { x: 1114, y: 850 }],
      [5.2, { x: 1116, y: 851 }],
      [5.9, { x: 1200, y: 945 }],
      [6.2, { x: 1320, y: 1040 }],
    ]);
    if (p && t <= 6.2) await page.mouse.move(p.x, p.y);
    if (t > 6.2 && t < 6.26) await hideCursor(page);
  },
});
