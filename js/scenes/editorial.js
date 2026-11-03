import { F, img, txt, ASPECT } from '../assets/base.js';
import { EDITORIAL_PALETTES } from '../assets/design-surfaces.js';
import { CURATED_ASSETS } from '../assets/curated.js';

const NAME='{{name|STARGAZE}}';
const GROUPS={paper:'底纸与版式',photo:'照片',type:'标题与文字',deco:'精选装饰'};
const ASSET_NAMES=new Map(CURATED_ASSETS.map(asset=>[asset.id,asset.name]));
let metrics;
function fitType(value,width,size,font,height){
    metrics ||= document.createElement('canvas').getContext('2d');
    metrics.font=`${size}px ${font}`;
    const lines=String(value).replace(/\{\{[^|]+\|([^}]+)\}\}/g,'$1').split('\n');
    const measured=Math.max(...lines.map(line=>metrics.measureText(line).width),1);
    return Math.min(size,size*width*.96/measured,height?height/(lines.length*1.3):size);
}

class Art {
    constructor(W,H,kit,key){
        this.W=W;this.H=H;this.u=Math.min(W,H);this.kit=kit;this.key=key;
        this.p=EDITORIAL_PALETTES[kit.id];this.out=[];this.avatar={};
    }
    put(el,label,role='deco',front=false,finish='flat'){
        Object.assign(el,{label,groupId:`${role}-${front?'front':'back'}`,layer:front?'front':'back',finish});
        this.out.push(el);return el;
    }
    panel(key,x,y,w,h,label='',r=0,o=1,z=1){
        return this.put(img(`v10:design-${this.kit.id}-${key}`,x*this.W,y*this.H,w*this.W,h*this.H,
            {r,o,z,fit:'fill'}),label||GROUPS.paper,'paper');
    }
    base(kind='paper',pattern=''){
        const el=this.panel(kind,0,0,1,1,'主题底纸',0,1,0);el.locked=true;
        if(pattern){const p=this.panel(pattern,0,0,1,1,'主题底纹',0,1,0.1);p.locked=true;}
    }
    line(x,y,w,color='accent',o=0.6){return this.panel(color,x,y,w,Math.max(0.0015,0.65/this.H),'分隔细线',0,o,1.3);}
    ruleV(x,y,h,color='accent',o=0.5){return this.panel(color,x,y,Math.max(0.001,0.65/this.W),h,'分栏细线',0,o,1.3);}
    text(value,x,y,w,s,opts={}){
        const font=opts.font||F.serif;
        const size=fitType(value,w*this.W,this.u*s,font,opts.h?opts.h*this.H:0);
        const el=txt(value,x*this.W,y*this.H,w*this.W,size,{font,
            color:this.p[opts.color||'ink']||opts.color,align:opts.align||'left',z:8,r:opts.r||0,o:opts.o??1});
        if(opts.h)el.height=opts.h*this.H;
        return this.put(el,opts.label||value.replace(/\{\{[^|]+\|([^}]+)\}\}/g,'$1'),'type',!!opts.front);
    }
    small(value,x,y,w,s=0.035,opts={}){return this.text(value,x,y,w,s,{font:F.mono,...opts});}
    title(value,x,y,w,s,opts={}){return this.text(value,x,y,w,s,{font:this.kit.id==='fairy'?F.hand:F.serif,...opts});}
    asset(slug,cx,cy,s,r=0,front=true,o=1){
        const id=`v10:curated-${slug}`;const ar=ASPECT[id]||1;const d=s*this.u;
        const w=ar>=1?d:d*ar,h=ar>=1?d/ar:d;
        return this.put(img(id,cx*this.W-w/2,cy*this.H-h/2,w,h,{r,z:6,o,fit:'contain'}),ASSET_NAMES.get(id)||slug,'deco',front,'soft');
    }
    material(slug,x,y,w,h,r=0,o=1){
        const id=`v10:curated-${slug}`;
        if(slug==='hazard') h=w*this.W/(ASPECT[id]*this.H);
        return this.put(img(id,x*this.W,y*this.H,w*this.W,h*this.H,{r,z:1.5,o,fit:'contain'}),ASSET_NAMES.get(id)||slug,'paper',false,'soft');
    }
    hero(cx,cy,w,h,shape='square',frame='none'){
        let pw=w*this.W,ph=h*this.H;
        if(['circle','heart','hexagon','blob'].includes(shape) && frame==='none'){
            pw=ph=Math.min(pw,ph);w=pw/this.W;h=ph/this.H;
        }
        if(frame==='stamp'){
            if(shape==='circle') frame='circle';
            else {
                const pad=Math.min(pw,ph)*.11;
                this.panel('perf',cx-w/2-pad/this.W,cy-h/2-pad/this.H,
                    w+2*pad/this.W,h+2*pad/this.H,'邮票齿孔底框',0,1,2);
                frame='none';
            }
        }
        const A=Math.min(pw,ph);
        this.units=A;this.ax=cx;this.ay=cy;
        this.avatar={shape,frameStyle:frame,widthRatio:pw/A,heightRatio:ph/A};
        this.put(img('__avatar__',(cx-w/2)*this.W,(cy-h/2)*this.H,pw,ph,{shape,z:4,fit:'cover'}),'角色主头像','photo');
    }
    mini(cx,cy,w,h,shape='rect',r=0){
        return this.put(img('__avatar__',(cx-w/2)*this.W,(cy-h/2)*this.H,w*this.W,h*this.H,
            {shape,r,z:3.8,zoom:1.25,fy:42}),'副照片','photo');
    }
    disk(cx,cy,s,key='disk',label='头像衬底'){
        const d=s*this.u;return this.panel(key,cx-d/this.W/2,cy-d/this.H/2,d/this.W,d/this.H,label,0,1,2);
    }
    footer(value='STARGAZE / PERSONAL ARCHIVE',y=0.94,color='ink'){
        this.small(value,0.065,y,0.87,0.025,{color,o:0.7});
    }
    finish(){
        const used=new Map();
        for(const e of this.out){
            const role=e.groupId.split('-')[0];
            if(!used.has(e.groupId))used.set(e.groupId,{id:e.groupId,name:GROUPS[role],layer:e.layer,z:e.z,collapsed:role==='paper'});
        }
        return {elements:this.out,avatarUnits:this.units,anchorX:this.ax,anchorY:this.ay,avatar:this.avatar,
            groups:[...used.values()],theme:{...this.p,secondary:this.p.soft}};
    }
}

function school(a,k){
    a.base('paper','grid');
    switch(k){
    case 'chip':
        a.panel('soft',0,0,.34,1,'雾蓝头像栏');a.hero(.18,.5,.24,.62,'circle');
        a.title('MILK DAY',.37,.22,.56,.2);a.small('SCHOOL JOURNAL / 01',.38,.63,.5,.061);
        a.asset('blue-daisy',.92,.19,.23,-12);break;
    case 'compact':
        a.panel('paper',.47,.07,.48,.86,'留白书写区');a.hero(.285,.51,.43,.64,'square','rect');
        a.small('01 / CAMPUS',.55,.16,.39,.048);a.title('milk\n& salt',.55,.32,.4,.135,{h:.32});
        a.asset('star-clip',.37,.16,.25,-12);a.asset('blue-daisy',.86,.8,.24,8);break;
    case 'circle':
        a.disk(.5,.49,.88);a.disk(.5,.49,.8,'ring');a.hero(.5,.48,.58,.58,'circle');
        a.small('MILK & SALT',.21,.065,.58,.052,{align:'center'});
        a.asset('blue-daisy',.22,.7,.23,-12);a.asset('blue-star',.79,.24,.15,14);
        a.small(NAME,.22,.91,.56,.043,{align:'center'});break;
    case 'polaroid':
        a.panel('soft',.64,0,.36,1,'侧边索引');a.hero(.375,.44,.55,.68,'square','polaroid');
        a.asset('paperclip',.17,.12,.18,18);a.title('milk\nday.',.7,.2,.25,.115,{h:.33});
        a.asset('blue-daisy',.77,.66,.29,-18);a.small('a little memory',.1,.86,.63,.041);break;
    case 'collage':
        a.material('lined-note',.02,.03,.56,.88,-3);a.hero(.365,.46,.4,.66,'square','rect');
        a.mini(.77,.63,.24,.38,'rect',7);a.title('AFTER\nSCHOOL',.61,.12,.34,.112,{h:.26});
        a.asset('paperclip',.21,.13,.2,-12);a.asset('blue-cassette',.63,.83,.3,-13);
        a.small('our ordinary days',.065,.92,.5,.034);break;
    case 'tower':
        a.panel('soft',0,0,1,.2,'封面刊头');a.title('MILK DAY',.085,.055,.83,.14);
        a.small('THE CAMPUS ISSUE / 01',.09,.154,.8,.031);
        a.hero(.5,.455,.75,.46,'square','rect');a.asset('star-clip',.8,.245,.23,16);
        a.title('small things,\nhappy days.',.11,.728,.8,.085,{h:.14});
        a.asset('blue-daisy',.83,.85,.24,8);a.footer('SCHOOL JOURNAL / KEEP THIS MOMENT');break;
    case 'banner':
        a.panel('soft',0,0,.38,1,'校园蓝左栏');a.hero(.26,.51,.3,.7,'circle');
        a.title('AFTER SCHOOL',.48,.19,.47,.117);a.small('MILK DAY / VOL.01',.485,.105,.45,.035);
        a.line(.49,.45,.42);a.text(NAME,.49,.52,.42,.075,{font:F.sans});
        a.asset('blue-cassette',.82,.81,.31,-8);a.asset('blue-daisy',.49,.84,.19,-10);
        a.footer('NOTES FROM THE BEST DAYS');break;
    case 'scroll':
        a.panel('soft',.73,0,.27,1,'头像索引区');a.hero(.835,.5,.2,.72,'circle');
        a.title('MILK DAY',.075,.25,.59,.32);a.small('AFTER SCHOOL / OUR FAVORITE DAYS',.08,.73,.62,.057);
        a.asset('blue-daisy',.04,.35,.36,-20);a.asset('star-clip',.725,.19,.24,5);break;
    default:
        a.panel('soft',.51,0,.49,1,'大幅雾蓝衬底');a.hero(.72,.49,.37,.72,'square','rect');
        a.small('MILK & SALT / 01',.07,.11,.37,.04);a.title('OUR\nSCHOOL\nDAYS',.065,.25,.43,.15,{h:.5});
        a.asset('blue-daisy',.515,.79,.26,-15);a.asset('paperclip',.84,.14,.18,17);
        a.footer('A PAGE FOR EVERY ORDINARY MIRACLE');
    }
}

function hk(a,k){
    a.base();
    switch(k){
    case 'chip':
        a.panel('dark',0,0,.36,1,'胶片黑栏');a.hero(.185,.5,.26,.7,'square','film');
        a.small('HONG KONG / 1999',.41,.17,.55,.058,{color:'accent'});a.title('REEL 09',.4,.36,.55,.23);
        a.line(.41,.83,.51,'ink');break;
    case 'compact':
        a.material('newspaper',.55,.02,.45,.98);a.hero(.33,.46,.53,.72,'square','film');
        a.title('REEL\n09',.67,.19,.3,.15,{h:.41});a.small('OLD PICTURE',.08,.87,.72,.05);
        a.asset('ticket',.8,.81,.28,-10);break;
    case 'circle':
        a.disk(.5,.49,.92);a.disk(.5,.49,.84,'ring');a.hero(.5,.49,.61,.61,'circle');
        a.small('HONG KONG • 1999',.16,.08,.68,.048,{align:'center'});
        a.asset('ticket',.74,.76,.27,-10);a.title('REEL 09',.23,.91,.54,.06,{align:'center'});break;
    case 'polaroid':
        a.panel('dark',.04,.06,.65,.88,'旧胶片衬底');a.hero(.365,.44,.55,.65,'square','polaroid');
        a.small('FRAME 009',.12,.815,.48,.042,{color:'paper'});a.title('OLD\nPICTURE',.72,.19,.25,.094,{h:.33});
        a.asset('transit-ticket',.83,.68,.29,7);break;
    case 'collage':
        a.material('newspaper',.01,.01,.51,.97,-3);a.hero(.4,.49,.46,.71,'square','film');
        a.mini(.81,.68,.23,.38,'polaroid',6);a.title('REEL 09',.66,.1,.31,.1);
        a.small('THE LOST SCENES',.67,.26,.29,.029);a.asset('radio',.15,.82,.29,-5);
        a.footer('HONG KONG / A PRIVATE CINEMA');break;
    case 'tower':
        a.panel('dark',0,0,1,.22,'画报黑色刊头');a.title('REEL 09',.09,.045,.82,.19,{color:'paper'});
        a.small('HONG KONG / OLD PICTURE',.1,.174,.8,.032,{color:'paper'});
        a.hero(.5,.455,.8,.43,'square','film');a.title('光影留声',.1,.72,.8,.13,{font:F.kai});
        a.small('A THOUSAND STORIES\nIN ONE SINGLE FRAME.',.11,.84,.73,.04,{h:.07});
        a.asset('ticket',.76,.94,.25,-5);break;
    case 'banner':
        a.panel('dark',.45,0,.55,1,'胶片暗房');a.hero(.705,.5,.45,.75,'square','film');
        a.small('HONG KONG / 1999',.065,.14,.37,.038,{color:'accent'});
        a.title('REEL\nNº 09',.06,.28,.35,.18,{h:.38});
        a.asset('ticket',.29,.8,.3,-7);a.footer('THE PICTURES WE KEEP',.93);break;
    case 'scroll':
        a.panel('dark',0,0,.29,1,'黑胶唱片栏');a.asset('vinyl',.13,.5,.83,-10,false);
        a.title('REEL 09',.34,.2,.4,.26);a.small('HONG KONG / THE LOST SCENES / 1999',.345,.69,.43,.05);
        a.hero(.86,.5,.2,.74,'square','film');break;
    default:
        a.panel('dark',0,0,.57,1,'电影主画面');a.hero(.285,.49,.48,.76,'square','film');
        a.small('HONG KONG / 1999',.62,.1,.32,.038,{color:'accent'});
        a.title('OLD\nPICTURE',.615,.25,.34,.125,{h:.34});a.line(.62,.65,.31,'ink');
        a.small('EVERY FRAME\nHAS A STORY.',.62,.71,.27,.042,{h:.12});a.asset('radio',.88,.86,.23,-5);
    }
}

function y2k(a,k){
    a.base('holo');
    switch(k){
    case 'chip':
        a.hero(.2,.5,.24,.65,'heart');a.title('Y2K BABY',.36,.19,.59,.25,{font:F.sans});
        a.small('ALWAYS ONLINE / 2000',.39,.66,.53,.061);a.asset('chrome-star',.93,.16,.27,-15);break;
    case 'compact':
        a.panel('paper',.05,.08,.9,.84,'数码窗口衬纸',0,.7);a.hero(.34,.52,.45,.65,'heart');
        a.title('Y2K',.63,.21,.32,.2,{font:F.sans});a.small('BABY DOLL',.61,.52,.35,.05);
        a.asset('chrome-heart',.79,.8,.29,10);a.asset('pixel-arrow',.12,.18,.16,-12);break;
    case 'circle':
        a.disk(.5,.5,.94,'ring');a.hero(.5,.5,.63,.63,'heart');
        a.asset('holo-cross',.22,.25,.28,-12);a.asset('chrome-heart',.8,.71,.26,14);
        a.small('Y2K / ANGEL ONLINE',.2,.06,.65,.044,{align:'center'});
        a.small('2000 → FOREVER',.2,.88,.6,.042,{align:'center'});break;
    case 'polaroid':
        a.panel('paper',.05,.06,.69,.88,'即时成像白纸');a.hero(.395,.435,.58,.65,'square','polaroid');
        a.asset('pixel-arrow',.68,.72,.2,-10);a.title('BABY\nDOLL',.77,.2,.2,.105,{font:F.sans,h:.3});
        a.asset('chrome-star',.81,.74,.32,-10);a.small('xoxo / 2000',.14,.84,.52,.045);break;
    case 'collage':
        a.panel('paper',.025,.06,.61,.86,'浏览器窗口');a.panel('dark',.025,.06,.61,.09,'窗口标题栏');
        a.small('♡ / MY FAVORITE.exe',.055,.083,.55,.031,{color:'paper'});
        a.hero(.33,.52,.44,.66,'heart');a.mini(.81,.64,.23,.38,'rect',7);
        a.title('CYBER\nCRUSH',.68,.15,.28,.12,{font:F.sans,h:.25});
        a.asset('holo-cross',.59,.8,.28,10);a.asset('pixel-arrow',.62,.44,.18,-8);break;
    case 'tower':
        a.title('Y2K',.07,.035,.87,.3,{font:F.sans});a.small('BABY DOLL / ALWAYS ONLINE',.09,.25,.81,.033);
        a.hero(.5,.485,.75,.46,'heart');a.asset('chrome-heart',.19,.29,.28,-14);
        a.asset('chrome-star',.85,.68,.33,12);a.title('CYBER\nCRUSH',.09,.775,.74,.12,{font:F.sans,h:.16});
        a.footer('XOXO / 2000 → FOREVER');break;
    case 'banner':
        a.title('CYBER\nCRUSH',.065,.22,.42,.18,{font:F.sans,h:.45});
        a.small('Y2K / BABY DOLL / 2000',.07,.12,.4,.035);a.hero(.72,.52,.35,.7,'heart');
        a.asset('chrome-star',.94,.18,.3,-15);a.asset('holo-cross',.52,.78,.28,12);
        a.small('ALL FOR YOU. ALWAYS ONLINE.',.07,.85,.43,.038);break;
    case 'scroll':
        a.title('Y2K',.055,.16,.29,.43,{font:F.sans});a.hero(.48,.51,.2,.7,'heart');
        a.title('BABY DOLL',.63,.32,.34,.14,{font:F.sans});a.small('ALWAYS ONLINE / 2000',.64,.66,.32,.05);
        a.asset('chrome-star',.335,.23,.3,-15);a.asset('pixel-arrow',.585,.71,.22,-10);break;
    default:
        a.panel('paper',.06,.1,.52,.8,'数码照片页');a.hero(.32,.49,.43,.7,'heart');
        a.title('CYBER\nANGEL',.6,.18,.35,.17,{font:F.sans,h:.42});a.small('Y2K / MY FAVORITE.exe',.61,.09,.33,.033);
        a.asset('holo-cross',.55,.78,.33,10);a.asset('chrome-heart',.88,.79,.25,-10);
        a.small('ALL FOR YOU,\nALWAYS ONLINE.',.68,.68,.24,.034,{h:.11});
    }
}

function french(a,k){
    a.base();
    switch(k){
    case 'chip':
        a.asset('doily',.18,.5,.94,0,false);a.hero(.18,.5,.22,.59,'circle');
        a.title('Mon amour',.36,.2,.59,.23);a.small('ATELIER / DE FLEURS',.39,.67,.53,.058);
        a.asset('pink-bow',.94,.57,.37,10);break;
    case 'compact':
        a.panel('soft',.02,.04,.46,.92,'蔷薇色衬纸');a.hero(.29,.49,.44,.67,'arch');
        a.title('Mon\namour',.56,.2,.39,.14,{h:.34});a.asset('rose',.81,.79,.34,-14);
        a.small('ATELIER / 01',.56,.61,.4,.042);break;
    case 'circle':
        a.asset('doily',.5,.49,.96,0,false);a.hero(.5,.49,.6,.6,'circle');
        a.asset('cream-bow',.5,.17,.27,0);a.asset('rose',.76,.78,.3,-15);
        a.title('Mon amour',.15,.88,.7,.065,{align:'center'});break;
    case 'polaroid':
        a.panel('soft',.03,.035,.94,.93,'粉雾相纸衬底');a.hero(.38,.435,.54,.66,'square','polaroid');
        a.asset('pink-bow',.18,.13,.31,-12);a.asset('rose',.78,.66,.39,-13);
        a.title('petite\nfleur',.71,.2,.25,.1,{h:.3});a.small('a love letter to you',.13,.86,.55,.038);break;
    case 'collage':
        a.asset('oval-lace',.36,.48,.9,0,false);a.hero(.36,.475,.35,.68,'arch');
        a.mini(.79,.64,.23,.39,'rect',7);a.title('Fleurs\ndu jour',.67,.14,.3,.105,{h:.27});
        a.asset('rose',.56,.82,.33,-16);a.asset('cream-bow',.17,.18,.23,-9);
        a.footer('MAISON STARGAZE / A LITTLE ROMANCE');break;
    case 'tower':
        a.title('La vie\nen rose',.1,.04,.82,.155,{h:.23});a.line(.1,.29,.8);
        a.hero(.5,.545,.68,.43,'arch');a.asset('cream-bow',.18,.35,.31,-12);
        a.asset('rose',.8,.77,.37,-12);a.title(NAME,.11,.85,.72,.075);
        a.footer('ATELIER DE FLEURS / PARIS');break;
    case 'banner':
        a.panel('soft',.57,0,.43,1,'蔷薇色肖像栏');a.hero(.765,.5,.29,.71,'arch');
        a.small('MAISON / STARGAZE',.07,.14,.44,.036);a.title('Mon amour',.065,.31,.48,.16);
        a.line(.07,.56,.42);a.small('A LITTLE ROMANCE, EVERY DAY.',.07,.65,.44,.036);
        a.asset('rose',.54,.81,.34,-17);a.asset('cream-bow',.92,.18,.23,10);break;
    case 'scroll':
        a.title('Mon amour',.06,.28,.47,.28);a.small('ATELIER DE FLEURS / POUR TOI',.065,.73,.44,.051);
        a.asset('doily',.69,.5,.98,0,false);a.hero(.69,.5,.17,.64,'circle');
        a.asset('rose',.89,.55,.65,-12);break;
    default:
        a.panel('soft',.02,.04,.54,.92,'粉雾肖像页');a.hero(.29,.49,.37,.74,'arch');
        a.small('MAISON / STARGAZE',.62,.12,.31,.035);a.title('La vie\nen rose',.61,.28,.33,.13,{h:.34});
        a.line(.62,.69,.3);a.small('A PAGE OF\nQUIET ROMANCE.',.62,.74,.27,.036,{h:.1});
        a.asset('rose',.5,.81,.36,-13);a.asset('cream-bow',.09,.17,.27,-9);
    }
}

function mecha(a,k){
    a.base('dark','tech');
    switch(k){
    case 'chip':
        a.panel('soft',.025,.09,.28,.82,'钢灰证件栏');a.hero(.165,.5,.23,.68,'hexagon');
        a.small('PERSONNEL / ARCHIVE',.36,.15,.59,.059,{color:'paper'});
        a.title('UNIT—07',.35,.36,.61,.24,{font:F.mono,color:'accent'});
        a.material('hazard',.36,.81,.55,.06);break;
    case 'compact':
        a.hero(.32,.49,.46,.67,'hexagon');a.ruleV(.59,.12,.76,'soft');
        a.title('UNIT\n07',.65,.16,.3,.16,{font:F.mono,color:'accent',h:.37});
        a.small('ACCESS\nGRANTED',.65,.66,.3,.047,{color:'paper',h:.15});a.asset('chain',.28,.88,.37,-5);break;
    case 'circle':
        a.disk(.5,.49,.88,'ring');a.hero(.5,.49,.61,.61,'hexagon');
        a.small('UNIT-07 / AUTHORIZED',.11,.07,.78,.041,{color:'accent',align:'center'});
        a.asset('silver-rings',.24,.75,.22,-10);a.small('SYSTEM ONLINE',.21,.875,.58,.05,{color:'paper',align:'center'});break;
    case 'polaroid':
        a.panel('soft',.04,.06,.67,.87,'工业证件纸');a.hero(.37,.425,.55,.61,'square','magazine');
        a.title('07',.76,.16,.2,.22,{font:F.mono,color:'accent'});
        a.small('UNIT\nARCHIVE',.75,.48,.22,.052,{color:'paper',h:.18});
        a.material('hazard',.1,.8,.55,.045);a.small('DO NOT REMOVE',.1,.88,.55,.036,{color:'dark'});break;
    case 'collage':
        a.panel('soft',.04,.09,.49,.82,'钢灰主档案');a.hero(.285,.48,.38,.66,'hexagon');
        a.title('UNIT—07',.59,.12,.35,.14,{font:F.mono,color:'accent'});
        a.small('MAINTENANCE LOG\nCLASS / A-2077',.6,.37,.34,.045,{color:'paper',h:.16});
        a.mini(.75,.75,.2,.32,'magazine',0);a.asset('chain',.47,.83,.35,-22);
        a.material('hazard',.06,.92,.43,.035);break;
    case 'tower':
        a.title('UNIT—07',.085,.045,.84,.15,{font:F.mono,color:'accent'});
        a.small('PERSONNEL / CLASSIFIED',.09,.17,.81,.035,{color:'paper'});
        a.hero(.5,.465,.78,.43,'hexagon');a.asset('chain',.75,.27,.37,-25);
        a.panel('paper',.07,.735,.86,.15,'检修日志');a.small('SYSTEM STATUS / ONLINE\nSERIAL 2077 / AUTHORIZED',.11,.768,.77,.04,{color:'dark',h:.08});
        a.material('hazard',.08,.93,.84,.025);break;
    case 'banner':
        a.hero(.73,.5,.35,.74,'hexagon');a.ruleV(.5,.13,.74,'soft');
        a.small('PERSONNEL / ARCHIVE',.07,.14,.37,.038,{color:'paper'});
        a.title('UNIT\n—07',.065,.27,.35,.18,{font:F.mono,color:'accent',h:.42});
        a.small('SYSTEM ONLINE / 2077',.075,.79,.37,.04,{color:'paper'});a.asset('chain',.89,.84,.32,-20);break;
    case 'scroll':
        a.title('UNIT—07',.045,.24,.41,.3,{font:F.mono,color:'accent'});
        a.hero(.59,.5,.18,.72,'hexagon');a.ruleV(.73,.17,.66,'soft');
        a.small('ACCESS GRANTED\nSERIAL / 2077\nSYSTEM ONLINE',.77,.32,.21,.06,{color:'paper',h:.37});
        a.material('hazard',.05,.82,.38,.045);break;
    default:
        a.panel('soft',.035,.065,.49,.87,'主档案钢板');a.hero(.28,.49,.39,.74,'hexagon');
        a.small('RESTRICTED / 2077',.59,.1,.34,.035,{color:'paper'});
        a.title('UNIT\n—07',.58,.23,.34,.19,{font:F.mono,color:'accent',h:.43});
        a.small('MAINTENANCE LOG\nDO NOT REMOVE',.59,.75,.33,.043,{color:'paper',h:.12});
        a.asset('chain',.49,.82,.34,-28);a.material('hazard',.055,.9,.44,.035);
    }
}

function fairy(a,k){
    a.base();
    switch(k){
    case 'chip':
        a.panel('soft',0,0,.33,1,'奶油色头像页');a.hero(.18,.5,.23,.63,'blob');
        a.title('little story',.36,.21,.6,.21);a.small('PICNIC / CHAPTER 01',.38,.66,.55,.057);
        a.asset('doodle-stars',.91,.17,.25,10);break;
    case 'compact':
        a.hero(.32,.49,.48,.64,'blob');a.title('little\nstory',.6,.19,.36,.135,{h:.34});
        a.asset('story-bear',.8,.77,.33,5);a.asset('doodle-stars',.13,.14,.18,-8);
        a.small('CHAPTER 01',.07,.89,.48,.04);break;
    case 'circle':
        a.disk(.5,.5,.88);a.hero(.5,.49,.61,.61,'blob');
        a.asset('rainbow',.5,.135,.37,0);a.asset('story-bear',.23,.77,.28,-5);
        a.asset('doodle-stars',.81,.29,.2,10);a.title('little story',.28,.86,.58,.07,{align:'center'});break;
    case 'polaroid':
        a.panel('soft',.035,.04,.93,.92,'绘本奶油衬底');a.hero(.38,.435,.55,.65,'square','polaroid');
        a.asset('story-cake',.8,.71,.4,-4);a.title('a sweet\nday',.72,.18,.23,.105,{h:.3});
        a.asset('doodle-stars',.17,.13,.2,-10);a.small('a page of happiness',.12,.86,.56,.037);break;
    case 'collage':
        a.panel('soft',.04,.1,.53,.81,'故事主画面');a.hero(.31,.48,.4,.67,'blob');
        a.title('ONCE UPON\nA PICNIC',.63,.12,.33,.106,{h:.26});
        a.mini(.79,.63,.24,.37,'rect',5);a.asset('story-bear',.55,.81,.34,-6);
        a.asset('doodle-stars',.14,.15,.2,-9);a.footer('LITTLE THINGS / HAPPY ENDINGS');break;
    case 'tower':
        a.title('LITTLE\nSTORY',.11,.035,.8,.17,{h:.23});a.asset('rainbow',.84,.16,.28,9);
        a.hero(.5,.48,.77,.44,'blob');a.asset('doodle-stars',.17,.29,.23,-8);
        a.asset('story-bear',.24,.83,.39,-4);a.title('a very\nhappy day.',.5,.775,.46,.085,{h:.14});
        a.footer('CHAPTER 01 / AND THE STORY GOES ON');break;
    case 'banner':
        a.panel('soft',.49,0,.51,1,'故事照片页');a.hero(.73,.49,.35,.71,'blob');
        a.title('a little\nhappy day.',.065,.21,.4,.155,{h:.39});
        a.small('PICNIC / CHAPTER 01',.075,.12,.36,.034);a.asset('story-bear',.45,.81,.33,-5);
        a.asset('doodle-stars',.94,.18,.24,12);a.small('AND THE STORY GOES ON…',.07,.84,.36,.034);break;
    case 'scroll':
        a.asset('story-bear',.07,.57,.63,-4);a.title('little story',.18,.24,.42,.27);
        a.small('A PICNIC / A HAPPY DAY / CHAPTER 01',.18,.74,.44,.046);
        a.hero(.79,.5,.18,.7,'blob');a.asset('rainbow',.91,.15,.36,9);break;
    default:
        a.panel('soft',.05,.06,.5,.88,'绘本插页');a.hero(.3,.49,.4,.72,'blob');
        a.title('Once upon\na picnic.',.6,.21,.34,.125,{h:.34});
        a.small('CHAPTER 01 / LITTLE STORY',.61,.11,.32,.032);a.line(.61,.64,.3);
        a.asset('story-bear',.63,.82,.32,-5);a.small('A VERY\nHAPPY DAY.',.77,.78,.2,.045,{h:.14});
        a.asset('doodle-stars',.11,.15,.24,-8);
    }
}

function letter(a,k){
    a.base();
    switch(k){
    case 'chip':
        a.hero(.17,.49,.22,.69,'square');a.ruleV(.315,.16,.69);
        a.title('A letter to you',.36,.19,.5,.19);a.small('POEM / A QUIET AFTERNOON',.37,.68,.48,.05);
        a.asset('botanical',.95,.5,.7,8);break;
    case 'compact':
        a.hero(.315,.46,.46,.68,'square','rect');a.title('Dear\nyou,',.62,.19,.33,.14,{h:.35});
        a.asset('botanical',.81,.78,.3,8);a.small('POEM / 01',.08,.88,.54,.043);break;
    case 'circle':
        a.disk(.5,.49,.88,'ring');a.hero(.5,.49,.6,.6,'circle');
        a.small('A LETTER TO YOU',.19,.03,.62,.038,{align:'center'});a.asset('botanical',.78,.72,.34,13);
        a.title('dear you,',.24,.92,.52,.055,{align:'center'});break;
    case 'polaroid':
        a.material('ivory-paper',.045,.03,.66,.94);a.hero(.38,.43,.54,.66,'square','polaroid');
        a.title('Dear\nyou,',.74,.18,.22,.12,{h:.3});a.asset('botanical',.81,.71,.4,9);
        a.small('written on a quiet afternoon',.1,.86,.59,.031);break;
    case 'collage':
        a.panel('rules',.04,.1,.46,.81,'信笺文字页');a.title('A letter\nto you.',.08,.21,.41,.135,{h:.33});
        a.small('SOME WORDS\nARE MEANT TO STAY.',.09,.65,.35,.037,{h:.14});
        a.hero(.73,.47,.4,.69,'square','rect');a.asset('envelope',.47,.85,.25,-8);
        a.footer('POEM / CORRESPONDENCE Nº 01');break;
    case 'tower':
        a.small('CORRESPONDENCE / 01',.11,.06,.8,.037);a.title('A letter\nto you.',.1,.13,.82,.15,{h:.22});
        a.hero(.5,.54,.69,.39,'square','rect');a.asset('botanical',.84,.73,.33,10);
        a.title('Some words\nare meant to stay.',.12,.79,.76,.07,{h:.13});a.footer('WRITTEN ON A QUIET AFTERNOON');break;
    case 'banner':
        a.hero(.26,.5,.32,.71,'square','rect');a.ruleV(.48,.12,.76);
        a.small('POEM / CORRESPONDENCE',.55,.16,.4,.035);a.title('Dear you,',.55,.33,.4,.15);
        a.text('Some words are\nmeant to stay.',.555,.59,.34,.052,{h:.15});
        a.asset('botanical',.94,.76,.35,7);a.footer('A LETTER FROM A QUIET AFTERNOON');break;
    case 'scroll':
        a.title('A letter to you.',.055,.25,.48,.24);a.small('WRITTEN ON A QUIET AFTERNOON / POEM Nº 01',.06,.73,.48,.043);
        a.hero(.73,.5,.17,.73,'square');a.ruleV(.59,.14,.72);
        a.asset('botanical',.91,.51,.76,8);break;
    default:
        a.hero(.72,.48,.38,.72,'square','rect');a.small('POEM / CORRESPONDENCE Nº 01',.075,.12,.4,.034);
        a.title('A letter\nto you.',.07,.26,.41,.135,{h:.35});a.line(.08,.67,.35);
        a.text('Some words are\nmeant to stay.',.08,.73,.3,.053,{h:.15});a.asset('botanical',.49,.83,.33,8);
    }
}

function stamp(a,k){
    a.base('soft');
    switch(k){
    case 'chip':
        a.panel('perf',.015,.05,.97,.9,'集邮标签齿孔');a.hero(.17,.5,.23,.69,'square','stamp');
        a.title('COLLECT',.34,.24,.58,.23);a.small('PRIVATE COLLECTION / Nº 01',.35,.68,.58,.053);break;
    case 'compact':
        a.panel('perf',.035,.04,.93,.92,'收藏卡齿孔');a.hero(.3,.47,.43,.7,'square','stamp');
        a.title('COLLECT',.57,.21,.36,.105);a.asset('stamp-red',.77,.64,.36,-6);
        a.small('ISSUE / 01',.09,.88,.47,.041);break;
    case 'circle':
        a.disk(.5,.49,.9,'ring');a.hero(.5,.49,.61,.61,'circle','stamp');
        a.small('PRIVATE COLLECTION',.16,.03,.68,.037,{align:'center'});
        a.asset('stamp-green',.79,.74,.25,9);a.title('Nº 01 / COLLECT',.2,.92,.64,.05,{align:'center'});break;
    case 'polaroid':
        a.panel('perf',.04,.06,.65,.88,'收藏相片齿孔纸');a.hero(.36,.45,.51,.65,'square','stamp');
        a.title('Nº 01',.74,.15,.21,.13);a.asset('stamp-red',.82,.56,.37,5);
        a.small('COLLECT / ARCHIVE',.1,.84,.53,.04);a.asset('seat',.82,.88,.25,-6);break;
    case 'collage':
        a.panel('perf',.035,.07,.54,.86,'主收藏页');a.hero(.3,.49,.4,.67,'square','stamp');
        a.title('COLLECT',.63,.1,.32,.11);a.asset('stamp-red',.7,.5,.35,-6);
        a.asset('stamp-green',.88,.69,.32,8);a.asset('ticket',.75,.9,.31,-3);
        a.small('A SMALL MUSEUM OF YOU',.07,.93,.5,.027);break;
    case 'tower':
        a.panel('perf',.045,.03,.91,.94,'集邮册扉页');a.small('PRIVATE COLLECTION / 01',.12,.085,.75,.032);
        a.title('COLLECT',.11,.14,.79,.145);a.hero(.5,.46,.66,.4,'square','stamp');
        a.asset('stamp-green',.27,.82,.29,-6);a.asset('stamp-red',.6,.82,.3,5);
        a.small('ISSUE 2026',.12,.932,.75,.03);break;
    case 'banner':
        a.panel('paper',.035,.08,.93,.84,'集邮册横页');a.hero(.28,.5,.31,.7,'square','stamp');
        a.small('PRIVATE COLLECTION / Nº 01',.53,.16,.4,.033);a.title('COLLECT',.525,.32,.41,.14);
        a.line(.53,.56,.37);a.asset('stamp-green',.62,.77,.27,-5);a.asset('stamp-red',.8,.77,.28,6);break;
    case 'scroll':
        a.panel('perf',.012,.05,.976,.9,'长幅齿孔页');a.hero(.16,.5,.18,.72,'square','stamp');
        a.title('COLLECT',.3,.23,.42,.25);a.small('A SMALL MUSEUM OF YOU / ISSUE 2026',.31,.7,.41,.049);
        a.asset('stamp-green',.81,.51,.67,-6);a.asset('stamp-red',.94,.65,.48,8);break;
    default:
        a.panel('paper',.035,.06,.93,.88,'集邮册大页');a.hero(.28,.49,.36,.72,'square','stamp');
        a.small('PRIVATE COLLECTION / Nº 01',.55,.13,.38,.034);a.title('COLLECT',.545,.29,.4,.135);
        a.line(.55,.53,.36);a.asset('stamp-green',.64,.75,.33,-6);a.asset('stamp-red',.83,.76,.35,6);
        a.small('A SMALL MUSEUM OF YOU',.07,.93,.43,.025);
    }
}

function gothic(a,k){
    a.base('dark','damask');
    switch(k){
    case 'chip':
        a.hero(.18,.5,.22,.69,'arch');a.ruleV(.32,.18,.64,'accent');
        a.title('NOCTURNE',.37,.24,.59,.21);a.small('THE NIGHT REMEMBERS / XIII',.39,.68,.55,.048,{color:'accent'});
        a.asset('black-moth',.94,.17,.23,-12);break;
    case 'compact':
        a.panel('soft',.04,.07,.47,.86,'暗紫肖像底');a.hero(.29,.49,.39,.69,'arch');
        a.title('NOC\nTURNE',.59,.19,.35,.13,{h:.34});a.small('XIII / ETERNAL',.59,.64,.34,.04,{color:'accent'});
        a.asset('black-moth',.83,.84,.3,-10);break;
    case 'circle':
        a.disk(.5,.49,.89,'ring');a.hero(.5,.49,.57,.66,'arch','arch');
        a.asset('black-moth',.76,.75,.3,-12);a.small('NOCTURNE / XIII',.16,.025,.68,.038,{color:'accent',align:'center'});
        a.small('ETERNAL',.26,.93,.48,.034,{color:'accent',align:'center'});break;
    case 'polaroid':
        a.panel('soft',.04,.06,.65,.88,'古堡相片底');a.hero(.36,.445,.5,.7,'arch');
        a.title('XIII',.74,.17,.2,.18);a.asset('candle',.81,.67,.46,-4);
        a.small('NOCTURNE',.13,.85,.49,.046,{color:'accent'});break;
    case 'collage':
        a.panel('soft',.03,.08,.55,.84,'古堡肖像页');a.hero(.31,.48,.4,.71,'arch');
        a.title('NOC\nTURNE',.66,.16,.29,.13,{h:.31});a.asset('candle',.76,.74,.4,-3);
        a.asset('black-moth',.55,.82,.29,-13);a.footer('THE NIGHT REMEMBERS EVERYTHING',.94,'accent');break;
    case 'tower':
        a.title('NOCTURNE',.075,.055,.87,.13);a.small('THE NIGHT REMEMBERS / XIII',.1,.16,.8,.031,{color:'accent'});
        a.hero(.5,.49,.7,.46,'arch','arch');a.asset('feather',.82,.74,.31,-20);
        a.title('eternal',.2,.83,.6,.09,{align:'center'});a.footer('IN THE QUIET OF THE NIGHT',.94,'accent');break;
    case 'banner':
        a.hero(.73,.5,.3,.75,'arch');a.ruleV(.48,.13,.74,'accent');
        a.small('ARCHIVE / XIII',.07,.14,.35,.04,{color:'accent'});a.title('NOC\nTURNE',.065,.29,.36,.17,{h:.41});
        a.asset('black-moth',.45,.81,.29,-11);a.small('THE NIGHT REMEMBERS',.075,.84,.37,.035,{color:'accent'});break;
    case 'scroll':
        a.title('NOCTURNE',.055,.28,.52,.29);a.small('THE NIGHT REMEMBERS EVERYTHING / XIII',.06,.74,.51,.047,{color:'accent'});
        a.hero(.74,.5,.14,.73,'arch');a.asset('black-moth',.91,.51,.65,-8);break;
    default:
        a.panel('soft',.035,.06,.49,.88,'维多利亚肖像页');a.hero(.28,.49,.35,.76,'arch');
        a.title('NOC\nTURNE',.59,.24,.33,.17,{h:.4});a.small('ARCHIVE / XIII / 1897',.6,.12,.32,.033,{color:'accent'});
        a.line(.6,.72,.3);a.small('THE NIGHT\nREMEMBERS EVERYTHING.',.6,.78,.28,.037,{color:'accent',h:.1});
        a.asset('black-moth',.51,.83,.28,-13);
    }
}

function sweetcool(a,k){
    a.base();
    switch(k){
    case 'chip':
        a.panel('soft',0,0,.33,1,'雾蓝头像栏');a.hero(.18,.5,.23,.65,'circle');
        a.title('SWEET REBEL',.36,.23,.61,.185,{font:F.sans,color:'accent'});
        a.small('CHERRY BLUE / Nº 10',.38,.67,.56,.055);a.asset('blue-cherries',.94,.78,.24,-10);break;
    case 'compact':
        a.panel('soft',.53,0,.47,1,'冷蓝杂志栏');a.hero(.295,.48,.43,.69,'square','rect');
        a.title('SWEET\nREBEL',.59,.16,.34,.125,{font:F.sans,color:'accent',h:.32});
        a.asset('blue-cherries',.8,.75,.34,-10);a.small('Nº 10 / 2004',.08,.89,.46,.04);break;
    case 'circle':
        a.disk(.5,.49,.9);a.hero(.5,.49,.61,.61,'circle');
        a.asset('blue-bow',.5,.17,.29,0);a.asset('blue-cherries',.77,.77,.29,-10);
        a.small('SWEET REBEL',.22,.88,.56,.05,{color:'accent',align:'center'});break;
    case 'polaroid':
        a.panel('soft',.04,.04,.92,.92,'冷蓝即时成像纸');a.hero(.385,.43,.54,.65,'square','polaroid');
        a.title('SWEET\nREBEL',.73,.18,.23,.09,{font:F.sans,color:'accent',h:.25});
        a.asset('blue-cherries',.8,.72,.39,-9);a.asset('paperclip',.18,.13,.19,12);
        a.small('cream, blue & a little attitude',.12,.86,.58,.029);break;
    case 'collage':
        a.panel('soft',.03,.08,.52,.84,'蓝调照片页');a.hero(.3,.48,.4,.68,'square','rect');
        a.mini(.8,.66,.24,.38,'rect',6);a.title('SWEET\nREBEL',.64,.14,.32,.112,{font:F.sans,color:'accent',h:.27});
        a.asset('blue-cherries',.55,.83,.3,-10);a.asset('paperclip',.16,.17,.2,13);
        a.footer('CHERRY BLUE / A LITTLE ATTITUDE');break;
    case 'tower':
        a.title('SWEET\nREBEL',.08,.03,.86,.18,{font:F.sans,color:'accent',h:.24});
        a.hero(.5,.495,.77,.45,'square','rect');a.asset('blue-bow',.81,.29,.31,10);
        a.asset('blue-cherries',.23,.82,.37,-10);a.title('a little\nattitude.',.51,.79,.43,.085,{h:.14});
        a.footer('CHERRY BLUE / Nº 10 / 2004');break;
    case 'banner':
        a.panel('soft',.51,0,.49,1,'蓝调肖像栏');a.hero(.755,.5,.34,.74,'square','rect');
        a.small('CHERRY BLUE / Nº 10',.065,.13,.4,.037);a.title('SWEET\nREBEL',.06,.27,.4,.18,{font:F.sans,color:'accent',h:.41});
        a.asset('blue-cherries',.47,.82,.31,-9);a.small('CREAM, BLUE & A LITTLE ATTITUDE.',.07,.85,.41,.03);break;
    case 'scroll':
        a.title('SWEET REBEL',.05,.24,.56,.25,{font:F.sans,color:'accent'});
        a.small('CHERRY BLUE / Nº 10 / A LITTLE ATTITUDE',.055,.73,.54,.043);
        a.hero(.76,.5,.17,.73,'circle');a.asset('blue-cherries',.93,.53,.63,-10);break;
    default:
        a.panel('soft',.04,.06,.5,.88,'冷蓝主照片页');a.hero(.29,.49,.39,.74,'square','rect');
        a.small('CHERRY BLUE / Nº 10',.61,.11,.31,.034);a.title('SWEET\nREBEL',.6,.25,.34,.16,{font:F.sans,color:'accent',h:.38});
        a.line(.61,.71,.29);a.small('CREAM, BLUE &\nA LITTLE ATTITUDE.',.61,.76,.3,.039,{h:.11});
        a.asset('blue-cherries',.51,.83,.29,-11);a.asset('paperclip',.13,.14,.18,13);
    }
}

const BUILDERS={school,hk,y2k,french,mecha,fairy,letter,stamp,gothic,sweetcool};
export function buildEditorial(W,H,kit,key){
    const a=new Art(W,H,kit,key);
    BUILDERS[kit.id](a,key);
    return a.finish();
}
