'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, UserPlus, TriangleAlert, ExternalLink, Wallet, MessageSquarePlus, Info } from 'lucide-react';
import type { useTransaction } from '@/hooks/useTransaction';
import type { Profile } from '@/lib/contract';
import { ConsensusStage } from './ConsensusStage';
import { ProfileCard } from './ProfileCard';
import { EXPLORER, FAUCET } from '@/lib/contract';
import { shortAddr } from '@/lib/format';

const MAX_HANDLE = 80;
const MAX_CLAIM = 240;
const MAX_EVIDENCE = 600;

export type ModalMode = 'open' | 'vouch';

interface Props {
  open: boolean;
  mode: ModalMode;
  target: Profile | null;
  onClose: () => void;
  address: `0x${string}` | null;
  chainOk: boolean;
  onConnect: () => void;
  txApi: ReturnType<typeof useTransaction>;
  setTxInFlight: (v: boolean) => void;
}

export function VouchModal({
  open,
  mode,
  target,
  onClose,
  address,
  chainOk,
  onConnect,
  txApi,
  setTxInFlight,
}: Props) {
  const { state, submitOpen, submitVouchTx, reset } = txApi;
  const [handle, setHandle] = useState('');
  const [claim, setClaim] = useState('');
  const [evidence, setEvidence] = useState('');
  const [confirming, setConfirming] = useState(false);
  const firstRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && state.phase === 'idle') {
      setHandle('');
      setClaim('');
      setEvidence('');
      setConfirming(false);
      setTimeout(() => firstRef.current?.focus(), 80);
    }
  }, [open, mode, state.phase]);

  if (!open) return null;

  const busy = state.phase === 'wallet' || state.phase === 'submitted' || state.phase === 'consensus';

  const handleErr = handle.trim().length === 0 ? 'Required' : handle.length > MAX_HANDLE ? 'Too long' : '';
  const claimErr = claim.trim().length === 0 ? 'Required' : claim.length > MAX_CLAIM ? 'Too long' : '';
  const evidenceErr = evidence.trim().length === 0 ? 'Required' : evidence.length > MAX_EVIDENCE ? 'Too long' : '';
  const valid = mode === 'open' ? !handleErr && !claimErr : !evidenceErr;

  const selfVouch = mode === 'vouch' && target && address &&
    target.subject.toLowerCase() === address.toLowerCase();

  function handleClose() {
    if (busy) return;
    setConfirming(false);
    reset();
    onClose();
  }

  function startConfirm() {
    if (!valid) return;
    if (!address) {
      onConnect();
      return;
    }
    setConfirming(true);
  }

  async function doSubmit() {
    if (!address) return;
    setConfirming(false);
    if (mode === 'open') {
      await submitOpen(address, handle.trim(), claim.trim(), setTxInFlight);
    } else if (target) {
      await submitVouchTx(address, target.id, evidence.trim(), setTxInFlight);
    }
  }

  const title = mode === 'open' ? 'Open a profile' : 'Submit a vouch';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-0 backdrop-blur-sm sm:p-6"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-base sm:h-auto sm:max-h-[90vh] sm:rounded-soft sm:shadow-raised-lg"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between bg-base/90 px-6 py-5 backdrop-blur-md">
            <span className="flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight text-ink">
              <span className="neu-sm flex h-9 w-9 items-center justify-center rounded-xl">
                {mode === 'open' ? <UserPlus size={17} className="text-peri-deep" /> : <MessageSquarePlus size={17} className="text-peri-deep" />}
              </span>
              {title}
            </span>
            {!busy && (
              <button type="button" aria-label="Close" onClick={handleClose} className="focus-ring text-ink-faint hover:text-ink">
                <X size={22} />
              </button>
            )}
          </div>

          <div className="p-6 pt-2">
            {/* FORM */}
            {state.phase === 'idle' && !confirming && (
              <div>
                {mode === 'vouch' && target && (
                  <div className="well mb-5 rounded-xl p-4">
                    <p className="uplabel text-ink-faint">Vouching for</p>
                    <p className="mt-1 font-display text-base font-bold text-ink">{target.handle}</p>
                    <p className="mt-1 font-body text-sm leading-relaxed text-ink-soft">{target.claim}</p>
                    <p className="mt-2 font-mono text-[11px] text-ink-faint">subject {shortAddr(target.subject)}</p>
                  </div>
                )}

                {mode === 'vouch' && (
                  <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-peri/10 px-4 py-3">
                    <Info size={16} className="mt-0.5 shrink-0 text-peri-deep" />
                    <p className="font-body text-xs leading-relaxed text-ink-soft">
                      A vouch must come from a different wallet than the subject. The contract rejects
                      a self-vouch, so connect as a peer, not as the profile owner.
                    </p>
                  </div>
                )}

                {mode === 'open' ? (
                  <>
                    <label className="block">
                      <span className="uplabel font-mono text-ink-faint">Handle</span>
                      <input
                        ref={firstRef as React.RefObject<HTMLInputElement>}
                        value={handle}
                        onChange={(e) => setHandle(e.target.value.slice(0, MAX_HANDLE + 6))}
                        placeholder="A name or handle, e.g. ada.eth"
                        className="well-input focus-ring mt-2 w-full rounded-xl px-4 py-3 font-body text-ink outline-none placeholder:text-ink-faint"
                      />
                      <div className="mt-1 flex justify-between font-mono text-xs">
                        <span className="text-unverified">{handle.length > 0 ? handleErr : ''}</span>
                        <span className={handle.length > MAX_HANDLE ? 'text-unverified' : 'text-ink-faint'}>
                          {handle.length}/{MAX_HANDLE}
                        </span>
                      </div>
                    </label>

                    <label className="mt-4 block">
                      <span className="uplabel font-mono text-ink-faint">What you want to be vouched for</span>
                      <textarea
                        value={claim}
                        onChange={(e) => setClaim(e.target.value.slice(0, MAX_CLAIM + 20))}
                        rows={4}
                        placeholder="State the specific skill, role, or contribution peers can attest to."
                        className="well-input focus-ring mt-2 w-full resize-none rounded-xl px-4 py-3 font-body text-ink outline-none placeholder:text-ink-faint"
                      />
                      <div className="mt-1 flex justify-between font-mono text-xs">
                        <span className="text-unverified">{claim.length > 0 ? claimErr : ''}</span>
                        <span className={claim.length > MAX_CLAIM ? 'text-unverified' : 'text-ink-faint'}>
                          {claim.length}/{MAX_CLAIM}
                        </span>
                      </div>
                    </label>
                  </>
                ) : (
                  <label className="block">
                    <span className="uplabel font-mono text-ink-faint">Your attestation</span>
                    <textarea
                      ref={firstRef as React.RefObject<HTMLTextAreaElement>}
                      value={evidence}
                      onChange={(e) => setEvidence(e.target.value.slice(0, MAX_EVIDENCE + 40))}
                      rows={6}
                      placeholder="Give concrete, first-hand evidence for the claim. Specific, verifiable detail earns trust; vague praise does not."
                      className="well-input focus-ring mt-2 w-full resize-none rounded-xl px-4 py-3 font-body text-ink outline-none placeholder:text-ink-faint"
                    />
                    <div className="mt-1 flex justify-between font-mono text-xs">
                      <span className="text-unverified">{evidence.length > 0 ? evidenceErr : ''}</span>
                      <span className={evidence.length > MAX_EVIDENCE ? 'text-unverified' : 'text-ink-faint'}>
                        {evidence.length}/{MAX_EVIDENCE}
                      </span>
                    </div>
                  </label>
                )}

                {selfVouch && (
                  <p className="mt-4 rounded-xl bg-unverified/10 px-4 py-3 font-mono text-xs text-unverified">
                    This wallet opened the profile. Switch to a different wallet to vouch for it.
                  </p>
                )}

                {!address ? (
                  <button
                    type="button"
                    onClick={onConnect}
                    className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-pill accent-grad py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5"
                  >
                    <Wallet size={16} /> Connect wallet
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!valid || !!selfVouch}
                    onClick={startConfirm}
                    className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-pill accent-grad py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                  >
                    {mode === 'open' ? <UserPlus size={16} /> : <MessageSquarePlus size={16} />}
                    {mode === 'open' ? 'Open the profile' : 'Send to the assessor'}
                  </button>
                )}
                {!chainOk && address && (
                  <p className="mt-3 text-center font-mono text-xs text-mixed">
                    Switch your wallet to Bradbury (4221) before submitting.
                  </p>
                )}
              </div>
            )}

            {/* CONFIRM */}
            {state.phase === 'idle' && confirming && (
              <div className="text-center">
                <span className="neu mx-auto flex h-16 w-16 items-center justify-center rounded-3xl">
                  <TriangleAlert size={28} className="text-peri-deep" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink">Confirm submission</h3>
                <p className="mt-3 font-body text-sm text-ink-soft">
                  This submits a transaction on Bradbury Testnet. Network fees apply (mostly refunded
                  after the AI write). No deposit is taken.
                </p>
                {mode === 'vouch' && (
                  <p className="mt-3 rounded-xl bg-peri/10 px-4 py-3 font-body text-xs text-ink-soft">
                    Reminder: a vouch must come from a wallet different from the subject. The contract
                    will reject a self-vouch on-chain.
                  </p>
                )}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="neu-sm focus-ring flex-1 rounded-pill py-3 font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft hover:text-ink"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={doSubmit}
                    className="focus-ring flex-1 rounded-pill accent-grad py-3 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {/* WALLET / SUBMITTED */}
            {(state.phase === 'wallet' || state.phase === 'submitted') && (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="neu flex h-20 w-20 items-center justify-center rounded-full">
                  <MessageSquarePlus size={34} className="animate-pulse text-peri-deep" />
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-ink">
                  {state.phase === 'wallet' ? 'Confirm in your wallet' : 'Submitted to Bradbury'}
                </h3>
                <p className="mt-2 font-body text-sm text-ink-soft">
                  {state.phase === 'wallet'
                    ? 'Approve the transaction to proceed.'
                    : 'Your submission is queued. Consensus is beginning.'}
                </p>
                {state.hash && (
                  <a
                    href={`${EXPLORER}/tx/${state.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-1 font-mono text-xs text-peri-deep hover:underline"
                  >
                    View transaction <ExternalLink size={12} />
                  </a>
                )}
              </div>
            )}

            {/* CONSENSUS */}
            {state.phase === 'consensus' && (
              <div className="py-4">
                <ConsensusStage tx={state} />
              </div>
            )}

            {/* CONFIRMED */}
            {state.phase === 'confirmed' && (
              <div>
                <p className="text-center font-display text-2xl font-extrabold tracking-tight text-ink">
                  {state.kind === 'open' ? 'Profile is on the registry' : 'The assessor has ruled'}
                </p>
                <p className="mt-2 text-center font-body text-sm text-ink-soft">
                  {state.kind === 'open'
                    ? 'Peers can now vouch for it with evidence.'
                    : 'Sealed under validator consensus and written on-chain.'}
                </p>
                {state.result && (
                  <div className="mt-6">
                    <ProfileCard profile={state.result} fresh />
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="focus-ring mt-6 w-full rounded-pill accent-grad py-3 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5"
                >
                  Done
                </button>
              </div>
            )}

            {/* ERROR */}
            {state.phase === 'error' && (
              <div className="flex flex-col items-center py-10 text-center">
                <span className="neu flex h-16 w-16 items-center justify-center rounded-3xl">
                  <TriangleAlert size={28} className="text-unverified" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink">Submission failed</h3>
                <p className="mt-2 max-w-sm font-body text-sm text-ink-soft">{state.error}</p>
                {/fee reserve|LackOfFundForMaxFee/i.test(state.error ?? '') && (
                  <a href={FAUCET} target="_blank" rel="noopener noreferrer" className="mt-3 font-mono text-xs text-peri-deep hover:underline">
                    Get test GEN to attest
                  </a>
                )}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="focus-ring rounded-pill accent-grad px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-glow"
                  >
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="neu-sm focus-ring rounded-pill px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-ink-soft hover:text-ink"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
