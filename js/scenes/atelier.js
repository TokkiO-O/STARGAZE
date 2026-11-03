import { F, box, img, txt } from '../assets/base.js';
import {
    PAL, base, wash, sheet, portrait, mini, stk, tape, label, head, rule, mark,
    frame, corners, arcPos, rng, onAccent, paperOf, accOf, softOf, inkOf, ringOf, shadowOf, bgOf,
} from './kit.js';
import { pinDecosOf, heroPinsOf } from '../assets/pin-registry.js';

const PAPER_TEX = {
    school: 'v10:school-grid', hk: 'v10:hk-news', y2k: 'v10:y2k-grid', french: 'v10:fr-linen',
    mecha: 'v10:mt-canvas', fairy: 'v10:fy-paper', letter: 'v10:lt-lines', stamp: 'v10:sp-perftex',
    gothic: 'v10:gt-wallpaper', sweetcool: 'v10:sc-vellum',
};

function paperCard(out, kit, x, y, w, h, o = {}) {
    const z = o.z == null ? 2.2 : o.z;
    const r = o.r || 0;
    if (o.shadow !== false) {
        out.push(img(shadowOf(kit), x + w * 0.012, y + h * 0.02, w * 1.02, h * 1.03,
            { z: z - 0.12, r, o: 0.5, fit: 'fill' }));
    }
    out.push(img(paperOf(kit), x, y, w, h, { z, r, o: 1, fit: 'fill' }));
    const tex = PAPER_TEX[kit.id];
    if (tex) out.push(img(tex, x, y, w, h, { z: z + 0.02, r, o: o.texO == null ? 0.55 : o.texO, fit: 'cover' }));
    return { x, y, w, h, r };
}

function photoCard(out, kit, id, x, y, w, h, o = {}) {
    const z = o.z == null ? 4.1 : o.z;
    const r = o.r || 0;
    const border = o.border == null ? Math.min(w, h) * 0.03 : o.border;
    out.push(img(shadowOf(kit), x + w * 0.014, y + h * 0.022, w * 1.02, h * 1.03,
        { z: z - 0.16, r, o: 0.44, fit: 'fill' }));
    out.push(img(paperOf(kit), x - border, y - border, w + border * 2, h + border * 2,
        { z: z - 0.08, r, o: 0.98, fit: 'fill' }));
    const tex = PAPER_TEX[kit.id];
    if (tex) {
        out.push(img(tex, x - border, y - border, w + border * 2, h + border * 2,
            { z: z - 0.06, r, o: 0.5, fit: 'cover' }));
    }
    if (o.rule !== false) {
        out.push(img(accOf(kit), x - border, y - border, w + border * 2, Math.max(0.6, h * 0.008),
            { z: z + 0.02, r, o: 0.22, fit: 'fill' }));
    }
    if (o.tape !== false && kit.tapes?.length) {
        tape(out, kit, kit.tapes[0], x + w * 0.3, y - border * 1.2, Math.min(w * 0.46, w * 0.4),
            { z: z + 0.5, r: r - 6, o: 0.82 });
    }
    return { x, y, w, h, r };
}

function edgeDress(W, H, kit, out, o = {}) {
    const z = o.z == null ? 6.4 : o.z;
    const top = o.top == null ? true : o.top;
    const bottom = o.bottom == null ? true : o.bottom;
    const tone = o.tone || 0.5;
    const count = o.count || Math.max(3, Math.round(W / Math.min(W, H) / 1.1));
    const step = W / count;
    const id = o.id || accOf(kit);
    for (let i = 0; i < count; i += 1) {
        const cx = step * (i + 0.5);
        const seg = step * (0.72 + ((i * 37) % 23) / 100);
        if (top) {
            out.push(img(id, cx - seg / 2, H * 0.012, seg, Math.max(0.8, H * 0.012),
                { z, o: tone, fit: 'fill' }));
        }
        if (bottom) {
            out.push(img(id, cx - seg / 2, H * 0.976, seg, Math.max(0.8, H * 0.012),
                { z, o: tone, fit: 'fill' }));
        }
    }
}

function cornerMotif(out, kit, which, W, H, o = {}) {
    const pool = o.pool || kit.decos || [];
    if (!pool.length) return;
    const u = Math.min(W, H);
    const inset = o.inset == null ? u * 0.035 : o.inset;
    const corners = {
        tl: [inset, inset, -8], tr: [W - inset, inset, 8],
        bl: [inset, H - inset, 6], br: [W - inset, H - inset, -6],
    };
    const [cx, cy, rot] = corners[which] || corners.tl;
    const s = o.s == null ? u * 0.2 : o.s;
    const dirX = which.includes('r') ? -1 : 1;
    const dirY = which.includes('b') ? -1 : 1;
    stk(out, kit, pool[0], cx + dirX * s * 0.16, cy + dirY * s * 0.14, s, { z: 6.5, r: rot });
    if (pool[1]) stk(out, kit, pool[1], cx + dirX * s * 0.5, cy + dirY * s * 0.02, s * 0.62, { z: 6.56, r: rot + 14 });
    if (pool[2] && o.third !== false) {
        stk(out, kit, pool[2], cx + dirX * s * 0.1, cy + dirY * s * 0.62, s * 0.5, { z: 6.52, r: rot - 10 });
    }
}

function ruleLine(out, kit, x, y, w, o = {}) {
    rule(out, kit, x, y, w, o.t == null ? 0.9 : o.t, { o: o.o == null ? 0.35 : o.o, z: o.z == null ? 6.2 : o.z });
}

function groundLayers(W, H, kit, out, o = {}) {
    base(W, H, kit, out, { m: o.m == null ? 0 : o.m, shadow: o.m !== 0 && o.shadow !== false, grainO: o.grainO == null ? 0.26 : o.grainO });
    const washes = (kit.washes || WASHES[kit.id] || []).slice(0, o.washes == null ? 2 : o.washes);
    washes.forEach((entry, i) => {
        const [assetId, opacity] = Array.isArray(entry) ? entry : [entry, 0.34];
        out.push(img(assetId, 0, 0, W, H, { z: 1 + i * 0.1, o: Math.max(opacity, 0.24), fit: 'cover' }));
    });
}

function adorn(W, H, kit, out, opt = {}) {
    const pool = kit.stickers || {};
    const all = pool.all || [];
    if (!all.length) return;
    const u = Math.min(W, H);
    const hero = opt.hero || null;

    if (hero) {
        const frames = (pool.frame || []).filter(id => {
            const b = box(id, 10);
            const r = b.w / b.h;
            return r > 0.78 && r < 1.28;
        });
        if (frames.length) {
            const fi = Number.isFinite(opt.frameIndex) ? opt.frameIndex : 0;
            const id = frames[fi % frames.length];
            const s = Math.min(W, H) * 0.02 + Math.max(hero.w, hero.h) * 1.14;
            out.push(img(id, hero.x + hero.w / 2 - s / 2, hero.y + hero.h / 2 - s / 2, s, s,
                { z: 7.02, r: (opt.jitter || 0) * 0.4, fit: 'contain', o: 0.95 }));
        }
    }

    const rand = rng(W * 3 + H * 5 + (opt.seed || 1));
    const count = opt.count == null ? 6 : opt.count;
    const cx = hero ? hero.x + hero.w / 2 : W / 2;
    const cy = hero ? hero.y + hero.h / 2 : H / 2;
    const radius = (Math.min(W, H) * 0.5) * (opt.radius == null ? 0.92 : opt.radius);

    for (let i = 0; i < count; i += 1) {
        const id = all[(i * 7 + (opt.seed || 0)) % all.length];
        const size = u * (0.06 + rand() * 0.05);
        const ang = (i / count) * Math.PI * 2 + rand() * 0.5;
        const px = cx + Math.cos(ang) * radius * (0.75 + rand() * 0.3);
        const py = cy + Math.sin(ang) * radius * (0.62 + rand() * 0.3);
        const b = box(id, size);
        const rect = { x: px - b.w / 2, y: py - b.h / 2, w: b.w, h: b.h };
        if (rect.x < -W * 0.02 || rect.y < -H * 0.02 || rect.x + rect.w > W * 1.02 || rect.y + rect.h > H * 1.02) continue;
        out.push(img(id, rect.x, rect.y, rect.w, rect.h, {
            z: 6.8 + i * 0.01, r: -22 + rand() * 44, o: 0.94, fit: 'contain',
        }));
    }
}

const photosOf = styleId => pinDecosOf(styleId || '');

const adornAt = (out, kit, W, H, cx, cy, A, opt = {}) =>
    adorn(W, H, kit, out, { hero: { x: cx - A / 2, y: cy - A / 2, w: A, h: A }, ...opt });

const accentBand = kit => (kit.theme && kit.theme.onDark === kit.theme.ink ? softOf(kit) : accOf(kit));

const WASHES = {
    school: [['v10:school-grid', 0.3], ['v10:school-vellum', 0.24]],
    hk: [['v10:hk-news', 0.32], ['v10:hk-grain', 0.26]],
    y2k: [['v10:y2k-holo', 0.42], ['v10:y2k-grid', 0.2]],
    french: [['v10:fr-floral', 0.3], ['v10:fr-tulle', 0.24]],
    mecha: [['v10:mt-steel', 0.34], ['v10:mt-circuit', 0.2]],
    fairy: [['v10:fy-watercolor', 0.34], ['v10:fy-paper', 0.24]],
    letter: [['v10:lt-lines', 0.24], ['v10:lt-watermark', 0.28]],
    stamp: [['v10:sp-perftex', 0.24]],
    gothic: [['v10:gt-velvet', 0.42], ['v10:gt-wallpaper', 0.24]],
    sweetcool: [['v10:sc-floral', 0.3], ['v10:sc-vellum', 0.26]],
};

function chip(W, H, kit, out) {
    const A = H * 0.56;
    groundLayers(W, H, kit, out, { m: 0 });

    tape(out, kit, kit.tapes?.[0], W * 0.16, H * 0.13, W * 0.2, { z: 2.2, r: -4, o: 0.8 });
    tape(out, kit, kit.tapes?.[0], W * 0.84, H * 0.13, W * 0.2, { z: 2.2, r: 4, o: 0.8 });

    const iw = W * 0.34;
    label(out, kit, kit.sub ? kit.sub.replace(/\{\{[^|]+\|([^}]+)\}\}/g, '$1') : 'NAME', W * 0.5 - iw / 2, H * 0.02,
        iw, Math.max(4, H * 0.1), { z: 7.1, bandId: softOf(kit), bo: 0.95 });

    portrait(out, W * 0.5 - A / 2, H * 0.5 - A / 2, A, A, kit.avatarShape || 'circle', 3.4, { zoom: 1.02 });

    const dw = W * 0.22;
    out.push(img(accOf(kit), W * 0.5 - dw / 2, H * 0.85, dw, Math.max(3, H * 0.1), { z: 7.1, o: 0.9, fit: 'fill' }));
    out.push(txt(kit.mark?.[1] || '2024', W * 0.5 - dw / 2, H * 0.865, dw, Math.max(3.4, H * 0.062),
        { font: kit.subFont, color: onAccent(kit), align: 'center', z: 7.3 }));

    cornerMotif(out, kit, 'tl', W, H, { s: H * 0.34, third: false });
    cornerMotif(out, kit, 'bl', W, H, { s: H * 0.26, third: false });
    cornerMotif(out, kit, 'tr', W, H, { s: H * 0.28, third: false });
    cornerMotif(out, kit, 'br', W, H, { s: H * 0.3, third: false });
    edgeDress(W, H, kit, out, { count: 5, tone: 0.4 });
    adornAt(out, kit, W, H, W * 0.5, H * 0.5, A, { count: 2, seed: 3, radius: 0.72 });
    return { avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function compact(W, H, kit, out) {
    const A = W * 0.42;
    groundLayers(W, H, kit, out);
    const photos = photosOf(kit.id);

    paperCard(out, kit, W * 0.03, H * 0.04, W * 0.5, H * 0.46, { z: 2.4, r: -3.4, o: 0.96 });
    if (photos[0]) photoCard(out, kit, photos[0], W * 0.07, H * 0.12, W * 0.23, H * 0.23, { z: 3.0, r: -5 });

    const cx = W * 0.62;
    const cy = H * 0.58;
    portrait(out, cx - A / 2, cy - A / 2, A, A, kit.avatarShape || 'rounded', 3.8, { zoom: 1.02 });

    label(out, kit, kit.title || 'TITLE', W * 0.04, H * 0.03, W * 0.42, Math.max(4, H * 0.09), { z: 7.2, band: true, bandId: accOf(kit), color: onAccent(kit) });
    out.push(txt(kit.mark?.[0] || '2024', W * 0.05, H * 0.86, W * 0.3, Math.max(3.2, H * 0.055),
        { font: kit.subFont, color: kit.theme.ink, z: 7.2, o: 0.8 }));

    if (photos[1]) photoCard(out, kit, photos[1], W * 0.73, H * 0.67, W * 0.19, H * 0.19, { z: 3.1, r: 6, tape: false, border: 0.9 });
    cornerMotif(out, kit, 'tr', W, H, { s: H * 0.24 });
    cornerMotif(out, kit, 'bl', W, H, { s: H * 0.22 });
    edgeDress(W, H, kit, out, { count: 4, tone: 0.34 });
    adornAt(out, kit, W, H, cx, cy, A, { count: 6, seed: 5, radius: 0.86 });
    return { avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function circle(W, H, kit, out) {
    const u = Math.min(W, H);
    const R = u * 0.5;
    const A = u * 0.6;
    groundLayers(W, H, kit, out, { m: 0 });

    if (kit.lace) {
        const s = u * 1.02;
        out.push(img(kit.lace, (W - s) / 2, (H - s) / 2, s, s, { z: 2.6, o: 0.6 }));
    }
    out.push(img(ringOf(kit), (W - A * 1.32) / 2, (H - A * 1.32) / 2, A * 1.32, A * 1.32, { z: 2.8, o: 0.9 }));

    portrait(out, W * 0.5 - A / 2, H * 0.5 - A / 2, A, A, 'circle', 3.6, { zoom: 1.02 });

    const decos = kit.decos || [];
    const n = 8;
    for (let i = 0; i < n; i += 1) {
        const deg = i * (360 / n) - 90;
        const p = arcPos(W * 0.5, H * 0.5, R * 0.84, R * 0.84, deg);
        const id = decos[i % Math.max(1, decos.length)];
        if (id) stk(out, kit, id, p.x, p.y, u * 0.14, { z: 6.3, r: p.r + 90 });
    }

    const arcText = kit.footer || '';
    if (arcText) {
        for (let i = 0; i < 5; i += 1) {
            const p = arcPos(W * 0.5, H * 0.5, R * 0.66, R * 0.66, -150 + i * 8);
            out.push(txt(arcText.slice(i * 2, i * 2 + 2), p.x - u * 0.04, p.y - u * 0.03, u * 0.08, Math.max(3, u * 0.045),
                { font: kit.subFont, color: kit.theme.ink, align: 'center', z: 7.1, r: p.r + 90, o: 0.6 }));
        }
    }
    adornAt(out, kit, W, H, W * 0.5, H * 0.5, A, { count: 8, seed: 7, radius: 0.78 });
    return { avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function polaroid(W, H, kit, out) {
    groundLayers(W, H, kit, out, { m: 0 });
    const pad = Math.min(W, H) * 0.055;
    const bx = pad;
    const by = pad;
    const bw = W - pad * 2;
    const bh = H - pad * 2 - Math.min(W, H) * 0.055;

    out.push(img(shadowOf(kit), bx + W * 0.01, by + H * 0.014, bw * 1.02, (bh + pad * 1.4) * 1.03,
        { z: 2.2, r: -2.2, o: 0.5, fit: 'fill' }));
    out.push(img(paperOf(kit), bx, by, bw, bh + pad * 1.4, { z: 2.4, r: -2.2, fit: 'fill' }));

    const A = Math.min(bw, bh * 0.98);
    const cx = W * 0.5;
    const cy = by + bh * 0.48;
    portrait(out, cx - A / 2, cy - A / 2, A, A, kit.avatarShape === 'circle' ? 'circle' : 'square', 3.6, { zoom: 1.01 });

    out.push(txt(kit.mark?.[1] || '2024.05', bx + bw * 0.06, by + bh + pad * 0.66, bw * 0.6, Math.max(4, H * 0.05),
        { font: kit.subFont, color: kit.theme.ink, z: 7.2, o: 0.85 }));
    const decos = kit.decos || [];
    if (decos[0]) stk(out, kit, decos[0], bx + bw * 0.86, by + bh + pad * 0.7, H * 0.11, { z: 6.4, r: -8 });
    if (decos[1]) stk(out, kit, decos[1], bx + bw * 0.1, by + bw * 0.02, H * 0.1, { z: 6.4, r: 10 });

    cornerMotif(out, kit, 'tl', W, H, { s: H * 0.2, third: false });
    cornerMotif(out, kit, 'br', W, H, { s: H * 0.22, third: false });
    adornAt(out, kit, W, H, cx, cy, A, { count: 6, seed: 11, radius: 0.9 });
    return { avatarUnits: A, anchorX: 0.5, anchorY: 0.48 };
}

function collage(W, H, kit, out) {
    const A = Math.min(W, H) * 0.56;
    groundLayers(W, H, kit, out);
    const photos = photosOf(kit.id);
    const decos = kit.decos || [];

    paperCard(out, kit, -W * 0.04, H * 0.08, W * 0.34, H * 0.62, { z: 2.2, r: -4.2 });
    paperCard(out, kit, W * 0.26, -H * 0.06, W * 0.3, H * 0.58, { z: 2.3, r: 2.8, o: 0.96 });
    paperCard(out, kit, W * 0.52, H * 0.1, W * 0.32, H * 0.6, { z: 2.25, r: -2.4 });
    paperCard(out, kit, W * 0.68, H * 0.56, W * 0.36, H * 0.52, { z: 2.2, r: 3.6, texO: 0.45 });
    paperCard(out, kit, W * 0.14, H * 0.6, W * 0.3, H * 0.46, { z: 2.28, r: -1.6, texO: 0.4 });

    if (photos[0]) photoCard(out, kit, photos[0], W * 0.05, H * 0.14, W * 0.14, H * 0.25, { z: 3.2, r: -5 });
    if (photos[1]) photoCard(out, kit, photos[1], W * 0.78, H * 0.55, W * 0.13, H * 0.23, { z: 3.25, r: 5.5 });
    if (photos[2]) photoCard(out, kit, photos[2], W * 0.52, H * 0.07, W * 0.1, H * 0.17, { z: 3.15, r: -3, tape: false });

    const cx = W * 0.44;
    const cy = H * 0.52;
    portrait(out, cx - A / 2, cy - A / 2, A, A, kit.avatarShape || 'rounded', 4.0, { zoom: 1.02 });

    head(out, kit, kit.title || 'COLLAGE', W * 0.5, H * 0.04, W * 0.44, Math.max(7, H * 0.1),
        { align: 'right', z: 7.4, color: kit.theme.ink, sub: kit.badge || '', subColor: kit.theme.accent });
    ruleLine(out, kit, W * 0.52, H * 0.185, W * 0.42, { o: 0.34 });

    label(out, kit, kit.sub ? kit.sub.replace(/\{\{[^|]+\|([^}]+)\}\}/g, '$1') : 'A PAGE OF NOTES',
        W * 0.6, H * 0.68, W * 0.26, Math.max(4, H * 0.045), { z: 7.2, band: true, bandId: accentBand(kit), color: onAccent(kit) });
    out.push(txt(kit.mark?.[1] || '', W * 0.62, H * 0.78, W * 0.2, Math.max(3.4, H * 0.038),
        { font: kit.subFont, color: kit.theme.ink, z: 7.2, o: 0.7 }));

    out.push(txt(kit.footer || '', W * 0.06, H * 0.9, W * 0.36, Math.max(3.2, H * 0.038),
        { font: kit.subFont, color: kit.theme.ink, z: 7.2, o: 0.66 }));

    cornerMotif(out, kit, 'tl', W, H, { s: H * 0.2, third: false });
    cornerMotif(out, kit, 'tr', W, H, { s: H * 0.18, third: false });
    cornerMotif(out, kit, 'bl', W, H, { s: H * 0.22 });
    cornerMotif(out, kit, 'br', W, H, { s: H * 0.2, third: false });
    edgeDress(W, H, kit, out, { count: 6, tone: 0.3 });
    adornAt(out, kit, W, H, cx, cy, A, { count: 12, seed: 13, radius: 0.95 });
    return { avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function tower(W, H, kit, out) {
    const A = W * 0.74;
    groundLayers(W, H, kit, out);
    const photos = photosOf(kit.id);

    head(out, kit, kit.title || 'TOWER', W * 0.08, H * 0.055, W * 0.84, Math.max(8, W * 0.14),
        { align: 'center', z: 7.4, color: kit.theme.ink, sub: kit.sub || '', subColor: kit.theme.accent });
    ruleLine(out, kit, W * 0.18, H * 0.15, W * 0.64, { o: 0.4 });

    const cx = W * 0.5;
    const cy = H * 0.4;
    portrait(out, cx - A / 2, cy - A / 2, A, A, kit.avatarShape || 'rounded', 4.0, { zoom: 1.02 });

    const railX = W * 0.085;
    for (let i = 0; i < 4; i += 1) {
        tape(out, kit, kit.tapes?.[0], railX, H * (0.2 + i * 0.16), W * 0.13, { z: 5.2, r: -6, o: 0.7 });
    }
    const decos = kit.decos || [];
    decos.slice(0, 4).forEach((id, i) => {
        stk(out, kit, id, railX, H * (0.24 + i * 0.16), W * 0.15, { z: 6.3, r: -10 + i * 8 });
    });

    label(out, kit, kit.sub || 'A LETTER', W * 0.66, H * 0.62, W * 0.28, Math.max(4, W * 0.055),
        { z: 7.2, band: false, align: 'left' });

    if (photos[0]) photoCard(out, kit, photos[0], W * 0.62, H * 0.72, W * 0.24, H * 0.12, { z: 3.4, r: 4 });
    if (photos[1]) photoCard(out, kit, photos[1], W * 0.08, H * 0.74, W * 0.22, H * 0.11, { z: 3.3, r: -5, tape: false });
    mini(out, W * 0.4, H * 0.86, W * 0.2, W * 0.2, 'circle', 4.4);

    out.push(txt(kit.footer || '', W * 0.1, H * 0.945, W * 0.8, Math.max(3.2, W * 0.038),
        { font: kit.subFont, color: kit.theme.ink, align: 'center', z: 7.2, o: 0.72 }));

    cornerMotif(out, kit, 'tr', W, H, { s: W * 0.24, third: false });
    cornerMotif(out, kit, 'bl', W, H, { s: W * 0.22, third: false });
    adornAt(out, kit, W, H, cx, cy, A, { count: 10, seed: 17, radius: 1.05 });
    return { avatarUnits: A, anchorX: 0.5, anchorY: cy / H };
}

function banner(W, H, kit, out) {
    const A = H * 0.62;
    groundLayers(W, H, kit, out);
    const photos = photosOf(kit.id);

    paperCard(out, kit, W * 0.03, H * 0.1, W * 0.26, H * 0.8, { z: 2.2, r: -2.2 });
    paperCard(out, kit, W * 0.71, H * 0.08, W * 0.26, H * 0.82, { z: 2.2, r: 2.4 });

    const cx = W * 0.5;
    portrait(out, cx - A / 2, H * 0.48 - A / 2, A, A, kit.avatarShape || 'rounded', 4.0, { zoom: 1.02 });

    if (photos[0]) photoCard(out, kit, photos[0], W * 0.07, H * 0.24, W * 0.13, H * 0.29, { z: 3.3, r: -5 });
    if (photos[1]) photoCard(out, kit, photos[1], W * 0.79, H * 0.28, W * 0.13, H * 0.29, { z: 3.3, r: 5 });

    mini(out, W * 0.28, H * 0.28, H * 0.24, H * 0.24, 'circle', 4.4);
    mini(out, W * 0.66, H * 0.66, H * 0.22, H * 0.22, 'circle', 4.4);

    head(out, kit, kit.title || 'BANNER', W * 0.3, H * 0.08, W * 0.4, Math.max(8, H * 0.11),
        { align: 'center', z: 7.4, color: kit.theme.ink, sub: kit.sub || '', subColor: kit.theme.accent });
    out.push(txt(kit.footer || '', W * 0.08, H * 0.9, W * 0.34, Math.max(3.4, H * 0.042),
        { font: kit.subFont, color: kit.theme.ink, z: 7.2, o: 0.722 }));

    cornerMotif(out, kit, 'tl', W, H, { s: H * 0.2, third: false });
    cornerMotif(out, kit, 'br', W, H, { s: H * 0.2, third: false });
    edgeDress(W, H, kit, out, { count: 7, tone: 0.3 });
    adornAt(out, kit, W, H, W * 0.5, H * 0.48, A, { count: 9, seed: 19, radius: 0.95 });
    return { avatarUnits: A, anchorX: 0.5, anchorY: 0.48 };
}

function scroll(W, H, kit, out) {
    const A = H * 0.66;
    groundLayers(W, H, kit, out, { m: 0 });

    const segs = 14;
    for (let i = 0; i < segs; i += 1) {
        const x = (W / segs) * (i + 0.5);
        tape(out, kit, kit.tapes?.[0], x, H * 0.055, W / segs * 0.9, { z: 6.2, r: -3, o: 0.62 });
        tape(out, kit, kit.tapes?.[0], x, H * 0.945, W / segs * 0.9, { z: 6.2, r: 3, o: 0.62 });
    }

    portrait(out, W * 0.5 - A / 2, H * 0.5 - A / 2, A, A, kit.avatarShape || 'circle', 4.0, { zoom: 1.02 });

    const layerStep = W * 0.105;
    [1, 2, 3, 4].forEach((n, i) => {
        const size = A * (0.5 - i * 0.08);
        [-1, 1].forEach(dir => {
            const x = W * 0.5 + dir * layerStep * n;
            if (i === 0) mini(out, x - size / 2, H * 0.5 - size / 2, size, size, 'circle', 4.4);
            if (i === 1) label(out, kit, i === 1 ? (kit.badge || '') : '', x - W * 0.04, H * 0.42, W * 0.08,
                Math.max(3.6, H * 0.055), { z: 7.2, bandId: softOf(kit), bo: 0.9 });
            if (i === 2) {
                const photos = photosOf(kit.id);
                const id = photos[dir < 0 ? 0 : 1];
                if (id) photoCard(out, kit, id, x - W * 0.045, H * 0.3, W * 0.075, H * 0.32, { z: 3.3, r: dir * 4, tape: false, border: 0.8 });
            }
            if (i === 3) {
                const decos = kit.decos || [];
                const id = decos[2 - (dir < 0 ? 0 : 1)] || decos[0];
                if (id) stk(out, kit, id, x, H * 0.5, H * 0.2, { z: 6.3, r: dir * 12 });
            }
        });
    });

    head(out, kit, kit.title || 'SCROLL', W * 0.5 - W * 0.16, H * 0.72, W * 0.32, Math.max(7, H * 0.1),
        { align: 'center', z: 7.4, color: kit.theme.ink, sub: kit.sub || '', subColor: kit.theme.accent });
    adornAt(out, kit, W, H, W * 0.5, H * 0.5, A, { count: 12, seed: 23, radius: 1.35 });
    return { avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function poster(W, H, kit, out) {
    const A = Math.min(W, H) * 0.54;
    groundLayers(W, H, kit, out);
    const photos = photosOf(kit.id);

    paperCard(out, kit, W * 0.03, H * 0.05, W * 0.34, H * 0.66, { z: 2.2, r: -2.6 });
    paperCard(out, kit, W * 0.63, H * 0.12, W * 0.34, H * 0.7, { z: 2.2, r: 2.2 });
    paperCard(out, kit, W * 0.3, H * 0.55, W * 0.42, H * 0.42, { z: 2.15, r: -1.2, o: 0.95 });

    if (photos[0]) photoCard(out, kit, photos[0], W * 0.07, H * 0.17, W * 0.12, H * 0.23, { z: 3.3, r: -5 });
    if (photos[1]) photoCard(out, kit, photos[1], W * 0.79, H * 0.64, W * 0.11, H * 0.21, { z: 3.3, r: 6 });
    if (photos[2]) photoCard(out, kit, photos[2], W * 0.31, H * 0.66, W * 0.1, H * 0.18, { z: 3.25, r: -3, tape: false });

    const cx = W * 0.5;
    const cy = H * 0.46;
    portrait(out, cx - A / 2, cy - A / 2, A, A, kit.avatarShape || 'rounded', 4.0, { zoom: 1.02 });

    head(out, kit, kit.title || 'POSTER', W * 0.34, H * 0.055, W * 0.6, Math.max(9, H * 0.13),
        { align: 'right', z: 7.4, color: kit.theme.ink, sub: kit.sub || '', subColor: kit.theme.accent });
    ruleLine(out, kit, W * 0.36, H * 0.2, W * 0.56, { o: 0.4 });

    label(out, kit, kit.badge || 'NO.01', W * 0.08, H * 0.82, W * 0.2, Math.max(4, H * 0.035),
        { z: 7.2, band: true, bandId: accOf(kit), color: onAccent(kit) });
    out.push(txt(kit.footer || '', W * 0.36, H * 0.9, W * 0.54, Math.max(3.6, H * 0.032),
        { font: kit.subFont, color: kit.theme.ink, align: 'right', z: 7.2, o: 0.72 }));

    mini(out, W * 0.62, H * 0.24, H * 0.2, H * 0.2, 'circle', 4.4);
    mini(out, W * 0.18, H * 0.56, H * 0.18, H * 0.18, 'circle', 4.4);

    cornerMotif(out, kit, 'tl', W, H, { s: H * 0.2, third: false });
    cornerMotif(out, kit, 'tr', W, H, { s: H * 0.18, third: false });
    cornerMotif(out, kit, 'bl', W, H, { s: H * 0.22 });
    cornerMotif(out, kit, 'br', W, H, { s: H * 0.2, third: false });
    edgeDress(W, H, kit, out, { count: 8, tone: 0.28 });
    adornAt(out, kit, W, H, cx, cy, A, { count: 12, seed: 29, radius: 0.98 });
    return { avatarUnits: A, anchorX: 0.5, anchorY: cy / H };
}

const BUILDERS = { chip, compact, circle, polaroid, collage, tower, banner, scroll, poster };

export function buildAtelier(W, H, kit, key) {
    const out = [];
    const build = BUILDERS[key] || BUILDERS.collage;
    const info = build(W, H, kit, out);
    return {
        elements: out,
        avatarUnits: info.avatarUnits,
        anchorX: info.anchorX == null ? 0.5 : info.anchorX,
        anchorY: info.anchorY == null ? 0.5 : info.anchorY,
    };
}
