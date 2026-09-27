import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Glide across the strip so each card in turn widens and reveals its story (with a slight
// parallax under the cursor), then leave so they settle back to equal widths.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, { x: 90, y: 300 }],
      [1.8, { x: 110, y: 310 }],
      [2.6, { x: 330, y: 300 }],
      [3.4, { x: 340, y: 310 }],
      [4.2, { x: 620, y: 300 }],
      [4.9, { x: 630, y: 310 }],
      [5.3, { x: 700, y: 560 }],
      [5.5, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(5.55)) await hideCursor(page);
  },
});
