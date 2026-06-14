'use client';

import { LayoutGrid, Clock, ShieldCheck, ShieldQuestion, ShieldAlert } from 'lucide-react';

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

const LENSES: { key: FilterKey; icon: typeof LayoutGrid; label: string; accent: string }[] = [
  { key: 'ALL', icon: LayoutGrid, label: 'All', accent: 'text-peri-deep' },
  { key: 'OPEN', icon: Clock, label: 'Open', accent: 'text-peri-deep' },
  { key: 'TRUSTED', icon: ShieldCheck, label: 'Trusted', accent: 'text-trusted' },
  { key: 'MIXED', icon: ShieldQuestion, label: 'Mixed', accent: 'text-mixed' },
  { key: 'UNVERIFIED', icon: ShieldAlert, label: 'Unverified', accent: 'text-unverified' },
];

/**
 * Vertical stack of round "lens" dials used to filter the constellation field.
 * Distinct from a segmented control or tab bar: each lens is an extruded circle
 * with a live count, the active one pressed in.
 */
export function FilterLens({
  filter,
  onFilter,
  derived,
}: {
  filter: FilterKey;
  onFilter: (f: FilterKey) => void;
  derived: Derived;
}) {
  const count: Record<FilterKey, number> = {
    ALL: derived.total,
    OPEN: derived.open,
    TRUSTED: derived.trusted,
    MIXED: derived.mixed,
    UNVERIFIED: derived.unverified,
  };

  return (
    <div className="flex flex-col items-end gap-3">
      <span className="uplabel font-mono text-peri-deep">Lens</span>
      {LENSES.map((l) => {
        const active = filter === l.key;
        const Icon = l.icon;
        return (
          <button
            key={l.key}
            type="button"
            onClick={() => onFilter(l.key)}
            aria-pressed={active}
            className="group flex items-center justify-end gap-3"
          >
            <span className="hidden font-mono text-[11px] uppercase tracking-wider text-ink-soft group-hover:inline sm:inline">
              {l.label}
            </span>
            <span
              className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:-translate-y-0.5 ${
                active ? 'rail-pill-active' : 'rail-pill'
              }`}
            >
              <Icon size={16} className={l.accent} />
              <span className="tabular absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-base px-1 font-mono text-[10px] font-bold text-ink shadow-raised-sm">
                {count[l.key]}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
