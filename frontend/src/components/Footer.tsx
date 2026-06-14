'use client';

import { ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, DEPLOY_TX, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr, shortHash } from '@/lib/format';
import { CopyButton } from './CopyButton';

export function Footer() {
  return (
    <footer className="px-4 pb-10 pt-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* single extruded bar: identity, on-chain coordinates, and resources inline */}
        <div className="neu flex flex-col gap-5 rounded-pill px-7 py-5 lg:flex-row lg:items-center lg:justify-between">
          <span className="font-display text-lg font-extrabold tracking-tight text-ink">vouch</span>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-ink-soft">
            <span className="flex items-center gap-1.5">
              <a
                href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-peri-deep"
              >
                Registry contract {shortAddr(CONTRACT_ADDRESS)}
              </a>
              <CopyButton value={CONTRACT_ADDRESS} label="Copy contract" />
            </span>
            <span className="flex items-center gap-1.5">
              <a
                href={`${EXPLORER}/tx/${DEPLOY_TX}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-peri-deep"
              >
                Deploy {shortHash(DEPLOY_TX)}
              </a>
              <CopyButton value={DEPLOY_TX} label="Copy deploy tx" />
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs">
            <a
              href={FAUCET}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-ink-soft hover:text-peri-deep"
            >
              Get test GEN to attest <ExternalLink size={11} />
            </a>
            <a
              href="https://docs.genlayer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-ink-soft hover:text-peri-deep"
            >
              GenLayer docs <ExternalLink size={11} />
            </a>
            <a
              href={EXPLORER}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-ink-soft hover:text-peri-deep"
            >
              View on explorer <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
