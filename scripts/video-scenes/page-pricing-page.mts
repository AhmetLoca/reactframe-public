import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Switch to monthly prices, rest on the Pro plan, then back to yearly.
export default defineScene({
  url: "/pages/preview/pricing-page/view",
  viewport: { width: 1280, height: 960 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 573, y: 240 }],
      [1.2, { x: 575, y: 241 }],
      [2.2, { x: 640, y: 523 }],
      [2.5, { x: 642, y: 524 }],
      [3.5, { x: 683, y: 240 }],
      [3.8, { x: 685, y: 241 }],
      [4.8, { x: 1200, y: 945 }],
      [5.1, { x: 1320, y: 1040 }],
    ]);
    if (p && t <= 5.1) await page.mouse.move(p.x, p.y);
    if (at(1.05) || at(3.65)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (t > 5.1 && t < 5.16) await hideCursor(page);
  },
});
