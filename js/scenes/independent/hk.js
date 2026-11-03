import { F } from '../../assets/base.js';

// 港风旧画报：各比例分别组织刊头、新闻照片、胶片和旧票据。
function paper(p){p.paper('paper');p.surface('news',0,0,1,1,0,.55,.1,'报纸分栏底纹');p.material('news-edge',-.045,.08,.43,.94,-5,.7,.4,'旧报纸边');}
function mast(p,x,y,w,h){p.surface('accent',x,y,w,h,0,1,1,'红色刊头');p.note('THE PRIVATE CITY JOURNAL',x+.015,y+.15*h,w-.03,h*p.H/p.u*.47,0,true);}
function chip(p){
    paper(p);p.hero(.225,.51,.414,.92,'rect');
    p.type('OLD TIMES',.47,.025,.51,.255,{z:3.2});p.note('CITY LIGHTS / 1998',.48,.352,.45,.037);
    p.photo(.839,.681,.222,.45,'film',5,1.8,50,23,'right');
    p.note('A NIGHT TO\nREMEMBER',.479,.554,.22,.039);p.line(.47,.49,.50,true);
    p.ornaments([['vinyl',.45,.42,.51,-8,3.2,false],['radio',.47,.91,.38,-9],['clock',.976,.76,.29,7],['ticket',.62,.936,.3,4]],'flowers');
    p.ornaments([['black-clip',.105,.075,.21,-10],['film',.21,.98,.82,-4]],'hardware');p.foot('PRIVATE EDITION / 01',.48,.95,.3,.025);
}
function compact(p){
    paper(p);p.surface('accent',.025,.035,.95,.06,0,1,.7,'红色刊线');p.type('OLD TIMES',.035,.113,.93,.18,{z:3.2});
    p.hero(.367,.574,.604,.738,'rect');p.photo(.839,.664,.247,.397,'film',5,1.8,50,23,'right');
    p.note('VOL. 04\nNO. 08',.738,.337,.20,.026);p.line(.728,.52,.23,true);
    p.ornaments([['vinyl',.836,.353,.29,8,3.1,false],['radio',.64,.94,.35,-5],['ticket',.125,.956,.25,-5]],'flowers');
    p.ornaments([['black-clip',.155,.254,.18,-11],['gold-clip',.91,.52,.15,9]],'hardware');p.foot('HONG KONG / PRIVATE ARCHIVE',.04,.973,.69,.02);
}
function circle(p){
    paper(p);p.type('OLD\nTIMES',.043,.01,.73,.16,{h:.26,z:3.2});p.hero(.346,.552,.568,.741,'rect');
    p.photo(.809,.423,.27,.28,'film',4,1.85,50,21,'right');p.photo(.812,.767,.27,.28,'film',-3,1.15,44,66,'right');
    p.note('CITY LIGHTS',.713,.217,.26,.026);p.line(.705,.262,.26,true);
    p.ornaments([['vinyl',.95,.117,.30,9],['radio',.49,.95,.37,-7],['clock',.075,.91,.25,-9],['ticket',.719,.964,.29,1]],'flowers');
    p.ornaments([['black-clip',.174,.218,.19,-12],['serial',.066,.52,.3,-90]],'hardware');p.number('08',.661,.633,.085);p.foot('PRIVATE PRESS / 01',.31,.979,.38,.018);
}
function polaroid(p){
    paper(p);p.material('paper-note',.04,.06,.71,.81,-3,1,1.3,'老相片衬纸');p.hero(.388,.456,.602,.715,'rect');
    p.photo(.827,.401,.255,.479,'film',5,1.8,50,23,'right');
    p.type('OLD TIMES',.035,.797,.93,.175,{front:true});p.note('THE NIGHT IS STILL YOUNG',.05,.945,.70,.024);
    p.ornaments([['vinyl',.821,.17,.45,14,3.3,false],['radio',.689,.887,.34,-5],['clock',.959,.799,.27,11],['transit-ticket',.027,.67,.27,-12]],'flowers');
    p.ornaments([['film',.35,.091,.83,-4,3.1,false],['black-clip',.23,.10,.19,-11],['gold-clip',.91,.25,.16,8]],'hardware');p.number('01',.7,.63,.095);
}
function collage(p){
    paper(p);p.surface('accent',.035,.09,.136,.8,-2,1,1,'竖排刊头纸');
    p.type('OLD\nTIMES',.045,.145,.115,.112,{h:.45,color:'paper',front:true});
    p.material('paper-note',.208,.025,.56,.98,-2,1,1.4,'中部新闻照片衬纸');p.hero(.482,.506,.469,.849,'rect');
    p.photo(.851,.329,.23,.335,'film',3,1.85,51,21,'right');p.photo(.824,.783,.242,.283,'film',-4,1.14,43,66,'right');
    p.note('CITY LIGHTS\nPRIVATE ARCHIVE',.737,.54,.23,.024);p.line(.739,.632,.22,true);
    p.ornaments([['vinyl',.723,.145,.41,-12,3.2,false],['radio',.683,.929,.39,-6],['clock',.956,.904,.28,8],['ticket',.16,.944,.31,-4],['transit-ticket',.05,.76,.23,-10]],'flowers');
    p.ornaments([['black-clip',.308,.10,.19,-12],['gold-clip',.926,.216,.15,7],['serial',.953,.55,.28,90]],'hardware');p.name(.302,.828,.34,.055,-5);p.foot('THE CITY JOURNAL / VOL.04',.23,.973,.49,.021);
}
function tower(p){
    paper(p);p.type('OLD TIMES',.04,.025,.92,.192,{z:3.2});p.note('THE PRIVATE CITY JOURNAL',.065,.108,.85,.025);
    p.hero(.5,.363,.856,.434,'rect');p.photo(.423,.715,.58,.233,'film',-5,1.75,49,22,'left');
    p.photo(.806,.845,.28,.174,'rect',6,1.15,44,67,'right');
    p.type('CITY\nLIGHTS',.729,.589,.235,.074,{h:.12});p.line(.06,.591,.61,true);
    p.ornaments([['vinyl',.932,.625,.35,12,3.1,false],['radio',.369,.933,.56,-8],['clock',.074,.785,.29,-9],['ticket',.811,.947,.29,4],['transit-ticket',.051,.666,.26,-11]],'flowers');
    p.ornaments([['black-clip',.215,.15,.2,-11],['gold-clip',.205,.605,.17,-10],['film',.511,.541,.90,-2]],'hardware');p.name(.088,.537,.52,.067,-4);p.foot('PRIVATE PRESS / 1998',.42,.98,.52,.019);
}
function scroll(p){
    paper(p);p.surface('accent',.012,.035,.976,.052,0,1,.7,'长刊头红线');p.hero(.186,.522,.214,.897,'rect');
    p.type('OLD\nTIMES',.336,.112,.32,.235,{h:.58});p.note('THE NIGHT IS STILL YOUNG',.337,.779,.32,.033);
    p.photo(.758,.301,.176,.348,'film',5,1.85,50,22,'right');p.photo(.849,.73,.176,.348,'film',-4,1.13,44,67,'right');
    p.ornaments([['vinyl',.937,.23,.43,15,3.2,false],['radio',.661,.888,.4,-7],['clock',.035,.849,.28,-10],['ticket',.443,.96,.41,-2]],'flowers');
    p.ornaments([['black-clip',.135,.1,.22,-11],['gold-clip',.717,.151,.19,9],['serial',.959,.963,.39,0]],'hardware');p.line(.337,.739,.307,true);p.foot('HONG KONG / PRIVATE EDITION',.33,.945,.28,.024);
}
function poster(p){
    paper(p);p.plate('city-columns');p.surface('accent',.025,.03,.95,.045,0,1,.7,'海报刊头红线');p.hero(.264,.53,.42,.87,'rect');
    p.type('OLD TIMES',.511,.105,.463,.184,{z:3.1});p.note('THE CITY JOURNAL / PRIVATE COLLECTION',.515,.277,.44,.026);
    p.photo(.633,.665,.197,.455,'film',-4,1.85,49,22,'right');p.photo(.867,.677,.197,.455,'film',4,1.13,44,67,'right');
    p.note('A NIGHT TO REMEMBER',.515,.373,.44,.031);p.line(.514,.422,.454,true);
    p.ornaments([['vinyl',.514,.26,.46,-15,3.2,false],['radio',.449,.929,.38,-7],['clock',.975,.779,.28,10],['transit-ticket',.024,.68,.24,-10],['ticket',.718,.953,.33,1]],'flowers');
    p.ornaments([['black-clip',.117,.10,.19,-12],['gold-clip',.934,.48,.16,10],['film',.179,.974,.72,-4],['serial',.945,.98,.32,0]],'hardware');p.name(.082,.852,.28,.065,-6);p.foot('VOL.04 / NO.08 / 1998',.514,.978,.36,.019);
}
export const hk={chip,compact,circle,polaroid,collage,tower,scroll,poster};
