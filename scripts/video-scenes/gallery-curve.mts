import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Drag the strip left so the cards sweep around the curve, then drag it back past the start,
// where the scroll clamps, so the last frame settles on the first.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 760, y: 500 }],
      [0.8, { x: 560, y: 300 }],
      [1.0, { x: 560, y: 300 }],
      [2.2, { x: 180, y: 305 }],
      [2.8, { x: 180, y: 305 }],
      [3.0, { x: 180, y: 305 }],
      [4.2, { x: 620, y: 300 }],
      [4.5, { x: 620, y: 300 }],
      [4.9, { x: 700, y: 520 }],
      [5.2, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(3.0)) await page.mouse.down();
    if (at(2.3) || at(4.3)) await page.mouse.up();
    if (at(5.25)) await hideCursor(page);
  },
});
