import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on each team member in turn; the card lifts and a shimmer runs across it.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 5.8,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 176, y: 480 }],
      [1.2, { x: 178, y: 481 }],
      [1.8, { x: 486, y: 480 }],
      [2.1, { x: 488, y: 481 }],
      [2.7, { x: 794, y: 480 }],
      [3.0, { x: 796, y: 481 }],
      [3.6, { x: 1101, y: 480 }],
      [3.9, { x: 1103, y: 481 }],
      [4.8, { x: 1200, y: 945 }],
      [5.1, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t > 5.15 && t < 5.20) await hideCursor(page);
  },
});
