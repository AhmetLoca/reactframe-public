import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const board = { x: 400, y: 420 };
// [time, key, down?]
const KEYS: [number, string, boolean][] = [
  // Hop up onto the low platform and its coin (right held only part of the jump).
  [1.0, "ArrowRight", true],
  [1.0, "ArrowUp", true],
  [1.3, "ArrowUp", false],
  [1.5, "ArrowRight", false],
  // Walk to its edge and jump up to the first high platform.
  [2.1, "ArrowRight", true],
  [2.3, "ArrowUp", true],
  [2.5, "ArrowUp", false],
  // Run through its coin and leap across to the second one.
  [3.35, "ArrowUp", true],
  [3.55, "ArrowUp", false],
  [3.97, "ArrowRight", false],
  [4.5, "ArrowRight", true],
  [5.0, "ArrowRight", false],
];

// Click into the level, then hop up the platforms collecting all three coins, which clears the level. The stage fades
// back to a fresh level at the end.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 7.2,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.8, board],
      [0.9, board],
      [1.4, { x: 700, y: 590 }],
      [1.7, { x: 820, y: 660 }],
    ]);
    if (p && t < 1.75) await page.mouse.move(p.x, p.y);
    if (at(0.85)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.75)) await hideCursor(page);
    for (const [time, key, down] of KEYS) if (at(time)) await (down ? page.keyboard.down(key) : page.keyboard.up(key));
    if (at(6.4)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
