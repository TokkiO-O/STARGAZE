// 每个尺寸的补充实物均单独摆放；照片数量由构图决定，不用副图填满空隙。
export function refinePhotoPlan(style,key,original){
 const spec=structuredClone(original);
 const keep={
  school:{collage:[0,1],banner:[0,2],scroll:[0,2]},
  hk:{collage:[2,3],banner:[2,3],scroll:[0,2]},
  y2k:{collage:[0,1],banner:[0,1],scroll:[0,1]},
  french:{banner:[0,1]},mecha:{circle:[0,2],collage:[0,2],banner:[0,3]},
  fairy:{scroll:[1,2]},letter:{banner:[0,1],scroll:[0,1]},
  stamp:{compact:[0],banner:[0,2]},gothic:{banner:[0,2],scroll:[0,2]},
  sweetcool:{collage:[1,2],banner:[0,2],scroll:[0,1]},
 }[style]?.[key];
 if(keep)spec.s=keep.map(i=>spec.s[i]);
 if(style==='school'&&key==='banner')spec.s[1]=[.835,.55,.25,.61,'polaroid',6,1.06];
 if(style==='school'&&key==='scroll')spec.s[1]=[.835,.54,.19,.69,'polaroid',-5,1.06];
 // 枝条和固定件靠纸边，避开近景副图的五官区域。
 if(style==='gothic'&&['banner','collage'].includes(key))spec.o.find(o=>o[0]==='thorn')[2]=.73;
 if(style==='mecha'&&key==='compact'){const pin=spec.o.find(o=>o[0]==='rev-safety-pin');pin[1]=.73;pin[2]=.09;}
 // 主图的装裱跟随照片一起缩放，为真实纸件和配件保留层次空间。
 const mainArea=spec.h[2]*spec.h[3],mainLimit=key==='scroll'?.23:.43;
 if(mainArea>mainLimit){const scale=Math.sqrt(mainLimit/mainArea);spec.h[2]*=scale;spec.h[3]*=scale;}
 const budget=key==='scroll'?.40:['banner','collage'].includes(key)?.46:.51;
 const secondaryArea=spec.s.reduce((sum,s)=>sum+s[2]*s[3],0);
 const available=Math.max(.09,budget-spec.h[2]*spec.h[3]);
 const scale=Math.max(.76,Math.min(1,Math.sqrt(available/secondaryArea)));
 for(const photo of spec.s){photo[2]*=scale;photo[3]*=scale;}
 return spec;
}

// 补充的是具有主题含义的实物。最后一项为“衬底”时压在照片下，保持前后层次。
const DETAILS={
 school:{
  chip:[['notebook',.37,.54,.44,-8,'衬底'],['memos',.89,.91,.27,6]],
  compact:[['notebook',.22,.57,.32,-9,'衬底'],['tape-pink',.61,.08,.18,-5]],
  circle:[['memos',.76,.56,.30,8,'衬底'],['clip-blue',.20,.24,.10,-9]],
  polaroid:[['notebook',.61,.65,.33,7,'衬底'],['tape-pink',.84,.44,.18,8]],
  collage:[['notebook',.90,.55,.42,8,'衬底'],['memos',.29,.55,.30,-9,'衬底'],['clip-blue',.57,.065,.13,-10]],
  tower:[['notebook',.56,.65,.38,6,'衬底'],['memos',.22,.61,.28,-8,'衬底'],['pin-pearl',.77,.67,.07,12]],
  banner:[['notebook',.12,.73,.45,-8,'衬底'],['memos',.69,.54,.36,7,'衬底'],['clip-blue',.84,.26,.12,8],['tape-pink',.28,.60,.19,-7]],
  scroll:[['notebook',.59,.40,.61,8,'衬底'],['memos',.70,.62,.44,-8,'衬底'],['clip-blue',.59,.15,.17,-9],['tape-pink',.90,.20,.23,8]],
 },
 hk:{
  chip:[['cinema',.57,.64,.36,-8,'衬底'],['paper-corner',.45,.94,.16,0]],
  compact:[['proof-receipt',.70,.63,.34,7,'衬底'],['cinema',.61,.86,.23,-8]],
  circle:[['newspaper-portrait',.58,.58,.31,7,'衬底'],['cinema',.37,.66,.23,-7]],
  polaroid:[['proof-receipt',.31,.55,.35,-9,'衬底'],['cinema',.50,.75,.26,8]],
  collage:[['newspaper-portrait',.13,.40,.44,-7,'衬底'],['proof-receipt',.64,.54,.35,8,'衬底'],['paper-corner',.58,.90,.13,0]],
  tower:[['newspaper-portrait',.53,.65,.38,7,'衬底'],['proof-receipt',.20,.68,.31,-8,'衬底'],['cinema',.67,.64,.25,8]],
  banner:[['newspaper-portrait',.08,.47,.53,-7,'衬底'],['cinema',.62,.66,.38,6,'衬底'],['proof-gramophone',.12,.67,.24,-7]],
  scroll:[['newspaper-portrait',.29,.58,.62,-8,'衬底'],['cinema',.77,.43,.46,7,'衬底'],['proof-gramophone',.36,.68,.32,-8],['paper-corner',.69,.92,.16,0]],
 },
 y2k:{
  chip:[['earphones',.98,.46,.34,9],['holo-heart',.37,.15,.20,-8]],
  compact:[['earphones',.95,.56,.27,9],['blue-player',.04,.48,.22,-8]],
  circle:[['earphones',.96,.73,.27,9],['blue-player',.50,.14,.21,-8]],
  polaroid:[['blue-player',.60,.36,.23,-8],['star-jelly',.07,.43,.14,-9]],
  collage:[['blue-player',.09,.35,.30,-8],['jelly-heart',.67,.60,.19,9],['clear-clip',.80,.08,.15,8]],
  tower:[['blue-player',.20,.70,.26,-8],['jelly-heart',.55,.74,.17,9],['clear-clip',.27,.70,.13,-6]],
  banner:[['blue-player',.86,.70,.34,8],['jelly-heart',.42,.66,.23,-8],['clear-clip',.18,.17,.16,-6]],
  scroll:[['blue-player',.85,.73,.46,-8],['jelly-heart',.67,.77,.28,9],['clear-clip',.10,.20,.19,-7],['star-jelly',.71,.47,.18,8]],
 },
 french:{
  chip:[['ivory-envelope',.35,.61,.45,-8,'衬底'],['proof-perfume',.53,.72,.29,7]],
  compact:[['ivory-envelope',.29,.54,.35,-8,'衬底'],['proof-perfume',.40,.78,.24,7]],
  circle:[['ivory-envelope',.76,.61,.35,8,'衬底'],['proof-perfume',.88,.55,.21,-7]],
  polaroid:[['ivory-envelope',.58,.62,.39,8,'衬底'],['proof-perfume',.65,.47,.23,-8]],
  collage:[['ivory-envelope',.39,.56,.43,-8,'衬底'],['proof-perfume',.44,.68,.27,8],['pin-pearl',.79,.13,.075,9]],
  tower:[['ivory-envelope',.54,.65,.42,7,'衬底'],['proof-perfume',.57,.70,.25,-8],['pin-pearl',.24,.72,.07,-8]],
  banner:[['mail-sealed',.90,.67,.53,7,'衬底'],['proof-perfume',.36,.67,.32,-8],['pressed-daisy',.83,.46,.28,8],['pin-pearl',.26,.60,.08,-8]],
 },
 mecha:{
  chip:[['gear',.69,.59,.27,8],['pipe-cross',.04,.73,.25,-9]],
  compact:[['gear',.71,.52,.23,-8],['rev-silver-keys',.60,.85,.24,8]],
  circle:[['pipe-cross',.72,.51,.25,9],['gear',.51,.81,.21,-8]],
  polaroid:[['pipe-cross',.39,.51,.27,9],['gear',.29,.80,.21,-8]],
  collage:[['pipe-cross',.20,.59,.26,9],['gear',.28,.67,.24,-8],['rev-silver-keys',.67,.74,.29,8]],
  tower:[['pipe-cross',.57,.67,.29,9],['gear',.42,.87,.24,-8],['rev-silver-keys',.22,.64,.28,-8]],
  banner:[['pipe-cross',.15,.72,.34,9],['gear',.74,.48,.27,-8],['rev-silver-keys',.63,.84,.31,8],['rev-rivet-heart',.055,.59,.26,-9]],
 },
 fairy:{
  chip:[['story-teapot',.43,.66,.23,-8],['flower-crayon',.06,.27,.17,-9]],
  compact:[['story-teapot',.56,.77,.18,8],['flower-crayon',.06,.40,.13,-8]],
  circle:[['story-teapot',.41,.55,.21,8],['flower-crayon',.40,.25,.13,-9]],
  polaroid:[['story-teapot',.60,.59,.22,-8],['flower-crayon',.59,.10,.13,-9]],
  collage:[['story-teapot',.14,.39,.25,-8],['flower-crayon',.79,.50,.15,8],['heart-crayon',.33,.60,.12,-7]],
  banner:[['story-teapot',.42,.60,.28,-8],['flower-crayon',.08,.28,.16,-9],['pencils',.50,.94,.37,-17],['heart-crayon',.89,.22,.12,8]],
  scroll:[['story-teapot',.10,.57,.34,-8],['flower-crayon',.49,.43,.21,8],['pencils',.17,.88,.43,-19],['crown-crayon',.69,.53,.15,-8]],
 },
 letter:{
  chip:[['mail-sealed',.53,.49,.46,-8,'衬底'],['pressed-rose',.09,.18,.24,-9]],
  compact:[['letter-papers',.22,.67,.37,-8,'衬底'],['pressed-rose',.14,.83,.20,-9]],
  circle:[['mail-sealed',.62,.44,.36,8,'衬底'],['pressed-rose',.20,.82,.21,-8]],
  polaroid:[['letter-papers',.35,.53,.42,-8,'衬底'],['pressed-rose',.52,.73,.22,8]],
  collage:[['mail-sealed',.56,.46,.47,-8,'衬底'],['letter-papers',.19,.86,.36,7,'衬底'],['pressed-rose',.48,.62,.24,-9]],
  tower:[['mail-sealed',.35,.64,.43,-8,'衬底'],['letter-papers',.71,.81,.38,8,'衬底'],['pressed-rose',.18,.76,.23,-9]],
  banner:[['mail-sealed',.07,.71,.55,-8,'衬底'],['letter-papers',.58,.51,.46,8,'衬底'],['pressed-rose',.51,.64,.28,-9],['pin-pearl',.78,.19,.08,8]],
  scroll:[['mail-sealed',.88,.44,.65,8,'衬底'],['letter-papers',.57,.38,.54,-8,'衬底'],['pressed-rose',.24,.57,.36,-9],['pin-pearl',.73,.13,.10,8]],
 },
 stamp:{
  chip:[['cat-postage',.94,.34,.28,8],['rev-mail-bundle',.12,.80,.42,-8,'衬底']],
  compact:[['cat-postage',.80,.78,.27,8],['rev-mail-bundle',.46,.81,.35,-8,'衬底']],
  circle:[['cat-postage',.50,.48,.24,-8],['rev-mail-bundle',.12,.40,.37,-9,'衬底']],
  polaroid:[['cat-postage',.66,.35,.25,-8],['rev-mail-bundle',.24,.78,.40,-8,'衬底']],
  collage:[['cat-postage',.65,.43,.28,8],['rev-mail-bundle',.14,.42,.45,-8,'衬底'],['postage-paper',.68,.67,.33,7,'衬底']],
  tower:[['cat-postage',.58,.67,.27,8],['rev-mail-bundle',.29,.61,.43,-8,'衬底'],['postage-paper',.89,.55,.30,8,'衬底']],
  banner:[['cat-postage',.56,.74,.32,-8],['rev-mail-bundle',.09,.56,.53,-8,'衬底'],['postage-paper',.66,.52,.44,7,'衬底']],
 },
 gothic:{
  chip:[['rev-rose-key',.68,.46,.25,12],['lace-black',.15,.40,.63,0,'衬底']],
  compact:[['rev-locked-heart',.81,.58,.21,8],['lace-black',.12,.74,.34,0,'衬底']],
  circle:[['rev-rose-key',.68,.61,.22,12],['lace-black',.82,.25,.38,0,'衬底']],
  polaroid:[['rev-locked-heart',.82,.36,.22,8],['lace-black',.11,.32,.41,0,'衬底']],
  collage:[['rev-rose-key',.73,.55,.25,12],['lace-black',.15,.46,.65,0,'衬底'],['rev-locked-heart',.30,.66,.20,8]],
  tower:[['rev-rose-key',.49,.70,.26,12],['lace-black',.25,.81,.42,0,'衬底'],['rev-locked-heart',.73,.64,.21,8]],
  banner:[['rev-rose-key',.75,.39,.29,12],['lace-black',.13,.40,.64,0,'衬底'],['rev-locked-heart',.30,.66,.24,8]],
  scroll:[['rev-rose-key',.70,.45,.36,12],['lace-black',.83,.76,.68,0,'衬底'],['rev-locked-heart',.56,.80,.30,8],['chain-black',.40,.10,.41,-7]],
 },
 sweetcool:{
  chip:[['card-sleeve',.68,.55,.33,8,'衬底'],['tape-pink',.45,.035,.21,-8]],
  compact:[['card-sleeve',.70,.45,.28,8,'衬底'],['memos',.19,.75,.27,-8,'衬底']],
  circle:[['card-sleeve',.79,.56,.29,8,'衬底'],['memos',.15,.69,.29,-8,'衬底']],
  polaroid:[['card-sleeve',.37,.55,.32,-8,'衬底'],['tape-pink',.19,.37,.18,-8]],
  collage:[['card-sleeve',.12,.46,.39,-8,'衬底'],['memos',.70,.56,.32,8,'衬底'],['tape-pink',.46,.05,.20,-8]],
  tower:[['card-sleeve',.75,.64,.38,8,'衬底'],['memos',.28,.82,.32,-8,'衬底'],['tape-pink',.51,.065,.20,-8]],
  banner:[['card-sleeve',.29,.62,.43,-8,'衬底'],['memos',.68,.48,.36,8,'衬底'],['pin-pearl',.17,.24,.08,-8],['tape-pink',.49,.04,.22,8]],
  scroll:[['card-sleeve',.46,.39,.59,-8,'衬底'],['memos',.60,.59,.45,8,'衬底'],['pin-pearl',.29,.48,.10,8],['tape-pink',.74,.05,.29,-8]],
 },
};

export function addThemeDetails(p,key){
 for(const [slug,x,y,size,r=0,back] of DETAILS[p.p.id]?.[key]||[]){
  const material=p.asset(slug);
  // 同一张原图有不同别名时仍只放一次，防止同物重复堆叠。
  if(!material)throw new Error('缺少已筛选素材：'+slug);
  if(p.used.has(material.sourceId))continue;
  const group=/clip|tape|pin/.test(slug)?'hardware':/paper|mail|memo|notebook|postage/.test(slug)?'details':'flowers';
  p.art(slug,x,y,size,r,back?2.5:7.15,!back,group);
 }
}
