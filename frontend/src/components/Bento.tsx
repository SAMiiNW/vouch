'use client';

import { motion } from 'framer-motion';
import {
  Plus,
  Users,
  MessageSquareQuote,
  ShieldCheck,
  ShieldQuestion,
  ShieldAlert,
  Clock,
  UserPlus,
  ArrowDown,
  ArrowUpRight,
} from 'lucide-react';
import { TrustRadar } from './TrustRadar';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';
import { shortAddr, rulingLabel, rulingText } from '@/lib/format';
import type { Profile } from '@/lib/contract';

interface Derived {
  total: number;
  open: number;
  vouched: number;
  trusted: number;
  mixed: number;
  unverified: number;
  avgCredibility: number;
}

interface Props {
  onOpen: () => void;
  onVouch: (p: Profile) => void;
  derived: Derived;
  vouchTotal: number;
  featured: Profile | null;
  loading: boolean;
}

const MINI_STEPS = [
  { icon: UserPlus, label: 'Open', text: 'State a handle and what you want vouched for.' },
  { icon: MessageSquareQuote, label: 'Vouch', text: 'A peer attests with concrete evidence.' },
  { icon: ShieldCheck, label: 'Settle', text: 'Validators re-run the assessor and seal it.' },
];

const RULING_ICON: Record<string, typeof ShieldCheck> = {
  TRUSTED: ShieldCheck,
  MIXED: ShieldQuestion,
  UNVERIFIED: ShieldAlert,
};

function StatTile({
  icon: Icon,
  value,
  label,
  delay,
}: {
  icon: typeof Users;
  value: number;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="neu flex flex-col justify-between rounded-soft p-6"
    >
      <span className="neu-sm flex h-11 w-11 items-center justify-center rounded-2xl">
        <Icon size={19} className="text-peri-deep" />
      </span>
      <div className="mt-6">
        <div className="tabular font-display text-4xl font-extrabold leading-none text-ink">{value}</div>
        <div className="uplabel mt-2 text-ink-faint">{label}</div>
      </div>
    </motion.div>
  );
}

export function Bento({ onOpen, onVouch, derived, vouchTotal, featured, loading }: Props) {
  const featuredVouched = featured?.status === 'VOUCHED';
  const FeaturedIcon = featuredVouched
    ? RULING_ICON[featured?.ruling ?? ''] ?? ShieldQuestion
    : Clock;
  const featuredAccent = featuredVouched
    ? rulingText[featured?.ruling ?? ''] ?? 'text-ink-soft'
    : 'text-peri-deep';

  return (
    <section id="top" className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
      <div className="mx-auto grid max-w-7xl auto-rows-auto grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {/* DOMINANT TILE: brand + one-line description + primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="neu relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-8 sm:col-span-2 sm:p-10 lg:col-span-4 lg:row-span-2"
        >
          <div>
            <span className="neu-sm inline-flex items-center gap-2 rounded-pill px-4 py-2 font-mono text-peri-deep">
              <ShieldCheck size={14} />
              <span className="uplabel">Reputation, settled by consensus</span>
            </span>
            <h1 className="mt-8 font-display text-[clamp(2.4rem,5.5vw,4.4rem)] font-extrabold leading-[0.96] tracking-tight text-ink">
              vouch
            </h1>
            <p className="mt-5 max-w-lg font-body text-lg leading-relaxed text-ink-soft">
              Open a profile, let peers attest with real evidence, and an injection-resistant AI
              assessor rules trusted, mixed, or unverified with a credibility score that every
              validator re-runs before it settles on-chain.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onOpen}
              className="focus-ring flex items-center gap-2 rounded-pill accent-grad px-7 py-4 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus size={18} /> Open a profile
            </button>
            <a
              href="#registry"
              className="neu-sm focus-ring flex items-center gap-2 rounded-pill px-7 py-4 font-mono text-sm font-semibold uppercase tracking-wider text-ink transition-transform hover:-translate-y-0.5"
            >
              See the feed <ArrowDown size={16} />
            </a>
          </div>
        </motion.div>

        {/* RADAR + AVG SCORE TILE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="neu relative flex flex-col rounded-[2rem] p-6 sm:col-span-2 lg:col-span-2 lg:row-span-2"
        >
          <span className="uplabel font-mono text-ink-faint">Network trust radar</span>
          <div className="relative mt-4 flex-1">
            <div className="well h-full min-h-[13rem] w-full rounded-[1.5rem]">
              <TrustRadar />
            </div>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="block font-display text-5xl font-extrabold accent-text">
                {derived.avgCredibility || '\u2013'}
              </span>
              <span className="uplabel mt-1 block text-ink-faint">avg score</span>
            </span>
          </div>
          <div className="mt-5 flex items-center justify-between font-mono text-xs text-ink-soft">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full accent-grad" /> {derived.trusted} trusted
            </span>
            <span>{derived.vouched} ruled</span>
          </div>
        </motion.div>

        {/* THREE STAT TILES */}
        <StatTile icon={Users} value={derived.total} label="Profiles" delay={0.15} />
        <StatTile icon={MessageSquareQuote} value={vouchTotal} label="Vouches" delay={0.2} />
        <StatTile icon={ShieldCheck} value={derived.trusted} label="Trusted" delay={0.25} />

        {/* HOW IT WORKS, CONDENSED */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="neu rounded-soft p-7 sm:col-span-2 lg:col-span-3"
        >
          <span className="uplabel font-mono text-peri-deep">How it works</span>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {MINI_STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="well rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-peri-deep" />
                    <span className="tabular font-mono text-xs font-semibold text-ink-faint">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-2 font-display text-sm font-bold tracking-tight text-ink">{s.label}</p>
                  <p className="mt-1 font-body text-xs leading-relaxed text-ink-soft">{s.text}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* FEATURED / MOST RECENT PROFILE */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="neu flex flex-col rounded-soft p-7 sm:col-span-2 lg:col-span-3"
        >
          <div className="flex items-center justify-between">
            <span className="uplabel font-mono text-peri-deep">Most recent profile</span>
            <a
              href="#registry"
              className="focus-ring flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-ink-faint hover:text-peri-deep"
            >
              All <ArrowUpRight size={12} />
            </a>
          </div>

          {loading ? (
            <div className="mt-5 flex-1">
              <div className="h-6 w-2/3 animate-pulse rounded bg-base-deep" />
              <div className="mt-3 h-14 w-full animate-pulse rounded-xl bg-base-deep" />
            </div>
          ) : featured ? (
            <div className="mt-5 flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="neu-sm flex h-10 w-10 items-center justify-center rounded-xl">
                    <FeaturedIcon size={18} className={featuredAccent} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-bold tracking-tight text-ink">
                      {featured.handle}
                    </p>
                    <span className={`font-mono text-[11px] font-semibold uppercase tracking-wider ${featuredAccent}`}>
                      {featuredVouched ? rulingLabel[featured.ruling] : 'Awaiting a vouch'}
                    </span>
                  </div>
                </div>
                {featuredVouched && (
                  <div className="text-right">
                    <div className={`tabular font-display text-3xl font-extrabold ${featuredAccent}`}>
                      {featured.credibility}
                    </div>
                    <div className="uplabel text-ink-faint">score</div>
                  </div>
                )}
              </div>
              <p className="mt-4 line-clamp-2 font-body text-sm leading-relaxed text-ink-soft">
                {featured.claim}
              </p>
              <button
                type="button"
                onClick={() => onVouch(featured)}
                className="neu-sm focus-ring mt-auto flex items-center justify-center gap-2 self-start rounded-pill px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-peri-deep transition-transform hover:-translate-y-0.5"
              >
                <MessageSquareQuote size={14} /> Vouch for this
              </button>
            </div>
          ) : (
            <div className="mt-5 flex flex-1 flex-col items-start justify-center">
              <p className="font-body text-sm text-ink-soft">
                No profiles yet. Open the first one and let peers attest to it.
              </p>
              <button
                type="button"
                onClick={onOpen}
                className="focus-ring mt-4 flex items-center gap-2 rounded-pill accent-grad px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5"
              >
                <UserPlus size={14} /> Open the first
              </button>
            </div>
          )}

          <div className="mt-5 flex items-center gap-2 border-t border-ink-faint/15 pt-4 font-mono text-[11px] text-ink-faint">
            <a
              href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring hover:text-peri-deep"
            >
              Contract {shortAddr(CONTRACT_ADDRESS)}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
