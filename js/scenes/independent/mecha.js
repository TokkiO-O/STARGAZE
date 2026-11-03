import { F } from '../../assets/base.js';

// 工业废土：用检视面板、六角主像与不同规格的取证栏形成尺寸各自的功能分区。
function rig(p){p.paper('dark');p.plate('workbench-'+p.key,0,0,1,1,0,.1);p.surface('border',.02,.025,.96,.95,0,.8,.5,'机台边框');}
function code(p,x,y,w){p.mono('UNIT / RESTRICTED',x,y,w,.025,{color:'accent',front:true});}
function chip(p){
    rig(p);p.hero(.508,.511,.27,.946,'hexagon');p.photo(.164,.5,.261,.496,'film',0,2.2,50,22,'left');
    p.type('NO\nSIGNAL',.711,.075,.265,.18,{h:.56,color:'paper',front:true,font:F.sans});p.surface('barcode',.729,.739,.22,.084,0,1,7,'档案机器码',true,'details');
    p.ornaments([['hazard',.182,.045,.8,0],['hazard',.84,.981,.8,0],['spring',.333,.948,.37,-10],['silver-rings',.969,.45,.25,14],['chain',.561,.926,.58,-3]],'hardware');
    code(p,.036,.123,.27);p.note('OPTICAL SCAN',.043,.794,.28,.033);p.tag('READY',.432,.86,.15,.075,{fill:'accent',color:'ink',size:.044});
}
function compact(p){
    rig(p);p.type('NO SIGNAL',.045,.025,.91,.18,{color:'paper',front:true,font:F.sans});p.hero(.407,.555,.61,.801,'hexagon');
    p.photo(.859,.635,.197,.485,'rect',0,1.7,50,23,'right');code(p,.748,.246,.217);
    p.ornaments([['hazard',.16,.148,.55,0],['hazard',.86,.97,.47,0],['spring',.547,.936,.33,-9],['silver-rings',.955,.361,.26,15],['black-clip',.81,.376,.15,-12]],'hardware');
    p.tag('SUBJECT / 001',.13,.875,.43,.049,{fill:'accent',color:'ink',size:.027});p.note('ACCESS\nGRANTED',.747,.869,.21,.021);
}
function circle(p){
    rig(p);p.surface('tech',.10,.08,.8,.85,0,1,1.4,'中央检测坐标');p.hero(.508,.482,.682,.81,'hexagon');
    p.photo(.123,.371,.178,.241,'film',0,2.2,51,22,'left');p.photo(.814,.829,.275,.197,'rect',0,1.14,43,67,'right');
    p.type('NO SIGNAL',.051,.025,.9,.14,{color:'paper',front:true,font:F.sans});p.tag('UNIT / 001',.283,.85,.42,.049,{fill:'accent',color:'ink',size:.03});
    p.ornaments([['hazard',.216,.165,.66,0],['hazard',.72,.975,.75,0],['spring',.157,.928,.33,-10],['silver-rings',.943,.225,.3,17],['chain',.735,.92,.54,-4],['black-clip',.064,.28,.15,-12]],'hardware');
    p.mono('X 03\nY 11\nZ 07',.86,.437,.09,.024,{h:.15,color:'accent',front:true});p.surface('barcode',.039,.661,.11,.14,0,1,7,'侧边分类码',true,'details');
}
function polaroid(p){
    rig(p);p.hero(.65,.518,.407,.871,'hexagon');p.photo(.214,.36,.307,.274,'film',0,2.25,51,22,'left');p.photo(.187,.744,.237,.32,'rect',0,1.15,44,67,'left');
    p.type('NO\nSIGNAL',.04,.032,.39,.13,{h:.29,color:'paper',font:F.sans,front:true});code(p,.049,.531,.31);
    p.ornaments([['hazard',.75,.06,.72,0],['hazard',.54,.978,.95,0],['spring',.343,.925,.37,-10],['silver-rings',.955,.197,.30,16],['chain',.829,.876,.52,-4],['black-clip',.084,.608,.15,-12]],'hardware');
    p.tag('SYSTEM READY',.507,.87,.303,.056,{fill:'accent',color:'ink',size:.033});p.surface('barcode',.046,.931,.23,.027,0,1,7,'取证编号',true,'details');p.mono('+',.383,.372,.06,.07,{color:'accent',front:true});
}
function collage(p){
    rig(p);p.surface('soft',.195,.075,.373,.87,0,.7,1.3,'检视主舱');p.hero(.392,.523,.341,.866,'hexagon');
    p.photo(.085,.369,.151,.28,'film',0,2.3,51,22,'left');p.photo(.825,.567,.205,.727,'rect',0,1.6,50,23,'right');
    p.type('NO SIGNAL',.567,.039,.406,.128,{font:F.sans,color:'paper',front:true});p.mono('OPTICAL\nRECORD / 001',.579,.255,.113,.036,{h:.2,color:'accent',front:true});
    p.tag('SUBJECT / 001',.261,.885,.27,.051,{fill:'accent',color:'ink',size:.03});
    p.ornaments([['hazard',.168,.08,.62,0],['hazard',.794,.974,.75,0],['spring',.175,.912,.35,-11],['silver-rings',.957,.229,.34,16],['chain',.762,.893,.56,-4],['black-clip',.054,.243,.14,-11],['metal-label',.61,.834,.28,0]],'hardware');
    p.surface('barcode',.047,.725,.102,.101,0,1,7,'左舱机器码',true,'details');code(p,.579,.504,.13);p.foot('ACCESS GRANTED',.273,.964,.25,.019);
}
function tower(p){
    rig(p);p.type('NO\nSIGNAL',.055,.02,.89,.22,{h:.2,color:'paper',font:F.sans,front:true});p.hero(.521,.423,.698,.535,'hexagon');
    p.photo(.269,.817,.371,.205,'film',0,2.2,50,22,'left');p.photo(.752,.817,.315,.205,'rect',0,1.13,44,67,'right');
    p.tag('UNIT / RESTRICTED',.232,.669,.535,.042,{fill:'accent',color:'ink',size:.032});p.note('OPTICAL SCAN / 001',.061,.731,.85,.027);
    p.ornaments([['hazard',.233,.146,.65,0],['hazard',.7,.976,.89,0],['silver-rings',.924,.28,.31,16],['spring',.175,.947,.33,-10],['chain',.747,.926,.59,-4],['black-clip',.14,.72,.15,-12]],'hardware');
    p.mono('X 03\nY 11\nZ 07',.059,.414,.11,.023,{h:.12,color:'accent',front:true});p.surface('barcode',.403,.944,.27,.022,0,1,7,'封底机器码',true,'details');p.foot('HUMAN ARCHIVE',.39,.98,.47,.019);
}
function scroll(p){
    rig(p);p.hero(.20,.507,.18,.924,'hexagon');p.photo(.451,.322,.194,.34,'film',0,2.25,50,22,'left');p.photo(.48,.744,.151,.294,'rect',0,1.13,44,67,'left');
    p.type('NO\nSIGNAL',.649,.105,.317,.25,{h:.62,font:F.sans,color:'paper',front:true});code(p,.657,.793,.30);
    p.ornaments([['hazard',.156,.042,.83,0],['hazard',.841,.979,.93,0],['silver-rings',.966,.308,.34,15],['spring',.338,.9,.37,-10],['chain',.598,.887,.64,-3],['black-clip',.381,.174,.18,-11],['metal-label',.054,.79,.27,-2]],'hardware');
    p.surface('barcode',.655,.895,.286,.041,0,1,7,'检视台尾部机器码',true,'details');p.tag('SYSTEM READY',.137,.864,.129,.066,{fill:'accent',color:'ink',size:.031});p.mono('X 03\nY 11\nZ 07',.57,.22,.043,.026,{h:.39,color:'accent',front:true});
}
function poster(p){
    rig(p);p.plate('mechanical',0,0,1,1,0,.4);p.hero(.511,.512,.295,.901,'hexagon');
    p.photo(.167,.378,.233,.405,'film',0,2.2,51,22,'left');p.photo(.202,.81,.195,.261,'rect',0,1.14,44,67,'left');p.photo(.837,.542,.207,.734,'rect',0,1.55,50,24,'right');
    p.type('NO SIGNAL',.042,.034,.907,.18,{font:F.sans,color:'paper',front:true});code(p,.065,.594,.26);
    p.ornaments([['hazard',.156,.146,.72,0],['hazard',.82,.981,.86,0],['silver-rings',.967,.258,.34,17],['spring',.339,.934,.37,-10],['chain',.82,.891,.65,-4],['black-clip',.109,.665,.16,-12],['metal-label',.068,.948,.25,0]],'hardware');
    p.tag('SUBJECT / 001',.403,.895,.216,.049,{fill:'accent',color:'ink',size:.03});p.surface('barcode',.738,.937,.189,.028,0,1,7,'右侧档案码',true,'details');p.mono('X 03\nY 11\nZ 07',.661,.343,.06,.027,{h:.23,color:'accent',front:true});p.foot('ACCESS GRANTED / HUMAN ARCHIVE',.366,.976,.306,.019);
}
export const mecha={chip,compact,circle,polaroid,collage,tower,scroll,poster};
