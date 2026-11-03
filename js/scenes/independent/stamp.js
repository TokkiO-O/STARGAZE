import { F } from '../../assets/base.js';

// 集邮册：格位、标签、邮票的规格随画幅重组，人物像是不同系列的收藏邮票。
function album(p){p.paper('soft');p.surface('news',.045,.03,.9,.93,0,.12,.15,'旧纸印刷肌理');p.surface('border',.022,.025,.956,.95,0,.75,.3,'收藏册压框');p.surface('ink',.016,.02,.025,.96,0,1,.5,'收藏册书脊');}
function portrait(p,x,y,w,h){p.hero(x,y,w,h,'rect');p.avatar.frameStyle='stamp';}
function label(p,value,x,y,w){p.note(value,x,y,w,.022);}
function chip(p){
    album(p);portrait(p,.309,.512,.286,.865);p.photo(.765,.554,.19,.601,'stamp',0,1.8,50,22,'right');
    p.type('BON VOYAGE',.483,.06,.48,.146,{front:true});p.line(.485,.355,.474,true);label(p,'02 / PORTRAIT',.677,.891,.20);
    p.ornaments([['stamp-green',.078,.495,.58,-3],['stamp-red',.95,.673,.38,2],['ticket',.537,.702,.43,-5],['seat',.407,.947,.34,4]],'details');p.stampMark(.421,.429,.104,.52,-12);p.foot('COLLECTION / VOL.01',.18,.96,.45,.026);
}
function compact(p){
    album(p);portrait(p,.311,.545,.492,.794);p.photo(.803,.42,.244,.29,'stamp',0,1.8,50,22,'right');
    p.type('BON VOYAGE',.074,.022,.875,.127,{front:true});label(p,'02 / FACE',.694,.61,.25);
    p.ornaments([['stamp-green',.802,.799,.32,0],['ticket',.531,.179,.28,-7],['serial',.079,.232,.28,-90],['seat',.443,.921,.27,7]],'details');p.stampMark(.456,.474,.24,.30,-12);p.foot('01 / FAVORITE',.113,.952,.40,.023);
}
function circle(p){
    album(p);portrait(p,.392,.489,.613,.65);p.photo(.803,.813,.293,.276,'stamp',0,1.14,44,67,'right');
    p.type('BON VOYAGE',.07,.037,.86,.13,{front:true});p.surface('border',.713,.177,.24,.294,0,.6,.9,'右上藏品格');
    p.ornaments([['stamp-red',.832,.328,.276,0],['stamp-green',.182,.875,.25,-5],['ticket',.63,.156,.26,-8],['transit-ticket',.058,.633,.25,-9],['seat',.551,.945,.27,4]],'details');p.stampMark(.552,.493,.23,.23,-12);label(p,'01 / FAVORITE',.13,.818,.39);label(p,'02 / BOTANICAL',.726,.49,.24);p.foot('PRIVATE COLLECTION',.102,.975,.51,.019);
}
function polaroid(p){
    album(p);portrait(p,.661,.527,.514,.80);p.photo(.207,.344,.231,.30,'stamp',0,1.8,50,22,'left');
    p.type('VOYAGE',.055,.023,.90,.18,{front:true});p.surface('border',.08,.547,.252,.324,0,.6,.8,'左下藏品格');
    p.ornaments([['stamp-green',.205,.711,.31,-2],['stamp-red',.954,.821,.22,5],['ticket',.392,.146,.28,-8],['serial',.072,.39,.30,-90],['seat',.401,.93,.29,6]],'details');p.stampMark(.315,.457,.21,.26,-12);label(p,'02 / PORTRAIT',.08,.51,.255);label(p,'03 / BOTANICAL',.08,.889,.27);p.foot('01 / FOREVER KEPT',.48,.962,.43,.021);
}
function collage(p){
    album(p);portrait(p,.296,.531,.358,.708);p.photo(.714,.321,.221,.291,'stamp',0,1.8,50,22,'right');p.photo(.803,.769,.224,.306,'stamp',0,1.13,44,67,'right');
    p.type('BON VOYAGE',.079,.035,.866,.15,{front:true});p.line(.51,.55,.445,true,.6);
    p.ornaments([['stamp-green',.507,.771,.29,-2],['stamp-red',.935,.297,.25,0],['ticket',.511,.175,.28,-8],['transit-ticket',.064,.743,.28,-9],['serial',.083,.233,.31,-90],['seat',.418,.931,.30,5]],'details');p.stampMark(.392,.376,.17,.26,-12);label(p,'02 / PORTRAIT',.609,.505,.237);label(p,'03 / BOTANICAL',.406,.936,.25);p.foot('01 / FAVORITE FACES',.124,.963,.29,.022);
}
function tower(p){
    album(p);p.type('BON\nVOYAGE',.087,.025,.84,.205,{h:.19,front:true});portrait(p,.492,.385,.712,.397);
    p.photo(.282,.789,.374,.244,'stamp',0,1.8,50,22,'left');p.surface('border',.586,.653,.325,.269,0,.7,.8,'右下植物收藏格');
    p.ornaments([['stamp-green',.755,.794,.38,0],['stamp-red',.901,.198,.24,8],['ticket',.268,.186,.35,-8],['transit-ticket',.073,.563,.27,-9],['serial',.079,.331,.34,-90],['seat',.505,.599,.36,4]],'details');p.stampMark(.66,.446,.27,.18,-12);label(p,'02 / PORTRAIT',.109,.938,.39);label(p,'03 / BOTANICAL',.591,.938,.34);p.foot('PRIVATE COLLECTION / VOL.01',.205,.98,.68,.021);
}
function scroll(p){
    album(p);p.type('BON\nVOYAGE',.048,.101,.16,.20,{h:.57,front:true});portrait(p,.33,.512,.171,.865);p.photo(.622,.52,.158,.647,'stamp',0,1.8,50,22,'right');
    p.surface('border',.763,.12,.173,.78,0,.6,.8,'长手幅植物收藏格');
    p.ornaments([['stamp-green',.848,.52,.72,0],['stamp-red',.958,.791,.30,5],['ticket',.485,.201,.45,-8],['transit-ticket',.06,.83,.31,-9],['serial',.09,.048,.31,0],['seat',.449,.926,.43,4]],'details');p.stampMark(.414,.541,.103,.38,-12);label(p,'02 / PORTRAIT',.559,.918,.17);label(p,'03 / BOTANICAL',.769,.925,.176);p.foot('01 / PERSONAL ARCHIVE',.247,.96,.18,.024);
}
function poster(p){
    album(p);p.type('BON VOYAGE',.076,.026,.87,.176,{front:true});portrait(p,.479,.533,.302,.77);
    p.photo(.171,.342,.185,.34,'stamp',0,1.8,50,22,'left');p.photo(.762,.308,.154,.254,'stamp',0,2.15,51,20,'right');p.photo(.805,.767,.223,.363,'stamp',0,1.13,44,67,'right');
    p.surface('border',.071,.584,.2,.303,0,.6,.8,'左下植物收藏格');p.surface('border',.866,.174,.104,.279,0,.6,.8,'右上红花收藏格');
    p.ornaments([['stamp-green',.167,.744,.31,0],['stamp-red',.921,.315,.26,0],['ticket',.402,.167,.33,-8],['transit-ticket',.053,.539,.25,-9],['serial',.073,.18,.31,-90],['seat',.608,.94,.31,4],['airmail-number',.67,.544,.24,-4]],'details');p.stampMark(.539,.344,.14,.255,-12);label(p,'02 / PORTRAIT',.085,.535,.22);label(p,'03 / BOTANICAL',.079,.912,.22);label(p,'04 / MEMORY',.716,.965,.23);p.foot('PRIVATE COLLECTION / VOL.01',.315,.978,.338,.02);
}
export const stamp={chip,compact,circle,polaroid,collage,tower,scroll,poster};
