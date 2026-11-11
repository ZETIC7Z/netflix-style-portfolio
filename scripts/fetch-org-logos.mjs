import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/assets/logos';
fs.mkdirSync(outDir, { recursive: true });

const wikiPages = [
  { key: 'denr', title: 'Department_of_Environment_and_Natural_Resources' },
  { key: 'usc', title: 'University_of_San_Carlos' },
  { key: 'dswd', title: 'Department_of_Social_Welfare_and_Development' },
  { key: 'dict', title: 'Department_of_Information_and_Communications_Technology' },
  { key: 'lamitan', title: 'Lamitan' },
];

async function run() {
  for (const item of wikiPages) {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(item.title)}&prop=pageimages&pithumbsize=500&format=json`;
    const res = await fetch(apiUrl, {
      headers: { 'User-Agent': 'SamPortfolioBot/1.0 (https://www.zeticuz.xyz; samxerz12@gmail.com)' },
    });
    const data = await res.json();
    const pages = data?.query?.pages || {};
    const firstPage = Object.values(pages)[0];
    const thumbUrl = firstPage?.thumbnail?.source;
    console.log(item.key, '-> thumbUrl:', thumbUrl);
    if (thumbUrl) {
      await new Promise((r) => setTimeout(r, 500));
      const imgRes = await fetch(thumbUrl, {
        headers: { 'User-Agent': 'SamPortfolioBot/1.0 (https://www.zeticuz.xyz; samxerz12@gmail.com)' },
      });
      if (imgRes.ok) {
        const buf = Buffer.from(await imgRes.arrayBuffer());
        const ext = thumbUrl.endsWith('.png') ? '.png' : '.jpg';
        fs.writeFileSync(path.join(outDir, `${item.key}${ext}`), buf);
        console.log(`Saved ${item.key}${ext} (${buf.length} bytes)`);
      } else {
        console.log(`Failed image download for ${item.key}: ${imgRes.status}`);
      }
    }
  }
}

run();
