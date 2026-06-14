'use client';

import { ExternalLink, Plug } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { CONTRACT_ADDRESS, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr } from '@/lib/format';

/**
 * The OS surface's "system ports": on-chain coordinates, resource links, and the
 * attestation disclaimer, presented as a floating utility slab (not a footer band).
 */
export function SystemPorts() {
  return (
    <div className="neu w-[22rem] max-w-full rounded-[1.6rem] p-5">
      <span className="flex items-center gap-2 font-mono text-peri-deep">
        <Plug size={14} />
        <span className="uplabel">System ports</span>
      </span>

      <div className="well mt-4 flex items-center justify-between gap-2 rounded-xl px-3.5 py-3 font-mono text-[11px] text-ink-soft">
        <a
          href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring hover:text-peri-deep"
        >
          Registry contract {shortAddr(CONTRACT_ADDRESS)}
        </a>
        <CopyButton value={CONTRACT_ADDRESS} label="Copy contract" />
      </div>

      <div className="mt-4 flex flex-col gap-2.5 font-mono text-[11px]">
        <a
          href={FAUCET}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex items-center gap-1.5 text-ink-soft hover:text-peri-deep"
        >
          Get test GEN to attest <ExternalLink size={11} />
        </a>
        <a
          href={EXPLORER}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex items-center gap-1.5 text-ink-soft hover:text-peri-deep"
        >
          View on explorer <ExternalLink size={11} />
        </a>
        <a
          href="https://docs.genlayer.com"
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex items-center gap-1.5 text-ink-soft hover:text-peri-deep"
        >
          GenLayer docs <ExternalLink size={11} />
        </a>
      </div>

      <p className="mt-4 border-t border-ink-faint/15 pt-4 font-mono text-[10px] leading-relaxed text-ink-faint">
        Attesting on Bradbury. Every ruling is an AI read of peer evidence that each validator
        re-runs to consensus, never a background check, never financial advice, and it holds no
        stake or custody.
      </p>
    </div>
  );
}
