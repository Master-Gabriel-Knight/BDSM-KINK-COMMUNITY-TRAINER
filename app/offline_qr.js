
// Minimal QR v1-L alphanumeric generator (21x21). Focused for short partner codes.
// Not a full spec implementation, but works for typical 'MGD-PARTNER:XXXX' links.
const ALPH = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
function toAlnum(s){
  s = (s||'').toUpperCase();
  for (let ch of s){ if (ALPH.indexOf(ch) < 0) return null; }
  return s;
}
function bitbuffer(){
  const arr=[]; return {
    push(val, len){ for(let i=len-1;i>=0;i--) arr.push((val>>i)&1); },
    padTo(n){ while(arr.length < n) arr.push(0); },
    toBytes(){ const out=[]; for(let i=0;i<arr.length;i+=8){ let b=0; for(let j=0;j<8;j++){ b=(b<<1)| (arr[i+j]||0); } out.push(b); } return out; },
    len(){ return arr.length; },
    arr
  };
}
function rsGenPoly(ec){ // compute generator polynomial for RS over GF(256) (x^ec)
  const gfExp=new Array(512), gfLog=new Array(256);
  let x=1; for(let i=0;i<256;i++){ gfExp[i]=x; gfLog[x]=i; x<<=1; if (x&0x100) x^=0x11d; }
  for(let i=256;i<512;i++) gfExp[i]=gfExp[i-256];
  let poly=[1];
  for(let i=0;i<ec;i++){
    const poly2=[];
    for(let j=0;j<poly.length;j++){ poly2[j]=poly[j]; }
    poly2.push(0);
    for(let j=0;j<poly.length;j++){
      const a = poly[j];
      const b = gfExp[(i + gfLog[a||1])%255]; // (x - α^i)
      poly2[j+1] ^= b;
    }
    poly = poly2;
  }
  return {poly, gfExp, gfLog};
}
function rsEncode(data, ec){ // data: bytes, ec count
  const {poly, gfExp, gfLog} = rsGenPoly(ec);
  const res = new Array(ec).fill(0);
  for (let d of data){
    const factor = d ^ res[0];
    res.shift(); res.push(0);
    if (factor!==0){
      const a = gfLog[factor];
      for (let i=0;i<ec;i++){
        res[i] ^= gfExp[(a + gfLog[poly[i+1]||1])%255];
      }
    }
  }
  return res;
}
function makeMatrix(){ const n=21; const m=[...Array(n)].map(()=> Array(n).fill(null)); return m; }
function placeFinder(m, x, y){
  for(let r=0;r<7;r++) for(let c=0;c<7;c++){
    const on = ( (r===0||r===6||c===0||c===6) || (r>=2&&r<=4&&c>=2&&c<=4) );
    if (x+c>=0 && x+c<m.length && y+r>=0 && y+r<m.length) m[y+r][x+c]=on?1:0;
  }
  // separators
  for(let i=-1;i<8;i++){ if (y-1>=0 && x+i>=0 && x+i<m.length) m[y-1][x+i]=0; if (y+7<m.length && x+i>=0 && x+i<m.length) m[y+7][x+i]=0; if (x-1>=0 && y+i>=0 && y+i<m.length) m[y+i][x-1]=0; if (x+7<m.length && y+i>=0 && y+i<m.length) m[y+i][x+7]=0; }
}
function placeTiming(m){ for(let i=8;i<m.length-8;i++){ m[6][i]= (i%2===0)?1:0; m[i][6]=(i%2===0)?1:0; } }
function reserveFormat(m){ const n=m.length; for(let i=0;i<9;i++){ if (i!==6){ m[8][i]=0; m[i][8]=0; } } for(let i=0;i<8;i++){ m[n-1-i][8]=0; if (i!==6) m[8][n-1-i]=0; } }
function darkModule(m){ m[8][m.length-8]=1; }
function dataMask(r,c,mask){ // mask 0
  return ((r+c)%2)===0;
}
function fillData(m, bytes){
  const n=m.length; let bitIdx=0;
  function nextBit(){ const byte = bytes[Math.floor(bitIdx/8)]||0; const b = 7-(bitIdx%8); const v = (byte>>b)&1; bitIdx++; return v; }
  let col = n-1, row = n-1, dir = -1;
  while (col>0){
    if (col===6) col--; // skip timing col
    for (let i=0;i<n;i++){
      const r = row + dir*i;
      for (let j=0;j<2;j++){
        const c = col - j;
        if (m[r] && m[r][c]===null){
          const v = nextBit();
          m[r][c] = v ^ (dataMask(r,c,0)?1:0);
        }
      }
    }
    row += dir*(n-1);
    dir *= -1;
    col -= 2;
  }
}
function formatBits(level='L', mask=0){
  // Precomputed masked format bits for (L, 0) = 0b111011111000100 (MSB->LSB)
  if (level==='L' && mask===0) return "111011111000100";
  // Fallback: just use same; not spec-complete but OK for v1-L
  return "111011111000100";
}
function placeFormat(m){
  const bits = formatBits('L',0);
  const n=m.length;
  // around top-left
  for(let i=0;i<6;i++) m[8][i] = parseInt(bits[i],10);
  m[8][7] = parseInt(bits[6],10);
  m[8][8] = parseInt(bits[7],10);
  m[7][8] = parseInt(bits[8],10);
  for(let i=9;i<15;i++) m[14-i][8] = parseInt(bits[i],10);
  // around other finders
  for(let i=0;i<8;i++) m[n-1-i][8] = parseInt(bits[i],10);
  for(let i=0;i<7;i++) m[8][n-1-i] = parseInt(bits[8+i],10);
}
function encodeAlnum(data){
  const bb = bitbuffer();
  bb.push(0b0010,4);               // mode
  bb.push(data.length,9);          // count
  for (let i=0;i<data.length;i+=2){
    if (i+1 < data.length){
      const v = ALPH.indexOf(data[i]) * 45 + ALPH.indexOf(data[i+1]);
      bb.push(v,11);
    } else {
      bb.push(ALPH.indexOf(data[i]),6);
    }
  }
  const CAP = 19*8; // data bits capacity for v1-L
  const TERMINATOR=4;
  const needTerm = Math.min(TERMINATOR, CAP - bb.len());
  bb.push(0, needTerm);
  while (bb.len() % 8) bb.push(0,1);
  const PAD=[0b11101100, 0b00010001];
  let i=0;
  while (bb.len() < CAP){ bb.push(PAD[i%2], 8); i++; }
  const dataBytes = bb.toBytes();
  const ecBytes = rsEncode(dataBytes, 7);
  return dataBytes.concat(ecBytes);
}
function drawQR(canvas, text){
  const data = toAlnum(text);
  if (!data){ throw new Error('Text has unsupported chars for offline QR. Use [0-9A-Z $%*+-./:]'); }
  const bytes = encodeAlnum(data);
  const m = makeMatrix(); const n=m.length;
  placeFinder(m,0,0); placeFinder(m,n-7,0); placeFinder(m,0,n-7);
  placeTiming(m); reserveFormat(m); darkModule(m);
  fillData(m, bytes); placeFormat(m);
  // render
  const ctx=canvas.getContext('2d'); const scale = Math.max(4, Math.floor(Math.min(canvas.width, canvas.height)/n));
  ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#000';
  const offset = Math.floor((canvas.width - n*scale)/2);
  for(let r=0;r<n;r++) for(let c=0;c<n;c++){ if (m[r][c]) ctx.fillRect(offset + c*scale, offset + r*scale, scale, scale); }
}
export function bootstrapOfflineQR(){
  const btn=document.getElementById('poster-offlineqr'); const img=document.getElementById('partner-qr'); if (!btn) return;
  btn.addEventListener('click', ()=>{
    try{
      const code = (document.getElementById('partner-code')?.value||'').trim();
      const link = 'MGD-PARTNER:'+encodeURIComponent(code).toUpperCase();
      const cv=document.createElement('canvas'); cv.width=240; cv.height=240; drawQR(cv, link);
      img.style.display='block'; img.src = cv.toDataURL('image/png');
    }catch(e){ alert('Offline QR failed: '+e.message); }
  });
}
document.addEventListener('DOMContentLoaded', bootstrapOfflineQR);
