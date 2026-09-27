import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Open Supabase, rest on its note, and fold it away again.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 5.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 640, y: 454 }],
      [1.4, { x: 642, y: 455 }],
      [1.9, { x: 900, y: 560 }],
      [2.4, { x: 902, y: 561 }],
      [2.9, { x: 640, y: 454 }],
      [3.4, { x: 642, y: 455 }],
      [3.9, { x: 1200, y: 945 }],
      [4.2, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.05) || at(3.05)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.25)) await hideCursor(page);
  },
});
