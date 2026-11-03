import { makeStyleSkin } from './assets/base.js';
import { themeOf } from './scenes/kit.js';
import { buildIndependentScene } from './scenes/independent/index.js';
import { PALETTES } from './scenes/reviewed/page.js';
import { REVIEWED_MATERIALS } from './assets/reviewed.js';
import { stickerPoolOf } from './assets/sticker-registry.js';
import { packPoolOf } from './assets/pack-registry.js';

import * as school from './scenes/school.js';
import * as hk from './scenes/hk.js';
import * as y2k from './scenes/y2k.js';
import * as french from './scenes/french.js';
import * as mecha from './scenes/mecha.js';
import * as fairy from './scenes/fairy.js';
import * as letter from './scenes/letter.js';
import * as stamp from './scenes/stamp.js';
import * as gothic from './scenes/gothic.js';
import * as sweetcool from './scenes/sweetcool.js';

const MODULES = [school, hk, y2k, french, mecha, fairy, letter, stamp, gothic, sweetcool];

// 模板菜单和快捷素材与已筛选的成品使用同一方向，避免旧介绍、旧推荐串回新主题。
const DIRECTIONS={
 school:['奶盐学园','活页纸 · 文具 · 日常手记',['notebook','memos','pencils','coffee','cake','study-milk']],
 hk:['港风旧画报','旧画报 · 胶片 · 电影票据',['vinyl','radio','clock','gray-cassette','cinema','old-camera']],
 y2k:['千禧辣妹','镭射纸 · 透明数码 · 闪亮贴饰',['cd','pink-phone','blue-player','gamepad','stars-metal','holo-heart']],
 french:['法式蕾丝','奶油蕾丝 · 缎带 · 复古小镜',['lace-fine','cream-bow','pressed-rose','frame-silver','proof-perfume','embroidery']],
 mecha:['工业废土','灰银机械 · 做旧金属 · 铁锈红',['gear','hinge','chain-black','spring-black','pipe-cross','rev-safety-pin']],
 fairy:['童话绘本','手绘小物 · 暖色书页 · 蜡笔画材',['story-reader','story-teapot','cream-books','pastel-crayons','cloud-crayon','stars-crayon']],
 letter:['巴黎信笺','信纸手稿 · 钢笔 · 压花火漆',['mail-sealed','letter-papers','fountain-pen','pressed-rose','wax','ivory-envelope']],
 stamp:['复古集邮','邮票齿孔 · 旧信件 · 邮政收藏',['rev-postage-train','cat-postage','parcel-bundle','postcards','postage-paper','wax']],
 gothic:['哥特古堡','暗色拱窗 · 雕花 · 玫瑰烛台',['rose-candles','rose-red','chandelier','cross-silver','black-notebook','rev-rose-key']],
 sweetcool:['韩系甜酷','收藏小卡 · 雾蓝缎带 · 樱桃红',['cherries','ribbon-white','jelly-heart','card-sleeve','clip-star','star-jelly']],
};

export const V10_STYLES = MODULES.map(mod => {
    const colors = PALETTES[mod.style.id], [name,desc,materials]=DIRECTIONS[mod.style.id];
    const style = { ...mod.style, name, desc, theme: { ...themeOf(mod.style.palette), ...colors, secondary: colors.soft } };
    style.decos = materials.map(slug=>REVIEWED_MATERIALS.get(slug).id);

    style.stickers = stickerPoolOf(style.id);

    style.packs = packPoolOf(style.id);
    return style;
});

export const V10_SKINS = V10_STYLES.flatMap(style => makeStyleSkin(style.id, style.palette));

const EXACT = {
    '280x110': 'chip',
    '200x150': 'compact',
    '240x240': 'circle',
    '300x245': 'polaroid',
    '420x285': 'collage',
    '300x460': 'tower',
    '560x285': 'banner',
    '820x225': 'scroll',
    '680x390': 'poster',
};

export function pickSize(W, H) {
    const hit = EXACT[`${Math.round(W)}x${Math.round(H)}`];
    if (hit) return hit;
    const ratio = W / Math.max(1, H);
    if (ratio >= 3) return 'scroll';
    if (ratio >= 1.9) return 'banner';
    if (ratio >= 1.55) return 'poster';
    if (ratio >= 1.3) return 'collage';
    if (ratio >= 1.15) return 'polaroid';
    if (ratio >= 1) return 'circle';
    if (ratio >= 0.78) return 'compact';
    return 'tower';
}

export function buildV10Scene(styleId, W, H) {
    const mod = MODULES.find(item => item.style.id === styleId);
    if (!mod) return { elements: [], avatarUnits: 0 };
    const kit = V10_STYLES.find(item => item.id === styleId);
    const key = pickSize(W, H);

    const scene = buildIndependentScene(W, H, kit, key);
    return {
        elements: scene.elements,
        avatarUnits: scene.avatarUnits,
        avatar: scene.avatar,
        groups: scene.groups,
        theme: scene.theme,
        anchorX: scene.anchorX == null ? 0.5 : scene.anchorX,
        anchorY: scene.anchorY == null ? 0.5 : scene.anchorY,
        builder: key,
    };
}
