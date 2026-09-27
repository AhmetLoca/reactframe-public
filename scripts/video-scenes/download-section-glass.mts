import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Switch to light mode and back, then rest on the store buttons.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 36, y: 116 }],
      [1.4, { x: 38, y: 117 }],
      [1.9, { x: 36, y: 116 }],
      [2.4, { x: 38, y: 117 }],
      [2.9, { x: 559, y: 445 }],
      [3.4, { x: 561, y: 446 }],
      [3.9, { x: 724, y: 445 }],
      [4.4, { x: 726, y: 446 }],
      [4.9, { x: 1200, y: 945 }],
      [5.2, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.05) || at(2.05)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(5.25)) await hideCursor(page);
  },
});
