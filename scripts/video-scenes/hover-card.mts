import { defineScene, path, stepWebAnimations } from "./_lib.mts";

// 640x480 so the portaled card scales up with everything else (see the stage).
const trigger = { x: 320, y: 142 };
const card = { x: 330, y: 205 };
const away = { x: 520, y: 380 };

// The card starts open. Touch the trigger and leave (it closes after its delay), come back (it opens
// after its delay), move onto the card and off it (it closes), then return to the trigger so it opens
// once more. Only the drawn cursor is hidden at the end: the real pointer stays on the trigger, so the
// card stays open and the last frame matches the first.
export default defineScene({
  viewport: { width: 640, height: 480 },
  duration: 5.6,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 560, y: 420 }],
      [0.6, trigger],
      [0.9, trigger],
      [1.3, away],
      [1.8, away],
      [2.2, trigger],
      [2.8, trigger],
      [3.1, card],
      [3.4, card],
      [3.7, away],
      [4.0, away],
      [4.4, trigger],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    if (at(5.0)) {
      await page.evaluate(() => {
        const cursor = [...document.querySelectorAll("svg")].find((svg) => svg.style.zIndex === "2147483647");
        if (cursor) cursor.style.visibility = "hidden";
      });
    }
  },
});
