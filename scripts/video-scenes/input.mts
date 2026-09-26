import { defineScene, path } from "./_lib.mts";

const field = { x: 520, y: 335 };
const TEXT = "hi@reactframe.com";

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 3,
  async frame({ f, t, fps, page, at }) {
    const p = path(t, [
      [0.25, { x: 700, y: 520 }],
      [0.75, field],
      [2.2, field],
      [2.55, { x: 700, y: 520 }],
      [2.85, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.8)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    // Clear the pre-filled value, then type it back one character every 2 frames.
    if (at(1.0)) {
      await page.keyboard.press("ControlOrMeta+A");
      await page.keyboard.press("Backspace");
    }
    const first = Math.round(1.13 * fps);
    const idx = (f - first) / 2;
    if (f >= first && Number.isInteger(idx) && idx < TEXT.length) await page.keyboard.insertText(TEXT[idx]);
    // Click outside to blur, so the last frame matches the first.
    if (at(2.3)) {
      await page.mouse.down();
      await page.mouse.up();
    }
  },
});
