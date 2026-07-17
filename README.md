# The Key Room

Browser escape adventures by seeking77degrees. Static site — no build step, no dependencies, deploys anywhere that serves HTML.

## Structure

```
/
├── index.html                          # Landing page + password gates
└── games/
    ├── level-1-stateroom-77.html       # Series 1, Chapter I (open)
    ├── level-2-chart-room.html         # Chapter II (sealed)
    └── level-3-the-lantern.html        # Chapter III (sealed)
```

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

1. Create a repo (e.g. `keyroom`) and push these files to `main`.
2. Repo → Settings → Pages → Source: **Deploy from a branch** → `main` / `/ (root)`.
3. Site goes live at `https://<user>.github.io/keyroom/`.

For a custom subdomain (e.g. `keyroom.seeking77degrees.com`): add a `CNAME`
file containing the subdomain, and a DNS CNAME record pointing the subdomain
at `<user>.github.io` — same pattern as the existing roadrover/nopeify/cadence
subdomains.

## Adding a new series

1. Drop the game files in `games/`.
2. Copy a `<section class="series">` block in `index.html`, update titles and
   episode rows.
3. Add entries to the `EPISODES` map with each chapter's `href` and code hash.
4. Replace the "Series Two" coming-soon card, or move it below the new series.
