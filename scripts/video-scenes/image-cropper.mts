import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const box = { x: 400, y: 281 };
const moved = { x: 360, y: 281 };
// The bottom-right handle after the horizontal move above (the box can barely move vertically).
const se = { x: 559, y: 393 };
const seIn = { x: 500, y: 360 };
const square = { x: 176, y: 472 };
const wide = { x: 257, y: 472 };

// Drag the crop, shrink it from its corner (it keeps 16:9), switch to 1:1, then back to 16:9, which
// restores the starting crop.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.0,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 640, y: 520 }],
      [0.6, box],
      [0.75, box],
      [1.35, moved],
      [1.6, se],
      [1.75, se],
      [2.3, seIn],
      [2.75, square],
      [3.05, square],
      [3.45, wide],
      [3.75, wide],
      [4.2, { x: 700, y: 540 }],
      [4.6, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.8) || at(1.8)) await page.mouse.down();
    if (at(1.35) || at(2.3)) await page.mouse.up();
    if (at(2.9) || at(3.6)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.0)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.65)) await hideCursor(page);
  },
});
