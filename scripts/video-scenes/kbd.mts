import { defineScene, stepWebAnimations } from "./_lib.mts";

// No cursor: press ⌘, ⇧ and K one after another (each key cap sinks while held), release, and play
// the chord once more.
export default defineScene({
  viewport: { width: 800, height: 600 },
  duration: 4.2,
  async frame({ fps, page, at }) {
    await stepWebAnimations(page, fps);
    for (const start of [0.5, 2.2]) {
      if (at(start)) await page.keyboard.down("Meta");
      if (at(start + 0.25)) await page.keyboard.down("Shift");
      if (at(start + 0.5)) await page.keyboard.down("K");
      if (at(start + 1.0)) {
        await page.keyboard.up("K");
        await page.keyboard.up("Shift");
        await page.keyboard.up("Meta");
      }
    }
  },
});
