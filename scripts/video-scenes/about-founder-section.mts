import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on both buttons, then the founder's note.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 5.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 139, y: 652 }],
      [1.4, { x: 141, y: 653 }],
      [1.9, { x: 317, y: 652 }],
      [2.4, { x: 319, y: 653 }],
      [2.9, { x: 944, y: 480 }],
      [3.4, { x: 946, y: 481 }],
      [3.9, { x: 1200, y: 945 }],
      [4.2, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(3.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.25)) await hideCursor(page);
  },
});
