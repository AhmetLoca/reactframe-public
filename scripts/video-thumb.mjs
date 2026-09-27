// Regenerate a static thumbnail from a hover-video stage (1920 px wide); convert the PNG to webp q90.
//   node scripts/video-thumb.mjs <slug> <out.png> [vw vh] [waitMs]
import { chromium } from "playwright-core";
const [slug, out, vw = "800", vh = "600", wait = "2500"] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage({ viewport: { width: +vw, height: +vh }, deviceScaleFactor: 1920 / +vw });
await p.goto("http://localhost:3000/preview/video/" + slug, { waitUntil: "networkidle" });
await p.addStyleTag({ content: "nextjs-portal{display:none!important}" });
await p.waitForTimeout(+wait);
await p.screenshot({ path: out });
await b.close();
