import { assetUrl } from './url.js';
import { PIN_SETS } from './pin-sets.js';

const url = file => assetUrl(`assets/pins/${file}`);

export function pinDecosOf(styleId) {
    return (PIN_SETS[styleId] || []).map(item => `v10:pin-${styleId}-${item.slug}`);
}

export function heroPinsOf(styleId) {
    return pinDecosOf(styleId).slice(0, 2);
}

export const PIN_ASSET_LIST = Object.entries(PIN_SETS).flatMap(([styleId, list]) => list.map((item, index) => ({
    id: `v10:pin-${styleId}-${item.slug}`,
    name: item.name,
    group: 'pin',
    aspect: item.aspect,
    styleId,
    priority: index,
    source: item.pin ? `https://www.pinterest.com/pin/${item.pin}/` : '',
    query: item.query || '',
    url: url(item.file),
})));
