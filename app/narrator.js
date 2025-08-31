
const PRESETS = {
  soft: { rate:.95, pitch:1.1 },
  regal:{ rate:.9, pitch:.95 },
  playful:{ rate:1.05, pitch:1.2 }
};
export function bootstrapNarrator(){
  document.getElementById('nar-apply')?.addEventListener('click', ()=>{
    const p=document.getElementById('nar-preset')?.value||'soft';
    const params = PRESETS[p];
    const old = window.speak;
    window.speak = function(text){
      const u=new SpeechSynthesisUtterance(text);
      u.rate = params.rate; u.pitch = params.pitch;
      try{ speechSynthesis.speak(u); }catch(e){}
    };
    alert('Narrator preset applied.');
  });
}
document.addEventListener('DOMContentLoaded', bootstrapNarrator);
