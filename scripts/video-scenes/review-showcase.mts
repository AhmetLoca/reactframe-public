import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const next = { x: 748, y: 436 };
const firstAvatar = { x: 82, y: 432 };

// Step forward twice with the arrow (portrait, role and quote cross-fade together), then jump
// back to the first review from its avatar.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.2,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, next],
      [2.6, next],
      [3.1, firstAvatar],
      [3.6, firstAvatar],
      [4.2, { x: 400, y: 580 }],
      [4.5, { x: 500, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(2.1) || at(3.3)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.55)) await hideCursor(page);
  },
});
