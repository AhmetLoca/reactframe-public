import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const field = { x: 330, y: 222 };
const TEXT = "Coffee shop landing page";

// Click the top prompt, type a request and send it with Enter so it runs its thinking state, then
// leave. The gradient borders drift forever, so the clip loops through a crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.8,
  loopBlend: 0.6,
  async frame({ f, t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 620, y: 470 }],
      [0.8, field],
      [3.0, field],
      [3.5, { x: 600, y: 470 }],
      [3.9, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.9)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    // Type one character every 2 frames.
    const first = Math.round(1.1 * fps);
    const idx = (f - first) / 2;
    if (f >= first && Number.isInteger(idx) && idx < TEXT.length) await page.keyboard.insertText(TEXT[idx]);
    if (at(2.95)) await page.keyboard.press("Enter");
    if (at(5.4)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.95)) await hideCursor(page);
  },
});
