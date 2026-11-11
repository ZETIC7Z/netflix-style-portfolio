import { chromium } from 'playwright';
import ffmpegPath from 'ffmpeg-static';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const WORK_DIR = 'C:/Users/ZETICUZ/.gemini/antigravity/brain/2ebe0471-be86-443a-b270-3c7e9dc14d84/scratch/careerform-pro';
const OUT_MP4 = path.resolve('public/trailers/careerform-ph.mp4');
const SNAPSAVE_VIDEO = 'C:/Users/ZETICUZ/Downloads/Video/SnapSave_App_1843678583716176_1080p.mp4';

fs.mkdirSync(WORK_DIR, { recursive: true });

// Helper to inject a sleek CapCut/After-Effects commercial cursor & drag indicator
async function injectProCursor(page) {
  await page.evaluate(() => {
    if (document.getElementById('pro-cursor-ring')) return;
    const style = document.createElement('style');
    style.textContent = `
      #pro-cursor-ring {
        position: fixed;
        top: -100px;
        left: -100px;
        width: 34px;
        height: 34px;
        border: 2.5px solid #22d3ee;
        background: radial-gradient(circle, rgba(34,211,238,0.28) 0%, rgba(168,85,247,0.12) 70%, transparent 100%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 2147483647;
        transform: translate(-50%, -50%);
        transition: width 0.15s ease, height 0.15s ease, border-color 0.15s ease, background 0.15s ease;
        box-shadow: 0 0 18px rgba(34,211,238,0.75), inset 0 0 8px rgba(255,255,255,0.4);
      }
      #pro-cursor-ring.dragging {
        width: 48px;
        height: 48px;
        border-color: #facc15;
        background: radial-gradient(circle, rgba(250,204,21,0.38) 0%, rgba(34,211,238,0.2) 70%, transparent 100%);
        box-shadow: 0 0 28px rgba(250,204,21,0.9);
      }
      #pro-cursor-dot {
        position: fixed;
        top: -100px;
        left: -100px;
        width: 8px;
        height: 8px;
        background: #ffffff;
        border-radius: 50%;
        pointer-events: none;
        z-index: 2147483647;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px #22d3ee;
      }
    `;
    document.head.appendChild(style);
    const ring = document.createElement('div');
    ring.id = 'pro-cursor-ring';
    const dot = document.createElement('div');
    dot.id = 'pro-cursor-dot';
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    window.addEventListener('mousemove', (e) => {
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    }, { passive: true });
    window.addEventListener('mousedown', () => ring.classList.add('dragging'), { passive: true });
    window.addEventListener('mouseup', () => ring.classList.remove('dragging'), { passive: true });
  });
}

// Build crisp After-Effects lower-third overlay PNGs
async function buildOverlayPng(filename, stepNum, badge, title, subtitle, accent = '#22d3ee') {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#050814" stop-opacity="0.92"/>
        <stop offset="75%" stop-color="#090d1e" stop-opacity="0.86"/>
        <stop offset="100%" stop-color="#090d1e" stop-opacity="0.0"/>
      </linearGradient>
      <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${accent}"/>
        <stop offset="100%" stop-color="#a855f7"/>
      </linearGradient>
    </defs>
    <!-- Subtle cinematic vignette bar at bottom -->
    <g transform="translate(56, 916)">
      <rect x="0" y="0" width="980" height="112" rx="16" fill="url(#bg)" stroke="${accent}" stroke-opacity="0.45" stroke-width="1.5"/>
      <rect x="0" y="0" width="8" height="112" rx="4" fill="url(#bar)"/>
      <rect x="28" y="18" width="330" height="24" rx="12" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-opacity="0.6" stroke-width="1"/>
      <text x="42" y="34" fill="${accent}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="12" font-weight="800" letter-spacing="2.5">${esc(stepNum)} // ${esc(badge)}</text>
      <text x="28" y="68" fill="#f8fafc" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="26" font-weight="800" letter-spacing="0.5">${esc(title)}</text>
      <text x="28" y="94" fill="#cbd5e1" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="15" font-weight="600" letter-spacing="0.4">${esc(subtitle)}</text>
    </g>
  </svg>`;
  const outPath = path.join(WORK_DIR, filename);
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  return outPath;
}

async function recordClip(name, fn) {
  const clipDir = path.join(WORK_DIR, name);
  fs.mkdirSync(clipDir, { recursive: true });
  for (const f of fs.readdirSync(clipDir)) fs.unlinkSync(path.join(clipDir, f));

  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: { dir: clipDir, size: { width: 1920, height: 1080 } },
  });
  const t0 = Date.now();
  const page = await context.newPage();

  const meta = await fn(page, t0);
  const video = page.video();
  await context.close();
  await browser.close();
  const rawWebm = await video.path();
  return { rawWebm, ...meta };
}

console.log('1. Building After-Effects commercial lower-third overlays...');
const ov1 = await buildOverlayPng(
  'ov1.png',
  'SCENE 01',
  'INTRO ANIMATION & HERO SUITE',
  'CareerForm PH — Official CSC Form 212 Studio',
  'Animated ZETICUZ Splash Intro • 4-in-1 Philippine Civil Service Career Platform',
  '#38bdf8'
);
const ov2 = await buildOverlayPng(
  'ov2.png',
  'SCENE 02',
  'LIVE PDS MIRROR AT 69% ZOOM',
  'Real-Time CS Form 212 Split-Screen Builder',
  'Instant Live PDS Mirror (69% Zoom) • Synchronizes Every Keystroke onto Official Form',
  '#22d3ee'
);
const ov3 = await buildOverlayPng(
  'ov3.png',
  'SCENE 03',
  'INTERACTIVE DRAG & PAN CANVAS',
  'Effortless Live PDS Mirror Dragging & Inspection',
  'Smooth Click-and-Drag Canvas Panning • Live 69%–79% Zoom Controls • Zero Lag',
  '#facc15'
);
const ov4 = await buildOverlayPng(
  'ov4.png',
  'SCENE 04',
  'PAGES C1–C4, THEMES & PDF EXPORT',
  'Complete 4-Page PDS, Luxury Themes & Instant PDF',
  'Family • Education • Eligibility (C2) • Work Experience • 1-Click Official PDF Export',
  '#a855f7'
);

// SCENE 1: Start from very beginning of site load so full intro animation is seen!
console.log('2. Recording Scene 1: Very start of site load (full Intro Animation + Hero Carousel)...');
const existingClip1Dir = path.join(WORK_DIR, 'clip1');
const existingClip1Files = fs.existsSync(existingClip1Dir) ? fs.readdirSync(existingClip1Dir).filter((f) => f.endsWith('.webm')) : [];
const clip1 = existingClip1Files.length
  ? { rawWebm: path.join(existingClip1Dir, existingClip1Files[0]), startSec: 0.2, durationSec: 18.4 }
  : await recordClip('clip1', async (page, t0) => {
      const startSec = (Date.now() - t0) / 1000;
      await page.goto('https://careerform-ph.vercel.app', { waitUntil: 'domcontentloaded' });
      // Let the full intro-splash (intro-zeticuz + intro-sparks) play out naturally!
      await page.waitForTimeout(9000);
      await injectProCursor(page);

      // Now interact with the hero slides & cards energetically
      const slide2 = page.locator('button[aria-label*="slide 2"]');
      if (await slide2.count()) {
        const b = await slide2.first().boundingBox();
        if (b) await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 12 });
        await slide2.first().click();
        await page.waitForTimeout(1100);
      }
      const slide3 = page.locator('button[aria-label*="slide 3"]');
      if (await slide3.count()) {
        const b = await slide3.first().boundingBox();
        if (b) await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 10 });
        await slide3.first().click();
        await page.waitForTimeout(1100);
      }
      const slide1 = page.locator('button[aria-label*="slide 1"]');
      if (await slide1.count()) {
        await slide1.first().click();
        await page.waitForTimeout(900);
      }
      // Smooth scroll to showcase the Live Government Job Portal cards briefly
      await page.evaluate(async () => {
        window.scrollBy({ top: 680, behavior: 'smooth' });
      });
      await page.waitForTimeout(1400);
      const endSec = (Date.now() - t0) / 1000;
      return { startSec: Math.max(0.2, startSec), durationSec: endSec - startSec };
    });

async function preparePdsWorkspace69(page, prefillFull = false) {
  await page.goto('https://careerform-ph.vercel.app/builder', { waitUntil: 'domcontentloaded' });
  // Wait for the 8.8s intro-splash to finish and unmount completely
  await page.waitForFunction(
    () => !document.querySelector('.intro-splash') && !document.body.classList.contains('intro-lock'),
    { timeout: 15000 }
  ).catch(() => {});
  await page.waitForTimeout(400);

  // Click the modal card "Create PDS — Start with official CS Form 212..." to close the modal!
  const createCard = page.locator('button', { hasText: 'Start with official CS Form 212' });
  if (await createCard.count()) {
    await createCard.first().click({ timeout: 5000 });
    await page.waitForTimeout(600);
  }
  await page.evaluate(() => {
    const backdrop = document.querySelector('.nd-backdrop, .modal-backdrop');
    if (backdrop) {
      const btn = backdrop.querySelector('button');
      if (btn) btn.click();
    }
  });
  await page.waitForTimeout(400);

  // IMPORTANT: Populate at least one field (or full top fields for Scene 3/4) FIRST so CareerForm PH mounts
  // the white PERSONAL DATA SHEET canvas and performs its initial 181% auto-zoom BEFORE we lock zoom to 69%!
  if (prefillFull) {
    await page.locator('input[placeholder="Surname"]').first().fill('PANGILINAN');
    await page.locator('input[placeholder="First name"]').first().fill('SAM FAUS SAID ZAHRAN');
    await page.locator('input[placeholder="Middle name"]').first().fill('ZETICUZ');
    await page.locator('input[placeholder="Name extension"]').first().fill('N/A');
    await page.locator('input[type="date"]').first().fill('1995-07-02');
    await page.locator('input[placeholder="Place of birth"]').first().fill('CEBU CITY, PHILIPPINES');
    await page.locator('input[placeholder="e.g. 1.75"]').first().fill('1.70');
    await page.locator('input[placeholder="Weight (kg)"]').first().fill('68');
    await page.locator('input[placeholder="Blood type"]').first().fill('O+');
  } else {
    // For Scene 2 (live typing), pre-fill Name extension="N/A" so the white PDS paper is already mounted!
    await page.locator('input[placeholder="Name extension"]').first().fill('N/A');
  }

  // Wait 2.6s for the white PERSONAL DATA SHEET paper to mount and finish its initial auto-zoom
  await page.waitForTimeout(2600);

  // Calibrate .canvas-stage height so "Reset view" sets React zoom state to 59% and 1 click of "Zoom in" = exact 69%!
  for (let h = 870; h <= 920; h += 3) {
    await page.evaluate((heightPx) => {
      const stage = document.querySelector('.canvas-stage');
      if (stage) {
        stage.style.height = `${heightPx}px`;
        stage.style.minHeight = `${heightPx}px`;
        stage.style.maxHeight = `${heightPx}px`;
      }
    }, h);
    await page.waitForTimeout(60);
    await page.locator('button[title="Reset view"]').evaluate((b) => b.click());
    await page.waitForTimeout(60);
    const zTxt = (await page.locator('.livebar-zoom').textContent()) || '';
    const zVal = parseInt(zTxt, 10);
    if (zVal === 59) {
      await page.locator('button[title="Zoom in"]').evaluate((b) => b.click());
      await page.waitForTimeout(150);
      break;
    }
    if (zVal === 69) {
      break;
    }
  }

  await injectProCursor(page);
  const zoomText = await page.locator('.livebar-zoom').textContent();
  return zoomText;
}

// SCENE 2: Pre-setup PDS Workspace with Live PDS Mirror at 69% Zoom BEFORE capturing, then type live!
console.log('3. Recording Scene 2: PDS Workspace with Live PDS Mirror pre-set to 69% zoom + real-time typing...');
const clip2 = await recordClip('clip2', async (page, t0) => {
  const zoomText = await preparePdsWorkspace69(page, false);
  console.log('Scene 2 pre-capture Live PDS Mirror zoom:', zoomText);

  // ACTION STARTS HERE — Workspace is clean, modal closed, white PDS mirror is mounted & locked at 69%!
  const startSec = (Date.now() - t0) / 1000;
  await page.waitForTimeout(450);

  // Move cursor to highlight the 69% Live PDS mirror badge first
  const zoomBadge = page.locator('.livebar-zoom');
  const zb = await zoomBadge.boundingBox();
  if (zb) {
    await page.mouse.move(zb.x + zb.width / 2, zb.y + zb.height / 2, { steps: 14 });
    await page.waitForTimeout(450);
  }

  // Type into Personal Information fields while Live PDS Mirror updates live at 69%
  const fillField = async (placeholder, value) => {
    const input = page.locator(`input[placeholder="${placeholder}"]`).first();
    if (await input.count()) {
      await input.scrollIntoViewIfNeeded().catch(() => {});
      const box = await input.boundingBox();
      if (box) await page.mouse.move(box.x + 80, box.y + box.height / 2, { steps: 10 });
      await input.focus();
      await input.fill('');
      await input.type(value, { delay: 30 });
      await page.waitForTimeout(200);
    }
  };

  await fillField('Surname', 'PANGILINAN');
  await fillField('First name', 'SAM FAUS SAID ZAHRAN');
  await fillField('Middle name', 'ZETICUZ');

  const dob = page.locator('input[type="date"]').first();
  if (await dob.count()) {
    const box = await dob.boundingBox();
    if (box) await page.mouse.move(box.x + 80, box.y + box.height / 2, { steps: 8 });
    await dob.fill('1995-07-02');
    await page.waitForTimeout(220);
  }

  await fillField('Place of birth', 'CEBU CITY, PHILIPPINES');
  await fillField('e.g. 1.75', '1.70');
  await fillField('Weight (kg)', '68');
  await fillField('Blood type', 'O+');

  await page.waitForTimeout(650);
  const endSec = (Date.now() - t0) / 1000;
  return { startSec, durationSec: endSec - startSec };
});

// SCENE 3: Show how easy it is to DRAG the Live PDS Mirror form at 69% zoom!
console.log('4. Recording Scene 3: Dragging the Live PDS Mirror form canvas smoothly at 69% zoom...');
const clip3 = await recordClip('clip3', async (page, t0) => {
  const zoomText = await preparePdsWorkspace69(page, true);
  console.log('Scene 3 pre-capture Live PDS Mirror zoom:', zoomText);
  await page.waitForTimeout(250);

  // ACTION STARTS HERE — Drag the Live PDS Mirror canvas smoothly!
  const startSec = (Date.now() - t0) / 1000;
  const stage = page.locator('.canvas-stage');
  const box = await stage.boundingBox();
  const cx = box.x + box.width * 0.52;
  const cy = box.y + box.height * 0.48;

  // Move cursor to the Live PDS Mirror canvas
  await page.mouse.move(cx, cy, { steps: 15 });
  await page.waitForTimeout(350);

  // Drag 1: Smoothly drag form upward to inspect lower sections of CS Form 212 Page 1
  await page.mouse.down();
  await page.waitForTimeout(120);
  await page.mouse.move(cx - 35, cy - 220, { steps: 32 });
  await page.waitForTimeout(350);
  // Drag 2: Smoothly pan right & down across the form columns
  await page.mouse.move(cx + 85, cy - 90, { steps: 28 });
  await page.waitForTimeout(350);
  // Drag 3: Pan left & down back to Personal Information header
  await page.mouse.move(cx - 60, cy + 130, { steps: 28 });
  await page.waitForTimeout(300);
  // Drag 4: Center the form cleanly
  await page.mouse.move(cx, cy + 20, { steps: 22 });
  await page.mouse.up();
  await page.waitForTimeout(450);

  // Also show clicking Zoom in (79%) -> dragging -> clicking Zoom out back to 69%
  const zoomIn = page.locator('button[title="Zoom in"]');
  const zib = await zoomIn.boundingBox();
  if (zib) {
    await page.mouse.move(zib.x + zib.width / 2, zib.y + zib.height / 2, { steps: 14 });
    await zoomIn.evaluate((b) => b.click());
    await page.waitForTimeout(400);
  }
  await page.mouse.move(cx, cy, { steps: 12 });
  await page.mouse.down();
  await page.mouse.move(cx - 50, cy - 150, { steps: 24 });
  await page.mouse.move(cx + 20, cy + 40, { steps: 22 });
  await page.mouse.up();
  await page.waitForTimeout(350);

  const zoomOut = page.locator('button[title="Zoom out"]');
  const zob = await zoomOut.boundingBox();
  if (zob) {
    await page.mouse.move(zob.x + zob.width / 2, zob.y + zob.height / 2, { steps: 12 });
    await zoomOut.evaluate((b) => b.click());
    await page.waitForTimeout(500);
  }

  const endSec = (Date.now() - t0) / 1000;
  return { startSec, durationSec: endSec - startSec };
});

// SCENE 4: Multi-step C1 (Family, Education, Skills) -> C2 -> C3 -> C4 + Theme Switcher + Export
console.log('5. Recording Scene 4: Switching PDS Steps (Family, Education, C2, C3, C4), Themes & Export...');
const clip4 = await recordClip('clip4', async (page, t0) => {
  const zoomText = await preparePdsWorkspace69(page, true);
  console.log('Scene 4 pre-capture Live PDS Mirror zoom:', zoomText);

  const startSec = (Date.now() - t0) / 1000;

  const clickStep = async (selector, waitMs = 950) => {
    const el = page.locator(selector).first();
    if (await el.count()) {
      const b = await el.boundingBox();
      if (b) await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 12 });
      await el.evaluate((btn) => btn.click()).catch(() => {});
      await page.waitForTimeout(waitMs);
    }
  };

  await clickStep('button[title="Family Background"]', 900);
  await clickStep('button[title="Educational Background"]', 900);
  await clickStep('button[title*="Switch to PDS C2"]', 1000);

  // Drag the C2 mirror page briefly
  const stage = page.locator('.canvas-stage');
  const box = await stage.boundingBox();
  if (box) {
    const cx = box.x + box.width * 0.5;
    const cy = box.y + box.height * 0.5;
    await page.mouse.move(cx, cy, { steps: 10 });
    await page.mouse.down();
    await page.mouse.move(cx, cy - 140, { steps: 18 });
    await page.mouse.up();
    await page.waitForTimeout(400);
  }

  await clickStep('button[title*="Switch to PDS C3"]', 950);
  await clickStep('button[title*="Switch to PDS C4"]', 1000);

  // Cycle workspace theme color & open Export menu
  await clickStep('button[aria-label="Select workspace theme color"]', 700);
  await clickStep('button[title="Export your official PDS form"]', 1100);

  const endSec = (Date.now() - t0) / 1000;
  return { startSec, durationSec: endSec - startSec };
});

console.log('Recorded 4 high-action clips:', { clip1, clip2, clip3, clip4 });

// Helper to generate a stereo WAV file with cinematic transition whooshes & sub-bass impacts at given transition timestamps
function buildTransitionSfxWav(outWav, durationSec, transitionTimesSec = []) {
  const sampleRate = 44100;
  const totalSamples = Math.floor(sampleRate * durationSec);
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  // Simple seeded PRNG for noise
  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed / 2147483647) * 2 - 1;
  };

  for (const tHit of transitionTimesSec) {
    const startIdx = Math.max(0, Math.floor((tHit - 0.35) * sampleRate));
    const endIdx = Math.min(totalSamples - 1, Math.floor((tHit + 0.85) * sampleRate));
    let lpL = 0;
    let lpR = 0;
    for (let i = startIdx; i <= endIdx; i++) {
      const t = i / sampleRate - tHit; // -0.35 to +0.85
      // 1. Pre-transition riser whoosh (-0.35s to +0.18s)
      let whoosh = 0;
      if (t >= -0.35 && t <= 0.22) {
        const env = Math.sin(((t + 0.35) / 0.57) * Math.PI);
        const cutoff = 0.08 + 0.38 * env;
        lpL += cutoff * (rand() - lpL);
        lpR += cutoff * (rand() - lpR);
        whoosh = env * 0.42;
      }
      // 2. Post-transition sub-bass impact drop (0.0s to +0.80s)
      let impact = 0;
      if (t >= 0 && t <= 0.80) {
        const env = Math.exp(-t * 5.2);
        const freq = 95 * Math.exp(-t * 3.2) + 36;
        impact = Math.sin(2 * Math.PI * freq * t) * env * 0.58;
        // Add subtle crystalline high chime on cut
        const chime = Math.sin(2 * Math.PI * 880 * t) * Math.exp(-t * 14) * 0.14;
        impact += chime;
      }
      const pan = Math.sin(((t + 0.35) / 1.2) * Math.PI);
      left[i] = Math.max(-0.98, Math.min(0.98, left[i] + lpL * whoosh * (1 - 0.3 * pan) + impact));
      right[i] = Math.max(-0.98, Math.min(0.98, right[i] + lpR * whoosh * (1 + 0.3 * pan) + impact));
    }
  }

  // Encode 16-bit stereo PCM WAV
  const numChannels = 2;
  const bytesPerSample = 2;
  const dataSize = totalSamples * numChannels * bytesPerSample;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(numChannels, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28);
  buf.writeUInt16LE(numChannels * bytesPerSample, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const sL = Math.max(-1, Math.min(1, left[i]));
    const sR = Math.max(-1, Math.min(1, right[i]));
    buf.writeInt16LE(Math.round(sL * 32767), offset);
    buf.writeInt16LE(Math.round(sR * 32767), offset + 2);
    offset += 4;
  }
  fs.writeFileSync(outWav, buf);
}

function processScene(rawWebm, startSec, speedFactor, targetDurSec, overlayPng, outMp4, zoomPunch = false) {
  const ptsExpr = `${(1 / speedFactor).toFixed(4)}*PTS`;
  // Optional subtle cinematic framing punch during the scene
  const zoomFilter = zoomPunch
    ? `,crop=1840:1035:40:22,scale=1920:1080:flags=lanczos`
    : '';
  const filterComplex = `[0:v]trim=start=${startSec.toFixed(2)},setpts=PTS-STARTPTS,setpts=${ptsExpr},fps=30,scale=1920:1080:flags=lanczos,eq=contrast=1.05:saturation=1.12${zoomFilter}[base];[base][1:v]overlay=0:0:enable='between(t,0.4,${(targetDurSec - 0.3).toFixed(2)})'[outv]`;

  execFileSync(ffmpegPath, [
    '-y',
    '-i', rawWebm,
    '-i', overlayPng,
    '-filter_complex', filterComplex,
    '-map', '[outv]',
    '-t', String(targetDurSec),
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '19',
    '-pix_fmt', 'yuv420p',
    '-an',
    outMp4,
  ]);
}

console.log('6. Processing & color-grading individual scenes with After-Effects HUD callouts...');
const s0 = path.join(WORK_DIR, 's0_bumper.mp4');
const s1 = path.join(WORK_DIR, 's1_intro.mp4');
const s2 = path.join(WORK_DIR, 's2_typing69.mp4');
const s3 = path.join(WORK_DIR, 's3_drag69.mp4');
const s4 = path.join(WORK_DIR, 's4_steps.mp4');

// S0: 4.5s 3D ZE ZETICUZ metallic studio bumper
execFileSync(ffmpegPath, [
  '-y',
  '-ss', '0.3',
  '-t', '4.5',
  '-i', SNAPSAVE_VIDEO,
  '-vf', 'crop=1076:606:0:654,scale=1920:1080:flags=lanczos,setsar=1,fps=30',
  '-c:v', 'libx264',
  '-preset', 'fast',
  '-crf', '18',
  '-pix_fmt', 'yuv420p',
  '-an',
  s0,
]);

// S1: 12.5s — Starts right at site load so full intro animation + hero carousel are seen!
processScene(clip1.rawWebm, 0.15, 1.18, 12.5, ov1, s1, false);
// S2: 14.5s — Pre-configured 69% Live PDS Mirror zoom + real-time typing synchronization!
processScene(clip2.rawWebm, clip2.startSec, 1.38, 14.5, ov2, s2, true);
// S3: 13.5s — Smooth click-and-drag panning of the Live PDS Mirror form at 69% zoom!
processScene(clip3.rawWebm, clip3.startSec, 1.25, 13.5, ov3, s3, false);
// S4: 12.0s — Multi-step C1–C4 pages, luxury theme switcher & Export modal!
processScene(clip4.rawWebm, clip4.startSec, 1.32, 12.0, ov4, s4, true);

// 7. Join s0 -> s1 -> s2 -> s3 -> s4 with After-Effects / CapCut xfade transitions!
// Durations: d0=4.5, d1=12.5, d2=14.5, d3=13.5, d4=12.0, xfade=0.6s
// Offsets:
// o1 = 4.5 - 0.6 = 3.9
// o2 = 3.9 + 12.5 - 0.6 = 15.8
// o3 = 15.8 + 14.5 - 0.6 = 29.7
// o4 = 29.7 + 13.5 - 0.6 = 42.6
// Total duration = 42.6 + 12.0 = 54.6s
const sfxWav = path.join(WORK_DIR, 'transitions_sfx.wav');
buildTransitionSfxWav(sfxWav, 55.0, [0.2, 3.9, 15.8, 29.7, 42.6]);

console.log('7. Compositing xfade transitions (zoomin, slideleft, smoothleft, wiperight) + stereo soundtrack & transition SFX...');
const xfadeComplex = [
  '[0:v][1:v]xfade=transition=zoomin:duration=0.6:offset=3.9[v01]',
  '[v01][2:v]xfade=transition=slideleft:duration=0.6:offset=15.8[v02]',
  '[v02][3:v]xfade=transition=smoothleft:duration=0.6:offset=29.7[v03]',
  '[v03][4:v]xfade=transition=wiperight:duration=0.6:offset=42.6,format=yuv420p[outv]',
  '[5:a]atrim=start=58:duration=54.6,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1.2,afade=t=out:st=52.6:d=2.0,volume=0.85[bgm]',
  '[6:a]atrim=start=0:duration=54.6,asetpts=PTS-STARTPTS,volume=1.15[sfx]',
  '[bgm][sfx]amix=inputs=2:duration=first:dropout_transition=0[outa]',
].join(';');

execFileSync(ffmpegPath, [
  '-y',
  '-i', s0,
  '-i', s1,
  '-i', s2,
  '-i', s3,
  '-i', s4,
  '-i', SNAPSAVE_VIDEO,
  '-i', sfxWav,
  '-filter_complex', xfadeComplex,
  '-map', '[outv]',
  '-map', '[outa]',
  '-c:v', 'libx264',
  '-preset', 'fast',
  '-crf', '20',
  '-pix_fmt', 'yuv420p',
  '-c:a', 'aac',
  '-b:a', '192k',
  '-movflags', '+faststart',
  OUT_MP4,
]);

console.log('SUCCESS! Built cinematic CareerForm PH trailer:', OUT_MP4);
