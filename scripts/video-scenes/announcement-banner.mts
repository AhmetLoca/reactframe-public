import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const copy = { x: 576, y: 300 };

// Copy the coupon code, then rest on Shop Now. The countdown ticks, so the seam is crossfaded.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.4,
  loopBlend: 0.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.9, { x: 560, y: 599 }],
      [1.5, copy],
      [1.8, copy],
      [2.8, { x: 702, y: 300 }],
      [3.6, { x: 704, y: 302 }],
      [4.2, { x: 740, y: 599 }],
    ]);
    if (p && t <= 4.2) await page.mouse.move(p.x, p.y);
    if (at(1.65)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.0)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (t > 4.2 && t < 4.26) {
      await page.mouse.move(760, 700);
      await hideCursor(page);
    }
  },
});
