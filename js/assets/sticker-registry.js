import { assetUrl } from './url.js';
import { STICKER_SETS } from './sticker-sets.js';
import { STICKER_STATS } from './sticker-stats.js';
import { ASPECT } from './base.js';

const url = file => assetUrl(`assets/stickers/${file}`);

const STYLE_NAMES = {
    school: '奶盐学园', hk: '港风旧画报', y2k: '千禧辣妹', french: '法式蕾丝',
    mecha: '工业废土', fairy: '童话绘本', letter: '诗歌信笺', stamp: '复古集邮',
    gothic: '哥特古堡', sweetcool: '韩系甜酷',
};

export const STICKER_ASSET_LIST = Object.entries(STICKER_SETS).flatMap(([styleId, list]) =>
    list.map((item, index) => {
        const id = `v10:st-${styleId}-${item.slug}`;
        if (item.aspect) ASPECT[id] = item.aspect;
        return {
            id,
            name: `${STYLE_NAMES[styleId] || styleId} 贴纸 ${index + 1}`,
            group: 'sticker',
            aspect: item.aspect,
            styleId,
            priority: index,
            pack: item.pack,
            url: url(item.file),
        };
    }));

export const STICKER_COUNT = STICKER_ASSET_LIST.length;

export function stickerPoolOf(styleId) {
    const list = STICKER_SETS[styleId] || [];
    const stats = STICKER_STATS[styleId] || {};
    const pool = { all: [], wide: [], sq: [], tall: [], frame: [], quiet: [], loud: [] };
    for (const item of list) {
        const id = `v10:st-${styleId}-${item.slug}`;
        pool.all.push(id);
        const r = item.aspect || 1;
        if (r >= 2.3) pool.wide.push(id);
        else if (r <= 0.72) pool.tall.push(id);
        else pool.sq.push(id);
        const st = stats[item.slug] || {};

        if (r > 0.78 && r < 1.3 && (st.hole ?? 0) > 0.45 && (st.ink ?? 1) <= 0.36) pool.frame.push(id);

        if ((st.sat ?? 0.4) <= 0.34) pool.quiet.push(id);

        else if ((st.sat ?? 0) >= 0.5 && (st.ink ?? 0) >= 0.18) pool.loud.push(id);
    }

    for (const key of ['wide', 'sq', 'tall']) {
        if (!pool[key].length) pool[key] = pool.all.slice();
    }
    if (!pool.quiet.length) pool.quiet = pool.sq.slice();
    if (!pool.loud.length) pool.loud = pool.sq.slice();
    return pool;
}
