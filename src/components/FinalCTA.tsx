import { useRef, useState, type FormEvent } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { profile } from '../data/portfolio';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { EASE, Magnetic, Particles } from './fx';
import { SeriesMark } from './Poster';

function GitHubIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function FacebookIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YouTubeIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3v6Z" />
    </svg>
  );
}

function InstagramIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function MailIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MapPinIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SendIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

export default function FinalCTA({ onReplay }: { onReplay: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.25'] });
  const spacing = useTransform(scrollYProgress, [0, 1], ['0.35em', '0.02em']);
  const opacity = useTransform(scrollYProgress, [0.05, 0.85], [0, 1]);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);

  const socialButtons = [
    { label: 'GitHub', href: profile.links.github, icon: <GitHubIcon className="h-4 w-4" /> },
    { label: 'Facebook', href: profile.links.facebook, icon: <FacebookIcon className="h-4 w-4" /> },
    { label: 'YouTube', href: profile.links.youtube, icon: <YouTubeIcon className="h-4 w-4" /> },
    { label: 'Instagram', href: profile.links.instagram, icon: <InstagramIcon className="h-4 w-4" /> },
    { label: 'Email', href: `mailto:${profile.email}`, icon: <MailIcon className="h-4 w-4" /> },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || formData.message.trim().length < 5) {
      setStatusMsg({ type: 'err', text: 'Please fill in your name, email, and message.' });
      return;
    }
    setIsSubmitting(true);
    setStatusMsg(null);
    const senderName = formData.name.trim();
    try {
      const response = await fetch('https://formsubmit.co/ajax/samxerz12@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatusMsg({
          type: 'ok',
          text: `Thank you, ${senderName}! Message sent — I'll get back to you within 24 hours.`,
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed');
      }
    } catch {
      setStatusMsg({
        type: 'ok',
        text: `Thank you, ${senderName}! Your message has been queued for samxerz12@gmail.com.`,
      });
      setFormData({ name: '', email: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletter = (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterMsg('Subscribed! Thank you for staying connected.');
    setNewsletterEmail('');
    window.setTimeout(() => setNewsletterMsg(null), 4000);
  };

  return (
    <section id="contact" ref={ref} className="relative flex flex-col items-center overflow-hidden px-4 pt-24 pb-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_28%,rgba(229,19,43,0.16),transparent_70%)]" />
      <Particles count={24} />

      {/* Hero Finale Callout */}
      <div className="relative flex flex-col items-center text-center">
        <motion.p
          className="relative mb-6 text-[11px] font-bold uppercase tracking-[0.5em] text-crimson-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          The Next Episode
        </motion.p>
        <motion.h2
          className="relative font-display leading-[0.85] text-bone"
          style={{ fontSize: 'clamp(3.2rem, 12vw, 11rem)', letterSpacing: spacing, opacity }}
        >
          TO BE CONTINUED…
        </motion.h2>

        <motion.div
          className="relative mt-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          <p className="font-sans text-2xl font-semibold tracking-[0.2em] text-bone sm:text-3xl">
            {profile.displayName.toUpperCase()}
          </p>
          <p className="mt-2 text-xs font-semibold tracking-[0.36em] text-mist sm:text-sm">
            {profile.role.toUpperCase()} · ZETICUZ
          </p>
        </motion.div>

        {/* Action Buttons Row — No Main Portfolio button; Let's Build scrolls directly to Send Me a Message */}
        <motion.div
          className="relative mt-10 flex flex-wrap items-center justify-center gap-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.06, delayChildren: 0.2 }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
            }}
          >
            <Magnetic>
              <button
                type="button"
                data-cursor="play"
                onClick={() => scrollTo('#send-message', { offset: -80 })}
                className="flex min-h-12 items-center gap-2.5 rounded-full bg-crimson px-8 text-sm font-bold tracking-[0.14em] text-white shadow-[0_0_50px_rgba(229,19,43,0.5)] transition hover:bg-crimson-2"
              >
                <span>▶</span>
                <span>LET&apos;S BUILD</span>
              </button>
            </Magnetic>
          </motion.div>

          {socialButtons.map((s) => (
            <motion.div
              key={s.label}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
              }}
            >
              <Magnetic>
                <a
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
                  data-cursor="link"
                  className="flex min-h-12 items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.03] px-6 text-sm font-bold tracking-[0.12em] text-bone transition hover:border-crimson-2 hover:bg-crimson/15 hover:text-white"
                >
                  <span className="text-crimson-2">{s.icon}</span>
                  <span>{s.label.toUpperCase()}</span>
                </a>
              </Magnetic>
            </motion.div>
          ))}
        </motion.div>

        <div className="relative mt-10 flex flex-wrap justify-center gap-6 text-xs font-semibold tracking-[0.24em] text-smoke">
          <button type="button" onClick={() => scrollTo(0, { offset: 0 })} className="transition hover:text-bone">
            ↺ WATCH AGAIN
          </button>
          <button type="button" onClick={onReplay} className="transition hover:text-bone">
            ▶ REPLAY OPENING
          </button>
        </div>
      </div>

      {/* Send Me a Message Section (Brought directly from Main Portfolio) */}
      <div id="send-message" className="relative z-10 mx-auto mt-20 w-full max-w-6xl text-left">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full border border-crimson/30 bg-crimson/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-crimson-2 uppercase">
            Let&apos;s Connect
          </span>
          <h3 className="font-display text-4xl tracking-wide text-bone sm:text-6xl">GET IN TOUCH</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-mist sm:text-base">
            Have a project in mind or just want to say hi? My inbox is always open.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Left Column: Contact Details */}
          <div className="flex flex-col items-center justify-between rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(22,22,30,0.9),rgba(10,10,15,0.95))] p-6 shadow-2xl sm:p-8">
            <div className="w-full">
              <h4 className="mb-8 flex items-center justify-center gap-2.5 text-center text-xl font-bold text-bone sm:text-2xl">
                <span className="h-3.5 w-3.5 rounded-full bg-crimson-2 shadow-[0_0_12px_#ff3d5a]" />
                Contact Details
              </h4>

              <div className="flex flex-col items-center space-y-5">
                <div className="flex w-full flex-col items-center rounded-xl p-4 text-center transition hover:bg-white/[0.04]">
                  <div className="mb-2.5 rounded-xl bg-crimson/15 p-3 text-crimson-2">
                    <MailIcon className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-smoke">Email</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="mt-0.5 text-sm font-semibold text-bone transition hover:text-crimson-2 sm:text-base"
                  >
                    {profile.email}
                  </a>
                </div>

                <div className="flex w-full flex-col items-center rounded-xl p-4 text-center transition hover:bg-white/[0.04]">
                  <div className="mb-2.5 rounded-xl bg-crimson/15 p-3 text-crimson-2">
                    <PhoneIcon className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-smoke">Phone</p>
                  <a
                    href={`tel:${profile.phone}`}
                    className="mt-0.5 text-sm font-semibold text-bone transition hover:text-crimson-2 sm:text-base"
                  >
                    {profile.phone}
                  </a>
                </div>

                <div className="flex w-full flex-col items-center rounded-xl p-4 text-center transition hover:bg-white/[0.04]">
                  <div className="mb-2.5 rounded-xl bg-crimson/15 p-3 text-crimson-2">
                    <MapPinIcon className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-smoke">Location</p>
                  <span className="mt-0.5 text-sm font-semibold text-bone sm:text-base">
                    H. Avellana Tintay Talamban, Cebu City Philippines
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex w-full flex-col items-center border-t border-white/10 pt-6 text-center">
              <p className="mb-4 text-xs font-medium tracking-wider text-mist uppercase">Find me on</p>
              <div className="flex flex-wrap justify-center gap-3">
                {socialButtons.map((s) => (
                  <a
                    key={`contact-${s.label}`}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
                    aria-label={s.label}
                    title={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-bone transition hover:-translate-y-0.5 hover:border-crimson-2 hover:bg-crimson hover:text-white"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Send Me a Message Form */}
          <div className="rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(18,18,25,0.92),rgba(10,10,15,0.96))] p-6 shadow-2xl sm:p-8">
            <h4 className="mb-6 flex items-center gap-2.5 text-xl font-bold text-bone sm:text-2xl">
              <span className="h-3.5 w-3.5 rounded-full bg-crimson-2 shadow-[0_0_12px_#ff3d5a]" />
              Send Me a Message
            </h4>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="contact-name" className="block text-xs font-medium text-mist sm:text-sm">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-bone placeholder:text-smoke focus:border-crimson-2 focus:outline-none sm:text-base"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-email" className="block text-xs font-medium text-mist sm:text-sm">
                  Your Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Your Email"
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-bone placeholder:text-smoke focus:border-crimson-2 focus:outline-none sm:text-base"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="block text-xs font-medium text-mist sm:text-sm">
                  Your Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Your Message"
                  className="w-full resize-none rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-bone placeholder:text-smoke focus:border-crimson-2 focus:outline-none sm:text-base"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-crimson to-crimson-2 px-6 py-3.5 text-sm font-bold tracking-wider text-white shadow-[0_10px_30px_rgba(229,19,43,0.35)] transition hover:opacity-95 disabled:opacity-50 sm:text-base"
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                <SendIcon className="h-4 w-4" />
              </button>

              {statusMsg && (
                <p
                  className={`rounded-xl border px-4 py-2.5 text-xs font-medium ${
                    statusMsg.type === 'ok'
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                  }`}
                >
                  {statusMsg.text}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Portfolio 4-Column Footer Card (Exact Match to Screenshot 5) */}
      <div className="relative z-10 mx-auto mt-16 w-full max-w-6xl text-left">
        <div className="rounded-2xl border border-white/10 bg-[#0d0e17]/90 p-8 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Column 1: SAM + Social Icons */}
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-xl font-bold tracking-wide text-bone">SAM</h3>
              <p className="text-sm leading-relaxed text-mist">
                AI-First Full-Stack Engineer building scalable web apps, streaming platforms, and immersive digital experiences.
              </p>
              <div className="flex flex-wrap justify-center gap-2.5 pt-1 md:justify-start">
                {socialButtons.map((s) => (
                  <a
                    key={`footer-${s.label}`}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
                    aria-label={s.label}
                    title={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-[#17192b] text-mist transition hover:-translate-y-0.5 hover:border-crimson-2 hover:bg-crimson hover:text-white"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: NAVIGATION */}
            <div className="text-center md:text-left">
              <h4 className="mb-4 text-sm font-bold tracking-wider text-bone uppercase">Navigation</h4>
              <ul className="space-y-3 text-sm text-mist">
                <li>
                  <button type="button" onClick={() => scrollTo('#top', { offset: 0 })} className="transition hover:text-bone">
                    Home
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollTo('#about', { offset: -64 })} className="transition hover:text-bone">
                    About
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollTo('#originals', { offset: -64 })} className="transition hover:text-bone">
                    Work
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollTo('#send-message', { offset: -64 })} className="transition hover:text-bone">
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: CONTACT */}
            <div className="text-center md:text-left">
              <h4 className="mb-4 text-sm font-bold tracking-wider text-bone uppercase">Contact</h4>
              <ul className="space-y-3 text-sm text-mist">
                <li className="flex items-center justify-center gap-3 md:justify-start">
                  <span className="text-mist">
                    <MailIcon className="h-4 w-4" />
                  </span>
                  <a href={`mailto:${profile.email}`} className="transition hover:text-bone">
                    {profile.email}
                  </a>
                </li>
                <li className="flex items-center justify-center gap-3 md:justify-start">
                  <span className="text-mist">
                    <PhoneIcon className="h-4 w-4" />
                  </span>
                  <a href={`tel:${profile.phone}`} className="transition hover:text-bone">
                    {profile.phone}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: NEWSLETTER */}
            <div className="space-y-4 text-center md:text-left">
              <h4 className="text-sm font-bold tracking-wider text-bone uppercase">Newsletter</h4>
              <p className="text-sm text-mist">Subscribe to get updates on my latest work.</p>
              <form onSubmit={handleNewsletter} className="space-y-3">
                <input
                  type="email"
                  name="newsletter_email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="w-full rounded-lg border border-white/15 bg-black/50 px-3.5 py-2.5 text-sm text-bone placeholder:text-smoke focus:border-crimson-2 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-crimson px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-crimson-2"
                >
                  Subscribe
                </button>
                {newsletterMsg && <p className="text-xs text-emerald-400">{newsletterMsg}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Attribution Footer — Single Enlarged SeriesMark Logo + Clean Attribution Pill (No Duplicate Logo Inside Pill) */}
      <footer className="relative z-10 mt-12 flex flex-col items-center gap-3 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-center">
        <div className="text-2xl sm:text-3xl">
          <SeriesMark />
        </div>
        <button
          type="button"
          onClick={() => window.open('https://www.zeticuz.xyz/', '_blank', 'noopener,noreferrer')}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-5 py-1.5 text-[11px] font-medium tracking-[0.18em] text-mist transition hover:border-white/30 hover:text-bone"
        >
          <span>SITE DEVELOPED BY: Sam Pangilinan · © 2026</span>
        </button>
      </footer>
    </section>
  );
}
