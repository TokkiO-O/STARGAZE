import { revisedPage, compose } from './revision-kit.js';

// 童话绘本改用复古自然图鉴：旧书、森林、飞鸟与黄铜小物，去掉幼儿卡通贴纸。
const SCENES={
 chip:{hero:[.34,.51,.34,.94,'rect'],photos:[[.718,.40,.23,.69,'polaroid',7,1.8,49,24],[.875,.79,.16,.43,'circle',-6,1.4,51,30]],
  papers:[['rev-butterfly-paper',-.08,-.04,.37,1.10,-8,1],['rev-sepia-study',.46,-.06,.54,1.13,5,.90],['rev-moss-letter',.64,.21,.32,.89,-8,1]],
  objects:[['rev-forest-painting',.085,.49,.91,-7,2.5,false],['rev-flower-book',.56,.82,.69,-8,3,false],['rev-moon',.588,.19,.35,12],['rev-bird',.96,.21,.35,-8],['rev-pressed-leaf',.19,.90,.36,-13],['rev-gold-key',.739,.91,.42,-12],['rev-butterfly',.48,.15,.32,14],['pressed-daisy',.49,.97,.34,-7],['rev-herbarium-book',.958,.79,.42,8,3,false]]},
 compact:{hero:[.48,.49,.68,.91,'rect'],photos:[[.856,.25,.29,.40,'circle',6,1.85,49,24],[.823,.80,.30,.34,'polaroid',-7,1.4,51,31]],
  papers:[['rev-butterfly-paper',-.06,.02,.47,.97,-7,1],['rev-sepia-study',.56,-.06,.48,1.13,6,.90],['rev-moss-letter',.51,.41,.49,.58,-6,1]],
  objects:[['rev-forest-painting',.075,.43,.77,-6,2.6,false],['rev-flower-book',.64,.66,.41,-8,3,false],['rev-moon',.66,.08,.27,12],['rev-bird',.09,.17,.31,-8],['rev-pressed-leaf',.085,.82,.33,-14],['rev-gold-key',.53,.96,.40,-11],['rev-butterfly',.64,.12,.27,13],['pressed-daisy',.10,.97,.34,-7],['rev-herbarium-book',.94,.56,.38,8,3,false]]},
 circle:{hero:[.41,.47,.65,.88,'rect'],photos:[[.84,.29,.28,.40,'polaroid',8,1.84,49,24],[.788,.80,.34,.33,'circle',-6,1.4,51,31]],
  papers:[['rev-butterfly-paper',-.07,.01,.48,.98,-8,1],['rev-sepia-study',.53,-.05,.50,1.12,5,.9],['rev-moss-letter',.58,.33,.44,.67,-7,1]],
  objects:[['rev-forest-painting',.06,.44,.76,-7,2.6,false],['rev-flower-book',.65,.55,.44,-8,3,false],['rev-moon',.66,.09,.31,10],['rev-bird',.95,.11,.29,-7],['rev-pressed-leaf',.045,.77,.37,-14],['rev-gold-key',.58,.96,.40,-12],['rev-butterfly',.11,.13,.32,-12],['pressed-daisy',.20,.96,.38,-8],['rev-herbarium-book',.95,.57,.41,8,3,false],['rev-deer',.96,.95,.30,7]]},
 polaroid:{hero:[.65,.49,.59,.93,'rect'],photos:[[.178,.29,.29,.45,'polaroid',-7,1.8,49,24],[.219,.80,.33,.32,'circle',6,1.4,51,30]],
  papers:[['rev-butterfly-paper',-.03,.02,.52,.98,-7,1],['rev-sepia-study',.53,-.04,.49,1.09,6,.9],['rev-moss-letter',.02,.38,.52,.59,-6,1]],
  objects:[['rev-forest-painting',.27,.44,.65,6,2.6,false],['rev-flower-book',.33,.63,.44,-8,3,false],['rev-moon',.36,.09,.26,12],['rev-bird',.95,.11,.33,-7],['rev-pressed-leaf',.03,.59,.40,-14],['rev-gold-key',.66,.96,.43,-12],['rev-butterfly',.35,.39,.28,12],['pressed-daisy',.06,1.02,.29,-9],['rev-herbarium-book',.47,.87,.38,7,3,false],['rev-deer',.965,.94,.31,7]]},
 collage:{hero:[.57,.49,.49,.94,'rect'],photos:[[.16,.31,.28,.51,'polaroid',-7,1.83,49,24],[.22,.80,.31,.33,'circle',6,1.4,51,31],[.91,.34,.16,.37,'polaroid',7,2,49,23]],
  papers:[['rev-butterfly-paper',-.04,-.01,.42,1.04,-7,1],['rev-sepia-study',.60,-.04,.43,1.10,6,.9],['rev-moss-letter',.08,.35,.36,.60,-8,1]],
  objects:[['rev-forest-painting',.30,.39,.72,6,2.6,false],['rev-flower-book',.31,.67,.53,-9,3,false],['rev-moon',.32,.10,.33,12],['rev-bird',.88,.09,.35,-8],['rev-pressed-leaf',.03,.67,.43,-14],['rev-gold-key',.70,.96,.46,-12],['rev-butterfly',.42,.14,.30,13],['pressed-daisy',.14,.985,.30,-7],['rev-herbarium-book',.94,.70,.49,8,3,false],['rev-deer',.95,.95,.33,7]]},
 tower:{hero:[.49,.36,.83,.64,'rect'],photos:[[.269,.815,.42,.29,'polaroid',-7,1.84,49,24],[.77,.78,.40,.29,'circle',6,1.4,51,31]],
  papers:[['rev-butterfly-paper',-.04,.01,.47,.96,-7,1],['rev-sepia-study',.53,-.04,.50,1.10,6,.9],['rev-moss-letter',.05,.57,.86,.41,-6,1]],
  objects:[['rev-forest-painting',.075,.42,.72,-6,2.6,false],['rev-flower-book',.53,.69,.63,-8,3,false],['rev-moon',.85,.055,.36,12],['rev-bird',.12,.075,.36,-8],['rev-pressed-leaf',.965,.55,.44,13],['rev-gold-key',.56,.96,.48,-12],['rev-butterfly',.95,.29,.34,13],['pressed-daisy',.06,.99,.31,-8],['rev-herbarium-book',.95,.72,.43,8,3,false],['rev-deer',.95,.96,.34,7]]},
 banner:{hero:[.36,.49,.36,.94,'rect'],photos:[[.725,.31,.245,.51,'polaroid',7,1.84,49,24],[.834,.795,.235,.36,'circle',-6,1.4,51,31]],
  papers:[['rev-butterfly-paper',-.05,-.02,.37,1.04,-7,1],['rev-sepia-study',.46,-.05,.54,1.12,5,.9],['rev-moss-letter',.58,.34,.43,.67,-6,1]],
  objects:[['rev-forest-painting',.08,.46,.92,-6,2.6,false],['rev-flower-book',.596,.80,.63,-8,3,false],['rev-moon',.59,.16,.37,12],['rev-bird',.94,.13,.38,-8],['rev-pressed-leaf',.17,.89,.42,-14],['rev-gold-key',.72,.95,.49,-12],['rev-butterfly',.50,.12,.34,13],['pressed-daisy',.475,.97,.39,-7],['rev-herbarium-book',.96,.58,.55,8,3,false],['rev-deer',.96,.95,.35,7],['twine-knot',.255,.98,.37,-10]]},
 scroll:{hero:[.374,.50,.215,.95,'rect'],photos:[[.105,.435,.15,.78,'polaroid',-7,1.82,49,24],[.666,.34,.15,.64,'circle',6,1.4,51,31],[.86,.59,.16,.72,'polaroid',7,1.82,49,24]],
  papers:[['rev-butterfly-paper',-.02,-.06,.30,1.14,-7,1],['rev-sepia-study',.43,-.06,.56,1.14,5,.9],['rev-moss-letter',.67,.06,.33,.96,-6,1]],
  objects:[['rev-forest-painting',.223,.41,.94,-6,2.6,false],['rev-flower-book',.545,.76,.81,-8,3,false],['rev-moon',.527,.18,.48,11],['rev-bird',.965,.16,.44,-8],['rev-pressed-leaf',.217,.83,.44,-14],['rev-gold-key',.753,.85,.56,-12],['rev-butterfly',.475,.15,.37,13],['pressed-daisy',.42,.98,.45,-7],['rev-herbarium-book',.97,.68,.65,8,3,false],['rev-deer',.71,.89,.41,7],['twine-knot',.09,.98,.45,-9]]},
 poster:{hero:[.38,.49,.34,.94,'rect'],photos:[[.752,.29,.25,.51,'polaroid',7,1.85,49,24],[.802,.79,.26,.37,'circle',-6,1.4,51,31]],
  papers:[['rev-butterfly-paper',-.04,-.02,.36,1.05,-7,1],['rev-sepia-study',.47,-.05,.53,1.12,5,.9],['rev-moss-letter',.58,.35,.42,.63,-7,1]],
  objects:[['rev-forest-painting',.09,.45,.92,-6,2.6,false],['rev-flower-book',.60,.79,.68,-8,3,false],['rev-moon',.60,.17,.39,12],['rev-bird',.945,.13,.40,-8],['rev-pressed-leaf',.178,.88,.45,-14],['rev-gold-key',.704,.95,.51,-12],['rev-butterfly',.53,.13,.35,13],['pressed-daisy',.49,.97,.43,-7],['rev-herbarium-book',.96,.56,.57,8,3,false],['rev-deer',.96,.95,.38,7],['twine-knot',.27,.98,.40,-10]]}
};
export function revisedFairy(W,H,profile,key){return compose(revisedPage(W,H,profile,key,'fairy'),SCENES[key]);}
