
const LS = { sw:'mgd.safeword.patterns' };
function parse(s){ return s.split(',').map(x=> parseInt(x.trim(),10)||0).filter(Boolean); }
function vibrate(p){ try{ navigator.vibrate && navigator.vibrate(p); }catch(e){} }
export function bootstrapHapticDesigner(){
  const open=document.getElementById('hd-open');
  const box=document.getElementById('haptic-overlay');
  const save=document.getElementById('hd-save');
  const test=document.getElementById('hd-test');
  const close=document.getElementById('hd-close');
  open?.addEventListener('click', ()=>{ box.style.display='flex'; const cur=JSON.parse(localStorage.getItem(LS.sw)||'{}'); if(cur.green) document.getElementById('hd-green').value = cur.green.join(','); if(cur.yellow) document.getElementById('hd-yellow').value = cur.yellow.join(','); if(cur.red) document.getElementById('hd-red').value = cur.red.join(','); });
  save?.addEventListener('click', ()=>{ const obj={ green:parse(document.getElementById('hd-green').value), yellow:parse(document.getElementById('hd-yellow').value), red:parse(document.getElementById('hd-red').value)}; localStorage.setItem(LS.sw, JSON.stringify(obj)); alert('Saved patterns.'); });
  test?.addEventListener('click', ()=> vibrate(parse(document.getElementById('hd-green').value).concat([200]).concat(parse(document.getElementById('hd-yellow').value)).concat([200]).concat(parse(document.getElementById('hd-red').value))));
  close?.addEventListener('click', ()=> box.style.display='none');
}
document.addEventListener('DOMContentLoaded', bootstrapHapticDesigner);
