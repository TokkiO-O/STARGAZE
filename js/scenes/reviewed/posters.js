import {ReviewPage as Page} from './page.js';

function school(){
 const p=new Page('school');p.grain();p.check(0,0,.45,1,'accent',14,.2);
 p.paper('study-ivory-paper',.035,.055,.92,.90,-2,.6);
 p.fill('soft',.015,.668,.31,.30,-6,.8);
 p.paper('lined-note',.025,.191,.315,.64,-7,1.1);p.paper('paper-blue',.764,.05,.216,.922,5,1.2);p.edge('accent',1.4);
 p.paper('paper-note',.346,.017,.402,.975,3,1.8);p.fill('#566f7c',.354,.044,.395,.916,0,1.9);
 p.art('blue-diary',.309,.388,.31,-8,2.1,false,'bg');p.art('doily',.175,.385,.51,0,2.6,false,'left');
 p.main(.548,.516,.368,.904,'rect',1.18,28);
 p.photo(.175,.383,.192,.339,'circle',-6,1.82,49,24,'left',true);p.art('study-pearl-round',.175,.383,.361,-6,5.2);
 p.photo(.866,.292,.177,.417,'polaroid',8,1.12,48,33,'right',true);p.photo(.838,.747,.229,.329,'polaroid',-7,1.85,52,24,'right',true);
 p.art('memo-book',.242,.914,.23,5,3.2,false,'details');
 p.art('study-pearl-wave',.527,.037,.99,-2,6.1,true,'hardware');p.art('study-lace-strip',.967,.55,.93,90,6.15,true,'hardware');
 p.art('study-satin-bow',.072,.062,.25,-12,6.4);p.art('blue-tulip',.026,.582,.235,-13,6.5);
 p.art('star-clip',.377,.092,.14,-17,6.8,true,'hardware');p.art('study-butterfly',.947,.1,.13,17,6.9);
 p.art('blue-daisy',.327,.714,.255,-16,7.1);p.art('proof-soft-camera',.109,.941,.28,-11,7.3);
 p.art('pencils',.424,.944,.27,-29,7.4);p.art('coffee',.946,.922,.16,8,7.4);
 p.art('cake',.725,.94,.15,8,7.5);p.art('washi-cream',.913,.505,.15,-4,7.6,true,'hardware');
 p.art('paperclip',.934,.66,.11,15,7.6,true,'hardware');p.art('blue-cherries',.663,.966,.10,-9,7.7);p.art('study-milk',.018,.91,.14,-7,7.7);
 return p;
}
function hk(){
 const p=new Page('hk');p.grain();p.paper('newspaper',-.035,-.06,.52,1.15,-6,.3);p.fill('accent',.68,-.03,.32,1.06,3,.5);
 p.paper('proof-textured-paper',.133,.026,.812,.949,2,.7);p.paper('news-edge',.584,.017,.375,.923,6,1.1);p.edge('ink',1.3);
 p.art('vinyl',.132,.483,.72,-14,2.2,false,'hardware');p.paper('brown-crumple',.197,.055,.391,.921,-4,2.3);p.fill('ink',.213,.059,.399,.904,-2,2.4);
 p.main(.408,.511,.38,.869,'rect',1.2,28);p.avatar.frameStyle='torn';
 p.paper('proof-sepia-tickets',.658,.204,.326,.597,-4,2.7);
 p.photo(.817,.289,.22,.393,'film',7,1.88,48,23,'right',true);p.photo(.778,.727,.261,.402,'polaroid',-5,1.08,46,36,'right',true);
 p.art('clock',.628,.158,.255,-6,6.4);p.art('proof-receipt',.071,.253,.265,-10,2.6,false,'details');
 p.art('proof-gramophone',.089,.582,.235,-6,6.3);p.art('transit-ticket',.08,.807,.22,-9,6.4,true,'details');
 p.art('rev-postage-train',.929,.536,.16,9,6.5,true,'details');p.art('clip-silver',.70,.537,.09,-9,6.7,true,'hardware');
 p.art('black-clip',.234,.081,.155,-15,6.7,true,'hardware');p.art('radio',.152,.936,.31,-9,7.1);
 p.art('old-camera',.916,.919,.245,9,7.3);p.art('gray-cassette',.473,.946,.215,5,7.2);
 p.art('seat',.57,.921,.19,-5,7.4,true,'details');p.art('paper-corner',.236,.89,.10,0,7.4,true,'hardware');p.art('ticket',.115,.084,.22,-5,7.3,true,'details');
 p.postmark(.643,.046,.20,7,'ink');
 return p;
}
function y2k(){
 const p=new Page('y2k');p.grain();p.paper('blue-grid',-.04,.01,.44,1.03,-5,.4);p.paper('pink-torn',.39,-.035,.64,1.07,4,.5);
 p.material('holo',.48,.04,.49,.92,5,.46,.7,'局部镭射底纸',false,'bg','cover');p.edge('accent',1);
 p.window(.035,.16,.285,.68,-7,2);p.photo(.179,.525,.241,.522,'rect',-7,1.23,49,31);
 p.window(.325,.048,.193,.305,7,2.3);p.photo(.422,.227,.159,.198,'rect',7,1.9,50,24,'left');
 p.graphic('细镀铬气泡装裱','<defs><linearGradient id="chrome" x2="1" y2=".6"><stop stop-color="#effaff"/><stop offset=".25" stop-color="#8ba7c1"/><stop offset=".46" stop-color="#fbfaff"/><stop offset=".72" stop-color="#bd9fc1"/><stop offset="1" stop-color="#f4fcff"/></linearGradient></defs><ellipse cx="180" cy="180" rx="174" ry="174" fill="#F0F8FF" stroke="url(#chrome)" stroke-width="4"/><ellipse cx="180" cy="180" rx="168" ry="168" fill="none" stroke="#4D9FFF" stroke-width=".65"/>',.477,.047,.376,.912,0,3,false,'main','0 0 360 360');
 p.main(.665,.503,.344,.849,'circle',1.12,27);
 p.art('pink-phone',.034,.902,.215,-12,7.3);p.art('cd',.921,.838,.235,12,7.2);
 p.art('chrome-heart',.473,.935,.22,-11,7.4);p.art('chrome-flower',.286,.938,.16,-8,7.3);
 p.art('stars-metal',.934,.092,.18,11,6.5);p.art('crystal',.537,.083,.115,-9,6.6);
 p.art('pixel-arrow',.317,.42,.105,-16,6.9);p.art('star-jelly',.956,.503,.11,9,6.9);
 p.art('chain',.795,.976,.31,-6,7.5,true,'hardware');p.art('tape-white',.134,.164,.13,-10,7,true,'hardware');
 p.art('blue-player',.108,.062,.16,-7,6.2,true,'details');
 p.art('gamepad',.329,.922,.215,-10,7.4);p.art('earphones',.943,.62,.28,12,7.1);
 p.art('holo-heart',.882,.065,.15,12,6.5);p.art('holo-cross',.38,.409,.12,-10,6.8);
 return p;
}
function mecha(){
 const p=new Page('mecha');p.grain('dark');p.paper('black-paper',0,0,1,1,0,.3);p.fill('accent',.76,-.04,.26,1.08,4,.45,.75);
 p.paper('silver-peel',-.035,.07,.29,.88,-6,.55,.72);p.paper('tape-duct',.73,.03,.28,.19,7,.6,.60);
 // 磨损金属只作为窄装夹边，机械件保持小比例；中心的人像承担主要视觉面积。
 p.graphic('窄边切角装夹底板','<path d="M16 4H304L316 16V384L304 396H16L4 384V16Z" fill="#777b79" stroke="#b3b4ab" stroke-width="1.2"/><path d="M20 10H300L310 20V380L300 390H20L10 380V20Z" fill="#444948" stroke="#B5453A" stroke-width="1.2"/>',.278,.005,.444,.99,0,2.8,false,'main','0 0 320 400');
 p.main(.5,.5,.39,.92,'rect',1.1,27);
 p.mat(.025,.067,.241,.476,-4,'dark',2.7,'#8A8A8A');p.photo(.144,.301,.20,.39,'film',-4,1.82,49,24);
 p.mat(.035,.619,.247,.327,5,'dark',2.8,'#8A8A8A');p.photo(.16,.785,.205,.268,'rect',5,1.09,49,36);
 p.mat(.753,.17,.222,.69,4,'dark',2.8,'#8A8A8A');p.photo(.864,.515,.187,.62,'rect',4,1.19,49,32);
 p.graphic('窄幅锈红警示封边','<defs><pattern id="haz" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="18" height="18" fill="#aab0ad"/><rect width="7" height="18" fill="#B5453A"/></pattern></defs><rect width="400" height="18" fill="url(#haz)"/>',.024,.024,.235,.043,-4,6.2,true,'hardware','0 0 400 18');
 p.art('chain-black',.454,.035,.40,-7,6.1,true,'hardware');p.art('spring-black',.288,.928,.235,-8,7.1);
 p.art('hinge',.716,.93,.15,9,7.2);p.art('pipe-pieces',.966,.909,.16,9,7.3);
 p.art('rev-safety-pin',.746,.144,.14,-18,6.8,true,'hardware');p.art('binder-black',.838,.164,.12,4,6.9,true,'hardware');
 p.art('tape-black',.128,.624,.15,-8,6.8,true,'hardware');p.art('parcel-barcode',.054,.955,.19,-5,7.1,true,'details');
 p.qr(.715,.431,.115);p.art('steel-tag',.859,.942,.17,6,7.3,true,'details');
 [[.295,.05],[.705,.05],[.295,.95],[.705,.95],[.038,.11],[.954,.82]].forEach(([x,y])=>p.bolt(x,y,.021));
 p.graphic('金属刻线','<g stroke="#ced0c9" stroke-width=".6" opacity=".36"><path d="M14 151V20H145M535 370H666V239"/><path d="M17 156H26M17 164H23M17 172H26M17 180H23"/></g>',0,0,1,1,0,.9,false,'bg','0 0 680 390');
 return p;
}
function fairy(){
 const p=new Page('fairy');p.grain();p.fill('accent',0,0,1,1,0,.2,.43);p.book(.014,.025,.972,.95);
 p.paper('fold-white',.064,.063,.387,.888,-4,.8,.60);p.check(.518,.055,.431,.888,'accent',12,.85);
 p.paper('pink-torn',.515,.045,.426,.921,3,1,.38);p.mat(.537,.072,.399,.858,2,'paper',2.6,'#c0b28d');
 p.main(.736,.502,.359,.792,'rect',1.09,28);
 p.photo(.242,.276,.233,.331,'polaroid',-7,1.8,49,24);
 p.mat(.09,.493,.31,.405,7,'paper',3);p.photo(.245,.697,.267,.327,'rect',7,1.03,49,37);
 // 手绘图样作为页面小插画，纸片、相片与画材形成尺度差，避免大块卡通贴画。
 p.art('story-reader',.449,.817,.235,-4,6.9);p.art('pastel-crayons',.056,.95,.20,-8,7.2);
 p.art('cream-books',.442,.956,.235,5,7.2);p.art('washi-cream',.244,.113,.18,-6,6.5,true,'hardware');
 p.art('cloud-crayon',.574,.068,.19,-8,6.4);p.art('daisy-crayon',.957,.754,.17,12,6.6);
 p.art('stars-crayon',.436,.157,.135,-9,6.6);p.art('heart-crayon',.078,.417,.10,-9,6.6);
 p.art('plane-crayon',.359,.49,.12,-12,6.7);p.art('bow-crayon',.893,.943,.13,8,7);
 p.art('rainbow',.052,.704,.16,-9,6.7);p.art('twine',.455,.433,.14,-12,6.8,true,'hardware');
 p.art('flower-crayon',.094,.087,.14,-8,6.5);p.art('clip-white',.574,.905,.10,-8,7,true,'hardware');
 p.graphic('蜡笔细线页边','<g fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".52"><path d="M34 29Q175 19 311 29M33 363Q176 353 313 365" stroke="#E85A6A" stroke-width="1.2"/><path d="M371 29Q511 19 648 28M370 365Q510 355 649 364" stroke="#A8C8E8" stroke-width="1.5"/></g>',0,0,1,1,0,1.5,false,'bg','0 0 680 390');
 return p;
}
function letter(){
 const p=new Page('letter');p.grain();p.fill('accent',-.02,.03,.11,.98,-2,.25,.9);p.paper('manuscript',.44,-.06,.59,1.11,5,.4,.62);
 p.paper('sage-grid',.055,.035,.458,.94,-4,.6);p.paper('ivory-paper',.09,.042,.416,.90,-3,.9);
 p.paper('proof-floral-letter',.405,.09,.31,.81,8,1.1,.85);p.edge('accent',1.3);
 p.mat(.12,.09,.355,.79,-2,'paper',2.6,'#a7a59a');p.main(.298,.486,.318,.714,'rect',1.12,28);
 p.paper('mail-sealed',.415,.56,.316,.43,-7,2.7);p.paper('kraft',.645,.142,.29,.693,7,2.8);
 p.photo(.79,.481,.241,.557,'polaroid',7,1.05,49,36,'right');
 p.photo(.57,.195,.153,.217,'rect',-9,1.88,49,24,'right');
 p.art('fountain-pen',.599,.593,.46,9,6.6,true,'details');p.art('dry-spray',.076,.709,.26,-12,6.8);
 p.art('pressed-daisy',.397,.95,.19,-9,7.1);p.art('wax',.528,.859,.10,-5,7.2);
 p.art('twine',.475,.94,.17,-8,7.3);p.art('ivory-envelope',.903,.942,.26,9,7.1);
 p.art('herb-paper',.964,.415,.21,8,6.9);p.art('tape-white',.291,.114,.13,-8,6.8,true,'hardware');
 p.art('clip-silver',.799,.208,.10,11,6.9,true,'hardware');p.art('washi-cream',.591,.291,.12,-12,7,true,'hardware');
 p.postmark(.797,.811,.19,-8,'accent');p.art('typewriter',.674,.963,.24,-6,7.3);
 p.art('pressed-rose',.47,.439,.135,-14,6.5);
 return p;
}
function stamp(){
 const p=new Page('stamp');p.grain();p.fill('soft',.016,.02,.045,.96,0,.3);
 p.paper('kraft',.053,.02,.914,.962,-1,.45,.62);p.airmail(.073,.035,.894,.929,1,.55);
 p.paper('postcards',.515,.092,.425,.80,4,.9,.64);p.fill('paper',.095,.06,.456,.89,-1,1.1,.9);
 p.paper('proof-sepia-tickets',.509,.077,.408,.821,4,1.2,.55);
 p.graphic('收藏册装订与装裱格','<path d="M55 18V372" stroke="#3A5A8A" stroke-width="1.5"/><g fill="#b7ae98" stroke="#f7f2e2" stroke-width="1.4">'+[38,105,172,239,306,354].map(y=>`<circle cx="42" cy="${y}" r="3.7"/>`).join('')+'</g><g fill="none" stroke="#3A5A8A" stroke-width=".6" opacity=".42"><path d="M407 29H642V187H407ZM411 220H642V356H411Z"/></g>',0,0,1,1,0,1.4,false,'bg','0 0 680 390');
 p.postage(.168,.062,.354,.872,0,'soft',2.7);p.main(.345,.498,.32,.814,'rect',1.13,28);
 p.postage(.634,.073,.268,.421,6,'accent',3);p.photo(.767,.285,.23,.346,'rect',6,1.79,49,24,'right');
 p.postage(.614,.599,.29,.324,-6,'soft',3);p.photo(.759,.755,.253,.259,'rect',-6,1.06,49,35,'right');
 p.art('rev-postage-train',.565,.494,.23,-6,6.8,true,'details');
 p.art('parcel-bundle',.546,.941,.345,-7,7.1);p.art('parcel-barcode',.099,.89,.17,-9,7.2,true,'details');
 p.art('wax',.618,.93,.085,6,7.3);p.art('clip-silver',.803,.111,.10,12,7.1,true,'hardware');
 p.art('envelopes',.125,.96,.24,-9,7.1);p.art('rev-route-tickets',.565,.708,.22,8,6.8,true,'details');
 p.art('washi-cream',.22,.074,.17,-7,6.7,true,'hardware');p.art('twine',.555,.795,.16,-9,7.2,true,'hardware');
 p.postmark(.453,.165,.23,-10,'accent');p.postmark(.827,.495,.16,8,'soft');
 return p;
}
function gothic(){
 const p=new Page('gothic');p.p.colors.paper='#2d2936';p.grain('dark');p.paper('black-damask',0,0,1,1,0,.3,.9);
 p.paper('news-edge',-.04,.12,.31,.86,-7,.5,.36);p.paper('rev-black-lace',.67,-.06,.37,1.13,5,.6,.58);p.edge('soft',1.2);
 p.graphic('细银拱形装裱','<path d="M8 393V149Q8 46 150 8Q292 46 292 149V393Z" fill="#353242" stroke="#8A8AA8" stroke-width="1.1"/><path d="M16 387V150Q16 55 150 17Q284 55 284 150V387Z" fill="none" stroke="#8B2635" stroke-width="1.5"/>',.315,.02,.37,.96,0,2.7,false,'main','0 0 300 400');
 p.main(.5,.512,.338,.90,'arch',1.1,27);
 p.art('lace-black',.147,.298,.45,-5,2.8,false,'left');const leftPortrait=p.photo(.147,.298,.213,.376,'circle',-5,1.75,49,24);
 // 原素材的镜心为白色，照片放在框前并对准内椭圆，避免使用一整块亮白相框。
 p.art('gothic-frame',.834,.55,.64,0,3.1,false,'right');
 const rightPortrait=p.photo(.834,.579,.201,.40,'circle',0,1.09,49,32,'right');
 // 用连续的暗银压线覆盖通用相纸的虚线，使内缘与雕花镜框一致。
 for(const e of [leftPortrait,rightPortrait]){
  const w=e.width,h=e.height;
  p.graphic('镜框内缘暗银压线',`<ellipse cx="${w/2}" cy="${h/2}" rx="${w*.46}" ry="${h*.46}" fill="none" stroke="#514b5d" stroke-width="${Math.min(w,h)*.031}"/>`,e.x/p.W,e.y/p.H,w/p.W,h/p.H,e.rotation,5.1,true,'details',`0 0 ${w} ${h}`);
 }
 p.art('black-notebook',.221,.799,.29,-11,3,false,'bg');p.art('rose-candles',.064,.916,.29,-4,7.2);
 p.art('chandelier',.84,.124,.225,0,6.9);p.art('cross-silver',.281,.102,.15,-8,6.8);
 p.art('rose-red',.684,.947,.26,13,7.4);p.art('gothic-fan',.254,.97,.23,-10,7.3);
 p.art('thorn',.022,.493,.33,-8,6.8);p.art('bow-black',.944,.903,.16,9,7.4);
 p.art('chain-black',.627,.038,.27,-7,6.4,true,'hardware');p.art('rev-onyx-pendant',.949,.22,.135,11,6.9);
 p.art('rev-dark-library',.854,.94,.30,-4,7.2);p.art('rev-rose-key',.711,.745,.17,14,7.1);
 return p;
}
function sweetcool(){
 const p=new Page('sweetcool');p.grain();p.check(.018,.03,.235,.94,'accent',16,.3);
 p.paper('blue-grid',.265,.018,.432,.965,3,.5);p.fill('accent',.273,.032,.422,.932,-2,.7);
 p.paper('pink-torn',.709,.022,.27,.953,5,.8,.7);p.edge('accent',1.1);
 p.mat(.275,.052,.378,.902,-2,'paper',2.8,'#A8B8D8');p.main(.464,.507,.343,.841,'rect',1.13,28);
 p.mat(.719,.065,.239,.425,6,'paper',2.9,'#A8B8D8');p.photo(.84,.277,.202,.348,'polaroid',6,1.82,49,24,'right');
 p.mat(.691,.539,.276,.41,-7,'paper',3,'#A8B8D8');p.photo(.828,.743,.238,.332,'polaroid',-7,1.03,49,36,'right');
 p.mat(.046,.307,.194,.363,-7,'paper',3,'#A8B8D8');p.photo(.143,.488,.162,.288,'polaroid',-7,1.42,49,28,'left');
 p.art('blue-bow',.117,.145,.245,-13,6.6);p.art('ribbon-white',.61,.964,.29,-8,7.1);
 p.art('cherries',.694,.939,.19,-9,7.3);p.art('jelly-heart',.132,.756,.14,-9,7.2);
 p.art('pin-pearl',.143,.317,.065,-9,7.3,true,'hardware');p.art('bow-pearl',.103,.946,.12,-9,7.5);
 p.art('clear-clip',.835,.085,.115,7,7.1,true,'hardware');p.art('card-sleeve',.634,.895,.145,-2,7.2,true,'hardware');
 p.art('clip-star',.684,.556,.10,13,7.3,true,'hardware');p.art('star-jelly',.962,.514,.105,11,7.2);
 p.art('crystal',.668,.08,.10,-8,7.2);p.art('study-pearl-wave',.44,.035,.61,-5,6.5,true,'hardware');
 p.art('washi-cream',.085,.942,.18,-9,7.4,true,'hardware');p.art('tape-pink',.252,.512,.12,-10,6.6,true,'hardware');
 p.graphic('小卡收藏袋的透明压边','<path d="M172 23L433 15 444 370 183 378Z" fill="none" stroke="#e6edf2" stroke-width="1.5" opacity=".75"/><path d="M178 28L190 368M427 22L438 363" stroke="white" stroke-width=".6" opacity=".65"/>',0,0,1,1,0,6.1,true,'details','0 0 680 390');
 return p;
}

// 每个主题分别定义照片关系和纸面结构；共用的只有画图与取景工具。
export const buildReviewedPosters=()=>[school(),hk(),y2k(),mecha(),fairy(),letter(),stamp(),gothic(),sweetcool()];
export function buildReviewedPoster(id){return {school,hk,y2k,mecha,fairy,letter,stamp,gothic,sweetcool}[id]?.();}
