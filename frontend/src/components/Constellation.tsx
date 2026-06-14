'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PenLine, ExternalLink } from 'lucide-react';
import { AssessorCore } from './AssessorCore';
import { ProfileNode } from './ProfileNode';
import { FilterLens, type FilterKey } from './FilterLens';
import { SignalFeed } from './SignalFeed';
import { SystemPorts } from './SystemPorts';
import { TrustLattice } from './TrustLattice';
import { FieldSkeleton, FieldEmpty, FieldError } from './FieldStates';
import { EXPLORER } from '@/lib/contract';
import type { Profile, Attestation } from '@/lib/contract';

export type { FilterKey };

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
  profiles: Profile[];
  attestations: Attestation[];
  derived: Derived;
  vouchTotal: number;
  loading: boolean;
  error: string | null;
  filter: FilterKey;
  onFilter: (f: FilterKey) => void;
  onOpen: () => void;
  onVouch: (p: Profile) => void;
  onRetry: () => void;
  connected: boolean;
}

const WIDTHS = ['w-full'];

export function Constellation({
  profiles,
  attestations,
  derived,
  vouchTotal,
  loading,
  error,
  filter,
  onFilter,
  onOpen,
  onVouch,
  onRetry,
  connected,
}: Props) {
  const sorted = useMemo(() => [...profiles].sort((a, b) => b.index - a.index), [profiles]);
  const filtered = useMemo(() => {
    if (filter === 'ALL') return sorted;
    if (filter === 'OPEN') return sorted.filter((p) => p.status === 'OPEN');
    return sorted.filter((p) => p.status === 'VOUCHED' && p.ruling === filter);
  }, [sorted, filter]);

  const hasProfiles = !loading && !error && profiles.length > 0;

  return (
    <div className="mx-auto max-w-[88rem] pb-12">
      {/* ===== TOP BAND: intro (left) + assessor core (right) ===== */}
      <div className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="neu rounded-[1.8rem] p-7 sm:p-9"
        >
          <span className="neu-sm inline-flex items-center gap-2 rounded-pill px-3 py-1.5 font-mono text-peri-deep">
            <span className="uplabel">Trust constellation</span>
          </span>
          <h1 className="mt-5 font-display text-[clamp(2rem,3.4vw,3rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
            Reputation, wired by consensus
          </h1>
          <p className="mt-4 max-w-md font-body text-[15px] leading-relaxed text-ink-soft">
            Open a profile, let peers attest with real evidence, and watch the assessor rule each
            claim trusted, mixed, or unverified, every validator re-running it on-chain.
          </p>
          <button
            type="button"
            onClick={onOpen}
            className="focus-ring mt-7 flex items-center gap-2 rounded-pill accent-grad px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <PenLine size={16} /> Open a profile
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="neu flex items-center justify-center rounded-[1.8rem] p-7"
        >
          <AssessorCore derived={derived} vouchTotal={vouchTotal} loading={loading} />
        </motion.div>
      </div>

      {/* ===== FILTER LENS ROW ===== */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-extrabold tracking-tight text-ink">
          The registry
        </h2>
        <FilterLens filter={filter} onFilter={onFilter} derived={derived} />
      </div>

      {/* ===== PROFILE GRID ===== */}
      <div className="mt-6">
        {loading ? (
          <FieldSkeleton />
        ) : error ? (
          <FieldError message={error} onRetry={onRetry} />
        ) : profiles.length === 0 ? (
          <FieldEmpty onOpen={onOpen} />
        ) : filtered.length === 0 ? (
          <div className="neu rounded-[1.6rem] px-6 py-12 text-center font-body text-ink-soft">
            No profiles match this lens yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p, i) => (
              <ProfileNode
                key={p.id}
                profile={p}
                onVouch={onVouch}
                widthClass={WIDTHS[0]}
                floatDelay={(i % 5) * 0.4}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===== BOTTOM BAND: signal feed + trust lattice + system ports ===== */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {!loading && !error && attestations.length > 0 ? (
          <SignalFeed items={attestations} />
        ) : (
          <div className="neu rounded-[1.6rem] p-6 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
            Signal feed idle
          </div>
        )}
        <TrustLattice derived={derived} connected={connected} />
        <SystemPorts />
      </div>

      {/* ===== resource markers ===== */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={EXPLORER}
          target="_blank"
          rel="noopener noreferrer"
          className="neu-sm focus-ring flex items-center gap-1.5 rounded-pill px-3.5 py-2 font-mono text-[11px] text-ink-soft transition-colors hover:text-peri-deep"
        >
          View on explorer <ExternalLink size={11} />
        </a>
        <a
          href="https://docs.genlayer.com"
          target="_blank"
          rel="noopener noreferrer"
          className="neu-sm focus-ring flex items-center gap-1.5 rounded-pill px-3.5 py-2 font-mono text-[11px] text-ink-soft transition-colors hover:text-peri-deep"
        >
          GenLayer docs <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}
