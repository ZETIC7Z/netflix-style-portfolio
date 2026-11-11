import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const execFileAsync = promisify(execFile);

const IMG_DIR = path.resolve('public/projects');
const TRAILER_DIR = path.resolve('public/trailers');
const TMP_DIR = path.resolve('.tmp-qms');

fs.mkdirSync(IMG_DIR, { recursive: true });
fs.mkdirSync(TRAILER_DIR, { recursive: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

// Remove deleted GMCS Dashboard assets if present
for (const f of [
  path.join(IMG_DIR, 'gmcs-dashboard-portrait.webp'),
  path.join(IMG_DIR, 'gmcs-dashboard-landscape.webp'),
  path.join(TRAILER_DIR, 'gmcs-dashboard.mp4'),
]) {
  if (fs.existsSync(f)) fs.unlinkSync(f);
}

async function downloadBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function buildBrgyPortal() {
  console.log('[smart-brgy-portal] Downloading official og-banner.png and live-demo-preview.mp4 from GitHub...');
  const bannerBuf = await downloadBuffer(
    'https://raw.githubusercontent.com/ZETIC7Z/Barangay-Online-E-Governance-Portal/main/public/og-banner.png'
  );
  const videoBuf = await downloadBuffer(
    'https://raw.githubusercontent.com/ZETIC7Z/Barangay-Online-E-Governance-Portal/main/public/demo/live-demo-preview.mp4'
  );

  const trailerOut = path.join(TRAILER_DIR, 'smart-brgy-portal.mp4');
  fs.writeFileSync(trailerOut, videoBuf);
  console.log(`[smart-brgy-portal] Saved trailer: ${trailerOut} (${(videoBuf.length / 1024 / 1024).toFixed(2)} MB)`);

  // Build landscape image from og-banner.png
  await sharp(bannerBuf)
    .resize({ width: 1280, height: 720, fit: 'cover', position: 'center' })
    .webp({ quality: 88 })
    .toFile(path.join(IMG_DIR, 'smart-brgy-portal-landscape.webp'));

  // Extract a high-res frame from the video at 14s (showing the main portal hero/map) to combine with og-banner for portrait
  const framePath = path.join(TMP_DIR, 'brgy-frame.png');
  await execFileAsync(ffmpegPath, [
    '-y',
    '-ss', '14',
    '-i', trailerOut,
    '-frames:v', '1',
    framePath,
  ]);

  const topImg = await sharp(bannerBuf).resize(540, 405, { fit: 'cover' }).toBuffer();
  const botImg = await sharp(framePath).resize(540, 405, { fit: 'cover' }).toBuffer();

  await sharp({
    create: {
      width: 540,
      height: 810,
      channels: 4,
      background: { r: 6, g: 12, b: 24, alpha: 1 },
    },
  })
    .composite([
      { input: topImg, top: 0, left: 0 },
      { input: botImg, top: 405, left: 0 },
    ])
    .webp({ quality: 88 })
    .toFile(path.join(IMG_DIR, 'smart-brgy-portal-portrait.webp'));

  console.log('[smart-brgy-portal] Built landscape & portrait WebP images.');
}

async function buildClientQms() {
  console.log('[client-qms] Downloading all 8 official screenshots from ZETIC7Z/CLIENT-QMS...');
  const files = [
    '01-main-dashboard.png',
    '02-step1-intake.png',
    '03-step2-validator.png',
    '04-step3-swo.png',
    '05-step4-cashier.png',
    '06-step2-monitor-display.png',
    '07-my-account-calendar.png',
    '08-admin-studio.png',
  ];

  const localPaths = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const url = `https://raw.githubusercontent.com/ZETIC7Z/CLIENT-QMS/main/docs/screenshots/${f}`;
    const buf = await downloadBuffer(url);
    const outPng = path.join(TMP_DIR, `qms-${i + 1}.png`);
    // Normalize every screenshot to 1280x720 for seamless video encoding
    await sharp(buf)
      .resize({ width: 1280, height: 720, fit: 'cover', position: 'top' })
      .png()
      .toFile(outPng);
    localPaths.push(outPng);
  }

  // Landscape poster from 01-main-dashboard.png
  await sharp(localPaths[0])
    .resize({ width: 1280, height: 720, fit: 'cover', position: 'top' })
    .webp({ quality: 88 })
    .toFile(path.join(IMG_DIR, 'client-qms-landscape.webp'));

  // Portrait poster combining 01-main-dashboard.png (top) and 06-step2-monitor-display.png (bottom)
  const topDash = await sharp(localPaths[0]).resize(540, 405, { fit: 'cover', position: 'top' }).toBuffer();
  const botMon = await sharp(localPaths[5]).resize(540, 405, { fit: 'cover', position: 'top' }).toBuffer();
  await sharp({
    create: {
      width: 540,
      height: 810,
      channels: 4,
      background: { r: 8, g: 14, b: 28, alpha: 1 },
    },
  })
    .composite([
      { input: topDash, top: 0, left: 0 },
      { input: botMon, top: 405, left: 0 },
    ])
    .webp({ quality: 88 })
    .toFile(path.join(IMG_DIR, 'client-qms-portrait.webp'));

  console.log('[client-qms] Built landscape & portrait WebP images.');

  // Generate 8 smooth 8-second Ken-Burns video segments (8 * 8s = 64s total trailer)
  const segPaths = [];
  for (let i = 0; i < localPaths.length; i++) {
    const segOut = path.join(TMP_DIR, `seg-${i + 1}.mp4`);
    const zoomExpr =
      i % 2 === 0
        ? "zoompan=z='min(zoom+0.0006,1.14)':x='iw/2-(iw/zoom/2)':y='(ih-ih/zoom)*on/240':d=240:s=1280x720:fps=30"
        : "zoompan=z='1.14-0.0005*on':x='iw/2-(iw/zoom/2)':y='(ih-ih/zoom)*(1-on/240)':d=240:s=1280x720:fps=30";

    await execFileAsync(ffmpegPath, [
      '-y',
      '-loop', '1',
      '-i', localPaths[i],
      '-vf', `${zoomExpr},setsar=1`,
      '-t', '8',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-preset', 'veryfast',
      '-crf', '24',
      segOut,
    ]);
    segPaths.push(segOut);
  }

  const concatList = path.join(TMP_DIR, 'concat.txt');
  fs.writeFileSync(
    concatList,
    segPaths.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'),
    'utf8'
  );

  const trailerOut = path.join(TRAILER_DIR, 'client-qms.mp4');
  await execFileAsync(ffmpegPath, [
    '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', concatList,
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'veryfast',
    '-crf', '25',
    '-movflags', '+faststart',
    '-an',
    trailerOut,
  ]);

  const stat = fs.statSync(trailerOut);
  console.log(`[client-qms] Built 64s highlight trailer: ${trailerOut} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
}

async function run() {
  await buildBrgyPortal();
  await buildClientQms();
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
