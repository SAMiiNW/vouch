'use client';

import { motion } from 'framer-motion';
import { Plus, ArrowDown } from 'lucide-react';
import { TrustRadar } from './TrustRadar';
import { CONTRACT_ADDRESS, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr } from '@/lib/format';
import { CopyButton } from './CopyButton';

interface Props {
  onOpen: () => void;
  stats: { total: number; vouched: number; trusted: number; avgCredibility: number } | null;
}

export function Hero({ onOpen, stats }: Props) {
  const trustRate = stats && stats.vouched ? Math.round((stats.trusted / stats.vouched) * 100) : null;

  return (
    <section id="top" className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pt-36">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* left: kicker stack headline */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="neu-sm inline-flex items-center gap-2 rounded-pill px-4 py-2 font-mono text-xs text-peri-deep"
          >
            <span className="uplabel">On-chain reputation attestation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-7 font-display text-[clamp(2.6rem,6.5vw,5.3rem)] font-extrabold leading-[0.98] tracking-tight text-ink"
          >
            Reputation you
            <br />
            can <span className="accent-text">actually</span> trust.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-6 max-w-xl font-body text-lg leading-relaxed text-ink-soft"
          >
            Open a profile for what you want to be known for. Peers vouch with real evidence, and an
            injection-resistant AI assessor weighs each attestation, ruling trusted, mixed, or
            unverified with a credibility score. Every validator re-runs the call before it settles
            on-chain. No stake, no custody.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
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
              Browse the registry <ArrowDown size={16} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-ink-faint"
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full accent-grad" /> Attesting on Bradbury
            </span>
            <span className="flex items-center gap-2">
              {shortAddr(CONTRACT_ADDRESS)}
              <CopyButton value={CONTRACT_ADDRESS} label="Copy contract address" />
            </span>
            <a href={FAUCET} target="_blank" rel="noopener noreferrer" className="focus-ring text-peri-deep hover:underline">
              Get test GEN to attest
            </a>
            <a
              href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring hover:text-ink"
            >
              View on explorer
            </a>
          </motion.div>
        </div>

        {/* right: trust radar + vertical trust-meter rail */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex items-center justify-center gap-6"
        >
          <div className="neu relative aspect-square w-full max-w-md rounded-[2.5rem] p-6">
            <div className="well h-full w-full rounded-[2rem]">
              <TrustRadar />
            </div>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="block font-display text-4xl font-extrabold accent-text">
                {stats ? stats.avgCredibility || '\u2013' : '\u2013'}
              </span>
              <span className="uplabel mt-1 block text-ink-faint">avg score</span>
            </span>
          </div>

          {/* vertical trust-meter rail */}
          <div className="neu hidden w-24 flex-col items-center gap-4 rounded-pill px-3 py-6 sm:flex">
            <span className="uplabel text-ink-faint">trust</span>
            <div className="well relative h-56 w-7 overflow-hidden rounded-pill">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${trustRate ?? 0}%` }}
                transition={{ duration: 1.1, delay: 0.5, ease: 'easeOut' }}
                className="absolute bottom-0 w-full accent-grad"
              />
            </div>
            <span className="tabular font-display text-xl font-extrabold text-ink">
              {trustRate === null ? '\u2013' : `${trustRate}%`}
            </span>
            <span className="uplabel text-center text-ink-faint">trusted</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
