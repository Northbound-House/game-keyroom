/* ============================================================
   THE KEY ROOM — EASTER-EGG REGISTRY
   One source of truth for the hidden motifs, shared by the
   landing page and every game. Loading this file is enough:
   it self-initializes on DOM ready (idempotent).

   REGISTRY
   --------
   1. "77"          persistent motif. Appears at least once in every
                    game already (Stateroom 77, Seat 7A / Flight 077,
                    Gate 77, sector designations, the landing watermark).
                    Its PAYOFF (77 = keeper number) is reserved for
                    The Vigil; everywhere else it stays incidental.
   2. lantern-crest lantern over crossed signal flags. Appears once,
                    subtly, per surface (the landing footer; narratively
                    inside each series). keyroomCrestSVG() is the asset.
   3. curator card  summoned by typing 7-7 anywhere (outside a text
                    field) or activating a .crest element. Same copy +
                    asset on every page. Adopts the page's --accent, so
                    the curator wears each series' colour.

   [AUTHOR] reserve one entry per additional canon egg here as the
   owner supplies them: {id, trigger, surface, asset|copy}.
   ============================================================ */

const EASTER_EGGS = {
  seventySeven: {
    id: 'seventySeven', trigger: 'type "77" (guarded outside inputs)',
    surface: 'every page', payoffReservedFor: 'The Vigil'
  },
  crest: {
    id: 'crest', trigger: 'click/activate a .crest element',
    surface: 'once per page/series', asset: 'keyroomCrestSVG()'
  },
  curator: {
    id: 'curator', trigger: '"77" or crest',
    surface: 'every page', copy: 'see CURATOR_COPY below'
  }
  /* + owner's remaining canon eggs (append here) */
};

const CURATOR_COPY =
  "One hand set all of these — the past you've played, the present that " +
  "hasn't happened, and the future you haven't reached. Keep what each " +
  "door teaches you.";

/* The lantern-over-crossed-flags mark. `stroke` lets callers theme it
   (defaults to currentColor so CSS colour wins). */
function keyroomCrestSVG(stroke){
  const s = stroke || 'currentColor';
  return '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" fill="none" '
    + 'stroke="' + s + '" stroke-width="1.4" aria-hidden="true">'
    + '<line x1="8" y1="30" x2="22" y2="16"/>'
    + '<line x1="32" y1="30" x2="18" y2="16"/>'
    + '<path d="M8 30 l3 -6 l-3 0 z" fill="' + s + '" stroke="none"/>'
    + '<path d="M32 30 l-3 -6 l3 0 z" fill="' + s + '" stroke="none"/>'
    + '<rect x="16" y="10" width="8" height="10" rx="1"/>'
    + '<line x1="20" y1="6" x2="20" y2="10"/>'
    + '<line x1="16.5" y1="15" x2="23.5" y2="15"/>'
    + '</svg>';
}

/* Build (once) the curator card and wire every trigger. Safe to call
   more than once; safe on pages that already have a .crest button. */
function initEasterEggs(){
  if (window.__keyroomEggsReady) return;
  window.__keyroomEggsReady = true;

  /* inject the curator card if it isn't already present */
  let veil = document.getElementById('curator-veil');
  if (!veil){
    veil = document.createElement('div');
    veil.id = 'curator-veil';
    veil.setAttribute('role', 'dialog');
    veil.setAttribute('aria-modal', 'true');
    veil.setAttribute('aria-label', 'The curator');
    veil.innerHTML =
      '<div class="curator-card">'
      +   '<div class="cc-crest">' + keyroomCrestSVG('var(--accent)') + '</div>'
      +   '<div class="cc-eyebrow">the curator</div>'
      +   '<p>' + CURATOR_COPY + '</p>'
      +   '<div class="sign">77</div>'
      +   '<button class="close" id="curator-close" type="button">close</button>'
      + '</div>';
    document.body.appendChild(veil);
  }

  const open  = () => veil.classList.add('on');
  const close = () => veil.classList.remove('on');

  const closeBtn = veil.querySelector('#curator-close');
  if (closeBtn) closeBtn.addEventListener('click', close);
  veil.addEventListener('click', e => { if (e.target === veil) close(); });

  /* any .crest element on the page becomes a trigger */
  document.querySelectorAll('.crest').forEach(c => {
    c.addEventListener('click', open);
    c.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(); }
    });
  });

  /* type 7-7 to summon — but never while typing a code into a field */
  let seq = '';
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape'){ close(); return; }
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.key === '7'){
      seq += '7';
      if (seq.length > 2) seq = seq.slice(-2);
      if (seq === '77'){ open(); seq = ''; }
    } else {
      seq = '';
    }
  });
}

/* self-init */
(function(){
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initEasterEggs);
  } else {
    initEasterEggs();
  }
})();
