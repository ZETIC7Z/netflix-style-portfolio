import type { ReactNode } from 'react';

export function SkillIcon({ name, className = 'h-7 w-7' }: { name: string; className?: string }) {
  const key = name.toLowerCase();

  const wrap = (children: ReactNode) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );

  // --- 1. FRONTEND & 3D WEBGL ---
  if (key.includes('react')) {
    return wrap(
      <>
        <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
      </>
    );
  }

  if (key.includes('next.js')) {
    return wrap(
      <>
        <circle cx="12" cy="12" r="9.5" />
        <path d="M8.5 16V8l9 11.5" strokeWidth="1.9" />
        <path d="M15.5 8v5.5" strokeWidth="1.9" />
      </>
    );
  }

  if (key.includes('typescript')) {
    return wrap(
      <>
        <rect x="3" y="3" width="18" height="18" rx="3.5" />
        <path d="M7 10h6M10 10v7" strokeWidth="2" />
        <path d="M17.5 11.2c-.6-.4-1.8-.5-2.3.2-.5.6 0 1.4 1.1 1.8 1.2.4 1.7 1.2 1.3 2.1-.4.9-1.8 1-2.8.4" strokeWidth="1.8" />
      </>
    );
  }

  if (key.includes('tailwind')) {
    return wrap(
      <>
        <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35.98 1 2.12 2.15 4.6 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C15.62 7.15 14.48 6 12 6z" />
        <path d="M7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35.98 1 2.12 2.15 4.6 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C10.62 13.15 9.48 12 7 12z" />
      </>
    );
  }

  if (key.includes('three.js')) {
    return wrap(
      <>
        <polygon points="12 2.5 21 7.7 21 16.3 12 21.5 3 16.3 3 7.7" />
        <polyline points="3 7.7 12 12.9 21 7.7" />
        <line x1="12" y1="21.5" x2="12" y2="12.9" />
        <polygon points="12 6.2 16.8 9 12 11.8 7.2 9" opacity="0.55" />
      </>
    );
  }

  if (key.includes('framer')) {
    return wrap(
      <>
        <path d="M5 3h14v7H12L5 3z" fill="currentColor" fillOpacity="0.2" />
        <path d="M5 10h7l7 7H5v-7z" />
        <path d="M5 17h7v4l-7-4z" fill="currentColor" />
      </>
    );
  }

  if (key.includes('gsap')) {
    return wrap(
      <>
        <path d="M3 17c3.5-8 6.5-8 10 0s5.5 4 8-6" strokeWidth="2" />
        <polyline points="17 8 21 11 18 15" />
        <circle cx="5" cy="7" r="2" fill="currentColor" stroke="none" />
      </>
    );
  }

  if (key.includes('tanstack')) {
    return wrap(
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M3 16c2.5-2 5.5-2 9 0s6.5 2 9 0" />
        <path d="M3 20c2.5-2 5.5-2 9 0s6.5 2 9 0" />
      </>
    );
  }

  if (key.includes('radix')) {
    return wrap(
      <>
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <circle cx="16.5" cy="7.5" r="3.5" />
        <path d="M4 14h7v6H4z" />
        <path d="M14 14a6 6 0 0 1 6 6h-6v-6z" fill="currentColor" fillOpacity="0.25" />
      </>
    );
  }

  if (key.includes('redux') || key.includes('zustand')) {
    return wrap(
      <>
        <path d="M12 4a6.5 6.5 0 0 1 5.6 9.8" />
        <path d="M18.5 16.5A6.5 6.5 0 0 1 6.4 16" />
        <path d="M5.5 13.5A6.5 6.5 0 0 1 12 4" />
        <circle cx="12" cy="7.5" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="15.8" cy="14.5" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="8.2" cy="14.5" r="1.6" fill="currentColor" stroke="none" />
      </>
    );
  }

  // --- 2. BACKEND, STREAMING & APIS ---
  if (key.includes('rust') || key.includes('wgpu')) {
    return wrap(
      <>
        <circle cx="12" cy="12" r="6.5" strokeWidth="2" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" strokeWidth="2" />
      </>
    );
  }

  if (key.includes('node.js')) {
    return wrap(
      <>
        <polygon points="12 2.5 20.5 7.4 20.5 16.6 12 21.5 3.5 16.6 3.5 7.4" />
        <path d="M9.5 15V9l5 6V9" strokeWidth="1.9" />
      </>
    );
  }

  if (key.includes('python') || key.includes('fastapi')) {
    return wrap(
      <>
        <path d="M12 3c-4 0-4 2-4 3.5V9h5v1H6.5C4.5 10 3 11.2 3 14s1.5 4 3.5 4H8v-2.5c0-1.5 1.2-2.5 2.8-2.5h4.4c1.4 0 2.8-1 2.8-2.5V6.5C18 4.5 16 3 12 3z" />
        <path d="M12 21c4 0 4-2 4-3.5V15h-5v-1h6.5c2 0 3.5-1.2 3.5-4s-1.5-4-3.5-4H16v2.5c0 1.5-1.2 2.5-2.8 2.5H8.8C7.4 11 6 12 6 13.5v4C6 19.5 8 21 12 21z" />
        <circle cx="10" cy="6" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="14" cy="18" r="0.9" fill="currentColor" stroke="none" />
      </>
    );
  }

  if (key.includes('tmdb') || key.includes('embed')) {
    return wrap(
      <>
        <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
        <line x1="7" y1="4.5" x2="7" y2="19.5" />
        <line x1="17" y1="4.5" x2="17" y2="19.5" />
        <polygon points="10.5 9.5 15 12 10.5 14.5" fill="currentColor" stroke="none" />
      </>
    );
  }

  if (key.includes('hls') || key.includes('audio')) {
    return wrap(
      <>
        <path d="M3 12h2l2-5 3 10 3-12 3 9 2-2h3" strokeWidth="2" />
        <circle cx="12" cy="12" r="9.5" strokeOpacity="0.35" />
      </>
    );
  }

  if (key.includes('broadcastchannel')) {
    return wrap(
      <>
        <rect x="2.5" y="5" width="14" height="10" rx="2" />
        <path d="M7.5 18h4M9.5 15v3" />
        <path d="M18.5 8a4.5 4.5 0 0 1 0 6" />
        <path d="M20.8 6a7.5 7.5 0 0 1 0 10" />
      </>
    );
  }

  if (key.includes('speech') || key.includes('tts')) {
    return wrap(
      <>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 10a7 7 0 0 0 14 0" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <line x1="8" y1="21" x2="16" y2="21" />
      </>
    );
  }

  if (key.includes('google drive')) {
    return wrap(
      <>
        <polygon points="9.2 3.5 14.8 3.5 21.5 15 15.9 15" />
        <polygon points="2.5 15 9.2 3.5 12 8.5 5.3 20" />
        <polygon points="5.3 20 18.7 20 21.5 15 8.1 15" />
      </>
    );
  }

  if (key.includes('websocket') || key.includes('rest')) {
    return wrap(
      <>
        <path d="M13 2L4.5 13.5H11L10 22l9.5-11.5H13L13 2z" />
      </>
    );
  }

  if (key.includes('pdf-lib') || key.includes('canvas')) {
    return wrap(
      <>
        <path d="M14 2.5H6.5A2.5 2.5 0 0 0 4 5v14a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 20 19V8.5L14 2.5z" />
        <polyline points="14 2.5 14 8.5 20 8.5" />
        <path d="M8 15.5c1.5-2 3-2 4.5 0s2.5 1 3.5-1" />
      </>
    );
  }

  // --- 3. DATABASES & CLOUD AUTH ---
  if (key.includes('supabase')) {
    return wrap(
      <>
        <path d="M13.5 2.5L4.5 13.5h7.2l-.7 8 9-11h-7.2l.7-8z" fill="currentColor" fillOpacity="0.2" />
      </>
    );
  }

  if (key.includes('postgresql')) {
    return wrap(
      <>
        <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
        <path d="M4.5 5.5v6.5c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V5.5" />
        <path d="M4.5 12v6.5c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V12" />
      </>
    );
  }

  if (key.includes('mongodb')) {
    return wrap(
      <>
        <path d="M12 2.5C8 6.5 6.5 10.5 6.5 14a5.5 5.5 0 0 0 11 0c0-3.5-1.5-7.5-5.5-11.5z" />
        <line x1="12" y1="9" x2="12" y2="21.5" />
      </>
    );
  }

  if (key.includes('firebase')) {
    return wrap(
      <>
        <path d="M5 18.5L7.8 4.5l4.2 7.2 4.2-5.2L19 18.5 12 22l-7-3.5z" />
        <path d="M5 18.5l7-11 7 11" />
      </>
    );
  }

  if (key.includes('mysql') || key.includes('sqlite')) {
    return wrap(
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="3" y1="9.5" x2="21" y2="9.5" />
        <line x1="3" y1="14.5" x2="21" y2="14.5" />
        <line x1="9.5" y1="9.5" x2="9.5" y2="20" />
      </>
    );
  }

  if (key.includes('atomic json')) {
    return wrap(
      <>
        <path d="M8 4H6a2 2 0 0 0-2 2v3.5a2 2 0 0 1-2 2 2 2 0 0 1 2 2V17a2 2 0 0 0 2 2h2" />
        <path d="M16 4h2a2 2 0 0 1 2 2v3.5a2 2 0 0 0 2 2 2 2 0 0 0-2 2V17a2 2 0 0 1-2 2h-2" />
        <circle cx="12" cy="11.5" r="2.2" fill="currentColor" stroke="none" />
      </>
    );
  }

  if (key.includes('qr session')) {
    return wrap(
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 19h2M19 14v2" />
      </>
    );
  }

  // --- 4. AI & AGENTIC ENGINEERING (MCPs, REA & Superpowers) ---
  if (key.includes('rea') || key.includes('reverse')) {
    return wrap(
      <>
        <polygon points="12 2.5 20.2 7.2 20.2 16.8 12 21.5 3.8 16.8 3.8 7.2" />
        <circle cx="12" cy="12" r="4.2" />
        <line x1="12" y1="2.5" x2="12" y2="7.8" />
        <line x1="12" y1="16.2" x2="12" y2="21.5" />
        <line x1="3.8" y1="12" x2="7.8" y2="12" />
        <line x1="16.2" y1="12" x2="20.2" y2="12" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </>
    );
  }

  if (key.includes('claude') || key.includes('antigravity') || key.includes('cursor')) {
    return wrap(
      <>
        <path d="M12 2.5v19M2.5 12h19M5.3 5.3l13.4 13.4M18.7 5.3L5.3 18.7" strokeWidth="1.9" />
        <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      </>
    );
  }

  if (key.includes('chrome devtools') || key.includes('playwright')) {
    return wrap(
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.6" />
        <line x1="12" y1="8.4" x2="19.8" y2="8.4" />
        <line x1="8.9" y1="13.8" x2="5" y2="20" />
        <line x1="15.1" y1="13.8" x2="11.2" y2="20" />
      </>
    );
  }

  if (key.includes('firecrawl') || key.includes('context7')) {
    return wrap(
      <>
        <path d="M12 2.5c2 3.5 5.5 5.5 5.5 10.2a5.5 5.5 0 0 1-11 0c0-2.8 1.4-5.2 3.2-6.8.3 1.8 1.5 2.6 2.3 2.6 0-2.2 0-4.2 0-6z" />
        <path d="M10 15.5a2.2 2.2 0 0 0 4 0c0-1.4-2-3-2-3s-2 1.6-2 3z" fill="currentColor" stroke="none" />
      </>
    );
  }

  if (key.includes('openai') || key.includes('gemini')) {
    return wrap(
      <>
        <path d="M12 2.5L14.6 9.4L21.5 12L14.6 14.6L12 21.5L9.4 14.6L2.5 12L9.4 9.4L12 2.5Z" />
        <circle cx="18.5" cy="5.5" r="1.4" fill="currentColor" stroke="none" />
      </>
    );
  }

  if (key.includes('deepeval') || key.includes('confident')) {
    return wrap(
      <>
        <path d="M4 19.5h16" />
        <rect x="5.5" y="11" width="3" height="6" rx="0.8" />
        <rect x="10.5" y="7.5" width="3" height="9.5" rx="0.8" />
        <rect x="15.5" y="4.5" width="3" height="12.5" rx="0.8" />
        <polyline points="5.5 7.5 10 4.5 14 6 18.5 2.5" />
      </>
    );
  }

  if (key.includes('shadcn') || key.includes('frontend ui') || key.includes('prompt') || key.includes('rag') || key.includes('studio')) {
    return wrap(
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <line x1="9" y1="15" x2="15" y2="9" strokeWidth="2.2" />
        <line x1="13" y1="17" x2="17" y2="13" strokeWidth="2.2" />
      </>
    );
  }

  // --- 5. DEVOPS, GIS & QUALITY ---
  if (key.includes('vercel')) {
    return wrap(
      <>
        <polygon points="12 3.5 21.5 19.5 2.5 19.5" fill="currentColor" fillOpacity="0.22" strokeWidth="2" />
      </>
    );
  }

  if (key.includes('wix') || key.includes('msi')) {
    return wrap(
      <>
        <path d="M21 8.2V16a2 2 0 0 1-1.1 1.8l-7 3.7a2 2 0 0 1-1.8 0l-7-3.7A2 2 0 0 1 3 16V8.2a2 2 0 0 1 1.1-1.8l7-3.7a2 2 0 0 1 1.8 0l7 3.7A2 2 0 0 1 21 8.2z" />
        <polyline points="3.3 7.3 12 12 20.7 7.3" />
        <line x1="12" y1="21.5" x2="12" y2="12" />
      </>
    );
  }

  if (key.includes('docker')) {
    return wrap(
      <>
        <rect x="5" y="10" width="3" height="3" />
        <rect x="8.5" y="10" width="3" height="3" />
        <rect x="12" y="10" width="3" height="3" />
        <rect x="8.5" y="6.5" width="3" height="3" />
        <rect x="12" y="6.5" width="3" height="3" />
        <path d="M2.5 13.5h15.5c1.5 0 2.8-.8 3.5-2-1.2-.4-2.2-.2-3 .5-.4 4.5-4.2 7.5-9.5 7.5-4 0-6.5-2.2-6.5-6z" />
      </>
    );
  }

  if (key.includes('git')) {
    return wrap(
      <>
        <circle cx="6" cy="6" r="2.2" />
        <circle cx="18" cy="8" r="2.2" />
        <circle cx="6" cy="18" r="2.2" />
        <line x1="6" y1="8.2" x2="6" y2="15.8" />
        <path d="M18 10.2c0 4.2-3 5.2-12 5.6" />
      </>
    );
  }

  if (key.includes('leaflet') || key.includes('osrm') || key.includes('gis')) {
    return wrap(
      <>
        <path d="M12 2.5a7 7 0 0 0-7 7c0 5.2 7 12 7 12s7-6.8 7-12a7 7 0 0 0-7-7z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </>
    );
  }

  if (key.includes('vite') || key.includes('turbopack')) {
    return wrap(
      <>
        <polygon points="13 2.5 4 13.5 11.5 13.5 10.5 21.5 20 10.5 12.5 10.5" fill="currentColor" fillOpacity="0.2" />
      </>
    );
  }

  // --- 6. GOVTECH & ENTERPRISE OPS ---
  if (key.includes('dswd') || key.includes('aics')) {
    return wrap(
      <>
        <path d="M12 2.5l7.5 3.2v5.8c0 5.2-3.2 9.4-7.5 10.8-4.3-1.4-7.5-5.6-7.5-10.8V5.7L12 2.5z" />
        <path d="M12 8.5c-1.2-1.4-3.2-1.2-3.8.4-.6 1.6.8 3.4 3.8 5.4 3-2 4.4-3.8 3.8-5.4-.6-1.6-2.6-1.8-3.8-.4z" fill="currentColor" stroke="none" />
      </>
    );
  }

  if (key.includes('csc') || key.includes('212') || key.includes('pds')) {
    return wrap(
      <>
        <rect x="4" y="2.5" width="16" height="19" rx="2" />
        <circle cx="12" cy="8.5" r="2.4" />
        <path d="M8 14.5h8M8 17.5h5" />
      </>
    );
  }

  if (key.includes('barangay')) {
    return wrap(
      <>
        <polygon points="12 3 21 8.5 3 8.5" />
        <line x1="5.5" y1="8.5" x2="5.5" y2="18.5" />
        <line x1="10" y1="8.5" x2="10" y2="18.5" />
        <line x1="14" y1="8.5" x2="14" y2="18.5" />
        <line x1="18.5" y1="8.5" x2="18.5" y2="18.5" />
        <line x1="3" y1="19" x2="21" y2="19" strokeWidth="2" />
      </>
    );
  }

  if (key.includes('power bi') || key.includes('m365')) {
    return wrap(
      <>
        <rect x="4" y="13" width="3.5" height="7.5" rx="1" />
        <rect x="10.2" y="8.5" width="3.5" height="12" rx="1" />
        <rect x="16.5" y="4" width="3.5" height="16.5" rx="1" fill="currentColor" fillOpacity="0.25" />
      </>
    );
  }

  if (key.includes('lan/wan') || key.includes('hardware') || key.includes('comtech')) {
    return wrap(
      <>
        <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
        <rect x="9.5" y="9.5" width="5" height="5" rx="0.8" fill="currentColor" fillOpacity="0.25" />
        <path d="M9 3v3.5M15 3v3.5M9 17.5V21M15 17.5V21M3 9h3.5M3 15h3.5M17.5 9H21M17.5 15H21" />
      </>
    );
  }

  if (key.includes('social media') || key.includes('kdp')) {
    return wrap(
      <>
        <path d="M3 11v3a1 1 0 0 0 1 1h2.5l3.5 4.5v-14L6.5 10H4a1 1 0 0 0-1 1z" />
        <path d="M14.5 8.5a4.5 4.5 0 0 1 0 7M17.5 6a8 8 0 0 1 0 12" />
      </>
    );
  }

  return wrap(
    <>
      <polygon points="12 2.5 15 9 22 9.8 16.8 14.5 18.2 21.5 12 18 5.8 21.5 7.2 14.5 2 9.8 9 9" />
    </>
  );
}
