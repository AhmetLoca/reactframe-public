import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const button = { x: 400, y: 452 };

// Replay the card's entrance (the stage remounts it on #video-reset), then hover the Open link
// button and leave.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.8,
  async frame({ fps, page, t, at }) {
    if (at(0.3)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [1.4, { x: 780, y: 590 }],
      [2.1, button],
      [3.2, { x: 405, y: 454 }],
      [3.7, { x: 640, y: 580 }],
      [4.0, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(4.05)) await hideCursor(page);
  },
});
