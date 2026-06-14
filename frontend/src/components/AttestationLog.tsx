'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ShieldQuestion, ShieldAlert, UserPlus } from 'lucide-react';
import type { Attestation } from '@/lib/contract';
import { shortAddr, rulingText, rulingLabel } from '@/lib/format';

const ICON: Record<string, typeof ShieldCheck> = {
  TRUSTED: ShieldCheck,
  MIXED: ShieldQuestion,
  UNVERIFIED: ShieldAlert,
};

export function AttestationLog({ items }: { items: Attestation[] }) {
  if (items.length === 0) return null;
  const recent = [...items].reverse().slice(0, 8);

  return (
    <div className="neu rounded-soft p-6 sm:p-7">
      <p className="uplabel font-mono text-peri-deep">Attestation log</p>
      <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink">Recent activity</h3>
      <ul className="mt-6 space-y-3">
        {recent.map((a, i) => {
          const opened = a.event === 'OPENED';
          const Icon = opened ? UserPlus : ICON[a.ruling ?? ''] ?? ShieldQuestion;
          const accent = opened ? 'text-peri-deep' : rulingText[a.ruling ?? ''] ?? 'text-ink-soft';
          return (
            <motion.li
              key={`${a.id}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="well flex items-center gap-3 rounded-xl px-4 py-3"
            >
              <span className="neu-sm flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                <Icon size={16} className={accent} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-body text-sm text-ink">
                  {opened ? (
                    <>
                      <span className="font-semibold">{a.handle}</span> opened a profile
                    </>
                  ) : (
                    <>
                      Vouch ruled{' '}
                      <span className={`font-semibold ${accent}`}>{rulingLabel[a.ruling ?? ''] ?? a.ruling}</span>
                      {typeof a.credibility === 'number' && (
                        <span className="text-ink-soft"> at {a.credibility}</span>
                      )}
                    </>
                  )}
                </p>
                <p className="truncate font-mono text-[11px] text-ink-faint">
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
