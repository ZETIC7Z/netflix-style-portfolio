# AGENT.md — Sam Pangilinan: The Series (`Portfolio_series`)

## 1. Project Identity & Developer
- **Owner & Protagonist:** **Sam Faus Said Zahran Pangilinan** (`Sam Pangilinan` / `ZETICUZ` / `ZETIC7Z` / `TECHNOLOHIYA`)
- **Portfolio Website:** `https://www.zeticuz.xyz/`
- **Email & Phone:** `samxerz12@gmail.com` · `+63310988089`
- **Workspace Path:** `C:\Users\ZETICUZ\Documents\portfolio netflix\Portfolio_series`
- **Local Dev Server:** `npx vite --port 5175 --host` (`http://localhost:5175/`)

## 2. Architecture & Visual System
- **Stack:** React 19 + TypeScript + Vite 6 + Tailwind CSS v4 + Framer Motion + Lenis Smooth Scroll (`lerp: 0.12`) + Web Audio API Synthesizer (`src/hooks/sound.tsx`).
- **Data Source:** [`src/data/portfolio.ts`](file:///C:/Users/ZETICUZ/Documents/portfolio%20netflix/Portfolio_series/src/data/portfolio.ts)
- **PDS-Verified Education (CS Form 212):**
  - **2-Year Vocational College Diploma:** `Associate in Computer Engineering Technician` (101 Units Earned, Graduated 2016) — `Computer Technologies Institute (COMTECH) Inc., Zamboanga City` (`2014 — 2016`), displaying the official circular COMTECH school seal (`/assets/comtech-logo.jpg` & `/cards/cert-comtech.webp`).
  - **Secondary Education:** `Ubit National High School`, Lamitan City, Basilan (`2006 — 2011`).
  - **Elementary Education:** `Talamban Elementary School`, Cebu City (`2001 — 2006`).
- **12 Flagship Originals (Sorted by Creation Date Descending — Newest First):**
  1. `zetica-suite` (`2026-11-01`): **Zetica Creative Suite & Hub (`https://zetica.vercel.app/` & `https://zetica.vercel.app/apps.html`)** (`Nov 2026`) — 14 Native Rust/WebGPU desktop creative & office apps + Zetica Studio AI, continuously in active development to be 100% free forever for all students and editors who cannot afford paid subscriptions.
  2. `smart-brgy-portal` (`2026-10-28`): **Barangay Matatag 3D Portal** (`Oct 2026`)
  3. `client-qms` (`2026-10-21`): **CLIENT QMS — DSWD AICS** (`Oct 2026`)
  4. `careerform-ph` (`2026-09-14`): **CareerForm PH (CS Form 212 PDS)** (`Sep 2026`)
  5. `lifecoach-v2` (`2026-09-13`): **LifeCoachDoc v2** (`Sep 2026`)
  6. `lifecoach-v1` (`2026-09-12`): **LifeCoachDoc v1** (`Sep 2026`)
  7. `nexus-v2` (`2026-08-28`): **NEXUS v2 (`nexusph.xyz`)** (`Aug 2026`)
  8. `nwanganga-shields` (`2026-07-12`): **Dr. Nwanganga Shields Memoir** (`Jul 2026`)
  9. `sws-skeptrons` (`2026-05-29`): **SWS Skeptrons Hub** (`May 2026`)
  10. `dekaron-stampede` (`2026-03-14`): **Dekaron Stampede** (`Mar 2026`)
  11. `zetflix-tv` (`2026-02-26`): **ZETFLIX TV** (`Feb 2026`)
  12. `nexus-streaming` (`2026-01-30`): **NEXUS Streaming (v1)** (`Jan 2026`)

## 3. Completed Milestones (2026-11-11)
1. **Authentic GTA Menu Hover & Click Sound Effects (`src/hooks/sound.tsx`, `public/sfx/pointing-cursor.wav`, `public/sfx/gta-menu.wav`):**
   - Replaced all synthesized Web Audio oscillator noises with Sam's authentic GTA menu `.wav` sound effects:
     - Pointing/hovering the mouse over buttons, links, tabs, or project cards plays `/sfx/pointing-cursor.wav`.
     - Clicking any button, link, tab, or project card plays `/sfx/gta-menu.wav`.
   - Controlled globally via the `SFX ON / MUTED` button in [`Navbar.tsx`](file:///C:/Users/ZETICUZ/Documents/portfolio%20netflix/Portfolio_series/src/components/Navbar.tsx).
2. **SWS Skeptrons YouTube Music Player & Playlist (`src/context/AudioPlayerContext.tsx`, `src/components/SWSMusicPlayer.tsx`, `src/components/Navbar.tsx`, `src/App.tsx`):**
   - Ported the complete YouTube Music Player from `sws-website` (`https://sws-skeptrons.vercel.app/`) with 100% of its features (YouTube IFrame API playback, seek bar with elapsed/remaining time, volume slider popover, `•••` Choose Options, `Playing Next` queue management, and live YouTube Data API v3 Search & Add-to-Playlist overlay), restyled in the portfolio's ZETICUZ Crimson & Obsidian theme.
   - Configured `https://www.youtube.com/watch?v=iNsO2CbCV0Y&t=2344s` (`OPM Trending Playlist 2026 — Must Listen Filipino Songs Mix` by `OPM Calm`, starting at `39:04` / `2344s`) as Song #1 (`index 0`) with auto-play enabled by default.
   - Rendered the full `SWSMusicPlayer` on the Home Page right below `Hero`, plus a synchronized compact Music Pill & Popover Player in the top `Navbar` right next to `SFX ON`.
3. **Silent Commercial Multi-Scene Trailers (`public/trailers/*.mp4`, `src/components/ProjectModal.tsx`):**
   - Stripped the noisy "shhh" transition audio and cross-project audio tracks (`ffmpeg -c:v copy -an`) from all 12 project trailers (`zetica-suite.mp4`, `smart-brgy-portal.mp4`, `client-qms.mp4`, `careerform-ph.mp4`, `nexus-v2.mp4`, `lifecoach-v2.mp4`, `lifecoach-v1.mp4`, `nwanganga-shields.mp4`, `sws-skeptrons.mp4`, `dekaron-stampede.mp4`, `zetflix-tv.mp4`, `nexus-streaming.mp4`) so trailers play cleanly without interfering with the YouTube Music Player.
4. **Bespoke SVG Tech Icons Across All 6 Skill Categories (`src/components/SkillIcons.tsx` & `src/components/Skills.tsx`):** Vector SVG icons for every skill across `Frontend & 3D WebGL`, `Backend, Streaming & APIs` (including `Rust & WebGPU`), `Databases & Cloud Auth`, `AI & Agentic Engineering` (`REA Reverse Engineering`, `Claude Code & Antigravity`, `Chrome DevTools & Playwright MCP`, `Firecrawl & Context7 MCP`, `OpenAI & Gemini APIs`, `DeepEval & Confident AI`, `Shadcn & Frontend UI Skill`), `DevOps, GIS & Quality`, and `GovTech & Enterprise Ops`.
5. **16 Individual `Top Moments` Cards + Side-to-Side `Prev / Next` Pagination (`src/components/Achievements.tsx`) & 5-Season `My Journey` (`src/components/Seasons.tsx`):**
   - Every project and work experience has its own card with authentic agency/company/school seals (**COMTECH Inc.**, **DENR**, **University of San Carlos**, **DSWD**, **DICT**, **City of Lamitan**, **Accenture**, **Legacy Group Real Estate USA**, **Southwest Ticket and Tours**, **Zinex Cinematic**), and all 5 Seasons display side-by-side with a 12-second auto-advance timer.
