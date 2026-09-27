import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const speed = { x: 748, y: 557 };

// Rest on the poster's glass play button, then open the playback-speed menu and close it again.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 790, y: 20 }],
      [1.0, { x: 400, y: 300 }],
      [1.9, { x: 404, y: 304 }],
      [2.6, speed],
      [2.8, speed],
      [3.8, speed],
      [4.5, { x: 620, y: 20 }],
      [4.8, { x: 640, y: -60 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(2.7) || at(3.7)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.3)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.85)) await hideCursor(page);
  },
});
