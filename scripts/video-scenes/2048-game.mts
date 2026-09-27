import { defineScene, hideCursor, stepWebAnimations } from "./_lib.mts";

const C = { x: 400, y: 390 };
const D = 70;
const DIRS: Record<string, [number, number]> = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };
// Each swipe: 0.15s press-and-drag, then a pause while the tiles slide and merge.
const SWIPES = ["left", "down", "right", "down", "left", "up", "left"];
const T0 = 0.9;
const STEP = 0.6;

// Swipe the board a few times so tiles slide, merge and the score climbs, then fade the card out
// and back in on a fresh board. The fresh board's two starting tiles can land elsewhere, so a short
// crossfade covers the loop.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.8,
  loopBlend: 0.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    let pos = { x: 780, y: 590 };
    if (t < T0) {
      const k = Math.min(1, Math.max(0, (t - 0.3) / (T0 - 0.3)));
      const e = k * k * (3 - 2 * k);
      pos = { x: 780 + (C.x - 780) * e, y: 590 + (C.y - 590) * e };
    } else {
      const i = Math.floor((t - T0) / STEP);
      const local = t - T0 - i * STEP;
      if (i < SWIPES.length) {
        const [dx, dy] = DIRS[SWIPES[i]];
        const k = Math.min(1, local / 0.15);
        const back = Math.max(0, Math.min(1, (local - 0.25) / 0.3));
        const reach = k * (1 - back);
        pos = { x: C.x + dx * D * reach, y: C.y + dy * D * reach };
        if (at(T0 + i * STEP)) await page.mouse.move(C.x, C.y);
        if (at(T0 + i * STEP)) await page.mouse.down();
        if (at(T0 + i * STEP + 0.15)) {
          await page.mouse.move(C.x + dx * D, C.y + dy * D);
          await page.mouse.up();
        }
      } else {
        const k = Math.min(1, (t - T0 - SWIPES.length * STEP) / 0.5);
        const e = k * k * (3 - 2 * k);
        pos = { x: C.x + (820 - C.x) * e, y: C.y + (660 - C.y) * e };
      }
    }
    // Stop moving once off-frame: any mousemove would show the drawn cursor again.
    const exit = T0 + SWIPES.length * STEP + 0.55;
    if (t < exit) await page.mouse.move(pos.x, pos.y);
    if (at(exit)) await hideCursor(page);
    if (at(6.0)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
