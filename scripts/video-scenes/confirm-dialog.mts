import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const cancel = { x: 444, y: 384 };
const discard = { x: 558, y: 384 };

const reset = (page: import("playwright-core").Page) => page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());

// Hover Cancel, click Discard (async confirm: spinner, then the dialog closes), then reopen it with
// #video-reset so the loop ends on the open dialog.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.8,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 640, y: 540 }],
      [0.65, cancel],
      [0.95, cancel],
      [1.3, discard],
      [1.5, discard],
      [2.6, discard],
      [3.0, { x: 720, y: 540 }],
      [3.3, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.6)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.35)) await hideCursor(page);
    // A key press makes the reopened dialog's focused Cancel button show its ring, as in the first frame.
    if (at(3.45)) await page.keyboard.press("Shift");
    if (at(3.55)) await reset(page);
  },
});
