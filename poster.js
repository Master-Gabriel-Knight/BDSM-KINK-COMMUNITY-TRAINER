
function snapshot(){
  try{
    const s = {
      rituals: parseInt(localStorage.getItem('mgd.stats.rituals')||'0',10),
      nodes: Object.keys(JSON.parse(localStorage.getItem('mgd.node.progress')||'{}')).length,
      time: parseInt(localStorage.getItem('mgd.stats.time')||'0',10)
    };
    return s;
  }catch(e){ return {rituals:0,nodes:0,time:0}; }
}
export function bootstrapPoster(){
  const btn = document.getElementById('badge-poster');
  btn?.addEventListener('click', ()=>{
    const c = document.createElement('canvas'); c.width=1200; c.height=1600;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#0a0006'; ctx.fillRect(0,0,c.width,c.height);
    // title
    ctx.fillStyle = '#ffffff'; ctx.font = '48px serif'; ctx.textAlign='center';
    ctx.fillText('Bloom Ledger — Master Gabriel\'s Dungeon', c.width/2, 80);
    // omega spine
    ctx.font = '32px serif'; ctx.fillStyle = 'rgba(77,163,255,.75)';
    for (let t=0;t<24;t++){ const x = 80 + (c.width-160)*(t/23); const y = 200 + Math.sin(t/2)*40; ctx.fillText('Ω', x, y); }
    // stats
    const s = snapshot();
    ctx.fillStyle = '#ff99cc'; ctx.font='28px serif'; ctx.textAlign='left';
    ctx.fillText('Rituals: '+s.rituals, 120, 300);
    ctx.fillText('Nodes Completed: '+s.nodes, 120, 340);
    ctx.fillText('Practice Time: '+Math.floor(s.time/60000)+'m', 120, 380);
    // badges from DOM cards
    const grid = document.getElementById('badge-grid'); const items = grid ? Array.from(grid.children) : [];
    let y=460; ctx.textAlign='left'; ctx.font='24px serif'; ctx.fillStyle='#ffffff';
    items.forEach((div,i)=>{
      const name = div.querySelector('strong')?.textContent||('Badge '+(i+1));
      const unlocked = /Unlocked/.test(div.textContent);
      ctx.fillStyle = unlocked ? 'rgba(0,255,140,.9)' : 'rgba(255,255,255,.6)';
      ctx.fillRect(100, y-24, 12, 12);
      ctx.fillStyle = '#ffffff'; ctx.fillText(name + (unlocked?' — ✓':''), 120, y);
      y += 36;
    });
    const url = c.toDataURL('image/png');
    const a=document.createElement('a'); a.href=url; a.download='mgd_badge_poster.png'; a.click();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapPoster);
