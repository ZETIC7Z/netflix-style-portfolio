import { chromium } from 'playwright';
import ffmpegPath from 'ffmpeg-static';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outDir = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/trailers';
const projDir = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/projects';
const tmpDir = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/.tmp-recordings';

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(projDir, { recursive: true });
fs.mkdirSync(tmpDir, { recursive: true });

const PROJECTS = [
  {
    id: 'nexus-v2',
    url: 'https://www.nexusph.xyz/',
    captureImages: true,
    fallbackImage: 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/projects/nexus-streaming-landscape.webp',
  },
  {
    id: 'nexus-streaming',
    url: 'https://www.zeticuz.online',
    fallbackImage: 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/projects/nexus-streaming-landscape.webp',
  },
  {
    id: 'zetflix-tv',
    url: 'https://zetflix-tv.vercel.app',
    fallbackImage: 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/projects/zetflix-tv-landscape.webp',
  },
  {
    id: 'careerform-ph',
    url: 'https://careerform-ph.vercel.app/',
    fallbackImage: 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/projects/careerform-ph-landscape.webp',
  },
  {
    id: 'lifecoach-v1',
    url: 'https://lifecoachdoc.vercel.app/',
    fallbackImage: 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/projects/lifecoach-v1-landscape.webp',
  },
  {
    id: 'lifecoach-v2',
    url: 'https://lifecoachdoc2.vercel.app/',
    fallbackImage: 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/projects/lifecoach-v2-landscape.webp',
  },
  {
    id: 'nwanganga-shields',
    url: 'https://nwanganga-shields.vercel.app',
    fallbackImage: 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/projects/nwanganga-shields-landscape.webp',
  },
  {
    id: 'sws-skeptrons',
    url: 'https://sws-skeptrons.vercel.app',
    fallbackImage: 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/projects/sws-skeptrons-landscape.webp',
  },
  {
    id: 'dekaron-stampede',
    url: 'https://dekaron-stampede.vercel.app',
    fallbackImage: 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/projects/dekaron-stampede-landscape.webp',
  },
];

function createFallbackTrailer(id, imgPath, outMp4) {
  console.log(`  [Fallback] Generating 62s Ken-Burns cinematic trailer from ${imgPath} -> ${outMp4}`);
  const filter = [
    `[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,`,
    `zoompan=z='1+0.12*sin(on/360*PI)':x='iw/2-(iw/zoom/2)+40*sin(on/180*PI)':y='ih/2-(ih/zoom/2)+25*cos(on/180*PI)':d=1860:s=1280x720:fps=30,`,
    `eq=contrast=1.06:saturation=1.12,format=yuv420p[v]`
  ].join('');

  execFileSync(ffmpegPath, [
    '-y',
    '-loop', '1',
    '-i', imgPath,
    '-filter_complex', filter,
    '-map', '[v]',
    '-t', '62',
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '24',
    '-movflags', '+faststart',
    outMp4,
  ], { stdio: 'ignore' });
}

function editRecordingTo62s(rawWebm, outMp4) {
  console.log(`  [FFmpeg] Auto-editing recording into 62s 4-Act Netflix trailer -> ${outMp4}`);
  // Raw recording is ~15.5s -> 4 acts (Normal pass -> Feature zoom pass -> Reverse scroll pass -> Hero close-up pass) = 62s
  const filter = [
    `[0:v]fps=30,scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,eq=contrast=1.05:saturation=1.08,split=4[v1][v2][v3][v4];`,
    `[v2]crop=1100:618:90:50,scale=1280:720[v2z];`,
    `[v3]reverse[v3r];`,
    `[v4]crop=1160:652:60:20,scale=1280:720[v4z];`,
    `[v1][v2z][v3r][v4z]concat=n=4:v=1:a=0,format=yuv420p[outv]`
  ].join('');

  execFileSync(ffmpegPath, [
    '-y',
    '-i', rawWebm,
    '-filter_complex', filter,
    '-map', '[outv]',
    '-t', '62',
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '24',
    '-movflags', '+faststart',
    outMp4,
  ], { stdio: 'ignore' });
}

async function run() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  for (const proj of PROJECTS) {
    const outMp4 = path.join(outDir, `${proj.id}.mp4`);
    console.log(`\n=== Processing ${proj.id} (${proj.url}) ===`);

    const projTmp = path.join(tmpDir, proj.id);
    fs.mkdirSync(projTmp, { recursive: true });

    let context;
    let videoPath = null;
    try {
      context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        recordVideo: {
          dir: projTmp,
          size: { width: 1280, height: 720 },
        },
        ignoreHTTPSErrors: true,
      });

      const page = await context.newPage();
      await page.goto(proj.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(2500);

      // Dismiss any intro splash or modal buttons if present
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button, a'));
        const dismiss = btns.find(b => /skip|close|dismiss|enter|got it|accept/i.test(b.textContent || ''));
        if (dismiss && dismiss.offsetParent !== null) {
          // Only click if it looks like a splash or cookie banner
          if (/skip|accept|dismiss|got it/i.test(dismiss.textContent || '')) dismiss.click();
        }
      }).catch(() => {});

      if (proj.captureImages) {
        const heroPng = path.join(projTmp, `${proj.id}-hero.png`);
        await page.screenshot({ path: heroPng });
        await sharp(heroPng)
          .resize(1280, 720, { fit: 'cover', position: 'north' })
          .webp({ quality: 90 })
          .toFile(path.join(projDir, `${proj.id}-landscape.webp`));

        // Also capture portrait view
        const portPage = await browser.newPage({ viewport: { width: 540, height: 810 } });
        try {
          await portPage.goto(proj.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
          await portPage.waitForTimeout(2000);
          const portPng = path.join(projTmp, `${proj.id}-port.png`);
          await portPage.screenshot({ path: portPng });
          await sharp(portPng)
            .resize(540, 810, { fit: 'cover', position: 'north' })
            .webp({ quality: 90 })
            .toFile(path.join(projDir, `${proj.id}-portrait.webp`));
        } catch {
          await sharp(heroPng)
            .resize(540, 810, { fit: 'cover', position: 'center' })
            .webp({ quality: 90 })
            .toFile(path.join(projDir, `${proj.id}-portrait.webp`));
        } finally {
          await portPage.close();
        }
        console.log(`  [Images] Saved ${proj.id}-landscape.webp & ${proj.id}-portrait.webp`);
      }

      // Smooth cinematic tour across the live site (~13.5 seconds + 2.5s initial = ~16s raw video)
      await page.evaluate(async () => {
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        const smoothScrollTo = async (targetY, durationMs) => {
          const startY = window.scrollY;
          const diff = targetY - startY;
          const steps = Math.max(15, Math.floor(durationMs / 33));
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            window.scrollTo(0, startY + diff * ease);
            await sleep(33);
          }
        };

        const totalH = Math.max(
          document.body.scrollHeight || 0,
          document.documentElement.scrollHeight || 0,
          2400
        ) - window.innerHeight;
        const maxScroll = Math.min(Math.max(totalH, 800), 4200);

        await sleep(1000);
        await smoothScrollTo(maxScroll * 0.35, 2800);
        await sleep(900);
        await smoothScrollTo(maxScroll * 0.72, 2800);
        await sleep(900);
        await smoothScrollTo(maxScroll, 2400);
        await sleep(800);
        await smoothScrollTo(0, 2200);
        await sleep(600);
      });

      const video = page.video();
      await page.close();
      await context.close();
      if (video) {
        videoPath = await video.path();
      }
    } catch (err) {
      console.warn(`  [Warn] Live recording issue on ${proj.id}: ${err.message}`);
      try { if (context) await context.close(); } catch {}
    }

    if (videoPath && fs.existsSync(videoPath) && fs.statSync(videoPath).size > 15000) {
      try {
        editRecordingTo62s(videoPath, outMp4);
        console.log(`  [Done] Created 62s trailer: ${outMp4}`);
      } catch (ffErr) {
        console.warn(`  [Warn] FFmpeg edit failed for ${proj.id}, using fallback: ${ffErr.message}`);
        createFallbackTrailer(proj.id, proj.fallbackImage, outMp4);
      }
    } else {
      createFallbackTrailer(proj.id, proj.fallbackImage, outMp4);
    }
  }

  await browser.close();
  console.log('\nAll trailers generated in public/trailers!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
