import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const card = { x: 104, y: 181 };
const next = { x: 766, y: 520 };
const close = { x: 777, y: 68 };

// Open Sarah's card (the profile drawer slides in), step to the next member, then close it.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 400, y: 620 }],
      [0.9, card],
      [1.1, card],
      [2.2, next],
      [2.9, next],
      [3.5, close],
      [3.9, close],
      [4.5, { x: 620, y: 590 }],
      [4.8, { x: 700, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(2.5) || at(3.7)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.2)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.85)) await hideCursor(page);
  },
});
