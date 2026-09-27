import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Run down the open positions; each row lights up as the cursor passes.
export default defineScene({
  url: "/pages/preview/career-page-01/view",
  viewport: { width: 1280, height: 960 },
  duration: 6.2,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 640, y: 614 }],
      [1.2, { x: 642, y: 615 }],
      [1.7, { x: 640, y: 676 }],
      [2.0, { x: 642, y: 677 }],
      [2.5, { x: 640, y: 738 }],
      [2.8, { x: 642, y: 739 }],
      [3.3, { x: 640, y: 799 }],
      [3.6, { x: 642, y: 800 }],
      [4.1, { x: 640, y: 861 }],
      [4.4, { x: 642, y: 862 }],
      [4.9, { x: 1200, y: 945 }],
      [5.2, { x: 1320, y: 1040 }],
    ]);
    if (p && t <= 5.2) await page.mouse.move(p.x, p.y);
    if (t > 5.2 && t < 5.26) await hideCursor(page);
  },
});
