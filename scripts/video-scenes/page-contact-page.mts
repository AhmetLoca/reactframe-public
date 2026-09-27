import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Type a name into the form, rest on Send message, then clear the field.
export default defineScene({
  url: "/pages/preview/contact-page/view",
  viewport: { width: 1280, height: 960 },
  duration: 7.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 764, y: 150 }],
      [1.2, { x: 766, y: 151 }],
      [2.8, { x: 883, y: 482 }],
      [3.1, { x: 885, y: 483 }],
      [4.7, { x: 1200, y: 945 }],
      [5.0, { x: 1320, y: 1040 }],
    ]);
    if (p && t <= 5.0) await page.mouse.move(p.x, p.y);
    if (at(1.05)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.3)) await page.keyboard.type("J", { delay: 0 });
    if (at(1.36)) await page.keyboard.type("o", { delay: 0 });
    if (at(1.42)) await page.keyboard.type("r", { delay: 0 });
    if (at(1.48)) await page.keyboard.type("d", { delay: 0 });
    if (at(1.54)) await page.keyboard.type("a", { delay: 0 });
    if (at(1.6)) await page.keyboard.type("n", { delay: 0 });
    if (at(1.6600000000000001)) await page.keyboard.type(" ", { delay: 0 });
    if (at(1.72)) await page.keyboard.type("B", { delay: 0 });
    if (at(1.78)) await page.keyboard.type("l", { delay: 0 });
    if (at(1.84)) await page.keyboard.type("a", { delay: 0 });
    if (at(1.9)) await page.keyboard.type("k", { delay: 0 });
    if (at(1.96)) await page.keyboard.type("e", { delay: 0 });
    if (at(4.4)) await page.keyboard.press("Meta+A");
    if (at(4.5)) await page.keyboard.press("Backspace");
    if (at(4.7)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (t > 5.0 && t < 5.06) await hideCursor(page);
  },
});
