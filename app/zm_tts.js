let audioReady = false;
let preferredVoice = null;
let ac=null;
const LS = { voice:'mgd.zm.voice', speak:'mgd.zm.speak' };
function chooseVoice(){
  const want = localStorage.getItem(LS.voice)||'';
  const voices = (typeof speechSynthesis!=='undefined') ? speechSynthesis.getVoices() : [];
  if (want){ const v = voices.find(x=> x.name===want); if (v) return v; }
  return voices.find(v=> /^en(-|_)/i.test(v.lang)) || voices[0];
}
export function enableVoice(){
  try{
    if (typeof speechSynthesis!=='undefined'){
      speechSynthesis.cancel();
      speechSynthesis.resume();
      preferredVoice = chooseVoice();
    }
    audioReady = true;
    return true;
  }catch(e){ return false; }
}
export function setSpeak(on){ localStorage.setItem(LS.speak, on?'1':'0'); }
export function speak(text){
  if (localStorage.getItem(LS.speak)!=='1') return;
  if (typeof speechSynthesis!=='undefined'){
    try{
      const u = new SpeechSynthesisUtterance(String(text||''));
      preferredVoice = chooseVoice();
      if (preferredVoice) u.voice = preferredVoice;
      u.rate = 0.98; u.pitch = 1.0;
      speechSynthesis.speak(u);
      return;
    }catch(e){}
  }
  tone(432, 200);
}
export function listVoices(){ try{ return speechSynthesis.getVoices().map(v=> v.name + ' — ' + v.lang); }catch(e){ return []; } }
function tone(freq=440, ms=220){
  try{
    ac = ac || new (window.AudioContext||window.webkitAudioContext)();
    const o=ac.createOscillator(), g=ac.createGain(); o.connect(g); g.connect(ac.destination);
    o.frequency.value=freq; g.gain.value=0.001; g.gain.linearRampToValueAtTime(0.06, ac.currentTime+0.01);
    o.start();
    setTimeout(()=>{ g.gain.exponentialRampToValueAtTime(0.00001, ac.currentTime+ms/1000); o.stop(ac.currentTime+ms/1000); }, ms-50);
  }catch(e){}
}
if (typeof speechSynthesis!=='undefined'){
  speechSynthesis.onvoiceschanged = () => { preferredVoice = chooseVoice(); };
}
