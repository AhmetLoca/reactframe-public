import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Replay the staggered entrance (the stage remounts the grid on #video-reset), then hover the
// button and leave. The grid ends fully shown, as it starts.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    if (at(0.4)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [3.0, { x: 780, y: 590 }],
      [3.6, { x: 400, y: 372 }],
      [4.4, { x: 402, y: 374 }],
      [4.9, { x: 640, y: 560 }],
      [5.2, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(5.25)) await hideCursor(page);
  },
});
