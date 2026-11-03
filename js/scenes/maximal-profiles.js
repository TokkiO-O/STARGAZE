import { F } from '../assets/base.js';
import { EDITORIAL_PALETTES } from '../assets/design-surfaces.js';

// 每个主题的用纸、字组、相片形状和实物素材；尺寸构图在 independent/ 下分别设计。
const DATA = {
    school: { title:'MILK DAY', short:'MILK', issue:'AFTER SCHOOL', note:'my favorite chapter', footer:'a page for the little things', font:F.serif, hand:F.hand, shape:'rect', paper:'ruled', tilt:-4, heroSide:.53,
        art:['blue-daisy','blue-bow','blue-cassette','blue-phone','study-butterfly','study-milk'], hardware:['study-pearl-wave','star-clip','paperclip'], backing:'lined-note', small:'circle' },
    hk: { title:'OLD TIMES', short:'TIMES', issue:'THE CITY ARCHIVE', note:'a night to remember', footer:'HONG KONG / PRIVATE COLLECTION', font:F.serif, hand:F.kai, shape:'rect', paper:'news', tilt:-6, heroSide:.61,
        art:['radio','vinyl','clock','gray-cassette','transit-ticket','ticket'], hardware:['film','black-clip','gold-clip'], backing:'newspaper', small:'film' },
    y2k: { title:'CYBER LOVE', short:'CYBER', issue:'ONLINE / 2000', note:'you are my favorite.exe', footer:'LOADING A LITTLE MAGIC / 99%', font:F.sans, hand:F.hand, shape:'rounded', paper:'holo', tilt:6, heroSide:.47,
        art:['chrome-heart','chrome-star','pink-phone','holo-cross','pixel-arrow','pixel-heart'], hardware:['orbit','silver-rings','chain'], backing:'paper-blue', small:'rounded' },
    french: { title:'MON AMOUR', short:'AMOUR', issue:'LES PETITS SOUVENIRS', note:'a little love letter', footer:'collection de souvenirs / no. 01', font:F.serif, hand:F.hand, shape:'arch', paper:'damask', tilt:-5, heroSide:.57,
        art:['rose','pink-bow','cream-bow','study-pearl-bow','study-white-daisy','rose'], hardware:['study-pearl-wave','study-pearl-vertical','ornate-corner'], backing:'ivory-paper', small:'circle' },
    mecha: { title:'NO SIGNAL', short:'SIGNAL', issue:'UNIT / RESTRICTED', note:'system ready_01', footer:'ACCESS GRANTED / HUMAN ARCHIVE', font:F.sans, hand:F.mono, shape:'rect', paper:'tech', tilt:4, heroSide:.58,
        art:['spring','silver-rings','black-bow','chain','orbit','metal-label'], hardware:['hazard','black-clip','chain'], backing:'news-edge', small:'rect' },
    fairy: { title:'LITTLE STORY', short:'STORY', issue:'ONCE UPON A DAY', note:'small things, happy days', footer:'a pocket full of lovely memories', font:F.serif, hand:F.hand, shape:'rect', paper:'news', tilt:-6, heroSide:.49,
        art:['rev-flower-book','rev-bird','rev-butterfly','rev-moon','rev-herbarium-book','rev-pressed-leaf'], hardware:['rev-gold-key','gold-clip','twine-knot'], backing:'rev-moss-letter', small:'polaroid' },
    letter: { title:'DEAR YOU', short:'DEAR', issue:'LETTERS FROM THE HEART', note:'to my favorite person', footer:'POST SCRIPTUM / FOREVER KEPT', font:F.serif, hand:F.hand, shape:'rect', paper:'ruled', tilt:-4, heroSide:.6,
        art:['envelope','open-book','botanical','typewriter','herb-paper','stamp-green'], hardware:['serial','gold-clip','paperclip'], backing:'ivory-paper', small:'polaroid' },
    stamp: { title:'BON VOYAGE', short:'VOYAGE', issue:'COLLECTION / VOL. 01', note:'wish you were here', footer:'MEMORIES IN TRANSIT / AIR MAIL', font:F.serif, hand:F.hand, shape:'rect', paper:'perf', tilt:5, heroSide:.48,
        art:['stamp-green','stamp-red','transit-ticket','ticket','airmail-number','seat'], hardware:['serial','gold-clip','paperclip'], backing:'newspaper', small:'stamp' },
    gothic: { title:'NOCTURNE', short:'NOCTURNE', issue:'THE MIDNIGHT ARCHIVE', note:'a beautiful dark dream', footer:'PRIVATE COLLECTION / MEMENTO', font:F.serif, hand:F.hand, shape:'arch', paper:'damask', tilt:-4, heroSide:.58,
        art:['black-moth','candle','feather','hourglass','gothic-fan','gothic-lantern'], hardware:['thorn','ornate-corner','black-bow'], backing:'news-edge', small:'arch' },
    sweetcool: { title:'CHERRY CLUB', short:'CHERRY', issue:'SWEET HEART / COOL MIND', note:'my favorite kind of chaos', footer:'MEMBERS ONLY / KEEP IT SWEET', font:F.sans, hand:F.hand, shape:'rect', paper:'grid', tilt:5, heroSide:.54,
        art:['blue-cherries','blue-bow','chrome-heart','blue-cassette','study-butterfly','blue-star'], hardware:['chain','star-clip','silver-rings'], backing:'paper-blue', small:'polaroid' },
};
const POP={school:'#e5b7c8',hk:'#baa16a',y2k:'#c4e275',french:'#9caa7b',mecha:'#8eaaa7',fairy:'#a6bc70',letter:'#b28374',stamp:'#b66b51',gothic:'#8b2945',sweetcool:'#8fb4cf'};
export const MAXIMAL_PROFILES = Object.fromEntries(Object.entries(DATA).map(([id, profile]) => [id, {
    ...profile, id, colors: {...(id === 'school' ? { paper:'#fffdf5', soft:'#d5e7f0', accent:'#6095b2', ink:'#244b65', dark:'#244b65' } : id==='fairy' ? {paper:'#f7efd8',soft:'#e7dfbf',accent:'#a2a36e',ink:'#424d33',dark:'#394438'} : EDITORIAL_PALETTES[id]),pop:POP[id]},
}]));
