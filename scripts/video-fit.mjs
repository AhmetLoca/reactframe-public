// Screenshot a hover-video stage to compare it with its static thumbnail while fitting size/scale, and
// print the centre of any text given after the output path (for scene coordinates).
//   VW=800 VH=600 DSF=2.4 node scripts/video-fit.mjs <slug> <out.png> [text...]
import { chromium } from "playwright-core";
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage({ viewport: { width: +(process.env.VW ?? 800), height: +(process.env.VH ?? 600) }, deviceScaleFactor: +(process.env.DSF ?? 2.4) });
await p.goto("http://localhost:3000/preview/video/" + process.argv[2], { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
await p.screenshot({ path: process.argv[3] });
for (const t of process.argv.slice(4)) { const bb = await p.getByText(t, { exact: true }).first().boundingBox(); console.log(t, bb && Math.round(bb.x + bb.width / 2), bb && Math.round(bb.y + bb.height / 2)); }
await b.close();
