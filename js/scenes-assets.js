export {
    F, measure, fit, img, txt, glyph,
    A, G, pattern, ASPECT, box, bandBox, colBox,
    ringDots, perforation, rowDots,
    tint, lum, makeStyleSkin,
} from './assets/base.js';

import { ASPECT } from './assets/base.js';

import school from './assets/school.js';
import hk from './assets/hk.js';
import y2k from './assets/y2k.js';
import french from './assets/french.js';
import mecha from './assets/mecha.js';
import fairy from './assets/fairy.js';
import letter from './assets/letter.js';
import stamp from './assets/stamp.js';
import gothic from './assets/gothic.js';
import sweetcool from './assets/sweetcool.js';
import { PIN_ASSET_LIST } from './assets/pin-registry.js';
import { STICKER_ASSET_LIST } from './assets/sticker-registry.js';
import { PACK_ASSET_LIST } from './assets/pack-registry.js';
import { CURATED_ASSETS } from './assets/curated.js';
import { MAXIMAL_ASSETS } from './assets/maximal.js';
import { MAXIMAL_SURFACES } from './scenes/collage-kit.js';
import { STUDY_SURFACES } from './scenes/maximal-school.js';
import { MAXIMAL_BACKGROUNDS } from './assets/maximal-backgrounds.js';
import { SCHOOL_PATTERNS } from './assets/school-patterns.js';
import { UNIQUE_SURFACES } from './scenes/unique-surfaces.js';
import { DESIGN_SURFACES } from './assets/design-surfaces.js';
import { REFINEMENT_ASSETS } from './assets/refinements.js';
import { REVISION_ASSETS } from './assets/revision.js';
import { CURATED_SURFACES } from './scenes/independent/approved.js';
import {THEME_SURFACES} from './assets/theme-surfaces.js';
import { REVIEWED_ASSETS } from './assets/reviewed.js';
import { REVIEWED_SURFACES } from './scenes/reviewed/index.js';

const pack = (styleId, styleName, assets) => assets.map(asset => ({ ...asset, styleId, styleName }));

for (const asset of PIN_ASSET_LIST) {
    if (asset.aspect) ASPECT[asset.id] = asset.aspect;
}

for (const asset of STICKER_ASSET_LIST) {
    if (asset.aspect) ASPECT[asset.id] = asset.aspect;
}

for (const asset of PACK_ASSET_LIST) {
    if (asset.aspect) ASPECT[asset.id] = asset.aspect;
}

export const V10_ASSETS = [
    ...THEME_SURFACES,
    ...REVIEWED_ASSETS,
    ...REVIEWED_SURFACES,
    ...REFINEMENT_ASSETS,
    ...REVISION_ASSETS,
    ...CURATED_SURFACES,
    ...SCHOOL_PATTERNS,
    ...UNIQUE_SURFACES,
    ...MAXIMAL_ASSETS,
    ...MAXIMAL_SURFACES,
    ...STUDY_SURFACES,
    ...MAXIMAL_BACKGROUNDS,
    ...CURATED_ASSETS,
    ...DESIGN_SURFACES,
    ...pack('school', '奶盐学园', school),
    ...pack('hk', '港风旧画报', hk),
    ...pack('y2k', '千禧辣妹', y2k),
    ...pack('french', '法式蕾丝', french),
    ...pack('mecha', '工业废土', mecha),
    ...pack('fairy', '童话绘本', fairy),
    ...pack('letter', '诗歌信笺', letter),
    ...pack('stamp', '复古集邮', stamp),
    ...pack('gothic', '哥特古堡', gothic),
    ...pack('sweetcool', '韩系甜酷', sweetcool),

    ...PIN_ASSET_LIST,

    ...STICKER_ASSET_LIST,

    ...PACK_ASSET_LIST,
];
