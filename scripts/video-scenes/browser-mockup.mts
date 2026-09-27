import type { Page } from "playwright-core";
import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const tabs = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("button,[role=tab]")]
      .map((e) => {
        const r = e.getBoundingClientRect();
        return { t: (e.textContent || "").trim(), x: r.left + r.width / 2, y: r.top + r.height / 2 };
      })
      .filter((b) => /ReactFrame|New Tab/.test(b.t)),
  );
let first = { x: 160, y: 120 };
let second = { x: 260, y: 120 };

// Switch to the second tab (the page swaps to a blank new-tab view), then back to the first.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.2,
  async frame({ fps, page, t, at }) {
    if (at(0.1)) {
      const b = await tabs(page);
      first = b.find((x) => /ReactFrame/.test(x.t)) ?? first;
      second = b.find((x) => /New Tab/.test(x.t)) ?? second;
    }
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, second],
      [2.2, second],
      [2.7, first],
      [3.4, first],
      [3.9, { x: 640, y: 580 }],
      [4.2, { x: 820, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0) || at(2.9)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.25)) await hideCursor(page);
  },
});
