
const KEYS = ['mgd.consent','mgd.remember','mgd.teach.auto','mgd.gallery','mgd.hidden','mgd.lore','mgd.sanctum.unlocks'];

function snapshot(){
  const obj = {};
  KEYS.forEach(k => obj[k] = localStorage.getItem(k));
  return obj;
}

function apply(obj){
  Object.entries(obj||{}).forEach(([k,v]) => {
    if (typeof v === 'string') localStorage.setItem(k, v);
  });
}

export function bootstrapVault(){
  const sessionPass = sessionStorage.getItem('mgd.session.encpass');
  const exp = document.getElementById('vault-export');
  const imp = document.getElementById('vault-import');
  exp?.addEventListener('click', ()=> {
    const blob = new Blob([JSON.stringify(snapshot(), null, 2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'mgd_data.json'; a.click();
  });
  imp?.addEventListener('change', (e)=>{
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ()=>{ try{ const obj = JSON.parse(r.result); apply(obj); alert('Imported. Refresh to see changes.'); } catch(e){ alert('Invalid file'); }};
    r.readAsText(f);
  });
}

// --- Encrypted Export/Import (AES-GCM via Web Crypto) ---
async function getKey(pass){
  const enc = new TextEncoder();
  const salt = enc.encode('mgd.salt.v1');
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(pass), {name:'PBKDF2'}, false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    {name:'PBKDF2', salt, iterations: 100000, hash:'SHA-256'},
    baseKey,
    {name:'AES-GCM', length: 256},
    false, ['encrypt','decrypt']
  );
}
async function exportEncrypted(){
  let pass = sessionStorage.getItem('mgd.session.encpass') || prompt('Passphrase for encryption:');
  if (!pass) return;
  const key = await getKey(pass);
  const data = new TextEncoder().encode(JSON.stringify(snapshot()));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, data);
  const blob = new Blob([iv, new Uint8Array(cipher)], {type:'application/octet-stream'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='mgd_data.enc'; a.click();
}
async function importEncrypted(file){
  let pass = sessionStorage.getItem('mgd.session.encpass') || prompt('Passphrase to decrypt:');
  if (!pass) return;
  const key = await getKey(pass);
  const buf = await file.arrayBuffer();
  const iv = new Uint8Array(buf.slice(0,12));
  const ct = buf.slice(12);
  const plain = await crypto.subtle.decrypt({name:'AES-GCM', iv}, key, ct);
  const obj = JSON.parse(new TextDecoder().decode(new Uint8Array(plain)));
  apply(obj); alert('Imported (encrypted). Refresh to see changes.');
}

export function bootstrapVaultEncrypted(){
  document.getElementById('vault-export-encrypted')?.addEventListener('click', ()=>exportEncrypted());
  document.getElementById('vault-import-encrypted')?.addEventListener('change', (e)=>{
    const f = e.target.files[0]; if (!f) return; importEncrypted(f);
  });
}

export function printNegotiation(){
  const lore = JSON.parse(localStorage.getItem('mgd.lore')||'[]');
  const last = lore.find(x => (x.title||'').toLowerCase().startsWith('scene')) || lore[0];
  const html = `<!doctype html><meta charset="utf-8"><title>Negotiation Sheet</title>
  <style>body{font-family:serif;padding:24px} h1{margin:0 0 12px} .box{border:1px solid #333;padding:12px;margin:10px 0;border-radius:8px}</style>
  <h1>Scene Negotiation Sheet</h1>
  <div class="box"><strong>From Lore:</strong><pre>${last? (last.title+"\n\n"+last.content).replace(/[&<>]/g, s=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[s])) : '(no scene saved yet)'}</pre></div>
  <div class="box"><strong>Safewords:</strong><br>Green: ________ • Yellow: ________ • Red: ________</div>
  <div class="box"><strong>Boundaries / Limits:</strong><br><br><br></div>
  <div class="box"><strong>Aftercare Plan:</strong><br><br><br></div>
  <script>window.onload=()=>window.print()</script>`;
  const w = window.open('about:blank'); w.document.write(html); w.document.close();
}
export function bootstrapVaultPrint(){
  document.getElementById('vault-print-neg')?.addEventListener('click', printNegotiation);
}
