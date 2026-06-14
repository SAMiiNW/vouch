'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ShieldQuestion, ShieldAlert, Loader2, Radar } from 'lucide-react';
import type { TxState } from '@/hooks/useTransaction';
import { rulingText, rulingLabel } from '@/lib/format';

const STAGE_ORDER = ['SUBMITTED', 'PROPOSING', 'COMMITTING', 'REVEALING', 'ACCEPTED'];

function stageIndex(status: string): number {
  if (status === 'PENDING' || status === '') return 0;
  if (status === 'LEADER_TIMEOUT' || status === 'VALIDATORS_TIMEOUT') return 1;
  const i = STAGE_ORDER.indexOf(status);
  return i < 0 ? 1 : i;
}

const STAGES = [
  { key: 'SUBMITTED', label: 'Submitted', note: 'Transaction broadcast to Bradbury' },
  { key: 'PROPOSING', label: 'Assessor drafting', note: 'Leader weighs the attestation' },
  { key: 'COMMITTING', label: 'Validators re-running', note: 'Each re-derives the ruling' },
  { key: 'REVEALING', label: 'Revealing votes', note: 'Independent rulings compared' },
  { key: 'ACCEPTED', label: 'Settled on-chain', note: 'Credibility written under consensus' },
];

const ICON: Record<string, typeof ShieldCheck> = {
  TRUSTED: ShieldCheck,
  MIXED: ShieldQuestion,
  UNVERIFIED: ShieldAlert,
};

export function ConsensusStage({ tx }: { tx: TxState }) {
  const idx = stageIndex(tx.liveStatus);
  const rotating = tx.liveStatus === 'LEADER_TIMEOUT' || tx.liveStatus === 'VALIDATORS_TIMEOUT';
  const draft = tx.draft;
  const DraftIcon = draft ? ICON[draft.ruling] ?? ShieldQuestion : ShieldQuestion;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="neu relative flex h-40 w-40 items-center justify-center rounded-full">
        <motion.span
          className="absolute inset-3 rounded-full border-2 border-peri/30"
          animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute inset-8 rounded-full border-2 border-mint/40"
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.15, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
        <Radar size={48} className="text-peri-deep" />
      </div>

      <p className="uplabel mt-6 font-mono text-peri-deep">
        {rotating ? 'Rotating leader, still working' : 'Consensus in progress'}
      </p>
      <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">The assessor deliberates</h3>
      <p className="mt-2 max-w-md font-body text-sm text-ink-soft">
        An AI write on Bradbury takes one to five minutes. Validators are re-deriving the ruling
        independently. This panel updates live.
      </p>

      <div className="mt-8 w-full max-w-md space-y-2.5">
        {STAGES.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <div
              key={s.key}
              className={`flex items-center gap-3 rounded-xl p-3 text-left transition-shadow ${
                active ? 'neu-sm' : ''
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs ${
                  done
                    ? 'bg-trusted/15 text-trusted'
                    : active
                      ? 'accent-grad text-white'
                      : 'well text-ink-faint'
                }`}
              >
                {active ? <Loader2 size={13} className="animate-spin" /> : done ? '\u2713' : i + 1}
              </span>
              <div className="min-w-0">
                <p className={`font-mono text-xs uppercase tracking-wider ${done || active ? 'text-ink' : 'text-ink-faint'}`}>
                  {s.label}
                </p>
                <p className="font-body text-xs text-ink-faint">{s.note}</p>
              </div>
            </div>
          );
        })}
      </div>

      {draft && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="neu mt-6 w-full max-w-md rounded-soft p-5 text-left"
        >
          <p className="uplabel text-ink-faint">Leader draft, sealing under consensus</p>
          <div className="mt-2 flex items-center justify-between">
            <span className={`flex items-center gap-2 font-mono text-sm font-semibold uppercase ${rulingText[draft.ruling] ?? 'text-ink'}`}>
              <DraftIcon size={16} />
              {rulingLabel[draft.ruling] ?? draft.ruling}
            </span>
            {typeof draft.credibility === 'number' && (
              <span className={`tabular font-display text-3xl font-extrabold ${rulingText[draft.ruling] ?? 'text-ink'}`}>
                {draft.credibility}
              </span>
            )}
          </div>
          {draft.note && <p className="mt-2 font-body text-sm italic text-ink/80">{draft.note}</p>}
        </motion.div>
      )}

      <p className="mt-6 font-mono text-xs text-ink-faint">
        Status: <span className="text-ink">{tx.liveStatus || 'PENDING'}</span>
      </p>
    </div>
  );
}
