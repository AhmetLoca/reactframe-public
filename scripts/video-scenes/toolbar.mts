import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const y = 300;
const italic = { x: 376, y };
const underline = { x: 424, y };
const left = { x: 485, y };
const center = { x: 533, y };

// Turn on italic and underline, align center, then undo each so the toolbar ends as it started
// (bold + align left).
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.0,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 300, y: 460 }],
      [0.55, italic],
      [0.8, italic],
      [1.05, underline],
      [1.3, underline],
      [1.6, center],
      [1.9, center],
      [2.3, italic],
      [2.55, italic],
      [2.8, underline],
      [3.05, underline],
      [3.35, left],
      [3.6, left],
      [4.0, { x: 620, y: 460 }],
      [4.3, { x: 740, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.65) || at(1.15) || at(1.7) || at(2.4) || at(2.9) || at(3.45)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.8)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.35)) await hideCursor(page);
  },
});
