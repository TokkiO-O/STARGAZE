import { F } from '../../assets/base.js';

// 诗歌信笺：以正文为视觉中心，肖像作为信中收藏；每个比例重新划分折页与题字。
function paper(p){p.plate('letter-fold',0,0,1,1,0,0);p.material('ivory-paper',.31,-.02,.67,1.06,2,1,.4,'折痕信纸','', 'bg','fill');}
function herb(p,rows){p.ornaments(rows,'flowers');}
function chip(p){
    paper(p);p.art('envelope',.174,.73,.92,-8,false,'bg',1.4);p.hero(.177,.516,.277,.83,'rect');p.photo(.87,.557,.189,.52,'polaroid',8,1.8,50,22,'right');
    p.type('Dear you,',.354,.047,.428,.198,{font:F.hand,front:true});p.type('some moments\nare too lovely...',.371,.407,.345,.086,{h:.43,font:F.hand,r:2,front:true});
    herb(p,[['botanical',.027,.537,.44,-11],['herb-paper',.273,.955,.39,-10],['stamp-green',.95,.13,.20,9],['open-book',.971,.932,.27,10]]);
    p.ornaments([['gold-clip',.135,.09,.19,-11],['paperclip',.944,.31,.18,17]],'hardware');p.stampMark(.67,.707,.107,.26,-12);p.foot('WITH LOVE / PRIVATE LETTER',.359,.947,.37,.027);
}
function compact(p){
    paper(p);p.art('envelope',.249,.78,.85,-9,false,'bg',1.2);p.hero(.276,.563,.383,.719,'rect');p.photo(.839,.812,.208,.26,'polaroid',8,1.85,50,22,'right');
    p.type('Dear you,',.045,.025,.89,.176,{font:F.hand,front:true});p.type('some moments\nare too lovely\nto leave behind.',.523,.268,.431,.066,{h:.46,font:F.hand,r:2,front:true});
    p.name(.528,.747,.248,.065,2);herb(p,[['botanical',.045,.586,.39,-10],['herb-paper',.194,.949,.35,-9],['stamp-green',.951,.14,.19,9],['study-white-daisy',.47,.941,.13,-7]]);
    p.ornaments([['gold-clip',.247,.224,.17,-11],['paperclip',.91,.697,.15,17]],'hardware');p.foot('FOREVER KEPT',.51,.945,.29,.021);
}
function circle(p){
    paper(p);p.rules(.517,.23,.43,.60,2,.5);p.hero(.29,.618,.401,.598,'rect');p.photo(.135,.226,.208,.257,'polaroid',-8,1.85,49,22,'left');
    p.type('Dear you,',.282,.046,.67,.136,{font:F.hand,r:2,front:true});p.type('some moments\nare too lovely\nto leave behind.',.538,.283,.407,.064,{h:.43,font:F.hand,r:2,front:true});
    p.name(.573,.78,.35,.082,2);herb(p,[['botanical',.05,.61,.4,-10],['envelope',.28,.916,.57,-8],['herb-paper',.082,.911,.26,-12],['stamp-red',.93,.179,.19,9],['study-white-daisy',.485,.936,.14,-7]]);
    p.ornaments([['gold-clip',.269,.338,.17,-11],['paperclip',.21,.105,.15,-14]],'hardware');p.stampMark(.679,.856,.24,.24,-12);p.foot('P.S. KEEP THIS MEMORY',.515,.953,.44,.021);
}
function polaroid(p){
    paper(p);p.art('envelope',.305,.66,.98,-8,false,'bg',1.2);p.hero(.338,.423,.492,.651,'rect');p.photo(.837,.256,.201,.266,'polaroid',9,1.85,50,22,'right');
    p.type('Dear\nyou,',.603,.39,.33,.117,{h:.32,font:F.hand,r:2,front:true});p.type('some moments are too lovely\nto leave behind.',.124,.773,.75,.066,{h:.17,font:F.hand,r:-2,front:true});
    herb(p,[['botanical',.049,.424,.46,-11],['herb-paper',.081,.917,.36,-11],['open-book',.95,.917,.33,9],['stamp-green',.922,.09,.21,9],['study-white-daisy',.416,.935,.13,-5]]);
    p.ornaments([['gold-clip',.268,.102,.18,-11],['paperclip',.914,.158,.16,17]],'hardware');p.stampMark(.389,.594,.17,.25,-12);p.foot('WITH LOVE / PRIVATE LETTER',.37,.958,.47,.023);
}
function collage(p){
    paper(p);p.rules(.04,.21,.556,.64,0,.5);p.hero(.798,.539,.278,.721,'rect');p.photo(.175,.817,.195,.265,'polaroid',-8,1.85,49,22,'left');
    p.type('Dear you,',.052,.086,.56,.141,{font:F.hand,front:true});p.type('some moments\nare too lovely\nto leave behind.',.072,.333,.519,.087,{h:.36,font:F.hand,front:true});p.name(.35,.772,.289,.085,-3);
    herb(p,[['envelope',.737,.863,.64,-8],['botanical',.958,.524,.39,10],['herb-paper',.065,.925,.31,-11],['open-book',.502,.944,.28,9],['stamp-green',.926,.12,.23,9],['study-white-daisy',.282,.936,.14,-7]]);
    p.ornaments([['gold-clip',.785,.185,.18,-11],['paperclip',.244,.711,.16,17]],'hardware');p.stampMark(.518,.062,.13,.22,-12);p.foot('P.S. A LITTLE MEMORY OF YOU',.29,.962,.36,.022);
}
function tower(p){
    p.paper('paper');p.surface('ruled',.08,.07,.84,.88,1,.45,.2,'纵向信笺横线');p.material('ivory-paper',.03,.02,.94,.96,1,.6,.4,'信纸折痕','', 'bg','fill');
    p.hero(.309,.30,.424,.328,'rect');p.photo(.793,.289,.24,.182,'polaroid',8,1.85,50,22,'right');
    p.type('Dear you,',.104,.491,.807,.151,{font:F.hand,r:1,front:true});p.type('some moments\nare too lovely\nto leave behind.',.137,.616,.75,.083,{h:.22,font:F.hand,r:1,front:true});p.name(.545,.858,.35,.098,2);
    herb(p,[['envelope',.337,.5,.58,-9],['botanical',.053,.515,.54,-9],['herb-paper',.113,.924,.43,-11],['open-book',.862,.962,.31,9],['stamp-green',.166,.085,.25,-8],['stamp-red',.903,.162,.18,9],['study-white-daisy',.423,.944,.14,-7]]);
    p.ornaments([['gold-clip',.281,.142,.19,-12],['paperclip',.879,.202,.16,17]],'hardware');p.stampMark(.565,.351,.31,.20,-12);p.foot('P.S. FOREVER KEPT / 01',.308,.98,.57,.021);
}
function scroll(p){
    paper(p);p.hero(.216,.51,.139,.812,'rect');p.photo(.849,.454,.117,.633,'polaroid',8,1.85,50,22,'right');
    p.type('Dear you,',.345,.083,.355,.183,{font:F.hand,r:1,front:true});p.type('some moments are too lovely\nto leave behind.',.351,.4,.399,.103,{h:.33,font:F.hand,r:1,front:true});p.name(.595,.783,.17,.086,1);
    herb(p,[['envelope',.222,.835,.67,-8],['botanical',.113,.514,.49,-11],['herb-paper',.336,.927,.39,-10],['open-book',.953,.928,.34,9],['stamp-green',.937,.127,.24,10],['study-white-daisy',.455,.941,.15,-7]]);
    p.ornaments([['gold-clip',.2,.134,.20,-11],['paperclip',.886,.224,.18,17]],'hardware');p.stampMark(.746,.707,.105,.29,-12);p.foot('PRIVATE LETTER / FOREVER KEPT',.37,.937,.354,.026);p.line(.348,.337,.34,false,.45);
}
function poster(p){
    paper(p);p.rules(.402,.21,.50,.63,2,.5);p.hero(.235,.499,.269,.756,'rect');p.photo(.854,.254,.153,.259,'polaroid',9,1.85,50,22,'right');p.photo(.651,.818,.151,.225,'polaroid',-6,1.13,43,67,'right');
    p.type('Dear you,',.409,.106,.417,.15,{font:F.hand,r:2,front:true});p.type('some moments\nare too lovely\nto leave behind.',.431,.336,.347,.093,{h:.34,font:F.hand,r:2,front:true});p.name(.745,.794,.18,.074,2);
    herb(p,[['envelope',.239,.838,.79,-8],['botanical',.067,.502,.57,-11],['herb-paper',.136,.936,.48,-10],['open-book',.943,.94,.32,9],['stamp-green',.054,.139,.25,-8],['stamp-red',.933,.108,.19,9],['study-white-daisy',.382,.945,.14,-7]]);
    p.ornaments([['gold-clip',.223,.13,.20,-12],['paperclip',.918,.167,.17,17]],'hardware');p.stampMark(.326,.732,.151,.257,-12);p.foot('P.S. KEEP THIS LITTLE MEMORY',.435,.947,.453,.025);p.note('PRIVATE LETTER / 01',.423,.051,.36,.023,2);
}
export const letter={chip,compact,circle,polaroid,collage,tower,scroll,poster};
