'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ShieldQuestion, ShieldAlert, Users, MessageSquareQuote } from 'lucide-react';
import { TrustRadar } from './TrustRadar';

interface Derived {
  total: number;
  open: number;
  vouched: number;
  trusted: number;
  mixed: number;
  unverified: number;
  avgCredibility: number;
}

/**
 * The central hub of the constellation: an extruded round core with the radar
 * motif pulsing inside and the average credibility at its center. Ruling tallies
 * float as small chips wired into its rim. Every trust-cord terminates here.
 */
export function AssessorCore({
  derived,
  vouchTotal,
  loading,
}: {
  derived: Derived;
  vouchTotal: number;
  loading: boolean;
}) {
  const chips = [
    { icon: Users, label: 'Profiles', value: derived.total, accent: 'text-peri-deep' },
    { icon: MessageSquareQuote, label: 'Vouches', value: vouchTotal, accent: 'text-peri-deep' },
    { icon: ShieldCheck, label: 'Trusted', value: derived.trusted, accent: 'text-trusted' },
    { icon: ShieldQuestion, label: 'Mixed', value: derived.mixed, accent: 'text-mixed' },
    { icon: ShieldAlert, label: 'Unverified', value: derived.unverified, accent: 'text-unverified' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center"
    >
      <span className="neu-sm mb-3 inline-flex items-center gap-2 rounded-pill px-3.5 py-1.5 font-mono text-peri-deep">
        <span className={`h-1.5 w-1.5 rounded-full ${loading ? 'bg-ink-faint' : 'accent-grad'}`} />
        <span className="uplabel">Assessor core</span>
      </span>

      <div className="neu relative flex h-52 w-52 items-center justify-center rounded-full sm:h-60 sm:w-60">
        <div className="well absolute inset-4 overflow-hidden rounded-full">
          <TrustRadar />
        </div>
        <span className="relative z-10 text-center">
          <span className="block font-display text-5xl font-extrabold accent-text">
            {derived.avgCredibility || '\u2013'}
          </span>
          <span className="uplabel mt-1 block text-ink-faint">avg score</span>
        </span>
      </div>

      <p className="mt-4 max-w-xs text-center font-body text-[13px] leading-relaxed text-ink-soft">
        An injection-resistant AI assessor weighs peer evidence and rules trusted, mixed, or
        unverified, re-run by every validator to consensus.
      </p>

      {/* ruling tallies wired into the rim */}
      <div className={`mt-5 flex flex-wrap items-center justify-center gap-2.5 ${loading ? 'opacity-60' : ''}`}>
        {chips.map((c) => {
          const Icon = c.icon;
          return (
            <span
              key={c.label}
              className="neu-sm flex items-center gap-2 rounded-pill px-3 py-2 font-mono"
            >
              <Icon size={14} className={c.accent} />
              <span className="tabular font-display text-sm font-extrabold text-ink">{c.value}</span>
              <span className="uplabel text-ink-faint">{c.label}</span>
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}
