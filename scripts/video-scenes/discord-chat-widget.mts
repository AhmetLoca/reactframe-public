import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const reply = { x: 586, y: 313 };

// The panel opens on its own; pick a quick reply (it posts as your message and the agent answers),
// then the stage fades the widget out and remounts it, so it reopens exactly as the clip began.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 7.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.4, { x: 380, y: 620 }],
      [1.0, reply],
      [1.3, reply],
      [2.0, { x: 330, y: 470 }],
      [2.4, { x: 300, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.15)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(2.45)) await hideCursor(page);
    if (at(4.2)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
