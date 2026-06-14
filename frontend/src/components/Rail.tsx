'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Orbit,
  PenLine,
  Radio,
  Plug,
  Wallet,
  LogOut,
  ChevronRight,
  Droplet,
} from 'lucide-react';
import { CopyButton } from './CopyButton';
import { shortAddr } from '@/lib/format';
import { FAUCET } from '@/lib/contract';
import type { WalletState } from '@/hooks/useWallet';

interface Props {
  wallet: WalletState & { connect: () => void; disconnect: () => void };
  onOpen: () => void;
}

const JUMPS = [
  { id: 'core', icon: Orbit, label: 'Constellation' },
  { id: 'signal-feed', icon: Radio, label: 'Signal feed' },
  { id: 'system-ports', icon: Plug, label: 'System ports' },
];

function RailItem({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: typeof Orbit;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex h-12 w-12 items-center justify-center"
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:-translate-y-0.5 ${
          active ? 'rail-pill-active' : 'rail-pill'
        }`}
      >
        <Icon size={18} className="text-peri-deep" />
      </span>
      {/* hover flyout label */}
      <span className="pointer-events-none absolute left-14 z-30 hidden whitespace-nowrap rounded-pill bg-base px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ink shadow-raised-sm group-hover:block">
        {label}
      </span>
    </button>
  );
}

export function Rail({ wallet, onOpen }: Props) {
  const [orbMenu, setOrbMenu] = useState(false);
  const connected = !!wallet.address;

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      aria-label="Vouch system rail"
      className="fixed inset-y-0 left-0 z-40 flex w-[84px] flex-col items-center justify-between py-6"
    >
      {/* the rail spine */}
      <div className="well absolute inset-y-4 left-1/2 -z-10 w-[60px] -translate-x-1/2 rounded-pill" />

      {/* brand + the primary wallet control, docked at the very top */}
      <div className="flex flex-col items-center gap-3">
        <span className="neu flex h-12 w-12 items-center justify-center rounded-2xl">
          <ShieldCheck size={22} className="text-peri-deep" />
        </span>

        {/* wallet connect: first interactive control, accent-filled and labelled */}
        <div className="relative flex flex-col items-center">
          {!connected ? (
            <button
              type="button"
              onClick={wallet.connect}
              disabled={wallet.connecting}
              className="group relative flex flex-col items-center gap-1 focus-ring rounded-2xl disabled:opacity-70"
              aria-label="Connect wallet"
            >
              <span className="accent-grad flex h-12 w-12 items-center justify-center rounded-2xl shadow-glow transition-transform group-hover:-translate-y-0.5">
                <Wallet size={18} className="text-white" />
              </span>
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider accent-text">
                {wallet.connecting ? 'Wait' : 'Connect'}
              </span>
              <span className="pointer-events-none absolute left-14 top-1 z-30 hidden whitespace-nowrap rounded-pill bg-base px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ink shadow-raised-sm group-hover:block">
                {wallet.connecting ? 'Connecting' : 'Connect wallet'}
              </span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setOrbMenu((v) => !v)}
                className="relative flex flex-col items-center gap-1"
                aria-label="Wallet menu"
              >
                <span className="neu flex h-12 w-12 items-center justify-center rounded-2xl">
                  <span className="h-3 w-3 rounded-full accent-grad" />
                </span>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-ink-soft">
                  {shortAddr(wallet.address ?? '').slice(0, 6)}
                </span>
                <ChevronRight
                  size={12}
                  className={`absolute right-1 top-3 text-ink-faint transition-transform ${orbMenu ? 'rotate-90' : ''}`}
                />
              </button>
              {orbMenu && (
                <div className="neu absolute left-16 top-0 z-30 w-64 rounded-soft p-4">
                  <p className="uplabel text-ink-faint">Connected wallet</p>
                  <div className="mt-2 flex items-center justify-between gap-2 break-all font-mono text-[11px] text-ink-soft">
                    <span>{wallet.address}</span>
                    <CopyButton value={wallet.address ?? ''} label="Copy address" />
                  </div>
                  <p className="mt-2 font-mono text-[11px] text-ink-faint">
                    {shortAddr(wallet.address ?? '')}
                  </p>
                  {!wallet.chainOk && (
                    <p className="mt-3 rounded-xl bg-mixed/10 px-3 py-2 font-mono text-[11px] text-mixed">
                      Wrong network. Switch to Bradbury (4221).
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      wallet.disconnect();
                      setOrbMenu(false);
                    }}
                    className="well focus-ring mt-3 flex w-full items-center justify-center gap-2 rounded-pill py-2.5 font-mono text-[11px] uppercase tracking-wider text-ink-soft transition-colors hover:text-unverified"
                  >
                    <LogOut size={13} /> Disconnect
                  </button>
                </div>
              )}
            </>
          )}
          <span
            title={connected && wallet.chainOk ? 'Bradbury, connected' : 'Bradbury'}
            className={`mt-2 h-2 w-2 rounded-full ${
              connected && wallet.chainOk ? 'accent-grad' : 'bg-ink-faint'
            }`}
          />
        </div>
      </div>

      {/* primary actions + jumps */}
      <div className="flex flex-col items-center gap-4">
        <RailItem icon={PenLine} label="Open a profile" onClick={onOpen} active />
        <span className="h-px w-7 bg-ink-faint/25" />
        {JUMPS.map((j) => (
          <RailItem key={j.id} icon={j.icon} label={j.label} onClick={() => jump(j.id)} />
        ))}
      </div>

      {/* rail foot: faucet, relocated out of the system-ports cluster */}
      <a
        href={FAUCET}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-12 w-12 items-center justify-center"
        aria-label="Get test GEN to attest"
      >
        <span className="rail-pill flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:-translate-y-0.5">
          <Droplet size={18} className="text-peri-deep" />
        </span>
        <span className="pointer-events-none absolute left-14 z-30 hidden whitespace-nowrap rounded-pill bg-base px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ink shadow-raised-sm group-hover:block">
          Get test GEN
        </span>
      </a>
    </motion.nav>
  );
}
