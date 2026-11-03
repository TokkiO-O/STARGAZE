import { F, img, txt } from '../assets/base.js';
import {
    PAL, base, wash, sheet, portrait, mini, stk, column, tape, head, rule, mark,
    frame, corners, arcPos,
} from './kit.js';

export const style = {
    id: 'gothic',
    name: '哥特古堡',
    desc: '雕花 · 荆棘 · 烛台，暗调维多利亚',
    avatarShape: 'arch',
    layout: 'tower',
    palette: PAL(['#1e1b24', '#342c3a', '#131118'], '#3a3040', '#6a5c74', '#b9a8cf', '#f1e5cf', '#4c4058', '#7a6280', true),
    decos: ['v10:gt-thorn', 'v10:gt-rose', 'v10:gt-candle', 'v10:gt-moon', 'v10:gt-gem', 'v10:gt-feather'],
    glyphs: ['✦', '✧', '☾', '✝'],
    lace: '', laceRatio: 1,
    tapes: ['builtin:tape-black'],
    font: F.serif, subFont: F.mono,
    title: 'NOCTURNE', sub: '{{name|ETERNAL}}', badge: 'XIII',
    footer: 'the night remembers everything', mark: ['1897', '1031'],
};

const LIGHT = kit => kit.theme.ink;

function chip(W, H, kit) {
    const out = [];
    const A = H * 0.58;
    const cx = W * 0.5;
    const cy = H * 0.52;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:gt-velvet', { z: 1.0, o: 0.85 });

    stk(out, kit, 'v10:gt-thorn', cx - W * 0.16, H * 0.19, W * 0.34, { z: 2.4, r: 90 });
    stk(out, kit, 'v10:gt-thorn', cx + W * 0.16, H * 0.81, W * 0.34, { z: 2.4, r: 270 });

    stk(out, kit, 'v10:gt-oval', cx, cy, A * 1.2, { z: 2.8, o: 0.95 });
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'arch', 3.6, { zoom: 1.04 });

    [[0.2, 0.18], [0.34, 0.2], [0.66, 0.8], [0.8, 0.82]].forEach(([x, y], i) =>
        stk(out, kit, 'v10:gt-rose', W * x, H * y, H * 0.16, { z: 6.2, r: i * 16 - 20 }));

    stk(out, kit, 'v10:gt-moon', W * 0.075, H * 0.16, H * 0.2, { z: 6.2, r: 24, o: 0.9 });
    stk(out, kit, 'v10:gt-moon', W * 0.925, H * 0.84, H * 0.2, { z: 6.2, r: 204, o: 0.9 });

    stk(out, kit, 'v10:gt-silver', W * 0.3, H * 0.28, W * 0.2, { z: 6.6, o: 0.8 });
    stk(out, kit, 'v10:gt-silver', W * 0.7, H * 0.72, W * 0.2, { z: 6.6, o: 0.8, r: 180 });

    out.push(txt('XIII', W * 0.02, H * 0.44, W * 0.1, Math.max(4, H * 0.1),
        { font: kit.font, color: kit.theme.accent, align: 'center', z: 7.4, o: 0.8 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function compact(W, H, kit) {
    const out = [];
    const A = H * 0.52;
    const cx = W * 0.52;
    const cy = H * 0.5;

    base(W, H, kit, out, { paper: false, grainO: 0.3 });
    out.push(img('v10:gt-parchment', 0, 0, W, H, { z: 0.6, fit: 'fill' }));
    wash(out, W, H, kit, 'v10:gt-veil', { z: 0.9, o: 0.3 });

    stk(out, kit, 'v10:gt-oval', cx, cy, A * 1.78, { z: 2.6, o: 0.95 });
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'oval', 3.6, { zoom: 1.03 });

    stk(out, kit, 'v10:gt-web', W * 0.09, H * 0.12, H * 0.28, { z: 6, o: 0.85 });
    stk(out, kit, 'v10:gt-rose', W * 0.09, H * 0.12, H * 0.15, { z: 6.4, r: -10 });

    stk(out, kit, 'v10:gt-feather', W * 0.2, H * 0.16, H * 0.26, { z: 6.2, r: 26 });

    stk(out, kit, 'v10:gt-wax', W * 0.88, H * 0.87, H * 0.2, { z: 6.4, r: -8 });

    stk(out, kit, 'v10:gt-gem', W * 0.88, H * 0.2, H * 0.11, { z: 6.4, r: 12 });
    stk(out, kit, 'v10:gt-cross', W * 0.945, H * 0.56, H * 0.15, { z: 6.4, r: 0 });
    stk(out, kit, 'v10:gt-thorn', W * 0.06, H * 0.84, H * 0.22, { z: 6.2, r: 20, o: 0.9 });

    stk(out, kit, 'v10:gt-moon', W * 0.78, H * 0.075, W * 0.3, { z: 6.2, r: -7, o: 0.9 });
    stk(out, kit, 'v10:gt-silver', W * 0.83, H * 0.34, W * 0.3, { z: 5.8, r: -14, o: 0.7 });

    stk(out, kit, 'v10:gt-thorn', W * 0.17, H * 0.85, H * 0.26, { z: 6.0, r: -34, o: 0.9 });
    stk(out, kit, 'v10:gt-rose', W * 0.28, H * 0.9, H * 0.12, { z: 6.3, r: 16 });

    column(out, kit, 'v10:gt-chain-v', W * 0.972, H * 0.2, H * 0.44, { z: 6.1, o: 0.65 });

    stk(out, kit, 'v10:gt-feather', W * 0.73, H * 0.88, H * 0.17, { z: 6.2, r: -40, o: 0.8 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function circle(W, H, kit) {
    const out = [];
    const A = Math.min(W, H) * 0.5;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { paper: false, grainO: 0.3 });
    out.push(img('v10:gt-parchment', 0, 0, W, H, { z: 0.6, fit: 'fill' }));
    wash(out, W, H, kit, 'v10:gt-veil', { z: 0.9, o: 0.5 });

    for (let i = 0; i < 20; i += 1) {
        const p = arcPos(cx, cy, Math.min(W, H) * 0.465, Math.min(W, H) * 0.465, (i / 20) * 360);
        stk(out, kit, 'v10:gt-scroll', p.x, p.y, Math.min(W, H) * 0.14, { z: 5.2, r: p.r + 90, o: 0.95 });
    }

    stk(out, kit, 'v10:gt-oval', cx, cy, A * 1.34, { z: 2.8, o: 0.95 });
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'oval', 3.6, { zoom: 1.03 });

    for (let i = 0; i < 10; i += 1) {
        const p = arcPos(cx, cy, Math.min(W, H) * 0.365, Math.min(W, H) * 0.365, (i / 10) * 360 + 18);
        stk(out, kit, i % 2 ? 'v10:gt-rose' : 'v10:gt-moon', p.x, p.y, A * (i % 2 ? 0.2 : 0.24),
            { z: 6, r: p.r * 0.5 });
    }

    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function polaroid(W, H, kit) {
    const out = [];
    const fx = W * 0.1;
    const fy = H * 0.09;
    const fw = W * 0.8;
    const fh = H * 0.6;
    const A = Math.min(fw, fh) * 0.66;
    const cx = fx + fw / 2;
    const cy = fy + fh / 2;

    base(W, H, kit, out, { paper: false, grainO: 0.3 });
    out.push(img('v10:gt-parchment', 0, 0, W, H, { z: 0.6, fit: 'fill' }));
    wash(out, W, H, kit, 'v10:gt-velvet', { z: 0.8, o: 0.55 });

    out.push(img('v10:gt-frame', 0, 0, W, H, { z: 1.0, o: 0.92, fit: 'fill' }));

    out.push(img('v10:gt-parchment', fx, fy, fw, fh, { z: 1.2, fit: 'fill' }));
    out.push(img('v10:gt-veil', fx, fy, fw, fh, { z: 1.3, o: 0.3, fit: 'fill' }));
    stk(out, kit, 'v10:gt-arch', cx, cy, fh * 1.04, { z: 1.5, o: 0.85 });
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'arch', 3.6, { zoom: 1.02 });

    const laceW = fw * 0.26;
    for (let i = 0; i < 4; i += 1) {
        const x = fx + (fw / 4) * (i + 0.5);
        stk(out, kit, 'v10:gt-lace', x, fy - H * 0.015, laceW, { z: 6.2, o: 0.95 });
        stk(out, kit, 'v10:gt-lace', x, fy + fh + H * 0.015, laceW, { z: 6.2, r: 180, o: 0.95 });
    }
    for (let i = 0; i < 2; i += 1) {
        const y = fy + fh * (0.25 + i * 0.5);
        stk(out, kit, 'v10:gt-lace', W * 0.028, y, laceW * 0.52, { z: 6.2, r: 90, o: 0.95 });
        stk(out, kit, 'v10:gt-lace', W * 0.972, y, laceW * 0.52, { z: 6.2, r: 90, o: 0.95 });
    }

    stk(out, kit, 'v10:gt-moon', W * 0.5, H * 0.035, W * 0.42, { z: 7, o: 0.95 });

    stk(out, kit, 'v10:gt-rose-cluster', W * 0.2, H * 0.85, H * 0.3, { z: 7, r: -8 });
    stk(out, kit, 'v10:gt-candle', W * 0.46, H * 0.85, H * 0.28, { z: 7 });
    stk(out, kit, 'v10:gt-gem', W * 0.62, H * 0.86, H * 0.14, { z: 7, r: 10 });
    stk(out, kit, 'v10:gt-web', W * 0.86, H * 0.84, H * 0.2, { z: 6.8, o: 0.85 });
    stk(out, kit, 'v10:gt-rose', W * 0.75, H * 0.9, H * 0.16, { z: 7.1, r: 14 });

    stk(out, kit, 'v10:gt-gem', W * 0.045, H * 0.34, H * 0.1, { z: 7, r: -6 });
    stk(out, kit, 'v10:gt-gem', W * 0.955, H * 0.66, H * 0.1, { z: 7, r: 8 });
    column(out, kit, 'v10:gt-chain-v', W * 0.028, H * 0.5, H * 0.3, { z: 6.6, o: 0.7 });
    column(out, kit, 'v10:gt-chain-v', W * 0.972, H * 0.5, H * 0.3, { z: 6.6, o: 0.7 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function collage(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:gt-veil', { z: 0.6, o: 0.6 });

    const scraps = [
        { x: 0.02, y: 0.05, w: 0.42, h: 0.42, r: -6 },
        { x: 0.5, y: 0.03, w: 0.46, h: 0.4, r: 5 },
        { x: 0.04, y: 0.52, w: 0.42, h: 0.44, r: 4 },
        { x: 0.54, y: 0.5, w: 0.44, h: 0.46, r: -5 },
    ];
    scraps.forEach((s, i) => {
        out.push(img('v10:gt-parchment', W * s.x, H * s.y, W * s.w, H * s.h, { z: 1.3 + i * 0.08, r: s.r, fit: 'fill' }));
        out.push(img('v10:gt-torn', W * s.x, H * s.y, W * s.w, H * s.h, { z: 1.34 + i * 0.08, r: s.r, o: 0.4, fit: 'fill' }));
    });

    stk(out, kit, 'v10:gt-thorn', W * 0.26, H * 0.5, H * 0.72, { z: 2.6, r: 24 });
    stk(out, kit, 'v10:gt-thorn', W * 0.74, H * 0.5, H * 0.7, { z: 2.6, r: -24 });
    stk(out, kit, 'v10:gt-thorn', W * 0.5, H * 0.24, W * 0.5, { z: 2.6, r: 8 });

    scraps.forEach((s, i) => {
        const size = Math.min(W * s.w, H * s.h) * 0.6;
        const x = W * (s.x + s.w / 2);
        const y = H * (s.y + s.h / 2);
        stk(out, kit, 'v10:gt-oval', x, y, size * 1.3, { z: 3.0 + i * 0.08, o: 0.9 });
        mini(out, x - size / 2, y - size / 2, size, size, 'arch', 3.2 + i * 0.08,
            { zoom: 1.12, fx: 40 + i * 8, fy: 44 + (i % 2) * 10 });
    });

    const A = H * 0.44;
    const cx = W * 0.47;
    const cy = H * 0.46;
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'arch', 4.4, { zoom: 1.03 });

    stk(out, kit, 'v10:gt-candle', W * 0.28, H * 0.86, H * 0.22, { z: 6.2, r: -8 });
    stk(out, kit, 'v10:gt-feather', W * 0.72, H * 0.14, H * 0.24, { z: 6.2, r: -28 });
    stk(out, kit, 'v10:gt-gem', W * 0.66, H * 0.88, H * 0.1, { z: 6.2, r: 10 });
    stk(out, kit, 'v10:gt-raven', W * 0.9, H * 0.34, H * 0.12, { z: 6.2, r: 0 });
    stk(out, kit, 'v10:gt-web', W * 0.14, H * 0.3, H * 0.14, { z: 6, o: 0.75 });

    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function tower(W, H, kit) {
    const out = [];
    const A = W * 0.6;
    const cx = W * 0.5;
    const cy = H * 0.42;

    base(W, H, kit, out, { m: 0.02, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:gt-velvet', { z: 1.0, o: 0.8 });

    stk(out, kit, 'v10:gt-arch', cx, H * 0.47, H * 0.86, { z: 2.2, o: 0.95 });

    out.push(img('v10:gt-parchment', W * 0.2, H * 0.1, W * 0.6, H * 0.8, { z: 2.0, r: 0, fit: 'fill' }));
    out.push(img('v10:gt-veil', W * 0.2, H * 0.1, W * 0.6, H * 0.8, { z: 2.05, o: 0.5, fit: 'fill' }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'oval', 3.6, { zoom: 1.03 });

    stk(out, kit, 'v10:gt-thorn', W * 0.28, H * 0.36, H * 0.4, { z: 6.0, r: 32 });
    stk(out, kit, 'v10:gt-thorn', W * 0.72, H * 0.36, H * 0.4, { z: 6.0, r: -32 });
    stk(out, kit, 'v10:gt-thorn', W * 0.3, H * 0.72, H * 0.36, { z: 6.0, r: -32 });
    stk(out, kit, 'v10:gt-thorn', W * 0.7, H * 0.72, H * 0.36, { z: 6.0, r: 32 });

    [0.16, 0.3, 0.62, 0.78].forEach((y, i) =>
        stk(out, kit, i % 2 ? 'v10:gt-candle' : 'v10:gt-rose', W * (i % 2 ? 0.82 : 0.18), H * y,
            H * (i % 2 ? 0.08 : 0.07), { z: 6.4, r: i * 12 - 16 }));

    stk(out, kit, 'v10:gt-chain-v', W * 0.08, H * 0.4, H * 0.5, { z: 6.2, o: 0.85 });
    stk(out, kit, 'v10:gt-chain-v', W * 0.92, H * 0.5, H * 0.44, { z: 6.2, o: 0.85 });

    stk(out, kit, 'v10:gt-cross', cx, H * 0.055, H * 0.08, { z: 7, o: 0.9 });
    stk(out, kit, 'v10:gt-moon', W * 0.5, H * 0.955, H * 0.16, { z: 7, o: 0.85 });

    out.push(txt(kit.title, W * 0.1, H * 0.9, W * 0.8, Math.max(3.6, H * 0.014),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8, o: 0.85 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function banner(W, H, kit) {
    const out = [];
    const A = W * 0.3;
    const cx = W * 0.5;
    const cy = H * 0.48;

    base(W, H, kit, out, { m: 0.016, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:gt-velvet', { z: 1.0, o: 0.85 });
    wash(out, W, H, kit, 'v10:gt-wallpaper', { z: 1.05, o: 0.4 });

    stk(out, kit, 'v10:gt-oval', cx, cy, A * 1.42, { z: 2.8, o: 0.95 });
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'arch', 3.8, { zoom: 1.03 });

    stk(out, kit, 'v10:gt-thorn', W * 0.22, cy, W * 0.42, { z: 2.4, r: 8 });
    stk(out, kit, 'v10:gt-thorn', W * 0.78, cy, W * 0.42, { z: 2.4, r: 188 });

    stk(out, kit, 'v10:gt-chain', W * 0.2, H * 0.36, W * 0.3, { z: 6.0, r: 10, o: 0.9 });
    stk(out, kit, 'v10:gt-chain', W * 0.8, H * 0.62, W * 0.3, { z: 6.0, r: -10, o: 0.9 });
    out.push(img('v10:gt-veil', W * 0.04, H * 0.2, W * 0.3, H * 0.6, { z: 6.1, r: -14, o: 0.4, fit: 'fill' }));
    out.push(img('v10:gt-veil', W * 0.66, H * 0.2, W * 0.3, H * 0.6, { z: 6.1, r: 14, o: 0.4, fit: 'fill' }));

    [[0.12, 0.24], [0.2, 0.72], [0.3, 0.2], [0.88, 0.26], [0.8, 0.74], [0.7, 0.8]].forEach(([x, y], i) =>
        stk(out, kit, i % 3 === 0 ? 'v10:gt-gem' : 'v10:gt-rose', W * x, H * y, H * 0.15, { z: 6.4, r: i * 18 - 20 }));

    stk(out, kit, 'v10:gt-candle', W * 0.06, H * 0.5, H * 0.2, { z: 6.4, r: 0 });
    stk(out, kit, 'v10:gt-candle', W * 0.94, H * 0.5, H * 0.2, { z: 6.4, r: 0 });
    stk(out, kit, 'v10:gt-raven', W * 0.36, H * 0.08, H * 0.1, { z: 6.4, r: 0 });

    head(out, kit, kit.title, W * 0.055, H * 0.78, W * 0.3, H * 0.06, { align: 'center' });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function scroll(W, H, kit) {
    const out = [];
    const A = H * 0.64;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:gt-velvet', { z: 1.0, o: 0.85 });

    out.push(img('v10:gt-silver', 0, H * 0.1, W, H * 0.07, { z: 1.8, o: 0.95, fit: 'fill' }));
    out.push(img('v10:gt-silver', 0, H * 0.83, W, H * 0.07, { z: 1.8, o: 0.95, fit: 'fill' }));
    stk(out, kit, 'v10:gt-frame', W * 0.035, H * 0.5, H * 0.86, { z: 2.0, o: 0.95 });
    stk(out, kit, 'v10:gt-frame', W * 0.965, H * 0.5, H * 0.86, { z: 2.0, o: 0.95 });
    for (let i = 0; i < 9; i += 1) {
        stk(out, kit, 'v10:gt-scroll', W * (0.1 + i * 0.1), H * (i % 2 ? 0.1 : 0.9), H * 0.2, { z: 2.2, o: 0.75, r: i % 2 ? 0 : 180 });
    }

    stk(out, kit, 'v10:gt-glow', cx, cy, A * 1.5, { z: 3.2, o: 0.9 });
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'arch', 3.8, { zoom: 1.03 });

    [0.07, 0.14, 0.21, 0.28, 0.35, 0.42, 0.58, 0.65, 0.72, 0.79, 0.86, 0.93].forEach((t, i) => {
        const x = W * t;
        const y = H * (i % 2 ? 0.2 : 0.8);
        const kind = i % 3;
        if (kind === 0) stk(out, kit, 'v10:gt-moon', x, y, H * 0.24, { z: 6.2, r: 0 });
        else if (kind === 1) stk(out, kit, 'v10:gt-rose', x, y, H * 0.2, { z: 6.2, r: i * 14 });
        else stk(out, kit, 'v10:gt-candle', x, y, H * 0.22, { z: 6.2, r: 0 });
    });

    [0.12, 0.28, 0.72, 0.88].forEach((t, i) =>
        stk(out, kit, 'v10:gt-chain', W * t, H * (i % 2 ? 0.86 : 0.14), W * 0.08, { z: 6.4, r: i % 2 ? 8 : -8, o: 0.9 }));

    out.push(txt(kit.title, cx - A * 0.9, H * 0.03, A * 1.8, Math.max(4, H * 0.035),
        { font: kit.font, color: kit.theme.ink, align: 'center', z: 8, o: 0.9 }));
    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function poster(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.32 });
    wash(out, W, H, kit, 'v10:gt-velvet', { z: 0.5, o: 0.9 });
    wash(out, W, H, kit, 'v10:gt-wallpaper', { z: 0.55, o: 0.45 });

    const A = H * 0.46;
    const cx = W * 0.5;
    const cy = H * 0.48;

    stk(out, kit, 'v10:gt-arch', cx, cy, H * 1.06, { z: 2.6, o: 0.95 });
    portrait(out, cx - A / 2, cy - A / 2 + H * 0.02, A, A, 'arch', 3.9, { zoom: 1.03 });

    const vines = [
        [0.15, 0.18, 0.5, 34], [0.85, 0.18, 0.5, -34], [0.13, 0.8, 0.5, -34], [0.87, 0.8, 0.5, 34],
        [0.5, 0.09, 0.36, 4], [0.5, 0.92, 0.36, -4], [0.24, 0.5, 0.44, 78], [0.76, 0.5, 0.44, -78],
        [0.36, 0.3, 0.28, 58], [0.64, 0.3, 0.28, -58], [0.36, 0.72, 0.28, -58], [0.64, 0.72, 0.28, 58],
    ];
    vines.forEach(([x, y, s, r], i) =>
        stk(out, kit, 'v10:gt-thorn', W * x, H * y, H * s, { z: 5.8 + (i % 3) * 0.05, r }));

    stk(out, kit, 'v10:gt-candle', W * 0.12, H * 0.44, H * 0.14, { z: 6.2 });
    stk(out, kit, 'v10:gt-candle', W * 0.88, H * 0.56, H * 0.14, { z: 6.2 });
    stk(out, kit, 'v10:gt-web', W * 0.2, H * 0.1, H * 0.14, { z: 6, o: 0.8 });
    stk(out, kit, 'v10:gt-web', W * 0.82, H * 0.9, H * 0.12, { z: 6, o: 0.8 });
    stk(out, kit, 'v10:gt-feather', W * 0.3, H * 0.14, H * 0.2, { z: 6.2, r: 24 });
    stk(out, kit, 'v10:gt-feather', W * 0.72, H * 0.86, H * 0.18, { z: 6.2, r: -24 });
    [[0.34, 0.2], [0.66, 0.2], [0.34, 0.8], [0.66, 0.8]].forEach(([x, y], i) => {
        const s = H * 0.14;
        stk(out, kit, 'v10:gt-oval', W * x, H * y, s * 1.3, { z: 3.2, o: 0.9 });
        mini(out, W * x - s / 2, H * y - s / 2, s, s, 'arch', 3.4, { zoom: 1.14, fx: 40 + i * 8, fy: 44 });
    });

    stk(out, kit, 'v10:gt-glow', cx, cy, H * 0.72, { z: 6.4, o: 0.8 });
    stk(out, kit, 'v10:gt-moon', W * 0.5, H * 0.075, H * 0.36, { z: 7, o: 0.9 });
    stk(out, kit, 'v10:gt-moon', W * 0.5, H * 0.925, H * 0.36, { z: 7, o: 0.9 });

    [[0.05, 0.08], [0.95, 0.08], [0.05, 0.92], [0.95, 0.92]].forEach(([x, y], i) =>
        stk(out, kit, 'v10:gt-rose-cluster', W * x, H * y, H * 0.26, { z: 7.2, r: i * 20 - 20 }));

    stk(out, kit, 'v10:gt-silver', W * 0.24, H * 0.32, W * 0.2, { z: 6.6, o: 0.7, r: -24 });
    stk(out, kit, 'v10:gt-silver', W * 0.76, H * 0.68, W * 0.2, { z: 6.6, o: 0.7, r: -24 });

    head(out, kit, kit.title, W * 0.04, H * 0.04, W * 0.26, H * 0.055, { align: 'center' });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

export const builds = { chip, compact, circle, polaroid, collage, tower, banner, scroll, poster };
