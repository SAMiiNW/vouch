'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ShieldQuestion, ShieldAlert, UserPlus, Radio } from 'lucide-react';
import type { Attestation } from '@/lib/contract';
import { shortAddr, rulingText, rulingLabel } from '@/lib/format';

const ICON: Record<string, typeof ShieldCheck> = {
  TRUSTED: ShieldCheck,
  MIXED: ShieldQuestion,
  UNVERIFIED: ShieldAlert,
};

/**
 * The constellation's signal feed: a floating column of recent on-chain events,
 * each a soft inset chip. Reads as live telemetry on the OS surface.
 */
export function SignalFeed({ items }: { items: Attestation[] }) {
  if (items.length === 0) return null;
  const recent = [...items].reverse().slice(0, 8);

  return (
    <div className="neu w-[20rem] max-w-full rounded-[1.6rem] p-5">
      <span className="flex items-center gap-2 font-mono text-peri-deep">
        <Radio size={14} />
        <span className="uplabel">Signal feed</span>
      </span>
      <h3 className="mt-2 font-display text-xl font-extrabold tracking-tight text-ink">
        Live trust signals
      </h3>
      <ul className="mt-4 space-y-2.5">
        {recent.map((a, i) => {
          const opened = a.event === 'OPENED';
          const Icon = opened ? UserPlus : ICON[a.ruling ?? ''] ?? ShieldQuestion;
          const accent = opened ? 'text-peri-deep' : rulingText[a.ruling ?? ''] ?? 'text-ink-soft';
          return (
            <motion.li
              key={`${a.id}-${i}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="well flex items-center gap-3 rounded-xl px-3.5 py-2.5"
            >
              <span className="neu-sm flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <Icon size={14} className={accent} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-body text-[13px] text-ink">
                  {opened ? (
                    <>
                      <span className="font-semibold">{a.handle}</span> opened a profile
                    </>
                  ) : (
                    <>
                      Vouch ruled{' '}
                      <span className={`font-semibold ${accent}`}>
                        {rulingLabel[a.ruling ?? ''] ?? a.ruling}
                      </span>
                      {typeof a.credibility === 'number' && (
                        <span className="text-ink-soft"> at {a.credibility}</span>
                      )}
                    </>
                  )}
                </p>
                <p className="truncate font-mono text-[10px] text-ink-faint">
                  {a.id} . by {shortAddr(a.by)}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
