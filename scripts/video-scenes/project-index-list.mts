import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Slide down the index so each row lights up and swaps the background photo, then leave. The
// cursor parallax eases back slowly, so a short crossfade hides the last pixel of drift.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.8,
  loopBlend: 0.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, { x: 300, y: 197 }],
      [1.5, { x: 310, y: 199 }],
      [2.1, { x: 330, y: 243 }],
      [2.7, { x: 340, y: 245 }],
      [3.3, { x: 360, y: 288 }],
      [3.9, { x: 370, y: 290 }],
      [4.4, { x: 390, y: 380 }],
      [4.8, { x: 400, y: 380 }],
      [5.2, { x: 620, y: 560 }],
      [5.4, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(5.45)) await hideCursor(page);
  },
});
