import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Bring Sprint to the front, then Velocity back again.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 5.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 1043, y: 466 }],
      [1.4, { x: 1045, y: 467 }],
      [1.9, { x: 685, y: 466 }],
      [2.4, { x: 687, y: 467 }],
      [2.9, { x: 151, y: 612 }],
      [3.4, { x: 153, y: 613 }],
      [3.9, { x: 1200, y: 945 }],
      [4.2, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.05) || at(2.05)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.25)) await hideCursor(page);
  },
});
