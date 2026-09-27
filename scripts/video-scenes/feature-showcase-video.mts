import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Switch the clip to Studio and back to Portrait, then rest on Get started.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 5.4,
  loopBlend: 0.7,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.8, { x: 1320, y: 1040 }],
      [1.3, { x: 1002, y: 745 }],
      [1.8, { x: 1004, y: 746 }],
      [2.3, { x: 921, y: 745 }],
      [2.8, { x: 923, y: 746 }],
      [3.3, { x: 113, y: 785 }],
      [3.8, { x: 115, y: 786 }],
      [4.3, { x: 1200, y: 945 }],
      [4.6, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.45) || at(2.45)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.35)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.65)) await hideCursor(page);
  },
});
