import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Track spans x 237.5..562.5 on the stage; value v sits at 237.5 + v * 3.25.
const y = 315.2;
const at62 = { x: 438, y };
const at80 = { x: 497.5, y };
const at20 = { x: 302.5, y };

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 640, y: 480 }],
      [0.7, at62],
      [0.9, at62],
      [1.5, at80],
      [1.7, at80],
      [2.5, at20],
      [2.7, at20],
      [3.2, at62],
      [3.35, at62],
      [3.6, { x: 700, y: 520 }],
      [3.85, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    // Drag from 62 up to 80, down to 20, and release back on 62 so the loop is seamless.
    if (at(0.85)) await page.mouse.down();
    if (at(3.27)) await page.mouse.up();
    if (at(3.4)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.9)) await hideCursor(page);
  },
});
