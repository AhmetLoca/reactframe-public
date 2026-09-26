import { defineScene, ease, hideCursor, panCamera, path, stepWebAnimations } from "./_lib.mts";

const PAN = -150;
const field = { x: 400, y: 300 };
// Popover rows once the camera has panned up by PAN. Each column scrolls its selected row to the
// middle (y 340), so the row below it is always at 383 and the row above at 298.
const hourBelow = { x: 299, y: 383 };
const minBelow = { x: 369, y: 383 };
const hourAbove = { x: 299, y: 298 };
const minAbove = { x: 369, y: 298 };
const fieldPanned = { x: 400, y: 300 + PAN };

const ramp = (t: number, t0: number, t1: number) => ease(Math.min(1, Math.max(0, (t - t0) / (t1 - t0))));

// Open, step to 10:35 (the pills slide down), step back to 9:30 and close, so it ends as it began.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.2,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    await panCamera(page, PAN * (ramp(t, 0.85, 1.35) - ramp(t, 3.85, 4.35)));
    const p = path(t, [
      [0.25, { x: 660, y: 480 }],
      [0.7, field],
      [0.9, field],
      [1.45, hourBelow],
      [1.65, hourBelow],
      [1.95, minBelow],
      [2.15, minBelow],
      [2.6, hourAbove],
      [2.8, hourAbove],
      [3.1, minAbove],
      [3.3, minAbove],
      [3.65, fieldPanned],
      [3.8, fieldPanned],
      [4.4, { x: 700, y: 520 }],
      [4.8, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.8) || at(1.55) || at(2.05) || at(2.7) || at(3.2) || at(3.75)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.0)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.85)) await hideCursor(page);
  },
});
