import type { Page } from "playwright-core";
import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const start = { x: 400, y: 302 };
const N = 15;

type Cell = { x: number; y: number };
// Read the board off the canvas: the head (#111), body cells (#333) and the red food.
const readBoard = (page: Page) =>
  page.evaluate((n) => {
    const c = document.querySelector("canvas")!;
    const size = c.width / n;
    const d = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
    let head: { x: number; y: number } | null = null;
    let food: { x: number; y: number } | null = null;
    const body: string[] = [];
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) {
        const i = (Math.floor(y * size + size / 2) * c.width + Math.floor(x * size + size / 2)) * 4;
        const [r, g, b] = [d[i], d[i + 1], d[i + 2]];
        if (r < 30 && g < 30 && b < 30) head = { x, y };
        else if (r > 40 && r < 70 && Math.abs(r - g) < 8 && Math.abs(g - b) < 8) body.push(`${x},${y}`);
        else if (r > 200 && g < 120 && b < 120) food = { x, y };
      }
    return { head, food, body };
  }, N);

const DIRS: [string, Cell][] = [
  ["ArrowUp", { x: 0, y: -1 }],
  ["ArrowDown", { x: 0, y: 1 }],
  ["ArrowLeft", { x: -1, y: 0 }],
  ["ArrowRight", { x: 1, y: 0 }],
];
let last: Cell | null = null;
let heading: Cell = { x: 1, y: 0 };
let pressed = "";

// Start a game and steer the snake to the food a few times (a small greedy controller reads the
// canvas each frame), then fade the card back to a fresh "Ready?" board so the clip loops.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 7.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.8, start],
      [1.0, start],
      [1.5, { x: 640, y: 580 }],
      [1.8, { x: 800, y: 660 }],
    ]);
    if (p && t < 1.8) await page.mouse.move(p.x, p.y);
    if (at(0.9)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.85)) await hideCursor(page);
    if (t > 1.0 && t < 6.0) {
      const { head, food, body } = await readBoard(page);
      if (head) {
        const moved = !!last && (head.x !== last.x || head.y !== last.y);
        if (moved) heading = { x: head.x - last!.x, y: head.y - last!.y };
        last = head;
        if (food) {
          const blocked = new Set(body);
          const options = DIRS.filter(([, d]) => !(d.x === -heading.x && d.y === -heading.y))
            .map(([key, d]) => ({ key, x: head.x + d.x, y: head.y + d.y }))
            .filter((o) => o.x >= 0 && o.y >= 0 && o.x < N && o.y < N && !blocked.has(`${o.x},${o.y}`))
            .sort((a, b) => Math.abs(a.x - food.x) + Math.abs(a.y - food.y) - (Math.abs(b.x - food.x) + Math.abs(b.y - food.y)));
          // Re-press on every new cell until the snake actually turns: a press can land between
          // ticks and be overwritten.
          const want = options[0];
          const turned = want && want.x - head.x === heading.x && want.y - head.y === heading.y;
          if (want && !turned && (want.key !== pressed || moved)) {
            pressed = want.key;
            await page.keyboard.press(pressed);
          }
        }
      }
    }
    if (at(6.1)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
