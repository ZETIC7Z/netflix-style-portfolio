import { chromium } from 'playwright';
import ffmpegPath from 'ffmpeg-static';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series';
const OUT_TRAILERS = path.join(ROOT, 'public/trailers');
const UPLOADED = 'C:/Users/ZETICUZ/.gemini/antigravity/brain/2ebe0471-be86-443a-b270-3c7e9dc14d84/.user_uploaded';
const TMP = path.join(ROOT, '.tmp-zetica-trailer');

fs.mkdirSync(OUT_TRAILERS, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function stampHudOnSlice(inputBuffer, badge, title, subtitle, accent = '#A3E635') {
  const width = 1920;
  const height = 1080;
  const svg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hudBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#07090e" stop-opacity="0.90"/>
          <stop offset="100%" stop-color="#0f1420" stop-opacity="0.94"/>
        </linearGradient>
      </defs>
      <g transform="translate(${width - 580}, 36)">
        <rect x="0" y="0" width="540" height="96" rx="14" fill="url(#hudBg)" stroke="${accent}" stroke-width="2"/>
        <rect x="0" y="18" width="5" height="60" rx="2.5" fill="${accent}"/>
        <text x="24" y="32" fill="${accent}" font-family="Arial, sans-serif" font-size="13" font-weight="bold" letter-spacing="2.5">${esc(badge)}</text>
        <text x="24" y="60" fill="#ffffff" font-family="Arial, sans-serif" font-size="22" font-weight="bold">${esc(title)}</text>
        <text x="24" y="82" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="14">${esc(subtitle)}</text>
      </g>
    </svg>
  `);

  return sharp(inputBuffer)
    .resize(width, height, { fit: 'cover', position: 'north' })
    .composite([{ input: svg, top: 0, left: 0 }])
    .png()
    .toBuffer();
}

async function captureScrollStripAtOffsets(page, outPngPath, yTop, yBot, badge, title, subtitle, accent = '#A3E635') {
  await page.evaluate((y) => window.scrollTo(0, y), yTop);
  await page.waitForTimeout(350);
  const topBuf = await page.screenshot({ type: 'png' });

  await page.evaluate((y) => window.scrollTo(0, y), yBot);
  await page.waitForTimeout(350);
  const botBuf = await page.screenshot({ type: 'png' });

  const stampedTop = await stampHudOnSlice(topBuf, badge, title, subtitle, accent);
  const stampedBot = await stampHudOnSlice(botBuf, badge, title, subtitle, accent);

  await sharp({
    create: { width: 1920, height: 2160, channels: 4, background: { r: 7, g: 9, b: 14, alpha: 1 } },
  })
    .composite([
      { input: stampedTop, top: 0, left: 0 },
      { input: stampedBot, top: 1080, left: 0 },
    ])
    .png()
    .toFile(outPngPath);
}

function encodeMultiPageTour(stripPaths, outMp4) {
  const n = stripPaths.length;
  const segDur = 12; // 5 acts * 12s = 60s total
  const inputs = [];
  const filterParts = [];
  const concatInputs = [];

  for (let i = 0; i < n; i++) {
    inputs.push('-loop', '1', '-t', String(segDur), '-i', stripPaths[i]);
    const fadeOutSt = (segDur - 0.5).toFixed(1);
    filterParts.push(
      `[${i}:v]fps=30,crop=1920:1080:0:'if(lt(t,1.2),0,if(lt(t,7.5),(t-1.2)/6.3*960,if(lt(t,9.2),960,960-(t-9.2)/2.8*960)))',` +
        `scale=1920:1080,setsar=1,fade=t=in:st=0:d=0.45,fade=t=out:st=${fadeOutSt}:d=0.45[v${i}]`
    );
    concatInputs.push(`[v${i}]`);
  }

  filterParts.push(`${concatInputs.join('')}concat=n=${n}:v=1:a=0,format=yuv420p[outv]`);

  execFileSync(ffmpegPath, [
    '-y',
    ...inputs,
    '-filter_complex',
    filterParts.join(';'),
    '-map',
    '[outv]',
    '-t',
    String(n * segDur),
    '-c:v',
    'libx264',
    '-preset',
    'veryfast',
    '-crf',
    '20',
    '-movflags',
    '+faststart',
    outMp4,
  ]);
}

async function run() {
  console.log('=== Recording 60s 1080p 2x Trailer for ZETICA CREATIVE SUITE & HUB ===');
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, ignoreHTTPSErrors: true });
  const page = await context.newPage();

  // Act 1: https://zetica.vercel.app/ (3D WebGL Galaxy Hero + 13 Apps Bar)
  await page.goto('https://zetica.vercel.app/', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2800);
  const s1 = path.join(TMP, 'act1-home-hero.png');
  await captureScrollStripAtOffsets(
    page,
    s1,
    0,
    820,
    'ACT 01 · ZETICA.VERCEL.APP',
    'Zetica Creative Suite & 3D WebGL Hub',
    'Open-source tools built in pure Rust — 100% free with zero subscriptions',
    '#A3E635'
  );

  // Act 2: https://zetica.vercel.app/ (Zetica Studio + Features + Free Ownership)
  const s2 = path.join(TMP, 'act2-home-studio.png');
  await captureScrollStripAtOffsets(
    page,
    s2,
    1450,
    2550,
    'ACT 02 · ZETICA STUDIO & CONTROL',
    'AI Video, 3D Compositing & Posing',
    'Built for students, artists & editors who cannot afford paid subscriptions',
    '#38BDF8'
  );

  // Act 3: https://zetica.vercel.app/apps.html (The 13 Native Rust Apps Lineup)
  await page.goto('https://zetica.vercel.app/apps.html', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const s3 = path.join(TMP, 'act3-apps-top.png');
  await captureScrollStripAtOffsets(
    page,
    s3,
    0,
    920,
    'ACT 03 · ZETICA.VERCEL.APP/APPS',
    '14 Native Open-Source Rust Apps',
    'PhotoCraft, VectorCraft, FilmCraft, LightCraft, PDFCraft & Zetica Hub',
    '#F59E0B'
  );

  // Act 4: https://zetica.vercel.app/apps.html (Lower grid: DesignCraft, EffectCraft, WordCraft, SoundCraft, DeckCraft, CADCraft, GridCraft)
  const s4 = path.join(TMP, 'act4-apps-grid.png');
  await captureScrollStripAtOffsets(
    page,
    s4,
    1200,
    2150,
    'ACT 04 · COMPLETE DESKTOP ECOSYSTEM',
    'Design, Motion, Word, Sound, Deck & CAD',
    'Native Windows (.msi), macOS, Linux & Web builds with zero paywalls',
    '#EC4899'
  );

  // Act 5: Actual Installed Windows Desktop App (Zetica Design / DesignCraft + Installed Desktop Suite Icons)
  const designDesktopPath = path.join(UPLOADED, 'media_1794328872333_0c20d3fa.png');
  const iconsDesktopPath = path.join(UPLOADED, 'media_1794328967127_fe15c80b.png');

  const topDesktop = await stampHudOnSlice(
    fs.readFileSync(designDesktopPath),
    'ACT 05 · NATIVE WINDOWS DESKTOP APP',
    'Zetica Design (DesignCraft v0.14.0)',
    'Running natively on Windows with DirectX 12 / OpenGL & WGPU acceleration',
    '#A3E635'
  );

  // Compose a sharp 1920x1080 showcase frame for the bottom half of Act 5 showing the 7 installed desktop apps + Zetica Design workspace
  const iconsResized = await sharp(iconsDesktopPath)
    .resize(1100, 620, { fit: 'contain', background: { r: 11, g: 24, b: 48, alpha: 1 } })
    .png()
    .toBuffer();

  const botCanvas = await sharp(designDesktopPath)
    .resize(1920, 1080, { fit: 'cover' })
    .blur(18)
    .modulate({ brightness: 0.4 })
    .composite([
      { input: iconsResized, top: 230, left: 410 },
    ])
    .png()
    .toBuffer();

  const botDesktop = await stampHudOnSlice(
    botCanvas,
    'ACT 05 · INSTALLED DESKTOP SUITE',
    'Zetica Deck, PDF, Sound, Light, Word, Motion & Design',
    'Installed via Zetica Hub (zetica-hub-windows-x64.msi) — Free forever for all students',
    '#22C55E'
  );

  const s5 = path.join(TMP, 'act5-desktop.png');
  await sharp({
    create: { width: 1920, height: 2160, channels: 4, background: { r: 7, g: 9, b: 14, alpha: 1 } },
  })
    .composite([
      { input: topDesktop, top: 0, left: 0 },
      { input: botDesktop, top: 1080, left: 0 },
    ])
    .png()
    .toFile(s5);

  await browser.close();

  const outMp4 = path.join(OUT_TRAILERS, 'zetica-suite.mp4');
  encodeMultiPageTour([s1, s2, s3, s4, s5], outMp4);

  const stat = fs.statSync(outMp4);
  console.log(`Built zetica-suite.mp4 (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
  fs.rmSync(TMP, { recursive: true, force: true });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
