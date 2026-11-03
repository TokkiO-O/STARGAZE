import { F, img, txt } from '../assets/base.js';
import {
    PAL, base, wash, plate, sheet, portrait, mini, stk, strip, column, rail, tape,
    label, head, rule, mark, frame, corners, arcPos, scatter, lineUp,
} from './kit.js';

export const style = {
    id: 'school',
    name: '奶盐学园',
    desc: '活页孔 · 索引贴 · 樱花，日系校园手账',
    avatarShape: 'circle',
    layout: 'collage',
    palette: PAL(['#eaf4fc', '#dbeaf7', '#cfe2f2'], '#fdfcf6', '#d7e6f4', '#7fb0d6', '#3b5468', '#e9f3fb', '#ffffff', true),
    decos: ['v10:school-sakura', 'v10:school-index', 'v10:school-clip', 'v10:school-star', 'v10:school-cloud', 'v10:school-bow'],
    glyphs: ['✦', '✎', '♡', '✧', '☁', '❀'],
    lace: 'builtin:doily', laceRatio: 0.62,
    tapes: ['v10:school-tape', 'v10:school-washi'],
    font: F.hand, subFont: F.mono,
    title: 'MILK DAY', sub: '{{name|MILK & SALT}}', badge: '01',
    footer: 'designed by STARGAZE', mark: ['2004', '0408'],
};

function chip(W, H, kit) {
    const out = [];
    const A = H * 0.55;
    const cx = W * 0.5;
    const cy = H * 0.54;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:school-grid', { z: 1.0, o: 0.34 });
    wash(out, W, H, kit, 'v10:school-vellum', { z: 1.1, o: 0.2 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 3.2, { zoom: 1.04 });

    const iw = W * 0.35;
    const ih = H * 0.2;
    const ix = cx - iw * 0.56;
    out.push(img('v10:school-index', ix, H * 0.022, iw, ih, { z: 7, r: -2.2, fit: 'fill' }));
    out.push(txt(kit.sub, ix + iw * 0.1, H * 0.022 + ih * 0.16, iw * 0.72, Math.max(4, H * 0.075),
        { font: kit.subFont, color: kit.theme.onLight, z: 7.4, r: -2.2 }));

    const dw = W * 0.26;
    out.push(img('v10:school-index-kraft', cx - dw / 2, H * 0.855, dw, H * 0.115, { z: 7, r: 1.4, fit: 'fill' }));
    out.push(txt(kit.mark[1], cx - dw / 2, H * 0.868, dw, Math.max(3.6, H * 0.062),
        { font: kit.subFont, color: kit.theme.onLight, align: 'center', z: 7.4, r: 1.4 }));

    stk(out, kit, 'v10:school-clip', W * 0.028, H * 0.5, H * 0.52, { z: 6, r: -8 });
    stk(out, kit, 'v10:school-clip', W * 0.972, H * 0.5, H * 0.52, { z: 6, r: 8 });

    [W * 0.095, W * 0.145].forEach((x, i) => {
        stk(out, kit, 'v10:school-hole', x, H * (0.24 + i * 0.02), H * 0.2, { z: 6.4 });
        stk(out, kit, 'v10:school-hole', x, H * (0.76 - i * 0.02), H * 0.2, { z: 6.4 });
        stk(out, kit, 'v10:school-hole', W - x, H * (0.24 + i * 0.02), H * 0.2, { z: 6.4 });
        stk(out, kit, 'v10:school-hole', W - x, H * (0.76 - i * 0.02), H * 0.2, { z: 6.4 });
    });

    [
        ['v10:school-petal', W * 0.215, H * 0.24, 0.16, -18],
        ['v10:school-sakura', W * 0.235, H * 0.62, 0.15, 12],
        ['v10:school-star', W * 0.2, H * 0.46, 0.13, 8],
        ['v10:school-petal', W * 0.79, H * 0.2, 0.15, 24],
        ['v10:school-sakura', W * 0.775, H * 0.66, 0.16, -10],
        ['v10:school-star', W * 0.8, H * 0.42, 0.12, -6],
    ].forEach(([id, x, y, s, r]) => stk(out, kit, id, x, y, H * s, { z: 6, r }));

    rule(out, kit, W * 0.02, H * 0.955, W * 0.96, H * 0.008, { o: 0.28 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function compact(W, H, kit) {
    const out = [];
    const A = W * 0.4;
    const cx = W * 0.635;
    const cy = H * 0.635;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:school-grid', { z: 1.0, o: 0.55 });
    wash(out, W, H, kit, 'v10:school-vellum', { z: 1.1, o: 0.22 });

    const s1w = W * 0.15;
    const s1h = H * 0.44;
    mini(out, W * 0.045, H * 0.075, s1w, s1h, 'polaroid', -13, 3.4, { zoom: 1.1, fx: 38, fy: 44 });
    mini(out, W * 0.135, H * 0.045, s1w * 0.92, s1h * 0.9, 'torn', 9, 3.7, { zoom: 1.16, fx: 44, fy: 40 });
    tape(out, kit, kit.tapes[0], W * 0.1, H * 0.075, W * 0.13, { r: -12, z: 6 });

    out.push(img('v10:school-index', W * 0.03, H * 0.02, W * 0.2, H * 0.055, { z: 7, r: -11, fit: 'fill' }));
    out.push(txt(kit.mark[0], W * 0.045, H * 0.028, W * 0.16, Math.max(3.4, H * 0.036),
        { font: kit.subFont, color: kit.theme.onLight, z: 7.4, r: -11 }));
    out.push(img('v10:school-index-kraft', W * 0.075, H * 0.5, W * 0.17, H * 0.05, { z: 7, r: 8, fit: 'fill' }));
    out.push(txt(kit.mark[1], W * 0.09, H * 0.507, W * 0.13, Math.max(3.2, H * 0.034),
        { font: kit.subFont, color: kit.theme.onLight, z: 7.4, r: 8 }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 3.6, { zoom: 1.03 });

    out.push(img('v10:school-index', W * 0.3, H * 0.012, W * 0.26, H * 0.048, { z: 7, r: 2, fit: 'fill' }));
    out.push(txt('NOTE 04', W * 0.33, H * 0.019, W * 0.2, Math.max(3.2, H * 0.032),
        { font: kit.subFont, color: kit.theme.onLight, z: 7.4, r: 2 }));

    out.push(img('v10:school-index-kraft', W * 0.008, H * 0.34, W * 0.05, H * 0.2, { z: 7, r: 88, fit: 'fill' }));
    out.push(txt('0408', W * 0.014, H * 0.4, W * 0.04, Math.max(3, H * 0.03),
        { font: kit.subFont, color: kit.theme.onLight, z: 7.4, r: 88 }));

    out.push(img('v10:school-index', W * 0.3, H * 0.94, W * 0.22, H * 0.045, { z: 7, r: -1.6, fit: 'fill' }));
    out.push(txt('MILK & SALT', W * 0.325, H * 0.946, W * 0.17, Math.max(3, H * 0.03),
        { font: kit.subFont, color: kit.theme.onLight, z: 7.4, r: -1.6 }));

    stk(out, kit, 'v10:school-bulldog', W * 0.845, H * 0.115, H * 0.3, { z: 6.6, r: 14 });

    stk(out, kit, 'v10:school-ruler', W * 0.135, H * 0.86, W * 0.26, { z: 6.2, r: -24 });
    stk(out, kit, 'v10:school-star', W * 0.245, H * 0.795, H * 0.085, { z: 6.4, r: 10 });
    stk(out, kit, 'v10:school-star', W * 0.085, H * 0.775, H * 0.07, { z: 6.4, r: -14 });

    stk(out, kit, 'v10:school-sakura', W * 0.375, H * 0.325, H * 0.13, { z: 6.6, r: 12 });

    stk(out, kit, 'v10:school-star', W * 0.9, H * 0.42, H * 0.07, { z: 6.2, r: 8 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function circle(W, H, kit) {
    const out = [];
    const A = Math.min(W, H) * 0.6;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:school-grid', { z: 1.0, o: 0.4 });
    wash(out, W, H, kit, 'v10:school-vellum', { z: 1.1, o: 0.2 });

    const rx = Math.min(W, H) * 0.415;
    const ry = rx;
    const ring = [
        { deg: 12, kind: 'stamp' }, { deg: 58, kind: 'tag' }, { deg: 104, kind: 'sakura' },
        { deg: 150, kind: 'star' }, { deg: 196, kind: 'stamp' }, { deg: 242, kind: 'tag' },
        { deg: 288, kind: 'sakura' }, { deg: 334, kind: 'star' },
    ];
    ring.forEach((item, i) => {
        const p = arcPos(cx, cy, rx, ry, item.deg);
        const r = item.deg + 90;
        if (item.kind === 'stamp') {
            const s = A * 0.42;
            stk(out, kit, 'v10:school-stampedge', p.x, p.y, s, { z: 5 + i * 0.02, r: r * 0.12 });
        } else if (item.kind === 'sakura') {
            stk(out, kit, 'v10:school-sakura', p.x, p.y, A * 0.28, { z: 5.1, r: r * 0.4 });
        } else if (item.kind === 'star') {
            stk(out, kit, 'v10:school-star', p.x, p.y, A * 0.2, { z: 5.1, r: r * 0.5 });
        } else {
            const tw = A * 0.5;
            out.push(img('v10:school-index', p.x - tw / 2, p.y - A * 0.06, tw, A * 0.12,
                { z: 5.2, r: r * 0.22, fit: 'fill' }));
            out.push(txt(i % 4 === 1 ? 'NOTE' : 'MILK', p.x - tw * 0.4, p.y - A * 0.035, tw * 0.8,
                Math.max(3, A * 0.075), { font: kit.subFont, color: kit.theme.onLight, z: 5.3, r: r * 0.22 }));
        }
    });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 3.6, { zoom: 1.03 });

    [0, 90, 180, 270].forEach((deg, i) => {
        const p = arcPos(cx, cy, Math.min(W, H) * 0.475, Math.min(W, H) * 0.475, deg);
        stk(out, kit, 'v10:school-hole', p.x, p.y, A * 0.16, { z: 6.2, r: i * 12 });
    });

    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function polaroid(W, H, kit) {
    const out = [];

    const fx = W * 0.085;
    const fy = H * 0.07;
    const fw = W * 0.83;
    const fh = H * 0.71;
    const A = Math.min(fw, fh) * 0.7;
    const cx = fx + fw / 2;
    const cy = fy + fh / 2;

    base(W, H, kit, out, { paper: false, grainO: 0.3 });

    out.push(img('v10:school-index-kraft', W * 0.03, H * 0.02, W * 0.94, H * 0.95, { z: 0.8, r: 2.4, o: 0.9, fit: 'fill' }));
    out.push(img('v10:school-loose', W * 0.045, H * 0.032, W * 0.91, H * 0.92, { z: 1, r: 1, fit: 'fill' }));

    out.push(img('v10:school-loose', fx, fy, fw, fh, { z: 1.2, r: 0.6, fit: 'fill' }));
    out.push(img('v10:school-vellum', fx, fy, fw, fh, { z: 1.3, r: 0.6, o: 0.24, fit: 'fill' }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'polaroid', 3.4, { zoom: 1.02, caption: kit.mark[1] });

    const bw = W * 0.8;
    const bh = H * 0.115;
    out.push(img('v10:school-bookmark', W * 0.1, H * 0.825, bw, bh, { z: 7, r: -1.2, fit: 'fill' }));
    out.push(txt(`${kit.mark[0]} / ${kit.mark[1]}  MILK & SALT`, W * 0.14, H * 0.852, bw * 0.72,
        Math.max(3.6, H * 0.045), { font: kit.subFont, color: kit.theme.onLight, align: 'center', z: 7.4, r: -1.2 }));

    stk(out, kit, 'v10:school-clip', W * 0.065, H * 0.875, H * 0.16, { z: 7.2, r: -16 });
    stk(out, kit, 'v10:school-clip', W * 0.94, H * 0.875, H * 0.16, { z: 7.2, r: 14 });

    [['v10:school-star', 0.29], ['v10:school-sakura', 0.5], ['v10:school-clip', 0.71]].forEach(([id, y], i) => {
        stk(out, kit, id, W * 0.045, H * y, H * (id.includes('clip') ? 0.13 : 0.1), { z: 6.4, r: i * 8 - 8 });
        stk(out, kit, id, W * 0.955, H * (y + 0.02), H * (id.includes('clip') ? 0.13 : 0.1), { z: 6.4, r: 8 - i * 8 });
    });

    out.push(img('v10:school-index', W * 0.3, H * 0.008, W * 0.34, H * 0.05, { z: 7, r: -1.8, fit: 'fill' }));
    out.push(txt(kit.title, W * 0.34, H * 0.016, W * 0.26, Math.max(3.4, H * 0.032),
        { font: kit.subFont, color: kit.theme.onLight, align: 'center', z: 7.4, r: -1.8 }));

    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function collage(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:school-grid', { z: 0.7, o: 0.42 });

    sheet(out, kit, W * 0.055, H * 0.42, W * 0.66, H * 0.52, { z: 1.5, r: -2.6, id: 'v10:school-loose' });

    sheet(out, kit, W * 0.32, H * 0.03, W * 0.3, H * 0.78, { z: 1.8, r: 3.4, id: 'v10:school-loose' });

    sheet(out, kit, W * 0.03, H * 0.03, W * 0.26, H * 0.34, { z: 1.6, r: -6, id: 'v10:school-loose' });
    sheet(out, kit, W * 0.74, H * 0.55, W * 0.24, H * 0.4, { z: 2.0, r: 5.4, id: 'v10:school-loose' });
    wash(out, W, H, kit, 'v10:school-vellum', { z: 2.05, o: 0.16 });

    const A = H * 0.52;
    const cx = W * 0.46;
    const cy = H * 0.46;
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 3.6, { zoom: 1.03 });

    mini(out, W * 0.055, H * 0.07, W * 0.16, H * 0.26, 'polaroid', -9, 3.2, { zoom: 1.12, fx: 40, fy: 42 });
    out.push(img('v10:school-index', W * 0.04, H * 0.335, W * 0.19, H * 0.055, { z: 7, r: -6, fit: 'fill' }));
    out.push(txt('SIDE / 04', W * 0.055, H * 0.345, W * 0.15, Math.max(3.4, H * 0.028),
        { font: kit.subFont, color: kit.theme.onLight, z: 7.4, r: -6 }));

    mini(out, W * 0.755, H * 0.575, W * 0.15, H * 0.24, 'torn', 7, 3.4, { zoom: 1.2, fx: 55, fy: 62 });
    out.push(img('v10:school-index-kraft', W * 0.73, H * 0.83, W * 0.21, H * 0.055, { z: 7, r: 5, fit: 'fill' }));
    out.push(txt('HAND / 0408', W * 0.745, H * 0.84, W * 0.17, Math.max(3.2, H * 0.027),
        { font: kit.subFont, color: kit.theme.onLight, z: 7.4, r: 5 }));

    out.push(img('v10:school-index', W * 0.2, H * 0.63, W * 0.44, H * 0.06, { z: 7.6, r: -1.6, fit: 'fill' }));
    out.push(txt('MILK & SALT · A PAGE OF APRIL', W * 0.23, H * 0.641, W * 0.38, Math.max(3.4, H * 0.028),
        { font: kit.subFont, color: kit.theme.onLight, z: 8, r: -1.6 }));

    stk(out, kit, 'v10:school-ring', W * 0.318, H * 0.3, H * 0.13, { z: 4.2, r: 88 });
    stk(out, kit, 'v10:school-ring', W * 0.66, H * 0.58, H * 0.12, { z: 4.2, r: 88 });
    stk(out, kit, 'v10:school-bulldog', W * 0.3, H * 0.8, H * 0.15, { z: 4.4, r: -18 });
    stk(out, kit, 'v10:school-bulldog', W * 0.7, H * 0.11, H * 0.13, { z: 4.4, r: 22 });

    stk(out, kit, 'v10:school-sakura', W * 0.395, H * 0.14, H * 0.11, { z: 6.2, r: 14 });
    stk(out, kit, 'v10:school-star', W * 0.245, H * 0.44, H * 0.07, { z: 6.2, r: -8 });
    stk(out, kit, 'v10:school-sakura', W * 0.9, H * 0.36, H * 0.09, { z: 6.2, r: -12 });
    stk(out, kit, 'v10:school-star', W * 0.6, H * 0.93, H * 0.06, { z: 6.2, r: 10 });
    stk(out, kit, 'v10:school-petal', W * 0.045, H * 0.5, H * 0.08, { z: 6.2, r: -22 });

    head(out, kit, kit.title, W * 0.735, H * 0.055, W * 0.24, H * 0.055, { align: 'center', band: true, br: -1.2 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function tower(W, H, kit) {
    const out = [];
    const A = H * 0.35;
    const cx = W * 0.5;
    const cy = H * 0.34;

    base(W, H, kit, out, { m: 0.022, grainO: 0.32 });
    wash(out, W, H, kit, 'v10:school-vellum', { z: 1.2, o: 0.18 });

    const tw = W * 0.7;
    out.push(img('v10:school-index', (W - tw) / 2, H * 0.012, tw, H * 0.045, { z: 7, r: -1.2, fit: 'fill' }));
    out.push(txt(kit.title, (W - tw) / 2 + tw * 0.06, H * 0.019, tw * 0.88, Math.max(4, H * 0.026),
        { font: kit.subFont, color: kit.theme.onLight, align: 'center', z: 7.4, r: -1.2 }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 3.6, { zoom: 1.03 });

    mini(out, W * 0.12, H * 0.545, W * 0.3, H * 0.16, 'polaroid', -6, 3.4, { zoom: 1.06, fx: 46, fy: 46 });
    mini(out, W * 0.56, H * 0.63, W * 0.3, H * 0.16, 'torn', 5, 3.6, { zoom: 1.06, fx: 56, fy: 52 });
    out.push(txt('A HALF', W * 0.435, H * 0.575, W * 0.12, Math.max(3.4, H * 0.016),
        { font: kit.subFont, color: kit.theme.accent, r: 90, z: 7.4 }));
    out.push(txt('B HALF', W * 0.5, H * 0.665, W * 0.12, Math.max(3.4, H * 0.016),
        { font: kit.subFont, color: kit.theme.accent, r: 90, z: 7.4 }));

    const rh = H * 0.78;
    stk(out, kit, 'v10:school-ruler', W * 0.052, H * 0.5, rh, { z: 6.2, r: 90 });

    stk(out, kit, 'v10:school-bookmark', W * 0.145, H * 0.18, H * 0.1, { z: 6, r: -6 });
    stk(out, kit, 'v10:school-ring', W * 0.155, H * 0.33, H * 0.075, { z: 6, r: 84 });
    stk(out, kit, 'v10:school-bow', W * 0.14, H * 0.47, H * 0.07, { z: 6, r: -10 });
    stk(out, kit, 'v10:school-bookmark', W * 0.15, H * 0.63, H * 0.11, { z: 6, r: 7 });
    stk(out, kit, 'v10:school-ring', W * 0.145, H * 0.78, H * 0.08, { z: 6, r: 84 });
    stk(out, kit, 'v10:school-bow', W * 0.16, H * 0.9, H * 0.075, { z: 6, r: 12 });

    ['v10:school-star', 'v10:school-sakura', 'v10:school-star', 'v10:school-sakura', 'v10:school-star']
        .forEach((id, i) => stk(out, kit, id, W * 0.9 - (i % 2) * W * 0.03, H * (0.15 + i * 0.17),
            H * (i % 2 ? 0.055 : 0.045), { z: 6, r: i * 9 - 18 }));

    rule(out, kit, W * 0.2, H * 0.955, W * 0.6, H * 0.004, { o: 0.35 });
    out.push(txt(kit.footer, W * 0.1, H * 0.965, W * 0.8, Math.max(3.4, H * 0.014),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8, o: 0.8 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function banner(W, H, kit) {
    const out = [];
    const A = W * 0.3;
    const cx = W * 0.5;
    const cy = H * 0.47;

    base(W, H, kit, out, { m: 0.02, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:school-vellum', { z: 1.2, o: 0.16 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 3.6, { zoom: 1.03 });

    mini(out, W * 0.05, H * 0.16, W * 0.115, H * 0.44, 'polaroid', -8, 3.4, { zoom: 1.12, fx: 38, fy: 44 });
    mini(out, W * 0.135, H * 0.4, W * 0.09, H * 0.34, 'torn', 10, 3.6, { zoom: 1.18, fx: 44, fy: 48 });
    [[0.12, 0.16, 0.15, -8], [0.145, 0.3, 0.13, -4], [0.125, 0.83, 0.14, 6]].forEach(([x, y, w, r]) => {
        out.push(img('v10:school-index', W * x, H * y, W * w, H * 0.05, { z: 7, r, fit: 'fill' }));
        out.push(txt(kit.mark[0], W * x + W * w * 0.1, H * y + H * 0.008, W * w * 0.8, Math.max(3.2, H * 0.022),
            { font: kit.subFont, color: kit.theme.onLight, z: 7.4, r }));
    });
    stk(out, kit, 'v10:school-clip', W * 0.075, H * 0.62, H * 0.2, { z: 6.2, r: -14 });
    stk(out, kit, 'v10:school-star', W * 0.235, H * 0.13, H * 0.07, { z: 6.2, r: 12 });
    stk(out, kit, 'v10:school-star', W * 0.25, H * 0.76, H * 0.06, { z: 6.2, r: -10 });

    mini(out, W * 0.845, H * 0.16, W * 0.11, H * 0.42, 'polaroid', 8, 3.4, { zoom: 1.16, fx: 58, fy: 60 });
    mini(out, W * 0.775, H * 0.42, W * 0.085, H * 0.32, 'torn', -9, 3.6, { zoom: 1.2, fx: 62, fy: 56 });
    [[0.75, 0.19, 0.16, 7], [0.73, 0.32, 0.14, 4], [0.755, 0.83, 0.15, -6]].forEach(([x, y, w, r]) => {
        out.push(img('v10:school-index-kraft', W * x, H * y, W * w, H * 0.045, { z: 7, r, fit: 'fill' }));
        out.push(txt('SOFT LIGHT', W * x + W * w * 0.08, H * y + H * 0.007, W * w * 0.84, Math.max(3, H * 0.02),
            { font: kit.subFont, color: kit.theme.onLight, z: 7.4, r }));
    });
    stk(out, kit, 'v10:school-bow', W * 0.925, H * 0.66, H * 0.13, { z: 6.2, r: 10 });
    stk(out, kit, 'v10:school-sakura', W * 0.755, H * 0.12, H * 0.09, { z: 6.2, r: -14 });
    stk(out, kit, 'v10:school-sakura', W * 0.93, H * 0.44, H * 0.08, { z: 6.2, r: 12 });

    const topY = H * 0.035;
    const botY = H * 0.915;
    [0.04, 0.19, 0.34, 0.62, 0.77, 0.92].forEach((x, i) => {
        tape(out, kit, kit.tapes[i % kit.tapes.length], W * x, topY, W * 0.1, { r: i % 2 ? 3 : -3, z: 6.6 });
        tape(out, kit, kit.tapes[(i + 1) % kit.tapes.length], W * x, botY, W * 0.1, { r: i % 2 ? -4 : 4, z: 6.6 });
    });
    [0.28, 0.47, 0.55, 0.7, 0.86].forEach((x, i) => {
        stk(out, kit, i % 2 ? 'v10:school-cloud' : 'v10:school-star', W * x, H * (i % 2 ? 0.06 : 0.94),
            H * (i % 2 ? 0.075 : 0.06), { z: 6.8, r: i * 8 - 16 });
    });

    head(out, kit, kit.title, W * 0.045, H * 0.63, W * 0.3, H * 0.075, { band: true, br: -0.8 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function scroll(W, H, kit) {
    const out = [];
    const A = H * 0.56;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.28 });
    wash(out, W, H, kit, 'v10:school-vellum', { z: 1.2, o: 0.16 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 3.6, { zoom: 1.03 });

    const step = rail(W, A, 4);
    [-1, 1].forEach((dir, side) => {

        mini(out, cx + dir * step - A * 0.21, cy - A * 0.21, A * 0.42, A * 0.42, 'circle', 3.4,
            { zoom: 1.08, fx: side ? 58 : 42, fy: 46 });

        const lx = cx + dir * step * 2;
        out.push(img(side ? 'v10:school-index-kraft' : 'v10:school-index',
            lx - A * 0.42, cy - A * 0.11, A * 0.84, A * 0.22,
            { z: 7, r: dir * 2, fit: 'fill' }));
        out.push(txt(side ? 'ALL 4 U' : 'MILK', lx - A * 0.38, cy - A * 0.05, A * 0.76,
            Math.max(3.6, A * 0.12), { font: kit.subFont, color: kit.theme.onLight, z: 7.4, r: dir * 2 }));

        stk(out, kit, 'v10:school-clip', cx + dir * step * 3, cy - A * 0.02, A * 0.46, { z: 6.4, r: dir * 8 });

        stk(out, kit, 'v10:school-ring', cx + dir * step * 4, cy, A * 0.34, { z: 6.2, r: 88 });
    });

    [0.035, 0.075, 0.115].forEach((x, i) => {
        stk(out, kit, i % 2 ? 'v10:school-star' : 'v10:school-sakura', W * x, H * (0.24 + i * 0.26),
            H * (i % 2 ? 0.1 : 0.13), { z: 6.4, r: i * 14 - 14 });
        stk(out, kit, i % 2 ? 'v10:school-sakura' : 'v10:school-star', W * (1 - x), H * (0.74 - i * 0.26),
            H * (i % 2 ? 0.13 : 0.1), { z: 6.4, r: 14 - i * 14 });
    });

    for (let i = 0; i < 14; i += 1) {
        const x = W * (0.08 + i * 0.062);
        stk(out, kit, 'v10:school-star', x, H * (i % 2 ? 0.055 : 0.945), H * 0.045, { z: 6, o: 0.75, r: i * 7 });
    }

    out.push(txt(kit.title, cx - A * 0.6, H * 0.035, A * 1.2, Math.max(4, H * 0.035),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8 }));
    out.push(txt(kit.mark[1], cx - A * 0.6, H * 0.905, A * 1.2, Math.max(3.6, H * 0.03),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8, o: 0.8 }));

    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function poster(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.3 });

    out.push(img('v10:school-grid', 0, 0, W, H, { z: 0.5, o: 0.42, fit: 'fill' }));
    sheet(out, kit, W * 0.02, H * 0.04, W * 0.62, H * 0.66, { z: 1.2, r: -2.2, id: 'v10:school-loose' });
    sheet(out, kit, W * 0.4, H * 0.03, W * 0.58, H * 0.6, { z: 1.35, r: 1.8, id: 'v10:school-loose' });
    sheet(out, kit, W * 0.05, H * 0.46, W * 0.78, H * 0.5, { z: 1.5, r: -1.1, id: 'v10:school-loose' });
    wash(out, W, H, kit, 'v10:school-vellum', { z: 1.6, o: 0.2 });

    const A = H * 0.56;
    const cx = W * 0.5;
    const cy = H * 0.47;
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 3.8, { zoom: 1.03 });

    mini(out, W * 0.035, H * 0.09, W * 0.085, H * 0.28, 'polaroid', -9, 3.4, { zoom: 1.14, fx: 38, fy: 42 });
    mini(out, W * 0.1, H * 0.055, W * 0.075, H * 0.24, 'torn', 11, 3.6, { zoom: 1.2, fx: 44, fy: 46 });
    [[0.135, 0.08, 0.14, -12], [0.15, 0.17, 0.11, -8], [0.04, 0.36, 0.16, 6]].forEach(([x, y, w, r]) => {
        out.push(img('v10:school-index', W * x, H * y, W * w, H * 0.045, { z: 7, r, fit: 'fill' }));
        out.push(txt(kit.mark[0], W * x + W * w * 0.08, H * y + H * 0.007, W * w * 0.84, Math.max(3.2, H * 0.022),
            { font: kit.subFont, color: kit.theme.onLight, z: 7.4, r }));
    });

    stk(out, kit, 'v10:school-bookmark', W * 0.885, H * 0.2, H * 0.2, { z: 6.2, r: 8 });
    stk(out, kit, 'v10:school-bow', W * 0.815, H * 0.115, H * 0.1, { z: 6.4, r: -12 });
    out.push(txt('soft light', W * 0.79, H * 0.28, W * 0.16, Math.max(3.6, H * 0.028),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 7.4, r: -6 }));
    out.push(txt(kit.title, W * 0.78, H * 0.33, W * 0.18, Math.max(5, H * 0.045),
        { font: kit.font, color: kit.theme.accent, align: 'center', z: 9, r: -4 }));

    stk(out, kit, 'v10:school-ruler', W * 0.135, H * 0.78, W * 0.16, { z: 6.2, r: -14 });
    stk(out, kit, 'v10:school-pencil', W * 0.2, H * 0.88, W * 0.15, { z: 6.3, r: 8 });
    stk(out, kit, 'v10:school-eraser', W * 0.075, H * 0.9, W * 0.07, { z: 6.3, r: -6 });
    [0.05, 0.085].forEach((x, i) => {
        stk(out, kit, 'v10:school-hole', W * x, H * (0.63 + i * 0.03), H * 0.055, { z: 6.4 });
        stk(out, kit, 'v10:school-hole', W * x, H * (0.69 - i * 0.03), H * 0.055, { z: 6.4 });
    });

    [['v10:school-sakura', 0.83, 0.66, 0.09], ['v10:school-cloud', 0.9, 0.75, 0.1],
        ['v10:school-star', 0.79, 0.83, 0.055], ['v10:school-sakura', 0.93, 0.87, 0.075],
        ['v10:school-star', 0.86, 0.92, 0.05]].forEach(([id, x, y, s], i) =>
        stk(out, kit, id, W * x, H * y, H * s, { z: 6.2, r: i * 12 - 20 }));

    [[0.2, 0.24, 0.2, -32], [0.66, 0.28, 0.2, 30], [0.24, 0.72, 0.19, 26], [0.64, 0.73, 0.2, -28]]
        .forEach(([x, y, w, r], i) => {
            out.push(img('v10:school-index-kraft', W * x, H * y, W * w, H * 0.038, { z: 6.8, r, fit: 'fill' }));
            out.push(txt(['0408', 'MILK', 'NOTE', 'SALT'][i], W * x + W * w * 0.1, H * y + H * 0.006,
                W * w * 0.8, Math.max(3, H * 0.019), { font: kit.subFont, color: kit.theme.onLight, z: 7.2, r }));
        });

    for (let i = 0; i < 20; i += 1) {
        const t = i / 20;
        const edge = i % 4;
        const x = edge < 2 ? W * (0.06 + t * 0.88) : W * (edge === 2 ? 0.022 : 0.978);
        const y = edge < 2 ? H * (edge === 0 ? 0.025 : 0.972) : H * (0.06 + t * 0.86);
        stk(out, kit, i % 3 === 0 ? 'v10:school-sakura' : 'v10:school-star', x, y, H * (i % 3 ? 0.038 : 0.05),
            { z: 6.6, o: 0.85, r: i * 11 });
    }

    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

export const builds = { chip, compact, circle, polaroid, collage, tower, banner, scroll, poster };
