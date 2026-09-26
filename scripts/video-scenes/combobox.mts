import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const field = { x: 330, y: 300 };
const svelte = { x: 380, y: 383 };
const solid = { x: 380, y: 457 };

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 640, y: 480 }],
      [0.7, field],
      [1.3, field],
      [1.75, solid],
      [2.2, solid],
      [2.6, svelte],
      [3.0, svelte],
      [3.4, { x: 700, y: 520 }],
      [3.8, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.8)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.0)) await page.keyboard.press("ControlOrMeta+A");
    if (at(1.1)) await page.keyboard.insertText("s");
    // Escape drops the query and restores React, then blur so the loop is seamless.
    if (at(3.05)) await page.keyboard.press("Escape");
    if (at(3.15)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.85)) await hideCursor(page);
  },
});
