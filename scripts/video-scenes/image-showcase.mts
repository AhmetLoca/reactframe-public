import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const next = { x: 655, y: 256 };
const thumb2 = { x: 303, y: 479 };
const thumb3 = { x: 439, y: 479 };

// The thumbnail shows the third photo selected, so the clip opens there, steps forward with the
// arrow twice, then picks the second and third thumbnails to land back where it started.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.2,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    if (at(0)) {
      await page.evaluate(() => {
        const thumbs = document.querySelectorAll<HTMLElement>("img[alt^='Showcase 3']");
        thumbs[thumbs.length - 1]?.parentElement?.click();
      });
    }
    const p = path(t, [
      [0.2, { x: 760, y: 420 }],
      [0.7, next],
      [1.7, next],
      [2.2, thumb2],
      [2.9, thumb2],
      [3.2, thumb3],
      [3.7, thumb3],
      [4.2, { x: 620, y: 560 }],
      [4.6, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.9) || at(1.5) || at(2.4) || at(3.4)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.65)) await hideCursor(page);
  },
});
