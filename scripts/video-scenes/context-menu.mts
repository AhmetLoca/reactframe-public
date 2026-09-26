import { defineScene, path, stepWebAnimations } from "./_lib.mts";

// 640x480 so the portaled menu scales up with everything else (see the stage).
const home = { x: 270, y: 200 }; // where the thumbnail's menu is open
const paste = { x: 330, y: 257 };
const del = { x: 330, y: 301 };
const outside = { x: 560, y: 410 };
const other = { x: 205, y: 165 };

const rightClick = async (page: import("playwright-core").Page) => {
  await page.mouse.down({ button: "right" });
  await page.mouse.up({ button: "right" });
};

// The menu starts open: hover Paste and Delete, click outside to close it, right-click somewhere else
// in the area (it opens there), dismiss with Escape, then right-click the original spot so it opens
// where it started. Only the drawn cursor is hidden at the end, so the menu stays open.
export default defineScene({
  viewport: { width: 640, height: 480 },
  duration: 5.6,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 520, y: 330 }],
      [0.6, paste],
      [0.85, paste],
      [1.1, del],
      [1.35, del],
      [1.8, outside],
      [2.1, outside],
      [2.5, other],
      [3.3, other],
      [3.9, home],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.95)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(2.6)) await rightClick(page);
    if (at(3.35)) await page.keyboard.press("Escape");
    if (at(4.1)) await rightClick(page);
    if (at(4.7)) {
      await page.evaluate(() => {
        const cursor = [...document.querySelectorAll("svg")].find((svg) => svg.style.zIndex === "2147483647");
        if (cursor) cursor.style.visibility = "hidden";
      });
    }
  },
});
