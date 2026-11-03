import { F, img, txt } from '../assets/base.js';
import {
    PAL, base, wash, sheet, portrait, mini, stk, tape, label, head, rule, mark,
    frame, corners, arcPos,
} from './kit.js';

export const style = {
    id: 'fairy',
    name: '童话绘本',
    desc: '森林 · 压花书页 · 飞鸟，复古自然图鉴',
    avatarShape: 'blob',
    layout: 'compact',
    palette: PAL(['#fdf0d5', '#ffe4ca', '#f7d5b6'], '#fffdf6', '#f0d9b4', '#e88f45', '#5b4632', '#fdeccf', '#ffffff', true),
    decos: ['v10:fy-cloud', 'v10:fy-candy', 'v10:fy-balloon', 'v10:fy-bear', 'v10:fy-rabbit', 'v10:fy-starsoft'],
    glyphs: ['✿', '☁', '★', '♡', '✧'],
    lace: 'builtin:scallop', laceRatio: 0.63,
    tapes: ['builtin:tape-cream'],
    font: F.hand, subFont: F.mono,
    title: 'PICNIC', sub: '{{name|LITTLE STORY}}', badge: 'TALE',
    footer: 'and they lived happily ever after', mark: ['0601', '0815'],
};

function chip(W, H, kit) {
    const out = [];
    const A = H * 0.56;
    const cx = W * 0.5;
    const cy = H * 0.52;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.2 });
    wash(out, W, H, kit, 'v10:fy-watercolor', { z: 1.0, o: 0.55 });
    wash(out, W, H, kit, 'v10:fy-paper', { z: 1.1, o: 0.35 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'blob', 3.6, { zoom: 1.05 });

    stk(out, kit, 'v10:fy-candy', cx, H * 0.14, A * 1.3, { z: 7, r: -2 });
    out.push(txt(kit.title, cx - A * 0.42, H * 0.1, A * 0.84, Math.max(5, H * 0.1),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 7.6, r: -2 }));
    stk(out, kit, 'v10:fy-candy', cx, H * 0.88, A * 1.15, { z: 7, r: 2 });
    out.push(txt(kit.mark[1], cx - A * 0.38, H * 0.845, A * 0.76, Math.max(4, H * 0.075),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 7.6, r: 2 }));

    stk(out, kit, 'v10:fy-balloon', W * 0.06, H * 0.34, H * 0.46, { z: 6.2, r: -8 });
    stk(out, kit, 'v10:fy-balloon', W * 0.94, H * 0.36, H * 0.46, { z: 6.2, r: 8 });

    [[0.14, 0.24], [0.17, 0.66], [0.12, 0.82], [0.86, 0.26], [0.83, 0.68], [0.88, 0.84]].forEach(([x, y], i) =>
        stk(out, kit, 'v10:fy-bubble', W * x, H * y, H * 0.16, { z: 6.4, r: i * 12 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function compact(W, H, kit) {
    const out = [];
    const A = H * 0.56;
    const cx = W * 0.5;
    const cy = H * 0.48;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.2 });
    wash(out, W, H, kit, 'v10:fy-paper', { z: 1.0, o: 0.5 });
    wash(out, W, H, kit, 'v10:fy-watercolor', { z: 1.1, o: 0.45 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'rect', 3.6, { zoom: 1.04 });

    stk(out, kit, 'v10:fy-bear', W * 0.11, H * 0.15, H * 0.22, { z: 6.2, r: -8 });
    stk(out, kit, 'v10:fy-candy', W * 0.86, H * 0.14, H * 0.2, { z: 6.2, r: 10 });
    stk(out, kit, 'v10:fy-cake', W * 0.1, H * 0.84, H * 0.24, { z: 6.2, r: 6 });
    stk(out, kit, 'v10:fy-bubble', W * 0.87, H * 0.84, H * 0.2, { z: 6.2, r: -6 });

    stk(out, kit, 'v10:fy-dash', W * 0.28, H * 0.3, W * 0.22, { z: 6.6, r: 26, o: 0.9 });
    stk(out, kit, 'v10:fy-dash', W * 0.72, H * 0.7, W * 0.22, { z: 6.6, r: 26, o: 0.9 });

    stk(out, kit, 'v10:fy-starsoft', W * 0.24, H * 0.68, H * 0.12, { z: 6.4, r: 12 });
    stk(out, kit, 'v10:fy-starsoft', W * 0.76, H * 0.26, H * 0.1, { z: 6.4, r: -14 });
    out.push(txt('a little story', W * 0.28, H * 0.94, W * 0.44, Math.max(3.4, H * 0.045),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 7.4, r: -3 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function circle(W, H, kit) {
    const out = [];
    const A = Math.min(W, H) * 0.54;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.2 });
    wash(out, W, H, kit, 'v10:fy-watercolor', { z: 1.0, o: 0.6 });

    for (let i = 0; i < 14; i += 1) {
        const p = arcPos(cx, cy, Math.min(W, H) * 0.465, Math.min(W, H) * 0.465, (i / 14) * 360);
        stk(out, kit, 'v10:fy-cloud', p.x, p.y, Math.min(W, H) * 0.16, { z: 5.2, r: p.r + 90 });
    }

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'blob', 3.6, { zoom: 1.03 });

    for (let i = 0; i < 10; i += 1) {
        const p = arcPos(cx, cy, Math.min(W, H) * 0.37, Math.min(W, H) * 0.37, (i / 10) * 360 + 18);
        stk(out, kit, i % 2 ? 'v10:fy-starsoft' : 'v10:fy-grass', p.x, p.y, A * (i % 2 ? 0.2 : 0.26),
            { z: 6, r: p.r * 0.5 });
    }

    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function polaroid(W, H, kit) {
    const out = [];
    const fx = W * 0.085;
    const fy = H * 0.07;
    const fw = W * 0.83;
    const fh = H * 0.7;
    const A = Math.min(fw, fh) * 0.68;
    const cx = fx + fw / 2;
    const cy = fy + fh / 2;

    base(W, H, kit, out, { paper: false, grainO: 0.2 });
    out.push(img('v10:bg-fairy', 0, 0, W, H, { z: 0.4, fit: 'fill' }));
    out.push(img('v10:fy-paper', W * 0.02, H * 0.015, W * 0.96, H * 0.965, { z: 0.8, r: 2.4, o: 0.98, fit: 'fill' }));
    out.push(img('v10:fy-paper', W * 0.04, H * 0.03, W * 0.92, H * 0.94, { z: 1, r: 0.8, fit: 'fill' }));

    out.push(img('v10:fy-watercolor', fx, fy, fw, fh, { z: 1.2, r: 0.4, fit: 'fill' }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'rect', 3.6, { zoom: 1.02 });

    stk(out, kit, 'v10:fy-cake', W * 0.16, H * 0.86, H * 0.2, { z: 6.2, r: -6 });
    stk(out, kit, 'v10:fy-cake', W * 0.44, H * 0.9, H * 0.14, { z: 6.2, r: 5 });
    stk(out, kit, 'v10:fy-cloud', W * 0.045, H * 0.3, H * 0.14, { z: 6.2, r: -8 });
    stk(out, kit, 'v10:fy-cloud', W * 0.955, H * 0.42, H * 0.13, { z: 6.2, r: 8 });
    stk(out, kit, 'v10:fy-cloud', W * 0.5, H * 0.028, H * 0.13, { z: 6.2, r: 0 });
    stk(out, kit, 'v10:fy-bubble', W * 0.75, H * 0.9, H * 0.16, { z: 6.2, r: 10 });
    stk(out, kit, 'v10:fy-bubble', W * 0.88, H * 0.86, H * 0.11, { z: 6.2, r: -12 });
    stk(out, kit, 'v10:fy-bubble', W * 0.06, H * 0.72, H * 0.1, { z: 6.2, r: 14 });

    stk(out, kit, 'v10:fy-cloudband', W * 0.5, H * 0.035, W * 0.34, { z: 6.4, o: 0.9 });
    stk(out, kit, 'v10:fy-balloon', W * 0.82, H * 0.09, H * 0.17, { z: 6.4, r: 8 });
    stk(out, kit, 'v10:fy-balloon', W * 0.12, H * 0.16, H * 0.13, { z: 6.4, r: -10 });

    stk(out, kit, 'v10:fy-rabbit', W * 0.955, H * 0.6, H * 0.18, { z: 6.4, r: 6 });
    stk(out, kit, 'v10:fy-starsoft', W * 0.06, H * 0.5, H * 0.12, { z: 6.4, r: -12 });
    stk(out, kit, 'v10:fy-bow', W * 0.3, H * 0.055, H * 0.13, { z: 6.6, r: -8 });

    stk(out, kit, 'v10:fy-dash', W * 0.28, H * 0.94, W * 0.24, { z: 6.6, r: -4, o: 0.85 });
    out.push(txt(kit.mark[0], W * 0.36, H * 0.005, W * 0.28, Math.max(3.6, H * 0.03),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 7.4 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function collage(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.2 });
    wash(out, W, H, kit, 'v10:fy-paper', { z: 0.5, o: 0.55 });
    wash(out, W, H, kit, 'v10:fy-watercolor', { z: 0.6, o: 0.5 });

    const clouds = [
        { x: 0.02, y: 0.04, w: 0.44, h: 0.44, r: -6, id: 'v10:fy-cloud' },
        { x: 0.5, y: 0.02, w: 0.46, h: 0.42, r: 5, id: 'v10:fy-cloud' },
        { x: 0.04, y: 0.5, w: 0.44, h: 0.46, r: 4, id: 'v10:fy-cloud' },
        { x: 0.54, y: 0.52, w: 0.44, h: 0.44, r: -5, id: 'v10:fy-cloud' },
    ];
    clouds.forEach((c, i) => {
        out.push(img('v10:fy-watercolor', W * c.x, H * c.y, W * c.w, H * c.h, { z: 1.1 + i * 0.06, r: c.r, o: 0.55, fit: 'fill' }));
        stk(out, kit, 'v10:fy-cloud', W * (c.x + c.w / 2), H * (c.y + c.h / 2), Math.max(W * c.w, H * c.h) * 0.95,
            { z: 1.14 + i * 0.06, r: c.r, o: 0.6 });
    });

    stk(out, kit, 'v10:fy-rainbow', W * 0.3, H * 0.46, W * 0.3, { z: 2.2, r: 12, o: 0.9 });
    stk(out, kit, 'v10:fy-rainbow', W * 0.72, H * 0.5, W * 0.3, { z: 2.2, r: -12, o: 0.9 });
    stk(out, kit, 'v10:fy-rainbow', W * 0.5, H * 0.12, W * 0.28, { z: 2.2, r: 0, o: 0.85 });

    const A = H * 0.5;
    const cx = W * 0.47;
    const cy = H * 0.45;
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'blob', 3.8, { zoom: 1.03 });

    mini(out, W * 0.06, H * 0.09, W * 0.16, H * 0.24, 'rect', 3.2, { zoom: 1.14, fx: 40, fy: 44 });
    mini(out, W * 0.78, H * 0.1, W * 0.16, H * 0.22, 'blob', 3.2, { zoom: 1.16, fx: 58, fy: 44 });
    mini(out, W * 0.08, H * 0.6, W * 0.15, H * 0.22, 'rect', 3.2, { zoom: 1.12, fx: 46, fy: 56 });
    out.push(img('v10:fy-cloud', W * 0.6, H * 0.62, W * 0.34, H * 0.24, { z: 7, r: -4, o: 0.95, fit: 'fill' }));
    out.push(txt('once upon', W * 0.63, H * 0.665, W * 0.28, Math.max(3.6, H * 0.032),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 7.4, r: -4 }));
    out.push(txt('a time', W * 0.63, H * 0.72, W * 0.28, Math.max(3.4, H * 0.03),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 7.4, r: -4 }));

    [[0.44, 0.06], [0.5, 0.52], [0.24, 0.5], [0.9, 0.5], [0.5, 0.94], [0.06, 0.44]]
        .forEach(([x, y], i) => stk(out, kit, i % 2 ? 'v10:fy-cotton' : 'v10:fy-starsoft',
            W * x, H * y, H * (i % 2 ? 0.1 : 0.08), { z: 6.4, r: i * 16 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function tower(W, H, kit) {
    const out = [];
    const A = W * 0.6;
    const cx = W * 0.5;
    const cy = H * 0.44;

    base(W, H, kit, out, { m: 0.02, grainO: 0.2 });
    wash(out, W, H, kit, 'v10:fy-paper', { z: 1.0, o: 0.5 });
    wash(out, W, H, kit, 'v10:fy-watercolor', { z: 1.1, o: 0.4 });

    stk(out, kit, 'v10:fy-grass', W * 0.5, H * 0.95, W * 0.9, { z: 2.4 });
    stk(out, kit, 'v10:fy-grass', W * 0.25, H * 0.86, W * 0.42, { z: 2.3, r: 8 });
    stk(out, kit, 'v10:fy-grass', W * 0.78, H * 0.88, W * 0.4, { z: 2.3, r: -8 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'blob', 3.6, { zoom: 1.03 });

    const floats = [
        { id: 'v10:fy-balloon', x: 0.2, y: 0.28, s: 0.11 },
        { id: 'v10:fy-cloud', x: 0.78, y: 0.24, s: 0.1 },
        { id: 'v10:fy-rabbit', x: 0.24, y: 0.12, s: 0.075 },
        { id: 'v10:fy-balloon', x: 0.72, y: 0.09, s: 0.065 },
        { id: 'v10:fy-starsoft', x: 0.5, y: 0.05, s: 0.05 },
        { id: 'v10:fy-cloud', x: 0.16, y: 0.66, s: 0.085 },
        { id: 'v10:fy-starsoft', x: 0.86, y: 0.6, s: 0.06 },
    ];
    floats.forEach((f, i) => stk(out, kit, f.id, W * f.x, H * f.y, H * f.s, { z: 6.2, r: i * 10 - 20 }));

    [0.2, 0.36, 0.52, 0.68, 0.84].forEach((y, i) =>
        stk(out, kit, 'v10:fy-bubble', W * (i % 2 ? 0.93 : 0.07), H * y, H * 0.06, { z: 6, r: i * 14 }));

    out.push(txt('and they lived', W * 0.1, H * 0.72, W * 0.8, Math.max(4, H * 0.018),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 7.4 }));
    out.push(txt('happily ever after', W * 0.1, H * 0.755, W * 0.8, Math.max(4, H * 0.018),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 7.4 }));

    stk(out, kit, 'v10:fy-rainbow', W * 0.5, H * 0.075, W * 0.52, { z: 5.6, o: 0.55 });
    stk(out, kit, 'v10:fy-cloud', W * 0.2, H * 0.13, H * 0.17, { z: 6.2, o: 0.95 });
    stk(out, kit, 'v10:fy-cloud', W * 0.82, H * 0.2, H * 0.14, { z: 6.2, o: 0.9 });
    stk(out, kit, 'v10:fy-balloon', W * 0.79, H * 0.075, H * 0.14, { z: 6.3, r: 12 });
    stk(out, kit, 'v10:fy-balloon', W * 0.13, H * 0.26, H * 0.12, { z: 6.3, r: -10 });
    stk(out, kit, 'v10:fy-starsoft', W * 0.88, H * 0.36, H * 0.08, { z: 6.3, r: -14 });
    stk(out, kit, 'v10:fy-bubble', W * 0.9, H * 0.52, H * 0.1, { z: 6.3, r: 8 });

    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function banner(W, H, kit) {
    const out = [];
    const A = W * 0.29;
    const cx = W * 0.5;
    const cy = H * 0.46;

    base(W, H, kit, out, { m: 0.016, grainO: 0.2 });
    wash(out, W, H, kit, 'v10:fy-watercolor', { z: 1.0, o: 0.5 });

    stk(out, kit, 'v10:fy-rainbow', W * 0.5, H * 0.52, W * 0.96, { z: 1.8, o: 0.95 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'blob', 3.8, { zoom: 1.03 });

    stk(out, kit, 'v10:fy-candy', W * 0.1, H * 0.76, H * 0.22, { z: 6.2, r: -8 });
    stk(out, kit, 'v10:fy-bear', W * 0.2, H * 0.84, H * 0.27, { z: 6.2, r: 6 });
    stk(out, kit, 'v10:fy-rabbit', W * 0.06, H * 0.64, H * 0.22, { z: 6.3, r: -12 });
    stk(out, kit, 'v10:fy-candy', W * 0.9, H * 0.74, H * 0.21, { z: 6.2, r: 10 });
    stk(out, kit, 'v10:fy-rabbit', W * 0.8, H * 0.83, H * 0.25, { z: 6.2, r: -6 });
    stk(out, kit, 'v10:fy-bear', W * 0.94, H * 0.6, H * 0.22, { z: 6.3, r: 12 });

    [[0.3, 0.12], [0.44, 0.08], [0.6, 0.11], [0.72, 0.07], [0.36, 0.9], [0.56, 0.93], [0.68, 0.88]]
        .forEach(([x, y], i) => stk(out, kit, i % 3 === 0 ? 'v10:fy-balloon' : i % 3 === 1 ? 'v10:fy-cotton' : 'v10:fy-bubble',
            W * x, H * y, H * (i % 3 === 0 ? 0.13 : 0.1), { z: 6.4, r: i * 14 - 20 }));

    head(out, kit, kit.title, W * 0.055, H * 0.2, W * 0.24, H * 0.08, { align: 'center' });
    out.push(txt(kit.sub, W * 0.055, H * 0.3, W * 0.24, Math.max(3.4, H * 0.026),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function scroll(W, H, kit) {
    const out = [];
    const A = H * 0.6;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.2 });
    wash(out, W, H, kit, 'v10:fy-watercolor', { z: 1.0, o: 0.45 });

    for (let i = 0; i < 12; i += 1) {
        stk(out, kit, 'v10:fy-cloud', W * (0.04 + i * 0.083), H * (0.5 + (i % 2 ? 0.04 : -0.04)), H * 0.42,
            { z: 1.8 + (i % 3) * 0.02, o: 0.95 });
    }

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'blob', 3.8, { zoom: 1.03 });

    const spots = [0.11, 0.24, 0.37, 0.63, 0.76, 0.89];
    spots.forEach((t, i) => {
        const x = W * t;
        const y = H * (i % 2 ? 0.3 : 0.7);
        if (i % 3 === 0) {
            stk(out, kit, 'v10:fy-balloon', x, y, H * 0.32, { z: 6.2, r: i % 2 ? 8 : -8 });
        } else if (i % 3 === 1) {
            stk(out, kit, 'v10:fy-starsoft', x, y, H * 0.22, { z: 6.2, r: i * 12 });
        } else {
            const s = H * 0.26;
            mini(out, x - s / 2, y - s / 2, s, s, 'blob', 6.2, { zoom: 1.1, fx: 40 + i * 6 });
        }
    });

    for (let i = 0; i < 18; i += 1) {
        const x = W * (0.03 + i * 0.053);
        stk(out, kit, 'v10:fy-bubble', x, H * (i % 2 ? 0.06 : 0.94), H * 0.07, { z: 6, o: 0.85, r: i * 13 });
    }

    out.push(txt(kit.title, cx - A * 0.9, H * 0.1, A * 1.8, Math.max(4, H * 0.035),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 8 }));
    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function poster(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.2 });
    wash(out, W, H, kit, 'v10:fy-watercolor', { z: 0.5, o: 0.55 });
    wash(out, W, H, kit, 'v10:fy-paper', { z: 0.55, o: 0.4 });

    const scenes = [
        { x: 0.02, y: 0.5, w: 0.42, h: 0.46, id: 'v10:fy-grass' },
        { x: 0.03, y: 0.04, w: 0.4, h: 0.42, id: 'v10:fy-candy' },
        { x: 0.56, y: 0.03, w: 0.42, h: 0.42, id: 'v10:fy-balloon' },
        { x: 0.58, y: 0.52, w: 0.4, h: 0.44, id: 'v10:fy-house' },
    ];
    scenes.forEach((s, i) => {
        out.push(img('v10:fy-watercolor', W * s.x, H * s.y, W * s.w, H * s.h, { z: 0.9 + i * 0.05, r: i % 2 ? 3 : -3, o: 0.5, fit: 'fill' }));
    });

    const A = H * 0.58;
    const cx = W * 0.5;
    const cy = H * 0.46;
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'blob', 3.9, { zoom: 1.03 });

    stk(out, kit, 'v10:fy-grass', W * 0.2, H * 0.88, W * 0.34, { z: 6, r: 4 });
    stk(out, kit, 'v10:fy-candy', W * 0.1, H * 0.2, H * 0.15, { z: 6, r: -10 });
    stk(out, kit, 'v10:fy-cake', W * 0.28, H * 0.16, H * 0.16, { z: 6, r: 8 });
    stk(out, kit, 'v10:fy-balloon', W * 0.66, H * 0.14, H * 0.2, { z: 6, r: -6 });
    stk(out, kit, 'v10:fy-balloon', W * 0.78, H * 0.24, H * 0.16, { z: 6, r: 8 });
    stk(out, kit, 'v10:fy-rabbit', W * 0.9, H * 0.14, H * 0.16, { z: 6, r: 6 });
    stk(out, kit, 'v10:fy-house', W * 0.8, H * 0.78, H * 0.2, { z: 6, r: -4 });
    stk(out, kit, 'v10:fy-bear', W * 0.66, H * 0.84, H * 0.16, { z: 6, r: 8 });

    out.push(img('v10:fy-cloud', W * 0.16, H * 0.32, W * 0.26, H * 0.14, { z: 7, r: -6, o: 0.95, fit: 'fill' }));
    out.push(txt('hello!', W * 0.19, H * 0.36, W * 0.2, Math.max(4, H * 0.035),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 7.4, r: -6 }));
    out.push(img('v10:fy-cloud', W * 0.62, H * 0.62, W * 0.26, H * 0.13, { z: 7, r: 5, o: 0.95, fit: 'fill' }));
    out.push(txt('the end', W * 0.65, H * 0.655, W * 0.2, Math.max(3.6, H * 0.03),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 7.4, r: 5 }));

    for (let i = 0; i < 16; i += 1) {
        const x = W * (0.06 + ((i * 43) % 88) / 100);
        const y = H * (0.06 + ((i * 61) % 88) / 100);
        stk(out, kit, i % 2 ? 'v10:fy-starsoft' : 'v10:fy-cotton', x, y, H * (i % 2 ? 0.05 : 0.07),
            { z: 6.6, r: i * 17, o: 0.9 });
    }

    head(out, kit, kit.title, W * 0.04, H * 0.04, W * 0.24, H * 0.055, { align: 'center' });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

export const builds = { chip, compact, circle, polaroid, collage, tower, banner, scroll, poster };
