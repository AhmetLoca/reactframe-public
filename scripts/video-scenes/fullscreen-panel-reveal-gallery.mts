import type { Page } from "playwright-core";
import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const panel4 = { x: 373, y: 300 };
let close = { x: 760, y: 90 };
const closeCentre = (page: Page) =>
  page.evaluate(() => {
    const el = [...document.querySelectorAll<HTMLElement>('[aria-label="Close"]')].find((e) => e.offsetParent !== null && getComputedStyle(e).opacity !== "0");
    const r = (el ?? document.querySelector('[aria-label="Close"]')!).getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });

// Open the fourth panel so it expands to fill the gallery, read it for a moment, then close it
// with the × so all six panels fold back in.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 7.0,
  async frame({ fps, page, t, at }) {
    // The entrance starts from a 200ms timer during the recorder's real-time load wait, so its CSS
    // transitions run on the real clock; give them real time to finish before frame 0.
    if (at(0)) await page.waitForTimeout(1500);
    if (at(2.6)) close = await closeCentre(page);
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, panel4],
      [1.1, panel4],
      [3.1, close],
      [3.5, close],
      [5.6, { x: 640, y: 560 }],
      [5.9, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(3.4)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(5.95)) await hideCursor(page);
  },
});
