import ffmpegPath from 'ffmpeg-static';
import { execFileSync } from 'child_process';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

const projDir = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/projects';
const outMp4 = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/trailers/nexus-v2.mp4';
const tmpDir = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/.tmp-recordings/nexus-v2-scenes';

fs.mkdirSync(tmpDir, { recursive: true });

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function buildSceneImage(baseImg, outPng, badge, title, sub, accent = '#38BDF8') {
  const width = 1280;
  const height = 720;
  const svg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#050811" stop-opacity="0.25"/>
          <stop offset="65%" stop-color="#050811" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#050811" stop-opacity="0.88"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#g)"/>
      <rect x="48" y="42" width="340" height="36" rx="8" fill="rgba(5,12,24,0.85)" stroke="${accent}" stroke-width="1.5"/>
      <text x="68" y="65" fill="${accent}" font-family="Arial, sans-serif" font-size="14" font-weight="bold" letter-spacing="2">${esc(badge)}</text>
      <text x="48" y="${height - 88}" fill="#ffffff" font-family="Arial, sans-serif" font-size="34" font-weight="bold">${esc(title)}</text>
      <text x="48" y="${height - 50}" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="19">${esc(sub)}</text>
    </svg>
  `);
  await sharp(baseImg)
    .resize(width, height, { fit: 'cover', position: 'north' })
    .composite([{ input: svg, top: 0, left: 0 }])
    .png()
    .toFile(outPng);
}

async function run() {
  const s1 = path.join(tmpDir, 's1.png');
  const s2 = path.join(tmpDir, 's2.png');
  const s3 = path.join(tmpDir, 's3.png');
  const s4 = path.join(tmpDir, 's4.png');

  await buildSceneImage(
    path.join(projDir, 'nexus-v2-landscape.webp'),
    s1,
    'NEXUS V2 · NEXUSPH.XYZ',
    'AI-First Discovery & Natural Search',
    'Instant mood, genre & title discovery powered by TMDB-Embed-API v6.4',
    '#38BDF8'
  );
  await buildSceneImage(
    path.join(projDir, 'nexus-streaming-landscape.webp'),
    s2,
    'MULTI-SOURCE 4K HLS ENGINE',
    '6+ Probed Direct Streaming Providers',
    'FebBox 4K · VidLink · LookMovies · ZeticuzApi · AniKai · AniKoto',
    '#E50914'
  );
  await buildSceneImage(
    path.join(projDir, 'zetflix-tv-landscape.webp'),
    s3,
    'SPECTRUM + REAPER FAILOVER',
    'Dual-Backend Sync & QR TV Login',
    'Real-time SVG Trust Verification Pyramid & passwordless cross-device claim',
    '#10B981'
  );
  await buildSceneImage(
    path.join(projDir, 'nexus-v2-landscape.webp'),
    s4,
    'CUTS VERTICAL TRAILER FEED',
    'TikTok / Reels Short-Form Discovery',
    'Swipe vertical movie trailers with one-tap Full Movie launch',
    '#A855F7'
  );

  const inputs = ['-loop', '1', '-t', '16', '-i', s1, '-loop', '1', '-t', '16', '-i', s2, '-loop', '1', '-t', '16', '-i', s3, '-loop', '1', '-t', '16', '-i', s4];
  const filter = [
    `[0:v]scale=1600:900,zoompan=z='min(zoom+0.0005,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=480:s=1280x720:fps=30,setsar=1[v0];`,
    `[1:v]scale=1600:900,zoompan=z='min(zoom+0.0005,1.15)':x='iw/2-(iw/zoom/2)+20*sin(on/90)':y='ih/2-(ih/zoom/2)':d=480:s=1280x720:fps=30,setsar=1[v1];`,
    `[2:v]scale=1600:900,zoompan=z='min(zoom+0.0005,1.15)':x='iw/2-(iw/zoom/2)-20*sin(on/90)':y='ih/2-(ih/zoom/2)':d=480:s=1280x720:fps=30,setsar=1[v2];`,
    `[3:v]scale=1600:900,zoompan=z='min(zoom+0.0005,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)+15*cos(on/90)':d=480:s=1280x720:fps=30,setsar=1[v3];`,
    `[v0][v1][v2][v3]concat=n=4:v=1:a=0,format=yuv420p[outv]`
  ].join('');

  execFileSync(ffmpegPath, [
    '-y',
    ...inputs,
    '-filter_complex', filter,
    '-map', '[outv]',
    '-t', '64',
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '23',
    '-movflags', '+faststart',
    outMp4,
  ]);

  console.log('Built crisp 64s NEXUS v2 trailer:', outMp4);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
