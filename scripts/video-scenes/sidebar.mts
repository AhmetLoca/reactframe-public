import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const inbox = { x: 400, y: 261 };
const reports = { x: 400, y: 309 };
const home = { x: 400, y: 214 };
const collapse = { x: 299, y: 146 }; // toggle while expanded
const expand = { x: 400, y: 146 }; // same toggle once the rail has shrunk to icons

// Pick Inbox and Reports, collapse to the icon rail and expand again, then back to Home so the
// last frame matches the first.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.0,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 660, y: 480 }],
      [0.6, inbox],
      [0.85, inbox],
      [1.15, reports],
      [1.4, reports],
      [1.85, collapse],
      [2.1, collapse],
      [2.5, expand],
      [3.0, expand],
      [3.4, home],
      [3.7, home],
      [4.2, { x: 700, y: 520 }],
      [4.6, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.7) || at(1.25) || at(1.95) || at(2.65) || at(3.5)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.9)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.65)) await hideCursor(page);
  },
});
