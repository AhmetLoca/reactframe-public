import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Type an email, show the password field, hide it again, then clear the email.
export default defineScene({
  url: "/pages/preview/sign-in-page/view",
  viewport: { width: 1280, height: 960 },
  duration: 7.4,
  async frame({ fps, page, t, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.3, { x: 1260, y: 945 }],
      [0.9, { x: 960, y: 482 }],
      [1.2, { x: 962, y: 483 }],
      [2.2, { x: 1117, y: 571 }],
      [2.5, { x: 1119, y: 572 }],
      [3.5, { x: 1117, y: 571 }],
      [3.8, { x: 1119, y: 572 }],
      [4.8, { x: 960, y: 482 }],
      [5.1, { x: 962, y: 483 }],
      [6.1, { x: 1200, y: 945 }],
      [6.4, { x: 1320, y: 1040 }],
    ]);
    if (p && t <= 6.4) await page.mouse.move(p.x, p.y);
    if (at(1.05) || at(2.35) || at(3.65) || at(4.95)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(1.3)) await page.keyboard.type("j", { delay: 0 });
    if (at(1.35)) await page.keyboard.type("o", { delay: 0 });
    if (at(1.4000000000000001)) await page.keyboard.type("r", { delay: 0 });
    if (at(1.4500000000000002)) await page.keyboard.type("d", { delay: 0 });
    if (at(1.5)) await page.keyboard.type("a", { delay: 0 });
    if (at(1.55)) await page.keyboard.type("n", { delay: 0 });
    if (at(1.6)) await page.keyboard.type("@", { delay: 0 });
    if (at(1.6500000000000001)) await page.keyboard.type("s", { delay: 0 });
    if (at(1.7000000000000002)) await page.keyboard.type("t", { delay: 0 });
    if (at(1.75)) await page.keyboard.type("u", { delay: 0 });
    if (at(1.8)) await page.keyboard.type("d", { delay: 0 });
    if (at(1.85)) await page.keyboard.type("i", { delay: 0 });
    if (at(1.9000000000000001)) await page.keyboard.type("o", { delay: 0 });
    if (at(1.9500000000000002)) await page.keyboard.type(".", { delay: 0 });
    if (at(2.0)) await page.keyboard.type("c", { delay: 0 });
    if (at(2.05)) await page.keyboard.type("o", { delay: 0 });
    if (at(2.1)) await page.keyboard.type("m", { delay: 0 });
    if (at(5.2)) await page.keyboard.press("Meta+A");
    if (at(5.3)) await page.keyboard.press("Backspace");
    if (at(5.5)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (t > 6.4 && t < 6.46) await hideCursor(page);
  },
});
