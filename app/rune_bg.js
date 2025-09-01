(function(){
  const CANVAS_ID='rune-bg-canvas';
  const PALETTES = {
    sanctum: ['#9ad5ff','#ffffff','#88b4ff'],
    stage: ['#ffd080','#fffbcc','#ffc078'],
    guardian: ['#ff9aa2','#ffe3e3','#ffc0cb'],
    workshop: ['#c0ffb4','#e0ffd6','#b8f2e6'],
    vault: ['#cdb4ff','#e0d4ff','#b4a0ff'],
    'sigil-studio': ['#ffb4f0','#ffd0ff','#ffa6e0']
  };
  const RUNES = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛟ','ᛞ'];
  function ensureCanvas(){
    let c=document.getElementById(CANVAS_ID);
    if (!c){
      c=document.createElement('canvas'); c.id=CANVAS_ID;
      c.style.cssText='position:fixed;inset:0;z-index:-1;opacity:.18;';
      document.body.appendChild(c);
      const r=()=>{ c.width=innerWidth; c.height=innerHeight; }; r(); addEventListener('resize', r);
    }
    return c;
  }
  function draw(area){
    const c=ensureCanvas(), ctx=c.getContext('2d');
    ctx.clearRect(0,0,c.width,c.height);
    const pal = PALETTES[area] || PALETTES.sanctum;
    const glyphs = [];
    for(let i=0;i<40;i++){
      glyphs.push({ x: Math.random()*c.width, y: Math.random()*c.height, s: 18 + Math.random()*48, v: 0.2 + Math.random()*0.8, r: RUNES[Math.floor(Math.random()*RUNES.length)], col: pal[Math.floor(Math.random()*pal.length)] });
    }
    function tick(){
      ctx.clearRect(0,0,c.width,c.height);
      glyphs.forEach(g=>{
        g.y -= g.v; if (g.y < -20) g.y = c.height + 20;
        ctx.save();
        ctx.translate(g.x,g.y); ctx.rotate( (g.x+g.y)/5000 );
        ctx.fillStyle=g.col; ctx.font = `${g.s}px serif`; ctx.fillText(g.r, 0, 0);
        ctx.restore();
      });
      requestAnimationFrame(tick);
    }
    tick();
  }
  window.MGD_RUNES = { draw };
  window.addEventListener('mgd:area', (e)=> draw(String(e.detail||'sanctum')));
  document.addEventListener('DOMContentLoaded', ()=> draw('sanctum'));
})();
