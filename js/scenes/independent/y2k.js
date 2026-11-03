import { F } from '../../assets/base.js';

// 千禧辣妹：每个比例重新安排弹窗层级、气泡和界面文字。
function desktop(p){p.paper('holo');p.surface('grid',0,0,1,1,0,.3,.1,'桌面像素格');}
function task(p,y=.92){p.surface('ink',0,y,1,1-y,0,1,1,'桌面状态栏');p.mono('START  ✦',.02,y+.021,.29,.026,{color:'paper',front:true});p.mono('ONLINE / 99%',.69,y+.021,.285,.025,{color:'paper',align:'right',front:true});}
function chip(p){
    desktop(p);p.window(.024,.185,.326,.71,-5);p.photo(.184,.568,.274,.478,'rect',-5,1.75,49,23,'left');
    p.plate('bubble',.516,.015,.481,.95,0,2);p.hero(.762,.51,.398,.889,'circle');
    p.type('CYBER',.302,.025,.41,.249,{z:3.1});p.type('LOVE',.336,.627,.34,.15,{front:true,r:-7});
    p.ornaments([['chrome-heart',.513,.915,.42,-13],['chrome-star',.948,.16,.29,14],['pink-phone',.028,.92,.33,-12],['pixel-arrow',.368,.46,.22,-14],['holo-cross',.437,.22,.18,17]],'flowers');
    p.note('YOU HAVE NEW MAIL',.345,.417,.24,.032);p.foot('ONLINE / 2000',.373,.947,.25,.026);
}
function compact(p){
    desktop(p);p.window(.282,.186,.701,.72,3);p.hero(.644,.567,.616,.667,'rounded');
    p.window(.025,.202,.292,.456,-8,2.2);p.photo(.172,.443,.244,.285,'rect',-8,2,50,22,'left');
    p.type('CYBER',.03,.012,.94,.24,{z:3.1});p.type('LOVE',.052,.674,.51,.19,{front:true,r:-8});task(p,.925);
    p.ornaments([['chrome-heart',.536,.839,.31,-12],['chrome-star',.943,.227,.24,13],['pink-phone',.024,.81,.28,-13],['holo-cross',.262,.60,.19,-14],['pixel-arrow',.376,.20,.16,13]],'flowers');
    p.note('FAVORITE.EXE',.395,.221,.39,.027);p.ornaments([['silver-rings',.939,.833,.19,16]],'hardware');
}
function circle(p){
    desktop(p);p.window(.063,.28,.87,.66,-2,1.3);p.hero(.504,.609,.752,.596,'rounded');
    p.window(.026,.119,.311,.296,-9,2.1);p.photo(.184,.28,.255,.18,'rect',-9,2.2,51,20,'left');
    p.type('CYBER',.06,.014,.9,.20,{z:3.1});p.type('LOVE',.449,.153,.499,.13,{front:true,r:5});task(p,.94);
    p.ornaments([['orbit',.602,.534,.95,-12,3.1,false],['chrome-heart',.23,.846,.29,-14],['chrome-star',.924,.309,.28,15],['pink-phone',.053,.73,.27,-12],['holo-cross',.867,.78,.23,17],['pixel-arrow',.356,.358,.18,-14]],'flowers');
    p.tag('YOU ARE MY FAVORITE',.284,.844,.57,.048,{fill:'paper',color:'ink',r:-4,size:.027});
}
function polaroid(p){
    desktop(p);p.plate('bubble',.401,.121,.587,.787,0,2);p.hero(.67,.524,.501,.706,'circle');
    p.window(.025,.226,.389,.567,-8,2.2);p.photo(.216,.54,.328,.39,'rect',-8,1.7,48,24,'left');
    p.type('CYBER',.035,.018,.90,.226,{z:3.1});p.type('LOVE',.303,.765,.642,.20,{front:true,r:-9,stroke:.5});task(p,.937);
    p.ornaments([['orbit',.712,.493,.98,-13,3.1,false],['chrome-heart',.436,.799,.32,-14],['chrome-star',.957,.245,.27,17],['pink-phone',.06,.86,.29,-13],['pixel-heart',.181,.168,.24,-7],['holo-cross',.347,.627,.2,15],['pixel-arrow',.451,.345,.17,-14]],'flowers');p.note('FAVORITE.EXE',.071,.258,.28,.026,-8);
}
function collage(p){
    desktop(p);p.window(.028,.155,.577,.769,-3,1.3);p.hero(.318,.544,.511,.659,'rounded');
    p.window(.64,.145,.323,.335,8,2);p.photo(.803,.339,.269,.211,'rect',8,2,50,22,'right');
    p.window(.642,.606,.323,.294,-7,2.1);p.photo(.801,.777,.269,.18,'rect',-7,1.13,44,68,'right');
    p.type('CYBER',.039,.012,.9,.224,{z:3.1});p.type('LOVE',.57,.463,.397,.145,{front:true,r:4});task(p,.943);
    p.ornaments([['chrome-heart',.512,.855,.34,-12],['chrome-star',.954,.18,.25,15],['pink-phone',.04,.877,.30,-12],['holo-cross',.635,.61,.23,-14],['pixel-arrow',.615,.248,.17,16],['pixel-heart',.067,.217,.23,-8]],'flowers');p.note('FAVORITE.EXE / 01',.113,.19,.39,.027,-3);
}
function tower(p){
    desktop(p);p.type('CYBER\nLOVE',.047,.013,.91,.20,{h:.21,z:3.1});
    p.plate('bubble',.025,.271,.95,.489,0,2);p.hero(.518,.518,.843,.499,'circle');
    p.window(.023,.148,.337,.21,-8,2.2);p.photo(.191,.271,.279,.135,'rect',-8,2,49,21,'left');
    p.window(.575,.739,.398,.219,8,2.3);p.photo(.774,.865,.333,.143,'rect',8,1.14,44,67,'right');
    p.type('{{name|Mira}}',.10,.705,.62,.11,{font:F.hand,r:-9,front:true});task(p,.969);
    p.ornaments([['orbit',.528,.504,1.08,-12,3.1,false],['chrome-heart',.338,.832,.36,-13],['chrome-star',.928,.315,.28,14],['pink-phone',.063,.912,.30,-14],['holo-cross',.108,.492,.23,-13],['pixel-heart',.898,.11,.25,9],['pixel-arrow',.63,.198,.19,15]],'flowers');p.note('YOU ARE MY FAVORITE.EXE',.19,.951,.65,.022);
}
function scroll(p){
    desktop(p);p.type('CYBER\nLOVE',.024,.083,.329,.29,{h:.66,z:3.1});
    p.window(.354,.205,.206,.65,-8,2);p.photo(.458,.57,.17,.449,'rect',-8,1.7,49,23,'left');
    p.window(.502,.02,.134,.288,9,2.2);p.photo(.57,.189,.109,.171,'rect',9,2.25,52,20,'right');
    p.plate('bubble',.59,.017,.298,.887,0,2.1);p.hero(.74,.482,.247,.871,'circle');task(p,.928);
    p.ornaments([['orbit',.744,.476,1.09,-12,3.1,false],['chrome-heart',.589,.84,.4,-13],['chrome-star',.9,.15,.31,15],['pink-phone',.035,.84,.33,-13],['holo-cross',.923,.678,.28,17],['pixel-arrow',.358,.382,.21,-15],['pixel-heart',.285,.132,.25,8]],'flowers');p.note('YOU HAVE A NEW MESSAGE',.047,.845,.277,.032);
}
function poster(p){
    desktop(p);p.window(.302,.078,.431,.838,2,1.4);p.hero(.52,.539,.369,.76,'rounded');
    p.window(.025,.247,.279,.566,-7,2.1);p.photo(.165,.572,.232,.415,'rect',-7,1.7,49,24,'left');
    p.window(.751,.142,.229,.323,9,2.3);p.photo(.864,.326,.189,.205,'rect',9,2.1,51,21,'right');
    p.window(.696,.617,.252,.284,-8,2.4);p.photo(.822,.783,.209,.177,'rect',-8,1.14,43,67,'right');
    p.type('CYBER',.035,.01,.91,.235,{z:3.1});p.type('LOVE',.27,.799,.44,.21,{front:true,r:-8,stroke:.55});task(p,.957);
    p.ornaments([['chrome-heart',.672,.885,.34,-12],['chrome-star',.964,.126,.28,17],['pink-phone',.052,.884,.32,-12],['holo-cross',.277,.617,.24,-13],['holo-cross',.748,.476,.21,13],['pixel-arrow',.683,.24,.19,16],['pixel-heart',.161,.165,.27,-8]],'flowers');p.note('FAVORITE.EXE',.356,.106,.28,.027,2);
}
export const y2k={chip,compact,circle,polaroid,collage,tower,scroll,poster};
