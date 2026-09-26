import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const field = { x: 330, y: 300 };
const carousel = { x: 330, y: 417 };
const clear = { x: 558, y: 300 };
const TEXT = "car";

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4,
  async frame({ f, t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 640, y: 480 }],
      [0.7, field],
      [1.6, field],
      [2.0, carousel],
      [2.5, carousel],
      [2.9, clear],
      [3.15, clear],
      [3.5, { x: 700, y: 520 }],
      [3.85, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.8)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    // Type one character every 4 frames.
    const first = Math.round(1.0 * fps);
    const idx = (f - first) / 4;
    if (f >= first && Number.isInteger(idx) && idx < TEXT.length) await page.keyboard.insertText(TEXT[idx]);
    // Clear with the × button, then drop focus so the last frame matches the first.
    if (at(3.0)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.3)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.9)) await hideCursor(page);
  },
});
