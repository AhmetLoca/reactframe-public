import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on the headline stats, the pull quote and the call to action.
export default defineScene({
  url: "/pages/preview/case-study-page/view",
  viewport: { width: 1280, height: 960 },
  duration: 5.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 300, y: 420 }],
      [1.2, { x: 302, y: 421 }],
      [1.9, { x: 640, y: 640 }],
      [2.2, { x: 642, y: 641 }],
      [2.9, { x: 640, y: 833 }],
      [3.2, { x: 642, y: 834 }],
      [3.9, { x: 1200, y: 945 }],
      [4.2, { x: 1320, y: 1040 }],
    ]);
    if (p && t <= 4.2) await page.mouse.move(p.x, p.y);
    if (t > 4.2 && t < 4.26) await hideCursor(page);
  },
});
