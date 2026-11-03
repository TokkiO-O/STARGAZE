import { img } from '../../assets/base.js';
import { F } from '../../assets/base.js';
import { buildMaximalSchool } from '../maximal-school.js';

// 奶盐学园：相册、文具和珍珠；三个已确认的构图继续保留。
function ground(p,key){
    p.paper('soft');p.add(img('v10:school-pattern-'+p.key,0,0,p.W,p.H,{fit:'fill',z:.1}),'蓝格纹与碎花底纸','bg');
    p.surface('torn',.035,.045,.93,.91,-2,1,.5,'奶油手撕纸');
    p.material('study-lined-note',-.03,.21,.43,.75,-7,1,.7,'左页横线便签');
}
function compact(p){
    ground(p);p.material('paper-note',.30,.08,.72,.88,3,1,1.2,'主照片叠纸');
    p.hero(.628,.51,.61,.87,'rect');
    const a=p.photo(.203,.65,.276,.391,'circle',-8,1.7,48,23);p.pearl(a);
    p.type('MILK DAY',.035,.025,.8,.18,{z:3});p.type('little notes',.028,.285,.28,.07,{font:F.hand,r:-8,front:true});
    p.tag('AFTER SCHOOL',.36,.83,.59,.075,{r:3,size:.039});
    p.ornaments([['blue-bow',.90,.15,.28,13],['blue-daisy',.36,.88,.32,-13],['blue-cassette',.09,.94,.32,-12],['study-butterfly',.12,.34,.17,-16],['white-daisy',.7,.96,.14,9]]);
    p.ornaments([['star-clip',.4,.14,.2,-12],['paperclip',.9,.71,.19,14],['study-pearl-wave',.42,.18,.77,0,3.3,false]],'hardware');
    p.number('01',.12,.13,.12);p.foot('PRIVATE SCHOOL JOURNAL',.39,.95,.52,.02);
}
function circle(p){
    ground(p);p.surface('ring',.025,.025,.95,.95,0,.8,1,'圆形相册轮廓');
    p.art('study-doily',.50,.46,.85,0,false,'main',2);p.hero(.5,.453,.687,.687,'circle');
    p.photo(.786,.79,.28,.268,'polaroid',11,1.17,43,66,'right');
    const a=p.photo(.154,.663,.225,.245,'circle',-8,1.9,51,22);p.pearl(a);
    p.type('MILK DAY',.065,.008,.87,.15,{z:3.1,align:'center'});p.name(.26,.747,.4,.09,-8);
    p.ornaments([['blue-bow',.84,.16,.29,18],['blue-daisy',.35,.91,.29,-14],['study-butterfly',.13,.22,.2,-17],['study-milk',.065,.86,.23,-10],['white-daisy',.55,.96,.14,10]]);
    p.ornaments([['study-pearl-wave',.48,.19,.9,-3,3.2,false],['star-clip',.33,.17,.17,-11],['paperclip',.9,.71,.15,17]],'hardware');
    p.tag('MY FAVORITE CHAPTER',.2,.94,.60,.042,{size:.025});p.number('08',.91,.45,.085);
}
function polaroid(p){
    ground(p);p.surface('ink',.06,.145,.62,.74,-4,.9,1,'拍立得衬纸');
    p.hero(.369,.489,.535,.70,'rect');p.avatar.frameStyle='polaroid';
    p.photo(.815,.321,.264,.34,'circle',8,1.8,49,22,'right');
    p.photo(.80,.746,.28,.365,'polaroid',9,1.13,43,68,'right');
    p.type('MILK DAY',.028,.012,.94,.18,{z:3.1});p.name(.11,.804,.49,.095,-7);
    p.ornaments([['blue-daisy',.62,.84,.29,-12],['blue-bow',.96,.11,.24,17],['study-camera',.09,.94,.32,-9],['study-milk',.97,.89,.22,10],['study-butterfly',.059,.35,.2,-14]]);
    p.ornaments([['star-clip',.2,.17,.2,-12],['paperclip',.9,.58,.17,18],['study-pearl-wave',.52,.18,.86,-5,3.3,false]],'hardware');
    p.number('04',.72,.53,.10);p.tag('AFTER SCHOOL',.205,.94,.42,.043,{size:.025});
}
function collage(p){
    ground(p);p.material('paper-note',.405,.015,.62,1.02,3,1,1.4,'右页主照片叠纸');
    p.hero(.707,.519,.507,.87,'rect');
    const a=p.photo(.225,.414,.301,.40,'circle',-7,1.55,48,28,'left');p.pearl(a);
    p.photo(.241,.813,.301,.291,'polaroid',7,1.14,44,67,'left');
    p.type('MILK',.024,.018,.47,.21,{z:3.1});p.type('DAY',.04,.567,.28,.16,{r:-6,front:true});
    p.name(.49,.813,.44,.08,-7);p.note('a page for little things',.031,.702,.34,.027,-6);
    p.ornaments([['blue-bow',.087,.227,.3,-12],['blue-daisy',.47,.9,.3,-14],['blue-cassette',.91,.94,.34,9],['study-butterfly',.965,.25,.19,16],['study-milk',.027,.70,.24,-11],['white-daisy',.55,.95,.15,6]]);
    p.ornaments([['study-pearl-wave',.52,.2,.95,-2,3.1,false],['star-clip',.51,.09,.21,-12],['paperclip',.92,.68,.17,18]],'hardware');
    p.tag('AFTER SCHOOL',.503,.927,.36,.046,{r:2,size:.028});p.number('01',.38,.27,.085);
}
function scroll(p){
    p.paper('soft');p.add(img('v10:school-pattern-scroll',0,0,p.W,p.H,{fit:'fill',z:.1}),'手幅蓝格纹与碎花','bg');
    p.surface('torn',.02,.035,.96,.93,-1,1,.5,'长条奶油纸');
    p.surface('ink',.049,.10,.15,.79,-3,1,1,'左端双格照片条');
    p.photo(.12,.306,.117,.332,'rect',-3,1.85,51,22,'left');p.photo(.125,.692,.117,.332,'rect',-3,1.14,43,66,'left');
    p.material('paper-note',.292,-.07,.285,1.14,2,1,1.4,'中间主像叠纸');p.hero(.437,.511,.212,.969,'rect');
    p.type('MILK DAY',.59,.035,.373,.22,{z:3.2});p.type('my favorite chapter',.581,.308,.36,.079,{font:F.hand,r:-4,front:true});
    const a=p.photo(.79,.644,.15,.574,'circle',7,1.55,48,27,'right');p.pearl(a,1.05);
    p.ornaments([['blue-bow',.04,.15,.3,-13],['blue-daisy',.58,.90,.36,-14],['blue-phone',.958,.84,.4,12],['study-butterfly',.93,.32,.22,15],['blue-cassette',.24,.93,.34,-11]]);
    p.ornaments([['study-pearl-wave',.4,.17,1.16,-2,3.2,false],['star-clip',.35,.09,.23,-12],['paperclip',.844,.416,.21,17]],'hardware');
    p.tag('KEEP THIS MOMENT',.363,.838,.225,.081,{r:-2,size:.043});p.foot('MILK & SALT / AFTER SCHOOL',.61,.947,.29,.023);p.number('08',.244,.535,.15);
}
function poster(p){
    ground(p);p.surface('grid',.35,.03,.62,.9,2,.36,.9,'主页蓝格纹');
    p.material('paper-note',.258,-.03,.378,1.08,-2,1,1.4,'主像相册纸');p.hero(.442,.517,.326,.895,'rect');
    const a=p.photo(.12,.365,.166,.296,'circle',-7,1.75,49,23,'left');p.pearl(a);
    p.photo(.159,.791,.179,.287,'polaroid',7,1.12,43,67,'left');
    p.photo(.80,.51,.273,.59,'polaroid',6,1.55,51,25,'right');
    p.type('MILK DAY',.035,.013,.93,.21,{z:3.1});p.type('the little things',.651,.16,.29,.062,{font:F.hand,r:4,front:true});
    p.name(.304,.81,.31,.105,-8);p.note('SCHOOL CLUB / PRIVATE JOURNAL',.663,.859,.29,.025,3);
    p.ornaments([['blue-bow',.056,.173,.34,-13],['blue-daisy',.65,.89,.35,-12],['blue-phone',.957,.94,.35,9],['blue-cassette',.08,.947,.34,-9],['study-butterfly',.94,.29,.21,18],['study-plane',.215,.18,.20,-13],['white-daisy',.712,.952,.16,5]]);
    p.ornaments([['study-pearl-wave',.39,.18,.99,-3,3.2,false],['star-clip',.326,.089,.21,-13],['paperclip',.91,.265,.18,17]],'hardware');
    p.tag('AFTER SCHOOL',.343,.928,.22,.049,{size:.029,r:-2});p.number('01',.25,.49,.08);p.foot('COLLECTION / 01',.73,.975,.22,.019);
}
export const school={compact,circle,polaroid,collage,scroll,poster};
export function confirmedSchool(W,H,key){return buildMaximalSchool(W,H,key);}
