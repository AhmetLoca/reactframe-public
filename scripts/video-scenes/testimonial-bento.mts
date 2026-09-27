import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Scroll down through the testimonial cards, rest on one, and scroll back up to the heading.
export default defineScene({
  viewport: { width: 1280, height: 960 },
  duration: 6.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 640, y: 238 }],
      [1.4, { x: 642, y: 240 }],
      [2.2, { x: 400, y: 560 }],
      [3.6, { x: 402, y: 562 }],
      [5.2, { x: 1200, y: 945 }],
      [5.5, { x: 1320, y: 1040 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    for (const s of [1.8, 2.1]) if (at(s)) await page.mouse.wheel(0, 300);
    for (const s of [4.0, 4.3]) if (at(s)) await page.mouse.wheel(0, -300);
    if (at(5.55)) await hideCursor(page);
  },
});
