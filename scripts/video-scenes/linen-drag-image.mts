import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Grab the photo and pull it like fabric, let go so it springs back, then a second, shorter
// tug. Everything settles before the end, so the last frame matches the first.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 560 }],
      [0.8, { x: 420, y: 280 }],
      [1.0, { x: 420, y: 280 }],
      [1.9, { x: 250, y: 390 }],
      [2.1, { x: 250, y: 390 }],
      [2.9, { x: 560, y: 330 }],
      [3.1, { x: 560, y: 330 }],
      [3.6, { x: 650, y: 200 }],
      [3.8, { x: 650, y: 200 }],
      [4.3, { x: 720, y: 560 }],
      [4.6, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(3.1)) await page.mouse.down();
    if (at(2.1) || at(3.8)) await page.mouse.up();
    if (at(4.65)) await hideCursor(page);
  },
});
