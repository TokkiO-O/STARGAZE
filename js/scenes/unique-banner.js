import { F, img } from '../assets/base.js';
import { CollagePage } from './collage-kit.js';
import { MAXIMAL_PROFILES } from './maximal-profiles.js';
import { buildMaximalSchool } from './maximal-school.js';
import { UNIQUE_SURFACES } from './unique-surfaces.js';

const PLATE_NAMES=new Map(UNIQUE_SURFACES.map(a=>[a.id,a.name]));

class Page extends CollagePage {
    plate(key,x=0,y=0,w=1,h=1,r=0,z=.2,front=false,group='bg') {
        const id='v10:unique-'+key;
        return this.add(img(id,x*this.W,y*this.H,w*this.W,h*this.H,{r,z,fit:'fill'}),PLATE_NAMES.get(id)||key,group,front);
    }
    upright(key,x,y,w,h,z=.3,label='主题纸张') { return this.surface(key,x,y,w,h,0,1,z,label); }
}

// 报刊分栏：大肖像压左，右侧标题、短文、照片、器物形成新闻阅读顺序。
function hk(p) {
    p.upright('paper',0,0,1,1,0,'旧报刊底纸');p.plate('city-columns');
    p.material('news-edge',-.05,-.11,.54,1.2,-6,.65,.4,'不规则旧报边');
    p.surface('accent',.02,.04,.95,.054,0,1,.7,'报刊红色刊头');
    p.mono('THE PRIVATE CITY JOURNAL',.035,.052,.61,.028,{color:'paper'});
    p.mono('VOL. 04 / NO.08',.77,.053,.18,.023,{color:'paper',align:'right'});
    p.hero(.272,.532,.455,.83,'rect');
    p.type('OLD\nTIMES',.53,.106,.44,.225,{h:.37,r:0});
    p.type('THE NIGHT IS STILL YOUNG',.535,.455,.43,.028,{font:F.mono});
    p.line(.53,.502,.435,true);
    p.surface('ink',.523,.535,.225,.339,-4,1,2,'右栏黑色相纸底');
    p.photo(.638,.699,.205,.292,'film',-4,1.75,49,25,'right');
    p.photo(.853,.71,.167,.36,'rect',6,1.14,43,66,'right');
    p.type('CITY LIGHTS\nA NIGHT TO\nREMEMBER',.511,.894,.27,.025,{h:.079,font:F.mono,r:-2});
    p.mono('08 / PRIVATE EDITION',.768,.918,.2,.02,{front:true});
    p.art('vinyl',.495,.375,.46,-14,false,'hardware',3.2);
    p.art('film',.218,.956,.8,-7,true,'hardware',5.2);
    p.art('radio',.422,.88,.4,-8,true,'flowers',7);
    p.art('clock',.962,.705,.31,10,true,'flowers',7);
    p.art('black-clip',.078,.11,.18,-13,true,'hardware',7);
    p.art('gold-clip',.815,.558,.15,6,true,'hardware',7);
    p.art('transit-ticket',.033,.63,.26,-12,true,'details',7);
    p.art('ticket',.678,.928,.25,4,true,'details',7);
    p.art('serial',.93,.97,.26,0,true,'details',7);
    p.material('paper-strip',.053,.795,.24,.049,-6,1,7,'主像注签',true,'details','fill');
    p.mono('{{name|Mira}} / THE CITY',.062,.805,.22,.027,{r:-6,front:true});
    p.mono('photo archive / 1998',.51,.978,.31,.02,{front:true});
    p.number('01',.46,.127,.075);
}

// 千​​禧桌面：弹窗错层、右侧气泡肖像、穿插的界面字组，不采用相册式三连排。
function y2k(p) {
    p.upright('holo',0,0,1,1,0,'虹彩桌面');
    p.surface('grid',0,0,1,1,0,.36,.1,'像素网格');
    p.surface('ink',0,.91,1,.09,0,1,1,'桌面状态栏');
    p.plate('window',.025,.23,.46,.63,-7,1.5);
    p.mono('FAVORITE.EXE',.058,.265,.27,.027,{front:true,r:-7,color:'ink'});
    p.photo(.234,.561,.348,.426,'rect',-7,1.6,49,25,'left');
    p.plate('window',.33,.025,.235,.38,9,2.4);
    p.photo(.448,.231,.194,.222,'rect',9,2.2,53,20,'right');
    p.plate('bubble',.475,.05,.515,.84,0,2.7);
    p.art('orbit',.733,.485,1.04,-15,false,'hardware',3.3);
    p.hero(.737,.475,.42,.79,'circle');
    p.type('CYBER',.025,.028,.69,.246,{z:3.4});
    p.type('LOVE',.505,.758,.425,.18,{front:true,color:'ink',r:-7,stroke:.6});
    p.tag('YOU HAVE A NEW MESSAGE',.099,.79,.38,.067,{fill:'paper',color:'ink',r:-7,size:.029});
    p.mono('START  ✦',.025,.945,.19,.028,{color:'paper',front:true});
    p.mono('ONLINE / 2000 / 99%',.635,.945,.33,.026,{color:'paper',front:true,align:'right'});
    p.art('chrome-heart',.503,.80,.38,-16,true,'flowers',7.5);
    p.art('chrome-star',.936,.176,.3,18,true,'flowers',7.3);
    p.art('pink-phone',.051,.86,.32,-14,true,'flowers',7.5);
    p.art('holo-cross',.361,.704,.26,12,true,'flowers',7.4);
    p.art('holo-cross',.596,.149,.16,-17,true,'flowers',7.4);
    p.art('pixel-heart',.133,.135,.25,-8,true,'flowers',7.5);
    p.art('pixel-arrow',.465,.471,.21,-14,true,'hardware',7.5);
    p.art('silver-rings',.945,.742,.25,20,true,'hardware',7.4);
    p.art('chain',.749,.98,.68,-5,true,'hardware',7.2);
    p.mono('click here ♡',.35,.686,.21,.033,{r:-7,front:true});
}

// 法式双页：右页大椭圆、左页小肖像与法文标题，中间用缎带装订。
function french(p) {
    p.upright('soft',0,0,1,1,0,'豆沙色相册封面');
    p.surface('damask',0,0,1,1,0,.7,.1,'封面菱花纹');
    p.material('ivory-paper',.015,.01,.46,1,-2,1,.5,'左页纹理纸','', 'bg','fill');
    p.surface('paper',.495,.025,.475,.95,2,1,.6,'右页相册纸');
    p.surface('border',.035,.045,.42,.91,-2,.8,.8,'左页细线压框');
    p.art('doily',.74,.49,.99,0,false,'main',2.2);
    p.hero(.744,.502,.365,.848,'circle');
    p.photo(.245,.598,.21,.53,'circle',-5,1.7,49,24,'left');
    p.art('study-pearl-oval',.245,.598,.61,-5,true,'left',5.2);
    p.material('study-lace-strip',.233,.448,.49,.104,90,1,5.5,'中缝蕾丝装订',true,'hardware','contain');
    p.art('cream-bow',.48,.28,.51,4,true,'hardware',7.1);
    p.type('MON\nAMOUR',.05,.075,.39,.17,{h:.34,r:-2});
    p.type('souvenirs de toi',.049,.81,.38,.075,{font:F.hand,r:-7,front:true});
    p.mono('LES PETITS SOUVENIRS',.039,.939,.39,.022,{align:'center',front:true});
    p.tag('collection privée / 01',.591,.878,.31,.049,{fill:'paper',color:'ink',size:.026,r:2});
    p.art('pink-bow',.084,.43,.3,-15,true,'flowers',7);
    p.art('rose',.897,.895,.37,14,true,'flowers',7.6);
    p.art('rose',.55,.922,.24,-16,true,'flowers',7.6);
    p.art('study-pearl-bow',.928,.142,.24,14,true,'flowers',7.3);
    p.art('ornate-corner',.953,.088,.23,88,true,'hardware',6.8);
    p.art('ornate-corner',.039,.926,.23,-92,true,'hardware',6.8);
    p.art('study-pearl-wave',.259,.961,.85,-2,true,'hardware',6.5);
    p.art('study-white-daisy',.074,.927,.15,-8,true,'flowers',7.7);
    p.line(.106,.443,.255,false,.45);
    p.mono('a little love letter',.12,.389,.28,.026,{font:F.hand,r:-3,front:true});
    p.number('08',.516,.73,.08);
    p.art('study-pearl-curve',.741,.967,.61,-3,true,'hardware',6.9);
    p.art('study-pearl-bow',.133,.819,.15,-15,true,'hardware',7.3);
    p.art('study-lace-strip',.253,.029,.73,-2,false,'bg',1.2);
    p.mono('VOL. 01\nPARIS NOTES',.365,.861,.09,.021,{h:.065,align:'center',front:true});
}

// 工业检视台：中央六角主像、左右不同规格的取证栏与机械器件。
function mecha(p) {
    p.plate('mechanical',0,0,1,1,0,0);
    p.surface('accent',.035,.11,.268,.072,0,1,1,'左侧档案标题');
    p.mono('SUBJECT / 001',.047,.13,.24,.029,{color:'ink'});
    p.photo(.177,.363,.27,.317,'film',0,2.35,51,24,'left');
    p.photo(.158,.744,.205,.269,'rect',0,1.14,43,68,'left');
    p.hero(.505,.513,.282,.871,'hexagon');
    p.photo(.823,.543,.183,.674,'rect',0,1.55,51,25,'right');
    p.mono('NO\nSIGNAL',.723,.016,.25,.1,{h:.22,color:'paper',front:true,font:F.sans});
    p.mono('OPTICAL SCAN',.05,.543,.255,.029,{color:'paper',front:true});
    p.mono('ID_01\nACTIVE\nHUMAN',.278,.682,.087,.021,{h:.12,color:'accent',front:true});
    p.mono('ACCESS / 0110\nRESTRICTED AREA',.716,.916,.25,.024,{h:.055,color:'paper',front:true});
    p.tag('SYSTEM READY',.394,.886,.221,.057,{fill:'accent',color:'ink',size:.032});
    p.art('hazard',.146,.047,.57,0,true,'hardware',7);
    p.art('hazard',.874,.985,.54,0,true,'hardware',7);
    p.art('spring',.279,.917,.43,-12,true,'flowers',7.3);
    p.art('silver-rings',.964,.289,.37,18,true,'flowers',7.3);
    p.art('chain',.832,.86,.65,-3,true,'hardware',7.2);
    p.art('black-clip',.074,.645,.15,-13,true,'hardware',7);
    p.art('metal-label',.146,.942,.37,2,true,'details',7);
    p.art('orbit',.513,.495,.995,0,false,'hardware',3.2);
    p.art('broken-paper',.654,.208,.3,14,false,'details',2.5);
    p.surface('barcode',.729,.829,.184,.04,0,1,7,'档案机器码',true,'details');
    p.mono('+',.335,.091,.04,.066,{color:'accent',front:true});
    p.mono('+',.646,.895,.04,.066,{color:'accent',front:true});
    p.line(.042,.566,.255,true,.6);
    p.tag('SCAN / 98%',.732,.796,.177,.041,{fill:'accent',color:'ink',size:.025});
    p.mono('X 03\nY 11\nZ 07',.641,.211,.051,.023,{h:.19,color:'accent',front:true});
}

// 绘本：展开书页的场景。左页大主角，右页是大小不同的故事插页。
function fairy(p) {
    p.upright('accent',0,0,1,1,0,'绘本书封底');
    p.plate('storybook',.013,.025,.975,.95,0,.5);
    p.surface('grid',.03,.085,.44,.81,0,.22,.6,'左页淡格纹');
    p.surface('soft',.049,.17,.391,.66,-3,1,1,'主角剪贴纸边');
    p.hero(.246,.509,.368,.674,'rounded');
    p.photo(.735,.459,.195,.368,'circle',8,1.65,49,23,'right');
    p.photo(.769,.803,.299,.267,'polaroid',-5,1.12,44,70,'right');
    p.type('LITTLE\nSTORY',.532,.042,.395,.14,{h:.29,font:F.hand,r:3});
    p.type('Once upon\na lovely day...',.491,.583,.19,.052,{h:.15,font:F.hand,r:-6,front:true});
    p.type('{{name|Mira}}',.075,.832,.27,.088,{font:F.hand,r:-6,front:true});
    p.mono('a pocket full of little joys',.523,.954,.427,.022,{front:true});
    p.art('rainbow',.23,.131,.51,-7,true,'flowers',7);
    p.art('story-bear',.412,.786,.36,8,true,'flowers',7.5);
    p.art('story-cake',.074,.904,.34,-11,true,'flowers',7.4);
    p.art('story-phone',.948,.668,.32,12,true,'flowers',7.3);
    p.art('doodle-stars',.922,.297,.21,13,true,'flowers',7);
    p.art('doodle-stars',.564,.298,.19,-14,true,'flowers',7);
    p.art('story-tape',.961,.94,.29,6,true,'flowers',7.5);
    p.art('star-clip',.68,.643,.17,-17,true,'hardware',7);
    p.art('study-white-daisy',.409,.108,.14,4,true,'flowers',7.3);
    p.art('study-white-daisy',.545,.91,.16,-5,true,'flowers',7.3);
    p.material('paper-strip',.072,.757,.24,.052,-3,1,7,'贴在左页的页签',true,'details','fill');
    p.mono('CHAPTER 01',.083,.769,.22,.025,{r:-3,front:true});
    p.number('01',.494,.914,.075);p.number('02',.95,.449,.06);
    p.art('doodle-stars',.057,.415,.13,-17,true,'flowers',7.3);
    p.art('study-plane',.515,.066,.16,15,true,'flowers',7.3);
    p.mono('a tiny story\nfor my favorite',.503,.778,.103,.021,{h:.088,front:true});
}

// 信笺：以信的阅读为主。肖像像夹在信封里的纪念物，不再是中心海报式大图。
function letter(p) {
    p.plate('letter-fold',0,0,1,1,0,0);
    p.material('ivory-paper',.35,-.08,.63,1.19,3,1,.5,'右侧展开的折痕信纸','', 'bg','fill');
    p.surface('ruled',.418,.18,.495,.65,3,.55,.6,'信纸横线');
    p.art('envelope',.22,.70,.97,-9,false,'bg',1.4);
    p.material('paper-note',.078,.135,.302,.71,-8,1,2,'放在信封中的肖像纸');
    p.hero(.225,.485,.254,.61,'rect');
    p.photo(.871,.283,.158,.29,'polaroid',10,1.8,51,22,'right');
    p.type('Dear you,',.405,.106,.416,.122,{font:F.hand,r:3});
    p.type('some moments\nare too lovely\nto leave behind.',.429,.341,.335,.075,{h:.34,font:F.hand,r:3});
    p.type('With love,',.551,.729,.25,.065,{font:F.hand,r:3,front:true});
    p.type('{{name|Mira}}',.67,.805,.24,.08,{font:F.hand,r:3,front:true});
    p.mono('P.S. keep this little memory',.418,.924,.445,.025,{r:3,front:true});
    p.art('botanical',.059,.493,.51,-10,true,'flowers',7);
    p.art('herb-paper',.183,.913,.51,-12,true,'flowers',7.2);
    p.art('open-book',.929,.922,.38,9,true,'flowers',7.2);
    p.art('gold-clip',.206,.15,.19,-12,true,'hardware',7);
    p.art('paperclip',.931,.183,.17,18,true,'hardware',7);
    p.art('stamp-green',.067,.131,.25,-9,true,'details',7);
    p.plate('postmark',.278,.705,.138,.265,-17,7.3,true,'details');
    p.art('study-white-daisy',.372,.914,.14,-7,true,'flowers',7.4);
    p.material('paper-strip',.083,.733,.27,.055,-8,1,7.1,'肖像的手写注签',true,'details','fill');
    p.mono('YOU / FOREVER KEPT',.096,.747,.24,.023,{r:-8,front:true});
    p.art('serial',.962,.529,.29,90,true,'details',7);
    p.mono('PRIVATE LETTER / 01',.434,.052,.37,.023,{r:3});
    p.art('envelope',.249,.837,.515,-9,true,'flowers',6.8);
    p.art('stamp-red',.955,.084,.175,9,true,'details',6.9);
    p.art('paperclip',.356,.817,.15,-12,true,'hardware',7.4);
    p.line(.429,.282,.30,false,.4);
    p.material('paper-strip',.431,.842,.184,.049,3,1,7.4,'信末收藏标签',true,'details','fill');
    p.mono('FOREVER KEPT',.438,.854,.17,.022,{r:3,front:true});
}

// 集邮册：分类格、齿孔大邮票和小型藏品，一张主像与几件收藏共同组织页面。
function stamp(p) {
    p.plate('stamp-mount',0,0,1,1,0,0);
    p.surface('ink',.024,.02,.032,.956,0,1,.3,'左侧册脊');
    p.mono('COLLECTION / VOL. 01',.053,.042,.394,.028);
    p.mono('BON VOYAGE',.484,.05,.461,.063,{font:F.serif});
    p.hero(.262,.526,.334,.704,'rect');p.avatar.frameStyle='stamp';
    p.photo(.618,.348,.171,.303,'stamp',0,1.8,49,22,'right');
    p.photo(.626,.754,.237,.346,'stamp',0,1.14,45,68,'right');
    p.art('stamp-red',.833,.337,.316,0,true,'flowers',5.5);
    p.art('stamp-green',.884,.729,.327,-2,true,'flowers',5.5);
    p.art('ticket',.425,.135,.24,-9,true,'details',7);
    p.art('seat',.408,.85,.28,8,true,'details',7);
    p.art('transit-ticket',.092,.739,.27,-9,true,'details',7);
    p.art('serial',.092,.12,.29,-90,true,'details',7);
    p.art('airmail-number',.755,.896,.22,4,true,'details',7);
    p.plate('postmark',.349,.369,.143,.275,-17,7.3,true,'details');
    p.mono('01 / FAVORITE',.146,.922,.25,.025,{front:true});
    p.mono('02 / PORTRAIT',.539,.524,.18,.02,{front:true});
    p.mono('03 / BOTANICAL',.762,.521,.197,.02,{front:true});
    p.mono('04 / MEMORY',.536,.955,.22,.019,{front:true});
    p.mono('POSTAGE\nPAID',.949,.60,.041,.025,{h:.17,front:true});
    p.art('gold-clip',.478,.048,.13,3,true,'hardware',7);
    p.art('paperclip',.954,.894,.16,18,true,'hardware',7);
    p.surface('barcode',.038,.965,.39,.022,0,.75,7,'藏品分类码',true,'details');
    p.line(.49,.125,.46,true,.5);
    p.art('stamp-green',.151,.179,.15,-8,true,'details',7);
    p.art('stamp-red',.828,.929,.14,-4,true,'details',7);
    p.mono('AIR MAIL\nPERSONAL\nARCHIVE',.375,.652,.08,.023,{h:.119,front:true});
    p.mono('FAVORITE FACES / 01',.117,.076,.258,.018,{front:true});
    p.material('paper-strip',.742,.921,.17,.043,0,1,7.4,'邮册藏品标签',true,'details','fill');
    p.mono('SERIES 01',.754,.932,.148,.02,{front:true});
}

// 哥特三联画：对称拱廊决定照片比例，边缘的烛台、沙漏和羽毛构成舞台边框。
function gothic(p) {
    p.plate('cathedral',0,0,1,1,0,0);
    p.photo(.237,.582,.214,.619,'arch',0,1.75,46,23,'left',false);
    p.photo(.763,.582,.214,.619,'arch',0,1.13,54,64,'right',false);
    p.hero(.5,.54,.265,.828,'arch');
    p.type('NOCTURNE',.205,.008,.59,.143,{align:'center',z:3});
    p.type('THE MIDNIGHT ARCHIVE',.3,.157,.4,.028,{align:'center',font:F.mono,front:true});
    p.type('{{name|Mira}}',.38,.817,.24,.078,{font:F.hand,align:'center',front:true});
    p.art('candle',.054,.35,.395,-7,true,'flowers',7);
    p.art('candle',.946,.35,.395,7,true,'flowers',7);
    p.art('hourglass',.93,.876,.36,7,true,'flowers',7.3);
    p.art('gothic-fan',.08,.887,.38,-13,true,'flowers',7.3);
    p.art('feather',.329,.939,.37,28,true,'flowers',7.4);
    p.art('feather',.67,.939,.37,-28,true,'flowers',7.4);
    p.art('black-moth',.502,.977,.3,0,true,'flowers',7.5);
    p.art('black-moth',.098,.125,.19,-15,true,'flowers',7.4);
    p.art('black-moth',.902,.125,.19,15,true,'flowers',7.4);
    p.art('ornate-corner',.022,.053,.21,-90,true,'hardware',7.2);
    p.art('ornate-corner',.978,.053,.21,0,true,'hardware',7.2);
    p.art('thorn',.283,1.04,.45,-21,true,'hardware',7.3);
    p.art('thorn',.718,1.04,.45,21,true,'hardware',7.3);
    p.art('black-bow',.502,.17,.19,0,true,'hardware',7.3);
    p.mono('I',.238,.91,.09,.031,{align:'center',front:true});
    p.mono('II',.455,.963,.09,.025,{align:'center',front:true});
    p.mono('III',.719,.91,.09,.031,{align:'center',front:true});
    p.mono('PRIVATE / 01',.034,.969,.24,.02,{front:true});
    p.mono('MEMENTO MORI',.756,.969,.21,.02,{align:'right',front:true});
    p.surface('border',.015,.012,.97,.973,0,.65,.4,'拱廊外围细框');
    p.art('ornate-corner',.024,.956,.17,180,true,'hardware',7.5);
    p.art('ornate-corner',.976,.956,.17,90,true,'hardware',7.5);
    p.type('a beautiful dark dream',.356,.925,.289,.034,{font:F.hand,align:'center',color:'accent',front:true});
}

// 甜酷杂志：大主像贴左出血，右侧高对比巨字压纸，一张边角拍立得与竖条细节。
function sweetcool(p) {
    p.upright('paper',0,0,1,1,0,'杂志底纸');p.plate('fashion-slash',0,0,1,1,0,.2);
    p.surface('grid',.01,.05,.55,.95,0,.4,.4,'冷蓝细格纹');
    p.material('paper-note',.121,-.04,.497,1.08,-3,1,1.5,'大主像的撕纸边');
    p.hero(.341,.491,.442,.974,'rect');p.avatar.frameStyle='torn';
    p.photo(.064,.502,.122,.459,'film',-3,2.15,51,20,'left');
    p.photo(.805,.742,.263,.434,'polaroid',10,1.22,46,63,'right');
    p.type('CHERRY',.574,.12,.405,.21,{r:0,color:'paper',front:true});
    p.type('CLUB',.61,.33,.35,.16,{r:0,color:'paper',front:true});
    p.mono('SWEET HEART\nCOOL MIND',.611,.527,.29,.037,{h:.106,color:'paper',front:true});
    p.type('my favorite\nkind of chaos',.238,.796,.4,.063,{h:.16,font:F.hand,r:-8,front:true,color:'ink'});
    p.tag('MEMBERS ONLY / 01',.595,.038,.365,.048,{fill:'paper',color:'accent',size:.029});
    p.art('chain',.408,.115,.94,-7,true,'hardware',6.8);
    p.art('blue-bow',.156,.095,.35,-13,true,'flowers',7.2);
    p.art('blue-cherries',.961,.539,.33,13,true,'flowers',7.3);
    p.art('chrome-heart',.58,.931,.34,-11,true,'flowers',7.4);
    p.art('blue-cassette',.098,.953,.4,-8,true,'flowers',7.4);
    p.art('study-butterfly',.525,.653,.23,-15,true,'flowers',7.4);
    p.art('blue-star',.967,.142,.24,18,true,'flowers',7.4);
    p.art('star-clip',.676,.619,.18,-16,true,'hardware',7.5);
    p.art('silver-rings',.928,.879,.22,15,true,'hardware',7.5);
    p.mono('ISSUE / 11',.013,.045,.15,.025,{front:true});
    p.surface('barcode',.636,.963,.304,.027,0,.9,8,'杂志条码',true,'details');
    p.mono('A LITTLE SWEET / A LITTLE WILD',.017,.984,.47,.019,{front:true});
}

export const BANNER_BUILDERS={hk,y2k,french,mecha,fairy,letter,stamp,gothic,sweetcool};
export function buildUniqueBanner(W,H,style) {
    if(style.id==='school')return buildMaximalSchool(W,H,'banner');
    const p=new Page(W,H,MAXIMAL_PROFILES[style.id],'banner');
    BANNER_BUILDERS[style.id](p);return p.finish();
}
