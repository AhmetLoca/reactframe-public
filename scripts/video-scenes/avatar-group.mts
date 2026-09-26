import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const y = 300;

// Hover the group so it spreads out, glide across the avatars (each shows its name), then leave so it
// stacks back up.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.4,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 220, y: 460 }],
      [0.6, { x: 280, y }],
      [0.9, { x: 280, y }],
      [2.6, { x: 530, y }],
      [2.9, { x: 530, y }],
      [3.4, { x: 620, y: 460 }],
      [3.8, { x: 700, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(3.85)) await hideCursor(page);
  },
});
