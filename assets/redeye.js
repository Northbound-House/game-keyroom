/* ============================================================
   THE RED-EYE — shared trilogy logic
   Roscoe's one-time cipher, used across Series Two.

   The key is the four numbers hidden in Coralie's love letters,
   repeating. Letters are numbers, A=1 … Z=26.
     encode = add the key      (to send)
     decode = subtract the key (to read)

   Chapter II teaches it: decode PXKCIK -> LEDGER, then encode
   PRINT -> TKPJX. Chapter III makes you use it under pressure.
   ============================================================ */

const KEY = [4, 19, 7, 22];

function letterToNum(c){ return c.toUpperCase().charCodeAt(0) - 64; }   // A=1
function numToLetter(n){ return String.fromCharCode(((n - 1 + 260) % 26) + 65); }

function cipherEncode(plain){
  return plain.toUpperCase().replace(/[^A-Z]/g,'')
    .split('').map((c,i) => numToLetter(letterToNum(c) + KEY[i % KEY.length])).join('');
}
function cipherDecode(cipher){
  return cipher.toUpperCase().replace(/[^A-Z]/g,'')
    .split('').map((c,i) => numToLetter(letterToNum(c) - KEY[i % KEY.length])).join('');
}

/* the A=1..Z=26 reference card */
function cipherTableHTML(){
  let h = '<div class="cipher-table">';
  for (let i = 0; i < 26; i++){
    h += '<div><b>' + String.fromCharCode(65 + i) + '</b>' + (i + 1) + '</div>';
  }
  return h + '</div>';
}

/* the repeating key, with a caption telling the player which way to run it */
function keyStripHTML(note){
  return '<div class="keystrip">' + KEY.join(' &nbsp; ') +
         '<small>' + note + '</small></div>';
}
