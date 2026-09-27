import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Card centres and the seeded deal's pairs (read off the stage once).
const CARDS = [
  [240, 159], [347, 159], [454, 159], [561, 159],
  [240, 269], [347, 269], [454, 269], [561, 269],
  [240, 379], [347, 379], [454, 379], [561, 379],
  [240, 489], [347, 489], [454, 489], [561, 489],
].map(([x, y]) => ({ x, y }));
const PAIRS = [[2, 3], [4, 7], [1, 5], [6, 8], [0, 14], [9, 11], [10, 13], [12, 15]];

// One miss, then every pair in a row until the board clears and the confetti falls.
const CLICKS: [number, number][] = [[0.9, 0], [1.15, 1]];
PAIRS.forEach(([a, b], k) => CLICKS.push([1.9 + k * 0.55, a], [2.12 + k * 0.55, b]));

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 8.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const keys: [number, { x: number; y: number }][] = [[0.3, { x: 780, y: 590 }]];
    for (const [time, i] of CLICKS) keys.push([time - 0.1, CARDS[i]], [time + 0.03, CARDS[i]]);
    keys.push([6.6, { x: 700, y: 590 }], [6.9, { x: 820, y: 660 }]);
    const p = path(t, keys);
    if (p && t < 6.95) await page.mouse.move(p.x, p.y);
    for (const [time] of CLICKS)
      if (at(time)) {
        await page.mouse.down();
        await page.mouse.up();
      }
    if (at(6.95)) await hideCursor(page);
    if (at(7.6)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
