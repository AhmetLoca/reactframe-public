import type { Page } from "playwright-core";
import { defineScene, hideCursor, stepWebAnimations } from "./_lib.mts";

// The ball's height on the court, in page px, read off the canvas (the brightest blob away from
// the two paddles), plus the court's box.
const readBall = (page: Page) =>
  page.evaluate(() => {
    const c = document.querySelector("canvas")!;
    const r = c.getBoundingClientRect();
    const d = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
    let sy = 0;
    let n = 0;
    for (let y = 0; y < c.height; y += 3)
      for (let x = 60; x < c.width - 60; x += 3) {
        if (Math.abs(x - c.width / 2) < 6) continue;
        const i = (y * c.width + x) * 4;
        if (d[i] > 200 && d[i + 1] > 200 && d[i + 2] > 200) {
          sy += y;
          n++;
        }
      }
    return { box: { x: r.left, y: r.top, w: r.width, h: r.height }, ballY: n ? r.top + (sy / n) * (r.height / c.height) : null };
  });

let pos = { x: 780, y: 590 };
let aimY = 0;

// Click the court to serve, then hold the pointer down and track the ball with the left paddle for
// a short rally. The stage fades back to a fresh game at the end.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 7.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const { box, ballY } = await readBall(page);
    const court = { x: box.x + box.w * 0.18, y: box.y + box.h / 2 };
    if (!aimY) aimY = court.y;
    if (t < 0.9) {
      const k = Math.max(0, Math.min(1, (t - 0.3) / 0.6));
      const e = k * k * (3 - 2 * k);
      pos = { x: 780 + (court.x - 780) * e, y: 590 + (court.y - 590) * e };
    } else if (t < 5.8) {
      if (ballY !== null) aimY += (ballY - aimY) * 0.35;
      pos = { x: court.x, y: Math.max(box.y + 8, Math.min(box.y + box.h - 8, aimY)) };
    } else {
      const k = Math.min(1, (t - 5.8) / 0.4);
      pos = { x: court.x + (820 - court.x) * k, y: pos.y + (660 - pos.y) * k };
    }
    if (t < 6.25) await page.mouse.move(pos.x, pos.y);
    if (at(0.9)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.0)) await page.mouse.down();
    if (at(5.8)) await page.mouse.up();
    if (at(6.25)) await hideCursor(page);
    if (at(6.3)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
