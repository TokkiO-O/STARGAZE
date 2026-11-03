import { F } from '../../assets/base.js';

// 法式蕾丝：椭圆相册、装订缎带与法文题字；按尺寸重新组织页数与肖像比例。
function paper(p){p.paper('soft');p.surface('damask',0,0,1,1,0,.55,.1,'豆沙菱花纹');p.surface('paper',.025,.035,.95,.93,-1,1,.5,'奶油相册页');p.surface('border',.04,.055,.92,.89,-1,.65,.7,'烫印细线框');}
function lace(p,x,y,length=.85){const d=length*p.H,t=d/8.928571;p.material('study-lace-strip',(x*p.W-d/2)/p.W,(y*p.H-t/2)/p.H,d/p.W,t/p.H,90,1,5.4,'纵向蕾丝装订',true,'hardware','contain');}
function chip(p){
    paper(p);p.art('study-doily',.766,.5,.99,0,false,'main',2);p.hero(.763,.511,.315,.941,'circle');
    const a=p.photo(.19,.553,.224,.671,'circle',-5,1.8,49,23,'left');p.pearl(a,1.03);lace(p,.43,.5,.9);
    p.type('MON\nAMOUR',.35,.11,.28,.18,{h:.51});p.note('souvenirs de toi',.375,.716,.26,.047,-4);
    p.ornaments([['pink-bow',.06,.189,.3,-13],['rose',.943,.877,.29,13],['cream-bow',.431,.191,.28,0],['study-pearl-bow',.318,.871,.18,-9]],'flowers');
    p.ornaments([['study-pearl-wave',.221,.96,.70,0],['ornate-corner',.98,.07,.16,0]],'hardware');
}
function compact(p){
    paper(p);p.art('study-doily',.57,.532,.86,0,false,'main',2);p.hero(.57,.54,.582,.807,'circle');
    const a=p.photo(.135,.617,.20,.302,'circle',-7,1.9,50,22,'left');p.pearl(a,1.04);
    p.type('AMOUR',.04,.025,.91,.21,{z:3.2});p.name(.295,.819,.61,.075,-7);
    p.ornaments([['pink-bow',.09,.343,.27,-14],['rose',.94,.88,.30,13],['cream-bow',.884,.195,.27,13],['study-pearl-bow',.249,.839,.16,-11]],'flowers');
    p.ornaments([['study-pearl-wave',.519,.947,.91,0],['ornate-corner',.035,.952,.18,-90]],'hardware');p.foot('COLLECTION PRIVÉE / 01',.32,.963,.55,.02);
}
function circle(p){
    paper(p);p.art('study-doily',.51,.438,.91,0,false,'main',2);p.hero(.51,.454,.661,.733,'arch');
    const a=p.photo(.205,.818,.262,.262,'circle',-8,1.85,50,22,'left');p.pearl(a);
    p.type('MON AMOUR',.05,.013,.9,.145,{align:'center',z:3.1});p.name(.349,.819,.56,.098,-7);
    p.ornaments([['pink-bow',.858,.169,.28,16],['rose',.892,.872,.29,13],['cream-bow',.122,.309,.25,-13],['study-white-daisy',.431,.96,.13,-7]],'flowers');
    p.ornaments([['study-pearl-wave',.475,.216,.89,-3,3.3,false],['study-pearl-vertical',.953,.571,.45,0],['ornate-corner',.036,.044,.18,-90]],'hardware');p.foot('LES PETITS SOUVENIRS',.3,.962,.62,.02);
}
function polaroid(p){
    paper(p);lace(p,.679,.50,.87);p.art('study-doily',.355,.49,.96,0,false,'main',2);p.hero(.362,.507,.557,.779,'circle');
    const a=p.photo(.814,.341,.207,.301,'circle',7,1.85,50,22,'right');p.pearl(a,1.04);
    const b=p.photo(.811,.741,.207,.301,'circle',-6,1.15,44,66,'right');p.pearl(b,1.04);
    p.type('MON AMOUR',.036,.014,.93,.175,{z:3.1});p.name(.09,.822,.48,.083,-7);
    p.ornaments([['rose',.6,.90,.30,-12],['pink-bow',.054,.227,.27,-14],['cream-bow',.681,.176,.31,0],['study-pearl-bow',.928,.537,.17,10]],'flowers');
    p.ornaments([['study-pearl-wave',.39,.963,.91,0],['ornate-corner',.968,.055,.2,0]],'hardware');p.foot('COLLECTION PRIVÉE / 01',.1,.953,.50,.021);
}
function collage(p){
    paper(p);p.surface('soft',.36,.05,.38,.91,2,1,1,'中央椭圆的色纸衬底');p.art('study-doily',.54,.496,1.02,0,false,'main',2);p.hero(.544,.51,.401,.876,'circle');
    const a=p.photo(.148,.646,.224,.352,'circle',-8,1.7,49,23,'left');p.pearl(a,1.05);
    const b=p.photo(.883,.439,.16,.424,'circle',7,1.15,44,66,'right');p.pearl(b,1.02);
    p.type('MON\nAMOUR',.043,.041,.287,.146,{h:.33,z:3.1});p.name(.312,.82,.48,.09,-7);
    p.ornaments([['rose',.822,.899,.33,15],['pink-bow',.074,.426,.27,-13],['cream-bow',.953,.134,.30,11],['study-white-daisy',.07,.91,.15,-8],['study-pearl-bow',.263,.812,.17,-12]],'flowers');
    p.ornaments([['study-pearl-wave',.55,.20,.97,-3,3.3,false],['study-pearl-curve',.52,.956,.79,-4],['ornate-corner',.025,.059,.22,-90]],'hardware');p.foot('LES PETITS SOUVENIRS',.349,.964,.39,.02);p.number('08',.77,.59,.075);
}
function tower(p){
    paper(p);p.type('MON\nAMOUR',.04,.018,.91,.21,{h:.19,z:3.1});p.art('study-doily',.542,.471,1.16,0,false,'main',2);p.hero(.552,.473,.772,.591,'circle');
    const a=p.photo(.14,.271,.23,.158,'circle',-8,1.85,50,22,'left');p.pearl(a,1.04);
    p.photo(.25,.836,.326,.192,'polaroid',-8,1.15,44,67,'left');
    p.name(.35,.727,.59,.122,-8);p.type('a little love letter',.468,.876,.40,.049,{font:F.hand,r:4,front:true});
    p.ornaments([['pink-bow',.856,.203,.33,16],['rose',.816,.926,.38,12],['rose',.089,.779,.24,-13],['cream-bow',.434,.778,.28,-7],['study-pearl-bow',.14,.558,.22,-10]],'flowers');
    p.ornaments([['study-pearl-wave',.53,.236,.99,-2,3.2,false],['study-pearl-vertical',.946,.574,.57,0],['study-pearl-curve',.26,.941,.60,-6],['ornate-corner',.965,.054,.23,0]],'hardware');p.foot('COLLECTION PRIVÉE / 01',.38,.975,.55,.021);
}
function scroll(p){
    paper(p);p.type('MON\nAMOUR',.025,.104,.237,.24,{h:.58});
    p.hero(.507,.509,.201,.92,'circle');lace(p,.361,.5,.94);lace(p,.649,.5,.94);
    const a=p.photo(.283,.567,.119,.548,'circle',-5,1.7,49,24,'left');p.pearl(a,1.04);
    const b=p.photo(.751,.519,.14,.672,'circle',6,1.15,44,66,'right');p.pearl(b,1.03);
    p.type('souvenirs\nde toi',.836,.25,.14,.093,{font:F.hand,h:.32,r:4,front:true});
    p.ornaments([['rose',.92,.879,.38,11],['pink-bow',.174,.199,.29,-13],['cream-bow',.362,.172,.30,0],['cream-bow',.649,.175,.30,0],['study-pearl-bow',.692,.877,.21,-9]],'flowers');
    p.ornaments([['study-pearl-wave',.22,.96,.93,0],['study-pearl-wave',.775,.96,.93,0],['ornate-corner',.979,.065,.20,0]],'hardware');p.foot('LES PETITS SOUVENIRS / 01',.412,.955,.20,.023);
}
function poster(p){
    paper(p);p.surface('soft',.52,.035,.45,.93,1,1,1,'右侧相册衬页');lace(p,.513,.5,.95);
    p.art('study-doily',.747,.49,1.1,0,false,'main',2);p.hero(.748,.511,.369,.894,'circle');
    const a=p.photo(.211,.544,.231,.512,'circle',-6,1.65,49,24,'left');p.pearl(a,1.05);
    p.photo(.395,.828,.175,.274,'polaroid',7,1.13,43,66,'left');
    p.type('MON\nAMOUR',.045,.053,.441,.19,{h:.35,z:3.1});p.type('souvenirs de toi',.066,.847,.29,.065,{font:F.hand,r:-7,front:true});
    p.name(.568,.824,.35,.09,3);p.ornaments([['rose',.945,.912,.35,13],['rose',.539,.94,.26,-13],['pink-bow',.057,.408,.31,-13],['cream-bow',.512,.209,.40,0],['study-pearl-bow',.148,.82,.17,-10],['study-white-daisy',.04,.943,.15,-8]],'flowers');
    p.ornaments([['study-pearl-wave',.259,.97,.93,-2],['study-pearl-curve',.746,.965,.75,-3],['ornate-corner',.965,.059,.23,0]],'hardware');p.foot('COLLECTION PRIVÉE / 01',.663,.963,.25,.02);
}
export const french={chip,compact,circle,polaroid,collage,tower,scroll,poster};
