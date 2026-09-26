import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const field = { x: 400, y: 302 };
const outside = { x: 520, y: 440 };

// Type a taken name and leave the field (spinner, then the error with a shake), fix it to "ada"
// (re-checks while typing, then the success check), and reset to the empty field to loop.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.6,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 640, y: 470 }],
      [0.6, field],
      [1.3, field],
      [1.5, outside],
      [2.4, outside],
      [2.65, field],
      [3.3, field],
      [3.6, outside],
      [4.6, { x: 700, y: 520 }],
      [5.0, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.7) || at(1.55) || at(2.7)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    for (const [start, word] of [[0.85, "admin"], [2.95, "ada"]] as const) {
      for (let i = 0; i < word.length; i++) if (at(start + i * 0.08)) await page.keyboard.type(word[i]);
    }
    if (at(2.85)) await page.keyboard.press("Meta+A");
    if (at(3.65)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(5.05)) {
      await hideCursor(page);
      await page.evaluate(() => document.getElementById("video-reset")?.click());
    }
  },
});
