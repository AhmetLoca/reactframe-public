import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Pick the second photo, Olive and 42mm, then set photo, colour and size back.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 8.1,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 281, y: 648 }],
      [1.4, { x: 283, y: 649 }],
      [1.9, { x: 735, y: 305 }],
      [2.4, { x: 737, y: 306 }],
      [2.9, { x: 911, y: 375 }],
      [3.4, { x: 913, y: 376 }],
      [3.9, { x: 144, y: 648 }],
      [4.4, { x: 146, y: 649 }],
      [4.9, { x: 671, y: 305 }],
      [5.4, { x: 673, y: 306 }],
      [5.9, { x: 838, y: 375 }],
      [6.4, { x: 840, y: 376 }],
      [6.9, { x: 1200, y: 945 }],
      [7.2, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.05) || at(2.05) || at(3.05) || at(4.05) || at(5.05) || at(6.05)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(6.95)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(7.25)) await hideCursor(page);
  },
});
