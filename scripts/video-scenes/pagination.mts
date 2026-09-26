import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// The control always shows 7 slots, so positions stay put while the page changes.
const last = { x: 565, y: 300 }; // "12" on page 4
const first = { x: 235, y: 300 }; // "1" on page 12
const four = { x: 400, y: 300 }; // "4" on page 1

// Jump to 12, back to 1, then to 4 so the last frame matches the first.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.0,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 660, y: 480 }],
      [0.7, last],
      [1.0, last],
      [1.55, first],
      [1.85, first],
      [2.3, four],
      [2.65, four],
      [3.1, { x: 700, y: 520 }],
      [3.5, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.8) || at(1.65) || at(2.4)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(2.8)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.55)) await hideCursor(page);
  },
});
