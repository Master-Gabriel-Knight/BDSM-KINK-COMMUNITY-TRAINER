
const KEYS = ['mgd.consent','mgd.remember','mgd.teach.auto','mgd.gallery','mgd.hidden','mgd.lore','mgd.sanctum.unlocks','mgd.kink.enabled','mgd.kink.consent','mgd.kink.intensity','mgd.node.progress'];

function listProfiles(){
  const all = Object.keys(localStorage).filter(k=>k.startsWith('mgd.profile.')).map(k=>k.split('.')[2]);
  return Array.from(new Set(all));
}
function getKey(profile, key){ return `mgd.profile.${profile}.${key}`; }

function saveProfile(name){
  if (!name) return alert('Name required');
  KEYS.forEach(k => { localStorage.setItem(getKey(name,k), localStorage.getItem(k)); });
  updateSelect();
  alert(`Saved profile: ${name}`);
}
function loadProfile(name){
  if (!name) return alert('Choose profile');
  KEYS.forEach(k => {
    const v = localStorage.getItem(getKey(name,k));
    if (v !== null) localStorage.setItem(k, v); else localStorage.removeItem(k);
  });
  alert(`Loaded profile: ${name} — refresh recommended.`);
}
function deleteProfile(name){
  if (!name) return;
  if (!confirm(`Delete profile: ${name}?`)) return;
  KEYS.forEach(k => localStorage.removeItem(getKey(name,k)));
  updateSelect();
}
function updateSelect(){
  const sel = document.getElementById('profile-select'); if (!sel) return;
  sel.innerHTML = '';
  listProfiles().forEach(n => {
    const o = document.createElement('option'); o.value=n; o.textContent=n; sel.appendChild(o);
  });
}

export function bootstrapProfiles(){
  updateSelect();
  document.getElementById('profile-new')?.addEventListener('click', ()=>{
    const name = document.getElementById('profile-name')?.value.trim(); if (!name) return alert('Enter a name');
    saveProfile(name);
  });
  document.getElementById('profile-save')?.addEventListener('click', ()=>{
    const name = document.getElementById('profile-select')?.value || document.getElementById('profile-name')?.value.trim();
    saveProfile(name);
  });
  document.getElementById('profile-load')?.addEventListener('click', ()=>{
    const name = document.getElementById('profile-select')?.value; loadProfile(name);
  });
  document.getElementById('profile-delete')?.addEventListener('click', ()=>{
    const name = document.getElementById('profile-select')?.value; deleteProfile(name);
  });
}

document.addEventListener('DOMContentLoaded', bootstrapProfiles);

function setSessionPass(pass){
  if (pass) sessionStorage.setItem('mgd.session.encpass', pass);
  else sessionStorage.removeItem('mgd.session.encpass');
}
document.getElementById('profile-makecurrent')?.addEventListener('click', ()=>{
  const name = document.getElementById('profile-select')?.value;
  const pass = document.getElementById('profile-pass')?.value;
  if (!name) return alert('Choose profile first');
  loadProfile(name); setSessionPass(pass||'');
  localStorage.setItem('mgd.profile.current', name);
  alert(`Profile set as current${pass?' with session passphrase':''}.`);
});
