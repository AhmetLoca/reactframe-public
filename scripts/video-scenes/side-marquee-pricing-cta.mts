import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on the offer's call to action while the photo columns run.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 4.4,
  loopBlend: 0.7,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.8, { x: 1320, y: 1040 }],
      [1.3, { x: 640, y: 601 }],
      [1.8, { x: 642, y: 602 }],
      [2.3, { x: 640, y: 480 }],
      [2.8, { x: 642, y: 481 }],
      [3.3, { x: 1200, y: 945 }],
      [3.6, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(3.35)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.65)) await hideCursor(page);
  },
});
