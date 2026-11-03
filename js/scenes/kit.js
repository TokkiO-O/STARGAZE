import { box, fit, glyph, img, lum, measure, txt } from '../assets/base.js';

export const PAL = (bg, paper, line, accent, ink, soft, glow, ruled) =>
    ({ bg, paper, line, accent, ink, soft, glow, ruled });

export function themeOf(p) {
    const inkLight = lum(p.ink) > lum(p.paper);
    return {
        paper: p.paper,
        accent: p.accent,
        ink: p.ink,
        soft: p.soft,
        secondary: p.line,
        onDark: inkLight ? p.ink : p.paper,
        onLight: inkLight ? p.paper : p.ink,
    };
}

export const bgOf = kit => `v10:bg-${kit.id}`;
export const paperOf = kit => `v10:paper-${kit.id}`;
export const accOf = kit => `v10:acc-${kit.id}`;
export const softOf = kit => `v10:soft-${kit.id}`;
export const inkOf = kit => `v10:ink-${kit.id}`;
export const grainOf = kit => `v10:grain-${kit.id}`;
export const shadowOf = kit => `v10:shadow-${kit.id}`;
export const lightOf = kit => `v10:light-${kit.id}`;
export const ringOf = kit => `v10:ring-${kit.id}`;
export const crnOf = kit => `v10:crn-${kit.id}`;

export function onAccent(kit) {
    return lum(kit.theme.accent) > 0.6 ? kit.theme.onLight : kit.theme.onDark;
}

export function rng(seed) {
    let s = (seed || 1) * 9301 + 49297;
    return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
}

export function base(W, H, kit, out, o = {}) {
    out.push(img(bgOf(kit), 0, 0, W, H, { z: 0, fit: 'fill' }));
    if (o.paper !== false) {
        const m = o.m == null ? 0.026 : o.m;
        const x = W * m;
        const y = H * m;
        const w = W * (1 - m * 2);
        const h = H * (1 - m * 2);
        const r = o.r == null ? -0.8 : o.r;
        if (o.shadow !== false) {

            out.push(img(shadowOf(kit), x + W * 0.008, y + H * 0.012, w * 1.01, h * 1.02,
                { z: 0.4, r, o: 0.52, fit: 'fill' }));
        }
        out.push(img(paperOf(kit), x, y, w, h, { z: 0.6, r, o: o.po == null ? 1 : o.po, fit: 'fill' }));
    }
    if (o.grain !== false) {
        out.push(img(grainOf(kit), 0, 0, W, H, { z: 0.9, o: o.grainO == null ? 0.3 : o.grainO, fit: 'fill' }));
    }

    out.push(img(lightOf(kit), 0, 0, W, H, { z: 0.95, o: o.lightO == null ? 0.32 : o.lightO, fit: 'fill' }));
}

export function wash(out, W, H, kit, assetId, o = {}) {
    const requested = o.o == null ? 1 : o.o;
    out.push(img(assetId, 0, 0, W, H, {
        z: o.z == null ? 1 : o.z,
        o: Math.max(requested, 0.34),
        fit: o.fit || 'cover',
    }));
}

function outPush(out) {
    return out;
}

export function sheet(out, kit, x, y, w, h, o = {}) {
    const z = o.z == null ? 1.6 : o.z;
    const r = o.r || 0;
    if (o.shadow !== false) {
        out.push(img(shadowOf(kit), x + w * 0.012, y + h * 0.018, w * 1.012, h * 1.02,
            { z: z - 0.12, r, o: 0.56, fit: 'fill' }));
    }
    out.push(img(o.id || paperOf(kit), x, y, w, h,
        { z, r, o: o.o == null ? 1 : o.o, fit: 'fill' }));
    if (o.line) {
        out.push(img(accOf(kit), x, y + h - Math.max(0.6, h * 0.008), w, Math.max(0.6, h * 0.008),
            { z: z + 0.04, r, o: 0.35, fit: 'fill' }));
    }
    return { x, y, w, h, r };
}

export function plate(out, kit, x, y, w, h, o = {}) {
    const id = o.id || accOf(kit);
    out.push(img(id, x, y, w, h, { z: o.z == null ? 1.4 : o.z, r: o.r || 0, o: o.o == null ? 0.95 : o.o, fit: 'fill' }));
}

export function portrait(out, x, y, w, h, shape, z, o = {}) {
    out.push(img('__avatar__', x, y, w, h, {
        z: z == null ? 3 : z,
        r: o.r || 0,
        shape,
        caption: o.caption || '',
        o: o.o == null ? 1 : o.o,
        zoom: o.zoom || 1,
        fx: o.fx,
        fy: o.fy,
    }));
}

export function mini(out, x, y, w, h, shape, zOrR, zOrO, maybeO) {
    const index = out.reduce((count, element) => count + (element.assetId === '__avatar__' ? 1 : 0), 0);
    const withCrop = options => {
        const next = { ...(options || {}) };

        if (next.zoom == null) next.zoom = [1.22, 1.52, 1.34, 1.72][index % 4];
        if (next.fx == null) next.fx = [46, 58, 40, 52][index % 4];
        if (next.fy == null) next.fy = [42, 36, 48, 32][index % 4];
        return next;
    };
    if (typeof zOrO === 'number') {
        return portrait(out, x, y, w, h, shape, zOrO, { ...withCrop(maybeO), r: zOrR });
    }
    return portrait(out, x, y, w, h, shape, zOrR, withCrop(zOrO));
}

export function halo(out, kit, cx, cy, A, o = {}) {
    const z = o.z == null ? 2.4 : o.z;
    if (kit.lace) {
        const s = A * (kit.laceRatio || 1) * 1.9;
        out.push(img(kit.lace, cx - s / 2, cy - s / 2, s, s, { z: z - 0.1, o: 0.55 }));
    }
    const s = A * (o.k == null ? 1.22 : o.k);
    out.push(img(ringOf(kit), cx - s / 2, cy - s / 2, s, s, { z, o: o.o == null ? 0.92 : o.o }));
}

export function stk(out, kit, id, cx, cy, size, o = {}) {
    if (!id) return null;
    const b = box(id, size);
    out.push(img(id, cx - b.w / 2, cy - b.h / 2, b.w, b.h, {
        z: o.z == null ? 5 : o.z,
        r: o.r || 0,
        o: o.o == null ? 1 : o.o,
        fit: 'fill',
    }));
    return b;
}

export function strip(out, kit, id, x, y, w, o = {}) {
    if (!id) return null;
    const b = box(id, w);
    out.push(img(id, x, y, w, o.h == null ? b.h : o.h, {
        z: o.z == null ? 2 : o.z,
        r: o.r || 0,
        o: o.o == null ? 1 : o.o,
        fit: 'fill',
    }));
    return { w, h: o.h == null ? b.h : o.h };
}

export function column(out, kit, id, x, y, h, o = {}) {
    if (!id) return null;
    const b = box(id, h);
    out.push(img(id, x, y, b.w, h, {
        z: o.z == null ? 2 : o.z,
        r: o.r || 0,
        o: o.o == null ? 1 : o.o,
        fit: 'fill',
    }));
    return { w: b.w, h };
}

export function tape(out, kit, id, cx, cy, w, o = {}) {
    if (!id) return null;
    const h = o.h == null ? w * 0.32 : o.h;
    out.push(img(id, cx - w / 2, cy - h / 2, w, h, {
        z: o.z == null ? 6 : o.z,
        r: o.r || 0,
        o: o.o == null ? 0.9 : o.o,
        fit: 'fill',
    }));
    return { w, h };
}

export function label(out, kit, text, x, y, w, size, o = {}) {

    const s = Math.min(size, fit(text, w, size, Math.max(3, size * 0.62)));
    const h = s * (o.h == null ? 1.9 : o.h);
    const r = o.r || 0;
    if (o.band !== false) {
        out.push(img(o.bandId || softOf(kit), x, y, w, h,
            { z: o.z == null ? 7 : o.z, r, o: o.bo == null ? 0.92 : o.bo, fit: 'fill' }));
    }
    out.push(txt(text, x, y + (h - s * 1.1) / 2, w, s, {
        font: o.font || kit.subFont,
        color: o.color || kit.theme.onLight,
        align: o.align || 'center',
        z: (o.z == null ? 7 : o.z) + 0.2,
        r,
        o: o.to == null ? 0.92 : o.to,
    }));
    return { w, h };
}

export function head(out, kit, text, x, y, w, size, o = {}) {
    const s = fit(text, w, size, 3.4);
    const align = o.align || 'left';
    const tw = Math.min(w, measure(text, s) * 1.02);
    const bx = align === 'center' ? x + (w - tw) / 2 : align === 'right' ? x + w - tw : x;
    if (o.band) {
        const pad = s * 0.3;
        out.push(img(o.bandId || accOf(kit), bx - pad, y - s * 0.22, tw + pad * 2, s * 1.52,
            { z: o.z == null ? 9 : o.z, r: o.br == null ? -0.7 : o.br, o: 0.95, fit: 'fill' }));
    }
    out.push(txt(text, x, y, w, s, {
        font: o.font || kit.font,
        color: o.color || (o.band ? onAccent(kit) : kit.theme.onDark),
        align,
        z: (o.z == null ? 9 : o.z) + 0.2,
        r: o.r || 0,
        stroke: o.stroke || 0,
    }));
    if (o.sub) {
        out.push(txt(o.sub, x, y + s * (o.band ? 1.5 : 1.34), w, Math.max(3.4, s * 0.3), {
            font: kit.subFont,
            color: o.subColor || (o.band ? onAccent(kit) : kit.theme.accent),
            align,
            z: (o.z == null ? 9 : o.z) + 0.3,
            r: o.r || 0,
        }));
    }
    return s;
}

export function rule(out, kit, x, y, w, t, o = {}) {
    out.push(img(o.id || accOf(kit), x, y, w, Math.max(0.6, t),
        { z: o.z == null ? 9 : o.z, r: o.r || 0, o: o.o == null ? 0.5 : o.o, fit: 'fill' }));
}

export function mark(out, kit, ch, cx, cy, size, o = {}) {
    if (!ch) return;
    out.push(glyph(ch, cx - size / 2, cy - size / 2, size, {
        color: o.color || kit.theme.accent,
        z: o.z == null ? 6 : o.z,
        r: o.r || 0,
        o: o.o == null ? 0.9 : o.o,
    }));
}

export function frame(W, H, kit, out, o = {}) {
    const u = Math.min(W, H);
    const t = Math.max(0.6, u * (o.t == null ? 0.005 : o.t));
    const inset = o.inset == null ? u * 0.03 : o.inset;
    const z = o.z == null ? 11 : o.z;
    const op = o.o == null ? 0.4 : o.o;
    const id = o.color || accOf(kit);
    out.push(img(id, inset, inset, W - inset * 2, t, { z, o: op, fit: 'fill' }));
    out.push(img(id, inset, H - inset - t, W - inset * 2, t, { z, o: op, fit: 'fill' }));
    out.push(img(id, inset, inset, t, H - inset * 2, { z, o: op, fit: 'fill' }));
    out.push(img(id, W - inset - t, inset, t, H - inset * 2, { z, o: op, fit: 'fill' }));
}

export function corners(W, H, kit, out, o = {}) {
    const s = Math.min(W, H) * (o.s == null ? 0.09 : o.s);
    const inset = Math.min(W, H) * (o.inset == null ? 0.024 : o.inset);
    const z = o.z == null ? 11 : o.z;
    const op = o.o == null ? 0.7 : o.o;
    out.push(img(crnOf(kit), inset, inset, s, s, { z, o: op }));
    out.push(img(crnOf(kit), W - inset - s, inset, s, s, { z, o: op, r: 90 }));
    out.push(img(crnOf(kit), W - inset - s, H - inset - s, s, s, { z, o: op, r: 180 }));
    out.push(img(crnOf(kit), inset, H - inset - s, s, s, { z, o: op, r: 270 }));
}

export function arcPos(cx, cy, rx, ry, deg) {
    const a = (deg - 90) * Math.PI / 180;
    return { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, r: deg };
}

export function scatter(out, kit, list, x, y, w, h, count, seed, o = {}) {
    const rand = rng(seed);
    for (let i = 0; i < count; i += 1) {
        const id = list[i % list.length];
        if (!id) continue;
        const size = (o.size == null ? Math.min(w, h) * 0.16 : o.size) * (0.7 + rand() * 0.6);
        const cx = x + w * (0.08 + rand() * 0.84);
        const cy = y + h * (0.1 + rand() * 0.8);
        stk(out, kit, id, cx, cy, size, {
            z: (o.z == null ? 5 : o.z) + i * 0.05,
            r: -24 + rand() * 48,
            o: o.o == null ? 0.95 : o.o,
        });
    }
}

export function lineUp(x0, x1, count) {
    const step = (x1 - x0) / Math.max(1, count - 1);
    return Array.from({ length: count }, (_, i) => x0 + i * step);
}

export function colUp(y0, y1, count) {
    const step = (y1 - y0) / Math.max(1, count - 1);
    return Array.from({ length: count }, (_, i) => y0 + i * step);
}

export { box, fit, glyph, img, measure, txt, outPush };

export function rail(W, A, count) {
    return (W * 0.5 - A * 0.58) / Math.max(1, count);
}
