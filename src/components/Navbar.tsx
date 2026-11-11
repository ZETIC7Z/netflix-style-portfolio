import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { sectionMeta, viewerProfiles, type ProfileId, type SectionId } from '../data/portfolio';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { useSound } from '../hooks/sound';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import SWSMusicPlayer from './SWSMusicPlayer';
import { SeriesMark } from './Poster';
import { ProfileAvatar } from './ProfileSelector';
import { EASE } from './fx';

export default function Navbar({ order, profileId, onSwitch }: { order: SectionId[]; profileId: ProfileId; onSwitch: (id: ProfileId) => void }) {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [active, setActive] = useState<string>('top');
  const { scrollTo } = useSmoothScroll();
  const { enabled: sfxEnabled, toggle: toggleSfx } = useSound();
  const { playlist, currentSongIndex, playing, togglePlay, playNext } = useAudioPlayer();
  const currentSong = playlist[currentSongIndex] || null;
  const menuRef = useRef<HTMLDivElement>(null);
  const musicRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    setHidden(y > 400 && y > prev && !menu && !musicOpen && !mobileNav);
  });

  useEffect(() => {
    const ids = ['top', ...order];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [order]);

  useEffect(() => {
    if (!menu && !musicOpen) return;
    const close = (e: PointerEvent) => {
      if (menu && !menuRef.current?.contains(e.target as Node)) setMenu(false);
      if (musicOpen && !musicRef.current?.contains(e.target as Node)) setMusicOpen(false);
    };
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, [menu, musicOpen]);

  const go = (id: string) => {
    setMobileNav(false);
    scrollTo(`#${id}`, { offset: id === 'top' ? 0 : -64 });
  };

  const current = viewerProfiles.find((p) => p.id === profileId)!;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[60]"
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div
        className={`gutter flex h-16 items-center justify-between gap-4 transition-[background,backdrop-filter] duration-500 md:h-[72px] ${
          solid || mobileNav || musicOpen ? 'bg-ink/85 backdrop-blur-xl' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="flex items-center gap-6 lg:gap-8">
          <button type="button" onClick={() => go('top')} className="text-[26px] md:text-[30px]" aria-label="Back to top">
            <SeriesMark />
          </button>
          <nav className="hidden items-center gap-5 xl:flex" aria-label="Sections">
            <NavLink label="Home" active={active === 'top'} onClick={() => go('top')} />
            {order.map((id) => (
              <NavLink key={id} label={sectionMeta[id].nav} active={active === id} onClick={() => go(id)} />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Navbar Music Player Pill & Popover (right next to SFX ON) */}
          <div className="relative" ref={musicRef}>
            <div className="flex h-8 items-center gap-1.5 rounded-full border border-crimson-2/45 bg-black/65 pl-1.5 pr-2 text-bone backdrop-blur-md transition hover:border-crimson-2">
              <button
                type="button"
                onClick={() => setMusicOpen((o) => !o)}
                className="flex items-center gap-2 text-left"
                title="Open YouTube Music Playlist"
              >
                {currentSong && (
                  <img
                    src={currentSong.albumArt}
                    alt=""
                    className={`h-5 w-5 rounded-full border border-crimson-2/50 object-cover ${playing ? 'animate-spin' : ''}`}
                    style={{ animationDuration: '8s' }}
                  />
                )}
                <span className="max-w-[90px] truncate text-[10px] font-semibold tracking-wide text-bone sm:max-w-[140px]">
                  {currentSong ? currentSong.songName : 'Music Playlist'}
                </span>
              </button>
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? 'Pause music' : 'Play music'}
                title={playing ? 'Pause music' : 'Play music'}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-crimson text-[9px] text-bone transition hover:bg-crimson-2"
              >
                {playing ? '⏸' : '▶'}
              </button>
              <button
                type="button"
                onClick={() => playNext()}
                aria-label="Next track"
                title="Next track"
                className="px-0.5 text-[10px] text-mist transition hover:text-crimson-2"
              >
                ⏭
              </button>
              <button
                type="button"
                onClick={() => setMusicOpen((o) => !o)}
                aria-label="Toggle full music player"
                title="Open Full Music Player"
                className="px-0.5 text-[9px] text-crimson-2 transition hover:text-bone"
              >
                {musicOpen ? '▲' : '▼'}
              </button>
            </div>

            <AnimatePresence>
              {musicOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="fixed right-3 top-16 z-[120] w-[min(94vw,520px)] sm:absolute sm:right-0 sm:top-11"
                >
                  <SWSMusicPlayer id="sws-music-player-nav" onClose={() => setMusicOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={toggleSfx}
            aria-pressed={sfxEnabled}
            aria-label={sfxEnabled ? 'Mute UI sound effects' : 'Enable UI sound effects'}
            title={sfxEnabled ? 'GTA Menu SFX: ON (Click to mute)' : 'GTA Menu SFX: MUTED (Click to enable)'}
            className={`flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-bold tracking-[0.14em] uppercase transition ${
              sfxEnabled
                ? 'border-crimson-2/60 bg-crimson/15 text-bone hover:border-crimson-2'
                : 'border-white/15 bg-white/[0.04] text-smoke hover:border-white/30 hover:text-bone'
            }`}
          >
            {sfxEnabled ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-crimson-2" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.25" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-smoke" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
            <span className="hidden sm:inline">{sfxEnabled ? 'SFX ON' : 'MUTED'}</span>
          </button>
          <button
            type="button"
            onClick={() => go('send-message')}
            className="hidden rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-bone transition hover:border-crimson-2 hover:text-crimson-2 sm:block"
          >
            LET&apos;S BUILD
          </button>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              aria-haspopup="menu"
              aria-expanded={menu}
              aria-label={`Viewing as ${current.name}. Switch profile`}
              className="flex items-center gap-2 rounded-md p-1"
            >
              <ProfileAvatar id={profileId} size="sm" />
              <motion.span animate={{ rotate: menu ? 180 : 0 }} className="text-[10px] text-mist">
                ▼
              </motion.span>
            </button>
            <AnimatePresence>
              {menu && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="absolute right-0 top-12 w-60 origin-top-right rounded-xl border border-white/10 bg-ink-2/95 p-2 shadow-2xl backdrop-blur-xl"
                >
                  <p className="px-3 pb-2 pt-1 text-[10px] font-semibold tracking-[0.24em] text-smoke">WHO&apos;S WATCHING?</p>
                  {viewerProfiles.map((p) => (
                    <button
                      key={p.id}
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        onSwitch(p.id);
                        setMenu(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/5 ${p.id === profileId ? 'bg-white/[0.06]' : ''}`}
                    >
                      <ProfileAvatar id={p.id} size="sm" />
                      <span>
                        <span className="block text-sm text-bone">{p.name}</span>
                        <span className="block text-[11px] text-smoke">{p.blurb}</span>
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label={mobileNav ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNav}
            onClick={() => setMobileNav((v) => !v)}
          >
            <motion.span className="block h-0.5 w-5 bg-bone" animate={{ rotate: mobileNav ? 45 : 0, y: mobileNav ? 4 : 0 }} />
            <motion.span className="block h-0.5 w-5 bg-bone" animate={{ rotate: mobileNav ? -45 : 0, y: mobileNav ? -4 : 0 }} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileNav && (
          <motion.nav
            aria-label="Sections"
            className="gutter border-b border-white/5 bg-ink/95 pb-6 pt-2 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {[{ id: 'top', label: 'Home' }, ...order.map((id) => ({ id, label: sectionMeta[id].nav })), { id: 'contact', label: "Let's Build" }].map((l, i) => (
              <motion.button
                key={l.id}
                type="button"
                onClick={() => go(l.id)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className={`block w-full py-3 text-left font-display text-3xl tracking-wide ${active === l.id ? 'text-crimson-2' : 'text-bone'}`}
              >
                {l.label}
              </motion.button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLink({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`relative text-[13px] font-medium transition ${active ? 'text-bone' : 'text-mist hover:text-bone'}`}>
      {label}
      {active && <motion.span layoutId="nav-underline" className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded bg-crimson" />}
    </button>
  );
}
