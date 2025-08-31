
function str2ab(s){ return new TextEncoder().encode(s); }
function ab2b64(ab){ return btoa(String.fromCharCode(...new Uint8Array(ab))); }
function b642ab(b64){ const bin = atob(b64); const arr = new Uint8Array(bin.length); for (let i=0;i<bin.length;i++) arr[i]=bin.charCodeAt(i); return arr.buffer; }
async function deriveKey(pass, salt){
  const keyMaterial = await crypto.subtle.importKey('raw', str2ab(pass), {name:'PBKDF2'}, false, ['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2', salt, iterations:120000, hash:'SHA-256'}, keyMaterial, {name:'AES-GCM', length:256}, false, ['encrypt','decrypt']);
}
async function encryptJson(obj, pass){
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(pass, salt);
  const enc = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, str2ab(JSON.stringify(obj)));
  return { iv:ab2b64(iv), salt:ab2b64(salt), data:ab2b64(enc) };
}
async function decryptJson(pkg, pass){
  const iv = new Uint8Array(b642ab(pkg.iv)); const salt = new Uint8Array(b642ab(pkg.salt)); const data = b642ab(pkg.data);
  const key = await deriveKey(pass, salt);
  const dec = await crypto.subtle.decrypt({name:'AES-GCM', iv}, key, data);
  return JSON.parse(new TextDecoder().decode(dec));
}
function collect(){ const dump={}; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k && k.startsWith('mgd.')) dump[k]=localStorage.getItem(k); } return dump; }
function restore(obj){ Object.entries(obj||{}).forEach(([k,v])=>{ if(k.startsWith('mgd.')) localStorage.setItem(k,v); }); }
export function bootstrapEncBackup(){
  const open=document.getElementById('eb-open'); const box=document.getElementById('encbk-overlay'); const close=document.getElementById('eb-close');
  open?.addEventListener('click', ()=> box.style.display='flex');
  close?.addEventListener('click', ()=> box.style.display='none');
  document.getElementById('eb-export')?.addEventListener('click', async ()=>{
    const pass = document.getElementById('eb-pass')?.value||''; if (!pass) return alert('Enter a passphrase.');
    const pkg = await encryptJson(collect(), pass);
    const blob = new Blob([JSON.stringify(pkg,null,2)], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='mgd_backup.enc.json'; a.click();
  });
  document.getElementById('eb-import')?.addEventListener('change', (e)=>{
    const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=async ()=>{
      try{ const pkg=JSON.parse(r.result); const pass = prompt('Enter passphrase to decrypt'); const obj = await decryptJson(pkg, pass||''); restore(obj); alert('Decrypted + imported. Refresh recommended.'); }catch(e){ alert('Failed to decrypt/import.'); }
    }; r.readAsText(f);
  });
}
document.addEventListener('DOMContentLoaded', bootstrapEncBackup);
