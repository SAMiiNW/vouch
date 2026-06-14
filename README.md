# Vouch

A handbook for an on-chain AI reputation attestation, built on GenLayer.

Reputation is usually a story you tell about yourself. Vouch turns it into something a peer
attests to and an AI assessor weighs, under the agreement of independent validators, written
permanently to a public chain. This document is a lexicon first: learn the six terms below and
the rest of the system reads itself.

Live dApp: https://samiinw.github.io/vouch/
Contract: https://explorer-bradbury.genlayer.com/address/0x85b7879F796C72b41d4c6F451f3868Ab7EcFD3be
Deploy transaction: https://explorer-bradbury.genlayer.com/tx/0xedc645b52f115ce9662666ee083b8fff1e49c73699e76d8920f7171073b130ff

---

## The lexicon

**Profile.** A subject's public record: a handle and a single claim of what they want to be
vouched for. Opening one is deterministic, no AI is involved. The wallet that opens a profile is
recorded as its subject and is forever barred from vouching for it.

**Vouch.** A peer's attestation backed by written evidence, submitted against a profile. A vouch
is the moment the AI engages. It must come from an address other than the subject; the contract
rejects a self-vouch before any model runs.

**Assessor.** The injection-resistant language model that reads the profile claim and the
attestation and returns a structured ruling. It treats the attestation as untrusted data, never
as instructions: an attempt to rewrite its rules or impersonate the system forces an Unverified
ruling with credibility zero.

**Ruling.** One of three words that settle the vouch:
- `TRUSTED` when concrete, first-hand evidence supports the claim (credibility 67-100).
- `MIXED` when the evidence is partial, generic, or loosely tied to the claim (credibility 34-66).
- `UNVERIFIED` when the evidence is empty, off-topic, unsupported, or a manipulation attempt (credibility 0-33).

**Credibility.** A 0-100 score that travels with the ruling. The contract clamps it into the band
its ruling allows, so the headline word and the number can never contradict each other on-chain.

**Consensus.** The reason any of this is trustworthy. The vouch is not settled by one machine; it
is settled by many validators that each re-run the assessor and must agree.

---

## How the terms connect

A subject opens a **Profile**. A peer reads it and files a **Vouch** with evidence. That write
wakes the **Assessor**, which returns a **Ruling** and a **Credibility** score. Independent
validators reach **Consensus** on that result, and the contract records the latest ruling, the
score, a one-line note, and a running tally of how many vouches the profile has received. The
front end never decides anything; it reads the settled state and stages the deliberation while it
happens.

---

## How GenLayer consensus is used

GenLayer validators do not trust the leader's answer. When a vouch is filed, the contract runs the
assessor through a custom validator built on `gl.vm.run_nondet_unsafe`:

- The **leader** runs the prompt, parses the JSON defensively, and produces `{ruling, credibility, note}`.
- Every **validator** re-runs the same prompt independently and compares its own result to the leader's:
  - the `ruling` word must match **exactly** (it drives state, so there is no tolerance);
  - the `credibility` score must agree within a tolerance of **20 points or 20 percent**, whichever is larger (prose differs between runs, so the number gets room, the word does not).
- Errors are classified so validators agree on failures too: `[EXPECTED]` business errors must match exactly, `[TRANSIENT]` network errors agree if both sides hit one, and `[LLM_ERROR]` or unknown failures force the leader to rotate.

This is the equivalence principle in practice: the substantive decision is compared, the freeform
text is not, and disagreement rotates the leader rather than locking in a bad answer.

What the prompt asks for is only half the guarantee. After consensus, **deterministic backstops**
re-impose every rule in code: the score is clamped into the band its ruling requires, so even if a
model were coaxed into an inconsistent answer, the on-chain record stays coherent. Prompt rules
deter; code rules enforce.

---

## The contract surface

Single file, `contracts/contract.py`, class `Vouch`. Storage is a `TreeMap[str, str]` of
JSON-serialized profiles, a `DynArray[str]` id index for pagination, a `DynArray[str]` append-only
attestation log, and `u256` counters maintained in O(1).

Writes:

| Method | Signature | Consensus |
| --- | --- | --- |
| `open_profile` | `(handle: str, claim: str) -> str` | Deterministic. Validates lengths, assigns `profile-N`, returns the id. No AI. |
| `submit_vouch` | `(profile_id: str, evidence: str) -> None` | The AI write. Guards (profile exists, evidence 1-600 chars, voucher is not the subject), then one consensus round, then backstop clamping, then state. |

Reads (no wallet required, paged at 20):

| Method | Signature | Returns |
| --- | --- | --- |
| `get_profiles` | `(start: u256) -> list` | A page of profile records from the id index. |
| `get_profile` | `(profile_id: str) -> dict` | One full profile record. |
| `get_attestations` | `(start: u256) -> list` | A page of the append-only event log. |
| `get_stats` | `() -> dict` | O(1) counters: profiles, vouches, trusted, owner. |

A profile record carries: `id`, `handle`, `claim`, `subject`, `status` (`OPEN` or `VOUCHED`),
`ruling`, `credibility`, `vouch_count`, `last_note`, `last_voucher`, `index`.

---

## A worked transaction

The verified end-to-end write on Bradbury:

1. The deployer account opened `profile-1` for `ada.eth`, claiming a senior smart-contract auditor
   who ships remediations before mainnet.
2. A second, freshly funded account (because a subject cannot vouch for itself) submitted an
   attestation describing a co-led audit that caught a reentrancy path two prior reviews missed.
3. The assessor ruled `TRUSTED` with credibility `85`, validators agreed, and the profile settled
   with that ruling, the assessor note, and `vouch_count` of 1.

---

## The frontend

Next.js 14 App Router exported as a static site (`output: 'export'`, `basePath: '/vouch'`), styled
in a soft light neumorphic system: a pale `#eef0f4` surface, extruded light/dark shadow layers, one
periwinkle-to-mint pastel accent, Manrope for type and IBM Plex Mono for addresses. The hero runs a
pulsing concentric trust-radar on canvas (rAF, devicePixelRatio-aware, paused when hidden, reduced
motion respected). Reads need no wallet and stream in immediately; the consensus screen polls
`gen_getTransactionByHash` (which escapes the view rate limit), peeks the leader's draft from the
receipt mid-deliberation, and keeps working through leader-rotation timeouts.

Chain plumbing lives in `src/lib` (`contract.ts`, `tx.ts`, `format.ts`) and stateful logic in
`src/hooks` (`useWallet`, `useContractData`, `useTransaction`). The contract holds all authoritative
state; there is no backend.

---

## Run it yourself

Prerequisites: Python with `genlayer-py`, Node 18+, the `genvm-linter`, and a Bradbury-funded key in
a repo-root `.env` as `GENLAYER_PRIVATE_KEY`. Claim test GEN at
https://testnet-faucet.genlayer.foundation/ .

Validate and test the contract:

```bash
genvm-lint lint contracts/contract.py --json
gltest tests/integration/ -v -s --network studionet
```

Deploy and verify:

```bash
python scripts/deploy.py        # writes deployment.json
python scripts/verify_read.py   # read gate
python scripts/verify_write.py  # opens a profile, funds a peer, files the AI vouch
```

Run the frontend:

```bash
cd frontend
npm install
npm run dev      # local
npm run build    # static export to out/
npm run deploy   # publish out/ to GitHub Pages
```

No deposits, no custody, no value transfer. Users pay only network fees, which are mostly refunded
after an AI write. A vouch is an AI ruling under validator consensus, not a background check.
