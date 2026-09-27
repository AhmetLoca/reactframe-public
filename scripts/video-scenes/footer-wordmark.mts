import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on a social, a link in each column, and Back to top.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 6.7,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 61, y: 508 }],
      [1.2, { x: 63, y: 509 }],
      [1.8, { x: 743, y: 454 }],
      [2.1, { x: 745, y: 455 }],
      [2.7, { x: 877, y: 490 }],
      [3.0, { x: 879, y: 491 }],
      [3.6, { x: 1020, y: 454 }],
      [3.9, { x: 1022, y: 455 }],
      [4.5, { x: 1188, y: 615 }],
      [4.8, { x: 1190, y: 616 }],
      [5.7, { x: 1200, y: 945 }],
      [6.0, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t > 6.05 && t < 6.10) await hideCursor(page);
  },
});
