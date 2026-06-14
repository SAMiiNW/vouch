'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ShieldQuestion,
  ShieldAlert,
  Users,
  MessageSquareQuote,
  Plus,
  Wallet,
  LogOut,
  ChevronDown,
  ExternalLink,
  UserPlus,
  Gavel,
  BadgeCheck,
} from 'lucide-react';
import { TrustRadar } from './TrustRadar';
import { CopyButton } from './CopyButton';
import { CONTRACT_ADDRESS, EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr } from '@/lib/format';
import type { WalletState } from '@/hooks/useWallet';

interface Derived {
  total: number;
  open: number;
  vouched: number;
  trusted: number;
  mixed: number;
  unverified: number;
  avgCredibility: number;
}

interface Props {
  wallet: WalletState & { connect: () => void; disconnect: () => void };
  onOpen: () => void;
  derived: Derived;
  vouchTotal: number;
  loading: boolean;
}

const MINI_STEPS = [
  { icon: UserPlus, text: 'Open a profile and state what you want vouched for.' },
  { icon: MessageSquareQuote, text: 'A peer attests with concrete, first-hand evidence.' },
  { icon: Gavel, text: 'Validators re-run the assessor and seal the ruling.' },
];

function Readout({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: typeof Users;
  value: number;
  label: string;
  accent: string;
}) {
  return (
    <div className="neu-sm flex items-center justify-between rounded-xl px-3.5 py-3">
      <span className="flex items-center gap-2.5">
        <Icon size={15} className={accent} />
        <span className="uplabel text-ink-faint">{label}</span>
      </span>
      <span className="tabular font-display text-lg font-extrabold leading-none text-ink">{value}</span>
    </div>
  );
}

export function Sidebar({ wallet, onOpen, derived, vouchTotal, loading }: Props) {
  const [walletMenu, setWalletMenu] = useState(false);
  const connected = !!wallet.address;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto lg:pr-1"
    >
      <div className="neu flex flex-col gap-7 rounded-[2rem] p-6 sm:p-7">
        {/* brand + wallet control */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="neu-sm flex h-12 w-12 items-center justify-center rounded-2xl">
              <ShieldCheck size={22} className="text-peri-deep" />
            </span>
            <div>
              <p className="font-display text-2xl font-extrabold leading-none tracking-tight text-ink">
                vouch
              </p>
              <span className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-ink-faint">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${connected && wallet.chainOk ? 'accent-grad' : 'bg-ink-faint'}`}
                />
                Bradbury
              </span>
            </div>
          </div>

          {!connected ? (
            <button
              type="button"
              onClick={wallet.connect}
              disabled={wallet.connecting}
              className="neu-sm focus-ring flex items-center gap-1.5 rounded-pill px-3.5 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-peri-deep transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
            >
              <Wallet size={13} />
              {wallet.connecting ? 'Connecting' : 'Connect'}
            </button>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setWalletMenu((v) => !v)}
                className="neu-sm focus-ring flex items-center gap-1.5 rounded-pill px-3 py-2 font-mono text-[11px] text-ink"
              >
                <span className="h-1.5 w-1.5 rounded-full accent-grad" />
                {shortAddr(wallet.address ?? '')}
                <ChevronDown size={13} />
              </button>
              {walletMenu && (
                <div className="neu absolute right-0 top-12 z-20 w-64 rounded-soft p-4">
                  <p className="uplabel text-ink-faint">Connected wallet</p>
                  <div className="mt-2 flex items-center justify-between gap-2 break-all font-mono text-[11px] text-ink-soft">
                    <span>{wallet.address}</span>
                    <CopyButton value={wallet.address ?? ''} label="Copy address" />
                  </div>
                  {!wallet.chainOk && (
                    <p className="mt-3 rounded-xl bg-mixed/10 px-3 py-2 font-mono text-[11px] text-mixed">
                      Wrong network. Switch to Bradbury (4221).
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      wallet.disconnect();
                      setWalletMenu(false);
                    }}
                    className="well focus-ring mt-3 flex w-full items-center justify-center gap-2 rounded-pill py-2.5 font-mono text-[11px] uppercase tracking-wider text-ink-soft transition-colors hover:text-unverified"
                  >
                    <LogOut size={13} /> Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* value proposition (replaces the centered hero) */}
        <div>
          <span className="neu-sm inline-flex items-center gap-2 rounded-pill px-3.5 py-1.5 font-mono text-peri-deep">
            <BadgeCheck size={13} />
            <span className="uplabel">Reputation, settled by consensus</span>
          </span>
          <p className="mt-4 font-body text-[15px] leading-relaxed text-ink-soft">
            Open a profile, let peers attest with real evidence, and an injection-resistant AI
            assessor rules trusted, mixed, or unverified with a credibility score every validator
            re-runs before it settles on-chain.
          </p>
        </div>

        {/* primary action */}
        <button
          type="button"
          onClick={onOpen}
          className="focus-ring flex items-center justify-center gap-2 rounded-pill accent-grad px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={17} /> Open a profile
        </button>

        {/* radar motif + avg score */}
        <div className="well relative h-36 w-full overflow-hidden rounded-[1.5rem]">
          <TrustRadar />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="block font-display text-3xl font-extrabold accent-text">
              {derived.avgCredibility || '\u2013'}
            </span>
            <span className="uplabel mt-0.5 block text-ink-faint">avg score</span>
          </span>
        </div>

        {/* live stats stack */}
        <div>
          <span className="uplabel font-mono text-peri-deep">Live on-chain</span>
          <div className={`mt-3 flex flex-col gap-2.5 ${loading ? 'opacity-60' : ''}`}>
            <Readout icon={Users} value={derived.total} label="Profiles" accent="text-peri-deep" />
            <Readout
              icon={MessageSquareQuote}
              value={vouchTotal}
              label="Vouches"
              accent="text-peri-deep"
            />
            <Readout icon={ShieldCheck} value={derived.trusted} label="Trusted" accent="text-trusted" />
            <Readout icon={ShieldQuestion} value={derived.mixed} label="Mixed" accent="text-mixed" />
            <Readout
              icon={ShieldAlert}
              value={derived.unverified}
              label="Unverified"
              accent="text-unverified"
            />
          </div>
        </div>

        {/* how it works mini-list */}
        <div>
          <span className="uplabel font-mono text-peri-deep">How it works</span>
          <ul className="mt-3 space-y-2.5">
            {MINI_STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={i} className="well flex items-start gap-3 rounded-xl px-3.5 py-3">
                  <span className="neu-sm flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <Icon size={14} className="text-peri-deep" />
                  </span>
                  <p className="font-body text-xs leading-relaxed text-ink-soft">{s.text}</p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* on-chain coordinates + resources */}
        <div className="border-t border-ink-faint/15 pt-5">
          <span className="uplabel font-mono text-ink-faint">On-chain</span>
          <div className="mt-3 flex items-center justify-between gap-2 font-mono text-[11px] text-ink-soft">
            <a
              href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring hover:text-peri-deep"
            >
              Contract {shortAddr(CONTRACT_ADDRESS)}
            </a>
            <CopyButton value={CONTRACT_ADDRESS} label="Copy contract" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px]">
            <a
              href={FAUCET}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring flex items-center gap-1 text-ink-soft hover:text-peri-deep"
            >
              Faucet <ExternalLink size={11} />
            </a>
            <a
              href={EXPLORER}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring flex items-center gap-1 text-ink-soft hover:text-peri-deep"
            >
              Explorer <ExternalLink size={11} />
            </a>
            <a
              href="https://docs.genlayer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring flex items-center gap-1 text-ink-soft hover:text-peri-deep"
            >
              Docs <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
