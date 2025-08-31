
function topArchetype(){
  try{ const s = JSON.parse(localStorage.getItem('mgd.eros.compass')||'{}'); let best=null, val=-1; Object.entries(s).forEach(([k,v])=>{ if (v>val){ val=v; best=k; } }); return best; }catch(e){ return null; }
}
function soften(line){
  const a = topArchetype();
  if (!a) return line;
  const pre = {
    'Sovereign':'Crown note:',
    'Devotee':'Devotion note:',
    'Trickster':'Play note:',
    'Hunter':'Focus note:',
    'Muse':'Muse note:'
  }[a] || 'Note:';
  return pre+' '+line;
}
export function bootstrapAdaptiveLang(){
  // monkeypatch speak to add prefix
  const oldSpeak = window.speak;
  window.speak = function(text){ (oldSpeak||((t)=>{ try{ speechSynthesis.speak(new SpeechSynthesisUtterance(t)); }catch(e){} }))(soften(text)); };
}
document.addEventListener('DOMContentLoaded', bootstrapAdaptiveLang);
