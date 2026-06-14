'use client';

import { PenLine, RefreshCw, TriangleAlert, ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';

export function FieldSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="neu w-[16rem] max-w-full rounded-[1.4rem] p-4"
          style={{ marginLeft: i % 2 ? '3rem' : '-2rem' }}
        >
          <div className="flex justify-between">
            <div className="h-9 w-28 animate-pulse rounded-lg bg-base-deep" />
            <div className="h-9 w-10 animate-pulse rounded-lg bg-base-deep" />
          </div>
          <div className="mt-3 h-2 w-full animate-pulse rounded-pill bg-base-deep" />
          <div className="mt-3 h-10 w-full animate-pulse rounded-xl bg-base-deep" />
        </div>
      ))}
    </div>
  );
}

export function FieldEmpty({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="neu flex flex-col items-center rounded-[1.8rem] px-6 py-12 text-center">
      <span className="neu-sm flex h-20 w-20 items-center justify-center rounded-3xl">
        <PenLine size={32} className="text-peri-deep" />
      </span>
      <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-ink">
        First light on the constellation
      </h3>
      <p className="mt-3 max-w-md font-body text-ink-soft">
        No profiles yet. Open the first one, say what you want to be vouched for, and let peers
        attest to it under validator consensus.
      </p>
      <button
        type="button"
        onClick={onOpen}
        className="focus-ring mt-7 flex items-center gap-2 rounded-pill accent-grad px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5"
      >
        <PenLine size={16} /> Open the first profile
      </button>
    </div>
  );
}

export function FieldError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="neu flex flex-col items-center rounded-[1.8rem] px-6 py-12 text-center">
      <span className="neu-sm flex h-16 w-16 items-center justify-center rounded-2xl">
        <TriangleAlert size={28} className="text-unverified" />
      </span>
      <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-ink">
        Could not reach the contract
      </h3>
      <p className="mt-2 max-w-md font-body text-sm text-ink-soft">{message}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="focus-ring flex items-center gap-2 rounded-pill accent-grad px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5"
        >
          <RefreshCw size={14} /> Retry
        </button>
        <a
          href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="neu-sm focus-ring flex items-center gap-2 rounded-pill px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-ink-soft hover:text-ink"
        >
          View on explorer <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
