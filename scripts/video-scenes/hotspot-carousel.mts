import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

let close = { x: 620, y: 270 };

const sofa = { x: 404, y: 318 };
const next = { x: 772, y: 300 };
const firstThumb = { x: 63, y: 547 };

// Open the sofa hotspot's product card, close it with its ×, step to the next room
// with the arrow, then jump back to the first room from the thumbnail strip.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 7.0,
  async frame({ fps, page, t, at }) {
    if (at(2.0))
      close = await page.evaluate(() => {
        const r = document.querySelector('[aria-label="Close"]')!.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, sofa],
      [2.4, sofa],
      [2.7, close],
      [2.9, close],
      [3.4, next],
      [4.4, next],
      [5.0, firstThumb],
      [5.4, firstThumb],
      [5.9, { x: 300, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(2.8) || at(3.5) || at(5.1)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(5.95)) await hideCursor(page);
  },
});
