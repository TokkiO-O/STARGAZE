import {ReviewPage as Page} from './page.js';

// 长手幅单张试稿：主图、近景与半身副图各有作用，实物负责连接照片之间的空间。
function frenchScroll(){
 const p=new Page('french',820,225);p.key='scroll';
 p.fill('#e6cccc');
 p.paper('ivory-paper',.022,.047,.953,.91,1,.3);
 p.fill('soft',-.012,.065,.366,.875,-3,.5,.44);
 p.paper('proof-textured-paper',.038,.368,.306,.62,-5,.7,.78);
 p.paper('proof-pink-ledger',.745,.028,.277,.965,5,.8,.66);
 p.paper('fold-white',.653,.065,.325,.89,5,.9,.72);
 p.material('linen',.04,.08,.292,.79,-4,.12,1,'淡淡的织物纤维',false,'bg','cover');
 p.graphic('豆沙缝线衬卡','<rect x="1" y="1" width="398" height="198" rx="2" fill="#D4A5A5" fill-opacity=".54"/><rect x="6" y="6" width="388" height="188" rx="1" fill="none" stroke="#f9e5e2" stroke-width=".8" stroke-dasharray="2 2"/>',.315,.085,.399,.84,-4,1.1,false,'bg','0 0 400 200');
 p.graphic('细线封边','<rect x="10" y="9" width="800" height="207" fill="none" stroke="#b49aa0" stroke-width=".55"/><rect x="15" y="14" width="790" height="197" fill="none" stroke="#b49aa0" stroke-width=".35" opacity=".55"/>',0,0,1,1,0,1.2,false,'bg','0 0 820 225');
 p.art('lace-fine',.517,.938,2.35,0,2.1,false,'bg');
 p.art('ribbon-white',.817,.665,.72,-10,2.3,false,'bg');
 const letterBacking=p.art('mail-sealed',.827,.46,.65,-6,2.5,false,'bg');letterBacking.opacity=.62;

 // 左侧近景用细蕾丝和珍珠装裱；主图居中偏左，右侧小相纸展示较完整的姿态。
 p.art('doily',.154,.295,.60,0,2.6,false,'left');
 p.photo(.154,.295,.115,.445,'circle',-6,1.92,49,23,'left',true);
 p.art('study-pearl-round',.154,.295,.49,-6,5.3,true,'left');
 p.graphic('奶油白主肖像装裱','<ellipse cx="160" cy="170" rx="153" ry="163" fill="#FFF5F5" stroke="#D4A5A5" stroke-width=".75"/>',.410,.025,.224,.967,0,3,false,'main','0 0 320 340');
 p.main(.522,.51,.197,.91,'circle',1.10,28);
 p.photo(.845,.645,.15,.58,'polaroid',7,1.04,49,35,'right',true);

 // 花材、香水、信封与缎带叠成两组，夹在纸与照片之间，不围着脸重复贴饰。
 p.art('ivory-envelope',.115,.81,.65,-9,3.1,false,'details');
 p.art('blue-bow',.045,.145,.285,-13,6.4);
 p.art('cream-bow',.381,.245,.34,5,6.5);
 p.art('pressed-rose',.277,.19,.25,-12,6.4);
 p.art('rose-bouquet',.208,.783,.49,-15,7.1);
 p.art('fabric-rose',.395,.895,.24,8,7.2);
 p.art('proof-perfume',.309,.665,.315,7,6.9);
 p.art('pressed-daisy',.286,.425,.29,-10,6.6);
 p.art('embroidery',.095,.81,.25,-9,7.2);
 p.art('washi-cream',.232,.17,.265,-10,6.8,true,'hardware');
 p.art('study-lace-strip',.014,.52,.94,90,6.1,true,'hardware');

 // 小镜框承载反光，副图仍只放在相纸里，避免把每个装饰框都变成头像位。
 const frame=p.asset('frame-silver'),d=.35*p.u,fw=d*frame.aspect,fh=d;
 p.graphic('小镜面的柔和反光','<defs><linearGradient id="mirror" x2="1" y2="1"><stop stop-color="#d4dee2"/><stop offset=".35" stop-color="#f7f4ef"/><stop offset=".65" stop-color="#b9c7ce"/><stop offset="1" stop-color="#e9edef"/></linearGradient></defs><rect x="17" y="16" width="66" height="99" fill="url(#mirror)"/><path d="M25 87L68 25M36 107L80 44" stroke="white" stroke-width="3" opacity=".32"/>',.674-fw/p.W/2,.335-fh/p.H/2,fw/p.W,fh/p.H,6,6.75,true,'flowers','0 0 100 132');
 p.art('frame-silver',.674,.335,.35,6,6.8);
 p.art('dry-spray',.637,.635,.23,-12,6.9);
 p.art('herb-paper',.966,.452,.405,12,7.2);
 p.art('bow-pearl',.904,.13,.205,11,6.9);
 p.art('study-white-daisy',.663,.925,.16,8,7.3);
 p.art('pin-pearl',.961,.17,.082,16,7.3,true,'hardware');
 p.art('tape-pink',.907,.918,.18,10,7.4,true,'hardware');
 return p;
}

function stampScroll(){
 const p=new Page('stamp',820,225);p.key='scroll';p.grain();
 p.fill('soft',.012,.025,.032,.95,0,.2);
 p.paper('kraft',.037,.025,.945,.95,-1,.35,.58);
 p.airmail(.051,.048,.932,.9,1,.5);
 p.paper('postage-paper',.412,.08,.241,.83,-5,.8,.76);
 p.paper('crumple-white',.728,.055,.255,.9,4,.9,.55);
 p.graphic('藏品册的装订与留边','<g fill="#b8b09c" stroke="#f6f1e3" stroke-width="1">'+[.11,.30,.50,.70,.89].map(y=>`<circle cx="27" cy="${y*225}" r="2.1"/>`).join('')+'</g><path d="M38 14V211" fill="none" stroke="#3A5A8A" stroke-width=".65" opacity=".45"/>',0,0,1,1,0,1.1,false,'bg','0 0 820 225');

 // 主图是大幅人物邮票；两张小图分别作近景邮票与收藏册小相片。
 p.art('rev-mail-bundle',.112,.605,.76,-8,2.1,false,'bg');
 p.postage(.173,.065,.214,.89,0,'soft',2.9);p.main(.280,.510,.19,.835,'rect',1.11,28);
 p.postage(.511,.065,.122,.415,-5,'accent',3);
 p.photo(.572,.273,.106,.351,'rect',-5,1.76,49,24,'right');
 p.postage(.752,.292,.151,.624,6,'soft',3);
 p.photo(.828,.605,.133,.552,'rect',6,1.04,49,35,'right');

 // 邮包、原始纸件、火漆与封口绳成组叠放；不放花卉和昆虫图样。
 p.art('parcel-bundle',.475,.786,.655,-7,6.5);
 p.art('rev-route-tickets',.666,.65,.46,7,3.2,false,'details');
 p.art('rev-postage-train',.422,.255,.29,-7,6.8,true,'details');
 p.art('cat-postage',.953,.635,.40,8,6.9,true,'details');
 p.art('postcards',.914,.151,.39,8,2.5,false,'details');
 p.art('parcel-barcode',.08,.133,.29,-8,6.9,true,'details');
 p.art('wax',.553,.915,.13,6,7.2,true,'details');
 p.art('twine',.725,.168,.28,-8,6.7,true,'hardware');
 p.art('clip-silver',.614,.08,.15,11,7,true,'hardware');
 p.art('washi-cream',.285,.073,.24,-7,7,true,'hardware');
 p.art('paper-corner',.189,.892,.16,0,7.1,true,'hardware');
 p.art('tape-white',.90,.876,.18,9,7.1,true,'hardware');
 p.postmark(.371,.54,.30,-9,'accent');
 p.postmark(.877,.307,.16,8,'soft');
 return p;
}

function mechaScroll(){
 const p=new Page('mecha',820,225);p.key='scroll';p.grain('dark');
 p.paper('black-paper',0,0,1,1,0,.2);
 p.paper('silver-peel',-.018,.025,.259,.95,-5,.5,.79);
 p.fill('accent',.744,-.07,.28,1.13,5,.6,.83);
 p.paper('foil',.185,.06,.155,.79,-12,.8,.44);
 p.graphic('机械档案底纹','<defs><pattern id="cross" width="17" height="17" patternUnits="userSpaceOnUse"><path d="M0 17L17 0M-8 8L8 -8M9 25L25 9" stroke="#b2b6b1" stroke-width=".45" opacity=".2"/></pattern></defs><rect x="441" y="22" width="174" height="181" fill="url(#cross)"/><path d="M12 14H806V211H12Z" fill="none" stroke="#a9aaa4" stroke-width=".65" opacity=".48"/>',0,0,1,1,0,1.1,false,'bg','0 0 820 225');
 p.graphic('锈红灰银警示封边','<defs><pattern id="haz" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="18" height="18" fill="#aab0ad"/><rect width="7" height="18" fill="#B5453A"/></pattern></defs><rect width="400" height="18" fill="url(#haz)"/>',.022,.061,.236,.047,-5,2.4,false,'bg','0 0 400 18');

 // 两张照片分为主肖像与档案副图；其余视觉面积留给不同的机械材质。
 p.graphic('主肖像窄边装夹板','<path d="M9 2H191L198 9V251L191 258H9L2 251V9Z" fill="#727773" stroke="#babbb2" stroke-width="1.1"/><path d="M12 7H188L193 12V248L188 253H12L7 248V12Z" fill="#434948" stroke="#B5453A" stroke-width="1"/>',.178,.025,.244,.95,0,2.8,false,'main','0 0 200 260');
 p.main(.300,.5,.218,.89,'rect',1.1,28);
 p.mat(.719,.243,.161,.651,6,'dark',3,'#8A8A8A');
 p.photo(.800,.568,.141,.586,'rect',6,1.04,49,35,'right');

 p.art('metal-frame',.421,.5,.56,-5,2.5,false,'bg');
 p.graphic('机械拆件图纸','<path d="M3 9L31 3 66 7 100 2 136 6 177 3 187 11 184 124 155 129 122 125 86 131 48 126 6 130Z" fill="#b8bab2"/><g fill="none" stroke="#333a38" stroke-width=".8" opacity=".64"><circle cx="53" cy="48" r="25"/><circle cx="53" cy="48" r="17"/><circle cx="53" cy="48" r="7"/><path d="M53 16V80M20 48H86M22 88H98M22 83V94M98 83V94M110 21H169V55H110ZM114 25H165M116 51V29M121 51V29M126 51V29M132 51V29M138 51V29M144 51V29M150 51V29M157 51V29M107 65H173M107 61V70M173 61V70M23 106H82M23 111H65M23 116H92"/></g>',.473,.20,.23,.59,-6,2.7,false,'details','0 0 190 134');
 p.material('crumple-white',.473,.20,.23,.59,-6,.16,2.8,'拆件图纸的折痕',false,'bg','cover');
 p.art('tape-duct',.486,.263,.24,-9,6.5,true,'hardware');
 p.art('chain-black',.35,.07,.49,-7,6.1,true,'hardware');
 p.art('spring-black',.174,.849,.32,-8,7.1);
 p.art('hinge',.611,.832,.255,8,7.2);
 p.art('gear',.699,.677,.205,7,7.1);
 p.art('pipe-cross',.574,.295,.27,12,6.9);
 p.art('pipe-pieces',.960,.806,.28,12,7.2);
 p.art('rev-silver-keys',.688,.866,.27,-12,7.3);
 p.art('rev-rivet-heart',.080,.594,.28,-11,6.9);
 p.art('rev-safety-pin',.725,.181,.205,-17,6.8,true,'hardware');
 p.art('binder-black',.802,.25,.14,6,7,true,'hardware');
 p.art('tape-black',.238,.09,.19,-8,6.8,true,'hardware');
 p.art('rev-barcode',.916,.937,.28,0,7.1,true,'details');
 p.qr(.611,.431,.14);
 [[.187,.05],[.413,.05],[.187,.95],[.413,.95],[.736,.30],[.866,.852]].forEach(([x,y])=>p.bolt(x,y,.022));
 return p;
}

function fairyTower(){
 const p=new Page('fairy',300,460);p.key='tower';p.grain();
 p.fill('accent',0,0,1,1,0,.15,.28);
 p.graphic('绘本的微曲纸页','<path d="M9 14Q150 -1 290 12V449Q145 437 9 452Z" fill="#F8F0D8" stroke="#c6b58f" stroke-width="1"/><path d="M18 21V442M26 27Q151 15 282 22M25 443Q152 431 282 442" fill="none" stroke="#c8b58e" stroke-width=".55" opacity=".65"/>',0,0,1,1,0,.5,false,'bg','0 0 300 460');
 p.paper('fold-white',.061,.065,.86,.85,-2,.7,.42);
 p.paper('ruled-white',.045,.145,.264,.288,-7,.9,.82);
 p.paper('pink-torn',.064,.586,.44,.265,-7,1,.58);
 p.check(.286,.112,.636,.454,'accent',11,1.2);
 p.graphic('手绘纸页边线','<path d="M30 28Q150 18 277 29M30 441Q155 430 277 439" fill="none" stroke="#E85A6A" stroke-width="1.2" stroke-linecap="round" opacity=".48"/>',0,0,1,1,0,1.4,false,'bg','0 0 300 460');

 // 右上主图与左下副图构成阅读顺序，画材与手绘插图在空隙中形成叙事。
 p.mat(.27,.108,.66,.454,-1,'paper',2.8,'#b7bbaf');
 p.main(.600,.335,.63,.43,'rect',1.1,28);
 p.photo(.270,.735,.35,.215,'polaroid',-7,1.78,49,24,'left');
 p.art('story-reader',.746,.754,.35,-3,6.9);
 p.art('crown-crayon',.751,.636,.115,-7,7);
 p.art('story-teapot',.170,.458,.19,-8,6.8);
 p.art('cream-books',.592,.910,.31,5,7.1);
 p.art('pastel-crayons',.221,.916,.24,-7,7.2);
 p.art('pencils',.071,.824,.35,-19,6.9);
 p.art('cloud-crayon',.190,.105,.235,-8,6.4);
 p.art('stars-crayon',.842,.087,.17,-8,6.4);
 p.art('flower-crayon',.150,.323,.16,-9,6.6);
 p.art('daisy-crayon',.939,.534,.20,9,6.6);
 p.art('rainbow',.155,.535,.17,-7,6.7);
 p.art('heart-crayon',.58,.611,.10,8,6.8);
 p.art('plane-crayon',.428,.613,.11,-12,6.8);
 p.art('bow-crayon',.86,.954,.14,8,7);
 p.art('washi-cream',.571,.126,.29,-5,7,true,'hardware');
 p.art('tape-white',.130,.626,.14,-8,7,true,'hardware');
 p.art('twine',.878,.651,.15,-9,7.1,true,'hardware');
 return p;
}


// 已确认的长幅/竖幅作为整套尺寸适配的基准。
export const confirmedSizes=new Map([['french/scroll',frenchScroll],['stamp/scroll',stampScroll],['mecha/scroll',mechaScroll],['fairy/tower',fairyTower]]);
