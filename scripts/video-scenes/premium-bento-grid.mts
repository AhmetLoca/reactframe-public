import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Drift across three tiles so each one tilts toward the cursor and shows its hover overlay, then
// leave so they settle flat again.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, { x: 230, y: 165 }],
      [1.9, { x: 290, y: 185 }],
      [2.4, { x: 490, y: 300 }],
      [3.3, { x: 520, y: 320 }],
      [3.8, { x: 560, y: 430 }],
      [4.7, { x: 600, y: 450 }],
      [5.1, { x: 720, y: 580 }],
      [5.3, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(5.35)) await hideCursor(page);
  },
});
