let seq = 0;
function uid(prefix) {
    seq += 1;
    return `${prefix}-${seq.toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export const F = {
    sans: "'Arial Rounded MT Bold', 'Trebuchet MS', sans-serif",
    mono: "'Courier New', monospace",
    serif: "Georgia, 'Times New Roman', serif",
    hand: "'Segoe Script', 'Bradley Hand', 'Comic Sans MS', cursive",
    cn: "'Microsoft YaHei', 'PingFang SC', sans-serif",
    kai: "'Kaiti SC', 'STKaiti', 'KaiTi', serif",
};

export function measure(value, size) {
    let units = 0;
    for (const ch of String(value || '')) {
        if (ch === ' ') units += 0.3;
        else if ('IJijl.,:;|!\'"()[]'.includes(ch)) units += 0.34;
        else if ('MWmw@%'.includes(ch)) units += 0.95;
        else units += 0.7;
    }
    return units * size;
}

export function fit(value, maxWidth, maxSize, floor = 3) {
    let units = 0;
    for (const ch of String(value || '')) {
        if (ch === ' ') units += 0.3;
        else if ('IJijl.,:;|!\'"()[]'.includes(ch)) units += 0.34;
        else if ('MWmw@%'.includes(ch)) units += 0.95;
        else units += 0.7;
    }
    return Math.max(floor, Math.min(maxSize, maxWidth * 0.92 / Math.max(0.1, units)));
}

export function img(assetId, x, y, w, h, o = {}) {
    return {
        id: uid('el'), type: 'image', assetId,
        x, y, width: w, height: h,
        rotation: o.r || 0, z: o.z == null ? 2 : o.z, opacity: o.o == null ? 1 : o.o,
        shape: o.shape || 'none', caption: o.caption || '',
        cropZoom: o.zoom || 1, fit: o.fit || 'cover',
        focusX: o.fx == null ? 50 : o.fx, focusY: o.fy == null ? 50 : o.fy,
        layer: o.layer || 'back',
    };
}

export function txt(value, x, y, w, size, o = {}) {
    return {
        id: uid('el'), type: 'text', text: value,
        x, y, width: w, height: size * 1.3,
        rotation: o.r || 0, z: o.z == null ? 8 : o.z, opacity: o.o == null ? 1 : o.o,
        fontSize: size, fontFamily: o.font || F.sans, color: o.color || '',
        align: o.align || 'left', stroke: o.stroke || 0,
        shadow: o.shadow || false, layer: o.layer || 'back',
    };
}

export function glyph(ch, x, y, size, o = {}) {
    return {
        id: uid('el'), type: 'sticker', text: ch,
        x, y, width: size, height: size,
        rotation: o.r || 0, z: o.z == null ? 6 : o.z, opacity: o.o == null ? 1 : o.o,
        fontSize: size * 0.82, fontFamily: o.font || F.sans, color: o.color || '',
        align: 'center', stroke: 0, shadow: false, layer: o.layer || 'back',
    };
}

function svg(viewBox, body) {
    const source = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}' preserveAspectRatio='none'>${body}</svg>`
        .replace(/\s{2,}/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
    return `data:image/svg+xml,${encodeURIComponent(source)}`;
}

export const ASPECT = Object.create(null);

export const A = (id, name, group, url, aspect) => {
    ASPECT[id] = aspect == null ? 1 : aspect;
    return { id, name, group, url };
};

export const G = (id, name, group, viewBox, body) => {
    const [, , w, h] = viewBox.split(/\s+/).map(Number);
    ASPECT[id] = w / h;
    return { id, name, group, url: svg(viewBox, body) };
};

export function pattern(id, name, group, size, body, base) {
    ASPECT[id] = 1;
    return {
        id, name, group,
        url: svg('0 0 120 120', `<defs><pattern id='p' width='${size}' height='${size}' patternUnits='userSpaceOnUse'>${body}</pattern></defs>`
            + (base ? `<rect width='120' height='120' fill='${base}'/>` : '')
            + `<rect width='120' height='120' fill='url(#p)'/>`),
    };
}

export function ringDots(cx, cy, r, count, size, fill, extra = '') {
    let body = '';
    for (let i = 0; i < count; i += 1) {
        const a = (i / count) * Math.PI * 2;
        body += `<circle cx='${(cx + Math.cos(a) * r).toFixed(1)}' cy='${(cy + Math.sin(a) * r).toFixed(1)}' r='${size}' fill='${fill}' ${extra}/>`;
    }
    return body;
}

export function perforation(w, h, r, fill) {
    const step = r * 2.4;
    let body = `<g fill='${fill}'>`;
    for (let x = step / 2; x < w; x += step) {
        body += `<circle cx='${x.toFixed(1)}' cy='0' r='${r}'/><circle cx='${x.toFixed(1)}' cy='${h}' r='${r}'/>`;
    }
    for (let y = step / 2; y < h; y += step) {
        body += `<circle cx='0' cy='${y.toFixed(1)}' r='${r}'/><circle cx='${w}' cy='${y.toFixed(1)}' r='${r}'/>`;
    }
    return `${body}</g>`;
}

export function rowDots(w, h, y, count, size, fill) {
    let body = '';
    for (let i = 0; i < count; i += 1) {
        const x = (w / count) * (i + 0.5);
        body += `<rect x='${(x - size / 2).toFixed(1)}' y='${(y - size / 2).toFixed(1)}' width='${size}' height='${size}' rx='${(size * 0.22).toFixed(1)}' fill='${fill}'/>`;
    }
    return body;
}

export function tint(hex, amount) {
    const value = String(hex || '#888888').replace('#', '');
    const num = parseInt(value.length === 3 ? value.split('').map(c => c + c).join('') : value, 16);
    const r = Math.min(255, Math.max(0, ((num >> 16) & 255) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 255) + amount));
    const b = Math.min(255, Math.max(0, (num & 255) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function lum(hex) {
    const value = String(hex || '#888888').replace('#', '');
    const num = parseInt(value.length === 3 ? value.split('').map(c => c + c).join('') : value, 16);
    return (0.299 * ((num >> 16) & 255) + 0.587 * ((num >> 8) & 255) + 0.114 * (num & 255)) / 255;
}

export function box(assetId, size) {
    const raw = ASPECT[assetId] || 1;
    const a = Math.min(6, Math.max(0.2, raw));
    return a >= 1 ? { w: size, h: size / a } : { w: size * a, h: size };
}

export function bandBox(assetId, w) {
    const a = Math.min(6, Math.max(0.2, ASPECT[assetId] || 1));
    return { w, h: w / a };
}

export function colBox(assetId, h) {
    const a = Math.min(6, Math.max(0.2, ASPECT[assetId] || 1));
    return { w: h * a, h };
}

function solidAsset(id, name, color) {
    return A(id, name, '色块', svg('0 0 12 12', `<rect width='12' height='12' fill='${color}'/>`), 1);
}

function paperAsset(id, base, line, ruled, speck) {
    const rows = [];
    if (ruled) {
        for (let y = 9; y < 120; y += 9) {
            rows.push(`<path d='M0 ${y}H120' stroke='${line}' stroke-width='0.48' opacity='0.58'/>`);
            rows.push(`<path d='M0 ${y + 0.8}H120' stroke='#ffffff' stroke-width='0.25' opacity='0.2'/>`);
        }
    }
    const marks = [];
    if (speck) {

        for (let i = 0; i < 84; i += 1) {
            const x = (i * 47.13 + 11) % 120;
            const y = (i * 73.77 + 7) % 120;
            const r = 0.2 + (i % 5) * 0.085;
            marks.push(`<circle cx='${x.toFixed(2)}' cy='${y.toFixed(2)}' r='${r.toFixed(2)}' fill='${line}' opacity='${(0.12 + (i % 4) * 0.045).toFixed(2)}'/>`);
        }
    }
    const fibers = Array.from({ length: 34 }, (_, i) => {
        const x = (i * 37.7 + 5) % 120;
        const y = (i * 61.3 + 13) % 120;
        const len = 3 + (i % 7) * 1.6;
        return `<path d='M${x.toFixed(1)} ${y.toFixed(1)}l${len.toFixed(1)} ${((i % 3) - 1) * 0.7}'/>`;
    }).join('');
    const body = `<defs><linearGradient id='p' x1='0' y1='0' x2='1' y2='1'><stop stop-color='${tint(base, 5)}'/><stop offset='0.48' stop-color='${base}'/><stop offset='1' stop-color='${tint(base, -7)}'/></linearGradient><radialGradient id='v' cx='0.28' cy='0.18' r='0.95'><stop stop-color='#ffffff' stop-opacity='0.1'/><stop offset='0.62' stop-color='#ffffff' stop-opacity='0'/><stop offset='1' stop-color='#20202a' stop-opacity='0.09'/></radialGradient></defs>`
        + `<rect width='120' height='120' fill='url(#p)'/>${rows.join('')}${marks.join('')}`
        + `<g stroke='${line}' stroke-width='0.28' opacity='0.18' stroke-linecap='round'>${fibers}</g>`
        + `<path d='M0 103C35 96 70 111 120 98M86 0C82 36 95 72 89 120' fill='none' stroke='#ffffff' stroke-width='1.1' opacity='0.1'/>`
        + `<path d='M0 104C35 97 70 112 120 99M87 0C83 36 96 72 90 120' fill='none' stroke='#25202a' stroke-width='0.55' opacity='0.07'/>`
        + `<rect width='120' height='120' fill='url(#v)'/>`;
    return A(id, '纸面', '纸张', svg('0 0 120 120', body), 1);
}

function bgAsset(id, stops, glow) {
    const body = "<defs><linearGradient id='g' x1='0' y1='0' x2='0.82' y2='1'>"
        + stops.map((c, i) => `<stop offset='${(i / Math.max(1, stops.length - 1)).toFixed(2)}' stop-color='${c}'/>`).join('')
        + "</linearGradient><radialGradient id='r' cx='0.2' cy='0.1' r='0.9'><stop stop-color='#ffffff' stop-opacity='0.32'/><stop offset='0.58' stop-color='#ffffff' stop-opacity='0'/></radialGradient></defs>"
        + "<rect width='120' height='120' fill='url(#g)'/>"
        + `<circle cx='24' cy='18' r='36' fill='${glow}' opacity='0.2'/>`
        + `<circle cx='106' cy='108' r='42' fill='${glow}' opacity='0.12'/>`
        + "<path d='M-18 94C22 62 72 90 138 34' fill='none' stroke='#ffffff' stroke-width='14' opacity='0.055'/>"
        + "<rect width='120' height='120' fill='url(#r)'/>";
    return A(id, '底色', '纸张', svg('0 0 120 120', body), 1);
}

function cornerAsset(id, color) {
    const body = `<g fill='none' stroke='${color}' stroke-width='2.6' stroke-linecap='square'>`
        + "<path d='M10 42V10H42'/><path d='M20 54V20H54' stroke-width='1.1' opacity='0.6'/></g>"
        + `<circle cx='10' cy='10' r='3.2' fill='${color}'/>`
        + `<path d='M62 10h12' stroke='${color}' stroke-width='1.1' opacity='0.45'/>`;
    return A(id, '角花', '装饰', svg('0 0 120 120', body), 1);
}

function grainAsset(id, color) {
    const dots = [];
    let seed = 731;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 260; i += 1) {
        const x = random() * 120;
        const y = random() * 120;
        const opacity = 0.1 + random() * 0.28;
        if (i % 6 === 0) {
            dots.push(`<path d='M${x.toFixed(2)} ${y.toFixed(2)}l${(0.8 + random() * 1.8).toFixed(2)} ${(random() - 0.5).toFixed(2)}' stroke='${color}' stroke-width='0.32' opacity='${opacity.toFixed(2)}'/>`);
        } else {
            dots.push(`<circle cx='${x.toFixed(2)}' cy='${y.toFixed(2)}' r='${(0.18 + random() * 0.48).toFixed(2)}' fill='${color}' opacity='${opacity.toFixed(2)}'/>`);
        }
    }
    return A(id, '颗粒', '纸张', svg('0 0 120 120', dots.join('')), 1);
}

function shadowAsset(id) {
    const body = "<defs><filter id='b' x='-30%' y='-30%' width='160%' height='160%'><feGaussianBlur stdDeviation='4.2'/></filter></defs>"
        + "<rect x='7' y='7' width='106' height='106' rx='2' fill='#16131b' opacity='0.62' filter='url(#b)'/>";
    return A(id, '柔和纸影', '纸张', svg('0 0 120 120', body), 1);
}

function lightAsset(id) {
    const body = "<defs><radialGradient id='l' cx='0.16' cy='0.08' r='1.08'><stop stop-color='#ffffff' stop-opacity='0.2'/><stop offset='0.46' stop-color='#ffffff' stop-opacity='0.02'/><stop offset='1' stop-color='#17121f' stop-opacity='0.22'/></radialGradient></defs>"
        + "<rect width='120' height='120' fill='url(#l)'/>";
    return A(id, '纸面光泽', '纸张', svg('0 0 120 120', body), 1);
}

function ringAsset(id, color) {

    const body = `<circle cx='60' cy='60' r='55' fill='none' stroke='${color}' stroke-width='1.4' opacity='0.72'/>`
        + `<circle cx='60' cy='60' r='50' fill='none' stroke='${color}' stroke-width='0.7' opacity='0.4' stroke-dasharray='2.6 4'/>`
        + `<circle cx='60' cy='60' r='44' fill='none' stroke='${color}' stroke-width='0.5' opacity='0.22'/>`;
    return A(id, '圆环', '装饰', svg('0 0 120 120', body), 1);
}

export function makeStyleSkin(id, p) {
    return [
        bgAsset(`v10:bg-${id}`, p.bg, p.glow),
        paperAsset(`v10:paper-${id}`, p.paper, p.line, p.ruled !== false, true),
        solidAsset(`v10:acc-${id}`, '主色块', p.accent),
        solidAsset(`v10:soft-${id}`, '浅色块', p.soft),
        solidAsset(`v10:ink-${id}`, '深色块', p.ink),
        cornerAsset(`v10:crn-${id}`, p.accent),
        grainAsset(`v10:grain-${id}`, p.line),
        shadowAsset(`v10:shadow-${id}`),
        lightAsset(`v10:light-${id}`),
        ringAsset(`v10:ring-${id}`, p.accent),
    ].map(asset => ({ ...asset, hidden: true }));
}
