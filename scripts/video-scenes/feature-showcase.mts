import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Switch the photo to Studio and back to Portrait, then rest on Get started.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 5.4,
  loopBlend: 0.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.7, { x: 1320, y: 1040 }],
      [1.2, { x: 1003, y: 734 }],
      [1.4, { x: 1005, y: 735 }],
      [1.9, { x: 920, y: 734 }],
      [2.4, { x: 922, y: 735 }],
      [2.9, { x: 98, y: 795 }],
      [3.4, { x: 100, y: 796 }],
      [3.9, { x: 1200, y: 945 }],
      [4.2, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.3) || at(2.2)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.25)) await hideCursor(page);
  },
});
