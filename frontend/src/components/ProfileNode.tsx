'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, ShieldQuestion, ShieldAlert, Clock, MessageSquarePlus } from 'lucide-react';
import type { Profile } from '@/lib/contract';
import { shortAddr, rulingLabel, rulingText, rulingHex } from '@/lib/format';

const ICON: Record<string, typeof ShieldCheck> = {
  TRUSTED: ShieldCheck,
  MIXED: ShieldQuestion,
  UNVERIFIED: ShieldAlert,
};

/**
 * A floating profile node on the trust constellation. Self-contained extruded
 * capsule, never a uniform grid card: width varies by caller, it gently floats,
 * and a soft trust-cord (drawn by the field SVG) ties it back to the core.
 */
export function ProfileNode({
  profile,
  onVouch,
  widthClass = 'w-[16rem]',
  floatDelay = 0,
}: {
  profile: Profile;
  onVouch?: (p: Profile) => void;
  widthClass?: string;
  floatDelay?: number;
}) {
  const vouched = profile.status === 'VOUCHED';
  const Icon = vouched ? ICON[profile.ruling] ?? ShieldQuestion : Clock;
  const accent = vouched ? rulingText[profile.ruling] ?? 'text-ink-soft' : 'text-peri-deep';
  const fill = vouched ? rulingHex[profile.ruling] ?? '#7c83ff' : '#7c83ff';

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
      style={{ animationDelay: `${floatDelay}s` }}
      className={`node-float neu ${widthClass} max-w-full rounded-[1.4rem] p-4 transition-transform hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="neu-sm flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
            <Icon size={16} className={accent} />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-[15px] font-bold leading-tight tracking-tight text-ink">
              {profile.handle}
            </p>
            <span className={`font-mono text-[10px] font-semibold uppercase tracking-wider ${accent}`}>
              {vouched ? rulingLabel[profile.ruling] : 'Awaiting a vouch'}
            </span>
          </div>
        </div>
        {vouched ? (
          <div className="text-right">
            <div className={`tabular font-display text-2xl font-extrabold leading-none ${accent}`}>
              {profile.credibility}
            </div>
            <div className="uplabel text-ink-faint">score</div>
          </div>
        ) : (
          <span className="font-mono text-[10px] text-ink-faint">{profile.id}</span>
        )}
      </div>

      {/* thin trust meter */}
      <div className="well mt-3 h-2 w-full overflow-hidden rounded-pill">
        <div
          className="h-full rounded-pill transition-all"
          style={{ width: `${vouched ? profile.credibility : 0}%`, backgroundColor: fill }}
        />
      </div>

      <p className="mt-3 line-clamp-2 font-body text-[13px] leading-relaxed text-ink-soft">
        {profile.claim}
      </p>

      {vouched && profile.last_note && (
        <p className="mt-2 line-clamp-2 border-l-2 border-peri/40 pl-2.5 font-body text-[12px] italic text-ink/75">
          {profile.last_note}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-ink-faint/15 pt-2.5 font-mono text-[10px] text-ink-faint">
        <span className="truncate">
          {shortAddr(profile.subject)} . {profile.vouch_count} vouch
          {profile.vouch_count === 1 ? '' : 'es'}
        </span>
        {onVouch && (
          <button
            type="button"
            onClick={() => onVouch(profile)}
            className="neu-sm focus-ring flex shrink-0 items-center gap-1.5 rounded-pill px-2.5 py-1.5 font-semibold uppercase tracking-wider text-peri-deep transition-transform hover:-translate-y-0.5"
          >
            <MessageSquarePlus size={12} /> Vouch
          </button>
        )}
      </div>
    </motion.article>
  );
}
