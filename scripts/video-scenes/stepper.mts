import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const cart = { x: 250, y: 282 };
const shipping = { x: 400, y: 282 };
const payment = { x: 550, y: 282 };

// Forward to Payment, back to Cart, then Shipping again so the last frame matches the first.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.0,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 680, y: 470 }],
      [0.7, payment],
      [1.0, payment],
      [1.55, cart],
      [1.85, cart],
      [2.3, shipping],
      [2.65, shipping],
      [3.1, { x: 700, y: 520 }],
      [3.5, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.8) || at(1.65) || at(2.4)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(2.8)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.55)) await hideCursor(page);
  },
});
