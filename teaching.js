
// Teaching Mode, Consent, Gallery Upgrades, Sanctum Locks, and Zar'mneya guidance
import { MASTER_PASSWORD, PLACEHOLDER_GLYPH } from './config.js';

const LS = {
  consent: "mgd.consent",
  remember: "mgd.remember",
  teachAuto: "mgd.teach.auto",
  gallery: "mgd.gallery",
  hidden: "mgd.hidden" // map image src -> true
};

function qs(sel, parent=document){ return parent.querySelector(sel); }
function qsa(sel, parent=document){ return Array.from(parent.querySelectorAll(sel)); }

// ---------- Consent Gate (runs on first image add) ----------
export function ensureConsentOnce() {
  if (localStorage.getItem(LS.consent)) return Promise.resolve(true);
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.setAttribute('role','dialog');
    Object.assign(overlay.style, {position:'fixed',inset:'0',background:'rgba(0,0,0,.92)',display:'grid',placeItems:'center',zIndex:10000});
    overlay.innerHTML = `
      <div class="dialog-card" style="max-width:720px;width:92%;background:rgba(10,10,10,.82);border:1px solid #aa0066;border-radius:14px;padding:18px;">
        <h2 class="title">Consent & Gallery Capture</h2>
        <p class="sub">The first sigil you add will be stored locally in your Gallery. By continuing you confirm this is your device and you consent to local storage.</p>
        <label style="display:flex;align-items:center;gap:8px;margin:8px 0"><input id="remember-me" type="checkbox"> <span>Remember me on this device (skip password next time)</span></label>
        <div class="row">
          <input id="gate-pass" class="input" placeholder="Enter password to proceed" type="password" autocomplete="current-password"/>
        </div>
        <div class="row">
          <button id="consent-accept" class="btn">I Consent & Enter</button>
        </div>
        <small>Change password in <code>app/config.js</code> (MASTER_PASSWORD).</small>
      </div>`;
    document.body.appendChild(overlay);

    qs('#consent-accept', overlay).addEventListener('click', () => {
      const pwd = qs('#gate-pass', overlay).value;
      if (pwd !== MASTER_PASSWORD){ alert('Incorrect password.'); return; }
      const remember = qs('#remember-me', overlay).checked;
      if (remember) localStorage.setItem(LS.remember, '1');
      localStorage.setItem(LS.consent, '1');
      overlay.remove();
      resolve(true);
    });
  });
}

export function gateIfNeeded() {
  if (localStorage.getItem(LS.remember) || localStorage.getItem(LS.consent)) return;
  // soft gate button visible on load
  const gate = document.createElement('div');
  gate.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);top:8px;z-index:9998';
  gate.innerHTML = `<button id="open-gate" class="navbtn" title="Enter">🔒 Enter</button>`;
  document.body.appendChild(gate);
  gate.addEventListener('click', ensureConsentOnce);
}

// ---------- Gallery (upload, show/hide, drag & drop, local persistence) ----------
export function setupGallery() {
  const gallery = qs('#gallery');
  if (!gallery) return;
  const grid = gallery.querySelector('.grid') || gallery;
  const fileInput = gallery.querySelector('input[type="file"]');
  let store = JSON.parse(localStorage.getItem(LS.gallery)||'[]');
  // normalize legacy array-of-src into array-of-objects
  store = store.map(x => (typeof x === 'string' ? {src:x} : x));
  const hidden = JSON.parse(localStorage.getItem(LS.hidden)||'{}');

  function persist(){
      const items = Array.from(grid.querySelectorAll('.cell')).map(cell => {
        const img = cell.querySelector('img[data-src]') || cell.querySelector('img');
        const title = cell.getAttribute('data-title') || '';
        const tag = cell.getAttribute('data-tag') || '';
        return {src: img.getAttribute('data-src') || img.src, title, tag};
      });
      localStorage.setItem(LS.gallery, JSON.stringify(items));
    }
  function persistHidden(){ localStorage.setItem(LS.hidden, JSON.stringify(hidden)); }

  function addImage(item){
    const meta = (typeof item==='string')? {src:item} : (item||{});
    const src = meta.src; const title = meta.title||''; const tag = meta.tag||'';
    const wrap = document.createElement('div');
    wrap.className = 'cell'; wrap.draggable = true;
    wrap.innerHTML = `
      <figure style="position:relative;margin:0">
        <img src="${src}" alt="sigil" style="display:${hidden[src]?'none':'block'};max-width:100%;border:1px solid rgba(255,255,255,.15);border-radius:10px">
        <img class="placeholder" src="${PLACEHOLDER_GLYPH}" alt="hidden" style="display:${hidden[src]?'block':'none'};max-width:100%">
        <figcaption class="row" style="margin-top:6px;gap:8px"><span style="opacity:.7">${title}</span>
          <button class="navbtn toggle">${hidden[src]?'Show':'Hide'}</button>
          <span style="opacity:.6">Drag to reorder</span>
        </figcaption>
      </figure>`;
    wrap.setAttribute('data-title', title);
    wrap.setAttribute('data-tag', tag);
    const toggle = wrap.querySelector('.toggle');
    toggle.addEventListener('click', () => {
      hidden[src] = !hidden[src];
      wrap.querySelector('img').style.display = hidden[src]?'none':'block';
      wrap.querySelector('.placeholder').style.display = hidden[src]?'block':'none';
      toggle.textContent = hidden[src] ? 'Show' : 'Hide';
      persistHidden();
    });

    // drag & drop
    wrap.addEventListener('dragstart', e => { wrap.classList.add('drag'); e.dataTransfer.setData('text/plain', src); });
    wrap.addEventListener('dragend', () => wrap.classList.remove('drag'));
    grid.addEventListener('dragover', e => { e.preventDefault(); const after = getDragAfter(grid, e.clientY); if (after == null) grid.appendChild(wrap); else grid.insertBefore(wrap, after); });
    persist();
    grid.appendChild(wrap);
  }

  function getDragAfter(container, y){
    const els = [...container.querySelectorAll('.cell:not(.drag)')];
    return els.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height/2;
      if (offset < 0 && offset > closest.offset){ return { offset, element: child }; } else { return closest; }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // initial load
  if (store.length) store.forEach(addImage);

  fileInput?.addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    await ensureConsentOnce();
    const reader = new FileReader();
    reader.onload = () => { addImage(reader.result); persist(); };
    reader.readAsDataURL(f);
    e.target.value = '';
  });
}

// ---------- Sanctum: lock message on click ----------
export function setupSanctumLocks(){
  qsa('.sanctum-item').forEach(el => {
    el.addEventListener('click', () => {
      const d = document.createElement('div');
      d.setAttribute('role','dialog');
      d.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.9);display:grid;place-items:center;z-index:10000';
      d.innerHTML = `<div class="dialog-card" style="max-width:600px;width:92%;background:rgba(10,10,10,.82);border:1px solid #aa0066;border-radius:14px;padding:18px;">
        <h3 class="title">Locked Sanctum Node</h3>
        <p class="sub">This is locked. Perform the Master’s rituals to unlock. (Nothing is deleted; only hidden or revealed.)</p>
        <div class="row"><button class="btn secondary">Close</button></div>
      </div>`;
      d.querySelector('button').addEventListener('click', () => d.remove());
      document.body.appendChild(d);
    });
  });
}

// ---------- Zar'mneya trainer ----------
const lessons = {
  gallery: [
    'Upload a sigil or image (local-only).',
    'Use Hide/Show to veil or reveal. Nothing is deleted.',
    'Drag cards to reorder your gallery; order persists locally.',
    'First upload triggers consent capture and optional “Remember me”.'
  ],
  lore: [
    'Zar’mneya (zm) is your memory guide. Ask it to remember, recall, or forget lore fragments.',
    'Use triggers like “zm remember: <title> — <content>”.',
    'Lore is woven into your local Codex and can surface contextually.',
    'Teaching Mode highlights area-specific prompts to accelerate remembrance.'
  ],
  sanctum: [
    'Click any sanctum item. Locked items will announce their status and invite ritual.',
    'Unlocked items unfold panels with practices and mythoglyphic cues (coming next updates).',
    'All locks are veils; your progress toggles reveal states in local storage.'
  ],
  global: [
    'Use the Teaching Mode button (bottom-right) anytime to see area guidance.',
    'Change password in app/config.js (MASTER_PASSWORD).',
    'Meta robots is set to noindex,nofollow by default.',
    'All data is local-only; no network calls are made.'
  ]
};

function renderLesson(which){
  const box = document.getElementById('teach-content');
  if (!box) return;
  const items = (lessons[which]||[]).map(s => `<li>${s}</li>`).join('');
  box.innerHTML = `<h3 style="margin:6px 0 8px">${which[0].toUpperCase()+which.slice(1)} — Training</h3><ol>${items}</ol>`;
}

// ---------- Teaching Mode overlay ----------
export function setupTeachingOverlay(){
  const open = document.getElementById('teach-open');
  const overlay = document.getElementById('teach-overlay');
  const autoshow = document.getElementById('teach-autoshow');
  if (!open || !overlay) return;

  autoshow.checked = localStorage.getItem(LS.teachAuto)==='1';
  autoshow.addEventListener('change', () => {
    if (autoshow.checked) localStorage.setItem(LS.teachAuto,'1'); else localStorage.removeItem(LS.teachAuto);
  });

  open.addEventListener('click', () => { overlay.style.display='flex'; renderLesson('global'); });
  document.getElementById('teach-close')?.addEventListener('click', () => overlay.style.display='none');
  document.querySelectorAll('[data-train]').forEach(b => b.addEventListener('click', ()=>renderLesson(b.dataset.train)));

  if (localStorage.getItem(LS.teachAuto) === '1'){ overlay.style.display='flex'; }
}

// ---------- Bootstrap ----------
export function bootstrapMGD(){
  try{
    gateIfNeeded();
    setupTeachingOverlay();
    setupGallery();
    setupSanctumLocks();
  }catch(e){
    console.error('MGD bootstrap error', e);
  }
}

document.addEventListener('DOMContentLoaded', bootstrapMGD);

// expose helper
window.MGD_addToGallery = (meta) => {
  try { const grid = document.querySelector('#gallery .grid') || document.querySelector('#gallery'); if(!grid){ console.warn('Gallery not present'); return; }
    // reuse addImage via closure by re-calling setup if grid empty placeholder
    addImage(meta); } catch(e){ console.error('MGD_addToGallery error', e); }
};
