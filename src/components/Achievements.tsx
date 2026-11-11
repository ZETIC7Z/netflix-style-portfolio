import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { achievements, certifications } from '../data/portfolio';
import { EASE, SectionHeading, Tilt } from './fx';
import { RailButtons } from './Rail';

function Laurel({ side }: { side: 'l' | 'r' }) {
  return (
    <svg viewBox="0 0 30 64" className={`h-14 w-auto text-[#d9b46a] ${side === 'r' ? '-scale-x-100' : ''}`} aria-hidden>
      <path d="M26 62C10 52 4 36 8 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      {[10, 18, 26, 34, 42, 50].map((y, i) => (
        <ellipse key={y} cx={i < 2 ? 9 : 8 + i * 1.6} cy={y} rx="5" ry="2.2" fill="currentColor" opacity="0.85" transform={`rotate(-40 ${8 + i * 1.6} ${y})`} />
      ))}
    </svg>
  );
}

const PAGE_SIZE = 5;

export default function Achievements() {
  const rail = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(achievements.length / PAGE_SIZE);
  const visibleMoments = achievements.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const prevPage = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const nextPage = () => setPage((p) => (p + 1) % totalPages);

  const issuers = Array.from(new Set(certifications.map((c) => c.issuer)));

  return (
    <>
      <SectionHeading
        kicker="Awards & Flagship Launches · Newest First"
        title="Top Moments"
        aside={
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mist">
              Page {page + 1} / {totalPages} · {achievements.length} Milestones
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-sfx="whoosh"
                onClick={prevPage}
                aria-label="Previous top moments"
                className="flex h-10 items-center gap-1.5 rounded-full border border-[#d9b46a]/40 bg-ink-2 px-4 text-xs font-bold uppercase tracking-[0.16em] text-bone transition hover:border-[#d9b46a] hover:bg-[#d9b46a]/15 hover:text-white"
              >
                <span className="text-base leading-none text-[#d9b46a]">‹</span> Prev
              </button>
              <button
                type="button"
                data-sfx="whoosh"
                onClick={nextPage}
                aria-label="Next top moments"
                className="flex h-10 items-center gap-1.5 rounded-full border border-[#d9b46a]/40 bg-ink-2 px-4 text-xs font-bold uppercase tracking-[0.16em] text-bone transition hover:border-[#d9b46a] hover:bg-[#d9b46a]/15 hover:text-white"
              >
                Next <span className="text-base leading-none text-[#d9b46a]">›</span>
              </button>
            </div>
          </div>
        }
      />

      <div className="group/moments relative">
        {/* Side-to-side Previous & Next floating buttons */}
        <button
          type="button"
          data-sfx="whoosh"
          onClick={prevPage}
          aria-label="Previous top moments page"
          className="absolute left-2 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#d9b46a]/50 bg-ink/90 text-2xl font-bold text-[#d9b46a] shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-md transition hover:scale-110 hover:border-[#d9b46a] hover:bg-[#d9b46a] hover:text-ink sm:left-4"
        >
          ‹
        </button>
        <button
          type="button"
          data-sfx="whoosh"
          onClick={nextPage}
          aria-label="Next top moments page"
          className="absolute right-2 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#d9b46a]/50 bg-ink/90 text-2xl font-bold text-[#d9b46a] shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-md transition hover:scale-110 hover:border-[#d9b46a] hover:bg-[#d9b46a] hover:text-ink sm:right-4"
        >
          ›
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={`moments-page-${page}`}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="gutter grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 [perspective:1400px]"
          >
            {visibleMoments.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
              >
                <Tilt max={8} className="group h-full rounded-2xl">
                  <article className="relative flex h-full min-h-[410px] flex-col items-center overflow-hidden rounded-2xl bg-[radial-gradient(120%_80%_at_50%_0%,#2a1f10,#0d0b08_60%,#07070a)] px-5 pb-6 pt-6 text-center ring-1 ring-[#d9b46a]/20 transition duration-500 group-hover:ring-[#d9b46a]/60">
                    <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d9b46a]/70 to-transparent" />
                    <div aria-hidden className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[#d9b46a]/10 blur-3xl transition duration-700 group-hover:bg-[#d9b46a]/25" />
                    {a.image && (
                      <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl ring-1 ring-[#d9b46a]/30">
                        <img
                          src={a.image}
                          alt={a.title}
                          decoding="async"
                          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
                      </div>
                    )}
                    <div className="relative flex items-center gap-1">
                      <Laurel side="l" />
                      <div className="px-1">
                        <p className="text-[9px] font-bold uppercase leading-tight tracking-[0.24em] text-[#d9b46a]">{a.laurel}</p>
                      </div>
                      <Laurel side="r" />
                    </div>
                    <h3 className="relative mt-4 font-display text-[1.75rem] leading-[0.94] tracking-wide text-bone">{a.title}</h3>
                    <p className="relative mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d9b46a]">{a.org}</p>
                    <p className="relative mt-3 text-[13px] leading-relaxed text-bone/75">{a.detail}</p>
                    {a.link && (
                      <a
                        href={a.link}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="link"
                        className="relative mt-auto inline-flex min-h-10 items-center gap-1 pt-4 text-xs font-semibold tracking-wide text-bone underline decoration-[#d9b46a]/60 underline-offset-4 hover:decoration-[#d9b46a]"
                      >
                        View credential / live proof ↗
                      </a>
                    )}
                  </article>
                </Tilt>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Page dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              data-sfx="whoosh"
              onClick={() => setPage(idx)}
              aria-label={`Go to Top Moments page ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === page ? 'w-8 bg-[#d9b46a]' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* certifications rail */}
      <div className="mt-16">
        <div className="gutter mb-2 flex flex-wrap items-end justify-between gap-2">
          <h3 className="font-sans text-lg font-semibold text-bone sm:text-2xl">
            Certified <span className="text-mist">· {certifications.length} credentials</span>
          </h3>
          <p className="text-xs text-smoke">{issuers.join(' · ')}</p>
        </div>
        <div className="group/rail relative">
          <div ref={rail} className="rail gutter flex snap-x gap-4 overflow-x-auto py-5">
            {certifications.map((c, i) => (
              <motion.a
                key={c.name}
                href={c.link}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                className="group relative flex w-[280px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-xl bg-ink-2 ring-1 ring-white/10 transition hover:-translate-y-1 hover:ring-crimson-2/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.04, ease: EASE }}
              >
                {c.image && (
                  <div className="relative aspect-video w-full overflow-hidden border-b border-white/10">
                    <img
                      src={c.image}
                      alt={c.name}
                      decoding="async"
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-black/20" />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-crimson-2">{c.issuer}</span>
                    <span className="text-sm text-smoke transition group-hover:text-bone">↗</span>
                  </div>
                  <p className="mt-3 text-sm font-medium leading-snug text-bone">{c.name}</p>
                </div>
              </motion.a>
            ))}
          </div>
          <RailButtons rail={rail} />
        </div>
      </div>
    </>
  );
}
