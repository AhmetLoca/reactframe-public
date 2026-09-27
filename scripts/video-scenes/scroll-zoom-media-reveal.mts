import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Scroll down through the section so the card zooms out to fill the frame, then back to the top.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, { x: 560, y: 470 }],
      [4.6, { x: 560, y: 470 }],
      [5.1, { x: 780, y: 590 }],
      [5.4, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    for (const s of [1.0, 1.3, 1.6, 1.9]) if (at(s)) await page.mouse.wheel(0, 150);
    for (const s of [3.2, 3.5, 3.8, 4.1]) if (at(s)) await page.mouse.wheel(0, -150);
    if (at(5.45)) await hideCursor(page);
  },
});
