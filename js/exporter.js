import {toneFilter} from './photo-tone.js';
import { resolveText, textSize } from './text.js';
import { imageCrop } from './image-crop.js';
import { prepareAssets } from './asset-loader.js';
import { AVATAR_SHAPES, avatarShapeFitScale, avatarVisualSize, builtinAssetUrl, clampRotate, ELLIPSE_OUTLINE, frameGeometry, isBuiltinAsset, mainPortrait, isElementHidden, avatarIsHidden, photoRotateRelative, RECT_OUTLINE, rotateCoverScalePoints, shapeOutline, shapeRotateOf } from './templates.js';

const SHAPE_PAD = {
    none: { t: 0, r: 0, b: 0, l: 0 },
    rect: { t: 0.03, r: 0.03, b: 0.03, l: 0.03 },
    polaroid: { t: 0.055, r: 0.06, b: 0.22, l: 0.06 },
    circle: { t: 0.04, r: 0.04, b: 0.04, l: 0.04 },
    oval: { t: 0.03, r: 0.03, b: 0.03, l: 0.03 },
    scallop: { t: 0.06, r: 0.06, b: 0.06, l: 0.06 },
    lace: { t: 0.11, r: 0.11, b: 0.11, l: 0.11 },
    heart: { t: 0.05, r: 0.05, b: 0.05, l: 0.05 },
    star: { t: 0.06, r: 0.06, b: 0.06, l: 0.06 },
    hexagon: { t: 0.05, r: 0.05, b: 0.05, l: 0.05 },
    arch: { t: 0.04, r: 0.04, b: 0.04, l: 0.04 },
    film: { t: 0.1, r: 0.07, b: 0.1, l: 0.07 },
    ticket: { t: 0.05, r: 0.05, b: 0.05, l: 0.05 },
    stamp: { t: 0.08, r: 0.08, b: 0.08, l: 0.08 },
    torn: { t: 0.04, r: 0.04, b: 0.04, l: 0.04 },
    double: { t: 0.07, r: 0.07, b: 0.07, l: 0.07 },
    magazine: { t: 0.03, r: 0.03, b: 0.03, l: 0.03 },
    postcard: { t: 0.06, r: 0.06, b: 0.06, l: 0.06 },
    wave: { t: 0.05, r: 0.05, b: 0.05, l: 0.05 },
    blob: { t: 0.04, r: 0.04, b: 0.04, l: 0.04 },
    corner: { t: 0.04, r: 0.04, b: 0.04, l: 0.04 },
};

const AVATAR_CLIP = {
    circle: 'circle',
    rounded: 'round',
    square: 'rect',
    heart: 'heart',
    star: 'star',
    hexagon: 'hexagon',
    arch: 'arch',
    diamond: 'diamond',
    blob: 'blob',
    flower: 'flower',
};

const HEART = [
    [0.5, 0.94], [0.08, 0.6], [0.02, 0.32], [0.12, 0.14], [0.32, 0.12],
    [0.5, 0.3], [0.68, 0.12], [0.88, 0.14], [0.98, 0.32], [0.92, 0.6],
];

const DIAMOND = [[0.5, 0.02], [0.98, 0.5], [0.5, 0.98], [0.02, 0.5]];

const HEXAGON = [[0.5, 0.02], [0.94, 0.26], [0.94, 0.74], [0.5, 0.98], [0.06, 0.74], [0.06, 0.26]];

function starPoints(points = 5, inner = 0.42) {
    const list = [];
    for (let i = 0; i < points * 2; i += 1) {
        const radius = i % 2 ? inner : 1;
        const angle = (Math.PI / points) * i - Math.PI / 2;
        list.push([0.5 + Math.cos(angle) * radius * 0.48, 0.5 + Math.sin(angle) * radius * 0.48]);
    }
    return list;
}

const STAR = starPoints(5, 0.42);

function flowerPoints(petals = 10, depth = 0.14) {
    const list = [];
    const steps = petals * 8;
    for (let i = 0; i < steps; i += 1) {
        const angle = (Math.PI * 2 * i) / steps;
        const radius = 0.5 - depth * (1 - Math.cos(petals * angle)) / 2;
        list.push([0.5 + Math.cos(angle) * radius, 0.5 + Math.sin(angle) * radius]);
    }
    return list;
}

const FLOWER = flowerPoints();

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function num(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function polygonPath(points, box) {
    const path = new Path2D();
    points.forEach(([px, py], index) => {
        const x = box.x + px * box.w;
        const y = box.y + py * box.h;
        if (index === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
    });
    path.closePath();
    return path;
}

function roundRectPath(box, radius) {
    const path = new Path2D();
    const r = Math.max(0, Math.min(radius, Math.min(box.w, box.h) / 2));
    const { x, y, w, h } = box;
    path.moveTo(x + r, y);
    path.lineTo(x + w - r, y);
    path.quadraticCurveTo(x + w, y, x + w, y + r);
    path.lineTo(x + w, y + h - r);
    path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    path.lineTo(x + r, y + h);
    path.quadraticCurveTo(x, y + h, x, y + h - r);
    path.lineTo(x, y + r);
    path.quadraticCurveTo(x, y, x + r, y);
    path.closePath();
    return path;
}

function heartPath(box) {
    const path = new Path2D();
    const { x, y, w, h } = box;
    const cx = x + w / 2;
    path.moveTo(cx, y + h * 0.94);
    path.bezierCurveTo(x + w * 0.02, y + h * 0.64, x + w * 0.04, y + h * 0.1, cx, y + h * 0.3);
    path.bezierCurveTo(x + w * 0.96, y + h * 0.1, x + w * 0.98, y + h * 0.64, cx, y + h * 0.94);
    path.closePath();
    return path;
}

function archPath(box) {
    const path = new Path2D();
    const { x, y, w, h } = box;
    const shoulder = h * 0.46;
    path.moveTo(x, y + h);
    path.lineTo(x, y + shoulder);
    path.ellipse(x + w / 2, y + shoulder, w / 2, shoulder, 0, Math.PI, 0, false);
    path.lineTo(x + w, y + h);
    path.closePath();
    return path;
}

function blobPath(box) {
    const path = new Path2D();
    const { x, y, w, h } = box;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rx = w / 2;
    const ry = h / 2;
    path.moveTo(cx, y);
    path.bezierCurveTo(cx + rx * 0.62, y, x + w, cy - ry * 0.55, x + w, cy);
    path.bezierCurveTo(x + w, cy + ry * 0.62, cx + rx * 0.5, y + h, cx, y + h);
    path.bezierCurveTo(cx - rx * 0.55, y + h, x, cy + ry * 0.58, x, cy);
    path.bezierCurveTo(x, cy - ry * 0.5, cx - rx * 0.6, y, cx, y);
    path.closePath();
    return path;
}

function shapePath(shape, box) {
    switch (shape) {
        case 'circle': {
            const path = new Path2D();
            path.ellipse(box.x + box.w / 2, box.y + box.h / 2, box.w / 2, box.h / 2, 0, 0, Math.PI * 2);
            return path;
        }
        case 'oval': {
            const path = new Path2D();
            path.ellipse(box.x + box.w / 2, box.y + box.h / 2, box.w / 2, box.h * 0.41, 0, 0, Math.PI * 2);
            return path;
        }
        case 'heart': return heartPath(box);
        case 'star': return polygonPath(STAR, box);
        case 'hexagon': return polygonPath(HEXAGON, box);
        case 'diamond': return polygonPath(DIAMOND, box);
        case 'arch': return archPath(box);
        case 'blob': return blobPath(box);
        case 'flower': return polygonPath(FLOWER, box);
        default: return roundRectPath(box, Math.min(box.w, box.h) * 0.06);
    }
}

const imageCache = new Map();

function loadImage(url) {
    if (!url) return Promise.resolve(null);
    if (imageCache.has(url)) { const cached = imageCache.get(url); imageCache.delete(url); imageCache.set(url, cached); return cached; }
    const promise = new Promise(resolve => {
        const image = new Image();

        if (!url.startsWith('file:')) image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = () => { imageCache.delete(url); resolve(null); };
        image.src = url;
    });
    imageCache.set(url, promise);
    // 图片更换与关闭编辑器后，限制全局解码缓存，避免长时间编辑不断占用内存。
    while (imageCache.size > 128) imageCache.delete(imageCache.keys().next().value);
    return promise;
}

export async function preloadCollageAssets(config, { avatarUrl, assetUrls = new Map() } = {}) {
    await prepareAssets(config.elements.filter(e => e.type === 'image' && !isElementHidden(config, e)).map(e => e.assetId));
    const jobs = [];
    for (const element of config.elements) {
        if (element.type !== 'image') continue;
        if (isElementHidden(config, element)) continue;
        const url = resolveAssetUrl(element, { avatarUrl, assetUrls });
        if (url) jobs.push(loadImage(url));
    }
    await Promise.all(jobs);
}

function resolveAssetUrl(element, { avatarUrl, assetUrls }) {
    if (element.assetId === '__avatar__') return avatarUrl || '';
    if (isBuiltinAsset(element.assetId)) return builtinAssetUrl(element.assetId);
    return assetUrls.get(element.assetId) || '';
}

function drawCover(ctx, image, box, element) {
    const filter=element.photoTone?toneFilter(element.photoTone):'none',filtered=filter!=='none';
    if(filtered){ctx.save();ctx.filter=filter;}
    try {
    const iw = image.naturalWidth || image.width;
    const ih = image.naturalHeight || image.height;
    if (!iw || !ih) return;
    if (element.fit === 'fill') {
        ctx.drawImage(image, box.x, box.y, box.w, box.h);
        return;
    }
    if (element.fit === 'contain') {

        const k = Math.min(box.w / iw, box.h / ih);
        const dw = iw * k;
        const dh = ih * k;
        ctx.drawImage(image, box.x + (box.w - dw) / 2, box.y + (box.h - dh) / 2, dw, dh);
        return;
    }
    const crop = imageCrop(iw, ih, num(element.cropZoom, 1), num(element.focusX, 50), num(element.focusY, 50));
    const fit = Math.max(box.w / crop.w, box.h / crop.h);
    const dw = crop.w * fit;
    const dh = crop.h * fit;
    const fx = clamp(num(element.focusX, 50), 0, 100) / 100;
    const fy = clamp(num(element.focusY, 50), 0, 100) / 100;
    ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, box.x + (box.w - dw) * fx, box.y + (box.h - dh) * fy, dw, dh);
    } finally {if(filtered)ctx.restore();}
}

function innerBox(element) {
    const pad = SHAPE_PAD[element.shape] || SHAPE_PAD.none;
    return {
        x: element.x + element.width * pad.l,
        y: element.y + element.height * pad.t,
        w: element.width * (1 - pad.l - pad.r),
        h: element.height * (1 - pad.t - pad.b),
    };
}

function drawImageElement(ctx, element, image, config) {
    if (!image) return;
    const cx = element.x + element.width / 2;
    const cy = element.y + element.height / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((num(element.rotation, 0) * Math.PI) / 180);
    ctx.translate(-cx, -cy);
    ctx.globalAlpha = clamp(num(element.opacity, 1), 0.02, 1);

    const shape = element.shape || 'none';
    const outer = { x: element.x, y: element.y, w: element.width, h: element.height };
    const inner = innerBox(element);
    const unit = Math.min(outer.w, outer.h);
    const blur = Math.max(1, unit * 0.07);

    if (shape === 'none') {

        ctx.shadowColor = element.finish === 'flat' ? 'transparent' : 'rgba(40,30,50,0.22)';
        ctx.shadowBlur = element.finish === 'flat' ? 0 : blur * 0.55;
        ctx.shadowOffsetY = element.finish === 'flat' ? 0 : blur * 0.25;
        if (!element.fit || element.fit === 'cover') {
            ctx.beginPath(); ctx.rect(inner.x, inner.y, inner.w, inner.h); ctx.clip();
        }
        drawCover(ctx, image, inner, element);
        ctx.restore();
        return;
    }

    const paper = config.theme.paper || '#fdfbf7';
    const accent = config.theme.accent || '#c9b8c8';
    const outerPath = shapePath(shape, outer);
    const innerPath = shapePath(shape, inner);

    if (shape === 'film') {

        ctx.shadowColor = 'rgba(40,30,50,0.3)';
        ctx.shadowBlur = blur;
        ctx.shadowOffsetY = blur * 0.4;
        ctx.fillStyle = '#141118';
        ctx.fill(outerPath);
        ctx.shadowColor = 'transparent';
        ctx.save();
        ctx.clip(innerPath);
        drawCover(ctx, image, inner, element);
        ctx.restore();
        const holeW = outer.w * 0.055;
        const holeH = outer.h * 0.05;
        ctx.save();
        ctx.fillStyle = '#f6f2ea';
        for (let x = outer.x + holeW * 0.8; x < outer.x + outer.w - holeW; x += holeW * 1.9) {
            ctx.fillRect(x, outer.y + holeH * 0.7, holeW, holeH);
            ctx.fillRect(x, outer.y + outer.h - holeH * 1.7, holeW, holeH);
        }
        ctx.restore();
        ctx.restore();
        return;
    }

    ctx.shadowColor = 'rgba(40,30,50,0.26)';
    ctx.shadowBlur = blur;
    ctx.shadowOffsetY = blur * 0.4;
    ctx.fillStyle = shape === 'polaroid' ? '#fffdfa' : paper;
    ctx.fill(outerPath);
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.save();
    ctx.clip(innerPath);
    drawCover(ctx, image, inner, element);
    ctx.restore();

    if (shape === 'circle' || shape === 'scallop') {
        ctx.save();
        ctx.strokeStyle = accent;
        ctx.lineWidth = Math.max(0.6, unit * 0.022);
        ctx.setLineDash([unit * 0.045, unit * 0.032]);
        ctx.stroke(shapePath(shape === 'circle' ? 'circle' : 'rect', inner));
        ctx.restore();
    } else if (shape === 'arch' || shape === 'oval') {
        ctx.save();
        ctx.strokeStyle = accent;
        ctx.lineWidth = Math.max(0.5, unit * 0.012);
        ctx.stroke(innerPath);
        ctx.restore();
    } else if (shape === 'polaroid') {
        ctx.save();
        ctx.strokeStyle = 'rgba(90,90,100,0.1)';
        ctx.lineWidth = Math.max(0.4, unit * 0.006);
        ctx.stroke(outerPath);
        ctx.restore();
        const caption = element.showCaption === false ? '' : String(element.caption || config.nickname || '');
        if (caption) {
            ctx.save();
            ctx.fillStyle = config.theme.ink || '#5b5560';
            const size = Math.max(1.6, outer.w * 0.062);
            ctx.font = `${size}px 'Comic Sans MS', cursive`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(caption, cx, outer.y + outer.h * 0.9, outer.w * 0.88);
            ctx.restore();
        }
    } else if (shape === 'double') {
        ctx.save();
        ctx.strokeStyle = accent;
        ctx.lineWidth = Math.max(0.5, unit * 0.01);
        ctx.stroke(innerPath);
        ctx.restore();
    }

    ctx.restore();
}

function wrapText(ctx, text, maxWidth) {
    const lines = [];
    for (const paragraph of String(text).split('\n')) {
        if (!paragraph) {
            lines.push('');
            continue;
        }
        let line = '';
        for (const char of paragraph) {
            const next = line + char;
            if (line && ctx.measureText(next).width > maxWidth) {
                lines.push(line);
                line = char;
            } else {
                line = next;
            }
        }
        lines.push(line);
    }
    return lines;
}

function drawTextElement(ctx, element, config) {
    const text = resolveText(element.text, config.textFields || {}, config.nickname);
    if (!text.trim()) return;
    const size = textSize(element, text);
    const cx = element.x + element.width / 2;
    const cy = element.y + element.height / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((num(element.rotation, 0) * Math.PI) / 180);
    ctx.translate(-cx, -cy);
    ctx.globalAlpha = clamp(num(element.opacity, 1), 0.02, 1);
    ctx.font = `${size}px ${element.fontFamily || 'sans-serif'}`;
    ctx.textBaseline = 'middle';
    const align = element.align === 'center' ? 'center' : element.align === 'right' ? 'right' : 'left';
    ctx.textAlign = align;
    const lines = wrapText(ctx, text, element.width);
    const lineHeight = size * 1.24;
    const total = lines.length * lineHeight;
    let y = cy - total / 2 + lineHeight / 2;
    const anchorX = align === 'center' ? cx : align === 'right' ? element.x + element.width : element.x;
    for (const line of lines) {
        if (element.shadow) {
            ctx.shadowColor = config.theme.accent || '#c9b8c8';
            ctx.shadowBlur = size * 0.28;
            ctx.shadowOffsetY = size * 0.12;
        }
        if (num(element.stroke, 0) > 0) {
            ctx.lineWidth = Math.max(0.5, num(element.stroke, 0) * 2);
            ctx.strokeStyle = config.theme.paper || '#ffffff';
            ctx.lineJoin = 'round';
            ctx.strokeText(line, anchorX, y);
            ctx.shadowColor = 'transparent';
        }
        ctx.fillStyle = element.color || config.theme.ink || '#5b5560';
        ctx.fillText(line, anchorX, y);
        ctx.shadowColor = 'transparent';
        y += lineHeight;
    }
    ctx.restore();
}

function drawDecoration(ctx, element, config) {
    const cx = element.x + element.width / 2;
    const cy = element.y + element.height / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((num(element.rotation, 0) * Math.PI) / 180);
    ctx.translate(-cx, -cy);
    ctx.globalAlpha = clamp(num(element.opacity, 0.8), 0.02, 1);
    if (element.type === 'tape') {
        ctx.fillStyle = config.theme.soft || '#e8e2ea';
        const teeth = Math.max(4, Math.round(element.width / 6));
        const path = new Path2D();
        path.moveTo(element.x, element.y);
        for (let i = 0; i <= teeth; i += 1) {
            path.lineTo(element.x + (element.width * i) / teeth, element.y + (i % 2 ? element.height * 0.08 : 0));
        }
        path.lineTo(element.x + element.width, element.y + element.height);
        for (let i = teeth; i >= 0; i -= 1) {
            path.lineTo(element.x + (element.width * i) / teeth, element.y + element.height - (i % 2 ? element.height * 0.08 : 0));
        }
        path.closePath();
        ctx.fill(path);
    } else if (element.type === 'lace') {

        const x = element.x, y = element.y, w = element.width, h = element.height;
        const accent = config.theme.accent || '#c9a9d8';
        const soft = config.theme.soft || '#f0e8f5';
        ctx.fillStyle = soft;
        ctx.globalAlpha = 0.75;
        ctx.fillRect(x, y + h * 0.32, w, h * 0.36);
        ctx.globalAlpha = 1;
        ctx.fillStyle = accent;
        const teeth = Math.max(6, Math.round(w / 8));
        ctx.beginPath();
        for (let i = 0; i <= teeth; i += 1) {
            const px = x + (w * i) / teeth;
            const py = y + (i % 2 ? h * 0.08 : h * 0.28);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        for (let i = teeth; i >= 0; i -= 1) {
            const px = x + (w * i) / teeth;
            const py = y + h - (i % 2 ? h * 0.08 : h * 0.28);
            ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.globalAlpha = 0.55;
        ctx.fill();
        ctx.globalAlpha = 1;
    } else {
        ctx.fillStyle = config.theme.paper || '#fdfbf7';
        ctx.fill(roundRectPath({ x: element.x, y: element.y, w: element.width, h: element.height }, Math.min(element.width, element.height) * 0.05));
    }
    ctx.restore();
}

function pointsPath(points, box) {
    const path = new Path2D();
    points.forEach(([px, py], index) => {
        const x = box.x + px * box.w;
        const y = box.y + py * box.h;
        if (index === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
    });
    path.closePath();
    return path;
}

function avatarShapePath(shapeId, box) {
    const shape = AVATAR_SHAPES.find(item => item.id === shapeId) || AVATAR_SHAPES[0];
    if (shape.points) return pointsPath(shape.points, box);
    const unit = Math.min(box.w, box.h);
    switch (shape.id) {
        case 'circle': {
            const path = new Path2D();
            path.ellipse(box.x + box.w / 2, box.y + box.h / 2, box.w / 2, box.h / 2, 0, 0, Math.PI * 2);
            return path;
        }
        case 'rounded': return roundRectPath(box, unit * 0.22);
        case 'square': return roundRectPath(box, unit * 0.05);
        case 'arch': return archPath(box);
        case 'blob': return blobPath(box);
        default: return roundRectPath(box, unit * 0.05);
    }
}

function drawRotatedCover(ctx, image, box, shot, outline = RECT_OUTLINE) {
    const angle = clampRotate(shot.rotate);
    const scale = angle ? rotateCoverScalePoints(angle, box.w, box.h, outline) : 1;
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    if (!angle && scale === 1) {
        drawCover(ctx, image, box, shot);
        return;
    }
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.translate(-cx, -cy);
    drawCover(ctx, image, {
        x: cx - (box.w * scale) / 2,
        y: cy - (box.h * scale) / 2,
        w: box.w * scale,
        h: box.h * scale,
    }, shot);
    ctx.restore();
}

function drawAvatarFrameDeco(ctx, frame, box, inner, config) {
    const unit = Math.min(box.w, box.h);
    const ink = config.theme?.accent || '#c9b8c8';
    const soft = config.theme?.soft || '#f0e8f5';
    if (frame.edge) {
        ctx.save();
        ctx.strokeStyle = 'rgba(90,90,100,0.18)';
        ctx.lineWidth = Math.max(0.4, unit * 0.006);
        ctx.stroke(frameOuterPath(frame, box));
        ctx.restore();
    }
    if (frame.dots) {
        ctx.save();
        ctx.strokeStyle = ink;
        ctx.lineWidth = Math.max(0.6, unit * 0.02);
        ctx.setLineDash([unit * 0.035, unit * 0.03]);
        ctx.beginPath();
        ctx.ellipse(inner.x + inner.w / 2, inner.y + inner.h / 2, inner.w / 2 + unit * 0.02, inner.h / 2 + unit * 0.02, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
    if (frame.rings) {
        ctx.save();
        ctx.strokeStyle = soft;
        ctx.lineWidth = Math.max(0.6, unit * 0.016);
        ctx.beginPath();
        ctx.ellipse(inner.x + inner.w / 2, inner.y + inner.h / 2, inner.w / 2 + unit * 0.028, inner.h / 2 + unit * 0.028, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = ink;
        ctx.lineWidth = Math.max(0.5, unit * 0.009);
        ctx.beginPath();
        ctx.ellipse(inner.x + inner.w / 2, inner.y + inner.h / 2, inner.w / 2 + unit * 0.055, inner.h / 2 + unit * 0.055, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
    if (frame.perf) {
        ctx.save();
        ctx.strokeStyle = soft;
        ctx.lineWidth = Math.max(0.5, unit * 0.014);
        ctx.setLineDash([unit * 0.014, unit * 0.016]);
        ctx.stroke(roundRectPath(inner, unit * 0.02));
        ctx.restore();
    }
    if (frame.sprocket) {
        const holeW = unit * 0.05;
        const holeH = unit * 0.035;
        ctx.save();
        ctx.fillStyle = '#f4f0e8';
        for (let x = box.x + unit * 0.08; x < box.x + box.w - holeW; x += holeW * 2.1) {
            ctx.fillRect(x, box.y + unit * 0.035, holeW, holeH);
            ctx.fillRect(x, box.y + box.h - unit * 0.035 - holeH, holeW, holeH);
        }
        ctx.restore();
    }
    if (frame.chip) {
        ctx.save();
        const size = Math.max(2, unit * 0.055);
        ctx.font = `700 ${size}px Georgia, serif`;
        const text = 'STAR';
        const width = ctx.measureText(text).width + size * 0.8;
        ctx.fillStyle = '#f4f0e8';
        ctx.fillRect(box.x + box.w * 0.1, box.y + box.h - size * 1.9, width, size * 1.45);
        ctx.fillStyle = '#1a1a20';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, box.x + box.w * 0.1 + size * 0.4, box.y + box.h - size * 1.15);
        ctx.restore();
    }
    if (frame.corners) {
        const area = { x: box.x + box.w * 0.035, y: box.y + box.h * 0.035, w: box.w * 0.93, h: box.h * 0.93 };
        const lenX = area.w * 0.22;
        const lenY = area.h * 0.22;
        const thick = Math.max(1, unit * 0.024);
        ctx.save();
        ctx.strokeStyle = '#fffdfa';
        ctx.lineWidth = thick;
        ctx.lineCap = 'butt';
        ctx.shadowColor = 'rgba(20,16,28,0.55)';
        ctx.shadowBlur = Math.max(1, unit * 0.02);
        const spots = [
            [area.x, area.y, 1, 1],
            [area.x + area.w, area.y, -1, 1],
            [area.x, area.y + area.h, 1, -1],
            [area.x + area.w, area.y + area.h, -1, -1],
        ];
        for (const [cx, cy, sx, sy] of spots) {
            ctx.beginPath();
            ctx.moveTo(cx, cy + sy * lenY);
            ctx.lineTo(cx, cy);
            ctx.lineTo(cx + sx * lenX, cy);
            ctx.stroke();
        }
        ctx.restore();
    }
}

function ellipsePath(box) {
    const path = new Path2D();
    path.ellipse(box.x + box.w / 2, box.y + box.h / 2, box.w / 2, box.h / 2, 0, 0, Math.PI * 2);
    return path;
}

function frameOuterPath(frame, box) {
    if (frame.points) return pointsPath(frame.points, box);
    const unit = Math.min(box.w, box.h);
    switch (frame.id) {
        case 'circle': return ellipsePath(box);
        case 'arch': return archPath(box);
        case 'rect': return roundRectPath(box, unit * 0.07);
        case 'polaroid': return roundRectPath(box, unit * 0.03);
        case 'film': return roundRectPath(box, unit * 0.02);
        default: return roundRectPath(box, unit * 0.02);
    }
}

function frameInnerPath(frame, inner) {
    if (frame.points && !frame.roundInner) return pointsPath(frame.points, inner);
    if (frame.roundInner || frame.id === 'circle') return ellipsePath(inner);
    if (frame.id === 'arch') return archPath(inner);
    // Rectangular frames also need an inner clip: cover-cropped photos must
    // stay inside the opening instead of painting over the film/paper border.
    return roundRectPath(inner, Math.min(inner.w, inner.h) * 0.03);
}

function drawAvatarFrame(ctx, config, box, frame, image, shot) {
    const unit = Math.min(box.w, box.h);
    const outer = frameOuterPath(frame, box);
    const inner = {
        x: box.x + box.w * frame.pad[3],
        y: box.y + box.h * frame.pad[0],
        w: box.w * (1 - frame.pad[1] - frame.pad[3]),
        h: box.h * (1 - frame.pad[0] - frame.pad[2]),
    };
    if (frame.paper !== 'transparent') {
        ctx.save();
        ctx.shadowColor = 'rgba(38,30,48,0.24)';
        ctx.shadowBlur = Math.max(1, unit * 0.07);
        ctx.shadowOffsetY = Math.max(0.6, unit * 0.03);
        ctx.fillStyle = frame.paper;
        ctx.fill(outer);
        ctx.restore();
    }
    const innerPath = frameInnerPath(frame, inner);
    ctx.save();
    ctx.clip(outer);
    if (innerPath) ctx.clip(innerPath);
    const outline = frame.points && !frame.roundInner
        ? frame.points
        : ((frame.roundInner || frame.id === 'circle') ? ELLIPSE_OUTLINE : RECT_OUTLINE);
    drawRotatedCover(ctx, image, inner, shot, outline);
    ctx.restore();
    drawAvatarFrameDeco(ctx, frame, box, inner, config);
}

function drawAvatarShape(ctx, config, box, shapeId, image, shot) {
    const path = avatarShapePath(shapeId, box);
    ctx.save();
    ctx.clip(path);
    drawRotatedCover(ctx, image, box, shot, shapeOutline(shapeId));
    ctx.restore();
}

function drawNativeAvatar(ctx, config, image) {
    if (!image || avatarIsHidden(config)) return;
    const size = avatarVisualSize(config);
    if (!(size.width > 0 && size.height > 0)) return;
    const cx = config.canvas.width * num(config.canvas.anchorX, 0.5);
    const cy = config.canvas.height * num(config.canvas.anchorY, 0.5);
    const box = { x: cx - size.width / 2, y: cy - size.height / 2, w: size.width, h: size.height };
    const shapeRotate = shapeRotateOf(config);
    const shot = {
        fit: 'cover',
        photoTone:config.avatar?.photoTone,
        opacity: 1,
        rotate: photoRotateRelative(config),
        cropZoom: num(config.avatar?.frame, 1),
        focusX: num(config.avatar?.focusX, 50),
        focusY: num(config.avatar?.focusY, 50),
    };
    const frame = frameGeometry(config.avatar?.frameStyle || 'none');
    const paint = () => {
        if (frame) drawAvatarFrame(ctx, config, box, frame, image, shot);
        else drawAvatarShape(ctx, config, box, config.avatar?.shape || 'circle', image, shot);
    };
    if (!shapeRotate) {
        paint();
        return;
    }
                                       
    const fit = avatarShapeFitScale(config);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((shapeRotate * Math.PI) / 180);
    ctx.scale(fit, fit);
    ctx.translate(-cx, -cy);
    paint();
    ctx.restore();
}

export async function renderCollage(config, options = {}) {
    const assetUrls = options.assetUrls instanceof Map ? options.assetUrls : new Map();
    const opts = { ...options, assetUrls };
    const { quality = 2, skipId = null, templateOnly = false, transparent = false, skipAvatar = false } = opts;
    const W = Math.max(1, num(config.canvas.width, 420));
    const H = Math.max(1, num(config.canvas.height, 285));

    const factor = clamp((quality * 1400) / Math.max(W, H), 1, 6);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(W * factor);
    canvas.height = Math.round(H * factor);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.scale(factor, factor);

    if (!transparent) {
        ctx.fillStyle = config.theme.paper || '#fdfbf7';
        ctx.fillRect(0, 0, W, H);
    }

    await preloadCollageAssets(config, opts);

    const elements = [...config.elements].sort((a, b) => (num(a.z, 0) - num(b.z, 0)));
    const back = elements.filter(element => element.layer !== 'front');
    const front = elements.filter(element => element.layer === 'front');
    const avatarImage = (!transparent && !skipAvatar) ? await loadImage(opts.avatarUrl || '') : null;
                                         
    const mainId = (!templateOnly && !transparent && !skipAvatar && avatarImage) ? mainPortrait(config)?.id : null;

    const paintConfig = { ...config, nickname: templateOnly ? '' : config.nickname, textFields: opts.fields || {} };

    const paint = async list => {
        for (const element of list) {
            if (isElementHidden(config, element)) continue;
            if (skipId && element.id === skipId) continue;
            if (mainId && element.id === mainId) continue;

            if (templateOnly && element.assetId === '__avatar__') continue;
            if (element.type === 'image') {

                const source = resolveAssetUrl(element, opts);
                if (!source) continue;
                const image = await loadImage(source);
                drawImageElement(ctx, element, image, paintConfig);
            } else if (element.type === 'text' || element.type === 'sticker') {
                drawTextElement(ctx, element, paintConfig);
            } else {
                drawDecoration(ctx, element, paintConfig);
            }
        }
    };

    await paint(back);
    if (!templateOnly && !transparent && !skipAvatar && avatarImage) drawNativeAvatar(ctx, config, avatarImage);
    await paint(front);

    return canvas;
}

export async function renderCollageBlob(config, options = {}) {
    const canvas = await renderCollage(config, options);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    return { blob, width: canvas.width, height: canvas.height };
}
