/* ============================================================
   THE WAYPOINT — shared trilogy logic (Future / deep space)
   Two legible mechanics, deliberately un-obtuse (owner note):

   1. THE APPROACH BOARD — descendant of the 1962 split-flap
      departures board. Inbound vessels by designation, bearing,
      ETA. You READ it to identify and track the ship.

   2. THE BEACON CHARACTERISTIC — like a real lighthouse, the
      beacon repeats a pulse pattern: N flashes per P-second cycle,
      written Fl(N) Ps. You learn to READ a played characteristic
      (count the group) and later SET one (the finale's "write").

   Accessibility: a characteristic is ALWAYS shown two ways — the
   blinking lamp AND a static pulse-strip of filled/empty cells.
   The strip alone is solvable, so reduced-motion and colour-blind
   paths never depend on the animation or on hue.
   ============================================================ */

/* ---------- the approach board ---------- */
/* vessels: [{desig, bearing, eta, status, hi}] */
function approachBoardHTML(vessels){
  let h = '<div class="approach-board"><table>'
        + '<thead><tr><th>Vessel</th><th>Bearing</th><th>ETA</th><th>Signal</th></tr></thead><tbody>';
  vessels.forEach(v => {
    h += '<tr' + (v.hi ? ' class="hi"' : '') + '>'
       + '<td>' + v.desig + '</td>'
       + '<td>' + v.bearing + '°</td>'
       + '<td>' + v.eta + '</td>'
       + '<td class="sig ' + (v.sigClass || '') + '">' + v.status + '</td>'
       + '</tr>';
  });
  return h + '</tbody></table></div>';
}

/* ---------- beacon characteristic ---------- */
/* A characteristic is {flashes, period}. Render its one cycle as a
   strip: `flashes` filled cells, then dark cells padding to `period`.
   Purely positional — no colour or motion required to read it. */
function pulseStripHTML(flashes, period, label){
  let cells = '';
  for (let i = 0; i < period; i++){
    cells += '<span class="cell' + (i < flashes ? ' on' : '') + '"'
           + ' aria-hidden="true"></span>';
  }
  const cap = label
    ? '<div class="pulse-cap">' + label + '</div>'
    : '';
  return '<div class="pulse-strip" role="img" aria-label="'
       + flashes + ' flashes over ' + period + ' seconds">' + cells + '</div>' + cap;
}

/* notation, e.g. Fl(3) 10s */
function charNotation(flashes, period){
  return 'Fl(' + flashes + ') ' + period + 's';
}

/* Blink a lamp element through one cycle, then repeat. Returns a
   stop() handle. Animation is decorative only — the strip is the
   accessible source of truth. Respects prefers-reduced-motion. */
function playBeacon(lampEl, flashes, period, opts){
  opts = opts || {};
  const reduce = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !lampEl){
    if (lampEl) lampEl.classList.add('lit');   /* steady, not strobing */
    return { stop(){ if (lampEl) lampEl.classList.remove('lit'); } };
  }
  const unit = Math.max(280, Math.round((period * 1000) / period)); /* ~1s/slot */
  let i = 0, timer = null;
  const seq = [];
  for (let f = 0; f < flashes; f++){ seq.push(true); seq.push(false); }
  while (seq.length < period * 2) seq.push(false);  /* dark tail to fill cycle */
  function step(){
    const on = seq[i % seq.length];
    lampEl.classList.toggle('lit', on);
    if (on && typeof beep === 'function') beep(90, 720);
    i++;
    timer = setTimeout(step, unit / 2);
  }
  step();
  return { stop(){ if (timer) clearTimeout(timer); lampEl.classList.remove('lit'); } };
}

/* validate a set characteristic against a target */
function beaconMatches(flashes, period, target){
  return flashes === target.flashes && period === target.period;
}
