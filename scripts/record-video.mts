// Records a short hover-preview clip for a catalog card:
//   npm run video -- <slug> [--crf 18] [--size 960x720] [--base http://localhost:3000]
//
// Loads /preview/video/<slug> (src/video-stages, dev-only) in the system
// Chrome, steps a fake clock one frame at a time (so animations are
// deterministic and the output is exactly `duration` seconds at 30 fps),
// runs scripts/video-scenes/<slug>.mts on every frame, screenshots it, then
// encodes H.264 into public/thumbnails/<slug>.mp4 and refreshes the
// thumbnail manifest. Needs the dev server running, plus ffmpeg and Chrome.
import { chromium } from "playwright-core";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { Scene } from "./video-scenes/_lib.mts";

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const opt = (name: string, fallback: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
if (!slug) {
  console.error("usage: npm run video -- <slug> [--crf 18] [--size 960x720] [--base http://localhost:3000]");
  process.exit(1);
}

const FPS = 30;
const crf = opt("crf", "18");
const [outW, outH] = opt("size", "960x720").split("x").map(Number);
const base = opt("base", process.env.VIDEO_BASE_URL ?? "http://localhost:3000");
const root = process.cwd();
const sceneFile = path.join(root, "scripts", "video-scenes", `${slug}.mts`);
if (!fs.existsSync(sceneFile)) {
  console.error(`No scene at scripts/video-scenes/${slug}.mts (and a stage in src/video-stages/index.tsx).`);
  process.exit(1);
}
const scene: Scene = (await import(pathToFileURL(sceneFile).href)).default;

const chromeCandidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean) as string[];
const executablePath = chromeCandidates.find((p) => fs.existsSync(p));
if (!executablePath) {
  console.error("Chrome not found. Set CHROME_PATH.");
  process.exit(1);
}

const work = fs.mkdtempSync(path.join(os.tmpdir(), `rf-video-${slug}-`));
const frames = path.join(work, "frames");
fs.mkdirSync(frames);

const browser = await chromium.launch({ executablePath, headless: true });
try {
  const context = await browser.newContext({ viewport: scene.viewport, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem("reactframe-cookie-consent", "declined"));
  await page.clock.install({ time: Date.now() });
  // Routes other than a video stage have no drawn cursor (the stage renders one), so inject the
  // same arrow, following the mouse events Playwright dispatches.
  if (scene.url) {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("width", "22");
        svg.setAttribute("height", "26");
        svg.setAttribute("viewBox", "0 0 22 26");
        svg.style.cssText = "position:fixed;z-index:2147483647;left:-100px;top:-100px;opacity:0;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,.6))";
        const path = document.createElementNS(ns, "path");
        path.setAttribute("d", "M3 2v19l5-4.6 3.4 7.3 3.2-1.5-3.3-7.1H18z");
        path.setAttribute("fill", "#fff");
        path.setAttribute("stroke", "#000");
        path.setAttribute("stroke-width", "1.4");
        path.setAttribute("stroke-linejoin", "round");
        svg.appendChild(path);
        document.body.appendChild(svg);
        const move = (e: MouseEvent) => {
          svg.style.left = `${e.clientX - 3}px`;
          svg.style.top = `${e.clientY - 2}px`;
          svg.style.opacity = "1";
        };
        window.addEventListener("mousemove", move, true);
        window.addEventListener("pointermove", move, true);
      });
    });
  }
  // A scene can point at any route (e.g. a full page preview) instead of its video stage.
  const target = scene.url ?? `/preview/video/${slug}`;
  const res = await page.goto(`${base}${target}`, { waitUntil: "load" });
  if (!res?.ok()) throw new Error(`${target} returned ${res?.status()} (dev server running? stage registered?)`);
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  // Real-time wait so lazy images are fetched before the fake clock drives the animation.
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1200);
  // Freeze the fake clock so only runFor() moves it. Left running, it also advances in real time,
  // and screenshots make every frame slow, so timers and rAF-timed animations (game ticks,
  // progress bars) ran 3-4x too fast in the clip.
  // A little ahead of the page's clock, which keeps ticking until the pause lands.
  await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 200);
  await page.clock.runFor(2500);

  const total = Math.round((scene.duration + (scene.loopBlend ?? 0)) * FPS);
  for (let f = 0; f < total; f++) {
    await scene.frame({ f, t: f / FPS, fps: FPS, page, at: (s) => f === Math.round(s * FPS) });
    await page.clock.runFor(1000 / FPS);
    await page.screenshot({ path: path.join(frames, `f${String(f).padStart(3, "0")}.png`) });
  }
} finally {
  await browser.close();
}

if (scene.loopBlend) {
  // Frame i of the first `loopBlend` seconds becomes a mix of the extra tail frame N+i (fading out) and
  // frame i (fading in); the clip then ends on frame N-1, which flows straight into tail frame N.
  const n = Math.round(scene.duration * FPS);
  const nb = Math.round(scene.loopBlend * FPS);
  execFileSync("python3", ["-c", `
import sys
from PIL import Image
d, n, nb = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
f = lambda i: f"{d}/f{i:03d}.png"
for i in range(nb):
    Image.blend(Image.open(f(n + i)).convert("RGB"), Image.open(f(i)).convert("RGB"), i / nb).save(f(i))
`, frames, String(n), String(nb)]);
  for (let i = n; i < n + nb; i++) fs.rmSync(path.join(frames, `f${String(i).padStart(3, "0")}.png`));
}

const out = path.join(root, "public", "thumbnails", `${slug}.mp4`);
execFileSync(
  "ffmpeg",
  [
    "-v", "error", "-y", "-framerate", String(FPS), "-i", path.join(frames, "f%03d.png"),
    "-vf", `scale=${outW}:${outH}:flags=lanczos,format=yuv420p`,
    "-c:v", "libx264", "-preset", "veryslow", "-crf", crf, "-tune", "animation",
    "-profile:v", "high", "-level", "4.0", "-movflags", "+faststart", "-an", out,
  ],
  { stdio: "inherit" },
);

// Quality check on the middle frame + a contact sheet for a quick visual look.
const mid = Math.floor((scene.duration * FPS) / 2);
const dec = path.join(work, "dec.png");
const src = path.join(work, "src.png");
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", out, "-vf", `select=eq(n\\,${mid})`, "-frames:v", "1", dec]);
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", path.join(frames, `f${String(mid).padStart(3, "0")}.png`), "-vf", `scale=${outW}:${outH}:flags=lanczos`, "-frames:v", "1", src]);
const ssimLog = spawnSync("ffmpeg", ["-i", dec, "-i", src, "-lavfi", "ssim", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const sheet = path.join(work, "contact-sheet.png");
const step = Math.max(1, Math.floor((scene.duration * FPS) / 8));
execFileSync("ffmpeg", ["-v", "error", "-y", "-framerate", String(FPS), "-i", path.join(frames, "f%03d.png"), "-vf", `select='not(mod(n\\,${step}))',scale=400:-1,tile=4x2`, "-frames:v", "1", sheet]);

execFileSync("node", [path.join(root, "scripts", "generate-thumbnail-manifest.mts")], { stdio: "inherit" });

const kb = (fs.statSync(out).size / 1024).toFixed(1);
console.log(`\n${slug}.mp4: ${scene.duration}s, ${outW}x${outH}, ${kb} KB`);
console.log(`ssim: ${/All:([0-9.]+)/.exec(ssimLog)?.[1] ?? "n/a"}`);
console.log(`contact sheet: ${sheet}`);
