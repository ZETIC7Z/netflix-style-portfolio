import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/assets/logos';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

async function fetchWikiImage(fileTitle, outKey) {
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json`;
  const res = await fetch(apiUrl, { headers: { 'User-Agent': 'SamPortfolioBot/1.0 (https://www.zeticuz.xyz; samxerz12@gmail.com)' } });
  const data = await res.json();
  const pages = data?.query?.pages || {};
  const page = Object.values(pages)[0];
  const url = page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url;
  console.log(fileTitle, '->', url);
  if (url) {
    const imgRes = await fetch(url, { headers: { 'User-Agent': 'SamPortfolioBot/1.0 (https://www.zeticuz.xyz; samxerz12@gmail.com)' } });
    if (imgRes.ok) {
      const buf = Buffer.from(await imgRes.arrayBuffer());
      fs.writeFileSync(path.join(outDir, `${outKey}.png`), buf);
      console.log(`Saved ${outKey}.png (${buf.length} bytes)`);
    }
  }
}

async function run() {
  // 1. Lamitan official seal from Wikipedia
  await fetchWikiImage('File:LamitanBasCit (1).png', 'lamitan-seal');

  // 2. Search Wikimedia / Wikipedia for University of San Carlos seal/logo or fetch from usc.edu.ph
  try {
    const htmlRes = await fetch('https://usc.edu.ph/', { headers: { 'User-Agent': UA } });
    const html = await htmlRes.text();
    const imgMatches = [...html.matchAll(/https?:\/\/[^"'\s>]+\.(?:png|svg|webp|jpg)/gi)].map((m) => m[0]);
    const logoUrls = imgMatches.filter((u) => /logo|seal|usc|cropped/i.test(u));
    console.log('usc.edu.ph logo candidates:', logoUrls.slice(0, 10));
    for (const u of logoUrls.slice(0, 5)) {
      const r = await fetch(u, { headers: { 'User-Agent': UA } });
      if (r.ok) {
        const b = Buffer.from(await r.arrayBuffer());
        if (b.length > 2000) {
          const ext = path.extname(new URL(u).pathname) || '.png';
          fs.writeFileSync(path.join(outDir, `usc-official${ext}`), b);
          console.log(`Saved usc-official${ext} (${b.length} bytes) from ${u}`);
          break;
        }
      }
    }
  } catch (e) {
    console.log('usc.edu.ph fetch error:', e.message);
  }
}

run();
