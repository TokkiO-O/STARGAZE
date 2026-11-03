import { F } from '../../assets/base.js';

// 哥特古堡：三联画、单座祭坛、双拱和圆形小像交替组织，不让各尺寸共用一个拱廊位置表。
function chapel(p){p.paper('dark');p.surface('damask',0,0,1,1,0,.75,.1,'古堡暗纹');p.surface('border',.018,.018,.964,.964,0,.7,.4,'古堡细线边');}
function corner(p,small=.2){p.ornaments([['ornate-corner',.025,.045,small,-90],['ornate-corner',.975,.045,small,0],['ornate-corner',.025,.958,small,180],['ornate-corner',.975,.958,small,90]],'hardware');}
function chip(p){
    chapel(p);p.plate('cathedral',0,0,1,1,0,.5);p.photo(.205,.593,.17,.65,'arch',0,1.85,49,22,'left',false);p.photo(.795,.593,.17,.65,'arch',0,1.13,44,67,'right',false);p.hero(.50,.519,.265,.956,'arch');
    p.type('NOCTURNE',.27,.025,.46,.181,{front:true,align:'center'});p.name(.354,.82,.292,.072,0);
    p.ornaments([['candle',.052,.4,.32,-5],['candle',.948,.4,.32,5],['black-moth',.504,.956,.26,0],['hourglass',.945,.883,.27,7],['gothic-fan',.058,.887,.28,-11]],'flowers');corner(p,.15);
}
function compact(p){
    chapel(p);p.plate('chapel',.275,.047,.705,.914,0,1);p.hero(.627,.544,.605,.812,'arch');p.photo(.157,.639,.252,.452,'arch',0,1.85,49,22,'left',false);
    p.type('NOCTURNE',.039,.027,.92,.156,{front:true});p.name(.375,.814,.54,.08,0);
    p.ornaments([['candle',.055,.284,.25,-5],['hourglass',.944,.866,.27,7],['gothic-fan',.1,.93,.3,-11],['black-moth',.519,.963,.24,0],['black-bow',.633,.203,.18,0]],'flowers');corner(p,.15);p.foot('THE MIDNIGHT ARCHIVE',.28,.958,.49,.019);
}
function circle(p){
    chapel(p);p.plate('chapel',.122,.035,.758,.93,0,1);p.hero(.5,.48,.612,.82,'arch');
    p.photo(.143,.802,.223,.311,'arch',0,1.85,49,22,'left',false);p.photo(.857,.802,.223,.311,'arch',0,1.13,44,67,'right',false);
    p.type('NOCTURNE',.043,.015,.915,.139,{align:'center',front:true});p.name(.3,.818,.40,.09,0);
    p.ornaments([['candle',.051,.325,.28,-5],['candle',.949,.325,.28,5],['black-moth',.501,.964,.26,0],['gothic-fan',.064,.933,.24,-12],['hourglass',.94,.933,.23,7],['black-bow',.502,.191,.17,0]],'flowers');corner(p,.16);p.foot('PRIVATE / 01',.364,.968,.27,.017);
}
function polaroid(p){
    chapel(p);p.plate('chapel',.046,.04,.598,.92,0,1);p.hero(.348,.525,.474,.844,'arch');
    p.photo(.81,.331,.223,.339,'arch',0,1.85,49,22,'right',false);p.photo(.81,.778,.223,.339,'arch',0,1.13,44,67,'right',false);
    p.type('NOCTURNE',.043,.02,.913,.16,{front:true});p.name(.131,.823,.416,.083,0);p.note('I / PRIVATE',.699,.535,.25,.022);
    p.ornaments([['candle',.041,.324,.30,-5],['hourglass',.944,.945,.27,7],['gothic-fan',.08,.93,.30,-12],['black-moth',.608,.931,.29,0],['black-moth',.936,.14,.17,12],['black-bow',.349,.183,.18,0]],'flowers');corner(p,.18);p.ornaments([['thorn',.414,1.04,.44,-16]],'hardware');p.foot('A BEAUTIFUL DARK DREAM',.135,.96,.42,.019);
}
function collage(p){
    chapel(p);p.plate('chapel',.205,.013,.59,.973,0,1);p.hero(.5,.516,.423,.901,'arch');
    p.photo(.117,.388,.169,.258,'circle',-3,1.85,49,22,'left');p.photo(.881,.782,.169,.258,'circle',3,1.13,44,67,'right');
    p.type('NOCTURNE',.05,.017,.90,.17,{front:true,align:'center'});p.type('a beautiful\ndark dream',.749,.279,.213,.05,{h:.16,font:F.hand,r:3,front:true});p.name(.349,.827,.31,.098,0);
    p.ornaments([['candle',.053,.231,.29,-5],['candle',.95,.12,.25,5],['gothic-fan',.085,.879,.34,-12],['hourglass',.941,.948,.28,7],['black-moth',.508,.965,.30,0],['feather',.212,.933,.31,22],['black-bow',.501,.19,.19,0]],'flowers');corner(p,.2);p.ornaments([['thorn',.732,1.025,.44,17]],'hardware');p.foot('PRIVATE COLLECTION / 01',.345,.966,.30,.019);
}
function tower(p){
    chapel(p);p.plate('chapel',.035,.10,.93,.83,0,1);p.type('NOCTURNE',.055,.025,.89,.196,{front:true,align:'center'});p.hero(.518,.444,.777,.624,'arch');
    p.photo(.246,.845,.32,.171,'circle',-4,1.85,49,22,'left');p.name(.4,.791,.47,.114,0);
    p.type('a beautiful\ndark dream',.515,.887,.365,.047,{h:.067,font:F.hand,align:'center',front:true});
    p.ornaments([['candle',.072,.282,.32,-6],['candle',.931,.282,.32,6],['hourglass',.936,.927,.29,7],['gothic-fan',.072,.941,.28,-12],['black-moth',.49,.97,.27,0],['feather',.363,.934,.29,22],['black-bow',.518,.195,.21,0]],'flowers');corner(p,.21);p.ornaments([['thorn',.5,1.025,.49,0]],'hardware');p.foot('THE MIDNIGHT ARCHIVE',.3,.98,.51,.02);
}
function scroll(p){
    chapel(p);p.plate('chapel',.065,.015,.278,.97,0,1);p.hero(.208,.513,.214,.941,'arch');
    p.photo(.856,.316,.116,.39,'arch',0,1.85,49,22,'right',false);p.photo(.856,.779,.116,.39,'arch',0,1.13,44,67,'right',false);
    p.type('NOCTURNE',.372,.141,.389,.243,{front:true});p.type('a beautiful dark dream',.387,.465,.35,.075,{font:F.hand,front:true});p.name(.443,.724,.24,.102,0);
    p.ornaments([['candle',.037,.385,.39,-6],['candle',.965,.347,.35,6],['hourglass',.952,.915,.32,7],['gothic-fan',.065,.914,.35,-12],['black-moth',.548,.952,.34,0],['feather',.704,.916,.32,-22],['black-bow',.209,.155,.20,0]],'flowers');corner(p,.2);p.ornaments([['thorn',.402,1.08,.57,-15]],'hardware');p.foot('THE MIDNIGHT ARCHIVE / PRIVATE 01',.378,.936,.367,.026);
}
function poster(p){
    chapel(p);p.plate('chapel',.467,.022,.503,.954,0,1);p.hero(.729,.517,.365,.912,'arch');p.photo(.215,.597,.253,.571,'arch',0,1.7,49,23,'left',false);
    p.type('NOC\nTURNE',.046,.032,.421,.203,{h:.39,front:true});p.type('a beautiful dark dream',.044,.866,.42,.063,{font:F.hand,r:-3,front:true});p.name(.573,.839,.30,.10,0);
    p.ornaments([['candle',.038,.284,.34,-6],['candle',.96,.273,.34,6],['hourglass',.946,.932,.31,7],['gothic-fan',.069,.926,.34,-12],['black-moth',.502,.951,.32,0],['feather',.377,.928,.35,23],['black-bow',.729,.174,.22,0],['black-moth',.454,.091,.16,14]],'flowers');corner(p,.23);p.ornaments([['thorn',.69,1.04,.55,11]],'hardware');p.foot('PRIVATE COLLECTION / MEMENTO',.066,.962,.40,.024);
}
export const gothic={chip,compact,circle,polaroid,collage,tower,scroll,poster};
