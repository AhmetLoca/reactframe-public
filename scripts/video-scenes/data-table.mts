import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const all = { x: 585, y: 143 };
const active = { x: 626, y: 143 };
const inactive = { x: 678, y: 143 };
const nameHead = { x: 187, y: 182 };

// Filter to Active, then Inactive, sort by name, sort back, and return to All, so the table ends
// as it began.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.8, active],
      [1.4, active],
      [1.7, inactive],
      [2.3, inactive],
      [2.8, nameHead],
      [3.9, nameHead],
      [4.4, all],
      [4.8, all],
      [5.3, { x: 700, y: 590 }],
      [5.6, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.95) || at(1.85) || at(2.95) || at(3.5) || at(3.75) || at(4.55)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(5.65)) await hideCursor(page);
  },
});
