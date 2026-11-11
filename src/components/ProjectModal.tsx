import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { projects, type Project } from '../data/portfolio';
import { useScrollLock } from '../hooks/smoothScroll';
import { EASE, Magnetic } from './fx';
import { ProjectArt } from './Poster';

const block = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
};

export default function ProjectModal({ project, onClose, onSwitch }: { project: Project; onClose: () => void; onSwitch: (p: Project) => void }) {
  useScrollLock(true);
  const scroller = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(62);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
    setPaused(false);
    setProgress(0);
    setCurrentTime(0);
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.play().catch(() => {});
    }
  }, [project.id]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  const restartVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
    setPaused(false);
  };

  const formatTime = (sec: number) => {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const more = projects.filter((p) => p.id !== project.id);

  return (
    <motion.div className="fixed inset-0 z-[140]" role="dialog" aria-modal="true" aria-labelledby={`title-${project.id}-modal`}>
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div ref={scroller} data-lenis-prevent className="absolute inset-0 overflow-y-auto overscroll-contain" onClick={onClose}>
        <motion.div
          className="relative mx-auto min-h-full max-w-5xl bg-ink-2 shadow-2xl sm:my-10 sm:min-h-0 sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 30, transition: { duration: 0.3 } }}
        >
          {/* 16:9 Cinema Billboard with Live Video Trailer & Audio */}
          <div
            className={`group/player relative w-full overflow-hidden bg-black transition-all duration-500 sm:rounded-t-2xl ${
              expanded ? 'aspect-video max-h-[82vh]' : 'aspect-video max-h-[64vh]'
            }`}
          >
            <motion.div layoutId={`art-${project.id}`} className="absolute inset-0 bg-black" transition={{ duration: 0.7, ease: EASE }}>
              <ProjectArt project={project} />
              {project.trailer && (
                <video
                  ref={videoRef}
                  key={project.trailer}
                  src={project.trailer}
                  poster={project.landscapeImage}
                  preload="metadata"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onClick={togglePlay}
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    setCurrentTime(v.currentTime);
                    if (v.duration > 0) {
                      setDuration(v.duration);
                      setProgress((v.currentTime / v.duration) * 100);
                    }
                  }}
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget;
                    if (v.duration > 0) setDuration(v.duration);
                  }}
                  className="absolute inset-0 h-full w-full cursor-pointer bg-black object-contain"
                />
              )}
            </motion.div>

            {/* Subtle top vignette for top controls */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/70 to-transparent" />

            {/* Top-left Live Trailer status pill */}
            <div className="absolute left-4 top-[max(0.85rem,env(safe-area-inset-top))] z-10 flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-bone backdrop-blur-md sm:left-6">
              <span className="h-2 w-2 animate-pulse rounded-full bg-crimson-2" />
              <span>Cinematic Trailer · {formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>

            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              data-cursor="close"
              aria-label="Close project"
              className="absolute right-4 top-[max(0.85rem,env(safe-area-inset-top))] z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/70 text-base text-bone backdrop-blur transition hover:bg-black"
            >
              ✕
            </button>

            {/* Bottom-right floating trailer controls (leaves bottom-left After-Effects HUD callouts 100% unobstructed) */}
            <div className="absolute bottom-4 right-4 z-10 flex flex-wrap items-center justify-end gap-2 sm:right-6">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={paused ? 'Play trailer' : 'Pause trailer'}
                className="flex h-9 items-center gap-1.5 rounded-full border border-white/20 bg-black/75 px-3.5 text-xs font-semibold text-bone backdrop-blur-md transition hover:border-white/40 hover:bg-black/90"
              >
                <span>{paused ? '▶ Play' : '⏸ Pause'}</span>
              </button>
              <button
                type="button"
                onClick={restartVideo}
                aria-label="Restart trailer"
                title="Restart trailer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/75 text-sm text-bone backdrop-blur-md transition hover:border-white/40 hover:bg-black/90"
              >
                ↺
              </button>
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                aria-label={expanded ? 'Exit theater view' : 'Expand trailer view'}
                title={expanded ? 'Compact view' : 'Theater view'}
                className="flex h-9 items-center gap-1.5 rounded-full border border-white/20 bg-black/75 px-3.5 text-xs font-semibold text-bone backdrop-blur-md transition hover:border-white/40 hover:bg-black/90"
              >
                <span>{expanded ? '⤡ Compact' : '⤢ Theater'}</span>
              </button>
            </div>

            {/* Interactive seekable trailer progress bar */}
            <div
              role="slider"
              aria-label="Seek trailer timeline"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(currentTime)}
              tabIndex={0}
              onClick={(e) => {
                const v = videoRef.current;
                if (!v || !v.duration) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                v.currentTime = ratio * v.duration;
                setCurrentTime(v.currentTime);
                setProgress(ratio * 100);
              }}
              className=" absolute inset-x-0 bottom-0 z-10 h-2 cursor-pointer bg-white/20 transition-all hover:h-3"
            >
              <div
                className="h-full bg-crimson-2 transition-[width] duration-150"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>

          <motion.div className="px-5 pb-12 pt-6 sm:px-10 sm:pt-8" initial="hidden" animate="show" transition={{ staggerChildren: 0.08, delayChildren: 0.18 }}>
            <motion.div variants={block} className="mb-3">
              <p className="mb-1.5 flex items-center gap-2 text-[11px] font-bold tracking-[0.34em] text-bone/90">
                <img src="/zeticuz-logo.svg" alt="ZETICUZ" className="h-4 w-auto object-contain" /> ORIGINAL
              </p>
              <motion.h2
                id={`title-${project.id}-modal`}
                layoutId={`title-${project.id}`}
                className="font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.9] tracking-wide text-bone"
                transition={{ duration: 0.7, ease: EASE }}
              >
                {project.title}
              </motion.h2>
            </motion.div>

            <motion.div variants={block} className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-mist">
              <span className="font-semibold text-[#46e3a8]">{project.year}</span>
              <span className="h-1 w-1 rounded-full bg-smoke" />
              <span>{project.genre}</span>
            </motion.div>

            <motion.p variants={block} className="mt-4 max-w-3xl text-lg leading-relaxed text-bone sm:text-xl">
              {project.logline}
            </motion.p>

            {(project.demo || project.github) && (
              <motion.div variants={block} className="mt-6 flex flex-wrap gap-3">
                {project.demo && (
                  <Magnetic>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="link"
                      className="flex min-h-12 items-center gap-2 rounded-md bg-bone px-6 text-[15px] font-bold text-ink transition hover:bg-white"
                    >
                      ▶ Launch Live Site ↗
                    </a>
                  </Magnetic>
                )}
                {project.github && (
                  <Magnetic>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="link"
                      className="glass flex min-h-12 items-center gap-2 rounded-md px-6 text-[15px] font-semibold text-bone transition hover:bg-white/15"
                    >
                      GitHub Repository ↗
                    </a>
                  </Magnetic>
                )}
              </motion.div>
            )}

            {/* impact */}
            <motion.section variants={block} className="mt-12">
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">Result / Impact</h3>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-4">
                {project.metrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    className="bg-ink p-4 sm:p-5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.07, duration: 0.5, ease: EASE }}
                  >
                    <p className="font-display text-4xl leading-none text-bone sm:text-5xl" style={{ color: i === 0 ? project.palette.accent : undefined }}>
                      {m.value}
                    </p>
                    <p className="mt-2 text-xs leading-snug text-mist">{m.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <div className="mt-12 grid gap-10 lg:grid-cols-[3fr_2fr]">
              <motion.section variants={block}>
                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">My Contribution</h3>
                <ul className="space-y-4">
                  {project.build.map((b) => (
                    <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-bone/85">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: project.palette.accent }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.section>
              <div className="space-y-10">
                <motion.section variants={block}>
                  <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((t) => (
                      <span key={t} className="glass rounded-full px-3 py-1.5 text-sm font-medium text-bone">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.section>
                <motion.section variants={block}>
                  <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-crimson-2">Key Features</h3>
                  <ul className="space-y-2.5">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-bone/85">
                        <span className="text-crimson-2">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.section>
              </div>
            </div>

            {/* more like this */}
            <motion.section variants={block} className="mt-14 border-t border-white/10 pt-8">
              <h3 className="mb-4 font-sans text-lg font-semibold text-bone">More Originals</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {more.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    data-cursor="view"
                    onClick={() => onSwitch(p)}
                    className="group relative aspect-video overflow-hidden rounded-xl text-left ring-1 ring-white/10 transition hover:ring-white/30"
                  >
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                      <ProjectArt project={p} />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-mist">{p.genre}</p>
                      <p className="font-display text-3xl leading-none tracking-wide text-bone">{p.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.section>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
