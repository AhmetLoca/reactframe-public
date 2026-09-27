import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const card = { x: 576, y: 190 };
const close = { x: 736, y: 92 };

// Hover the first card, click the second so it expands over the grid, then close it with the ×
// and leave, so the grid settles back to its first frame.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 760, y: 580 }],
      [0.8, { x: 230, y: 200 }],
      [1.3, { x: 235, y: 205 }],
      [1.7, card],
      [1.9, card],
      [3.4, { x: 700, y: 140 }],
      [3.7, close],
      [3.9, close],
      [4.5, { x: 720, y: 560 }],
      [4.8, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.8) || at(3.8)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.85)) await hideCursor(page);
  },
});
