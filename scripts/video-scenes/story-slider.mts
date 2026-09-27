import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const next = { x: 698, y: 300 };
const firstThumb = { x: 662, y: 129 };

// Step forward twice with the arrow (each change plays the slide transition), then jump back to
// the first story from the thumbnail grid, so the last frame matches the first.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 580 }],
      [0.9, next],
      [2.6, next],
      [3.4, firstThumb],
      [3.9, firstThumb],
      [4.6, { x: 720, y: 560 }],
      [4.9, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(2.4) || at(3.7)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.95)) await hideCursor(page);
  },
});
