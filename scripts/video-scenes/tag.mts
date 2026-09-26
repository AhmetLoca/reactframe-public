import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const design = { x: 326, y: 300 };
const beta = { x: 492, y: 300 };

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 640, y: 480 }],
      [0.7, design],
      [1.0, design],
      [1.45, beta],
      [1.75, beta],
      [2.2, design],
      [2.45, design],
      [2.9, beta],
      [3.1, beta],
      [3.45, { x: 700, y: 520 }],
      [3.85, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    // Select Design and Beta, then deselect both, so the last frame matches the first.
    if (at(0.8) || at(1.55) || at(2.3) || at(3.0)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.15)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.9)) await hideCursor(page);
  },
});
