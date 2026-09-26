import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const newFile = { x: 420, y: 273 };
const settings = { x: 420, y: 326 };
const query = "dark";

// Hover down the list, type a query that filters to one command, clear it, and hover back to
// "New file" so the last frame matches the first.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.6,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 660, y: 500 }],
      [0.6, newFile],
      [0.9, settings],
      [1.2, settings],
      [1.5, { x: 620, y: 470 }],
      [3.2, { x: 620, y: 470 }],
      [3.6, newFile],
      [3.85, newFile],
      [4.15, { x: 720, y: 540 }],
      [4.45, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    for (let i = 0; i < query.length; i++) if (at(1.6 + i * 0.12)) await page.keyboard.type(query[i]);
    if (at(2.8)) {
      await page.keyboard.press("ControlOrMeta+a");
      await page.keyboard.press("Backspace");
    }
    if (at(4.5)) await hideCursor(page);
  },
});
