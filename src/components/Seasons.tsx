import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { seasons } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';
import EpisodeCard from './EpisodeCard';
import { RailButtons } from './Rail';

const AUTO_ADVANCE_MS = 12000;

export default function Seasons() {
  // Always start at Season 1 (index 0) and auto-advance through Season 5, then loop back to Season 1
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  const season = seasons[active] ?? seasons[0];

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % seasons.length);
      rail.current?.scrollTo({ left: 0, behavior: 'smooth' });
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [inView, active]);

  return (
    <div ref={wrapRef}>
      <SectionHeading
        kicker={`${seasons.length} Seasons · Auto-Play S01 → S0${seasons.length}`}
        title="My Journey"
        aside={
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <p className="max-w-xs text-sm text-mist sm:text-right">
              Starts at Season 01 and automatically advances through Season 0{seasons.length} in chronological order.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-crimson-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-crimson-2" />
              <span>AUTO-PLAYING S0{season.number} OF S0{seasons.length}</span>
            </div>
          </div>
        }
      />

      {/* season selector — 5-column layout so all 5 Seasons (S01–S05) are always visible on screen */}
      <div
        className="gutter mb-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5"
        role="tablist"
        aria-label="Seasons"
      >
        {seasons.map((s, i) => {
          const isCurrent = i === active;
          return (
            <button
              key={s.number}
              role="tab"
              aria-selected={isCurrent}
              type="button"
              onClick={() => {
                setActive(i);
                rail.current?.scrollTo({ left: 0, behavior: 'smooth' });
              }}
              className={`relative min-w-0 overflow-hidden rounded-2xl px-3.5 py-2.5 text-left transition ${
                isCurrent
                  ? 'text-ink shadow-[0_0_25px_rgba(244,241,236,0.2)]'
                  : 'border border-white/10 bg-white/[0.03] text-mist hover:border-white/25 hover:text-bone'
              }`}
            >
              {isCurrent && (
                <motion.span
                  layoutId="season-pill"
                  className="absolute inset-0 rounded-2xl bg-bone"
                  transition={{ duration: 0.45, ease: EASE }}
                />
              )}
              {isCurrent && inView && (
                <motion.span
                  key={`prog-${s.number}-${active}`}
                  className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-crimson"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
                />
              )}
              <div className="relative flex items-center justify-between gap-1.5">
                <span className="text-[10px] font-bold tracking-[0.2em]">
                  SEASON {String(s.number).padStart(2, '0')}
                </span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-wider ${
                    isCurrent ? 'bg-ink/10 text-ink/80' : 'bg-white/[0.06] text-smoke'
                  }`}
                >
                  {s.episodes.length} EP
                </span>
              </div>
              <span className="relative mt-0.5 block truncate text-xs font-semibold leading-snug">
                {s.title}
              </span>
              <span
                className={`relative block truncate text-[10px] ${
                  isCurrent ? 'text-ink/70' : 'text-smoke'
                }`}
              >
                {s.period}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={season.number}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -28 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div className="gutter mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-display text-4xl tracking-wide text-bone sm:text-5xl">
                <span className="text-outline mr-3">S{String(season.number).padStart(2, '0')}</span>
                {season.title}
              </h3>
              <span className="text-sm text-mist">
                {season.period} · {season.episodes.length} {season.episodes.length === 1 ? 'Episode' : 'Episodes'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActive((prev) => (prev - 1 + seasons.length) % seasons.length)}
                className="rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold tracking-wider text-bone transition hover:border-crimson-2 hover:text-crimson-2"
              >
                ← PREV SEASON
              </button>
              <button
                type="button"
                onClick={() => setActive((prev) => (prev + 1) % seasons.length)}
                className="rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold tracking-wider text-bone transition hover:border-crimson-2 hover:text-crimson-2"
              >
                NEXT SEASON (S0{((active + 1) % seasons.length) + 1}) →
              </button>
            </div>
          </div>
          <p className="gutter max-w-3xl text-[15px] leading-relaxed text-bone/75">{season.synopsis}</p>

          <div className="group/rail relative">
            <div ref={rail} className="rail gutter flex snap-x snap-mandatory gap-4 overflow-x-auto py-8 [perspective:1200px]">
              {season.episodes.map((e, i) => (
                <EpisodeCard key={e.code} episode={e} index={i} />
              ))}
            </div>
            <RailButtons rail={rail} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
