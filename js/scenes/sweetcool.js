import { F, img, txt } from '../assets/base.js';
import {
    PAL, base, wash, sheet, portrait, mini, stk, tape, label, head, rule,
    frame, arcPos, scatter, lineUp, rail,
} from './kit.js';

export const style = {
    id: 'sweetcool',
    name: '韩系甜酷',
    desc: '奶油纸 · 雾蓝碎花 · 樱桃珍珠，清冷少女感',
    avatarShape: 'circle',
    layout: 'collage',
    palette: PAL(['#f7f1e8', '#dce7ec', '#f3e4e6'], '#fffaf1', '#afc2cd', '#bd4054', '#3f4b58', '#e7eff2', '#ffffff', false),
    decos: ['v10:sc-cherry', 'v10:sc-bow', 'v10:sc-pearl-chain', 'v10:sc-heart', 'v10:sc-star', 'v10:sc-flower', 'v10:sc-butterfly', 'v10:sc-bubble'],
    glyphs: ['♡', '✦', '✧', '●', '❀'],
    lace: 'builtin:doily', laceRatio: 0.5,
    tapes: ['v10:sc-tape-blue', 'v10:sc-tape-red'],
    font: F.sans, subFont: F.mono,
    title: 'SWEET REBEL', sub: '{{name|CHERRY BLUE}}', badge: 'No.10',
    footer: 'cream, blue & a little attitude', mark: ['2004', '0412'],
};

function chip(W, H, kit) {
    const out = [];
    const A = H * 0.55;
    const cx = W * 0.5;
    const cy = H * 0.51;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.25 });
    wash(out, W, H, kit, 'v10:sc-floral', { z: 1, o: 0.2 });
    wash(out, W, H, kit, 'v10:sc-vellum', { z: 1.1, o: 0.24 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 3.8, { zoom: 1.04 });
    label(out, kit, kit.sub, W * 0.34, H * 0.035, W * 0.32, H * 0.064,
        { bandId: 'v10:sc-cream', h: 1.65, z: 7, r: -1.2 });
    label(out, kit, `${kit.mark[0]} / ${kit.mark[1]}`, W * 0.36, H * 0.835, W * 0.28, H * 0.054,
        { bandId: 'v10:sc-tape-blue', h: 1.65, z: 7, r: 1.4 });

    stk(out, kit, 'v10:sc-cherry', W * 0.065, H * 0.34, H * 0.31, { z: 6.2, r: -10 });
    stk(out, kit, 'v10:sc-bow', W * 0.155, H * 0.67, W * 0.09, { z: 6.3, r: 8 });
    stk(out, kit, 'v10:sc-pearl-chain', W * 0.245, H * 0.25, W * 0.14, { z: 6.1, r: -8 });
    stk(out, kit, 'v10:sc-cherry', W * 0.935, H * 0.66, H * 0.31, { z: 6.2, r: 10 });
    stk(out, kit, 'v10:sc-bow', W * 0.845, H * 0.33, W * 0.09, { z: 6.3, r: -8 });
    stk(out, kit, 'v10:sc-pearl-chain', W * 0.755, H * 0.76, W * 0.14, { z: 6.1, r: 8 });

    stk(out, kit, 'v10:sc-heart-line', W * 0.255, H * 0.64, H * 0.16, { z: 6.4, r: -8 });
    stk(out, kit, 'v10:sc-sparkle', W * 0.745, H * 0.34, H * 0.13, { z: 6.4, r: 12 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function compact(W, H, kit) {
    const out = [];
    const A = H * 0.56;
    const cx = W * 0.66;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.26 });
    wash(out, W, H, kit, 'v10:sc-floral', { z: 1, o: 0.24 });
    sheet(out, kit, W * 0.43, H * 0.12, W * 0.51, H * 0.77,
        { z: 1.5, r: 2.4, id: 'v10:sc-cream' });
    wash(out, W, H, kit, 'v10:sc-vellum', { z: 1.6, o: 0.18 });

    const s = H * 0.27;
    mini(out, W * 0.21 - s / 2, H * 0.23 - s / 2, s, s, 'circle', -4, 3.4,
        { zoom: 1.09, fx: 42, fy: 44 });
    mini(out, W * 0.05, H * 0.49, W * 0.17, H * 0.34, 'polaroid', -9, 3.3,
        { zoom: 1.15, fx: 40, fy: 46 });
    mini(out, W * 0.19, H * 0.58, W * 0.14, H * 0.29, 'torn', 8, 3.5,
        { zoom: 1.2, fx: 56, fy: 52 });
    tape(out, kit, kit.tapes[0], W * 0.12, H * 0.49, W * 0.15, { h: H * 0.055, r: -9, z: 6 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 4, { zoom: 1.03 });
    label(out, kit, 'CHERRY', W * 0.055, H * 0.37, W * 0.25, H * 0.044,
        { h: 1.55, z: 7, r: -3 });
    stk(out, kit, 'v10:sc-dash', W * 0.29, H * 0.89, W * 0.27, { z: 5.8, r: 7 });

    stk(out, kit, 'v10:sc-heart', W * 0.045, H * 0.065, H * 0.1, { z: 6.5, r: -10 });
    stk(out, kit, 'v10:sc-cherry', W * 0.93, H * 0.09, H * 0.12, { z: 6.5, r: 12 });
    stk(out, kit, 'v10:sc-bow', W * 0.06, H * 0.925, W * 0.11, { z: 6.5, r: 8 });
    stk(out, kit, 'v10:sc-bubble', W * 0.94, H * 0.91, H * 0.14, { z: 6.5, r: -8 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function circle(W, H, kit) {
    const out = [];
    const A = Math.min(W, H) * 0.5;
    const cx = W * 0.5;
    const cy = H * 0.5;
    const R = Math.min(W, H) * 0.405;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.24 });
    wash(out, W, H, kit, 'v10:sc-floral', { z: 1, o: 0.32 });
    wash(out, W, H, kit, 'v10:sc-vellum', { z: 1.1, o: 0.2 });
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 3.8, { zoom: 1.03 });

    const letters = [
        ...'SWEET'.split('').map((ch, i) => ({ ch, deg: -52 + i * 26, flip: 0 })),
        ...'REBEL'.split('').map((ch, i) => ({ ch, deg: 128 + i * 26, flip: 180 })),
    ];
    letters.forEach(({ ch, deg, flip }) => {
        const p = arcPos(cx, cy, R, R, deg);
        out.push(txt(ch, p.x - A * 0.12, p.y - A * 0.04, A * 0.24, A * 0.067, {
            font: kit.font, color: kit.theme.onDark, align: 'center', z: 7, r: p.r + flip,
        }));
    });

    [
        [65, 'v10:sc-bow', 0.2], [92, 'v10:sc-pearl-chain', 0.27], [116, 'v10:sc-cherry', 0.18],
        [244, 'v10:sc-cherry', 0.18], [268, 'v10:sc-pearl-chain', 0.27], [295, 'v10:sc-bow', 0.2],
    ].forEach(([deg, id, scale], i) => {
        const p = arcPos(cx, cy, R, R, deg);
        stk(out, kit, id, p.x, p.y, A * scale, { z: 6.2 + i * 0.03, r: p.r + 90 });
    });
    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function polaroid(W, H, kit) {
    const out = [];
    const fx = W * 0.1;
    const fy = H * 0.09;
    const fw = W * 0.8;
    const fh = H * 0.66;
    const A = Math.min(fw, fh) * 0.82;
    const cx = fx + fw / 2;
    const cy = fy + fh / 2;

    base(W, H, kit, out, { paper: false, grainO: 0.24 });
    sheet(out, kit, W * 0.025, H * 0.018, W * 0.95, H * 0.964,
        { z: 1, r: -1.2, id: 'v10:sc-cream' });
    sheet(out, kit, fx, fy, fw, fh, { z: 1.4, r: 0.4, id: 'v10:sc-floral', shadow: false });
    out.push(img('v10:sc-vellum', fx, fy, fw, fh, { z: 1.5, o: 0.2, fit: 'fill' }));
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'polaroid', 3.8, { zoom: 1.03 });

    tape(out, kit, kit.tapes[0], W * 0.5, H * 0.04, W * 0.22, { h: H * 0.045, r: -2, z: 6.5 });
    stk(out, kit, 'v10:sc-flower', W * 0.055, H * 0.29, H * 0.09, { z: 6.2, r: -12 });
    stk(out, kit, 'v10:sc-heart', W * 0.945, H * 0.3, H * 0.085, { z: 6.2, r: 10 });
    stk(out, kit, 'v10:sc-bow', W * 0.075, H * 0.84, W * 0.09, { z: 6.2, r: 8 });
    stk(out, kit, 'v10:sc-cherry', W * 0.93, H * 0.83, H * 0.12, { z: 6.2, r: -10 });

    rule(out, kit, W * 0.31, H * 0.825, W * 0.38, H * 0.004, { o: 0.45 });
    out.push(txt(`${kit.mark[0]}.${kit.mark[1]}  ·  CHERRY BLUE`, W * 0.23, H * 0.855, W * 0.54,
        Math.max(3.8, H * 0.043), { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8 }));
    out.push(txt(kit.footer, W * 0.28, H * 0.918, W * 0.44, Math.max(3.2, H * 0.026),
        { font: kit.subFont, color: kit.theme.secondary, align: 'center', z: 8, o: 0.85 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function collage(W, H, kit) {
    const out = [];
    const A = H * 0.54;
    const cx = W * 0.5;
    const cy = H * 0.48;

    base(W, H, kit, out, { paper: false, grainO: 0.25 });
    wash(out, W, H, kit, 'v10:sc-floral', { z: 0.7, o: 0.18 });
    sheet(out, kit, W * 0.04, H * 0.09, W * 0.38, H * 0.76, { z: 1.3, r: -5, id: 'v10:sc-torn' });
    sheet(out, kit, W * 0.58, H * 0.05, W * 0.37, H * 0.38, { z: 1.4, r: 4, id: 'v10:sc-cream' });
    sheet(out, kit, W * 0.61, H * 0.52, W * 0.33, H * 0.4, { z: 1.5, r: -3, id: 'v10:sc-note' });
    sheet(out, kit, W * 0.29, H * 0.04, W * 0.42, H * 0.86,
        { z: 1.6, r: 1.2, id: 'v10:sc-vellum', shadow: false, o: 0.44 });

    mini(out, W * 0.07, H * 0.12, W * 0.15, H * 0.25, 'polaroid', -8, 3.2,
        { zoom: 1.14, fx: 38, fy: 43 });
    mini(out, W * 0.75, H * 0.1, W * 0.14, H * 0.24, 'torn', 7, 3.3,
        { zoom: 1.18, fx: 58, fy: 44 });
    mini(out, W * 0.08, H * 0.66, W * 0.16, H * 0.22, 'torn', 6, 3.4,
        { zoom: 1.2, fx: 44, fy: 58 });
    mini(out, W * 0.77, H * 0.65, W * 0.13, H * 0.24, 'polaroid', 9, 3.5,
        { zoom: 1.14, fx: 58, fy: 54 });
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 4.2, { zoom: 1.03 });

    tape(out, kit, kit.tapes[0], W * 0.14, H * 0.12, W * 0.14, { h: H * 0.05, r: -8 });
    tape(out, kit, kit.tapes[1], W * 0.82, H * 0.1, W * 0.13, { h: H * 0.05, r: 7 });
    label(out, kit, 'little cherry', W * 0.22, H * 0.13, W * 0.2, H * 0.037,
        { h: 1.6, z: 7, r: -4 });
    label(out, kit, '0408 / BLUE', W * 0.25, H * 0.82, W * 0.22, H * 0.034,
        { bandId: 'v10:sc-cream', h: 1.55, z: 7, r: 3 });
    head(out, kit, kit.title, W * 0.36, H * 0.035, W * 0.28, H * 0.055,
        { align: 'center', band: true, br: -1 });

    stk(out, kit, 'v10:sc-bow', W * 0.27, H * 0.63, W * 0.085, { z: 6.2, r: -12 });
    stk(out, kit, 'v10:sc-cherry', W * 0.71, H * 0.43, H * 0.13, { z: 6.2, r: 12 });
    stk(out, kit, 'v10:sc-butterfly', W * 0.68, H * 0.85, H * 0.14, { z: 6.2, r: -10 });
    scatter(out, kit, ['v10:sc-star', 'v10:sc-heart-line', 'v10:sc-flower'],
        W * 0.02, H * 0.38, W * 0.22, H * 0.2, 4, 10, { size: H * 0.065, z: 6 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function tower(W, H, kit) {
    const out = [];
    const A = W * 0.52;
    const cx = W * 0.5;
    const cy = H * 0.37;

    base(W, H, kit, out, { m: 0.018, grainO: 0.25 });
    wash(out, W, H, kit, 'v10:sc-floral', { z: 1, o: 0.15 });
    wash(out, W, H, kit, 'v10:sc-vellum', { z: 1.1, o: 0.2 });

    [0.27, 0.51, 0.75].forEach((y, i) => {
        stk(out, kit, 'v10:sc-dash', W * 0.052, H * y, H * 0.15, { z: 2.2, r: 90, o: 0.72 });
        stk(out, kit, 'v10:sc-pearl-chain', W * 0.948, H * y, H * 0.15, { z: 2.2, r: 90, o: 0.86 });
    });
    head(out, kit, kit.title, W * 0.18, H * 0.035, W * 0.64, H * 0.045,
        { align: 'center', band: true, br: -0.8 });
    out.push(txt(kit.sub, W * 0.25, H * 0.112, W * 0.5, Math.max(3.6, H * 0.019),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8 }));
    stk(out, kit, 'v10:sc-bow', W * 0.09, H * 0.09, W * 0.13, { z: 6.3, r: -10 });
    stk(out, kit, 'v10:sc-cherry', W * 0.91, H * 0.1, W * 0.12, { z: 6.3, r: 10 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 4, { zoom: 1.03 });
    stk(out, kit, 'v10:sc-heart-line', W * 0.73, H * 0.47, W * 0.11, { z: 6.1, r: 10 });
    stk(out, kit, 'v10:sc-sparkle', W * 0.27, H * 0.27, W * 0.075, { z: 6.1, r: -8 });

    mini(out, W * 0.15, H * 0.62, W * 0.29, H * 0.18, 'polaroid', -5, 3.4,
        { zoom: 1.1, fx: 42, fy: 46 });
    mini(out, W * 0.56, H * 0.62, W * 0.29, H * 0.18, 'torn', 5, 3.5,
        { zoom: 1.13, fx: 58, fy: 50 });
    tape(out, kit, kit.tapes[0], W * 0.29, H * 0.62, W * 0.21, { h: H * 0.032, r: -5 });
    tape(out, kit, kit.tapes[1], W * 0.71, H * 0.62, W * 0.21, { h: H * 0.032, r: 5 });
    label(out, kit, 'SOFT SIDE', W * 0.14, H * 0.825, W * 0.31, H * 0.019,
        { h: 1.55, z: 7, r: -2 });
    label(out, kit, 'COOL SIDE', W * 0.55, H * 0.825, W * 0.31, H * 0.019,
        { bandId: 'v10:sc-cream', h: 1.55, z: 7, r: 2 });

    stk(out, kit, 'v10:sc-flower', W * 0.18, H * 0.93, H * 0.055, { z: 6.2, r: -10 });
    stk(out, kit, 'v10:sc-heart', W * 0.82, H * 0.93, H * 0.045, { z: 6.2, r: 10 });
    rule(out, kit, W * 0.28, H * 0.947, W * 0.44, H * 0.003, { o: 0.36 });
    out.push(txt(kit.footer, W * 0.2, H * 0.965, W * 0.6, Math.max(3.2, H * 0.013),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8, o: 0.85 }));
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function banner(W, H, kit) {
    const out = [];
    const A = H * 0.6;
    const cx = W * 0.5;
    const cy = H * 0.48;

    base(W, H, kit, out, { m: 0.015, grainO: 0.24 });
    wash(out, W, H, kit, 'v10:sc-floral', { z: 1, o: 0.16 });
    wash(out, W, H, kit, 'v10:sc-vellum', { z: 1.1, o: 0.2 });
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 4.1, { zoom: 1.03 });

    mini(out, W * 0.055, H * 0.18, W * 0.13, H * 0.43, 'polaroid', -7, 3.3,
        { zoom: 1.13, fx: 40, fy: 44 });
    sheet(out, kit, W * 0.17, H * 0.48, W * 0.15, H * 0.24, { z: 1.8, r: 6, id: 'v10:sc-note' });
    stk(out, kit, 'v10:sc-cherry', W * 0.26, H * 0.28, H * 0.17, { z: 6.3, r: 12 });
    stk(out, kit, 'v10:sc-pearl-chain', W * 0.24, H * 0.62, W * 0.17, { z: 6.2, r: 8 });
    head(out, kit, kit.title, W * 0.045, H * 0.72, W * 0.27, H * 0.065, { band: true, br: -1 });
    out.push(txt(kit.sub, W * 0.055, H * 0.84, W * 0.25, Math.max(3.4, H * 0.026),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8 }));

    const s = H * 0.28;
    mini(out, W * 0.84 - s / 2, H * 0.32 - s / 2, s, s, 'circle', 5, 3.5,
        { zoom: 1.1, fx: 58, fy: 44 });
    mini(out, W * 0.75, H * 0.51, W * 0.105, H * 0.31, 'torn', -8, 3.4,
        { zoom: 1.19, fx: 54, fy: 58 });
    stk(out, kit, 'v10:sc-butterfly', W * 0.72, H * 0.22, H * 0.18, { z: 6.4, r: -12 });
    stk(out, kit, 'v10:sc-bow', W * 0.91, H * 0.7, W * 0.09, { z: 6.4, r: 10 });
    label(out, kit, 'CHERRY / 0412', W * 0.73, H * 0.84, W * 0.22, H * 0.034,
        { bandId: 'v10:sc-cream', h: 1.55, z: 7, r: 2 });

    [0.24, 0.5, 0.76].forEach((x, i) => {
        tape(out, kit, kit.tapes[i % 2], W * x, H * 0.035, W * 0.12, { h: H * 0.04, r: i % 2 ? 2 : -2 });
        tape(out, kit, kit.tapes[(i + 1) % 2], W * x, H * 0.96, W * 0.1, { h: H * 0.035, r: i % 2 ? -3 : 3 });
    });
    lineUp(W * 0.06, W * 0.94, 12).forEach((x, i) => {
        stk(out, kit, i % 3 === 0 ? 'v10:sc-heart' : 'v10:sc-sparkle', x, H * (i % 2 ? 0.075 : 0.92),
            H * (i % 3 === 0 ? 0.038 : 0.047), { z: 6.5, o: 0.82, r: i * 9 });
    });
    label(out, kit, `${kit.mark[0]} · ${kit.mark[1]}`, W * 0.41, H * 0.875, W * 0.18, H * 0.032,
        { h: 1.5, z: 7 });
    frame(W, H, kit, out, { inset: Math.min(W, H) * 0.018, t: 0.004, o: 0.28 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function scroll(W, H, kit) {
    const out = [];
    const A = H * 0.54;
    const cx = W * 0.5;
    const cy = H * 0.5;
    const step = rail(W, A, 5);

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.23 });
    wash(out, W, H, kit, 'v10:sc-floral', { z: 1, o: 0.15 });
    wash(out, W, H, kit, 'v10:sc-vellum', { z: 1.1, o: 0.18 });
    out.push(img('v10:sc-dash', 0, H * 0.475, W, H * 0.05, { z: 1.8, o: 0.55, fit: 'fill' }));

    [-1, 1].forEach((dir, side) => {
        for (let i = 1; i <= 5; i += 1) {
            const x = cx + dir * step * i;
            const s = A * (0.5 - (i - 1) * 0.065);
            mini(out, x - s / 2, cy - s / 2, s, s, i % 2 ? 'circle' : 'polaroid', dir * (i % 2 ? -4 : 5), 3.2 + i * 0.03,
                { zoom: 1.08 + i * 0.015, fx: side ? 58 : 42, fy: 45 + i });
            const decoSize = s * 0.4;
            const id = ['v10:sc-cherry', 'v10:sc-bow', 'v10:sc-star', 'v10:sc-heart', 'v10:sc-flower'][i - 1];
            stk(out, kit, id, x, H * (i % 2 ? 0.18 : 0.82), decoSize, { z: 6.2, r: dir * (12 - i) });
        }
    });
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 4.2, { zoom: 1.03 });

    lineUp(W * 0.035, W * 0.965, 18).forEach((x, i) => {
        stk(out, kit, i % 4 === 0 ? 'v10:sc-heart' : 'v10:sc-pearl-drop', x,
            H * (i % 2 ? 0.055 : 0.945), H * 0.035, { z: 6, o: 0.8, r: i % 2 ? 8 : -8 });
    });
    head(out, kit, kit.title, W * 0.42, H * 0.025, W * 0.16, H * 0.047, { align: 'center' });
    out.push(txt(`${kit.mark[0]} / ${kit.mark[1]}`, W * 0.43, H * 0.9, W * 0.14,
        Math.max(3.4, H * 0.035), { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8 }));
    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function poster(W, H, kit) {
    const out = [];
    const A = H * 0.58;
    const cx = W * 0.5;
    const cy = H * 0.47;

    base(W, H, kit, out, { paper: false, grainO: 0.24 });
    wash(out, W, H, kit, 'v10:sc-floral', { z: 0.6, o: 0.16 });
    sheet(out, kit, W * 0.025, H * 0.04, W * 0.29, H * 0.38, { z: 1.2, r: -4, id: 'v10:sc-cream' });
    sheet(out, kit, W * 0.7, H * 0.04, W * 0.27, H * 0.37, { z: 1.2, r: 4, id: 'v10:sc-torn' });
    sheet(out, kit, W * 0.03, H * 0.59, W * 0.29, H * 0.36, { z: 1.2, r: 3, id: 'v10:sc-note' });
    sheet(out, kit, W * 0.69, H * 0.58, W * 0.28, H * 0.37, { z: 1.2, r: -3, id: 'v10:sc-cream' });
    wash(out, W, H, kit, 'v10:sc-vellum', { z: 1.4, o: 0.18 });

    head(out, kit, kit.title, W * 0.37, H * 0.035, W * 0.26, H * 0.06,
        { align: 'center', band: true, br: -0.8 });
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'circle', 4.3, { zoom: 1.03 });

    mini(out, W * 0.045, H * 0.11, W * 0.105, H * 0.25, 'polaroid', -8, 3.3,
        { zoom: 1.14, fx: 40, fy: 43 });
    label(out, kit, kit.mark[1], W * 0.04, H * 0.35, W * 0.17, H * 0.03,
        { h: 1.5, z: 7, r: -5 });
    stk(out, kit, 'v10:sc-cherry', W * 0.23, H * 0.11, H * 0.13, { z: 6.3, r: 10 });
    stk(out, kit, 'v10:sc-bow', W * 0.22, H * 0.29, W * 0.08, { z: 6.3, r: -12 });
    tape(out, kit, kit.tapes[0], W * 0.1, H * 0.1, W * 0.1, { h: H * 0.04, r: -8 });

    const tr = H * 0.22;
    mini(out, W * 0.85 - tr / 2, H * 0.2 - tr / 2, tr, tr, 'circle', 5, 3.5,
        { zoom: 1.1, fx: 58, fy: 44 });
    stk(out, kit, 'v10:sc-butterfly', W * 0.73, H * 0.12, H * 0.17, { z: 6.4, r: -12 });
    stk(out, kit, 'v10:sc-pearl-chain', W * 0.75, H * 0.3, W * 0.14, { z: 6.2, r: 8 });
    stk(out, kit, 'v10:sc-star', W * 0.93, H * 0.36, H * 0.09, { z: 6.4, r: 12 });

    mini(out, W * 0.06, H * 0.64, W * 0.11, H * 0.23, 'torn', 7, 3.4,
        { zoom: 1.2, fx: 43, fy: 58 });
    stk(out, kit, 'v10:sc-flower', W * 0.23, H * 0.72, H * 0.15, { z: 6.3, r: -10 });
    stk(out, kit, 'v10:sc-bow', W * 0.24, H * 0.9, W * 0.085, { z: 6.4, r: 8 });
    stk(out, kit, 'v10:sc-dash', W * 0.16, H * 0.58, W * 0.2, { z: 5.9, r: -8 });

    stk(out, kit, 'v10:sc-frame', W * 0.86, H * 0.75, H * 0.25, { z: 3.2, r: 7 });
    stk(out, kit, 'v10:sc-heart', W * 0.73, H * 0.83, H * 0.11, { z: 6.4, r: -10 });
    stk(out, kit, 'v10:sc-bubble', W * 0.93, H * 0.9, H * 0.13, { z: 6.3, r: 8 });
    stk(out, kit, 'v10:sc-pin', W * 0.77, H * 0.65, H * 0.16, { z: 6.2, r: 18 });

    scatter(out, kit, ['v10:sc-sparkle', 'v10:sc-heart-line'], W * 0.28, H * 0.07, W * 0.1, H * 0.2,
        3, 20, { size: H * 0.045, z: 6, o: 0.8 });
    scatter(out, kit, ['v10:sc-sparkle', 'v10:sc-star'], W * 0.62, H * 0.73, W * 0.09, H * 0.18,
        3, 30, { size: H * 0.045, z: 6, o: 0.8 });
    label(out, kit, 'CREAM / BLUE / CHERRY', W * 0.39, H * 0.82, W * 0.22, H * 0.035,
        { bandId: 'v10:sc-cream', h: 1.6, z: 7, r: -1 });
    rule(out, kit, W * 0.42, H * 0.91, W * 0.16, H * 0.003, { o: 0.38 });
    out.push(txt(kit.footer, W * 0.36, H * 0.93, W * 0.28, Math.max(3.4, H * 0.022),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8, o: 0.85 }));
    frame(W, H, kit, out, { inset: Math.min(W, H) * 0.018, t: 0.004, o: 0.3 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

export const builds = { chip, compact, circle, polaroid, collage, tower, banner, scroll, poster };
