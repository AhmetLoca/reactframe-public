import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Glide across the card so it lifts, picks up the accent border and the spotlight follows the pointer,
// then leave so it settles back.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.2,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 200, y: 470 }],
      [0.6, { x: 270, y: 330 }],
      [1.4, { x: 510, y: 250 }],
      [2.1, { x: 470, y: 340 }],
      [2.6, { x: 330, y: 280 }],
      [3.1, { x: 600, y: 470 }],
      [3.5, { x: 720, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(3.55)) await hideCursor(page);
  },
});
