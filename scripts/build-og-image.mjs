import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs/promises';

const ROOT = process.cwd();

async function main() {
  const portraitBuffer = await sharp(path.join(ROOT, 'pic.png'))
    .resize(620, 630, { fit: 'cover', position: 'top' })
    .toBuffer();

  // Create left-edge alpha fade mask for the portrait so it blends seamlessly into the dark obsidian stage
  const maskSvg = Buffer.from(`
    <svg width="620" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="black" stop-opacity="0" />
          <stop offset="32%" stop-color="white" stop-opacity="0.88" />
          <stop offset="100%" stop-color="white" stop-opacity="1" />
        </linearGradient>
      </defs>
      <rect width="620" height="630" fill="url(#fade)" />
    </svg>
  `);

  const maskedPortrait = await sharp(portraitBuffer)
    .ensureAlpha()
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const overlaySvg = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="crimsonGlow" cx="72%" cy="46%" r="54%">
          <stop offset="0%" stop-color="#e5132b" stop-opacity="0.45"/>
          <stop offset="55%" stop-color="#7c0a18" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#07070a" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="crimsonPill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#e5132b"/>
          <stop offset="100%" stop-color="#ff3d5a"/>
        </linearGradient>
        <linearGradient id="bottomVignette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#07070a" stop-opacity="0"/>
          <stop offset="75%" stop-color="#07070a" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#07070a" stop-opacity="0.95"/>
        </linearGradient>
      </defs>

      <!-- Subtle grid lines -->
      <g stroke="rgba(255,255,255,0.035)" stroke-width="1">
        <line x1="0" y1="120" x2="1200" y2="120"/>
        <line x1="0" y1="530" x2="1200" y2="530"/>
        <line x1="68" y1="0" x2="68" y2="630"/>
      </g>

      <!-- Top ZETICUZ SERIES badge -->
      <rect x="68" y="54" width="114" height="32" rx="6" fill="url(#crimsonPill)" />
      <text x="125" y="75" text-anchor="middle" fill="#ffffff" font-family="Arial Black, Impact, sans-serif" font-size="15" font-weight="900" letter-spacing="3">ZETICUZ</text>
      <text x="198" y="75" fill="#d8d6cf" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="6">ORIGINAL SERIES · 2026</text>

      <!-- Main Headline -->
      <text x="68" y="218" fill="#f5f3ee" font-family="Impact, Arial Black, sans-serif" font-size="92" font-weight="900" letter-spacing="3">SAM PANGILINAN</text>
      <text x="70" y="264" fill="#ff3d5a" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" letter-spacing="11">T H E   S E R I E S</text>

      <!-- Metadata stats row -->
      <rect x="68" y="292" width="84" height="26" rx="5" fill="rgba(229,19,43,0.2)" stroke="#ff3d5a" stroke-width="1.2"/>
      <text x="110" y="309" text-anchor="middle" fill="#ff6b81" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="800" letter-spacing="1.5">99% MATCH</text>
      <text x="168" y="310" fill="#e5e3dc" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700">7+ Years Exp  •  5 Seasons  •  12 Originals  •  4K HDR  •  SWS Audio</text>

      <!-- Role subtitle -->
      <text x="68" y="356" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" letter-spacing="2.2">FULL-STACK &amp; RUST ENGINEER • GOVTECH &amp; 3D WEB ARCHITECT</text>
      <text x="68" y="388" fill="#b7b4ac" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="500">Creator of Zetica Creative Suite (14 Pure Rust Apps), Barangay Matatag 3D Portal,</text>
      <text x="68" y="412" fill="#b7b4ac" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="500">DSWD AICS CLIENT QMS, CareerForm PH (CSC Form 212), and NEXUS v2 Streaming.</text>

      <!-- Project highlight pills -->
      <g transform="translate(68, 442)">
        <rect x="0" y="0" width="168" height="32" rx="16" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)"/>
        <text x="84" y="20" text-anchor="middle" fill="#f5f3ee" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700">Zetica Suite (Rust)</text>

        <rect x="180" y="0" width="164" height="32" rx="16" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)"/>
        <text x="262" y="20" text-anchor="middle" fill="#f5f3ee" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700">Barangay 3D Portal</text>

        <rect x="356" y="0" width="154" height="32" rx="16" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)"/>
        <text x="433" y="20" text-anchor="middle" fill="#f5f3ee" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700">DSWD CLIENT QMS</text>

        <rect x="522" y="0" width="136" height="32" rx="16" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)"/>
        <text x="590" y="20" text-anchor="middle" fill="#f5f3ee" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700">CareerForm PH</text>
      </g>

      <!-- Bottom bar -->
      <rect x="0" y="530" width="1200" height="100" fill="url(#bottomVignette)"/>
      <line x1="68" y1="542" x2="1132" y2="542" stroke="rgba(229,19,43,0.45)" stroke-width="1.5"/>
      <circle cx="80" cy="578" r="5" fill="#e5132b"/>
      <text x="96" y="583" fill="#f5f3ee" font-family="Courier New, monospace" font-size="15" font-weight="700" letter-spacing="1.5">zetiuz-generative.vercel.app  •  zeticuz.xyz  •  github.com/ZETIC7Z</text>
      <text x="1132" y="583" text-anchor="end" fill="#ff3d5a" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="800" letter-spacing="2.5">STREAM THE PORTFOLIO ↗</text>
    </svg>
  `);

  const baseBgSvg = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGlow" cx="76%" cy="44%" r="56%">
          <stop offset="0%" stop-color="#9e0e20" stop-opacity="0.55"/>
          <stop offset="55%" stop-color="#3c070e" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#07070a" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="#07070a"/>
      <rect width="1200" height="630" fill="url(#bgGlow)"/>
    </svg>
  `);

  const compositeLayers = [
    { input: maskedPortrait, left: 580, top: 0 },
    { input: overlaySvg, left: 0, top: 0 },
  ];

  await fs.mkdir(path.join(ROOT, 'public/assets'), { recursive: true });

  await sharp(baseBgSvg)
    .composite(compositeLayers)
    .png({ quality: 92, compressionLevel: 9 })
    .toFile(path.join(ROOT, 'public/og-image.png'));

  await sharp(baseBgSvg)
    .composite(compositeLayers)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(ROOT, 'public/og-image.jpg'));

  await sharp(baseBgSvg)
    .composite(compositeLayers)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(ROOT, 'public/assets/og-image.jpg'));

  console.log('Generated 1200x630 social preview images: public/og-image.png, public/og-image.jpg, public/assets/og-image.jpg');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
