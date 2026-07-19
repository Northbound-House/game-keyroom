/* ============================================================
   THE KEY ROOM — SHARED ENGINE
   Loaded before each chapter's own <script>. Provides the
   plumbing every chapter uses; chapters supply the content.

   A chapter script must define, at minimum:
     S            state object: {t, timerId, hintsUsed, inv, flags, hintLevel, ...}
     HINTS        {puzzleId: [tier1, tier2, tier3]}
     inspectItem  (key) => void   — what clicking an inventory item does

   Optional chapter hooks, read by the engine if present:
     HINT_LABELS  {first, again} — in-world wording for the hint links
     BEATS        {secondsRemaining: 'message'} — timed story beats
     onOvertime() — called once when the clock passes zero

   Everything here is formatting/behaviour shared across trilogies.
   Chapter-specific mechanics (morse, flags, split-flap boards)
   stay in the chapter file.
   ============================================================ */

/* ---------------- time ---------------- */
function fmt(t){
  const neg = t < 0; t = Math.abs(t);
  const m = Math.floor(t/60), s = t%60;
  return (neg?'+':'') + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
}

/* Generic countdown tick. Handles the late state, timed story
   beats, and the one-shot overtime hook. */
function engineTick(){
  S.t--;
  const el = document.getElementById('timer');
  if (el) el.textContent = fmt(S.t);
  const beats = (typeof BEATS !== 'undefined') ? BEATS : null;
  if (beats && beats[S.t] && !veil.classList.contains('on')) {
    openModal({title:'…', body:'<em>'+beats[S.t]+'</em>', actions:[closeBtn('Continue')]});
  }
  if (S.t < 0) {
    if (el) el.classList.add('late');
    if (!S.overtime) {
      S.overtime = true;
      if (typeof onOvertime === 'function') onOvertime();
    }
  } else if (S.t <= 120) {
    if (el) el.classList.add('late');
  }
}
function startTimer(){ S.timerId = setInterval(engineTick, 1000); }

/* ---------------- sound (low ambient hum) ---------------- */
function ensureAudio(lowpass, gainUp){
  if (S.audioCtx) return;
  const C = new (window.AudioContext || window.webkitAudioContext)();
  const bufferSize = 2 * C.sampleRate;
  const buffer = C.createBuffer(1, bufferSize, C.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i=0; i<bufferSize; i++){
    const w = Math.random()*2 - 1;
    data[i] = (last + .02*w) / 1.02;
    last = data[i];
    data[i] *= (gainUp || 2.8);
  }
  const src = C.createBufferSource(); src.buffer = buffer; src.loop = true;
  const filt = C.createBiquadFilter(); filt.type = 'lowpass';
  filt.frequency.value = lowpass || 220;
  const gain = C.createGain(); gain.gain.value = 0;
  src.connect(filt).connect(gain).connect(C.destination); src.start();
  S.audioCtx = C; S.noiseGain = gain;
}
function toggleSound(){
  ensureAudio(S.soundLowpass, S.soundGainUp);
  S.soundOn = !S.soundOn;
  S.noiseGain.gain.value = S.soundOn ? 0.05 : 0;
  const b = document.getElementById('sound-btn');
  if (b) b.style.opacity = S.soundOn ? 1 : .4;
}
/* short tone — used by morse-style mechanics */
function beep(dur, freq){
  if (!S.soundOn || !S.audioCtx) return;
  const o = S.audioCtx.createOscillator(), g = S.audioCtx.createGain();
  o.frequency.value = freq || 620; o.type = 'sine';
  g.gain.setValueAtTime(0.08, S.audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, S.audioCtx.currentTime + dur/1000);
  o.connect(g).connect(S.audioCtx.destination);
  o.start(); o.stop(S.audioCtx.currentTime + dur/1000);
}

/* ---------------- inventory ---------------- */
function addItem(key, icon, label){
  if (S.inv[key]) return;
  S.inv[key] = {icon, label};
  renderInv();
}
function removeItem(key){ delete S.inv[key]; renderInv(); }
function renderInv(){
  const inv = document.getElementById('inventory');
  if (!inv) return;
  inv.innerHTML = '';
  const keys = Object.keys(S.inv);
  if (!keys.length){
    inv.innerHTML = '<span id="inv-empty">Your pockets are empty.</span>';
    return;
  }
  keys.forEach(k => {
    const it = S.inv[k];
    const d = document.createElement('button');
    d.className = 'inv-item';
    d.innerHTML = it.icon + '<span class="tag">' + it.label + '</span>';
    d.setAttribute('aria-label', it.label);
    d.addEventListener('click', () => inspectItem(k));
    inv.appendChild(d);
  });
}

/* ---------------- modal ---------------- */
const veil = document.getElementById('modal-veil');
function openModal({title, body, extra='', actions=[], puzzleId=null, onOpen=null}){
  document.getElementById('m-title').textContent = title;
  document.getElementById('m-body').innerHTML = body;
  document.getElementById('m-extra').innerHTML = extra;
  const fb = document.getElementById('m-feedback');
  fb.textContent = ''; fb.className = 'feedback';
  const act = document.getElementById('m-actions');
  act.innerHTML = '';
  actions.forEach(a => act.appendChild(a));
  renderHints(puzzleId);
  veil.classList.add('on');
  if (onOpen) onOpen();
}
function closeModal(){
  veil.classList.remove('on');
  if (typeof onModalClose === 'function') onModalClose();
}
veil.addEventListener('click', e => { if (e.target === veil) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function closeBtn(txt='Step back'){
  const b = document.createElement('button');
  b.className = 'btn small'; b.textContent = txt;
  b.addEventListener('click', closeModal);
  return b;
}
function actionBtn(txt, fn){
  const b = document.createElement('button');
  b.className = 'btn small'; b.textContent = txt;
  b.addEventListener('click', fn);
  return b;
}
function feedback(msg, ok){
  const fb = document.getElementById('m-feedback');
  fb.textContent = msg;
  fb.className = 'feedback ' + (ok ? 'good' : 'bad');
  if (!ok){
    const m = document.getElementById('modal');
    m.classList.add('shake');
    setTimeout(() => m.classList.remove('shake'), 380);
  }
}
function toast(msg){
  openModal({title:'…', body:msg, actions:[closeBtn('Continue')]});
}

/* ---------------- hints (3 tiers, in-world voice) ---------------- */
function renderHints(pid){
  const z = document.getElementById('m-hintzone');
  if (!z) return;
  z.innerHTML = '';
  if (!pid || typeof HINTS === 'undefined' || !HINTS[pid]) return;
  const lvl = S.hintLevel[pid] || 0;
  for (let i=0; i<lvl; i++){
    const p = document.createElement('div');
    p.className = 'hint-text';
    p.innerHTML = HINTS[pid][i];
    z.appendChild(p);
  }
  if (lvl < 3){
    const labels = (typeof HINT_LABELS !== 'undefined')
      ? HINT_LABELS
      : {first:'Ask for a hint', again:'Ask again — be more direct'};
    const b = document.createElement('button');
    b.className = 'hint-link';
    b.textContent = lvl === 0 ? labels.first : labels.again;
    b.addEventListener('click', () => {
      S.hintLevel[pid] = lvl + 1;
      S.hintsUsed++;
      renderHints(pid);
    });
    z.appendChild(b);
  }
}

/* ---------------- code entry ---------------- */
/* type: 'num' digits only | 'alpha' letters | 'alnum' letters+digits */
function codeRow(n, type='num'){
  const wrap = document.createElement('div');
  wrap.className = 'code-row';
  const strip = type === 'num' ? /[^0-9]/g
              : type === 'alpha' ? /[^a-zA-Z]/g
              : /[^a-zA-Z0-9]/g;
  for (let i=0; i<n; i++){
    const inp = document.createElement('input');
    inp.className = 'code-input';
    inp.maxLength = 1;
    inp.inputMode = type === 'num' ? 'numeric' : 'text';
    inp.addEventListener('input', () => {
      inp.value = inp.value.replace(strip, '');
      if (inp.value && inp.nextElementSibling) inp.nextElementSibling.focus();
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !inp.value && inp.previousElementSibling){
        inp.previousElementSibling.focus();
      }
    });
    wrap.appendChild(inp);
  }
  return wrap;
}
function readCode(wrap){
  return [...wrap.querySelectorAll('input')].map(i => i.value).join('').toUpperCase();
}
/* mount a code row into the open modal and focus it */
function mountCode(row){
  document.getElementById('m-extra').appendChild(row);
  const first = row.querySelector('input');
  if (first) first.focus();
}

/* ---------------- hotspots ---------------- */
function bindHotspot(id, fn){
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', fn);
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); fn(); }
  });
}

/* ---------------- start / finish ---------------- */
function startChapter(){
  document.getElementById('intro').classList.remove('active');
  document.getElementById('hud').classList.add('on');
  document.getElementById('room-wrap').classList.add('on');
  document.getElementById('inventory').classList.add('on');
  const fn = document.getElementById('floornav');
  if (fn) fn.classList.add('on');
  S.started = true;
  startTimer();
}

/* ranks: [{maxMinutes, maxHints, name}, ...] best-first; last is the fallback */
function finishChapter(totalSeconds, ranks){
  closeModal();
  clearInterval(S.timerId);
  document.getElementById('hud').classList.remove('on');
  document.getElementById('room-wrap').classList.remove('on');
  document.getElementById('inventory').classList.remove('on');
  const fn = document.getElementById('floornav');
  if (fn) fn.classList.remove('on');

  const used = totalSeconds - S.t;
  document.getElementById('stat-time').textContent = fmt(used);
  document.getElementById('stat-hints').textContent = S.hintsUsed;

  let rank = ranks[ranks.length - 1].name;
  for (const r of ranks){
    if (r.maxMinutes == null) continue;
    if (used <= r.maxMinutes*60 && S.hintsUsed <= (r.maxHints ?? Infinity)){
      rank = r.name; break;
    }
  }
  document.getElementById('stat-rank').textContent = rank;
  document.getElementById('victory').classList.add('active');
}

/* wire the sound button if the chapter has one */
(function initSoundBtn(){
  const b = document.getElementById('sound-btn');
  if (!b) return;
  b.addEventListener('click', toggleSound);
  b.style.opacity = .4;
})();
