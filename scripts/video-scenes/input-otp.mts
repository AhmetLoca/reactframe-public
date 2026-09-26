import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Fifth cell of the six (x = 505 on the stage).
const cell = { x: 505, y: 300 };

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 660, y: 480 }],
      [0.7, cell],
      [3.0, cell],
      [3.4, { x: 700, y: 520 }],
      [3.8, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.8)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    // Finish the code (the stage flips to "success" at six digits), then delete back to 4821.
    if (at(1.1)) await page.keyboard.press("3");
    if (at(1.35)) await page.keyboard.press("9");
    if (at(2.5)) await page.keyboard.press("Backspace");
    if (at(2.7)) await page.keyboard.press("Backspace");
    if (at(2.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.85)) await hideCursor(page);
  },
});
