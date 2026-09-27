import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Run the cursor across the bars so each column highlights and shows its tooltip, then leave.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, { x: 160, y: 330 }],
      [3.6, { x: 610, y: 300 }],
      [4.1, { x: 610, y: 305 }],
      [4.6, { x: 700, y: 590 }],
      [4.9, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(4.95)) await hideCursor(page);
  },
});
