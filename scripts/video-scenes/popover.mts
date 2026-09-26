import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// 640x480 so the portaled popover scales up with everything else (see the stage).
const share = { x: 320, y: 158 };

// The popover starts open. Click Share to close it, click again to reopen, then leave.
export default defineScene({
  viewport: { width: 640, height: 480 },
  duration: 3.8,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 520, y: 60 }],
      [0.65, share],
      [0.95, share],
      [1.9, share],
      [2.4, { x: 560, y: 120 }],
      [2.8, { x: 680, y: 80 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.8) || at(1.75)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(2.2)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(2.85)) await hideCursor(page);
  },
});
