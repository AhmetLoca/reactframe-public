// Pings IndexNow (Bing, Yandex, Seznam, ...; ChatGPT search reads Bing's index) with every URL in the
// live sitemap, so new and changed pages get recrawled within hours instead of days:
//   npm run indexnow            # after a production deploy is live
//   npm run indexnow -- --dry   # print what would be sent
// The key is public by design: IndexNow verifies it by fetching https://<host>/<key>.txt.
const HOST = "reactframe.com";
const KEY = "4ceae7105c9e8c438d649b12b34b21b4";
const dry = process.argv.includes("--dry");

const res = await fetch(`https://${HOST}/sitemap.xml`);
if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
const urlList = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`${urlList.length} URLs from sitemap.xml`);
if (dry) {
  console.log(urlList.slice(0, 10).join("\n"));
  process.exit(0);
}

const ping = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${ping.status} ${ping.statusText}`);
if (ping.status >= 400) process.exit(1);
