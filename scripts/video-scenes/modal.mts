import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const confirm = { x: 549, y: 346 };

const reset = (page: import("playwright-core").Page) => page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());

// Click Confirm to dismiss the dialog, let the empty frame breathe, then reopen it (#video-reset)
// so the entrance animation plays and the loop closes on the open dialog.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.2,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 680, y: 500 }],
      [0.7, confirm],
      [1.0, confirm],
      [1.5, { x: 720, y: 520 }],
      [1.9, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.1)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.95)) await hideCursor(page);
    // A key press makes Chrome treat the next programmatic focus as keyboard focus, so the close
    // button gets its focus ring back when the dialog reopens, as in the first frame.
    if (at(2.3)) await page.keyboard.press("Shift");
    if (at(2.4)) await reset(page);
  },
});
