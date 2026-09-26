import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const monthly = { x: 362, y: 257 };
const yearly = { x: 362, y: 300 };
const lifetime = { x: 362, y: 342 };

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 3.5,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 640, y: 500 }],
      [0.7, lifetime],
      [1.05, lifetime],
      [1.4, monthly],
      [1.8, monthly],
      [2.15, yearly],
      [2.5, yearly],
      [2.9, { x: 700, y: 520 }],
      [3.3, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    // Lifetime -> Monthly -> back to Yearly, so the last frame matches the first.
    if (at(0.8) || at(1.5) || at(2.25)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.35)) await hideCursor(page);
  },
});
