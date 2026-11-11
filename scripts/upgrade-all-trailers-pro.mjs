import ffmpegPath from 'ffmpeg-static';
import { execFileSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const WORK_DIR = 'C:/Users/ZETICUZ/.gemini/antigravity/brain/2ebe0471-be86-443a-b270-3c7e9dc14d84/scratch/upgrade-trailers-pro';
const SNAPSAVE_VIDEO = 'C:/Users/ZETICUZ/Downloads/Video/SnapSave_App_1843678583716176_1080p.mp4';
const PORTFOLIO_MUSIC = 'C:/Users/ZETICUZ/Music/portfolio/zeticuz-portfolio/client/public/music.mp3';

fs.mkdirSync(WORK_DIR, { recursive: true });

function getVideoDuration(filePath) {
  const res = spawnSync(ffmpegPath, ['-i', filePath], { encoding: 'utf8' });
  const out = (res.stderr || '') + (res.stdout || '');
  const m = out.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!m) return 60;
  return parseInt(m[1], 10) * 3600 + parseInt(m[2], 10) * 60 + parseFloat(m[3]);
}

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
    <g transform="translate(56, 916)">
      <rect x="0" y="0" width="1020" height="112" rx="16" fill="url(#bg)" stroke="${accent}" stroke-opacity="0.48" stroke-width="1.5"/>
      <rect x="0" y="0" width="8" height="112" rx="4" fill="url(#bar)"/>
      <rect x="28" y="18" width="360" height="24" rx="12" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-opacity="0.6" stroke-width="1"/>
      <text x="42" y="34" fill="${accent}" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="12" font-weight="800" letter-spacing="2.2">${esc(stepNum)} // ${esc(badge)}</text>
      <text x="28" y="68" fill="#f8fafc" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="25" font-weight="800" letter-spacing="0.4">${esc(title)}</text>
      <text x="28" y="94" fill="#cbd5e1" font-family="Segoe UI, Inter, Arial, sans-serif" font-size="14.5" font-weight="600" letter-spacing="0.3">${esc(subtitle)}</text>
    </g>
  </svg>`;
  const outPath = path.join(WORK_DIR, filename);
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  return outPath;
}

function buildTransitionSfxWav(outWav, durationSec, transitionTimesSec = []) {
  const sampleRate = 44100;
  const totalSamples = Math.floor(sampleRate * durationSec);
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  let seed = 4242;
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
      const t = i / sampleRate - tHit;
      let whoosh = 0;
      if (t >= -0.35 && t <= 0.22) {
        const env = Math.sin(((t + 0.35) / 0.57) * Math.PI);
        const cutoff = 0.08 + 0.38 * env;
        lpL += cutoff * (rand() - lpL);
        lpR += cutoff * (rand() - lpR);
        whoosh = env * 0.42;
      }
      let impact = 0;
      if (t >= 0 && t <= 0.80) {
        const env = Math.exp(-t * 5.2);
        const freq = 95 * Math.exp(-t * 3.2) + 36;
        impact = Math.sin(2 * Math.PI * freq * t) * env * 0.58;
        const chime = Math.sin(2 * Math.PI * 880 * t) * Math.exp(-t * 14) * 0.14;
        impact += chime;
      }
      const pan = Math.sin(((t + 0.35) / 1.2) * Math.PI);
      left[i] = Math.max(-0.98, Math.min(0.98, left[i] + lpL * whoosh * (1 - 0.3 * pan) + impact));
      right[i] = Math.max(-0.98, Math.min(0.98, right[i] + lpR * whoosh * (1 + 0.3 * pan) + impact));
    }
  }

  const numChannels = 2;
  const bytesPerSample = 2;
  const dataSize = totalSamples * numChannels * bytesPerSample;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
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

// Extract shared 4.2s 3D ZE ZETICUZ metallic studio bumper once
const s0Bumper = path.join(WORK_DIR, 's0_bumper.mp4');
execFileSync(ffmpegPath, [
  '-y',
  '-ss', '0.3',
  '-t', '4.2',
  '-i', SNAPSAVE_VIDEO,
  '-vf', 'crop=1076:606:0:654,scale=1920:1080:flags=lanczos,setsar=1,fps=30',
  '-c:v', 'libx264',
  '-preset', 'fast',
  '-crf', '18',
  '-pix_fmt', 'yuv420p',
  '-an',
  s0Bumper,
]);

const PROJECTS = [
  {
    id: 'zetica-suite',
    accent: '#a3e635',
    musicSource: SNAPSAVE_VIDEO,
    musicStart: 12,
    scenes: [
      ['SCENE 01', '3D WEBGL GALAXY & SCROLL RULER', 'Zetica Creative Suite — 14 Pure Rust Apps', '100% Free Forever • Zero Subscriptions for Students & Editors'],
      ['SCENE 02', '14 NATIVE RUST DESKTOP APPS', 'Design, Photo, Vector, Film, Motion & PDF', 'WGPU + DirectX 12 Hardware Acceleration • Sub-Second Startup'],
      ['SCENE 03', 'LIGHT & DARK THEME INVERSION', 'Interactive 32-Card Shader Showcase & Catalog', 'zetica.vercel.app & apps.html • One-Click Windows MSI Installer'],
      ['SCENE 04', 'ZETICA HUB DESKTOP LAUNCHER', 'Installed Native Windows Desktop App Suite', 'Automatic Suite Updates • Open-Source Creative Freedom'],
    ],
  },
  {
    id: 'client-qms',
    accent: '#34d399',
    musicSource: SNAPSAVE_VIDEO,
    musicStart: 92,
    scenes: [
      ['SCENE 01', 'DSWD AICS COMMAND DASHBOARD', 'CLIENT QMS — 4-Step Crisis Queue System', 'Confident AI / DeepEval Analytics • Live KPI Telemetry'],
      ['SCENE 02', '4-STEP OPERATOR TERMINALS', 'PACD Intake • Validator • SWO • Cashier', 'Call Next, Recall, Compliance Hold & Brownout-Proof Sync'],
      ['SCENE 03', 'MONTHLY SERVICE CALENDAR', 'Daily Served vs. Compliance-Held Telemetry', 'Sub-Second 800ms BroadcastChannel + Atomic Disk Persistence'],
      ['SCENE 04', 'ZERO-SCROLL PUBLIC TV MONITORS', '1080p/4K Broadcast Displays & Voice Announcer', '3D Ticket Flip • Web Audio 3-Tone Chime • Web Speech TTS'],
    ],
  },
  {
    id: 'nexus-v2',
    accent: '#38bdf8',
    musicSource: SNAPSAVE_VIDEO,
    musicStart: 140,
    scenes: [
      ['SCENE 01', 'TMDB-EMBED-API v6.4 CORE', 'NEXUS v2 — Next-Gen Streaming & Cuts Hub', 'FebBox 4K • VidLink • LookMovies • AniKai Direct Playback'],
      ['SCENE 02', 'SPECTRUM + REAPER FAILOVER', 'Dual-Backend Architecture & Trust Pyramid', 'Real-Time Node Latency • Zero-Popup HLS/MP4 Stream Probing'],
      ['SCENE 03', 'VERTICAL CUTS TRAILER FEED', 'Swipeable Short-Form Cinema Discovery', 'One-Tap Watch Full Movie • Adaptive Glassmorphic Theater'],
      ['SCENE 04', 'QR PASSWORDLESS TV LOGIN', 'Cross-Device Session Claiming & Settings', 'Instant Mobile-to-TV Sign-In • Cloud Watchlist Sync'],
    ],
  },
  {
    id: 'lifecoach-v2',
    accent: '#ffb547',
    musicSource: PORTFOLIO_MUSIC,
    musicStart: 0,
    scenes: [
      ['SCENE 01', 'REACT THREE FIBER 3D HERO', 'LifeCoachDoc v2 — Dr. Frances Gaik, PsyD', 'Interactive 3D Book Showcase & Spatial Lighting'],
      ['SCENE 02', 'CLINICAL & EXECUTIVE COACHING', 'Published Works & Interactive Book Carousel', '98 Lighthouse Score • Production US Client Deployment'],
      ['SCENE 03', 'RADIX UI ACCESSIBLE PRIMITIVES', 'Editorial Luxury Interface & Choreography', 'Framer Motion Scroll Reveals • Tier Comparison'],
      ['SCENE 04', 'CONSULTATION BOOKING FUNNEL', 'Direct Scheduling & Clinical Resource Library', 'Responsive Desktop & Mobile Experience'],
    ],
  },
  {
    id: 'lifecoach-v1',
    accent: '#46e3a8',
    musicSource: PORTFOLIO_MUSIC,
    musicStart: 18,
    scenes: [
      ['SCENE 01', 'ANIMATED SIGNATURE SPLASH', 'LifeCoachDoc v1 — Dark-Luxury 3D Portfolio', '3D Floating Book Hero & Ambient Video Backdrop'],
      ['SCENE 02', '13-PALETTE THEME ENGINE', 'Real-Time Dark-Luxury Mood Customization', 'Instant Color & Atmosphere Switching Across Sections'],
      ['SCENE 03', 'MANAGING DEPRESSION WITH QIGONG', 'Interactive 3D Book & Holistic Practice', 'Three.js + Framer Motion + Next.js Architecture'],
      ['SCENE 04', 'PLAYWRIGHT VERIFIED FLOWS', 'End-to-End Tested Client Production Build', 'High-Contrast Typography & Smooth Scroll Transitions'],
    ],
  },
  {
    id: 'nwanganga-shields',
    accent: '#ffb547',
    musicSource: PORTFOLIO_MUSIC,
    musicStart: 10,
    scenes: [
      ['SCENE 01', 'ARCHIVAL LITERARY PORTFOLIO', 'Dr. Nwanganga Shields — Digital Memoir', 'Museum-Grade Chapter Timeline & Interactive Book Previews'],
      ['SCENE 02', 'CHAPTER-BY-CHAPTER EXCERPTS', 'Medical & Humanitarian Milestone Archive', 'TanStack Start + React + TypeScript Full-Stack Build'],
      ['SCENE 03', 'VISITOR GEOLOCATION HEATMAP', 'Real-Time Reader Engagement & Recharts Studio', 'Supabase Live Database & Admin Analytics Dashboard'],
      ['SCENE 04', 'BOOK ACQUISITION & PRESS HUB', 'Editorial Scroll Choreography & Modals', 'Responsive Literary Showcase'],
    ],
  },
  {
    id: 'sws-skeptrons',
    accent: '#ff3d5a',
    musicSource: SNAPSAVE_VIDEO,
    musicStart: 35,
    scenes: [
      ['SCENE 01', 'OFFICIAL CHAPTER PORTAL', 'SWS Skeptrons Hub — Alpha Kappa Rho Region VII', 'Interactive Splash Gate • Live Anniversary Countdown Engine'],
      ['SCENE 02', 'DIGITAL MEMBER VERIFICATION', 'Instant Roster Lookup & Leadership Directory', 'Full-Stack React + Express.js + MongoDB Verification'],
      ['SCENE 03', 'HUMANITARIAN OUTREACH GALLERY', 'Community Service & Chapter Milestone Archive', 'Framer Motion Galleries • Responsive Mobile Directory'],
      ['SCENE 04', 'BUILT-IN CHAPTER AUDIO PLAYER', 'SWS Music Playlist & Event Announcements', 'Verified Community Platform'],
    ],
  },
  {
    id: 'dekaron-stampede',
    accent: '#b98bff',
    musicSource: SNAPSAVE_VIDEO,
    musicStart: 165,
    scenes: [
      ['SCENE 01', 'DARK-FANTASY MMORPG PORTAL', 'Dekaron Stampede — Interactive Gaming Hub', '60fps Atmospheric Particle VFX & Server Status Telemetry'],
      ['SCENE 02', '14-CLASS CHARACTER GALLERY', 'Interactive Weapon Lore, Combat Roles & Stats', 'Zero-Lag Class Switching & Animated Breakdowns'],
      ['SCENE 03', 'LIVE SERVER & PATCH NOTES', 'Real-Time Community Events & Raid Schedule', 'React + TypeScript + Tailwind CSS + Framer Motion'],
      ['SCENE 04', '3-STEP CLIENT ONBOARDING', 'Frictionless Game Installer & Registration Funnel', 'High-Energy Gaming UI Polish'],
    ],
  },
  {
    id: 'zetflix-tv',
    accent: '#ff3d5a',
    musicSource: SNAPSAVE_VIDEO,
    musicStart: 75,
    scenes: [
      ['SCENE 01', 'TEN-FOOT SMART TV CINEMA UI', 'ZETFLIX TV — Spatial Rail Entertainment Hub', 'GPU-Accelerated Horizontal Rails • <100ms Category Switching'],
      ['SCENE 02', 'LIVE TMDB API INTEGRATION', 'Trending Movies, TV Series & Cast Profiles', 'Instant Trailer Modal Playback & Deep Filmographies'],
      ['SCENE 03', 'SUPABASE CLOUD WATCHLISTS', 'Personalized User Dashboard & Favorites Sync', 'React + Redux + Supabase Auth + Cloud Database'],
      ['SCENE 04', 'ADAPTIVE 4K TV & MOBILE LAYOUT', 'High-Contrast Cinema Experience', 'Built by Sam Pangilinan (ZETICUZ)'],
    ],
  },
  {
    id: 'nexus-streaming',
    accent: '#ff3d5a',
    musicSource: PORTFOLIO_MUSIC,
    musicStart: 5,
    scenes: [
      ['SCENE 01', '4-IN-1 ENTERTAINMENT PWA', 'NEXUS Streaming (v1) — Movies, Anime & Manga', 'Unified Glassmorphic Theater (zeticuz.online)'],
      ['SCENE 02', 'ADAPTIVE HLS.JS VIDEO PLAYER', 'HD Movies, TV Series & Live TV Channels', 'Multi-Server Stream Selection & Episode Tracking'],
      ['SCENE 03', 'ANIME & MANGA CHAPTER READER', 'Integrated Otaku Hub & Chapter Navigation', 'Installable Progressive Web App with Offline Shell'],
      ['SCENE 04', 'CROSS-DEVICE CINEMA EXPERIENCE', 'Fast Search, Genre Filters & Watch History', 'A ZETICUZ Original Streaming Build'],
    ],
  },
];

for (const proj of PROJECTS) {
  const trailerPath = path.resolve(`public/trailers/${proj.id}.mp4`);
  const backupPath = path.join(WORK_DIR, `${proj.id}_orig.mp4`);
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(trailerPath, backupPath);
  }

  const origDur = getVideoDuration(backupPath);
  console.log(`\n=== Upgrading ${proj.id}.mp4 (orig duration: ${origDur.toFixed(1)}s) ===`);

  // Build 4 lower-third PNGs for this project
  const ovPaths = [];
  for (let i = 0; i < 4; i++) {
    const [stepNum, badge, title, subtitle] = proj.scenes[i];
    const p = await buildOverlayPng(`${proj.id}_ov${i + 1}.png`, stepNum, badge, title, subtitle, proj.accent);
    ovPaths.push(p);
  }

  // Extract 4 energetic 12.8s scenes across the original video at 1.18x speed with alternating zoom-in punches
  const sceneDur = 12.8;
  const speed = 1.18;
  const rawSpanNeeded = sceneDur * speed;
  const maxStart = Math.max(2, origDur - rawSpanNeeded - 0.5);
  const starts = [
    0.2,
    Math.min(maxStart, origDur * 0.25),
    Math.min(maxStart, origDur * 0.50),
    Math.min(maxStart, origDur * 0.72),
  ];

  const sceneMp4s = [];
  for (let i = 0; i < 4; i++) {
    const outScene = path.join(WORK_DIR, `${proj.id}_s${i + 1}.mp4`);
    const zoomPunch = i % 2 === 1;
    const ptsExpr = `${(1 / speed).toFixed(4)}*PTS`;
    const zoomFilter = zoomPunch
      ? `,crop=1840:1035:40:22,scale=1920:1080:flags=lanczos`
      : '';
    const filterComplex = `[0:v]trim=start=${starts[i].toFixed(2)},setpts=PTS-STARTPTS,setpts=${ptsExpr},fps=30,scale=1920:1080:flags=lanczos,setsar=1,eq=contrast=1.05:saturation=1.10${zoomFilter}[base];[base][1:v]overlay=0:0:enable='between(t,0.35,${(sceneDur - 0.3).toFixed(2)})'[outv]`;

    execFileSync(ffmpegPath, [
      '-y',
      '-i', backupPath,
      '-i', ovPaths[i],
      '-filter_complex', filterComplex,
      '-map', '[outv]',
      '-t', String(sceneDur),
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '19',
      '-pix_fmt', 'yuv420p',
      '-an',
      outScene,
    ]);
    sceneMp4s.push(outScene);
  }

  // Durations: s0=4.2, s1=12.8, s2=12.8, s3=12.8, s4=12.8, xfade=0.6s
  // Offsets:
  // o1 = 4.2 - 0.6 = 3.6
  // o2 = 3.6 + 12.8 - 0.6 = 15.8
  // o3 = 15.8 + 12.8 - 0.6 = 28.0
  // o4 = 28.0 + 12.8 - 0.6 = 40.2
  // Total = 40.2 + 12.8 = 53.0s
  const totalDur = 53.0;
  const sfxWav = path.join(WORK_DIR, `${proj.id}_sfx.wav`);
  buildTransitionSfxWav(sfxWav, totalDur + 0.5, [0.2, 3.6, 15.8, 28.0, 40.2]);

  const xfadeComplex = [
    '[0:v][1:v]xfade=transition=zoomin:duration=0.6:offset=3.6[v01]',
    '[v01][2:v]xfade=transition=slideleft:duration=0.6:offset=15.8[v02]',
    '[v02][3:v]xfade=transition=smoothleft:duration=0.6:offset=28.0[v03]',
    '[v03][4:v]xfade=transition=wiperight:duration=0.6:offset=40.2,format=yuv420p[outv]',
    `[5:a]atrim=start=${proj.musicStart}:duration=${totalDur},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1.2,afade=t=out:st=${(totalDur - 2.0).toFixed(1)}:d=2.0,volume=0.85[bgm]`,
    `[6:a]atrim=start=0:duration=${totalDur},asetpts=PTS-STARTPTS,volume=1.15[sfx]`,
    '[bgm][sfx]amix=inputs=2:duration=first:dropout_transition=0[outa]',
  ].join(';');

  execFileSync(ffmpegPath, [
    '-y',
    '-i', s0Bumper,
    '-i', sceneMp4s[0],
    '-i', sceneMp4s[1],
    '-i', sceneMp4s[2],
    '-i', sceneMp4s[3],
    '-i', proj.musicSource,
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
    trailerPath,
  ]);

  console.log(`SUCCESS: Upgraded ${proj.id}.mp4 (${totalDur}s with 3D bumper, xfade transitions & stereo soundtrack)`);
}

console.log('\nALL 10 REMAINING TRAILERS UPGRADED WITH AFTER-EFFECTS / CAPCUT TRANSITIONS & AUDIO!');
