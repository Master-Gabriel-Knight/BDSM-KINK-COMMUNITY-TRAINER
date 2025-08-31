
import { openBreathRitual, crestPulse } from './breath.js';
const LS = { unlocks: 'mgd.sanctum.unlocks' };
function loadUnlocks(){ return JSON.parse(localStorage.getItem(LS.unlocks)||'{}'); }

export function bootstrapSanctumMap(){
  const unlocks = loadUnlocks();
  document.querySelectorAll('.sanctum-node').forEach(btn => {
    const key = btn.dataset.node;
    const unlocked = !!unlocks[key];
    btn.classList.toggle('active', unlocked);
    btn.title = unlocked ? 'Unlocked' : 'Locked — perform ritual to unlock';
    btn.addEventListener('click', () => {
      if (unlocks[key]){
        // already unlocked: give a gentle crest pulse
        crestPulse();
      } else {
        openBreathRitual(key);
      }
    });
  });
}

export function bloomAll(){
  const LS = { unlocks: 'mgd.sanctum.unlocks' };
  const unlocks = JSON.parse(localStorage.getItem(LS.unlocks)||'{}');
  document.querySelectorAll('.sanctum-node').forEach(b => unlocks[b.dataset.node]=true);
  localStorage.setItem(LS.unlocks, JSON.stringify(unlocks));
  bootstrapSanctumMap();
  alert('All Paths bloomed locally. (You can always veil them again.)');
}
document.getElementById('bloom-all')?.addEventListener('click', bloomAll);
