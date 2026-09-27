import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Search for pricing, clear it, then rest on the quick links.
export default defineScene({
  url: "/pages/preview/error-page/view",
  viewport: { width: 1280, height: 960 },
  duration: 7.2,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 591, y: 590 }],
      [1.2, { x: 593, y: 591 }],
      [1.8, { x: 396, y: 705 }],
      [2.1, { x: 398, y: 706 }],
      [2.7, { x: 559, y: 705 }],
      [3.0, { x: 561, y: 706 }],
      [3.6, { x: 722, y: 705 }],
      [3.9, { x: 724, y: 706 }],
      [4.5, { x: 885, y: 705 }],
      [4.8, { x: 887, y: 706 }],
      [5.4, { x: 1200, y: 945 }],
      [5.7, { x: 1320, y: 1040 }],
    ]);
    if (p && t <= 5.7) await page.mouse.move(p.x, p.y);
    if (at(1.05)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.3)) await page.keyboard.type("p", { delay: 0 });
    if (at(1.36)) await page.keyboard.type("r", { delay: 0 });
    if (at(1.42)) await page.keyboard.type("i", { delay: 0 });
    if (at(1.48)) await page.keyboard.type("c", { delay: 0 });
    if (at(1.54)) await page.keyboard.type("i", { delay: 0 });
    if (at(1.6)) await page.keyboard.type("n", { delay: 0 });
    if (at(1.6600000000000001)) await page.keyboard.type("g", { delay: 0 });
    if (at(2.2)) await page.keyboard.press("Meta+A");
    if (at(2.3)) await page.keyboard.press("Backspace");
    if (at(2.5)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (t > 5.7 && t < 5.76) await hideCursor(page);
  },
});
