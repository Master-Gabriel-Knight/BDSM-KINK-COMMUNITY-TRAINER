
function show(on){ const o=document.getElementById('journal-overlay'); if(o) o.style.display=on?'flex':'none'; }
export function bootstrapJournal(){
  document.getElementById('jn-save')?.addEventListener('click', ()=>{
    const peak = document.getElementById('jn-peak')?.value||'';
    const learn = document.getElementById('jn-learn')?.value||'';
    const nxt = document.getElementById('jn-next')?.value||'';
    const body = `Peak: ${peak}\nLearned: ${learn}\nNext: ${nxt}`;
    const list = JSON.parse(localStorage.getItem('mgd.lore')||'[]');
    list.unshift({ id: crypto.randomUUID(), time: new Date().toISOString(), title:'Scene Journal', content: body });
    localStorage.setItem('mgd.lore', JSON.stringify(list));
    alert('Saved to Lore.'); show(false);
  });
  document.getElementById('jn-close')?.addEventListener('click', ()=> show(false));
  window.addEventListener('mgd:ritualComplete', ()=> show(true));
}
document.addEventListener('DOMContentLoaded', bootstrapJournal);
