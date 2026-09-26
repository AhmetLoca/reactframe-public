import { defineScene, ease, hideCursor, panCamera, path, stepWebAnimations } from "./_lib.mts";

const PAN = -170;
const country = { x: 275, y: 300 };
const countryPanned = { x: 275, y: 300 + PAN };

const ramp = (t: number, t0: number, t1: number) => ease(Math.min(1, Math.max(0, (t - t0) / (t1 - t0))));

// Open the country menu, search "ger" and pick Germany (the number re-formats), then search "tür"
// and go back to Türkiye so the clip ends where it began.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.2,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    await panCamera(page, PAN * (ramp(t, 0.85, 1.35) - ramp(t, 3.9, 4.4)));
    const p = path(t, [
      [0.25, { x: 660, y: 480 }],
      [0.7, country],
      [0.85, country],
      [1.35, countryPanned],
      [2.6, countryPanned],
      [3.9, countryPanned],
      [4.4, { x: 700, y: 520 }],
      [4.8, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.8) || at(2.75)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    const typed: [number, string][] = [[1.5, "g"], [1.62, "e"], [1.74, "r"], [3.0, "t"], [3.12, "ü"], [3.24, "r"]];
    for (const [time, ch] of typed) if (at(time)) await page.keyboard.type(ch);
    if (at(2.15) || at(3.65)) await page.keyboard.press("Enter");
    if (at(4.2)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.85)) await hideCursor(page);
  },
});
