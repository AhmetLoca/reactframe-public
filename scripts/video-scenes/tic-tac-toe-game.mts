import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const CELLS = [
  [315, 234], [400, 234], [485, 234],
  [315, 320], [400, 320], [485, 320],
  [315, 405], [400, 405], [485, 405],
].map(([x, y]) => ({ x, y }));
// Circle, Cross, Circle, Cross, Circle: Circle takes the right column.
const MOVES = [2, 0, 5, 4, 8];
const T0 = 0.8;
const STEP = 0.55;

// Play a quick two-player game to a Circle win down the right column (the line draws and confetti
// falls), then fade the board out and back in fresh so the clip loops.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const keys: [number, { x: number; y: number }][] = [[0.3, { x: 780, y: 590 }]];
    MOVES.forEach((m, i) => {
      keys.push([T0 + i * STEP - 0.05, CELLS[m]], [T0 + i * STEP + 0.1, CELLS[m]]);
    });
    keys.push([4.4, { x: 620, y: 560 }], [4.7, { x: 800, y: 660 }]);
    const p = path(t, keys);
    if (p) await page.mouse.move(p.x, p.y);
    for (let i = 0; i < MOVES.length; i++) {
      if (at(T0 + i * STEP + 0.03)) {
        await page.mouse.down();
        await page.mouse.up();
      }
    }
    if (at(4.75)) await hideCursor(page);
    if (at(5.8)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
