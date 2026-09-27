import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const play = { x: 400, y: 300 };

// Open the lightbox from the play button, let the glow settle around the player, then close it.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.8,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 790, y: 590 }],
      [1.0, play],
      [1.3, play],
      [2.0, { x: 560, y: 520 }],
      [4.4, { x: 700, y: 590 }],
      [4.7, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.15)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.0)) await page.keyboard.press("Escape");
    if (at(4.75)) await hideCursor(page);
  },
});
