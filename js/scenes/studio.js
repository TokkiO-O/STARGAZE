import { F, img, txt, box } from '../assets/base.js';
import {
    base, portrait, mini, tape, label, head, rule, mark, arcPos, rng,
    paperOf, accOf, softOf, shadowOf, inkOf,
} from './kit.js';

const WASH = {
    school: [['v10:school-grid', 0.26], ['v10:school-vellum', 0.22]],
    hk: [['v10:hk-news', 0.34], ['v10:hk-grain', 0.24]],
    y2k: [['v10:y2k-holo', 0.4], ['v10:y2k-grid', 0.2]],
    french: [['v10:fr-floral', 0.3], ['v10:fr-tulle', 0.22]],
    mecha: [['v10:mt-steel', 0.34], ['v10:mt-circuit', 0.2]],
    fairy: [['v10:fy-watercolor', 0.34], ['v10:fy-paper', 0.2]],
    letter: [['v10:lt-lines', 0.24], ['v10:lt-watermark', 0.26]],
    stamp: [['v10:sp-perftex', 0.24]],
    gothic: [['v10:gt-velvet', 0.42], ['v10:gt-wallpaper', 0.22]],
    sweetcool: [['v10:sc-floral', 0.3], ['v10:sc-vellum', 0.22]],
};

const PATTERN = {
    school: 'dots', hk: 'stripes', y2k: 'grid', french: 'dots', mecha: 'stripes',
    fairy: 'dots', letter: 'none', stamp: 'none', gothic: 'none', sweetcool: 'dots',
};

const subOf = kit => String(kit.sub || '').replace(/\{\{[^|]+\|([^}]+)\}\}/g, '$1');
const markOf = kit => (kit.mark || [])[1] || (kit.mark || [])[0] || '';

function bar(out, kit, x, y, w, h, o = {}) {
    out.push(img(o.id || accOf(kit), x, y, Math.max(0.5, w), Math.max(0.5, h),
        { z: o.z == null ? 1.5 : o.z, r: o.r || 0, o: o.o == null ? 0.3 : o.o, fit: 'fill' }));
}

function ground(W, H, kit, out) {
    base(W, H, kit, out, { m: 0, grainO: 0.26 });
    (WASH[kit.id] || []).forEach(([id, o], i) => {
        out.push(img(id, 0, 0, W, H, { z: 0.9 + i * 0.1, o: Math.max(o, 0.2), fit: 'cover' }));
    });

    const kind = PATTERN[kit.id];
    const u = Math.min(W, H);
    const tight = W / H > 3 || u < 160;
    if (kind === 'dots' && !tight) {
        const step = Math.max(u / 8, W / 15);
        for (let y = step * 0.6; y < H; y += Math.max(step, H / 9)) {
            for (let x = step * 0.6; x < W; x += step) {
                mark(out, kit, '·', x, y, step * 0.3, { z: 1.05, o: 0.16, color: kit.theme.secondary });
            }
        }
    } else if (kind === 'grid') {
        for (let x = W * 0.08; x < W; x += W * 0.075) bar(out, kit, x, 0, 0.6, H, { z: 1.04, o: 0.08 });
        for (let y = H * 0.08; y < H; y += H * 0.075) bar(out, kit, 0, y, W, 0.6, { z: 1.04, o: 0.08 });
    } else if (kind === 'stripes') {
        for (let x = -H; x < W + H; x += W * 0.055) {
            bar(out, kit, x, 0, Math.max(0.8, W * 0.008), H * 1.5, { z: 1.04, o: 0.07, r: 22 });
        }
    }
}

function paper(out, kit, pool, i, cx, cy, w, h, rot, z, o = {}) {
    const id = pool.length ? pool[(i * 3 + (o.seed || 0)) % pool.length] : null;

    let dw = w;
    let dh = h;
    if (id) {
        const asp = Math.max(0.2, Math.min(6, box(id, 1).w)) || 1;
        if (w / h > asp) dw = h * asp;
        else dh = w / asp;
    }
    const x = cx - dw / 2;
    const y = cy - dh / 2;

    if (o.shadow === true) {
        out.push(img(shadowOf(kit), x + dw * 0.012, y + dh * 0.016, dw, dh,
            { z: z - 0.1, r: rot, o: 0.22, fit: 'fill' }));
    }
    if (id) {
        out.push(img(paperOf(kit), x, y, dw, dh, { z: z - 0.02, r: rot, o: 0.5, fit: 'fill' }));
        out.push(img(id, x, y, dw, dh, { z, r: rot, o: o.o == null ? 0.99 : o.o, fit: 'fill' }));
    } else {
        out.push(img(paperOf(kit), x, y, dw, dh, { z, r: rot, o: 0.98, fit: 'fill' }));
        out.push(img(accOf(kit), x, y, dw, Math.max(0.6, dh * 0.006), { z: z + 0.02, r: rot, o: 0.2, fit: 'fill' }));
    }
    return { x, y, w: dw, h: dh };
}

function fitFrame(frames, w, h, kind, pref, pick) {
    if (!frames || !frames.length) return null;
    const t = w / h;

    if (pick && pick.length === 0) return null;
    const pool = pick
        ? frames.filter(f => pick.includes((f.index == null ? -1 : f.index) + 1))
        : frames;
    const test = f => {
        if (kind === 'round') return f.aspect > 0.84 && f.aspect < 1.2;
        if (kind === 'rect') return f.aspect > 0.74 && f.aspect < 1.4;
        return f.aspect > 0.55 && f.aspect < 1.8;
    };
    let cands = (pool.length ? pool : frames).filter(test);

    if (!cands.length) cands = frames.filter(test);
    if (!cands.length) cands = frames.slice();
    if (!cands.length) return null;

    cands.sort((a, b) => Math.abs(Math.log(a.aspect / t)) - Math.abs(Math.log(b.aspect / t)));

    return cands[0];
}

function hero(out, kit, frames, cx, cy, w, h, shape, o = {}) {
    const z = o.z == null ? 3.9 : o.z;
    out.push(img(shadowOf(kit), cx - w * 0.46, cy - h * 0.45, w * 0.94, h * 0.96,
        { z: z - 0.18, o: 0.3, fit: 'fill' }));
    portrait(out, cx - w / 2, cy - h / 2, w, h, shape, z, { zoom: o.zoom || 1.02 });

    if (!frames.length || o.frame === false) return;
    const pick = fitFrame(frames, w, h, o.kind, o.frameIndex, o.pick);
    if (!pick) {
        if (o.edge) edgeFrame(out, kit, cx, cy, w, h, o.edge);
        return;
    }
    const open = Math.max(0.34, Math.min(0.98, pick.opening));

    let fw = w / open;
    let fh = fw / pick.aspect;
    if (fh < h / open) { fh = h / open; fw = fh * pick.aspect; }

    const cap = 1.26;
    if (fw > w * cap || fh > h * cap) {
        const k = Math.min(w * cap / fw, h * cap / fh);
        fw *= k;
        fh *= k;
    }
    out.push(img(pick.id, cx - fw / 2, cy - fh / 2, fw, fh,
        { z: 7.02, r: o.r || 0, o: 0.98, fit: 'contain' }));
}

function edgeFrame(out, kit, cx, cy, w, h, kind) {
    const x = cx - w / 2;
    const y = cy - h / 2;
    const t = Math.max(1.2, Math.min(w, h) * 0.032);

    if (kind === 'plate') {
        const steel = inkOf(kit);
        out.push(img(steel, x - t * 1.4, y - t * 1.4, w + t * 2.8, h + t * 2.8, { z: 6.96, o: 0.55, fit: 'fill' }));
        out.push(img(accOf(kit), x - t * 1.4, y - t * 1.4, w + t * 2.8, t * 0.9, { z: 7.02, o: 0.85, fit: 'fill' }));
        out.push(img(accOf(kit), x - t * 1.4, y + h + t * 0.5, w + t * 2.8, t * 0.9, { z: 7.02, o: 0.85, fit: 'fill' }));
        out.push(img(accOf(kit), x - t * 1.4, y - t * 1.4, t * 0.9, h + t * 2.8, { z: 7.02, o: 0.85, fit: 'fill' }));
        out.push(img(accOf(kit), x + w + t * 0.5, y - t * 1.4, t * 0.9, h + t * 2.8, { z: 7.02, o: 0.85, fit: 'fill' }));
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
            const rx = cx + sx * (w / 2 + t * 0.9);
            const ry = cy + sy * (h / 2 + t * 0.9);
            out.push(img(steel, rx - t * 0.5, ry - t * 0.5, t, t, { z: 7.05, o: 0.9, fit: 'fill' }));
        });
    } else if (kind === 'stamp') {
        const m = t * 2.4;
        out.push(img(paperOf(kit), x - m, y - m, w + m * 2, h + m * 2, { z: 6.96, o: 1, fit: 'fill' }));
        const step = (w + m * 2) / 12;
        for (let i = 1; i < 12; i += 1) {
            out.push(img(inkOf(kit), x - m + step * i - t * 0.3, y - m - t * 0.2, t * 0.6, t * 0.6, { z: 7.0, o: 0.3, fit: 'fill' }));
            out.push(img(inkOf(kit), x - m + step * i - t * 0.3, y + h + m - t * 0.4, t * 0.6, t * 0.6, { z: 7.0, o: 0.3, fit: 'fill' }));
        }
    } else if (kind === 'neon') {
        out.push(img(kit.theme.accent ? accOf(kit) : accOf(kit), x - t, y - t, w + t * 2, h + t * 2, { z: 6.96, o: 0.9, fit: 'fill' }));
        out.push(img(inkOf(kit), x, y, w, h, { z: 6.98, o: 1, fit: 'fill' }));
    }
}

function minis(out, kit, frames, list, z, o = {}) {
    list.forEach(([x, y, s, shape], i) => {
        out.push(img(shadowOf(kit), x - s * 0.44, y - s * 0.44, s * 0.9, s * 0.92,
            { z: z - 0.12, o: 0.24, fit: 'fill' }));
        mini(out, x - s / 2, y - s / 2, s, s, shape || o.shape || 'circle', z + i * 0.03, { zoom: 1.24 });
        if (frames.length && o.frame !== false && s > Math.min(o.W || 1e9, o.H || 1e9) * 0.12) {
            const pick = fitFrame(frames, s, s, o.kind, i + 1, o.pick);
            if (pick) {
                const open = Math.max(0.5, Math.min(0.98, pick.opening));
                const fw = Math.min(s / open, s * 1.24);
                const fh = fw / pick.aspect;
                out.push(img(pick.id, x - fw / 2, y - fh / 2, fw, fh, { z: 7.04, o: 0.96, fit: 'contain' }));
            }
        }
    });
}

function cluster(out, kit, props, cx, cy, spread, count, size, seed, z, blockers, W0, H0, opt = {}) {
    if (!props.length) return 0;
    const rand = rng(seed);
    let placed = 0;

    const quiet = props.filter(p => p.sat <= 0.46);
    const base = quiet.length > 3 ? quiet : props;
    let loud = 0;
    for (let i = 0; i < count * 14 && placed < count; i += 1) {
        const useLoud = !opt.noLoud && placed === 0 && loud === 0 && props.length;
        const id = (useLoud ? props[(seed + i) % props.length] : base[(i * 7 + seed) % base.length]).id;
        if (useLoud) loud += 1;
        const s = size * (0.62 + rand() * 0.72);
        const b = box(id, s);
        const px = cx + (rand() - 0.5) * spread * 1.6;
        const py = cy + (rand() - 0.5) * spread * 1.1;
        const r = { x: px - b.w / 2, y: py - b.h / 2, w: b.w, h: b.h };

        const padX = Math.min(b.w * 0.24, 6);
        const padY = Math.min(b.h * 0.24, 6);
        if (r.x < -padX || r.y < -padY) continue;
        if (r.x + r.w > W0 + padX || r.y + r.h > H0 + padY) continue;
        if (blockers.some(bl => hit(r, bl) > b.w * b.h * 0.03)) continue;
        out.push(img(id, r.x, r.y, r.w, r.h, {
            z: z + placed * 0.012, r: -22 + rand() * 44, o: 0.96, fit: 'contain',
        }));
        placed += 1;
    }
    return placed;
}

function hit(a, b) {
    const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    return w > 0 && h > 0 ? w * h : 0;
}

const VISION = {
    school: {
        shape: 'rect', mini: 'polaroid', papers: 'rail', clusters: 'corners', type: 'topbar', orn: 'punch', frameKind: 'rect',
        framePick: [3],
    },
    hk: {
        shape: 'magazine', mini: 'film', papers: 'strip', clusters: 'sides', type: 'block', orn: 'sprocket', frameKind: 'rect',
        framePick: [1, 4],
    },
    y2k: {
        shape: 'hexagon', mini: 'star', papers: 'scan', clusters: 'diag', type: 'banner', orn: 'neon', frameKind: 'any',
        framePick: [1], edge: 'neon',
    },
    french: {
        shape: 'oval', mini: 'scallop', papers: 'arc', clusters: 'ring', type: 'arc', orn: 'pearl', frameKind: 'round',
        framePick: [2, 3],
    },
    mecha: {
        shape: 'rect', mini: 'rect', papers: 'plate', clusters: 'edges', type: 'plate', orn: 'rivet', frameKind: 'rect',
        framePick: [], edge: 'plate',
    },
    fairy: {
        shape: 'blob', mini: 'heart', papers: 'cloud', clusters: 'corners', type: 'cloud', orn: 'puff', frameKind: 'any',
        framePick: [1],
    },
    letter: {
        shape: 'ticket', mini: 'postcard', papers: 'column', clusters: 'columns', type: 'verse', orn: 'thread', frameKind: 'rect',
        framePick: [5],
    },
    stamp: {
        shape: 'stamp', mini: 'stamp', papers: 'grid', clusters: 'grid', type: 'postage', orn: 'perf', frameKind: 'none',
        framePick: [], edge: 'stamp',
    },
    gothic: {
        shape: 'arch', mini: 'arch', papers: 'arch', clusters: 'flanks', type: 'archOrn', orn: 'thorn', frameKind: 'rect',
        framePick: [3],
    },
    sweetcool: {
        shape: 'postcard', mini: 'circle', papers: 'scatter', clusters: 'three', type: 'band', orn: 'ribbon', frameKind: 'any',
        framePick: [4, 2],
    },
};

const PAPERS = {
    rail: [
        [0.1, 0.5, 0.2, 1.12, -1.5], [0.36, 0.24, 0.44, 0.46, 1.2], [0.72, 0.27, 0.42, 0.46, -2],
        [0.32, 0.77, 0.38, 0.44, 1.8], [0.76, 0.76, 0.4, 0.44, -1.2], [0.54, 0.5, 0.3, 0.32, 0.6],
    ],
    strip: [
        [0.5, 0.17, 0.94, 0.3, -0.6], [0.5, 0.63, 0.9, 0.36, 0.8],
        [0.24, 0.42, 0.34, 0.52, -3], [0.75, 0.44, 0.34, 0.52, 2.4], [0.5, 0.92, 0.72, 0.2, -1],
    ],
    scan: [
        [0.28, 0.32, 0.54, 0.62, -7], [0.73, 0.63, 0.5, 0.58, 7], [0.5, 0.5, 0.3, 0.36, 0],
        [0.87, 0.2, 0.28, 0.3, 0], [0.14, 0.8, 0.28, 0.3, 0],
    ],
    arc: [
        [0.5, 0.5, 0.46, 0.52, 0], [0.2, 0.22, 0.34, 0.42, -8], [0.8, 0.24, 0.34, 0.42, 8],
        [0.22, 0.78, 0.32, 0.4, 7], [0.78, 0.78, 0.32, 0.4, -7],
    ],
    plate: [
        [0.26, 0.3, 0.46, 0.54, 0], [0.63, 0.26, 0.42, 0.44, 0], [0.34, 0.74, 0.4, 0.44, 0],
        [0.75, 0.68, 0.44, 0.5, 0], [0.5, 0.5, 0.28, 0.3, 0],
    ],
    cloud: [
        [0.26, 0.3, 0.44, 0.5, -5], [0.74, 0.3, 0.44, 0.5, 5],
        [0.3, 0.72, 0.42, 0.46, 4], [0.72, 0.72, 0.42, 0.48, -4], [0.5, 0.52, 0.34, 0.36, 0],
    ],
    column: [
        [0.2, 0.5, 0.32, 1.08, 1.5], [0.5, 0.5, 0.34, 1.08, -1], [0.8, 0.5, 0.32, 1.08, 1.2],
    ],
    grid: [
        [0.14, 0.2, 0.26, 0.34, -2], [0.14, 0.52, 0.26, 0.34, 1], [0.14, 0.83, 0.26, 0.3, -1],
        [0.86, 0.2, 0.26, 0.34, 2], [0.86, 0.52, 0.26, 0.34, -1], [0.86, 0.83, 0.26, 0.3, 1],
        [0.5, 0.5, 0.4, 0.6, 0],
    ],
    arch: [
        [0.5, 0.5, 0.44, 1, 0], [0.16, 0.5, 0.3, 0.92, -1], [0.84, 0.5, 0.3, 0.92, 1],
        [0.5, 0.1, 0.5, 0.28, 0],
    ],
    scatter: [
        [0.22, 0.26, 0.36, 0.44, -6], [0.6, 0.22, 0.34, 0.42, 4], [0.8, 0.55, 0.32, 0.42, 7],
        [0.3, 0.7, 0.36, 0.44, -4], [0.55, 0.55, 0.28, 0.32, 2],
    ],
};

const CLUSTERS = {
    corners: [[0.15, 0.14], [0.85, 0.14], [0.15, 0.86], [0.85, 0.86]],
    sides: [[0.06, 0.3], [0.94, 0.3], [0.06, 0.72], [0.94, 0.72]],
    diag: [[0.16, 0.18], [0.84, 0.22], [0.2, 0.82], [0.8, 0.78]],
    ring: [[0.26, 0.18], [0.74, 0.18], [0.88, 0.5], [0.74, 0.82], [0.26, 0.82], [0.12, 0.5]],
    edges: [[0.1, 0.12], [0.5, 0.07], [0.9, 0.12], [0.1, 0.88], [0.5, 0.93], [0.9, 0.88]],
    columns: [[0.08, 0.26], [0.08, 0.62], [0.92, 0.26], [0.92, 0.62]],
    grid: [[0.2, 0.2], [0.2, 0.55], [0.2, 0.85], [0.8, 0.2], [0.8, 0.55], [0.8, 0.85]],
    flanks: [[0.08, 0.2], [0.08, 0.5], [0.08, 0.8], [0.92, 0.2], [0.92, 0.5], [0.92, 0.8]],
    three: [[0.16, 0.24], [0.84, 0.3], [0.5, 0.84]],
};

function ornament(out, W, H, kit, kind) {
    const u = Math.min(W, H);
    const z = 1.6;

    if (kind === 'punch') {

        for (let i = 0; i < 5; i += 1) {
            mark(out, kit, '○', W * 0.035, H * (0.16 + i * 0.17), u * 0.075,
                { z: z + 0.1, o: 0.5, color: kit.theme.paper });
        }
        for (let i = 0; i < 4; i += 1) {
            bar(out, kit, W * 0.16, H * (0.2 + i * 0.2), W * 0.7, Math.max(0.7, u * 0.004), { z, o: 0.16 });
        }
    } else if (kind === 'sprocket') {

        const step = W / 22;
        for (let x = step * 0.5; x < W; x += step) {
            bar(out, kit, x, H * 0.012, step * 0.42, u * 0.03, { z: z + 0.2, o: 0.6, id: inkOf(kit) });
            bar(out, kit, x, H * 0.958, step * 0.42, u * 0.03, { z: z + 0.2, o: 0.6, id: inkOf(kit) });
        }
        bar(out, kit, 0, H * 0.042, W, Math.max(1, u * 0.006), { z, o: 0.35, id: inkOf(kit) });
        bar(out, kit, 0, H * 0.952, W, Math.max(1, u * 0.006), { z, o: 0.35, id: inkOf(kit) });
    } else if (kind === 'neon') {

        for (let i = 0; i < 7; i += 1) {
            bar(out, kit, W * (0.06 + i * 0.13), H * (i % 2 ? 0.12 : 0.2), W * 0.15, Math.max(1.4, u * 0.012),
                { z: z + 0.1, o: 0.55, r: i % 2 ? 28 : -28 });
        }
        for (let i = 0; i < 12; i += 1) {
            const p = arcPos(W * 0.5, H * 0.9, W * 0.4, H * 0.06, -170 + i * 30);
            mark(out, kit, '●', p.x, p.y, u * 0.03, { z: z + 0.2, o: 0.5, color: kit.theme.accent });
        }
    } else if (kind === 'pearl') {

        for (let k = 0; k < 2; k += 1) {
            for (let i = 0; i < 16; i += 1) {
                const p = arcPos(W * 0.5, H * 0.5, W * (0.42 - k * 0.04), H * (0.44 - k * 0.04), -180 + i * 24);
                mark(out, kit, '·', p.x, p.y, u * 0.028, { z: z + 0.2 + k * 0.05, o: 0.55, color: kit.theme.paper });
            }
        }
    } else if (kind === 'rivet') {

        const s = u * 0.022;
        [[0.04, 0.05], [0.96, 0.05], [0.04, 0.95], [0.96, 0.95]].forEach(([x, y]) => {
            bar(out, kit, W * x - s / 2, H * y - s / 2, s, s, { z: z + 0.2, o: 0.7, id: inkOf(kit) });
        });
        for (let i = 0; i < 9; i += 1) {
            bar(out, kit, W * 0.04, H * (0.2 + i * 0.075), u * (i % 3 ? 0.02 : 0.035), Math.max(0.8, u * 0.004),
                { z, o: 0.4, id: inkOf(kit) });
        }
    } else if (kind === 'puff') {

        const step = W / 9;
        for (let i = 0; i < 9; i += 1) {
            mark(out, kit, '☁', step * (i + 0.5), H * 0.045, u * 0.13, { z: z + 0.1, o: 0.34, color: kit.theme.paper });
        }
        for (let i = 0; i < 6; i += 1) {
            mark(out, kit, '✧', W * (0.08 + i * 0.17), H * 0.94, u * 0.06, { z: z + 0.15, o: 0.4 });
        }
    } else if (kind === 'thread') {

        bar(out, kit, W * 0.5, 0, 0.12, H, { z, o: 0.06 });
        bar(out, kit, W * 0.06, H * 0.18, W * 0.9, Math.max(0.9, u * 0.005), { z: z + 0.1, o: 0.3, r: -8, id: inkOf(kit) });
        bar(out, kit, W * 0.06, H * 0.84, W * 0.9, Math.max(0.9, u * 0.005), { z: z + 0.1, o: 0.3, r: 6, id: inkOf(kit) });
    } else if (kind === 'perf') {

        const sx = W / 16, sy = H / 10;
        for (let i = 0; i < 16; i += 1) {
            bar(out, kit, sx * i + sx * 0.3, 0, sx * 0.34, Math.max(1.5, u * 0.014), { z: z + 0.2, o: 0.55 });
            bar(out, kit, sx * i + sx * 0.3, H - u * 0.016, sx * 0.34, Math.max(1.5, u * 0.014), { z: z + 0.2, o: 0.55 });
        }
        for (let i = 0; i < 10; i += 1) {
            bar(out, kit, 0, sy * i + sy * 0.3, Math.max(1.5, u * 0.014), sy * 0.34, { z: z + 0.2, o: 0.55 });
            bar(out, kit, W - u * 0.016, sy * i + sy * 0.3, Math.max(1.5, u * 0.014), sy * 0.34, { z: z + 0.2, o: 0.55 });
        }
    } else if (kind === 'thorn') {

        for (let i = 0; i < 9; i += 1) {
            bar(out, kit, W * 0.05, H * (0.08 + i * 0.1), u * 0.09, Math.max(1, u * 0.005),
                { z: z + 0.2, o: 0.4, r: 34, id: inkOf(kit) });
            bar(out, kit, W * 0.95 - u * 0.09, H * (0.13 + i * 0.1), u * 0.09, Math.max(1, u * 0.005),
                { z: z + 0.2, o: 0.4, r: -34, id: inkOf(kit) });
        }
        for (let i = 0; i < 8; i += 1) {
            const a = Math.PI * (i / 7);
            mark(out, kit, '†', W * 0.5 - Math.cos(a) * W * 0.33, H * 0.16 + Math.sin(a) * H * 0.09,
                u * 0.05, { z: z + 0.25, o: 0.3, color: kit.theme.secondary });
        }
    } else if (kind === 'ribbon') {

        bar(out, kit, W * 0.6, H * 0.05, W * 0.34, Math.max(2, u * 0.02), { z: z + 0.2, o: 0.5, r: 18 });
        bar(out, kit, W * 0.62, H * 0.12, W * 0.3, Math.max(2, u * 0.016), { z: z + 0.2, o: 0.34, r: -14 });
        for (let i = 0; i < 5; i += 1) {
            mark(out, kit, '♡', W * (0.12 + i * 0.19), H * 0.95, u * 0.05, { z: z + 0.2, o: 0.36 });
        }
    }
}

const GEO = {
    chip: { hero: [0.5, 0.5], d: [0.7, 'H'], scale: 0.5, miniCount: 0 },
    compact: { hero: [0.63, 0.53], d: [0.56, 'H'], scale: 0.34, miniCount: 2 },
    circle: { hero: [0.5, 0.5], d: [0.58, 'W'], scale: 0.24, miniCount: 2, ring: true },
    polaroid: { hero: [0.5, 0.46], d: [0.54, 'W'], scale: 0.24, miniCount: 2, polaroid: true },
    collage: { hero: [0.46, 0.52], d: [0.48, 'H'], scale: 0.26, miniCount: 3 },
    tower: { hero: [0.5, 0.42], d: [0.6, 'W'], scale: 0.24, miniCount: 3 },
    banner: { hero: [0.5, 0.5], d: [0.46, 'H'], scale: 0.28, miniCount: 2 },
    scroll: { hero: [0.5, 0.5], d: [0.72, 'H'], scale: 0.3, miniCount: 2 },
    poster: { hero: [0.5, 0.47], d: [0.46, 'H'], scale: 0.3, miniCount: 3 },
};

function heroSize(key, geo, W, H) {
    const [k, axis] = geo.d;
    return (axis === 'W' ? W : H) * k;
}

function miniSlots(key, W, H, heroRect) {
    const u = Math.min(W, H);
    const raw = {
        chip: [],
        compact: [[0.16, 0.3, 0.24], [0.16, 0.72, 0.22]],
        circle: [[0.19, 0.3, 0.16], [0.81, 0.7, 0.15]],
        polaroid: [[0.14, 0.79, 0.15], [0.86, 0.79, 0.14]],
        collage: [[0.1, 0.44, 0.16], [0.9, 0.4, 0.15], [0.62, 0.86, 0.14]],
        tower: [[0.16, 0.76, 0.2], [0.5, 0.85, 0.19], [0.84, 0.76, 0.2]],
        banner: [[0.15, 0.26, 0.24], [0.85, 0.72, 0.22]],
        scroll: [[0.2, 0.5, 0.4], [0.8, 0.5, 0.38]],
        poster: [[0.14, 0.3, 0.2], [0.86, 0.32, 0.2], [0.5, 0.86, 0.2]],
    }[key] || [];
    return raw
        .map(([x, y, s]) => [x * W, y * H, s * u])
        .filter(([, , s], i) => {
            const cx = raw[i][0] * W;
            const cy = raw[i][1] * H;
            return !(hit({ x: cx - s / 2, y: cy - s / 2, w: s, h: s }, heroRect) > s * s * 0.2);
        });
}

function typography(out, W, H, kit, key, vis, o = {}) {
    const u = Math.min(W, H);
    const ink = kit.theme.ink;
    const accent = kit.theme.accent;
    const title = kit.title || 'COLLAGE';
    const sub = subOf(kit) || '';
    const markText = markOf(kit);
    const narrow = key === 'chip' || key === 'scroll';

    const line = (text, x, y, w, size, opt = {}) => out.push(txt(text, x, y, w, size, {
        font: opt.font || kit.subFont, color: opt.color || ink, align: opt.align || 'left',
        z: opt.z || 7.3, r: opt.r || 0, o: opt.o == null ? 0.86 : opt.o,
    }));

    if (vis === 'topbar') {
        if (narrow) {
            head(out, kit, title, W * 0.2, H * 0.06, W * 0.6, Math.max(6, H * 0.14),
                { align: 'center', z: 7.4, color: ink, sub: sub, subColor: accent });
            line(markText, W * 0.3, H * 0.84, W * 0.4, Math.max(3.2, H * 0.075), { align: 'center', o: 0.7 });
        } else {
            label(out, kit, sub || title, W * 0.05, H * 0.05, W * 0.32, Math.max(4, H * 0.042),
                { z: 7.3, band: true, bandId: softOf(kit), color: ink, bo: 0.94 });
            head(out, kit, title, W * 0.42, H * 0.04, W * 0.52, Math.max(7, H * 0.085),
                { align: 'right', z: 7.35, color: ink, sub: markText, subColor: accent });
            rule(out, kit, W * 0.44, H * 0.165, W * 0.5, 0.8, { o: 0.3, z: 7.25 });
            label(out, kit, markText, W * 0.06, H * 0.9, W * 0.24, Math.max(3.4, H * 0.036),
                { z: 7.3, band: true, bandId: accent, color: kit.theme.onDark, bo: 0.9 });
        }
    } else if (vis === 'block') {
        const x = narrow ? W * 0.3 : W * 0.55;
        const w = narrow ? W * 0.4 : W * 0.4;
        out.push(img(softOf(kit), x, H * 0.08, w, H * (narrow ? 0.3 : 0.34), { z: 7.15, o: 0.9, fit: 'fill' }));
        head(out, kit, title, x + w * 0.06, H * 0.1, w * 0.88, Math.max(6, H * 0.09),
            { align: 'left', z: 7.4, color: ink });
        line(sub, x + w * 0.06, H * (narrow ? 0.28 : 0.26), w * 0.86, Math.max(3, H * 0.038), { o: 0.7 });
        line(markText, W * 0.06, H * 0.86, W * 0.3, Math.max(3, H * 0.036), { o: 0.66 });
    } else if (vis === 'banner') {
        out.push(img(accent, W * 0.06, H * 0.06, W * 0.42, H * 0.13, { z: 7.15, o: 0.9, fit: 'fill', r: -1.5 }));
        head(out, kit, title, W * 0.08, H * 0.07, W * 0.38, Math.max(6, H * 0.1),
            { align: 'left', z: 7.4, color: kit.theme.onDark });
        line(sub, W * 0.52, H * 0.08, W * 0.4, Math.max(3, H * 0.04), { align: 'right', o: 0.7 });
        line(markText, W * 0.62, H * 0.82, W * 0.3, Math.max(3, H * 0.04), { align: 'right', o: 0.6 });
    } else if (vis === 'arc') {
        const cx = W / 2;
        for (let i = 0; i < 3; i += 1) {
            const p = arcPos(cx, H * 0.52, W * 0.4, H * 0.43, 200 + i * 20);
            line(title.slice(0, 1 + i), p.x, p.y, W * 0.3, Math.max(4, u * 0.05), { align: 'center', o: 0.72, r: p.r + 180 });
        }
        line(sub, W * 0.12, H * 0.88, W * 0.76, Math.max(3.2, H * 0.036), { align: 'center', o: 0.7 });
        line(markText, W * 0.34, H * 0.06, W * 0.32, Math.max(3, H * 0.034), { align: 'center', o: 0.62 });
    } else if (vis === 'plate') {
        label(out, kit, title, W * 0.05, H * 0.06, W * 0.3, Math.max(4, H * 0.045),
            { z: 7.3, band: true, bandId: inkOf(kit), color: kit.theme.onDark, bo: 0.9, font: F.mono, align: 'center' });
        out.push(txt(sub.toUpperCase(), W * 0.38, H * 0.075, W * 0.56, Math.max(3, H * 0.032),
            { font: F.mono, color: ink, align: 'right', z: 7.3, o: 0.6 }));
        rule(out, kit, W * 0.38, H * 0.135, W * 0.56, 0.8, { o: 0.3, z: 7.25, id: inkOf(kit) });
        line(markText, W * 0.06, H * 0.9, W * 0.3, Math.max(3, H * 0.034), { font: F.mono, o: 0.6 });
    } else if (vis === 'cloud') {
        label(out, kit, title, W * 0.28, H * 0.05, W * 0.44, Math.max(4.5, H * 0.06),
            { z: 7.3, band: true, bandId: softOf(kit), color: ink, bo: 0.95, font: F.hand });
        line(sub, W * 0.2, H * 0.85, W * 0.6, Math.max(3, H * 0.04), { align: 'center', o: 0.68, font: F.hand });
        line(markText, W * 0.06, H * 0.14, W * 0.2, Math.max(3, H * 0.038), { o: 0.6, font: F.hand });
    } else if (vis === 'verse') {

        const short = String(title).split(' ').slice(0, 2).join(' ');
        out.push(txt(short, W * 0.055, H * 0.5, W * 0.16, Math.max(4.6, u * 0.05),
            { font: F.kai, color: ink, align: 'center', z: 7.35, r: 90, o: 0.9 }));
        for (let i = 0; i < 3; i += 1) {
            line(sub, W * 0.06, H * (0.12 + i * 0.055), W * 0.13, Math.max(2.6, H * 0.03), { o: 0.55, font: F.kai });
        }
        line(markText, W * 0.62, H * 0.82, W * 0.32, Math.max(3, H * 0.036), { align: 'right', o: 0.6, font: F.kai });
    } else if (vis === 'postage') {
        label(out, kit, title, W * 0.06, H * 0.07, W * 0.26, Math.max(3.6, H * 0.042),
            { z: 7.3, band: true, bandId: inkOf(kit), color: kit.theme.onDark, bo: 0.88, font: F.mono });
        out.push(txt(sub, W * 0.36, H * 0.075, W * 0.3, Math.max(2.8, H * 0.03),
            { font: F.mono, color: ink, z: 7.3, o: 0.6 }));
        out.push(txt(markText, W * 0.74, H * 0.075, W * 0.2, Math.max(2.8, H * 0.032),
            { font: F.mono, color: accent, align: 'right', z: 7.3, o: 0.8 }));
        line(sub, W * 0.06, H * 0.9, W * 0.36, Math.max(2.6, H * 0.03), { font: F.mono, o: 0.55 });
    } else if (vis === 'archOrn') {
        out.push(txt(title, W * 0.5, H * 0.055, W * 0.8, Math.max(6, u * 0.085),
            { font: F.serif, color: ink, align: 'center', z: 7.4, o: 0.94 }));
        rule(out, kit, W * 0.28, H * 0.145, W * 0.44, 0.9, { o: 0.34, z: 7.3 });
        line(sub, W * 0.2, H * 0.88, W * 0.6, Math.max(3, H * 0.034), { align: 'center', o: 0.6, font: F.serif });
    } else {

        label(out, kit, title, W * 0.32, H * 0.07, W * 0.36, Math.max(4.5, H * 0.055),
            { z: 7.3, band: true, bandId: accent, color: kit.theme.onDark, bo: 0.92, font: F.hand });
        line(sub, W * 0.08, H * 0.86, W * 0.34, Math.max(3, H * 0.038), { o: 0.66, font: F.hand });
        line(markText, W * 0.62, H * 0.87, W * 0.3, Math.max(3, H * 0.038), { align: 'right', o: 0.6, font: F.hand });
    }
}

export function buildStudio(W, H, kit, key) {
    const vis = VISION[kit.id] || VISION.school;
    const packs = kit.packs || { frames: [], frameInfo: [], props: [], scraps: [] };
    const frames = packs.frameInfo || [];

    const props = (packs.propInfo && packs.propInfo.length)
        ? packs.propInfo
        : (packs.props || []).map(id => ({ id, sat: 0.4 }));
    const geo = GEO[key] || GEO.collage;
    const u = Math.min(W, H);
    const out = [];

    ground(W, H, kit, out);
    ornament(out, W, H, kit, vis.orn);

    const layout = PAPERS[vis.papers] || PAPERS.rail;
    layout.forEach(([cx, cy, w, h, rot], i) => {
        paper(out, kit, packs.scraps, i, cx * W, cy * H, w * W, h * H, rot, 2 + i * 0.07);
    });

    if (geo.polaroid) {
        const pw = W * 0.84, ph = H * 0.84;
        out.push(img(shadowOf(kit), (W - pw) / 2 + 2, (H - ph) / 2 + 4, pw, ph, { z: 2.6, o: 0.5, fit: 'fill' }));
        out.push(img(paperOf(kit), (W - pw) / 2, (H - ph) / 2, pw, ph, { z: 2.7, o: 1, fit: 'fill' }));
    }

    const d = heroSize(key, geo, W, H);
    const cx = geo.hero[0] * W;
    const cy = geo.hero[1] * H;
    const hw = key === 'chip' || key === 'scroll' || key === 'circle' ? d : d * 0.94;
    const hh = key === 'chip' || key === 'scroll' ? d : d;
    hero(out, kit, frames, cx, cy, hw, hh, vis.shape, {
        frameIndex: key.length + kit.id.length,
        kind: vis.frameKind,
        pick: key === 'polaroid' ? [] : vis.framePick,
        edge: key === 'polaroid' ? null : vis.edge,
        frame: key !== 'polaroid',
    });

    const heroRect = { x: cx - hw / 2, y: cy - hh / 2, w: hw, h: hh };
    const slots = miniSlots(key, W, H, heroRect).slice(0, geo.miniCount);
    const miniFrames = vis.frameKind === 'none' || frames.length < 2 ? [] : frames;
    minis(out, kit, miniFrames, slots.map(([x, y, s]) => [x, y, s, vis.mini]), 3.65,
        { shape: vis.mini, kind: vis.frameKind, pick: vis.framePick, W, H });

    typography(out, W, H, kit, key, vis.type);

    const smallCanvas = u < 210;
    const blockers = out
        .filter(el => el.assetId === '__avatar__' || (!smallCanvas && el.type === 'text'))
        .map(el => ({ x: el.x - 2, y: el.y - 2, w: el.width + 4, h: el.height + 4 }));

    const spots = (CLUSTERS[vis.clusters] || CLUSTERS.corners)
        .map(([x, y]) => [(key === 'chip' || key === 'scroll') ? 0.06 + x * 0.88 : x, y]);
    const perCluster = key === 'chip' ? 3
        : key === 'compact' ? 3
        : key === 'circle' ? 3
        : key === 'polaroid' ? 3
        : key === 'poster' ? 5
        : 4;
    const propSize = u * geo.scale;
    spots.forEach(([x, y], i) => {
        cluster(out, kit, props, x * W, y * H, propSize * 0.9, perCluster,
            propSize, 11 + i * 5 + kit.id.length, 6.65, blockers, W, H);
    });

    if (kit.tapes?.length) {
        const tw = Math.min(W * 0.2, u * 0.34);
        tape(out, kit, kit.tapes[0], W * 0.2, H * 0.05, tw, { z: 7.5, r: -8, o: 0.82 });
        tape(out, kit, kit.tapes[0], W * 0.8, H * 0.95, tw, { z: 7.5, r: 7, o: 0.82 });
    }

    return {
        elements: out,
        avatarUnits: hw,
        anchorX: geo.hero[0],
        anchorY: geo.hero[1],
    };
}
