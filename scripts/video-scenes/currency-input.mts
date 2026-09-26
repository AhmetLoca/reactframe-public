import { defineScene, ease, hideCursor, panCamera, path, stepWebAnimations } from "./_lib.mts";

const PAN = -110;
const field = { x: 400, y: 300 };
const chip = { x: 527, y: 300 };
// Menu rows once the camera has panned up by PAN.
const chipPanned = { x: 527, y: 300 + PAN };
const usd = { x: 420, y: 260 };
const eur = { x: 420, y: 308 };

const ramp = (t: number, t0: number, t1: number) => ease(Math.min(1, Math.max(0, (t - t0) / (t1 - t0))));

// Step the amount up and back with the arrow keys, switch to EUR (the symbol slides to €) and back
// to USD, then leave, so it ends on the starting frame.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.6,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    await panCamera(page, PAN * (ramp(t, 1.75, 2.15) - ramp(t, 4.2, 4.6)));
    const p = path(t, [
      [0.25, { x: 620, y: 470 }],
      [0.65, field],
      [1.55, field],
      [1.75, chip],
      [2.15, chipPanned],
      [2.35, eur],
      [2.6, eur],
      [2.95, chipPanned],
      [3.3, chipPanned],
      [3.6, usd],
      [3.9, usd],
      [4.2, chipPanned],
      [4.6, { x: 700, y: 520 }],
      [5.0, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.75) || at(1.8) || at(2.5) || at(3.2) || at(3.8)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    for (const [time, key] of [[0.9, "ArrowUp"], [1.0, "ArrowUp"], [1.1, "ArrowUp"], [1.3, "ArrowDown"], [1.4, "ArrowDown"], [1.5, "ArrowDown"]] as const) {
      if (at(time)) await page.keyboard.press(key);
    }
    if (at(4.3)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(5.05)) await hideCursor(page);
  },
});
