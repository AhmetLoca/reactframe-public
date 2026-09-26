import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const close = { x: 635, y: 165 };

const reset = (page: import("playwright-core").Page) => page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());

// Close the drawer with its × button, then slide it back in (#video-reset) so the loop closes on
// the open drawer.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.2,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 700, y: 480 }],
      [0.7, close],
      [1.0, close],
      [1.5, { x: 740, y: 400 }],
      [1.9, { x: 840, y: 420 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.1)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.95)) await hideCursor(page);
    // A key press makes the reopened drawer's close button show its focus ring, as in the first frame.
    if (at(2.3)) await page.keyboard.press("Shift");
    if (at(2.4)) await reset(page);
  },
});
