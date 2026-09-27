import type { Page } from "playwright-core";
import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const start = { x: 400, y: 384 };

// Distance (CSS px) from the dino's nose to the nearest cactus, read off the canvas: the first
// green (#2d5a27) pixel on a row just above the ground.
const gap = (page: Page) =>
  page.evaluate(() => {
    const c = document.querySelector("canvas")!;
    const k = c.width / c.clientWidth;
    const y = Math.round((320 - 48 - 8) * k);
    const row = c.getContext("2d")!.getImageData(0, y, c.width, 1).data;
    for (let x = Math.round(104 * k); x < c.width; x++) {
      const i = x * 4;
      if (row[i] < 80 && row[i + 1] > 70 && row[i + 1] < 110 && row[i + 2] < 60) return x / k - 104;
    }
    return Infinity;
  });

let lastJump = -1;

// Start a run and hop every cactus (a tiny controller jumps when one gets close), then fade back
// to a fresh "Ready?" screen so the clip loops.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 7.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.8, start],
      [1.0, start],
      [1.5, { x: 640, y: 580 }],
      [1.8, { x: 800, y: 660 }],
    ]);
    if (p && t < 1.85) await page.mouse.move(p.x, p.y);
    if (at(0.9)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.85)) await hideCursor(page);
    if (t > 1.0 && t < 6.4 && t - lastJump > 0.5) {
      const d = await gap(page);
      if (d < 46) {
        lastJump = t;
        await page.keyboard.press("Space");
      }
    }
    if (at(6.6)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
