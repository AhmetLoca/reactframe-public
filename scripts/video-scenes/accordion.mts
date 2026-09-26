import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const first = { x: 300, y: 241 }; // "What is ReactFrame?" header, stays put
const second = { x: 265, y: 359 }; // "Is it free?" header while the first item is open

// Open "Is it free?" (the first item closes), then reopen "What is ReactFrame?" so the last frame
// matches the first.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.0,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 620, y: 500 }],
      [0.65, second],
      [0.95, second],
      [1.9, first],
      [2.2, first],
      [2.7, { x: 640, y: 500 }],
      [3.1, { x: 760, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.05) || at(2.05)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(2.5)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.15)) await hideCursor(page);
  },
});
