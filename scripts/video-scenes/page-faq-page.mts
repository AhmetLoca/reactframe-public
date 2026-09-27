import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Open the second question, reopen the first, then flip to Billing and back to General.
export default defineScene({
  url: "/pages/preview/faq-page/view",
  viewport: { width: 1280, height: 960 },
  duration: 7.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 640, y: 370 }],
      [1.2, { x: 642, y: 371 }],
      [2.1, { x: 640, y: 300 }],
      [2.4, { x: 642, y: 301 }],
      [3.3, { x: 575, y: 227 }],
      [3.6, { x: 577, y: 228 }],
      [4.5, { x: 486, y: 227 }],
      [4.8, { x: 488, y: 228 }],
      [5.7, { x: 1200, y: 945 }],
      [6.0, { x: 1320, y: 1040 }],
    ]);
    if (p && t <= 6.0) await page.mouse.move(p.x, p.y);
    if (at(1.05) || at(2.25) || at(3.45) || at(4.65)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (t > 6.0 && t < 6.06) await hideCursor(page);
  },
});
