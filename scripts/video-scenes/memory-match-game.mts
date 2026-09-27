import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Card centres and the seeded deal (from the stage's seed): pairs are 0/11, 1/7, 2/8, 3/10, 4/6, 5/9.
const CARDS = [
  [303, 330], [368, 330], [432, 330], [497, 330],
  [303, 395], [368, 395], [432, 395], [497, 395],
  [303, 459], [368, 459], [432, 459], [497, 459],
].map(([x, y]) => ({ x, y }));

// One miss first (the cards flip back after 0.9s), then every pair in turn until the board clears.
const CLICKS: [number, number][] = [
  [0.9, 0], [1.3, 1],
  [2.4, 4], [2.65, 6],
  [3.2, 2], [3.45, 8],
  [4.0, 1], [4.25, 7],
  [4.8, 0], [5.05, 11],
  [5.6, 3], [5.85, 10],
  [6.4, 5], [6.65, 9],
];

// Play the deal out: one miss, then all six pairs, ending on the win screen. The stage fades back
// to a fresh deal at the end so the clip loops.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 8.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const keys: [number, { x: number; y: number }][] = [[0.3, { x: 780, y: 590 }]];
    for (const [time, i] of CLICKS) keys.push([time - 0.12, CARDS[i]], [time + 0.04, CARDS[i]]);
    keys.push([7.2, { x: 640, y: 580 }], [7.5, { x: 820, y: 660 }]);
    const p = path(t, keys);
    if (p) await page.mouse.move(p.x, p.y);
    for (const [time] of CLICKS)
      if (at(time)) {
        await page.mouse.down();
        await page.mouse.up();
      }
    if (at(7.55)) await hideCursor(page);
    if (at(7.8)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
