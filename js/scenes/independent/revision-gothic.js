import { revisedPage, compose } from './revision-kit.js';

// 哥特：不再把人物孤立放进空拱廊。花窗、旧书、黑蕾丝构成连续背景，实物连接相片边缘。
const SCENES={
 chip:{hero:[.43,.51,.33,.96,'arch'],photos:[[.119,.46,.205,.77,'polaroid',-8,1.8,49,24],[.78,.58,.24,.72,'circle',6,1.4,51,32]],
  papers:[['news-edge',-.04,.04,.30,.96,-9,.60],['rev-black-lace',.49,-.16,.52,1.24,8,.67],['rev-gothic-window',.79,-.04,.23,1.10,0,.75]],
  objects:[['rev-occult-book',.26,.80,.62,-13,2.8,false],['rev-raven',.67,.19,.37,-9],['rev-gothic-castle',.96,.76,.58,0],['rev-rose-candles',.035,.85,.40,-6],['rev-rose-key',.625,.79,.42,12],['gothic-fan',.40,.97,.40,-10],['black-moth',.91,.14,.29,14],['rev-rose-single',.72,.96,.28,-20]]},
 compact:{hero:[.54,.49,.64,.94,'arch'],photos:[[.147,.39,.30,.52,'polaroid',-9,1.85,49,23],[.835,.79,.30,.36,'circle',6,1.52,51,27]],
  papers:[['news-edge',-.07,.01,.49,1,-7,.60],['rev-black-lace',.61,-.10,.46,1.14,8,.65],['rev-gothic-window',.70,.02,.30,.68,4,.78]],
  objects:[['rev-dark-book',.13,.78,.50,-12,2.7,false],['rev-raven',.055,.045,.25,-10],['rev-onyx-pendant',.86,.10,.29,12],['gothic-fan',.085,.94,.40,-15],['ruby-cup',.69,.95,.29,6],['rev-rose-single',1.03,.47,.33,14],['black-moth',.43,.965,.25,-6],['rev-locked-heart',.965,.945,.24,12]]},
 circle:{hero:[.435,.49,.68,.91,'arch'],photos:[[.831,.30,.29,.40,'polaroid',8,1.85,49,23],[.795,.795,.34,.33,'circle',-6,1.45,51,30]],
  papers:[['news-edge',-.05,.12,.44,.89,-8,.58],['rev-black-lace',.63,-.04,.42,1.1,5,.75],['rev-gothic-window',.70,.25,.28,.50,0,.7]],
  objects:[['rev-occult-book',.80,.56,.43,8,3,false],['rev-gothic-castle',.08,.78,.43,-5],['rev-raven',.09,.16,.30,-13],['rev-rose-key',.70,.16,.33,12],['ruby-cup',.98,.95,.29,8],['gothic-fan',.40,.97,.37,-10],['rev-rose-single',1.05,.47,.34,15],['black-moth',.57,.05,.24,10],['rev-onyx-pendant',.53,.92,.26,-9]]},
 polaroid:{hero:[.365,.51,.59,.94,'arch'],photos:[[.816,.285,.30,.43,'polaroid',8,1.85,49,24],[.82,.79,.32,.35,'circle',-6,1.4,51,31]],
  papers:[['news-edge',-.05,.06,.43,.94,-7,.58],['rev-black-lace',.59,-.06,.44,1.10,5,.72],['rev-gothic-window',.72,.35,.28,.45,0,.78]],
  objects:[['rev-dark-library',.74,.91,.48,-7,3,false],['rev-gothic-castle',.06,.75,.46,-5],['rev-raven',.07,.16,.32,-13],['rev-onyx-pendant',.61,.13,.30,9],['gothic-fan',.37,.96,.45,-9],['ruby-cup',.98,.94,.30,7],['rev-rose-single',1.03,.46,.33,13],['black-moth',.68,.49,.28,-8],['rev-locked-heart',.63,.85,.29,-9]]},
 collage:{hero:[.575,.51,.51,.94,'arch'],photos:[[.159,.34,.30,.53,'polaroid',-8,1.82,49,24],[.20,.80,.29,.34,'circle',6,1.45,51,30],[.914,.45,.15,.35,'rect',7,2.1,49,22]],
  papers:[['news-edge',-.03,.02,.36,.96,-8,.61],['rev-black-lace',.71,-.04,.32,1.10,5,.73],['rev-gothic-window',.83,.10,.20,.82,0,.8]],
  objects:[['rev-occult-book',.285,.54,.45,-12,3,false],['rev-gothic-castle',-.025,.70,.36,-6],['rev-raven',.30,.045,.26,9],['rev-rose-candles',.963,.80,.40,5],['rev-rose-key',.35,.79,.37,-13],['gothic-fan',.57,.97,.41,8],['ruby-cup',.84,.95,.30,6],['rev-rose-single',1.02,.69,.30,15],['black-moth',.08,.05,.30,-13],['rev-locked-heart',.32,.98,.26,6]]},
 tower:{hero:[.49,.375,.84,.68,'arch'],photos:[[.265,.809,.42,.29,'polaroid',-7,1.82,49,24],[.765,.79,.40,.28,'circle',6,1.4,51,31]],
  papers:[['news-edge',-.08,.03,.48,.94,-7,.62],['rev-black-lace',.69,-.04,.37,1.1,6,.71],['rev-gothic-window',.72,.19,.29,.38,5,.7]],
  objects:[['rev-dark-library',.54,.69,.62,-8,3,false],['rev-raven',.095,.13,.34,-13],['rev-onyx-pendant',.88,.065,.33,9],['rev-gothic-castle',.06,.60,.43,-6],['rev-rose-single',1.03,.61,.34,13],['gothic-fan',.13,.96,.46,-11],['ruby-cup',.84,.95,.34,7],['rev-rose-key',.51,.93,.42,16],['black-moth',.52,.985,.28,0],['rev-locked-heart',.96,.76,.28,-7]]},
 banner:{hero:[.49,.50,.39,.96,'arch'],photos:[[.143,.435,.235,.77,'polaroid',-7,1.8,49,24],[.826,.69,.24,.50,'circle',-5,1.40,51,32],[.858,.23,.18,.34,'rect',7,1.95,49,22]],
  papers:[['news-edge',-.03,.01,.32,.98,-8,.62],['rev-black-lace',.63,-.06,.40,1.15,7,.75],['rev-gothic-window',.71,.25,.28,.71,0,.82]],
  objects:[['rev-occult-book',.28,.72,.56,-12,3,false],['rev-gothic-castle',.04,.80,.49,-5],['rev-raven',.28,.045,.30,8],['rev-rose-candles',.975,.48,.45,3],['rev-onyx-pendant',.68,.10,.32,-8],['gothic-fan',.48,.98,.48,-7],['ruby-cup',.91,.95,.34,7],['rev-rose-key',.695,.84,.42,18],['rev-rose-single',1.02,.10,.29,10],['black-moth',.04,.07,.31,-10],['rev-locked-heart',.25,.96,.30,-8]]},
 scroll:{hero:[.38,.51,.22,.96,'arch'],photos:[[.113,.46,.145,.81,'polaroid',-7,1.85,49,24],[.637,.38,.16,.65,'circle',5,1.45,51,30],[.83,.57,.16,.78,'polaroid',7,1.88,49,24]],
  papers:[['news-edge',-.02,.03,.26,.96,-7,.68],['rev-black-lace',.46,-.06,.30,1.13,6,.73],['rev-gothic-window',.71,-.05,.28,1.12,0,.86]],
  objects:[['rev-dark-library',.535,.81,.60,-7,3,false],['rev-gothic-castle',.025,.77,.59,-4],['rev-raven',.229,.28,.47,9],['rev-gothic-door',.964,.50,.93,0],['rev-onyx-pendant',.514,.13,.40,-9],['gothic-fan',.37,.97,.54,-7],['ruby-cup',.71,.92,.41,9],['rev-rose-key',.72,.48,.50,17],['rev-rose-single',.929,.89,.41,12],['black-moth',.196,.91,.36,-9],['rev-locked-heart',.586,.94,.33,-8],['rev-rose-candles',.065,.11,.35,-4]]},
 poster:{hero:[.565,.50,.37,.96,'arch'],photos:[[.159,.30,.24,.54,'polaroid',-7,1.82,49,24],[.216,.79,.235,.38,'circle',5,1.43,51,31],[.858,.29,.195,.48,'polaroid',7,1.95,49,22]],
  papers:[['news-edge',-.03,.02,.37,.96,-8,.65],['rev-black-lace',.67,-.05,.36,1.12,6,.74],['rev-gothic-window',.74,.13,.26,.75,0,.84]],
  objects:[['rev-occult-book',.315,.45,.49,-12,3,false],['rev-dark-library',.835,.82,.55,8,3.2,false],['rev-gothic-castle',.05,.66,.48,-5],['rev-raven',.335,.12,.39,8],['rev-onyx-pendant',.733,.11,.34,-8],['gothic-fan',.51,.98,.46,-8],['ruby-cup',.958,.95,.34,8],['rev-rose-key',.73,.76,.43,18],['rev-rose-single',1.03,.62,.35,12],['black-moth',.045,.07,.33,-13],['rev-locked-heart',.32,.96,.29,-8],['rev-rose-candles',.09,.95,.33,0]]}
};
export function revisedGothic(W,H,profile,key){return compose(revisedPage(W,H,profile,key,'gothic'),SCENES[key]);}
