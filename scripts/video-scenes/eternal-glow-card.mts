import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest the cursor on the card so its glow wakes and circles the edge, then leave so it fades out.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, { x: 420, y: 330 }],
      [3.6, { x: 400, y: 280 }],
      [4.0, { x: 640, y: 560 }],
      [4.3, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(4.35)) await hideCursor(page);
  },
});
