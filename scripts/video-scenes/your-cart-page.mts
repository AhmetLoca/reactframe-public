import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const plus = { x: 706, y: 364 };
const minus = { x: 658, y: 364 };

// Add a second pair of headphones (the totals update), take it back off, then rest on Checkout.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, plus],
      [2.0, plus],
      [2.4, minus],
      [3.1, minus],
      [3.8, { x: 1040, y: 551 }],
      [4.4, { x: 1042, y: 553 }],
      [5.0, { x: 1200, y: 945 }],
      [5.3, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(2.6)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.8)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(5.35)) await hideCursor(page);
  },
});
