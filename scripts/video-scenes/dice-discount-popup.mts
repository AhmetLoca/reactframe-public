import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const button = { x: 400, y: 453 };

// Press Roll: the dice tumble and land, and the reward pops up. The stage fades back to a fresh
// card with all rolls at the end.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.8, button],
      [1.0, button],
      [1.6, { x: 640, y: 580 }],
      [1.9, { x: 820, y: 660 }],
    ]);
    if (p && t < 1.95) await page.mouse.move(p.x, p.y);
    if (at(0.9)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.95)) await hideCursor(page);
    if (at(5.6)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
