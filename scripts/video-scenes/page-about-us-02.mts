import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Rest on the headline, the polaroids and the team row.
export default defineScene({
  url: "/pages/preview/about-us-02/view",
  viewport: { width: 1280, height: 960 },
  duration: 5.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 400, y: 250 }],
      [1.2, { x: 402, y: 251 }],
      [1.9, { x: 900, y: 450 }],
      [2.2, { x: 902, y: 451 }],
      [2.9, { x: 640, y: 800 }],
      [3.2, { x: 642, y: 801 }],
      [3.9, { x: 1200, y: 945 }],
      [4.2, { x: 1320, y: 1040 }],
    ]);
    if (p && t <= 4.2) await page.mouse.move(p.x, p.y);
    if (t > 4.2 && t < 4.26) await hideCursor(page);
  },
});
