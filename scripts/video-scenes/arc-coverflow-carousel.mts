import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const nextCard = { x: 592, y: 356 };
const prevArrow = { x: 36, y: 287 };

// Click the card to the right of centre so the arc swings it forward, click the next one too, then
// step back twice with the left arrow to the card the clip opened on.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, nextCard],
      [2.4, nextCard],
      [2.9, prevArrow],
      [4.3, prevArrow],
      [4.9, { x: 300, y: 560 }],
      [5.2, { x: 420, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(1.8) || at(3.0) || at(3.7)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(5.25)) await hideCursor(page);
  },
});
