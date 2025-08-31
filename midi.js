
let output=null;
function status(t){ const el=document.getElementById('midi-status'); if (el) el.textContent=t; }
function noteOn(note=76, vel=80){ if(!output) return; output.send([0x90, note, vel]); setTimeout(()=> output && output.send([0x80, note, 0]), 200); }
export function bootstrapMIDI(){
  if (!('requestMIDIAccess' in navigator)){ status('Web MIDI not supported.'); return; }
  navigator.requestMIDIAccess().then(access=>{
    const it = access.outputs.values().next();
    output = it.value || null;
    status(output ? 'MIDI ready.' : 'No MIDI outputs found.');
    document.getElementById('midi-test')?.addEventListener('click', ()=> noteOn(80, 100));
    window.addEventListener('mgd:phase', ()=> noteOn());
  }).catch(()=> status('MIDI access denied.'));
}
document.addEventListener('DOMContentLoaded', bootstrapMIDI);
