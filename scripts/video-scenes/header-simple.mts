import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Run along the links and rest on the call to action.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.0,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 300, y: 620 }],
      [0.9, { x: 288, y: 54 }],
      [1.4, { x: 375, y: 54 }],
      [1.9, { x: 462, y: 54 }],
      [2.4, { x: 528, y: 54 }],
      [3.0, { x: 702, y: 54 }],
      [3.6, { x: 702, y: 56 }],
      [4.1, { x: 740, y: 590 }],
      [4.4, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t > 4.45 && t < 4.5) await hideCursor(page);
  },
});
