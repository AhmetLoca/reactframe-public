import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const number = { x: 400, y: 271 };
const cvc = { x: 520, y: 329 };
const AMEX = "378282246310005";
const VISA = "4242424242424242";

// Swap the Visa number for an Amex one (the brand chip flips), type the Visa number back, then click
// into the CVC (the chip turns to the card back) and leave, so it ends as it began.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.0,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 640, y: 470 }],
      [0.7, number],
      [3.1, number],
      [3.4, cvc],
      [3.95, cvc],
      [4.4, { x: 700, y: 520 }],
      [4.7, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.8) || at(2.05) || at(3.5)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(0.95) || at(2.15)) await page.keyboard.press("Meta+A");
    for (const [start, digits] of [[1.05, AMEX], [2.25, VISA]] as const) {
      for (let i = 0; i < digits.length; i++) if (at(start + i * 0.045)) await page.keyboard.type(digits[i]);
    }
    if (at(4.05)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.75)) await hideCursor(page);
  },
});
