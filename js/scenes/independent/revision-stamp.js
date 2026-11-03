import { revisedPage, compose } from './revision-kit.js';

// 集邮册：邮票、照片与旧信封相互搭接；每种比例重新安排主藏品与几组邮政碎片。
const SCENES={
 chip:{hero:[.285,.50,.31,.94,'rect'],photos:[[.647,.41,.22,.72,'stamp',5,1.82,49,24],[.858,.73,.165,.47,'stamp',-7,1.4,51,31]],
  papers:[['rev-postcards',.42,-.06,.55,.88,4,1],['rev-route-tickets',.35,.46,.43,.59,-6,1],['rev-envelope-bundle',-.09,.30,.28,.80,-8,1]],
  objects:[['rev-mint-invoices',.05,.29,.63,-9,3,false],['rev-postage-lily',.486,.34,.45,-8],['rev-postage-train',.962,.25,.48,8],['rev-postage-blue',.49,.90,.33,5],['stamp-red',.754,.16,.30,-7],['rev-letter-closed',.738,.91,.48,8,3,false],['twine-knot',.385,.96,.40,-12],['gold-clip',.59,.055,.24,-7],['paper-corner',.935,.93,.17,7]],mark:[.405,.49,.13,.40,-12]},
 compact:{hero:[.36,.49,.57,.91,'rect'],photos:[[.819,.30,.30,.43,'stamp',7,1.85,49,24],[.798,.80,.34,.34,'stamp',-6,1.38,51,31]],
  papers:[['rev-postcards',.45,-.04,.58,.69,6,1],['rev-envelope-bundle',-.10,.40,.46,.65,-8,1],['rev-route-tickets',.46,.46,.48,.51,-5,1]],
  objects:[['rev-mint-invoices',.045,.25,.56,-9,3,false],['rev-postage-lily',.65,.68,.25,7],['rev-postage-blue',.93,.56,.30,-9],['stamp-red',.99,.08,.25,7],['rev-letter-closed',.34,.92,.46,-8,3,false],['twine-knot',.405,.96,.33,-10],['old-camera',.05,.96,.29,-8],['gold-clip',.63,.045,.24,-6],['rev-postage-star',.64,.945,.26,4]],mark:[.51,.52,.25,.29,-12]},
 circle:{hero:[.53,.46,.66,.86,'rect'],photos:[[.166,.76,.31,.32,'stamp',-8,1.8,49,24],[.839,.80,.29,.32,'stamp',7,1.4,51,30]],
  papers:[['rev-postcards',-.05,.04,.55,.72,-7,1],['rev-route-tickets',.49,.35,.53,.62,5,1],['rev-envelope-bundle',.05,.66,.67,.38,-5,1]],
  objects:[['rev-mint-invoices',.12,.24,.49,-8,3,false],['rev-postage-lily',.12,.46,.36,-6],['rev-postage-blue',.945,.35,.32,7],['stamp-red',.875,.08,.32,10],['rev-postage-star',.675,.92,.28,-7],['rev-mail-bundle',.49,.92,.45,-8,3,false],['twine-knot',.45,.97,.35,-9],['gold-clip',.36,.035,.24,-8],['paper-corner',.93,.65,.18,6]],mark:[.16,.50,.25,.25,-14]},
 polaroid:{hero:[.65,.49,.58,.93,'rect'],photos:[[.178,.29,.29,.46,'stamp',-7,1.82,49,24],[.208,.80,.33,.31,'stamp',6,1.4,51,31]],
  papers:[['rev-postcards',-.03,.01,.48,.75,-6,1],['rev-route-tickets',.05,.39,.57,.60,6,1],['rev-envelope-bundle',.38,.67,.65,.38,-7,1]],
  objects:[['rev-mint-invoices',.325,.13,.45,8,3,false],['rev-postage-lily',.125,.49,.25,-8],['rev-postage-blue',.38,.975,.24,7],['stamp-red',.95,.12,.28,10],['rev-postage-train',.95,.76,.32,5],['rev-letter-closed',.495,.94,.43,-7,3,false],['twine-knot',.67,.98,.35,-8],['old-camera',.04,.96,.29,-8],['gold-clip',.36,.045,.23,9]],mark:[.255,.36,.22,.28,-14]},
 collage:{hero:[.335,.49,.45,.93,'rect'],photos:[[.777,.275,.29,.44,'stamp',6,1.85,49,24],[.812,.79,.28,.35,'stamp',-7,1.42,51,31]],
  papers:[['rev-postcards',.45,-.06,.56,.75,6,1],['rev-envelope-bundle',-.06,.34,.38,.66,-9,1],['rev-route-tickets',.43,.43,.55,.57,-7,1]],
  objects:[['rev-mint-invoices',.039,.24,.56,-8,3,false],['rev-postage-lily',.625,.56,.34,-6],['rev-postage-blue',.96,.51,.34,7],['stamp-red',.95,.115,.31,8],['rev-postage-star',.596,.90,.30,-7],['rev-letter-closed',.35,.94,.49,-8,3,false],['twine-knot',.48,.97,.40,-10],['old-camera',.05,.95,.33,-9],['gold-clip',.60,.06,.27,-8],['paper-corner',.94,.93,.19,7]],mark:[.415,.41,.18,.28,-14]},
 tower:{hero:[.46,.35,.77,.62,'rect'],photos:[[.271,.81,.40,.30,'stamp',-7,1.85,49,24],[.785,.775,.31,.31,'stamp',7,1.42,51,31]],
  papers:[['rev-postcards',.49,.03,.52,.59,7,1],['rev-route-tickets',-.06,.38,.61,.59,-8,1],['rev-envelope-bundle',.20,.59,.79,.39,-6,1]],
  objects:[['rev-mint-invoices',.045,.29,.57,-7,3,false],['rev-postage-lily',.928,.30,.33,8],['rev-postage-blue',.59,.68,.36,-8],['stamp-red',.89,.07,.31,8],['rev-postage-train',.09,.63,.32,-8],['rev-mail-bundle',.59,.94,.50,-6,3,false],['twine-knot',.55,.98,.39,-8],['old-camera',.06,.96,.34,-8],['gold-clip',.20,.025,.28,-7],['paper-corner',.94,.92,.20,7]],mark:[.64,.45,.26,.18,-12]},
 banner:{hero:[.28,.49,.37,.95,'rect'],photos:[[.665,.335,.29,.56,'stamp',6,1.85,49,24],[.841,.80,.20,.33,'stamp',-7,1.4,51,31]],
  papers:[['rev-postcards',.44,-.06,.55,.72,5,1],['rev-envelope-bundle',-.07,.31,.33,.72,-8,1],['rev-route-tickets',.43,.44,.56,.57,-6,1]],
  objects:[['rev-mint-invoices',.045,.24,.63,-9,3,false],['rev-postage-lily',.535,.61,.43,-7],['rev-postage-blue',.705,.90,.36,5],['rev-postage-train',.952,.34,.53,7],['stamp-red',.839,.125,.34,7],['rev-letter-closed',.465,.88,.55,-7,3,false],['twine-knot',.36,.96,.44,-11],['old-camera',.055,.96,.35,-8],['gold-clip',.47,.05,.30,-7],['rev-postage-star',.94,.92,.31,7]],mark:[.405,.40,.16,.31,-13]},
 scroll:{hero:[.535,.50,.20,.95,'rect'],photos:[[.191,.41,.165,.75,'stamp',-7,1.83,49,24],[.824,.57,.16,.74,'stamp',6,1.42,51,31]],
  papers:[['rev-postcards',.26,-.07,.37,1.08,-5,1],['rev-envelope-bundle',-.03,.02,.27,1.06,-8,1],['rev-route-tickets',.60,-.06,.39,1.13,5,1]],
  objects:[['rev-mint-invoices',.03,.40,.88,-8,3,false],['rev-postage-lily',.328,.66,.60,-6],['rev-postage-blue',.718,.80,.57,7],['rev-postage-train',.956,.40,.69,7],['stamp-red',.682,.20,.42,-7],['rev-letter-closed',.38,.38,.62,-8,3,false],['twine-knot',.435,.93,.51,-8],['old-camera',.098,.96,.43,-9],['gold-clip',.60,.07,.34,-8],['rev-postage-star',.268,.93,.34,7],['paper-corner',.94,.88,.23,8]],mark:[.40,.40,.12,.43,-14]},
 poster:{hero:[.515,.49,.325,.95,'rect'],photos:[[.157,.30,.25,.54,'stamp',-7,1.85,49,24],[.821,.685,.27,.55,'stamp',6,1.4,51,31]],
  papers:[['rev-postcards',.58,-.04,.44,.66,6,1],['rev-envelope-bundle',-.06,.24,.42,.76,-8,1],['rev-route-tickets',.56,.34,.43,.65,-6,1]],
  objects:[['rev-mint-invoices',.30,.30,.65,9,3,false],['rev-postage-lily',.08,.72,.44,-7],['rev-postage-blue',.295,.79,.42,6],['rev-postage-train',.947,.30,.48,7],['stamp-red',.725,.18,.38,-8],['rev-letter-closed',.735,.30,.51,7,3,false],['rev-mail-bundle',.23,.92,.58,-8,3,false],['twine-knot',.40,.96,.45,-10],['old-camera',.06,.96,.37,-8],['gold-clip',.36,.05,.31,-7],['rev-postage-star',.706,.93,.31,6],['paper-corner',.95,.93,.22,7]],mark:[.276,.44,.14,.29,-13]}
};
export function revisedStamp(W,H,profile,key){return compose(revisedPage(W,H,profile,key,'stamp'),SCENES[key]);}
