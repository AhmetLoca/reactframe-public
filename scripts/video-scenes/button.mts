import { defineScene, path } from "./_lib.mts";

const target = { x: 412, y: 318 };

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 3,
  async frame({ t, page, at }) {
    const p = path(t, [
      [0.3, { x: 700, y: 540 }],
      [1.0, target],
      [2.33, target],
      [2.8, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.13)) await page.mouse.down();
    if (at(1.27)) await page.mouse.up();
    if (at(2.27)) await page.evaluate(() => document.getElementById("video-reset")?.click());
  },
});
