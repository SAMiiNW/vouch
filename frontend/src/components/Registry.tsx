'use client';

import { useMemo } from 'react';
import { ProfileRow } from './ProfileRow';
import { Skeleton, EmptyState, ErrorState } from './States';
import type { Profile } from '@/lib/contract';

export type FilterKey = 'ALL' | 'OPEN' | 'TRUSTED' | 'MIXED' | 'UNVERIFIED';

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
  derived: Derived;
  loading: boolean;
  error: string | null;
  filter: FilterKey;
  onFilter: (f: FilterKey) => void;
  onOpen: () => void;
  onVouch: (p: Profile) => void;
  onRetry: () => void;
}

export function Registry({
  profiles,
  derived,
  loading,
  error,
  filter,
  onFilter,
  onOpen,
  onVouch,
  onRetry,
}: Props) {
  const sorted = useMemo(
    () => [...profiles].sort((a, b) => b.index - a.index),
    [profiles],
  );

  const filtered = useMemo(() => {
    if (filter === 'ALL') return sorted;
    if (filter === 'OPEN') return sorted.filter((p) => p.status === 'OPEN');
    return sorted.filter((p) => p.status === 'VOUCHED' && p.ruling === filter);
  }, [sorted, filter]);

  const segments: { key: FilterKey; label: string; count: number }[] = [
    { key: 'ALL', label: 'All', count: derived.total },
    { key: 'OPEN', label: 'Open', count: derived.open },
    { key: 'TRUSTED', label: 'Trusted', count: derived.trusted },
    { key: 'MIXED', label: 'Mixed', count: derived.mixed },
    { key: 'UNVERIFIED', label: 'Unverified', count: derived.unverified },
  ];

  return (
    <section id="registry" className="min-w-0">
      {/* column header with the filter as a segmented control */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="uplabel font-mono text-peri-deep">Profile registry</span>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            The attestation feed
          </h2>
        </div>
        <span className="font-mono text-xs text-ink-faint">{filtered.length} shown</span>
      </div>

      {/* segmented control */}
      <div className="well mt-5 flex flex-wrap gap-1 rounded-pill p-1.5">
        {segments.map((s) => {
          const active = filter === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onFilter(s.key)}
              className={`focus-ring flex flex-1 items-center justify-center gap-2 rounded-pill px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                active ? 'accent-grad text-white shadow-glow' : 'text-ink-soft hover:text-ink'
              }`}
            >
              <span>{s.label}</span>
              <span
                className={`tabular text-[11px] font-bold ${active ? 'text-white/90' : 'text-ink-faint'}`}
              >
                {s.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* feed */}
      <div className="mt-7">
        {loading ? (
          <Skeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : profiles.length === 0 ? (
          <EmptyState onOpen={onOpen} />
        ) : filtered.length === 0 ? (
          <div className="neu rounded-soft px-6 py-14 text-center font-body text-ink-soft">
            No profiles match this filter yet.
          </div>
        ) : (
          <div className="columns-1 gap-5 2xl:columns-2">
            {filtered.map((p) => (
              <ProfileRow key={p.id} profile={p} onVouch={onVouch} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
