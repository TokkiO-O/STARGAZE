import { box, img } from '../assets/base.js';
import { rng } from './kit.js';

const MIN_DECOR = {
    chip: 5, compact: 8, circle: 6, polaroid: 8,
    collage: 12, tower: 15, banner: 14, scroll: 18, poster: 22,
};

const STRUCT = /^v10:(bg|paper|acc|soft|ink|grain|shadow|light|ring|crn)-/;

const area = r => Math.max(0, r.w) * Math.max(0, r.h);

function inter(a, b) {
    const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    return w > 0 && h > 0 ? w * h : 0;
}

const elRect = el => ({ x: el.x, y: el.y, w: el.width, h: el.height });

function countDecor(elements) {
    return elements.filter(el => {
        if (el.assetId === '__avatar__') return false;
        if (el.type === 'text') return false;
        if (el.type === 'sticker') return true;
        return el.type === 'image' && !STRUCT.test(el.assetId || '') && el.z >= 4;
    }).length;
}

function zonesOf(key) {
    switch (key) {
        case 'chip':
            return [
                { cx: 0.11, cy: 0.5, r: 0.3, n: 2 }, { cx: 0.89, cy: 0.5, r: 0.3, n: 2 },
                { cx: 0.3, cy: 0.16, r: 0.18, n: 1 }, { cx: 0.7, cy: 0.16, r: 0.18, n: 1 },
                { cx: 0.5, cy: 0.9, r: 0.16, n: 1 },
            ];
        case 'compact':
            return [
                { cx: 0.1, cy: 0.13, r: 0.2, n: 2 }, { cx: 0.9, cy: 0.13, r: 0.2, n: 2 },
                { cx: 0.1, cy: 0.87, r: 0.2, n: 2 }, { cx: 0.9, cy: 0.87, r: 0.2, n: 2 },
                { cx: 0.5, cy: 0.06, r: 0.16, n: 1 },
            ];
        case 'circle': {
            const list = [];
            for (let i = 0; i < 12; i += 1) {
                const a = (-90 + i * 30) * Math.PI / 180;
                const rad = i % 2 ? 0.4 : 0.33;
                list.push({ cx: 0.5 + Math.cos(a) * rad, cy: 0.5 + Math.sin(a) * rad, r: 0.12, n: 1 });
            }
            return list;
        }
        case 'polaroid':
            return [
                { cx: 0.5, cy: 0.07, r: 0.16, n: 2 }, { cx: 0.5, cy: 0.93, r: 0.16, n: 3 },
                { cx: 0.05, cy: 0.3, r: 0.14, n: 2 }, { cx: 0.05, cy: 0.6, r: 0.14, n: 2 },
                { cx: 0.95, cy: 0.3, r: 0.14, n: 2 }, { cx: 0.95, cy: 0.6, r: 0.14, n: 2 },
                { cx: 0.25, cy: 0.06, r: 0.1, n: 1 }, { cx: 0.75, cy: 0.06, r: 0.1, n: 1 },
            ];
        case 'collage':
            return [
                { cx: 0.08, cy: 0.12, r: 0.2, n: 3 }, { cx: 0.92, cy: 0.12, r: 0.2, n: 3 },
                { cx: 0.08, cy: 0.88, r: 0.2, n: 3 }, { cx: 0.92, cy: 0.88, r: 0.2, n: 3 },
                { cx: 0.5, cy: 0.06, r: 0.14, n: 1 }, { cx: 0.5, cy: 0.95, r: 0.14, n: 1 },
            ];
        case 'tower':
            return [
                { cx: 0.07, cy: 0.1, r: 0.15, n: 3 }, { cx: 0.07, cy: 0.3, r: 0.15, n: 3 },
                { cx: 0.07, cy: 0.5, r: 0.15, n: 3 }, { cx: 0.07, cy: 0.7, r: 0.15, n: 3 },
                { cx: 0.07, cy: 0.9, r: 0.15, n: 3 },
                { cx: 0.93, cy: 0.16, r: 0.15, n: 3 }, { cx: 0.93, cy: 0.4, r: 0.15, n: 3 },
                { cx: 0.93, cy: 0.64, r: 0.15, n: 3 }, { cx: 0.93, cy: 0.88, r: 0.15, n: 3 },
                { cx: 0.35, cy: 0.04, r: 0.12, n: 1 }, { cx: 0.7, cy: 0.96, r: 0.12, n: 1 },
            ];
        case 'banner':
            return [
                { cx: 0.06, cy: 0.1, r: 0.14, n: 2 }, { cx: 0.3, cy: 0.07, r: 0.12, n: 2 },
                { cx: 0.7, cy: 0.07, r: 0.12, n: 2 }, { cx: 0.94, cy: 0.1, r: 0.14, n: 2 },
                { cx: 0.06, cy: 0.9, r: 0.14, n: 2 }, { cx: 0.3, cy: 0.93, r: 0.12, n: 2 },
                { cx: 0.7, cy: 0.93, r: 0.12, n: 2 }, { cx: 0.94, cy: 0.9, r: 0.14, n: 2 },
            ];
        case 'scroll': {
            const list = [];
            for (let i = 0; i < 7; i += 1) {
                const x = 0.08 + i * 0.14;
                list.push({ cx: x, cy: 0.08, r: 0.13, n: 2 });
                list.push({ cx: x, cy: 0.92, r: 0.13, n: 2 });
            }
            return list;
        }
        case 'poster':
        default:
            return [
                { cx: 0.06, cy: 0.11, r: 0.16, n: 4 }, { cx: 0.94, cy: 0.11, r: 0.16, n: 4 },
                { cx: 0.06, cy: 0.89, r: 0.16, n: 4 }, { cx: 0.94, cy: 0.89, r: 0.16, n: 4 },
                { cx: 0.5, cy: 0.05, r: 0.1, n: 2 }, { cx: 0.5, cy: 0.95, r: 0.1, n: 2 },
                { cx: 0.03, cy: 0.5, r: 0.1, n: 2 }, { cx: 0.97, cy: 0.5, r: 0.1, n: 2 },
            ];
    }
}

function toneDown(out, W, H) {
    let n = 0;
    for (const el of out) {
        if (el.type !== 'image' || el.assetId === '__avatar__') continue;
        if (STRUCT.test(el.assetId || '')) continue;
        if (String(el.assetId || '').startsWith('v10:pin-')) continue;

        if (String(el.assetId || '').startsWith('v10:st-')) continue;
        const big = el.width > W * 0.3 || el.height > H * 0.5;
        if (!big) continue;
        el.opacity = Math.min(el.opacity == null ? 1 : el.opacity, 0.5);
        el.z = Math.max(1.2, Math.min(el.z, 3.4));
        n += 1;
    }
    return n;
}

export function dressScene(W, H, kit, scene, key) {
    const pool = kit.stickers;
    if (!pool || !pool.all || !pool.all.length) return;

    const out = scene.elements;
    scene.tamed = toneDown(out, W, H);
    const faces = out.filter(el => el.assetId === '__avatar__').map(el => {
        const r = elRect(el);
        const pad = 0.12;
        return { x: r.x - r.w * pad, y: r.y - r.h * pad, w: r.w * (1 + pad * 2), h: r.h * (1 + pad * 2) };
    });
    const texts = out.filter(el => el.type === 'text').map(elRect);
    const placed = [];
    const rand = rng(W * 7 + H * 13 + key.length * 31);
    const u = Math.min(W, H);
    const target = MIN_DECOR[key] || 12;

    const edgePool = pool.quiet.length ? pool.quiet : pool.sq;
    const accentPool = pool.loud.length ? pool.loud : pool.sq;
    let accents = 0;
    let cursor = 0;

    const put = (id, cx, cy, size, rot, z) => {
        const b = box(id, size);
        for (let attempt = 0; attempt < 9; attempt += 1) {
            const jx = attempt === 0 ? 0 : (rand() - 0.5) * size * 0.9;
            const jy = attempt === 0 ? 0 : (rand() - 0.5) * size * 0.9;
            const rect = { x: cx + jx - b.w / 2, y: cy + jy - b.h / 2, w: b.w, h: b.h };
            if (rect.x < -W * 0.04 || rect.y < -H * 0.04) continue;
            if (rect.x + rect.w > W * 1.04 || rect.y + rect.h > H * 1.04) continue;
            if (faces.some(f => inter(rect, f) > 0)) continue;
            if (texts.some(t => inter(rect, t) > area(t) * 0.06)) continue;
            if (placed.some(p => inter(rect, p) > area(rect) * 0.3)) continue;
            out.push(img(id, rect.x, rect.y, rect.w, rect.h, {
                z: 7.85 + placed.length * 0.006,
                r: rot + (rand() - 0.5) * 10,
                o: 0.94,
                fit: 'contain',
            }));
            placed.push(rect);
            return true;
        }
        return false;
    };

    for (const zone of zonesOf(key)) {
        if (placed.length >= target) break;
        for (let i = 0; i < zone.n; i += 1) {
            if (placed.length >= target) break;

            const useAccent = accents < 1 && i === 0 && zone.n >= 3 && rand() > 0.45;
            const list = useAccent ? accentPool : edgePool;
            const id = list[cursor % list.length];
            cursor += 1;
            if (!id) continue;

            const size = u * (0.055 + rand() * 0.045);
            const ok = put(id, zone.cx * W + (rand() - 0.5) * zone.r * u * 1.4,
                zone.cy * H + (rand() - 0.5) * zone.r * u * 1.4, size, (rand() - 0.5) * 26, 7.85);
            if (ok && useAccent) accents += 1;
        }
    }

    scene.decor = countDecor(out);
}
