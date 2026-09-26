import { defineScene, hideCursor, path, stepWebAnimations, type Pt } from "./_lib.mts";

const zone = { x: 400, y: 300 };
const remove = { x: 556, y: 451 };

// Headless Chrome can't drag a real OS file, so the scene draws a small file chip
// under the cursor and dispatches the drag/drop events itself.
async function ghost(page: import("playwright-core").Page, at: Pt | null) {
  await page.evaluate((pt) => {
    let el = document.getElementById("video-drag-ghost");
    if (!el) {
      el = document.createElement("div");
      el.id = "video-drag-ghost";
      el.textContent = "PDF  brand-kit.pdf";
      Object.assign(el.style, {
        position: "fixed", zIndex: "2147483646", pointerEvents: "none", padding: "8px 12px", borderRadius: "10px",
        background: "#1c1c1c", border: "1px solid rgba(255,255,255,0.14)", color: "#F5F4F1", whiteSpace: "pre",
        font: "600 13px Inter, system-ui, sans-serif", boxShadow: "0 12px 30px rgba(0,0,0,0.5)", transform: "rotate(-4deg)",
      });
      document.body.appendChild(el);
    }
    el.style.display = pt ? "block" : "none";
    if (pt) {
      el.style.left = `${pt.x + 10}px`;
      el.style.top = `${pt.y + 14}px`;
    }
  }, at);
}

async function drag(page: import("playwright-core").Page, types: string[]) {
  await page.evaluate((list) => {
    const target = document.querySelector('[aria-label="Upload files"]');
    if (!target) return;
    const dt = new DataTransfer();
    dt.items.add(new File([new Uint8Array(1_800_000)], "brand-kit.pdf", { type: "application/pdf" }));
    for (const type of list) target.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: dt }));
  }, types);
}

export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.5,
  async frame({ t, fps, page, at }) {
    await stepWebAnimations(page, fps);
    const p = path(t, [
      [0.25, { x: 700, y: 540 }],
      [0.95, zone],
      [1.25, zone],
      [2.6, remove],
      [3.15, remove],
      [3.55, { x: 700, y: 540 }],
      [4.0, { x: 840, y: 660 }],
    ]);
    if (p) await page.mouse.move(p.x, p.y);
    await ghost(page, p && t < 1.2 ? p : null);
    if (at(0.8)) await drag(page, ["dragenter", "dragover"]);
    if (at(1.2)) await drag(page, ["drop"]);
    // Remove the uploaded file so the last frame matches the first.
    if (at(3.0)) {
      await page.mouse.down();
      await page.mouse.up();
    }
    if (at(3.2)) await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (at(4.1)) await hideCursor(page);
  },
});
