'use client';

import { Plug } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';
import { shortAddr } from '@/lib/format';

/**
 * The OS surface's "system ports": the on-chain registry coordinate and its copy
 * control, presented as a compact floating slab. Resource links (faucet, explorer,
 * docs) are deliberately scattered elsewhere across the chrome, not bunched here.
 */
export function SystemPorts() {
  return (
    <div className="neu w-[20rem] max-w-full rounded-[1.6rem] p-5">
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

      <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
        Bradbury testnet. No stake held.
      </p>
    </div>
  );
}
