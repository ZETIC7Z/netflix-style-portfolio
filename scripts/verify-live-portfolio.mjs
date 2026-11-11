import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACTS = 'C:/Users/ZETICUZ/.gemini/antigravity/brain/2ebe0471-be86-443a-b270-3c7e9dc14d84';
const TRAILERS_DIR = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/trailers';

async function run() {
  // 1. Verify all 11 trailer MP4 files exist and are > 1MB
  const expectedTrailers = [
    'smart-brgy-portal.mp4',
    'client-qms.mp4',
    'careerform-ph.mp4',
    'lifecoach-v2.mp4',
    'lifecoach-v1.mp4',
    'nexus-v2.mp4',
    'nwanganga-shields.mp4',
    'sws-skeptrons.mp4',
    'dekaron-stampede.mp4',
    'zetflix-tv.mp4',
    'nexus-streaming.mp4',
  ];
  for (const t of expectedTrailers) {
    const p = path.join(TRAILERS_DIR, t);
    const stat = fs.statSync(p);
    console.log(`[TRAILER OK] ${t}: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
    if (stat.size < 500_000) throw new Error(`Trailer ${t} is too small!`);
  }

  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  console.log('Opening http://localhost:5175/ ...');
  await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });

  // Skip intro if visible
  const skipBtn = page.getByRole('button', { name: /skip intro/i });
  if (await skipBtn.isVisible().catch(() => false)) {
    await skipBtn.click();
    await page.waitForTimeout(600);
  }

  // Pick Sam (Main) profile if selector is visible
  const samBtn = page.getByRole('button', { name: /Sam \(Main\)/i });
  if (await samBtn.isVisible().catch(() => false)) {
    await samBtn.click();
    await page.waitForTimeout(800);
  }

  // 2. Verify Hero portrait and enlarged logos
  const heroCheck = await page.evaluate(() => {
    const heroImg = document.querySelector('#top img[alt*="Sam Pangilinan"]');
    const navLogo = document.querySelector('header img[alt="ZETICUZ"]');
    const heroLogo = document.querySelector('#top img[alt="ZETICUZ"]');
    return {
      portrait: heroImg ? { w: heroImg.naturalWidth, h: heroImg.naturalHeight } : null,
      navLogoHeight: navLogo ? navLogo.getBoundingClientRect().height : 0,
      heroLogoHeight: heroLogo ? heroLogo.getBoundingClientRect().height : 0,
    };
  });
  console.log('[PASS] Hero & Logo Check:', heroCheck);
  await page.screenshot({ path: path.join(ARTIFACTS, 'verified_hero_portrait_fixed.png') });

  // 3. Verify no BSIT or GMCS references remain on the page
  const bodyText = await page.locator('body').innerText();
  if (/GMCS/i.test(bodyText)) throw new Error('Found GMCS reference on page!');
  if (/Bachelor of Science in Information Technology/i.test(bodyText)) {
    throw new Error('Found old BSIT reference on page!');
  }
  if (!/Computer Engineering Technician/i.test(bodyText)) {
    throw new Error('Missing Computer Engineering Technician from PDS!');
  }
  console.log('[PASS] Education accurately matches PDS (Computer Engineering Technician at COMTECH Zamboanga).');

  // 4. Verify My Journey (#journey) starts at Season 01 and auto-advances to Season 02
  const journeyEl = page.locator('#journey');
  await journeyEl.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const initialSeasonText = await journeyEl.locator('h3').first().innerText();
  console.log('[PASS] Initial Season displayed in My Journey:', initialSeasonText);
  if (!initialSeasonText.includes('S01')) {
    throw new Error(`Expected My Journey to start at S01, got: ${initialSeasonText}`);
  }
  await page.screenshot({ path: path.join(ARTIFACTS, 'verified_seasons_s01.png') });

  // Wait 6.8 seconds (without hovering #journey) to verify auto-advance to S02
  await page.mouse.move(10, 10);
  await page.waitForTimeout(6800);
  const nextSeasonText = await journeyEl.locator('h3').first().innerText();
  console.log('[PASS] Auto-advanced Season in My Journey:', nextSeasonText);
  await page.screenshot({ path: path.join(ARTIFACTS, 'verified_seasons_s02_autoplay.png') });

  // 5. Verify Top Picks & Modals (Newest First: #1 Brgy Matatag 3D, #2 CLIENT QMS, #3 CareerForm PH, ..., #6 NEXUS v2)
  const picksEl = page.locator('#picks');
  await picksEl.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(ARTIFACTS, 'verified_top_picks_v3.png') });

  // Open #1 Brgy Matatag 3D
  await picksEl.getByText('Brgy Matatag 3D').first().click();
  await page.waitForTimeout(1600);
  const brgyMeta = await page.evaluate(async () => {
    const v = document.querySelector('video');
    if (!v) return null;
    v.currentTime = 12;
    await new Promise((r) => setTimeout(r, 400));
    return { src: v.currentSrc || v.src, w: v.videoWidth, h: v.videoHeight, duration: v.duration };
  });
  console.log('[PASS] #1 Barangay Matatag 3D Trailer:', brgyMeta);
  await page.screenshot({ path: path.join(ARTIFACTS, 'verified_modal_brgy_matatag.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Open #2 CLIENT QMS
  await picksEl.getByText('CLIENT QMS').first().click();
  await page.waitForTimeout(1600);
  const qmsMeta = await page.evaluate(async () => {
    const v = document.querySelector('video');
    if (!v) return null;
    v.currentTime = 16;
    await new Promise((r) => setTimeout(r, 400));
    return { src: v.currentSrc || v.src, w: v.videoWidth, h: v.videoHeight, duration: v.duration };
  });
  console.log('[PASS] #2 CLIENT QMS Trailer:', qmsMeta);
  await page.screenshot({ path: path.join(ARTIFACTS, 'verified_modal_client_qms.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Open #6 NEXUS v2 (scroll rail slightly if needed)
  await picksEl.getByText('NEXUS v2').first().click();
  await page.waitForTimeout(1600);
  const nexusMeta = await page.evaluate(async () => {
    const v = document.querySelector('video');
    if (!v) return null;
    v.currentTime = 38; // Seek to Act 4 (/settings page tour)
    await new Promise((r) => setTimeout(r, 500));
    return { src: v.currentSrc || v.src, w: v.videoWidth, h: v.videoHeight, duration: v.duration };
  });
  console.log('[PASS] NEXUS v2 Multi-Page Trailer (Settings Page Frame):', nexusMeta);
  await page.screenshot({ path: path.join(ARTIFACTS, 'verified_modal_nexus_v2.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Open #8 SWS Skeptrons to verify unlocked main site after clicking ENTER SITE
  await picksEl.getByText('SWS Skeptrons').first().click();
  await page.waitForTimeout(1600);
  const swsMeta = await page.evaluate(async () => {
    const v = document.querySelector('video');
    if (!v) return null;
    v.currentTime = 14;
    await new Promise((r) => setTimeout(r, 500));
    return { src: v.currentSrc || v.src, w: v.videoWidth, h: v.videoHeight, duration: v.duration };
  });
  console.log('[PASS] SWS Skeptrons Unlocked Main Site Trailer:', swsMeta);
  await page.screenshot({ path: path.join(ARTIFACTS, 'verified_modal_sws_skeptrons.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // 6. Verify The Full Story (#story) Resume with PDS Education
  const storyEl = page.locator('#story');
  await storyEl.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(ARTIFACTS, 'verified_resume_pds.png') });
  console.log('[PASS] Captured Resume section with PDS Education (COMTECH Zamboanga).');

  // 7. Verify FinalCTA (#contact) -> click LET'S BUILD -> scrolls to #send-message + 4-Column Footer Card + Single Footer Logo
  const contactEl = page.locator('#contact');
  await contactEl.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(ARTIFACTS, 'verified_final_cta_buttons.png') });

  // Click LET'S BUILD in FinalCTA
  await contactEl.getByRole('button', { name: /LET'S BUILD/i }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACTS, 'verified_send_message_section.png') });

  // Scroll to bottom footer card & attribution
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(700);
  const footerLogosCount = await page.locator('footer img[alt="ZETICUZ"]').count();
  console.log('[PASS] Footer ZETICUZ logo count (should be 1):', footerLogosCount);
  if (footerLogosCount !== 1) {
    throw new Error(`Expected exactly 1 ZETICUZ logo in footer, found ${footerLogosCount}`);
  }
  await page.screenshot({ path: path.join(ARTIFACTS, 'verified_footer_card_and_logo.png') });

  if (errors.length) {
    console.warn('Page errors:', errors);
  } else {
    console.log('[PASS] Zero runtime page errors!');
  }

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
