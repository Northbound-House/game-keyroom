# The Key Room

Browser escape adventures by Northbound House. Static site — no build step, no dependencies, deploys anywhere that serves HTML.

## Structure

```
/
├── index.html                          # Tense hub (Past / Present / Future) + gates
├── SERIES-PLAN.md                      # Canonical plan (structure, every trilogy, roadmap)
├── assets/                             # Shared, loaded by every page
│   ├── theme.css                       #   all formatting + the type system
│   ├── engine.js                       #   timer, modal, inventory, hints, code entry
│   ├── easter-eggs.js                  #   77 · lantern-crest · curator card
│   ├── palette-meridian.css            #   Past · brass          ┐ colours + font
│   ├── palette-redeye.css              #   Past · Pan-Am blue    │ vars only
│   ├── palette-waypoint.css            #   Future · ultraviolet  ┘
│   ├── redeye-components.css / .js     #   Red-Eye props + cipher
│   └── waypoint-components.css / .js   #   Waypoint props + beacon/approach
└── games/
    ├── level-1-stateroom-77.html       # Past · The Meridian · I (open)
    ├── level-2-chart-room.html         # Past · The Meridian · II (sealed)
    ├── level-3-the-lantern.html        # Past · The Meridian · III (sealed)
    ├── redeye-1-the-terminal.html      # Past · The Red-Eye · I (open)
    ├── redeye-2-the-red-eye.html       # Past · The Red-Eye · II (sealed)
    ├── redeye-3-arrivals.html          # Past · The Red-Eye · III (sealed)
    ├── waypoint-1-the-station.html     # Future · The Waypoint · I (open)
    ├── waypoint-2-the-approach.html    # Future · The Waypoint · II (sealed)
    └── waypoint-3-the-threshold.html   # Future · The Waypoint · III (sealed)
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

### Series Three — The Waypoint *(complete · Future)*
**Waypoint 0077 · deep transit.** You wake alone on a relay-and-beacon station — a
lighthouse of the shipping lanes — whose light has gone out, with a ship inbound
through the dark. Earnest and luminous. Language: the approach board and the beacon
characteristic (`Fl(N) Ps` — read a pulse, then set one).

| Ch | Room | Structure | What you do |
|----|------|-----------|-------------|
| **I** | **The Station** | single deck | Read the approach board and beacon pulse, crack the equipment locker (`0077`) and console (`LANTERN`), and discover the inbound isn't in distress — it's your relief. *Carries out → `214`.* |
| **II** | **The Approach** | dual-track (systems + comms, meet at the beacon) | Cold-start the reactor (`0308`), tune the receiver to `214`, name the tender from her characteristic (`MERIDIAN`), then *set and broadcast* the station's own light. *Carries out → `KEPT`.* |
| **III** | **The Threshold** | 3-zone finale (outer marker → alignment → threshold) | Light the outer marker (`0143`), match the tender's docking pulse, send clearance (`CROSS`), and choose: take the relief berth, or **hold the light**. |

**The twist (the relief ship):** the "distress" was your relief; the station is what's
failing, and you can only be relieved by *becoming* the keeper. You came to escape
the dark and stayed to be the light in it.

> **House rule — same formatting everywhere; colour by trilogy; font by tense; mono
> is universal.** Every trilogy shares identical component formatting. Colour varies
> per trilogy; the display/body font varies per tense (Past = Poiret One/Cormorant;
> Present = Space Grotesk; Future = Michroma/Plex) while IBM Plex Mono stays constant.
> See [`SERIES-PLAN.md`](SERIES-PLAN.md) for the palette + font contract.

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

## Install as an app (PWA)

The Key Room is a Progressive Web App — it installs to a phone's home screen, opens
full-screen with no browser chrome, and (once opened online once) **plays offline**,
so testers can take it on a plane. Same setup as `app-waypoint`: a
[`manifest.webmanifest`](manifest.webmanifest), a Workbox service worker
([`sw.js`](sw.js)) registered by [`assets/pwa.js`](assets/pwa.js), and
`apple-mobile-web-app-*` meta on every page.

**For testers — how to install (from `https://keyroom.northboundhouse.com`):**

- **iPhone / iPad (Safari):** tap **Share** (the square-with-arrow) → **Add to Home
  Screen** → **Add**. Launch it from the new "Key Room" icon — it opens full-screen.
- **Android (Chrome):** tap **⋮** (top-right) → **Install app** (or **Add to Home
  Screen**) → **Install**. Or accept the "Install" banner if it appears.
- **Desktop (Chrome/Edge):** click the **install icon** in the address bar (a monitor
  with a down-arrow), or **⋮ → Install The Key Room**.

Offline works after the first online visit (the service worker precaches the whole
game shell). To update the cache after a deploy, **bump `VERSION` in `sw.js`**.

> Notes: PWA install requires HTTPS — it only kicks in on the live site, not on
> `file://` or plain `http://`. Installability is per-origin, so it's tied to
> `keyroom.northboundhouse.com`.

## Sharing / social preview

Pasting the link anywhere (Slack, iMessage, Twitter/X, LinkedIn) shows a branded
card: the lantern crest, **THE KEY ROOM** wordmark, the tense spectrum, and the
Northbound House byline — driven by the Open Graph / Twitter meta in each page's
`<head>` and [`icons/og-card.png`](icons/og-card.png).

**Branding assets** live in `icons/` (favicon, apple-touch, 192/512/maskable, the OG
card) plus [`favicon.svg`](favicon.svg). They're generated from source SVGs in the
project's `branding/` working files by rasterising with macOS `qlmanage` + `sips`
(no image libraries required) — re-run that if the crest or wordmark ever change.

## Adding a new series

Every series is filed under a **tense** (Past / Present / Future) and inherits that
tense's fonts automatically. Formatting and plumbing are shared — a new trilogy is
"author the rooms, pick the colours."

1. **Palette.** Add `assets/palette-<name>.css` defining the full palette contract
   (all `--*` colour vars + `--font-display/--font-body/--font-mono` for its tense).
   Contrast-check the dimmed text. See `SERIES-PLAN.md` §3.
2. **Chapter files.** Drop them in `games/`. Each loads `theme.css` + its palette +
   `engine.js` (+ any shared trilogy module), carries `<body class="chapter">`, and
   defines only `S`, `HINTS`, `inspectItem`, its rooms, and its puzzle logic.
3. **Shared mechanic (optional).** If a mechanic spans the trilogy (like the Red-Eye
   cipher or the Waypoint beacon), extract `assets/<name>-components.css` + `.js`.
4. **Landing.** Add the series card to the matching tense view in `index.html`
   (Ch I open, later chapters sealed), and add `EPISODES` entries with the SHA-256
   hash of each unseal code (loop is `Object.keys(EPISODES)`, so no code change).
5. **Docs.** Record the trilogy (codes, carries, twist) in `SERIES-PLAN.md`.
