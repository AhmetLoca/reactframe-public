import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const copy = { x: 387, y: 400 };

// Run down the rows (each highlights on hover), copy the email with its inline button, then leave.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.4,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 640, y: 150 }],
      [0.6, { x: 470, y: 215 }],
      [1.0, { x: 470, y: 300 }],
      [1.4, { x: 470, y: 390 }],
      [1.8, copy],
      [2.1, copy],
      [2.6, { x: 640, y: 480 }],
      [3.0, { x: 760, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.9)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(2.4)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.05)) await hideCursor(page);
  },
});
