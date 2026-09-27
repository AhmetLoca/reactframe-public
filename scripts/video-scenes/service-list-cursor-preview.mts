import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Glide down the services; each row brings its preview image along with the cursor.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 7.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 400, y: 365 }],
      [1.4, { x: 402, y: 366 }],
      [1.9, { x: 700, y: 481 }],
      [2.4, { x: 702, y: 482 }],
      [2.9, { x: 500, y: 596 }],
      [3.4, { x: 502, y: 597 }],
      [3.9, { x: 800, y: 711 }],
      [4.4, { x: 802, y: 712 }],
      [4.9, { x: 600, y: 826 }],
      [5.4, { x: 602, y: 827 }],
      [5.9, { x: 1200, y: 945 }],
      [6.2, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(5.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(6.25)) await hideCursor(page);
  },
});
