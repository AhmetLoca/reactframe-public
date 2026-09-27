import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Sweep over the card corner to corner so it tilts toward the cursor and the diamond glare
// follows, then leave so it settles flat.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, { x: 560, y: 430 }],
      [1.8, { x: 250, y: 150 }],
      [2.7, { x: 560, y: 160 }],
      [3.6, { x: 250, y: 440 }],
      [4.1, { x: 400, y: 300 }],
      [4.5, { x: 520, y: 620 }],
      [4.7, { x: 560, y: 680 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(4.75)) await hideCursor(page);
  },
});
