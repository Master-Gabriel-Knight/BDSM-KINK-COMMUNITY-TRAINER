
const LS = { lore: 'mgd.lore' };
function nowISO(){ return new Date().toISOString(); }
function load(){ return JSON.parse(localStorage.getItem(LS.lore)||'[]'); }
function save(list){ localStorage.setItem(LS.lore, JSON.stringify(list)); }

function render(list){
  const q = (document.getElementById('lore-search')?.value||'').toLowerCase();
  const mount = document.getElementById('lore-list'); if(!mount) return;
  mount.innerHTML = '';
  list.filter(x => (x.title+x.content).toLowerCase().includes(q)).forEach(item => {
    const card = document.createElement('div');
    card.style.cssText = 'border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;background:rgba(0,0,0,.25)';
    card.innerHTML = `<strong>${item.title||'(untitled)'}</strong><br><small>${new Date(item.time).toLocaleString()}</small><p>${item.content||''}</p>`;
    mount.appendChild(card);
  });
}

function remember(title, content){
  const list = load();
  list.unshift({ id: crypto.randomUUID(), time: nowISO(), title, content });
  save(list); render(list);
}

function recall(keyword){
  const list = load();
  const k = keyword.toLowerCase();
  return list.find(x => (x.title+x.content).toLowerCase().includes(k));
}

function forget(title){
  const list = load().filter(x => x.title.toLowerCase() !== title.toLowerCase());
  save(list); render(list);
}

function handle(text){
  // parse "zm remember: Title — content"
  const t = text.trim();
  const low = t.toLowerCase();
  if (low.startsWith('zm remember:')){
    const body = t.slice('zm remember:'.length).trim();
    const parts = body.split(/—|--|:/);
    const title = (parts.shift()||'Untitled').trim();
    const content = parts.join('—').trim();
    remember(title, content);
    return `Remembered “${title}”.`;
  }
  if (low.startsWith('zm recall:')){
    const key = t.slice('zm recall:'.length).trim();
    const item = recall(key);
    return item ? `Recall → ${item.title}: ${item.content}` : 'Nothing found.';
  }
  if (low.startsWith('zm forget:')){
    const title = t.slice('zm forget:'.length).trim();
    forget(title);
    return `Forgot “${title}”.`;
  }
  // Default: treat as remember with auto-title
  const title = t.split(/[—\-:]/)[0].slice(0,80);
  remember(title||'Untitled', t);
  return `Stored as “${title||'Untitled'}”.`;
}

export function bootstrapLore(){
  const input = document.getElementById('lore-input');
  const search = document.getElementById('lore-search');
  const mic = document.getElementById('lore-mic');
  const exp = document.getElementById('lore-export');
  const imp = document.getElementById('lore-import');
  render(load());

  input?.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter'){ const msg = handle(input.value); input.value=''; console.log(msg); }
  });
  search?.addEventListener('input', ()=> render(load()));
  exp?.addEventListener('click', ()=> {
    const blob = new Blob([JSON.stringify(load(), null, 2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'mgd_lore.json'; a.click();
  });
  imp?.addEventListener('change', (e)=>{
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader(); r.onload = ()=>{ try{ save(JSON.parse(r.result)); render(load()); }catch(e){ alert('Invalid file'); } }; r.readAsText(f);
  });

  // Voice dictation (Web Speech API if available)
  mic?.addEventListener('click', ()=>{
    try{
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR){ alert('Voice input not supported in this browser.'); return; }
      const rec = new SR(); rec.lang='en-US'; rec.continuous=false; rec.interimResults=false;
      rec.onresult = (ev)=>{ const t = ev.results[0][0].transcript; input.value = t; input.focus(); };
      rec.start();
    }catch(e){ alert('Could not start voice recognition.'); }
  });
}
