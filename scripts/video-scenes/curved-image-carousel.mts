import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Drag the strip left so the cards glide round the curve (the shader bends them with the speed),
// then drag it back. The snap after each drag doesn't land on exactly the starting offset, so the
// clip loops through a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  loopBlend: 0.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.8, { x: 560, y: 300 }],
      [0.95, { x: 560, y: 300 }],
      [1.8, { x: 260, y: 305 }],
      [2.6, { x: 260, y: 305 }],
      [2.75, { x: 260, y: 305 }],
      [3.6, { x: 560, y: 300 }],
      [4.3, { x: 660, y: 560 }],
      [4.6, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.95) || at(2.75)) await page.mouse.down();
    if (at(1.8) || at(3.6)) await page.mouse.up();
    if (at(4.65)) await hideCursor(page);
  },
});
