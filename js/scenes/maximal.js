import { CollagePage } from './collage-kit.js';
import { MAXIMAL_PROFILES } from './maximal-profiles.js';
import { buildMaximalSchool } from './maximal-school.js';

// 九种比例各有自己的阅读顺序、照片关系和字组；不从一张母版等比挪动。
function chip(p){
    p.base();
    p.surface('ink',.73,.08,.24,.82,p.p.tilt,.95,1.6,'右侧相片底纸');
    p.hero(p.p.heroSide,.51,.30,.96);
    p.photo(.14,.51,.23,.69,p.p.small,-7,1.45,46,32,'left',false);
    p.photo(.844,.47,.175,.64,'rect',p.p.tilt,1.85,53,22);
    p.surface('ring',.025,.12,.23,.76,-7,.8,5.2,'左侧细线装饰圈',true,'left');
    p.type(p.p.short,.25,.12,.23,.16,{front:true,r:-4});
    p.type('CLUB / 01',.265,.39,.19,.058,{front:true,font:p.p.hand,r:-4});
    p.tag(p.p.issue,.69,.76,.29,.12,{r:3,size:.052});
    p.mono(p.p.footer,.018,.93,.55,.025,{front:true});
    p.motif(0,.35,.83,.39,-14);p.motif(1,.04,.16,.36,-14);
    p.motif(2,.715,.94,.42,-11);p.motif(4,.71,.16,.22,17);
    p.motif(5,.015,.81,.33,-12);p.hardware(1,.39,.08,.26,-12,true,'hardware',7);
    p.hardware(2,.93,.14,.24,17,true,'hardware',7);
    p.hardware(0,.22,.13,.9,-3,false,'hardware',3.2);
    p.number('01',.285,.66,.17);p.mono('+',.97,.45,.03,.08,{front:true,color:'accent'});
    p.surface('barcode',.9,.92,.075,.045,0,.75,8,'小型收藏条码',true,'details');
}
function compact(p){
    p.base();
    p.material('paper-note',.3,.07,.73,.94,4,1,1.4,'折叠相纸');
    p.hero(.63,.5,.60,.86);
    p.surface('accent',.035,.42,.36,.48,-8,1,2,'左下小相片衬纸');
    p.photo(.22,.64,.29,.40,p.p.small,-8,1.8,45,23);
    p.type(p.p.short,.035,.025,.77,.18,{z:3});
    p.tag(p.p.issue,.38,.79,.59,.085,{r:3,size:.038});
    p.type('love this\nmoment',.035,.27,.28,.065,{h:.2,font:p.p.hand,r:-7,front:true});
    p.mono('PRIVATE / 01',.37,.92,.4,.026,{front:true});
    p.motif(0,.37,.87,.38,-12);p.motif(1,.86,.13,.3,14);
    p.motif(2,.1,.91,.31,-8);p.motif(4,.15,.33,.2,-16);
    p.hardware(1,.39,.14,.24,-10,true,'hardware',7);
    p.hardware(2,.89,.67,.23,11,true,'hardware',7);
    p.hardware(0,.45,.23,.75,0,false,'hardware',3.4);
    p.number('04',.105,.13,.13);
    p.material('paper-strip',.07,.79,.23,.07,-8,1,7.5,'副图撕纸标签',true,'details','fill');
    p.mono('KEEP',.08,.8,.2,.027,{r:-8,front:true});
    p.line(.42,.965,.46,true,.6);p.mono('✦',.05,.5,.08,.06,{color:'accent',front:true});
}
function circle(p){
    p.base();
    p.surface('ring',.035,.035,.93,.93,0,.7,1,'圆形收藏页轮廓');
    p.surface('paper',.225,.15,.67,.7,-4,1,1.5,'中间方形相纸底');
    p.hero(.56,.48,.65,.65,p.p.id==='mecha'?'hexagon':p.p.id==='gothic'?'arch':'circle');
    p.photo(.145,.43,.26,.3,p.p.small,-10,1.8,45,22);
    p.photo(.78,.805,.30,.25,'polaroid',9,1.2,56,65);
    p.type(p.p.title,.04,.005,.92,.14,{r:-3,z:3.1});
    p.type('{{name|Dear you}}',.15,.69,.61,.09,{font:p.p.hand,r:-9,front:true});
    p.tag(p.p.issue,.13,.91,.72,.05,{size:.029,r:0});
    p.mono('COLLECTION\nNO. 01',.73,.15,.21,.025,{h:.08,front:true});
    p.hardware(0,.48,.24,.92,-7,false,'hardware',3.7);
    p.hardware(1,.4,.17,.2,-10,true,'hardware',7);
    p.hardware(2,.86,.73,.18,17,true,'hardware',7);
    p.motif(0,.29,.83,.33,-14);p.motif(1,.89,.28,.31,15);
    p.motif(2,.11,.79,.31,-12);p.motif(4,.16,.21,.24,-16);
    p.motif(5,.86,.63,.23,17);p.motif(3,.52,.96,.28,-5);
    p.number('01',.08,.13,.11);p.number('08',.91,.9,.08);
    p.line(.34,.983,.29,true);p.mono('✦',.05,.62,.1,.06,{front:true,color:'accent'});
}
function polaroid(p){
    p.base();
    p.material('paper-note',.14,.13,.69,.86,-7,1,1.3,'左倾主相纸');
    p.surface('ink',.18,.17,.56,.69,-3,.95,2,'主相纸内衬');
    p.hero(.46,.49,.48,.61);
    p.surface('accent',.68,.1,.29,.41,8,1,1.7,'上角副图纸片');
    p.photo(.825,.305,.245,.32,p.p.small,8,1.85,51,22);
    p.photo(.815,.72,.285,.37,'polaroid',9,1.15,43,65);
    p.type(p.p.title,.025,.01,.94,.16,{r:0,z:3.1});
    p.type(p.p.note,.06,.78,.63,.085,{font:p.p.hand,r:-8,front:true});
    p.tag(p.p.issue,.14,.907,.56,.048,{r:-2,size:.03});
    p.mono('01 / STARGAZE',.73,.94,.25,.021,{front:true});
    p.hardware(0,.47,.17,.9,-5,false,'hardware',3.5);
    p.hardware(1,.27,.19,.22,-13,true,'hardware',7);
    p.hardware(2,.91,.57,.19,17,true,'hardware',7);
    p.motif(0,.24,.77,.31,-17);p.motif(1,.96,.07,.23,16);
    p.motif(2,.075,.89,.37,-10);p.motif(3,.68,.95,.3,12);
    p.motif(4,.071,.32,.24,-16);p.motif(5,.94,.84,.24,11);
    p.number('04',.735,.53,.11);p.line(.04,.985,.92,true,.5);
    p.material('paper-strip',.02,.635,.26,.05,-7,1,7.2,'相纸边缘标签',true,'details','fill');
    p.mono('MY FAVORITE',.03,.64,.24,.024,{r:-7,front:true});
}
function collage(p){
    p.base();
    p.material('paper-note',.34,-.04,.45,1.08,3,1,1.5,'中部叠层相纸');
    p.surface('ink',.73,.13,.22,.71,7,1,1.7,'右侧相片条底');
    p.hero(p.p.heroSide,.52,.375,.9);
    p.photo(.16,.43,.255,.43,p.p.small,-8,1.35,46,34,'left',false);
    p.photo(.827,.325,.168,.26,'rect',7,1.8,54,21);
    p.photo(.802,.62,.168,.26,'rect',7,1.13,43,67);
    p.photo(.295,.815,.16,.25,'polaroid',-11,2.25,52,19);
    p.type(p.p.short,.025,.02,.43,.21,{z:3.1});
    p.type('CLUB',.76,.015,.235,.14,{front:true,r:2});
    p.type(p.p.note,.04,.66,.34,.065,{font:p.p.hand,r:-7,front:true});
    p.tag(p.p.issue,.36,.865,.35,.07,{size:.036,r:-2});
    p.mono(p.p.footer,.37,.96,.39,.019,{front:true});
    p.hardware(0,.31,.19,.9,-5,false,'hardware',3.3);
    p.hardware(1,.39,.085,.2,-14,true,'hardware',7);
    p.hardware(2,.9,.23,.2,16,true,'hardware',7);
    p.motif(0,.69,.86,.34,-12);p.motif(1,.065,.21,.31,-12);
    p.motif(2,.11,.92,.31,-13);p.motif(3,.9,.88,.35,9);
    p.motif(4,.89,.16,.2,16);p.motif(5,.02,.69,.29,-12);
    p.number('01',.32,.27,.1);p.number('08',.74,.735,.085);
    p.material('paper-strip',.04,.77,.2,.05,-7,1,7.5,'左相片撕纸标签',true,'details','fill');
    p.mono('KEEP / 01',.05,.78,.18,.026,{r:-7,front:true});
    p.surface('barcode',.91,.47,.063,.105,0,.7,7.5,'右缘编号条码',true,'details');
    p.line(.03,.988,.94,true,.5);
}
function tower(p){
    p.base();
    p.material('paper-note',.075,.12,.94,.64,-3,1,1.3,'主照片叠层衬纸');
    p.surface('holes',.007,.1,.045,.8,0,1,1.5,'活页装订孔');
    p.hero(p.p.heroSide,.43,.82,.61);
    p.photo(.15,.35,.29,.2,p.p.small,-9,1.85,48,22);
    p.photo(.23,.79,.36,.23,'polaroid',-10,1.18,41,66);
    p.photo(.77,.80,.33,.23,'polaroid',8,1.65,52,23);
    p.type(p.p.title,.035,.012,.93,.205,{z:3.2});
    p.tag(p.p.issue,.2,.112,.72,.04,{r:-3,size:.029});
    p.type('{{name|Dear you}}',.33,.604,.61,.14,{font:p.p.hand,r:-8,front:true,stroke:.3});
    p.type('a story\nworth keeping.',.42,.854,.28,.044,{h:.064,front:true,font:p.p.hand,r:3});
    p.mono('JOURNAL / 01',.43,.966,.25,.021,{front:true,align:'center'});
    p.hardware(0,.51,.21,.96,0,false,'hardware',3.8);
    p.hardware(1,.22,.13,.24,-10,true,'hardware',7);
    p.hardware(2,.91,.68,.2,17,true,'hardware',7);
    p.motif(0,.48,.725,.32,-16);p.motif(1,.88,.194,.36,17);
    p.motif(2,.22,.93,.39,-13);p.motif(3,.87,.93,.36,9);
    p.motif(4,.14,.56,.23,-17);p.motif(5,.075,.86,.25,-13);
    p.number('01',.85,.065,.11);p.number('08',.36,.585,.09);
    p.tag('NOTES FROM YOU',.46,.544,.33,.037,{fill:'paper',color:'ink',size:.027,r:4});
    p.material('paper-strip',.025,.665,.30,.041,-9,1,7.4,'副照片标签底纸',true,'details','fill');
    p.mono('CAPTURE / 04:08',.035,.676,.27,.027,{r:-9,front:true});
    p.mono('PRIVATE\nCOLLECTION',.76,.51,.18,.024,{h:.048,r:90,front:true,color:'paper'});
    p.surface('barcode',.07,.975,.22,.012,0,.65,8,'封底收藏条码',true,'details');
    p.line(.43,.99,.4,true,.6);
}
function banner(p){
    p.base();
    p.material('paper-note',.33,.015,.43,.99,3,1,1.3,'主照片叠层衬纸');
    p.surface('ink',.74,.24,.2,.68,8,.95,1.7,'右侧三连相片衬纸');
    p.surface('paper',.752,.25,.176,.65,8,1,1.8,'相片条白纸内衬');
    p.hero(p.p.heroSide,.533,.365,.885);
    p.photo(.165,.475,.213,.43,p.p.small,-7,1.25,48,35,'left',false);
    p.photo(.82,.386,.148,.205,'rect',8,1.85,53,18);
    p.photo(.806,.592,.148,.205,'rect',8,1.18,45,66);
    p.photo(.793,.795,.148,.205,'rect',8,1.55,52,24);
    p.photo(.3,.82,.134,.25,'polaroid',-12,2.4,52,18);
    p.type(p.p.short,.028,.018,.36,.24,{z:3.1});
    p.type('ARCHIVE',.745,.04,.24,.155,{front:true,r:3});
    p.type(p.p.note,.06,.68,.33,.071,{font:p.p.hand,r:-7,front:true});
    p.tag(p.p.issue,.35,.85,.32,.075,{r:-3,size:.04});
    p.mono(p.p.footer,.38,.943,.35,.021,{front:true});
    p.mono('PHOTO\nBOOTH',.922,.48,.07,.031,{h:.14,r:5,front:true});
    p.hardware(0,.3,.215,.91,-3,false,'hardware',3.3);
    p.hardware(1,.37,.08,.2,-16,true,'hardware',7);
    p.hardware(2,.88,.275,.18,18,true,'hardware',7);
    p.motif(0,.68,.9,.3,10);p.motif(1,.066,.285,.31,-13);
    p.motif(2,.11,.91,.3,-12);p.motif(3,.92,.87,.38,8);
    p.motif(4,.89,.2,.22,22);p.motif(5,.026,.69,.32,-14);
    p.motif(0,.065,.72,.18,-14);p.motif(4,.24,.185,.2,-14);
    p.number('01',.35,.275,.09);p.number('02',.735,.68,.075);
    p.tag('KEEP THIS MOMENT',.41,.05,.25,.05,{fill:'paper',color:'ink',size:.03,r:2});
    p.material('paper-strip',.055,.803,.17,.045,-7,1,7.5,'照片上的撕纸条',true,'details','fill');
    p.mono('04 / 08',.062,.808,.15,.029,{r:-7,front:true});
    p.line(.025,.98,.95,true,.5);
}
function scroll(p){
    // 长手幅采用横向展卷：左侧标题/独立照片，中间主像，右侧双格故事。
    p.surface('soft',0,0,1,1,0,1,0,'横向底纸');p.surface(p.p.paper,0,0,1,1,0,.6,.1,'横向底纹');
    p.material(p.p.backing,-.03,.05,.32,.92,-4,1,.4,'左侧纸张拼片');
    p.surface('torn',.13,.04,.77,.92,-1,1,.7,'横向撕纸');
    p.surface(p.p.paper,.15,.07,.73,.86,-1,.4,.8,'叠印纹理');
    p.material('paper-note',.34,-.06,.28,1.12,3,1,1.3,'中部主像叠纸');
    p.hero(.484,.51,.23,.97);
    p.photo(.27,.5,.145,.74,p.p.small,-7,1.3,47,36,'left',false);
    p.photo(.69,.45,.125,.65,'polaroid',7,1.85,53,22);
    p.photo(.849,.54,.125,.65,'polaroid',-6,1.13,43,66);
    p.type(p.p.short,.017,.085,.18,.25,{r:-2,front:true});
    p.type('THE\nCOLLECTION',.023,.42,.17,.085,{h:.31,font:p.p.hand,r:-5,front:true});
    p.tag(p.p.issue,.59,.80,.24,.08,{r:-1,size:.041});
    p.mono(p.p.footer,.6,.925,.32,.026,{front:true});
    p.mono('01 / 09',.915,.3,.07,.038,{front:true});
    p.hardware(0,.36,.15,1.2,-2,false,'hardware',3.3);
    p.hardware(1,.39,.1,.23,-11,true,'hardware',7);
    p.hardware(2,.73,.16,.22,17,true,'hardware',7);
    p.motif(0,.59,.87,.34,-12);p.motif(1,.188,.16,.36,-13);
    p.motif(2,.18,.9,.37,-11);p.motif(3,.94,.82,.42,10);
    p.motif(4,.79,.17,.24,16);p.motif(5,.015,.87,.36,-13);
    p.number('01',.35,.72,.15);p.number('08',.91,.61,.13);
    p.material('paper-strip',.22,.81,.12,.06,-7,1,7.5,'左相片标签',true,'details','fill');
    p.mono('MEMORIES',.225,.82,.11,.027,{front:true,r:-7});
    p.line(.02,.98,.96,true,.6);p.surface('barcode',.91,.08,.065,.08,0,.7,8,'横幅收藏条码',true,'details');
}
function poster(p){
    // 宽海报用跨页杂志关系：侧栏相册、主像、错落的右侧故事，不拉长横幅。
    p.base();
    p.surface('accent',.04,.15,.22,.70,-5,.8,1.2,'左侧杂志栏');
    p.material('paper-note',.295,.015,.43,1.03,3,1,1.4,'主照片叠层纸');
    p.surface('ink',.73,.13,.25,.74,5,.95,1.5,'右侧收藏栏');
    p.hero(p.p.heroSide,.53,.36,.88);
    p.photo(.155,.36,.17,.34,p.p.small,-6,1.35,46,34,'left',false);
    p.photo(.17,.755,.16,.28,'polaroid',6,2.2,52,19);
    p.photo(.826,.318,.18,.30,'polaroid',6,1.85,53,21);
    p.photo(.866,.687,.18,.30,'polaroid',-5,1.15,43,66);
    p.type(p.p.title,.025,.015,.95,.22,{z:3});
    p.type(p.p.note,.018,.53,.29,.065,{font:p.p.hand,r:-7,front:true});
    p.type('{{name|Dear you}}',.3,.772,.4,.13,{font:p.p.hand,r:-8,front:true});
    p.tag(p.p.issue,.365,.91,.3,.055,{r:-2,size:.032});
    p.mono(p.p.footer,.36,.978,.37,.02,{front:true});
    p.mono('VOL. 01\nPRIVATE ARCHIVE',.75,.51,.21,.028,{h:.07,front:true,color:'paper'});
    p.hardware(0,.34,.19,1.02,-3,false,'hardware',3.6);
    p.hardware(1,.4,.11,.2,-12,true,'hardware',7);
    p.hardware(2,.93,.18,.22,18,true,'hardware',7);
    p.motif(0,.66,.88,.36,-12);p.motif(1,.08,.17,.37,-15);
    p.motif(2,.085,.925,.38,-12);p.motif(3,.94,.90,.4,10);
    p.motif(4,.715,.20,.23,-15);p.motif(5,.027,.71,.3,-10);
    p.motif(0,.72,.74,.19,18);p.motif(4,.89,.08,.2,20);
    p.number('01',.285,.34,.09);p.number('08',.72,.6,.08);
    p.tag('KEEP FOREVER',.065,.6,.19,.043,{fill:'paper',color:'ink',r:4,size:.025});
    p.line(.02,.993,.96,true,.6);p.surface('barcode',.025,.971,.115,.017,0,.6,8,'页脚收藏条码',true,'details');
}

function signature(p){
    // 只在纸边和留白补细节，给各主题保留自己的材料语言。
    const wide=p.W/p.H>1.7;
    switch(p.p.id){
        case 'school':pearlFrame(p);p.art('study-white-daisy',.65,.94,.15,8);break;
        case 'hk':p.art('seat',.105,.965,.28,-5,true,'details',8);p.art('serial',.9,.97,.3,2,true,'details',8);break;
        case 'y2k':p.art('holo-cross',.97,.55,.18,15);p.art('pixel-arrow',.31,.88,.14,-15);break;
        case 'french':p.art('study-lace-strip',.5,.99,wide?1.8:.95,0,true,'hardware',8.2);pearlFrame(p);break;
        case 'mecha':p.art('hazard',.5,.988,wide?1.8:.95,0,true,'hardware',8.2);p.mono('CAUTION / 001',.015,.91,.16,.026,{front:true,color:'accent'});break;
        case 'fairy':p.art('doodle-stars',.96,.51,.22,10);p.art('rainbow',.5,.965,.26,0);break;
        case 'letter':p.art('stamp-green',.965,.54,.18,8);p.mono('P.S. always',.05,.93,.22,.03,{font:p.p.hand,r:-6,front:true});break;
        case 'stamp':p.art('serial',.04,.55,.25,-90,true,'details',7);p.art('stamp-red',.67,.94,.18,8);break;
        case 'gothic':p.art('thorn',.53,1.05,wide?.62:.42,-8,true,'hardware',7.5);p.art('black-moth',.96,.51,.2,-12);break;
        case 'sweetcool':p.art('study-white-daisy',.66,.94,.15,9);p.art('blue-cherries',.965,.53,.22,10);break;
    }
    p.mono('+',.015,.035,.04,.045,{front:true,color:'accent'});
    if(p.H>=240)p.mono('COLLECT / 01',.77,.985,.2,.018,{front:true});
}

function pearlFrame(p){
    const photo=p.elements.find(e=>e.photoRole==='secondary');
    if(!photo)return;
    p.art('study-pearl-round',(photo.x+photo.width/2)/p.W,(photo.y+photo.height/2)/p.H,
        Math.max(photo.width,photo.height)/p.u*1.12,photo.rotation,true,'left',5.3);
}

const BUILDERS={chip,compact,circle,polaroid,collage,tower,banner,scroll,poster};
export function buildMaximal(W,H,style,key){
    if(style.id==='school'&&['banner','tower','chip'].includes(key))return buildMaximalSchool(W,H,key);
    const page=new CollagePage(W,H,MAXIMAL_PROFILES[style.id],key);
    (BUILDERS[key]||collage)(page);signature(page);return page.finish();
}
