import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const replay = { x: 619, y: 187 };

// Open on the finished session, click the replay button in the title bar, and watch it type the
// commands again; the replay button comes back once it's done.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.0,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 640, y: 420 }],
      [0.8, replay],
      [1.1, replay],
      [1.6, { x: 590, y: 330 }],
      [3.6, { x: 600, y: 360 }],
      [4.0, { x: 700, y: 520 }],
      [4.3, { x: 760, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.2)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.35)) await hideCursor(page);
  },
});
