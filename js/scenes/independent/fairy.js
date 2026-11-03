import { F } from '../../assets/base.js';

// 童话绘本：展开书页、封面和插页交替使用，不把横幅书页直接缩放到竖幅。
function book(p){p.paper('accent');p.plate('storybook',.015,.02,.97,.96,0,.5);}
function chip(p){
    book(p);p.hero(.25,.529,.379,.871,'rounded');p.photo(.771,.603,.244,.573,'circle',5,1.65,49,23,'right');
    p.type('LITTLE\nSTORY',.523,.023,.425,.20,{h:.48,font:F.hand,front:true});p.name(.071,.808,.353,.081,-6);
    p.ornaments([['rainbow',.22,.155,.48,-8],['story-bear',.487,.815,.37,5],['story-cake',.034,.904,.3,-12],['story-phone',.963,.836,.3,10],['doodle-stars',.936,.33,.16,12]],'flowers');p.foot('A POCKET FULL OF LITTLE JOYS',.545,.946,.373,.027);
}
function compact(p){
    book(p);p.hero(.484,.6,.808,.623,'rounded');p.photo(.837,.271,.24,.252,'circle',8,1.9,50,22,'right');
    p.type('LITTLE STORY',.055,.036,.893,.18,{font:F.hand,front:true});p.type('once upon a day',.065,.226,.618,.058,{font:F.hand,r:-4,front:true});p.name(.11,.821,.40,.069,-6);
    p.ornaments([['story-bear',.775,.905,.3,7],['story-cake',.046,.908,.28,-11],['doodle-stars',.947,.571,.18,13],['rainbow',.19,.27,.30,-7],['study-white-daisy',.497,.946,.13,4]],'flowers');p.foot('CHAPTER / 01',.52,.955,.33,.021);
}
function circle(p){
    book(p);p.hero(.368,.536,.599,.717,'rounded');p.photo(.834,.328,.26,.288,'circle',8,1.8,50,22,'right');p.photo(.774,.815,.365,.232,'polaroid',-5,1.12,44,68,'right');
    p.type('LITTLE STORY',.047,.028,.91,.146,{font:F.hand,front:true});p.name(.11,.813,.45,.084,-7);
    p.ornaments([['rainbow',.219,.177,.36,-7],['story-bear',.609,.665,.28,6],['story-cake',.053,.931,.26,-11],['story-phone',.968,.578,.25,12],['doodle-stars',.724,.17,.15,-12],['study-white-daisy',.502,.965,.13,6]],'flowers');p.type('a tiny story\nfor my favorite',.718,.559,.234,.039,{h:.12,font:F.hand,r:4,front:true});p.number('01',.94,.92,.075);
}
function polaroid(p){
    p.paper('accent');p.surface('paper',.025,.03,.95,.94,-2,1,.5,'绘本单页');p.surface('border',.04,.05,.92,.9,-2,.7,.7,'书页缝线边');
    p.hero(.465,.383,.809,.566,'rounded');p.photo(.797,.818,.298,.257,'polaroid',7,1.75,50,22,'right');
    p.type('LITTLE STORY',.055,.008,.90,.18,{font:F.hand,z:3.2});p.type('Once upon\na lovely day...',.055,.711,.499,.077,{h:.22,font:F.hand,r:-5,front:true});
    p.ornaments([['rainbow',.79,.133,.37,9],['story-bear',.571,.776,.29,-5],['story-cake',.033,.917,.28,-10],['story-tape',.958,.94,.27,11],['doodle-stars',.944,.478,.16,13],['study-white-daisy',.417,.949,.13,5]],'flowers');p.name(.097,.578,.45,.076,-6);p.foot('CHAPTER 01 / LITTLE JOYS',.16,.958,.39,.021);
}
function collage(p){
    book(p);p.hero(.713,.51,.501,.802,'rounded');p.photo(.186,.409,.256,.33,'circle',-7,1.8,49,22,'left');p.photo(.228,.802,.305,.239,'polaroid',5,1.12,44,68,'left');
    p.type('LITTLE\nSTORY',.044,.024,.385,.16,{h:.33,font:F.hand,z:3.2});p.type('a pocket full\nof lovely days',.057,.596,.351,.057,{h:.17,font:F.hand,r:-5,front:true});p.name(.524,.816,.364,.084,-7);
    p.ornaments([['rainbow',.66,.15,.38,8],['story-bear',.452,.838,.33,-5],['story-cake',.038,.933,.29,-10],['story-phone',.966,.898,.31,11],['doodle-stars',.395,.315,.18,14],['study-white-daisy',.649,.953,.13,6]],'flowers');p.ornaments([['star-clip',.11,.675,.16,-12]],'hardware');p.foot('ONCE UPON A DAY / 01',.55,.959,.337,.023);
}
function tower(p){
    p.paper('accent');p.surface('paper',.055,.033,.89,.936,2,1,.5,'绘本封面页');p.surface('holes',.012,.087,.065,.82,0,1,.8,'书脊装订孔');p.surface('grid',.07,.13,.86,.78,2,.25,.9,'封面淡格纹');
    p.type('LITTLE\nSTORY',.09,.027,.83,.213,{h:.19,font:F.hand,z:3.1});p.hero(.49,.422,.823,.456,'rounded');p.photo(.697,.802,.482,.232,'polaroid',8,1.7,50,23,'right');
    p.type('Once upon\na lovely day...',.09,.698,.397,.068,{h:.16,font:F.hand,r:-6,front:true});p.name(.126,.602,.60,.111,-7);
    p.ornaments([['rainbow',.747,.209,.39,10],['story-bear',.411,.874,.37,-6],['story-cake',.096,.948,.3,-11],['story-phone',.936,.94,.3,11],['doodle-stars',.094,.434,.18,-14],['doodle-stars',.911,.613,.21,14],['study-white-daisy',.573,.957,.14,6]],'flowers');p.foot('A POCKET FULL OF LITTLE JOYS',.278,.979,.625,.021);p.number('01',.847,.125,.10);
}
function scroll(p){
    book(p);p.hero(.233,.51,.208,.852,'rounded');p.photo(.768,.425,.132,.545,'circle',7,1.75,50,22,'right');p.photo(.898,.805,.139,.309,'polaroid',-5,1.12,44,68,'right');
    p.type('LITTLE\nSTORY',.402,.053,.27,.26,{h:.58,font:F.hand,front:true});p.type('once upon a lovely day...',.398,.731,.278,.072,{font:F.hand,r:-4,front:true});
    p.ornaments([['rainbow',.224,.14,.53,-8],['story-bear',.377,.897,.36,6],['story-cake',.054,.911,.35,-10],['story-phone',.963,.536,.31,11],['story-tape',.746,.932,.30,-8],['doodle-stars',.68,.207,.18,-13],['study-white-daisy',.606,.935,.16,6]],'flowers');p.name(.153,.828,.18,.085,-6);p.foot('CHAPTER 01 / ONCE UPON A DAY',.428,.942,.261,.025);
}
function poster(p){
    book(p);p.hero(.272,.505,.401,.824,'rounded');p.photo(.755,.42,.226,.397,'circle',8,1.7,49,23,'right');p.photo(.788,.816,.308,.241,'polaroid',-5,1.12,44,68,'right');
    p.type('LITTLE\nSTORY',.532,.033,.406,.172,{h:.34,font:F.hand,z:3.1});p.type('Once upon\na lovely day...',.498,.607,.191,.06,{h:.18,font:F.hand,r:-5,front:true});p.name(.112,.819,.337,.089,-7);
    p.ornaments([['rainbow',.246,.143,.47,-8],['story-bear',.462,.816,.34,6],['story-cake',.048,.933,.30,-11],['story-phone',.958,.671,.29,11],['story-tape',.952,.943,.28,9],['doodle-stars',.94,.31,.18,13],['doodle-stars',.553,.308,.18,-14],['study-white-daisy',.503,.128,.14,5],['study-white-daisy',.55,.93,.15,-6]],'flowers');p.ornaments([['star-clip',.682,.661,.16,-13]],'hardware');p.foot('A POCKET FULL OF LITTLE MEMORIES',.593,.959,.334,.022);p.number('01',.512,.904,.075);
}
export const fairy={chip,compact,circle,polaroid,collage,tower,scroll,poster};
