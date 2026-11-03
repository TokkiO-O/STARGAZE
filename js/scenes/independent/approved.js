import { G, img } from '../../assets/base.js';
import { CollagePage } from '../collage-kit.js';
import { MAXIMAL_PROFILES } from '../maximal-profiles.js';

const svg=(id,body,box='0 0 680 390')=>({...G('v10:curated-'+id,'纸面印记','版式细节',box,body),hidden:true});
export const CURATED_SURFACES=[
 svg('blue-rule','<g fill="none" stroke="#7195a8" opacity=".28"><path d="M18 18H662V372H18Z"/><path d="M28 24H652M28 366H652" stroke-dasharray="2 4"/></g>'),
 svg('receipt-lines','<g stroke="#533f2c" stroke-width=".65" opacity=".5"><path d="M16 18H664M16 23H664M16 368H664M16 373H664M426 34V355"/></g><g fill="#4a3929" opacity=".25">'+Array.from({length:25},(_,i)=>`<rect x="21" y="${38+i*12}" width="${[26,31,19,28][i%4]}" height="1.1"/>`).join('')+'</g>'),
 svg('french-line','<rect x="13" y="13" width="654" height="364" rx="2" fill="none" stroke="#a28b71" stroke-width=".7" opacity=".45"/><rect x="19" y="19" width="642" height="352" fill="none" stroke="#b79b83" stroke-width=".5" opacity=".45"/>'),
 svg('postmark','<g fill="none" stroke="#6d5960" opacity=".65"><circle cx="53" cy="53" r="43"/><circle cx="53" cy="53" r="36"/><path d="M19 43H87M19 64H87M95 35H155M95 43H155M95 51H155M95 59H155M95 67H155"/></g>','0 0 160 108'),
];

class Page extends CollagePage{
 constructor(W,H,id){super(W,H,MAXIMAL_PROFILES[id],'poster');this.decorations=new Set();}
 // 已确认的三套海报构图。实物贴饰各使用一次，保持确认稿的比例与层次。
 a(slug,x,y,s,r=0,front=true,group='flowers',z=7){
  if(this.decorations.has(slug))throw new Error('重复实物素材：'+slug);
  this.decorations.add(slug);return this.art(slug,x,y,s,r,front,group,z);
 }
 paper(slug,x,y,w,h,r=0,z=1,front=false){return this.material(slug,x,y,w,h,r,1,z,'叠放纸张',front,'bg','cover');}
 graphic(id,x=0,y=0,w=1,h=1,r=0,z=2,front=false){return this.add(img(id,x*this.W,y*this.H,w*this.W,h*this.H,{r,z,fit:'fill'}),'纸面印记','details',front);}
}

function school(W,H){
 const p=new Page(W,H,'school');
 // 大块底纸承担安静区，三组照片形成主次；细节集中在左下和右侧相册边缘。
 p.surface('soft',0,0,1,1,0,1,0,'雾蓝封底');p.graphic('v10:school-pattern-poster',0,0,1,1,0,.1);
 p.paper('study-ivory-paper',.035,.055,.92,.90,-2,.6);
 p.surface('pop',.015,.668,.31,.30,-6,1,.8,'淡粉相册衬纸');
 p.paper('lined-note',.025,.191,.315,.64,-7,1.1);
 p.paper('paper-blue',.764,.05,.216,.922,5,1.2);
 p.graphic('v10:curated-blue-rule');
 p.paper('paper-note',.346,.017,.402,.975,3,1.8);
 p.surface('ink',.354,.044,.395,.916,0,1,1.9,'主照片深蓝纸边');
 p.a('blue-diary',.309,.388,.31,-8,false,'bg',2.1);
 p.a('doily',.175,.385,.51,0,false,'left',2.6);
 p.hero(.548,.516,.368,.904,'rect');p.avatar.frameStyle='rect';p.avatar.frame=1.18;p.avatar.focusY=28;
 p.photo(.175,.383,.192,.339,'circle',-6,1.82,49,24,'left',true);
 p.a('study-pearl-round',.175,.383,.361,-6,true,'left',5.2);
 p.photo(.866,.292,.177,.417,'polaroid',8,1.2,48,31,'right',true);
 p.photo(.838,.747,.229,.329,'polaroid',-7,2.08,52,22,'right',true);
 p.a('proof-mint-tickets',.254,.901,.26,5,false,'details',3.2);
 p.a('study-pearl-wave',.527,.037,.99,-2,true,'hardware',6.1);
 p.a('study-lace-strip',.967,.55,.93,90,true,'hardware',6.15);
 p.a('study-satin-bow',.072,.062,.285,-12,true,'flowers',6.4);
 p.a('blue-tulip',.026,.582,.255,-13,true,'flowers',6.5);
 p.a('star-clip',.377,.092,.16,-17,true,'hardware',6.8);
 p.a('study-butterfly',.947,.1,.17,17,true,'flowers',6.9);
 p.a('blue-daisy',.327,.714,.285,-16,true,'flowers',7.1);
 p.a('proof-soft-camera',.109,.941,.32,-11,true,'flowers',7.3);
 p.a('blue-cassette',.424,.944,.285,-8,true,'flowers',7.4);
 p.a('blue-phone',.95,.929,.265,11,true,'flowers',7.4);
 p.a('pearl-shell',.725,.924,.194,12,true,'flowers',7.5);
 p.a('stamp-green',.924,.503,.125,6,true,'details',7.6);
 p.a('paperclip',.934,.66,.13,15,true,'hardware',7.6);
 p.a('blue-cherries',.663,.966,.13,-9,true,'flowers',7.7);
 p.a('study-milk',.018,.91,.17,-7,true,'flowers',7.7);
 return p;
}

function hk(W,H){
 const p=new Page(W,H,'hk');
 // 左侧大照片、右侧两张留影。印刷纸、模拟器物与红色纸边分为三个密度区。
 p.surface('paper',0,0,1,1,0,1,0,'旧纸底色');
 p.paper('newspaper',-.035,-.06,.52,1.15,-6,.3);
 p.surface('accent',.68,-.03,.32,1.06,3,1,.5,'旧画报红纸');
 p.paper('proof-textured-paper',.133,.026,.812,.949,2,.7);
 p.paper('news-edge',.584,.017,.375,.923,6,1.1);
 p.graphic('v10:curated-receipt-lines');
 p.a('vinyl',.132,.483,.72,-14,false,'hardware',2.2);
 p.paper('brown-crumple',.197,.055,.391,.921,-4,2.3);
 p.surface('ink',.213,.059,.399,.904,-2,1,2.4,'深色照片衬纸');
 p.hero(.408,.511,.38,.869,'rect');p.avatar.frameStyle='torn';p.avatar.frame=1.2;p.avatar.focusY=28;
 p.paper('proof-sepia-tickets',.658,.204,.326,.597,-4,2.7);
 p.photo(.817,.289,.22,.393,'film',7,1.88,48,23,'right',true);
 p.photo(.778,.727,.261,.402,'polaroid',-5,1.18,46,34,'right',true);
 p.a('clock',.628,.158,.28,-6,true,'flowers',6.4);
 p.a('proof-receipt',.071,.253,.295,-10,false,'details',2.6);
 p.a('proof-gramophone',.089,.582,.258,-6,true,'details',6.3);
 p.a('transit-ticket',.08,.807,.25,-9,true,'details',6.4);
 p.a('stamp-red',.924,.536,.18,9,true,'details',6.5);
 p.a('gold-clip',.702,.538,.128,-9,true,'hardware',6.7);
 p.a('black-clip',.234,.081,.155,-15,true,'hardware',6.7);
 p.a('radio',.152,.936,.341,-9,true,'flowers',7.1);
 p.a('old-camera',.916,.919,.27,9,true,'flowers',7.3);
 p.a('gray-cassette',.473,.946,.245,5,true,'flowers',7.2);
 p.a('seat',.57,.921,.225,-5,true,'details',7.4);
 p.a('serial',.934,.09,.226,90,true,'details',7.4);
 p.a('paper-corner',.236,.89,.118,0,true,'hardware',7.4);
 p.a('ticket',.115,.084,.25,-5,true,'details',7.3);
 p.graphic('v10:curated-postmark',.643,.046,.16,.187,7,7.5,true);
 return p;
}

function french(W,H){
 const p=new Page(W,H,'french');
 // 主肖像为右侧椭圆；左下的花与信物聚合，顶部保留较轻的织物和字组。
 p.surface('soft',0,0,1,1,0,1,0,'豆沙织物封面');
 p.surface('damask',0,0,1,1,0,.65,.1,'暗纹封底');
 p.paper('proof-pink-ledger',-.025,.06,.46,.947,-5,.5);
 p.paper('ivory-paper',.11,.034,.84,.924,3,.7);
 p.paper('proof-floral-letter',.025,.47,.49,.54,-8,1.1);
 p.graphic('v10:curated-french-line');
 p.a('proof-burgundy-book',.431,.49,.555,-5,false,'bg',2.0);
 p.surface('circle',.492,.055,.423,.902,0,1,2.2,'主肖像椭圆装裱');
 p.hero(.704,.511,.379,.862,'circle');p.avatar.frameStyle='none';p.avatar.frame=1.16;p.avatar.focusY=28;
 p.a('doily',.128,.184,.355,0,false,'left',2.5);
 p.photo(.129,.18,.125,.221,'circle',-6,1.95,49,23,'left',true);
 p.a('study-pearl-round',.129,.18,.236,-6,true,'left',5.3);
 p.paper('proof-textured-paper',.144,.241,.282,.687,-9,2.7);
 p.photo(.283,.57,.24,.634,'polaroid',-7,1.28,49,28,'left',true);
 p.a('study-lace-strip',.016,.543,1.055,90,true,'hardware',6.0);
 p.a('study-pearl-vertical',.968,.388,.60,0,true,'hardware',6.2);
 p.a('cream-bow',.474,.36,.255,4,true,'hardware',6.4);
 p.a('proof-perfume',.465,.639,.235,7,true,'flowers',6.8);
 p.a('pressed-rose',.043,.55,.232,-10,true,'flowers',6.4);
 p.a('rose-bouquet',.419,.878,.344,-14,true,'flowers',7.1);
 p.a('proof-record-player',.086,.939,.32,-7,true,'flowers',7.2);
 p.a('proof-tea-cup',.49,.954,.223,8,true,'flowers',7.3);
 p.a('herb-paper',.943,.816,.259,12,true,'flowers',7.3);
 p.a('study-pearl-bow',.886,.101,.164,12,true,'flowers',6.8);
 p.a('gold-clip',.205,.291,.125,-13,true,'hardware',6.7);
 p.a('pressed-daisy',.124,.699,.177,-9,true,'flowers',6.9);
 p.a('cherry-pair',.964,.991,.158,8,true,'flowers',7.5);
 p.a('study-white-daisy',.538,.899,.118,7,true,'flowers',7.5);
 p.graphic('v10:curated-postmark',.328,.094,.187,.211,-9,3.1,false);
 return p;
}

export function buildApprovedScene(W,H,id){
 const p=({school,hk,french})[id](W,H),scene=p.finish();
 for(const e of scene.elements)if(e.photoRole){e.caption='';e.showCaption=false;}
 return scene;
}
