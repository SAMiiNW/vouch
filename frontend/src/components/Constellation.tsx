'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PenLine } from 'lucide-react';
import { AssessorCore } from './AssessorCore';
import { ProfileNode } from './ProfileNode';
import { FilterLens, type FilterKey } from './FilterLens';
import { SignalFeed } from './SignalFeed';
import { SystemPorts } from './SystemPorts';
import { FieldSkeleton, FieldEmpty, FieldError } from './FieldStates';
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
}

// Core anchor (percentage of the field), deliberately offset left-of-center.
const CORE = { x: 39, y: 47 };
// Fixed satellite anchors at asymmetric corners.
const SAT = {
  intro: { x: 17, y: 13 },
  feed: { x: 83, y: 79 },
  ports: { x: 18, y: 85 },
};

const GOLDEN = 2.39996323; // golden angle in radians
const WIDTHS = ['w-[15rem]', 'w-[17rem]', 'w-[14.5rem]', 'w-[16rem]', 'w-[18rem]'];

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// phyllotaxis scatter around the core, elliptical and non-grid
function nodePos(i: number, n: number) {
  const spread = n <= 6 ? 11 : n <= 12 ? 9 : 7.4;
  const rad = 16 + spread * Math.sqrt(i + 0.6);
  const a = i * GOLDEN + 0.7;
  const x = clamp(CORE.x + Math.cos(a) * rad * 1.22, 8, 90);
  const y = clamp(CORE.y + Math.sin(a) * rad * 0.96, 11, 92);
  return { x, y };
}

// normalized (0..1000) quadratic cord with a soft perpendicular bow
function cord(x1: number, y1: number, x2: number, y2: number, bow = 0.16) {
  const ax = x1 * 10;
  const ay = y1 * 10;
  const bx = x2 * 10;
  const by = y2 * 10;
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const cx = mx - dy * bow;
  const cy = my + dx * bow;
  return `M ${ax.toFixed(1)} ${ay.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
}

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
}: Props) {
  const sorted = useMemo(() => [...profiles].sort((a, b) => b.index - a.index), [profiles]);
  const filtered = useMemo(() => {
    if (filter === 'ALL') return sorted;
    if (filter === 'OPEN') return sorted.filter((p) => p.status === 'OPEN');
    return sorted.filter((p) => p.status === 'VOUCHED' && p.ruling === filter);
  }, [sorted, filter]);

  const placed = useMemo(
    () => filtered.map((p, i) => ({ p, pos: nodePos(i, filtered.length) })),
    [filtered],
  );

  const fieldH = Math.max(820, 560 + filtered.length * 62);
  const showField = !loading && !error && profiles.length > 0 && filtered.length > 0;

  return (
    <div className="relative">
      {/* ===== large-screen constellation surface ===== */}
      <div
        className="relative mx-auto hidden max-w-[110rem] lg:block"
        style={{ height: `${fieldH}px` }}
      >
        {/* trust-cord layer behind everything */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* satellite cords (faint, static) */}
          {Object.values(SAT).map((s, i) => (
            <path
              key={`sat-${i}`}
              d={cord(CORE.x, CORE.y, s.x, s.y, 0.1)}
              fill="none"
              stroke="rgba(154,161,178,0.45)"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {/* profile trust-cords (flowing dash) */}
          {showField &&
            placed.map(({ p, pos }, i) => (
              <path
                key={`cord-${p.id}`}
                className="flow-path"
                d={cord(CORE.x, CORE.y, pos.x, pos.y, i % 2 === 0 ? 0.18 : -0.16)}
                fill="none"
                stroke="rgba(124,131,255,0.6)"
                strokeWidth={1.6}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          {/* core anchor pip */}
          <circle cx={CORE.x * 10} cy={CORE.y * 10} r={4} fill="#7c83ff" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* intro slab (top-left) */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute w-[23rem] -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${SAT.intro.x}%`, top: `${SAT.intro.y}%` }}
        >
          <div className="neu rounded-[1.8rem] p-6">
            <span className="neu-sm inline-flex items-center gap-2 rounded-pill px-3 py-1.5 font-mono text-peri-deep">
              <span className="uplabel">Trust constellation</span>
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink">
              Reputation, wired by consensus
            </h1>
            <p className="mt-3 font-body text-[14px] leading-relaxed text-ink-soft">
              Open a profile, let peers attest with real evidence, and watch the assessor rule each
              claim trusted, mixed, or unverified, every validator re-running it on-chain.
            </p>
            <button
              type="button"
              onClick={onOpen}
              className="focus-ring mt-5 flex items-center gap-2 rounded-pill accent-grad px-5 py-3 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PenLine size={16} /> Open a profile
            </button>
          </div>
        </motion.div>

        {/* filter lens (top-right, vertical) */}
        <div
          className="absolute -translate-y-1/2"
          style={{ right: '3%', top: '20%' }}
        >
          <FilterLens filter={filter} onFilter={onFilter} derived={derived} />
        </div>

        {/* assessor core (hub) */}
        <div
          id="core"
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${CORE.x}%`, top: `${CORE.y}%` }}
        >
          <AssessorCore derived={derived} vouchTotal={vouchTotal} loading={loading} />
        </div>

        {/* state slab near the core when there is nothing to scatter */}
        {!showField && (
          <div
            className="absolute z-20 w-[28rem] max-w-[80vw] -translate-x-1/2"
            style={{ left: '70%', top: '46%', transform: 'translate(-50%, -50%)' }}
          >
            {loading ? (
              <FieldSkeleton />
            ) : error ? (
              <FieldError message={error} onRetry={onRetry} />
            ) : profiles.length === 0 ? (
              <FieldEmpty onOpen={onOpen} />
            ) : (
              <div className="neu rounded-[1.6rem] px-6 py-10 text-center font-body text-ink-soft">
                No profiles match this lens yet.
              </div>
            )}
          </div>
        )}

        {/* profile nodes scattered around the core */}
        {showField &&
          placed.map(({ p, pos }, i) => (
            <div
              key={p.id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <ProfileNode
                profile={p}
                onVouch={onVouch}
                widthClass={WIDTHS[i % WIDTHS.length]}
                floatDelay={(i % 5) * 0.6}
              />
            </div>
          ))}

        {/* signal feed (lower-right) */}
        {!loading && !error && attestations.length > 0 && (
          <div
            id="signal-feed"
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${SAT.feed.x}%`, top: `${SAT.feed.y}%` }}
          >
            <SignalFeed items={attestations} />
          </div>
        )}

        {/* system ports (lower-left) */}
        <div
          id="system-ports"
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${SAT.ports.x}%`, top: `${SAT.ports.y}%` }}
        >
          <SystemPorts />
        </div>
      </div>

      {/* ===== small-screen reflow: stacked soft column, no cords ===== */}
      <div className="flex flex-col items-stretch gap-7 px-1 pb-10 lg:hidden">
        <div className="neu rounded-[1.6rem] p-6">
          <span className="neu-sm inline-flex items-center gap-2 rounded-pill px-3 py-1.5 font-mono text-peri-deep">
            <span className="uplabel">Trust constellation</span>
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink">
            Reputation, wired by consensus
          </h1>
          <p className="mt-3 font-body text-[14px] leading-relaxed text-ink-soft">
            Open a profile, let peers attest with real evidence, and watch the assessor rule each
            claim trusted, mixed, or unverified, every validator re-running it on-chain.
          </p>
          <button
            type="button"
            onClick={onOpen}
            className="focus-ring mt-5 flex items-center gap-2 rounded-pill accent-grad px-5 py-3 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5"
          >
            <PenLine size={16} /> Open a profile
          </button>
        </div>

        <div className="neu flex justify-center rounded-[1.6rem] p-6">
          <AssessorCore derived={derived} vouchTotal={vouchTotal} loading={loading} />
        </div>

        <div className="flex justify-center">
          <FilterLens filter={filter} onFilter={onFilter} derived={derived} />
        </div>

        {loading ? (
          <FieldSkeleton />
        ) : error ? (
          <FieldError message={error} onRetry={onRetry} />
        ) : profiles.length === 0 ? (
          <FieldEmpty onOpen={onOpen} />
        ) : filtered.length === 0 ? (
          <div className="neu rounded-[1.6rem] px-6 py-10 text-center font-body text-ink-soft">
            No profiles match this lens yet.
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            {placed.map(({ p }, i) => (
              <ProfileNode
                key={p.id}
                profile={p}
                onVouch={onVouch}
                widthClass="w-full max-w-md"
                floatDelay={(i % 5) * 0.6}
              />
            ))}
          </div>
        )}

        {!loading && !error && attestations.length > 0 && (
          <div className="flex justify-center">
            <SignalFeed items={attestations} />
          </div>
        )}
        <div className="flex justify-center">
          <SystemPorts />
        </div>
      </div>
    </div>
  );
}
