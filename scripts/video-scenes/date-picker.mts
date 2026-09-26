import { defineScene, ease, hideCursor, panCamera, path, stepWebAnimations } from "./_lib.mts";

const PAN = -248;
const field = { x: 380, y: 300 };
// Calendar positions once the camera has panned up by PAN.
const next = { x: 615, y: 128 };
const prev = { x: 287, y: 128 };
const day18 = { x: 557, y: 323 };
const day25 = { x: 557, y: 376 };

const ramp = (t: number, t0: number, t1: number) => ease(Math.min(1, Math.max(0, (t - t0) / (t1 - t0))));

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.5,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    await panCamera(page, PAN * (ramp(t, 0.85, 1.35) - ramp(t, 3.15, 3.65)));
    const p = path(t, [
      [0.25, { x: 660, y: 480 }],
      [0.7, field],
      [0.9, field],
      [1.4, next],
      [1.6, next],
      [1.95, prev],
      [2.15, prev],
      [2.55, day18],
      [2.75, day18],
      [2.95, day25],
      [3.1, day25],
      [3.6, { x: 700, y: 520 }],
      [4.2, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    // Open, flip to October and back, then re-pick the 25th so the value ends where it began.
    if (at(0.8) || at(1.5) || at(2.05) || at(3.05)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.2)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.3)) await hideCursor(page);
  },
});
