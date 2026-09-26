import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const field = { x: 360, y: 219 };
const eye = { x: 535, y: 219 };
const TEXT = "Blue#Sky26";

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.5,
  async frame({ f, t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 660, y: 480 }],
      [0.7, field],
      [2.05, field],
      [2.4, eye],
      [3.4, eye],
      [3.8, { x: 700, y: 520 }],
      [4.2, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.8)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    // Select all and retype over it one character every 2 frames, so the strength meter
    // refills without the field ever going empty (which would collapse the checklist).
    if (at(0.95)) await page.keyboard.press("ControlOrMeta+A");
    const first = Math.round(1.2 * fps);
    const idx = (f - first) / 2;
    if (f >= first && Number.isInteger(idx) && idx < TEXT.length) await page.keyboard.insertText(TEXT[idx]);
    // Reveal, then hide again, so the last frame matches the first.
    if (at(2.5) || at(3.25)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.45)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.3)) await hideCursor(page);
  },
});
