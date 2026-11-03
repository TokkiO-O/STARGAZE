import { CuratedPage, finishScene } from './curated-page.js';
import { papers, photographs, objects } from './revision-kit.js';

// 横幅和长手幅分别安排连续的照片与实物带，取消原先为题字预留的大块空区。
const SCENES={
 school:{
  banner:{hero:[.49,.50,.43,.95,'rect'],photos:[[.135,.32,.22,.47,'circle',-5,1.55,49,28],[.145,.81,.18,.31,'polaroid',-7,1.82,49,24],[.844,.22,.205,.28,'rect',6,1.95,49,23],[.834,.515,.205,.28,'rect',6,1.55,51,29],[.824,.81,.205,.28,'rect',6,1.35,49,35]],
   papers:[['study-gingham',-.04,0,.51,1,0,.9],['rev-pink-torn-paper',.02,.12,.35,.80,-9,.9],['study-lined-note',.67,.01,.34,.98,6,1],['proof-mint-tickets',.06,.57,.30,.45,-7,1]],
   objects:[['blue-diary',.31,.16,.63,-8,2.8,false],['study-pearl-round',.135,.32,.52,-5,5.2],['blue-cassette',.706,.13,.48,8,3,false],['blue-tulip',.025,.58,.49,-13],['proof-soft-camera',.025,.96,.36,-9],['blue-phone',.965,.84,.43,8],['blue-daisy',.66,.94,.39,-7],['white-daisy',.75,.97,.28,11],['study-butterfly',.962,.17,.36,12],['star-clip',.335,.06,.30,-12],['blue-candy',.29,.96,.30,8],['study-satin-bow',.025,.045,.30,-13],['pearl-shell',.97,.50,.31,11]]},
  scroll:{hero:[.313,.50,.23,.95,'rect'],photos:[[.083,.44,.14,.76,'circle',-6,1.55,49,28],[.569,.42,.17,.75,'polaroid',7,1.82,49,24],[.813,.24,.17,.38,'rect',-5,1.92,49,23],[.85,.77,.20,.38,'rect',-5,1.35,50,35]],
   papers:[['study-gingham',-.02,0,.43,1,0,.9],['rev-pink-torn-paper',.43,-.04,.29,1.09,6,.9],['study-lined-note',.71,-.03,.31,1.05,-5,1],['proof-mint-tickets',.42,.34,.33,.67,-6,1]],
   objects:[['blue-diary',.475,.41,1.0,-7,2.8,false],['study-pearl-oval',.083,.44,.86,-6,5.2],['blue-cassette',.711,.21,.61,8,3,false],['blue-tulip',.02,.55,.64,-13],['proof-soft-camera',.18,.94,.51,-9],['blue-phone',.965,.81,.51,8],['blue-daisy',.43,.96,.46,-7],['white-daisy',.68,.96,.34,11],['study-butterfly',.96,.14,.42,13],['star-clip',.43,.08,.37,-11],['blue-candy',.735,.94,.41,8],['study-satin-bow',.19,.10,.45,-12],['pearl-shell',.96,.49,.36,11]]}
 },
 hk:{
  banner:{hero:[.405,.50,.42,.95,'rect'],photos:[[.078,.29,.13,.46,'film',-5,1.82,49,24],[.105,.79,.17,.33,'polaroid',6,1.4,51,31],[.80,.285,.27,.49,'polaroid',7,1.90,49,23],[.81,.80,.28,.33,'rect',-6,1.35,50,35]],
   papers:[['newspaper',-.05,-.04,.42,1.1,-8,1],['proof-sepia-tickets',.56,-.04,.43,1.10,6,1],['rev-postcards',.64,.36,.34,.63,-7,1]],
   objects:[['vinyl',.655,.34,.77,7,3,false],['rev-analogue-camera',.655,.96,.44,-8],['radio',.26,.96,.49,-5],['clock',.965,.63,.51,8],['proof-gramophone',.025,.585,.30,-8],['rev-route-tickets',.13,.10,.53,-10,3,false],['rev-vintage-globe',.69,.11,.40,7,3,false],['rev-black-tape',.88,.06,.27,10],['black-clip',.20,.055,.28,-9],['gray-cassette',.945,.96,.37,8],['cardboard-tape',.455,.97,.29,-7]]},
  scroll:{hero:[.62,.50,.24,.96,'rect'],photos:[[.149,.29,.18,.48,'film',-6,1.84,49,24],[.255,.77,.20,.39,'polaroid',7,1.4,51,31],[.895,.44,.14,.80,'polaroid',6,1.87,49,24]],
   papers:[['newspaper',-.02,-.06,.35,1.14,-7,1],['proof-sepia-tickets',.27,-.06,.38,1.13,6,1],['rev-postcards',.71,-.05,.30,1.12,-5,1]],
   objects:[['vinyl',.42,.43,1.05,-7,3,false],['rev-analogue-camera',.79,.89,.64,8],['radio',.445,.94,.61,-5],['clock',.976,.69,.59,8],['proof-gramophone',.039,.59,.53,-8],['rev-route-tickets',.21,.15,.68,-10,3,false],['rev-vintage-globe',.34,.15,.50,7,3,false],['rev-black-tape',.826,.07,.33,9],['black-clip',.49,.05,.35,-9],['gray-cassette',.096,.96,.47,-7],['cardboard-tape',.69,.97,.34,-7]]}
 },
 y2k:{
  banner:{hero:[.64,.50,.43,.97,'circle'],photos:[[.197,.52,.335,.65,'rect',-5,1.45,50,28],[.36,.18,.18,.32,'polaroid',7,1.92,49,23],[.91,.80,.155,.33,'polaroid',-7,1.4,51,31]],
   papers:[['paper-blue',-.03,-.02,.42,1.05,-6,.9],['rev-pink-torn-paper',.27,-.04,.32,1.08,7,1]],
   objects:[['orbit',.64,.50,1.12,9,2.9,false],['rev-blue-gamepad',.355,.83,.65,-12],['rev-blue-player',.945,.34,.51,12],['chrome-heart',.45,.92,.47,10],['chrome-flower',.08,.96,.41,-9],['rev-silver-console',.13,.095,.43,-8,3,false],['spike-star',.91,.10,.37,12],['pixel-arrow',.38,.40,.36,-8],['blue-video',.025,.75,.42,-12],['black-sparkles',.48,.12,.23,8],['holo-cross',1.0,.50,.22,13]],window:[.005,.105,.39,.81,-5,2.7]},
  scroll:{hero:[.435,.50,.23,.98,'circle'],photos:[[.155,.51,.23,.67,'rect',-5,1.45,50,28],[.728,.285,.185,.47,'polaroid',6,1.9,49,23],[.855,.785,.20,.34,'polaroid',-6,1.4,51,31]],
   papers:[['paper-blue',-.02,-.06,.31,1.14,-5,1],['rev-pink-torn-paper',.55,-.06,.44,1.14,6,1]],
   objects:[['orbit',.435,.5,1.13,8,2.9,false],['rev-blue-gamepad',.608,.79,.73,-11],['rev-blue-player',.946,.25,.58,12],['chrome-heart',.287,.88,.53,8],['chrome-flower',.04,.96,.47,-8],['rev-silver-console',.25,.09,.51,-8,3,false],['spike-star',.603,.14,.44,12],['pixel-arrow',.306,.36,.44,-8],['blue-video',.022,.67,.49,-11],['black-sparkles',.535,.10,.28,7],['holo-cross',.978,.69,.34,12]],window:[.014,.105,.281,.81,-5,2.7]}
 },
 french:{
  banner:{hero:[.625,.50,.405,.96,'circle'],photos:[[.15,.32,.22,.55,'circle',-5,1.65,49,25],[.266,.79,.26,.35,'polaroid',6,1.4,51,31],[.934,.79,.13,.35,'polaroid',-7,1.85,49,24]],
   papers:[['proof-floral-letter',-.05,-.04,.46,1.10,-7,1],['proof-burgundy-book',.28,-.06,.32,1.10,-6,1],['proof-pink-ledger',.73,-.05,.28,1.1,7,.9]],
   objects:[['doily',.625,.50,1.06,0,3.2,false],['pink-bow',.025,.42,.45,-10],['cream-bow',.80,.16,.56,9],['rose',.96,.55,.56,9],['proof-perfume',.42,.79,.41,-7],['clock',.30,.96,.39,7],['proof-record-player',.07,.94,.47,-7],['herb-paper',.905,.20,.45,8,3,false],['rev-gold-key',.75,.95,.40,-12],['white-daisy',.48,.96,.27,9],['rev-butterfly',.34,.16,.31,-10]]},
  scroll:{hero:[.583,.50,.225,.96,'circle'],photos:[[.157,.395,.16,.73,'polaroid',-7,1.84,49,24],[.361,.75,.135,.49,'circle',6,1.4,51,31],[.853,.39,.17,.73,'polaroid',7,1.85,49,24]],
   papers:[['proof-floral-letter',-.03,-.07,.35,1.15,-7,1],['proof-burgundy-book',.28,-.08,.32,1.16,-6,1],['proof-pink-ledger',.69,-.06,.33,1.13,7,.95]],
   objects:[['doily',.583,.50,1.07,0,3.2,false],['pink-bow',.03,.28,.55,-10],['cream-bow',.753,.13,.67,9],['rose',.96,.67,.68,9],['proof-perfume',.45,.76,.48,-7],['clock',.28,.96,.47,8],['proof-record-player',.08,.94,.56,-8],['herb-paper',.964,.20,.53,8,3,false],['rev-gold-key',.71,.96,.49,-12],['white-daisy',.51,.97,.34,9],['rev-butterfly',.367,.14,.38,-10]]}
 },
 mecha:{
  banner:{hero:[.50,.50,.39,.97,'hexagon'],photos:[[.137,.44,.23,.74,'film',-4,1.8,49,24],[.846,.32,.24,.54,'rect',6,1.9,49,23],[.85,.815,.21,.32,'rect',-5,1.4,51,31]],
   papers:[['rev-shipping-label',-.03,.015,.36,.90,-7,.94],['news-edge',.67,-.02,.36,1.08,6,.9],['broken-paper',.31,.22,.40,.75,-5,1]],
   objects:[['chain',.53,.035,.92,-8],['rev-rivet-heart',.68,.95,.44,9],['rev-safety-pin',.32,.12,.43,-14],['rev-silver-keys',.956,.54,.44,13],['rev-black-tape',.92,.05,.33,9],['spring',.255,.93,.53,-8],['old-camera',.94,.96,.39,8],['spike-star',.72,.115,.37,12],['chrome-flower',.045,.95,.39,-9],['hazard',.13,.025,.63,-4],['rev-barcode',.425,.98,.38,0,6.5],['silver-bead',.58,.95,.18,0]]},
  scroll:{hero:[.665,.50,.24,.97,'hexagon'],photos:[[.113,.35,.18,.65,'film',-5,1.82,49,24],[.371,.60,.22,.76,'rect',6,1.43,51,31],[.907,.49,.13,.76,'rect',-5,1.9,49,23]],
   papers:[['rev-shipping-label',-.02,-.05,.30,1.12,-7,.96],['news-edge',.73,-.07,.28,1.15,5,.9],['broken-paper',.26,.02,.34,.96,-6,1]],
   objects:[['chain',.64,.035,1.16,-7],['rev-rivet-heart',.495,.85,.68,-9],['rev-safety-pin',.25,.12,.52,-14],['rev-silver-keys',.977,.68,.55,12],['rev-black-tape',.87,.07,.39,9],['spring',.18,.93,.65,-8],['old-camera',.80,.95,.48,8],['spike-star',.817,.12,.45,11],['chrome-flower',.04,.96,.47,-9],['hazard',.335,.015,.82,0],['rev-barcode',.646,.98,.46,0,6.5],['silver-bead',.742,.95,.22,0]]}
 },
 letter:{
  banner:{hero:[.49,.50,.395,.95,'rect'],photos:[[.127,.31,.23,.52,'polaroid',-7,1.83,49,24],[.19,.81,.26,.31,'rect',6,1.4,51,31],[.841,.48,.25,.82,'polaroid',7,1.84,49,24]],
   papers:[['proof-floral-letter',-.05,-.05,.45,1.11,-7,1],['rev-postcards',.62,-.04,.40,1.10,6,1],['rev-moss-letter',.08,.32,.36,.64,-7,1]],
   objects:[['rev-open-story',.25,.49,.78,8,3,false],['rev-vintage-globe',.72,.15,.51,8,3,false],['typewriter',.705,.88,.49,-8],['rev-watercolor',.33,1.01,.39,8],['botanical',.04,.62,.61,-10],['pressed-daisy',.57,.97,.39,-8],['rev-bird',.96,.14,.35,8],['rev-gold-key',.9,.96,.40,-10],['gold-clip',.29,.06,.30,-8],['rev-paint-brush',.965,.67,.47,8],['twine-knot',.15,.96,.39,-10]]},
  scroll:{hero:[.298,.50,.23,.95,'rect'],photos:[[.075,.30,.12,.47,'film',-6,1.83,49,24],[.115,.79,.17,.33,'polaroid',6,1.4,51,31],[.641,.49,.18,.84,'polaroid',7,1.84,49,24],[.882,.31,.16,.56,'rect',-5,1.5,51,29]],
   papers:[['proof-floral-letter',-.025,-.06,.31,1.14,-7,1],['rev-postcards',.68,-.05,.33,1.12,6,1],['rev-moss-letter',.40,-.04,.28,1.08,-5,1]],
   objects:[['rev-open-story',.462,.54,.98,-7,3,false],['rev-vintage-globe',.777,.25,.65,8,3,false],['typewriter',.824,.87,.62,-8],['rev-watercolor',.52,.94,.64,8],['botanical',.021,.66,.71,-10],['pressed-daisy',.40,.97,.47,-8],['rev-bird',.97,.16,.42,8],['rev-gold-key',.72,.96,.48,-11],['gold-clip',.43,.05,.36,-8],['rev-paint-brush',.974,.66,.55,8],['twine-knot',.177,.98,.46,-10]]}
 },
 sweetcool:{
  banner:{hero:[.465,.50,.415,.96,'rect'],photos:[[.102,.42,.18,.73,'film',-5,1.82,49,24],[.81,.285,.27,.50,'polaroid',7,1.9,49,23],[.841,.79,.25,.34,'polaroid',-6,1.4,51,31]],
   papers:[['paper-blue',-.03,-.04,.39,1.1,-7,1],['rev-pink-torn-paper',.63,-.04,.38,1.10,6,1],['news-edge',.15,.03,.29,.95,-6,.65]],
   objects:[['chain',.48,.045,1.02,-9],['blue-diary',.721,.26,.69,8,3,false],['rev-blue-player',.965,.50,.47,10],['blue-video',.05,.94,.43,-9],['chrome-heart',.645,.91,.48,8],['blue-gem',.94,.11,.35,12],['study-butterfly',.25,.82,.39,-10],['cherry-pair',.45,.98,.29,-8],['star-clip',.715,.64,.34,13],['study-satin-bow',.025,.035,.31,-12],['rev-silver-console',.94,.95,.42,8],['black-sparkles',.26,.13,.25,9]]},
  scroll:{hero:[.59,.50,.25,.96,'rect'],photos:[[.145,.32,.19,.62,'polaroid',-7,1.84,49,24],[.351,.70,.14,.51,'film',6,1.4,51,31],[.877,.42,.18,.75,'polaroid',7,1.85,49,24]],
   papers:[['paper-blue',-.02,-.05,.36,1.12,-6,1],['rev-pink-torn-paper',.69,-.05,.32,1.12,6,1],['news-edge',.29,-.05,.28,1.13,-5,.70]],
   objects:[['chain',.50,.045,1.36,-8],['blue-diary',.782,.24,.85,8,3,false],['rev-blue-player',.971,.37,.56,10],['blue-video',.035,.94,.52,-9],['chrome-heart',.459,.89,.59,-8],['blue-gem',.778,.12,.43,12],['study-butterfly',.236,.77,.48,-10],['cherry-pair',.62,.98,.36,-8],['star-clip',.78,.75,.41,13],['study-satin-bow',.051,.09,.51,-12],['rev-silver-console',.85,.96,.54,8],['black-sparkles',.30,.13,.31,8],['blue-cassette',.292,.19,.66,-8,3,false],['rev-blue-fold-phone',.422,.39,.62,-12]]}
 }
};

export function revisedWide(W,H,profile,key){
    const p=new CuratedPage(W,H,profile,key),spec=SCENES[profile.id]?.[key];
    p.paper(profile.id==='mecha'?'dark':'soft');
    if(profile.id==='school')p.material('study-flowers',.38,0,.62,1,0,.65,.1,'蓝色碎花纸',false,'bg','cover');
    else if(profile.id==='mecha')p.plate('mechanical',0,0,1,1,0,.2);
    else if(profile.id==='sweetcool')p.plate('fashion-slash',0,0,1,1,0,.2);
    else p.surface(profile.paper,0,0,1,1,0,.70,.2,'主题纹理纸');
    papers(p,spec.papers);
    if(spec.window)p.window(...spec.window);
    photographs(p,spec);
    objects(p,spec.objects);
    return finishScene(p);
}
