import type { Page } from "playwright-core";
import { defineScene, hideCursor, stepWebAnimations } from "./_lib.mts";

const COLS = 9;
type Cell = { i: number; x: number; y: number; label: string };

const readCells = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll<HTMLButtonElement>("button[aria-label]")]
      .filter((b) => /^(Hidden cell|Flagged|Empty|Mine|\d adjacent)$/.test(b.getAttribute("aria-label")!))
      .map((b, i) => {
        const r = b.getBoundingClientRect();
        return { i, x: r.left + r.width / 2, y: r.top + r.height / 2, label: b.getAttribute("aria-label")! };
      }),
  );

const neighbours = (i: number) => {
  const r = Math.floor(i / COLS);
  const c = i % COLS;
  const out: number[] = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const rr = r + dr;
      const cc = c + dc;
      if (rr >= 0 && cc >= 0 && rr < COLS && cc < COLS) out.push(rr * COLS + cc);
    }
  return out;
};

// One deduction: a number whose hidden neighbours must all be mines (flag one), or whose mines are
// all flagged already (open one of the rest). Returns null when stuck.
const nextMove = (cells: Cell[]): { i: number; flag: boolean } | null => {
  for (const c of cells) {
    const m = /^(\d) adjacent$/.exec(c.label);
    if (!m) continue;
    const n = Number(m[1]);
    const nb = neighbours(c.i).map((j) => cells[j]);
    const hidden = nb.filter((x) => x.label === "Hidden cell");
    const flags = nb.filter((x) => x.label === "Flagged").length;
    if (hidden.length && n === flags + hidden.length) return { i: hidden[0].i, flag: true };
    if (hidden.length && n === flags) return { i: hidden[0].i, flag: false };
  }
  return null;
};

const START = 40; // first click: the middle of the board (mines are placed away from it)
let pos = { x: 780, y: 590 };
let target: { x: number; y: number } | null = null;
let pending: { i: number; flag: boolean } | null = null;
let clickAt = 0;

// Open the middle of the board, then play it out with simple deductions: flag certain mines,
// open certain safe cells, one move every ~0.4s. The stage fades back to a fresh board at the end.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 7.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    if (t >= 0.5 && t < 5.4 && !pending && t >= clickAt) {
      const cells = await readCells(page);
      const move = t < 1.2 ? { i: START, flag: false } : nextMove(cells);
      if (move && cells[move.i]) {
        pending = move;
        target = { x: cells[move.i].x, y: cells[move.i].y };
        clickAt = t + 0.3;
      }
    }
    if (t >= 5.4) target = { x: 820, y: 660 };
    if (target) {
      pos = { x: pos.x + (target.x - pos.x) * 0.3, y: pos.y + (target.y - pos.y) * 0.3 };
      if (t < 6.0) await page.mouse.move(pos.x, pos.y);
    }
    if (pending && t >= clickAt) {
      await page.mouse.move(target!.x, target!.y);
      await page.mouse.down({ button: pending.flag ? "right" : "left" });
      await page.mouse.up({ button: pending.flag ? "right" : "left" });
      pending = null;
      clickAt = t + 0.12;
    }
    if (at(6.0)) await hideCursor(page);
    if (at(6.2)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
