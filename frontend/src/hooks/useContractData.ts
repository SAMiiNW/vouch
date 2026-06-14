'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchProfiles,
  fetchStats,
  fetchAttestations,
  type Profile,
  type Stats,
  type Attestation,
} from '@/lib/contract';

const POLL_MS = 95000;

export interface ContractData {
  profiles: Profile[];
  attestations: Attestation[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;
  derived: {
    total: number;
    open: number;
    vouched: number;
    trusted: number;
    mixed: number;
    unverified: number;
    avgCredibility: number;
  };
  refresh: () => Promise<void>;
  setTxInFlight: (v: boolean) => void;
}

export function useContractData(): ContractData {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const txInFlight = useRef(false);
  const alive = useRef(true);

  const loadAll = useCallback(async () => {
    try {
      const all: Profile[] = [];
      let start = 0;
      for (let guard = 0; guard < 50; guard++) {
        const page = await fetchProfiles(start);
        all.push(...page);
        if (page.length < 20) break;
        start += 20;
      }
      const log: Attestation[] = [];
      let lstart = 0;
      for (let guard = 0; guard < 50; guard++) {
        const page = await fetchAttestations(lstart);
        log.push(...page);
        if (page.length < 20) break;
        lstart += 20;
      }
      const s = await fetchStats();
      if (!alive.current) return;
      setProfiles(all);
      setAttestations(log);
      setStats(s);
      setError(null);
    } catch (e) {
      if (!alive.current) return;
      const msg = String(e);
      if (/contract not found|execution reverted/i.test(msg)) {
        setError(
          'No contract responded at the configured address on Bradbury. The deployment may need repair.',
        );
      } else {
        setError('Could not reach the contract.');
      }
    } finally {
      if (alive.current) setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadAll();
  }, [loadAll]);

  const setTxInFlight = useCallback((v: boolean) => {
    txInFlight.current = v;
  }, []);

  useEffect(() => {
    alive.current = true;
    loadAll();
    const id = setInterval(() => {
      if (!txInFlight.current) loadAll();
    }, POLL_MS);
    return () => {
      alive.current = false;
      clearInterval(id);
    };
  }, [loadAll]);

  const derived = useMemo(() => {
    const total = profiles.length;
    const vouched = profiles.filter((p) => p.status === 'VOUCHED');
    const creds = vouched.map((p) => p.credibility).filter((c) => c > 0);
    const avg = creds.length ? Math.round(creds.reduce((a, b) => a + b, 0) / creds.length) : 0;
    return {
      total,
      open: profiles.filter((p) => p.status === 'OPEN').length,
      vouched: vouched.length,
      trusted: vouched.filter((p) => p.ruling === 'TRUSTED').length,
      mixed: vouched.filter((p) => p.ruling === 'MIXED').length,
      unverified: vouched.filter((p) => p.ruling === 'UNVERIFIED').length,
      avgCredibility: avg,
    };
  }, [profiles]);

  return { profiles, attestations, stats, loading, error, derived, refresh, setTxInFlight };
}
