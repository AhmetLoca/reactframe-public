import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const thumb = (i: number) => ({ x: 330 + i * 46, y: 474 });

// Pick the third and then the fourth swatch (each click scrolls the showcase to that room), then
// the first again, so the clip ends where it began.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, thumb(2)],
      [2.1, thumb(2)],
      [2.5, thumb(3)],
      [3.6, thumb(3)],
      [4.1, thumb(0)],
      [4.9, thumb(0)],
      [5.3, { x: 640, y: 580 }],
      [5.6, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(2.6) || at(4.2)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(5.65)) await hideCursor(page);
  },
});
