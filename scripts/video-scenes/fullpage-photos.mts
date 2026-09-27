import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Two wheel flicks down (each one wipes to the next photo), then two back up to the photo the clip
// opened on.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.8,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.8, { x: 460, y: 360 }],
      [5.6, { x: 465, y: 365 }],
      [6.0, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(2.4)) await page.mouse.wheel(0, 100);
    if (at(3.8) || at(5.1)) await page.mouse.wheel(0, -100);
    if (at(6.05)) await hideCursor(page);
  },
});
