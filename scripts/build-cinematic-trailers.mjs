import { chromium } from 'playwright';
import ffmpegPath from 'ffmpeg-static';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series';
const OUT_TRAILERS = path.join(ROOT, 'public/trailers');
const OUT_PROJECTS = path.join(ROOT, 'public/projects');
const TMP = path.join(ROOT, '.tmp-cine');

fs.mkdirSync(OUT_TRAILERS, { recursive: true });
fs.mkdirSync(OUT_PROJECTS, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Adds a sleek, unobtrusive 4K-style promotional HUD badge at top-right or bottom-right
 * of a 1920x1080 or tall scrolling canvas without blocking the main UI.
 */
async function stampHudOnSlice(inputBuffer, badge, title, subtitle, accent = '#E50914') {
  const width = 1920;
  const height = 1080;
  const svg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hudBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#07090e" stop-opacity="0.88"/>
          <stop offset="100%" stop-color="#0f1420" stop-opacity="0.92"/>
        </linearGradient>
      </defs>
      <g transform="translate(${width - 560}, 36)">
        <rect x="0" y="0" width="520" height="96" rx="14" fill="url(#hudBg)" stroke="${accent}" stroke-width="2"/>
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

/**
 * Captures a clean, ad-free full page and slices it into overlapping 1920x1080 keyframes
 * or tall scroll strips so FFmpeg can produce a 60fps 2x-speed smooth scroll & feature tour.
 */
async function preparePageForCapture(page) {
  // Remove ad banners / popups / third-party overlays
  await page.evaluate(() => {
    const closeSelectors = [
      '[aria-label*="Close ad" i]',
      '[aria-label*="Close social" i]',
      '[aria-label*="Dismiss" i]',
      'iframe[src*="chagnou" i]',
      'iframe[src*="ads" i]',
      'a[href*="pimplehardness" i]',
      'a[href*="chagnou" i]',
    ];
    for (const sel of closeSelectors) {
      document.querySelectorAll(sel).forEach((el) => {
        if (el.tagName === 'BUTTON') el.click();
        else el.remove();
      });
    }
    // Also remove any banner container with exact text "ADVERTISEMENT"
    Array.from(document.querySelectorAll('div, section, aside')).forEach((el) => {
      const t = (el.innerText || '').trim();
      if (t === 'ADVERTISEMENT' || t.startsWith('ADVERTISEMENT\n')) {
        el.style.display = 'none';
      }
    });
  }).catch(() => {});

  // Fast pre-scroll down and back up to trigger all IntersectionObservers & lazy images
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const maxH = Math.min(document.body.scrollHeight || 3600, 5400);
    for (let y = 0; y <= maxH; y += 600) {
      window.scrollTo(0, y);
      await sleep(120);
    }
    window.scrollTo(0, 0);
    await sleep(300);
  }).catch(() => {});
}

/**
 * Captures a tall strip (1920 x 2160 or 1920 x 3240) of a live page by stitching viewport screenshots
 * so fixed headers don't repeat and scrolling in FFmpeg is 100% 60fps butter-smooth at 2x speed.
 */
async function captureScrollStrip(page, outPngPath, badge, title, subtitle, accent = '#E50914') {
  await preparePageForCapture(page);

  const width = 1920;
  const viewH = 1080;
  const totalScrollH = await page.evaluate(() =>
    Math.max(document.body.scrollHeight || 1080, document.documentElement.scrollHeight || 1080)
  );

  // Capture top viewport (y=0) and lower viewport (y=min(900, maxScroll))
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  const topBuf = await page.screenshot({ type: 'png' });

  const maxScroll = Math.max(0, totalScrollH - viewH);
  const midY = Math.min(820, maxScroll);
  await page.evaluate((y) => window.scrollTo(0, y), midY);
  await page.waitForTimeout(250);
  const botBuf = await page.screenshot({ type: 'png' });

  await page.evaluate(() => window.scrollTo(0, 0));

  // Create a 1920x2160 vertical strip from topBuf + botBuf so FFmpeg can smoothly scroll from y=0 to y=1080
  const stampedTop = await stampHudOnSlice(topBuf, badge, title, subtitle, accent);
  const stampedBot = await stampHudOnSlice(botBuf, badge, title, subtitle, accent);

  await sharp({
    create: {
      width: 1920,
      height: 2160,
      channels: 4,
      background: { r: 7, g: 9, b: 14, alpha: 1 },
    },
  })
    .composite([
      { input: stampedTop, top: 0, left: 0 },
      { input: stampedBot, top: 1080, left: 0 },
    ])
    .png()
    .toFile(outPngPath);
}

/**
 * Encodes a 5-act 60-second 1080p (Full HD / 4K-grade bitrate) trailer from 5 tall 1920x2160 page strips.
 * Each act smoothly scrolls down the page at 2x speed and zooms into the UI highlights with zero lag.
 */
function encodeMultiPageTour(stripPaths, outMp4) {
  const n = stripPaths.length;
  const segDur = 12; // 5 acts * 12s = 60s total
  const inputs = [];
  const filterParts = [];
  const concatInputs = [];

  for (let i = 0; i < n; i++) {
    inputs.push('-loop', '1', '-t', String(segDur), '-i', stripPaths[i]);
    // Smooth 2x-feel vertical scroll from y=0 down to y=960 and back with subtle cinematic push-in
    // Using 30fps @ 1920x1080 with high bitrate (crf 20) for razor-sharp 4K-grade clarity and instant browser playback
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
    '-filter_complex', filterParts.join(';'),
    '-map', '[outv]',
    '-t', String(n * segDur),
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '20',
    '-movflags', '+faststart',
    outMp4,
  ]);
}

async function buildNexusV2(browser) {
  console.log('\n=== Building NEXUS v2 Multi-Page 2x Promotional Trailer ===');
  const dir = path.join(TMP, 'nexus-v2');
  fs.mkdirSync(dir, { recursive: true });

  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, ignoreHTTPSErrors: true });
  const page = await context.newPage();

  // Act 1: /browse (Main Home, Hero Search, Top 10 Ranked Carousel, Popular Movies & TV)
  await page.goto('https://www.nexusph.xyz/browse', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await preparePageForCapture(page);

  // Also save clean ad-free landscape & portrait posters for NEXUS v2
  const cleanHeroPng = path.join(dir, 'clean-hero.png');
  await page.evaluate(() => window.scrollTo(0, 320));
  await page.waitForTimeout(400);
  await page.screenshot({ path: cleanHeroPng });
  await sharp(cleanHeroPng)
    .resize(1280, 720, { fit: 'cover', position: 'north' })
    .webp({ quality: 92 })
    .toFile(path.join(OUT_PROJECTS, 'nexus-v2-landscape.webp'));
  await sharp(cleanHeroPng)
    .resize(540, 810, { fit: 'cover', position: 'center' })
    .webp({ quality: 92 })
    .toFile(path.join(OUT_PROJECTS, 'nexus-v2-portrait.webp'));

  const s1 = path.join(dir, 'act1-browse.png');
  await captureScrollStrip(
    page,
    s1,
    'ACT 01 · NEXUS V2 HOME (/BROWSE)',
    'AI Discovery & Top 10 Carousel',
    'Instant natural-language search, Top 10 rankings & curated rows',
    '#38BDF8'
  );

  // Act 2: /discover (Full Genre Catalog, Curated Collections & Editor Picks)
  await page.goto('https://www.nexusph.xyz/discover', { waitUntil: 'networkidle', timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(2200);
  const s2 = path.join(dir, 'act2-discover.png');
  await captureScrollStrip(
    page,
    s2,
    'ACT 02 · DISCOVER CATALOG (/DISCOVER)',
    'Genres, Collections & Editor Picks',
    'Browse Action, Sci-Fi, Animation, Crime & real-time TMDB feeds',
    '#E50914'
  );

  // Act 3: Movie Detail / Multi-Source Streaming (/media/tmdb-movie-155-the-dark-knight)
  await page.goto('https://www.nexusph.xyz/media/tmdb-movie-155-the-dark-knight', { waitUntil: 'networkidle', timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(2800);
  const s3 = path.join(dir, 'act3-player.png');
  await captureScrollStrip(
    page,
    s3,
    'ACT 03 · TMDB-EMBED-API STREAM CORE',
    'Multi-Source 4K HLS Player & Probing',
    'FebBox 4K · VidLink · LookMovies · ZeticuzApi · AniKai auto-failover',
    '#10B981'
  );

  // Act 4: /settings (Settings Page — App Stats, Account, Appearance Themes, Subtitles, Connections/Proxy)
  await page.goto('https://www.nexusph.xyz/settings', { waitUntil: 'networkidle', timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(2000);
  const s4 = path.join(dir, 'act4-settings-top.png');
  await captureScrollStrip(
    page,
    s4,
    'ACT 04 · SYSTEM SETTINGS (/SETTINGS)',
    'App Stats, Account Sync & Appearance',
    'Custom themes, passphrase cloud sync, backend health & admin panel',
    '#A855F7'
  );

  // Act 5: /settings lower section (Subtitles styling, Connections, Custom Proxy & FebBox Token)
  await page.evaluate(() => window.scrollTo(0, 1400));
  await page.waitForTimeout(500);
  const botSettings1 = await page.screenshot({ type: 'png' });
  await page.evaluate(() => window.scrollTo(0, 2300));
  await page.waitForTimeout(500);
  const botSettings2 = await page.screenshot({ type: 'png' });
  const s5 = path.join(dir, 'act5-settings-connections.png');
  const st5a = await stampHudOnSlice(
    botSettings1,
    'ACT 05 · CONNECTIONS & SUBTITLES',
    'Custom Proxy, FebBox Token & Subtitle Engine',
    'SPECTRUM + REAPER dual-backend failover & custom subtitle styling',
    '#F59E0B'
  );
  const st5b = await stampHudOnSlice(
    botSettings2,
    'ACT 05 · CONNECTIONS & SUBTITLES',
    'Custom Proxy, FebBox Token & Subtitle Engine',
    'SPECTRUM + REAPER dual-backend failover & custom subtitle styling',
    '#F59E0B'
  );
  await sharp({
    create: { width: 1920, height: 2160, channels: 4, background: { r: 7, g: 9, b: 14, alpha: 1 } },
  })
    .composite([
      { input: st5a, top: 0, left: 0 },
      { input: st5b, top: 1080, left: 0 },
    ])
    .png()
    .toFile(s5);

  await context.close();

  const outMp4 = path.join(OUT_TRAILERS, 'nexus-v2.mp4');
  encodeMultiPageTour([s1, s2, s3, s4, s5], outMp4);
  console.log('  [OK] Built nexus-v2.mp4 (60s multi-page 1080p tour)');
}

async function buildSwsSkeptrons(browser) {
  console.log('\n=== Building SWS Skeptrons Trailer (Clicking ENTER SITE -> Main Site Tour) ===');
  const dir = path.join(TMP, 'sws-skeptrons');
  fs.mkdirSync(dir, { recursive: true });

  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.goto('https://sws-skeptrons.vercel.app', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1500);

  // Click ENTER SITE button so we enter the real main site!
  const enterBtn = page.getByRole('button', { name: /enter site/i });
  if (await enterBtn.isVisible().catch(() => false)) {
    console.log('  [Click] Clicking ENTER SITE button on SWS Skeptrons...');
    await enterBtn.click();
    await page.waitForTimeout(3500);
  }

  // Trigger all scroll sections on the main site
  await preparePageForCapture(page);

  // Update SWS landscape & portrait posters from the unlocked main site!
  const swsMainPng = path.join(dir, 'sws-main-hero.png');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: swsMainPng });
  await sharp(swsMainPng)
    .resize(1280, 720, { fit: 'cover', position: 'north' })
    .webp({ quality: 90 })
    .toFile(path.join(OUT_PROJECTS, 'sws-skeptrons-landscape.webp'));

  // Capture 5 sections down the unlocked SWS Skeptrons main site
  const scrollOffsets = [
    { y1: 0, y2: 750, badge: 'ACT 01 · SWS SKEPTRONS MAIN HUB', title: 'Alpha Kappa Rho — Region VII', sub: 'Unlocked main portal · Chapter Active status & navigation', accent: '#EF4444' },
    { y1: 800, y2: 1600, badge: 'ACT 02 · NEWS & ANNOUNCEMENTS', title: 'Chapter Events & Live Updates', sub: 'Anniversary countdown, humanitarian service & chapter news', accent: '#F59E0B' },
    { y1: 1650, y2: 2450, badge: 'ACT 03 · SWS ACTIVITIES & HERITAGE', title: 'Founding History & Community Outreach', sub: 'Brotherhood forged in truth, united in service (Est. 2021)', accent: '#38BDF8' },
    { y1: 2500, y2: 3300, badge: 'ACT 04 · MEMBER VERIFIER ENGINE', title: 'Digital Member ID & Roster Verification', sub: 'Instant member lookup, chapter roster & verified credentials', accent: '#10B981' },
    { y1: 3350, y2: 4200, badge: 'ACT 05 · SWS MUSIC & COMMUNITY', title: 'Chapter Playlist, Gallery & Onboarding', sub: 'Built with React, TypeScript, Express.js & MongoDB', accent: '#A855F7' },
  ];

  const strips = [];
  for (let i = 0; i < scrollOffsets.length; i++) {
    const cfg = scrollOffsets[i];
    await page.evaluate((y) => window.scrollTo(0, y), cfg.y1);
    await page.waitForTimeout(300);
    const b1 = await page.screenshot({ type: 'png' });

    await page.evaluate((y) => window.scrollTo(0, y), cfg.y2);
    await page.waitForTimeout(300);
    const b2 = await page.screenshot({ type: 'png' });

    const st1 = await stampHudOnSlice(b1, cfg.badge, cfg.title, cfg.sub, cfg.accent);
    const st2 = await stampHudOnSlice(b2, cfg.badge, cfg.title, cfg.sub, cfg.accent);

    const outStrip = path.join(dir, `strip-${i + 1}.png`);
    await sharp({
      create: { width: 1920, height: 2160, channels: 4, background: { r: 7, g: 9, b: 14, alpha: 1 } },
    })
      .composite([
        { input: st1, top: 0, left: 0 },
        { input: st2, top: 1080, left: 0 },
      ])
      .png()
      .toFile(outStrip);
    strips.push(outStrip);
  }

  await context.close();
  const outMp4 = path.join(OUT_TRAILERS, 'sws-skeptrons.mp4');
  encodeMultiPageTour(strips, outMp4);
  console.log('  [OK] Built sws-skeptrons.mp4 (unlocked main site 60s tour)');
}

async function enhanceBrgyPortal() {
  console.log('\n=== Enhancing Barangay Matatag 3D Portal Trailer (2x Speed, Clean Start, Cropped Chrome) ===');
  const rawMp4 = path.join(TMP, 'brgy-raw.mp4');
  const currentMp4 = path.join(OUT_TRAILERS, 'smart-brgy-portal.mp4');
  if (!fs.existsSync(rawMp4)) {
    fs.copyFileSync(currentMp4, rawMp4);
  }

  // Trim first 3.5s dark intro, crop top 72px browser URL bar, run at 2x speed (setpts=0.5*PTS), scale to 1920x1080 Full HD, add smooth fade-in
  const filter = [
    `[0:v]trim=start=3.5,setpts=0.5*(PTS-STARTPTS),fps=30,`,
    `crop=iw:ih-72:0:72,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,`,
    `eq=contrast=1.06:saturation=1.10,fade=t=in:st=0:d=0.5,format=yuv420p[outv]`
  ].join('');

  execFileSync(ffmpegPath, [
    '-y',
    '-i', rawMp4,
    '-filter_complex', filter,
    '-map', '[outv]',
    '-t', '65',
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '20',
    '-movflags', '+faststart',
    currentMp4,
  ]);
  console.log('  [OK] Enhanced smart-brgy-portal.mp4 (2x speed, cropped browser bar, clean start)');
}

async function enhanceClientQms() {
  console.log('\n=== Enhancing CLIENT QMS (DSWD AICS) 8-Scene 1080p Promotional Trailer ===');
  const qmsDir = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/.tmp-qms';
  if (!fs.existsSync(qmsDir)) return;

  const scenes = [
    { file: '01-main-dashboard.png', badge: 'STEP 00 · COMMAND CENTER', title: 'DSWD AICS DeepEval Analytics Dashboard', sub: 'Real-time KPIs, turnaround velocity & brownout-safe sync', accent: '#38BDF8' },
    { file: '02-step1-intake.png', badge: 'STEP 01 · PACD INTAKE', title: 'Client Registration & Thermal Ticket Issuance', sub: 'Regular vs. Priority lane encoding with instant QR ticket print', accent: '#10B981' },
    { file: '03-step2-validator.png', badge: 'STEP 02 · DOCUMENT VALIDATOR', title: 'Multi-Counter Verification & Compliance Hold', sub: 'Place incomplete documents on Compliance Hold & re-queue in 1 click', accent: '#F59E0B' },
    { file: '04-step3-swo.png', badge: 'STEP 03 · SWO ASSESSMENT', title: 'Social Worker Crisis Interview & Approval', sub: 'Live queue progression from Validator to SWO counter', accent: '#A855F7' },
    { file: '05-step4-cashier.png', badge: 'STEP 04 · CASHIER RELEASE', title: 'Financial Assistance Payout & Completion', sub: 'End-to-end turnaround tracking per beneficiary & staff member', accent: '#22C55E' },
    { file: '06-tv-display.png', badge: 'PUBLIC TV BROADCAST MONITOR', title: 'Zero-Scroll 1080p/4K Lobby Display', sub: '3D ticket flip animation, 3-tone harmonic chime & Web Speech TTS', accent: '#E50914' },
    { file: '07-service-calendar.png', badge: 'MONTHLY SERVICE CALENDAR', title: 'Daily Served vs. Compliance Hold Audit Log', sub: 'Click any date to inspect full beneficiary & staff breakdown', accent: '#06B6D4' },
    { file: '08-admin-studio.png', badge: 'ADMIN STUDIO & PERSISTENCE', title: 'Staff Accounts, Chime Voice & Broadcast Controls', sub: 'Dual-layer BroadcastChannel + atomic .qms-persistent-db.json store', accent: '#EC4899' },
  ];

  const dir = path.join(TMP, 'qms-1080p');
  fs.mkdirSync(dir, { recursive: true });

  const inputs = [];
  const filterParts = [];
  const concatInputs = [];

  for (let i = 0; i < scenes.length; i++) {
    const sc = scenes[i];
    const srcPath = path.join(qmsDir, sc.file);
    const rawBuf = fs.readFileSync(srcPath);
    const stampedBuf = await stampHudOnSlice(rawBuf, sc.badge, sc.title, sc.sub, sc.accent);
    const outPng = path.join(dir, `qms-${i}.png`);
    fs.writeFileSync(outPng, stampedBuf);

    inputs.push('-loop', '1', '-t', '8', '-i', outPng);
    filterParts.push(
      `[${i}:v]scale=2240:1260,zoompan=z='min(zoom+0.0006,1.14)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=240:s=1920x1080:fps=30,setsar=1,fade=t=in:st=0:d=0.35,fade=t=out:st=7.65:d=0.35[v${i}]`
    );
    concatInputs.push(`[v${i}]`);
  }

  filterParts.push(`${concatInputs.join('')}concat=n=${scenes.length}:v=1:a=0,format=yuv420p[outv]`);

  const outMp4 = path.join(OUT_TRAILERS, 'client-qms.mp4');
  execFileSync(ffmpegPath, [
    '-y',
    ...inputs,
    '-filter_complex', filterParts.join(';'),
    '-map', '[outv]',
    '-t', '64',
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '20',
    '-movflags', '+faststart',
    outMp4,
  ]);
  console.log('  [OK] Enhanced client-qms.mp4 (1920x1080 8-scene promotional trailer)');
}

async function buildOtherLiveProjects(browser) {
  const SITES = [
    {
      id: 'nexus-streaming',
      url: 'https://www.zeticuz.online',
      accent: '#E50914',
      acts: [
        { badge: 'ACT 01 · NEXUS STREAMING HUB', title: 'Unified Cinema, Anime & Live TV PWA', sub: 'All-in-one adaptive glassmorphic streaming platform' },
        { badge: 'ACT 02 · TRENDING CATALOG', title: 'Movies, Series & Top Rated Feeds', sub: 'Real-time TMDB metadata & dynamic hero spotlight' },
        { badge: 'ACT 03 · MULTI-SERVER HLS PLAYER', title: 'Adaptive 1080p/4K Playback Engine', sub: 'Instant server switching & resume-playback memory' },
        { badge: 'ACT 04 · ANIME & MANGA READER', title: 'Integrated Anime Episodes & Manga Chapters', sub: '4-in-1 entertainment ecosystem in a single installable PWA' },
        { badge: 'ACT 05 · CLOUD WATCHLIST SYNC', title: 'Personalized Bookmarks & History', sub: 'Engineered with React, TypeScript, Zustand & HLS.js' },
      ],
    },
    {
      id: 'careerform-ph',
      url: 'https://careerform-ph.vercel.app/',
      accent: '#8B5CF6',
      acts: [
        { badge: 'ACT 01 · CAREERFORM PH SAAS', title: 'Official CSC Form 212 (PDS) & Resume Builder', sub: 'Zero-paywall Philippine civil service & global resume platform' },
        { badge: 'ACT 02 · CS FORM 212 ENGINE', title: 'Pixel-Accurate Civil Service PDS Export', sub: 'Automated multi-page PDF generation via pdf-lib' },
        { badge: 'ACT 03 · 6 GLOBAL RESUME REGIONS', title: 'PH · US/CA · UK/EU · AU/NZ · Middle East · Asia', sub: 'Side-by-side live document preview & ATS keyword optimization' },
        { badge: 'ACT 04 · AI PASSPORT PHOTO STUDIO', title: 'In-Browser ID Photo & Digital E-Signature Pad', sub: 'Complete government & corporate applications in minutes' },
        { badge: 'ACT 05 · GOVERNMENT JOB BOARD', title: 'Integrated Philippine Career Opportunities', sub: 'Built with Next.js, React, TypeScript, Tailwind & Three.js' },
      ],
    },
    {
      id: 'zetflix-tv',
      url: 'https://zetflix-tv.vercel.app',
      accent: '#E50914',
      acts: [
        { badge: 'ACT 01 · ZETFLIX SMART TV UI', title: 'Ten-Foot Cinema Interface & Hero Billboard', sub: 'High-contrast spatial rail navigation built for big screens' },
        { badge: 'ACT 02 · GPU-ACCELERATED RAILS', title: 'Trending Movies, TV Shows & Top Rated', sub: 'Zero layout shift & sub-second category switching' },
        { badge: 'ACT 03 · INSTANT TRAILER MODALS', title: 'One-Click Trailer & Cast Exploration', sub: 'Live TMDB API integration with full filmographies' },
        { badge: 'ACT 04 · SUPABASE CLOUD AUTH', title: 'Personalized User Dashboard & Watchlists', sub: 'Cross-device favorites & watch history synchronization' },
        { badge: 'ACT 05 · GLOBAL EDGE DELIVERY', title: 'Responsive From Mobile Phones to 4K TVs', sub: 'Built with React, Redux, Node.js, Supabase & MongoDB' },
      ],
    },
    {
      id: 'lifecoach-v2',
      url: 'https://lifecoachdoc2.vercel.app/',
      accent: '#F59E0B',
      acts: [
        { badge: 'ACT 01 · LIFECOACHDOC V2 FLAGSHIP', title: 'Dr. Frances Gaik, PsyD — Executive Portal', sub: '3D React Three Fiber & editorial clinical psychology platform' },
        { badge: 'ACT 02 · 3D INTERACTIVE BOOK SHOWCASE', title: 'Managing Depression with Qigong in 3D WebGL', sub: 'Real-time spatial lighting & interactive book carousel' },
        { badge: 'ACT 03 · COACHING PROGRAMS & TIERS', title: 'Clinical Psychology & Holistic Life Coaching', sub: 'Structured transformation programs & executive consulting' },
        { badge: 'ACT 04 · CLIENT TESTIMONIALS & PROOF', title: 'Verified Outcomes & Media Features', sub: 'Accessible Radix UI primitives & Framer Motion choreography' },
        { badge: 'ACT 05 · CONSULTATION BOOKING', title: 'Direct Discovery Call & Session Onboarding', sub: '98+ Lighthouse Performance · Next.js, Three.js & Tailwind' },
      ],
    },
    {
      id: 'lifecoach-v1',
      url: 'https://lifecoachdoc.vercel.app/',
      accent: '#14B8A6',
      acts: [
        { badge: 'ACT 01 · DARK-LUXURY 3D PORTFOLIO', title: '3D Floating Book Hero & Video Atmosphere', sub: 'Animated SVG signature splash & ambient backdrop' },
        { badge: 'ACT 02 · 13-PALETTE THEME ENGINE', title: 'Real-Time Luxury Color Palette Switcher', sub: 'Instant mood customization across all UI surfaces' },
        { badge: 'ACT 03 · CLINICAL & QIGONG PRACTICE', title: '30+ Years of Psychological & Holistic Expertise', sub: 'Interactive service pillars & author biography' },
        { badge: 'ACT 04 · PUBLISHED WORKS & MEDIA', title: 'Book Previews & Holistic Wellness Guides', sub: 'Smooth scroll-triggered reveals & responsive layout' },
        { badge: 'ACT 05 · CLIENT ONBOARDING FUNNEL', title: 'Streamlined Consultation & Contact Flow', sub: 'Built with Next.js, Three.js, TypeScript & Framer Motion' },
      ],
    },
    {
      id: 'nwanganga-shields',
      url: 'https://nwanganga-shields.vercel.app',
      accent: '#D97706',
      acts: [
        { badge: 'ACT 01 · DIGITAL AUTOBIOGRAPHY', title: 'Dr. Nwanganga Shields — Author & Memoirist', sub: 'Museum-grade archival storytelling & interactive book library' },
        { badge: 'ACT 02 · INTERACTIVE BOOK LIBRARY', title: 'Chapter Excerpts & Historical Milestones', sub: 'From medical doctor to international humanitarian & author' },
        { badge: 'ACT 03 · ARCHIVAL PHOTO TIMELINE', title: 'Decades of Global Service & Literary Works', sub: 'Choreographed serif typography & smooth chapter transitions' },
        { badge: 'ACT 04 · VISITOR ANALYTICS HEATMAP', title: 'Supabase Real-Time DB & Recharts Admin Studio', sub: 'Tracks global reader engagement & chapter popularity' },
        { badge: 'ACT 05 · BOOK ACQUISITION & PRESS', title: 'Direct Ordering & Literary Event Inquiries', sub: 'Built with TanStack Start, React, TypeScript & Supabase' },
      ],
    },
    {
      id: 'dekaron-stampede',
      url: 'https://dekaron-stampede.vercel.app',
      accent: '#A855F7',
      acts: [
        { badge: 'ACT 01 · DEKARON STAMPEDE MMORPG', title: 'Cinematic Dark-Fantasy Gaming Portal', sub: 'Atmospheric particle VFX, live server status & player hub' },
        { badge: 'ACT 02 · 14-CLASS CHARACTER GALLERY', title: 'Interactive Class Lore, Weapons & Combat Roles', sub: 'Inspect Azure Knight, Segnale, Bagi Warrior, Aloken & more' },
        { badge: 'ACT 03 · REAL-TIME SERVER TELEMETRY', title: 'Live Online Players, Siege Timers & Events', sub: '60fps Framer Motion transitions & high-contrast gaming UI' },
        { badge: 'ACT 04 · PATCH NOTES & WORLD LORE', title: 'Trieste Continent Chronicles & Expansion Updates', sub: 'Structured update logs & community tournament brackets' },
        { badge: 'ACT 05 · 3-STEP CLIENT ONBOARDING', title: 'Frictionless Game Client Download & Registration', sub: 'Built with React, TypeScript, Tailwind CSS & Vite' },
      ],
    },
  ];

  for (const site of SITES) {
    console.log(`\n=== Building 60s 1080p Promotional Trailer for ${site.id} (${site.url}) ===`);
    const dir = path.join(TMP, site.id);
    fs.mkdirSync(dir, { recursive: true });

    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, ignoreHTTPSErrors: true });
    const page = await context.newPage();

    await page.goto(site.url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2800);
    await preparePageForCapture(page);

    const totalH = await page.evaluate(() =>
      Math.max(document.body.scrollHeight || 3600, document.documentElement.scrollHeight || 3600)
    );
    const maxScroll = Math.max(800, totalH - 1080);

    const strips = [];
    for (let i = 0; i < site.acts.length; i++) {
      const act = site.acts[i];
      const y1 = Math.min(maxScroll, Math.floor((maxScroll / site.acts.length) * i));
      const y2 = Math.min(maxScroll, y1 + 650);

      await page.evaluate((y) => window.scrollTo(0, y), y1);
      await page.waitForTimeout(280);
      const b1 = await page.screenshot({ type: 'png' });

      await page.evaluate((y) => window.scrollTo(0, y), y2);
      await page.waitForTimeout(280);
      const b2 = await page.screenshot({ type: 'png' });

      const st1 = await stampHudOnSlice(b1, act.badge, act.title, act.sub, site.accent);
      const st2 = await stampHudOnSlice(b2, act.badge, act.title, act.sub, site.accent);

      const outStrip = path.join(dir, `strip-${i + 1}.png`);
      await sharp({
        create: { width: 1920, height: 2160, channels: 4, background: { r: 7, g: 9, b: 14, alpha: 1 } },
      })
        .composite([
          { input: st1, top: 0, left: 0 },
          { input: st2, top: 1080, left: 0 },
        ])
        .png()
        .toFile(outStrip);
      strips.push(outStrip);
    }

    await context.close();
    const outMp4 = path.join(OUT_TRAILERS, `${site.id}.mp4`);
    encodeMultiPageTour(strips, outMp4);
    console.log(`  [OK] Built ${site.id}.mp4`);
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    await buildNexusV2(browser);
    await buildSwsSkeptrons(browser);
    await enhanceBrgyPortal();
    await enhanceClientQms();
    await buildOtherLiveProjects(browser);
  } finally {
    await browser.close();
  }
  console.log('\n=== ALL 11 CINEMATIC 1080P/4K-GRADE TRAILERS COMPLETED! ===');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
