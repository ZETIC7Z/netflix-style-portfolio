import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const scratchDir = 'C:/Users/ZETICUZ/.gemini/antigravity/brain/2ebe0471-be86-443a-b270-3c7e9dc14d84/scratch';
const uploadedDir = 'C:/Users/ZETICUZ/.gemini/antigravity/brain/2ebe0471-be86-443a-b270-3c7e9dc14d84/.user_uploaded';
const projDir = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/projects';
const cardsOutDir = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/cards';
const assetsOutDir = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/assets';
const logosDir = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/assets/logos';

fs.mkdirSync(cardsOutDir, { recursive: true });
fs.mkdirSync(projDir, { recursive: true });
fs.mkdirSync(assetsOutDir, { recursive: true });

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Builds an official institutional/agency card (960x540) with a circular or rounded-square official logo on the right
 * and clean institutional header typography on the left with guaranteed margin separation.
 */
async function buildInstitutionCard({
  outName,
  logoPath,
  circular = true,
  logoBgWhite = false,
  eyebrow,
  line1,
  line2,
  subline,
  bgStart = '#061024',
  bgMid = '#0d2247',
  bgEnd = '#050b18',
  accent = '#d9b46a',
  backdropPath = null,
}) {
  const width = 960;
  const height = 540;

  let baseLayer;
  if (backdropPath && fs.existsSync(backdropPath)) {
    baseLayer = await sharp(backdropPath)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .modulate({ brightness: 0.32, saturation: 0.85 })
      .blur(2)
      .toBuffer();
  } else {
    baseLayer = await sharp({
      create: { width, height, channels: 4, background: { r: 6, g: 12, b: 24, alpha: 1 } },
    })
      .png()
      .toBuffer();
  }

  const svgBg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgStart}" stop-opacity="${backdropPath ? '0.88' : '1'}"/>
          <stop offset="55%" stop-color="${bgMid}" stop-opacity="${backdropPath ? '0.82' : '1'}"/>
          <stop offset="100%" stop-color="${bgEnd}" stop-opacity="${backdropPath ? '0.94' : '1'}"/>
        </linearGradient>
        <radialGradient id="sealGlow" cx="77%" cy="50%" r="34%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
          <stop offset="65%" stop-color="${accent}" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="${bgEnd}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="accentLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <rect width="${width}" height="${height}" fill="url(#sealGlow)"/>
      <rect x="0" y="0" width="8" height="${height}" fill="${accent}"/>

      <text x="44" y="198" fill="${accent}" font-family="Arial, sans-serif" font-size="13" font-weight="bold" letter-spacing="2.4">${esc(eyebrow)}</text>
      <text x="44" y="246" fill="#ffffff" font-family="Arial, sans-serif" font-size="32" font-weight="bold">${esc(line1)}</text>
      <text x="44" y="286" fill="#ffffff" font-family="Arial, sans-serif" font-size="32" font-weight="bold">${esc(line2)}</text>
      <rect x="44" y="312" width="420" height="3" fill="url(#accentLine)"/>
      <text x="44" y="348" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="14" font-weight="bold" letter-spacing="1.2">${esc(subline)}</text>
    </svg>
  `);

  const composites = [{ input: svgBg, top: 0, left: 0 }];

  if (logoPath && fs.existsSync(logoPath)) {
    const size = 296;
    const rawLogo = await sharp(logoPath)
      .resize(size - (logoBgWhite ? 32 : 0), size - (logoBgWhite ? 32 : 0), {
        fit: 'contain',
        background: logoBgWhite ? { r: 255, g: 255, b: 255, alpha: 1 } : { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toBuffer();

    let finalLogo = rawLogo;
    if (logoBgWhite) {
      finalLogo = await sharp({
        create: { width: size, height: size, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
      })
        .composite([{ input: rawLogo, top: 16, left: 16 }])
        .png()
        .toBuffer();
    }

    if (circular) {
      const mask = Buffer.from(
        `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 4}" fill="#fff"/></svg>`,
      );
      finalLogo = await sharp(finalLogo)
        .composite([{ input: mask, blend: 'dest-in' }])
        .png()
        .toBuffer();
    } else if (logoBgWhite) {
      const rounded = Buffer.from(
        `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${size}" height="${size}" rx="28" ry="28" fill="#fff"/></svg>`,
      );
      finalLogo = await sharp(finalLogo)
        .composite([{ input: rounded, blend: 'dest-in' }])
        .png()
        .toBuffer();
    }

    composites.push({ input: finalLogo, top: Math.round((height - size) / 2), left: 604 });
  }

  await sharp(baseLayer)
    .composite(composites)
    .webp({ quality: 92 })
    .toFile(path.join(cardsOutDir, outName));

  console.log(`Built institution card: ${outName}`);
}

/**
 * Builds a certificate + official agency seal card (960x540) showing the real scanned certificate
 * on the right in a crisp frame and the official agency seal on the left with clean spacing.
 */
async function buildCertificateSealCard({
  outName,
  certPath,
  sealPath,
  eyebrow,
  orgLine1,
  orgLine2,
  subline,
  bgStart = '#071126',
  bgEnd = '#040814',
  accent = '#38bdf8',
}) {
  const width = 960;
  const height = 540;

  const certW = 436;
  const certH = 340;
  const certLeft = 480;
  const certTop = 100;

  const certCard = await sharp(certPath)
    .resize(certW, certH, { fit: 'cover', position: 'north' })
    .png()
    .toBuffer();

  const certMask = Buffer.from(
    `<svg width="${certW}" height="${certH}"><rect x="0" y="0" width="${certW}" height="${certH}" rx="14" ry="14" fill="#fff"/></svg>`,
  );
  const roundedCert = await sharp(certCard)
    .composite([{ input: certMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  let sealBuf = null;
  if (sealPath && fs.existsSync(sealPath)) {
    const inner = await sharp(sealPath)
      .resize(112, 112, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toBuffer();
    const plate = await sharp({
      create: { width: 136, height: 136, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
    })
      .composite([{ input: inner, top: 12, left: 12 }])
      .png()
      .toBuffer();
    const sMask = Buffer.from(`<svg width="136" height="136"><rect x="0" y="0" width="136" height="136" rx="22" ry="22" fill="#fff"/></svg>`);
    sealBuf = await sharp(plate)
      .composite([{ input: sMask, blend: 'dest-in' }])
      .png()
      .toBuffer();
  }

  const svgBg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgStart}"/>
          <stop offset="100%" stop-color="${bgEnd}"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <rect x="0" y="0" width="8" height="${height}" fill="${accent}"/>
      <rect x="${certLeft - 4}" y="${certTop - 4}" width="${certW + 8}" height="${certH + 8}" rx="16" fill="none" stroke="${accent}" stroke-width="2"/>

      <text x="44" y="290" fill="${accent}" font-family="Arial, sans-serif" font-size="12" font-weight="bold" letter-spacing="2.2">${esc(eyebrow)}</text>
      <text x="44" y="328" fill="#ffffff" font-family="Arial, sans-serif" font-size="25" font-weight="bold">${esc(orgLine1)}</text>
      <text x="44" y="360" fill="#ffffff" font-family="Arial, sans-serif" font-size="25" font-weight="bold">${esc(orgLine2)}</text>
      <text x="44" y="394" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${esc(subline)}</text>
    </svg>
  `);

  const composites = [
    { input: svgBg, top: 0, left: 0 },
    { input: roundedCert, top: certTop, left: certLeft },
  ];
  if (sealBuf) {
    composites.push({ input: sealBuf, top: 112, left: 44 });
  }

  await sharp({
    create: { width, height, channels: 4, background: { r: 5, g: 9, b: 20, alpha: 1 } },
  })
    .composite(composites)
    .webp({ quality: 92 })
    .toFile(path.join(cardsOutDir, outName));

  console.log(`Built certificate + seal card: ${outName}`);
}

async function buildBrandVectorCard({ outName, svgContent }) {
  const width = 960;
  const height = 540;
  await sharp(Buffer.from(svgContent(width, height)))
    .webp({ quality: 92 })
    .toFile(path.join(cardsOutDir, outName));
  console.log(`Built brand vector card: ${outName}`);
}

async function buildCleanScreenshotCard(baseImagePath, outName, accentHex = '#E50914') {
  const width = 960;
  const height = 540;
  const overlay = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="6" height="${height}" fill="${accentHex}"/>
    </svg>
  `);
  await sharp(baseImagePath)
    .resize(width, height, { fit: 'cover', position: 'north' })
    .composite([{ input: overlay, top: 0, left: 0 }])
    .webp({ quality: 92 })
    .toFile(path.join(cardsOutDir, outName));
  console.log(`Built clean screenshot card: ${outName}`);
}

async function run() {
  const comtechUpload = path.join(uploadedDir, 'media_1794329806069_903a69a0.jpg');
  const denrLogo = path.join(logosDir, 'denr.jpg');
  const dswdLogo = path.join(logosDir, 'dswd.jpg');
  const dictLogo = path.join(logosDir, 'dict.jpg');
  const uscOfficialLogo = path.join(logosDir, 'usc-official.png');
  const uscCampus = path.join(logosDir, 'usc-campus.jpg');

  const dswdCert = path.join(scratchDir, 'cert0.png');
  const dictPyCert = path.join(scratchDir, 'cert1.png');
  const dictDjCert = path.join(scratchDir, 'cert2.png');
  const lamitanCert = path.join(scratchDir, 'cert3.png');
  const lamitanSealCrop = path.join(logosDir, 'lamitan-city-seal-crop.png');

  // 1. S01 E01: Zinex Cinematic
  await buildBrandVectorCard({
    outName: 'ep-s1e1-zinex.webp',
    svgContent: (w, h) => `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="zbg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#14060d"/>
            <stop offset="55%" stop-color="#2e0b1d"/>
            <stop offset="100%" stop-color="#08050b"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#zbg)"/>
        <rect x="0" y="0" width="8" height="${h}" fill="#f43f5e"/>
        <circle cx="740" cy="270" r="142" fill="rgba(244,63,94,0.12)" stroke="#f43f5e" stroke-width="2.5"/>
        <circle cx="740" cy="270" r="108" fill="#0d0710" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
        <circle cx="710" cy="232" r="24" fill="none" stroke="#f43f5e" stroke-width="5"/>
        <circle cx="763" cy="232" r="24" fill="none" stroke="#fbbf24" stroke-width="5"/>
        <rect x="687" y="260" width="96" height="58" rx="10" fill="#f43f5e"/>
        <polygon points="787,276 819,258 819,320 787,302" fill="#fbbf24"/>
        <text x="44" y="195" fill="#f43f5e" font-family="Arial, sans-serif" font-size="13" font-weight="bold" letter-spacing="2.6">MULTIMEDIA PRODUCTION STUDIO · 2011–2014</text>
        <text x="44" y="250" fill="#ffffff" font-family="Arial, sans-serif" font-size="38" font-weight="bold" letter-spacing="1">ZINEX CINEMATIC</text>
        <text x="44" y="292" fill="#f8fafc" font-family="Arial, sans-serif" font-size="23" font-weight="bold">Video Production &amp; Graphics Design</text>
        <rect x="44" y="316" width="410" height="3" fill="#f43f5e"/>
        <text x="44" y="352" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="14" font-weight="bold" letter-spacing="1.2">CINEMATOGRAPHY · EDITING · VISUAL DESIGN</text>
      </svg>
    `,
  });

  // 2. S01 E02: COMTECH Zamboanga
  await buildInstitutionCard({
    outName: 'ep-s1e2-comtech.webp',
    logoPath: comtechUpload,
    circular: true,
    eyebrow: 'OFFICIAL ACADEMIC INSTITUTION · 2014–2016',
    line1: 'Computer Technologies',
    line2: 'Institute (COMTECH) Inc.',
    subline: 'ZAMBOANGA CITY · COMPUTER ENG. TECHNICIAN',
    bgStart: '#050b18',
    bgMid: '#0c1d3d',
    bgEnd: '#071022',
    accent: '#d9b46a',
  });
  fs.copyFileSync(path.join(cardsOutDir, 'ep-s1e2-comtech.webp'), path.join(cardsOutDir, 'cert-comtech.webp'));

  // 3. S01 E03: DENR
  await buildInstitutionCard({
    outName: 'ep-s1e3-denr.webp',
    logoPath: denrLogo,
    circular: true,
    logoBgWhite: true,
    eyebrow: 'REPUBLIC OF THE PHILIPPINES · 2015–2016',
    line1: 'Department of Environment',
    line2: 'and Natural Resources',
    subline: 'DENR · SURVEYOR AID / GPS OPERATOR (SG 04-1)',
    bgStart: '#041c12',
    bgMid: '#063724',
    bgEnd: '#03120c',
    accent: '#4ade80',
  });

  // 4. S02 E01: Southwest Ticket and Tours
  await buildBrandVectorCard({
    outName: 'ep-s2e1-southwest.webp',
    svgContent: (w, h) => `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="swbg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1c0d04"/>
            <stop offset="55%" stop-color="#3b1d08"/>
            <stop offset="100%" stop-color="#0d0704"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#swbg)"/>
        <rect x="0" y="0" width="8" height="${h}" fill="#f59e0b"/>
        <circle cx="740" cy="270" r="142" fill="rgba(245,158,11,0.14)" stroke="#f59e0b" stroke-width="2.5"/>
        <circle cx="740" cy="270" r="108" fill="#120904" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
        <circle cx="740" cy="270" r="72" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="8 6"/>
        <polygon points="740,205 760,255 810,270 760,285 740,335 720,285 670,270 720,255" fill="#f59e0b"/>
        <circle cx="740" cy="270" r="14" fill="#120904"/>
        <text x="44" y="195" fill="#f59e0b" font-family="Arial, sans-serif" font-size="13" font-weight="bold" letter-spacing="2.6">TRAVEL &amp; TRANSPORT RESERVATIONS · 2016–2018</text>
        <text x="44" y="250" fill="#ffffff" font-family="Arial, sans-serif" font-size="36" font-weight="bold">SOUTHWEST TICKET</text>
        <text x="44" y="292" fill="#ffffff" font-family="Arial, sans-serif" font-size="36" font-weight="bold">AND TOURS</text>
        <rect x="44" y="316" width="410" height="3" fill="#f59e0b"/>
        <text x="44" y="352" fill="#fde68a" font-family="Arial, sans-serif" font-size="14" font-weight="bold" letter-spacing="1.2">TICKETING AGENT · RESERVATIONS &amp; IT SUPPORT</text>
      </svg>
    `,
  });

  // 5. S02 E02: Barangay Peacekeeping Action Team (BPAT) — Lamitan City
  await buildBrandVectorCard({
    outName: 'ep-s2e2-bpat.webp',
    svgContent: (w, h) => `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bpbg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#061a2e"/>
            <stop offset="55%" stop-color="#0c3154"/>
            <stop offset="100%" stop-color="#04101d"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bpbg)"/>
        <rect x="0" y="0" width="8" height="${h}" fill="#38bdf8"/>
        <circle cx="740" cy="270" r="142" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="2.5"/>
        <circle cx="740" cy="270" r="108" fill="#061527" stroke="#facc15" stroke-width="2"/>
        <!-- Civic Shield & Peace Star Emblem -->
        <path d="M740 190 L796 214 V266 C796 306 772 336 740 350 C708 336 684 306 684 266 V214 Z" fill="#0c3154" stroke="#facc15" stroke-width="4"/>
        <polygon points="740,222 751,248 779,250 757,268 764,296 740,280 716,296 723,268 701,250 729,248" fill="#facc15"/>
        <text x="44" y="195" fill="#38bdf8" font-family="Arial, sans-serif" font-size="13" font-weight="bold" letter-spacing="2.4">CIVIC PEACE &amp; ORDER · 500 HOURS (2018–2020)</text>
        <text x="44" y="246" fill="#ffffff" font-family="Arial, sans-serif" font-size="33" font-weight="bold">Barangay Peacekeeping</text>
        <text x="44" y="286" fill="#ffffff" font-family="Arial, sans-serif" font-size="33" font-weight="bold">Action Team (BPAT)</text>
        <rect x="44" y="312" width="410" height="3" fill="#38bdf8"/>
        <text x="44" y="348" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="14" font-weight="bold" letter-spacing="1.2">LAMITAN CITY, BASILAN · PEACE &amp; ORDER OFFICER IV</text>
      </svg>
    `,
  });

  // 6. S02 E03: DICT DigitalJobsPH Outstanding Trainee (2019)
  await buildCertificateSealCard({
    outName: 'ep-s2e3-dict-dj.webp',
    certPath: dictDjCert,
    sealPath: dictLogo,
    eyebrow: 'DICT MINDANAO CLUSTER 1 · 240 HOURS (2019)',
    orgLine1: 'DigitalJobsPH Technical',
    orgLine2: 'Training (DICT)',
    subline: 'Outstanding Trainee Awardee · Lamitan, Basilan',
    bgStart: '#170a2e',
    bgEnd: '#070510',
    accent: '#a855f7',
  });

  // 7. S02 E04: Lamitan Tech4ED Resource Speaker (Mar 2020)
  await buildCertificateSealCard({
    outName: 'ep-s2e4-lamitan-speaker.webp',
    certPath: lamitanCert,
    sealPath: lamitanSealCrop,
    eyebrow: 'CITY GOVT OF LAMITAN · 40 HOURS (MAR 2020)',
    orgLine1: 'Lamitan Tech4ED Center',
    orgLine2: 'Resource Speaker',
    subline: 'Social Media Training · Women & Yakan Weavers',
    bgStart: '#26081c',
    bgEnd: '#09040a',
    accent: '#ec4899',
  });

  // 8. S02 E05: DICT Visayas Cluster 2 — Python Programming Essentials (Dec 2020)
  await buildCertificateSealCard({
    outName: 'ep-s2e5-dict-python.webp',
    certPath: dictPyCert,
    sealPath: dictLogo,
    eyebrow: 'DICT VISAYAS CLUSTER 2 · 40 HOURS (DEC 2020)',
    orgLine1: 'Python Programming',
    orgLine2: 'Essentials (DICT)',
    subline: 'Department of Information & Communications Tech.',
    bgStart: '#06192e',
    bgEnd: '#040a14',
    accent: '#38bdf8',
  });

  // 9. S03 E01: Legacy Group Real Estate, USA (2019–2022)
  await buildBrandVectorCard({
    outName: 'ep-s3e1-legacy.webp',
    svgContent: (w, h) => `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lgbg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#091326"/>
            <stop offset="55%" stop-color="#16284c"/>
            <stop offset="100%" stop-color="#060b16"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#lgbg)"/>
        <rect x="0" y="0" width="8" height="${h}" fill="#eab308"/>
        <circle cx="740" cy="270" r="142" fill="rgba(234,179,8,0.12)" stroke="#eab308" stroke-width="2.5"/>
        <circle cx="740" cy="270" r="108" fill="#081021" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
        <polygon points="680,245 740,198 800,245" fill="none" stroke="#eab308" stroke-width="5" stroke-linejoin="round"/>
        <rect x="697" y="245" width="26" height="72" fill="#eab308"/>
        <rect x="731" y="225" width="26" height="92" fill="#f8fafc"/>
        <rect x="765" y="255" width="22" height="62" fill="#eab308"/>
        <line x1="675" y1="318" x2="805" y2="318" stroke="#eab308" stroke-width="4"/>
        <text x="44" y="195" fill="#eab308" font-family="Arial, sans-serif" font-size="13" font-weight="bold" letter-spacing="2.6">US REAL ESTATE &amp; DIGITAL MEDIA · 2019–2022</text>
        <text x="44" y="250" fill="#ffffff" font-family="Arial, sans-serif" font-size="36" font-weight="bold">LEGACY GROUP</text>
        <text x="44" y="292" fill="#ffffff" font-family="Arial, sans-serif" font-size="36" font-weight="bold">REAL ESTATE, USA</text>
        <rect x="44" y="316" width="410" height="3" fill="#eab308"/>
        <text x="44" y="352" fill="#fef08a" font-family="Arial, sans-serif" font-size="14" font-weight="bold" letter-spacing="1.2">SOCIAL MEDIA MANAGER · GRAPHICS &amp; VIDEO</text>
      </svg>
    `,
  });

  // 10. S03 E02: University of San Carlos (USC) (2022–2023)
  {
    const width = 960;
    const height = 540;
    const campusBase = await sharp(uscCampus)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .modulate({ brightness: 0.3, saturation: 0.9 })
      .blur(1.5)
      .toBuffer();

    const uscLogoResized = await sharp(uscOfficialLogo)
      .resize(350, 110, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer();

    const uscCardSvg = Buffer.from(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="uscbg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#032211" stop-opacity="0.90"/>
            <stop offset="55%" stop-color="#063e20" stop-opacity="0.82"/>
            <stop offset="100%" stop-color="#02130a" stop-opacity="0.94"/>
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#uscbg)"/>
        <rect x="0" y="0" width="8" height="${height}" fill="#facc15"/>
        <rect x="528" y="185" width="386" height="165" rx="20" fill="#ffffff" stroke="#facc15" stroke-width="3"/>

        <text x="44" y="195" fill="#facc15" font-family="Arial, sans-serif" font-size="13" font-weight="bold" letter-spacing="2.8">CEBU CITY, PHILIPPINES · 2022–2023</text>
        <text x="44" y="248" fill="#ffffff" font-family="Arial, sans-serif" font-size="35" font-weight="bold">University of San Carlos</text>
        <text x="44" y="288" fill="#86efac" font-family="Arial, sans-serif" font-size="21" font-weight="bold">SCIENTIA · VIRTUS · DEVOTIO</text>
        <rect x="44" y="314" width="410" height="3" fill="#facc15"/>
        <text x="44" y="350" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="14" font-weight="bold" letter-spacing="1.2">DATABASE ADMINISTRATOR &amp; IT SUPPORT</text>
      </svg>
    `);

    await sharp(campusBase)
      .composite([
        { input: uscCardSvg, top: 0, left: 0 },
        { input: uscLogoResized, top: 212, left: 546 },
      ])
      .webp({ quality: 92 })
      .toFile(path.join(cardsOutDir, 'ep-s3e2-usc.webp'));
    console.log('Built official University of San Carlos card: ep-s3e2-usc.webp');
  }

  // 11. S04 E01: DSWD Field Office VII (2023–2024)
  await buildCertificateSealCard({
    outName: 'ep-s4e1-dswd.webp',
    certPath: dswdCert,
    sealPath: dswdLogo,
    eyebrow: 'DSWD FIELD OFFICE VII · CEBU CITY (2023–2024)',
    orgLine1: 'Department of Social',
    orgLine2: 'Welfare & Dev. (DSWD)',
    subline: 'Administrative Assistant II (SG 08-1 · PACD)',
    bgStart: '#1f0812',
    bgEnd: '#080510',
    accent: '#ef4444',
  });

  // 12. S04 E02: Accenture Inc. (2025–2026)
  await buildBrandVectorCard({
    outName: 'ep-s4e2-accenture.webp',
    svgContent: (w, h) => `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="acbg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#120424"/>
            <stop offset="55%" stop-color="#290849"/>
            <stop offset="100%" stop-color="#080312"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#acbg)"/>
        <rect x="0" y="0" width="8" height="${h}" fill="#a100ff"/>
        <circle cx="740" cy="270" r="142" fill="rgba(161,0,255,0.16)" stroke="#a100ff" stroke-width="2.5"/>
        <circle cx="740" cy="270" r="108" fill="#0d041a" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
        <path d="M700 215 L790 262 L700 309" fill="none" stroke="#a100ff" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="670" y="352" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="bold" letter-spacing="1">accenture</text>

        <text x="44" y="195" fill="#c084fc" font-family="Arial, sans-serif" font-size="13" font-weight="bold" letter-spacing="2.6">ENTERPRISE FRONT-END ENGINEERING · 2025–2026</text>
        <text x="44" y="250" fill="#ffffff" font-family="Arial, sans-serif" font-size="40" font-weight="bold">ACCENTURE INC.</text>
        <text x="44" y="292" fill="#e9d5ff" font-family="Arial, sans-serif" font-size="22" font-weight="bold">Multiplatform Front-End Dev (React)</text>
        <rect x="44" y="316" width="410" height="3" fill="#a100ff"/>
        <text x="44" y="352" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="14" font-weight="bold" letter-spacing="1.2">CEBU IT PARK · REACT · NEXT.JS · REDUX</text>
      </svg>
    `,
  });

  // Sync Top Moments & Certified certificate cards
  fs.copyFileSync(path.join(cardsOutDir, 'ep-s4e1-dswd.webp'), path.join(cardsOutDir, 'ach-dswd.webp'));
  fs.copyFileSync(path.join(cardsOutDir, 'ep-s2e5-dict-python.webp'), path.join(cardsOutDir, 'ach-dict-python.webp'));
  fs.copyFileSync(path.join(cardsOutDir, 'ep-s2e3-dict-dj.webp'), path.join(cardsOutDir, 'ach-dict-dj.webp'));
  fs.copyFileSync(path.join(cardsOutDir, 'ep-s2e4-lamitan-speaker.webp'), path.join(cardsOutDir, 'ach-lamitan.webp'));
  fs.copyFileSync(path.join(cardsOutDir, 'ep-s1e2-comtech.webp'), path.join(cardsOutDir, 'cw-episodes.webp'));
  fs.copyFileSync(path.join(cardsOutDir, 'ach-dswd.webp'), path.join(cardsOutDir, 'cw-moments.webp'));

  console.log('All card images updated with generous margin spacing!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
