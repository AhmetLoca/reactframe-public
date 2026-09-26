import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// 640x480 so the portaled tooltip scales up with everything else (see the stage).
const button = { x: 320, y: 240 };

export default defineScene({
  viewport: { width: 640, height: 480 },
  duration: 3.8,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 540, y: 400 }],
      [0.8, button],
      [1.7, button],
      [2.2, { x: 560, y: 410 }],
      [2.6, { x: 680, y: 540 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(1.0)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    // Clicking closes a tooltip by design; drop the focus ring and reopen it on the (still hovered)
    // trigger so the "Copied!" confirmation shows.
    if (at(1.1)) {
      await page.evaluate(() => {
        (document.activeElement as HTMLElement | null)?.blur();
        document.querySelector("#tooltip-trigger button")?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      });
    }
    // Reset the label and reopen the tooltip without a cursor, so the last frame matches the first.
    if (at(2.65)) await hideCursor(page);
    if (at(2.8)) {
      await page.evaluate(() => {
        (document.getElementById("video-reset") as HTMLButtonElement | null)?.click();
        document.querySelector("#tooltip-trigger button")?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      });
    }
  },
});
