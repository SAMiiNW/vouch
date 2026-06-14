'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ShieldQuestion, ShieldAlert, Clock, MessageSquarePlus } from 'lucide-react';
import type { Profile } from '@/lib/contract';
import { shortAddr, rulingText, rulingLabel, rulingHex } from '@/lib/format';

const ICON: Record<string, typeof ShieldCheck> = {
  TRUSTED: ShieldCheck,
  MIXED: ShieldQuestion,
  UNVERIFIED: ShieldAlert,
};

export function ProfileCard({
  profile,
  fresh,
  pending,
  onVouch,
}: {
  profile: Profile;
  fresh?: boolean;
  pending?: boolean;
  onVouch?: (p: Profile) => void;
}) {
  const vouched = profile.status === 'VOUCHED';
  const Icon = vouched ? ICON[profile.ruling] ?? ShieldQuestion : Clock;
  const accent = vouched ? rulingText[profile.ruling] ?? 'text-ink-soft' : 'text-peri-deep';
  const fill = vouched ? rulingHex[profile.ruling] ?? '#7c83ff' : '#7c83ff';

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`neu group relative flex gap-5 rounded-soft p-6 transition-transform hover:-translate-y-1 ${
        fresh ? 'animate-flashframe' : ''
      } ${pending ? 'opacity-70' : ''}`}
    >
      {/* per-card vertical trust meter rail */}
      <div className="flex flex-col items-center">
        <div className="well relative h-full min-h-[7rem] w-3.5 overflow-hidden rounded-pill">
          <div
            className="absolute bottom-0 w-full rounded-pill transition-all"
            style={{ height: `${vouched ? profile.credibility : 0}%`, backgroundColor: fill }}
          />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="neu-sm flex h-10 w-10 items-center justify-center rounded-xl">
              <Icon size={18} className={accent} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-base font-bold tracking-tight text-ink">
                {profile.handle}
              </p>
              <span className={`font-mono text-[11px] font-semibold uppercase tracking-wider ${accent}`}>
                {vouched ? rulingLabel[profile.ruling] : 'Awaiting a vouch'}
              </span>
            </div>
          </div>
          {vouched ? (
            <div className="text-right">
              <div className={`tabular font-display text-3xl font-extrabold ${accent}`}>
                {profile.credibility}
              </div>
              <div className="uplabel text-ink-faint">score</div>
            </div>
          ) : (
            <span className="font-mono text-[11px] text-ink-faint">{profile.id}</span>
          )}
        </div>

        <div className="well mt-4 rounded-xl px-4 py-3">
          <p className="uplabel text-ink-faint">Vouched for</p>
          <p className="mt-1 line-clamp-3 font-body text-sm leading-relaxed text-ink-soft">
            {profile.claim}
          </p>
        </div>

        {vouched && profile.last_note && (
          <div className="mt-3 border-l-2 border-peri/40 pl-3">
            <p className="uplabel text-ink-faint">Assessor note</p>
            <p className="mt-1 font-body text-sm italic text-ink/80">{profile.last_note}</p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-ink-faint/15 pt-3 font-mono text-[11px] text-ink-faint">
          <span>subject {shortAddr(profile.subject)}</span>
          <span className="flex items-center gap-3">
            <span>{profile.vouch_count} vouch{profile.vouch_count === 1 ? '' : 'es'}</span>
            {onVouch && (
              <button
                type="button"
                onClick={() => onVouch(profile)}
                className="neu-sm focus-ring flex items-center gap-1.5 rounded-pill px-3 py-1.5 font-semibold uppercase tracking-wider text-peri-deep transition-transform hover:-translate-y-0.5"
              >
                <MessageSquarePlus size={13} /> Vouch
              </button>
            )}
          </span>
        </div>
      </div>

      {pending && (
        <span className="absolute -top-3 left-6 animate-pulsechip rounded-pill bg-base px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-mixed shadow-raised-sm">
          Pending
        </span>
      )}
    </motion.article>
  );
}
