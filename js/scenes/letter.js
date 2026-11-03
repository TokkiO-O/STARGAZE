import { F, img, txt } from '../assets/base.js';
import {
    PAL, base, wash, sheet, portrait, mini, stk, tape, label, head, rule, mark,
    frame, corners, arcPos,
} from './kit.js';

export const style = {
    id: 'letter',
    name: '诗歌信笺',
    desc: '信纸 · 火漆 · 羽毛，文艺诗集内页',
    avatarShape: 'square',
    layout: 'tower',
    palette: PAL(['#e6e0d3', '#f2eee4', '#d8d1c1'], '#fdfaf2', '#d6d0c0', '#8d8474', '#33322e', '#efeade', '#ffffff', true),
    decos: ['v10:lt-seal', 'v10:lt-feather', 'v10:lt-olive', 'v10:lt-ink', 'v10:lt-mailtag', 'v10:lt-bookmark'],
    glyphs: ['·', '—', '✎', '❦'],
    lace: '', laceRatio: 1,
    tapes: [],
    font: F.serif, subFont: F.mono,
    title: 'POEM', sub: '{{title|A LETTER TO YOU}}', badge: '—',
    footer: 'written on a quiet afternoon', mark: ['1904', '2026'],
};

function verse(out, kit, lines, x, y, w, size, gap, o = {}) {
    lines.forEach((line, i) => {
        out.push(txt(line, x, y + i * gap, w, size, {
            font: o.font || kit.subFont,
            color: o.color || kit.theme.onLight,
            z: o.z == null ? 7.4 : o.z,
            r: o.r || 0,
            o: o.o == null ? 0.88 : o.o,
        }));
    });
}

function chip(W, H, kit) {
    const out = [];
    const A = H * 0.62;
    const cx = W * 0.42;
    const cy = H * 0.52;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.22 });
    wash(out, W, H, kit, 'v10:lt-watermark', { z: 1.0, o: 0.5 });
    wash(out, W, H, kit, 'v10:lt-lines', { z: 1.05, o: 0.3 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'rect', 3.6, { zoom: 1.14, fx: 48, fy: 40 });

    out.push(txt('a quiet afternoon', W * 0.16, H * 0.09, W * 0.44, Math.max(4, H * 0.08),
        { font: F.hand, color: kit.theme.onLight, z: 7.4 }));
    out.push(txt('— 1904 · 2026 —', W * 0.2, H * 0.87, W * 0.4, Math.max(3.4, H * 0.058),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 7.4 }));

    stk(out, kit, 'v10:lt-seal', W * 0.965, H * 0.5, H * 0.42, { z: 7, r: -6 });

    stk(out, kit, 'v10:lt-dash-v', W * 0.72, H * 0.5, H * 0.8, { z: 6.4, o: 0.7 });
    stk(out, kit, 'v10:lt-ink', W * 0.78, H * 0.3, H * 0.12, { z: 6.4, o: 0.6 });
    stk(out, kit, 'v10:lt-mailtag', W * 0.84, H * 0.72, W * 0.14, { z: 7, r: 6 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function compact(W, H, kit) {
    const out = [];
    const A = H * 0.56;
    const cx = W * 0.6;
    const cy = H * 0.46;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.22 });
    wash(out, W, H, kit, 'v10:lt-lines', { z: 1.0, o: 0.55 });
    wash(out, W, H, kit, 'v10:lt-watermark', { z: 1.05, o: 0.45 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'rect', 3.6, { zoom: 1.04 });

    'the quiet light falls on the page'.split(' ').slice(0, 6).forEach((word, i) => {
        out.push(txt(word, W * 0.07, H * (0.08 + i * 0.135), W * 0.12, Math.max(3, H * 0.036),
            { font: kit.subFont, color: kit.theme.onLight, z: 7.4, o: 0.85 }));
    });

    stk(out, kit, 'v10:lt-seal', W * 0.82, H * 0.85, H * 0.2, { z: 7, r: 8 });

    stk(out, kit, 'v10:lt-dash-v', W * 0.26, H * 0.5, H * 0.82, { z: 6.4, o: 0.6 });

    out.push(txt(kit.title, W * 0.66, H * 0.04, W * 0.3, Math.max(4, H * 0.05),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 8 }));
    stk(out, kit, 'v10:lt-ink', W * 0.34, H * 0.14, H * 0.08, { z: 6.4, o: 0.5 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function circle(W, H, kit) {
    const out = [];
    const A = Math.min(W, H) * 0.5;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.22 });
    wash(out, W, H, kit, 'v10:lt-watermark', { z: 1.0, o: 0.5 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'oval', 3.6, { zoom: 1.03 });

    const R = Math.min(W, H) * 0.44;
    for (let i = 0; i < 20; i += 1) {
        const p = arcPos(cx, cy, R, R, (i / 20) * 360);
        out.push(txt('· a quiet afternoon ·', p.x - A * 0.14, p.y - A * 0.03, A * 0.28, Math.max(3, A * 0.055),
            { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 6.4, r: p.r + 90, o: 0.85 }));
    }

    for (let i = 0; i < 12; i += 1) {
        const p = arcPos(cx, cy, Math.min(W, H) * 0.35, Math.min(W, H) * 0.35, (i / 12) * 360);
        out.push(img('v10:lt-dash', p.x - A * 0.07, p.y - A * 0.012, A * 0.14, A * 0.024,
            { z: 6, r: p.r + 90, o: 0.45, fit: 'fill' }));
    }
    stk(out, kit, 'v10:lt-ink', cx, cy + A * 0.66, H * 0.05, { z: 6.4, o: 0.5 });

    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function polaroid(W, H, kit) {
    const out = [];
    const fx = W * 0.085;
    const fy = H * 0.065;
    const fw = W * 0.83;
    const fh = H * 0.66;
    const A = Math.min(fw, fh) * 0.7;
    const cx = fx + fw / 2;
    const cy = fy + fh / 2;

    base(W, H, kit, out, { paper: false, grainO: 0.22 });
    out.push(img('v10:lt-paper', W * 0.03, H * 0.02, W * 0.94, H * 0.95, { z: 0.8, r: 2, fit: 'fill' }));
    out.push(img('v10:lt-paper', W * 0.045, H * 0.03, W * 0.91, H * 0.93, { z: 1, r: 0.6, fit: 'fill' }));

    out.push(img('v10:lt-smudge', fx, fy, fw, fh, { z: 1.2, o: 0.8, fit: 'fill' }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'rect', 3.6, { zoom: 1.02 });

    verse(out, kit, ['i keep the light', 'of that afternoon', 'folded in paper', 'and say nothing'],
        W * 0.075, H * 0.76, W * 0.6, Math.max(3.4, H * 0.036), H * 0.048);

    stk(out, kit, 'v10:lt-ink', W * 0.93, H * 0.04, H * 0.05, { z: 7, o: 0.55 });
    stk(out, kit, 'v10:lt-ink', W * 0.88, H * 0.08, H * 0.03, { z: 7, o: 0.4 });

    stk(out, kit, 'v10:lt-dash', W * 0.5, H * 0.7, W * 0.6, { z: 6.8, o: 0.6 });
    stk(out, kit, 'v10:lt-seal', W * 0.9, H * 0.9, H * 0.13, { z: 7.2, r: -6 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function collage(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.22 });
    wash(out, W, H, kit, 'v10:lt-watermark', { z: 0.5, o: 0.55 });

    sheet(out, kit, W * 0.02, H * 0.06, W * 0.4, H * 0.3, { z: 1.4, r: -5, id: 'v10:lt-paper' });
    sheet(out, kit, W * 0.3, H * 0.02, W * 0.34, H * 0.44, { z: 1.5, r: 4, id: 'v10:lt-lines' });
    sheet(out, kit, W * 0.56, H * 0.1, W * 0.42, H * 0.3, { z: 1.6, r: -3, id: 'v10:lt-paper' });
    sheet(out, kit, W * 0.06, H * 0.56, W * 0.44, H * 0.38, { z: 1.7, r: 3, id: 'v10:lt-lines' });
    sheet(out, kit, W * 0.56, H * 0.56, W * 0.4, H * 0.38, { z: 1.8, r: -4, id: 'v10:lt-paper' });

    [[0.02, 0.06], [0.56, 0.1], [0.06, 0.56], [0.56, 0.56]].forEach(([x, y]) =>
        stk(out, kit, 'v10:lt-smudge', W * x, H * y, W * 0.16, { z: 1.4, o: 0.5 }));

    const A = H * 0.5;
    const cx = W * 0.47;
    const cy = H * 0.45;
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'rect', 3.8, { zoom: 1.03 });

    verse(out, kit, ['a letter', 'never sent', '1904'], W * 0.05, H * 0.1, W * 0.3,
        Math.max(3.2, H * 0.026), H * 0.048);
    verse(out, kit, ['the light', 'on the page', 'stays'], W * 0.62, H * 0.14, W * 0.3,
        Math.max(3.2, H * 0.026), H * 0.048);
    verse(out, kit, ['nothing', 'is louder', 'than quiet'], W * 0.1, H * 0.6, W * 0.3,
        Math.max(3.2, H * 0.026), H * 0.048);
    mini(out, W * 0.62, H * 0.62, W * 0.14, H * 0.24, 'rect', 3.4, { zoom: 1.16, fx: 44, fy: 48 });
    mini(out, W * 0.34, H * 0.06, W * 0.11, H * 0.2, 'rect', 3.4, { zoom: 1.2, fx: 52, fy: 42 });

    stk(out, kit, 'v10:lt-feather', W * 0.34, H * 0.66, H * 0.42, { z: 6.4, r: 48 });
    stk(out, kit, 'v10:lt-olive', W * 0.88, H * 0.44, H * 0.3, { z: 6.2, r: -24 });

    [[0.3, 0.42], [0.66, 0.5], [0.5, 0.3], [0.16, 0.5], [0.86, 0.72]].forEach(([x, y], i) =>
        stk(out, kit, 'v10:lt-ink', W * x, H * y, H * (i % 2 ? 0.06 : 0.08), { z: 6.6, o: 0.55 }));

    stk(out, kit, 'v10:lt-seal', W * 0.9, H * 0.1, H * 0.13, { z: 7, r: 8 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function tower(W, H, kit) {
    const out = [];
    const A = W * 0.62;
    const cx = W * 0.56;
    const cy = H * 0.3;

    base(W, H, kit, out, { m: 0.02, grainO: 0.22 });
    wash(out, W, H, kit, 'v10:lt-watermark', { z: 1.0, o: 0.5 });
    wash(out, W, H, kit, 'v10:lt-lines', { z: 1.05, o: 0.3 });

    out.push(img('v10:lt-mailtag', W * 0.16, H * 0.012, W * 0.6, H * 0.036, { z: 7, r: -1, fit: 'fill' }));
    out.push(txt(kit.title, W * 0.2, H * 0.017, W * 0.52, Math.max(4, H * 0.018),
        { font: kit.subFont, color: kit.theme.onLight, align: 'center', z: 7.4, r: -1 }));

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'rect', 3.6, { zoom: 1.03 });

    verse(out, kit, [
        'the afternoon folds itself',
        'into a page of quiet light,',
        'and every word i did not say',
        'is still here, in pencil,',
        'waiting for the ink to dry.',
    ], W * 0.18, H * 0.56, W * 0.68, Math.max(3.6, H * 0.019), H * 0.042);

    stk(out, kit, 'v10:lt-string-v', W * 0.07, H * 0.5, H * 0.94, { z: 6.2, r: 0 });
    [0.18, 0.42, 0.66, 0.88].forEach((y, i) =>
        stk(out, kit, 'v10:lt-seal', W * 0.07, H * y, H * 0.022, { z: 6.4, r: i * 30 }));

    stk(out, kit, 'v10:lt-olive', W * 0.92, H * 0.42, H * 0.4, { z: 6, r: 10 });

    rule(out, kit, W * 0.16, H * 0.955, W * 0.7, H * 0.0025, { o: 0.3 });
    out.push(txt(kit.footer, W * 0.1, H * 0.965, W * 0.8, Math.max(3.2, H * 0.012),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8, o: 0.8 }));

    out.push(txt('a letter, never sent', W * 0.1, H * 0.05, W * 0.8, Math.max(3.4, H * 0.02),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 7.4, o: 0.85 }));
    rule(out, kit, W * 0.22, H * 0.082, W * 0.56, H * 0.002, { o: 0.4 });
    stk(out, kit, 'v10:lt-ink', W * 0.82, H * 0.13, H * 0.05, { z: 6.6, o: 0.5 });
    stk(out, kit, 'v10:lt-string', W * 0.12, H * 0.24, W * 0.1, { z: 6.4, r: -8, o: 0.85 });

    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function banner(W, H, kit) {
    const out = [];
    const A = W * 0.29;
    const cx = W * 0.5;
    const cy = H * 0.48;

    base(W, H, kit, out, { m: 0.016, grainO: 0.22 });
    wash(out, W, H, kit, 'v10:lt-watermark', { z: 1.0, o: 0.55 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'rect', 3.8, { zoom: 1.03 });

    verse(out, kit, [
        'i wrote your name',
        'on the back of a page',
        'and the paper',
        'kept it all winter',
    ], W * 0.06, H * 0.16, W * 0.34, Math.max(3.4, H * 0.026), H * 0.062);

    verse(out, kit, [
        'nothing louder',
        'than quiet,',
        'nothing softer',
        'than ink.',
    ], W * 0.6, H * 0.16, W * 0.34, Math.max(3.4, H * 0.026), H * 0.062);

    stk(out, kit, 'v10:lt-seal', W * 0.035, H * 0.55, H * 0.24, { z: 7, r: -8 });
    stk(out, kit, 'v10:lt-seal', W * 0.965, H * 0.55, H * 0.24, { z: 7, r: 8 });

    stk(out, kit, 'v10:lt-dash-v', W * 0.42, H * 0.5, H * 0.8, { z: 6.6, o: 0.55 });
    stk(out, kit, 'v10:lt-dash-v', W * 0.58, H * 0.5, H * 0.8, { z: 6.6, o: 0.55 });

    stk(out, kit, 'v10:lt-olive', W * 0.16, H * 0.85, H * 0.27, { z: 6.4, r: -18 });
    stk(out, kit, 'v10:lt-olive', W * 0.84, H * 0.86, H * 0.27, { z: 6.4, r: 18 });
    stk(out, kit, 'v10:lt-ink', W * 0.3, H * 0.88, H * 0.06, { z: 6.6, o: 0.5 });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

function scroll(W, H, kit) {
    const out = [];
    const A = H * 0.6;
    const cx = W * 0.5;
    const cy = H * 0.5;

    base(W, H, kit, out, { m: 0, shadow: false, grainO: 0.22 });
    wash(out, W, H, kit, 'v10:lt-lines', { z: 1.0, o: 0.5 });
    wash(out, W, H, kit, 'v10:lt-watermark', { z: 1.05, o: 0.4 });

    portrait(out, cx - A / 2, cy - A / 2, A, A, 'rect', 3.8, { zoom: 1.03 });

    const blocks = [
        { x: 0.34, lines: ['the light', 'stays'] },
        { x: 0.25, lines: ['a letter', 'never sent', '1904'] },
        { x: 0.15, lines: ['quiet'] },
        { x: 0.06, lines: ['ink', 'dries', 'slow'] },
        { x: 0.66, lines: ['nothing', 'louder'] },
        { x: 0.75, lines: ['than quiet,', 'nothing', 'softer'] },
        { x: 0.85, lines: ['than ink.'] },
        { x: 0.94, lines: ['1904'] },
    ];
    blocks.forEach((b, i) => {
        const x = W * b.x;
        b.lines.forEach((line, j) => {
            out.push(txt(line, x - W * 0.04, H * (0.3 + j * 0.115), W * 0.08, Math.max(3.6, H * 0.048),
                { font: kit.subFont, color: kit.theme.onLight, align: 'center', z: 7.4, o: 0.85 }));
        });
        if (i % 2 === 1) stk(out, kit, 'v10:lt-seal', x + W * 0.02, H * 0.5, H * 0.1, { z: 7, r: i * 12 });
    });

    [0.2, 0.3, 0.7, 0.8].forEach((x, i) =>
        stk(out, kit, 'v10:lt-string', W * x, H * (i % 2 ? 0.2 : 0.8), W * 0.06, { z: 6.4, r: i % 2 ? 8 : -8, o: 0.85 }));

    out.push(txt(kit.title, cx - A * 0.9, H * 0.08, A * 1.8, Math.max(4, H * 0.035),
        { font: kit.font, color: kit.theme.onLight, align: 'center', z: 8 }));
    out.push(txt(kit.footer, cx - A * 1.2, H * 0.86, A * 2.4, Math.max(3.2, H * 0.026),
        { font: kit.subFont, color: kit.theme.accent, align: 'center', z: 8, o: 0.8 }));
    return { elements: out, avatarUnits: A, anchorX: 0.5, anchorY: 0.5 };
}

function poster(W, H, kit) {
    const out = [];
    base(W, H, kit, out, { paper: false, grainO: 0.22 });
    wash(out, W, H, kit, 'v10:lt-watermark', { z: 0.5, o: 0.7 });
    wash(out, W, H, kit, 'v10:lt-paper', { z: 0.45, o: 0.5 });

    const slips = [
        { x: 0.02, y: 0.55, w: 0.36, h: 0.4, r: 3.4 },
        { x: 0.6, y: 0.06, w: 0.36, h: 0.36, r: -3 },
        { x: 0.03, y: 0.08, w: 0.26, h: 0.26, r: -5 },
        { x: 0.68, y: 0.62, w: 0.28, h: 0.32, r: 4 },
        { x: 0.3, y: 0.02, w: 0.24, h: 0.2, r: 2 },
        { x: 0.36, y: 0.82, w: 0.3, h: 0.16, r: -2 },
    ];
    slips.forEach(s => sheet(out, kit, W * s.x, H * s.y, W * s.w, H * s.h, { z: 1.3, r: s.r, id: 'v10:lt-lines' }));

    const A = H * 0.56;
    const cx = W * 0.5;
    const cy = H * 0.47;
    portrait(out, cx - A / 2, cy - A / 2, A, A, 'rect', 3.9, { zoom: 1.03 });

    verse(out, kit, ['i wrote your name', 'on the back of a page', 'and the paper kept it', 'all winter long,', 'folded and quiet.'],
        W * 0.05, H * 0.6, W * 0.32, Math.max(3.2, H * 0.022), H * 0.045);
    verse(out, kit, ['nothing louder than quiet,', 'nothing softer than ink,', 'nothing longer than', 'an afternoon like this.'],
        W * 0.63, H * 0.1, W * 0.32, Math.max(3.2, H * 0.022), H * 0.045);

    verse(out, kit, ['1904', '2026'], W * 0.08, H * 0.12, W * 0.2, Math.max(3, H * 0.02), H * 0.04);
    verse(out, kit, ['a letter', 'never sent'], W * 0.7, H * 0.66, W * 0.22, Math.max(3, H * 0.02), H * 0.04);
    verse(out, kit, ['quiet'], W * 0.42, H * 0.86, W * 0.2, Math.max(3, H * 0.018), H * 0.04);

    [[0.24, 0.46, 0.09], [0.78, 0.46, 0.07], [0.5, 0.09, 0.06], [0.14, 0.96, 0.05], [0.94, 0.86, 0.06]]
        .forEach(([x, y, s], i) => stk(out, kit, 'v10:lt-seal', W * x, H * y, H * s, { z: 7, r: i * 16 - 20 }));
    stk(out, kit, 'v10:lt-olive', W * 0.88, H * 0.36, H * 0.28, { z: 6.2, r: 22 });
    stk(out, kit, 'v10:lt-feather', W * 0.13, H * 0.32, H * 0.34, { z: 6.2, r: -32 });

    for (let i = 0; i < 12; i += 1) {
        const x = W * (0.1 + ((i * 47) % 82) / 100);
        const y = H * (0.1 + ((i * 67) % 82) / 100);
        stk(out, kit, 'v10:lt-ink', x, y, H * (i % 2 ? 0.04 : 0.055), { z: 6.6, o: 0.5 });
    }

    head(out, kit, kit.title, W * 0.44, H * 0.03, W * 0.16, H * 0.045, { align: 'center' });
    return { elements: out, avatarUnits: A, anchorX: cx / W, anchorY: cy / H };
}

export const builds = { chip, compact, circle, polaroid, collage, tower, banner, scroll, poster };
