import { F, img, txt } from '../assets/base.js';
import {
    PAL, base, wash, plate, sheet, portrait, mini, stk, paperOf, tape, label, head, rule, mark,
    frame, corners, arcPos,
} from './kit.js';

export const style = {
    id: 'y2k',
    name: '千禧辣妹',
    desc: '镭射 · 金属链 · 像素星，Y2K 贴纸炸弹',
    avatarShape: 'heart',
    layout: 'circle',
    palette: PAL(['#ffd6f1', '#e0d2ff', '#c2f1ff'], '#fffafd', '#f3cfe8', '#f4519f', '#3d1f47', '#ffe4f6', '#ffffff', true),
    decos: ['v10:y2k-cd', 'v10:y2k-heart', 'v10:y2k-pixel-star', 'v10:y2k-bow', 'v10:y2k-diamond', 'v10:y2k-lips'],
    glyphs: ['♡', '★', '✧', '♥', '✦'],
    lace: 'builtin:scallop', laceRatio: 0.62,
    tapes: ['builtin:tape-pastel'],
    font: F.sans, subFont: F.mono,
    title: 'Y2K', sub: '{{name|BABY DOLL}}', badge: '2000',
    footer: 'all for you, always online', mark: ['2000', '0520'],
};

function chip(W, H, kit) {
    const out = [];
    const A = H * 0.56;
    const cx = W * 0.5;
    const cy = H * 0.52;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.24 });
    wash(out, W, H, kit, 'v10:y2k-holo', { z: 1.0, o: 0.9 });
    wash(out, W, H, kit, 'v10:y2k-grid', { z: 1.1, o: 0.3 });
    wash(out, W, H, kit, 'v10:y2k-sparkle', { z: 1.2, o: 0.55 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'heart', 3.6, { zoom: 1.06 });

    const bw = A * 1.15;
    plate(out, kit, cx - bw / 2, H * 0.02, bw, H * 0.2, { z: 7, r: -2.4, id: 'v10:y2k-bubble', o: 0.95 });
    out.push(txt(kit.title, cx - bw / 2, H * 0.035, bw, Math.max(6, H * 0.14),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 7.6, r: -2.4 }));
    plate(out, kit, cx - bw * 0.45, H * 0.8, bw * 0.9, H * 0.18, { z: 7, r: 2, id: 'v10:y2k-burst', o: 0.9 });
    out.push(txt(kit.mark[1], cx - bw * 0.45, H * 0.815, bw * 0.9, Math.max(4, H * 0.1),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 7.6, r: 2 }));

    stk(out, kit, 'v10:y2k-chain-v', W * 0.06, H * 0.36, H * 0.52, { z: 6.2, r: 4 });
    stk(out, kit, 'v10:y2k-chain-v', W * 0.94, H * 0.36, H * 0.52, { z: 6.2, r: -4 });
    stk(out, kit, 'v10:y2k-sparkstar', W * 0.06, H * 0.66, H * 0.17, { z: 6.6, r: 12 });
    stk(out, kit, 'v10:y2k-sparkstar', W * 0.94, H * 0.66, H * 0.17, { z: 6.6, r: -12 });
    stk(out, kit, 'v10:y2k-sparkstar', W * 0.06, H * 0.12, H * 0.1, { z: 6.6, r: 20 });
    stk(out, kit, 'v10:y2k-sparkstar', W * 0.94, H * 0.12, H * 0.1, { z: 6.6, r: -20 });

    [[0.16, 0.24], [0.19, 0.62], [0.13, 0.82], [0.84, 0.3], [0.81, 0.66], [0.87, 0.86]].forEach(([x, y], i) =>
        stk(out, kit, 'v10:y2k-pixelheart', W * x, H * y, H * 0.1, { z: 6.4, r: i * 10 - 20 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function compact(W, H, kit) {
    const out = [];
    const A = H * 0.56;
    const cx = W * 0.48;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.24 });
    wash(out, W, H, kit, 'v10:y2k-grid', { z: 1.0, o: 0.65 });
    wash(out, W, H, kit, 'v10:y2k-holo', { z: 0.9, o: 0.5 });
    wash(out, W, H, kit, 'v10:y2k-sparkle', { z: 1.2, o: 0.6 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'heart', 3.8, { zoom: 1.05 });

    stk(out, kit, 'v10:y2k-cd', W * 0.1, H * 0.16, H * 0.24, { z: 6.2, r: -18 });
    stk(out, kit, 'v10:y2k-heart', W * 0.19, H * 0.09, H * 0.15, { z: 6.4, r: 12 });
    stk(out, kit, 'v10:y2k-cd', W * 0.92, H * 0.86, H * 0.22, { z: 6.2, r: 22 });
    stk(out, kit, 'v10:y2k-heart', W * 0.84, H * 0.93, H * 0.14, { z: 6.4, r: -10 });

    stk(out, kit, 'v10:y2k-pixelfly', W * 0.88, H * 0.13, H * 0.2, { z: 6.2, r: 14 });
    stk(out, kit, 'v10:y2k-lips', W * 0.96, H * 0.27, H * 0.11, { z: 6.4, r: -12 });
    stk(out, kit, 'v10:y2k-pixelfly', W * 0.1, H * 0.85, H * 0.18, { z: 6.2, r: -16 });
    stk(out, kit, 'v10:y2k-lips', W * 0.03, H * 0.72, H * 0.1, { z: 6.4, r: 10 });

    out.push(img('v10:y2k-bubble', W * 0.56, H * 0.79, W * 0.42, H * 0.18, { z: 7, r: -3, fit: 'fill' }));
    out.push(txt('omg hi!', W * 0.6, H * 0.822, W * 0.34, Math.max(4, H * 0.06),
        { font: kit.font, color: kit.theme.onLight, z: 7.6, r: -3 }));
    stk(out, kit, 'v10:y2k-lightning', W * 0.62, H * 0.7, H * 0.16, { z: 6.6, r: 118, o: 0.85 });

    [[0.27, 0.3], [0.7, 0.34], [0.32, 0.74], [0.72, 0.68]].forEach(([x, y], i) =>
        stk(out, kit, 'v10:y2k-sparkstar', W * x, H * y, H * 0.1, { z: 6.6, r: i * 14 }));

    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function circle(W, H, kit) {
    const out = [];
    const A = Math.min(W, H) * 0.56;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.22 });
    wash(out, W, H, kit, 'v10:y2k-holo', { z: 1.0, o: 0.95 });
    wash(out, W, H, kit, 'v10:y2k-sparkle', { z: 1.2, o: 0.5 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'star', 3.8, { zoom: 1.04 });

    const R = Math.min(W, H) * 0.43;
    for (let i = 0; i < 16; i += 1) {
        const p = arcPos(cx, cy, R, R, (i / 16) * 360);
        out.push(img('v10:y2k-chain', p.x - R * 0.16, p.y - R * 0.05, R * 0.32, R * 0.1,
            { z: 5.4, r: p.r + 90, fit: 'fill' }));
    }

    for (let i = 0; i < 8; i += 1) {
        const p = arcPos(cx, cy, R, R, (i / 8) * 360 + 22);
        stk(out, kit, i % 2 ? 'v10:y2k-lips' : 'v10:y2k-sparkstar', p.x, p.y, A * (i % 2 ? 0.16 : 0.2),
            { z: 6.2, r: p.r * 0.4 });
    }

    [40, 120, 200, 300].forEach((deg, i) => {
        const p = arcPos(cx, cy, Math.min(W, H) * 0.345, Math.min(W, H) * 0.345, deg);
        stk(out, kit, 'v10:y2k-diamond', p.x, p.y, A * (i % 2 ? 0.2 : 0.26), { z: 6, r: i * 18 - 20 });
    });

    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function polaroid(W, H, kit) {
    const out = [];
    const fx = W * 0.08;
    const fy = H * 0.065;
    const fw = W * 0.84;
    const fh = H * 0.7;
    const A = Math.min(fw, fh) * 0.68;
    const cx = fx + fw / 2;
    const cy = fy + fh / 2;

    base(W, H, kit, out, { paper: false, grainO: 0.24 });

    out.push(img('v10:bg-y2k', 0, 0, W, H, { z: 0.4, fit: 'fill' }));
    out.push(img(paperOf(kit), 0, 0, W, H, { z: 0.5, o: 0.86, fit: 'fill' }));

    out.push(img('v10:y2k-neonframe', fx - W * 0.02, fy - H * 0.022, fw + W * 0.04, fh + H * 0.044,
        { z: 0.7, o: 0.95, fit: 'fill' }));
    out.push(img('v10:y2k-zigzag', fx - W * 0.012, fy - H * 0.014, fw + W * 0.024, fh + H * 0.028,
        { z: 0.9, o: 0.9, fit: 'fill' }));

    out.push(img('v10:y2k-holo', fx, fy, fw, fh, { z: 1.0, fit: 'fill' }));
    out.push(img('v10:y2k-bubble', fx, fy, fw, fh, { z: 1.2, r: 0.4, o: 0.6, fit: 'fill' }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'heart', 3.8, { zoom: 1.03 });

    [[0.14, 0.88, 0.13, -14], [0.34, 0.93, 0.09, 10], [0.62, 0.9, 0.12, -6],
        [0.82, 0.93, 0.1, 16], [0.1, 0.34, 0.09, 22], [0.92, 0.42, 0.08, -18]].forEach(([x, y, s, r]) =>
        stk(out, kit, 'v10:y2k-lightning', W * x, H * y, H * s, { z: 6.4, r, o: 0.9 }));
    [[0.2, 0.85], [0.5, 0.92], [0.74, 0.86], [0.9, 0.7], [0.08, 0.62], [0.94, 0.22]].forEach(([x, y], i) =>
        stk(out, kit, 'v10:y2k-sparkstar', W * x, H * y, H * (i % 2 ? 0.09 : 0.12), { z: 6.6, r: i * 16 }));

    [[0.045, 0.05], [0.955, 0.05], [0.045, 0.95], [0.955, 0.95]].forEach(([x, y], i) =>
        stk(out, kit, 'v10:y2k-sparkstar', W * x, H * y, H * 0.17, { z: 7, r: i * 20 - 10 }));

    out.push(txt('2000', W * 0.4, H * 0.008, W * 0.2, Math.max(4, H * 0.035),
        { font: kit.subFont, color: kit.theme.onLight, align: 'center', z: 7.6 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function collage(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.24 });
    wash(out, W, H, kit, 'v10:y2k-holo', { z: 0.5, o: 0.9 });
    wash(out, W, H, kit, 'v10:y2k-grid', { z: 0.6, o: 0.35 });

    const blocks = [
        { x: 0.02, y: 0.06, w: 0.36, h: 0.5, r: -6, c: '#ffb8e6' },
        { x: 0.3, y: 0.02, w: 0.36, h: 0.44, r: 5, c: '#c9b6ff' },
        { x: 0.62, y: 0.08, w: 0.36, h: 0.52, r: -4, c: '#9fe4ff' },
        { x: 0.06, y: 0.48, w: 0.38, h: 0.46, r: 4, c: '#9fe4ff' },
        { x: 0.56, y: 0.5, w: 0.4, h: 0.44, r: -5, c: '#ffb8e6' },
    ];
    blocks.forEach((b, i) => {
        out.push(img('v10:y2k-burst', W * b.x, H * b.y, W * b.w, H * b.h,
            { z: 1.2 + i * 0.06, r: b.r, o: 0.5, fit: 'fill' }));
        out.push(img('v10:y2k-zigzag', W * b.x, H * b.y, W * b.w, H * b.h,
            { z: 1.22 + i * 0.06, r: b.r, o: 0.7, fit: 'fill' }));
    });

    const shapes = ['heart', 'star', 'heart', 'star', 'heart'];
    blocks.forEach((b, i) => {
        const s = Math.min(W * b.w, H * b.h) * 0.62;
        mini(out, W * (b.x + b.w / 2) - s / 2, H * (b.y + b.h / 2) - s / 2, s, s, shapes[i],
            3.2 + i * 0.1, { zoom: 1.08, fx: 40 + i * 10, fy: 44 + (i % 2) * 12 });
    });

    const A = H * 0.52;
    const cx = W * 0.46;
    const cy = H * 0.46;
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'heart', 4.4, { zoom: 1.04 });

    out.push(img('v10:y2k-burst', W * 0.3, H * 0.12, W * 0.24, H * 0.26, { z: 8, r: -8, o: 0.95, fit: 'fill' }));
    out.push(txt('SO', W * 0.33, H * 0.19, W * 0.18, Math.max(7, H * 0.1),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 8.4, r: -8 }));
    out.push(img('v10:y2k-burst', W * 0.66, H * 0.68, W * 0.2, H * 0.22, { z: 8, r: 10, o: 0.95, fit: 'fill' }));
    out.push(txt('CUTE', W * 0.68, H * 0.735, W * 0.16, Math.max(5, H * 0.06),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 8.4, r: 10 }));

    [[0.28, 0.36], [0.72, 0.34], [0.34, 0.62], [0.62, 0.4], [0.18, 0.72], [0.88, 0.6], [0.5, 0.9]]
        .forEach(([x, y], i) => stk(out, kit,
            ['v10:y2k-pixelheart', 'v10:y2k-cd', 'v10:y2k-pixelfly'][i % 3],
            W * x, H * y, H * (i % 3 === 0 ? 0.09 : 0.11), { z: 6.4, r: i * 18 - 20 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function tower(W, H, kit) {
    const out = [];
    const A = W * 0.62;
    const cx = W * 0.56;
    const cy = H * 0.42;

    base(W, H, kit, out, { m: 0.02, grainO: 0.22 });
    wash(out, W, H, kit, 'v10:y2k-holo', { z: 1.0, o: 0.85 });
    wash(out, W, H, kit, 'v10:y2k-grid', { z: 1.1, o: 0.3 });

    const rows = [
        { y: 0.02, h: 0.13, w: 0.62, r: -4 },
        { y: 0.16, h: 0.16, w: 0.74, r: 3 },
        { y: 0.34, h: 0.32, w: 0.82, r: -2 },
        { y: 0.68, h: 0.15, w: 0.7, r: 4 },
        { y: 0.85, h: 0.13, w: 0.6, r: -3 },
    ];
    rows.forEach((row, i) => {
        const w = W * row.w;
        out.push(img('v10:y2k-burst', W * 0.5 - w / 2 + W * 0.04, H * row.y, w, H * row.h,
            { z: 1.3 + i * 0.05, r: row.r, o: 0.55, fit: 'fill' }));
        out.push(img('v10:y2k-zigzag', W * 0.5 - w / 2 + W * 0.04, H * row.y, w, H * row.h,
            { z: 1.32 + i * 0.05, r: row.r, o: 0.6, fit: 'fill' }));
    });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'heart', 3.8, { zoom: 1.03 });

    stk(out, kit, 'v10:y2k-chain-v', W * 0.085, H * 0.5, H * 0.9, { z: 6, r: 2 });
    stk(out, kit, 'v10:y2k-mp3', W * 0.155, H * 0.13, H * 0.09, { z: 6.4, r: -10 });
    mini(out, W * 0.1, H * 0.3, W * 0.15, W * 0.15, 'circle', 6.4, { zoom: 1.1 });
    out.push(img('v10:y2k-bubble', W * 0.02, H * 0.42, W * 0.24, H * 0.07, { z: 6.6, r: -4, fit: 'fill' }));
    out.push(txt('luv u', W * 0.05, H * 0.436, W * 0.18, Math.max(3.6, H * 0.026),
        { font: kit.subFont, color: kit.theme.onLight, z: 7, r: -4 }));
    stk(out, kit, 'v10:y2k-cd', W * 0.15, H * 0.55, H * 0.08, { z: 6.4, r: 16 });
    mini(out, W * 0.09, H * 0.63, W * 0.14, W * 0.14, 'heart', 6.4, { zoom: 1.12 });
    out.push(img('v10:y2k-bubble', W * 0.02, H * 0.76, W * 0.24, H * 0.07, { z: 6.6, r: 3, fit: 'fill' }));
    out.push(txt('2000', W * 0.05, H * 0.776, W * 0.18, Math.max(3.4, H * 0.024),
        { font: kit.subFont, color: kit.theme.onLight, z: 7, r: 3 }));
    stk(out, kit, 'v10:y2k-sparkstar', W * 0.12, H * 0.9, H * 0.075, { z: 6.4, r: 12 });

    stk(out, kit, 'v10:y2k-rainbow', W * 0.88, H * 0.2, H * 0.22, { z: 6, r: 90, o: 0.9 });
    stk(out, kit, 'v10:y2k-rainbow', W * 0.88, H * 0.62, H * 0.2, { z: 6, r: 90, o: 0.9 });
    [0.12, 0.3, 0.46, 0.72, 0.88].forEach((y, i) =>
        stk(out, kit, 'v10:y2k-sparkstar', W * (0.93 - (i % 2) * 0.05), H * y, H * (i % 2 ? 0.06 : 0.08),
            { z: 6.2, r: i * 14 }));

    out.push(txt(kit.title, W * 0.2, H * 0.955, W * 0.6, Math.max(4, H * 0.024),
        { font: kit.subFont, color: kit.theme.onLight, align: 'center', z: 8 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function banner(W, H, kit) {
    const out = [];
    const A = W * 0.29;
    const cx = W * 0.5;
    const cy = H * 0.48;

    base(W, H, kit, out, { m: 0.016, grainO: 0.22 });
    wash(out, W, H, kit, 'v10:y2k-holo', { z: 1.0, o: 0.92 });
    wash(out, W, H, kit, 'v10:y2k-sparkle', { z: 1.2, o: 0.5 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'heart', 3.8, { zoom: 1.03 });

    stk(out, kit, 'v10:y2k-cd', W * 0.1, H * 0.22, H * 0.34, { z: 6, r: -20 });
    stk(out, kit, 'v10:y2k-cd', W * 0.19, H * 0.44, H * 0.24, { z: 6.2, r: 16 });
    stk(out, kit, 'v10:y2k-heart', W * 0.09, H * 0.56, H * 0.2, { z: 6.4, r: 12 });
    stk(out, kit, 'v10:y2k-heart', W * 0.2, H * 0.68, H * 0.14, { z: 6.4, r: -14 });
    stk(out, kit, 'v10:y2k-heart', W * 0.14, H * 0.8, H * 0.1, { z: 6.4, r: 20 });
    stk(out, kit, 'v10:y2k-lips', W * 0.26, H * 0.16, H * 0.1, { z: 6.4, r: -10 });

    stk(out, kit, 'v10:y2k-pixelfly', W * 0.88, H * 0.24, H * 0.26, { z: 6, r: 16 });
    stk(out, kit, 'v10:y2k-pixelfly', W * 0.79, H * 0.5, H * 0.18, { z: 6.2, r: -14 });
    out.push(img('v10:y2k-bubble', W * 0.72, H * 0.62, W * 0.24, H * 0.13, { z: 6.8, r: -3, fit: 'fill' }));
    out.push(txt('miss u', W * 0.755, H * 0.655, W * 0.18, Math.max(3.6, H * 0.03),
        { font: kit.subFont, color: kit.theme.onLight, z: 7.2, r: -3 }));
    out.push(img('v10:y2k-bubble', W * 0.74, H * 0.11, W * 0.22, H * 0.12, { z: 6.8, r: 4, fit: 'fill' }));
    out.push(txt('call me', W * 0.77, H * 0.142, W * 0.16, Math.max(3.4, H * 0.028),
        { font: kit.subFont, color: kit.theme.onLight, z: 7.2, r: 4 }));
    stk(out, kit, 'v10:y2k-diamond', W * 0.94, H * 0.44, H * 0.12, { z: 6.4, r: 10 });

    stk(out, kit, 'v10:y2k-lightning', W * 0.34, H * 0.34, H * 0.2, { z: 6.6, r: 106, o: 0.85 });
    stk(out, kit, 'v10:y2k-lightning', W * 0.66, H * 0.62, H * 0.2, { z: 6.6, r: 74, o: 0.85 });

    stk(out, kit, 'v10:y2k-rainbow', W * 0.32, H * 0.055, W * 0.3, { z: 6.4, o: 0.85 });
    stk(out, kit, 'v10:y2k-rainbow', W * 0.68, H * 0.94, W * 0.3, { z: 6.4, o: 0.85, r: 180 });
    [0.2, 0.44, 0.6, 0.82].forEach((x, i) =>
        stk(out, kit, 'v10:y2k-sparkstar', W * x, H * (i % 2 ? 0.06 : 0.93), H * 0.08, { z: 6.6, r: i * 16 }));

    head(out, kit, kit.title, W * 0.055, H * 0.14, W * 0.24, H * 0.075, { band: true, br: -2 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function scroll(W, H, kit) {
    const out = [];
    const A = H * 0.62;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.22 });
    wash(out, W, H, kit, 'v10:y2k-holo', { z: 1.0, o: 0.95 });
    wash(out, W, H, kit, 'v10:y2k-sparkle', { z: 1.2, o: 0.55 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'heart', 3.8, { zoom: 1.03 });

    out.push(img('v10:y2k-chain', 0, H * 0.44, W, H * 0.12, { z: 4.6, fit: 'fill' }));

    const N = 15;
    for (let i = 0; i < N; i += 1) {
        const t = i / (N - 1);
        const x = W * (0.06 + t * 0.88);
        if (Math.abs(x - cx) < A * 0.62) continue;
        const fall = 1 - Math.min(1, Math.abs(x - cx) / (W * 0.44)) * 0.55;
        const y = H * (0.5 + (i % 2 ? 0.2 : -0.2));
        const kind = i % 3;
        if (kind === 0) {
            stk(out, kit, 'v10:y2k-heart', x, y, H * 0.34 * fall, { z: 6.2, r: i % 2 ? 12 : -12 });
        } else if (kind === 1) {
            stk(out, kit, 'v10:y2k-sparkstar', x, y, H * 0.28 * fall, { z: 6.2, r: i * 8 });
        } else {
            const s = H * 0.2 * fall;
            mini(out, x - s / 2, y - s / 2, s, s, 'circle', 6.2, { zoom: 1.1, fx: 40 + i * 4 });
        }
    }

    for (let i = 0; i < 22; i += 1) {
        const x = W * (0.03 + i * 0.043);
        stk(out, kit, 'v10:y2k-sparkstar', x, H * (i % 2 ? 0.07 : 0.93), H * 0.11, { z: 6, o: 0.85, r: i * 11 });
    }

    out.push(txt(kit.title, cx - A * 0.8, H * 0.06, A * 1.6, Math.max(4, H * 0.04),
        { font: kit.subFont, color: kit.theme.onLight, align: 'center', z: 8 }));
    out.push(txt('always online', cx - A * 0.8, H * 0.86, A * 1.6, Math.max(3.4, H * 0.03),
        { font: kit.subFont, color: kit.theme.onLight, align: 'center', z: 8, o: 0.85 }));
    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function poster(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.24 });
    wash(out, W, H, kit, 'v10:y2k-holo', { z: 0.5, o: 0.9 });

    const blocks = [
        { x: 0.0, y: 0.0, w: 0.5, h: 0.55, r: -7 },
        { x: 0.44, y: 0.0, w: 0.56, h: 0.46, r: 6 },
        { x: 0.0, y: 0.5, w: 0.46, h: 0.5, r: 5 },
        { x: 0.5, y: 0.44, w: 0.5, h: 0.56, r: -6 },
        { x: 0.22, y: 0.2, w: 0.56, h: 0.6, r: 3 },
    ];
    blocks.forEach((b, i) => {
        out.push(img('v10:y2k-burst', W * b.x, H * b.y, W * b.w, H * b.h,
            { z: 0.8 + i * 0.06, r: b.r, o: 0.42, fit: 'fill' }));
        out.push(img('v10:y2k-zigzag', W * b.x, H * b.y, W * b.w, H * b.h,
            { z: 0.82 + i * 0.06, r: b.r, o: 0.5, fit: 'fill' }));
    });
    wash(out, W, H, kit, 'v10:y2k-sparkle', { z: 1.3, o: 0.6 });

    const A = H * 0.58;
    const cx = W * 0.5;
    const cy = H * 0.47;
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'heart', 4.2, { zoom: 1.04 });

    [['heart', 0.13, 0.2, 0.11], ['star', 0.87, 0.22, 0.1], ['star', 0.16, 0.76, 0.1], ['heart', 0.85, 0.78, 0.11]]
        .forEach(([shape, x, y, s], i) => {
            const w = H * s;
            mini(out, W * x - w / 2, H * y - w / 2, w, w, shape, 3.4, { zoom: 1.14, fx: 40 + i * 8, fy: 44 + i * 6 });
        });

    [['WOW', 0.28, 0.09, -8], ['CUTE', 0.66, 0.79, 9], ['OMG', 0.5, 0.05, 4]].forEach(([text, x, y, r]) => {
        const bw = W * 0.17;
        const bh = H * 0.18;
        out.push(img('v10:y2k-burst', W * x - bw / 2, H * y, bw, bh, { z: 8, r, o: 0.95, fit: 'fill' }));
        out.push(txt(text, W * x - bw * 0.42, H * y + bh * 0.3, bw * 0.84, Math.max(6, H * 0.065),
            { font: kit.font, color: kit.theme.onLight, align: 'center', z: 8.4, r }));
    });

    stk(out, kit, 'v10:y2k-bow', W * 0.06, H * 0.09, H * 0.16, { z: 6.2, r: -14 });
    stk(out, kit, 'v10:y2k-bow', W * 0.94, H * 0.92, H * 0.16, { z: 6.2, r: 14 });
    stk(out, kit, 'v10:y2k-cd', W * 0.06, H * 0.9, H * 0.22, { z: 6, r: -22 });
    stk(out, kit, 'v10:y2k-cd', W * 0.94, H * 0.1, H * 0.2, { z: 6, r: 18 });

    for (let i = 0; i < 16; i += 1) {
        const x = W * (0.06 + ((i * 37) % 88) / 100);
        const y = H * (0.06 + ((i * 53) % 88) / 100);
        if (Math.abs(x - cx) < A * 0.5 && Math.abs(y - cy) < A * 0.5) continue;
        stk(out, kit, i % 3 === 0 ? 'v10:y2k-lips' : 'v10:y2k-sparkstar', x, y, H * (i % 3 ? 0.055 : 0.075),
            { z: 6.4, r: i * 17, o: 0.9 });
    }

    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

export const builds = { chip, compact, circle, polaroid, collage, tower, banner, scroll, poster };
