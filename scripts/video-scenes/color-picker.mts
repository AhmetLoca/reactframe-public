import { defineScene, ease, hideCursor, panCamera, path, stepWebAnimations } from "./_lib.mts";

const PAN = -140;
const trigger = { x: 400, y: 300 };
// Popover positions once the camera has panned up by PAN.
const svFrom = { x: 380, y: 330 };
const svTo = { x: 480, y: 280 };
const blue = { x: 441, y: 541 };
const green = { x: 506, y: 541 };
const hex = { x: 425, y: 493 };
const HEX = "F59E0B";

const ramp = (t: number, t0: number, t1: number) => ease(Math.min(1, Math.max(0, (t - t0) / (t1 - t0))));

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5,
  async frame({ f, t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    await panCamera(page, PAN * (ramp(t, 0.85, 1.35) - ramp(t, 3.95, 4.45)));
    const p = path(t, [
      [0.25, { x: 660, y: 480 }],
      [0.7, trigger],
      [0.9, trigger],
      [1.4, svFrom],
      [1.55, svFrom],
      [2.15, svTo],
      [2.3, svTo],
      [2.55, blue],
      [2.75, blue],
      [2.95, green],
      [3.1, green],
      [3.3, hex],
      [3.95, hex],
      [4.35, { x: 700, y: 520 }],
      [4.8, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.8) || at(2.65) || at(3.0) || at(3.35)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    // Drag across the saturation/brightness area.
    if (at(1.55)) await page.mouse.down();
    if (at(2.15)) await page.mouse.up();
    // Type the starting colour back in, so the last frame matches the first.
    if (at(3.4)) await page.keyboard.press("ControlOrMeta+A");
    const first = Math.round(3.45 * fps);
    const idx = (f - first) / 2;
    if (f >= first && Number.isInteger(idx) && idx < HEX.length) await page.keyboard.insertText(HEX[idx]);
    if (at(3.85)) await page.keyboard.press("Enter");
    if (at(3.92)) await page.keyboard.press("Escape");
    if (at(4.0)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.9)) await hideCursor(page);
  },
});
