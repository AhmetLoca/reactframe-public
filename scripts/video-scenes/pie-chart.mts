import { defineScene, hideCursor, path, stepWebAnimations } from "./_lib.mts";

// Centre and radius of the chart's plot, read from its largest <svg> on the first frame.
let c = { x: 400, y: 310, r: 95 };

// Circle the cursor round the donut so each slice lifts and shows its share, then leave.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 6.0,
  async frame({ fps, page, t, at }) {
    if (at(0))
      c = await page.evaluate((f) => {
        const svgs = [...document.querySelectorAll("svg")].map((s) => s.getBoundingClientRect()).sort((a, b) => b.width * b.height - a.width * a.height);
        const r = svgs[0];
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: (Math.min(r.width, r.height) / 2) * f };
      }, 0.5);
    await stepWebAnimations(page, fps);
    let p: { x: number; y: number } | null = null;
    if (t >= 0.9 && t < 4.2) {
      const a = ((t - 0.9) / 3.3) * Math.PI * 2 - Math.PI / 2;
      p = { x: c.x + Math.cos(a) * c.r, y: c.y + Math.sin(a) * c.r };
    } else {
      p = path(t, [
        [0.3, { x: 780, y: 590 }],
        [0.9, { x: c.x, y: c.y - c.r }],
        [4.2, { x: c.x, y: c.y - c.r }],
        [4.6, { x: 700, y: 590 }],
        [4.9, { x: 820, y: 660 }],
      ]);
    }
    if (p) await page.mouse.move(p.x, p.y);
    if (at(4.95)) await hideCursor(page);
  },
});
