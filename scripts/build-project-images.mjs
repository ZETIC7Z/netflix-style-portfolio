import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'c:/Users/ZETICUZ/Music/portfolio/zeticuz-portfolio/client/public/projects';
const OUT_DIR = path.resolve('public/projects');

fs.mkdirSync(OUT_DIR, { recursive: true });

const MAPPINGS = [
  {
    id: 'nexus-streaming',
    portrait: 'nexus-portrait.png',
    landscape: 'nexus-landscape.png',
  },
  {
    id: 'zetflix-tv',
    portrait: 'zetflix-portrait.png',
    landscape: 'zetflix-landscape.png',
  },
  {
    id: 'careerform-ph',
    portrait: 'careerform-portrait.png',
    landscape: 'careerform-landscape.png',
  },
  {
    id: 'smart-brgy-portal',
    portrait: 'careerform-portrait.png', // Overwritten with live screenshot in record-trailers.mjs
    landscape: 'careerform-landscape.png',
  },
  {
    id: 'lifecoach-v1',
    portrait: 'lifecoach-portrait.png',
    landscape: 'lifecoach-landscape.png',
  },
  {
    id: 'lifecoach-v2',
    portrait: 'lifecoach2-portrait.png',
    landscape: 'lifecoach2-landscape.png',
  },
  {
    id: 'nwanganga-shields',
    portrait: 'autobiography-portrait.png',
    landscape: 'autobiography-landscape.png',
  },
  {
    id: 'sws-skeptrons',
    portrait: 'sws-portrait.png',
    landscape: 'sws-landscape.png',
  },
  {
    id: 'dekaron-stampede',
    portrait: 'dekaron-portrait.png',
    landscape: 'dekaron-landscape.png',
  },
  {
    id: 'gmcs-dashboard',
    portrait: 'gmcs-dashboard.vercel.app.png',
    landscape: 'gmcs-landscape.png',
  },
];

async function run() {
  for (const item of MAPPINGS) {
    const pSrc = path.join(SRC_DIR, item.portrait);
    const lSrc = path.join(SRC_DIR, item.landscape);
    const pOut = path.join(OUT_DIR, `${item.id}-portrait.webp`);
    const lOut = path.join(OUT_DIR, `${item.id}-landscape.webp`);

    if (fs.existsSync(pSrc)) {
      await sharp(pSrc)
        .resize({ width: 540, height: 810, fit: 'cover', position: 'top' })
        .webp({ quality: 86, effort: 5 })
        .toFile(pOut);
      console.log(`Built portrait: ${pOut}`);
    }

    if (fs.existsSync(lSrc)) {
      await sharp(lSrc)
        .resize({ width: 1280, height: 720, fit: 'cover', position: 'top' })
        .webp({ quality: 86, effort: 5 })
        .toFile(lOut);
      console.log(`Built landscape: ${lOut}`);
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
