import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const field = { x: 300, y: 323 };
const word = "shadcn";

// Click into the field, type a tag and press Enter (a chip pops in), then Backspace removes it again
// and the field is blurred, so the last frame matches the first.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.8,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 560, y: 470 }],
      [0.6, field],
      [0.8, field],
      [1.2, { x: 560, y: 470 }],
      [1.5, { x: 740, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.7)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    for (let i = 0; i < word.length; i++) if (at(1.0 + i * 0.1)) await page.keyboard.type(word[i]);
    if (at(1.8)) await page.keyboard.press("Enter");
    if (at(1.55)) await hideCursor(page);
    if (at(3.2)) await page.keyboard.press("Backspace");
    if (at(3.8)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  },
});
