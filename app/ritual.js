
import { setToneHz, openBreathRitual } from './breath.js';
import { NODE_MAP } from './nodes.js';

const LS = { ritual: 'mgd.ritual.saved' };

function parse(text){
  const lines = text.split(/\n+/).map(s=>s.trim()).filter(Boolean);
  const cmds = [];
  for (const line of lines){
    const mTone = line.match(/^tone\s+(\d+)/i);
    const mCad = line.match(/^cadence\s+([\d\s,]+)/i);
    const mBreath = line.match(/^breath(?:\s+x(\d+))?/i);
    const mUnlock = line.match(/^unlock\s+(\w+)/i);
    const mDecree = line.match(/^decree\s+["“”'](.+)["“”']/i);
    if (mTone){ cmds.push({op:'tone', hz: parseInt(mTone[1],10)}); continue; }
    if (mCad){ cmds.push({op:'cadence', seq:mCad[1]}); continue; }
    if (mBreath){ cmds.push({op:'breath', times: parseInt(mBreath[1]||'3',10)}); continue; }
    if (mUnlock){ cmds.push({op:'unlock', key:mUnlock[1].toLowerCase()}); continue; }
    if (mDecree){ cmds.push({op:'decree', text:mDecree[1]}); continue; }
  }
  return cmds;
}

function apply(cmds){
  // Apply tone/cadence immediately; breath opens overlay; decree shows overlay
  const custom = document.getElementById('breath-custom');
  cmds.forEach(c => {
    if (c.op==='tone'){ setToneHz(c.hz); }
    if (c.op==='cadence' && custom){ custom.value = c.seq; }
    if (c.op==='unlock'){
      try{
        const LS_U = 'mgd.sanctum.unlocks';
        const u = JSON.parse(localStorage.getItem(LS_U)||'{}'); u[c.key]=true; localStorage.setItem(LS_U, JSON.stringify(u));
      }catch(e){}
    }
    if (c.op==='decree'){
      const d = document.getElementById('birthright-decree');
      if (d) d.style.display='flex';
    }
  });
  // If any breath command exists, open ritual with no specific node
  if (cmds.some(c => c.op==='breath')){ openBreathRitual(null); }
}

export function bootstrapRitual(){
  const t = document.getElementById('ritual-text');
  const run = document.getElementById('ritual-run');
  const save = document.getElementById('ritual-save');
  const load = document.getElementById('ritual-load');
  run?.addEventListener('click', ()=> apply(parse(t.value||'')));
  save?.addEventListener('click', ()=> localStorage.setItem(LS.ritual, t.value||''));
  load?.addEventListener('click', ()=> t.value = localStorage.getItem(LS.ritual)||'');
}

document.addEventListener('DOMContentLoaded', bootstrapRitual);
