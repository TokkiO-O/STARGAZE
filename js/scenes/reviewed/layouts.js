import {ReviewPage} from './page.js';
import {addThemeDetails,refinePhotoPlan} from './size-details.js';

// 八种扩展比例分别定义：h 为主图，s 为独立副图，o 为实物摆位。
// 每组照片都保留自己的取景；坐标是当前画布的比例，不从海报按位移套算。
const DESIGNS={
 school:{
  chip:{h:[.55,.5,.30,.94],s:[[.17,.43,.23,.57,'circle',-5,1.8],[.86,.57,.20,.62,'polaroid',7,1.06]],o:[['blue-daisy',.34,.91,.34,-12],['study-satin-bow',.04,.10,.30,-9],['proof-soft-camera',.07,.96,.32,-8],['pencils',.73,.92,.33,-23],['study-milk',.97,.94,.24,8],['star-clip',.39,.08,.19,-12],['washi-cream',.84,.19,.26,8]]},
  compact:{h:[.64,.48,.60,.84],s:[[.18,.33,.28,.36,'circle',-8,1.8],[.19,.75,.30,.35,'polaroid',7,1.08]],o:[['blue-diary',.33,.53,.36,-9],['blue-daisy',.37,.91,.26,-12],['blue-bow',.09,.08,.23,-12],['pencils',.93,.88,.25,13],['cake',.73,.95,.19,5],['paperclip',.29,.18,.11,-9],['memo-book',.05,.94,.24,-7],['study-milk',.97,.11,.17,6]]},
  circle:{h:[.48,.47,.67,.78],s:[[.83,.78,.27,.31,'polaroid',8,1.7],[.16,.87,.23,.19,'rect',-6,1.08]],o:[['blue-diary',.89,.36,.26,10],['blue-daisy',.05,.65,.25,-13],['blue-bow',.12,.10,.24,-11],['pencils',.55,.97,.24,-25],['proof-soft-camera',.04,.96,.24,-9],['cake',.96,.97,.19,7],['paperclip',.90,.57,.11,13],['washi-cream',.46,.075,.17,-7]]},
  polaroid:{h:[.34,.48,.51,.85],s:[[.81,.26,.28,.37,'polaroid',7,1.8],[.81,.74,.29,.37,'rect',-6,1.07]],o:[['blue-daisy',.62,.86,.26,-13],['blue-bow',.06,.12,.25,-12],['blue-diary',.66,.42,.28,9],['pencils',.94,.94,.27,17],['proof-soft-camera',.09,.95,.25,-8],['cake',.42,.97,.18,-4],['paperclip',.85,.49,.12,13],['memo-book',.67,.98,.24,5],['star-clip',.30,.055,.12,-11]]},
  collage:{h:[.65,.49,.45,.90],s:[[.17,.28,.26,.40,'circle',-6,1.8],[.23,.74,.33,.38,'polaroid',6,1.06],[.94,.55,.10,.34,'rect',-4,1.35]],o:[['blue-daisy',.42,.86,.28,-13],['study-satin-bow',.05,.055,.26,-12],['blue-diary',.38,.30,.27,-9],['proof-soft-camera',.09,.96,.28,-8],['pencils',.49,.96,.28,-24],['coffee',.95,.94,.20,8],['cake',.78,.97,.19,6],['paperclip',.34,.53,.12,11],['washi-cream',.20,.52,.22,6],['study-milk',.97,.10,.16,7]]},
  tower:{h:[.50,.345,.79,.57],s:[[.25,.79,.38,.27,'polaroid',-7,1.06],[.77,.78,.35,.28,'circle',7,1.8]],o:[['blue-daisy',.06,.61,.29,-13],['study-satin-bow',.11,.07,.26,-12],['blue-diary',.91,.64,.28,9],['proof-soft-camera',.12,.96,.26,-8],['pencils',.53,.97,.31,-24],['cake',.91,.96,.20,7],['paperclip',.88,.665,.12,13],['washi-cream',.31,.67,.23,-6],['study-milk',.96,.13,.17,8]]},
  banner:{h:[.46,.50,.355,.93],s:[[.115,.29,.19,.40,'circle',-5,1.8],[.12,.79,.20,.32,'polaroid',-6,1.06],[.835,.18,.25,.25,'rect',6,1.65],[.825,.50,.25,.25,'rect',6,1.32],[.815,.81,.25,.25,'rect',6,1.04]],o:[['blue-daisy',.665,.91,.29,-12],['blue-diary',.27,.30,.34,-9],['study-satin-bow',.025,.065,.28,-12],['proof-soft-camera',.04,.96,.31,-8],['pencils',.27,.96,.29,-24],['cake',.73,.97,.19,6],['coffee',.97,.94,.19,8],['star-clip',.65,.08,.14,13],['study-milk',.98,.15,.17,8],['washi-cream',.92,.64,.16,6],['paperclip',.72,.48,.12,-9]]},
  scroll:{h:[.33,.5,.22,.94],s:[[.087,.44,.15,.73,'circle',-5,1.8],[.58,.50,.18,.79,'polaroid',7,1.06],[.83,.27,.20,.37,'rect',-5,1.8],[.85,.77,.21,.37,'rect',-5,1.08]],o:[['blue-diary',.465,.35,.46,-9],['blue-daisy',.48,.93,.40,-12],['blue-bow',.02,.07,.34,-12],['proof-soft-camera',.17,.94,.40,-9],['pencils',.71,.92,.39,-25],['coffee',.97,.92,.26,8],['cake',.68,.94,.25,6],['memo-book',.03,.91,.35,-7],['paperclip',.93,.49,.16,9],['washi-cream',.73,.09,.30,-6],['study-milk',.98,.13,.23,9]]}
 },
 hk:{
  chip:{h:[.35,.51,.32,.93],s:[[.70,.33,.24,.47,'film',6,1.8],[.88,.78,.20,.34,'rect',-5,1.08]],o:[['vinyl',.11,.40,.74,-12],['radio',.07,.96,.37,-7],['clock',.565,.17,.29,5],['gray-cassette',.57,.95,.31,6],['ticket',.83,.08,.33,-7],['black-clip',.20,.07,.18,-12],['old-camera',.98,.94,.29,8]]},
  compact:{h:[.36,.48,.60,.87],s:[[.85,.43,.21,.57,'film',7,1.35]],o:[['vinyl',.20,.54,.47,-13],['clock',.92,.10,.24,7],['radio',.11,.96,.25,-7],['old-camera',.96,.94,.22,7],['ticket',.50,.06,.25,-7],['black-clip',.31,.10,.13,-10],['transit-ticket',.37,.93,.23,5]]},
  circle:{h:[.50,.34,.84,.57],s:[[.27,.81,.35,.26,'film',-6,1.25],[.76,.80,.34,.28,'polaroid',6,1.05]],o:[['vinyl',.09,.59,.50,-12],['clock',.88,.07,.22,6],['radio',.11,.95,.24,-8],['gray-cassette',.48,.96,.23,7],['ticket',.48,.05,.24,-6],['old-camera',.97,.96,.22,8],['clip-silver',.70,.59,.09,11],['black-clip',.15,.08,.12,-12]]},
  polaroid:{h:[.65,.49,.54,.87],s:[[.16,.28,.25,.37,'film',-7,1.8],[.18,.76,.28,.36,'polaroid',6,1.06]],o:[['vinyl',.33,.52,.49,-12],['clock',.92,.12,.24,8],['radio',.04,.94,.27,-7],['old-camera',.94,.95,.25,8],['gray-cassette',.44,.96,.23,5],['ticket',.26,.06,.27,-7],['clip-silver',.17,.53,.10,11],['black-clip',.40,.09,.13,-12]]},
  collage:{h:[.42,.50,.41,.90],s:[[.10,.29,.14,.42,'film',-5,1.8],[.12,.79,.17,.30,'rect',6,1.08],[.81,.33,.25,.44,'film',7,1.8],[.81,.79,.27,.31,'polaroid',-5,1.07]],o:[['vinyl',.21,.48,.65,-13],['clock',.65,.11,.27,6],['radio',.08,.96,.29,-8],['old-camera',.96,.94,.26,8],['gray-cassette',.53,.96,.24,6],['ticket',.18,.06,.26,-6],['black-clip',.255,.06,.14,-11],['transit-ticket',.67,.95,.23,-5],['rev-postage-train',.95,.53,.14,7]]},
  tower:{h:[.49,.36,.80,.59],s:[[.28,.82,.39,.25,'film',-6,1.85],[.77,.83,.33,.24,'polaroid',7,1.06]],o:[['vinyl',.91,.59,.38,10],['radio',.09,.97,.27,-8],['old-camera',.93,.97,.25,8],['clock',.90,.075,.25,8],['ticket',.20,.055,.30,-8],['black-clip',.12,.10,.15,-11],['gray-cassette',.54,.97,.25,6],['transit-ticket',.11,.66,.24,-8]]},
  banner:{h:[.375,.50,.36,.93],s:[[.08,.32,.12,.47,'film',-5,1.85],[.11,.81,.17,.29,'rect',6,1.07],[.77,.29,.27,.43,'film',7,1.85],[.81,.78,.27,.34,'polaroid',-5,1.08]],o:[['vinyl',.59,.43,.74,-13],['clock',.97,.32,.30,6],['radio',.22,.96,.32,-7],['old-camera',.97,.95,.28,8],['gray-cassette',.62,.94,.27,6],['ticket',.62,.075,.31,-6],['transit-ticket',.06,.58,.24,-8],['black-clip',.19,.07,.15,-12],['proof-receipt',.08,.09,.24,-8],['clip-silver',.76,.51,.10,13]]},
  scroll:{h:[.61,.50,.225,.94],s:[[.13,.28,.17,.46,'film',-6,1.8],[.255,.76,.22,.36,'polaroid',7,1.05],[.885,.48,.15,.80,'film',5,1.25]],o:[['vinyl',.415,.44,1.00,-12],['radio',.43,.95,.42,-8],['old-camera',.79,.93,.36,7],['clock',.98,.65,.33,8],['gray-cassette',.10,.95,.35,-7],['ticket',.30,.10,.39,-7],['black-clip',.50,.06,.18,-11],['transit-ticket',.03,.55,.30,-8],['proof-receipt',.19,.14,.30,-9],['clip-silver',.79,.10,.15,11]]}
 },
 y2k:{
  chip:{h:[.71,.50,.34,.94,'circle'],s:[[.19,.53,.27,.67,'rect',-6,1.25],[.43,.24,.17,.34,'rect',7,1.75]],o:[['chrome-heart',.49,.93,.28,-10],['pink-phone',.025,.92,.28,-12],['stars-metal',.96,.10,.22,9],['cd',.96,.88,.29,9],['crystal',.57,.10,.13,-8],['pixel-arrow',.36,.52,.15,-11]]},
  compact:{h:[.50,.62,.82,.64,'circle'],s:[[.19,.22,.27,.27,'rect',-7,1.8],[.81,.23,.25,.28,'rect',6,1.06]],o:[['chrome-heart',.35,.92,.25,-11],['pink-phone',.04,.94,.24,-10],['cd',.94,.92,.24,8],['stars-metal',.93,.10,.18,9],['gamepad',.54,.96,.21,-9],['crystal',.36,.10,.13,-8],['pixel-arrow',.31,.49,.13,-10]]},
  circle:{h:[.50,.62,.83,.63,'circle'],s:[[.24,.20,.36,.27,'rect',-7,1.8],[.79,.21,.28,.31,'rect',6,1.06]],o:[['chrome-heart',.57,.95,.24,-11],['pink-phone',.035,.63,.24,-12],['cd',.96,.48,.22,9],['stars-metal',.89,.09,.20,9],['crystal',.23,.07,.13,-9],['gamepad',.09,.96,.23,-8],['holo-cross',.90,.94,.12,9],['pixel-arrow',.11,.23,.12,-12]]},
  polaroid:{h:[.37,.50,.55,.85,'circle'],s:[[.81,.26,.26,.31,'rect',7,1.8],[.81,.73,.27,.35,'rect',-7,1.06]],o:[['chrome-heart',.65,.91,.25,-11],['pink-phone',.035,.90,.26,-12],['cd',.96,.96,.24,8],['stars-metal',.94,.08,.20,9],['crystal',.57,.08,.13,-9],['gamepad',.35,.97,.23,-9],['pixel-arrow',.68,.46,.13,-12],['earphones',.97,.48,.24,9]]},
  collage:{h:[.38,.50,.46,.88,'circle'],s:[[.78,.24,.24,.31,'rect',7,1.8],[.80,.74,.29,.37,'rect',-6,1.06],[.08,.25,.12,.29,'rect',-7,1.3]],o:[['chrome-heart',.64,.92,.27,-11],['pink-phone',.035,.88,.27,-12],['cd',.96,.93,.25,9],['stars-metal',.95,.08,.20,9],['crystal',.52,.08,.13,-9],['gamepad',.24,.96,.25,-9],['pixel-arrow',.65,.43,.14,-12],['earphones',.95,.49,.26,9],['holo-heart',.12,.055,.15,-7]]},
  tower:{h:[.50,.39,.79,.62,'circle'],s:[[.24,.82,.35,.23,'rect',-7,1.8],[.76,.84,.35,.22,'rect',7,1.06]],o:[['chrome-heart',.50,.93,.25,-11],['pink-phone',.045,.91,.25,-12],['cd',.95,.93,.24,9],['stars-metal',.90,.12,.20,9],['crystal',.12,.09,.15,-9],['gamepad',.92,.65,.23,10],['pixel-arrow',.08,.53,.13,-12],['earphones',.94,.42,.27,9],['holo-heart',.30,.72,.13,-7]]},
  banner:{h:[.64,.50,.35,.93,'circle'],s:[[.175,.50,.27,.68,'rect',-6,1.25],[.39,.20,.17,.31,'rect',7,1.8],[.92,.78,.13,.31,'rect',-6,1.06]],o:[['chrome-heart',.45,.92,.31,-11],['pink-phone',.025,.89,.30,-12],['cd',.96,.12,.25,9],['stars-metal',.88,.12,.21,9],['crystal',.53,.10,.14,-9],['gamepad',.30,.94,.28,-9],['pixel-arrow',.33,.45,.15,-12],['earphones',.96,.47,.29,9],['holo-heart',.08,.07,.16,-7],['chain',.73,.97,.31,-5]]},
  scroll:{h:[.46,.50,.23,.94,'circle'],s:[[.155,.51,.24,.66,'rect',-6,1.25],[.73,.27,.20,.42,'rect',7,1.8],[.86,.77,.22,.34,'rect',-6,1.05]],o:[['chrome-heart',.61,.90,.41,-11],['pink-phone',.025,.90,.37,-12],['cd',.96,.12,.32,9],['stars-metal',.60,.12,.27,9],['crystal',.31,.12,.18,-9],['gamepad',.31,.91,.37,-9],['pixel-arrow',.29,.48,.18,-12],['earphones',.96,.52,.36,9],['holo-heart',.07,.08,.19,-7],['chain',.74,.97,.46,-5]]}
 },
 french:{
  chip:{h:[.69,.50,.35,.94,'circle'],s:[[.17,.38,.23,.59,'circle',-6,1.8],[.38,.72,.20,.47,'polaroid',6,1.06]],o:[['cream-bow',.44,.25,.29,4],['rose-bouquet',.48,.95,.31,-12],['blue-bow',.045,.90,.30,-10],['fabric-rose',.96,.92,.24,8],['bow-pearl',.92,.11,.22,9],['washi-cream',.30,.40,.24,-9]]},
  compact:{h:[.62,.49,.62,.88,'circle'],s:[[.17,.28,.25,.34,'circle',-6,1.8],[.18,.74,.27,.38,'polaroid',7,1.06]],o:[['cream-bow',.31,.22,.25,5],['rose-bouquet',.37,.91,.27,-12],['blue-bow',.06,.94,.24,-10],['fabric-rose',.94,.94,.20,8],['bow-pearl',.91,.10,.16,9],['embroidery',.12,.53,.15,-9],['washi-cream',.72,.065,.17,-6]]},
  circle:{h:[.47,.46,.69,.79,'circle'],s:[[.82,.81,.28,.30,'polaroid',7,1.06],[.18,.85,.24,.22,'circle',-6,1.8]],o:[['cream-bow',.90,.26,.24,7],['rose-bouquet',.49,.95,.27,-12],['blue-bow',.065,.18,.24,-10],['fabric-rose',.96,.97,.18,8],['bow-pearl',.75,.08,.16,9],['embroidery',.085,.64,.15,-9],['pressed-rose',.04,.49,.17,-10]]},
  polaroid:{h:[.34,.49,.53,.87,'circle'],s:[[.81,.25,.28,.38,'circle',7,1.8],[.79,.75,.30,.38,'polaroid',-6,1.06]],o:[['cream-bow',.63,.25,.25,5],['rose-bouquet',.61,.91,.29,-12],['blue-bow',.05,.94,.26,-10],['fabric-rose',.97,.94,.20,8],['bow-pearl',.88,.075,.16,9],['embroidery',.79,.51,.16,8],['pressed-rose',.03,.51,.19,-10],['washi-cream',.74,.58,.17,-6]]},
  collage:{h:[.66,.50,.43,.91,'circle'],s:[[.15,.27,.20,.34,'circle',-6,1.8],[.25,.73,.30,.43,'polaroid',-7,1.06]],o:[['cream-bow',.43,.30,.27,4],['rose-bouquet',.43,.91,.31,-12],['blue-bow',.06,.92,.28,-10],['fabric-rose',.56,.96,.20,8],['bow-pearl',.92,.10,.16,9],['embroidery',.29,.89,.18,-7],['pressed-rose',.03,.54,.21,-10],['herb-paper',.96,.81,.22,12],['washi-cream',.24,.48,.18,-9]]},
  tower:{h:[.51,.37,.79,.63,'circle'],s:[[.25,.82,.38,.26,'polaroid',-7,1.06],[.77,.83,.34,.25,'circle',7,1.8]],o:[['cream-bow',.08,.16,.27,-8],['rose-bouquet',.52,.96,.30,-12],['blue-bow',.08,.95,.26,-10],['fabric-rose',.93,.96,.20,8],['bow-pearl',.89,.07,.16,9],['embroidery',.92,.64,.18,11],['pressed-rose',.04,.64,.20,-10],['herb-paper',.96,.42,.19,12],['washi-cream',.28,.69,.17,-9]]},
  banner:{h:[.61,.50,.38,.94,'circle'],s:[[.13,.30,.20,.43,'circle',-6,1.8],[.25,.76,.26,.38,'polaroid',-7,1.06],[.93,.72,.12,.40,'polaroid',7,1.65]],o:[['cream-bow',.41,.30,.31,4],['rose-bouquet',.41,.94,.35,-12],['blue-bow',.05,.93,.31,-10],['fabric-rose',.78,.96,.22,8],['bow-pearl',.91,.10,.19,9],['embroidery',.26,.94,.21,-7],['pressed-rose',.025,.52,.24,-10],['herb-paper',.97,.39,.24,12],['washi-cream',.22,.53,.20,-9],['ivory-envelope',.13,.94,.28,-7]]},
  scroll:{h:[.60,.50,.23,.94,'circle'],s:[[.13,.40,.15,.72,'polaroid',-7,1.8],[.36,.73,.15,.44,'circle',6,1.06],[.86,.40,.17,.74,'polaroid',7,1.8]],o:[['cream-bow',.45,.25,.40,4],['rose-bouquet',.45,.94,.46,-12],['blue-bow',.025,.14,.37,-10],['fabric-rose',.75,.94,.28,8],['bow-pearl',.95,.12,.24,9],['embroidery',.32,.40,.25,-7],['pressed-rose',.03,.64,.31,-10],['herb-paper',.98,.71,.31,12],['washi-cream',.15,.08,.27,-9],['ivory-envelope',.18,.95,.36,-7]]}
 },
 mecha:{
  chip:{h:[.48,.50,.32,.94],s:[[.13,.47,.20,.71,'film',-4,1.8],[.84,.52,.23,.73,'rect',5,1.1]],o:[['chain-black',.49,.04,.41,-6],['spring-black',.29,.94,.32,-7],['hinge',.70,.91,.23,7],['pipe-pieces',.97,.94,.24,8],['tape-black',.12,.09,.27,-7],['rev-safety-pin',.72,.13,.21,-12],['parcel-barcode',.07,.97,.28,-6]]},
  compact:{h:[.39,.49,.61,.87],s:[[.85,.28,.22,.35,'film',5,1.8],[.85,.73,.22,.33,'rect',-5,1.08]],o:[['chain-black',.60,.04,.32,-7],['spring-black',.29,.94,.26,-8],['hinge',.94,.92,.20,7],['pipe-pieces',.96,.14,.20,8],['tape-black',.16,.10,.20,-7],['rev-safety-pin',.31,.51,.16,-12],['steel-tag',.70,.96,.20,5]]},
  circle:{h:[.35,.50,.59,.88],s:[[.83,.18,.24,.22,'film',5,1.8],[.83,.50,.24,.22,'rect',5,1.3],[.83,.82,.24,.22,'rect',5,1.06]],o:[['chain-black',.44,.04,.34,-7],['spring-black',.22,.95,.26,-8],['hinge',.94,.96,.19,7],['pipe-pieces',.03,.64,.20,-8],['tape-black',.86,.405,.115,7],['rev-safety-pin',.75,.08,.15,-12],['steel-tag',.55,.96,.21,5],['parcel-barcode',.04,.12,.18,-5]]},
  polaroid:{h:[.65,.50,.54,.85],s:[[.16,.27,.24,.38,'film',-6,1.8],[.18,.74,.28,.34,'rect',6,1.07]],o:[['chain-black',.64,.04,.35,-7],['spring-black',.35,.95,.29,-8],['hinge',.94,.93,.20,7],['pipe-pieces',.025,.52,.22,-8],['tape-black',.18,.52,.18,-7],['rev-safety-pin',.34,.12,.16,-12],['steel-tag',.71,.96,.23,5],['parcel-barcode',.05,.95,.23,-6]]},
  collage:{h:[.48,.50,.40,.90],s:[[.12,.29,.19,.41,'film',-5,1.8],[.13,.78,.20,.33,'rect',6,1.06],[.85,.50,.21,.71,'rect',5,1.14]],o:[['chain-black',.47,.035,.38,-7],['spring-black',.28,.94,.30,-8],['hinge',.72,.93,.22,7],['pipe-pieces',.97,.94,.24,8],['tape-black',.13,.56,.21,-7],['rev-safety-pin',.74,.12,.17,-12],['steel-tag',.87,.95,.24,5],['parcel-barcode',.04,.94,.24,-6],['binder-black',.86,.14,.13,5]]},
  tower:{h:[.50,.36,.79,.60],s:[[.26,.82,.38,.24,'film',-6,1.8],[.76,.82,.35,.25,'rect',6,1.07]],o:[['chain-black',.47,.035,.38,-7],['spring-black',.10,.97,.28,-8],['hinge',.92,.96,.20,7],['pipe-pieces',.96,.65,.23,8],['tape-black',.30,.70,.20,-7],['rev-safety-pin',.08,.60,.17,-12],['steel-tag',.55,.96,.24,5],['parcel-barcode',.075,.085,.21,-6],['binder-black',.87,.69,.12,5]]},
  banner:{h:[.50,.50,.35,.94],s:[[.13,.30,.21,.45,'film',-5,1.8],[.14,.79,.20,.30,'rect',6,1.06],[.85,.30,.23,.43,'rect',6,1.8],[.85,.79,.23,.31,'rect',-5,1.06]],o:[['chain-black',.49,.035,.42,-7],['spring-black',.29,.94,.34,-8],['hinge',.72,.93,.25,7],['pipe-pieces',.97,.94,.26,8],['tape-black',.13,.57,.23,-7],['rev-safety-pin',.73,.12,.19,-12],['steel-tag',.86,.97,.25,5],['parcel-barcode',.04,.96,.25,-6],['binder-black',.85,.57,.13,5]]},
  scroll:{h:[.64,.50,.225,.94],s:[[.11,.33,.17,.57,'film',-5,1.8],[.36,.63,.21,.62,'rect',6,1.06],[.90,.48,.13,.78,'rect',-5,1.28]],o:[['chain-black',.62,.035,.52,-7],['spring-black',.21,.94,.43,-8],['hinge',.79,.93,.31,7],['pipe-pieces',.98,.92,.32,8],['tape-black',.11,.66,.29,-7],['rev-safety-pin',.25,.12,.25,-12],['steel-tag',.48,.96,.32,5],['parcel-barcode',.04,.94,.33,-6],['binder-black',.85,.10,.17,5]]}
 },
 fairy:{
  chip:{h:[.69,.50,.33,.92],s:[[.22,.50,.30,.68,'polaroid',-7,1.15]],o:[['cloud-crayon',.52,.10,.25,-8],['daisy-crayon',.96,.76,.23,9],['stars-crayon',.40,.34,.20,-9],['story-reader',.47,.92,.31,-4],['pastel-crayons',.035,.95,.29,-8],['washi-cream',.21,.16,.24,-7],['bow-crayon',.87,.96,.21,8]]},
  compact:{h:[.50,.35,.79,.58],s:[[.25,.82,.36,.25,'polaroid',-7,1.8]],o:[['cloud-crayon',.16,.07,.19,-8],['daisy-crayon',.95,.47,.17,9],['stars-crayon',.84,.10,.15,-9],['story-reader',.79,.82,.28,-4],['pastel-crayons',.04,.96,.21,-8],['cream-books',.80,.97,.24,5],['washi-cream',.27,.66,.17,-7]]},
  circle:{h:[.71,.49,.43,.87],s:[[.23,.27,.31,.35,'polaroid',-7,1.8],[.24,.76,.33,.35,'rect',6,1.06]],o:[['cloud-crayon',.56,.08,.18,-8],['daisy-crayon',.96,.76,.17,9],['stars-crayon',.41,.40,.13,-9],['story-reader',.43,.86,.22,-4],['pastel-crayons',.045,.96,.20,-8],['cream-books',.55,.97,.21,5],['washi-cream',.23,.095,.17,-7],['rainbow',.04,.52,.15,-8]]},
  polaroid:{h:[.32,.50,.49,.86],s:[[.80,.27,.29,.36,'polaroid',7,1.8],[.79,.76,.29,.34,'rect',-6,1.06]],o:[['cloud-crayon',.08,.07,.19,-8],['daisy-crayon',.96,.52,.17,9],['stars-crayon',.60,.37,.13,-9],['story-reader',.59,.88,.23,-4],['pastel-crayons',.04,.96,.22,-8],['cream-books',.83,.97,.23,5],['washi-cream',.80,.12,.17,7],['heart-crayon',.06,.53,.12,-8],['bow-crayon',.44,.965,.12,7]]},
  collage:{h:[.51,.34,.45,.59],s:[[.21,.78,.30,.31,'polaroid',-6,1.8],[.80,.78,.30,.31,'rect',6,1.06]],o:[['cloud-crayon',.12,.10,.20,-8],['daisy-crayon',.94,.42,.18,9],['stars-crayon',.85,.10,.15,-9],['story-reader',.52,.85,.24,-4],['pastel-crayons',.04,.96,.23,-8],['cream-books',.54,.97,.23,5],['washi-cream',.18,.625,.18,-7],['rainbow',.05,.52,.16,-8],['plane-crayon',.72,.49,.13,-11],['bow-crayon',.94,.96,.13,7]]},
  tower:{h:[.50,.31,.80,.50],s:[[.28,.71,.41,.23,'polaroid',-7,1.8],[.75,.86,.36,.22,'rect',7,1.06]],o:[['cloud-crayon',.16,.055,.21,-8],['daisy-crayon',.94,.55,.19,9],['stars-crayon',.86,.10,.16,-9],['story-reader',.82,.64,.25,-4],['pastel-crayons',.06,.96,.23,-8],['cream-books',.40,.96,.24,5],['washi-cream',.28,.59,.19,-7],['rainbow',.06,.51,.17,-8],['plane-crayon',.50,.83,.15,-11]]},
  banner:{h:[.70,.50,.38,.91],s:[[.24,.27,.29,.37,'polaroid',-7,1.8],[.25,.75,.30,.36,'rect',6,1.06]],o:[['cloud-crayon',.52,.08,.23,-8],['daisy-crayon',.97,.73,.20,9],['stars-crayon',.42,.16,.17,-9],['story-reader',.45,.81,.27,-4],['pastel-crayons',.03,.95,.25,-8],['cream-books',.49,.96,.27,5],['washi-cream',.23,.105,.21,-7],['rainbow',.035,.60,.18,-8],['plane-crayon',.40,.48,.15,-11],['bow-crayon',.89,.97,.14,7]]},
  scroll:{h:[.29,.50,.22,.93],s:[[.075,.38,.12,.62,'polaroid',-6,1.8],[.59,.25,.19,.40,'rect',7,1.8],[.835,.70,.16,.51,'polaroid',-6,1.06]],o:[['cloud-crayon',.43,.12,.30,-8],['daisy-crayon',.97,.56,.27,9],['stars-crayon',.73,.15,.22,-9],['story-reader',.69,.77,.36,-4],['pastel-crayons',.025,.95,.34,-8],['cream-books',.48,.96,.37,5],['washi-cream',.57,.08,.28,-7],['rainbow',.15,.89,.23,-8],['plane-crayon',.93,.15,.20,-11],['bow-crayon',.92,.94,.20,7],['heart-crayon',.46,.59,.17,8]]}
 },
 letter:{
  chip:{h:[.31,.50,.32,.92],s:[[.74,.54,.27,.68,'polaroid',7,1.15],[.53,.22,.17,.34,'rect',-8,1.8]],o:[['fountain-pen',.56,.64,.55,10],['wax',.52,.91,.13,-6],['dry-spray',.035,.68,.30,-10],['herb-paper',.97,.69,.27,8],['ivory-envelope',.88,.95,.31,8],['tape-white',.30,.10,.19,-7],['twine',.43,.96,.24,-8]]},
  compact:{h:[.50,.39,.81,.64],s:[[.78,.83,.31,.23,'polaroid',7,1.8]],o:[['fountain-pen',.92,.56,.40,8],['wax',.56,.83,.10,-6],['dry-spray',.045,.70,.23,-10],['herb-paper',.96,.13,.20,8],['ivory-envelope',.30,.87,.31,-8],['tape-white',.41,.10,.16,-7],['twine',.34,.95,.17,-8]]},
  circle:{h:[.35,.40,.56,.69],s:[[.80,.68,.28,.52,'polaroid',7,1.06],[.84,.18,.23,.27,'rect',-7,1.8]],o:[['fountain-pen',.63,.64,.40,8],['wax',.57,.90,.10,-6],['dry-spray',.045,.65,.23,-10],['herb-paper',.96,.41,.20,8],['ivory-envelope',.33,.88,.32,-8],['tape-white',.28,.08,.16,-7],['twine',.36,.97,.18,-8],['pressed-daisy',.57,.44,.16,-9]]},
  polaroid:{h:[.68,.47,.51,.83],s:[[.18,.30,.27,.36,'polaroid',-6,1.8],[.20,.78,.29,.32,'rect',6,1.06]],o:[['fountain-pen',.40,.57,.43,-9],['wax',.42,.87,.105,-6],['dry-spray',.04,.55,.24,-10],['herb-paper',.97,.66,.22,8],['ivory-envelope',.49,.94,.33,-8],['tape-white',.65,.10,.17,-7],['twine',.29,.96,.19,-8],['pressed-daisy',.93,.95,.18,8]]},
  collage:{h:[.30,.48,.37,.84],s:[[.79,.49,.27,.65,'polaroid',7,1.06],[.55,.20,.17,.26,'rect',-7,1.8]],o:[['fountain-pen',.59,.62,.47,8],['wax',.53,.88,.11,-6],['dry-spray',.04,.70,.26,-10],['herb-paper',.97,.42,.22,8],['ivory-envelope',.90,.96,.29,8],['tape-white',.28,.10,.18,-7],['twine',.44,.96,.19,-8],['pressed-daisy',.40,.94,.18,-9],['typewriter',.69,.97,.25,-6]]},
  tower:{h:[.42,.32,.66,.53],s:[[.81,.67,.28,.25,'polaroid',7,1.8],[.36,.85,.52,.22,'rect',-6,1.06]],o:[['fountain-pen',.68,.64,.46,8],['wax',.60,.91,.105,-6],['dry-spray',.045,.64,.26,-10],['herb-paper',.96,.34,.22,8],['ivory-envelope',.79,.97,.29,8],['tape-white',.35,.07,.18,-7],['twine',.28,.96,.19,-8],['pressed-daisy',.42,.63,.18,-9],['typewriter',.09,.97,.26,-6]]},
  banner:{h:[.33,.50,.36,.91],s:[[.80,.51,.27,.70,'polaroid',7,1.06],[.58,.22,.17,.29,'rect',-7,1.8],[.075,.75,.11,.32,'rect',-5,1.3]],o:[['fountain-pen',.60,.63,.50,8],['wax',.56,.91,.12,-6],['dry-spray',.03,.48,.29,-10],['herb-paper',.97,.44,.25,8],['ivory-envelope',.92,.96,.31,8],['tape-white',.30,.08,.19,-7],['twine',.44,.96,.22,-8],['pressed-daisy',.24,.96,.20,-9],['typewriter',.71,.97,.27,-6],['washi-cream',.61,.38,.17,-9]]},
  scroll:{h:[.40,.50,.22,.94],s:[[.105,.43,.17,.72,'polaroid',-7,1.8],[.72,.49,.20,.76,'polaroid',7,1.06],[.92,.23,.12,.37,'rect',-6,1.8]],o:[['fountain-pen',.59,.60,.64,8],['wax',.56,.91,.15,-6],['dry-spray',.025,.57,.37,-10],['herb-paper',.98,.61,.31,8],['ivory-envelope',.86,.96,.39,8],['tape-white',.38,.07,.25,-7],['twine',.25,.96,.27,-8],['pressed-daisy',.51,.96,.25,-9],['typewriter',.67,.97,.35,-6],['washi-cream',.17,.12,.23,-9]]}
 },
 stamp:{
  chip:{h:[.47,.50,.30,.92],s:[[.15,.37,.20,.59,'rect',-5,1.8],[.81,.60,.24,.62,'rect',6,1.08]],o:[['rev-postage-train',.67,.24,.26,-6],['parcel-bundle',.29,.97,.38,-7],['wax',.65,.92,.12,7],['clip-silver',.85,.15,.14,9],['washi-cream',.45,.07,.25,-7],['parcel-barcode',.045,.95,.26,-8]]},
  compact:{h:[.50,.34,.71,.57],s:[[.24,.81,.33,.25,'rect',-6,1.8],[.76,.81,.31,.25,'rect',6,1.06]],o:[['rev-postage-train',.94,.34,.18,7],['parcel-bundle',.51,.93,.28,-7],['wax',.60,.96,.09,7],['clip-silver',.83,.68,.10,9],['washi-cream',.40,.07,.17,-7],['parcel-barcode',.05,.51,.19,-8]]},
  circle:{h:[.33,.64,.50,.59],s:[[.69,.25,.43,.37,'rect',6,1.8],[.82,.78,.26,.29,'rect',-6,1.06]],o:[['rev-postage-train',.22,.18,.20,-6],['parcel-bundle',.61,.97,.29,-7],['wax',.74,.96,.09,7],['clip-silver',.77,.08,.10,9],['washi-cream',.18,.345,.18,-7],['parcel-barcode',.04,.78,.19,-8],['rev-route-tickets',.60,.54,.22,6]]},
  polaroid:{h:[.38,.40,.59,.69],s:[[.78,.82,.31,.28,'rect',-6,1.06],[.85,.25,.20,.28,'rect',6,1.8]],o:[['rev-postage-train',.73,.52,.20,-6],['parcel-bundle',.29,.96,.31,-7],['wax',.48,.95,.10,7],['clip-silver',.87,.10,.10,9],['washi-cream',.24,.07,.18,-7],['parcel-barcode',.04,.68,.20,-8],['rev-route-tickets',.55,.82,.24,6]]},
  collage:{h:[.48,.50,.37,.87],s:[[.14,.63,.22,.54,'rect',-6,1.06],[.84,.30,.23,.43,'rect',6,1.8]],o:[['rev-postage-train',.16,.16,.22,-6],['parcel-bundle',.78,.91,.35,-7],['wax',.89,.92,.10,7],['clip-silver',.86,.10,.11,9],['washi-cream',.42,.07,.19,-7],['parcel-barcode',.04,.96,.22,-8],['rev-route-tickets',.78,.64,.25,6],['twine',.65,.94,.19,-8]]},
  tower:{h:[.50,.33,.79,.56],s:[[.24,.79,.36,.27,'rect',-6,1.8],[.77,.80,.35,.26,'rect',6,1.06]],o:[['rev-postage-train',.13,.65,.22,-6],['parcel-bundle',.51,.96,.34,-7],['wax',.64,.96,.10,7],['clip-silver',.86,.665,.11,9],['washi-cream',.42,.055,.19,-7],['parcel-barcode',.05,.13,.22,-8],['rev-route-tickets',.88,.64,.22,6],['twine',.48,.64,.18,-8]]},
  banner:{h:[.30,.50,.34,.91],s:[[.76,.28,.30,.40,'rect',6,1.8],[.60,.80,.18,.26,'rect',-6,1.06],[.87,.78,.18,.28,'rect',6,1.3]],o:[['rev-postage-train',.56,.38,.24,-6],['parcel-bundle',.49,.96,.38,-7],['wax',.63,.95,.12,7],['clip-silver',.81,.10,.12,9],['washi-cream',.26,.06,.21,-7],['parcel-barcode',.035,.94,.25,-8],['rev-route-tickets',.96,.52,.26,6],['twine',.72,.59,.23,-8],['envelopes',.07,.96,.28,-9]]},
  scroll:{h:[.49,.50,.225,.93],s:[[.10,.29,.16,.47,'rect',-6,1.8],[.235,.76,.18,.34,'rect',6,1.06],[.83,.50,.24,.73,'rect',6,1.2]],o:[['rev-postage-train',.28,.23,.31,-6],['parcel-bundle',.65,.95,.49,-7],['wax',.76,.95,.15,7],['clip-silver',.84,.15,.16,9],['washi-cream',.47,.065,.28,-7],['parcel-barcode',.03,.89,.34,-8],['rev-route-tickets',.68,.31,.34,6],['twine',.33,.92,.29,-8],['envelopes',.12,.96,.36,-9]]}
 },
 gothic:{
  chip:{h:[.53,.51,.33,.94,'arch'],s:[[.15,.43,.23,.67,'circle',-5,1.8],[.86,.60,.21,.64,'circle',5,1.08]],o:[['rose-candles',.035,.95,.31,-4],['rose-red',.72,.97,.30,9],['chandelier',.90,.14,.24,0],['cross-silver',.31,.12,.18,-9],['black-notebook',.30,.85,.29,-9],['thorn',.01,.52,.36,-7],['bow-black',.96,.92,.20,8]]},
  compact:{h:[.50,.47,.64,.84,'arch'],s:[[.12,.75,.23,.28,'circle',-5,1.8],[.88,.26,.20,.29,'circle',5,1.06]],o:[['rose-candles',.045,.97,.24,-4],['rose-red',.74,.96,.24,9],['chandelier',.89,.075,.19,0],['cross-silver',.16,.11,.14,-9],['black-notebook',.29,.91,.23,-9],['thorn',.02,.47,.26,-7],['bow-black',.95,.94,.16,8]]},
  circle:{h:[.35,.48,.59,.88,'arch'],s:[[.84,.25,.25,.32,'circle',5,1.8],[.83,.79,.29,.31,'circle',-5,1.06]],o:[['rose-candles',.045,.96,.25,-4],['rose-red',.62,.97,.24,9],['chandelier',.84,.07,.18,0],['cross-silver',.13,.10,.14,-9],['black-notebook',.62,.54,.23,-9],['thorn',.02,.53,.28,-7],['bow-black',.96,.97,.16,8],['rev-dark-library',.89,.97,.23,-4]]},
  polaroid:{h:[.50,.49,.52,.88,'arch'],s:[[.11,.32,.18,.36,'circle',-5,1.8],[.87,.70,.22,.38,'circle',5,1.06]],o:[['rose-candles',.035,.95,.26,-4],['rose-red',.72,.97,.27,9],['chandelier',.86,.15,.22,0],['cross-silver',.29,.09,.14,-9],['black-notebook',.19,.78,.24,-9],['thorn',.02,.55,.30,-7],['bow-black',.96,.95,.17,8],['rev-dark-library',.87,.97,.25,-4]]},
  collage:{h:[.50,.51,.40,.90,'arch'],s:[[.15,.47,.22,.66,'arch',-4,1.8],[.85,.49,.22,.65,'arch',4,1.06]],o:[['rose-candles',.035,.96,.28,-4],['rose-red',.68,.97,.30,9],['chandelier',.85,.105,.23,0],['cross-silver',.29,.09,.16,-9],['black-notebook',.25,.86,.27,-9],['thorn',.02,.49,.33,-7],['bow-black',.96,.94,.18,8],['rev-dark-library',.88,.97,.28,-4],['rev-onyx-pendant',.98,.28,.14,9]]},
  tower:{h:[.50,.36,.82,.63,'arch'],s:[[.25,.81,.36,.25,'circle',-5,1.8],[.77,.81,.34,.24,'circle',5,1.06]],o:[['rose-candles',.04,.97,.28,-4],['rose-red',.53,.97,.28,9],['chandelier',.87,.14,.22,0],['cross-silver',.14,.10,.16,-9],['black-notebook',.13,.64,.26,-9],['thorn',.015,.48,.31,-7],['bow-black',.96,.96,.18,8],['rev-dark-library',.87,.97,.27,-4],['rev-onyx-pendant',.92,.66,.15,9]]},
  banner:{h:[.48,.51,.32,.94,'arch'],s:[[.135,.40,.21,.55,'circle',-5,1.8],[.84,.23,.20,.34,'rect',6,1.8],[.85,.75,.21,.39,'circle',-5,1.06]],o:[['rose-candles',.035,.96,.30,-4],['rose-red',.67,.97,.32,9],['chandelier',.95,.20,.24,0],['cross-silver',.29,.09,.17,-9],['black-notebook',.26,.82,.29,-9],['thorn',.015,.53,.35,-7],['bow-black',.96,.96,.20,8],['rev-dark-library',.87,.97,.30,-4],['rev-onyx-pendant',.72,.13,.16,9],['gothic-fan',.45,.98,.27,-8]]},
  scroll:{h:[.25,.51,.22,.94,'arch'],s:[[.55,.50,.18,.77,'arch',4,1.12],[.81,.27,.16,.41,'circle',5,1.8],[.85,.78,.17,.34,'circle',-5,1.06]],o:[['rose-candles',.03,.95,.39,-4],['rose-red',.69,.96,.42,9],['chandelier',.96,.22,.32,0],['cross-silver',.12,.09,.22,-9],['black-notebook',.43,.80,.39,-9],['thorn',.012,.53,.44,-7],['bow-black',.97,.96,.26,8],['rev-dark-library',.87,.97,.39,-4],['rev-onyx-pendant',.69,.14,.21,9],['gothic-fan',.22,.98,.35,-8]]}
 },
 sweetcool:{
  chip:{h:[.43,.50,.32,.93],s:[[.12,.43,.20,.65,'polaroid',-6,1.8],[.83,.60,.24,.65,'polaroid',7,1.06]],o:[['blue-bow',.025,.13,.30,-11],['cherries',.66,.95,.25,-8],['jelly-heart',.15,.94,.22,-8],['ribbon-white',.59,.96,.33,-8],['clip-star',.70,.16,.16,10],['clear-clip',.85,.20,.17,7],['star-jelly',.97,.12,.17,9]]},
  compact:{h:[.43,.47,.66,.81],s:[[.82,.79,.30,.32,'polaroid',11,1.8]],o:[['blue-bow',.10,.10,.23,-11],['cherries',.59,.94,.19,-8],['jelly-heart',.10,.78,.18,-8],['ribbon-white',.55,.96,.27,-8],['clip-star',.87,.58,.11,10],['clear-clip',.61,.065,.13,-3],['star-jelly',.92,.20,.13,9],['bow-pearl',.18,.96,.13,-8]]},
  circle:{h:[.37,.50,.59,.85],s:[[.84,.29,.25,.37,'polaroid',7,1.8],[.80,.80,.30,.29,'polaroid',-6,1.06]],o:[['blue-bow',.09,.10,.23,-11],['cherries',.61,.95,.20,-8],['jelly-heart',.96,.54,.16,8],['ribbon-white',.44,.96,.27,-8],['clip-star',.72,.60,.11,10],['clear-clip',.84,.11,.13,7],['star-jelly',.95,.08,.13,9],['bow-pearl',.12,.96,.13,-8]]},
  polaroid:{h:[.66,.41,.55,.71],s:[[.18,.59,.28,.43,'polaroid',-7,1.8],[.66,.86,.35,.22,'polaroid',7,1.06]],o:[['blue-bow',.12,.13,.25,-11],['cherries',.36,.94,.21,-8],['jelly-heart',.08,.88,.18,-8],['ribbon-white',.49,.96,.29,-8],['clip-star',.85,.76,.12,10],['clear-clip',.66,.075,.14,-2],['star-jelly',.97,.51,.14,9],['bow-pearl',.92,.96,.14,-8],['washi-cream',.15,.36,.18,-8]]},
  collage:{h:[.46,.51,.42,.88],s:[[.105,.50,.17,.52,'polaroid',-7,1.3],[.83,.25,.22,.34,'polaroid',7,1.8],[.83,.76,.26,.37,'polaroid',-7,1.06]],o:[['blue-bow',.06,.11,.27,-11],['cherries',.70,.95,.22,-8],['jelly-heart',.12,.84,.19,-8],['ribbon-white',.55,.96,.31,-8],['clip-star',.71,.55,.12,10],['clear-clip',.84,.08,.15,7],['star-jelly',.97,.51,.15,9],['bow-pearl',.10,.97,.15,-8],['washi-cream',.37,.065,.19,-8]]},
  tower:{h:[.50,.42,.79,.66],s:[[.18,.135,.25,.18,'polaroid',-9,1.8],[.75,.87,.36,.23,'polaroid',7,1.06]],o:[['blue-bow',.86,.10,.27,10],['cherries',.51,.95,.22,-8],['jelly-heart',.12,.83,.20,-8],['ribbon-white',.45,.96,.31,-8],['clip-star',.92,.73,.12,10],['clear-clip',.76,.75,.15,7],['star-jelly',.96,.42,.15,9],['bow-pearl',.10,.97,.15,-8],['washi-cream',.19,.04,.19,-8]]},
  banner:{h:[.48,.50,.34,.93],s:[[.115,.32,.19,.50,'polaroid',-6,1.8],[.16,.82,.22,.26,'rect',6,1.06],[.84,.52,.26,.69,'polaroid',7,1.1]],o:[['blue-bow',.035,.095,.29,-11],['cherries',.69,.95,.24,-8],['jelly-heart',.25,.72,.20,-8],['ribbon-white',.56,.97,.34,-8],['clip-star',.73,.14,.14,10],['clear-clip',.85,.16,.16,7],['star-jelly',.97,.12,.17,9],['bow-pearl',.10,.97,.17,-8],['washi-cream',.46,.06,.22,-8],['crystal',.96,.84,.14,8]]},
  scroll:{h:[.75,.50,.23,.94],s:[[.10,.40,.14,.69,'polaroid',-7,1.8],[.30,.70,.17,.45,'polaroid',7,1.06],[.47,.25,.17,.43,'polaroid',-6,1.8]],o:[['blue-bow',.025,.12,.38,-11],['cherries',.62,.95,.31,-8],['jelly-heart',.17,.89,.26,-8],['ribbon-white',.52,.97,.45,-8],['clip-star',.59,.15,.18,10],['clear-clip',.77,.07,.21,-3],['star-jelly',.98,.19,.22,9],['bow-pearl',.95,.95,.22,-8],['washi-cream',.30,.48,.29,8],['crystal',.95,.58,.18,8]]}
 },
};

const physicalBacking=new Set(['vinyl','blue-diary','black-notebook']);

function mainMount(p,h){
 const [x,y,w,height,shape='rect']=h,dx=3/p.W,dy=3/p.H;
 if(p.p.id==='french'||p.p.id==='y2k'){
  p.graphic('主肖像椭圆装裱',`<ellipse cx="200" cy="200" rx="196" ry="196" fill="${p.p.colors.paper}" stroke="${p.p.colors.accent}" stroke-width=".9"/>`,x-w/2-dx,y-height/2-dy,w+dx*2,height+dy*2,0,3,false,'main','0 0 400 400');
 }else if(p.p.id==='gothic'){
  p.graphic('暗银拱窗装裱','<path d="M6 394V148Q6 45 150 6Q294 45 294 148V394Z" fill="#302b39" stroke="#8A8AA8" stroke-width="1.2"/>',x-w/2-dx,y-height/2-dy,w+dx*2,height+dy*2,0,3,false,'main','0 0 300 400');
 }else if(p.p.id==='stamp'){
  p.postage(x-w/2-dx,y-height/2-dy,w+dx*2,height+dy*2,0,'soft',3);
 }else p.mat(x-w/2-dx,y-height/2-dy,w+dx*2,height+dy*2,0,p.p.id==='mecha'?'dark':'paper',3,p.p.id==='mecha'?'#8A8A8A':p.p.colors.accent);
 p.main(x,y,w,height,shape,1.12,w*p.W/(height*p.H)>1.3?23:28);
 if(p.p.id==='hk')p.avatar.frameStyle='torn';
 if(p.p.id==='mecha')for(const xx of [x-w/2-dx*.6,x+w/2+dx*.6])for(const yy of [y-height/2-dy*.6,y+height/2+dy*.6])p.bolt(xx,yy,.019);
}

function smallPhoto(p,row){
 const [x,y,w,h,shape='polaroid',r=0,zoom=1.2]=row;
 if(p.p.id==='y2k')p.window(x-w/2-3/p.W,y-h/2-11/p.H,w+6/p.W,h+15/p.H,r,3);
 if(p.p.id==='stamp')p.postage(x-w/2-3/p.W,y-h/2-3/p.H,w+6/p.W,h+6/p.H,r,'accent',3);
 if(p.p.id==='sweetcool'||p.p.id==='mecha')p.mat(x-w/2-3/p.W,y-h/2-3/p.H,w+6/p.W,h+6/p.H,r,p.p.id==='mecha'?'dark':'paper',3,p.p.id==='mecha'?'#8A8A8A':p.p.colors.accent);
 const e=p.photo(x,y,w,h,shape,r,zoom,49,w*p.W/(h*p.H)>1.35?25:(zoom>1.6?24:35));
 if(p.p.id==='french'&&shape==='circle'&&!p.pearlMat&&e.width/e.height>.83&&e.width/e.height<1.2){
  p.art('study-pearl-round',x,y,Math.max(e.width,e.height)/p.u*1.12,r,5.4,true,'left');p.pearlMat=true;
 }
 if(p.p.id==='gothic'&&shape==='circle')p.graphic('暗银相片压边',`<ellipse cx="${e.width/2}" cy="${e.height/2}" rx="${e.width*.46}" ry="${e.height*.46}" fill="none" stroke="#514b5d" stroke-width="${Math.min(e.width,e.height)*.031}"/>`,e.x/p.W,e.y/p.H,e.width/p.W,e.height/p.H,r,5.1,true,'details',`0 0 ${e.width} ${e.height}`);
 return e;
}

function paperStructure(p,key,spec){
 const id=p.p.id;
 if(id==='school'){
  p.grain();p.check(0,0,key==='tower'?.36:.44,1,'accent',12,.2);p.paper('study-ivory-paper',.035,.04,.93,.92,-2,.5);
  p.paper('lined-note',.02,.16,.33,.79,-6,.8);p.paper('blue-grid',.76,.025,.22,.95,5,1);p.edge('accent',1.2);
 }else if(id==='hk'){
  p.grain();p.paper('newspaper',-.04,-.04,.59,1.1,-6,.3);p.fill('accent',.67,-.04,.35,1.09,3,.4);
  p.paper('proof-textured-paper',.13,.035,.82,.93,2,.6);p.paper('news-edge',.61,.02,.36,.96,5,.9);p.edge('ink',1.1);
 }else if(id==='y2k'){
  p.grain();p.paper('blue-grid',-.04,.01,.45,1.04,-5,.4);p.paper('pink-torn',.43,-.035,.59,1.08,4,.5);p.material('holo',.48,.025,.49,.96,5,.38,.8,'局部镭射纸',false,'bg','cover');p.edge('accent',1.2);
 }else if(id==='french'){
  p.fill('#e6cccc');p.paper('proof-pink-ledger',-.025,.06,.46,.95,-5,.4);p.paper('ivory-paper',.10,.035,.85,.93,3,.6);p.paper('proof-floral-letter',.02,.55,.40,.45,-7,.9);
  p.fill('accent',.39,.12,.19,.76,-5,1.2,.76);p.material('linen',.39,.12,.19,.76,-5,.18,1.3,'缎面纸的细纹',false,'bg','cover');p.edge('accent',1.5);
  p.art('study-lace-strip',.015,.5,p.H/p.u*.92,90,6,true,'hardware');
 }else if(id==='mecha'){
  p.grain('dark');p.paper('black-paper',0,0,1,1,0,.2);p.fill('accent',.75,-.04,.27,1.09,4,.4,.78);p.paper('silver-peel',-.035,.07,.30,.88,-6,.6,.65);p.edge('soft',1.2);
 }else if(id==='fairy'){
  p.grain();p.fill('accent',0,0,1,1,0,.2,.35);
  if(['tower','compact','circle'].includes(key)){
   p.fill('paper',.035,.025,.93,.95,-1,.5);p.ruled(.065,.05,.87,.90,0,'accent',23,.7);
   p.graphic('绘本装订针脚',`<path d="M${p.W*.075} 12V${p.H-12}" stroke="#c4b18b" stroke-dasharray="2 4" stroke-width=".65"/>`,0,0,1,1,0,.8);
  }else p.book(.014,.025,.972,.95);
  p.paper('fold-white',.06,.05,.38,.90,-4,.8,.35);
  const [x,y,w,h]=spec.h;p.check(x-w/2-.02,y-h/2-.02,w+.04,h+.04,'accent',10,1.1);
 }else if(id==='letter'){
  p.grain();p.fill('accent',-.02,.03,.09,.98,-2,.25,.9);p.paper('sage-grid',.05,.03,.45,.94,-4,.4);p.paper('ivory-paper',.09,.04,.41,.91,-3,.6);
  p.paper('manuscript',.47,-.05,.56,1.1,5,.8,.58);p.paper('proof-floral-letter',.41,.12,.27,.75,7,1,.62);p.edge('accent',1.2);
 }else if(id==='stamp'){
  p.grain();p.fill('soft',.015,.02,.04,.96,0,.2);p.paper('kraft',.05,.02,.92,.96,-1,.3,.6);p.airmail(.07,.035,.90,.93,1,.5);
  p.paper('postcards',.51,.07,.44,.85,4,.7,.6);p.paper('proof-sepia-tickets',.54,.08,.37,.83,4,.9,.55);
  p.graphic('收藏册装订孔',`<g fill="#b7ae98" stroke="#f7f2e2" stroke-width="1">${[.10,.30,.50,.70,.90].map(y=>`<circle cx="${p.W*.046}" cy="${p.H*y}" r="2.1"/>`).join('')}</g>`,0,0,1,1,0,1.1);
 }else if(id==='gothic'){
  p.p.colors.paper='#2d2936';p.grain('dark');p.paper('black-damask',0,0,1,1,0,.3,.9);p.paper('news-edge',-.04,.16,.34,.82,-7,.5,.30);p.paper('rev-black-lace',.67,-.06,.37,1.13,5,.6,.57);p.edge('soft',1.2);
 }else if(id==='sweetcool'){
  p.grain();p.check(.015,.03,.24,.94,'accent',13,.2);p.paper('blue-grid',.27,.02,.43,.96,3,.5);p.paper('pink-torn',.70,.02,.28,.95,5,.7,.7);p.edge('accent',1.1);
 }
}

export function buildSizePage(style,key,W,H){
 const original=DESIGNS[style]?.[key];if(!original)throw new Error(`缺少独立构图：${style}/${key}`);
 const spec=refinePhotoPlan(style,key,original);
 const p=new ReviewPage(style,W,H);p.key=key;paperStructure(p,key,spec);
 for(const [slug,x,y,size,r=0] of spec.o)if(physicalBacking.has(slug))p.art(slug,x,y,size,r,2.2,false,'bg');
 mainMount(p,spec.h);for(const row of spec.s)smallPhoto(p,row);
 for(const [slug,x,y,size,r=0] of spec.o)if(!physicalBacking.has(slug)){
  const group=/clip|tape|washi|pin|chain|twine/.test(slug)?'hardware':/ticket|postage|envelope|parcel|wax/.test(slug)?'details':'flowers';p.art(slug,x,y,size,r,7,true,group);
 }
 addThemeDetails(p,key,spec);
 if(style==='mecha'&&W>=420)p.qr(.715,.44,.10);
 if(style==='stamp')p.postmark(.62,.43,key==='scroll'?.26:.18,-8,'soft');
 return p;
}
