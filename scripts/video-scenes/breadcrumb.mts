import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Measured after the first click: the shorter trail re-centres, so Home sits further right.
const home = { x: 320, y: 300 };
const components = { x: 372, y: 300 };

const reset = (page: import("playwright-core").Page) => page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement | null)?.click());

// Click Components, then Home (the trail trims each time), then two reset presses walk it back
// to Home › Components › Breadcrumb so the last frame matches the first.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.2,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 640, y: 470 }],
      [0.75, components],
      [1.05, components],
      [1.5, home],
      [1.85, home],
      [2.3, { x: 660, y: 500 }],
      [2.7, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(0.85) || at(1.6)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(2.0)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(2.75)) await hideCursor(page);
    if (at(2.9) || at(3.4)) await reset(page);
  },
});
