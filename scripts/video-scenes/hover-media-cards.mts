import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Hover each card in turn: the one under the cursor widens, blurs its photo and reveals its
// details, then leave so all three settle back to even widths.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, { x: 180, y: 300 }],
      [2.0, { x: 190, y: 310 }],
      [2.5, { x: 400, y: 300 }],
      [3.5, { x: 410, y: 310 }],
      [4.0, { x: 620, y: 300 }],
      [4.9, { x: 625, y: 310 }],
      [5.3, { x: 700, y: 560 }],
      [5.5, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(5.55)) await hideCursor(page);
  },
});
