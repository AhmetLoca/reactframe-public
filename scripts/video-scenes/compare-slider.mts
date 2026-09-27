import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const handle = { x: 400, y: 300 };

// Grab the handle, sweep it left to show the "after" photo, then right to show "before", and set
// it back in the middle where it started.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, handle],
      [1.1, handle],
      [2.0, { x: 130, y: 310 }],
      [2.3, { x: 130, y: 310 }],
      [3.5, { x: 670, y: 300 }],
      [3.8, { x: 670, y: 300 }],
      [4.5, handle],
      [4.7, handle],
      [5.1, { x: 640, y: 580 }],
      [5.4, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.05)) await page.mouse.down();
    if (at(4.6)) await page.mouse.up();
    if (at(5.45)) await hideCursor(page);
  },
});
