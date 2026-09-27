import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on four tiles in turn; each fills with its photo or clip.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 250, y: 512 }],
      [1.4, { x: 252, y: 513 }],
      [1.9, { x: 640, y: 512 }],
      [2.4, { x: 642, y: 513 }],
      [2.9, { x: 1024, y: 512 }],
      [3.4, { x: 1026, y: 513 }],
      [3.9, { x: 640, y: 794 }],
      [4.4, { x: 642, y: 795 }],
      [4.9, { x: 1200, y: 945 }],
      [5.2, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(4.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(5.25)) await hideCursor(page);
  },
});
