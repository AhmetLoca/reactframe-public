import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const close = { x: 567, y: 288 };

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 3.5,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 660, y: 480 }],
      [0.75, close],
      [1.1, close],
      [1.5, { x: 700, y: 520 }],
      [1.9, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.9)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.95)) await hideCursor(page);
    // Remount the toast so its entrance plays and the clip ends on the static frame.
    if (at(2.0)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());
  },
});
