# STATE — where The Key Room actually is

Last updated: 2026-08-12.

---

## In one paragraph

Browser escape adventures by Northbound House. A static site — no build step, no
dependencies, deployable anywhere that serves HTML. It is the most recently
authored of the small static projects here: a new chapter and a service-worker
fix landed together in July.

---

## What is here

45 files — 12 HTML, 8 CSS, 7 JS, plus branding and assets. `DEPLOY.md` covers
deployment; `SERIES-PLAN.md` is the forward plan for the series and is the
authority on what gets written next.

There are **no workflows**. `CNAME` and `.nojekyll` are present, so GitHub Pages
serves the repository directly — a push to `main` publishes.

---

## The service worker is the thing to be careful with

The most recent commit moved the service worker to **network-first for pages and
bumped it to v3**, specifically to fix a stale landing page masking new content.

That is worth knowing before touching anything cached. A static site with a
service worker has a failure mode plain static hosting does not: new content
ships correctly and returning visitors keep seeing the old version, with nothing
broken and nothing to see in the logs. The fix was to stop serving pages
cache-first, and the version bump is what forces clients to pick it up.

**Bump the service worker version whenever cached content changes.** It is the
one piece of ceremony this otherwise ceremony-free repository requires.
