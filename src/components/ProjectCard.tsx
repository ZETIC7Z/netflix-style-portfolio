import { motion } from 'framer-motion';
import type { Project } from '../data/portfolio';
import { EASE, Tilt } from './fx';
import { ProjectArt } from './Poster';

export default function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  return (
    <motion.article
      className="w-[84vw] shrink-0 snap-start sm:w-[62vw] lg:w-[46vw] xl:w-[42vw]"
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px -10% 0px 0px' }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: EASE }}
    >
      <Tilt max={5} className="group rounded-2xl">
        <div
          role="button"
          tabIndex={0}
          data-cursor="view"
          onClick={onOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpen();
            }
          }}
          aria-label={`Open ${project.title}`}
          className="focus-ring relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10 transition duration-500 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] group-hover:ring-white/25 sm:aspect-[16/12] lg:aspect-auto lg:h-[66vh]"
        >
          <motion.div layoutId={`art-${project.id}`} className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-cine)] group-hover:scale-[1.07]">
              <ProjectArt project={project} />
            </div>
          </motion.div>

          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 backdrop-blur-sm sm:left-7 sm:top-7">
            <img src="/zeticuz-logo.svg" alt="ZETICUZ" className="h-4 w-auto object-contain" />
            <span className="text-[10px] font-bold tracking-[0.34em] text-bone/90">ORIGINAL</span>
          </div>
          <div className="absolute right-5 top-5 flex items-center gap-2 sm:right-7 sm:top-7">
            <span className="flex items-center gap-1.5 rounded-full border border-crimson-2/50 bg-black/65 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bone backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-crimson-2" />
              1-Min Trailer
            </span>
            <span className="rounded border border-white/30 bg-black/55 px-1.5 py-0.5 text-[10px] font-bold text-bone backdrop-blur-sm">{project.year}</span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 [transform:translateZ(40px)]">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-mist drop-shadow">{project.genre}</p>
            <motion.h3 layoutId={`title-${project.id}`} className="font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.88] tracking-wide text-bone drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              {project.title}
            </motion.h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/85 drop-shadow sm:text-[15px]">{project.logline}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.map((t) => (
                <span key={t} className="rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-bone/95 backdrop-blur">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="flex min-h-11 items-center gap-2 rounded-md bg-bone px-5 text-sm font-bold text-ink transition group-hover:bg-white">▶ Watch Trailer & Info</span>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  onClick={(e) => e.stopPropagation()}
                  className="flex min-h-11 items-center gap-2 rounded-md border border-crimson-2/50 bg-crimson/25 px-4 text-sm font-semibold text-bone backdrop-blur transition hover:border-crimson-2 hover:bg-crimson/40"
                >
                  Live Site ↗
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  onClick={(e) => e.stopPropagation()}
                  className="flex min-h-11 items-center gap-2 rounded-md border border-white/25 bg-black/30 px-4 text-sm font-semibold text-bone backdrop-blur transition hover:border-bone"
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.article>
  );
}
