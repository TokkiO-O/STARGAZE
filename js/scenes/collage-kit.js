import { F, img, txt, G, ASPECT } from '../assets/base.js';
import { MAXIMAL_ASSETS } from '../assets/maximal.js';
import { MAXIMAL_PROFILES } from './maximal-profiles.js';

const LABELS = new Map(MAXIMAL_ASSETS.map(a => [a.id, a.name]));
export const MAXIMAL_SURFACES = [];
for (const [id, profile] of Object.entries(MAXIMAL_PROFILES)) {
    const p = profile.colors;
    const add = (key, name, body) => MAXIMAL_SURFACES.push({ ...G(`v10:mx-surface-${id}-${key}`, name, '极繁版式底材', '0 0 400 400', body), styleId:id, hidden:true });
    for (const key of ['paper','soft','ink','accent','dark','pop']) add(key, '主题色纸', `<rect width="400" height="400" fill="${p[key]}"/>`);
    add('torn','手撕边衬纸',`<path d="M2 18L29 10 51 19 76 6 99 15 126 4 151 16 178 8 203 18 230 6 259 14 285 5 307 15 334 8 359 18 389 7 398 18 393 385 369 394 344 382 318 397 292 386 264 397 239 385 216 395 188 384 164 396 136 385 110 396 85 385 58 395 35 383 6 394Z" fill="${id==='gothic'?p.soft:p.paper}"/>`);
    add('circle','日期圆签',`<circle cx="200" cy="200" r="194" fill="${p.paper}"/><circle cx="200" cy="200" r="177" fill="none" stroke="${p.accent}" stroke-width="4"/>`);
    add('ring','细线圆环',`<circle cx="200" cy="200" r="190" fill="none" stroke="${p.accent}" stroke-width="2"/>`);
    add('border','排版细框',`<rect x="8" y="8" width="384" height="384" fill="none" stroke="${p.accent}" stroke-width="2"/>`);
    add('grid','细格纹底纸',`<defs><pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="${p.accent}" stroke-width=".7" opacity=".4"/></pattern></defs><rect width="400" height="400" fill="url(#g)"/>`);
    add('ruled','手账横线纸',`<defs><pattern id="r" width="400" height="25" patternUnits="userSpaceOnUse"><path d="M0 24H400" stroke="${p.accent}" stroke-width=".7" opacity=".35"/></pattern></defs><rect width="400" height="400" fill="url(#r)"/><path d="M45 0V400" stroke="${p.accent}" opacity=".35"/>`);
    add('news','报刊分栏底纹',`<g fill="${p.ink}" opacity=".15">${Array.from({length:25},(_,i)=>[0,1,2].map(j=>`<rect x="${12+j*132}" y="${10+i*16}" width="${[103,111,95][(i+j)%3]}" height="2"/>`).join('')).join('')}</g>`);
    add('holo','虹彩玻璃纸',`<defs><linearGradient id="h" x2="1" y2="1"><stop stop-color="#c5e9f4"/><stop offset=".35" stop-color="#e6d4f5"/><stop offset=".7" stop-color="#f9c8e5"/><stop offset="1" stop-color="#a7d6f0"/></linearGradient></defs><rect width="400" height="400" fill="url(#h)"/><path d="M0 230L400 15M0 270L400 55" stroke="white" opacity=".35" stroke-width="3"/>`);
    add('damask','菱花纹底纸',`<defs><pattern id="d" width="60" height="80" patternUnits="userSpaceOnUse"><path d="M30 3L57 40 30 77 3 40Z" stroke="${p.accent}" stroke-width="1" fill="none" opacity=".23"/><path d="M30 22V58M20 40H40M23 30Q30 38 37 30M23 50Q30 42 37 50" fill="none" stroke="${p.accent}" opacity=".23"/></pattern></defs><rect width="400" height="400" fill="url(#d)"/>`);
    add('tech','工业坐标底纹',`<g stroke="${p.ink}" opacity=".35" fill="none"><path d="M20 70V20H70M330 20H380V70M20 330V380H70M330 380H380V330" stroke-width="3"/><path d="M0 200H400M200 0V400" stroke-dasharray="2 12"/><circle cx="200" cy="200" r="160" stroke-dasharray="5 8"/></g>`);
    add('perf','齿孔收藏纸',`<rect x="5" y="5" width="390" height="390" fill="${p.paper}" stroke="${p.soft}" stroke-width="10" stroke-dasharray="3 12"/><rect x="23" y="23" width="354" height="354" fill="none" stroke="${p.accent}" stroke-width="1.2"/>`);
    add('barcode','收藏条码',`<g fill="${p.ink}">${Array.from({length:43},(_,i)=>`<rect x="${i*9+6}" y="2" width="${[2,5,3,1][i%4]}" height="${i%8===0?96:85}"/>`).join('')}</g>`);
    add('holes','活页装订孔',`<g fill="${p.soft}" stroke="${p.paper}" stroke-width="4">${[32,98,164,230,296,362].map(y=>`<circle cx="18" cy="${y}" r="11"/>`).join('')}</g>`);
}

const GROUPS={bg:'底纹与叠纸',main:'主头像',left:'副图与相册',right:'相片条与特写',type:'标题与字组',flowers:'主题小物',hardware:'链条与装订',details:'票签与标注'};
let measureContext;
/** 比例排版工具：所有装饰保留原比例；照片独立记录取景和来源角色。 */
export class CollagePage {
    constructor(W,H,profile,key){Object.assign(this,{W,H,p:profile,key,u:Math.min(W,H),elements:[],groups:new Map(),photoCount:0});}
    add(e,label,group='bg',front=false,finish='flat'){
        const gid=`${group}-${front?'front':'back'}`;
        Object.assign(e,{label,groupId:gid,layer:front?'front':'back',finish});this.elements.push(e);
        if(!this.groups.has(gid))this.groups.set(gid,{id:gid,name:GROUPS[group],z:e.z,layer:e.layer,collapsed:group==='bg',visibilityMode:'mask'});
        return e;
    }
    surface(key,x,y,w,h,r=0,o=1,z=1,label='版式衬纸',front=false,group='bg'){
        return this.add(img(`v10:mx-surface-${this.p.id}-${key}`,x*this.W,y*this.H,w*this.W,h*this.H,{r,o,z,fit:'fill'}),label,group,front);
    }
    material(slug,x,y,w,h,r=0,o=1,z=1.3,label='',front=false,group='bg',fit='contain'){
        const id='v10:mx-'+slug;
        return this.add(img(id,x*this.W,y*this.H,w*this.W,h*this.H,{r,o,z,fit}),label||LABELS.get(id)||slug,group,front,'soft');
    }
    art(slug,x,y,size,r=0,front=true,group='flowers',z=6,o=1){
        const ar=ASPECT['v10:mx-'+slug]||1,d=size*this.u,w=ar>=1?d:d*ar,h=ar>=1?d/ar:d;
        return this.material(slug,x-w/this.W/2,y-h/this.H/2,w/this.W,h/this.H,r,o,z,'',front,group);
    }
    motif(n,...args){return this.art(this.p.art[n%this.p.art.length],...args);}
    hardware(n,...args){
        const slug=this.p.hardware[n%this.p.hardware.length];
        if(slug==='gold-clip'||slug==='black-clip')args[2]*=.72;
        return this.art(slug,...args);
    }
    type(value,x,y,w,s,opts={}){
        const font=opts.font||this.p.font;let size=s*this.u;
        measureContext ||= document.createElement('canvas').getContext('2d');measureContext.font=`${size}px ${font}`;
        const lines=String(value).replace(/\{\{[^|]+\|([^}]+)\}\}/g,'$1').split('\n');
        const measured=Math.max(...lines.map(l=>measureContext.measureText(l).width),1);
        size=Math.max(2.5,Math.min(size,size*w*this.W*.97/measured,opts.h?opts.h*this.H/(1.25*lines.length):size));
        const e=txt(value,x*this.W,y*this.H,w*this.W,size,{font,color:this.p.colors[opts.color||'ink']||opts.color,align:opts.align||'left',r:opts.r||0,z:opts.z||8,o:opts.opacity??1,stroke:opts.stroke||0});
        if(opts.h)e.height=opts.h*this.H;
        return this.add(e,opts.label||value.replace(/\n/g,' '),'type',!!opts.front);
    }
    mono(value,x,y,w,s=.028,opts={}){return this.type(value,x,y,w,s,{font:F.mono,...opts});}
    tag(value,x,y,w,h,opts={}){
        this.surface(opts.fill||'ink',x,y,w,h,opts.r||0,1,7,'文字票签',true,'details');
        this.type(value,x+.025*w,y+.07*h,w*.95,opts.size||h*this.H/this.u*.58,{font:opts.font||F.mono,color:opts.color||'paper',r:opts.r||0,align:opts.align||'center',front:true});
    }
    photo(x,y,w,h,shape=this.p.small,r=0,zoom=1.3,fx=50,fy=40,group='left',front=true){
        const e=this.add(img('__avatar__',(x-w/2)*this.W,(y-h/2)*this.H,w*this.W,h*this.H,{shape:shape==='rounded'?'rect':shape,r,z:4.2,zoom,fx,fy,fit:'cover'}),`副图 ${++this.photoCount} · 独立取景`,group,front,'soft');
        Object.assign(e,{photoRole:'secondary',photoSlotId:`${this.p.id}-${this.key}-${this.photoCount}`,slotName:`副图 ${this.photoCount}`,defaultCrop:{cropZoom:zoom,focusX:fx,focusY:fy}});return e;
    }
    hero(x,y,w,h,shape=this.p.shape){
        this.units=Math.min(w*this.W,h*this.H);this.anchorX=x;this.anchorY=y;
        this.avatar={shape:shape==='rect'?'square':shape,frameStyle:shape==='rect'?'rect':'none',widthRatio:w*this.W/this.units,heightRatio:h*this.H/this.units,focusX:50,focusY:39};
        const e=this.add(img('__avatar__',(x-w/2)*this.W,(y-h/2)*this.H,w*this.W,h*this.H,{shape,z:4,fit:'cover'}),'主头像 · 默认单图','main');e.photoRole='main';
    }
    line(x,y,w,front=false,o=.8){this.surface('ink',x,y,w,.6/this.H,0,o,7,'排版细线',front,'details');}
    number(value,x,y,s,front=true){
        const d=s*this.u;this.surface('circle',x-d/this.W/2,y-d/this.H/2,d/this.W,d/this.H,0,1,7,'收藏编号',front,'details');
        this.mono(value,x-d/this.W*.45,y-d/this.H*.18,d/this.W*.9,s*.3,{align:'center',front,z:8});
    }
    base(){
        this.surface(this.p.id==='gothic'?'dark':'soft',0,0,1,1,0,1,0,'主题底纸');
        this.surface(this.p.paper,0,0,1,1,0,.75,.1,'主题底纹');
        this.material(this.p.backing,-.06,.15,.48,.8,this.p.tilt,1,.5,'左侧肌理纸');
        this.surface('torn',.07,.065,.86,.87,-this.p.tilt*.4,1,.7,'手撕纸主衬');
        this.surface(this.p.paper,.09,.085,.82,.83,-this.p.tilt*.4,.4,.8,'纸上叠印纹理');
    }
    finish(){
        return {elements:this.elements,avatarUnits:this.units,avatar:this.avatar,anchorX:this.anchorX,anchorY:this.anchorY,groups:[...this.groups.values()],theme:{...this.p.colors,secondary:this.p.colors.soft}};
    }
}
