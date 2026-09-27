import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const buy = { x: 400, y: 411 };
const close = { x: 512, y: 170 };

// Rest on Buy Now, then close the ticket; it slides back in, so the clip ends where it began.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, buy],
      [1.8, buy],
      [2.4, close],
      [2.7, close],
      [3.3, { x: 700, y: 590 }],
      [3.6, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(2.55)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.65)) await hideCursor(page);
  },
});
