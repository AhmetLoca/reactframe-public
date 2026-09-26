import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const overview = { x: 290, y: 300 };
const activity = { x: 404, y: 300 };
const settings = { x: 514, y: 300 };

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 3.8,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 660, y: 480 }],
      [0.7, settings],
      [1.0, settings],
      [1.45, activity],
      [1.75, activity],
      [2.2, overview],
      [2.6, overview],
      [3.0, { x: 700, y: 520 }],
      [3.45, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    // Settings -> Activity -> back to Overview, so the last frame matches the first.
    if (at(0.8) || at(1.55) || at(2.3)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(2.7)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(3.5)) await hideCursor(page);
  },
});
