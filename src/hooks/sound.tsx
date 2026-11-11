import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

interface SoundContextValue {
  enabled: boolean;
  toggle: () => void;
  playHover: () => void;
  playClick: () => void;
  playWhoosh: () => void;
  playModalOpen: () => void;
  playTadum: () => void;
}

const SoundContext = createContext<SoundContextValue>({
  enabled: true,
  toggle: () => {},
  playHover: () => {},
  playClick: () => {},
  playWhoosh: () => {},
  playModalOpen: () => {},
  playTadum: () => {},
});

const STORAGE_KEY = 'zeticuz-series-sound';
const HOVER_SFX_URL = '/sfx/pointing-cursor.wav';
const CLICK_SFX_URL = '/sfx/gta-menu.wav';

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  const ctxRef = useRef<AudioContext | null>(null);
  const hoverBufferRef = useRef<AudioBuffer | null>(null);
  const clickBufferRef = useRef<AudioBuffer | null>(null);
  const hoverRawRef = useRef<ArrayBuffer | null>(null);
  const clickRawRef = useRef<ArrayBuffer | null>(null);
  const hoverAudioPoolRef = useRef<HTMLAudioElement[]>([]);
  const clickAudioPoolRef = useRef<HTMLAudioElement[]>([]);
  const poolIdxRef = useRef({ hover: 0, click: 0 });
  const lastHoverTime = useRef<number>(0);
  const lastHoverEl = useRef<Element | null>(null);

  // Preload WAV files into HTMLAudioElement pool + ArrayBuffer for Web Audio decoding
  useEffect(() => {
    if (typeof window === 'undefined') return;

    hoverAudioPoolRef.current = Array.from({ length: 4 }, () => {
      const a = new Audio(HOVER_SFX_URL);
      a.preload = 'auto';
      a.volume = 0.65;
      return a;
    });

    clickAudioPoolRef.current = Array.from({ length: 4 }, () => {
      const a = new Audio(CLICK_SFX_URL);
      a.preload = 'auto';
      a.volume = 0.8;
      return a;
    });

    fetch(HOVER_SFX_URL)
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        hoverRawRef.current = buf;
        if (ctxRef.current) {
          ctxRef.current.decodeAudioData(buf.slice(0)).then((decoded) => {
            hoverBufferRef.current = decoded;
          }).catch(() => {});
        }
      })
      .catch(() => {});

    fetch(CLICK_SFX_URL)
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        clickRawRef.current = buf;
        if (ctxRef.current) {
          ctxRef.current.decodeAudioData(buf.slice(0)).then((decoded) => {
            clickBufferRef.current = decoded;
          }).catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  const ensureCtx = useCallback((): AudioContext | null => {
    if (!enabled || typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!ctxRef.current) {
      const ctx = new AudioCtx();
      ctxRef.current = ctx;
      if (hoverRawRef.current && !hoverBufferRef.current) {
        ctx.decodeAudioData(hoverRawRef.current.slice(0)).then((d) => {
          hoverBufferRef.current = d;
        }).catch(() => {});
      }
      if (clickRawRef.current && !clickBufferRef.current) {
        ctx.decodeAudioData(clickRawRef.current.slice(0)).then((d) => {
          clickBufferRef.current = d;
        }).catch(() => {});
      }
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, [enabled]);

  /** GTA Menu Hover Sound (/sfx/pointing-cursor.wav) */
  const playHover = useCallback(() => {
    if (!enabled) return;
    const ctx = ensureCtx();
    if (ctx && ctx.state === 'running' && hoverBufferRef.current) {
      const src = ctx.createBufferSource();
      const gain = ctx.createGain();
      src.buffer = hoverBufferRef.current;
      gain.gain.value = 0.65;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start(0);
      return;
    }

    const pool = hoverAudioPoolRef.current;
    if (pool.length > 0) {
      const a = pool[poolIdxRef.current.hover % pool.length];
      poolIdxRef.current.hover += 1;
      try {
        a.currentTime = 0;
        a.play().catch(() => {});
      } catch {
        /* ignore */
      }
    }
  }, [enabled, ensureCtx]);

  /** GTA Menu Click Sound (/sfx/gta-menu.wav) */
  const playClick = useCallback(() => {
    if (!enabled) return;
    const ctx = ensureCtx();
    if (ctx && ctx.state === 'running' && clickBufferRef.current) {
      const src = ctx.createBufferSource();
      const gain = ctx.createGain();
      src.buffer = clickBufferRef.current;
      gain.gain.value = 0.85;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start(0);
      return;
    }

    const pool = clickAudioPoolRef.current;
    if (pool.length > 0) {
      const a = pool[poolIdxRef.current.click % pool.length];
      poolIdxRef.current.click += 1;
      try {
        a.currentTime = 0;
        a.play().catch(() => {});
      } catch {
        /* ignore */
      }
    }
  }, [enabled, ensureCtx]);

  // Alias all action triggers to the clean GTA Menu click sound (no noisy oscillators)
  const playWhoosh = playClick;
  const playModalOpen = playClick;
  const playTadum = playClick;

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  // Global delegated sound listeners for hover & click on buttons, links, tabs, and project boxes
  useEffect(() => {
    if (!enabled) return;

    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const interactive = target.closest('button, a, [role="button"], [role="tab"], [data-cursor], article');
      if (!interactive) {
        lastHoverEl.current = null;
        return;
      }
      if (interactive === lastHoverEl.current) return;
      lastHoverEl.current = interactive;

      const now = performance.now();
      if (now - lastHoverTime.current < 45) return;
      lastHoverTime.current = now;
      playHover();
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const interactive = target.closest('button, a, [role="button"], [role="tab"], [data-cursor], article');
      if (!interactive) {
        ensureCtx();
        return;
      }
      playClick();
    };

    window.addEventListener('pointerover', onPointerOver, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerover', onPointerOver);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [enabled, ensureCtx, playHover, playClick]);

  return (
    <SoundContext.Provider value={{ enabled, toggle, playHover, playClick, playWhoosh, playModalOpen, playTadum }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
