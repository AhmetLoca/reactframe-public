import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const button = { x: 541, y: 392 };
const inside = { x: 380, y: 300 };

// Click the button (the box scrolls to the top and the button fades out), then wheel back down a
// little at a time until it fades back in with its progress ring filled, as in the first frame.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.6,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 660, y: 500 }],
      [0.6, button],
      [0.9, button],
      [1.5, inside],
      [3.2, inside],
      [3.6, { x: 640, y: 490 }],
      [3.9, { x: 740, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.3)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (t >= 2.2 && t < 2.9) await page.mouse.wheel(0, 4);
    if (at(3.95)) await hideCursor(page);
  },
});
