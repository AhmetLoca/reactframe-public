import type { Page } from "playwright-core";
import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// The arrow row moves with each slide's description, so each target is read from the DOM a
// moment before the cursor heads for it.
const centre = (page: Page, label: string) =>
  page.evaluate((l) => {
    const r = document.querySelector(`[aria-label="${l}"]`)!.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, label);

let a = { x: 121, y: 374 };
let b = { x: 121, y: 374 };
let c = { x: 81, y: 374 };
let d = { x: 81, y: 374 };

// Step forward twice (each slide grows out of the thumbnail stack), then back twice to the first
// slide. Ken Burns keeps the photo drifting, so the clip loops through a short crossfade.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.8,
  loopBlend: 0.5,
  async frame({ fps, page, t, at }) {
    if (at(0.2)) a = await centre(page, "Next");
    if (at(1.8)) b = await centre(page, "Next");
    if (at(2.8)) c = await centre(page, "Previous");
    if (at(3.9)) d = await centre(page, "Previous");
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 500, y: 620 }],
      [0.9, a],
      [1.9, a],
      [2.2, b],
      [2.9, b],
      [3.2, c],
      [4.0, c],
      [4.3, d],
      [4.8, d],
      [5.3, { x: 400, y: 560 }],
      [5.6, { x: 500, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(2.3) || at(3.3) || at(4.4)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(5.65)) await hideCursor(page);
  },
});
