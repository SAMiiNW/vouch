# Vouch - Wireframe (trust constellation / relationship desktop)

## Metaphor
Not a website, not a dashboard. A futuristic, tactile OPERATING-SYSTEM surface called
the **Trust Constellation**. Vouch is a relationship desktop: floating profile nodes
drift in open space, each wired by a soft trust-cord to a single central **Assessor Core**
(the injection-resistant AI that rules under validator consensus). The whole thing reads
as an extruded, soft-neumorphic OS panel, not a scrolling page.

## Global frame (NO header / content / footer stack)
```
+--+------------------------------------------------------------------+
|  |                                                                   |
|R |        ( open surface - the constellation field )                |
|A |                                                                   |
|I |                                                                   |
|L |                                                                   |
|  |                                                                   |
+--+------------------------------------------------------------------+
```
- LEFT VERTICAL RAIL (thin OS dock, ~84px, fixed full-height). This is the only
  navigation. Vertical stack of icon glyphs, labels reveal on hover as side flyouts:
    - top:    brand glyph (shield mark) + tiny "Bradbury" status dot
    - nodes:  jump to constellation (home)
    - compose: open a profile (fires the modal)
    - signals: jump to the signal feed
    - ports:  jump to system ports (links)
    - bottom: WALLET ORB - connect, or address chip + flyout (copy / disconnect / wrong-net warn)
- NO top bar, NO horizontal menu, NO centered hero, NO footer band.

## The surface (free-form, asymmetric, large empty space)
A single large relative canvas. Sections are FLOATING PANELS pinned at asymmetric
coordinates, different shapes/sizes/orientations, with generous void between them.
An absolute SVG layer sits BEHIND the nodes and draws soft curved trust-cords
(flowing dashed beziers) from the Assessor Core out to every profile node.

```
   [Intro slab]  (top-left, wide low panel: name + one-line claim + Open-profile key)

                                         {Filter Lens}  (top-right, VERTICAL stack
                                          of round lenses: All/Open/Trusted/Mixed/Unverified,
                                          each a dial with a count)

          o profile node                 o profile node
            \                           /
             \         (((  ASSESSOR CORE  )))   <- offset left-of-center, NOT centered
              \        radar pulse + avg score
       o node --\------/   |   \------ o node          radiating ruling readouts
                 \        |          \                 (profiles / vouches / trusted
                  o node  o node      o node            / mixed / unverified) as small
                                                         floating chips around the core

                         [ Signal feed ]  (lower-right floating column: recent
                                            OPENED / ruling events, newest first)

   [ System ports ]  (lower-left: registry contract + copy, faucet "Get test GEN to
                       attest", "View on explorer", GenLayer docs, attestation disclaimer)
```

### Assessor Core (central node, asymmetric placement ~38% / 46%)
- Round extruded core with the existing TrustRadar canvas motif pulsing inside.
- Center: average credibility score + "avg score".
- Around it, ruling tallies as small extruded chips wired into the rim.
- This is the hub every trust-cord connects to.

### Profile nodes (orbiting, scattered, mixed sizes)
- Each profile is a compact floating node placed on an elliptical orbit around the core
  using a golden-angle scatter (deterministic, non-grid, clamped to the field).
- Node shows: ruling/await icon, handle, ruling label, big score, a thin trust meter,
  a one-line claim, subject short-addr, vouch count, and a "Vouch" key.
- Sizes vary by ruling/index so the field is non-uniform. Each gently floats (node-float).
- A soft trust-cord (SVG bezier, flowing dash) ties each node to the Assessor Core.
- Small screens: cords hide, nodes reflow into a single soft column (still usable).

### States
- Loading: cords + ghost nodes shimmer; skeleton slab near the core.
- Empty: a single "first light" slab at the core inviting the first profile.
- Error: a floating fault slab at the core with retry + explorer link.

## Flows preserved (unchanged logic)
- Wallet connect/disconnect + wrong-network warning (rail orb flyout).
- Open-profile modal + vouch modal (self-vouch blocked by contract; reminder copy kept).
- Consensus stage panel inside the modal; toasts bottom-right; slow 95s polling.
- Copy-to-clipboard on contract + address.
- Links: faucet, explorer, registry contract, docs. Disclaimer about Bradbury / AI read.

## Self-review (must be clearly unique)
- Horizontal nav bar? NO. Top-centered menu? NO. Dashboard top header? NO.
- Header/content/footer stack? NO - free-form surface, sections float.
- Standard content sidebar? NO - the left element is a thin icon-only OS dock (the
  required vertical rail), not a content column.
- Glassmorphism frosted cards? NO - soft-neumorphic extruded surfaces only.
- Resembles Coinbase / Arbitrum / Celestia / EigenLayer / a SaaS dashboard / a landing
  page / an app shell? NO - it is a constellation desktop: orbiting profile nodes wired
  by trust-cords to a central AI core on an OS surface.
- Distinct from sibling projects (moderation console, vault terminal)? YES - the
  relationship-constellation hub-and-cord metaphor shares nothing structural with them.
VERDICT: unique. Build it.
```
