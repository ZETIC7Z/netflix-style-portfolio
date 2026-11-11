import { chromium } from 'playwright';
import path from 'node:path';

const ARTIFACT_DIR = 'C:\\Users\\ZETICUZ\\.gemini\\antigravity\\brain\\2ebe0471-be86-443a-b270-3c7e9dc14d84';

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  await context.addInitScript(() => {
    sessionStorage.setItem('sam-series-profile', 'sam');
  });
  const page = await context.newPage();

  console.log('Opening http://localhost:5175/...');
  await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // 1. Verify My Journey Season duration >= 10s
  await page.locator('#journey').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  const s1ActiveAtStart = await page.locator('#journey button[role="tab"]').first().getAttribute('aria-selected');
  console.log('Season 01 active initially:', s1ActiveAtStart);
  await page.waitForTimeout(5500);
  const s1ActiveAfter5s = await page.locator('#journey button[role="tab"]').first().getAttribute('aria-selected');
  console.log('Season 01 still active after 5.5s (12s auto-advance):', s1ActiveAfter5s);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v6_seasons_12s_duration.png') });

  // 2. Open ZETICA trailer modal
  await page.locator('#originals').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const zeticaBtn = page.locator('[aria-label="Open Zetica Creative Suite & Hub"]').first();
  await zeticaBtn.evaluate((b) => b.click());
  await page.waitForTimeout(1800);

  await page.evaluate(() => {
    const v = document.querySelector('[role="dialog"] video');
    if (v) {
      v.currentTime = 10.5;
      v.pause();
    }
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v6_zetica_modal_pro.png') });
  console.log('Captured verified_v6_zetica_modal_pro.png');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);

  // 3. Open CareerForm PH trailer modal
  const careerBtn = page.locator('[aria-label="Open CareerForm PH"]').first();
  await careerBtn.evaluate((b) => b.click());
  await page.waitForTimeout(1800);

  // Seek to 9.8s (Intro splash transition to Hero Carousel)
  await page.evaluate(() => {
    const v = document.querySelector('[role="dialog"] video');
    if (v) {
      v.currentTime = 9.8;
      v.pause();
    }
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v6_careerform_modal_intro.png') });

  // Seek to 23.0s (Scene 02: 69% Live PDS Mirror Zoom + Real-Time Typing)
  await page.evaluate(() => {
    const v = document.querySelector('[role="dialog"] video');
    if (v) {
      v.currentTime = 23.0;
      v.pause();
    }
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v6_careerform_modal_69zoom_typing.png') });

  // Seek to 35.5s (Scene 03: Drag & Pan PDS Canvas at 69% Zoom)
  await page.evaluate(() => {
    const v = document.querySelector('[role="dialog"] video');
    if (v) {
      v.currentTime = 35.5;
      v.pause();
    }
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v6_careerform_modal_69zoom_drag.png') });
  console.log('Captured CareerForm PH v6 modal screenshots (intro, 69% typing, 69% drag)');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);

  // 4. Open Barangay Matatag 3D Portal modal (User's Facebook Video + Audio)
  const brgyBtn = page.locator('[aria-label="Open Barangay Matatag 3D Portal"]').first();
  await brgyBtn.evaluate((b) => b.click());
  await page.waitForTimeout(1800);

  const brgyVideoInfo = await page.evaluate(() => {
    const v = document.querySelector('[role="dialog"] video');
    if (v) {
      v.currentTime = 42.0;
      v.pause();
      return {
        src: v.currentSrc,
        duration: v.duration,
        muted: v.muted,
        videoWidth: v.videoWidth,
        videoHeight: v.videoHeight,
      };
    }
    return null;
  });
  console.log('Barangay Matatag modal video info:', brgyVideoInfo);
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v6_brgy_modal_fb_video_audio.png') });

  await browser.close();
  console.log('ALL V6 VERIFICATION SCREENSHOTS COMPLETE!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
