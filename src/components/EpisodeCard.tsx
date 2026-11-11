import { motion } from 'framer-motion';
import type { Episode } from '../data/portfolio';
import { EASE, Tilt } from './fx';
import { PosterBackdrop } from './Poster';

export default function EpisodeCard({ episode, index }: { episode: Episode; index: number }) {
  const [season, ep] = episode.code.split(' ');
  return (
    <motion.article
      className="w-[80vw] shrink-0 snap-start sm:w-[52vw] md:w-[38vw] lg:w-[30vw] xl:w-[26vw]"
      initial={{ opacity: 0, y: 30, rotateY: -8 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
    >
      <Tilt max={7} className="group h-full rounded-xl">
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-ink-2 ring-1 ring-white/10 transition duration-500 group-hover:ring-crimson-2/60">
          <div className="relative aspect-video overflow-hidden border-b border-white/[0.08]">
            <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-cine)] group-hover:scale-105">
              <PosterBackdrop palette={episode.palette}>
                {episode.image && (
                  <>
                    <img
                      src={episode.image}
                      alt={episode.title}
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover object-center opacity-95 transition-opacity duration-500 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-black/25" />
                  </>
                )}
              </PosterBackdrop>
            </div>
            <div className="absolute left-3.5 top-3 flex items-center gap-2">
              <span className="rounded bg-black/75 px-2 py-0.5 text-[10px] font-bold tracking-[0.2em] text-bone ring-1 ring-white/15 backdrop-blur">
                {season}
              </span>
              <span className="rounded bg-crimson/85 px-2 py-0.5 text-[10px] font-bold tracking-[0.18em] text-white backdrop-blur">
                EPISODE {ep.replace('E', '')}
              </span>
            </div>
            <span className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-black/60 text-[10px] text-bone backdrop-blur transition group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
              ▶
            </span>
          </div>
          <div className="flex flex-1 flex-col p-4">
            <div className="mb-1.5 flex items-center justify-between text-[11px] text-smoke">
              <span className="font-semibold text-crimson-2">{episode.runtime}</span>
            </div>
            <h4 className="mb-2 font-sans text-base font-bold leading-snug tracking-tight text-bone sm:text-lg">
              {episode.title}
            </h4>
            <p className="text-sm leading-relaxed text-bone/80">{episode.description}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
              {episode.tags.map((t) => (
                <span key={t} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-mist">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.article>
  );
}
