
import { NODE_MAP } from './nodes.js';

async function getKey(pass){
  const enc = new TextEncoder();
  const salt = enc.encode('mgd.partner.v1');
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(pass), {name:'PBKDF2'}, false, ['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2', salt, iterations: 100000, hash:'SHA-256'}, baseKey, {name:'AES-GCM', length:256}, false, ['encrypt','decrypt']);
}
async function encrypt(pass, plain){
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey(pass);
  const ct = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, new TextEncoder().encode(plain));
  const buf = new Uint8Array([...iv, ...new Uint8Array(ct)]);
  return btoa(String.fromCharCode(...buf));
}
async function decrypt(pass, b64){
  const raw = Uint8Array.from(atob(b64), c=>c.charCodeAt(0));
  const iv = raw.slice(0,12); const data = raw.slice(12);
  const key = await getKey(pass);
  const plain = await crypto.subtle.decrypt({name:'AES-GCM', iv}, key, data);
  return new TextDecoder().decode(new Uint8Array(plain));
}

function lastScene(){
  const lore = JSON.parse(localStorage.getItem('mgd.lore')||'[]');
  return lore.find(x => (x.title||'').toLowerCase().startsWith('scene')) || lore[0];
}

export function bootstrapPartner(){
  const openBtn = document.getElementById('open-partner');
  const overlay = document.getElementById('partner-overlay');
  const gen = document.getElementById('partner-gen');
  const imp = document.getElementById('partner-import');
  const code = document.getElementById('partner-code');
  const copy = document.getElementById('partner-copy');
  const close = document.getElementById('partner-close');

  function show(on){ overlay.style.display = on ? 'flex' : 'none'; }
  openBtn?.addEventListener('click', ()=> show(true));
  close?.addEventListener('click', ()=> show(false));

  gen?.addEventListener('click', async ()=>{
    const pass = prompt('Passphrase for partner code:');
    if (!pass) return;
    const scene = lastScene() || {title:'(none)', content:'(no scene)'};
    const payload = JSON.stringify({t:scene.title, c:scene.content, ts: Date.now()});
    code.value = await encrypt(pass, payload);
  });

  imp?.addEventListener('click', async ()=>{
    const pass = prompt('Passphrase to import partner code:');
    if (!pass) return;
    const b64 = prompt('Paste partner code:');
    if (!b64) return;
    try{
      const plain = await decrypt(pass, b64);
      const obj = JSON.parse(plain);
      // Save into lore
      const list = JSON.parse(localStorage.getItem('mgd.lore')||'[]');
      list.unshift({ id: crypto.randomUUID(), time: new Date().toISOString(), title: obj.t || 'Partner Scene', content: obj.c || '' });
      localStorage.setItem('mgd.lore', JSON.stringify(list));
      alert('Partner scene imported to Lore.');
    }catch(e){ alert('Failed to import (wrong passphrase or bad code).'); }
  });

  copy?.addEventListener('click', ()=>{ code.select(); document.execCommand('copy'); alert('Code copied.'); });
}
document.addEventListener('DOMContentLoaded', bootstrapPartner);
