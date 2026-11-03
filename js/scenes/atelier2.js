import { F, img, txt, box } from '../assets/base.js';
import {
    base, wash, portrait, mini, stk, tape, label, head, rule, arcPos, rng,
    onAccent, paperOf, accOf, softOf, shadowOf, inkOf,
} from './kit.js';

const PAPER_TEX = {
    school: 'v10:school-grid', hk: 'v10:hk-news', y2k: 'v10:y2k-grid', french: 'v10:fr-linen',
    mecha: 'v10:mt-canvas', fairy: 'v10:fy-paper', letter: 'v10:lt-lines', stamp: 'v10:sp-perftex',
    gothic: 'v10:gt-wallpaper', sweetcool: 'v10:sc-vellum',
};

const WASH = {
    school: [['v10:school-grid', 0.22], ['v10:school-vellum', 0.2]],
    hk: [['v10:hk-news', 0.3], ['v10:hk-grain', 0.22]],
    y2k: [['v10:y2k-holo', 0.34], ['v10:y2k-grid', 0.18]],
    french: [['v10:fr-floral', 0.26], ['v10:fr-tulle', 0.2]],
    mecha: [['v10:mt-steel', 0.3], ['v10:mt-circuit', 0.18]],
    fairy: [['v10:fy-watercolor', 0.3], ['v10:fy-paper', 0.2]],
    letter: [['v10:lt-lines', 0.2], ['v10:lt-watermark', 0.26]],
    stamp: [['v10:sp-perftex', 0.22]],
    gothic: [['v10:gt-velvet', 0.38], ['v10:gt-wallpaper', 0.22]],
    sweetcool: [['v10:sc-floral', 0.26], ['v10:sc-vellum', 0.22]],
};

const subOf = kit => String(kit.sub || '').replace(/\{\{[^|]+\|([^}]+)\}\}/g, '$1');
const markOf = kit => (kit.mark || [])[1] || (kit.mark || [])[0] || '';

function ground(W, H, kit, out) {
    base(W, H, kit, out, { m: 0, grainO: 0.24 });
    (WASH[kit.id] || []).forEach(([id, o], i) => {
        out.push(img(id, 0, 0, W, H, { z: 1 + i * 0.1, o: Math.max(o, 0.2), fit: 'cover' }));
    });
}

function scrap(out, kit, pool, index, cx, cy, w, h, rot, z) {
    const id = pool.length ? pool[index % pool.length] : null;
    const x = cx - w / 2;
    const y = cy - h / 2;
    out.push(img(shadowOf(kit), x + w * 0.015, y + h * 0.02, w * 1.02, h * 1.03,
        { z: z - 0.12, r: rot, o: 0.4, fit: 'fill' }));
    if (id) {
        out.push(img(id, x, y, w, h, { z, r: rot, o: 0.98, fit: 'contain' }));
    } else {
        out.push(img(paperOf(kit), x, y, w, h, { z, r: rot, o: 0.98, fit: 'fill' }));
        const tex = PAPER_TEX[kit.id];
        if (tex) out.push(img(tex, x, y, w, h, { z: z + 0.02, r: rot, o: 0.42, fit: 'cover' }));
    }
}

function hero(out, kit, pool, cx, cy, size, shape, z, o = {}) {
    const w = o.w || size;
    const h = o.h || size;
    out.push(img(shadowOf(kit), cx - w * 0.5 + w * 0.02, cy - h * 0.5 + h * 0.03, w, h,
        { z: z - 0.1, o: 0.34, fit: 'fill' }));
    portrait(out, cx - w / 2, cy - h / 2, w, h, shape || kit.avatarShape || 'circle', z, { zoom: 1.02 });

    const frames = pool || [];
    if (!frames.length) return;
    const id = frames[(o.frameIndex || 0) % frames.length];
    const b = box(id, 1);
    const af = b.w / b.h;

    const fw = Math.max(w, h) / 0.82;
    const fh = fw / af;
    out.push(img(id, cx - fw / 2, cy - fh / 2, fw, fh,
        { z: 7.02, r: o.r || 0, o: 0.98, fit: 'contain' }));
}

function minis(out, kit, pool, list, z) {
    list.forEach(([x, y, size], i) => {
        out.push(img(shadowOf(kit), x - size * 0.46, y - size * 0.46, size * 0.98, size * 0.98,
            { z: z - 0.1, o: 0.3, fit: 'fill' }));
        mini(out, x - size / 2, y - size / 2, size, size, 'circle', z + i * 0.02, { zoom: 1.12 });
    });
}

function sprinkle(out, kit, props, blockers, rect, count, size, seed, z) {
    const rand = rng(seed);
    let placed = 0;
    for (let i = 0; i < count * 4 && placed < count; i += 1) {
        const id = props.length ? props[(i * 5 + seed) % props.length] : null;
        if (!id) break;
        const s = size * (0.75 + rand() * 0.5);
        const b = box(id, s);
        const cx = rect.x + rect.w * (0.12 + rand() * 0.76);
        const cy = rect.y + rect.h * (0.14 + rand() * 0.72);
        const r = { x: cx - b.w / 2, y: cy - b.h / 2, w: b.w, h: b.h };
        if (r.x < -rect.w * 0.1 || r.y < -rect.h * 0.1) continue;
        if (blockers.some(bl => overlap(r, bl) > b.w * b.h * 0.05)) continue;
        out.push(img(id, r.x, r.y, r.w, r.h, {
            z: z + placed * 0.01, r: -20 + rand() * 40, o: 0.95, fit: 'contain',
        }));
        placed += 1;
    }
}

function overlap(a, b) {
    const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    return w > 0 && h > 0 ? w * h : 0;
}

function doodles(out, kit, W, H, seed, count) {
    const rand = rng(seed);
    const glyphs = kit.glyphs && kit.glyphs.length ? kit.glyphs : ['✦', '♡', '✧'];
    for (let i = 0; i < count; i += 1) {
        const ch = glyphs[i % glyphs.length];
        out.push({
            ...img(inkOf(kit), 0, 0, 0, 0, { z: 6.5 }),
            type: 'sticker', assetId: null, text: ch,
            x: W * (0.05 + rand() * 0.9), y: H * (0.05 + rand() * 0.9),
            width: H * 0.06, height: H * 0.06,
            rotation: -20 + rand() * 40, z: 6.5, opacity: 0.45,
            fontSize: H * 0.05, color: kit.theme.accent, fontFamily: F.sans,
        });
    }
}

const SPEC = {
    chip: {
        hero: [0.5, 0.5, 0.56], shape: 'circle',
        scraps: [[0.2, 0.5, 0.3, 0.9, -3], [0.8, 0.5, 0.3, 0.9, 3]],
        clusters: [[0.07, 0.2, 0.14, 0.6, 3], [0.9, 0.2, 0.14, 0.6, 3]],
        minis: [],
        title: [0.5, 0.05, 0.42, 'center', 'sub'],
        labels: [[0.5, 0.88, 0.3, 'mark']],
        sizeK: 0.3,
    },
    compact: {
        hero: [0.64, 0.56, 0.46],
        scraps: [[0.3, 0.3, 0.5, 0.5, -4], [0.72, 0.6, 0.44, 0.5, 3]],
        clusters: [[0.14, 0.14, 0.24, 0.22, 3], [0.88, 0.14, 0.2, 0.24, 2], [0.14, 0.86, 0.26, 0.22, 3], [0.88, 0.88, 0.22, 0.2, 2]],
        minis: [[0.16, 0.42, 0.2]],
        title: [0.3, 0.04, 0.52, 'left', 'title'],
        labels: [[0.16, 0.9, 0.3, 'mark']],
        sizeK: 0.2,
    },
    circle: {
        hero: [0.5, 0.5, 0.6], shape: 'circle',
        scraps: [[0.5, 0.5, 0.96, 0.96, 0]],
        clusters: [[0.5, 0.06, 0.2, 0.1, 2], [0.94, 0.5, 0.1, 0.2, 2], [0.5, 0.94, 0.2, 0.1, 2], [0.06, 0.5, 0.1, 0.2, 2]],
        minis: [[0.2, 0.24, 0.12]],
        title: [0.5, 0.03, 0.5, 'center', 'title'],
        labels: [],
        sizeK: 0.14,
        ring: true,
    },
    polaroid: {
        hero: [0.5, 0.44, 0.62],
        scraps: [[0.5, 0.46, 0.9, 0.86, -2]],
        clusters: [[0.14, 0.1, 0.22, 0.14, 2], [0.86, 0.1, 0.22, 0.14, 2], [0.14, 0.9, 0.22, 0.14, 2], [0.86, 0.9, 0.22, 0.14, 2]],
        minis: [[0.16, 0.7, 0.16]],
        title: [0.5, 0.02, 0.6, 'center', 'title'],
        labels: [[0.5, 0.9, 0.4, 'mark']],
        sizeK: 0.14,
        frameCard: true,
    },
    collage: {
        hero: [0.46, 0.52, 0.5],
        scraps: [
            [0.16, 0.3, 0.32, 0.56, -6], [0.4, 0.24, 0.3, 0.5, 4],
            [0.66, 0.3, 0.32, 0.56, -3], [0.84, 0.72, 0.3, 0.5, 6],
            [0.24, 0.78, 0.32, 0.46, -4],
        ],
        clusters: [[0.1, 0.1, 0.2, 0.2, 4], [0.9, 0.1, 0.2, 0.2, 3], [0.1, 0.9, 0.22, 0.2, 4], [0.9, 0.88, 0.22, 0.22, 4]],
        minis: [[0.12, 0.46, 0.15], [0.88, 0.46, 0.13]],
        title: [0.7, 0.05, 0.5, 'right', 'title'],
        labels: [[0.14, 0.9, 0.28, 'mark'], [0.72, 0.74, 0.24, 'sub']],
        sizeK: 0.15,
    },
    tower: {
        hero: [0.5, 0.4, 0.68],
        scraps: [[0.5, 0.12, 0.9, 0.2, -2], [0.5, 0.44, 0.94, 0.44, 1.4], [0.5, 0.82, 0.92, 0.3, -3]],
        clusters: [[0.09, 0.2, 0.14, 0.18, 2], [0.09, 0.44, 0.14, 0.18, 2], [0.09, 0.68, 0.14, 0.18, 2], [0.91, 0.22, 0.14, 0.18, 2], [0.91, 0.5, 0.14, 0.18, 2], [0.91, 0.78, 0.14, 0.18, 2]],
        minis: [[0.28, 0.74, 0.2]],
        title: [0.5, 0.04, 0.8, 'center', 'title'],
        labels: [[0.5, 0.94, 0.5, 'sub']],
        sizeK: 0.14,
    },
    banner: {
        hero: [0.5, 0.5, 0.62],
        scraps: [[0.17, 0.5, 0.3, 0.82, -3], [0.5, 0.5, 0.32, 0.86, 1.6], [0.83, 0.5, 0.3, 0.82, 3]],
        clusters: [[0.06, 0.12, 0.12, 0.2, 2], [0.94, 0.12, 0.12, 0.2, 2], [0.06, 0.88, 0.12, 0.2, 2], [0.94, 0.88, 0.12, 0.2, 2], [0.24, 0.9, 0.14, 0.16, 2], [0.76, 0.9, 0.14, 0.16, 2]],
        minis: [[0.24, 0.3, 0.22], [0.76, 0.7, 0.2]],
        title: [0.5, 0.06, 0.44, 'center', 'title'],
        labels: [[0.17, 0.88, 0.24, 'mark']],
        sizeK: 0.13,
    },
    scroll: {
        hero: [0.5, 0.48, 0.68], shape: 'circle',
        scraps: [[0.2, 0.5, 0.24, 0.8, -2], [0.8, 0.5, 0.24, 0.8, 2], [0.5, 0.5, 0.3, 0.9, 1]],
        clusters: [[0.06, 0.2, 0.1, 0.6, 3], [0.94, 0.2, 0.1, 0.6, 3], [0.2, 0.16, 0.12, 0.2, 2], [0.8, 0.84, 0.12, 0.2, 2]],
        minis: [[0.26, 0.5, 0.34], [0.74, 0.5, 0.3]],
        title: [0.5, 0.06, 0.4, 'center', 'title'],
        labels: [[0.5, 0.86, 0.3, 'sub']],
        sizeK: 0.16,
    },
    poster: {
        hero: [0.5, 0.46, 0.52],
        scraps: [
            [0.18, 0.3, 0.32, 0.56, -4], [0.5, 0.2, 0.34, 0.36, 3],
            [0.82, 0.3, 0.32, 0.56, -3], [0.2, 0.78, 0.34, 0.42, 4],
            [0.5, 0.78, 0.34, 0.42, -2], [0.82, 0.78, 0.3, 0.42, 5],
        ],
        clusters: [[0.08, 0.1, 0.18, 0.18, 4], [0.92, 0.1, 0.18, 0.18, 4], [0.08, 0.9, 0.18, 0.18, 4], [0.92, 0.9, 0.18, 0.18, 4]],
        minis: [[0.2, 0.44, 0.16], [0.8, 0.44, 0.16], [0.66, 0.16, 0.13]],
        title: [0.7, 0.06, 0.52, 'right', 'title'],
        labels: [[0.14, 0.9, 0.26, 'mark'], [0.72, 0.92, 0.3, 'sub']],
        sizeK: 0.14,
    },
};

export function compose(W, H, kit, key) {
    const spec = SPEC[key] || SPEC.collage;
    const out = [];
    const packs = kit.packs || { frames: [], props: [], scraps: [] };
    const u = Math.min(W, H);

    ground(W, H, kit, out);

    spec.scraps.forEach(([cx, cy, w, h, rot], i) => {
        scrap(out, kit, packs.scraps, i, cx * W, cy * H, w * W, h * H, rot, 2 + i * 0.08);
    });

    const [hx, hy, hs] = spec.hero;
    const heroSize = hs * (key === 'tower' ? W : u);
    const heroW = key === 'chip' || key === 'scroll' || key === 'banner' ? hs * H : heroSize;
    hero(out, kit, packs.frames, hx * W, hy * H, heroW, spec.shape, 4.0, { frameIndex: 0 });

    minis(out, kit, packs.props, spec.minis.map(([x, y, s]) => [x * W, y * H, s * (key === 'scroll' || key === 'banner' ? H : W)]), 3.7);

    const [tx, ty, tw, align, which] = spec.title;
    const titleText = which === 'sub' ? subOf(kit) : (kit.title || 'COLLAGE');
    head(out, kit, titleText, tx * W - tw * W / 2, ty * H, tw * W, Math.max(6, H * 0.09),
        { align, z: 7.4, color: kit.theme.ink, sub: which === 'title' ? (kit.badge || '') : '', subColor: kit.theme.accent });
    rule(out, kit, tx * W - tw * W / 2, ty * H + H * 0.125, tw * W, 0.8, { o: 0.3, z: 7.3 });

    spec.labels.forEach(([lx, ly, lw, which]) => {
        label(out, kit, which === 'mark' ? markOf(kit) : subOf(kit), lx * W - lw * W / 2, ly * H, lw * W,
            Math.max(3.6, H * 0.036), { z: 7.3, band: true, bandId: softOf(kit), color: kit.theme.ink, bo: 0.92 });
    });

    const blockers = out.filter(el => el.assetId === '__avatar__' || el.type === 'text')
        .map(el => ({ x: el.x, y: el.y, w: el.width, h: el.height }));
    spec.clusters.forEach(([cx, cy, cw, ch, n], i) => {
        sprinkle(out, kit, packs.props, blockers,
            { x: (cx - cw / 2) * W, y: (cy - ch / 2) * H, w: cw * W, h: ch * H },
            n, u * spec.sizeK, 31 + i * 7 + key.length, 6.6);
    });

    if (kit.tapes?.length) {
        tape(out, kit, kit.tapes[0], W * 0.16, H * 0.04, Math.min(W * 0.18, u * 0.3), { z: 7.6, r: -8, o: 0.8 });
        tape(out, kit, kit.tapes[0], W * 0.84, H * 0.96, Math.min(W * 0.18, u * 0.3), { z: 7.6, r: 6, o: 0.8 });
    }
    doodles(out, kit, W, H, key.length * 13, key === 'poster' ? 6 : 4);

    return {
        elements: out,
        avatarUnits: heroW,
        anchorX: hx,
        anchorY: hy,
    };
}
