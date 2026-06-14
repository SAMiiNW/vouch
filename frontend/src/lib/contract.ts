import { createClient } from 'genlayer-js';
import { testnetBradbury } from 'genlayer-js/chains';
import type { GenLayerClient } from 'genlayer-js/types';

export const CONTRACT_ADDRESS = '0x85b7879F796C72b41d4c6F451f3868Ab7EcFD3be' as const;
export const DEPLOY_TX =
  '0xedc645b52f115ce9662666ee083b8fff1e49c73699e76d8920f7171073b130ff' as const;
export const EXPLORER = 'https://explorer-bradbury.genlayer.com';
export const FAUCET = 'https://testnet-faucet.genlayer.foundation/';
export const CHAIN_ID = 4221;

export type Ruling = 'TRUSTED' | 'MIXED' | 'UNVERIFIED' | '';

export interface Profile {
  id: string;
  handle: string;
  claim: string;
  subject: string;
  status: 'OPEN' | 'VOUCHED';
  ruling: Ruling;
  credibility: number;
  vouch_count: number;
  last_note: string;
  last_voucher: string;
  index: number;
}

export interface Stats {
  profiles: number;
  vouches: number;
  trusted: number;
  owner: string;
}

export const readClient: GenLayerClient<typeof testnetBradbury> = createClient({
  chain: testnetBradbury,
});

export function makeWalletClient(account: `0x${string}`) {
  return createClient({ chain: testnetBradbury, account } as Parameters<typeof createClient>[0]);
}

export async function withRpcRetry<T>(fn: () => Promise<T>, tries = 4): Promise<T> {
  let last: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (!/rate limit|429|timeout|network|fetch|-32/i.test(String(e))) throw e;
      await new Promise((r) => setTimeout(r, 2500 * 2 ** i));
    }
  }
  throw last;
}

function pick(raw: unknown, k: string): unknown {
  if (raw instanceof Map) return raw.get(k);
  if (raw && typeof raw === 'object') return (raw as Record<string, unknown>)[k];
  return undefined;
}

function normalizeProfile(raw: unknown): Profile {
  const r = String(pick(raw, 'ruling') ?? '').toUpperCase();
  const status = String(pick(raw, 'status') ?? 'OPEN').toUpperCase();
  return {
    id: String(pick(raw, 'id') ?? ''),
    handle: String(pick(raw, 'handle') ?? ''),
    claim: String(pick(raw, 'claim') ?? ''),
    subject: String(pick(raw, 'subject') ?? ''),
    status: status === 'VOUCHED' ? 'VOUCHED' : 'OPEN',
    ruling: (['TRUSTED', 'MIXED', 'UNVERIFIED'].includes(r) ? r : '') as Ruling,
    credibility: Number(pick(raw, 'credibility') ?? 0),
    vouch_count: Number(pick(raw, 'vouch_count') ?? 0),
    last_note: String(pick(raw, 'last_note') ?? ''),
    last_voucher: String(pick(raw, 'last_voucher') ?? ''),
    index: Number(pick(raw, 'index') ?? 0),
  };
}

function normalizeStats(raw: unknown): Stats {
  return {
    profiles: Number(pick(raw, 'profiles') ?? 0),
    vouches: Number(pick(raw, 'vouches') ?? 0),
    trusted: Number(pick(raw, 'trusted') ?? 0),
    owner: String(pick(raw, 'owner') ?? ''),
  };
}

export interface Attestation {
  id: string;
  event: string;
  ruling?: string;
  credibility?: number;
  note?: string;
  handle?: string;
  by: string;
}

function normalizeAttestation(raw: unknown): Attestation {
  return {
    id: String(pick(raw, 'id') ?? ''),
    event: String(pick(raw, 'event') ?? ''),
    ruling: pick(raw, 'ruling') ? String(pick(raw, 'ruling')) : undefined,
    credibility: pick(raw, 'credibility') !== undefined ? Number(pick(raw, 'credibility')) : undefined,
    note: pick(raw, 'note') ? String(pick(raw, 'note')) : undefined,
    handle: pick(raw, 'handle') ? String(pick(raw, 'handle')) : undefined,
    by: String(pick(raw, 'by') ?? ''),
  };
}

export async function fetchProfiles(start = 0): Promise<Profile[]> {
  const res = await withRpcRetry(() =>
    readClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_profiles',
      args: [start],
    }),
  );
  return Array.isArray(res) ? res.map(normalizeProfile) : [];
}

export async function fetchAttestations(start = 0): Promise<Attestation[]> {
  const res = await withRpcRetry(() =>
    readClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_attestations',
      args: [start],
    }),
  );
  return Array.isArray(res) ? res.map(normalizeAttestation) : [];
}

export async function fetchStats(): Promise<Stats> {
  const res = await withRpcRetry(() =>
    readClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_stats',
      args: [],
    }),
  );
  return normalizeStats(res);
}

export async function openProfile(
  client: ReturnType<typeof makeWalletClient>,
  handle: string,
  claim: string,
): Promise<`0x${string}`> {
  return client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: 'open_profile',
    args: [handle, claim],
    value: 0n,
  }) as Promise<`0x${string}`>;
}

export async function submitVouch(
  client: ReturnType<typeof makeWalletClient>,
  profileId: string,
  evidence: string,
): Promise<`0x${string}`> {
  return client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: 'submit_vouch',
    args: [profileId, evidence],
    value: 0n,
  }) as Promise<`0x${string}`>;
}
