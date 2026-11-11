import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/ZETICUZ/.gemini/antigravity/brain/2ebe0471-be86-443a-b270-3c7e9dc14d84';

async function verify() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  console.log('Opening http://localhost:5175/ ...');
  await page.addInitScript(() => {
    sessionStorage.setItem('sam-series-profile', 'sam');
  });
  await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);

  // 1. Scroll to My Skill Universe (#skills) — capture AI & Agentic Engineering and GovTech & Enterprise Ops
  const skillsY = await page.locator('#skills').evaluate((el) => el.getBoundingClientRect().top + window.scrollY - 40);
  await page.evaluate((y) => window.scrollTo(0, y), skillsY);
  await page.waitForTimeout(700);

  const aiTab = page.locator('#skills button:has-text("AI & Agentic Engineering")');
  await aiTab.click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v4_skills_ai_rea_mcp.png') });
  console.log('Saved verified_v4_skills_ai_rea_mcp.png');

  const govTab = page.locator('#skills button:has-text("GovTech & Enterprise Ops")');
  await govTab.click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v4_skills_govtech_icons.png') });
  console.log('Saved verified_v4_skills_govtech_icons.png');

  // 2. Scroll to Top Moments (#moments) — capture Page 1 (Zetica #1, Brgy, QMS, CareerForm, LifeCoach v2) + click Next to Page 2
  const momentsY = await page.locator('#moments').evaluate((el) => el.getBoundingClientRect().top + window.scrollY - 20);
  await page.evaluate((y) => window.scrollTo(0, y), momentsY);
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v4_top_moments_page1.png') });
  console.log('Saved verified_v4_top_moments_page1.png');

  const nextMomentsBtn = page.locator('button[aria-label="Next top moments page"]');
  await nextMomentsBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v4_top_moments_page2.png') });
  console.log('Saved verified_v4_top_moments_page2.png');

  // 3. Scroll to Certified — verify COMTECH school seal logo on card #1
  const certifiedHeading = page.locator('#moments h3:has-text("Certified")');
  const certY = await certifiedHeading.evaluate((el) => el.getBoundingClientRect().top + window.scrollY - 120);
  await page.evaluate((y) => window.scrollTo(0, y), certY);
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v4_certified_comtech_logo.png') });
  console.log('Saved verified_v4_certified_comtech_logo.png');

  // 4. Scroll to The Full Story (#story) — verify Top Story Zetica mission callout & 12 Originals
  const storyY = await page.locator('#story').evaluate((el) => el.getBoundingClientRect().top + window.scrollY - 20);
  await page.evaluate((y) => window.scrollTo(0, y), storyY);
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v4_full_story_zetica_mission.png') });
  console.log('Saved verified_v4_full_story_zetica_mission.png');

  console.log('Page errors:', errors.length ? errors : 'NONE');
  await browser.close();
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
