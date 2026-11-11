export type ProfileId = 'sam' | 'recruiter' | 'developer' | 'creative';
export type SectionId = 'about' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'story';

export interface Palette {
  from: string;
  via: string;
  to: string;
  accent: string;
}

export interface ViewerProfile {
  id: ProfileId;
  name: string;
  blurb: string;
  color: string;
  order: SectionId[];
}

export interface Episode {
  code: string;
  title: string;
  runtime: string;
  description: string;
  tags: string[];
  palette: Palette;
  image?: string;
}

export interface Season {
  number: number;
  title: string;
  period: string;
  synopsis: string;
  episodes: Episode[];
}

export interface Project {
  id: string;
  title: string;
  year: string;
  createdAt: string;
  genre: string;
  logline: string;
  demo?: string;
  github?: string;
  palette: Palette;
  metrics: { value: string; label: string }[];
  build: string[];
  stack: string[];
  features: string[];
  portraitImage?: string;
  landscapeImage?: string;
  trailer?: string;
}

export interface TopPick {
  title: string;
  label: string;
  detail: string;
  palette: Palette;
  portraitImage?: string;
  projectId?: string;
}

export interface Skill {
  name: string;
  mono: string;
  tag: string;
  note?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  subtitle: string;
  skills: Skill[];
}

export interface Achievement {
  id: string;
  laurel: string;
  title: string;
  org: string;
  detail: string;
  link?: string;
  image?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  link?: string;
  image?: string;
}

export const profile = {
  firstName: 'SAM PANGILINAN',
  fullName: 'Sam Faus Said Zahran Pangilinan',
  displayName: 'Sam Pangilinan',
  role: 'AI-First Full-Stack Engineer, Native Rust & GovTech Systems Architect',
  originalLabel: 'A ZETICUZ ORIGINAL SERIES',
  seriesTag: 'THE SERIES',
  tagline: ['FULL-STACK & RUST ENGINEER', 'GOVTECH & AI SYSTEMS', '3D WEB & STREAMING ARCHITECT'],
  intro:
    'I architect and ship 12+ production platforms—led by Zetica Creative Suite & Hub (14 open-source native Rust desktop creative & office apps built to be 100% free forever with zero subscriptions for students and editors), Barangay Matatag 3D E-Governance Portal, DSWD AICS CLIENT QMS, CareerForm PH (CSC Form 212), and NEXUS v2.',
  flagshipMission:
    'Zetica (zetica.vercel.app) is my biggest ongoing flagship project—continuously in active development to make professional creative, design, video, motion, audio, PDF, and office desktop apps accessible for all students and editors who cannot afford expensive paid apps. Every app in the suite is built to be 100% free for all without any subscription.',
  location: 'H. Avellana Tintay Talamban / Consolacion, Cebu City, Philippines',
  email: 'samxerz12@gmail.com',
  phone: '+63310988089',
  resumePdf: '/assets/Sam_Pangilinan_Resume.pdf',
  certificatesPdf: '/assets/Sam_Pangilinan_Certificates.pdf',
  portrait: {
    src: '/assets/portrait-1100.webp',
    srcSet: '/assets/portrait-420.webp 420w, /assets/portrait-720.webp 720w, /assets/portrait-1100.webp 1100w',
    alt: 'Sam Pangilinan — AI-First Full-Stack Engineer',
  },
  links: {
    portfolio: 'https://www.zeticuz.xyz/',
    github: 'https://github.com/ZETIC7Z',
    youtube: 'https://www.youtube.com/@ZETICUZ',
    facebook: 'https://www.facebook.com/samxerz.pangilinan/',
    instagram: 'https://www.instagram.com/zeticuz_',
  },
  interests: [
    'Open-Source Rust Creative Apps (Zetica)',
    'GovTech & E-Governance Systems',
    'Full-Stack React & Next.js',
    'Agentic AI & REA Reverse Engineering',
    '3D WebGL & React Three Fiber',
    'Multi-Source HLS Streaming',
  ],
};

export const viewerProfiles: ViewerProfile[] = [
  {
    id: 'sam',
    name: 'Sam (Main)',
    blurb: 'The complete director’s cut in chronological order',
    color: '#E50914',
    order: ['about', 'journey', 'originals', 'picks', 'skills', 'moments', 'story'],
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    blurb: 'Flagship builds, PDS dossier & verified credentials first',
    color: '#2563EB',
    order: ['originals', 'story', 'moments', 'skills', 'picks', 'about', 'journey'],
  },
  {
    id: 'developer',
    name: 'Developer',
    blurb: 'Architecture, 1-min live site trailers & full-stack tooling',
    color: '#10B981',
    order: ['originals', 'skills', 'picks', 'journey', 'moments', 'about', 'story'],
  },
  {
    id: 'creative',
    name: 'Client / Lead',
    blurb: 'Newest Zetica, GovTech & client production builds with trailers',
    color: '#A855F7',
    order: ['picks', 'originals', 'moments', 'about', 'skills', 'journey', 'story'],
  },
];

export const sectionMeta: Record<
  SectionId,
  { nav: string; title: string; eyebrow: string; card: string; meta: string; palette: Palette; image?: string }
> = {
  about: {
    nav: 'About',
    title: 'About Me',
    eyebrow: 'S01 · Character Study',
    card: 'The Protagonist',
    meta: 'Computer Eng. Tech · 7+ Yrs Industry',
    palette: { from: '#2b0710', via: '#7a0f24', to: '#09090d', accent: '#ff3d5a' },
    image: '/cards/cw-about.webp',
  },
  journey: {
    nav: 'Episodes',
    title: 'My Journey',
    eyebrow: 'S01–S05 · Career Arc',
    card: 'Seasons & Episodes',
    meta: '5 Seasons · S01 to S05 Auto-Play',
    palette: { from: '#120a2a', via: '#4c1d95', to: '#09090d', accent: '#b98bff' },
    image: '/cards/cw-episodes.webp',
  },
  originals: {
    nav: 'Originals',
    title: 'Originals',
    eyebrow: 'ZETICUZ Originals · Newest First',
    card: 'Featured Originals',
    meta: '12 Flagship Builds · Sorted by Date',
    palette: { from: '#061c2e', via: '#0369a1', to: '#09090d', accent: '#4cc9ff' },
    image: '/cards/cw-originals.webp',
  },
  picks: {
    nav: 'Top Picks',
    title: "Sam's Top Picks",
    eyebrow: 'Best Flagship, GovTech & Client Builds',
    card: 'Top 12 Picks',
    meta: 'Zetica · GovTech · Client 3D · Streaming',
    palette: { from: '#291504', via: '#b45309', to: '#09090d', accent: '#ffb547' },
    image: '/cards/cw-picks.webp',
  },
  skills: {
    nav: 'Skills',
    title: 'My Skill Universe',
    eyebrow: 'Genres · Stack, MCPs & Tooling',
    card: 'Skill Universe',
    meta: '6 Domains · 46 Production Icons',
    palette: { from: '#042419', via: '#047857', to: '#09090d', accent: '#46e3a8' },
    image: '/cards/cw-skills.webp',
  },
  moments: {
    nav: 'Awards',
    title: 'Top Moments',
    eyebrow: 'Individual Flagship Launches & Honors',
    card: 'Top Moments',
    meta: '16 Individual Milestones · Prev / Next',
    palette: { from: '#280819', via: '#9d174d', to: '#09090d', accent: '#ff8a5c' },
    image: '/cards/cw-moments.webp',
  },
  story: {
    nav: 'Resume',
    title: 'The Full Story',
    eyebrow: 'Screenplay · Verified PDS & Zetica Mission',
    card: 'Resume & Credentials',
    meta: 'CS Form 212 PDS + Certificates',
    palette: { from: '#1f080c', via: '#991b1b', to: '#09090d', accent: '#ff3d5a' },
    image: '/cards/cw-resume.webp',
  },
};

export const seasons: Season[] = [
  {
    number: 1,
    title: 'COMTECH Diploma, DENR & Zinex',
    period: '2011 — 2016',
    synopsis:
      'Started in multimedia production at Zinex Cinematic (2011–2014), graduated from the 2-year vocational college program in Computer Engineering Technician (101 units) at Computer Technologies Institute (COMTECH) Inc. in Zamboanga City (2014–2016), and served as Surveyor Aid / GPS Operator at the Department of Environment and Natural Resources (DENR).',
    episodes: [
      {
        code: 'S01 E01',
        title: 'Zinex Cinematic — Video Production & Graphics Design',
        runtime: 'May 2011 – Dec 2014 · Multimedia Production Studio',
        description:
          'Produced commercial video edits, motion graphics, visual branding, and digital media layouts across 3+ years at Zinex Cinematic.',
        tags: ['Zinex Cinematic', 'Video Production', 'Graphics Design', 'Visual Branding'],
        palette: { from: '#1a060a', via: '#991b1b', to: '#09090d', accent: '#ff3d5a' },
        image: '/cards/ep-s1e1-zinex.webp',
      },
      {
        code: 'S01 E02',
        title: 'Computer Technologies Institute (COMTECH) Inc.',
        runtime: '2014–2016 · 2-Year Vocational College Course (101 Units)',
        description:
          'Graduated with the 2-year Associate in Computer Engineering Technician vocational diploma at Computer Technologies Institute (COMTECH) Inc., Zamboanga City—mastering computer hardware diagnostics, LAN/WAN networking, and programming fundamentals.',
        tags: ['COMTECH Zamboanga', 'Computer Engineering Technician', '2-Year Vocational', '101 Units'],
        palette: { from: '#081838', via: '#1d4ed8', to: '#09090d', accent: '#d4af37' },
        image: '/cards/ep-s1e2-comtech.webp',
      },
      {
        code: 'S01 E03',
        title: 'Department of Environment and Natural Resources (DENR)',
        runtime: 'Jul 2015 – May 2016 · Surveyor Aid / GPS Operator (SG 04-1)',
        description:
          'Served under Contract of Service at the Department of Environment and Natural Resources (DENR) conducting field GPS surveying, geospatial coordinate mapping, and land resource documentation.',
        tags: ['DENR Official', 'Surveyor Aid / GPS Operator', 'Geospatial Mapping', 'Gov Service (SG 04-1)'],
        palette: { from: '#042414', via: '#15803d', to: '#09090d', accent: '#4ade80' },
        image: '/cards/ep-s1e3-denr.webp',
      },
    ],
  },
  {
    number: 2,
    title: 'Southwest, BPAT & DICT Citations',
    period: '2016 — 2020',
    synopsis:
      'Delivered ticketing and IT support at Southwest Ticket and Tours, served in public safety with the Barangay Peacekeeping Action Team (BPAT) in Lamitan City, earned the DICT DigitalJobsPH Outstanding Trainee Award (240h), served as Lamitan Tech4ED Resource Speaker (40h), and completed DICT Python Programming Essentials (40h).',
    episodes: [
      {
        code: 'S02 E01',
        title: 'Southwest Ticket and Tours — Ticketing Agent & IT Support',
        runtime: 'Jul 2016 – Dec 2018 · Reservation Systems & IT Support',
        description:
          'Managed passenger booking systems, travel itinerary scheduling, customer support workflows, and office IT workstation maintenance at Southwest Ticket and Tours.',
        tags: ['Southwest Ticket & Tours', 'Ticketing Systems', 'IT Support', 'Customer Operations'],
        palette: { from: '#061a2e', via: '#0284c7', to: '#09090d', accent: '#38bdf8' },
        image: '/cards/ep-s2e1-southwest.webp',
      },
      {
        code: 'S02 E02',
        title: 'Barangay Peacekeeping Action Team (BPAT) — Lamitan City',
        runtime: 'Jun 2018 – Jun 2020 · Peace & Order Officer IV (COS)',
        description:
          'Served the City Government of Lamitan as Barangay Peacekeeping Action Team (BPAT) Peace & Order Officer IV—coordinating community safety, incident response, and barangay field operations.',
        tags: ['City of Lamitan', 'BPAT Officer IV', 'Public Safety', 'Community Service'],
        palette: { from: '#1a1205', via: '#b45309', to: '#09090d', accent: '#fbbf24' },
        image: '/cards/ep-s2e2-bpat.webp',
      },
      {
        code: 'S02 E03',
        title: 'DICT Mindanao Cluster 1 — DigitalJobsPH Outstanding Trainee',
        runtime: 'Oct – Dec 2019 · 240 Hours Technical Training (Lamitan, Basilan)',
        description:
          'Completed 240 hours of intensive technical training under DICT Mindanao Cluster 1 and was honored as Outstanding Trainee Awardee in Social Media Marketing & Advertising.',
        tags: ['DICT Mindanao Cluster 1', 'Outstanding Trainee Awardee', '240 Hours', 'DigitalJobsPH'],
        palette: { from: '#140c2e', via: '#6d28d9', to: '#09090d', accent: '#a855f7' },
        image: '/cards/ep-s2e3-dict-dj.webp',
      },
      {
        code: 'S02 E04',
        title: 'Lamitan Tech4ED Center — Resource Speaker & Trainer',
        runtime: 'Mar 9–13, 2020 · 40 Hours Training for Women & Yakan Weavers',
        description:
          'Awarded Certificate of Appreciation by Mayor Rose U. Furigay for serving as Resource Speaker and Trainer during the 5-day Social Media Management Training for Women and Yakan Weavers.',
        tags: ['City of Lamitan', 'Resource Speaker', 'Tech4ED Center', '40 Hours Citation'],
        palette: { from: '#1f1204', via: '#d97706', to: '#09090d', accent: '#f59e0b' },
        image: '/cards/ep-s2e4-lamitan-speaker.webp',
      },
      {
        code: 'S02 E05',
        title: 'DICT Visayas Cluster 2 — Python Programming Essentials',
        runtime: 'Dec 28, 2020 · 40 Hours Official DICT Certification',
        description:
          'Earned the Certificate of Completion for 40 hours of Python Programming Essentials training issued by the Department of Information and Communications Technology (DICT) Visayas Cluster 2.',
        tags: ['DICT Visayas Cluster 2', 'Python Programming', '40 Hours Certified', 'Backend Foundations'],
        palette: { from: '#051530', via: '#2563eb', to: '#09090d', accent: '#3b82f6' },
        image: '/cards/ep-s2e5-dict-python.webp',
      },
    ],
  },
  {
    number: 3,
    title: 'Legacy Group USA & USC Cebu',
    period: '2019 — 2023',
    synopsis:
      'Led remote social media, video production, and Power BI/Excel automation for Legacy Group Real Estate, USA while serving on-campus as Database Administrator and IT Technical Support at the University of San Carlos (USC) in Cebu City.',
    episodes: [
      {
        code: 'S03 E01',
        title: 'Legacy Group Real Estate, USA — Digital Media & Ops',
        runtime: 'Oct 2019 – May 2022 · US Remote Real Estate Operations',
        description:
          'Managed multi-platform social media campaigns, commercial real estate video editing, content graphics, and automated Excel/Google Sheets & Power BI reporting for US real estate teams.',
        tags: ['Legacy Group USA', 'Real Estate Media', 'Power BI & Excel', 'Virtual Assistant'],
        palette: { from: '#090c1c', via: '#4338ca', to: '#09090d', accent: '#818cf8' },
        image: '/cards/ep-s3e1-legacy.webp',
      },
      {
        code: 'S03 E02',
        title: 'University of San Carlos (USC) — Database Admin & IT Support',
        runtime: 'May 2022 – Jun 2023 · Cebu City Campus (SCIENTIA · VIRTUS · DEVOTIO)',
        description:
          'Administered institutional SQL databases, maintained academic record integrity, and delivered workstation/LAN technical support across departments at the University of San Carlos in Cebu City.',
        tags: ['University of San Carlos', 'Database Administrator', 'SQL & Records', 'IT Technical Support'],
        palette: { from: '#03220f', via: '#15803d', to: '#09090d', accent: '#facc15' },
        image: '/cards/ep-s3e2-usc.webp',
      },
    ],
  },
  {
    number: 4,
    title: 'DSWD Field Office VII & Accenture Inc.',
    period: '2023 — 2026',
    synopsis:
      'Served on the frontline of public welfare as Administrative Assistant II at DSWD Field Office VII (Cebu City) before joining Accenture Inc. as a Multiplatform Front-End React Developer.',
    episodes: [
      {
        code: 'S04 E01',
        title: 'DSWD Field Office VII — Administrative Assistant II (PACD)',
        runtime: 'Aug 2023 – Dec 2024 · DSWD FO VII Cebu City (SG 08-1)',
        description:
          'Managed Public Assistance and Complaints Desk (PACD) databases, coordinated inter-agency medical assistance for cancer and dialysis patients, and completed DSWD Screening, Deduplication & Cross-Matching certification.',
        tags: ['DSWD Field Office VII', 'PACD & AICS', 'Screening & Cross-Matching', 'Gov Service (SG 08-1)'],
        palette: { from: '#061c2e', via: '#0369a1', to: '#09090d', accent: '#38bdf8' },
        image: '/cards/ep-s4e1-dswd.webp',
      },
      {
        code: 'S04 E02',
        title: 'Accenture Inc. — Multiplatform Front-End Development (React)',
        runtime: 'Feb 2025 – Feb 2026 · Accenture Philippines (Cebu IT Park)',
        description:
          'Built scalable mobile and desktop web applications using React.js, Next.js, Redux Toolkit, Tailwind CSS, and Vite—optimizing Lighthouse performance and collaborating in Agile/Scrum sprints.',
        tags: ['Accenture Inc.', 'React.js & Next.js', 'Redux Toolkit', 'Tailwind CSS', 'Vite'],
        palette: { from: '#160626', via: '#7e22ce', to: '#09090d', accent: '#a100ff' },
        image: '/cards/ep-s4e2-accenture.webp',
      },
    ],
  },
  {
    number: 5,
    title: 'Zetica Free Rust Suite & 12 Originals',
    period: '2026 — Present',
    synopsis:
      'Every flagship ZETICUZ Original has its own dedicated episode—ordered newest-first and led by Zetica Creative Suite & Hub (14 native Rust desktop creative & office apps built to be 100% free forever with zero subscriptions for students and editors).',
    episodes: [
      {
        code: 'S05 E01',
        title: 'Zetica Creative Suite & Hub — 14 Free Native Rust Apps',
        runtime: 'Nov 2026 · #1 Active Flagship (zetica.vercel.app)',
        description:
          'Continuously in active development to make 14 professional creative, design, video, motion, audio, PDF & office desktop apps 100% free and accessible for all students and editors who cannot afford paid apps — zero subscriptions forever.',
        tags: ['Pure Rust & WGPU', '14 Native Apps', 'Free for Students & Editors', 'Zero Subscriptions'],
        palette: { from: '#142905', via: '#65a30d', to: '#09090d', accent: '#a3e635' },
        image: '/cards/ach-zetica.webp',
      },
      {
        code: 'S05 E02',
        title: 'Barangay Matatag 3D E-Governance Portal',
        runtime: 'Oct 2026 · GovTech 3D GIS (smart-brgy-portal.vercel.app)',
        description:
          'Interactive 3D satellite GIS digital twin covering all 7 Puroks of Barangay Matatag, Lamitan City with OSRM emergency dispatch routing, QR-verified clearances, and Google Drive cloud sync.',
        tags: ['Leaflet 3D GIS', 'OSRM Dispatch', '7 Puroks', 'QR Clearances'],
        palette: { from: '#042419', via: '#047857', to: '#09090d', accent: '#46e3a8' },
        image: '/cards/ach-brgy.webp',
      },
      {
        code: 'S05 E03',
        title: 'CLIENT QMS — DSWD AICS Smart Queue System',
        runtime: 'Oct 2026 · DSWD Crisis Intervention (client-qms.vercel.app)',
        description:
          '4-step DSWD AICS queue management platform with zero-latency Public TV Broadcast Monitors, 3-tone harmonic chimes, Web Speech TTS voice callouts, and DeepEval KPI telemetry.',
        tags: ['DSWD AICS', 'BroadcastChannel TV', 'Web Speech TTS', 'DeepEval KPI'],
        palette: { from: '#041f17', via: '#059669', to: '#09090d', accent: '#34d399' },
        image: '/cards/ach-qms.webp',
      },
      {
        code: 'S05 E04',
        title: 'CareerForm PH — Official CSC Form 212 PDS Builder',
        runtime: 'Sep 2026 · GovTech SaaS (careerform-ph.vercel.app)',
        description:
          'AI-powered career document studio generating pixel-accurate Philippine Civil Service Commission Form 212 (Revised 2025) Personal Data Sheets and multi-region resumes.',
        tags: ['CSC Form 212', 'pdf-lib Generator', 'E-Signature Pad', '6 Global Regions'],
        palette: { from: '#140929', via: '#7c3aed', to: '#09090d', accent: '#b98bff' },
        image: '/cards/ach-careerform.webp',
      },
      {
        code: 'S05 E05',
        title: 'LifeCoachDoc v2 — Dr. Frances Gaik, PsyD (3D Edition)',
        runtime: 'Sep 2026 · 3D React Three Fiber (lifecoach-v2.vercel.app)',
        description:
          'Bespoke 3D React Three Fiber clinical psychology portal featuring an interactive 3D published book carousel, hypnosis & EMDR pillars, and dynamic theme palettes.',
        tags: ['Three.js / R3F', '3D Book Carousel', 'Clinical Psychology', 'Next.js'],
        palette: { from: '#1c1104', via: '#d97706', to: '#09090d', accent: '#ffb547' },
        image: '/cards/ach-lifecoach-v2.webp',
      },
      {
        code: 'S05 E06',
        title: 'LifeCoachDoc v1 — 13-Palette Dark-Luxury Suite',
        runtime: 'Sep 2026 · 3D Luxury Portal (lifecoachdoc.vercel.app)',
        description:
          'First-edition 3D WebGL clinical practice showcase with a floating 3D hardcover book hero, animated SVG signature splash screen, and 13 real-time luxury color themes.',
        tags: ['13 Theme Engine', '3D Floating Book', 'SVG Splash Intro', 'Playwright Verified'],
        palette: { from: '#042320', via: '#0d9488', to: '#09090d', accent: '#46e3a8' },
        image: '/cards/ach-lifecoach-v1.webp',
      },
      {
        code: 'S05 E07',
        title: 'NEXUS v2 — Next-Gen Streaming & Vertical Cuts Hub',
        runtime: 'Aug 2026 · Streaming Engine v6.4 (nexusph.xyz)',
        description:
          'Dual-backend streaming platform (SPECTRUM + REAPER failover) powered by TMDB-Embed-API decryption across 6+ 4K/1080p sources, vertical Cuts feed, and QR passwordless TV login.',
        tags: ['TMDB-Embed-API', 'SPECTRUM + REAPER', 'Vertical Cuts', 'QR TV Login'],
        palette: { from: '#051329', via: '#0284c7', to: '#09090d', accent: '#38bdf8' },
        image: '/cards/ach-nexus.webp',
      },
      {
        code: 'S05 E08',
        title: 'Dr. Nwanganga Shields — Memoir & Analytics Heatmap',
        runtime: 'Jul 2026 · Literary Press (nwanganga-shields.vercel.app)',
        description:
          'TanStack Start literary memoir archive and Supabase + Recharts visitor geolocation heatmap dashboard for World Bank veteran and author Dr. Nwanganga Shields.',
        tags: ['TanStack Start', 'Supabase Admin', 'Recharts Heatmap', 'Author Archive'],
        palette: { from: '#1c1004', via: '#b45309', to: '#09090d', accent: '#ffb547' },
        image: '/cards/ach-shields.webp',
      },
      {
        code: 'S05 E09',
        title: 'SWS Skeptrons Hub — Chapter Verification & Events',
        runtime: 'May 2026 · Community Platform (sws-skeptrons.vercel.app)',
        description:
          'Official chapter portal for Alpha Kappa Rho SWS Skeptrons featuring member verification, live anniversary countdown, leadership roster, and built-in chapter music player.',
        tags: ['Member Verification', 'Live Countdown', 'MongoDB + Express', 'Audio Player'],
        palette: { from: '#1f0606', via: '#dc2626', to: '#09090d', accent: '#ff3d5a' },
        image: '/cards/ach-sws.webp',
      },
      {
        code: 'S05 E10',
        title: 'Dekaron Stampede — 14-Class MMORPG Portal',
        runtime: 'Mar 2026 · Gaming Hub (dekaron-stampede.vercel.app)',
        description:
          'High-octane dark-fantasy MMORPG portal featuring an interactive 14-class character combat showcase, live server status indicators, and streamlined client onboarding.',
        tags: ['14 Character Classes', '60fps Dark-Fantasy VFX', 'Server Status', 'Gaming UI'],
        palette: { from: '#120624', via: '#7c3aed', to: '#09090d', accent: '#b98bff' },
        image: '/cards/ach-dekaron.webp',
      },
      {
        code: 'S05 E11',
        title: 'ZETFLIX TV — Ten-Foot Smart TV Cinema UI',
        runtime: 'Feb 2026 · Smart TV UI (zetflix-tv.vercel.app)',
        description:
          'Ten-foot Smart TV and desktop cinema interface with spatial rail navigation, instant trailer modals, cast exploration, and Supabase cloud watchlists.',
        tags: ['Ten-Foot TV UI', 'Supabase Watchlist', 'TMDB Live API', 'Spatial Rails'],
        palette: { from: '#1f0508', via: '#dc2626', to: '#09090d', accent: '#ff3d5a' },
        image: '/cards/ach-zetflix.webp',
      },
      {
        code: 'S05 E12',
        title: 'NEXUS Streaming (v1) — Movies, Anime & Manga PWA',
        runtime: 'Jan 2026 · All-in-One PWA (zeticuz.online)',
        description:
          'Foundational installable Progressive Web App uniting HD Movies, TV Series, Anime episodes, and Manga chapter readers in a single adaptive glassmorphic theater.',
        tags: ['4-in-1 Streaming PWA', 'HLS.js Player', 'Anime & Manga', 'Offline Shell'],
        palette: { from: '#2b0710', via: '#e11d48', to: '#09090d', accent: '#ff3d5a' },
        image: '/cards/ach-nexus-v1.webp',
      },
    ],
  },
];

const rawProjects: Project[] = [
  {
    id: 'zetica-suite',
    title: 'Zetica Creative Suite & Hub',
    year: 'Nov 2026',
    createdAt: '2026-11-01T05:14:35Z',
    genre: 'Flagship Desktop & Web Ecosystem · 14 Pure Rust Apps · 100% Free Forever',
    logline:
      'My biggest ongoing flagship project—continuously in active development to make professional creative, design, video, motion, audio, PDF, and office desktop apps accessible for all students and editors who cannot afford paid apps. Built in pure Rust to be 100% free for all without any subscription.',
    demo: 'https://zetica.vercel.app/',
    github: 'https://github.com/ZETIC7Z/craft-launcher',
    palette: { from: '#142905', via: '#65a30d', to: '#07090e', accent: '#a3e635' },
    portraitImage: '/projects/zetica-suite-portrait.webp',
    landscapeImage: '/projects/zetica-suite-landscape.webp',
    trailer: '/trailers/zetica-suite.mp4',
    metrics: [
      { value: '14 Apps', label: 'Native Rust Desktop Creative & Office Suite' },
      { value: '$0 / Free', label: 'Zero Subscriptions for Students & Editors' },
      { value: 'WGPU + DX12', label: 'GPU-Accelerated Native Windows/Mac/Linux' },
      { value: 'Active Dev', label: 'Continuous Upstream & Feature Releases' },
    ],
    build: [
      'Engineered and packaged the 14-app native Rust desktop ecosystem (Zetica Hub v0.10.4, Zetica Design/DesignCraft, Zetica Photo/PhotoCraft, Zetica Vector/VectorCraft, Zetica Film/FilmCraft, Zetica Motion/EffectCraft, Zetica Light/LightCraft, Zetica PDF/PDFCraft, Zetica Sound/SoundCraft, Zetica Word/WordCraft, Zetica Deck/DeckCraft, Zetica Fig/FigCraft, Zetica CAD/CADCraft, and Zetica Grid/GridCraft) with WiX v5 Windows MSI installers (zetica-hub-windows-x64.msi).',
      'Built the interactive 3D WebGL Galaxy & Scroll Ruler showcase portal (zetica.vercel.app & zetica.vercel.app/apps.html) featuring 6 extruded spiral arms, 32 floating 3D shader cards, Lenis 60fps scrolling, and instant Light/Dark theme inversion.',
      'Dedicated to continuous improvement so students, independent creators, and editors worldwide have free, open-source, subscription-free access to studio-grade creative and productivity software.',
    ],
    stack: ['Rust', 'egui & WGPU', 'DirectX 12 / OpenGL', 'Three.js / WebGL Shaders', 'Lenis 60fps', 'WiX v5 MSI', 'GitHub Actions', 'Vercel'],
    features: [
      '14 native Rust desktop apps: Design, Photo, Vector, Film, Motion, Light, PDF, Sound, Word, Deck, Fig, CAD, Grid & Hub',
      '100% free forever with zero subscriptions — built for students and editors who cannot afford paid apps',
      'Zetica Studio generative AI workspace for images, video, 3D compositing & character posing',
      'One-click Zetica Hub Windows MSI installer (zetica-hub-windows-x64.msi) with automatic suite updates',
    ],
  },
  {
    id: 'smart-brgy-portal',
    title: 'Barangay Matatag 3D Portal',
    year: 'Oct 2026',
    createdAt: '2026-10-28T18:33:20Z',
    genre: 'GovTech · 3D Satellite GIS · Smart Barangay E-Governance',
    logline:
      'Next-generation 3D Smart Barangay E-Governance & Digital Twin Portal for Barangay Matatag, Lamitan City, Basilan (BARMM 7302)—combining an interactive 3D satellite GIS map of all 7 Puroks, OSRM emergency routing, online clearance tracking, and e-Blotter management.',
    demo: 'https://smart-brgy-portal.vercel.app',
    github: 'https://github.com/ZETIC7Z/Barangay-Online-E-Governance-Portal',
    palette: { from: '#052e16', via: '#16a34a', to: '#07090e', accent: '#4ade80' },
    portraitImage: '/projects/smart-brgy-portal-portrait.webp',
    landscapeImage: '/projects/smart-brgy-portal-landscape.webp',
    trailer: '/trailers/smart-brgy-portal.mp4',
    metrics: [
      { value: '7 Puroks', label: 'Interactive 3D Satellite GIS Map' },
      { value: 'OSRM', label: 'Turn-by-Turn Emergency Routing' },
      { value: '4 Portals', label: 'Resident · BHW · Tanod · Captain' },
      { value: 'QR + Drive', label: 'Verified Clearances & Cloud Vault' },
    ],
    build: [
      'Engineered an interactive 3D satellite GIS map of Barangay Matatag (Lamitan City, Basilan) using Leaflet, Esri World Imagery tiles, custom 3D building/household markers, and OSRM real-time emergency responder routing.',
      'Built the end-to-end online document request & verification pipeline (Barangay Clearance, Certificate of Indigency, Residency, Business Permit) with unique tracking codes, QR verification, and printable official layouts.',
      'Integrated automated Google Drive Cloud Vault archiving and role-based command portals for Punong Barangay Hon. Hulma G. Abdurahman, Barangay Secretary, Tanod Peacekeepers, and Barangay Health Workers (BHW).',
    ],
    stack: ['React 18', 'Vite', 'Tailwind CSS', 'Leaflet 3D GIS', 'OSRM Routing', 'Framer Motion', 'Google Drive API', 'Vercel'],
    features: [
      'Interactive 3D Satellite GIS Map across all 7 Puroks with household registry pins',
      'OSRM Emergency SOS dispatch routing & digital e-Blotter case management',
      'Online Barangay Clearance & Indigency requests with live tracking & QR verification',
      'Automated Google Drive Cloud Vault backup & multi-role official dashboards',
    ],
  },
  {
    id: 'client-qms',
    title: 'CLIENT QMS — DSWD AICS',
    year: 'Oct 2026',
    createdAt: '2026-10-21T09:20:47Z',
    genre: 'GovTech · 4-Step Crisis Queue · Public TV Broadcast',
    logline:
      'Broadcast-grade, real-time Smart Queue Management System engineered for the DSWD Assistance to Individuals in Crisis Situations (AICS) program—featuring a 4-step workflow, DeepEval analytics dashboard, and zero-scroll Public TV Monitors.',
    demo: 'https://github.com/ZETIC7Z/CLIENT-QMS',
    github: 'https://github.com/ZETIC7Z/CLIENT-QMS',
    palette: { from: '#041f17', via: '#059669', to: '#07090e', accent: '#34d399' },
    portraitImage: '/projects/client-qms-portrait.webp',
    landscapeImage: '/projects/client-qms-landscape.webp',
    trailer: '/trailers/client-qms.mp4',
    metrics: [
      { value: '4 Steps', label: 'PACD · Validator · SWO · Cashier' },
      { value: '3 TV Screens', label: 'Zero-Scroll 1080p/4K Public Monitors' },
      { value: '800ms', label: 'BroadcastChannel + Disk Atomic Sync' },
      { value: '100%', label: 'Brownout-Proof State Recovery' },
    ],
    build: [
      'Architected the complete 4-Step DSWD AICS service pipeline: Step 1 PACD Intake & QR/Thermal Ticket Generation → Step 2 Document Validator with Compliance Hold & Re-Queue → Step 3 Social Worker (SWO) Assessment → Step 4 Cashier Payout Release.',
      'Designed the Confident AI / DeepEval-inspired Command Dashboard with live KPI telemetry, completion velocity charts, step distribution bars, and a Monthly Service Calendar tracking daily served vs. compliance-held clients.',
      'Built dedicated zero-scroll Public TV Broadcast Monitors (/step2display, /step3display, /step4display) with 3D perspective ticket-flip animations, Web Audio API 3-tone harmonic airport chimes, and Web Speech API voice announcements.',
    ],
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'BroadcastChannel API', 'Web Audio API', 'Web Speech TTS', 'Node.js'],
    features: [
      '4-Step Operator Terminals with Call Next, Recall, Compliance Hold & Complete',
      'Zero-scroll Public TV Broadcast Monitors with 3D flip & TTS voice announcer',
      'Confident AI / DeepEval real-time analytics dashboard & Monthly Service Calendar',
      'Admin Studio for live counter configuration, video playlist & brownout-proof disk persistence',
    ],
  },
  {
    id: 'careerform-ph',
    title: 'CareerForm PH',
    year: 'Sep 2026',
    createdAt: '2026-09-14T20:07:53Z',
    genre: 'GovTech & Career SaaS · CSC Form 212 (PDS) Builder',
    logline:
      'Intelligent Philippine & global career platform featuring an official Civil Service Commission Personal Data Sheet (CS Form 212) generator, 6-region international resume builder, AI passport photo studio, and digital e-signature pad.',
    demo: 'https://careerform-ph.vercel.app/',
    github: 'https://github.com/ZETIC7Z/CareerForm',
    palette: { from: '#140929', via: '#7c3aed', to: '#07090e', accent: '#b98bff' },
    portraitImage: '/projects/careerform-ph-portrait.webp',
    landscapeImage: '/projects/careerform-ph-landscape.webp',
    trailer: '/trailers/careerform-ph.mp4',
    metrics: [
      { value: 'CS Form 212', label: 'Official CSC PDS PDF Export' },
      { value: '6 Regions', label: 'PH · US · UK · AU · ME · Asia Formats' },
      { value: 'AI Studio', label: 'Passport Photo & E-Signature Tool' },
      { value: '100% Free', label: 'Zero-Paywall Print-Ready PDF' },
    ],
    build: [
      'Engineered a pixel-accurate Civil Service Commission (CSC) Form 212 Personal Data Sheet generator using pdf-lib alongside 6 international resume region standards.',
      'Built an in-browser AI Passport ID Photo Studio and interactive HTML5 Canvas e-signature pad for end-to-end document completion.',
      'Integrated a live Philippine government & private sector job board with side-by-side real-time PDF preview.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'pdf-lib', 'Three.js', 'MongoDB', 'Vercel'],
    features: [
      'Official CSC Form 212 (PDS) & Work Experience Sheet PDF generator',
      'Multi-region resume builder (PH, US/CA, UK/EU, AU/NZ, Middle East, Asia)',
      'Built-in AI Passport Photo Studio & digital e-signature pad',
      'Integrated Philippine government job board & ATS keyword optimizer',
    ],
  },
  {
    id: 'lifecoach-v2',
    title: 'LifeCoachDoc v2',
    year: 'Sep 2026',
    createdAt: '2026-09-13T21:49:20Z',
    genre: 'Client Flagship · 3D React Three Fiber · Clinical Psychology',
    logline:
      'Next-generation clinical psychology & executive coaching platform for Dr. Frances Gaik, PsyD—featuring 3D React Three Fiber book showcases, interactive carousels, and Radix UI primitives.',
    demo: 'https://lifecoachdoc2.vercel.app/',
    github: 'https://github.com/ZETIC7Z/LIFECOACH-BOOK-AUTHOR-WEBSITE-V.2',
    palette: { from: '#1c1104', via: '#d97706', to: '#07090e', accent: '#ffb547' },
    portraitImage: '/projects/lifecoach-v2-portrait.webp',
    landscapeImage: '/projects/lifecoach-v2-landscape.webp',
    trailer: '/trailers/lifecoach-v2.mp4',
    metrics: [
      { value: '3D R3F', label: 'Interactive 3D Book Showcase' },
      { value: '98 Score', label: 'Lighthouse Performance & A11y' },
      { value: 'Client Live', label: 'Production US Client Deployment' },
      { value: 'Radix UI', label: 'Accessible Component Primitives' },
    ],
    build: [
      'Engineered interactive 3D book models and spatial lighting using React Three Fiber and Three.js for Dr. Frances Gaik’s published works.',
      'Crafted an editorial luxury interface with Framer Motion choreography, Radix UI accessible primitives, and consultation booking funnels.',
      'Optimized Core Web Vitals and integrated Vercel Analytics for production traffic monitoring.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Three.js / R3F', 'Tailwind CSS', 'Radix UI', 'Framer Motion', 'Vercel'],
    features: [
      'Interactive 3D React Three Fiber book gallery',
      'Executive & clinical coaching tier comparison',
      'Accessible Radix UI dialogs and smooth scroll transitions',
      'Direct consultation scheduling and resource library',
    ],
  },
  {
    id: 'lifecoach-v1',
    title: 'LifeCoachDoc v1',
    year: 'Sep 2026',
    createdAt: '2026-09-12T10:12:20Z',
    genre: 'Client Flagship · Dark-Luxury 3D · 13-Palette Engine',
    logline:
      'Ultra-modern dark-luxury portfolio for Dr. Frances Gaik, PsyD—featuring a 3D floating book hero, ambient video backgrounds, animated signature splash intro, and a 13-palette theme engine.',
    demo: 'https://lifecoachdoc.vercel.app/',
    github: 'https://github.com/ZETIC7Z/LIFECOACH-BOOK-AUTHOR-WEBSITE-V.1',
    palette: { from: '#042320', via: '#0d9488', to: '#07090e', accent: '#46e3a8' },
    portraitImage: '/projects/lifecoach-v1-portrait.webp',
    landscapeImage: '/projects/lifecoach-v1-landscape.webp',
    trailer: '/trailers/lifecoach-v1.mp4',
    metrics: [
      { value: '13 Themes', label: 'Live Dark-Luxury Palette Switcher' },
      { value: '3D Hero', label: 'Floating 3D Book & Video Backdrop' },
      { value: 'SVG Intro', label: 'Animated Signature Splash Screen' },
      { value: 'Playwright', label: 'End-to-End Browser Verified' },
    ],
    build: [
      'Built an animated SVG signature splash screen that transitions into a 3D floating book hero and ambient video background.',
      'Created a 13-palette dark-luxury theme engine allowing visitors to customize the site’s mood in real time.',
      'Verified responsive layout and interactive flows with Playwright end-to-end tests.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Three.js', 'Framer Motion', 'Tailwind CSS', 'Playwright'],
    features: [
      '3D floating book hero for Managing Depression with Qigong',
      '13-palette real-time luxury theme switcher',
      'Animated SVG signature intro sequence',
      'Holistic psychology & Qigong practice showcase',
    ],
  },
  {
    id: 'nexus-v2',
    title: 'NEXUS v2',
    year: 'Aug 2026',
    createdAt: '2026-08-28T00:49:07Z',
    genre: 'Flagship Streaming · Vertical Cuts · Dual-Backend Core',
    logline:
      'Next-generation v6.4 streaming & short-form vertical Cuts platform (nexusph.xyz) powered by TMDB-Embed-API decryption, QR passwordless multi-device login, and SPECTRUM + REAPER dual-backend failover.',
    demo: 'https://www.nexusph.xyz/',
    github: 'https://github.com/ZETIC7Z/NEXUS-V2-SITE',
    palette: { from: '#051329', via: '#0284c7', to: '#07090e', accent: '#38bdf8' },
    portraitImage: '/projects/nexus-v2-portrait.webp',
    landscapeImage: '/projects/nexus-v2-landscape.webp',
    trailer: '/trailers/nexus-v2.mp4',
    metrics: [
      { value: 'v6.4', label: 'TMDB-Embed-API Decryption Core' },
      { value: '6+ Sources', label: 'FebBox 4K · VidLink · LookMovies · AniKai' },
      { value: '2 Backends', label: 'SPECTRUM + REAPER Auto-Failover' },
      { value: 'QR + Cuts', label: 'Passwordless TV Login & Vertical Feed' },
    ],
    build: [
      'Engineered the TMDB-Embed-API stream extraction & decryption integration probing FebBox 4K, VidLink, LookMovies, ZeticuzApi, AniKai, and AniKoto for direct HLS/MP4 playback without ad popups.',
      'Built the SPECTRUM (Primary) + REAPER (Mirror) dual-backend failover architecture with an interactive SVG Trust Verification Pyramid displaying live node latency and sync status.',
      'Created the "Cuts" TikTok/Reels-style vertical short-form trailer feed and QR-code cross-device session claiming (QRLoginClaimPage) for instant mobile-to-TV sign-in.',
    ],
    stack: ['React 18', 'TypeScript', 'TMDB-Embed-API', 'HLS.js', 'Tailwind CSS', 'Framer Motion', 'Supabase', 'Node.js', 'Vercel'],
    features: [
      'Probed multi-source HLS/MP4 player with 4K HDR stream selection',
      'Cuts vertical swipeable trailer feed with one-tap Watch Full Movie',
      'SPECTRUM + REAPER dual-backend health telemetry & Trust Pyramid SVG',
      'QR code passwordless multi-device login & cloud watchlist sync',
    ],
  },
  {
    id: 'nwanganga-shields',
    title: 'Dr. Nwanganga Shields Memoir',
    year: 'Jul 2026',
    createdAt: '2026-07-12T13:27:32Z',
    genre: 'Client Flagship · Author Archive · Analytics Heatmap',
    logline:
      'Animated literary portfolio and digital archive for Dr. Nwanganga Shields—featuring an interactive book library, global visitor analytics heatmap, and Supabase admin dashboard.',
    demo: 'https://nwanganga-shields.vercel.app',
    github: 'https://github.com/ZETIC7Z/autobiography-BOOK-AUTHOR-WEBSITE-',
    palette: { from: '#1c1004', via: '#b45309', to: '#07090e', accent: '#ffb547' },
    portraitImage: '/projects/nwanganga-shields-portrait.webp',
    landscapeImage: '/projects/nwanganga-shields-landscape.webp',
    trailer: '/trailers/nwanganga-shields.mp4',
    metrics: [
      { value: 'TanStack', label: 'Modern Full-Stack React Architecture' },
      { value: 'Supabase', label: 'Real-Time DB & Admin Dashboard' },
      { value: 'Recharts', label: 'Visitor Geolocation & Heatmap' },
      { value: 'Archival UI', label: 'Museum-Grade Chapter Timeline' },
    ],
    build: [
      'Built an archival literary showcase using TanStack Start, React, and TypeScript with chapter-by-chapter memoir previews.',
      'Engineered a custom Supabase backend and Recharts admin dashboard tracking reader engagement and visitor geolocation heatmaps.',
      'Designed smooth editorial scroll choreography and interactive book inspection modals.',
    ],
    stack: ['TanStack Start', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Framer Motion', 'Recharts'],
    features: [
      'Interactive 3D-styled book library and chapter excerpts',
      'Live visitor analytics heatmap and Recharts admin studio',
      'Archival photo timeline spanning medical & humanitarian milestones',
      'Direct book acquisition and press inquiry workflows',
    ],
  },
  {
    id: 'sws-skeptrons',
    title: 'SWS Skeptrons Hub',
    year: 'May 2026',
    createdAt: '2026-05-29T17:43:02Z',
    genre: 'Community Platform · Member Verification & Events',
    logline:
      'Official community portal for the Social Welfare Skeptrons chapter (Alpha Kappa Rho Region VII)—featuring member verification, live anniversary countdown, chapter roster, music playlist, and outreach event galleries.',
    demo: 'https://sws-skeptrons.vercel.app',
    github: 'https://github.com/ZETIC7Z/sws-website',
    palette: { from: '#1f0606', via: '#dc2626', to: '#07090e', accent: '#ff3d5a' },
    portraitImage: '/projects/sws-skeptrons-portrait.webp',
    landscapeImage: '/projects/sws-skeptrons-landscape.webp',
    trailer: '/trailers/sws-skeptrons.mp4',
    metrics: [
      { value: 'Verified', label: 'Digital Member ID & Roster Lookup' },
      { value: 'Live Timer', label: 'Anniversary Countdown Engine' },
      { value: 'Full-Stack', label: 'React + Express + MongoDB' },
      { value: '100% Mobile', label: 'Responsive Chapter Directory' },
    ],
    build: [
      'Developed the chapter member verification directory and leadership roster using React, TypeScript, Express.js, and MongoDB.',
      'Built an interactive anniversary countdown timer, chapter music playlist, historical timeline, and community outreach photo gallery.',
      'Styled with Tailwind CSS, shadcn/ui components, and Framer Motion transitions.',
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'MongoDB', 'Express.js', 'shadcn/ui'],
    features: [
      'Instant member verification and chapter roster lookup',
      'Live anniversary countdown and milestone archive',
      'Community service and humanitarian outreach gallery',
      'Built-in SWS chapter music playlist and mobile navigation',
    ],
  },
  {
    id: 'dekaron-stampede',
    title: 'Dekaron Stampede',
    year: 'Mar 2026',
    createdAt: '2026-03-14T20:21:44Z',
    genre: 'MMORPG Gaming Portal · 14-Class Interactive Gallery',
    logline:
      'Dark-fantasy MMORPG gaming portal for the Dekaron Stampede community—featuring an interactive 14-class character gallery, cinematic particle effects, and player onboarding.',
    demo: 'https://dekaron-stampede.vercel.app',
    github: 'https://github.com/ZETIC7Z/dekaron-stampede',
    palette: { from: '#120624', via: '#7c3aed', to: '#07090e', accent: '#b98bff' },
    portraitImage: '/projects/dekaron-stampede-portrait.webp',
    landscapeImage: '/projects/dekaron-stampede-landscape.webp',
    trailer: '/trailers/dekaron-stampede.mp4',
    metrics: [
      { value: '14 Classes', label: 'Interactive Character Lore & Stats' },
      { value: '60fps VFX', label: 'Cinematic Dark-Fantasy Motion' },
      { value: '3-Step', label: 'Frictionless Client Download Funnel' },
      { value: 'Live Hub', label: 'Server Status & Patch Notes' },
    ],
    build: [
      'Created an interactive 14-class character showcase with custom weapon lore, stat breakdowns, and animated transitions.',
      'Designed a dark-fantasy gaming interface with atmospheric particle effects and a streamlined 3-step game client installer guide.',
      'Optimized image assets and animations for zero-lag browsing across desktop and mobile.',
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite', 'Lucide React', 'Vercel'],
    features: [
      '14-class interactive character gallery with lore & combat roles',
      'Live server status indicators and patch notes feed',
      'Streamlined 3-step client download & registration guide',
      'Cinematic dark-fantasy visual effects and audio-visual polish',
    ],
  },
  {
    id: 'zetflix-tv',
    title: 'ZETFLIX TV',
    year: 'Feb 2026',
    createdAt: '2026-02-26T01:03:13Z',
    genre: 'Smart TV Streaming UI · Spatial Rail Navigation',
    logline:
      'High-contrast entertainment hub for discovering movies, TV shows, and cast profiles with personalized watchlists, instant trailer modals, and ten-foot TV navigation.',
    demo: 'https://zetflix-tv.vercel.app',
    github: 'https://github.com/ZETIC7Z/ZETFLIX-OFFICIAL',
    palette: { from: '#1f0508', via: '#dc2626', to: '#07090e', accent: '#ff3d5a' },
    portraitImage: '/projects/zetflix-tv-portrait.webp',
    landscapeImage: '/projects/zetflix-tv-landscape.webp',
    trailer: '/trailers/zetflix-tv.mp4',
    metrics: [
      { value: '10-Foot UI', label: 'Smart TV & Desktop Cinema Layout' },
      { value: 'Supabase', label: 'Cloud Auth & Watchlist Sync' },
      { value: 'TMDB Live', label: 'Real-Time Trending & Cast Data' },
      { value: '<100ms', label: 'Instant Category Rail Switching' },
    ],
    build: [
      'Built a ten-foot Netflix TV interface using React, Redux, and Material-UI / Tailwind with GPU-accelerated horizontal rails.',
      'Integrated Supabase authentication and cloud database storage for personalized user watchlists and favorites.',
      'Connected live TMDB API endpoints for trending titles, cast filmographies, and instant trailer playback.',
    ],
    stack: ['React', 'Node.js', 'Supabase', 'MongoDB', 'Redux', 'Material-UI', 'TMDB API', 'Vercel'],
    features: [
      'Personalized user dashboard and cloud-synced watchlists',
      'Instant movie & series trailer modal playback',
      'Deep cast & crew profile exploration',
      'Responsive cinema layout from mobile to 4K displays',
    ],
  },
  {
    id: 'nexus-streaming',
    title: 'NEXUS Streaming (v1)',
    year: 'Jan 2026',
    createdAt: '2026-01-30T06:26:42Z',
    genre: 'All-in-One Cinema, Anime, Manga & Live TV PWA',
    logline:
      'Unified entertainment PWA (zeticuz.online) bringing HD movies, TV series, anime, manga chapters, and live TV channels into a single adaptive glassmorphic theater.',
    demo: 'https://www.zeticuz.online',
    github: 'https://github.com/ZETIC7Z/NEXUS',
    palette: { from: '#2b0710', via: '#e11d48', to: '#07090e', accent: '#ff3d5a' },
    portraitImage: '/projects/nexus-streaming-portrait.webp',
    landscapeImage: '/projects/nexus-streaming-landscape.webp',
    trailer: '/trailers/nexus-streaming.mp4',
    metrics: [
      { value: '4-in-1', label: 'Movies · Series · Anime · Manga' },
      { value: 'HLS PWA', label: 'Installable Offline-Ready Shell' },
      { value: 'Multi-Server', label: 'Instant Stream Source Switching' },
      { value: '60fps', label: 'Adaptive Cinema UI' },
    ],
    build: [
      'Architected a unified media catalog integrating TMDB metadata, anime episode feeds, and built-in manga chapter readers.',
      'Implemented adaptive HLS.js video playback with automatic server fallback and local watch-history persistence.',
      'Designed a responsive Netflix-grade glassmorphic UI with installable PWA manifest and service worker caching.',
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'HLS.js', 'TMDB API', 'PWA', 'Vite'],
    features: [
      'Unified Movies, TV Shows, Anime & Manga discovery in one app',
      'Multi-source HLS player with resume-watching memory',
      'Installable Progressive Web App for desktop and mobile',
      'Dynamic hero spotlight and instant search filtering',
    ],
  },
];

// Always sorted by GitHub creation date descending (most recent project first all the time)
export const projects: Project[] = [...rawProjects].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
);

// Top Picks arranged by most recent creation date descending (Zetica Suite #1)
export const topPicks: TopPick[] = [
  {
    title: 'Zetica Suite',
    label: '#1 · Nov 2026 · Free Rust Suite',
    detail: '14 Native Apps · Free Forever for Students & Editors',
    palette: { from: '#1a0b2e', via: '#a855f7', to: '#07090e', accent: '#c084fc' },
    portraitImage: '/projects/zetica-suite-portrait.webp',
    projectId: 'zetica-suite',
  },
  {
    title: 'Brgy Matatag 3D',
    label: '#2 · Oct 2026 · GovTech 3D',
    detail: '7 Puroks 3D GIS · OSRM · QR Clearances',
    palette: { from: '#052e16', via: '#16a34a', to: '#07090e', accent: '#4ade80' },
    portraitImage: '/projects/smart-brgy-portal-portrait.webp',
    projectId: 'smart-brgy-portal',
  },
  {
    title: 'CLIENT QMS',
    label: '#3 · Oct 2026 · DSWD AICS',
    detail: '4-Step Queue · DeepEval · Public TV Monitors',
    palette: { from: '#041f17', via: '#059669', to: '#07090e', accent: '#34d399' },
    portraitImage: '/projects/client-qms-portrait.webp',
    projectId: 'client-qms',
  },
  {
    title: 'CareerForm PH',
    label: '#4 · Sep 2026 · GovTech SaaS',
    detail: 'CSC Form 212 PDS · 6 Global Regions',
    palette: { from: '#140929', via: '#7c3aed', to: '#07090e', accent: '#b98bff' },
    portraitImage: '/projects/careerform-ph-portrait.webp',
    projectId: 'careerform-ph',
  },
  {
    title: 'LifeCoach v2',
    label: '#5 · Sep 2026 · 3D Client',
    detail: '3D Book Carousel · Clinical Psychology',
    palette: { from: '#1c1104', via: '#d97706', to: '#07090e', accent: '#ffb547' },
    portraitImage: '/projects/lifecoach-v2-portrait.webp',
    projectId: 'lifecoach-v2',
  },
  {
    title: 'LifeCoach v1',
    label: '#6 · Sep 2026 · 3D Luxury',
    detail: '3D Floating Book · 13-Palette Switcher',
    palette: { from: '#042320', via: '#0d9488', to: '#07090e', accent: '#46e3a8' },
    portraitImage: '/projects/lifecoach-v1-portrait.webp',
    projectId: 'lifecoach-v1',
  },
  {
    title: 'NEXUS v2',
    label: '#7 · Aug 2026 · Streaming v6.4',
    detail: 'TMDB-Embed-API · Cuts Feed · Dual Backend',
    palette: { from: '#051329', via: '#0284c7', to: '#07090e', accent: '#38bdf8' },
    portraitImage: '/projects/nexus-v2-portrait.webp',
    projectId: 'nexus-v2',
  },
  {
    title: 'Dr. Shields',
    label: '#8 · Jul 2026 · Client Memoir',
    detail: 'TanStack Start · Visitor Heatmap Admin',
    palette: { from: '#1c1004', via: '#b45309', to: '#07090e', accent: '#ffb547' },
    portraitImage: '/projects/nwanganga-shields-portrait.webp',
    projectId: 'nwanganga-shields',
  },
  {
    title: 'SWS Skeptrons',
    label: '#9 · May 2026 · Community Hub',
    detail: 'Member Verification · Countdown · Playlist',
    palette: { from: '#1f0606', via: '#dc2626', to: '#07090e', accent: '#ff3d5a' },
    portraitImage: '/projects/sws-skeptrons-portrait.webp',
    projectId: 'sws-skeptrons',
  },
  {
    title: 'Dekaron MMORPG',
    label: '#10 · Mar 2026 · Game Portal',
    detail: '14-Class Showcase · Dark-Fantasy VFX',
    palette: { from: '#120624', via: '#7c3aed', to: '#07090e', accent: '#b98bff' },
    portraitImage: '/projects/dekaron-stampede-portrait.webp',
    projectId: 'dekaron-stampede',
  },
  {
    title: 'ZETFLIX TV',
    label: '#11 · Feb 2026 · Smart TV UI',
    detail: 'Ten-Foot Cinema UI · Cloud Watchlist',
    palette: { from: '#1f0508', via: '#dc2626', to: '#07090e', accent: '#ff3d5a' },
    portraitImage: '/projects/zetflix-tv-portrait.webp',
    projectId: 'zetflix-tv',
  },
  {
    title: 'NEXUS Stream v1',
    label: '#12 · Jan 2026 · Streaming PWA',
    detail: 'Movies · TV · Anime · Manga · HLS',
    palette: { from: '#071429', via: '#2563eb', to: '#07090e', accent: '#4cb3ff' },
    portraitImage: '/projects/nexus-streaming-portrait.webp',
    projectId: 'nexus-streaming',
  },
];

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend & 3D WebGL',
    subtitle: 'Cinema-grade UI, spatial 3D & motion systems',
    skills: [
      { name: 'React 18 / 19', mono: 'RC', tag: 'Core' },
      { name: 'Next.js 15 / 16', mono: 'NX', tag: 'App Router' },
      { name: 'TypeScript', mono: 'TS', tag: 'Strict' },
      { name: 'Tailwind CSS v4', mono: 'TW', tag: 'Design Tokens' },
      { name: 'Three.js & R3F', mono: '3D', tag: '3D WebGL' },
      { name: 'Framer Motion', mono: 'FM', tag: 'Choreography' },
      { name: 'GSAP & Lenis', mono: 'GS', tag: 'Scroll 60fps' },
      { name: 'TanStack Start', mono: 'TN', tag: 'Full-Stack' },
      { name: 'Radix UI & shadcn', mono: 'RX', tag: 'Primitives' },
      { name: 'Redux & Zustand', mono: 'ZS', tag: 'State' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend, Streaming & APIs',
    subtitle: 'Rust/WGPU native engines, multi-source decryption & real-time sync',
    skills: [
      { name: 'Rust & WebGPU (wgpu)', mono: 'RS', tag: '14 Native Apps' },
      { name: 'Node.js & Express', mono: 'ND', tag: 'Runtime' },
      { name: 'Python & FastAPI', mono: 'PY', tag: 'DICT Certified' },
      { name: 'TMDB-Embed-API', mono: 'TM', tag: 'Stream Engine' },
      { name: 'HLS.js & Web Audio', mono: 'HL', tag: 'Media Core' },
      { name: 'BroadcastChannel', mono: 'BC', tag: 'Multi-Screen TV' },
      { name: 'Web Speech TTS', mono: 'VO', tag: 'Voice Callout' },
      { name: 'Google Drive API', mono: 'GD', tag: 'Cloud Vault' },
      { name: 'REST & WebSockets', mono: 'WS', tag: 'Real-Time' },
      { name: 'pdf-lib & Canvas', mono: 'PD', tag: 'Document Gen' },
    ],
  },
  {
    id: 'databases',
    title: 'Databases & Cloud Auth',
    subtitle: 'USC DBA experience & brownout-proof persistence',
    skills: [
      { name: 'Supabase', mono: 'SB', tag: 'Postgres + Auth' },
      { name: 'PostgreSQL', mono: 'PG', tag: 'Relational' },
      { name: 'MongoDB', mono: 'MG', tag: 'Document Store' },
      { name: 'Firebase', mono: 'FB', tag: 'Realtime' },
      { name: 'MySQL & SQLite', mono: 'SQ', tag: 'USC DBA' },
      { name: 'Atomic JSON Sync', mono: 'JS', tag: 'Zero Data Loss' },
      { name: 'QR Session Auth', mono: 'QR', tag: 'Multi-Device' },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Agentic Engineering',
    subtitle: 'REA reverse engineering, MCP orchestration & DeepEval telemetry',
    skills: [
      { name: 'REA Reverse Engineering', mono: 'RE', tag: 'Binary & Protocol' },
      { name: 'Claude Code & Antigravity', mono: 'CC', tag: 'Superpowers IDE' },
      { name: 'Chrome DevTools & Playwright MCP', mono: 'MC', tag: 'Browser Automation' },
      { name: 'Firecrawl & Context7 MCP', mono: 'FC', tag: 'Web & Docs Ingestion' },
      { name: 'OpenAI & Gemini APIs', mono: 'AI', tag: 'LLM & Vision Core' },
      { name: 'DeepEval & Confident AI', mono: 'DE', tag: 'KPI Telemetry' },
      { name: 'Shadcn & Frontend UI Skill', mono: 'UI', tag: 'Design-First UI' },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps, GIS & Quality',
    subtitle: 'Edge deployment, WiX v5 MSI installers, satellite GIS & E2E QA',
    skills: [
      { name: 'Vercel Edge', mono: 'VC', tag: 'Production' },
      { name: 'WiX v5 & Native MSI', mono: 'WX', tag: 'Desktop Installer' },
      { name: 'Docker', mono: 'DK', tag: 'Containers' },
      { name: 'Git & GitHub Actions', mono: 'GH', tag: 'CI/CD' },
      { name: 'Leaflet 3D & OSRM', mono: 'GI', tag: 'Satellite GIS' },
      { name: 'Vite & Turbopack', mono: 'VT', tag: 'Bundlers' },
    ],
  },
  {
    id: 'govtech',
    title: 'GovTech & Enterprise Ops',
    subtitle: 'Public sector systems, CSC standards & enterprise QA',
    skills: [
      { name: 'DSWD AICS Workflows', mono: 'DS', tag: 'FO VII Service' },
      { name: 'CSC Form 212 (PDS)', mono: 'CS', tag: 'Gov Standard' },
      { name: 'Barangay Digital Twin', mono: 'BR', tag: '7-Purok GIS' },
      { name: 'Power BI & M365', mono: 'BI', tag: 'Automation' },
      { name: 'LAN/WAN & Hardware', mono: 'HW', tag: 'COMTECH Diploma' },
      { name: 'Social Media & KDP', mono: 'KD', tag: 'DICT Awardee' },
    ],
  },
];

export const skillEvidence: Record<string, string[]> = {
  'React 18 / 19': ['Zetica Creative Suite & Hub', 'Barangay Matatag 3D Portal', 'CLIENT QMS — DSWD AICS', 'NEXUS v2', 'Accenture Inc.'],
  'Next.js 15 / 16': ['CLIENT QMS — DSWD AICS', 'CareerForm PH', 'LifeCoachDoc v2', 'Accenture Inc.'],
  TypeScript: ['All 12 ZETICUZ Originals', 'Zetica Creative Suite & Hub', 'NEXUS v2', 'CLIENT QMS — DSWD AICS'],
  'Tailwind CSS v4': ['Zetica Creative Suite & Hub', 'CLIENT QMS — DSWD AICS', 'Barangay Matatag 3D Portal', 'NEXUS v2'],
  'Three.js & R3F': ['Zetica Creative Suite 3D Galaxy Hub', 'LifeCoachDoc v2 (3D Book Carousel)', 'LifeCoachDoc v1 (3D Hero)', 'CareerForm PH'],
  'Framer Motion': ['NEXUS v2', 'Barangay Matatag 3D Portal', 'LifeCoachDoc v1 & v2'],
  'GSAP & Lenis': ['ZETICUZ Portfolio Series', '60fps Smooth Scroll Choreography'],
  'TanStack Start': ['Dr. Nwanganga Shields Memoir & Analytics Heatmap'],
  'Radix UI & shadcn': ['LifeCoachDoc v2', 'SWS Skeptrons Hub'],
  'Redux & Zustand': ['Accenture Inc. Front-End Dev', 'NEXUS Streaming (v1)', 'ZETFLIX TV'],
  'Rust & WebGPU (wgpu)': ['Zetica Creative Suite & Hub (14 Native Desktop Apps: DesignCraft, PhotoCraft, FilmCraft, SoundCraft, PDFCraft & more)'],
  'Node.js & Express': ['NEXUS v2 Backend', 'SWS Skeptrons Hub', 'ZETFLIX TV'],
  'Python & FastAPI': ['DICT Visayas Cluster 2 Python Programming Essentials Certificate (40h)'],
  'TMDB-Embed-API': ['NEXUS v2 (6+ Probed Sources: FebBox 4K, VidLink, LookMovies, AniKai)'],
  'HLS.js & Web Audio': ['ZETICUZ Portfolio Interactive Web Audio SFX', 'NEXUS v2 Adaptive Player', 'CLIENT QMS 3-Tone Harmonic TV Chimes'],
  BroadcastChannel: ['CLIENT QMS Zero-Latency Public TV Broadcast Monitors (Steps 2, 3 & 4)'],
  'Web Speech TTS': ['CLIENT QMS Automated Voice Ticket Announcer'],
  'Google Drive API': ['Barangay Matatag 3D Portal Automated Cloud Vault Sync'],
  'REST & WebSockets': ['NEXUS v2 Dual-Backend Sync (SPECTRUM + REAPER)'],
  'pdf-lib & Canvas': ['Zetica PDF (PDFCraft)', 'CareerForm PH Official CSC Form 212 PDS & E-Signature Generator'],
  Supabase: ['NEXUS v2', 'ZETFLIX TV', 'Dr. Nwanganga Shields Admin Heatmap'],
  PostgreSQL: ['Supabase Cloud Stores', 'University of San Carlos DBA'],
  MongoDB: ['CareerForm PH', 'SWS Skeptrons Hub', 'ZETFLIX TV'],
  Firebase: ['Realtime Cloud Sync & Auth'],
  'MySQL & SQLite': ['University of San Carlos Database Administrator', 'Enterprise Record Stores'],
  'Atomic JSON Sync': ['CLIENT QMS Brownout-Proof Disk Persistence'],
  'QR Session Auth': ['NEXUS v2 Passwordless TV Login', 'Barangay Matatag QR Document Verification'],
  'REA Reverse Engineering': ['Zetica Creative Suite Native Format Compatibility', 'NEXUS v2 Multi-Source Stream Decryption'],
  'Claude Code & Antigravity': ['Zetica Creative Suite & Hub', 'All 12 ZETICUZ Originals', 'Superpowers & Agentic SEO Workflows'],
  'Chrome DevTools & Playwright MCP': ['Automated 1080p 60fps Trailer Recording', 'Live E2E Visual & Performance Auditing'],
  'Firecrawl & Context7 MCP': ['Autonomous Web Scraping, Live Documentation Ingestion & Competitive Research'],
  'OpenAI & Gemini APIs': ['Zetica Studio AI Video/Image/3D Compositing', 'CareerForm PH AI Resume Optimizer'],
  'DeepEval & Confident AI': ['CLIENT QMS Confident AI / DeepEval Command Dashboard'],
  'Shadcn & Frontend UI Skill': ['Zetica Creative Suite & Hub', 'CLIENT QMS — DSWD AICS', 'Barangay Matatag 3D Portal'],
  'Vercel Edge': ['All 12 Live ZETICUZ Production Deployments (zetica.vercel.app, nexusph.xyz & more)'],
  'WiX v5 & Native MSI': ['Zetica Creative Suite Windows MSI Installer & Per-User Desktop Shortcuts'],
  Docker: ['Containerized API & Stream Proxy Services'],
  'Git & GitHub Actions': ['ZETIC7Z Automated Deployment Pipelines & Accenture Agile Workflows'],
  'Leaflet 3D & OSRM': ['Barangay Matatag 3D Satellite GIS Map & Emergency Dispatch Routing'],
  'Vite & Turbopack': ['Zetica Creative Suite Web Hub', 'Barangay Matatag 3D Portal', 'NEXUS v2'],
  'DSWD AICS Workflows': ['DSWD Field Office VII Administrative Assistant II & CLIENT QMS'],
  'CSC Form 212 (PDS)': ['CareerForm PH Civil Service Commission PDS Builder'],
  'Barangay Digital Twin': ['Barangay Matatag 3D E-Governance Portal (Lamitan City)'],
  'Power BI & M365': ['Legacy Group Real Estate & DSWD FO VII Data Reporting'],
  'LAN/WAN & Hardware': ['COMTECH Computer Engineering Technician Diploma & USC IT Support'],
  'Social Media & KDP': ['DICT DigitalJobsPH Outstanding Trainee & Lamitan Tech4ED Resource Speaker'],
};

// Top Moments: Every project and official citation has its own individual box (never mixed!),
// ordered newest-first by project creation date so the most recent build always appears first.
export const achievements: Achievement[] = [
  {
    id: 'ach-zetica',
    laurel: 'NOV 2026 · #1 ACTIVE FLAGSHIP',
    title: 'Zetica Creative Suite & Hub (14 Native Apps)',
    org: 'ZETICUZ Open-Access Initiative · zetica.vercel.app',
    detail:
      'Continuously in active development to make professional creative, design, video, audio, PDF & office desktop apps 100% free and accessible for all students and editors who cannot afford paid apps — zero subscriptions forever.',
    link: 'https://zetica.vercel.app/',
    image: '/cards/ach-zetica.webp',
  },
  {
    id: 'ach-brgy',
    laurel: 'OCT 2026 · GOVTECH 3D GIS',
    title: 'Barangay Matatag 3D E-Governance Portal',
    org: 'Lamitan City, BARMM · smart-brgy-portal.vercel.app',
    detail:
      'Engineered an interactive 3D satellite GIS digital twin covering all 7 Puroks of Barangay Matatag with OSRM emergency dispatch routing, QR-verified clearances & Google Drive sync.',
    link: 'https://smart-brgy-portal.vercel.app',
    image: '/cards/ach-brgy.webp',
  },
  {
    id: 'ach-qms',
    laurel: 'OCT 2026 · DSWD AICS QUEUE',
    title: 'CLIENT QMS — DSWD AICS Smart Queue',
    org: 'DSWD Crisis Intervention · client-qms.vercel.app',
    detail:
      'Built a 4-step DSWD AICS queue management platform with zero-latency Public TV Broadcast Monitors, 3-tone harmonic chimes, Web Speech TTS voice callouts & DeepEval telemetry.',
    link: 'https://client-qms.vercel.app',
    image: '/cards/ach-qms.webp',
  },
  {
    id: 'ach-careerform',
    laurel: 'SEP 2026 · CSC FORM 212',
    title: 'CareerForm PH — Official PDS & Resume Builder',
    org: 'Civil Service Commission Standard · careerform-ph.vercel.app',
    detail:
      'Created an AI-powered career document studio generating pixel-accurate Philippine Civil Service Commission Form 212 (Revised 2025) Personal Data Sheets and regional resumes.',
    link: 'https://careerform-ph.vercel.app',
    image: '/cards/ach-careerform.webp',
  },
  {
    id: 'ach-lifecoach-v2',
    laurel: 'SEP 2026 · 3D WEBGL EDITION',
    title: 'LifeCoachDoc v2 — Dr. Frances Gaik, PsyD',
    org: 'Chicago Clinical Psychology · lifecoach-v2.vercel.app',
    detail:
      'Delivered a bespoke 3D React Three Fiber clinical practice portal featuring an interactive 3D published book carousel, hypnosis & EMDR pillars, and dynamic theme palettes.',
    link: 'https://lifecoach-v2.vercel.app',
    image: '/cards/ach-lifecoach-v2.webp',
  },
  {
    id: 'ach-lifecoach-v1',
    laurel: 'SEP 2026 · 3D LUXURY PORTAL',
    title: 'LifeCoachDoc v1 — 13-Palette Clinical Suite',
    org: 'Dr. Frances Gaik, PsyD · lifecoach-eight.vercel.app',
    detail:
      'Crafted the first-edition 3D WebGL clinical practice platform with a floating 3D hardcover book showcase, 13 real-time luxury color themes, and 4-step consultation booking.',
    link: 'https://lifecoach-eight.vercel.app',
    image: '/cards/ach-lifecoach-v1.webp',
  },
  {
    id: 'ach-nexus',
    laurel: 'AUG 2026 · STREAMING ENGINE V6.4',
    title: 'NEXUS v2 — Next-Gen Streaming Hub',
    org: 'ZETICUZ Studio · nexusph.xyz',
    detail:
      'Architected a dual-backend streaming platform (SPECTRUM + REAPER failover) with custom TMDB-Embed-API decryption across 6+ 4K/1080p sources, vertical Cuts feed & QR TV login.',
    link: 'https://www.nexusph.xyz/',
    image: '/cards/ach-nexus.webp',
  },
  {
    id: 'ach-shields',
    laurel: 'JUL 2026 · LITERARY PRESS',
    title: 'Dr. Nwanganga Shields — Author & Analytics Hub',
    org: 'The Winter Press · nwanganga-shields.vercel.app',
    detail:
      'Built a TanStack Start literary memoir showcase and live visitor heatmap analytics dashboard for World Bank veteran and author Dr. Nwanganga Shields.',
    link: 'https://nwanganga-shields.vercel.app',
    image: '/cards/ach-shields.webp',
  },
  {
    id: 'ach-sws',
    laurel: 'MAY 2026 · CHAPTER PORTAL',
    title: 'Alpha Kappa Rho — SWS Skeptrons Hub',
    org: 'San Carlos City Chapter · sws-skeptrons.vercel.app',
    detail:
      'Engineered an interactive fraternity chapter hub with 3D metallic crest intro, live 53rd Founding Anniversary countdown, verified member directory & custom audio player.',
    link: 'https://sws-skeptrons.vercel.app',
    image: '/cards/ach-sws.webp',
  },
  {
    id: 'ach-dekaron',
    laurel: 'MAR 2026 · MMORPG PORTAL',
    title: 'Dekaron Stampede — 14-Class Gaming Hub',
    org: 'Action MMORPG Community · dekaron-stampede.vercel.app',
    detail:
      'Designed a high-octane dark-fantasy gaming portal featuring an interactive 14-class combat previewer, real-time server status telemetry, and patch notes.',
    link: 'https://dekaron-stampede.vercel.app',
    image: '/cards/ach-dekaron.webp',
  },
  {
    id: 'ach-zetflix',
    laurel: 'FEB 2026 · TEN-FOOT SMART TV UI',
    title: 'ZETFLIX TV — Cinema & Live Sports Hub',
    org: 'ZETICUZ Media Lab · zetflix-tv.vercel.app',
    detail:
      'Built a ten-foot Smart TV and desktop cinema interface with spatial keyboard navigation, HLS live channel switching, and Supabase cloud watchlists.',
    link: 'https://zetflix-tv.vercel.app',
    image: '/cards/ach-zetflix.webp',
  },
  {
    id: 'ach-nexus-v1',
    laurel: 'JAN 2026 · STREAMING PWA V1',
    title: 'NEXUS Streaming (v1) — Movies, Anime & Manga',
    org: 'ZETICUZ Media Lab · nexus-streaming-one.vercel.app',
    detail:
      'Launched the foundational multi-format PWA uniting Movies, TV Series, Anime, and Manga readers under a single installable glassmorphic streaming interface.',
    link: 'https://nexus-streaming-one.vercel.app',
    image: '/cards/ach-nexus-v1.webp',
  },
  {
    id: 'ach-dswd',
    laurel: 'DSWD FIELD OFFICE VII · OCT 2024',
    title: 'Administrative Assistant II & Cross-Matching Citation',
    org: 'DSWD FO VII · Cebu City (2023–2025)',
    detail:
      'Served as Administrative Assistant II (SG 08-1) in DSWD FO VII PACD/AICS and earned the Certificate of Participation in Screening, Deduplication & Cross-Matching.',
    link: '/assets/Sam_Pangilinan_Certificates.pdf',
    image: '/cards/ach-dswd.webp',
  },
  {
    id: 'ach-dict-python',
    laurel: 'DICT VISAYAS CLUSTER 2 · DEC 2020',
    title: 'Python Programming Essentials (40 Hours)',
    org: 'Department of Information and Communications Technology',
    detail:
      'Awarded Certificate of Completion for completing 40 hours of intensive Python Programming Essentials training under DICT Visayas Cluster 2.',
    link: '/assets/Sam_Pangilinan_Certificates.pdf',
    image: '/cards/ach-dict-python.webp',
  },
  {
    id: 'ach-dict-dj',
    laurel: 'DICT MINDANAO CLUSTER 1 · DEC 2019',
    title: 'DigitalJobsPH Outstanding Trainee Awardee (240h)',
    org: 'DICT Mindanao Cluster 1 · Lamitan, Basilan',
    detail:
      'Named Outstanding Trainee Awardee across 240 hours of DICT DigitalJobsPH Technical Training in Social Media Marketing & Advertising.',
    link: '/assets/Sam_Pangilinan_Certificates.pdf',
    image: '/cards/ach-dict-dj.webp',
  },
  {
    id: 'ach-lamitan',
    laurel: 'LAMITAN TECH4ED · MAR 2020',
    title: 'Resource Speaker & Trainer Citation (40 Hours)',
    org: 'City Government of Lamitan · Women & Yakan Weavers',
    detail:
      'Honored with Certificate of Appreciation as Resource Speaker/Trainer for a 5-day (40-hour) Social Media Management Training empowering Women & Yakan Weavers.',
    link: '/assets/Sam_Pangilinan_Certificates.pdf',
    image: '/cards/ach-lamitan.webp',
  },
];

export const certifications: Certification[] = [
  {
    name: 'Associate in Computer Engineering Technician (2-Year Vocational College Diploma · 101 Units)',
    issuer: 'Computer Technologies Institute (COMTECH) Inc. · Zamboanga City (2014–2016)',
    link: '/assets/Sam_Pangilinan_Resume.pdf',
    image: '/cards/cert-comtech.webp',
  },
  {
    name: "Administrative Assistant's Orientation on Screening, Deduplication & Cross-Matching (16 Hours)",
    issuer: 'DSWD Field Office VII · Cebu City (Oct 2024)',
    link: '/assets/Sam_Pangilinan_Certificates.pdf',
    image: '/cards/ach-dswd.webp',
  },
  {
    name: 'Python Programming Essentials Course — Certificate of Completion (40 Hours)',
    issuer: 'DICT Visayas Cluster 2 (Dec 2020)',
    link: '/assets/Sam_Pangilinan_Certificates.pdf',
    image: '/cards/ach-dict-python.webp',
  },
  {
    name: 'Certificate of Appreciation — Resource Speaker/Trainer (Social Media Management for Women & Yakan Weavers, 40 Hours)',
    issuer: 'Lamitan Tech4ED Center · City Government of Lamitan (Mar 2020)',
    link: '/assets/Sam_Pangilinan_Certificates.pdf',
    image: '/cards/ach-lamitan.webp',
  },
  {
    name: 'DigitalJobsPH Technical Training — Social Media Marketing & Advertising (240 Hours · Outstanding Trainee Awardee)',
    issuer: 'DICT Mindanao Cluster 1 · Lamitan, Basilan (Dec 2019)',
    link: '/assets/Sam_Pangilinan_Certificates.pdf',
    image: '/cards/ach-dict-dj.webp',
  },
  {
    name: 'Zetica Creative Suite & Hub — 14 Free Native Rust Apps for Students & Editors',
    issuer: 'ZETICUZ Open-Access Engineering (Nov 2026)',
    link: 'https://zetica.vercel.app/',
    image: '/cards/ach-zetica.webp',
  },
];

export const education = [
  {
    school: 'Computer Technologies Institute of Zamboanga (COMTECH)',
    place: 'Baliwasan-Chico Rd, Zamboanga City, Philippines',
    degree: 'Associate in Computer Engineering Technician (2-Year Vocational Course)',
    period: '2014 — 2016',
    score: 'Graduated 2016 · 101 Units Earned · Vocational / Technical College Diploma',
  },
  {
    school: 'Ubit National High School',
    place: 'Lamitan City, Basilan',
    degree: 'Secondary Education (High School Graduate)',
    period: '2006 — 2011',
    score: 'Graduated 2011',
  },
  {
    school: 'Talamban Elementary School',
    place: 'Talamban, Cebu City',
    degree: 'Primary / Elementary Education',
    period: '2001 — 2006',
    score: 'Graduated 2006',
  },
];

export const experience = [
  {
    company: 'The Winter Press & ZETICUZ Studio (zeticuz.xyz)',
    role: 'AI-First Full-Stack Engineer',
    period: '2016 — Present',
    points: [
      'Currently building Zetica Creative Suite & Hub (zetica.vercel.app) — a 14-app native Rust/WebGPU desktop creative & office ecosystem continuously in development to be 100% free forever for all students and editors who cannot afford paid subscriptions.',
      'Architected and shipped 12 production platforms including Barangay Matatag 3D E-Governance Portal, DSWD CLIENT QMS, CareerForm PH (CS Form 212), LifeCoachDoc 3D, and NEXUS v2 (nexusph.xyz).',
    ],
  },
  {
    company: 'Accenture Inc. (Cebu Philippines)',
    role: 'Multiplatform Front-End Development (React)',
    period: 'Feb 2025 — Feb 2026',
    points: [
      'Built scalable web applications for mobile and desktop using React.js, Next.js, Redux Toolkit, Tailwind CSS, and Vite.',
      'Transformed Figma/Adobe XD designs into responsive UIs and optimized Core Web Vitals via code-splitting, lazy loading, and Lighthouse audits in Agile/Scrum sprints.',
    ],
  },
  {
    company: 'Department of Social Welfare and Development (DSWD) Field Office VII',
    role: 'Administrative Assistant II — PACD & Crisis Intervention (SG 08-1)',
    period: 'Aug 2023 — Jan 2025',
    points: [
      'Managed Public Assistance and Complaints Desk (PACD) databases, ensuring data accuracy, screening, deduplication, and cross-matching for crisis beneficiaries.',
      'Monitored medical records of cancer and dialysis patients, coordinated inter-agency assistance, and delivered frontline IT troubleshooting.',
    ],
  },
  {
    company: 'University of San Carlos (USC)',
    role: 'Database Administrator & IT Technical Support',
    period: 'May 2022 — Jun 2023',
    points: [
      'Maintained campus databases, SQL records, and technical support operations across University of San Carlos departments in Cebu City.',
    ],
  },
  {
    company: 'Legacy Group Real Estate, USA / Mitten Made Properties',
    role: 'Social Media Manager, Content Graphics, Videographer & Virtual Assistant',
    period: 'Oct 2019 — Dec 2024',
    points: [
      'Managed multi-platform social media accounts, automated Excel/Google Sheets & Power BI reporting workflows, and supported international remote real estate operations.',
    ],
  },
  {
    company: 'Barangay Peacekeeping Action Team (BPAT) — City Government of Lamitan',
    role: 'Peace and Order Officer IV (Contract of Service)',
    period: 'Jun 2018 — Jun 2020',
    points: [
      'Coordinated community safety, incident reporting, and barangay peacekeeping operations under the City Government of Lamitan, Basilan.',
    ],
  },
  {
    company: 'Southwest Ticket and Tours',
    role: 'Ticketing Agent & IT Technical Support',
    period: 'Jul 2016 — Dec 2018',
    points: [
      'Managed passenger reservation and ticketing systems, travel itinerary scheduling, and office IT workstation maintenance.',
    ],
  },
  {
    company: 'Department of Environment and Natural Resources (DENR)',
    role: 'Surveyor Aid / GPS Operator (SG 04-1 · Contract of Service)',
    period: 'Jul 2015 — May 2016',
    points: [
      'Conducted field GPS surveying, geospatial coordinate mapping, and environmental land resource documentation.',
    ],
  },
  {
    company: 'Zinex Cinematic',
    role: 'Video Production & Graphics Designer',
    period: 'May 2011 — Dec 2014',
    points: [
      'Produced commercial video edits, motion graphics, visual branding, and digital media layouts.',
    ],
  },
];

export const introSlides = [
  {
    kicker: 'ZETICUZ ORIGINAL SERIES',
    title: '12 LIVE ORIGINALS',
    lines: [
      'Arranged newest-first: Zetica Creative Suite & Hub (14 Free Rust Apps), Barangay Matatag 3D Portal, DSWD CLIENT QMS, CareerForm PH & NEXUS v2.',
      'Every project ships with smooth 2x promotional trailer previews and production-grade architecture.',
    ],
    chips: ['Zetica Creative Suite', 'Barangay Matatag 3D', 'CLIENT QMS (DSWD)', 'CareerForm PH', 'NEXUS v2'],
  },
  {
    kicker: 'FREE FOR STUDENTS & EDITORS',
    title: 'ZETICA CREATIVE SUITE',
    lines: [
      'Continuously in development to make 14 professional desktop creative & office apps 100% free for students and editors who cannot afford paid software.',
      'Zero subscriptions forever — built natively in Rust + WebGPU (wgpu) + Three.js WebGL.',
    ],
    chips: ['Rust + WebGPU', 'Zetica Design', 'Zetica Film', 'Zetica Motion', 'Zetica PDF', 'Free Forever'],
  },
  {
    kicker: 'STARRING & ENGINEERED BY',
    title: 'SAM PANGILINAN',
    lines: [
      'AI-First Full-Stack Engineer · Accenture PH · DSWD FO VII · USC DBA · COMTECH Computer Engineering Technician.',
      '7+ Years Industry Experience · DICT Outstanding Trainee Awardee & Python Certified.',
    ],
    chips: ['zeticuz.xyz', 'github.com/ZETIC7Z', 'samxerz12@gmail.com', '+63310988089'],
  },
];

