import { F, img, txt } from '../assets/base.js';
import {
    PAL, base, wash, sheet, portrait, mini, stk, rail, tape, label, head, rule, mark,
    frame, corners, arcPos,
} from './kit.js';

export const style = {
    id: 'stamp',
    name: '集邮册',
    desc: '齿孔 · 邮戳 · 放大镜，收藏贴片',
    avatarShape: 'square',
    layout: 'poster',
    palette: PAL(['#3b332b', '#55493d', '#241e19'], '#f7edd8', '#c4ae84', '#a4595a', '#2a231d', '#e6d6b4', '#8fa08f', true),
    decos: ['v10:sp-stamp', 'v10:sp-postmark', 'v10:sp-loupe', 'v10:sp-flower', 'v10:sp-block', 'v10:sp-airmail'],
    glyphs: ['✦', '·', '★', '✷'],

    fillBlankStamps: true,
    lace: '', laceRatio: 1,
    tapes: ['builtin:tape-cream'],
    font: F.serif, subFont: F.mono,
    title: 'COLLECT', sub: '{{birthday|ISSUE 2026}}', badge: '01',
    footer: 'a small museum of you', mark: ['1840', '2026'],
};

function chip(W, H, kit) {
    const out = [];
    const A = H * 0.62;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.24 });

    out.push(img('v10:sp-album', 0, 0, W, H, { z: 0.8, fit: 'fill' }));

    const cellY = H * 0.06;
    const cellH = H * 0.88;
    const midW = W * 0.4;
    out.push(img('v10:sp-stamp-wide', W * 0.03, cellY, W * 0.94, cellH, { z: 1.4, fit: 'fill' }));
    out.push(img('v10:sp-sleeve', W * 0.03, cellY, W * 0.94, cellH, { z: 1.5, o: 0.5, fit: 'fill' }));

    [W * 0.3, W * 0.7].forEach(x =>
        out.push(img('v10:sp-perf', x - W * 0.012, cellY, W * 0.024, cellH, { z: 6, fit: 'fill' })));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'stamp', 3.6, { zoom: 1.04 });
    out.push(img('v10:sp-perf', cx - A / 2, cy - A / 2, A, A, { z: 3.7, o: 0.8, fit: 'fill' }));

    out.push(txt('5¢', W * 0.06, H * 0.34, W * 0.2, Math.max(8, H * 0.28),
        { font: kit.font, color: kit.theme.accent, align: 'center', z: 7.4 }));
    out.push(txt('POSTAGE', W * 0.06, H * 0.68, W * 0.2, Math.max(3, H * 0.06),
        { font: kit.subFont, color: kit.theme.onLight, align: 'center', z: 7.4 }));
    stk(out, kit, 'v10:sp-postmark', W * 0.83, H * 0.5, H * 0.5, { z: 7, r: -8, o: 0.9 });

    stk(out, kit, 'v10:sp-string', W * 0.5, H * 0.03, W * 0.5, { z: 7.6, o: 0.7 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function compact(W, H, kit) {
    const out = [];
    const A = H * 0.6;
    const cx = W * 0.5;
    const cy = H * 0.48;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.24 });
    out.push(img('v10:sp-album', 0, 0, W, H, { z: 0.8, fit: 'fill' }));
    wash(out, W, H, kit, 'v10:sp-perftex', { z: 0.9, o: 0.5 });

    const sw = A * 0.9;
    out.push(img('v10:sp-stamp', cx - sw / 2, cy - A / 2, sw, A, { z: 3.2, fit: 'fill' }));
    portrait(out, cx - A * 0.4, cy - A * 0.38, A * 0.8, A * 0.76, 'stamp', 3.6, { zoom: 1.04 });

    [[0.12, 0.14, 0.2, -16], [0.86, 0.18, 0.17, 14], [0.1, 0.82, 0.16, 10], [0.88, 0.8, 0.14, -12]]
        .forEach(([x, y, s, r], i) => stk(out, kit, 'v10:sp-stamp', W * x, H * y, H * s, { z: 6.2, r: r + i }));

    stk(out, kit, 'v10:sp-postmark', W * 0.3, H * 0.2, H * 0.22, { z: 6.6, r: -12, o: 0.85 });
    stk(out, kit, 'v10:sp-postmark-sq', W * 0.72, H * 0.84, H * 0.2, { z: 6.6, r: 8, o: 0.85 });
    stk(out, kit, 'v10:sp-steel', W * 0.16, H * 0.5, H * 0.16, { z: 6.6, r: 0, o: 0.8 });

    out.push(txt(kit.mark[1], W * 0.36, H * 0.02, W * 0.28, Math.max(3.4, H * 0.032),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 7.6 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function circle(W, H, kit) {
    const out = [];
    const A = Math.min(W, H) * 0.52;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.24 });
    out.push(img('v10:sp-album', 0, 0, W, H, { z: 0.8, fit: 'fill' }));
    wash(out, W, H, kit, 'v10:sp-perftex', { z: 1.0, o: 0.55 });

    for (let i = 0; i < 32; i += 1) {
        const p = arcPos(cx, cy, Math.min(W, H) * 0.47, Math.min(W, H) * 0.47, (i / 32) * 360);
        out.push(img('v10:sp-perf', p.x - W * 0.03, p.y - W * 0.03, W * 0.06, W * 0.06, { z: 5.4, r: p.r }));
    }

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 3.6, { zoom: 1.03 });

    for (let i = 0; i < 14; i += 1) {
        const p = arcPos(cx, cy, Math.min(W, H) * 0.395, Math.min(W, H) * 0.395, (i / 14) * 360);
        out.push(txt('· POST 2026 ·', p.x - A * 0.13, p.y - A * 0.03, A * 0.26, Math.max(3, A * 0.055),
            { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 6.4, r: p.r + 90, o: 0.9 }));
    }

    [70, 250].forEach((deg, i) => {
        const p = arcPos(cx, cy, Math.min(W, H) * 0.32, Math.min(W, H) * 0.32, deg);
        stk(out, kit, 'v10:sp-stamp', p.x, p.y, A * 0.26, { z: 6.2, r: i ? 12 : -12 });
    });

    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function polaroid(W, H, kit) {
    const out = [];
    const fx = W * 0.09;
    const fy = H * 0.075;
    const fw = W * 0.82;
    const fh = H * 0.66;
    const A = Math.min(fw, fh) * 0.7;
    const cx = fx + fw / 2;
    const cy = fy + fh / 2;

    base(W, H, kit, out, { paper: false, grainO: 0.24 });

    out.push(img('v10:sp-stamp', W * 0.02, H * 0.012, W * 0.96, H * 0.976, { z: 0.8, r: 1.4, fit: 'fill' }));
    out.push(img('v10:sp-sleeve', W * 0.04, H * 0.03, W * 0.92, H * 0.94, { z: 1.0, r: 0.6, fit: 'fill' }));

    out.push(img('v10:sp-sleeve', fx, fy, fw, fh, { z: 1.2, fit: 'fill' }));
    out.push(img('v10:sp-perftex', fx, fy, fw, fh, { z: 1.25, o: 0.5, fit: 'fill' }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'stamp', 3.6, { zoom: 1.02 });

    [[0.14, 0.87, 0.9, -14], [0.4, 0.9, 0.62, 8], [0.68, 0.86, 0.85, 16], [0.9, 0.9, 0.55, -6],
        [0.08, 0.42, 0.6, 22], [0.93, 0.36, 0.55, -20], [0.5, 0.03, 0.5, 4]]
        .forEach(([x, y, o, r], i) =>
            stk(out, kit, i % 2 ? 'v10:sp-postmark-sq' : 'v10:sp-postmark', W * x, H * y, H * 0.24, { z: 6.4 + i * 0.02, r, o }));

    stk(out, kit, 'v10:sp-steel', W * 0.2, H * 0.24, H * 0.14, { z: 7, r: -8, o: 0.75 });
    stk(out, kit, 'v10:sp-tweezers', W * 0.95, H * 0.66, H * 0.2, { z: 7.2, r: 22 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function collage(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.24 });
    out.push(img('v10:sp-album', 0, 0, W, H, { z: 0.6, fit: 'fill' }));
    wash(out, W, H, kit, 'v10:sp-perftex', { z: 0.8, o: 0.5 });

    const stamps = [
        { x: 0.03, y: 0.04, s: 0.3, r: -8, w: 1 }, { x: 0.2, y: 0.02, s: 0.22, r: 6, w: 0.8 },
        { x: 0.34, y: 0.08, s: 0.26, r: -4, w: 1 }, { x: 0.52, y: 0.03, s: 0.2, r: 10, w: 0.75 },
        { x: 0.63, y: 0.06, s: 0.28, r: -6, w: 1 }, { x: 0.82, y: 0.04, s: 0.22, r: 8, w: 0.8 },
        { x: 0.02, y: 0.4, s: 0.24, r: 5, w: 0.85 }, { x: 0.16, y: 0.6, s: 0.28, r: -7, w: 1 },
        { x: 0.33, y: 0.74, s: 0.22, r: 9, w: 0.8 }, { x: 0.5, y: 0.82, s: 0.26, r: -5, w: 0.95 },
        { x: 0.66, y: 0.62, s: 0.24, r: 7, w: 0.85 }, { x: 0.8, y: 0.7, s: 0.28, r: -9, w: 1 },
        { x: 0.88, y: 0.4, s: 0.22, r: 6, w: 0.8 }, { x: 0.44, y: 0.36, s: 0.18, r: -12, w: 0.7 },
    ];
    stamps.forEach((s, i) => {
        const w = W * s.s * s.w;
        const h = w * 1.25;
        out.push(img(i % 4 === 0 ? 'v10:sp-stamp-wide' : 'v10:sp-stamp', W * s.x, H * s.y, w, h,
            { z: 1.6 + (i % 5) * 0.08, r: s.r, fit: 'fill' }));
    });

    const A = H * 0.56;
    const cx = W * 0.5;
    const cy = H * 0.47;
    out.push(img('v10:sp-stamp', cx - A * 0.56, cy - A * 0.6, A * 1.12, A * 1.2, { z: 3.2, r: -2, fit: 'fill' }));
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'stamp', 3.6, { zoom: 1.03 });

    for (let i = 0; i < 16; i += 1) {
        const x = W * (0.05 + ((i * 37) % 90) / 100);
        const y = H * (0.05 + ((i * 53) % 90) / 100);
        if (Math.abs(x - cx) < A * 0.55 && Math.abs(y - cy) < A * 0.6) continue;
        stk(out, kit, i % 3 === 0 ? 'v10:sp-postmark-sq' : 'v10:sp-postmark', x, y, H * (i % 3 ? 0.13 : 0.15),
            { z: 6.4, r: i * 19, o: 0.75 });
    }

    stk(out, kit, 'v10:sp-tweezers', W * 0.93, H * 0.88, H * 0.26, { z: 7, r: -34 });
    stk(out, kit, 'v10:sp-loupe', W * 0.08, H * 0.9, H * 0.16, { z: 7, r: 16 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function tower(W, H, kit) {
    const out = [];
    const A = W * 0.62;
    const cx = W * 0.5;
    const cy = H * 0.3;

    base(W, H, kit, out, { m: 0.02, grainO: 0.24 });
    out.push(img('v10:sp-album', 0, 0, W, H, { z: 0.6, fit: 'fill' }));
    wash(out, W, H, kit, 'v10:sp-perftex', { z: 0.9, o: 0.45 });

    out.push(img('v10:sp-stamp', cx - A * 0.56, cy - A * 0.62, A * 1.12, A * 1.24, { z: 3.2, r: -1.5, fit: 'fill' }));
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'stamp', 3.6, { zoom: 1.03 });

    out.push(img('v10:sp-stamp', W * 0.16, H * 0.5, W * 0.3, H * 0.16, { z: 3.4, r: 3, fit: 'fill' }));
    out.push(img('v10:sp-stamp', W * 0.54, H * 0.53, W * 0.28, H * 0.15, { z: 3.4, r: -3, fit: 'fill' }));

    [0.71, 0.79, 0.87, 0.94].forEach((y, i) => {
        stk(out, kit, i % 2 ? 'v10:sp-stamp' : 'v10:sp-stamp-wide', W * (0.2 + (i % 2) * 0.32), H * y,
            W * (i % 2 ? 0.2 : 0.26), { z: 6.2, r: i * 6 - 9 });
    });

    stk(out, kit, 'v10:sp-string', W * 0.93, H * 0.36, H * 0.5, { z: 6, r: 90, o: 0.9 });
    [0.18, 0.32, 0.46, 0.6].forEach((y, i) =>
        stk(out, kit, 'v10:sp-stamp', W * 0.93, H * y, H * 0.06, { z: 6.2, r: i * 14 }));

    stk(out, kit, 'v10:sp-loupe', W * 0.9, H * 0.8, H * 0.16, { z: 6.4, r: -18 });

    out.push(txt(kit.title, W * 0.1, H * 0.955, W * 0.8, Math.max(3.6, H * 0.014),
        { font: kit.subFont, color: kit.theme.onDark, align: 'center', z: 8 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function banner(W, H, kit) {
    const out = [];
    const A = W * 0.29;
    const cx = W * 0.5;
    const cy = H * 0.47;

    base(W, H, kit, out, { m: 0.016, grainO: 0.24 });
    out.push(img('v10:sp-album', 0, 0, W, H, { z: 0.6, fit: 'fill' }));
    wash(out, W, H, kit, 'v10:sp-perftex', { z: 0.9, o: 0.45 });

    out.push(img('v10:sp-stamp', cx - A * 0.54, cy - A * 0.6, A * 1.08, A * 1.2, { z: 3.2, r: -1.5, fit: 'fill' }));
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'stamp', 3.6, { zoom: 1.03 });

    [-1, 1].forEach(dir => {
        [0.16, 0.11, 0.08, 0.06].forEach((s, i) => {
            const w = W * s;
            const x = cx + dir * (A * 0.62 + w * 0.6 + i * W * 0.115);
            stk(out, kit, i % 2 ? 'v10:sp-stamp' : 'v10:sp-stamp-wide', x, cy + (i % 2 ? -H * 0.06 : H * 0.05),
                w, { z: 6.2, r: dir * (i * 4) });
        });
    });

    out.push(img('v10:sp-airmail', 0, H * 0.48, W, H * 0.06, { z: 6.6, o: 0.85, fit: 'fill' }));

    [[0.12, 0.22], [0.24, 0.76], [0.76, 0.24], [0.88, 0.74], [0.36, 0.16], [0.64, 0.82]]
        .forEach(([x, y], i) => stk(out, kit, i % 2 ? 'v10:sp-postmark-sq' : 'v10:sp-postmark',
            W * x, H * y, H * 0.14, { z: 6.8, r: i * 18, o: 0.8 }));

    stk(out, kit, 'v10:sp-block', W * 0.06, H * 0.2, H * 0.2, { z: 6.4, r: -6 });
    stk(out, kit, 'v10:sp-block', W * 0.94, H * 0.8, H * 0.18, { z: 6.4, r: 8 });

    head(out, kit, kit.title, W * 0.055, H * 0.74, W * 0.26, H * 0.06, { band: true, br: -0.6 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function scroll(W, H, kit) {
    const out = [];
    const A = H * 0.66;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.24 });
    out.push(img('v10:sp-album', 0, 0, W, H, { z: 0.6, fit: 'fill' }));

    out.push(img('v10:sp-stamp-wide', 0, H * 0.1, W, H * 0.8, { z: 1.4, fit: 'fill' }));

    [0.06, 0.13, 0.21, 0.3, 0.39, 0.61, 0.7, 0.79, 0.87, 0.94].forEach(x =>
        out.push(img('v10:sp-perf', W * x - W * 0.006, H * 0.1, W * 0.012, H * 0.8, { z: 6, fit: 'fill' })));

    out.push(img('v10:sp-stamp', cx - A * 0.56, cy - A * 0.6, A * 1.12, A * 1.2, { z: 3.2, r: -1, fit: 'fill' }));
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'stamp', 3.6, { zoom: 1.03 });

    const span = rail(W, A, 5);
    [-1, 1].forEach(dir => {
        [0.14, 0.118, 0.1, 0.082, 0.066].forEach((s, i) => {
            const w = W * s;
            const x = cx + dir * (A * 0.56 + span * (i + 0.9));
            stk(out, kit, i % 2 ? 'v10:sp-stamp' : 'v10:sp-block', x, cy + (i % 2 ? -H * 0.17 : H * 0.18),
                w * 1.18, { z: 6.2, r: dir * i * 4 });
        });
    });

    for (let i = 0; i < 14; i += 1) {
        const x = W * (0.05 + i * 0.069);
        if (Math.abs(x - cx) < A * 0.6) continue;
        stk(out, kit, 'v10:sp-postmark', x, H * (i % 2 ? 0.22 : 0.78), H * 0.13, { z: 6.8, r: i * 21, o: 0.8 });
    }

    out.push(txt(kit.title, cx - A * 0.9, H * 0.02, A * 1.8, Math.max(3.6, H * 0.03),
        { font: kit.subFont, color: kit.theme.onDark, align: 'center', z: 8 }));
    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function poster(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.26 });
    out.push(img('v10:sp-album', 0, 0, W, H, { z: 0.5, fit: 'fill' }));
    wash(out, W, H, kit, 'v10:sp-perftex', { z: 0.7, o: 0.4 });

    const spots = [
        [0.03, 0.06, 0.1, -8], [0.14, 0.03, 0.08, 6], [0.24, 0.08, 0.09, -4], [0.03, 0.24, 0.085, 8],
        [0.1, 0.42, 0.09, -6], [0.04, 0.58, 0.095, 5], [0.13, 0.72, 0.085, -9], [0.06, 0.86, 0.09, 7],
        [0.22, 0.9, 0.08, -5], [0.34, 0.86, 0.075, 9], [0.66, 0.88, 0.08, -7], [0.78, 0.84, 0.09, 6],
        [0.88, 0.9, 0.08, -8], [0.92, 0.72, 0.09, 5], [0.86, 0.58, 0.085, -6], [0.94, 0.4, 0.08, 8],
        [0.86, 0.24, 0.09, -5], [0.94, 0.1, 0.085, 7], [0.8, 0.06, 0.08, -9], [0.68, 0.03, 0.075, 5],
        [0.56, 0.08, 0.07, -6], [0.4, 0.04, 0.075, 8],
    ];
    spots.forEach(([x, y, s, r], i) => {
        const w = W * s;
        out.push(img(i % 5 === 0 ? 'v10:sp-stamp-wide' : 'v10:sp-stamp', W * x, H * y, w, w * 1.24,
            { z: 1.4 + (i % 6) * 0.06, r, fit: 'fill' }));

        if (i % 3 === 1) {
            const inner = w * 0.66;
            mini(out, W * x + w * 0.17, H * y + w * 0.15, inner, inner * 1.08, 'square', 2.2 + (i % 6) * 0.06, { r: 0, zoom: 1.3 });
        }
    });

    const A = H * 0.6;
    const cx = W * 0.5;
    const cy = H * 0.47;
    out.push(img('v10:sp-stamp', cx - A * 0.56, cy - A * 0.6, A * 1.12, A * 1.2, { z: 3.2, r: -1.2, fit: 'fill' }));
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'stamp', 3.6, { zoom: 1.03 });

    for (let i = 0; i < 30; i += 1) {
        const x = W * (0.04 + ((i * 31) % 92) / 100);
        const y = H * (0.04 + ((i * 47) % 92) / 100);
        if (Math.abs(x - cx) < A * 0.6 && Math.abs(y - cy) < A * 0.65) continue;
        stk(out, kit, i % 3 === 0 ? 'v10:sp-steel' : i % 3 === 1 ? 'v10:sp-postmark-sq' : 'v10:sp-postmark',
            x, y, H * (0.1 + (i % 4) * 0.02), { z: 6.4, r: i * 23, o: 0.55 });
    }

    stk(out, kit, 'v10:sp-tweezers', W * 0.06, H * 0.86, H * 0.3, { z: 7.2, r: -30 });
    stk(out, kit, 'v10:sp-loupe', W * 0.94, H * 0.12, H * 0.2, { z: 7.2, r: 14 });

    head(out, kit, kit.title, W * 0.04, H * 0.03, W * 0.24, H * 0.055, { band: true, br: -0.8 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

export const builds = { chip, compact, circle, polaroid, collage, tower, banner, scroll, poster };
