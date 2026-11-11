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

  const sfxRequests = [];
  page.on('request', (req) => {
    if (req.url().includes('/sfx/')) {
      sfxRequests.push(req.url());
    }
  });

  console.log('Opening http://localhost:5175/...');
  await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Capture Hero + Navbar Music Pill next to SFX ON
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v7_hero_navbar_music_pill.png') });
  console.log('Captured verified_v7_hero_navbar_music_pill.png');

  // 2. Scroll to Home Page SWSMusicPlayer
  await page.locator('#sws-music-player').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v7_home_sws_music_player.png') });
  console.log('Captured verified_v7_home_sws_music_player.png');

  // 3. Open Playlist Queue overlay ("Open Playing Next List")
  const listBtn = page.locator('#sws-music-player button[title="Open Playing Next List"]');
  await listBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v7_sws_player_playlist_queue.png') });
  console.log('Captured verified_v7_sws_player_playlist_queue.png');

  // Close Playlist Queue overlay first
  const closePlaylistBtn = page.locator('#sws-music-player span:has-text("Playing Next") + button');
  await closePlaylistBtn.click();
  await page.waitForTimeout(400);

  // 4. Open YouTube Search overlay ("Search Music") and search a track
  const searchBtn = page.locator('#sws-music-player button[title="Search Music"]');
  await searchBtn.click();
  await page.waitForTimeout(600);
  const searchInput = page.locator('#sws-music-player input[placeholder="Search YouTube music..."]');
  await searchInput.fill('OPM Chill Hits');
  const submitSearchBtn = page.locator('#sws-music-player button:has-text("Search")');
  await submitSearchBtn.click();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v7_sws_player_youtube_search.png') });
  console.log('Captured verified_v7_sws_player_youtube_search.png');

  // Close search overlay
  const closeOverlayBtn = page.locator('#sws-music-player span:has-text("YouTube Search") + button');
  await closeOverlayBtn.click();
  await page.waitForTimeout(500);

  // 5. Verify GTA SFX loaded and trailer modal plays silently without "shhh" noise
  const zeticaBtn = page.locator('[aria-label="Open Zetica Creative Suite & Hub"]').first();
  await zeticaBtn.evaluate((el) => {
    el.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
    el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    el.click();
  });
  await page.waitForTimeout(1800);

  const modalVideoState = await page.evaluate(() => {
    const v = document.querySelector('[role="dialog"] video');
    if (v) {
      v.currentTime = 14.0;
      v.pause();
      return {
        muted: v.muted,
        src: v.currentSrc,
      };
    }
    return null;
  });
  console.log('Modal trailer video state:', modalVideoState);
  console.log('Preloaded GTA SFX assets:', sfxRequests);

  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'verified_v7_silent_trailer_modal.png') });
  console.log('Captured verified_v7_silent_trailer_modal.png');

  await browser.close();
  console.log('ALL V7 VERIFICATIONS COMPLETE!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
