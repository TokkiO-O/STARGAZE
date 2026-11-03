import { F } from '../../assets/base.js';

// 韩系甜酷：大幅撕边照片、印刷字组和斜切红纸；横竖幅重新决定照片与刊头谁主导。
function paper(p){p.paper('paper');p.surface('grid',0,0,1,1,0,.4,.1,'冷蓝杂志格纹');}
function chip(p){
    paper(p);p.plate('fashion-slash');p.hero(.294,.502,.405,.974,'rect');p.avatar.frameStyle='torn';p.photo(.858,.713,.194,.435,'polaroid',8,1.2,44,66,'right');
    p.type('CHERRY',.552,.047,.422,.225,{color:'paper',front:true,font:F.sans});p.type('CLUB',.603,.375,.35,.18,{color:'paper',front:true,font:F.sans});
    p.ornaments([['blue-bow',.098,.111,.29,-13],['chrome-heart',.529,.913,.36,-12],['blue-cherries',.966,.564,.28,12],['blue-star',.969,.124,.22,17],['blue-cassette',.06,.946,.33,-9]],'flowers');p.ornaments([['chain',.351,.135,.89,-7],['star-clip',.76,.539,.19,-13]],'hardware');p.foot('MEMBERS ONLY / 01',.551,.95,.35,.026);
}
function compact(p){
    paper(p);p.surface('accent',.015,.02,.39,.96,-2,1,.6,'左侧酒红杂志色纸');p.hero(.649,.552,.636,.814,'rect');p.avatar.frameStyle='torn';p.photo(.172,.661,.245,.377,'polaroid',-7,1.8,50,22,'left');
    p.type('CHERRY',.047,.081,.31,.15,{front:true,color:'paper',font:F.sans});p.type('CLUB',.047,.315,.31,.16,{front:true,color:'paper',font:F.sans});
    p.ornaments([['blue-bow',.896,.184,.27,14],['chrome-heart',.397,.898,.29,-12],['blue-cherries',.966,.762,.24,12],['blue-cassette',.064,.96,.3,-9]],'flowers');p.ornaments([['chain',.635,.18,.85,-7],['star-clip',.076,.544,.16,-13]],'hardware');p.foot('SWEET HEART / COOL MIND',.39,.95,.52,.021);
}
function circle(p){
    paper(p);p.surface('accent',.659,.02,.327,.963,2,1,.6,'右侧红色杂志栏');p.hero(.401,.506,.675,.931,'rect');p.avatar.frameStyle='torn';
    p.photo(.869,.343,.211,.269,'film',4,2.15,51,20,'right');p.photo(.816,.814,.296,.265,'polaroid',7,1.15,44,67,'right');
    p.type('CHERRY',.047,.029,.91,.181,{front:true,color:'accent',stroke:.5,font:F.sans});p.type('CLUB',.68,.537,.27,.137,{front:true,color:'paper',font:F.sans});p.name(.142,.815,.45,.084,-7);
    p.ornaments([['blue-bow',.093,.158,.28,-13],['chrome-heart',.571,.927,.29,-12],['blue-cherries',.964,.648,.24,12],['blue-star',.938,.12,.20,17],['blue-cassette',.086,.953,.30,-9]],'flowers');p.ornaments([['chain',.477,.153,.91,-7],['star-clip',.746,.672,.16,-13]],'hardware');p.foot('MEMBERS ONLY / 01',.34,.972,.44,.018);
}
function polaroid(p){
    paper(p);p.plate('fashion-slash',.03,.015,.97,.97,0,.6);p.hero(.335,.49,.506,.807,'rect');p.avatar.frameStyle='torn';
    p.photo(.801,.73,.273,.41,'polaroid',9,1.15,44,67,'right');p.photo(.065,.506,.101,.368,'film',-3,2.15,51,20,'left');
    p.type('CHERRY',.587,.069,.31,.156,{front:true,color:'paper',font:F.sans});p.type('CLUB',.59,.278,.25,.152,{front:true,color:'paper',font:F.sans});p.type('my favorite chaos',.155,.817,.46,.076,{font:F.hand,r:-7,front:true});
    p.ornaments([['blue-bow',.13,.143,.31,-13],['chrome-heart',.572,.931,.32,-12],['blue-cherries',.97,.542,.27,12],['blue-star',.966,.105,.23,17],['blue-cassette',.075,.946,.32,-9]],'flowers');p.ornaments([['chain',.383,.153,.91,-7],['silver-rings',.933,.902,.21,17],['star-clip',.729,.543,.17,-13]],'hardware');p.foot('SWEET HEART / COOL MIND',.384,.966,.38,.02);
}
function collage(p){
    paper(p);p.surface('accent',.018,.025,.432,.945,-2,1,.6,'左侧杂志红纸');p.hero(.691,.513,.478,.927,'rect');p.avatar.frameStyle='torn';
    p.photo(.188,.789,.273,.34,'polaroid',-7,1.15,44,67,'left');p.photo(.087,.426,.117,.301,'film',-3,2.15,51,20,'left');
    p.type('CHERRY\nCLUB',.054,.034,.425,.196,{h:.40,front:true,color:'paper',font:F.sans});p.type('my favorite kind\nof chaos',.168,.515,.278,.061,{h:.18,font:F.hand,r:-5,color:'paper',front:true});p.name(.518,.828,.355,.087,-7);
    p.ornaments([['blue-bow',.932,.151,.31,14],['chrome-heart',.434,.927,.33,-12],['blue-cherries',.968,.652,.28,12],['blue-star',.946,.328,.21,17],['blue-cassette',.068,.954,.33,-9],['study-butterfly',.417,.75,.19,-14]],'flowers');p.ornaments([['chain',.646,.136,.95,-7],['star-clip',.132,.648,.17,-13]],'hardware');p.foot('SWEET HEART / COOL MIND',.544,.96,.34,.022);
}
function tower(p){
    paper(p);p.surface('accent',.035,.025,.93,.245,-2,1,.6,'杂志封面刊头');p.type('CHERRY',.063,.029,.88,.24,{font:F.sans,color:'paper',front:true});
    p.hero(.503,.484,.857,.586,'rect');p.avatar.frameStyle='torn';p.photo(.203,.847,.312,.213,'polaroid',-7,1.15,44,67,'left');p.photo(.838,.262,.247,.207,'film',5,2.15,51,20,'right');
    p.type('CLUB',.408,.745,.538,.19,{font:F.sans,color:'accent',front:true});p.type('my favorite\nkind of chaos',.392,.888,.43,.059,{h:.095,font:F.hand,r:3,front:true});p.name(.137,.704,.63,.113,-7);
    p.ornaments([['blue-bow',.15,.217,.35,-13],['chrome-heart',.87,.935,.33,-12],['blue-cherries',.955,.603,.29,12],['blue-star',.923,.146,.24,17],['blue-cassette',.08,.957,.32,-9],['study-butterfly',.505,.825,.20,13]],'flowers');p.ornaments([['chain',.527,.218,.97,-7],['star-clip',.12,.749,.17,-13],['silver-rings',.944,.811,.21,17]],'hardware');p.foot('MEMBERS ONLY / 01',.359,.981,.53,.02);
}
function scroll(p){
    paper(p);p.plate('fashion-slash');p.hero(.298,.509,.204,.972,'rect');p.avatar.frameStyle='torn';p.photo(.077,.53,.093,.614,'film',-3,2.15,51,20,'left');p.photo(.874,.686,.151,.569,'polaroid',8,1.15,44,67,'right');
    p.type('CHERRY',.55,.12,.25,.23,{color:'paper',font:F.sans,front:true});p.type('CLUB',.6,.42,.17,.18,{color:'paper',font:F.sans,front:true});p.type('my favorite kind of chaos',.426,.802,.36,.077,{font:F.hand,r:-4,front:true});
    p.ornaments([['blue-bow',.196,.123,.36,-13],['chrome-heart',.493,.923,.39,-12],['blue-cherries',.966,.437,.32,12],['blue-star',.964,.127,.26,17],['blue-cassette',.084,.955,.37,-9],['study-butterfly',.407,.57,.25,-13]],'flowers');p.ornaments([['chain',.326,.147,1.05,-7],['star-clip',.805,.42,.22,-13],['silver-rings',.945,.905,.24,17]],'hardware');p.foot('SWEET HEART / COOL MIND',.51,.95,.26,.025);
}
function poster(p){
    // 对角线留影与中央撕边主像；红纸穿插在照片之间，不再用整块刊头占据下沿。
    paper(p);p.surface('accent',.025,.035,.316,.91,-4,1,.6,'左侧酒红杂志页');
    p.material('paper-note',.302,.017,.505,.968,3,1,1.3,'主肖像叠纸');p.surface('soft',.686,.02,.294,.94,4,1,1.4,'右侧冷蓝相纸底');
    p.hero(.54,.494,.433,.838,'rect');p.avatar.frameStyle='torn';
    p.photo(.17,.281,.24,.42,'polaroid',-8,1.8,50,22,'left');p.photo(.847,.718,.23,.427,'film',7,1.18,46,34,'right');
    p.ornaments([['blue-bow',.07,.13,.29,-13],['chrome-heart',.66,.925,.32,-12],['blue-cherries',.966,.5,.28,12],['blue-star',.953,.128,.23,17],['blue-cassette',.28,.934,.32,-9],['study-butterfly',.953,.84,.20,16]],'flowers');
    p.ornaments([['chain',.54,.105,1.03,-7],['star-clip',.33,.09,.17,-13],['silver-rings',.806,.932,.22,17]],'hardware');
}
export const sweetcool={chip,compact,circle,polaroid,collage,tower,scroll,poster};
