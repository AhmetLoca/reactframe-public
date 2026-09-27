import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const next = { x: 1242, y: 480 };
const dot1 = { x: 1147, y: 928 };

// Step forward two slides with the arrow, then jump back to the first with its dot.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 20 }],
      [0.9, next],
      [3.0, next],
      [3.7, dot1],
      [4.0, dot1],
      [4.8, { x: 1200, y: 945 }],
      [5.1, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(2.2) || at(3.85)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.6)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(5.15)) await hideCursor(page);
  },
});
