/* ============================================================
   THE UNIT — shared trilogy logic (Present / now)
   The language is coordinates & metadata. You READ clean geotags
   and timestamps (Ch I), learn to SPOT SPOOFING (Ch II), and
   finally WRITE in it — composing a true destination and scrubbing
   your own pin behind you (Ch III).

   Accessibility: a row that doesn't add up is never marked by
   colour alone — it always carries a "≠" token and a spoken
   reason, so the tell survives greyscale and screen readers.
   ============================================================ */

/* ---------- metadata readout ----------
   rows: [{k, v, flag}]  flag: undefined | 'ok' | 'off'
   'off' = this field disagrees with the others (the tell). */
function exifHTML(rows, title){
  let h = '<div class="exif">';
  if (title) h += '<div class="exif-h">' + title + '</div>';
  h += '<table>';
  rows.forEach(r => {
    const cls = r.flag === 'off' ? ' class="off"' : (r.flag === 'ok' ? ' class="ok"' : '');
    const token = r.flag === 'off' ? '<span class="tok" aria-label="disagrees">≠</span>' : '<span class="tok"> </span>';
    h += '<tr' + cls + '><td class="k">' + r.k + '</td><td class="v">' + token + r.v + '</td></tr>';
  });
  return h + '</table></div>';
}

/* ---------- a printed photo with a lab stamp ---------- */
function photoHTML(o){
  return '<div class="photo">'
    + '<div class="frame">' + (o.scene || '') + '</div>'
    + '<div class="stamp">' + (o.stamp || '') + '</div>'
    + (o.caption ? '<div class="cap">' + o.caption + '</div>' : '')
    + '</div>';
}

/* ---------- a list of map pins ----------
   pins: [{when, place, plus, note, flag}] */
function pinsHTML(pins, title){
  let h = '<div class="pins">';
  if (title) h += '<div class="pins-h">' + title + '</div>';
  pins.forEach(p => {
    const cls = p.flag === 'off' ? ' off' : (p.flag === 'last' ? ' last' : '');
    h += '<div class="pin' + cls + '">'
       + '<span class="dot" aria-hidden="true"></span>'
       + '<span class="when">' + p.when + '</span>'
       + '<span class="place">' + p.place + '</span>'
       + '<span class="plus">' + (p.plus || '') + '</span>'
       + (p.note ? '<span class="note">' + p.note + '</span>' : '')
       + '</div>';
  });
  return h + '</div>';
}

/* ---------- plus-code helpers ----------
   A full code looks like 8FW4VC96+9G. The "block" is the four
   characters immediately before the +, which is what the chapters
   ask a player to read off and carry. */
function plusBlock(full){
  const m = String(full).match(/([A-Z0-9]{4})\+/i);
  return m ? m[1].toUpperCase() : '';
}
function plusHTML(full){
  const b = plusBlock(full);
  return String(full).replace(b + '+', '<b class="blk">' + b + '</b>+');
}
