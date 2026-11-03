import { F, img, txt, G, ASPECT } from '../assets/base.js';
import { MAXIMAL_ASSETS as STUDY_ASSETS } from '../assets/maximal.js';
const LABELS=new Map(STUDY_ASSETS.map(a=>[a.id,a.name]));

const P={paper:'#fffdf5',soft:'#d5e7f0',accent:'#6095b2',ink:'#244b65',secondary:'#a9c9da',dark:'#244b65'};
const C=(k)=>P[k]||k;
const svg=(id,name,body,box='0 0 400 400')=>G('v10:study-surface-'+id,name,'打样版式底材',box,body);
export const STUDY_SURFACES=[
    ...['paper','soft','accent','ink','secondary'].map(k=>svg(k,'版式色纸',`<rect width="400" height="400" fill="${P[k]}"/>`)),
    svg('grid','蓝色笔记方格',`<defs><pattern id="g" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" fill="none" stroke="#6793ac" stroke-width=".9" opacity=".32"/></pattern></defs><rect width="400" height="400" fill="url(#g)"/>`),
    svg('ruled','蓝色横线纸',`<defs><pattern id="r" width="400" height="26" patternUnits="userSpaceOnUse"><path d="M0 25H400" stroke="#81abc1" stroke-width=".8" opacity=".65"/></pattern></defs><rect width="400" height="400" fill="#fffdf5"/><rect width="400" height="400" fill="url(#r)"/><path d="M47 0V400" stroke="#c0adab" opacity=".55"/>`),
    svg('torn','手撕奶油纸',`<path d="M2 18L29 10 51 19 76 6 99 15 126 4 151 16 178 8 203 18 230 6 259 14 285 5 307 15 334 8 359 18 389 7 398 18 393 385 369 394 344 382 318 397 292 386 264 397 239 385 216 395 188 384 164 396 136 385 110 396 85 385 58 395 35 383 6 394Z" fill="#fffdf5"/>`),
    svg('ticket','蓝色索引票',`<path d="M2 2H398V158Q367 175 398 194V398H2V194Q33 175 2 158Z" fill="#d5e7f0"/><rect x="13" y="13" width="374" height="374" fill="none" stroke="#6095b2" stroke-width="1.7"/><path d="M285 20V380" stroke="#6095b2" stroke-dasharray="4 5"/>`),
    svg('circle','圆形号码底',`<circle cx="200" cy="200" r="192" fill="#fffdf5"/><circle cx="200" cy="200" r="178" fill="none" stroke="#6095b2" stroke-width="4"/>`),
    svg('dots','蓝色小波点',`<defs><pattern id="d" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="2.6" fill="#487b98" opacity=".3"/></pattern></defs><rect width="400" height="400" fill="url(#d)"/>`),
    svg('holes','活页装订孔',`<g fill="#9ab8ca" stroke="#f8fcff" stroke-width="4">${[35,101,167,233,299,365].map(y=>`<circle cx="18" cy="${y}" r="11"/>`).join('')}</g>`,'0 0 40 400'),
    svg('stitch','虚线相纸边',`<rect x="7" y="7" width="386" height="386" rx="5" fill="none" stroke="#7da3b9" stroke-width="2" stroke-dasharray="6 6"/>`),
];
let context;
const names={bg:'底纹与纸张',main:'主头像',left:'左侧相册',right:'右侧相片条',type:'标题与字组',flowers:'花朵与缎带',hardware:'夹子与链条',details:'票据与细节'};
class Page{
    constructor(W,H){this.W=W;this.H=H;this.u=Math.min(W,H);this.elements=[];this.seq=0;this.photoCount=0;this.key="";this.groups=new Map();}
    add(e,label,group,front=false,finish='flat'){
        const gid=group+'-'+(front?'front':'back');
        Object.assign(e,{label,groupId:gid,layer:front?'front':'back',finish});
        this.elements.push(e);
        if(!this.groups.has(gid))this.groups.set(gid,{id:gid,name:names[group],z:e.z,layer:e.layer,collapsed:group==='bg',visibilityMode:'mask'});
        return e;
    }
    surface(key,x,y,w,h,r=0,o=1,z=1,label='版式衬纸',front=false,group='bg'){
        return this.add(img('v10:study-surface-'+key,x*this.W,y*this.H,w*this.W,h*this.H,{r,o,z,fit:'fill'}),label,group,front);
    }
    material(slug,x,y,w,h,r=0,o=1,z=1.3,label='',front=false,group='bg',fit='contain'){
        const id=slug.startsWith('background-')?'v10:school-pattern-'+slug.slice(11):'v10:mx-study-'+slug;
        return this.add(img(id,x*this.W,y*this.H,w*this.W,h*this.H,{r,o,z,fit}),LABELS.get(id)||label||slug,group,front,'soft');
    }
    art(slug,x,y,size,r=0,front=true,group='flowers',z=6,o=1){
        const ar=ASPECT['v10:mx-study-'+slug]||1,d=size*this.u;
        const w=ar>=1?d:d*ar,h=ar>=1?d/ar:d;
        return this.material(slug,x-w/this.W/2,y-h/this.H/2,w/this.W,h/this.H,r,o,z,slug,front,group);
    }
    type(value,x,y,w,s,opts={}){
        const font=opts.font||F.serif;let size=s*this.u;
        context ||= document.createElement('canvas').getContext('2d');context.font=`${size}px ${font}`;
        const lines=String(value).replace(/\{\{[^|]+\|([^}]+)\}\}/g,'$1').split('\n'),width=Math.max(...lines.map(l=>context.measureText(l).width),1);
        size=Math.min(size,size*w*this.W*.97/width,opts.h?opts.h*this.H/(1.25*lines.length):size);
        const e=txt(value,x*this.W,y*this.H,w*this.W,size,{font,color:C(opts.color||'ink'),align:opts.align||'left',r:opts.r||0,z:opts.z||8,o:opts.opacity??1,stroke:opts.stroke||0});
        if(opts.h)e.height=opts.h*this.H;
        if(String(value).includes('{{'))e.autoFit=true;
        return this.add(e,opts.label||value.replace(/\n/g,' '),'type',!!opts.front);
    }
    mono(value,x,y,w,s=.028,opts={}){return this.type(value,x,y,w,s,{font:F.mono,...opts});}
    tag(value,x,y,w,h,opts={}){
        this.surface(opts.fill||'ink',x,y,w,h,opts.r||0,1,7,'标题贴纸',true,'details');
        this.type(value,x+.025*w,y+.09*h,w*.95,opts.size||h*this.H/this.u*.57,{font:opts.font||F.mono,color:opts.color||'paper',r:opts.r||0,align:opts.align||'center',front:true});
    }
    photo(x,y,w,h,shape='rect',r=0,zoom=1.3,fx=50,fy=40,group='left',front=false){
        const e=this.add(img('__avatar__',(x-w/2)*this.W,(y-h/2)*this.H,w*this.W,h*this.H,{shape,r,z:4.2,zoom,fx,fy,fit:'cover'}),`副图 ${++this.photoCount} · 独立取景`,group,front,'soft');Object.assign(e,{photoRole:'secondary',slotName:`副图 ${this.photoCount}`,photoSlotId:`school-${this.key}-${this.photoCount}`,defaultCrop:{cropZoom:zoom,focusX:fx,focusY:fy}});return e;
    }
    hero(x,y,w,h){
        this.units=Math.min(w*this.W,h*this.H);this.anchorX=x;this.anchorY=y;
        this.avatar={shape:'square',frameStyle:'rect',widthRatio:w*this.W/this.units,heightRatio:h*this.H/this.units,focusX:50,focusY:39};
        const e=this.add(img('__avatar__',(x-w/2)*this.W,(y-h/2)*this.H,w*this.W,h*this.H,{shape:'rect',z:4,fit:'cover'}),'主头像 · 默认单图','main');e.photoRole='main';
    }
    line(x,y,w,front=false,o=.8){this.surface('ink',x,y,w,.7/this.H,0,o,7,'排版细线',front,'details');}
    number(value,x,y,s,front=true){
        const d=s*this.u;this.surface('circle',x-d/this.W/2,y-d/this.H/2,d/this.W,d/this.H,0,1,7,'圆形日期标',front,'details');
        this.mono(value,x-d/this.W*.45,y-d/this.H*.18,d/this.W*.9,s*.3,{align:'center',front,z:8});
    }
    done(){return {elements:this.elements,avatarUnits:this.units,avatar:this.avatar,anchorX:this.anchorX,anchorY:this.anchorY,groups:[...this.groups.values()],theme:{...P}};}
}

function banner(p){
    p.surface('soft',0,0,1,1,0,1,0,'雾蓝底纸');
    p.material('background-banner',0,0,1,1,0,1,.1,'细格纹与碎花底纸',false,'bg','fill');
    p.surface('torn',.065,.08,.82,.87,-3,1,.6,'斜放奶油纸');
    p.surface('grid',.06,.075,.85,.88,-3,.6,.65,'奶油纸上的方格');
    p.material('lined-note',-.045,.28,.42,.66,-8,1,1.1,'左侧横线便签');
    p.material('double-paper',.325,.015,.42,.99,3,1,1.3,'主照片叠层衬纸');
    p.surface('ink',.74,.24,.2,.68,8,.93,1.7,'右侧相片条深蓝衬纸');
    p.surface('paper',.751,.25,.18,.65,8,1,1.8,'右侧相片条白纸');
    p.art('doily',.158,.49,.67,0,false,'left',2);
    p.photo(.165,.475,.213,.43,'circle',-7,1.25,48,35,'left');
    p.art('pearl-round',.165,.475,.48,-7,true,'left',5.5);
    p.hero(.535,.533,.365,.885);
    p.photo(.82,.386,.148,.205,'rect',8,1.85,53,18,'right',true);
    p.photo(.806,.592,.148,.205,'rect',8,1.18,45,66,'right',true);
    p.photo(.793,.795,.148,.205,'rect',8,1.55,52,24,'right',true);
    p.photo(.3,.82,.134,.25,'rect',-12,2.65,52,18,'left',true);
    p.type('MILK',.035,.018,.35,.24,{z:3.1});
    p.type('DAY',.748,.04,.24,.175,{r:3,front:true,stroke:.45});
    p.type('my favorite chapter',.07,.685,.33,.071,{font:F.hand,r:-7,front:true,stroke:.6,z:9});
    p.tag('AFTER SCHOOL',.345,.846,.29,.082,{r:-3,size:.054});
    p.mono('a page for the little things',.388,.939,.34,.022,{front:true});
    p.mono('PHOTO\nBOOTH',.922,.48,.068,.033,{h:.14,r:5,front:true});
    p.art('pearl-wave',.3,.215,.91,-3,false,'hardware',3.3);
    p.art('pearl-curve',.1,.66,.56,-20,true,'hardware',5.5);
    p.art('satin-bow',.066,.285,.31,-13,true,'flowers',7);
    p.art('star-clip',.373,.08,.2,-16,true,'hardware',7);
    p.art('paperclip',.881,.275,.18,18,true,'hardware',7);
    p.art('telephone',.923,.872,.38,8,true,'flowers',7.2);
    p.art('camera',.112,.91,.28,-12,true,'flowers',7.2);
    p.art('milk',.026,.69,.32,-14,true,'flowers',7);
    p.art('daisy',.678,.9,.3,10,true,'flowers',8);
    p.art('daisy',.065,.72,.18,-14,true,'flowers',8);
    p.art('white-daisy',.739,.928,.16,-4,true,'flowers',8.1);
    p.art('butterfly',.89,.202,.22,22,true,'flowers',7);
    p.art('plane',.242,.185,.22,-14,true,'flowers',7);
    p.art('star',.946,.42,.16,15,true,'flowers',6.5);
    p.material('torn-strip',.055,.803,.17,.045,-7,1,7.5,'贴在照片上的撕纸条',true,'details','fill');
    p.mono('04 / 08',.062,.808,.15,.029,{r:-7,front:true});
    p.material('lace-strip',.015,.975,.98,.045,0,.93,8.3,'底部白色蕾丝收边',true,'hardware','fill');
    p.number('01',.35,.275,.09);p.number('02',.735,.68,.075);
    p.tag('KEEP THIS MOMENT',.412,.051,.25,.05,{fill:'paper',color:'ink',size:.031,r:2});
    p.mono('✦',.317,.56,.035,.065,{front:true,color:'accent'});
}

function tower(p){
    p.surface('soft',0,0,1,1,0,1,0,'雾蓝封面底纸');
    p.material('background-tower',0,0,1,1,0,1,.1,'细格纹与碎花底纸',false,'bg','fill');
    p.surface('torn',.035,.08,.92,.85,4,1,.6,'手撕奶油封面');
    p.surface('ruled',.07,.09,.86,.82,4,.6,.7,'封面横线');
    p.material('double-paper',.08,.125,.93,.63,-3,1,1,'主照片叠纸');
    p.surface('holes',.007,.1,.049,.8,0,.88,1.2,'活页装订孔');
    p.material('ivory-paper',.019,.61,.47,.38,-10,1,1.2,'左下折痕纸');
    p.hero(.535,.431,.85,.605);
    p.art('doily',.124,.346,.56,0,true,'left',4.1);
    p.photo(.151,.34,.3,.205,'circle',-9,1.85,48,22,'left',true);
    p.art('pearl-round',.151,.34,.32,-9,true,'left',5.2);
    p.photo(.229,.793,.36,.23,'rect',-10,1.2,41,65,'left',true);
    p.photo(.766,.798,.33,.23,'polaroid',8,1.65,52,23,'right',true);
    p.type('MILK DAY',.035,.012,.94,.205,{z:3.2});
    p.tag('THE AFTER SCHOOL ISSUE',.21,.111,.72,.04,{r:-3,size:.031});
    p.type('{{name|Mira}}',.33,.605,.61,.14,{font:F.hand,r:-8,front:true,stroke:1.1});
    p.type('small things,\nhappy days.',.41,.854,.29,.044,{h:.063,front:true,font:F.hand,r:3});
    p.mono('JOURNAL / 01',.43,.968,.25,.021,{align:'center',front:true});
    p.mono('MILK & SALT\nSCHOOL CLUB',.762,.515,.19,.026,{h:.05,front:true,r:90,color:'paper'});
    p.art('pearl-wave',.52,.215,.95,0,false,'hardware',3.8);
    p.art('satin-bow',.88,.193,.36,18,true,'flowers',7);
    p.art('star-clip',.22,.127,.24,-10,true,'hardware',7);
    p.art('paperclip',.916,.682,.18,18,true,'hardware',7);
    p.art('pearl-curve',.165,.57,.59,-15,false,'hardware',3.7);
    p.art('pearl-vertical',.95,.525,.53,-3,true,'hardware',5.3);
    p.art('butterfly',.142,.557,.22,-17,true,'flowers',6.2);
    p.art('star',.92,.6,.19,16,true,'flowers',6.2);
    p.art('plane',.15,.198,.23,-15,true,'flowers',6.2);
    p.art('daisy',.48,.724,.32,-17,true,'flowers',7.5);
    p.art('white-daisy',.579,.754,.17,6,true,'flowers',7.6);
    p.art('daisy',.018,.636,.2,-12,true,'flowers',7.5);
    p.art('cassette',.223,.927,.39,-13,true,'flowers',8);
    p.art('telephone',.87,.932,.36,9,true,'flowers',8);
    p.art('milk',.076,.859,.25,-13,true,'flowers',8.1);
    p.material('torn-strip',.025,.665,.3,.041,-9,1,7.4,'副照片标签底纸',true,'details','fill');
    p.mono('CAPTURE / 04:08',.035,.676,.27,.027,{r:-9,front:true});
    p.number('01',.85,.064,.11);p.number('08',.363,.586,.09);
    p.tag('NOTES FROM YOU',.46,.544,.33,.037,{fill:'paper',color:'ink',size:.028,r:4});
    p.material('lace-strip',-.01,.984,1.02,.035,0,1,8.4,'底部蕾丝条',true,'hardware','fill');
    p.art('pearl-bow',.363,.828,.2,-12,true,'hardware',7.5);
    p.mono('✦',.04,.403,.08,.065,{front:true,color:'paper'});
}

function chip(p){
    p.surface('soft',0,0,1,1,0,1,0,'蓝色标签底纸');
    p.material('background-chip',0,0,1,1,0,1,.1,'细格纹与碎花底纸',false,'bg','fill');
    p.surface('torn',.04,.07,.92,.87,-2,1,.6,'横向手撕纸');
    p.surface('grid',.04,.075,.92,.84,-2,.6,.7,'手撕纸细方格');
    p.material('double-paper',.337,-.035,.36,1.09,-3,1,1.2,'主头像叠纸');
    p.art('doily',.133,.52,.88,0,false,'left',2);
    p.photo(.137,.51,.232,.69,'circle',-7,1.45,46,34,'left');
    p.art('pearl-round',.137,.51,.75,-7,true,'left',5.4);
    p.hero(.525,.515,.31,.97);
    p.surface('ink',.73,.12,.235,.76,7,.95,1.5,'右侧深蓝照片底');
    p.photo(.842,.489,.181,.627,'rect',7,1.85,53,23,'right',true);
    p.type('MILK\nDAY',.264,.157,.16,.136,{h:.37,front:true,stroke:.3,r:-3});
    p.tag('AFTER SCHOOL',.694,.765,.28,.115,{r:4,size:.061});
    p.mono('MY FAVORITE CHAPTER',.013,.926,.35,.031,{front:true});
    p.art('satin-bow',.045,.162,.36,-14,true,'flowers',7);
    p.art('star-clip',.395,.082,.25,-12,true,'hardware',7);
    p.art('paperclip',.924,.16,.25,17,true,'hardware',7);
    p.art('pearl-wave',.244,.113,.91,-3,false,'hardware',3.3);
    p.art('daisy',.34,.856,.39,-14,true,'flowers',7.5);
    p.art('white-daisy',.389,.922,.19,4,true,'flowers',7.6);
    p.art('cassette',.715,.939,.41,-14,true,'flowers',7.5);
    p.art('star',.972,.576,.28,10,true,'flowers',6.5);
    p.art('butterfly',.72,.173,.25,17,true,'flowers',7);
    p.art('milk',.018,.808,.36,-12,true,'flowers',7.4);
    p.number('01',.285,.665,.17);
    p.material('lace-strip',-.01,.989,1.02,.038,0,1,8.2,'底边蕾丝',true,'hardware','fill');
    p.mono('✦',.672,.5,.04,.07,{front:true,color:'accent'});
}

export function buildMaximalSchool(W,H,key){
    const p=new Page(W,H);p.key=key;({banner,tower,chip}[key])(p);p.mono('COLLECTION / 01',.01,.035,.2,.023,{front:true,color:'accent'});p.art('pearl-bow',.67,.965,.14,8,true,'hardware',8.2);if(key!=='chip'){p.line(.015,.945,.18,true,.5);p.mono('a little archive',.78,.025,.2,.025,{font:F.hand,front:true,r:3});}return p.done();
}
