import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Glide down the four rows; each opens its image marquee as the cursor enters.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.6,
  async frame({ fps, page, t }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 820, y: 40 }],
      [0.9, { x: 380, y: 75 }],
      [1.7, { x: 420, y: 225 }],
      [2.5, { x: 380, y: 375 }],
      [3.3, { x: 420, y: 525 }],
      [4.0, { x: 440, y: 560 }],
      [4.4, { x: 460, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t > 4.45 && t < 4.5) await hideCursor(page);
  },
});
