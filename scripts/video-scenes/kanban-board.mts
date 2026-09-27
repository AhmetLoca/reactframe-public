import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const card = { x: 145, y: 193 };
const drop = { x: 415, y: 365 };

// Drag "Define onboarding flow" from Backlog into In Progress. The stage then fades the board back
// to its starting order. Recorded at 1100x825 so all four columns show without scaling the board.
export default defineScene({
  viewport: { width: 1100, height: 825 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1080, y: 810 }],
      [0.9, card],
      [1.2, card],
      [2.4, drop],
      [2.7, drop],
      [3.4, { x: 900, y: 810 }],
      [3.7, { x: 1130, y: 900 }],
    ]);
    if (p && t < 3.75) await page.mouse.move(p.x, p.y);
    if (at(1.1)) await page.mouse.down();
    if (at(2.6)) await page.mouse.up();
    if (at(3.75)) await hideCursor(page);
    if (at(5.2)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
