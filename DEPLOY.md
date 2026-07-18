# Deploying The Key Room to GitHub Pages

This repo is already initialized with an initial commit on `main`. Everything
below is copy-paste.

## Option A — GitHub CLI (fastest)

From inside the unzipped `keyroom/` folder:

```bash
gh repo create keyroom --public --source=. --remote=origin --push
gh api -X POST repos/:owner/keyroom/pages -f "source[branch]=main" -f "source[path]=/"
```

Live in ~60 seconds at `https://<your-user>.github.io/keyroom/`.

Check status:

```bash
gh api repos/:owner/keyroom/pages --jq '.status, .html_url'
```

## Option B — Web UI + git

1. Create an empty repo at https://github.com/new named `keyroom`. Do **not**
   add a README, .gitignore, or license (this repo already has a commit).
2. From inside the `keyroom/` folder:

```bash
git remote add origin https://github.com/<your-user>/keyroom.git
git push -u origin main
```

3. Repo → **Settings** → **Pages** → Source: **Deploy from a branch** →
   Branch: `main`, Folder: `/ (root)` → **Save**.
4. Wait ~1 minute. Site is live at `https://<your-user>.github.io/keyroom/`.

## Testing checklist

Once live, verify in this order:

- [ ] Landing page loads; fonts and brass frame render.
- [ ] Chapter I → **Play** opens Stateroom 77 and the timer starts.
- [ ] Chapter II shows **🔒 Sealed**; wrong code shakes and rejects.
- [ ] Chapter II unseals with the stateroom door code from Chapter I.
- [ ] Hard-refresh the landing page — Chapter II is **still** unsealed
      (this confirms `localStorage` works on the live origin; it does not work
      in a chat preview or from a `file://` path).
- [ ] Chapter III unseals with the word transmitted in Chapter II.
- [ ] Test on mobile Safari — floor nav (Ch. III) and code inputs are the
      most layout-sensitive pieces.
- [ ] Sound toggle (♪) works after a user gesture (browsers block autoplay;
      the games only start audio on click, so this should be fine).

## Reset your own progress while testing

The gates persist per-browser. To clear:

```js
// paste in DevTools console on the live site
Object.keys(localStorage).filter(k=>k.startsWith('keyroom.')).forEach(k=>localStorage.removeItem(k));
location.reload();
```

Or just use a private window for a fresh-player run.

## Custom subdomain

Served at **`keyroom.northboundhouse.com`** via the `CNAME` file in the repo
root (same pattern as `cadence.northboundhouse.com` / `roadrover.northboundhouse.com`).

To go live, add one DNS record on `northboundhouse.com`:

```
Type: CNAME   Host/Name: keyroom   Value: northbound-house.github.io
```

Once it resolves, GitHub provisions the TLS certificate automatically; then
enable **Enforce HTTPS** under Settings → Pages. Until the DNS record exists,
the site stays reachable at `https://northbound-house.github.io/game-keyroom/`.

## Notes

- `.nojekyll` is included so GitHub Pages serves files as-is with no Jekyll
  build step.
- Gating is honor-system: the game URLs are public if guessed directly. Fine
  for testing and for an MVP; real gating would need a server or Cloudflare
  Access.
