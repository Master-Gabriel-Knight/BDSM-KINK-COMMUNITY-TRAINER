
async function hashPass(pass, salt){
  const enc=new TextEncoder();
  const key=await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2', salt, iterations:120000, hash:'SHA-256'}, key, {name:'AES-GCM', length:256}, false, ['encrypt','decrypt']);
}
function gather(){
  function pull(k, d){ try{ return JSON.parse(localStorage.getItem(k)||JSON.stringify(d)); }catch(e){ return d; } }
  const obj = {
    script: document.getElementById('script-view')?.textContent||'',
    lore: pull('mgd.lore', []),
    rr: pull('mgd.risk.register', []),
    cc: pull('mgd.consent.checklists', {}),
    pulses: pull('mgd.pulse.log', []),
    transcript: pull('mgd.transcript', []),
    sigils: pull('mgd.sigil.gallery', []),
    when: Date.now(),
    ver: 1
  };
  return obj;
}
export function bootstrapPrivacyCapsule(){
  const pass=document.getElementById('pc-pass'); const exp=document.getElementById('pc-export'); const imp=document.getElementById('pc-import'); const st=document.getElementById('pc-status');
  exp?.addEventListener('click', async ()=>{
    try{
      const salt=crypto.getRandomValues(new Uint8Array(16));
      const iv=crypto.getRandomValues(new Uint8Array(12));
      const key=await hashPass(pass?.value||'', salt);
      const data=new TextEncoder().encode(JSON.stringify(gather()));
      const ct= new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, data));
      const blob = new Blob([new Uint8Array([1]), salt, iv, ct], {type:'application/octet-stream'}); // 1|salt|iv|cipher
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='session.mgdc'; a.click(); st.textContent='Exported.';
    }catch(e){ st.textContent='Failed.'; }
  });
  imp?.addEventListener('change', async (e)=>{
    try{
      const f=e.target.files[0]; if(!f) return; const buf=await f.arrayBuffer(); const view=new Uint8Array(buf);
      const ver=view[0]; if (ver!==1) throw new Error('Unknown version');
      const salt=view.slice(1,17); const iv=view.slice(17,29); const ct=view.slice(29);
      const key=await hashPass(pass?.value||'', salt);
      const plain=await crypto.subtle.decrypt({name:'AES-GCM', iv}, key, ct);
      const obj=JSON.parse(new TextDecoder().decode(plain));
      // store a snapshot (non-destructive): write to mgd.capsule.import
      localStorage.setItem('mgd.capsule.import', JSON.stringify(obj));
      st.textContent='Imported capsule (stored at mgd.capsule.import).';
    }catch(e){ st.textContent='Import failed (wrong pass?).'; }
  });
}
document.addEventListener('DOMContentLoaded', bootstrapPrivacyCapsule);
