import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const toggle = { x: 29, y: 75 };

// Glance over the hours card (its "Open now" dot pulses), then flip the theme to light and back
// with the toggle in the corner, so the clip ends on the dark card it opened with.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [1.0, { x: 470, y: 260 }],
      [1.6, { x: 450, y: 330 }],
      [2.2, toggle],
      [2.4, toggle],
      [4.0, toggle],
      [4.6, { x: 300, y: 420 }],
      [5.0, { x: 400, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(2.3) || at(3.9)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.2)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(5.05)) await hideCursor(page);
  },
});
