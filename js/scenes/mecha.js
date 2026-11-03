import { F, img, txt } from '../assets/base.js';
import {
    PAL, base, wash, sheet, plate, portrait, mini, stk, rail, tape, label, head, rule, mark,
    frame, corners, arcPos,
} from './kit.js';

export const style = {
    id: 'mecha',
    name: '工业废土',
    desc: '金属板 · 齿轮 · 刻度，机能档案卡',
    avatarShape: 'hexagon',
    layout: 'banner',
    palette: PAL(['#31363b', '#474e55', '#202428'], '#ccd2d8', '#8b939b', '#d9a13b', '#1c2024', '#b3bbc2', '#79828a', true),
    decos: ['v10:mt-gear', 'v10:mt-rivet', 'v10:mt-screw', 'v10:mt-chain', 'v10:mt-plate', 'v10:mt-crack'],
    glyphs: ['▣', '✕', '+', '//', '◤'],
    lace: '', laceRatio: 1,
    tapes: ['v10:mt-hazard', 'builtin:tape-black'],
    font: F.mono, subFont: F.mono,
    title: 'UNIT-07', sub: '{{name|SERIAL 2026}}', badge: '07',
    footer: 'maintenance log / do not remove', mark: ['2077', '0207'],
};

function chip(W, H, kit) {
    const out = [];
    const A = H * 0.6;
    const cx = W * 0.5;
    const cy = H * 0.52;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:mt-steel', { z: 1.0, o: 0.6 });

    out.push(img('v10:mt-plate', W * 0.012, H * 0.06, W * 0.976, H * 0.88, { z: 1.2, fit: 'fill' }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'hexagon', 3.6, { zoom: 1.04 });

    for (let i = 0; i < 9; i += 1) {
        const x = W * (0.06 + i * 0.11);
        stk(out, kit, 'v10:mt-rivet-dot', x, H * 0.1, H * 0.1, { z: 6.2 });
        stk(out, kit, 'v10:mt-rivet-dot', x, H * 0.9, H * 0.1, { z: 6.2 });
    }
    [0.3, 0.5, 0.7].forEach(y => {
        stk(out, kit, 'v10:mt-rivet-dot', W * 0.022, H * y, H * 0.1, { z: 6.2 });
        stk(out, kit, 'v10:mt-rivet-dot', W * 0.978, H * y, H * 0.1, { z: 6.2 });
    });

    out.push(txt('ARCHIVE 07-0207-A', cx - A * 0.8, H * 0.115, A * 1.6, Math.max(3.6, H * 0.062),
        { font: kit.subFont, color: kit.theme.onLight, align: 'center', z: 7.4 }));
    out.push(txt('▲ DO NOT REMOVE ▲', cx - A * 0.8, H * 0.875, A * 1.6, Math.max(3.2, H * 0.055),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 7.4 }));

    stk(out, kit, 'v10:mt-webbing', W * 0.155, H * 0.5, H * 0.52, { z: 6, r: 68, o: 0.92 });
    stk(out, kit, 'v10:mt-webbing', W * 0.845, H * 0.5, H * 0.52, { z: 6, r: -68, o: 0.92 });
    stk(out, kit, 'v10:mt-screw', W * 0.12, H * 0.24, H * 0.09, { z: 6.4 });
    stk(out, kit, 'v10:mt-screw', W * 0.88, H * 0.24, H * 0.09, { z: 6.4 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function compact(W, H, kit) {
    const out = [];
    const A = H * 0.54;
    const cx = W * 0.5;
    const cy = H * 0.46;

    base(W, H, kit, out, { paper: false, grainO: 0.28 });
    out.push(img('v10:mt-kraft', 0, 0, W, H, { z: 0.5, fit: 'fill' }));
    wash(out, W, H, kit, 'v10:mt-frost', { z: 1.0, o: 0.4 });
    wash(out, W, H, kit, 'v10:mt-canvas', { z: 1.1, o: 0.25 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'hexagon', 3.6, { zoom: 1.04 });

    [[0.06, 0.07], [0.94, 0.07], [0.06, 0.93], [0.94, 0.93]].forEach(([x, y]) =>
        stk(out, kit, 'v10:mt-rivet-dot', W * x, H * y, H * 0.11, { z: 6.4 }));

    stk(out, kit, 'v10:mt-gear', W * 0.16, H * 0.8, H * 0.26, { z: 6.2, r: -14 });
    stk(out, kit, 'v10:mt-gear', W * 0.26, H * 0.9, H * 0.15, { z: 6.3, r: 22 });

    stk(out, kit, 'v10:mt-barcode', W * 0.88, H * 0.78, H * 0.28, { z: 6.4, r: 90 });

    stk(out, kit, 'v10:mt-tape', W * 0.06, H * 0.36, H * 0.36, { z: 6.2, r: 90 });

    [[0.3, 0.68], [0.36, 0.62], [0.24, 0.7]].forEach(([x, y], i) =>
        stk(out, kit, 'v10:mt-screw', W * x, H * y, H * 0.06, { z: 6.6, r: i * 30 }));

    out.push(txt('07-0207', W * 0.66, H * 0.06, W * 0.28, Math.max(3.4, H * 0.038),
        { font: kit.subFont, color: kit.theme.onLight, align: 'center', z: 7.4, r: 3 }));
    stk(out, kit, 'v10:mt-bolt', W * 0.4, H * 0.94, W * 0.34, { z: 6.6, o: 0.9 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function circle(W, H, kit) {
    const out = [];
    const A = Math.min(W, H) * 0.54;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.28 });
    wash(out, W, H, kit, 'v10:mt-circuit', { z: 1.0, o: 0.65 });

    for (let i = 0; i < 60; i += 1) {
        const p = arcPos(cx, cy, Math.min(W, H) * 0.465, Math.min(W, H) * 0.465, (i / 60) * 360);
        const long = i % 5 === 0;
        const w = long ? W * 0.014 : W * 0.007;
        const h = long ? H * 0.06 : H * 0.035;
        out.push(img('v10:mt-gauge', p.x - w / 2, p.y - h / 2, w, h,
            { z: 5.6, r: p.r, o: long ? 0.95 : 0.7, fit: 'fill' }));
    }

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 3.6, { zoom: 1.03 });

    [[30, 0.3, 0.22], [140, 0.32, 0.16], [235, 0.31, 0.2], [320, 0.33, 0.13]].forEach(([deg, r, s], i) => {
        const p = arcPos(cx, cy, Math.min(W, H) * r, Math.min(W, H) * r, deg);
        stk(out, kit, 'v10:mt-gear', p.x, p.y, A * s * 1.4, { z: 6, r: i * 24 });
    });

    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function polaroid(W, H, kit) {
    const out = [];
    const fx = W * 0.085;
    const fy = H * 0.065;
    const fw = W * 0.83;
    const fh = H * 0.7;
    const A = Math.min(fw, fh) * 0.68;
    const cx = fx + fw / 2;
    const cy = fy + fh / 2;

    base(W, H, kit, out, { paper: false, grainO: 0.28 });

    out.push(img('v10:mt-steel', W * 0.025, H * 0.018, W * 0.95, H * 0.958, { z: 0.8, r: 1.6, fit: 'fill' }));
    out.push(img('v10:mt-plate', W * 0.035, H * 0.026, W * 0.93, H * 0.944, { z: 0.9, r: 1, fit: 'fill' }));
    out.push(img('v10:mt-crack', W * 0.04, H * 0.03, W * 0.22, H * 0.18, { z: 1.0, o: 0.5 }));
    out.push(img('v10:mt-crack', W * 0.78, H * 0.8, W * 0.2, H * 0.16, { z: 1.0, o: 0.45, r: 180 }));

    out.push(img('v10:mt-frost', fx, fy, fw, fh, { z: 1.2, r: 0.4, fit: 'fill' }));
    out.push(img('v10:mt-circuit', fx, fy, fw, fh, { z: 1.3, r: 0.4, o: 0.3, fit: 'fill' }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'hexagon', 3.6, { zoom: 1.02 });

    out.push(txt('ARCHIVE 07-0207-A / UNIT 07', W * 0.012, H * 0.2, W * 0.06, Math.max(3, H * 0.024),
        { font: kit.subFont, color: kit.theme.onLight, r: 90, z: 7.4 }));
    out.push(txt('SERIAL 2077', W * 0.958, H * 0.24, W * 0.06, Math.max(3, H * 0.024),
        { font: kit.subFont, color: kit.theme.onLight, r: 90, z: 7.4 }));
    stk(out, kit, 'v10:mt-barcode', W * 0.06, H * 0.78, H * 0.2, { z: 7, r: 90 });
    stk(out, kit, 'v10:mt-barcode', W * 0.94, H * 0.72, H * 0.2, { z: 7, r: 90 });

    [[0.05, 0.05], [0.95, 0.05], [0.05, 0.95], [0.95, 0.95]].forEach(([x, y]) =>
        stk(out, kit, 'v10:mt-screw', W * x, H * y, H * 0.075, { z: 7.2 }));

    stk(out, kit, 'v10:mt-bolt', W * 0.5, H * 0.9, W * 0.5, { z: 6.8, o: 0.85 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function collage(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:mt-steel', { z: 0.6, o: 0.6 });

    const frags = [
        { x: 0.02, y: 0.04, w: 0.34, h: 0.44, r: -5 },
        { x: 0.32, y: 0.02, w: 0.34, h: 0.42, r: 4 },
        { x: 0.64, y: 0.05, w: 0.34, h: 0.42, r: -3 },
        { x: 0.05, y: 0.5, w: 0.38, h: 0.46, r: 3 },
        { x: 0.5, y: 0.46, w: 0.46, h: 0.5, r: -2 },
    ];
    frags.forEach((f, i) => {
        out.push(img('v10:mt-frag', W * f.x, H * f.y, W * f.w, H * f.h, { z: 1.3 + i * 0.08, r: f.r, o: 0.98, fit: 'fill' }));
        out.push(img('v10:mt-canvas', W * f.x, H * f.y, W * f.w, H * f.h, { z: 1.32 + i * 0.08, r: f.r, o: 0.3, fit: 'fill' }));
    });

    frags.forEach((f, i) => {
        const s = Math.min(W * f.w, H * f.h) * 0.66;
        mini(out, W * (f.x + f.w / 2) - s / 2, H * (f.y + f.h / 2) - s / 2, s, s, 'hexagon',
            3.2 + i * 0.1, { zoom: 1.1, fx: 38 + i * 9, fy: 42 + (i % 3) * 8 });
    });

    const A = H * 0.52;
    const cx = W * 0.47;
    const cy = H * 0.46;
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'hexagon', 4.4, { zoom: 1.03 });

    stk(out, kit, 'v10:mt-gear', W * 0.31, H * 0.3, H * 0.16, { z: 4.6, r: -20 });
    stk(out, kit, 'v10:mt-chain', W * 0.66, H * 0.28, W * 0.16, { z: 4.6, r: 22 });
    stk(out, kit, 'v10:mt-gear', W * 0.7, H * 0.72, H * 0.13, { z: 4.6, r: 16 });
    stk(out, kit, 'v10:mt-chain', W * 0.2, H * 0.74, W * 0.14, { z: 4.6, r: -18 });
    stk(out, kit, 'v10:mt-screw', W * 0.5, H * 0.9, H * 0.06, { z: 4.7 });

    out.push(txt('07-A', W * 0.06, H * 0.08, W * 0.2, Math.max(4, H * 0.038),
        { font: kit.subFont, color: kit.theme.onLight, z: 7.4, r: -5 }));
    out.push(txt('B-2077', W * 0.74, H * 0.08, W * 0.2, Math.max(4, H * 0.034),
        { font: kit.subFont, color: kit.theme.onLight, z: 7.4, r: -3 }));
    stk(out, kit, 'v10:mt-bolt', W * 0.18, H * 0.94, W * 0.28, { z: 6.8, o: 0.9 });
    stk(out, kit, 'v10:mt-bolt', W * 0.78, H * 0.92, W * 0.26, { z: 6.8, o: 0.9 });
    stk(out, kit, 'v10:mt-barcode', W * 0.94, H * 0.42, H * 0.2, { z: 6.8, r: 90 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function tower(W, H, kit) {
    const out = [];
    const A = W * 0.6;
    const cx = W * 0.54;
    const cy = H * 0.44;

    base(W, H, kit, out, { m: 0.02, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:mt-canvas', { z: 1.0, o: 0.4 });
    wash(out, W, H, kit, 'v10:mt-circuit', { z: 1.1, o: 0.3 });

    out.push(img('v10:mt-plate', W * 0.1, H * 0.012, W * 0.8, H * 0.052, { z: 7, fit: 'fill' }));
    out.push(txt('ARCHIVE 07-0207', W * 0.14, H * 0.021, W * 0.72, Math.max(4, H * 0.024),
        { font: kit.subFont, color: kit.theme.onLight, align: 'center', z: 7.4 }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'hexagon', 3.6, { zoom: 1.03 });

    stk(out, kit, 'v10:mt-tape', W * 0.075, H * 0.5, H * 0.9, { z: 6, r: 90 });

    stk(out, kit, 'v10:mt-webbing', W * 0.16, H * 0.14, W * 0.06, { z: 6.2, r: 90 });
    stk(out, kit, 'v10:mt-lock', W * 0.17, H * 0.3, H * 0.1, { z: 6.2, r: -8 });
    stk(out, kit, 'v10:mt-plate', W * 0.16, H * 0.44, H * 0.12, { z: 6.2, r: 90 });
    stk(out, kit, 'v10:mt-webbing', W * 0.17, H * 0.58, W * 0.06, { z: 6.2, r: 90 });
    stk(out, kit, 'v10:mt-lock', W * 0.17, H * 0.72, H * 0.1, { z: 6.2, r: 6 });
    stk(out, kit, 'v10:mt-plate', W * 0.16, H * 0.86, H * 0.11, { z: 6.2, r: 90 });

    [0.1, 0.22, 0.36, 0.52, 0.66, 0.8, 0.92].forEach((y, i) =>
        stk(out, kit, i % 2 ? 'v10:mt-gear' : 'v10:mt-screw', W * (0.92 - (i % 2) * 0.03), H * y,
            H * (i % 2 ? 0.055 : 0.05), { z: 6.2, r: i * 24 }));

    stk(out, kit, 'v10:mt-bolt', cx, H * 0.19, W * 0.42, { z: 6.6, o: 0.9 });
    stk(out, kit, 'v10:mt-bolt', cx, H * 0.72, W * 0.42, { z: 6.6, o: 0.9 });
    out.push(txt(kit.mark[0], W * 0.3, H * 0.945, W * 0.4, Math.max(3.6, H * 0.016),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8 }));

    stk(out, kit, 'v10:mt-gear', W * 0.82, H * 0.13, H * 0.12, { z: 6.4, r: 14 });
    stk(out, kit, 'v10:mt-screw', W * 0.2, H * 0.075, H * 0.07, { z: 6.4 });
    stk(out, kit, 'v10:mt-plate', W * 0.22, H * 0.9, W * 0.17, { z: 6.4, r: -6 });
    stk(out, kit, 'v10:mt-barcode', W * 0.74, H * 0.91, W * 0.15, { z: 6.4, r: 4 });
    stk(out, kit, 'v10:mt-bolt', W * 0.5, H * 0.968, W * 0.72, { z: 6.4, o: 0.8 });
    stk(out, kit, 'v10:mt-holes', W * 0.06, H * 0.42, W * 0.1, { z: 6.2, o: 0.7 });

    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function banner(W, H, kit) {
    const out = [];
    const A = W * 0.29;
    const cx = W * 0.5;
    const cy = H * 0.47;

    base(W, H, kit, out, { m: 0.016, grainO: 0.28 });
    wash(out, W, H, kit, 'v10:mt-steel', { z: 1.0, o: 0.55 });
    wash(out, W, H, kit, 'v10:mt-canvas', { z: 1.1, o: 0.25 });

    out.push(img('v10:mt-circuit', 0, H * 0.3, W, H * 0.22, { z: 2.2, o: 0.9, fit: 'fill' }));
    out.push(img('v10:mt-circuit', 0, H * 0.5, W, H * 0.22, { z: 2.2, o: 0.75, r: 180, fit: 'fill' }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'hexagon', 3.8, { zoom: 1.03 });

    [[0.1, 0.24, 'v10:mt-gear', 0.18], [0.2, 0.72, 'v10:mt-lock', 0.14], [0.32, 0.28, 'v10:mt-screw', 0.07],
        [0.7, 0.26, 'v10:mt-screw', 0.07], [0.8, 0.7, 'v10:mt-gear', 0.16], [0.9, 0.3, 'v10:mt-lock', 0.13]]
        .forEach(([x, y, id, s], i) => stk(out, kit, id, W * x, H * y, H * s, { z: 6.2, r: i * 26 }));

    [[0.08, 0.06], [0.3, 0.05], [0.56, 0.06], [0.82, 0.05]].forEach(([x, y], i) =>
        stk(out, kit, 'v10:mt-patch', W * x, H * y, W * 0.14, { z: 6.4, r: i % 2 ? 4 : -4 }));
    stk(out, kit, 'v10:mt-barcode', W * 0.15, H * 0.93, W * 0.15, { z: 6.4, r: 2 });
    stk(out, kit, 'v10:mt-barcode', W * 0.72, H * 0.94, W * 0.15, { z: 6.4, r: -2 });
    stk(out, kit, 'v10:mt-hazard', W * 0.44, H * 0.945, W * 0.18, { z: 6.4, r: -2 });
    stk(out, kit, 'v10:mt-hazard', W * 0.44, H * 0.045, W * 0.18, { z: 6.4, r: 2 });

    stk(out, kit, 'v10:mt-gear', W * 0.07, H * 0.2, H * 0.2, { z: 6.6, r: 12 });
    stk(out, kit, 'v10:mt-gear', W * 0.93, H * 0.78, H * 0.18, { z: 6.6, r: -14 });
    stk(out, kit, 'v10:mt-screw', W * 0.05, H * 0.82, H * 0.1, { z: 6.6 });
    stk(out, kit, 'v10:mt-screw', W * 0.95, H * 0.18, H * 0.1, { z: 6.6 });
    stk(out, kit, 'v10:mt-plate', W * 0.2, H * 0.12, W * 0.13, { z: 6.4, r: -6 });
    stk(out, kit, 'v10:mt-plate', W * 0.8, H * 0.88, W * 0.13, { z: 6.4, r: 8 });

    head(out, kit, kit.title, W * 0.055, H * 0.72, W * 0.28, H * 0.07, { band: true, br: -0.6 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function scroll(W, H, kit) {
    const out = [];
    const A = H * 0.62;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.28 });

    out.push(img('v10:mt-webbing', 0, H * 0.18, W, H * 0.64, { z: 1.2, fit: 'fill' }));
    out.push(img('v10:mt-canvas', 0, H * 0.18, W, H * 0.64, { z: 1.3, o: 0.3, fit: 'fill' }));

    for (let i = 0; i < 26; i += 1) {
        stk(out, kit, 'v10:mt-rivet-dot', W * (0.02 + i * 0.038), H * 0.5, H * 0.1, { z: 2.4 });
    }

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'hexagon', 3.8, { zoom: 1.03 });

    const step = rail(W, A, 4.4);
    [-1, 1].forEach(dir => {
        stk(out, kit, 'v10:mt-chain', cx + dir * step * 1, H * 0.5, A * 0.5, { z: 6.2, r: dir > 0 ? 0 : 180 });
        const s = H * 0.28;
        mini(out, cx + dir * step * 2 - s / 2, H * 0.5 - s / 2, s, s, 'hexagon', 6.2,
            { zoom: 1.12, fx: dir > 0 ? 58 : 42, fy: 46 });
        out.push(txt(dir > 0 ? 'B-2077' : 'A-0207', cx + dir * step * 3 - A * 0.28, H * 0.42, A * 0.56,
            Math.max(4, H * 0.09), { font: kit.subFont, color: kit.theme.onDark, align: 'center', z: 7.4 }));
        stk(out, kit, 'v10:mt-gear', cx + dir * step * 3.7, H * 0.5, A * 0.3, { z: 6.2, r: dir * 18 });
        stk(out, kit, 'v10:mt-screw', cx + dir * step * 4.4, H * 0.5, H * 0.11, { z: 6.2 });
    });

    stk(out, kit, 'v10:mt-bolt', W * 0.5, H * 0.08, W * 0.94, { z: 6.6, o: 0.85 });
    stk(out, kit, 'v10:mt-bolt', W * 0.5, H * 0.92, W * 0.94, { z: 6.6, o: 0.85 });

    out.push(txt('MAINTENANCE LOG', W * 0.02, H * 0.12, W * 0.2, Math.max(3.4, H * 0.028),
        { font: kit.subFont, color: kit.theme.onDark, z: 7.6, o: 0.85 }));
    out.push(txt('DO NOT REMOVE', W * 0.78, H * 0.84, W * 0.2, Math.max(3.4, H * 0.028),
        { font: kit.subFont, color: kit.theme.onDark, align: 'right', z: 7.6, o: 0.85 }));
    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function poster(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:mt-circuit', { z: 0.5, o: 0.55 });
    wash(out, W, H, kit, 'v10:mt-steel', { z: 0.55, o: 0.3 });

    [[0.02, 0.03, -4], [0.7, 0.02, 3], [0.03, 0.62, 4], [0.72, 0.6, -3]].forEach(([x, y, r]) =>
        out.push(img('v10:mt-frag', W * x, H * y, W * 0.28, H * 0.36, { z: 1.2, r, o: 0.95, fit: 'fill' })));

    const A = H * 0.58;
    const cx = W * 0.5;
    const cy = H * 0.47;
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'hexagon', 4.0, { zoom: 1.03 });

    stk(out, kit, 'v10:mt-gear', W * 0.1, H * 0.2, H * 0.24, { z: 6, r: -12 });
    stk(out, kit, 'v10:mt-gear', W * 0.18, H * 0.3, H * 0.15, { z: 6.1, r: 20 });
    stk(out, kit, 'v10:mt-gear', W * 0.05, H * 0.34, H * 0.1, { z: 6.1, r: 8 });

    stk(out, kit, 'v10:mt-plate', W * 0.84, H * 0.16, W * 0.2, { z: 6, r: -3 });
    out.push(txt('UNIT-07', W * 0.76, H * 0.13, W * 0.16, Math.max(4, H * 0.032),
        { font: kit.subFont, color: kit.theme.onLight, align: 'center', z: 7.4, r: -3 }));
    stk(out, kit, 'v10:mt-barcode', W * 0.9, H * 0.3, H * 0.2, { z: 6.2, r: 90 });

    stk(out, kit, 'v10:mt-lock', W * 0.1, H * 0.76, H * 0.2, { z: 6, r: -8 });
    stk(out, kit, 'v10:mt-webbing', W * 0.19, H * 0.84, W * 0.16, { z: 6.1, r: -14 });
    stk(out, kit, 'v10:mt-screw', W * 0.06, H * 0.9, H * 0.07, { z: 6.2 });

    stk(out, kit, 'v10:mt-barcode', W * 0.85, H * 0.8, W * 0.14, { z: 6, r: 4 });
    stk(out, kit, 'v10:mt-patch', W * 0.92, H * 0.88, W * 0.1, { z: 6.1, r: -6 });
    stk(out, kit, 'v10:mt-gear', W * 0.75, H * 0.9, H * 0.1, { z: 6.1, r: 24 });

    stk(out, kit, 'v10:mt-circuit', W * 0.26, H * 0.2, W * 0.18, { z: 6.6, r: 26, o: 0.85 });
    stk(out, kit, 'v10:mt-circuit', W * 0.74, H * 0.2, W * 0.18, { z: 6.6, r: -26, o: 0.85 });
    stk(out, kit, 'v10:mt-circuit', W * 0.26, H * 0.78, W * 0.18, { z: 6.6, r: -22, o: 0.85 });
    stk(out, kit, 'v10:mt-circuit', W * 0.74, H * 0.78, W * 0.18, { z: 6.6, r: 22, o: 0.85 });

    for (let i = 0; i < 30; i += 1) {
        const t = i / 30;
        const edge = i % 4;
        const x = edge < 2 ? W * (0.04 + t * 0.92) : W * (edge === 2 ? 0.02 : 0.98);
        const y = edge < 2 ? H * (edge === 0 ? 0.025 : 0.975) : H * (0.05 + t * 0.9);
        stk(out, kit, i % 3 === 0 ? 'v10:mt-screw' : 'v10:mt-rivet-dot', x, y, H * 0.045, { z: 6.8 });
    }

    head(out, kit, kit.title, W * 0.045, H * 0.9, W * 0.24, H * 0.05, { band: true, br: -0.6 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

export const builds = { chip, compact, circle, polaroid, collage, tower, banner, scroll, poster };
