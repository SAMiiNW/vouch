'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Registry, type FilterKey } from '@/components/Registry';
import { AttestationLog } from '@/components/AttestationLog';
import { VouchModal, type ModalMode } from '@/components/VouchModal';
import { ToastProvider } from '@/components/Toast';
import { useWallet } from '@/hooks/useWallet';
import { useContractData } from '@/hooks/useContractData';
import { useTransaction } from '@/hooks/useTransaction';
import type { Profile } from '@/lib/contract';

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

  const vouchTotal =
    data.stats?.vouches ?? data.attestations.filter((a) => a.event !== 'OPENED').length;

  return (
    <>
      {/* two-column app shell: persistent sidebar + scrolling registry */}
      <div className="mx-auto grid max-w-[100rem] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[21rem_1fr] lg:gap-8 lg:py-8 xl:grid-cols-[23rem_1fr]">
        <Sidebar
          wallet={wallet}
          onOpen={openDraft}
          derived={data.derived}
          vouchTotal={vouchTotal}
          loading={data.loading}
        />

        <main className="min-w-0">
          <Registry
            profiles={data.profiles}
            derived={data.derived}
            loading={data.loading}
            error={data.error}
            filter={filter}
            onFilter={setFilter}
            onOpen={openDraft}
            onVouch={openVouch}
            onRetry={() => data.refresh()}
          />

          {!data.loading && !data.error && data.attestations.length > 0 && (
            <div className="mt-8">
              <AttestationLog items={data.attestations} />
            </div>
          )}

          <p className="mt-8 px-1 font-mono text-[11px] leading-relaxed text-ink-faint">
            Built on GenLayer Bradbury Testnet. A vouch is an AI ruling under validator consensus,
            not a background check or financial advice.
          </p>
        </main>
      </div>

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
