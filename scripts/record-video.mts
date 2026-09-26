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
  const res = await page.goto(`${base}/preview/video/${slug}`, { waitUntil: "load" });
  if (!res?.ok()) throw new Error(`Stage /preview/video/${slug} returned ${res?.status()} (dev server running? stage registered?)`);
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  // Real-time wait so lazy images are fetched before the fake clock drives the animation.
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1200);
  await page.clock.runFor(2500);

  const total = Math.round(scene.duration * FPS);
  for (let f = 0; f < total; f++) {
    await scene.frame({ f, t: f / FPS, fps: FPS, page, at: (s) => f === Math.round(s * FPS) });
    await page.clock.runFor(1000 / FPS);
    await page.screenshot({ path: path.join(frames, `f${String(f).padStart(3, "0")}.png`) });
  }
} finally {
  await browser.close();
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
