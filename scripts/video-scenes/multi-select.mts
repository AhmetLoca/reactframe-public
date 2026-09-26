import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const field = { x: 440, y: 322 };
// Engineering's row, before and after its chip is removed (the field shrinks to one line).
const engineering = { x: 400, y: 521 };
const engineeringShifted = { x: 400, y: 499 };

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 660, y: 480 }],
      [0.7, field],
      [0.95, field],
      [1.4, engineering],
      [1.75, engineering],
      [2.05, engineeringShifted],
      [2.6, engineeringShifted],
      [3.3, { x: 700, y: 520 }],
      [3.8, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    // Open, untick Engineering, tick it again, then close, so the chips end as they started.
    if (at(0.8) || at(1.5) || at(2.15)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(2.8)) await page.keyboard.press("Escape");
    if (at(2.9)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.85)) await hideCursor(page);
  },
});
