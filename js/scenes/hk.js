import { F, img, txt } from '../assets/base.js';
import {
    PAL, base, wash, sheet, portrait, mini, stk, rail, tape, label, head, rule, mark,
    frame, corners, arcPos, lineUp, inkOf,
} from './kit.js';

export const style = {
    id: 'hk',
    name: '港风旧画报',
    desc: '旧报纸 · 胶卷 · 邮戳，九十年代画报颗粒',
    avatarShape: 'square',
    layout: 'banner',
    palette: PAL(['#4b382a', '#6d5340', '#33241a'], '#f4e7cb', '#c8b28c', '#a4622f', '#33251a', '#e6d3ae', '#d8ae74', true),
    decos: ['v10:hk-film', 'v10:hk-postmark', 'v10:hk-vinyl', 'v10:hk-tape', 'v10:hk-rose', 'v10:hk-clock'],
    glyphs: ['✦', '✧', '·', '★', '✷'],
    lace: '', laceRatio: 1,
    tapes: ['builtin:tape-black', 'builtin:washi'],
    font: F.serif, subFont: F.mono,
    title: 'REEL 09', sub: '{{birthday|OLD PICTURE}}', badge: 'FILM',
    footer: 'a thousand characters on the path', mark: ['1999', '0909'],
};

function chip(W, H, kit) {
    const out = [];
    const A = H * 0.56;
    const cx = W * 0.5;
    const cy = H * 0.52;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:hk-news', { z: 1.0, o: 0.5 });
    wash(out, W, H, kit, 'v10:hk-grain', { z: 1.1, o: 0.3 });

    const spH = H * 0.19;
    out.push(img('v10:hk-sprocket', 0, 0, W, spH, { z: 2.2, fit: 'fill' }));
    out.push(img('v10:hk-sprocket', 0, H - spH, W, spH, { z: 2.2, fit: 'fill' }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'torn', 3.6, { zoom: 1.05 });
    stk(out, kit, 'v10:hk-lens', cx, cy, A * 1.06, { z: 4.2, o: 0.5 });

    const tw = A * 1.1;
    out.push(img(inkOf(kit), cx - tw / 2, H * 0.19, tw, H * 0.2, { z: 7, o: 0.62, fit: 'fill' }));
    out.push(txt(kit.title, cx - tw / 2, H * 0.205, tw, Math.max(5, H * 0.12),
        { font: kit.font, color: kit.theme.onDark, align: 'center', z: 7.4 }));

    [[0.075, 0.3, -8], [0.115, 0.66, 12]].forEach(([x, y, r]) => {
        stk(out, kit, 'v10:hk-postmark', W * x, H * y, H * 0.5, { z: 6.4, r, o: 0.9 });
    });
    [[0.885, 0.34, 9], [0.925, 0.68, -14]].forEach(([x, y, r]) => {
        stk(out, kit, 'v10:hk-postmark-sq', W * x, H * y, H * 0.46, { z: 6.4, r, o: 0.9 });
    });

    stk(out, kit, 'v10:hk-goldline', W * 0.245, H * 0.3, W * 0.15, { z: 6.6, o: 0.9 });
    stk(out, kit, 'v10:hk-goldline', W * 0.755, H * 0.7, W * 0.15, { z: 6.6, o: 0.9, r: 180 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function compact(W, H, kit) {
    const out = [];
    const A = H * 0.54;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.32 });
    wash(out, W, H, kit, 'v10:hk-news', { z: 1.0, o: 0.55 });
    wash(out, W, H, kit, 'v10:hk-grain', { z: 1.1, o: 0.35 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'torn', 3.6, { zoom: 1.04 });
    stk(out, kit, 'v10:hk-lens', cx, cy, A * 1.02, { z: 4.2, o: 0.45 });

    mini(out, W * 0.035, H * 0.04, W * 0.24, H * 0.3, 'torn', -14, 4.4, { zoom: 1.16, fx: 40, fy: 42 });
    stk(out, kit, 'v10:hk-torn', W * 0.2, H * 0.185, W * 0.16, { z: 4.6, r: -14, o: 0.9 });

    out.push(img('v10:hk-kraft', W * 0.7, H * 0.045, W * 0.27, H * 0.26, { z: 7, r: 7, o: 0.92, fit: 'fill' }));
    ['a page of', 'nineteen', 'ninety nine'].forEach((line, i) => {
        out.push(txt(line, W * 0.73, H * 0.075 + i * H * 0.072, W * 0.22, Math.max(3.4, H * 0.042),
            { font: F.hand, color: kit.theme.onLight, z: 7.4, r: 7 }));
    });

    stk(out, kit, 'v10:hk-postmark', W * 0.245, H * 0.795, H * 0.34, { z: 6.6, r: -12, o: 0.92 });

    [['v10:hk-halftone', 0.04, 0.62], ['v10:hk-halftone', 0.955, 0.28],
        ['v10:hk-halftone', 0.42, 0.055], ['v10:hk-halftone', 0.62, 0.94]].forEach(([id, x, y], i) =>
        stk(out, kit, id, W * x, H * y, H * 0.13, { z: 6, r: i * 16, o: 0.7 }));

    stk(out, kit, 'v10:hk-stamp', W * 0.9, H * 0.82, H * 0.2, { z: 6.4, r: 8 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function circle(W, H, kit) {
    const out = [];
    const A = Math.min(W, H) * 0.58;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:hk-halftone', { z: 1.0, o: 0.6 });
    wash(out, W, H, kit, 'v10:hk-grain', { z: 1.1, o: 0.35 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'torn', 3.6, { zoom: 1.03 });
    stk(out, kit, 'v10:hk-lens', cx, cy, A * 1.0, { z: 4.2, o: 0.4 });

    const R = Math.min(W, H) * 0.478;
    for (let i = 0; i < 28; i += 1) {
        const p = arcPos(cx, cy, R, R, (i / 28) * 360);
        out.push(img('v10:hk-sprocket', p.x - R * 0.075, p.y - R * 0.055, R * 0.15, R * 0.11,
            { z: 5.6, r: p.r + 90, fit: 'fill' }));
    }

    const R2 = Math.min(W, H) * 0.375;
    for (let i = 0; i < 12; i += 1) {
        const p = arcPos(cx, cy, R2, R2, (i / 12) * 360);
        out.push(txt('POST · 1999', p.x - A * 0.1, p.y - A * 0.03, A * 0.2, Math.max(3.2, A * 0.062),
            { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 6.4, r: p.r + 90, o: 0.9 }));
    }

    [30, 150, 270].forEach((deg, i) => {
        const p = arcPos(cx, cy, Math.min(W, H) * 0.325, Math.min(W, H) * 0.325, deg);
        stk(out, kit, 'v10:hk-stamp', p.x, p.y, A * 0.3, { z: 6.2, r: i * 24 - 20 });
    });

    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function polaroid(W, H, kit) {
    const out = [];
    const fx = W * 0.075;
    const fy = H * 0.06;
    const fw = W * 0.85;
    const fh = H * 0.72;
    const A = Math.min(fw, fh) * 0.66;
    const cx = fx + fw / 2;
    const cy = fy + fh / 2;

    base(W, H, kit, out, { paper: false, grainO: 0.3 });
    out.push(img('v10:hk-kraft', W * 0.028, H * 0.018, W * 0.944, H * 0.956, { z: 0.8, r: 2.2, fit: 'fill' }));
    out.push(img('v10:hk-news', W * 0.045, H * 0.032, W * 0.91, H * 0.93, { z: 1, r: 1, fit: 'fill' }));

    out.push(img('v10:hk-torn', W * 0.05, H * 0.5, W * 0.9, H * 0.02, { z: 1.2, o: 0.5, fit: 'fill' }));

    out.push(img('v10:hk-kraft', fx, fy, fw, fh, { z: 1.3, r: 0.5, fit: 'fill' }));
    wash(out, W, H, kit, 'v10:hk-grain', { z: 1.5, o: 0.3 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'torn', 3.6, { zoom: 1.02 });

    [[0.16, 0.855, 0.9, -14], [0.47, 0.885, 0.7, 8], [0.78, 0.86, 0.85, 16]].forEach(([x, y, o, r]) =>
        stk(out, kit, 'v10:hk-postmark', W * x, H * y, H * 0.28, { z: 6.6, r, o }));

    out.push(txt('the reel', W * 0.012, H * 0.24, W * 0.09, Math.max(3.2, H * 0.035),
        { font: F.hand, color: kit.theme.onLight, r: 90, z: 7 }));
    out.push(txt('keeps', W * 0.012, H * 0.52, W * 0.09, Math.max(3.2, H * 0.035),
        { font: F.hand, color: kit.theme.onLight, r: 90, z: 7 }));
    out.push(txt('09.09', W * 0.945, H * 0.3, W * 0.09, Math.max(3, H * 0.03),
        { font: F.hand, color: kit.theme.onLight, r: 90, z: 7 }));
    out.push(txt('1999', W * 0.945, H * 0.58, W * 0.09, Math.max(3, H * 0.03),
        { font: F.hand, color: kit.theme.onLight, r: 90, z: 7 }));

    stk(out, kit, 'v10:hk-goldline', W * 0.5, H * 0.022, W * 0.42, { z: 7, o: 0.95 });

    stk(out, kit, 'v10:hk-postmark-sq', W * 0.045, H * 0.72, H * 0.16, { z: 6.4, r: -18, o: 0.85 });
    stk(out, kit, 'v10:hk-postmark-sq', W * 0.955, H * 0.76, H * 0.16, { z: 6.4, r: 20, o: 0.85 });

    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function collage(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.32 });
    wash(out, W, H, kit, 'v10:hk-news', { z: 0.6, o: 0.55 });

    sheet(out, kit, W * 0.02, H * 0.05, W * 0.34, H * 0.44, { z: 1.4, r: -5.5, id: 'v10:hk-kraft' });
    sheet(out, kit, W * 0.3, H * 0.02, W * 0.3, H * 0.5, { z: 1.6, r: 4.2, id: 'v10:hk-news' });
    sheet(out, kit, W * 0.6, H * 0.05, W * 0.36, H * 0.4, { z: 1.5, r: -3.4, id: 'v10:hk-kraft' });
    sheet(out, kit, W * 0.05, H * 0.5, W * 0.36, H * 0.44, { z: 1.7, r: 3.6, id: 'v10:hk-news' });
    sheet(out, kit, W * 0.36, H * 0.46, W * 0.32, H * 0.5, { z: 1.9, r: -2.8, id: 'v10:hk-kraft' });
    sheet(out, kit, W * 0.66, H * 0.48, W * 0.32, H * 0.46, { z: 1.8, r: 5.2, id: 'v10:hk-news' });

    [[0.02, 0.05, 0.34, -5.5], [0.6, 0.05, 0.36, -3.4], [0.05, 0.5, 0.36, 3.6]].forEach(([x, y, w, r]) =>
        stk(out, kit, 'v10:hk-torn', W * (x + w / 2), H * y, W * w, { z: 1.4, r, o: 0.55 }));

    const A = H * 0.5;
    const cx = W * 0.47;
    const cy = H * 0.44;
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'torn', 3.8, { zoom: 1.03 });

    mini(out, W * 0.045, H * 0.09, W * 0.13, H * 0.28, 'torn', -8, 3.2, { zoom: 1.16, fx: 40, fy: 44 });
    mini(out, W * 0.1, H * 0.6, W * 0.13, H * 0.26, 'torn', 7, 3.2, { zoom: 1.2, fx: 58, fy: 62 });
    mini(out, W * 0.79, H * 0.1, W * 0.13, H * 0.28, 'torn', 9, 3.2, { zoom: 1.14, fx: 44, fy: 40 });

    out.push(img('v10:hk-kraft', W * 0.395, H * 0.07, W * 0.16, H * 0.14, { z: 7, r: 3.6, o: 0.95, fit: 'fill' }));
    out.push(txt('舊 畫 報', W * 0.41, H * 0.1, W * 0.13, Math.max(4, H * 0.06),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 7.4, r: 3.6 }));
    ['no.09', 'a thousand', 'characters'].forEach((line, i) => {
        out.push(txt(line, W * 0.72, H * 0.58 + i * H * 0.06, W * 0.2, Math.max(3.4, H * 0.032),
            { font: F.hand, color: kit.theme.onLight, z: 7.4, r: 4.2 }));
    });
    out.push(img(inkOf(kit), W * 0.36, H * 0.63, W * 0.2, H * 0.16, { z: 7, r: -4, o: 0.62, fit: 'fill' }));
    out.push(txt('REEL 09', W * 0.38, H * 0.68, W * 0.16, Math.max(4, H * 0.05),
        { font: kit.font, color: kit.theme.onDark, align: 'center', z: 7.4, r: -4 }));

    stk(out, kit, 'v10:hk-vinyl', W * 0.34, H * 0.28, H * 0.13, { z: 4.4, r: -24 });
    stk(out, kit, 'v10:hk-tape', W * 0.63, H * 0.32, H * 0.12, { z: 4.4, r: 18 });
    stk(out, kit, 'v10:hk-vinyl', W * 0.67, H * 0.75, H * 0.11, { z: 4.4, r: 12 });
    stk(out, kit, 'v10:hk-tape', W * 0.3, H * 0.9, H * 0.1, { z: 4.4, r: -14 });
    stk(out, kit, 'v10:hk-clock', W * 0.9, H * 0.44, H * 0.1, { z: 4.4, r: 0 });

    stk(out, kit, 'v10:hk-goldline', W * 0.2, H * 0.5, W * 0.28, { z: 6.8, o: 0.85 });
    stk(out, kit, 'v10:hk-goldline', W * 0.68, H * 0.44, W * 0.3, { z: 6.8, o: 0.85, r: 180 });

    stk(out, kit, 'v10:hk-postmark', W * 0.24, H * 0.42, H * 0.14, { z: 6.4, r: -8, o: 0.85 });
    stk(out, kit, 'v10:hk-postmark', W * 0.86, H * 0.68, H * 0.15, { z: 6.4, r: 10, o: 0.85 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function tower(W, H, kit) {
    const out = [];
    const A = W * 0.72;
    const cx = W * 0.54;
    const cy = H * 0.45;

    base(W, H, kit, out, { m: 0.022, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:hk-news', { z: 1.1, o: 0.5 });

    const rows = [
        { y: H * 0.02, h: H * 0.16 },
        { y: H * 0.185, h: H * 0.16 },
        { y: H * 0.355, h: H * 0.3 },
        { y: H * 0.665, h: H * 0.155 },
        { y: H * 0.83, h: H * 0.15 },
    ];
    rows.forEach(row => {
        out.push(img('v10:hk-news', W * 0.13, row.y, W * 0.84, row.h, { z: 1.5, o: 0.95, fit: 'fill' }));
        out.push(img(inkOf(kit), W * 0.13, row.y, W * 0.84, row.h, { z: 1.6, o: 0.1, fit: 'fill' }));
    });
    [0.18, 0.352, 0.662, 0.827].forEach(y =>
        out.push(img(inkOf(kit), W * 0.13, H * y, W * 0.84, Math.max(1, H * 0.004), { z: 6, o: 0.9, fit: 'fill' })));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'torn', 3.8, { zoom: 1.02 });

    mini(out, W * 0.2, H * 0.035, W * 0.3, H * 0.13, 'torn', -4, 3.2, { zoom: 1.5, fx: 40, fy: 30, o: 0.85 });
    mini(out, W * 0.55, H * 0.2, W * 0.32, H * 0.13, 'torn', 3, 3.2, { zoom: 1.5, fx: 60, fy: 70, o: 0.85 });

    out.push(img('v10:hk-kraft', W * 0.18, H * 0.68, W * 0.4, H * 0.12, { z: 7, r: -2, fit: 'fill' }));
    out.push(txt('舊 畫 報', W * 0.22, H * 0.705, W * 0.32, Math.max(5, H * 0.035),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 7.4, r: -2 }));
    out.push(img(inkOf(kit), W * 0.5, H * 0.845, W * 0.42, H * 0.11, { z: 7, r: 2, o: 0.72, fit: 'fill' }));
    out.push(txt('REEL 09 · 1999', W * 0.53, H * 0.878, W * 0.36, Math.max(4, H * 0.028),
        { font: kit.subFont, color: kit.theme.onDark, align: 'center', z: 7.4, r: 2 }));

    stk(out, kit, 'v10:hk-postroute', W * 0.07, H * 0.5, H * 0.96, { z: 6.6, r: 90, o: 0.9 });

    [0.1, 0.26, 0.42, 0.58, 0.74, 0.9].forEach((y, i) =>
        stk(out, kit, 'v10:hk-stamp', W * (0.075 + (i % 2) * 0.045), H * y, H * 0.07, { z: 6.8, r: i * 12 - 20 }));

    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function banner(W, H, kit) {
    const out = [];
    const A = W * 0.3;
    const cx = W * 0.5;
    const cy = H * 0.47;

    base(W, H, kit, out, { m: 0.018, grainO: 0.3 });
    wash(out, W, H, kit, 'v10:hk-news', { z: 1.0, o: 0.5 });

    [0.03, 0.66].forEach((x, side) => {
        out.push(img('v10:hk-news', W * x, H * 0.1, W * 0.31, H * 0.8, { z: 1.4, r: side ? 2.4 : -2.4, fit: 'fill' }));
        for (let i = 0; i < 11; i += 1) {
            out.push(txt('OLD NEWS · 舊畫報 · NINETEEN NINETY NINE · '.repeat(1),
                W * x + W * 0.012, H * (0.13 + i * 0.068), W * 0.285, Math.max(2.6, H * 0.014),
                { font: kit.subFont, color: kit.theme.onLight, z: 1.6, o: 0.55, r: side ? 2.4 : -2.4 }));
        }
    });

    out.push(img('v10:hk-sprocket', 0, H * 0.4, W, H * 0.2, { z: 2.6, fit: 'fill' }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'torn', 3.8, { zoom: 1.03 });
    stk(out, kit, 'v10:hk-lens', cx, cy, A * 1.0, { z: 4.4, o: 0.4 });

    [[0.1, 0.22, 0.3, -12], [0.28, 0.78, 0.26, 14], [0.76, 0.24, 0.28, 10], [0.9, 0.76, 0.26, -16]].forEach(([x, y, s, r]) =>
        stk(out, kit, 'v10:hk-postmark', W * x, H * y, H * s, { z: 6.4, r, o: 0.85 }));
    [[0.16, 0.72], [0.2, 0.24], [0.83, 0.7], [0.87, 0.26]].forEach(([x, y], i) =>
        stk(out, kit, 'v10:hk-stamp', W * x, H * y, H * 0.17, { z: 6.6, r: i * 14 - 20 }));

    stk(out, kit, 'v10:hk-goldline', cx, H * 0.13, W * 0.2, { z: 6.8, o: 0.9 });
    stk(out, kit, 'v10:hk-goldline', cx, H * 0.86, W * 0.2, { z: 6.8, o: 0.9, r: 180 });

    head(out, kit, kit.title, W * 0.36, H * 0.2, W * 0.28, H * 0.075, { align: 'center' });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function scroll(W, H, kit) {
    const out = [];
    const A = H * 0.62;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.28 });

    out.push(img('v10:hk-news', 0, H * 0.2, W, H * 0.6, { z: 1.2, o: 0.9, fit: 'fill' }));
    out.push(img('v10:hk-sprocket', 0, 0, W, H * 0.2, { z: 2.4, fit: 'fill' }));
    out.push(img('v10:hk-sprocket', 0, H * 0.8, W, H * 0.2, { z: 2.4, fit: 'fill' }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'torn', 3.8, { zoom: 1.03 });

    const steps = [
        { kind: 'photo', k: 1, s: 0.44 },
        { kind: 'post', k: 2, s: 0.36 },
        { kind: 'word', k: 3, s: 0.3 },
        { kind: 'photo', k: 4, s: 0.26 },
    ];
    const span = rail(W, A, 4);
    steps.forEach((item, i) => {
        [1, -1].forEach(dir => {
            const x = cx + dir * span * item.k;
            const y = H * (0.5 + (dir > 0 ? 0.02 : -0.02) * (i % 2 ? 1 : -1));
            if (item.kind === 'photo') {
                const s = H * item.s;
                mini(out, x - s / 2, y - s / 2, s, s * 0.94, 'torn', dir * 5, 3.4,
                    { zoom: 1.12, fx: dir > 0 ? 58 : 42, fy: 46 });
            } else if (item.kind === 'post') {
                stk(out, kit, 'v10:hk-postmark', x, y, H * item.s, { z: 6.2, r: dir * 12, o: 0.88 });
            } else {
                out.push(img(inkOf(kit), x - W * 0.035, y - H * 0.09, W * 0.07, H * 0.18,
                    { z: 7, r: dir * 3, o: 0.72, fit: 'fill' }));
                out.push(txt(dir > 0 ? 'REEL' : '1999', x - W * 0.03, y - H * 0.03, W * 0.06,
                    Math.max(4, H * 0.07), { font: kit.font, color: kit.theme.onDark, align: 'center', z: 7.4, r: dir * 3 }));
            }
        });
    });

    [0.2, 0.31, 0.69, 0.8].forEach(x =>
        out.push(img('v10:hk-vinyl', W * x, H * 0.2, Math.max(1, W * 0.002), H * 0.6, { z: 6, o: 0.55, fit: 'fill' })));

    for (let i = 0; i < 12; i += 1) {
        const x = W * (0.04 + i * 0.083);
        stk(out, kit, 'v10:hk-goldline', x, H * (i % 2 ? 0.24 : 0.76), W * 0.05, { z: 6.6, o: 0.8 });
    }

    out.push(txt(kit.title, cx - A * 0.7, H * 0.9, A * 1.4, Math.max(3.6, H * 0.035),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8, o: 0.85 }));
    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function poster(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.34 });
    wash(out, W, H, kit, 'v10:hk-news', { z: 0.6, o: 0.6 });
    wash(out, W, H, kit, 'v10:hk-halftone', { z: 0.7, o: 0.5 });

    sheet(out, kit, W * 0.015, H * 0.03, W * 0.44, H * 0.42, { z: 1.2, r: -4.4, id: 'v10:hk-news' });
    sheet(out, kit, W * 0.52, H * 0.02, W * 0.45, H * 0.4, { z: 1.25, r: 3.6, id: 'v10:hk-kraft' });
    sheet(out, kit, W * 0.03, H * 0.55, W * 0.42, H * 0.42, { z: 1.3, r: 2.8, id: 'v10:hk-kraft' });
    sheet(out, kit, W * 0.55, H * 0.56, W * 0.42, H * 0.42, { z: 1.35, r: -3.2, id: 'v10:hk-news' });
    wash(out, W, H, kit, 'v10:hk-grain', { z: 1.5, o: 0.3 });

    const A = H * 0.56;
    const cx = W * 0.5;
    const cy = H * 0.48;
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'torn', 3.8, { zoom: 1.03 });
    stk(out, kit, 'v10:hk-lens', cx, cy, A * 1.0, { z: 4.4, o: 0.4 });

    mini(out, W * 0.045, H * 0.09, W * 0.075, H * 0.2, 'torn', -10, 3.2, { zoom: 1.16, fx: 40, fy: 44 });
    mini(out, W * 0.105, H * 0.06, W * 0.07, H * 0.19, 'torn', 8, 3.3, { zoom: 1.2, fx: 46, fy: 40 });
    mini(out, W * 0.075, H * 0.23, W * 0.068, H * 0.18, 'torn', -4, 3.4, { zoom: 1.14, fx: 52, fy: 52 });

    out.push(img(inkOf(kit), W * 0.72, H * 0.06, W * 0.24, H * 0.1, { z: 7, r: -2, o: 0.72, fit: 'fill' }));
    out.push(txt('舊畫報', W * 0.74, H * 0.075, W * 0.2, Math.max(6, H * 0.055),
        { font: kit.font, color: kit.theme.onDark, align: 'center', z: 7.6, r: -2 }));
    stk(out, kit, 'v10:hk-stamp', W * 0.83, H * 0.235, H * 0.15, { z: 6.4, r: 10 });
    stk(out, kit, 'v10:hk-stamp', W * 0.92, H * 0.18, H * 0.12, { z: 6.4, r: -12 });

    stk(out, kit, 'v10:hk-vinyl', W * 0.09, H * 0.83, H * 0.2, { z: 4.6, r: -18 });
    stk(out, kit, 'v10:hk-tape', W * 0.2, H * 0.88, H * 0.13, { z: 4.8, r: 14 });
    stk(out, kit, 'v10:hk-vinyl', W * 0.22, H * 0.76, H * 0.12, { z: 4.7, r: 26 });

    stk(out, kit, 'v10:hk-clock', W * 0.89, H * 0.84, H * 0.22, { z: 4.6, r: 0 });
    stk(out, kit, 'v10:hk-postmark', W * 0.79, H * 0.88, H * 0.15, { z: 6.2, r: -10, o: 0.9 });
    stk(out, kit, 'v10:hk-postmark-sq', W * 0.93, H * 0.72, H * 0.13, { z: 6.2, r: 12, o: 0.9 });

    stk(out, kit, 'v10:hk-postroute', W * 0.24, H * 0.2, W * 0.24, { z: 6.6, r: 22, o: 0.8 });
    stk(out, kit, 'v10:hk-postroute', W * 0.76, H * 0.22, W * 0.24, { z: 6.6, r: -22, o: 0.8 });
    stk(out, kit, 'v10:hk-postroute', W * 0.24, H * 0.78, W * 0.24, { z: 6.6, r: -18, o: 0.8 });
    stk(out, kit, 'v10:hk-postroute', W * 0.77, H * 0.76, W * 0.24, { z: 6.6, r: 18, o: 0.8 });

    for (let i = 0; i < 22; i += 1) {
        const t = i / 22;
        const edge = i % 4;
        const x = edge < 2 ? W * (0.05 + t * 0.9) : W * (edge === 2 ? 0.02 : 0.98);
        const y = edge < 2 ? H * (edge === 0 ? 0.022 : 0.975) : H * (0.05 + t * 0.9);
        stk(out, kit, i % 3 === 0 ? 'v10:hk-postmark-sq' : 'v10:hk-postmark', x, y, H * 0.075,
            { z: 6.8, o: 0.55, r: i * 17 });
    }

    head(out, kit, kit.title, W * 0.05, H * 0.9, W * 0.3, H * 0.06, { band: true, br: -1 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

export const builds = { chip, compact, circle, polaroid, collage, tower, banner, scroll, poster };
