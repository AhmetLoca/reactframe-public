import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const copy = { x: 578, y: 196 };

// Read down the code, click Copy (it confirms, then resets on its own timer), and leave.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.4,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 260, y: 470 }],
      [0.6, { x: 300, y: 250 }],
      [1.2, { x: 420, y: 350 }],
      [1.7, copy],
      [2.0, copy],
      [2.5, { x: 660, y: 470 }],
      [2.9, { x: 760, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.8)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(2.3)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(2.95)) await hideCursor(page);
  },
});
