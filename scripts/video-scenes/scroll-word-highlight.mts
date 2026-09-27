import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Two wheel flicks down so the highlight moves to the next words in the list,
// then two back up, so the last frame matches the first.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 560 }],
      [0.8, { x: 520, y: 330 }],
      [4.8, { x: 525, y: 335 }],
      [5.1, { x: 700, y: 560 }],
      [5.4, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(2.2)) await page.mouse.wheel(0, 120);
    if (at(3.4) || at(4.4)) await page.mouse.wheel(0, -120);
    if (at(5.45)) await hideCursor(page);
  },
});
