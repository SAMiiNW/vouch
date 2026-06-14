'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, UserPlus, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';
import { ProfileCard } from '@/components/ProfileCard';
import { AttestationLog } from '@/components/AttestationLog';
import { Skeleton, EmptyState, ErrorState } from '@/components/States';
import { VouchModal, type ModalMode } from '@/components/VouchModal';
import { ToastProvider } from '@/components/Toast';
import { useWallet } from '@/hooks/useWallet';
import { useContractData } from '@/hooks/useContractData';
import { useTransaction } from '@/hooks/useTransaction';
import type { Profile } from '@/lib/contract';

type FilterKey = 'ALL' | 'OPEN' | 'TRUSTED' | 'MIXED' | 'UNVERIFIED';

function Dashboard() {
  const wallet = useWallet();
  const data = useContractData();
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('open');
  const [target, setTarget] = useState<Profile | null>(null);
  const [filter, setFilter] = useState<FilterKey>('ALL');
  const txApi = useTransaction(() => {
    void data.refresh();
  });

  const openDraft = () => {
    setMode('open');
    setTarget(null);
    setModalOpen(true);
  };
  const openVouch = (p: Profile) => {
    setMode('vouch');
    setTarget(p);
    setModalOpen(true);
  };

  const filtered = useMemo(() => {
    const list = [...data.profiles].sort((a, b) => b.index - a.index);
    if (filter === 'ALL') return list;
    if (filter === 'OPEN') return list.filter((p) => p.status === 'OPEN');
    return list.filter((p) => p.status === 'VOUCHED' && p.ruling === filter);
  }, [data.profiles, filter]);

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'ALL', label: `All ${data.derived.total}` },
    { key: 'OPEN', label: `Open ${data.derived.open}` },
    { key: 'TRUSTED', label: `Trusted ${data.derived.trusted}` },
    { key: 'MIXED', label: `Mixed ${data.derived.mixed}` },
    { key: 'UNVERIFIED', label: `Unverified ${data.derived.unverified}` },
  ];

  return (
    <>
      <Header wallet={wallet} onOpen={openDraft} />
      <main>
        <Hero onOpen={openDraft} stats={data.derived} />
        <HowItWorks />

        {/* REGISTRY */}
        <section id="registry" className="px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="uplabel flex items-center gap-2 font-mono text-peri-deep">
                  <Filter size={14} /> The registry
                </span>
                <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
                  Every profile
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={`focus-ring rounded-pill px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all ${
                      filter === f.key
                        ? 'accent-grad text-white shadow-glow'
                        : 'neu-sm text-ink-soft hover:-translate-y-0.5'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_20rem]">
              <div>
                {data.loading ? (
                  <Skeleton />
                ) : data.error ? (
                  <ErrorState message={data.error} onRetry={() => data.refresh()} />
                ) : data.profiles.length === 0 ? (
                  <EmptyState onOpen={openDraft} />
                ) : filtered.length === 0 ? (
                  <div className="neu rounded-soft px-6 py-14 text-center font-body text-ink-soft">
                    No profiles match this filter yet.
                  </div>
                ) : (
                  <motion.div layout className="grid gap-6 lg:grid-cols-2">
                    {filtered.map((p) => (
                      <ProfileCard key={p.id} profile={p} onVouch={openVouch} />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* side rail: attestation log */}
              <aside className="space-y-6">
                {!data.loading && !data.error && data.attestations.length > 0 && (
                  <AttestationLog items={data.attestations} />
                )}

                <div className="neu rounded-soft p-6">
                  <h3 className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-ink">
                    <Sparkles size={18} className="text-peri-deep" /> Build your reputation
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">
                    Open a profile for what you do, then ask a peer to vouch with real evidence. The
                    assessor does the rest under consensus.
                  </p>
                  <button
                    type="button"
                    onClick={openDraft}
                    className="focus-ring mt-5 flex w-full items-center justify-center gap-2 rounded-pill accent-grad py-3 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5"
                  >
                    <UserPlus size={15} /> Open a profile
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <VouchModal
        open={modalOpen}
        mode={mode}
        target={target}
        onClose={() => setModalOpen(false)}
        address={wallet.address}
        chainOk={wallet.chainOk}
        onConnect={wallet.connect}
        txApi={txApi}
        setTxInFlight={data.setTxInFlight}
      />
    </>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <Dashboard />
    </ToastProvider>
  );
}
