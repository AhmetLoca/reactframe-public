import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const lastItemEnd = { x: 276, y: 346 };

// Add a bullet ("Press kit ready"), leave the list with a double Enter, turn the new line into a
// heading by typing "## ", then reset to the starting text.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.4,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 620, y: 480 }],
      [0.65, lastItemEnd],
      [0.95, lastItemEnd],
      [1.3, { x: 560, y: 470 }],
      [4.4, { x: 600, y: 490 }],
      [4.8, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.75)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(0.85)) await page.keyboard.press("End");
    const keys: [number, string][] = [[1.0, "Enter"], [2.2, "Enter"], [2.35, "Enter"]];
    for (const [time, key] of keys) if (at(time)) await page.keyboard.press(key);
    for (const [start, text] of [[1.1, "Press kit ready"], [2.55, "## "], [2.85, "Launch day"]] as const) {
      for (let i = 0; i < text.length; i++) if (at(start + i * 0.055)) await page.keyboard.type(text[i]);
    }
    if (at(4.5)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.85)) {
      await hideCursor(page);
      await page.evaluate(() => document.getElementById("video-reset")?.click());
    }
  },
});
