
function scorePack(p){
  let s=0; const reasons=[];
  if (p.safety && (p.safety.require||[]).includes('safeword')){ s+=25; reasons.push('Requires safeword'); }
  if (p.safety && (p.safety.require||[]).includes('aftercare')){ s+=20; reasons.push('Requires aftercare'); }
  if ((p.lore||[]).some(x=> /Agreement|Aftercare|Boundaries/i.test(x.title||''))){ s+=15; reasons.push('Lore has agreement elements'); }
  if ((p.script||'').match(/\b(safeword|red|yellow|green)\b/i)){ s+=15; reasons.push('Script mentions signals'); }
  if ((p.lore||[]).length>=3){ s+=10; reasons.push('Has history'); }
  if ((p.tags||[]).includes('community')){ s+=5; reasons.push('Community-tagged'); }
  s = Math.min(100, s); const grade = s>=80? 'A' : s>=60? 'B' : s>=40? 'C' : 'D';
  return {score:s, grade, reasons};
}
function card(p, i, meta){
  const d=document.createElement('div'); d.style.cssText='border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;background:rgba(0,0,0,.25)';
  const sc=scorePack(p);
  d.innerHTML = `<div style="font-weight:600">${meta.name||('Pack '+(i+1))} <span class="sub" style="opacity:.8">grade ${sc.grade} (${sc.score})</span></div>`+
  `<div class="sub" style="opacity:.85;margin:4px 0">${(sc.reasons||[]).join(' • ')||'Heuristics neutral'}</div>`+
  `<div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn" data-act="installScript">Install Script</button><button class="btn" data-act="addLore">Add Lore</button></div>`;
  d.querySelectorAll('button').forEach(b=> b.addEventListener('click', ()=>{
    if (b.dataset.act==='installScript'){ const v=document.getElementById('script-view'); if(v) v.textContent = p.script||''; alert('Script installed.'); }
    if (b.dataset.act==='addLore'){ try{ const L=JSON.parse(localStorage.getItem('mgd.lore')||'[]'); (p.lore||[]).forEach(x=> L.unshift(x)); localStorage.setItem('mgd.lore', JSON.stringify(L)); alert('Lore added.'); }catch(e){} }
  }));
  return d;
}
export function bootstrapBazaar(){
  const grid=document.getElementById('bz-grid'); const imp=document.getElementById('bz-import'); const clr=document.getElementById('bz-clear');
  const list=[];
  function render(){ if(!grid) return; grid.innerHTML=''; list.forEach((x,i)=> grid.appendChild(card(x.pack, i, x.meta))); }
  imp?.addEventListener('change', (e)=>{
    const files=[...e.target.files||[]];
    files.forEach(f=>{
      const r=new FileReader(); r.onload=()=>{ try{ const obj=JSON.parse(r.result); if (obj.kind==='mgd.community'){ list.push({meta:{name:f.name}, pack: obj}); render(); } }catch(e){} }; r.readAsText(f);
    });
  });
  clr?.addEventListener('click', ()=>{ list.length=0; render(); });
  render();
}
document.addEventListener('DOMContentLoaded', bootstrapBazaar);
