import { G, img, ASPECT, F } from '../../assets/base.js';
import { CollagePage } from '../collage-kit.js';
import {REVIEWED_MATERIALS} from '../../assets/reviewed.js';
import {registerRuntimeAsset} from '../../assets/runtime.js';

export const PALETTES={
 school:{paper:'#F5F2E9',accent:'#93AEBF',soft:'#E7C3C6',ink:'#425865',dark:'#566874'},
 hk:{paper:'#F0E6D2',accent:'#8B2635',soft:'#cfc1a7',ink:'#2B2B2B',dark:'#2B2B2B'},
 y2k:{paper:'#F0F8FF',accent:'#4D9FFF',soft:'#FF4D8F',ink:'#263859',dark:'#445e8e'},
 french:{paper:'#FFF5F5',accent:'#D4A5A5',soft:'#A8B8C8',ink:'#756570',dark:'#91838c'},
 mecha:{paper:'#d2d1cc',accent:'#B5453A',soft:'#8A8A8A',ink:'#e6e6e0',dark:'#3A3A3A'},
 fairy:{paper:'#F8F0D8',accent:'#A8C8E8',soft:'#E85A6A',ink:'#57586a',dark:'#7289a5'},
 letter:{paper:'#F5F0E8',accent:'#3A5A4A',soft:'#C8453A',ink:'#39483d',dark:'#3A5A4A'},
 stamp:{paper:'#F8F4E8',accent:'#B5453A',soft:'#3A5A8A',ink:'#344760',dark:'#3A5A8A'},
 gothic:{paper:'#e1d6d4',accent:'#8B2635',soft:'#8A8AA8',ink:'#c5bbc9',dark:'#1A1A2E'},
 sweetcool:{paper:'#FFF5F5',accent:'#A8B8D8',soft:'#E8455A',ink:'#5a617a',dark:'#6c7b9c'},
};
export const REVIEWED_SURFACES=[];
const surfaceIndex=new Map();
function surfaceKey(text){let a=2166136261,b=5381;for(let i=0;i<text.length;i++){a=Math.imul(a^text.charCodeAt(i),16777619);b=Math.imul(b,33)^text.charCodeAt(i);}return (a>>>0).toString(16)+(b>>>0).toString(16);}
const MATERIALS=REVIEWED_MATERIALS;

// 主题内的换材清单：移除旧稿里串风格的素材，保留各画幅自己的位置与比例。
const MATERIAL_REPLACEMENTS={
 school:{'pearl-shell':'memo-book','study-butterfly':'memos','study-blue-player':'notebook'},
 hk:{'rev-postage-train':'cinema','stamp-flower':'ticket'},
 french:{'record-player':'ivory-envelope','burgundy-book':'letter-papers','butterfly':'embroidery'},
 mecha:{'chrome-flower':'gear','spike-star':'hinge','old-camera':'pipe-cross','chrome-heart':'rev-rivet-heart','camera':'pipe-cross'},
 fairy:{'moth':'stars-crayon','moon':'cloud-crayon','story-bear':'story-teapot','toy-phone':'pencils'},
 letter:{'ink-set':'fountain-pen','bird':'mail-sealed','globe':'letter-papers'},
 stamp:{'stamp-green':'cat-postage','stamp-red':'rev-postage-train','stamp-blue':'postcards','herb-paper':'postage-paper'},
 sweetcool:{'gamepad':'card-sleeve','blue-player':'memos','chain-black':'ribbon-white','chrome-flower':'star-jelly'},
};

const QR=[[true, true, true, true, true, true, true, false, false, true, false, false, true, true, true, true, true, false, true, true, false, false, true, true, true, true, true, true, true], [true, false, false, false, false, false, true, false, false, false, true, true, true, false, true, true, true, true, true, true, true, false, true, false, false, false, false, false, true], [true, false, true, true, true, false, true, false, true, true, true, false, true, false, true, false, true, false, false, false, true, false, true, false, true, true, true, false, true], [true, false, true, true, true, false, true, false, false, true, true, true, false, false, false, true, true, false, true, false, false, false, true, false, true, true, true, false, true], [true, false, true, true, true, false, true, false, false, false, true, false, false, false, false, true, true, false, false, true, false, false, true, false, true, true, true, false, true], [true, false, false, false, false, false, true, false, false, true, false, false, false, true, false, true, false, false, true, true, false, false, true, false, false, false, false, false, true], [true, true, true, true, true, true, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, true, true, true, true, true, true], [false, false, false, false, false, false, false, false, true, true, true, false, true, true, false, true, false, true, true, false, true, false, false, false, false, false, false, false, false], [true, true, true, false, true, true, true, true, true, false, true, true, false, true, true, false, true, true, true, false, false, true, true, false, false, false, true, false, false], [true, true, false, false, false, true, false, true, true, false, true, true, false, false, false, false, false, true, false, false, true, true, true, false, false, true, false, false, false], [true, false, true, true, false, false, true, false, false, true, false, false, false, true, false, false, true, false, true, false, false, true, true, true, true, false, false, true, true], [false, true, false, true, true, false, false, true, false, false, false, true, false, true, false, false, true, true, false, true, true, false, false, false, true, false, false, false, false], [false, true, false, false, true, false, true, true, false, false, false, false, true, true, true, true, true, true, false, false, true, true, true, false, false, false, true, false, true], [false, false, false, false, false, true, false, true, false, true, false, true, true, true, true, false, true, false, true, false, true, true, true, false, false, false, false, true, false], [true, false, true, true, true, false, true, true, false, true, false, true, true, false, true, false, false, false, false, false, true, false, true, false, true, true, false, true, true], [true, false, true, false, true, true, false, false, false, true, false, false, true, true, false, false, true, true, false, false, false, false, true, true, false, false, false, true, false], [false, false, false, false, true, true, true, true, true, false, true, true, false, false, true, true, true, true, true, false, false, true, true, false, false, false, true, true, true], [false, true, true, false, true, false, false, false, false, true, false, true, false, false, false, false, true, true, false, false, true, true, true, true, false, true, false, false, false], [true, false, true, false, false, false, true, true, false, true, true, false, false, true, false, false, false, false, true, false, true, false, false, false, true, true, true, true, true], [false, true, false, false, true, false, false, false, true, false, true, true, false, false, false, true, false, true, false, true, false, true, false, false, true, false, false, false, true], [true, false, false, false, false, true, true, false, false, true, true, false, true, false, false, true, true, true, false, false, true, true, true, true, true, true, true, false, true], [false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, true, true, true, false, true, false, false, false, true, true, true, false, false], [true, true, true, true, true, true, true, false, true, true, true, true, true, false, true, false, false, true, false, true, true, false, true, false, true, false, false, true, true], [true, false, false, false, false, false, true, false, true, false, false, false, true, true, true, false, false, true, false, false, true, false, false, false, true, false, false, true, false], [true, false, true, true, true, false, true, false, true, true, false, true, false, false, true, false, false, true, false, false, true, true, true, true, true, false, true, false, false], [true, false, true, true, true, false, true, false, false, true, true, true, false, false, true, false, true, true, false, true, false, false, false, false, true, false, false, true, true], [true, false, true, true, true, false, true, false, true, false, false, false, false, true, false, false, true, false, false, false, true, false, false, true, true, true, true, false, true], [true, false, false, false, false, false, true, false, true, false, true, true, false, false, false, false, false, true, true, true, true, true, false, true, false, true, false, true, false], [true, true, true, true, true, true, true, false, true, false, true, false, true, false, false, false, false, true, false, false, true, true, true, false, true, false, false, true, true]];


// 比例、纸面、相片位的绘制工具；各主题和尺寸的构图分别在 layouts.js 中定义。
export class ReviewPage extends CollagePage{
 constructor(id,W=680,H=390){
  super(W,H,{id,colors:{...PALETTES[id]},font:F.serif,hand:F.hand,small:'rect',shape:'rect'},H>W?'tower':'poster');
  this.key='poster';this.used=new Set();this.inventory=[];
 }
 graphic(name,body,x=0,y=0,w=1,h=1,r=0,z=1,front=false,group='bg',box=`0 0 ${this.W} ${this.H}`){
  const key=surfaceKey(box+'|'+body);let a=surfaceIndex.get(key);
  if(!a){a={...G('v10:reviewed-surface-'+key,name,'素材修订纸面',box,body),hidden:true};surfaceIndex.set(key,a);REVIEWED_SURFACES.push(a);registerRuntimeAsset(a);}
  return this.add(img(a.id,x*this.W,y*this.H,w*this.W,h*this.H,{r,z,fit:'fill'}),name,group,front);
 }
 fill(color,x=0,y=0,w=1,h=1,r=0,z=0,o=1){
  const c=this.p.colors[color]||color;
  return this.graphic('主题色纸',`<rect width="400" height="400" fill="${c}" opacity="${o}"/>`,x,y,w,h,r,z,false,'bg','0 0 400 400');
 }
 grain(color='paper'){
  this.fill(color);
  this.graphic('细纸纤维',`<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".76" numOctaves="3" seed="18"/><feColorMatrix type="saturate" values="0"/></filter><rect width="400" height="400" fill="#615a50" opacity=".09" filter="url(#grain)"/>`,0,0,1,1,0,.12,false,'bg','0 0 400 400');
 }
 screened(slug){slug=slug.replace(/^new:/,'');return MATERIAL_REPLACEMENTS[this.p.id]?.[slug]||slug;}
 asset(slug){return MATERIALS.get(this.screened(slug));}
 material(slug,x,y,w,h,r=0,o=1,z=1,label='',front=false,group='bg',fit='contain'){
  slug=this.screened(slug);
  const a=MATERIALS.get(slug);if(!a)throw new Error('未筛选的素材：'+slug);
  this.inventory.push(slug);
  return this.add(img(a.id,x*this.W,y*this.H,w*this.W,h*this.H,{r,o,z,fit}),label||a.name,group,front,'soft');
 }
 paper(slug,x,y,w,h,r=0,z=1,o=1){return this.material(slug,x,y,w,h,r,o,z,'',false,'bg','cover');}
 art(slug,x,y,size,r=0,z=7,front=true,group='flowers'){
  slug=this.screened(slug);
  const a=MATERIALS.get(slug);if(!a)throw new Error('未筛选的实物：'+slug);
  if(this.used.has(a.sourceId))throw new Error('同一画面重复实物：'+slug);
  this.used.add(a.sourceId);
  const d=size*this.u,ar=a.aspect,w=ar>=1?d:d*ar,h=ar>=1?d/ar:d;
  return this.material(slug,x-w/this.W/2,y-h/this.H/2,w/this.W,h/this.H,r,1,z,'',front,group);
 }
 photo(...args){const e=super.photo(...args);e.caption='';e.showCaption=false;return e;}
 main(x,y,w,h,shape='rect',zoom=1.10,fy=27){
  this.hero(x,y,w,h,shape);this.avatar.frameStyle='none';this.avatar.frame=zoom;this.avatar.focusY=fy;
  const marker=this.elements.find(e=>e.photoRole==='main');marker.caption='';marker.showCaption=false;
 }
 mat(x,y,w,h,r=0,color='paper',z=3,edge){
  const W=w*this.W,H=h*this.H,c=this.p.colors[color]||color,border=edge||this.p.colors.accent;
  return this.graphic('相纸装裱',`<rect x="1" y="1" width="${W-2}" height="${H-2}" rx="2" fill="${c}" stroke="${border}" stroke-width=".7"/>`,x,y,w,h,r,z,false,'bg',`0 0 ${W} ${H}`);
 }
 ruled(x,y,w,h,r=0,color='accent',pitch=17,z=1.2){
  const W=w*this.W,H=h*this.H,c=this.p.colors[color]||color;
  this.graphic('横线信纸',`<g stroke="${c}" opacity=".35" stroke-width=".65">${Array.from({length:Math.ceil(H/pitch)},(_,i)=>`<path d="M0 ${i*pitch+8}H${W}"/>`).join('')}</g>`,x,y,w,h,r,z,false,'bg',`0 0 ${W} ${H}`);
 }
 grid(x,y,w,h,r=0,color='accent',pitch=16,z=1){
  const W=w*this.W,H=h*this.H,c=this.p.colors[color]||color;
  this.graphic('方格便笺',`<g stroke="${c}" stroke-width=".5" opacity=".30">${Array.from({length:Math.ceil(W/pitch)},(_,i)=>`<path d="M${i*pitch} 0V${H}"/>`).join('')}${Array.from({length:Math.ceil(H/pitch)},(_,i)=>`<path d="M0 ${i*pitch}H${W}"/>`).join('')}</g>`,x,y,w,h,r,z,false,'bg',`0 0 ${W} ${H}`);
 }
 check(x,y,w,h,color='soft',size=13,z=.4){
  const c=this.p.colors[color]||color;
  this.graphic('细格织纹纸',`<defs><pattern id="g" width="${size*2}" height="${size*2}" patternUnits="userSpaceOnUse"><rect width="${size}" height="${size*2}" fill="${c}" opacity=".28"/><rect width="${size*2}" height="${size}" fill="${c}" opacity=".28"/></pattern></defs><rect width="${w*this.W}" height="${h*this.H}" fill="url(#g)"/>`,x,y,w,h,0,z,false,'bg',`0 0 ${w*this.W} ${h*this.H}`);
 }
 tag(text,x,y,w,h,color='accent',ink='paper',r=0,z=7){
  this.graphic('功能纸签',`<rect width="400" height="400" fill="${this.p.colors[color]||color}"/>`,x,y,w,h,r,z,true,'details','0 0 400 400');
  const t=this.type(text,x+w*.07,y+h*.17,w*.86,h*this.H/this.u*.49,{font:F.mono,color:this.p.colors[ink]||ink,r,z:z+.1,front:true,label:'功能标签 · '+text});
  return t;
 }
 framedHero(slug,x,y,size,shape='rect',zoom=1.1){
  const a=MATERIALS.get(slug),d=size*this.u,ow=a.aspect>=1?d:d*a.aspect,oh=a.aspect>=1?d/a.aspect:d;
  const hole=a.opening||{x:.15,y:.15,w:.7,h:.7};
  const left=x*this.W-ow/2,top=y*this.H-oh/2;
  this.main((left+(hole.x+hole.w/2)*ow)/this.W,(top+(hole.y+hole.h/2)*oh)/this.H,(hole.w*ow+1)/this.W,(hole.h*oh+1)/this.H,shape,zoom);
  this.art(slug,x,y,size,0,5.2,true,'main');
 }
 framedPhoto(slug,x,y,size,shape='rect',r=0,zoom=1.7){
  const a=MATERIALS.get(slug),d=size*this.u,ow=a.aspect>=1?d:d*a.aspect,oh=a.aspect>=1?d/a.aspect:d;
  const hole=a.opening||{x:.15,y:.15,w:.7,h:.7};
  const left=x*this.W-ow/2,top=y*this.H-oh/2;
  this.photo((left+(hole.x+hole.w/2)*ow)/this.W,(top+(hole.y+hole.h/2)*oh)/this.H,hole.w*ow/this.W,hole.h*oh/this.H,shape,r,zoom,50,25);
  this.art(slug,x,y,size,r,5.3,true,'left');
 }
 postage(x,y,w,h,r=0,color='soft',z=3){
  const W=w*this.W,H=h*this.H,c=this.p.colors[color]||color;
  // 齿孔按像素间距沿矩形纸边排列，不使用花瓣或椭圆蕾丝冒充邮票。
  const step=9,rad=2.1;
  let circles='';
  for(let px=5;px<W;px+=step)circles+=`<circle cx="${px}" cy="1" r="${rad}"/><circle cx="${px}" cy="${H-1}" r="${rad}"/>`;
  for(let py=5;py<H;py+=step)circles+=`<circle cx="1" cy="${py}" r="${rad}"/><circle cx="${W-1}" cy="${py}" r="${rad}"/>`;
  this.graphic('矩形邮票齿孔纸',`<defs><mask id="edge"><rect width="${W}" height="${H}" fill="white"/><g fill="black">${circles}</g></mask></defs><rect width="${W}" height="${H}" fill="#fffdf5" mask="url(#edge)"/><rect x="7" y="7" width="${W-14}" height="${H-14}" fill="none" stroke="${c}" stroke-width="1.3"/>`,x,y,w,h,r,z,false,'bg',`0 0 ${W} ${H}`);
 }
 postmark(x,y,size,r=0,color='dark',waves=true){
  const c=this.p.colors[color]||color;
  this.graphic('邮政注销印记',`<g fill="none" stroke="${c}" stroke-width="1.5" opacity=".62"><circle cx="45" cy="45" r="39"/><circle cx="45" cy="45" r="33"/><path d="M14 33H75M14 58H75"/>${waves?[21,31,41,51,61,71].map(y=>`<path d="M78 ${y}q15 -8 30 0t30 0t30 0"/>`).join(''):''}</g>`,x,y,size*1.65*this.u/this.W,size*this.u/this.H,r,7.3,true,'details','0 0 170 90');
 }
 airmail(x,y,w,h,r=0,z=.5){
  const W=w*this.W,H=h*this.H;
  this.graphic('航空信封红蓝封边',`<defs><pattern id="air" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(-40)"><rect width="30" height="30" fill="#f8f4e8"/><rect width="10" height="30" fill="#B5453A"/><rect x="20" width="10" height="30" fill="#3A5A8A"/></pattern></defs><rect x="0" y="0" width="${W}" height="${H}" fill="url(#air)"/><rect x="6" y="6" width="${W-12}" height="${H-12}" fill="#F8F4E8"/><path d="M9 10L${W/2} ${H*.53}L${W-9} 10M9 ${H-10}L${W*.32} ${H*.58}M${W-9} ${H-10}L${W*.68} ${H*.58}" fill="none" stroke="#9d9786" stroke-width=".65"/>`,x,y,w,h,r,z,false,'bg',`0 0 ${W} ${H}`);
 }
 metal(x,y,w,h,r=0,color='soft',z=2.4){
  const W=w*this.W,H=h*this.H,c=this.p.colors[color]||color;
  const screws=[[6,6],[W-6,6],[6,H-6],[W-6,H-6]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="3.2" fill="#999b9c" stroke="#252628" stroke-width=".8"/><path d="M${a-1.7} ${b+1.1}l3.4 -2.2" stroke="#343537" stroke-width="1"/>`).join('');
  this.graphic('带固定螺钉的金属装夹板',`<defs><linearGradient id="s" x2=".95" y2=".6"><stop stop-color="#d7d9d8"/><stop offset=".35" stop-color="${c}"/><stop offset=".7" stop-color="#a4a6a4"/><stop offset="1" stop-color="#55595a"/></linearGradient><filter id="wear"><feTurbulence baseFrequency=".055 .45" numOctaves="2" seed="8"/><feColorMatrix type="saturate" values="0"/></filter></defs><path d="M10 1H${W-2}V${H-10}L${W-12} ${H-1}H1V11Z" fill="url(#s)" stroke="#222426" stroke-width="1.3"/><rect x="4" y="4" width="${W-8}" height="${H-8}" fill="#202124" opacity=".15" filter="url(#wear)"/><path d="M12 9H${W-13}M9 ${H-12}H${W-15}" stroke="#dededa" stroke-width=".6" opacity=".65"/>${screws}`,x,y,w,h,r,z,false,'bg',`0 0 ${W} ${H}`);
 }
 qr(x,y,size){
  const n=QR.length+8;
  this.graphic('可扫描的样稿资料码',`<rect width="${n}" height="${n}" fill="#e3e2dc"/><g fill="#252628">${QR.flatMap((row,j)=>row.map((v,i)=>v?`<rect x="${i+4}" y="${j+4}" width="1" height="1"/>`:'')).join('')}</g>`,x,y,size*this.u/this.W,size*this.u/this.H,0,7.6,true,'details',`0 0 ${n} ${n}`);
 }
 book(x=.015,y=.025,w=.97,h=.95){
  const W=w*this.W,H=h*this.H;
  this.graphic('绘本展开页',`<path d="M2 8Q${W*.25} -4 ${W*.5} 12Q${W*.76} -4 ${W-2} 8V${H-6}Q${W*.76} ${H-16} ${W*.5} ${H-1}Q${W*.25} ${H-16} 2 ${H-6}Z" fill="#F8F0D8" stroke="#c8b78e" stroke-width="1"/><path d="M${W*.5} 13V${H-4}" stroke="#bca77d" opacity=".4"/><path d="M10 13Q${W*.25} 1 ${W*.48} 17M${W*.52} 17Q${W*.75} 1 ${W-10} 13M10 ${H-12}Q${W*.25} ${H-22} ${W*.48} ${H-8}M${W*.52} ${H-8}Q${W*.75} ${H-22} ${W-10} ${H-12}" fill="none" stroke="#ad9a77" stroke-width=".8" stroke-dasharray="2 3"/>`,x,y,w,h,0,.5,false,'bg',`0 0 ${W} ${H}`);
 }
 surface(key,x,y,w,h,r=0,o=1,z=1,label='主题色纸',front=false,group='bg'){
  if(this.p.colors[key])return this.fill(this.p.colors[key],x,y,w,h,r,z,o);
  return super.surface(key,x,y,w,h,r,o,z,label,front,group);
 }
 legacy(id,x=0,y=0,w=1,h=1,r=0,z=1,front=false,group='bg'){
  return this.add(img(id,x*this.W,y*this.H,w*this.W,h*this.H,{r,z,fit:'fill'}),'原稿纸面细节',group,front);
 }
 edge(color='accent',z=.6){
  this.graphic('纸边细线',`<rect x="12" y="12" width="656" height="366" fill="none" stroke="${this.p.colors[color]}" stroke-width=".65" opacity=".48"/>`,0,0,1,1,0,z,false,'bg','0 0 680 390');
 }
 window(x,y,w,h,r=0,z=2){
  const W=w*this.W,H=h*this.H;
  this.graphic('透明千禧相片窗口',`<rect x="1" y="1" width="${W-2}" height="${H-2}" rx="3" fill="#edf8ff" fill-opacity=".92" stroke="#729bc7" stroke-width="1.3"/><rect x="5" y="5" width="${W-10}" height="11" fill="#bcd4f4"/><path d="M7 19H${W-7}" stroke="#729bc7" stroke-width=".65"/><g fill="#fff8ff" stroke="#729bc7" stroke-width=".5">${[W-32,W-23,W-14].map(n=>`<rect x="${n}" y="7" width="6" height="6"/>`).join('')}</g>`,x,y,w,h,r,z,false,'bg',`0 0 ${W} ${H}`);
 }
 bolt(x,y,size=.018,z=7){
  this.graphic('相片装夹螺钉','<defs><radialGradient id="b"><stop stop-color="#c2c4c1"/><stop offset="1" stop-color="#626663"/></radialGradient></defs><circle cx="10" cy="10" r="8" fill="url(#b)" stroke="#242728" stroke-width="1.3"/><path d="M6 13L14 7" stroke="#343636" stroke-width="1.6"/>',x-size*this.u/this.W/2,y-size/2,size*this.u/this.W,size,0,z,true,'hardware','0 0 20 20');
 }
 draw(...args){return this.graphic(...args);}
 a(slug,...args){return this.art(slug.replace(/^new:/,''),...args);}

}
