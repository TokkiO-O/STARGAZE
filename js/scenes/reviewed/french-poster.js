import {ReviewPage} from './page.js';
export function buildFrenchPoster(){
 const p=new ReviewPage('french');
 // 底纸继续使用小面积豆沙粉边缘；雾蓝只在相片周围和缎带上呼应。
 p.draw('豆沙粉封面','<rect width="680" height="390" fill="#e6cccc"/>',0,0,1,1,0,0);
 p.draw('细菱纹织物','<defs><pattern id="damask" width="34" height="44" patternUnits="userSpaceOnUse"><path d="M17 2L32 22 17 42 2 22Z" fill="none" stroke="#ad8b92" stroke-width=".45" opacity=".25"/></pattern></defs><rect width="680" height="390" fill="url(#damask)"/>',0,0,1,1,0,.1);
 p.paper('proof-pink-ledger',-.025,.06,.46,.947,-5,.5);
 p.paper('ivory-paper',.11,.034,.84,.924,3,.7);
 p.paper('proof-floral-letter',.025,.47,.49,.54,-8,1.1);
 p.draw('双层细线封边','<rect x="13" y="13" width="654" height="364" rx="2" fill="none" stroke="#b3989c" stroke-width=".7" opacity=".5"/><rect x="19" y="19" width="642" height="352" fill="none" stroke="#b3989c" stroke-width=".4" opacity=".4"/>',0,0,1,1,0,1.2);
 p.draw('豆沙缎面衬卡','<rect x="1" y="1" width="198" height="278" rx="2" fill="#D4A5A5"/><rect x="6" y="6" width="188" height="268" fill="none" stroke="#f5dfdd" stroke-width=".8" stroke-dasharray="2 2"/>',.327,.183,.235,.721,-5,2,false,'bg','0 0 200 280');
 p.material('new:linen',.332,.188,.224,.708,-5,.18,2.1,'缎面纤维细节',false,'bg','cover');

 // 保留认可稿的右侧主肖像、左上近景与左侧相纸；副图分别记录取景。
 p.draw('奶油白椭圆装裱','<ellipse cx="200" cy="200" rx="194" ry="194" fill="#FFF5F5"/>',.492,.055,.423,.902,0,2.2,false,'bg','0 0 400 400');
 p.hero(.704,.511,.379,.862,'circle');p.avatar.frameStyle='none';p.avatar.frame=1.16;p.avatar.focusY=28;
 p.a('doily',.128,.184,.355,0,2.5,false,'left');
 p.photo(.129,.18,.125,.221,'circle',-6,1.95,49,23,'left',true);
 p.a('study-pearl-round',.129,.18,.236,-6,5.3,true,'left');
 p.paper('proof-textured-paper',.144,.241,.282,.687,-9,2.7);
 p.photo(.283,.57,.24,.634,'polaroid',-7,1.08,49,36,'left',true);
 p.a('study-lace-strip',.016,.543,1.055,90,6,true,'hardware');
 p.a('cream-bow',.474,.36,.255,4,6.4,true,'hardware');
 // 奶白细格和纸胶带跨过相纸上缘，承担固定作用，并避免金属反光抢眼。
 p.a('new:washi-cream',.225,.252,.185,-11,6.7,true,'hardware');

 // 镜框保持与原香水瓶相近的小尺寸，镜面使用柔和的反光，不额外重复人物。
 p.draw('小镜面反光','<defs><linearGradient id="mirror" x2="1" y2="1"><stop stop-color="#d4dee2"/><stop offset=".35" stop-color="#f5f2ee"/><stop offset=".62" stop-color="#b9c7ce"/><stop offset="1" stop-color="#e9edef"/></linearGradient></defs><rect x="17" y="16" width="66" height="99" fill="url(#mirror)"/><path d="M25 87L68 25M36 107L80 44" stroke="white" stroke-width="3" opacity=".32"/>',.428,.528,.079,.244,7,6.75,true,'flowers','0 0 100 132');
 p.a('new:frame-silver',.4675,.65,.244,7,6.8);
 p.a('pressed-rose',.043,.55,.232,-10,6.4);
 p.a('rose-bouquet',.419,.878,.31,-14,7.1);
 p.a('new:ivory-envelope',.086,.939,.32,-7,6.9);
 p.a('blue-bow',.105,.889,.245,-12,7.3);
 p.a('new:fabric-rose',.498,.954,.155,8,7.4);
 p.a('herb-paper',.943,.816,.259,12,7.3);
 p.a('study-pearl-bow',.886,.101,.164,12,6.8);
 p.a('pressed-daisy',.124,.699,.177,-9,6.9);
 p.a('study-white-daisy',.538,.899,.118,7,7.5);
 p.a('new:embroidery',.318,.837,.188,-7,7.25);
 p.a('new:pin-pearl',.948,.951,.075,20,7.5,true,'hardware');
 // 顶部沿用认可稿的淡印痕；不填充姓名、日期或额外的装饰句子。
 p.draw('淡淡的纸上压印','<g fill="none" stroke="#a18b93" stroke-width=".8" opacity=".45"><circle cx="53" cy="53" r="43"/><circle cx="53" cy="53" r="36"/><path d="M19 43H87M19 64H87M95 35H155M95 43H155M95 51H155M95 59H155M95 67H155"/></g>',.328,.094,.187,.211,-9,3.1,false,'details','0 0 160 108');
 return p;
}
