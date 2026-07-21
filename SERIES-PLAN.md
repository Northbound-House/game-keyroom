# The Key Room — Series Plan

An anthology of browser escapes by **Northbound House**, organised by **tense**.
Each trilogy is its own world; they all speak one design language. This doc is the
canonical record: the structure, the shared architecture, every built trilogy with
its codes, the designed-but-unbuilt ones, and the roadmap.

## Status snapshot

| Tense | Trilogy | Chapters | State |
|---|---|---|---|
| **Past** (brass) | The Meridian · 1934 | Stateroom 77 · The Chart Room · The Lantern | ✅ live |
| **Past** (brass) | The Red-Eye · 1962 | The Terminal · The Red-Eye · Arrivals | ✅ live |
| **Future** (ultraviolet) | The Waypoint · deep transit | The Station · The Approach · The Threshold | ✅ live |
| **Present** (sky) | The Unit · now | The Unit · The Trail · The Address | ◻ designed (Part 9) |
| — | The Vigil (Future capstone) | Stacks · Relay · Beacon | ◻ **deferred** (Part 11) |

**9 chapters live, 6 sealed gates.** Hosted at `keyroom.northboundhouse.com`
(`Northbound-House/game-keyroom`, GitHub Pages).

> **Verification caveat (2026-07):** every chapter has been verified by syntax,
> engine-contract, reference, and headless solve-chain checks. Only **Stateroom 77**
> and **The Terminal** have been played end-to-end by a human. The other seven are
> logic-verified but not yet playtested in a browser.

---

## 1. The tense anthology

The top level of the collection is **tense**. The landing page (`index.html`) is a
hub with three doors — **PAST / PRESENT / FUTURE** — each in its own accent under a
gold→blue→violet spectrum rule, with `#past` / `#present` / `#future` hash routes.
Every trilogy is filed under one tense and inherits that tense's typography.

| Tense | Accent | Holds |
|---|---|---|
| **Past** | brass `#C9A227` | The Meridian, The Red-Eye — and any historical trilogy (Bureau, Orrery, Take, Conservatory, Signal) |
| **Present** | sky `#3a8dde` | The Unit (launch) |
| **Future** | ultraviolet `#9b7bff` | The Waypoint (launch) · The Vigil (deferred capstone) |

---

## 2. The Key Room "grammar" — constants vs. variables

Design a new trilogy by keeping the left column and re-inventing the right.

### Constants — every trilogy
- **The gate ritual.** Finish a chapter, carry its answer forward to unlock the
  next. *Keep what it taught you; the next door asks for it.*
- **The safe and the desk.** At least one locked container (safe/vault/locker) and
  one desk with a locked panel/drawer. The signature furniture.
- **Paper you can read.** Letters, logs, charts, tickets, tables, rosters — a
  handwritten voice, usually the absent guide.
- **A language to learn, then use.** You first learn to *read* a code system, then
  the finale forces you to *write* in it.
- **The absent mentor + late reveal.** A guiding figure whose identity reframes the
  puzzle chain at the end.
- **The recontextualization twist.** Something accepted early turns out to be
  something else.
- **Two-axis escalation.** *Structure:* one room → dual-track room → multi-area
  finale. *Emotion:* escape yourself → act for someone else.
- **The final act is a choice, not a lock** (finales): the last beat is a decision,
  not a code.
- **The plumbing.** 3-tier in-character hints, a countdown with overtime grace and
  story beats, SVG hotspot rooms, inventory, victory ranks — all from `engine.js`.
- **Shared formatting.** Identical component layout, spacing, and proportions across
  every trilogy (see the house rule).

### Variables — turned differently each time
Era & place · **palette (colour)** · **font (by tense)** · the "language" mechanic ·
the POV verb · tone · the structural gimmick.

### The house rule *(evolved)*

> **Same formatting everywhere. Colour varies by trilogy. Font varies by tense.
> Mono is universal.**

IBM Plex Mono staying universal (codes, boards, labels, buttons) is what keeps the
collection reading as one thing across the font change.

| Tense | Display | Body | Mono |
|---|---|---|---|
| Past | Poiret One | Cormorant Garamond | IBM Plex Mono |
| Present | Space Grotesk | Space Grotesk | IBM Plex Mono |
| Future | Michroma | IBM Plex Mono | IBM Plex Mono |

*Michroma is single-weight — Future hierarchy comes from size / spacing / colour,
never bold. Drop-in swaps if more weight range is wanted: Exo 2, Orbitron, Syne.*

---

## 3. Shared architecture *(the extraction is done)*

Formatting and plumbing were extracted so the house rule is enforced by code, not by
hand. (An early audit found 31 formatting drifts between two chapters after a single
hand-port — untenable across 12+ files.)

```
assets/
├── theme.css                 ALL shared formatting + the type system (fonts as
│                             variables; zero colour literals)
├── engine.js                 timer, sound, modal, inventory, hotspots, 3-tier
│                             hints, code entry, start/finish, ranks
├── easter-eggs.js            the registry: 77 + crest + curator card (Part 10)
├── palette-meridian.css      Past · brass          ┐ colours + the 3 font vars,
├── palette-redeye.css        Past · Pan-Am blue    │ nothing else
├── palette-waypoint.css      Future · ultraviolet  ┘ (palette-theunit.css = TODO)
├── redeye-components.css     Red-Eye trilogy props (telex, cipher table, napkin…)
├── redeye.js                 Red-Eye cipher logic (one-time key, encode/decode)
├── waypoint-components.css   Waypoint props (approach board, beacon lamp, pulse…)
└── waypoint.js               Waypoint logic (approach board, beacon characteristic)
```

**A chapter file now contains only:** its SVG rooms, its clue prose, its own
one-off components, and its puzzle logic. It loads `theme.css` + a palette + shared
JS, and carries `<body class="chapter">`.

**Per new trilogy you author:** new SVG rooms + prose, a new palette (~22 colour
vars + 3 font vars), and one or two new mechanic modules. Type and formatting are
inherited.

### The palette contract
Every palette must define all of these so shared CSS keeps working:

```
--night --surface --surface-soft
--accent --accent-dim --accent-soft --accent-ghost --accent-wash --accent-glow
--text --text-soft --text-faint --muted --muted-bright --muted-rule
--paper --ink --error --success
--veil --veil-fade --input-bg
--font-display --font-body --font-mono          (mono is always IBM Plex Mono)
```
**Contrast-check the dimmed text** (`--muted`, hints, `.ep-meta`, `.nn-hint`) against
the dark ground — that's where a new scheme goes illegible first. (Waypoint's violet
dims were checked: `--muted` clears WCAG AA at 8.2:1.)

### Gating
Sealed chapters live in the `EPISODES` map in `index.html`, keyed
`2, 3` (Meridian), `r2, r3` (Red-Eye), `w2, w3` (Waypoint). Each entry has an `href`
and the **SHA-256 hash** of the unseal code (codes normalized `.trim().toLowerCase()`
before hashing). The render loop is `Object.keys(EPISODES)`, so a new series just
adds entries. Unlocks persist in `localStorage`; honor-system (URLs aren't secret).

```bash
python3 -c "import hashlib; print(hashlib.sha256('code'.encode()).hexdigest())"
```

---

## 4. Trilogy One — THE MERIDIAN · Past · 1934 *(live)*

**The maiden voyage of the S.S. Meridian.** You're a courier smuggling 41 refugee
families to safety under false names. Language: **Morse & maritime signal flags**.

| Ch | Room | Structure | Locks | Carries |
|----|------|-----------|-------|---------|
| I | **Stateroom 77** | single room | suitcase `0714` · safe `385` · door `4391` | `4391` |
| II | **The Chart Room** | dual-track (meet at the wireless) | strongbox `241` · cabinet `DAWN` · Morse decode + transmit | `HOME` |
| III | **The Lantern** | 3-floor lighthouse finale | stair `2117` · oil store `HOME` · governor `41` · lamp sequence · answer the ship's 3-flash with 2 | — |

**Reveal:** R = Captain Rhea Moran; Emmet, the keeper, is her brother.
**Twist:** the "constellations" of Ch I were signal stations all along.
**Arc:** escape self → light the way out for strangers.

---

## 5. Trilogy Two — THE RED-EYE · Past · 1962 *(live)*

**Meridian Airways — a scandal at 30,000 feet.** Film star **Coralie Vance** and
airline exec **Julian Roscoe**; the affair is the cover for **corruption inside the
airline**, and the film canister is the proof. The stewardess **"V"** guides you.
Language: **split-flap board, IATA/phonetic codes, time-zone math, the telex**.

| Ch | Room | Structure | Locks | Carries |
|----|------|-----------|-------|---------|
| I | **The Terminal** | single space | locker `2347` · ops desk `LIS` · gate/seat `7A` | `7A` |
| II | **The Red-Eye** | dual-track jet cabin (meet at the telex) | attaché `077` · decode `PXKCIK→LEDGER` · transmit `PRINT→TKPJX` | `PRINT` |
| III | **Arrivals** | 3-zone finale (passports → customs → apron) | crew door `0740` (NY→Lisbon time) · bonded cage `FILM` · courier `PTTL→LAMP` · **choice** | — |

**Cipher (`redeye.js`):** one-time key `4·19·7·22` from the love letters, A=1…Z=26,
add to send / subtract to read.
**Twist:** the numbers in the letters are the key. *The stars were lanterns; the
love letters were code.*
**Reveal:** V's network has run since 1934 — *"my grandmother ran this out of a chart
room on a ship."* The lantern-and-flags crest, still on a collar.
**Anthology tie:** the airline is **Meridian Airways**; **Stateroom 77 → Seat 7A →
Gate 77**.

---

## 6. Trilogy Three — THE WAYPOINT · Future · deep transit *(live)*

**Waypoint 0077, a relay-and-beacon station between inhabited systems — a lighthouse
of the shipping lanes.** You wake alone; its light has gone out; a ship is inbound.
Earnest and luminous — the Future's hopeful flagship, a turn back toward warmth after
the Red-Eye's noir. Language: **the approach board + the beacon characteristic**
(`Fl(N) Ps` — read a pulse, then set one). Deliberately un-obtuse: nothing to
memorise, everything to notice.

| Ch | Room | Structure | Locks | Carries |
|----|------|-----------|-------|---------|
| I | **The Station** | single deck | equipment locker `0077` · console `LANTERN` · identify the relief → bearing `214` | `214` |
| II | **The Approach** | dual-track (systems + comms, meet at the beacon) | reactor `0308` (Fl(3)/8s as digits) · receiver tune `214` · name tender `Fl(5)→MERIDIAN` · **set** the station's `Fl(3)/8s` (first *write*) | `KEPT` |
| III | **The Threshold** | 3-zone finale (outer marker → alignment → threshold) | outer marker `0143` · dock-align match her `Fl(2)/6s` · clearance `CROSS` · **choice: hold the light** | — |

**Mechanic (`waypoint.js`):** `approachBoardHTML` (read traffic) and the beacon
characteristic — always shown as a blinking lamp **and** a static positional
pulse-strip, so reduced-motion / colour-blind paths stay solvable.
**Twist (the relief ship):** the inbound "distress" is your **relief** — the station
is what's failing, and you can't be relieved until you *become* the keeper and light
the way. You're the rescuer, not the rescued.
**Absent mentor:** the previous keeper "K," through the logbook.
**Reveal:** you came to escape the dark and stayed to be the light in it. Final log:
`WAYPOINT 0077 — KEPT`.
**Anthology tie:** the relief tender is named **Meridian** — the line's name carried
into deep future; **77** is the station designation (incidental). `HOME` is *not*
used here — reserved for The Vigil.

---

## 7. Anthology threads (the meta-layer)

Three quiet threads run across tenses, rewarding completists without forcing order:

1. **77** — Stateroom 77 → Seat 7A / Flight 077 / Gate 77 → Waypoint 0077 + the
   landing watermark. **Incidental everywhere; its payoff (77 = keeper number) is
   reserved for The Vigil.**
2. **The lantern-over-crossed-flags crest** — Meridian's manifest seal / keeper
   emblem → V's lapel pin (1962) → the Waypoint keeper's logbook, chair, and key.
   Appears once, subtly, per series. Owned by `easter-eggs.js`.
3. **The name "Meridian"** — the S.S. Meridian (1934) → Meridian Airways (1962) →
   the tender *Meridian* (deep future). The line, across all time.

The **curator** (typed `77` / the crest) is the unseen hand behind the collection;
who they are is The Vigil's reveal.

---

## 8. Concept bank — future **Past** trilogies

Designed, not built. Promote one when a Past slot is wanted. (All are Past-tense:
brass accent, Poiret/Cormorant/Plex.)

- **THE BUREAU** · 1971 Cold War courier. Safe + desk (a case officer's study),
  courier premise, language = **ciphers / one-time pad / numbers station**, absent
  handler. Concrete-and-cathode palette, paranoia tone, smuggle a *person* across,
  "who do you trust" branching. → The Safe House · The Checkpoint · The Crossing.
- **THE ORRERY** · 1897 gothic astronomy — *the warm cousin, stars brought back.*
  Safe + desk (a scholar's study), constellation motif made literal, brass/clockwork
  grown into an **orrery**, optics + a cipher volvelle. Verdigris/candle-amber,
  eerie mystery, *uncover* not escape. → The Study · The Observatory Dome · The Crypt.
- **THE TAKE** · 1926 jazz-age heist — *the inversion: you break in, not out.* The
  **safe is the whole game**, crew handler, heist countdown, carry-the-take gating.
  Emerald/gold caper. → townhouse · bank · moving train.
- **THE CONSERVATORY** · 1950s botanical-poison mystery in a glass estate. Language =
  the language of flowers + a chemist's formulae. Verb = diagnose & antidote. Green
  glass & rain, quiet-menace.
- **THE SIGNAL** · 1969 mission control + a capsule. Language = telemetry / radio.
  Verb = bring someone home. Steel & amber CRT. *(Now filed as a **Past** trilogy —
  the capstone/curator role moved to The Vigil.)*

---

## 9. THE UNIT · Present · now *(designed — build after a playtest / when Present is wanted)*

**No connection to the keeper-line — a self-contained present-tense human mystery.**
You buy an abandoned storage unit at auction; it went to auction because the owner
**stopped paying**. Clearing it, you find their recent digital exhaust — phone,
laptop, geotagged prints, a still-pinging tracker — and realise they dropped off
mid-something only **days** ago. You come to know a stranger **entirely through their
data.**

**Twist [LOCKED]:** the sloppy, broken trail was **authored** — they erased
themselves on purpose (scrubbed geotags, spoofed timestamps, false pins). The noise
*was* the signal. **The verb flips: find → protect.** Even going dark, they were
reaching for **one person** before a window closed; the finale is completing that
connection **without blowing their cover.** *(Danger stays off-page and non-lurid.)*

**Fair-play twist:** every "broken" clue in Ch I is real and re-readable in Ch III
with inverted meaning (a photo's GPS says one city, its shadows say another;
timestamps run impossibly; a tag pings two places at once). Ch I reads them as
corruption; Ch III, as authorship.

**Language:** coordinates & metadata (geotags, EXIF, plus-codes, read-receipts). Read
clean ones (Ch I) → spot spoofing, the shadow-vs-GPS tell (Ch II) → **write** in it
at the finale: compose the true destination *and cover your own approach* (scrub the
pin behind you) — you learn their language well enough to forge in it, to shield them.

| Ch | Room | Structure | Metadata beat | Carries |
|----|------|-----------|---------------|---------|
| **I · The Unit** | the storage unit | single space | read one clean geotag + timestamp; padlock + lockbox (*safe*); phone/laptop (*desk*); place the "last seen"; gaps read as sloppiness | a plus-code |
| **II · The Trail** | emptied flat ⇄ devices | dual-track (meet at the message timeline) | reconstruct the last week; the gaps start to rhyme; learn the spoofing tells; glimpse the one person | the true next stop |
| **III · The Address** | where it actually points | multi-zone finale | re-read Ch I's clues as deliberate; reach not *them* but the person they were reaching for; **choice:** deliver + cover the trail, or complete it in the open | — |

- **Palette [LOCKED]:** its **own** present-blue (`palette-theunit.css`) — cooler,
  more screen-lit/electric than the Red-Eye's warm Pan-Am blue, so the two blues
  never read as one trilogy. **Space Grotesk** display+body; Plex Mono for coordinates.
- **Mentor:** the owner — alive, unreachable, still emitting timestamps, never met.
- **77:** the unit number. **Crest:** hides once (a laptop sticker / keyring fob).
- **Hints:** the devices themselves, escalating into the owner's own notes-to-self.
- **Ranks:** Winning Bidder → Finder → Reader → The One Who Covered It.
- **[AUTHOR — the one open call]:** *who* is at the end of the trail. Candidates: a
  child they gave up; a sibling/parent behind a closing window; or **someone from
  "before"** they can never safely contact again. *Lead: the "before" person* — it
  couples the danger, the vanishing, and the cost most tightly (reaching them is
  exactly what risks re-exposing the vanisher, which is what makes the cover-the-trail
  choice fraught). **Owner to confirm before authoring.**

---

## 10. Easter-egg registry (`assets/easter-eggs.js`)

One source of truth, loaded by every page (self-initialising, idempotent).

1. **77** — persistent motif; incidental everywhere, payoff reserved for The Vigil.
2. **The lantern-crest** — `keyroomCrestSVG()`; appears once per surface.
3. **The curator card** — summoned by typing `77` (guarded against `INPUT`/`TEXTAREA`
   focus so it never eats a gate code) or activating a `.crest`. Adopts each page's
   `--accent`, so the curator wears each series' colour.

`[AUTHOR]` slots are reserved in the registry for the owner's remaining canon eggs.

---

## 11. THE VIGIL · Future capstone *(deferred — do not build yet)*

The far-future capstone that finally reveals the curator: a repository at the end of
human time — **the Archive** — whose contents are the earlier escapes themselves. The
guide is the Archive's voice, resolving into the last keeper; the language is a
**spectral signal** (light matured past the visible into ultraviolet — *"and beyond"*
as a real puzzle band); **77 is paid off as the player's keeper number**; the final
emission is **`HOME`**, the anthology's closing rhyme. Rooms: **Stacks → Relay →
Beacon**. Anthology-level twist: *the trilogies were the archive.* Gets its own
ultraviolet palette variant.

**Build-order guard:** ship The Vigil only *after* at least one Past trilogy with a
hidden 77/crest has shipped, so the reveal has something to pay off. Until then every
non-Vigil series (including The Waypoint) keeps the motif incidental.

---

## 12. Roadmap

1. **Playtest** the seven logic-verified-but-unplayed chapters (both Red-Eye finales,
   all three Waypoint chapters). Highest-value next step — a finale bug is cheap now.
2. **The Unit** — confirm the E8 "before-person" call, add `palette-theunit.css`,
   author I → II → III, wire the Present-view gates (replace the empty state).
3. **A Past concept-bank trilogy** with a hidden 77/crest, to set up The Vigil.
4. **The Vigil** — the capstone, once (3) has shipped.
