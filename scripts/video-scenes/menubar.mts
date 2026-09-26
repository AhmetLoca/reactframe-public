import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const file = { x: 334, y: 190 };
const edit = { x: 395, y: 190 };
const view = { x: 462, y: 190 };
const newTab = { x: 420, y: 248 };
const open = { x: 420, y: 289 };

// The File menu is open from the first frame. Hovering the bar switches menus (Edit, View, back to
// File), then the pointer walks the File items and settles on "New Tab" so the loop closes.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.4,
  async frame({ t, fps, page }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      // Enter from straight above Edit, so the pointer doesn't brush View on the way in.
      [0.2, { x: 410, y: 40 }],
      [0.6, edit],
      [0.95, edit],
      [1.3, view],
      [1.7, view],
      [2.15, file],
      [2.45, file],
      [2.8, open],
      [3.1, open],
      [3.4, newTab],
      [3.6, newTab],
      // Leave sideways, so Open/Print don't pick up the highlight on the way out.
      [3.9, { x: 640, y: 248 }],
      [4.2, { x: 840, y: 260 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (t > 4.25 && t < 4.3) await hideCursor(page);
  },
});
