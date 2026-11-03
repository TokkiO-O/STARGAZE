import { box, img, measure } from '../assets/base.js';
import { accOf, paperOf, shadowOf, softOf } from './kit.js';

const SLICE_SHAPES = ['rounded', 'arch', 'polaroid', 'square', 'circle', 'film'];

const PNG_PREFIX = 'v10:pin-';
const isPng = id => typeof id === 'string' && id.startsWith(PNG_PREFIX);

const CLIP_Z = 6.9;

const PORTRAIT_QUOTA = {
    chip: 2, compact: 2, circle: 2, polaroid: 2, collage: 3,
    tower: 3, banner: 2, scroll: 2, poster: 3,
};

function seeded(seed) {
    let s = (seed || 7) * 2654435761 % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

function gcd(a, b) {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
        [x, y] = [y, x % y];
    }
    return x || 1;
}

function lightDecosOf(kit) {
    const all = (kit.decos || []).filter(Boolean);
    const light = all.filter(id => !isPng(id));
    return light.length ? light : all;
}

function decoAt(decos, n) {
    if (!decos.length) return '';
    let step = 1;
    for (const candidate of [3, 5, 7, 11, 13, 17]) {
        if (gcd(candidate, decos.length) === 1) {
            step = candidate;
            break;
        }
    }
    return decos[(((n * step) % decos.length) + decos.length) % decos.length];
}

function hash(text) {
    let value = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
        value ^= text.charCodeAt(i);
        value = Math.imul(value, 16777619);
    }
    return Math.abs(value);
}

const NUMBER_ONLY = /^[\s\d.:：\-\/\\·,，、年月日号No.#]*$/;

function isNumberNoise(element) {
    if (element.type !== 'text' && element.type !== 'sticker') return false;
    const text = String(element.text ?? '').trim();
    if (!text) return false;

    if (text.includes('{{')) return false;
    if (!/\d/.test(text)) return false;
    if (NUMBER_ONLY.test(text)) return true;
    if (/[\u4e00-\u9fa5]/.test(text)) return false;

    return text.length <= 16 || /\d{3,}/.test(text);
}

function stripDigitTokens(text) {
    return String(text)
        .replace(/[\w\u4e00-\u9fa5\-–—./·]*\d[\w\-–—./·]*/g, ' ')
        .replace(/[|/·•\-–—_]+/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

function dropNumberNoise(W, H, kit, out) {
    const decos = lightDecosOf(kit);
    const cap = Math.min(W, H) * 0.2;
    let index = 0;
    for (const element of out) {
        if (!isNumberNoise(element)) continue;
        const kept = stripDigitTokens(element.text);
        index += 1;

        const letters = kept.replace(/[^A-Za-z\u4e00-\u9fa5]/g, '');
        if (letters.length >= 5) {
            element.text = kept;
            continue;
        }
        const id = decos.length ? decoAt(decos, hash(element.id) + index * 3) : softOf(kit);

        const size = Math.min(Math.max(Math.max(element.width, element.height), (Number(element.fontSize) || 6) * 2.2), cap);
        const b = box(id, size);
        element.type = 'image';
        element.assetId = id;
        element.shape = 'none';
        element.fit = 'fill';
        element.cropZoom = 1;
        element.focusX = 50;
        element.focusY = 50;
        element.caption = '';
        element.opacity = 1;
        element.x += element.width / 2 - b.w / 2;
        element.y += element.height / 2 - b.h / 2;
        element.width = b.w;
        element.height = b.h;
        element.rotation = (Number(element.rotation) || 0) + (index % 2 ? 7 : -7);
        delete element.text;
        delete element.fontSize;
        delete element.fontFamily;
        delete element.stroke;
        delete element.shadow;
        delete element.align;
        delete element.color;
    }
}

function limitPortraits(W, H, kit, out, layout) {

    const bonus = 0;
    const quota = (PORTRAIT_QUOTA[layout] || 2) + bonus;
    const portraits = out.filter(element => element.type === 'image' && element.assetId === '__avatar__');
    if (portraits.length <= quota) return;
    const ranked = [...portraits].sort((a, b) => b.width * b.height - a.width * a.height);
    const keep = new Set(ranked.slice(0, quota).map(element => element.id));
    const decos = lightDecosOf(kit);
    let index = 0;
    for (const element of portraits) {
        if (keep.has(element.id)) continue;
        index += 1;

        const id = decos.length ? decoAt(decos, hash(element.id) + index) : softOf(kit);
        element.assetId = id;
        element.fit = 'cover';
        element.cropZoom = 1;
        element.focusX = 50;
        element.focusY = 50;
        element.caption = '';
        element.opacity = 0.98;
        element.rotation = (Number(element.rotation) || 0) + (index % 2 ? 2.6 : -2.2);
        if (element.shape === 'none') element.shape = index % 2 ? 'rounded' : 'rect';
    }
}

function fillGaps(W, H, kit, out, seed) {
    const unit = Math.min(W, H) * 0.21;
    const cols = Math.min(16, Math.max(4, Math.round(W / unit)));
    const rows = Math.min(9, Math.max(2, Math.round(H / unit)));
    const cw = W / cols;
    const ch = H / rows;

    const solids = out.filter(element => (
        (Number(element.z) || 0) >= 2
        && element.assetId !== '__avatar__'
        && element.width * element.height > cw * ch * 0.75
    ));
    if (!solids.length) return;
    const decos = (kit.decos || []).filter(Boolean);

    const lightDecos = decos.filter(id => !isPng(id));
    const pool = lightDecos.length ? lightDecos : decos;
    const tapes = (kit.tapes || []).filter(Boolean);
    const rand = seeded(seed + 29);

    const ratio = W / Math.max(1, H);
    const density = ratio > 2.6 ? 0.3 : ratio > 1.8 ? 0.36 : 0.44;
    const budget = Math.max(6, Math.round(cols * rows * density));
    let index = 0;
    for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
            if (index >= budget) break;
            const cx = (col + 0.5) * cw;
            const cy = (row + 0.5) * ch;
            const covered = solids.some(element => (
                cx > element.x && cx < element.x + element.width
                && cy > element.y && cy < element.y + element.height
            ));
            if (covered) continue;
            index += 1;
            const roll = rand();
            const jitterX = (rand() - 0.5) * cw * 0.26;
            const jitterY = (rand() - 0.5) * ch * 0.26;
            const z = 2.02 + rand() * 0.22;
            if (roll < 0.34 && tapes.length) {

                const w = Math.max(cw * 0.9, W * 0.06);
                const h = Math.max(2.2, Math.min(cw, ch) * 0.17);
                out.push(img(tapes[index % tapes.length], cx - w / 2 + jitterX, cy - h / 2 + jitterY, w, h,
                    { z, r: -20 + rand() * 40, o: 0.72 + rand() * 0.22, fit: 'fill' }));
            } else if (roll < 0.62) {

                const w = Math.min(cw, ch) * (1.05 + rand() * 0.5);
                const h = Math.min(cw, ch) * (0.78 + rand() * 0.4);
                out.push(img(index % 3 === 0 ? paperOf(kit) : softOf(kit),
                    cx - w / 2 + jitterX, cy - h / 2 + jitterY, w, h,
                    { z: z - 0.02, r: -13 + rand() * 26, o: 0.82 + rand() * 0.16, fit: 'fill' }));

                if (rand() < 0.34) {
                    const w2 = w * (0.62 + rand() * 0.26);
                    const h2 = h * (0.58 + rand() * 0.3);
                    out.push(img(paperOf(kit),
                        cx - w2 / 2 + jitterX + w * 0.12, cy - h2 / 2 + jitterY - h * 0.1, w2, h2,
                        { z: z + 0.02, r: -16 + rand() * 32, o: 0.78 + rand() * 0.2, fit: 'fill' }));
                }
            } else {
                const id = pool.length ? decoAt(pool, index * 3 + row) : softOf(kit);

                const size = Math.min(cw, ch) * (0.62 + rand() * 0.42);
                const b = box(id, Math.max(size, ratio > 2.6 ? Math.min(cw, ch) * 0.86 : 0));

                out.push(img(id, cx - b.w / 2 + jitterX, cy - b.h / 2 + jitterY, b.w, b.h,
                    { z, r: -24 + rand() * 48, o: 0.86 + rand() * 0.14, fit: 'contain' }));
            }
        }
    }
}

function scrollCompose(W, H, kit, out, seed) {
    const rand = seeded(seed + 41);
    const u = H;
    const decos = (kit.decos || []).filter(Boolean);
    const pngs = decos.filter(isPng);

    const count = 7;
    for (let i = 0; i < count; i += 1) {
        const w = W * (0.085 + rand() * 0.07);
        const h = H * (0.46 + rand() * 0.36);
        const x = W * (0.01 + (i / count) * 0.95) + (rand() - 0.5) * W * 0.015;
        const y = (H - h) / 2 + (rand() - 0.5) * H * 0.18;
        const r = -7 + rand() * 14;

        out.push(img(shadowOf(kit), x + w * 0.018, y + h * 0.03, w * 1.01, h * 1.03,
            { z: 1.2 + i * 0.055, r, o: 0.42, fit: 'fill' }));
        out.push(img(i % 3 === 0 ? paperOf(kit) : softOf(kit), x, y, w, h, {
            z: 1.26 + i * 0.055,
            r,
            o: 0.68 + rand() * 0.24,
            fit: 'fill',
        }));
    }

    if (!pngs.length) return;

    let main = null;
    for (const element of out) {
        if (element.type !== 'image' || element.assetId !== '__avatar__') continue;
        if (!main || element.width * element.height > main.width * main.height) main = element;
    }
    const faceX0 = main ? main.x : W * 0.36;
    const faceX1 = main ? main.x + main.width : W * 0.64;

    const slice = out.find(element => (
        element.type === 'image' && element.assetId === '__avatar__' && element !== main
    ));
    if (slice && main) {
        const mainCx = main.x + main.width / 2;
        const toRight = mainCx < W * 0.62;
        const cardW = Math.min(H * 0.3, W * 0.09);
        const cardH = cardW * 1.18;
        const cardCx = toRight ? W * 0.8 : W * 0.2;
        slice.x = cardCx - cardW / 2;
        slice.y = H * 0.5 - cardH / 2 + H * 0.02;
        slice.width = cardW;
        slice.height = cardH;
        slice.shape = 'polaroid';
        slice.rotation = toRight ? -3.6 : 3.6;
        slice.cropZoom = 1.26;
        slice.focusX = 50;
        slice.focusY = 42;
        slice.caption = '';
        slice.z = 5.5;

        out.push(img(shadowOf(kit), slice.x + cardW * 0.04, slice.y + cardH * 0.05,
            cardW * 1.04, cardH * 1.02, { z: 5.4, r: slice.rotation, o: 0.46, fit: 'fill' }));
        const tapes = (kit.tapes || []).filter(Boolean);
        if (tapes.length) {
            out.push(img(tapes[0], slice.x + cardW * 0.16, slice.y - cardH * 0.05,
                cardW * 0.68, Math.max(3, H * 0.045),
                { z: 5.9, r: toRight ? -7 : 7, o: 0.82, fit: 'fill' }));
        }
    }

    const blocked = [[faceX0, faceX1]];
    if (slice) blocked.push([slice.x, slice.x + slice.width]);
    blocked.sort((a, b) => a[0] - b[0]);
    const gaps = [];
    let cursorX = W * 0.015;
    for (const [from, to] of blocked) {

        if (from - cursorX > u * 0.5) gaps.push({ x0: cursorX + u * 0.03, x1: from - u * 0.03 });
        cursorX = Math.max(cursorX, to);
    }
    if (W * 0.985 - cursorX > u * 0.5) gaps.push({ x0: cursorX + u * 0.03, x1: W * 0.985 });
    const zones = gaps.filter(zone => zone.x1 > zone.x0);

    const existingPng = out.filter(element => element.type === 'image' && isPng(element.assetId)).length;

    const usedPrints = new Set(out.filter(element => element.type === 'image' && isPng(element.assetId)).map(element => element.assetId));
    const takePrint = from => {
        for (let k = 0; k < pngs.length; k += 1) {
            const id = pngs[(from + k) % pngs.length];
            if (usedPrints.has(id)) continue;
            usedPrints.add(id);
            return id;
        }
        return null;
    };
    const pngCeiling = 5;
    let placed = 0;
    let cursor = 0;
    for (const zone of zones) {
        const span = zone.x1 - zone.x0;
        const slots = Math.min(span > u * 1.7 ? 2 : 1, Math.max(0, pngCeiling - existingPng - placed));
        for (let i = 0; i < slots; i += 1) {
            const id = pngs[(cursor * 3 + i) % pngs.length];
            cursor += 1;
            placed += 1;
            const big = i === 0;

            const b = box(id, u * (big ? 0.4 + rand() * 0.09 : 0.3 + rand() * 0.07));
            const cx = zone.x0 + span * ((i + 0.5) / slots) + (rand() - 0.5) * span * 0.12;
            const cy = H * (0.28 + rand() * 0.44);
            const r = -16 + rand() * 32;

            out.push(img(shadowOf(kit), cx - b.w * 0.62 + 1.2, cy - b.h * 0.62 + 2.2,
                b.w * 1.16, b.h * 1.16, { z: CLIP_Z - 0.1, r: r * 0.55, o: 0.24, fit: 'fill' }));
            out.push(img(i % 2 ? paperOf(kit) : softOf(kit),
                cx - b.w * 0.55, cy - b.h * 0.55, b.w * 1.1, b.h * 1.1,
                { z: CLIP_Z - 0.08, r: r * 0.55, o: 0.9, fit: 'fill' }));
            out.push(img(id, cx - b.w / 2, cy - b.h / 2, b.w, b.h,
                { z: CLIP_Z - 0.04 + i * 0.04, r, o: 0.98, fit: 'contain' }));
        }
    }

    const upgradeRoom = Math.max(0, pngCeiling - existingPng - placed);
    if (!upgradeRoom) return;
    const tiny = out.filter(element => {
        if (element.type !== 'image' || element.assetId === '__avatar__') return false;
        if (isPng(element.assetId)) return false;
        const area = element.width * element.height;
        const ratio = element.width / Math.max(1, element.height);
        return area > u * u * 0.0008 && area < u * u * 0.016
            && ratio > 0.6 && ratio < 1.7
            && (Number(element.z) || 0) > 4;
    });
    let upgraded = 0;
    tiny.forEach((element, index) => {
        if (index % 2) return;
        if (upgraded >= upgradeRoom) return;
        upgraded += 1;

        const from = takePrint(index * 5 + 1);
        if (!from) return;
        const b = box(from, Math.max(element.width, element.height) * 1.4);
        const cx = element.x + element.width / 2;
        const cy = element.y + element.height / 2;

        const boxed = { x: cx - b.w / 2, y: cy - b.h / 2, width: b.w, height: b.h };
        const faceBoxes = out.filter(item => item.assetId === '__avatar__');
        const onFace = faceBoxes.some(face => {
            const ox = Math.max(0, Math.min(boxed.x + b.w, face.x + face.width) - Math.max(boxed.x, face.x));
            const oy = Math.max(0, Math.min(boxed.y + b.h, face.y + face.height) - Math.max(boxed.y, face.y));
            return ox > 0 && oy > 0 && (ox * oy) / Math.max(1, b.w * b.h) > 0.2;
        });
        if (onFace) return;
        element.assetId = from;
        element.width = b.w;
        element.height = b.h;
        element.x = cx - b.w / 2;
        element.y = cy - b.h / 2;
        element.fit = 'contain';
        element.opacity = 0.96;
    });
}

const CLIP_ANCHORS = [
    { x: 0.03, y: 0.04, r: -8 },
    { x: 0.74, y: 0.03, r: 7 },
    { x: 0.04, y: 0.66, r: 6 },
    { x: 0.72, y: 0.64, r: -5 },
    { x: 0.3, y: 0.02, r: -3 },
    { x: 0.02, y: 0.34, r: -11 },
    { x: 0.8, y: 0.33, r: 10 },
];

function curateClippings(W, H, kit, out, layout, seed) {
    const prints = (kit.decos || []).filter(isPng);
    if (!prints.length) return;

    for (let i = out.length - 1; i >= 0; i -= 1) {
        if (out[i].type === 'image' && isPng(out[i].assetId)) out.splice(i, 1);
    }
    const rand = seeded(seed + 71);
    const u = Math.min(W, H);
    const plan = {
        chip: 1, compact: 1, circle: 1, polaroid: 2, collage: 2,
        tower: 2, banner: 3, poster: 3,
    };
    const want = plan[layout] || 2;
    const main = out.find(element => element.type === 'image' && element.assetId === '__avatar__'
        && element.width * element.height >= Math.max(...out.filter(e => e.assetId === '__avatar__').map(e => e.width * e.height), 0));
    const texts = out.filter(element => element.type === 'text');
    const faces = out.filter(element => element.assetId === '__avatar__');
    const blockers = [main, ...texts, ...faces].filter(Boolean);

    const hits = (element, limit = 0.18) => blockers.some(block => {
        const ox = Math.max(0, Math.min(element.x + element.width, block.x + block.width) - Math.max(element.x, block.x));
        const oy = Math.max(0, Math.min(element.y + element.height, block.y + block.height) - Math.max(element.y, block.y));
        return ox > 0 && oy > 0 && (ox * oy) / Math.max(1, element.width * element.height) > limit;
    });

    const tapes = (kit.tapes || []).filter(Boolean);
    let cursor = Math.floor(rand() * prints.length);
    let placed = 0;

    for (const [scaleDown, limit] of [[1, 0.18], [0.72, 0.34]]) {
        for (const anchor of CLIP_ANCHORS) {
            if (placed >= want) break;
            const id = prints[cursor % prints.length];
            const scale = layout === 'tower' ? 0.4 : layout === 'banner' ? 0.34 : 0.36;
            const b = box(id, u * (scale + rand() * 0.07) * scaleDown);
            const x = Math.max(-b.w * 0.04, Math.min(W - b.w * 0.92, anchor.x * (W - b.w)));
            const y = Math.max(-b.h * 0.04, Math.min(H - b.h * 0.9, anchor.y * (H - b.h)));
            const candidate = { type: 'image', assetId: id, x, y, width: b.w, height: b.h };
            if (hits(candidate, limit)) continue;
            cursor += 1;

            const r = anchor.r + (rand() - 0.5) * 6;

            out.push(img(shadowOf(kit), x + b.w * 0.03, y + b.h * 0.04, b.w * 1.02, b.h * 1.02,
                { z: CLIP_Z - 0.02, r, o: 0.3, fit: 'fill' }));
            out.push(img(id, x, y, b.w, b.h, { z: CLIP_Z, r, o: 0.98, fit: 'contain' }));

            if (tapes.length) {
                const tw = b.w * (0.3 + rand() * 0.12);
                const th = Math.max(3, b.h * 0.11);
                out.push(img(tapes[placed % tapes.length], x + b.w * (0.12 + rand() * 0.3), y - th * 0.34, tw, th,
                    { z: CLIP_Z + 0.18, r: r + 24 + rand() * 24, o: 0.78, fit: 'fill' }));
            }
            placed += 1;
        }
    }
}

function coversFace(element, main) {
    if (element === main) return false;
    const fx = main.x + main.width * 0.2;
    const fy = main.y + main.height * 0.1;
    const fw = main.width * 0.6;
    const fh = main.height * 0.64;
    const ox = Math.max(0, Math.min(element.x + element.width, fx + fw) - Math.max(element.x, fx));
    const oy = Math.max(0, Math.min(element.y + element.height, fy + fh) - Math.max(element.y, fy));
    if (ox <= 0 || oy <= 0) return false;
    return (ox * oy) / Math.max(1, element.width * element.height) > 0.22;
}

function promotePortrait(out) {
    const portraits = out.filter(element => element.type === 'image' && element.assetId === '__avatar__');
    if (portraits.length < 2) return null;
    const main = portraits.reduce((best, item) => (item.width * item.height > best.width * best.height ? item : best), portraits[0]);
    const top = Math.max(0, ...out.filter(element => element !== main && element.type !== 'text').map(element => Number(element.z) || 0));

    main.z = Math.max(Number(main.z) || 0, Math.min(6.2, Math.max(4.6, top + 0.4)));
    for (const element of portraits) {
        if (element === main) continue;
        if (!coversFace(element, main)) continue;
        element.layer = 'back';
        element.z = Math.min(Number(element.z) || 0, main.z - 0.25);
    }

    for (const element of out) {
        if (element === main || element.type !== 'image') continue;
        if (element.assetId === '__avatar__') continue;
        if (!coversFace(element, main)) continue;
        if (element.layer === 'front') element.layer = 'back';
        if ((Number(element.z) || 0) > main.z) element.z = main.z - 0.3;
    }
    return main;
}

function varySlices(out, main, W, H) {
    const mainCx = main ? main.x + main.width / 2 : W / 2;
    let index = 0;
    for (const element of out) {
        if (element.type !== 'image' || element.assetId !== '__avatar__') continue;
        index += 1;
        if (element === main || index <= 1) continue;

        const factor = index === 2 ? 0.84 : 0.66;
        const cx = element.x + element.width / 2;
        const cy = element.y + element.height / 2;
        element.width *= factor;
        element.height *= factor;

        const dir = cx < mainCx ? -1 : 1;
        const shiftX = dir * W * 0.035;
        const shiftY = (index % 2 ? 1 : -1) * H * 0.04;
        element.x = Math.min(Math.max(0, cx - element.width / 2 + shiftX), W - element.width);
        element.y = Math.min(Math.max(0, cy - element.height / 2 + shiftY), H - element.height);
        const ratio = element.width / Math.max(1, element.height);
        if (ratio < 0.82 || ratio > 1.22) continue;
        if (element.shape !== 'circle' && element.shape !== 'rounded') continue;
        const pick = SLICE_SHAPES[hash(element.id + index) % SLICE_SHAPES.length];
        if (!pick || pick === element.shape) continue;
        element.shape = pick;

        if (pick === 'arch' || pick === 'film') {
            element.cropZoom = Math.max(Number(element.cropZoom) || 1, 1.18);
            element.focusY = Math.min(100, (Number(element.focusY) || 50) + 3);
        }
        if (pick === 'polaroid') element.caption = '';
    }
}

function sealEdges(W, H, kit, out, seed) {
    const rand = seeded(seed);
    const tapeA = kit.tapes?.[0] || '';
    const tapeB = kit.tapes?.[1] || tapeA;

    const ratio = W / Math.max(1, H);
    const bandH = Math.max(2.4, H * (ratio > 2.6 ? 0.1 : ratio > 1.8 ? 0.06 : 0.036));
    const z = 2.2;

    if (tapeA) {

        out.push(img(tapeA, -W * 0.03, -bandH * 0.34, W * 0.58, bandH, { z, r: -0.4, o: 0.8, fit: 'fill' }));
        out.push(img(tapeB, W * 0.44, -bandH * 0.3, W * 0.6, bandH, { z: z + 0.02, r: 0.5, o: 0.74, fit: 'fill' }));
        out.push(img(tapeB, -W * 0.02, H - bandH * 0.66, W * 0.52, bandH, { z: z + 0.04, r: 0.6, o: 0.78, fit: 'fill' }));
        out.push(img(tapeA, W * 0.46, H - bandH * 0.7, W * 0.58, bandH, { z: z + 0.06, r: -0.5, o: 0.72, fit: 'fill' }));
    }

    const lineW = Math.max(1.6, Math.min(W, H) * 0.006);
    const inset = Math.max(3.2, Math.min(W, H) * 0.022);
    out.push(img(accOf(kit), 0, 0, lineW, H, { z: z + 0.08, o: 0.42, fit: 'fill' }));
    out.push(img(accOf(kit), W - lineW, 0, lineW, H, { z: z + 0.08, o: 0.42, fit: 'fill' }));
    out.push(img(accOf(kit), inset, 0, lineW * 0.34, H, { z: z + 0.1, o: 0.2, fit: 'fill' }));
    out.push(img(accOf(kit), W - inset, 0, lineW * 0.34, H, { z: z + 0.1, o: 0.2, fit: 'fill' }));

    if (tapeB && W > H * 0.9) {
        const segH = H * (0.22 + rand() * 0.1);
        const segW = Math.max(2.6, H * 0.05);
        out.push(img(tapeB, -segW * 0.25, H * (0.2 + rand() * 0.1), segW, segH, { z: z + 0.12, r: 0, o: 0.6, fit: 'fill' }));
        out.push(img(tapeB, W - segW * 0.75, H * (0.52 + rand() * 0.1), segW, segH, { z: z + 0.12, r: 0, o: 0.55, fit: 'fill' }));
    }
}

function sealCorners(W, H, kit, out, seed) {
    const decos = lightDecosOf(kit);
    const u = Math.min(W, H);
    const rand = seeded(seed + 13);

    const long = W / Math.max(1, H) > 2.6;
    const big = long ? H * 0.2 : u * 0.088;
    const small = long ? H * 0.12 : u * 0.052;
    const texts = out.filter(element => element.type === 'text' || element.type === 'sticker');
    const hitsText = (x, y, w, h) => texts.some(element => (
        x < element.x + element.width && x + w > element.x
        && y < element.y + element.height && y + h > element.y
    ));
    const corners = [
        { x: 0.055, y: 0.07, dx: 1, dy: 1 },
        { x: 0.945, y: 0.07, dx: -1, dy: 1 },
        { x: 0.055, y: 0.93, dx: 1, dy: -1 },
        { x: 0.945, y: 0.93, dx: -1, dy: -1 },
    ];
    let cursor = 0;
    for (const corner of corners) {
        const cx = W * corner.x;
        const cy = H * corner.y;
        for (let i = 0; i < 2; i += 1) {
            const id = decos.length ? decoAt(decos, cursor + i * 3) : softOf(kit);
            const s = i === 0 ? big : small;
            const b = box(id, s);
            let ox = cx + corner.dx * (i * s * 0.62) + (rand() - 0.5) * s * 0.22;
            let oy = cy + corner.dy * (i * s * 0.5) + (rand() - 0.5) * s * 0.22;
            if (hitsText(ox - b.w / 2, oy - b.h / 2, b.w, b.h)) {

                ox -= corner.dx * s * 0.34;
                oy -= corner.dy * s * 0.3;
                if (hitsText(ox - b.w / 2, oy - b.h / 2, b.w, b.h)) continue;
            }
            out.push(img(id, ox - b.w / 2, oy - b.h / 2, b.w, b.h, {
                z: CLIP_Z - 0.24 + i * 0.05 + rand() * 0.02,
                r: -14 + rand() * 28,
                o: i === 0 ? 1 : 0.92,
                fit: 'fill',
            }));
        }
        cursor += 2;
    }
}

function legibleText(W, out) {
    const floor = W * 0.013;
    for (const element of out) {
        if (element.type !== 'text' && element.type !== 'sticker') continue;
        const size = Number(element.fontSize) || 0;
        if (size <= 0 || size >= floor) continue;
        if (measure(element.text, floor) > element.width * 1.04) continue;
        element.fontSize = floor;
        element.height = Math.max(element.height, floor * 1.3);
    }
}

function sealBands(W, H, kit, out) {
    const u = Math.min(W, H);
    const t = Math.max(0.6, u * 0.0035) * 2.4;
    const y1 = Math.max(1.2, H * 0.012);
    out.push(img(softOf(kit), 0, y1, W, t, { z: 2.16, o: 0.5, fit: 'fill' }));
    out.push(img(softOf(kit), 0, H - y1 - t, W, t, { z: 2.16, o: 0.5, fit: 'fill' }));
}

function fillBlankStamps(W, H, kit, out) {
    if (!kit.fillBlankStamps) return;
    const portraits = out.filter(element => element.type === 'image' && element.assetId === '__avatar__');
    const stamps = out.filter(element => element.type === 'image' && /^v10:sp-stamp/.test(element.assetId));
    const minSize = Math.min(W, H) * 0.055;
    for (const stamp of stamps) {
        if (stamp.width < minSize) continue;
        const cx = stamp.x + stamp.width / 2;
        const cy = stamp.y + stamp.height / 2;
        const taken = portraits.some(item => cx > item.x && cx < item.x + item.width && cy > item.y && cy < item.y + item.height);
        if (taken) continue;
        const inner = stamp.width * 0.62;
        out.push(img('__avatar__', stamp.x + stamp.width * 0.19, stamp.y + stamp.height * 0.15,
            inner, inner * 1.06, { z: stamp.z + 0.12, shape: 'square', zoom: 1.3, r: 0 }));
    }
}

function varyRepeats(out, seed) {
    const rand = seeded(seed + 97);
    const seen = new Map();
    for (const element of out) {
        if (element.type !== 'image') continue;
        if (element.assetId === '__avatar__') continue;
        const key = element.assetId;
        const count = (seen.get(key) || 0) + 1;
        seen.set(key, count);
        if (count < 3) continue;
        element.rotation = (Number(element.rotation) || 0) + (rand() - 0.5) * 9;
        element.opacity = Math.min(1, Math.max(0.72, (Number(element.opacity) || 1) * (0.86 + rand() * 0.14)));
        const k = 0.94 + rand() * 0.12;
        element.x += element.width * (1 - k) / 2;
        element.y += element.height * (1 - k) / 2;
        element.width *= k;
        element.height *= k;
    }
}

export function polishScene(W, H, kit, scene, layout = 'collage') {
    const out = scene.elements || [];
    if (!out.length) return scene;
    const seed = hash(`${kit.id}:${Math.round(W)}x${Math.round(H)}`);

    dropNumberNoise(W, H, kit, out);
    fillBlankStamps(W, H, kit, out);
    limitPortraits(W, H, kit, out, layout);
    if (layout === 'scroll') scrollCompose(W, H, kit, out, seed);

    const main = promotePortrait(out);
    varySlices(out, main, W, H);
    varyRepeats(out, seed);
    if (layout !== 'scroll') curateClippings(W, H, kit, out, layout, seed);
    fillGaps(W, H, kit, out, seed);
    sealEdges(W, H, kit, out, seed);
    sealCorners(W, H, kit, out, seed);
    sealBands(W, H, kit, out);
    legibleText(W, out);

    for (const element of out) {
        if (element.assetId !== '__avatar__') continue;
        element.z = Math.max(Number(element.z) || 0, CLIP_Z + 0.06);
    }
    return scene;
}
