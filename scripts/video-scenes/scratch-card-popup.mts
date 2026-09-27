import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Scratch the foil in zigzag strokes until the card reveals itself and the prize is awarded, then
// the stage fades back to a fresh coating.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 7.2,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.8, { x: 314, y: 230 }],
      [1.1, { x: 486, y: 245 }],
      [1.4, { x: 314, y: 277 }],
      [1.7, { x: 486, y: 300 }],
      [2.0, { x: 314, y: 331 }],
      [2.3, { x: 486, y: 355 }],
      [2.6, { x: 314, y: 386 }],
      [2.9, { x: 486, y: 405 }],
      [3.2, { x: 400, y: 316 }],
      [3.8, { x: 634, y: 526 }],
      [4.1, { x: 820, y: 660 }],
    ]);
    if (p && t < 4.15) await page.mouse.move(p.x, p.y);
    if (at(0.8)) await page.mouse.down();
    if (at(3.2)) await page.mouse.up();
    if (at(4.15)) await hideCursor(page);
    if (at(6.4)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
