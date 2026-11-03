import { PIN_SETS } from './pin-sets.js';
import { pinDecosOf, heroPinsOf } from './pin-registry.js';

export const DECO_BOOST = Object.fromEntries(
    Object.keys(PIN_SETS).map(styleId => [styleId, pinDecosOf(styleId)]),
);

export function heroDecos(styleId) {
    return heroPinsOf(styleId);
}

export function boostDecos(styleId, decos) {
    const base = (decos || []).filter(Boolean);
    const extra = DECO_BOOST[styleId] || [];
    if (!extra.length) return base;

    const out = [];
    const total = base.length + extra.length;
    let bi = 0;
    let ei = 0;
    for (let i = 0; i < total; i += 1) {
        const needBase = bi < base.length;
        const needExtra = ei < extra.length;
        if (!needBase) { out.push(extra[ei++]); continue; }
        if (!needExtra) { out.push(base[bi++]); continue; }

        if ((ei + 1) * base.length <= (bi + 1) * extra.length) out.push(extra[ei++]);
        else out.push(base[bi++]);
    }
    return out;
}
