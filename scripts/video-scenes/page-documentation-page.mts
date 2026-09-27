import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Search for deploy, clear the search, then rest on the topic cards.
export default defineScene({
  url: "/pages/preview/documentation-page/view",
  viewport: { width: 1280, height: 960 },
  duration: 7.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 631, y: 214 }],
      [1.2, { x: 633, y: 215 }],
      [2.4, { x: 309, y: 345 }],
      [2.7, { x: 311, y: 346 }],
      [3.9, { x: 640, y: 345 }],
      [4.2, { x: 642, y: 346 }],
      [5.4, { x: 971, y: 517 }],
      [5.7, { x: 973, y: 518 }],
      [6.9, { x: 1200, y: 945 }],
      [7.2, { x: 1320, y: 1040 }],
    ]);
    if (p && t <= 7.2) await page.mouse.move(p.x, p.y);
    if (at(1.05)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.3)) await page.keyboard.type("d", { delay: 0 });
    if (at(1.4)) await page.keyboard.type("e", { delay: 0 });
    if (at(1.5)) await page.keyboard.type("p", { delay: 0 });
    if (at(1.6)) await page.keyboard.type("l", { delay: 0 });
    if (at(1.7)) await page.keyboard.type("o", { delay: 0 });
    if (at(1.8)) await page.keyboard.type("y", { delay: 0 });
    if (at(3.0)) await page.keyboard.press("Meta+A");
    if (at(3.1)) await page.keyboard.press("Backspace");
    if (at(3.3)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (t > 7.2 && t < 7.26) await hideCursor(page);
  },
});
