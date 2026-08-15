# PLAN — what's next for The Key Room

Read `STATE.md` first. `SERIES-PLAN.md` is the authority on the series itself —
which chapters exist, which are locked, and what comes next. This file does not
duplicate it.

---

## 1. Continue the series

Chapter I — The Unit is authored and E8 is locked. `SERIES-PLAN.md` holds the
ordering. Writing chapters is the work; everything below is maintenance around
it.

---

## 2. Bump the service worker on every content change

Not a task, a rule. The service worker was moved to network-first for pages and
bumped to v3 precisely because a stale landing page was masking new content.

The failure it prevents is invisible: returning visitors see the old version,
nothing errors, and nobody reports it because the site appears to work. Any
change to cached assets needs the version bumped in the same commit.

---

## 3. Keep it dependency-free

No build step, no dependencies, deployable anywhere that serves HTML. For a
series of hand-authored puzzle pages that is exactly right, and it is why a
chapter written a year from now will still deploy without a toolchain to
resurrect.

Resist anything that introduces a build. The moment it needs one, an escape-room
page becomes a project that can rot.

---

## Deliberately not doing

No backend. The puzzles are client-side by design. Adding server-side state
would mean accounts, hosting and an attack surface, for a product whose whole
appeal is that it opens instantly in a browser.
