import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const knob = { x: 462, y: 307 };

// Grab the knob, sweep it right and then left across the photo, and release it where it started
// so the last frame matches the first.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 760, y: 560 }],
      [0.9, knob],
      [1.1, knob],
      [2.0, { x: 700, y: 312 }],
      [2.3, { x: 700, y: 312 }],
      [3.6, { x: 120, y: 300 }],
      [3.9, { x: 120, y: 300 }],
      [4.6, knob],
      [4.8, knob],
      [5.2, { x: 640, y: 560 }],
      [5.5, { x: 720, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.05)) await page.mouse.down();
    if (at(4.7)) await page.mouse.up();
    if (at(5.55)) await hideCursor(page);
  },
});
