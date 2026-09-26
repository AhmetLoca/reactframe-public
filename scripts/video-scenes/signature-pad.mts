import { defineScene, ease, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// A cursive-looking signature: steady rightward motion with circular loops laid over it, the loops
// shrinking toward the end like a trailing hand.
function sig(t: number) {
  const loops = 5 * Math.PI * 2 * t;
  const fade = 0.6 + 0.4 * Math.sin(Math.PI * Math.min(1, t * 1.15));
  return { x: 215 + 320 * t - 30 * Math.cos(loops) * fade, y: 338 - 34 * Math.sin(loops) * fade - 12 * t };
}

const clear = { x: 623, y: 233 };
const clamp = (v: number) => Math.min(1, Math.max(0, v));

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.2,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const start = sig(0);
    // Stroke 1: the signature, 0.7s → 2.5s. Stroke 2: an underline, 2.75s → 3.1s.
    if (t >= 0.7 && t <= 2.5) {
      // Walk the curve itself in small steps each frame, so the ink follows the loops smoothly.
      const to = ease(clamp((t - 0.7) / 1.8));
      const from = ease(clamp((t - 1 / fps - 0.7) / 1.8));
      for (let k = 1; k <= 8; k++) {
        const pt = sig(from + ((to - from) * k) / 8);
        await page.mouse.move(pt.x, pt.y);
      }
      if (at(0.7)) await page.mouse.down();
      if (at(2.5)) await page.mouse.up();
      return;
    }
    if (t >= 2.75 && t <= 3.1) {
      const k = clamp((t - 2.75) / 0.35);
      await page.mouse.move(235 + 300 * k, 393 - 6 * k, { steps: 3 });
      if (at(2.75)) await page.mouse.down();
      if (at(3.1)) await page.mouse.up();
      return;
    }
    const p = path(t, [
      [0.2, { x: 620, y: 500 }],
      [0.6, start],
      [2.55, sig(1)],
      [2.7, { x: 235, y: 393 }],
      [3.15, { x: 535, y: 387 }],
      [3.9, clear],
      [4.15, clear],
      [4.55, { x: 700, y: 520 }],
      [4.85, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(4.05)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.3)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.9)) await hideCursor(page);
  },
});
