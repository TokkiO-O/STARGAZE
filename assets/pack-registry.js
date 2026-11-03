import { assetUrl } from './url.js';
import { PACK_SETS } from './pack-sets.js';
import { ASPECT } from './base.js';

const url = file => assetUrl(`assets/packs/${file}`);

export const PACK_ASSET_LIST = [];
export const packPoolOf = styleId => {
    const sets = PACK_SETS[styleId] || { frames: [], props: [], scraps: [] };

    const DARK = styleId === 'mecha' || styleId === 'gothic' || styleId === 'hk';
    const usable = (kind, limit) => (sets[kind] || []).filter(item => {
        if (item.ink != null && item.ink > limit) return false;
        if (!DARK && kind === 'scraps' && item.lum != null && item.lum < 0.34) return false;
        return true;
    });
    const map = (kind, list) => (list || sets[kind] || []).map(item => {
        const id = `v10:pk-${styleId}-${kind}-${item.slug}`;
        ASPECT[id] = item.aspect || 1;
        return id;
    });
    return {
        frames: map('frames'),

        frameInfo: (sets.frames || []).map((item, i) => ({
            id: `v10:pk-${styleId}-frames-${item.slug}`,
            aspect: item.aspect || 1,
            opening: item.opening || 0.72,
            index: i,
        })),
        props: map('props', usable('props', 0.78)),

        propInfo: usable('props', 0.78).map((item, i) => ({
            id: `v10:pk-${styleId}-props-${item.slug}`,
            sat: item.sat == null ? 0.4 : item.sat,
            aspect: item.aspect || 1,
            index: i,
        })),
        scraps: map('scraps', usable('scraps', 0.96)),
    };
};

for (const [styleId, sets] of Object.entries(PACK_SETS)) {
    for (const kind of ['frames', 'props', 'scraps']) {
        for (const item of sets[kind] || []) {
            const id = `v10:pk-${styleId}-${kind}-${item.slug}`;
            ASPECT[id] = item.aspect || 1;
            PACK_ASSET_LIST.push({
                id,
                name: `${styleId} ${kind} ${item.slug}`,
                group: kind,
                styleId,
                aspect: item.aspect || 1,
                url: url(item.file),
            });
        }
    }
}
