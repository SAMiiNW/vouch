'use client';

import { ShieldCheck, ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, DEPLOY_TX, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr, shortHash } from '@/lib/format';
import { CopyButton } from './CopyButton';

export function Footer() {
  return (
    <footer className="px-4 pb-10 pt-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* full-bleed masthead panel */}
        <div className="neu rounded-[2rem] p-8 sm:p-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="neu-sm flex h-12 w-12 items-center justify-center rounded-2xl">
                <ShieldCheck size={22} className="text-peri-deep" />
              </span>
              <div>
                <span className="font-display text-2xl font-extrabold tracking-tight text-ink">vouch</span>
                <p className="font-body text-sm text-ink-soft">
                  Peer attestations, weighed by AI under GenLayer consensus.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-sm">
              <a href={FAUCET} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-ink-soft hover:text-peri-deep">
                Faucet <ExternalLink size={12} />
              </a>
              <a href="https://docs.genlayer.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-ink-soft hover:text-peri-deep">
                Docs <ExternalLink size={12} />
              </a>
              <a href={EXPLORER} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-ink-soft hover:text-peri-deep">
                Explorer <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="mt-8 grid gap-4 border-t border-ink-faint/15 pt-6 font-mono text-xs text-ink-soft sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <a href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="hover:text-peri-deep">
                Contract {shortAddr(CONTRACT_ADDRESS)}
              </a>
              <CopyButton value={CONTRACT_ADDRESS} label="Copy contract" />
            </span>
            <span className="flex items-center gap-2 sm:justify-end">
              <a href={`${EXPLORER}/tx/${DEPLOY_TX}`} target="_blank" rel="noopener noreferrer" className="hover:text-peri-deep">
                Deploy {shortHash(DEPLOY_TX)}
              </a>
              <CopyButton value={DEPLOY_TX} label="Copy deploy tx" />
            </span>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-xs text-ink-faint">
          Built on GenLayer Bradbury Testnet. A vouch is an AI ruling under validator consensus, not a
          background check or financial advice.
        </p>
      </div>
    </footer>
  );
}
