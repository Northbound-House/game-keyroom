# The Key Room

Browser escape adventures by Northbound House. Static site — no build step, no dependencies, deploys anywhere that serves HTML.

## Structure

```
/
├── index.html                          # Landing page + password gates
├── SERIES-PLAN.md                      # Anthology plan (grammar, trilogies, roadmap)
└── games/
    ├── level-1-stateroom-77.html       # Series 1 · Chapter I (open)
    ├── level-2-chart-room.html         # Series 1 · Chapter II (sealed)
    ├── level-3-the-lantern.html        # Series 1 · Chapter III (sealed)
    ├── redeye-1-the-terminal.html      # Series 2 · Chapter I (open)
    ├── redeye-2-the-red-eye.html       # Series 2 · Chapter II (sealed)
    └── redeye-3-arrivals.html          # Series 2 · Chapter III (sealed)
```

See **[`SERIES-PLAN.md`](SERIES-PLAN.md)** for the full anthology plan — the shared
design "grammar," every trilogy spec, and the roadmap.

## The series

### Series One — The Meridian *(shipped)*
1934, the maiden voyage of the S.S. Meridian. You're a courier smuggling 41 refugee
families to safety under false names. Language: Morse & signal flags.
**Stateroom 77** → **The Chart Room** → **The Lantern**.

### Series Two — The Red-Eye *(complete)*
**Meridian Airways · 1962 — a scandal at 30,000 feet.** You're handed a stranger's
locker claim-ticket at a gate and asked to carry a bundle of love letters onto the
midnight transatlantic — and learn the affair was only ever the cover for the
scandal. The affair is between film star *Coralie Vance* and airline executive
*Julian Roscoe*; the secret underneath is **corruption inside Meridian Airways**,
and the film canister everyone wants is the proof. Language: the split-flap
departures board, airport codes, and the telex.

| Ch | Room | Structure | What you do |
|----|------|-----------|-------------|
| **I** | **The Terminal** | single space, the airport | Read the split-flap board, crack the left-luggage locker, pick the ops desk, recover the letters + film, and board before final call. *Carries out → `7A`.* |
| **II** | **The Red-Eye** | dual-track jet cabin (trails meet at the telex) | Crack the attaché case in the overhead, then decode the incoming telex using the letters' numbers as a one-time key — the film is a ledger of bribes, not romance. The finale makes you *write* in the cipher and send a word back. *Carries out → `PRINT`.* |
| **III** | **Arrivals** | multi-zone finale (passports → customs → the apron) | Convert the press deadline across time zones on the wall of world clocks (`0740`), let customs seize the reel and take it back out of the bonded cage (`FILM`), then answer the courier's cipher challenge (`PTTL` → `LAMP`) and choose who the company man follows. |

**How Series Two overlaps Series One** *(the "safe and a desk" DNA — kept on purpose):*
the safe (a left-luggage locker, then an attaché case) · the desk (the airline ops
desk) · paper you read (tickets, manifest, telex, the letters) · carry-the-code
gating · a language to learn then use (the telex, as Morse was) · an absent guide
with a late reveal ("V") · the recontextualization twist (the love letters are code)
· two-axis escalation (single space → dual-track → multi-zone; escape self → act for
someone else) · the same plumbing (3-tier in-character hints, countdown with beats,
victory ranks).

**How Series Two differs** *(new world, new feel):* era & place (1962 airport + jet
vs 1934 liner) · **palette** (Pan-Am blue, chrome, terrazzo, red DEPARTURES neon vs
deco brass) · core mechanic (split-flap board / airport & time-zone codes / telex vs
Morse & flags) · tone & verb (glamour-noir scandal; *intercept & uncover* vs earnest
rescue; escape *out*) · structure (terminal → confined cabin → multi-zone arrivals
vs room → dual room → multi-floor).

> **House rule — same font, same formatting, own colours.** Every trilogy uses the
> same type system (Poiret One · Cormorant Garamond · IBM Plex Mono) and the same
> component formatting. **Colour is the only visual variable.** See
> [`SERIES-PLAN.md`](SERIES-PLAN.md) for the palette contract.

## Gating

Chapters II and III are sealed on the landing page. The unseal codes are the
solutions earned by finishing the previous chapter:

- **Chapter II** ← the code that opens the stateroom door in Chapter I
- **Chapter III** ← the word transmitted from the wireless in Chapter II

Codes are stored as SHA-256 hashes in `index.html` (not plaintext), and unlocks
persist in `localStorage`. This is honor-system gating for a static site — the
game URLs themselves are not secret. If a series ever needs real access
control, that's a server-side feature (or Cloudflare Access), not an MVP one.

To add or change a code:

```bash
python3 -c "import hashlib; print(hashlib.sha256('newcode'.encode()).hexdigest())"
```

Lowercase the code before hashing — the gate normalizes input with
`.trim().toLowerCase()`.

## Deploy to GitHub Pages

This repo lives at **`Northbound-House/game-keyroom`** and deploys from `main` /
`/ (root)` via Settings → Pages (Source: **Deploy from a branch**).

- github.io URL: `https://northbound-house.github.io/game-keyroom/`
- Custom domain: **`keyroom.northboundhouse.com`** (set by the `CNAME` file),
  same pattern as the `cadence.northboundhouse.com` / `roadrover.northboundhouse.com`
  subdomains. The DNS `CNAME` record `keyroom` → `northbound-house.github.io`
  must exist for the custom domain to serve.

## Adding a new series

1. Drop the game files in `games/`.
2. Copy a `<section class="series">` block in `index.html`, update titles and
   episode rows.
3. Add entries to the `EPISODES` map with each chapter's `href` and code hash.
4. Replace the "Series Two" coming-soon card, or move it below the new series.
