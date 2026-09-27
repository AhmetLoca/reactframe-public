import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const coin = { x: 400, y: 334 };
const button = { x: 400, y: 434 };

// Tap the coin, watch it spin and land, then flip again with the button. The stage fades the
// card out and back in fresh at the end, clearing the result history so the clip loops.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.8,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, coin],
      [1.1, coin],
      [2.8, { x: 420, y: 380 }],
      [3.3, button],
      [3.5, button],
      [5.4, { x: 640, y: 580 }],
      [5.7, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(3.4)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(5.75)) await hideCursor(page);
    if (at(6.1)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
