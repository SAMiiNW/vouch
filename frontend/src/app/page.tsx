'use client';

import { useState } from 'react';
import { Rail } from '@/components/Rail';
import { Constellation, type FilterKey } from '@/components/Constellation';
import { VouchModal, type ModalMode } from '@/components/VouchModal';
import { ToastProvider } from '@/components/Toast';
import { useWallet } from '@/hooks/useWallet';
import { useContractData } from '@/hooks/useContractData';
import { useTransaction } from '@/hooks/useTransaction';
import type { Profile } from '@/lib/contract';

function Desktop() {
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
      {/* futuristic OS surface: a thin vertical rail + a free-form constellation field */}
      <Rail wallet={wallet} onOpen={openDraft} />

      <div className="min-h-screen pl-[84px]">
        <div className="px-4 py-8 sm:px-8">
          <Constellation
            profiles={data.profiles}
            attestations={data.attestations}
            derived={data.derived}
            vouchTotal={vouchTotal}
            loading={data.loading}
            error={data.error}
            filter={filter}
            onFilter={setFilter}
            onOpen={openDraft}
            onVouch={openVouch}
            onRetry={() => data.refresh()}
          />
        </div>
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
      <Desktop />
    </ToastProvider>
  );
}
