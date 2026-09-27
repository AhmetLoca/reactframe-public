import type { Page } from "playwright-core";
import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const tile = { x: 400, y: 195 };
const centre = (page: Page, label: string) =>
  page.evaluate((l) => {
    const r = document.querySelector(`[aria-label="${l}"]`)!.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, label);
let next = { x: 740, y: 300 };
let close = { x: 760, y: 40 };

// Open the rower photo in the lightbox, step to the next image, then close it.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    if (at(1.4)) {
      next = await centre(page, "Next image");
      close = await centre(page, "Close");
    }
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, tile],
      [1.1, tile],
      [1.8, next],
      [2.8, next],
      [3.4, close],
      [3.8, close],
      [4.4, { x: 640, y: 560 }],
      [4.7, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(2.0) || at(3.6)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.75)) await hideCursor(page);
  },
});
