import { F, img, txt } from '../assets/base.js';
import {
    PAL, base, wash, sheet, portrait, mini, stk, paperOf, tape, label, head, rule, mark,
    frame, corners, arcPos,
} from './kit.js';

export const style = {
    id: 'french',
    name: '法式蕾丝',
    desc: '碎花 · 珍珠链 · 雏菊，庄园薄纱手作',
    avatarShape: 'flower',
    layout: 'polaroid',
    palette: PAL(['#f7dedd', '#fbece6', '#e6dcec'], '#fffbf8', '#c9a2a8', '#b86a7d', '#4a3532', '#f6e3e2', '#ffffff', true),
    decos: ['v10:fr-daisy', 'v10:fr-lily', 'v10:fr-vine', 'v10:fr-rose', 'v10:fr-shell', 'v10:fr-bow'],
    glyphs: ['❀', '✿', '♡', '✧', '❁'],
    lace: 'builtin:doily', laceRatio: 0.64,
    tapes: ['builtin:tape-pastel', 'builtin:washi'],
    font: F.serif, subFont: F.mono,
    title: 'LACE', sub: '{{birthday|MA CHÉRIE}}', badge: 'No.4',
    footer: 'a little love, a little lace', mark: ['0924', '0318'],
};

function wreath(out, kit, cx, cy, r, count, size, seed) {
    for (let i = 0; i < count; i += 1) {
        const p = arcPos(cx, cy, r, r, (i / count) * 360 + (seed || 0));
        stk(out, kit, i % 4 === 3 ? 'v10:fr-lily' : 'v10:fr-daisy', p.x, p.y,
            size * (i % 3 === 0 ? 1.15 : 0.9), { z: 5.4 + (i % 3) * 0.05, r: p.r * 0.5 });
    }
}

function chip(W, H, kit) {
    const out = [];
    const A = H * 0.56;
    const cx = W * 0.5;
    const cy = H * 0.52;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.22 });
    wash(out, W, H, kit, 'v10:fr-floral', { z: 1.0, o: 0.55 });
    wash(out, W, H, kit, 'v10:fr-tulle', { z: 1.1, o: 0.4 });

    stk(out, kit, 'v10:fr-ribbon', cx, H * 0.16, W * 0.62, { z: 2.2, r: -2, o: 0.95 });
    stk(out, kit, 'v10:fr-ribbon', cx, H * 0.85, W * 0.66, { z: 2.2, r: 2, o: 0.95 });

    stk(out, kit, 'v10:fr-oval', cx, cy, A * 1.22, { z: 2.8, o: 0.95 });
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'oval', 3.6, { zoom: 1.05 });

    [0.16, 0.26, 0.74, 0.84].forEach((x, i) =>
        stk(out, kit, 'v10:fr-pearl-chain', W * x, H * (i < 2 ? 0.15 : 0.86), W * 0.1, { z: 6.2, r: i % 2 ? 6 : -6 }));
    stk(out, kit, 'v10:fr-daisy', W * 0.24, H * 0.14, H * 0.13, { z: 6.4, r: 12 });
    stk(out, kit, 'v10:fr-daisy', W * 0.77, H * 0.87, H * 0.12, { z: 6.4, r: -14 });

    stk(out, kit, 'v10:fr-pendant', W * 0.035, H * 0.5, H * 0.4, { z: 6.4, r: -6 });
    stk(out, kit, 'v10:fr-pendant', W * 0.965, H * 0.5, H * 0.4, { z: 6.4, r: 6 });

    [[0.12, 0.44], [0.2, 0.7], [0.82, 0.3], [0.88, 0.62], [0.3, 0.42], [0.7, 0.55]].forEach(([x, y], i) =>
        stk(out, kit, 'v10:fr-sparkle', W * x, H * y, H * 0.11, { z: 6.6, r: i * 14 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function compact(W, H, kit) {
    const out = [];
    const A = H * 0.44;
    const cx = W * 0.47;
    const cy = H * 0.46;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.2 });
    wash(out, W, H, kit, 'v10:fr-linen', { z: 1.0, o: 0.5 });
    wash(out, W, H, kit, 'v10:fr-tulle', { z: 1.1, o: 0.35 });

    stk(out, kit, 'v10:fr-ribbon', W * 0.5, H * 0.52, W * 1.2, { z: 2.2, r: 33, o: 0.78 });
    stk(out, kit, 'v10:fr-ribbon', W * 0.64, H * 0.64, W * 0.62, { z: 2.25, r: 33, o: 0.5 });

    stk(out, kit, 'v10:fr-oval', cx, cy, A * 1.72, { z: 2.7, o: 0.96 });
    stk(out, kit, 'v10:fr-pearlframe', cx, cy, A * 1.52, { z: 3.0, o: 0.95 });
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'oval', 3.6, { zoom: 1.04 });

    [[0.84, 0.12, 26], [0.62, 0.3, 14], [0.23, 0.8, -24]].forEach(([x, y, r], i) =>
        stk(out, kit, 'v10:fr-bow', W * x, H * y, H * (0.15 - i * 0.014), { z: 6.2, r }));

    stk(out, kit, 'v10:fr-rose', W * 0.87, H * 0.84, H * 0.25, { z: 6.4, r: 10 });
    out.push(txt('ma chérie', W * 0.62, H * 0.9, W * 0.3, Math.max(3.4, H * 0.046),
        { font: kit.font, color: kit.theme.accent, align: 'center', z: 7.4, r: -9 }));

    stk(out, kit, 'v10:fr-lily', W * 0.055, H * 0.74, H * 0.28, { z: 6.2, r: -14 });
    stk(out, kit, 'v10:fr-lily', W * 0.05, H * 0.3, H * 0.22, { z: 6.2, r: 16 });
    [[0.09, 0.12], [0.06, 0.44], [0.11, 0.52], [0.07, 0.94]].forEach(([x, y], i) =>
        stk(out, kit, 'v10:fr-pendant', W * x, H * y, H * 0.17, { z: 6.5, r: i * 24 - 18 }));

    stk(out, kit, 'v10:fr-lace', W * 0.5, H * 0.045, W * 0.4, { z: 5.6, o: 0.7, r: -2 });
    stk(out, kit, 'v10:fr-lace', W * 0.28, H * 0.968, W * 0.34, { z: 5.6, o: 0.7, r: 1 });

    stk(out, kit, 'v10:fr-daisy', W * 0.94, H * 0.32, H * 0.11, { z: 6.6, r: 8 });
    stk(out, kit, 'v10:fr-sparkle', W * 0.74, H * 0.1, H * 0.16, { z: 6.6, o: 0.7 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function circle(W, H, kit) {
    const out = [];
    const A = Math.min(W, H) * 0.46;
    const cx = W * 0.5;
    const cy = H * 0.5;
    const R = Math.min(W, H) * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.2 });
    wash(out, W, H, kit, 'v10:fr-floral', { z: 1.0, o: 0.55 });
    wash(out, W, H, kit, 'v10:fr-tulle', { z: 1.05, o: 0.3 });

    stk(out, kit, 'v10:fr-lace-ring', cx, cy, Math.min(W, H) * 1.02, { z: 2.4, o: 0.98 });

    stk(out, kit, 'v10:fr-pearlframe', cx, cy, A * 1.34, { z: 2.9, o: 0.92 });
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'oval', 3.6, { zoom: 1.03 });

    for (let i = 0; i < 12; i += 1) {
        const p = arcPos(cx, cy, R * 0.79, R * 0.79, (i / 12) * 360 + 15);
        if (i % 3 === 0) {
            stk(out, kit, 'v10:fr-pearl-chain', p.x, p.y, A * 0.3, { z: 6, r: p.r + 90, o: 0.95 });
        } else {
            stk(out, kit, i % 3 === 1 ? 'v10:fr-lily' : 'v10:fr-daisy', p.x, p.y,
                A * (i % 3 === 1 ? 0.3 : 0.19), { z: 6, r: p.r * 0.6 });
        }
    }

    for (let i = 0; i < 10; i += 1) {
        const p = arcPos(cx, cy, R * 0.67, R * 0.67, (i / 10) * 360 + 30);
        stk(out, kit, 'v10:fr-pendant', p.x, p.y, A * 0.15, { z: 5.8, r: p.r * 0.4 });
    }
    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function polaroid(W, H, kit) {
    const out = [];
    const fx = W * 0.115;
    const fy = H * 0.1;
    const fw = W * 0.77;
    const fh = H * 0.64;
    const A = Math.min(fw, fh) * 0.66;
    const cx = fx + fw / 2;
    const cy = fy + fh / 2;

    base(W, H, kit, out, { paper: false, grainO: 0.2 });

    out.push(img('v10:bg-french', 0, 0, W, H, { z: 0.5, fit: 'fill' }));
    out.push(img(paperOf(kit), 0, 0, W, H, { z: 0.6, o: 0.9, fit: 'fill' }));

    out.push(img('v10:fr-lace', W * 0.03, H * 0.028, W * 0.94, H * 0.075, { z: 1.0, r: 0.6, fit: 'fill' }));
    out.push(img('v10:fr-lace', W * 0.03, H * 0.9, W * 0.94, H * 0.075, { z: 1.0, r: -0.6, fit: 'fill' }));
    out.push(img('v10:fr-lace-v', W * 0.03, H * 0.03, W * 0.062, H * 0.94, { z: 1.0, fit: 'fill' }));
    out.push(img('v10:fr-lace-v', W * 0.908, H * 0.03, W * 0.062, H * 0.94, { z: 1.0, fit: 'fill' }));

    out.push(img('v10:fr-floral', fx, fy, fw, fh, { z: 1.2, r: 0.4, fit: 'fill' }));
    wash(out, W, H, kit, 'v10:fr-tulle', { z: 1.3, o: 0.3 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'oval', 3.6, { zoom: 1.02 });

    for (let i = 0; i < 22; i += 1) {
        const deg = (i / 22) * 360;
        if (deg > 40 && deg < 78) continue;
        const p = arcPos(cx, cy, W * 0.415, H * 0.425, deg);
        stk(out, kit, 'v10:fr-pendant', p.x, p.y, H * 0.12, { z: 6.2, r: p.r * 0.3, o: 0.98 });
    }

    [20, 110, 200, 290].forEach((deg, i) => {
        const p = arcPos(cx, cy, W * 0.44, H * 0.44, deg);
        stk(out, kit, i % 2 ? 'v10:fr-daisy' : 'v10:fr-lily', p.x, p.y, H * 0.17, { z: 6.8, r: deg });
    });

    out.push(txt(kit.mark[0], W * 0.36, H * 0.005, W * 0.28, Math.max(3.6, H * 0.03),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 7.4 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function collage(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.2 });
    wash(out, W, H, kit, 'v10:fr-floral', { z: 0.6, o: 0.55 });
    wash(out, W, H, kit, 'v10:fr-tulle', { z: 0.7, o: 0.4 });

    const ribbons = [
        { x: 0.5, y: 0.5, w: 1.02, r: 26, o: 0.95 },
        { x: 0.5, y: 0.52, w: 0.98, r: -24, o: 0.9 },
        { x: 0.3, y: 0.34, w: 0.6, r: 26, o: 0.75 },
        { x: 0.72, y: 0.68, w: 0.58, r: -24, o: 0.75 },
    ];
    ribbons.forEach(item =>
        stk(out, kit, 'v10:fr-ribbon', W * item.x, H * item.y, W * item.w, { z: 1.6, r: item.r, o: item.o }));

    const A = H * 0.5;
    const cx = W * 0.5;
    const cy = H * 0.5;
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'oval', 3.8, { zoom: 1.03 });

    [[0.16, 0.22, 12], [0.84, 0.2, -12], [0.14, 0.8, -10], [0.86, 0.82, 10]].forEach(([x, y, r], i) => {
        const s = H * 0.2;
        stk(out, kit, 'v10:fr-oval', W * x, H * y, s * 1.2, { z: 3.4, o: 0.95, r });
        mini(out, W * x - s / 2, H * y - s / 2, s, s, 'oval', 3.6, { zoom: 1.12, fx: 40 + i * 8, fy: 44 });
        stk(out, kit, i % 2 ? 'v10:fr-daisy' : 'v10:fr-rose', W * (x + 0.07), H * (y + 0.09), H * 0.13,
            { z: 6.4, r: r * 2 });
    });

    stk(out, kit, 'v10:fr-vine', W * 0.3, H * 0.24, H * 0.3, { z: 6, r: 42 });
    stk(out, kit, 'v10:fr-vine', W * 0.7, H * 0.26, H * 0.3, { z: 6, r: -42 });
    stk(out, kit, 'v10:fr-vine', W * 0.3, H * 0.76, H * 0.28, { z: 6, r: -42 });
    stk(out, kit, 'v10:fr-vine', W * 0.7, H * 0.74, H * 0.28, { z: 6, r: 42 });

    for (let i = 0; i < 14; i += 1) {
        const x = W * (0.08 + ((i * 41) % 84) / 100);
        const y = H * (0.08 + ((i * 59) % 84) / 100);
        stk(out, kit, 'v10:fr-pearl-chain', x, y, H * 0.08, { z: 6.6, r: i * 23, o: 0.9 });
    }
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function tower(W, H, kit) {
    const out = [];
    const A = W * 0.6;
    const cx = W * 0.5;
    const cy = H * 0.44;

    base(W, H, kit, out, { m: 0.02, grainO: 0.2 });
    wash(out, W, H, kit, 'v10:fr-floral', { z: 1.0, o: 0.5 });
    wash(out, W, H, kit, 'v10:fr-tulle', { z: 1.1, o: 0.35 });

    const stalks = [
        { x: 0.24, h: 0.92, r: 6, s: 1 },
        { x: 0.76, h: 0.9, r: -6, s: 1 },
        { x: 0.4, h: 0.62, r: 12, s: 0.72 },
        { x: 0.62, h: 0.58, r: -12, s: 0.7 },
    ];
    stalks.forEach(item => {
        const h = H * item.h * item.s;
        stk(out, kit, 'v10:fr-vine', W * item.x, H * 0.98 - h / 2, h, { z: 2.2, r: item.r + 180, o: 0.95 });
    });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'oval', 3.6, { zoom: 1.03 });

    ['ma chérie', 'a little love', 'soft as lace'].forEach((line, i) => {
        out.push(txt(line, W * (i % 2 ? 0.66 : 0.1), H * (0.2 + i * 0.28), W * 0.26,
            Math.max(3.6, H * 0.02), { font: kit.font, color: kit.theme.accent, z: 7, r: i % 2 ? 84 : -84 }));
    });

    [0.1, 0.22, 0.34, 0.58, 0.7, 0.82, 0.93].forEach((y, i) =>
        stk(out, kit, i % 3 === 0 ? 'v10:fr-pendant' : 'v10:fr-daisy', W * (i % 2 ? 0.83 : 0.17), H * y,
            H * (i % 3 === 0 ? 0.055 : 0.05), { z: 6.2, r: i * 16 - 20 }));

    for (let i = 0; i < 10; i += 1) {
        const y = H * (0.08 + i * 0.095);
        stk(out, kit, 'v10:fr-lily', W * (i % 2 ? 0.055 : 0.945), y, H * 0.06, { z: 6, r: i * 14 });
    }

    rule(out, kit, W * 0.2, H * 0.965, W * 0.6, H * 0.003, { o: 0.3 });
    out.push(txt(kit.footer, W * 0.1, H * 0.973, W * 0.8, Math.max(3.2, H * 0.012),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8, o: 0.85 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function banner(W, H, kit) {
    const out = [];
    const A = W * 0.29;
    const cx = W * 0.5;
    const cy = H * 0.48;

    base(W, H, kit, out, { m: 0.016, grainO: 0.2 });
    wash(out, W, H, kit, 'v10:fr-linen', { z: 1.0, o: 0.55 });
    wash(out, W, H, kit, 'v10:fr-tulle', { z: 1.1, o: 0.4 });

    stk(out, kit, 'v10:fr-ribbon', W * 0.26, H * 0.42, W * 0.58, { z: 1.8, r: -16, o: 0.95 });
    stk(out, kit, 'v10:fr-ribbon', W * 0.74, H * 0.58, W * 0.58, { z: 1.8, r: -16, o: 0.95 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'oval', 3.8, { zoom: 1.03 });

    [[0.1, 0.36], [0.2, 0.31], [0.32, 0.27], [0.9, 0.64], [0.8, 0.69], [0.68, 0.73]].forEach(([x, y], i) =>
        stk(out, kit, i % 2 ? 'v10:fr-shell' : 'v10:fr-bow', W * x, H * y, H * 0.2, { z: 6.2, r: i * 12 - 20 }));

    [0.14, 0.3, 0.46, 0.62, 0.78, 0.92].forEach((x, i) => {
        stk(out, kit, i % 2 ? 'v10:fr-pearl-chain' : 'v10:fr-daisy', W * x, H * (i % 2 ? 0.09 : 0.92),
            H * (i % 2 ? 0.17 : 0.18), { z: 6.4, r: i * 10 - 20 });
        stk(out, kit, i % 2 ? 'v10:fr-daisy' : 'v10:fr-pearl-chain', W * x, H * (i % 2 ? 0.91 : 0.11),
            H * (i % 2 ? 0.18 : 0.17), { z: 6.4, r: 20 - i * 10 });
    });

    head(out, kit, kit.title, W * 0.06, H * 0.78, W * 0.24, H * 0.07, { align: 'center' });
    out.push(txt(kit.sub, W * 0.06, H * 0.87, W * 0.24, Math.max(3.4, H * 0.026),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function scroll(W, H, kit) {
    const out = [];
    const A = H * 0.6;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.2 });
    wash(out, W, H, kit, 'v10:fr-floral', { z: 1.0, o: 0.45 });

    out.push(img('v10:fr-lace', 0, H * 0.3, W, H * 0.2, { z: 1.8, fit: 'fill' }));
    out.push(img('v10:fr-pearl-chain', 0, H * 0.49, W, H * 0.05, { z: 2.2, fit: 'fill' }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'oval', 3.8, { zoom: 1.03 });

    const spots = [0.11, 0.21, 0.31, 0.41, 0.59, 0.69, 0.79, 0.89];
    spots.forEach((t, i) => {
        const x = W * t;
        const fall = 1 - Math.abs(t - 0.5) * 1.1;
        const size = H * (0.14 + fall * 0.13);
        if (i % 2 === 0) {
            const s = size;
            stk(out, kit, 'v10:fr-oval', x, H * 0.5, s * 1.16, { z: 3.2, o: 0.95 });
            mini(out, x - s / 2, H * 0.5 - s / 2, s, s, 'oval', 3.4, { zoom: 1.1, fx: 40 + i * 6 });
        } else {
            stk(out, kit, 'v10:fr-daisy', x, H * (i % 4 === 1 ? 0.34 : 0.66), size * 1.2, { z: 6.2, r: i * 18 });
        }
    });

    for (let i = 0; i < 16; i += 1) {
        const x = W * (0.03 + i * 0.062);
        stk(out, kit, 'v10:fr-pearl-chain', x, H * (i % 2 ? 0.31 : 0.69), H * 0.07, { z: 6, r: i * 9 });
    }

    for (let i = 0; i < 18; i += 1) {
        const x = W * (0.04 + i * 0.053);
        stk(out, kit, 'v10:fr-sparkle', x, H * (i % 2 ? 0.06 : 0.94), H * 0.055, { z: 6.2, o: 0.85, r: i * 13 });
    }

    out.push(txt(kit.title, cx - A * 0.8, H * 0.09, A * 1.6, Math.max(4, H * 0.035),
        { font: kit.font, color: kit.theme.accent, align: 'center', z: 8 }));
    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function poster(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.2 });
    wash(out, W, H, kit, 'v10:fr-floral', { z: 0.5, o: 0.5 });
    wash(out, W, H, kit, 'v10:fr-tulle', { z: 0.65, o: 0.45 });
    wash(out, W, H, kit, 'v10:fr-embroidery', { z: 0.7, o: 0.4 });

    const A = H * 0.56;
    const cx = W * 0.5;
    const cy = H * 0.47;

    const wreaths = [
        { x: 0.16, y: 0.22, r: 0.15 },
        { x: 0.84, y: 0.24, r: 0.13 },
        { x: 0.14, y: 0.76, r: 0.13 },
        { x: 0.85, y: 0.75, r: 0.15 },
        { x: 0.5, y: 0.94, r: 0.1 },
    ];
    wreaths.forEach((w, i) => {
        const r = Math.min(W, H) * w.r;
        wreath(out, kit, W * w.x, H * w.y, r, 10, r * 0.42, i * 9);

        const s = r * 1.1;
        mini(out, W * w.x - s / 2, H * w.y - s / 2, s, s, 'oval', 3.4, { zoom: 1.12, fx: 42 + i * 6, fy: 44 });

        out.push(txt(i % 2 ? 'lace' : 'chérie', W * w.x - r * 0.9, H * w.y - r * 1.35, r * 1.8,
            Math.max(3.4, H * 0.02), { font: kit.font, color: kit.theme.accent, align: 'center', z: 7, r: i % 2 ? 6 : -6 }));
    });

    stk(out, kit, 'v10:fr-frame', cx, cy, A * 1.32, { z: 2.8, o: 0.95 });
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'oval', 3.9, { zoom: 1.03 });

    stk(out, kit, 'v10:fr-vine', W * 0.3, H * 0.18, H * 0.26, { z: 6, r: 46 });
    stk(out, kit, 'v10:fr-vine', W * 0.7, H * 0.2, H * 0.24, { z: 6, r: -46 });
    stk(out, kit, 'v10:fr-vine', W * 0.28, H * 0.8, H * 0.24, { z: 6, r: -46 });
    stk(out, kit, 'v10:fr-vine', W * 0.72, H * 0.8, H * 0.24, { z: 6, r: 46 });

    for (let i = 0; i < 26; i += 1) {
        const t = i / 26;
        const edge = i % 4;
        const x = edge < 2 ? W * (0.04 + t * 0.92) : W * (edge === 2 ? 0.022 : 0.978);
        const y = edge < 2 ? H * (edge === 0 ? 0.028 : 0.972) : H * (0.05 + t * 0.9);
        stk(out, kit, i % 3 === 0 ? 'v10:fr-sparkle' : 'v10:fr-pearl-chain', x, y, H * (i % 3 ? 0.05 : 0.06),
            { z: 6.6, o: 0.9, r: i * 21 });
    }

    head(out, kit, kit.title, W * 0.04, H * 0.06, W * 0.2, H * 0.055, { align: 'center' });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

export const builds = { chip, compact, circle, polaroid, collage, tower, banner, scroll, poster };
