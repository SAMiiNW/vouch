<div align="center">

# Vouch

### reputation that peers attest and consensus settles

an on-chain AI reputation oracle on GenLayer Bradbury

[**Open the app**](https://vouch-enn.pages.dev) &nbsp;.&nbsp; [**Contract**](https://explorer-bradbury.genlayer.com/address/0x85b7879F796C72b41d4c6F451f3868Ab7EcFD3be) &nbsp;.&nbsp; [**Deploy tx**](https://explorer-bradbury.genlayer.com/tx/0xedc645b52f115ce9662666ee083b8fff1e49c73699e76d8920f7171073b130ff) &nbsp;.&nbsp; [**Source**](https://github.com/SAMiiNW/vouch)

</div>

---

Most of what we call reputation is self-reported. Vouch replaces the claim-about-yourself with an attestation-from-a-peer that an AI assessor weighs and independent validators agree on, then writes to a public chain. What follows answers the questions a newcomer actually asks.

### "What do I do here?"

You open a profile, a handle and one claim of what you want to be known for. Then a peer (never you) files a vouch backed by written evidence. That vouch is the moment the assessor engages: it reads the claim and the evidence and returns a ruling with a credibility score, and the network settles it.

### "What can the assessor decide?"

Three outcomes, each pinned to a score band so the word and the number always agree:

- **TRUSTED** , concrete, first-hand evidence supports the claim (credibility 67-100)
- **MIXED** , partial, generic, or loosely related evidence (credibility 34-66)
- **UNVERIFIED** , empty, off-topic, unsupported, or a manipulation attempt (credibility 0-33)

### "Why can't I just vouch for myself?"

Because the contract refuses it. A vouch must come from an address other than the profile's subject, and that check runs before any model does. Reputation you mint alone is worth nothing, so the protocol makes it impossible.

### "Why trust the AI's answer?"

You do not trust the answer; you trust that many machines reproduced it. The vouch runs through a custom validator on `gl.vm.run_nondet_unsafe`. The leader produces `{ruling, credibility, note}`, and every validator re-runs the same prompt and compares:

- the `ruling` word must match **exactly** (it drives state),
- the `credibility` must agree within **20 points or 20 percent**, whichever is larger (prose varies between runs, the number gets room),
- error classes are compared so validators even agree on failures, and an `[LLM_ERROR]` rotates the leader instead of locking in a bad result.

After consensus, deterministic backstops re-clamp the score into its ruling's band. The prompt deters manipulation; the code enforces coherence.

### "What exactly can I call on-chain?"

`contracts/contract.py`, class `Vouch`. Two writes, four reads.

| Call | Kind | Notes |
| --- | --- | --- |
| `open_profile(handle, claim) -> id` | write, deterministic | validates lengths, assigns `profile-N`, no AI |
| `submit_vouch(profile_id, evidence)` | write, AI + consensus | guards (exists, evidence 1-600, voucher is not subject), rules, clamps, records |
| `get_profiles(start)` | view | page of profiles (20) |
| `get_profile(profile_id)` | view | one full record |
| `get_attestations(start)` | view | append-only event log (20) |
| `get_stats()` | view | O(1) counters: profiles, vouches, trusted, owner |

A profile record carries `id, handle, claim, subject, status, ruling, credibility, vouch_count, last_note, last_voucher, index`.

### "Show me it actually worked."

The verified write on Bradbury: the deployer opened `profile-1` for `ada.eth` (a senior auditor who ships remediations before mainnet); a separate funded account filed an attestation describing a co-led audit that caught a reentrancy path two reviews had missed; the assessor ruled **TRUSTED 85**, validators agreed, and the profile settled with that ruling and a vouch count of one.

### "How is it built?"

A static Next.js 14 export, no backend. Soft light-neumorphic design (pale surfaces, extruded shadows, a periwinkle-to-mint accent, Manrope and IBM Plex Mono), with the registry laid out as a clean structured grid and a live "trust lattice" that wires to the assessor core when your wallet connects. The contract owns every authoritative fact; the client only reads it and stages the deliberation. Chain plumbing sits in `src/lib`, stateful logic in `src/hooks`. Transaction status is polled with `gen_getTransactionByHash` so it escapes the view rate limit, and the leader's draft ruling is peeked from the receipt mid-consensus.

### "How do I run it?"

```bash
# contract
genvm-lint lint contracts/contract.py --json
gltest tests/integration/ -v -s --network studionet

# deploy + verify (GENLAYER_PRIVATE_KEY in .env, funded from the faucet)
python scripts/deploy.py
python scripts/verify_read.py
python scripts/verify_write.py   # opens a profile, funds a peer, files the AI vouch

# frontend
cd frontend && npm install && npm run build
```

Hosting is Cloudflare Pages, the build drops its `basePath` when `CF_PAGES=1`, so `CF_PAGES=1 npm run build` then `wrangler pages deploy out --project-name vouch`.

### "Anything I should know?"

No deposit, stake, or custody, ever; you pay only network fees, mostly refunded after an AI write. Majority agreement settles a write, a single out-of-tolerance dissent is normal. A vouch is an AI ruling under validator consensus on a testnet, not a background check or financial advice. Test GEN: https://testnet-faucet.genlayer.foundation/
