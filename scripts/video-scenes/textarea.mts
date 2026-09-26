import { defineScene, path } from "./_lib.mts";

const field = { x: 470, y: 322 };
const TEXT = "Loving the new components!";

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 3,
  async frame({ f, t, fps, page, at }) {
    const p = path(t, [
      [0.25, { x: 700, y: 520 }],
      [0.75, field],
      [2.1, field],
      [2.45, { x: 700, y: 520 }],
      [2.85, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.8)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    // Clear the pre-filled message, then type it back one character per frame.
    if (at(1.0)) {
      await page.keyboard.press("ControlOrMeta+A");
      await page.keyboard.press("Backspace");
    }
    const first = Math.round(1.1 * fps);
    const idx = f - first;
    if (idx >= 0 && idx < TEXT.length) await page.keyboard.insertText(TEXT[idx]);
    // Click outside to blur, so the last frame matches the first.
    if (at(2.35)) {
      await page.mouse.down();
      await page.mouse.up();
    }
  },
});
