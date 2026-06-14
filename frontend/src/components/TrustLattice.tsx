'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { rulingHex } from '@/lib/format';

interface Derived {
  trusted: number;
  mixed: number;
  unverified: number;
}

/**
 * Vouch signature element: the Trust Lattice. A small live constellation key that
 * wires a central trust star to the three ruling points (trusted, mixed,
 * unverified) with flowing cords, doubling as a color legend. When a wallet is
 * connected the core star lights up and reads "wired in", tying the operator into
 * the constellation. Unique to Vouch, the sibling surfaces have no such motif.
 */
const POINTS: { key: keyof Derived; label: string; x: number; y: number }[] = [
  { key: 'trusted', label: 'Trusted', x: 86, y: 22 },
  { key: 'mixed', label: 'Mixed', x: 92, y: 64 },
  { key: 'unverified', label: 'Unverified', x: 70, y: 86 },
];

const CX = 26;
const CY = 52;

export function TrustLattice({
  derived,
  connected,
}: {
  derived: Derived;
  connected: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="neu w-[16rem] max-w-full rounded-[1.6rem] p-5"
    >
      <span className="flex items-center gap-2 font-mono text-peri-deep">
        <Sparkles size={14} />
        <span className="uplabel">Trust lattice</span>
      </span>

      <div className="relative mt-3 h-32 w-full">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {POINTS.map((p) => (
            <path
              key={`cord-${p.key}`}
              className={connected ? 'flow-path' : undefined}
              d={`M ${CX} ${CY} L ${p.x} ${p.y}`}
              fill="none"
              stroke={rulingHex[p.key.toUpperCase()]}
              strokeWidth={connected ? 1.4 : 1}
              strokeOpacity={connected ? 0.85 : 0.4}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {POINTS.map((p) => (
            <circle
              key={`pip-${p.key}`}
              cx={p.x}
              cy={p.y}
              r={3.4}
              fill={rulingHex[p.key.toUpperCase()]}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {/* central trust star */}
          <circle
            cx={CX}
            cy={CY}
            r={connected ? 5.5 : 4}
            fill={connected ? '#7c83ff' : '#9aa1b2'}
            vectorEffect="non-scaling-stroke"
          />
          {connected && (
            <circle
              cx={CX}
              cy={CY}
              r={9}
              fill="none"
              stroke="#7c83ff"
              strokeOpacity={0.45}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      </div>

      <ul className="mt-2 space-y-1.5">
        {POINTS.map((p) => (
          <li
            key={p.key}
            className="flex items-center justify-between font-mono text-[11px] text-ink-soft"
          >
            <span className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: rulingHex[p.key.toUpperCase()] }}
              />
              {p.label}
            </span>
            <span className="tabular font-display text-sm font-extrabold text-ink">
              {derived[p.key]}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 border-t border-ink-faint/15 pt-3 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
        {connected ? 'Wired in. Your signature anchors the lattice.' : 'Connect to wire into the lattice.'}
      </p>
    </motion.div>
  );
}
