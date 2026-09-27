import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const reel = (x: number) => ({ x, y: 300 });

// Click two reels to play their clips, then pause both and rewind them to the start, so the last
// frame matches the still thumbnail.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, reel(307)],
      [1.2, reel(307)],
      [1.8, reel(493)],
      [4.0, reel(493)],
      [4.6, { x: 700, y: 580 }],
      [4.9, { x: 800, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(1.9)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.3)) {
      await page.evaluate(() =>
        document.querySelectorAll("video").forEach((v) => {
          v.pause();
          v.currentTime = 0;
        }),
      );
    }
    if (at(4.95)) await hideCursor(page);
  },
});
