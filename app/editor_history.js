
let undoStack=[], redoStack=[];
function snap(){ const list=document.getElementById('se-list'); if (!list) return; undoStack.push(list.innerHTML); if (undoStack.length>50) undoStack.shift(); redoStack.length=0; }
export function bootstrapEditorHistory(){
  const undo=document.getElementById('se-undo'); const redo=document.getElementById('se-redo'); const list=document.getElementById('se-list');
  undo?.addEventListener('click', ()=>{ if (undoStack.length){ const cur=list.innerHTML; const prev=undoStack.pop(); redoStack.push(cur); list.innerHTML=prev; } });
  redo?.addEventListener('click', ()=>{ if (redoStack.length){ const cur=list.innerHTML; const next=redoStack.pop(); undoStack.push(cur); list.innerHTML=next; } });
  // heuristic: snapshot on clicks inside list or on add/remove buttons by delegation
  (document.getElementById('stage-editor')||document).addEventListener('click', (e)=>{
    const t=e.target; if (!t) return;
    if (t.id?.startsWith('se-') || t.closest && t.closest('#se-list')) snap();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapEditorHistory);
