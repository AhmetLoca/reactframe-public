import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const board = { x: 400, y: 420 };

// Click the board, then hold fire while strafing left and right so the ship picks off invaders
// (the wave waits for this first key). The stage fades back to a fresh wave at the end.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 7.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.8, board],
      [1.0, board],
      [1.5, { x: 700, y: 590 }],
      [1.8, { x: 820, y: 660 }],
    ]);
    if (p && t < 1.85) await page.mouse.move(p.x, p.y);
    if (at(0.9)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.85)) await hideCursor(page);
    if (at(1.1)) await page.keyboard.down(" ");
    if (at(1.2)) await page.keyboard.down("ArrowLeft");
    if (at(2.2)) await page.keyboard.up("ArrowLeft");
    if (at(2.25)) await page.keyboard.down("ArrowRight");
    if (at(4.1)) await page.keyboard.up("ArrowRight");
    if (at(4.15)) await page.keyboard.down("ArrowLeft");
    if (at(5.4)) await page.keyboard.up("ArrowLeft");
    if (at(5.6)) await page.keyboard.up(" ");
    if (at(6.2)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
