import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// The tree re-centres as it grows, so rows move up 20px while lib is open (measured both ways).
const libClosed = { x: 380, y: 360 };
const libOpen = { x: 380, y: 340 };
const utils = { x: 420, y: 380 };
const page = { x: 420, y: 280 };

// Expand lib, select utils.ts, collapse lib, then select page.tsx again so the last frame matches the
// first.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.8,
  async frame({ t, fps, page: pw, at }) {
    await stepWebAnimations(pw, fps);
    const p = path(t, [
      [0.2, { x: 620, y: 500 }],
      [0.6, libClosed],
      [0.85, libClosed],
      [1.3, utils],
      [1.6, utils],
      [2.0, libOpen],
      [2.3, libOpen],
      [2.8, page],
      [3.1, page],
      [3.6, { x: 640, y: 500 }],
      [4.0, { x: 760, y: 660 }],
    ]);
    if (p) await pw.mouse.move(p.x, p.y);
    if (at(0.7) || at(1.45) || at(2.15) || at(2.95)) {
      await pw.mouse.down();
      await pw.mouse.up();
    }
    if (at(3.3)) await pw.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.05)) await hideCursor(pw);
  },
});
