'use client';

import { useState } from 'react';
import { ShieldCheck, ChevronDown, ExternalLink, LogOut, Wallet, Plus } from 'lucide-react';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';
import { shortAddr } from '@/lib/format';
import { CopyButton } from './CopyButton';
import type { WalletState } from '@/hooks/useWallet';

interface Props {
  wallet: WalletState & { connect: () => void; disconnect: () => void };
  onOpen: () => void;
}

export function Header({ wallet, onOpen }: Props) {
  const [menu, setMenu] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="focus-ring flex items-center gap-3">
          <span className="neu-sm flex h-11 w-11 items-center justify-center rounded-2xl">
            <ShieldCheck size={20} className="text-peri-deep" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-ink">vouch</span>
        </a>

        <div className="flex items-center gap-3">
          <span className="neu-sm hidden items-center gap-2 rounded-pill px-4 py-2 font-mono text-xs text-ink-soft sm:flex">
            <span
              className={`h-2 w-2 rounded-full ${wallet.address && wallet.chainOk ? 'accent-grad' : 'bg-ink-faint'}`}
            />
            Bradbury
          </span>

          {!wallet.address ? (
            <button
              type="button"
              onClick={wallet.connect}
              disabled={wallet.connecting}
              className="neu-sm focus-ring flex items-center gap-2 rounded-pill px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-peri-deep transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
            >
              <Wallet size={15} />
              {wallet.connecting ? 'Connecting' : 'Connect'}
            </button>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu((v) => !v)}
                className="neu-sm focus-ring flex items-center gap-2 rounded-pill px-4 py-2.5 font-mono text-xs text-ink"
              >
                <span className="h-2 w-2 rounded-full accent-grad" />
                {shortAddr(wallet.address)}
                <ChevronDown size={14} />
              </button>
              {menu && (
                <div className="neu absolute right-0 top-14 w-72 rounded-soft p-5">
                  <p className="uplabel text-ink-faint">Connected wallet</p>
                  <div className="mt-2 flex items-center justify-between gap-2 break-all font-mono text-xs text-ink-soft">
                    <span>{wallet.address}</span>
                    <CopyButton value={wallet.address} label="Copy address" />
                  </div>
                  {!wallet.chainOk && (
                    <p className="mt-3 rounded-xl bg-mixed/10 px-3 py-2 font-mono text-[11px] text-mixed">
                      Wrong network. Switch to Bradbury (4221).
                    </p>
                  )}
                  <a
                    href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring mt-3 flex items-center gap-1 font-mono text-xs text-peri-deep hover:underline"
                  >
                    View contract <ExternalLink size={12} />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      wallet.disconnect();
                      setMenu(false);
                    }}
                    className="well focus-ring mt-4 flex w-full items-center justify-center gap-2 rounded-pill py-2.5 font-mono text-xs uppercase tracking-wider text-ink-soft transition-colors hover:text-unverified"
                  >
                    <LogOut size={14} /> Disconnect
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onOpen}
            className="focus-ring hidden items-center gap-2 rounded-pill accent-grad px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5 active:translate-y-0 md:flex"
          >
            <Plus size={15} /> Open profile
          </button>
        </div>
      </div>
    </header>
  );
}
