import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const input = { x: 360, y: 508 };
const send = { x: 576, y: 508 };
const message = "Draft replies for the billing ones";

// Type a follow-up and send it; the assistant answers. The stage then fades back to the opening
// conversation.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 7.6,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 780, y: 590 }],
      [0.9, input],
      [1.1, input],
      [3.3, send],
      [3.6, send],
      [4.2, { x: 700, y: 590 }],
      [4.5, { x: 820, y: 660 }],
    ]);
    if (p && t < 4.55) await page.mouse.move(p.x, p.y);
    if (at(1.0)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    for (let i = 0; i < message.length; i++) if (at(1.2 + i * 0.055)) await page.keyboard.type(message[i]);
    if (at(3.45)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(4.55)) await hideCursor(page);
    if (at(6.8)) await page.evaluate(() => (document.getElementById("video-reset") as HTMLButtonElement).click());
  },
});
