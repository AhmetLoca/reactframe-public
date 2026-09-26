import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

const text = { x: 392, y: 300 };

// Click the title, rename it to "Q3 Roadmap" and save with Enter; then rename it back the same way
// so the clip ends on the original title.
function typeAt(start: number, value: string, step = 0.06) {
  return Array.from(value, (ch, i) => [start + i * step, ch] as const);
}

const EDITS = [
  { click: 0.9, typeFrom: 1.35, value: "Q3 Roadmap" },
  { click: 3.0, typeFrom: 3.45, value: "Untitled project" },
];

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 5.6,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.2, { x: 560, y: 470 }],
      [0.8, text],
      [1.1, text],
      [1.4, { x: 430, y: 360 }],
      [2.7, { x: 440, y: 370 }],
      [2.95, { x: 400, y: 300 }],
      [3.2, { x: 400, y: 300 }],
      [3.5, { x: 440, y: 370 }],
      [4.6, { x: 450, y: 380 }],
      [4.9, { x: 640, y: 520 }],
      [5.1, { x: 760, y: 640 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    for (const edit of EDITS) {
      if (at(edit.click)) {
        await page.mouse.down();
        await page.mouse.up();
      }
      if (at(edit.typeFrom - 0.15)) await page.keyboard.press("Meta+A");
      for (const [time, ch] of typeAt(edit.typeFrom, edit.value)) if (at(time)) await page.keyboard.type(ch);
      if (at(edit.typeFrom + edit.value.length * 0.06 + 0.25)) await page.keyboard.press("Enter");
    }
    if (at(5.0)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(5.15)) await hideCursor(page);
  },
});
