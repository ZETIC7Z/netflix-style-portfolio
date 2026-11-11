import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/ZETICUZ/.gemini/antigravity/brain/2ebe0471-be86-443a-b270-3c7e9dc14d84';
const URL = 'http://localhost:5175/';

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await context.addInitScript(() => {
  sessionStorage.setItem('sam-series-profile', 'sam');
});
const page = await context.newPage();

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

// Scroll to My Journey (#journey)
const journey = page.locator('#journey');
await journey.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);

// Click Season 01 tab explicitly and screenshot
const s1Tab = page.locator('[role="tab"]', { hasText: 'SEASON 01' });
await s1Tab.click();
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v5_journey_s01_all5_tabs.png') });
console.log('Saved verified_v5_journey_s01_all5_tabs.png');

// Click Season 02 tab and screenshot
const s2Tab = page.locator('[role="tab"]', { hasText: 'SEASON 02' });
await s2Tab.click();
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v5_journey_s02_southwest_bpat_dict.png') });
console.log('Saved verified_v5_journey_s02_southwest_bpat_dict.png');

// Click Season 03 tab and screenshot
const s3Tab = page.locator('[role="tab"]', { hasText: 'SEASON 03' });
await s3Tab.click();
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v5_journey_s03_legacy_usc.png') });
console.log('Saved verified_v5_journey_s03_legacy_usc.png');

// Click Season 04 tab and screenshot
const s4Tab = page.locator('[role="tab"]', { hasText: 'SEASON 04' });
await s4Tab.click();
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v5_journey_s04_dswd_accenture.png') });
console.log('Saved verified_v5_journey_s04_dswd_accenture.png');

// Click Season 05 tab and screenshot
const s5Tab = page.locator('[role="tab"]', { hasText: 'SEASON 05' });
await s5Tab.click();
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v5_journey_s05_zetica_12_originals.png') });
console.log('Saved verified_v5_journey_s05_zetica_12_originals.png');

// Scroll to Top Picks (#picks) and verify #12 NEXUS Stream v1 image loads
const picks = page.locator('#picks');
await picks.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);

// Scroll to The Full Story (#story) and verify separated experience + COMTECH Certified
const story = page.locator('#story');
await story.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v5_story_separated_experience.png') });
console.log('Saved verified_v5_story_separated_experience.png');

// Audit all images across the page
const brokenImages = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('img'));
  return imgs
    .filter((img) => !img.complete || img.naturalWidth === 0)
    .map((img) => ({ src: img.getAttribute('src'), alt: img.getAttribute('alt') }));
});

// Verify all 5 season tabs are visible within the viewport width
await journey.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
const tabBounds = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('#journey [role="tab"]')).map((el) => {
    const r = el.getBoundingClientRect();
    return {
      text: el.textContent?.trim(),
      left: Math.round(r.left),
      right: Math.round(r.right),
      width: Math.round(r.width),
      inViewport: r.left >= 0 && r.right <= window.innerWidth,
    };
  });
});

console.log('Season Tab Bounds:', JSON.stringify(tabBounds, null, 2));
console.log('Broken Images:', JSON.stringify(brokenImages));
console.log('Console Errors:', JSON.stringify(consoleErrors));

await browser.close();
