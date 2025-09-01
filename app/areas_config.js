export async function loadAreas(){
  let conf=null;
  try{
    const res = await fetch('data/memory.json', {cache:'no-store'});
    if (res.ok){ conf = await res.json(); }
  }catch(e){}
  const fallback = {
    areas: [
      { id:'welcome', title:'Welcome', tags:['intro'], locked:false, blurb:'Begin the path.' },
      { id:'guests', title:'Guests of Guests', tags:['guest','index'], locked:true, blurb:'A threshold reserved.' },
      { id:'hell_antechamber', title:'Hell Antechamber', tags:['ritual','ordeal'], locked:true, blurb:'Courage finds you here.' },
      { id:'wardrobe', title:'Wardrobe of Surrender', tags:['fashion','fetish'], locked:false, blurb:'Dress the myth.' },
      { id:'rites', title:'Rites of Service', tags:['ritual','service'], locked:true, blurb:'Devotion, sharpened.' },
      { id:'implements', title:'Implements', tags:['tools','discipline'], locked:true, blurb:'Tools with purpose.' },
      { id:'safewords', title:'Safewords & Signals', tags:['safety','protocol'], locked:false, blurb:'The language of care.' },
      { id:'museums', title:'Museums of Pain & Beauty', tags:['essay','ethics'], locked:false, blurb:'Study the line, then play.' },
      { id:'rabbit_hole', title:'Rabbit Hole', tags:['links','curation'], locked:false, blurb:'Curated stratagems.' },
      { id:'worship', title:'Worship Invitations', tags:['invitation','etiquette'], locked:false, blurb:'Offerings, clean and clear.' },
      { id:'scenes_sparks', title:'Scenes: Sparks', tags:['scenes','poetry'], locked:true, blurb:'Ignitions for play.' },
      { id:'aftercare_garden', title:'Aftercare Garden', tags:['aftercare','care'], locked:false, blurb:'Tend the glow.' },
      { id:'house_laws', title:'House Laws', tags:['law','protocol'], locked:false, blurb:'Boundaries as art.' },
      { id:'confessional', title:'Confessional', tags:['journal','private'], locked:true, blurb:'Speak into the hush.' },
      { id:'offerings', title:'Offerings Ledger', tags:['ledger','gifts'], locked:false, blurb:'Record the reciprocal.' },
      { id:'spiral_crown', title:'Lore of the Spiral Crown', tags:['lore','myth'], locked:false, blurb:'Remember what you are.' }
    ]
  };
  const out = conf?.areas?.length ? conf : fallback;
  out.areas = out.areas.map(a=> ({...a, unlocked: !!localStorage.getItem('areaUnlocked_'+a.id) || !a.locked }));
  return out;
}
