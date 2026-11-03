import {normalizeMetadata} from './template-meta.js';
import {normalizeTone} from './photo-tone.js';
import { V10_ASSETS } from './scenes-assets.js';
import { imageCrop } from './image-crop.js';
import { APP_VERSION, DEVELOPMENT } from './version.js';
import {onRuntimeAsset} from './assets/runtime.js';
import { V10_SKINS, V10_STYLES, buildV10Scene } from './scenes-v10.js';

export const CONFIG_VERSION = 9;
// 极繁模板需要保留完整图层；规范化、迁移和尺寸草稿统一使用同一上限。
export const MAX_ELEMENTS = 480;

export const AVATAR_PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#f3eef8"/><stop offset="1" stop-color="#e3d9ef"/>
        </linearGradient></defs>
        <rect width="256" height="256" fill="url(#g)"/>
        <circle cx="128" cy="104" r="46" fill="#cdc2dc"/>
        <ellipse cx="128" cy="212" rx="70" ry="46" fill="#cdc2dc"/>
    </svg>`,
);

export function avatarUnits(canvas) {
    const scale = Number(canvas?.avatarScale) || 5;
    return (Number(canvas?.width) || 400) / scale;
}

export function avatarVisualUnits(config) {
    const zoom = Number(config?.avatar?.zoom) || 1;
    return avatarUnits(config?.canvas) * zoom;
}

export const AVATAR_BOX = { min: 0.35, max: 3 };

export function clampAvatarBox(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 1;
    // 保存设计稿的细小比例；界面仍按百分比调整，渲染不必提前四舍五入到整数百分比。
    return Math.round(Math.min(AVATAR_BOX.max, Math.max(AVATAR_BOX.min, number)) * 10000) / 10000;
}

export const AVATAR_ROTATE = { step: 90, fine: 15, snap: 15 };

export function clampRotate(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return ((Math.round(number) % 360) + 360) % 360;
}

export const ELLIPSE_OUTLINE = Array.from({ length: 48 }, (_, index) => {
    const angle = (index / 48) * Math.PI * 2;
    return [0.5 + Math.cos(angle) * 0.5, 0.5 + Math.sin(angle) * 0.5];
});

export const RECT_OUTLINE = [[0, 0], [1, 0], [1, 1], [0, 1]];

                              
export function shapeOutline(shapeId) {
    const shape = SHAPE_MAP.get(shapeId);
    if (shape?.points) return shape.points;
    if (shape?.id === 'circle' || shapeId === 'circle') return ELLIPSE_OUTLINE;
    return RECT_OUTLINE;
}

export function rotateCoverScale(rotate, width, height) {
    const rad = (clampRotate(rotate) * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    if (sin < 0.001) return 1;
    const w = Math.max(0.0001, Number(width) || 0.0001);
    const h = Math.max(0.0001, Number(height) || 0.0001);
    return Math.max((w * cos + h * sin) / w, (w * sin + h * cos) / h);
}

    
                                    
                                        
   
export function rotateCoverScalePoints(rotate, width, height, points) {
    const rad = (clampRotate(rotate) * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    if (Math.abs(sin) < 0.0005) return 1;
    const w = Math.max(0.0001, Number(width) || 0.0001);
    const h = Math.max(0.0001, Number(height) || 0.0001);
    const list = points && points.length ? points : RECT_OUTLINE;
    let scale = 1;
    for (const point of list) {
        const dx = (point[0] - 0.5) * w;
        const dy = (point[1] - 0.5) * h;
        const rx = dx * cos + dy * sin;
        const ry = -dx * sin + dy * cos;
        const need = Math.max((Math.abs(rx) * 2) / w, (Math.abs(ry) * 2) / h);
        if (need > scale) scale = need;
    }
    return Math.min(4, Math.round(scale * 10000) / 10000);
}

export function avatarRotateScale(rotate, widthRatio, heightRatio) {
    return rotateCoverScale(rotate, clampAvatarBox(widthRatio), clampAvatarBox(heightRatio));
}

    
                        
                                  
   
export function shapeRotateOf(config) {
    const raw = config?.avatar?.shapeRotate;
    if (raw === null || raw === undefined || raw === '') return clampRotate(config?.avatar?.rotate);
    const number = Number(raw);
    if (!Number.isFinite(number)) return clampRotate(config?.avatar?.rotate);
    return clampRotate(number);
}

export function shapeFollowsPhoto(config) {
    const raw = config?.avatar?.shapeRotate;
    return raw === null || raw === undefined || raw === '';
}

export function clampShapeRotate(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return ((Math.round(number) % 360) + 360) % 360;
}

                                            
export function photoRotateRelative(config) {
    return clampRotate(clampRotate(config?.avatar?.rotate) - shapeRotateOf(config));
}

                       
export function avatarShapeOutlineFor(config) {
    const frame = frameGeometry(config?.avatar?.frameStyle || 'none');
    if (!frame) return shapeOutline(config?.avatar?.shape || 'circle');
    if (frame.points && !frame.roundInner) return frame.points;
    if (frame.roundInner || frame.id === 'circle') return ELLIPSE_OUTLINE;
    return RECT_OUTLINE;
}

    
                        
                                           
   
export function shapeRotateFit(rotate, width, height, points) {
    const angle = clampRotate(rotate);
    if (!angle) return 1;
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const w = Math.max(0.0001, Number(width) || 0.0001);
    const h = Math.max(0.0001, Number(height) || 0.0001);
    const list = points && points.length ? points : RECT_OUTLINE;
    let maxX = 0;
    let maxY = 0;
    for (const point of list) {
        const dx = (point[0] - 0.5) * w;
        const dy = (point[1] - 0.5) * h;
        const rx = dx * cos + dy * sin;
        const ry = -dx * sin + dy * cos;
        if (Math.abs(rx) > maxX) maxX = Math.abs(rx);
        if (Math.abs(ry) > maxY) maxY = Math.abs(ry);
    }
    if (maxX < 0.0001 || maxY < 0.0001) return 1;
    return Math.min(1, Math.min((w / 2) / maxX, (h / 2) / maxY));
}

export function avatarShapeFitScale(config) {
    if (!shapeRotateOf(config)) return 1;
    return shapeRotateFit(
        shapeRotateOf(config),
        clampAvatarBox(config?.avatar?.widthRatio),
        clampAvatarBox(config?.avatar?.heightRatio),
        avatarShapeOutlineFor(config),
    );
}

export function avatarVisualSize(config) {
    const units = avatarVisualUnits(config);
    return {
        width: units * clampAvatarBox(config?.avatar?.widthRatio),
        height: units * clampAvatarBox(config?.avatar?.heightRatio),
    };
}

const HEART_POINTS = [[0.5, 0.254], [0.501, 0.247], [0.504, 0.226], [0.514, 0.195], [0.532, 0.156], [0.559, 0.116], [0.595, 0.079], [0.641, 0.05], [0.693, 0.033], [0.749, 0.03], [0.805, 0.043], [0.858, 0.071], [0.904, 0.112], [0.94, 0.164], [0.962, 0.223], [0.97, 0.287], [0.962, 0.352], [0.94, 0.416], [0.904, 0.479], [0.858, 0.539], [0.805, 0.596], [0.749, 0.651], [0.693, 0.704], [0.641, 0.755], [0.595, 0.803], [0.559, 0.848], [0.532, 0.889], [0.514, 0.923], [0.504, 0.948], [0.501, 0.965], [0.5, 0.97], [0.499, 0.965], [0.496, 0.948], [0.486, 0.923], [0.468, 0.889], [0.441, 0.848], [0.405, 0.803], [0.359, 0.755], [0.307, 0.704], [0.251, 0.651], [0.195, 0.596], [0.142, 0.539], [0.096, 0.479], [0.06, 0.416], [0.038, 0.352], [0.03, 0.287], [0.038, 0.223], [0.06, 0.164], [0.096, 0.112], [0.142, 0.071], [0.195, 0.043], [0.251, 0.03], [0.307, 0.033], [0.359, 0.05], [0.405, 0.079], [0.441, 0.116], [0.468, 0.156], [0.486, 0.195], [0.496, 0.226], [0.499, 0.247]];
const STAR_POINTS = [[0.5, 0.02], [0.618, 0.337], [0.957, 0.352], [0.692, 0.562], [0.782, 0.888], [0.5, 0.702], [0.218, 0.888], [0.308, 0.562], [0.043, 0.352], [0.382, 0.337]];
const HEXAGON_POINTS = [[0.5, 0.02], [0.916, 0.26], [0.916, 0.74], [0.5, 0.98], [0.084, 0.74], [0.084, 0.26]];
const DIAMOND_POINTS = [[0.5, 0.02], [0.98, 0.5], [0.5, 0.98], [0.02, 0.5]];
const FLOWER_POINTS = [[0.98, 0.5], [0.962, 0.545], [0.917, 0.583], [0.869, 0.612], [0.841, 0.641], [0.84, 0.682], [0.853, 0.736], [0.859, 0.794], [0.839, 0.839], [0.794, 0.859], [0.736, 0.853], [0.682, 0.84], [0.641, 0.841], [0.612, 0.869], [0.583, 0.917], [0.545, 0.962], [0.5, 0.98], [0.455, 0.962], [0.417, 0.917], [0.388, 0.869], [0.359, 0.841], [0.318, 0.84], [0.264, 0.853], [0.206, 0.859], [0.161, 0.839], [0.141, 0.794], [0.147, 0.736], [0.16, 0.682], [0.159, 0.641], [0.131, 0.612], [0.083, 0.583], [0.038, 0.545], [0.02, 0.5], [0.038, 0.455], [0.083, 0.417], [0.131, 0.388], [0.159, 0.359], [0.16, 0.318], [0.147, 0.264], [0.141, 0.206], [0.161, 0.161], [0.206, 0.141], [0.264, 0.147], [0.318, 0.16], [0.359, 0.159], [0.388, 0.131], [0.417, 0.083], [0.455, 0.038], [0.5, 0.02], [0.545, 0.038], [0.583, 0.083], [0.612, 0.131], [0.641, 0.159], [0.682, 0.16], [0.736, 0.147], [0.794, 0.141], [0.839, 0.161], [0.859, 0.206], [0.853, 0.264], [0.84, 0.318], [0.841, 0.359], [0.869, 0.388], [0.917, 0.417], [0.962, 0.455]];
const SCALLOP_POINTS = [[0.98, 0.5], [0.976, 0.519], [0.965, 0.537], [0.953, 0.554], [0.946, 0.571], [0.947, 0.589], [0.953, 0.609], [0.958, 0.629], [0.957, 0.648], [0.946, 0.665], [0.931, 0.678], [0.914, 0.691], [0.903, 0.705], [0.898, 0.723], [0.897, 0.743], [0.896, 0.764], [0.888, 0.782], [0.874, 0.795], [0.854, 0.803], [0.835, 0.81], [0.82, 0.82], [0.81, 0.835], [0.803, 0.854], [0.795, 0.874], [0.782, 0.888], [0.764, 0.896], [0.743, 0.897], [0.723, 0.898], [0.705, 0.903], [0.691, 0.914], [0.678, 0.931], [0.665, 0.946], [0.648, 0.957], [0.629, 0.958], [0.609, 0.953], [0.589, 0.947], [0.571, 0.946], [0.554, 0.953], [0.537, 0.965], [0.519, 0.976], [0.5, 0.98], [0.481, 0.976], [0.463, 0.965], [0.446, 0.953], [0.429, 0.946], [0.411, 0.947], [0.391, 0.953], [0.371, 0.958], [0.352, 0.957], [0.335, 0.946], [0.322, 0.931], [0.309, 0.914], [0.295, 0.903], [0.277, 0.898], [0.257, 0.897], [0.236, 0.896], [0.218, 0.888], [0.205, 0.874], [0.197, 0.854], [0.19, 0.835], [0.18, 0.82], [0.165, 0.81], [0.146, 0.803], [0.126, 0.795], [0.112, 0.782], [0.104, 0.764], [0.103, 0.743], [0.102, 0.723], [0.097, 0.705], [0.086, 0.691], [0.069, 0.678], [0.054, 0.665], [0.043, 0.648], [0.042, 0.629], [0.047, 0.609], [0.053, 0.589], [0.054, 0.571], [0.047, 0.554], [0.035, 0.537], [0.024, 0.519], [0.02, 0.5], [0.024, 0.481], [0.035, 0.463], [0.047, 0.446], [0.054, 0.429], [0.053, 0.411], [0.047, 0.391], [0.042, 0.371], [0.043, 0.352], [0.054, 0.335], [0.069, 0.322], [0.086, 0.309], [0.097, 0.295], [0.102, 0.277], [0.103, 0.257], [0.104, 0.236], [0.112, 0.218], [0.126, 0.205], [0.146, 0.197], [0.165, 0.19], [0.18, 0.18], [0.19, 0.165], [0.197, 0.146], [0.205, 0.126], [0.218, 0.112], [0.236, 0.104], [0.257, 0.103], [0.277, 0.102], [0.295, 0.097], [0.309, 0.086], [0.322, 0.069], [0.335, 0.054], [0.352, 0.043], [0.371, 0.042], [0.391, 0.047], [0.411, 0.053], [0.429, 0.054], [0.446, 0.047], [0.463, 0.035], [0.481, 0.024], [0.5, 0.02], [0.519, 0.024], [0.537, 0.035], [0.554, 0.047], [0.571, 0.054], [0.589, 0.053], [0.609, 0.047], [0.629, 0.042], [0.648, 0.043], [0.665, 0.054], [0.678, 0.069], [0.691, 0.086], [0.705, 0.097], [0.723, 0.102], [0.743, 0.103], [0.764, 0.104], [0.782, 0.112], [0.795, 0.126], [0.803, 0.146], [0.81, 0.165], [0.82, 0.18], [0.835, 0.19], [0.854, 0.197], [0.874, 0.205], [0.888, 0.218], [0.896, 0.236], [0.897, 0.257], [0.898, 0.277], [0.903, 0.295], [0.914, 0.309], [0.931, 0.322], [0.946, 0.335], [0.957, 0.352], [0.958, 0.371], [0.953, 0.391], [0.947, 0.411], [0.946, 0.429], [0.953, 0.446], [0.965, 0.463], [0.976, 0.481]];
const TICKET_POINTS = [[0.02, 0.02], [0.98, 0.02], [0.98, 0.43], [0.969, 0.431], [0.958, 0.433], [0.948, 0.438], [0.939, 0.443], [0.931, 0.451], [0.923, 0.459], [0.918, 0.468], [0.913, 0.478], [0.911, 0.489], [0.91, 0.5], [0.911, 0.511], [0.913, 0.522], [0.918, 0.532], [0.923, 0.541], [0.931, 0.549], [0.939, 0.557], [0.948, 0.562], [0.958, 0.567], [0.969, 0.569], [0.98, 0.57], [0.98, 0.98], [0.02, 0.98], [0.02, 0.57], [0.031, 0.569], [0.042, 0.567], [0.052, 0.562], [0.061, 0.557], [0.069, 0.549], [0.077, 0.541], [0.082, 0.532], [0.087, 0.522], [0.089, 0.511], [0.09, 0.5], [0.089, 0.489], [0.087, 0.478], [0.082, 0.468], [0.077, 0.459], [0.069, 0.451], [0.061, 0.443], [0.052, 0.438], [0.042, 0.433], [0.031, 0.431], [0.02, 0.43]];
const TORN_POINTS = [[0.02, 0.02], [0.089, 0.023], [0.157, 0.015], [0.226, 0.015], [0.294, 0.018], [0.363, 0.02], [0.431, 0.015], [0.5, 0.037], [0.569, 0.024], [0.637, 0.016], [0.706, 0.015], [0.774, 0.032], [0.843, 0.027], [0.911, 0.015], [0.98, 0.02], [0.968, 0.02], [0.985, 0.089], [0.965, 0.157], [0.983, 0.226], [0.979, 0.294], [0.966, 0.363], [0.96, 0.431], [0.985, 0.5], [0.985, 0.569], [0.963, 0.637], [0.978, 0.706], [0.985, 0.774], [0.966, 0.843], [0.976, 0.911], [0.982, 0.98], [0.98, 0.985], [0.911, 0.97], [0.843, 0.965], [0.774, 0.985], [0.706, 0.978], [0.637, 0.968], [0.569, 0.982], [0.5, 0.973], [0.431, 0.965], [0.363, 0.985], [0.294, 0.973], [0.226, 0.973], [0.157, 0.962], [0.089, 0.985], [0.02, 0.969], [0.037, 0.98], [0.019, 0.911], [0.015, 0.843], [0.025, 0.774], [0.016, 0.706], [0.031, 0.637], [0.027, 0.569], [0.015, 0.5], [0.015, 0.431], [0.018, 0.363], [0.015, 0.294], [0.015, 0.226], [0.016, 0.157], [0.028, 0.089], [0.026, 0.02]];
const BLOB_POINTS = [[1.019, 0.5], [1.022, 0.546], [1.015, 0.591], [0.997, 0.633], [0.969, 0.671], [0.935, 0.703], [0.897, 0.729], [0.858, 0.751], [0.82, 0.769], [0.786, 0.786], [0.756, 0.805], [0.728, 0.826], [0.702, 0.85], [0.676, 0.876], [0.647, 0.904], [0.615, 0.93], [0.58, 0.952], [0.541, 0.969], [0.5, 0.979], [0.458, 0.982], [0.416, 0.978], [0.374, 0.968], [0.335, 0.955], [0.296, 0.938], [0.258, 0.918], [0.222, 0.897], [0.187, 0.873], [0.155, 0.845], [0.126, 0.814], [0.101, 0.779], [0.084, 0.74], [0.073, 0.699], [0.07, 0.657], [0.073, 0.615], [0.08, 0.574], [0.09, 0.536], [0.099, 0.5], [0.106, 0.466], [0.109, 0.431], [0.108, 0.395], [0.105, 0.356], [0.101, 0.314], [0.1, 0.269], [0.104, 0.223], [0.116, 0.178], [0.136, 0.136], [0.164, 0.1], [0.2, 0.072], [0.242, 0.053], [0.287, 0.043], [0.332, 0.039], [0.377, 0.041], [0.42, 0.046], [0.461, 0.052], [0.5, 0.059], [0.538, 0.065], [0.575, 0.072], [0.613, 0.08], [0.649, 0.09], [0.685, 0.104], [0.718, 0.122], [0.75, 0.143], [0.779, 0.168], [0.805, 0.195], [0.83, 0.223], [0.855, 0.251], [0.88, 0.28], [0.907, 0.31], [0.934, 0.342], [0.961, 0.376], [0.986, 0.414], [1.006, 0.456]];

export const AVATAR_SHAPES = [
    { id: 'circle', name: '圆形', radius: '50%' },
    { id: 'rounded', name: '圆角', radius: '22%' },
    { id: 'square', name: '方角', radius: '5%' },
    { id: 'arch', name: '拱门', radius: '50% 50% 7% 7% / 46% 46% 7% 7%' },
    { id: 'heart', name: '爱心', points: HEART_POINTS },
    { id: 'star', name: '星形', points: STAR_POINTS },
    { id: 'hexagon', name: '六角', points: HEXAGON_POINTS },
    { id: 'diamond', name: '菱形', points: DIAMOND_POINTS },
    { id: 'blob', name: '云朵', points: BLOB_POINTS },
    { id: 'flower', name: '花边', points: FLOWER_POINTS },
];

const SHAPE_MAP = new Map(AVATAR_SHAPES.map(shape => [shape.id, shape]));

export function polygonClip(points) {
    return `polygon(${points.map(([x, y]) => `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`).join(',')})`;
}

                                                                    
const PHOTO_SHAPES = {
    circle: { kind: 'ellipse', rx: 0.5, ry: 0.5 },
    oval: { kind: 'ellipse', rx: 0.5, ry: 0.4 },
    lace: { kind: 'ellipse', rx: 0.46, ry: 0.46 },
    heart: {
        kind: 'poly',
        points: [[0.5, 0.92], [0.42, 0.86], [0.3, 0.76], [0.2, 0.66], [0.12, 0.55], [0.08, 0.44], [0.08, 0.34], [0.12, 0.25], [0.2, 0.2], [0.29, 0.2], [0.38, 0.25], [0.45, 0.33], [0.5, 0.41], [0.55, 0.33], [0.62, 0.25], [0.71, 0.2], [0.8, 0.2], [0.88, 0.25], [0.92, 0.34], [0.92, 0.44], [0.88, 0.55], [0.8, 0.66], [0.7, 0.76], [0.58, 0.86]],
    },
    star: {
        kind: 'poly',
        points: [[0.5, 0.02], [0.61, 0.36], [0.97, 0.36], [0.68, 0.57], [0.79, 0.92], [0.5, 0.71], [0.21, 0.92], [0.32, 0.57], [0.03, 0.36], [0.39, 0.36]],
    },
    hexagon: {
        kind: 'poly',
        points: [[0.5, 0.02], [0.94, 0.26], [0.94, 0.74], [0.5, 0.98], [0.06, 0.74], [0.06, 0.26]],
    },
};

export function pointInPolygon(x, y, points) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i][0];
        const yi = points[i][1];
        const xj = points[j][0];
        const yj = points[j][1];
        const crosses = (yi > y) !== (yj > y);
        if (crosses && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
}

                                 
export function photoShapeHit(shapeId, nx, ny) {
    const shape = PHOTO_SHAPES[shapeId];
    if (!shape) return true;
    if (shape.kind === 'ellipse') {
        const dx = (nx - 0.5) / shape.rx;
        const dy = (ny - 0.5) / shape.ry;
        return dx * dx + dy * dy <= 1;
    }
    return pointInPolygon(nx, ny, shape.points);
}

export function shapeStyle(shapeId) {
    const shape = SHAPE_MAP.get(shapeId) || SHAPE_MAP.get('circle');
    return shape.points
        ? { clipPath: polygonClip(shape.points), borderRadius: '0px' }
        : { clipPath: 'none', borderRadius: shape.radius || '0px' };
}

export function shapeSampleStyle(shapeId) {
    const style = shapeStyle(shapeId);
    const parts = [];
    if (style.clipPath && style.clipPath !== 'none') parts.push(`clip-path:${style.clipPath}`);
    if (style.borderRadius && style.borderRadius !== '0px') parts.push(`border-radius:${style.borderRadius}`);
    return parts.join(';');
}

export const AVATAR_SHAPE_IDS = AVATAR_SHAPES.map(shape => shape.id);

export function mainPortrait(config) {
    const list = (config?.elements || []).filter(element => element.type === 'image' && element.assetId === '__avatar__');
    if (!list.length) return null;
    // 主头像身份与位置分离，移动原生头像不会把旧标记再次画成副图。
    const explicit = list.find(item => item.photoRole === 'main');
    if (explicit) return explicit;
    const named = list.find(item => item.photoRole !== 'secondary' && /^主头像/.test(item.label || ''));
    if (named) return named; // 兼容旧美化版已经挪动位置、尚无 photoRole 的保存稿。
    const width = Number(config?.canvas?.width) || 0;
    const height = Number(config?.canvas?.height) || 0;
    const ax = (Number(config?.canvas?.anchorX) || 0.5) * width;
    const ay = (Number(config?.canvas?.anchorY) || 0.5) * height;
    const tolerance = Math.max(width, height) * 0.06;
    const anchored = list.filter(item => item.photoRole !== 'secondary' && (
        Math.abs(item.x + item.width / 2 - ax) <= tolerance
        && Math.abs(item.y + item.height / 2 - ay) <= tolerance
    ));
    if (!anchored.length) return null;
    const pool = anchored;
    return pool.reduce((best, item) => (
        item.width * item.height > best.width * best.height ? item : best
    ), pool[0]);
}

/** 分组负责整体遮罩，成员自己的隐藏状态保持不变。 */
export function isElementHidden(config, element) {
    return Boolean(element?.hidden || (element?.groupId && config.groups?.some(group => group.id === element.groupId && group.hidden)));
}

export function avatarIsHidden(config) {
    return config?.avatar?.hidden === true || isElementHidden(config, mainPortrait(config));
}

export function hiddenPortraitId(config) {
    if (config?.avatar?.hidden !== true) return null;
    const id = String(config.avatar?.hiddenId || '');
    if (id) return config.elements?.some(element => element.id === id) ? id : null;
    return null;
}

export const AVATAR_ZOOM = { min: 0.6, max: 4.8, step: 0.05 };

export const AVATAR_FOCUS = { min: 0, max: 100, step: 1, default: 50 };

export const AVATAR_FRAME = { min: 1, max: 3, step: 0.05, default: 1 };

export const FRAMING_PRESETS = [
    { id: 'bust', name: '偏上半身', hint: '保留肩膀与胸口，最稳的默认构图', frame: 1, focusX: 50, focusY: 50 },
    { id: 'face', name: '脸部居中', hint: '放大到脸部，脸落在画面正中', frame: 1.5, focusX: 50, focusY: 44 },
    { id: 'close', name: '特写', hint: '只留眼睛到下巴，杂志内页那种', frame: 2.2, focusX: 50, focusY: 36 },
];

export const FRAMING_IDS = FRAMING_PRESETS.map(preset => preset.id);

export const SHAPE_TUNING = {
    circle: { zoom: 1, focusY: 0, frame: 1 },
    rounded: { zoom: 1, focusY: 0, frame: 1 },
    square: { zoom: 1, focusY: 0, frame: 1 },
    arch: { zoom: 1.03, focusY: 2, frame: 1.08 },
    blob: { zoom: 1.04, focusY: 3, frame: 1.08 },
    heart: { zoom: 1.07, focusY: 7, frame: 1.2 },
    star: { zoom: 1.12, focusY: 9, frame: 1.34 },
    hexagon: { zoom: 1.05, focusY: 5, frame: 1.14 },
    diamond: { zoom: 1.14, focusY: 7, frame: 1.36 },
    flower: { zoom: 1.08, focusY: 6, frame: 1.22 },
};

export function tuneAvatarForShape(avatar, shape) {
    const current = avatar || {};
    const from = SHAPE_TUNING[current.shape] || SHAPE_TUNING.circle;
    const to = SHAPE_TUNING[shape] || SHAPE_TUNING.circle;
    const rawZoom = Number(current.zoom);
    const rawFocusY = Number(current.focusY);
    const rawFrame = Number(current.frame);
    const zoom = (Number.isFinite(rawZoom) && rawZoom > 0 ? rawZoom : 1) / (from.zoom || 1) * (to.zoom || 1);
    const focusY = (Number.isFinite(rawFocusY) ? rawFocusY : AVATAR_FOCUS.default) - (from.focusY || 0) + (to.focusY || 0);
    const frame = (Number.isFinite(rawFrame) && rawFrame > 0 ? rawFrame : AVATAR_FRAME.default) / (from.frame || 1) * (to.frame || 1);
    return {
        ...current,
        shape: AVATAR_SHAPE_IDS.includes(shape) ? shape : 'circle',
        zoom: Math.min(AVATAR_ZOOM.max, Math.max(AVATAR_ZOOM.min, Math.round(zoom * 100) / 100)),
        focusY: clampFocus(focusY),
        frame: clampFrame(Math.round(frame * 1000) / 1000),
    };
}

export function characterFields(character) {
    const data = character?.data || {};
    const extensions = data.extensions || {};
    const pick = (...keys) => {
        for (const key of keys) {
            const value = data[key] ?? extensions[key] ?? character?.[key];
            if (typeof value === 'string' && value.trim()) return value.trim();
            if (typeof value === 'number' && Number.isFinite(value)) return String(value);
        }
        return '';
    };
    return {
        name: String(character?.name || '').trim(),
        birthday: pick('birthday', 'birth', 'birth_date', 'birthDate', 'bday'),
        title: pick('title', 'nickname', 'alias', 'epithet', 'tagline'),
    };
}

export function focusViewBox(frameValue, focusXValue, focusYValue) {
    const crop = imageCrop(100, 100, frameValue, clampFocus(focusXValue), clampFocus(focusYValue));
    const { x: left, y: top } = crop;
    const right = 100 - crop.w - left;
    const bottom = 100 - crop.h - top;
    // 百分比保留四位，减少宽图放大后 DOM 与画布的取景舍入差。
    const round = value => Math.round(value * 10000) / 10000;
    return `inset(${round(top)}% ${round(right)}% ${round(bottom)}% ${round(left)}%)`;
}

export function avatarViewBox(config) {
    return focusViewBox(config?.avatar?.frame, config?.avatar?.focusX, config?.avatar?.focusY);
}

export function photoViewBox(element) {
    return focusViewBox(element?.cropZoom, element?.focusX, element?.focusY);
}

export const ANCHOR_MODES = [
    { id: 'avatar', name: '跟随头像', hint: '以头像为圆心展开，头像始终在画面正中' },
    { id: 'chat', name: '画布居中', hint: '固定在聊天区中线展开，头像留在美化给它的位置' },
];

export const ANCHOR_MODE_IDS = ANCHOR_MODES.map(mode => mode.id);

export const AVATAR_UNITS = 40;
export const LOGICAL_WIDTH = 400;

export const CANVAS_PRESETS = {
    chip: { name: '标签条', width: 280, height: 110, anchorX: 0.5, anchorY: 0.5, avatarScale: 7.2, widthRatio: 0.50, hint: '一条细标签，贴在头像旁边' },
    compact: { name: '小卡', width: 200, height: 150, anchorX: 0.5, anchorY: 0.5, avatarScale: 7.0, widthRatio: 0.46, hint: '横向小卡片' },
    circle: { name: '圆形', width: 240, height: 240, anchorX: 0.5, anchorY: 0.5, avatarScale: 7.9, widthRatio: 0.52, hint: '正方形底 · 圆形应援光环' },
    polaroid: { name: '拍立得', width: 300, height: 245, anchorX: 0.5, anchorY: 0.5, avatarScale: 9.4, widthRatio: 0.62, hint: '拍立得相纸拼贴' },
    collage: { name: '拼贴', width: 420, height: 285, anchorX: 0.5, anchorY: 0.5, avatarScale: 11.3, widthRatio: 0.74, hint: '多图自由拼贴' },
    tower: { name: '竖幅', width: 300, height: 460, anchorX: 0.5, anchorY: 0.5, avatarScale: 8.4, widthRatio: 0.56, hint: '竖向长图 · 杂志封面' },
    banner: { name: '横幅', width: 560, height: 285, anchorX: 0.5, anchorY: 0.5, avatarScale: 13.0, widthRatio: 0.86, hint: '横向杂志版头' },
    scroll: { name: '长手幅', width: 820, height: 225, anchorX: 0.5, anchorY: 0.5, avatarScale: 14.2, widthRatio: 1.0, hint: '应援长手幅，一条拉到底' },
    poster: { name: '海报', width: 680, height: 390, anchorX: 0.5, anchorY: 0.5, avatarScale: 14.3, widthRatio: 0.94, hint: '大幅海报拼贴' },
};

export const CUSTOM_LAYOUT_ID = 'custom';
export const CANVAS_LIMITS = { minWidth: 100, maxWidth: 3000, minHeight: 90, maxHeight: 2400 };

export function matchPresetId(width, height) {
    const w = Math.round(Number(width));
    const h = Math.round(Number(height));
    const hit = Object.entries(CANVAS_PRESETS)
        .find(([, preset]) => preset.width === w && preset.height === h);
    return hit ? hit[0] : '';
}

export function presetWidthRatio(canvas) {
    const id = matchPresetId(canvas?.width, canvas?.height);
    return (id && CANVAS_PRESETS[id]?.widthRatio) || 1;
}

export const LAYOUTS = {
    ...Object.fromEntries(
        Object.entries(CANVAS_PRESETS).map(([id, preset]) => [id, { id, ...preset }]),
    ),
    [CUSTOM_LAYOUT_ID]: {
        id: CUSTOM_LAYOUT_ID,
        name: '自定义',
        width: 420,
        height: 285,
        anchorX: 0.5,
        anchorY: 0.5,
        avatarScale: 11.3,
        widthRatio: 1,
        hint: '自由输入宽高',
    },
};

export const TEMPLATE_LIST = [
    ...V10_STYLES.map(style => ({
        id: style.id,
        name: style.name,
        description: style.desc,
        layout: style.layout,
        avatarRatio: 0.3,
        avatarShape: style.avatarShape,
        colors: [style.theme.accent, style.theme.paper, style.theme.ink],
    })),
    { id: 'free', name: '自由拼贴', description: '空白画布 · 完全自行叠加', layout: 'compact', avatarRatio: 0.34, avatarShape: 'circle', colors: ['#b8c3d1', '#fcfcfb', '#5d6470'] },
];

export const FRAME_STYLES = [
    { id: 'none', name: '原图' },
    { id: 'rect', name: '白边', pad: 0.045, radius: '7%', paper: '#fffdfa', edge: true },
    { id: 'polaroid', name: '拍立得', pad: [0.05, 0.05, 0.2, 0.05], radius: '3%', paper: '#fffdfa' },
    { id: 'circle', name: '圆环', pad: 0.075, radius: '50%', paper: '#fffdfa', dots: true },
    { id: 'lace', name: '蕾丝', pad: 0.115, points: FLOWER_POINTS, paper: '#fffdfa', rings: true, roundInner: true },
    { id: 'star', name: '星星', pad: 0.11, points: STAR_POINTS, paper: '#fffdfa' },
    { id: 'heart', name: '爱心', pad: 0.105, points: HEART_POINTS, paper: '#fffdfa' },
    { id: 'hexagon', name: '六角', pad: 0.095, points: HEXAGON_POINTS, paper: '#fffdfa', edge: true },
    { id: 'arch', name: '拱门', pad: 0.07, radius: '50% 50% 6% 6% / 46% 46% 6% 6%', paper: '#fffdfa', edge: true },
    { id: 'film', name: '胶卷', pad: [0.115, 0.065, 0.115, 0.065], radius: '2%', paper: '#1a1a20', sprocket: true },
    { id: 'stamp', name: '邮票', pad: 0.09, points: SCALLOP_POINTS, paper: '#fffdfa', perf: true },
    { id: 'ticket', name: '票根', pad: [0.085, 0.085, 0.085, 0.115], points: TICKET_POINTS, paper: '#fffdfa' },
    { id: 'torn', name: '撕纸', pad: 0.075, points: TORN_POINTS, paper: '#fffdfa' },
    { id: 'corner', name: '角标', pad: 0, paper: 'transparent', corners: true },
    { id: 'magazine', name: '杂志', pad: 0.07, radius: '0%', paper: '#1a1a20', chip: true },
];

export const FRAME_LEGACY = {
    white: 'rect',
    oval: 'circle',
    scallop: 'lace',
    double: 'rect',
    postcard: 'polaroid',
    wave: 'torn',
    blob: 'circle',
};

const FRAME_MAP = new Map(FRAME_STYLES.map(frame => [frame.id, frame]));

export function avatarShapeVars(node, shapeId) {
    if (!node) return;
    const style = shapeStyle(shapeId);
    node.style.setProperty('--star-avatar-clip-shape', style.clipPath);
    node.style.setProperty('--star-avatar-radius', style.borderRadius);
}

export function avatarFrameVars(node, frameId) {
    if (!node) return null;
    const geometry = frameGeometry(frameId);
    if (!geometry) {
        delete node.dataset.frame;
        delete node.dataset.poly;
        for (const name of ['--star-frame-pad', '--star-frame-radius', '--star-frame-clip', '--star-frame-inner-radius', '--star-frame-paper']) {
            node.style.removeProperty(name);
        }
        return null;
    }
    node.dataset.frame = geometry.id;
    node.dataset.poly = geometry.points && !geometry.roundInner ? '1' : '0';
    node.style.setProperty('--star-frame-pad', geometry.padding);
    node.style.setProperty('--star-frame-radius', geometry.borderRadius);
    node.style.setProperty('--star-frame-clip', geometry.clipPath);
    node.style.setProperty('--star-frame-inner-radius', geometry.innerRadius);
    node.style.setProperty('--star-frame-paper', geometry.paper);
    return geometry;
}

export function avatarRotateScaleFor(config) {
    const rotate = photoRotateRelative(config);
    const width = clampAvatarBox(config?.avatar?.widthRatio);
    const height = clampAvatarBox(config?.avatar?.heightRatio);
    const frame = frameGeometry(config?.avatar?.frameStyle || 'none');
    if (!frame) return rotateCoverScalePoints(rotate, width, height, shapeOutline(config?.avatar?.shape || 'circle'));
    const innerWidth = Math.max(0.0001, width * (1 - frame.pad[1] - frame.pad[3]));
    const innerHeight = Math.max(0.0001, height * (1 - frame.pad[0] - frame.pad[2]));
    if (frame.points && !frame.roundInner) {
        return rotateCoverScalePoints(rotate, innerWidth, innerHeight, frame.points);
    }
    if (frame.roundInner || frame.id === 'circle') {
        return rotateCoverScalePoints(rotate, innerWidth, innerHeight, ELLIPSE_OUTLINE);
    }
    return rotateCoverScalePoints(rotate, innerWidth, innerHeight, RECT_OUTLINE);
}

export function avatarImageStyle(node, config) {
    if (!node) return;
    node.style.rotate = `${photoRotateRelative(config)}deg`;
    node.style.setProperty('--star-avatar-rotate-scale', avatarRotateScaleFor(config).toFixed(4));
}

                               
export function avatarShapeStyle(node, config) {
    if (!node) return;
    node.style.setProperty('--star-avatar-shape-rotate', `${shapeRotateOf(config)}deg`);
    node.style.setProperty('--star-avatar-shape-fit', avatarShapeFitScale(config).toFixed(4));
}

export function frameGeometry(frameId) {
    const id = FRAME_LEGACY[frameId] || frameId;
    const frame = FRAME_MAP.get(id);
    if (!frame || id === 'none') return null;
    const pad = Array.isArray(frame.pad) ? frame.pad : [frame.pad, frame.pad, frame.pad, frame.pad];
    const clipPath = frame.points ? polygonClip(frame.points) : 'none';
    const borderRadius = frame.points ? '0px' : (frame.radius || '0px');
    return {
        id,
        name: frame.name,
        pad,
        padding: `${(pad[0] * 100).toFixed(2)}% ${(pad[1] * 100).toFixed(2)}% ${(pad[2] * 100).toFixed(2)}% ${(pad[3] * 100).toFixed(2)}%`,
        clipPath,
        borderRadius,
        innerRadius: frame.points ? '3%' : (frame.radius === '50%' ? '50%' : (id === 'arch' ? '50% 50% 6% 6% / 46% 46% 6% 6%' : '3%')),
        paper: frame.paper || '#fffdfa',
        points: frame.points || null,
        edge: frame.edge === true,
        dots: frame.dots === true,
        rings: frame.rings === true,
        sprocket: frame.sprocket === true,
        perf: frame.perf === true,
        corners: frame.corners === true,
        roundInner: frame.roundInner === true,
        chip: frame.chip === true,
    };
}

export const FRAME_IDS = FRAME_STYLES.map(style => style.id);

export const STICKER_GROUPS = [
    { id: 'mark', name: '常用标记', items: ['★', '☆', '♡', '♥', '✓', '✕', '●', '○', '◆', '◇', '■', '□'] },
    { id: 'corner', name: '角标装饰', items: ['✦', '✧', '❀', '✿', '＊', '°', '·', '∴', '∞', '※', '‡', '†'] },
    { id: 'arrow', name: '箭头线条', items: ['→', '←', '↑', '↓', '⇒', '⇄', '—', '～', '…', '∶', '⁄', '∣'] },
    { id: 'num', name: '数字', items: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] },
    { id: 'date', name: '日期', items: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'] },
    { id: 'week', name: '星期', items: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN', '月', '火', '水', '木', '金', '土', '日'] },
    { id: 'text', name: '短词', items: ['NOTE', 'MEMO', 'DIARY', 'DAY', 'LOVE', 'OK', 'NEW', 'Hi', 'TODO', 'END'] },
    { id: 'emoji', name: '小图标', items: ['🌸', '🎀', '☕', '✉', '📎', '🔖', '☁', '🌙', '⭐', '🦋', '✏️', '📷'] },
];

export const STICKERS = STICKER_GROUPS.flatMap(group => group.items.map(glyph => ({ glyph, group: group.name })));

export const FONT_OPTIONS = [
    { value: "'Arial Rounded MT Bold', 'Trebuchet MS', sans-serif", name: '圆润英文' },
    { value: "'Courier New', monospace", name: '打字机' },
    { value: "Georgia, 'Times New Roman', serif", name: '杂志衬线' },
    { value: "'Microsoft YaHei', 'PingFang SC', 'Noto Sans SC', sans-serif", name: '清晰中文' },
    { value: "'Comic Sans MS', 'Segoe Print', cursive", name: '手写感' },
    { value: "'Segoe UI', system-ui, sans-serif", name: '系统黑体' },
    { value: "'Palatino Linotype', Palatino, serif", name: '优雅衬线' },
    { value: "'Lucida Handwriting', 'Segoe Script', cursive", name: '花体手写' },
    { value: "'Franklin Gothic Medium', 'Arial Narrow', sans-serif", name: '窄体标题' },
    { value: "'Trebuchet MS', 'Century Gothic', sans-serif", name: '海报无衬线' },
    { value: "Impact, Haettenschweiler, sans-serif", name: '粗黑标题' },
    { value: "'Brush Script MT', 'Segoe Script', cursive", name: '笔刷英文' },
];

const SANS = FONT_OPTIONS[0].value;
const MONO = FONT_OPTIONS[1].value;
const SERIF = FONT_OPTIONS[2].value;
const HAND = FONT_OPTIONS[4].value;

const THEMES = Object.fromEntries(V10_STYLES.map(style => [style.id, style.theme]));
THEMES.free = { paper: '#fcfcfb', accent: '#b8c3d1', ink: '#5d6470', soft: '#edf0f4', secondary: '#d6dce4' };

function svg(source) {

    const compact = source
        .replace(/<svg\s/, "<svg preserveAspectRatio='none' ")
        .replace(/\s{2,}/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
    return `data:image/svg+xml,${encodeURIComponent(compact)}`;
}

const HEAD = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>";

function gradient(id, from, to, name) {
    return {
        id, name, group: '纸张',
        url: svg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='120' height='120' fill='url(#g)'/></svg>`),
    };
}

export const BUILTIN_ASSETS = [

    {
        id: 'builtin:paper', name: '白纸卡', group: '纸张',
        url: svg(`${HEAD}<rect x='3' y='3' width='114' height='114' rx='4' fill='#fdfcf9' stroke='#ece6db'/><rect x='11' y='11' width='98' height='98' fill='none' stroke='#f4efe6' stroke-dasharray='4 7'/></svg>`),
    },
    {
        id: 'builtin:grid', name: '网格纸', group: '纸张',
        url: svg(`${HEAD}<rect width='120' height='120' fill='#fbfaf6'/><path d='M0 12H120M0 24H120M0 36H120M0 48H120M0 60H120M0 72H120M0 84H120M0 96H120M0 108H120M12 0V120M24 0V120M36 0V120M48 0V120M60 0V120M72 0V120M84 0V120M96 0V120M108 0V120' stroke='#e5dfd2' stroke-width='0.8'/></svg>`),
    },
    {
        id: 'builtin:lined', name: '横线纸', group: '纸张',
        url: svg(`${HEAD}<rect width='120' height='120' fill='#fdfbf6'/><path d='M0 16H120M0 32H120M0 48H120M0 64H120M0 80H120M0 96H120M0 112H120' stroke='#dcd5c6' stroke-width='1'/><path d='M16 0V120' stroke='#e3b6bd' stroke-width='1.4'/></svg>`),
    },
    {
        id: 'builtin:note', name: '便签', group: '纸张',
        url: svg(`${HEAD}<path d='M6 8h108v104H6z' fill='#fff6c9'/><path d='M6 8h108v16H6z' fill='#f4e39a'/><path d='M18 40h84M18 56h84M18 72h60' stroke='#d9c98a' stroke-width='1.4'/></svg>`),
    },
    {
        id: 'builtin:polaroid', name: '拍立得纸', group: '纸张',
        url: svg(`${HEAD}<rect x='8' y='4' width='104' height='112' rx='2' fill='#ffffff' stroke='#eae6df'/><rect x='16' y='12' width='88' height='76' fill='#f0eeea'/><path d='M34 84h52' stroke='#e2ded6' stroke-width='1.6'/></svg>`),
    },
    {
        id: 'builtin:torn-white', name: '撕纸边', group: '纸张',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 160'><path d='M0.0 9.86L9.09 16.41L18.18 8.69L27.27 16.18L36.36 9.72L45.45 16.48L54.55 10.52L63.64 16.29L72.73 9.42L81.82 16.99L90.91 10.74L100.0 15.78L109.09 10.75L118.18 17.03L127.27 9.26L136.36 15.13L145.45 8.54L154.55 17.41L163.64 9.36L172.73 16.55L181.82 10.59L190.91 15.06L200.0 9.67L200 147L200.0 144.83L190.91 149.5L181.82 144.38L172.73 149.1L163.64 143.83L154.55 150.12L145.45 142.89L136.36 150.31L127.27 143.39L118.18 150.26L109.09 143.34L100.0 150.16L90.91 144.29L81.82 151.49L72.73 142.51L63.64 151.1L54.55 143.22L45.45 149.81L36.36 144.41L27.27 149.74L18.18 144.8L9.09 150.92L0.0 143.98Z' fill='#fffdf8'/><path d='M0 22L200 18' stroke='#f2ebe1' stroke-width='1.2'/><path d='M0 140L200 144' stroke='#f2ebe1' stroke-width='1'/><g fill='#ffffff' opacity='0.5'><rect x='14' y='34' width='172' height='1.2'/><rect x='14' y='124' width='172' height='1.2'/></g></svg>"),
    },
    gradient('builtin:grad-blue', '#dbe8f6', '#8fb0d2', '雾蓝渐变'),
    gradient('builtin:grad-pink', '#ffe1ea', '#e5a3b8', '樱粉渐变'),
    gradient('builtin:grad-cream', '#fdf2e0', '#d3b68c', '奶油渐变'),
    gradient('builtin:grad-silver', '#f0f0ef', '#a6a9b0', '灰银渐变'),
    gradient('builtin:grad-mocha', '#f2e2ca', '#a97f57', '奶咖渐变'),
    gradient('builtin:grad-mint', '#e3f0e6', '#9dbfa8', '薄荷渐变'),
    {
        id: 'builtin:denim', name: '牛仔布', group: '纸张',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><defs><pattern id='d' width='7' height='7' patternUnits='userSpaceOnUse'><path d='M0 0L7 7M7 0L0 7' stroke='#5c7593' stroke-width='1.1' opacity='0.55'/></pattern></defs><rect width='120' height='120' fill='#7d96b4'/><rect width='120' height='120' fill='url(#d)'/></svg>"),
    },
    {
        id: 'builtin:polka-pink', name: '粉底白点', group: '纸张',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><defs><pattern id='p' width='10' height='10' patternUnits='userSpaceOnUse'><circle cx='2.5' cy='2.5' r='0.95' fill='#ffffff' fill-opacity='0.75'/><circle cx='7.5' cy='7.5' r='0.95' fill='#ffffff' fill-opacity='0.75'/></pattern></defs><rect width='120' height='120' fill='#f6d3de'/><rect width='120' height='120' fill='url(#p)'/></svg>"),
    },
    {
        id: 'builtin:polka-cream', name: '米底白点', group: '纸张',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><defs><pattern id='p' width='9' height='9' patternUnits='userSpaceOnUse'><circle cx='2.2' cy='2.2' r='0.85' fill='#ffffff' fill-opacity='0.72'/><circle cx='6.8' cy='6.8' r='0.85' fill='#ffffff' fill-opacity='0.72'/></pattern></defs><rect width='120' height='120' fill='#f7ece0'/><rect width='120' height='120' fill='url(#p)'/></svg>"),
    },
    {
        id: 'builtin:gingham', name: '粉格纹', group: '纸张',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><defs><pattern id='h' width='20' height='20' patternUnits='userSpaceOnUse'><rect width='20' height='9' fill='#f0bfcd' opacity='0.6'/></pattern><pattern id='v' width='20' height='20' patternUnits='userSpaceOnUse'><rect width='9' height='20' fill='#f0bfcd' opacity='0.6'/></pattern></defs><rect width='120' height='120' fill='#fffaf7'/><rect width='120' height='120' fill='url(#h)'/><rect width='120' height='120' fill='url(#v)'/></svg>"),
    },
    {
        id: 'builtin:stripe', name: '细条纹', group: '纸张',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><defs><pattern id='s' width='12' height='12' patternUnits='userSpaceOnUse'><rect width='4' height='12' fill='#cfd9e6'/></pattern></defs><rect width='120' height='120' fill='#f8fafd'/><rect width='120' height='120' fill='url(#s)'/></svg>"),
    },

    {
        id: 'builtin:tape-pastel', name: '粉雾胶带', group: '胶带',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'><rect width='200' height='60' fill='#f3d7de' opacity='0.86'/><path d='M0 12h200M0 26h200M0 40h200M0 54h200' stroke='#ffffff' stroke-opacity='0.5' stroke-width='3'/></svg>"),
    },
    {
        id: 'builtin:tape-blue', name: '雾蓝胶带', group: '胶带',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'><rect width='200' height='60' fill='#cfdcea' opacity='0.9'/><path d='M0 8h200M0 30h200M0 52h200' stroke='#ffffff' stroke-opacity='0.6' stroke-width='2'/><path d='M0 18h200M0 42h200' stroke='#a9bed4' stroke-opacity='0.5' stroke-width='2'/></svg>"),
    },
    {
        id: 'builtin:tape-black', name: '黑色胶带', group: '胶带',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'><rect width='200' height='60' fill='#2c2d33' opacity='0.9'/><path d='M0 10h200M0 30h200M0 50h200' stroke='#55575f' stroke-width='2'/></svg>"),
    },
    {
        id: 'builtin:tape-cream', name: '米色胶带', group: '胶带',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'><rect width='200' height='60' fill='#e8dcc6' opacity='0.92'/><path d='M0 14h200M0 30h200M0 46h200' stroke='#ffffff' stroke-opacity='0.55' stroke-width='2.5'/><path d='M0 22h200M0 38h200' stroke='#cdbb9f' stroke-opacity='0.5' stroke-width='1.6'/></svg>"),
    },
    {
        id: 'builtin:tape-gingham', name: '格纹胶带', group: '胶带',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'><rect width='200' height='60' fill='#fffaf7'/><defs><pattern id='h' width='14' height='14' patternUnits='userSpaceOnUse'><rect width='14' height='7' fill='#eebfcd' opacity='0.75'/></pattern><pattern id='v' width='14' height='14' patternUnits='userSpaceOnUse'><rect width='7' height='14' fill='#eebfcd' opacity='0.75'/></pattern></defs><rect width='200' height='60' fill='url(#h)'/><rect width='200' height='60' fill='url(#v)'/></svg>"),
    },

    {
        id: 'builtin:lace', name: '蕾丝环', group: '蕾丝',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><circle cx='60' cy='60' r='55' fill='none' stroke='#ffffff' stroke-width='3.2' stroke-dasharray='0.1 6.4' stroke-linecap='round'/><circle cx='60' cy='60' r='50' fill='none' stroke='#f4ebe1' stroke-width='1.6'/><circle cx='60' cy='60' r='44' fill='none' stroke='#ffffff' stroke-width='1.1'/></svg>"),
    },
    {
        id: 'builtin:doily', name: '花边纸垫', group: '蕾丝',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><circle cx='60' cy='60' r='40' fill='#ffffff'/><circle cx='60' cy='60' r='33' fill='none' stroke='#f3eae0' stroke-width='1.2'/><circle cx='60' cy='60' r='24' fill='none' stroke='#f7f0e8' stroke-width='1'/><circle cx='60' cy='60' r='47' fill='none' stroke='#fdf9f4' stroke-width='2.6' stroke-dasharray='0.1 7' stroke-linecap='round'/></svg>"),
    },
    {
        id: 'builtin:lace-frame', name: '蕾丝方框', group: '蕾丝',
        url: svg(`${HEAD}<rect x='7' y='7' width='106' height='106' rx='12' fill='none' stroke='#ffffff' stroke-width='3' stroke-dasharray='0.1 7' stroke-linecap='round'/><rect x='13' y='13' width='94' height='94' rx='9' fill='none' stroke='#f2e8dd' stroke-width='1.4'/><rect x='18' y='18' width='84' height='84' rx='6' fill='none' stroke='#ffffff' stroke-width='0.9'/></svg>`),
    },
    {
        id: 'builtin:scallop', name: '圆点花边', group: '蕾丝',
        url: svg(`${HEAD}<rect x='6' y='6' width='108' height='108' rx='8' fill='none' stroke='#ffffff' stroke-width='3.6' stroke-dasharray='0.1 9' stroke-linecap='round'/><rect x='12' y='12' width='96' height='96' rx='6' fill='none' stroke='#f4ece2' stroke-width='1'/></svg>`),
    },

    {
        id: 'builtin:glitter', name: '闪粉', group: '闪亮',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><g fill='#ffffff'><path d='M22 18l3 9 9 3-9 3-3 9-3-9-9-3 9-3z'/><path d='M84 26l2 6 6 2-6 2-2 6-2-6-6-2 6-2z'/><path d='M52 62l2.5 7.5 7.5 2.5-7.5 2.5-2.5 7.5-2.5-7.5-7.5-2.5 7.5-2.5z'/><path d='M96 82l2 5 5 2-5 2-2 5-2-5-5-2 5-2z'/><path d='M30 92l2 5 5 2-5 2-2 5-2-5-5-2 5-2z'/></g><g fill='#e8d5de'><circle cx='14' cy='48' r='2'/><circle cx='66' cy='12' r='2.4'/><circle cx='110' cy='54' r='2'/><circle cx='74' cy='108' r='2.2'/><circle cx='44' cy='34' r='1.6'/></g></svg>"),
    },
    {
        id: 'builtin:stars', name: '银色星群', group: '闪亮',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><g fill='#c9ccd2'><path d='M40 16l6 18 18 6-18 6-6 18-6-18-18-6 18-6z'/><path d='M88 60l4 12 12 4-12 4-4 12-4-12-12-4 12-4z'/><path d='M44 82l3 9 9 3-9 3-3 9-3-9-9-3 9-3z'/></g></svg>"),
    },
    {
        id: 'builtin:hearts', name: '爱心堆', group: '闪亮',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><g fill='#e9aebd'><path d='M38 26c-8 0-14 6-14 14 0 12 14 22 14 22s14-10 14-22c0-8-6-14-14-14z'/><path d='M80 54c-6 0-11 5-11 11 0 9 11 17 11 17s11-8 11-17c0-6-5-11-11-11z'/></g><g fill='#f6d3dc'><path d='M56 78c-5 0-9 4-9 9 0 7 9 14 9 14s9-7 9-14c0-5-4-9-9-9z'/></g></svg>"),
    },
    {
        id: 'builtin:sparkle', name: '四角星', group: '闪亮',
        url: svg(`${HEAD}<path d='M60 4C64 40 80 56 116 60 80 64 64 80 60 116 56 80 40 64 4 60 40 56 56 40 60 4Z' fill='#ffffff'/><path d='M60 24C63 46 74 57 96 60 74 63 63 74 60 96 57 74 46 63 24 60 46 57 57 46 60 24Z' fill='#f6efe4' opacity='0.7'/></svg>`),
    },
    {
        id: 'builtin:pearls', name: '珍珠链', group: '闪亮',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 260 60'><g fill='#fffdf8' stroke='#e3d7c7' stroke-width='1'><circle cx='12' cy='40' r='6'/><circle cx='34' cy='33' r='6'/><circle cx='56' cy='27' r='6'/><circle cx='78' cy='23' r='6'/><circle cx='100' cy='21' r='6'/><circle cx='122' cy='21' r='6'/><circle cx='144' cy='23' r='6'/><circle cx='166' cy='27' r='6'/><circle cx='188' cy='33' r='6'/><circle cx='210' cy='39' r='6'/><circle cx='232' cy='33' r='6'/><circle cx='250' cy='26' r='6'/></g><g fill='#f3e8d8' opacity='0.85'><circle cx='11' cy='38' r='2'/><circle cx='55' cy='25' r='2'/><circle cx='99' cy='19' r='2'/><circle cx='143' cy='21' r='2'/><circle cx='187' cy='31' r='2'/><circle cx='231' cy='31' r='2'/></g></svg>"),
    },

    {
        id: 'builtin:ribbon', name: '缎带蝴蝶结', group: '装饰',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><g fill='#efc6d3' stroke='#dfa9b8' stroke-width='2'><path d='M58 52C44 30 18 32 18 48c0 14 20 18 40 12z'/><path d='M62 52c14-22 40-20 40-4 0 14-20 18-40 12z'/><path d='M56 60c-8 14-14 26-22 34 10 2 18-6 24-18z'/><path d='M64 60c8 14 14 26 22 34-10 2-18-6-24-18z'/></g><circle cx='60' cy='58' r='7' fill='#e5b3c3' stroke='#d79cae' stroke-width='2'/></svg>"),
    },
    {
        id: 'builtin:filmstrip', name: '胶卷条', group: '装饰',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 200'><rect width='60' height='200' rx='3' fill='#1c1c21'/><g fill='#f6f4ef'><rect x='4' y='6' width='8' height='10' rx='1'/><rect x='4' y='24' width='8' height='10' rx='1'/><rect x='4' y='42' width='8' height='10' rx='1'/><rect x='4' y='60' width='8' height='10' rx='1'/><rect x='4' y='78' width='8' height='10' rx='1'/><rect x='4' y='96' width='8' height='10' rx='1'/><rect x='4' y='114' width='8' height='10' rx='1'/><rect x='4' y='132' width='8' height='10' rx='1'/><rect x='4' y='150' width='8' height='10' rx='1'/><rect x='4' y='168' width='8' height='10' rx='1'/><rect x='4' y='184' width='8' height='10' rx='1'/><rect x='48' y='6' width='8' height='10' rx='1'/><rect x='48' y='24' width='8' height='10' rx='1'/><rect x='48' y='42' width='8' height='10' rx='1'/><rect x='48' y='60' width='8' height='10' rx='1'/><rect x='48' y='78' width='8' height='10' rx='1'/><rect x='48' y='96' width='8' height='10' rx='1'/><rect x='48' y='114' width='8' height='10' rx='1'/><rect x='48' y='132' width='8' height='10' rx='1'/><rect x='48' y='150' width='8' height='10' rx='1'/><rect x='48' y='168' width='8' height='10' rx='1'/><rect x='48' y='184' width='8' height='10' rx='1'/></g></svg>"),
    },
    {
        id: 'builtin:stamp', name: '邮票', group: '装饰',
        url: svg(`${HEAD}<rect x='6' y='6' width='108' height='108' fill='#ffffff' stroke='#e7e1d6'/><rect x='14' y='14' width='92' height='92' fill='#eef1f4' stroke='#c9d3de'/><g fill='#ffffff'><circle cx='6' cy='6' r='4'/><circle cx='6' cy='24' r='4'/><circle cx='6' cy='42' r='4'/><circle cx='6' cy='60' r='4'/><circle cx='6' cy='78' r='4'/><circle cx='6' cy='96' r='4'/><circle cx='6' cy='114' r='4'/><circle cx='114' cy='6' r='4'/><circle cx='114' cy='24' r='4'/><circle cx='114' cy='42' r='4'/><circle cx='114' cy='60' r='4'/><circle cx='114' cy='78' r='4'/><circle cx='114' cy='96' r='4'/><circle cx='114' cy='114' r='4'/></g></svg>`),
    },
    {
        id: 'builtin:ticket', name: '票根', group: '装饰',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 90'><rect width='200' height='90' rx='6' fill='#fdfbf6' stroke='#e4ddcf'/><path d='M140 8v74' stroke='#d9d0c0' stroke-dasharray='4 4'/><circle cx='140' cy='8' r='7' fill='#eef1f5'/><circle cx='140' cy='82' r='7' fill='#eef1f5'/><text x='18' y='40' font-family='monospace' font-size='15' fill='#8b8578'>ADMIT ONE</text><text x='18' y='62' font-family='monospace' font-size='9' fill='#b3ab9c'>STARGAZE · 2026</text></svg>"),
    },
    {
        id: 'builtin:music', name: '音符串', group: '装饰',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><g fill='#9aa4b2'><path d='M34 88V34l40-10v14L44 46v42z'/><circle cx='26' cy='90' r='9'/><circle cx='66' cy='80' r='9'/><path d='M92 40l8 8-8 8-8-8z'/></g></svg>"),
    },
    {
        id: 'builtin:cloud', name: '云朵', group: '装饰',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><path d='M32 78c-11 0-20-8-20-18s9-18 20-18c2-13 13-22 26-22 15 0 27 11 28 25 10 1 18 9 18 18 0 8-7 15-16 15z' fill='#ffffff' stroke='#e6e1d8' stroke-width='2'/></svg>"),
    },
    {
        id: 'builtin:butterfly', name: '蝴蝶', group: '装饰',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><g fill='#dfc2cd' stroke='#c9a3b3' stroke-width='1.6'><path d='M58 58C46 36 20 36 18 52c-2 14 18 22 40 16z'/><path d='M62 58c12-22 38-22 40-6 2 14-18 22-40 16z'/><path d='M58 66c-10 10-24 26-18 32 8 6 18-8 20-24z'/><path d='M62 66c10 10 24 26 18 32-8 6-18-8-20-24z'/></g><path d='M60 48v34' stroke='#a9909c' stroke-width='3' stroke-linecap='round'/></svg>"),
    },
    {
        id: 'builtin:flower', name: '小花', group: '装饰',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><g fill='#f7e3ea' stroke='#e8c6d3' stroke-width='1.6'><ellipse cx='60' cy='34' rx='14' ry='18'/><ellipse cx='86' cy='52' rx='18' ry='14'/><ellipse cx='78' cy='82' rx='14' ry='18'/><ellipse cx='42' cy='82' rx='14' ry='18'/><ellipse cx='34' cy='52' rx='18' ry='14'/></g><circle cx='60' cy='62' r='11' fill='#f2c96a'/></svg>"),
    },
    {
        id: 'builtin:corner', name: '角标线', group: '装饰',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><g stroke='#ffffff' stroke-width='3' fill='none'><path d='M8 34V8h26'/><path d='M112 34V8H86'/><path d='M8 86v26h26'/><path d='M112 86v26H86'/></g></svg>"),
    },
    {
        id: 'builtin:cassette', name: '磁带', group: '装饰',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'><rect x='4' y='8' width='112' height='64' rx='6' fill='#3a3a40'/><rect x='14' y='18' width='92' height='30' rx='3' fill='#f3ece0'/><circle cx='38' cy='33' r='9' fill='#3a3a40'/><circle cx='82' cy='33' r='9' fill='#3a3a40'/><circle cx='38' cy='33' r='3' fill='#f3ece0'/><circle cx='82' cy='33' r='3' fill='#f3ece0'/><path d='M30 56h60' stroke='#7b7b83' stroke-width='3'/><rect x='14' y='60' width='92' height='6' rx='3' fill='#55555d'/></svg>"),
    },
    {
        id: 'builtin:cd', name: 'CD 光盘', group: '装饰',
        url: svg(`${HEAD}<circle cx='60' cy='60' r='52' fill='#eef1f4'/><circle cx='60' cy='60' r='52' fill='none' stroke='#d3dae2' stroke-width='2'/><path d='M60 8a52 52 0 0 1 45 26L60 60z' fill='#f7e3ea' opacity='0.8'/><path d='M105 34a52 52 0 0 1 7 42L60 60z' fill='#dfeaf6' opacity='0.8'/><path d='M112 76a52 52 0 0 1-30 30L60 60z' fill='#f6f0dd' opacity='0.8'/><circle cx='60' cy='60' r='16' fill='#ffffff' stroke='#d3dae2' stroke-width='2'/><circle cx='60' cy='60' r='6' fill='#e8ecf1' stroke='#c9d2dc'/></svg>`),
    },
    {
        id: 'builtin:rose', name: '玫瑰', group: '装饰',
        url: svg(`${HEAD}<g fill='#e9b3bd' stroke='#cf8f9c' stroke-width='1.4'><ellipse cx='60' cy='44' rx='20' ry='14'/><ellipse cx='78' cy='60' rx='14' ry='20'/><ellipse cx='60' cy='76' rx='20' ry='14'/><ellipse cx='42' cy='60' rx='14' ry='20'/></g><circle cx='60' cy='60' r='13' fill='#d99aa8'/><path d='M60 52c6 4 6 12 0 16-6-4-6-12 0-16z' fill='#c9818f'/><path d='M56 88c-2 10 2 18 6 24 4-6 8-14 6-24z' fill='#9db08a'/></svg>`),
    },
    {
        id: 'builtin:label', name: '空白标签', group: '装饰',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'><rect x='3' y='8' width='194' height='44' rx='8' fill='#fffdf8' stroke='#e2dacb' stroke-dasharray='5 4'/><path d='M20 30h120' stroke='#efe7d8' stroke-width='2'/></svg>"),
    },
    {
        id: 'builtin:barcode', name: '条形码', group: '装饰',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'><rect width='200' height='60' fill='#ffffff'/><g fill='#26262b'><rect x='10' y='6' width='3' height='40'/><rect x='17' y='6' width='6' height='40'/><rect x='27' y='6' width='2' height='40'/><rect x='33' y='6' width='5' height='40'/><rect x='42' y='6' width='2' height='40'/><rect x='48' y='6' width='8' height='40'/><rect x='60' y='6' width='3' height='40'/><rect x='67' y='6' width='2' height='40'/><rect x='73' y='6' width='6' height='40'/><rect x='83' y='6' width='2' height='40'/><rect x='89' y='6' width='4' height='40'/><rect x='97' y='6' width='7' height='40'/><rect x='108' y='6' width='2' height='40'/><rect x='114' y='6' width='5' height='40'/><rect x='123' y='6' width='3' height='40'/><rect x='130' y='6' width='6' height='40'/><rect x='140' y='6' width='2' height='40'/><rect x='146' y='6' width='4' height='40'/><rect x='154' y='6' width='7' height='40'/><rect x='165' y='6' width='2' height='40'/><rect x='171' y='6' width='5' height='40'/><rect x='180' y='6' width='3' height='40'/><rect x='187' y='6' width='4' height='40'/></g><text x='10' y='56' font-family='monospace' font-size='8' fill='#5a5a62'>8 801234 567890</text></svg>"),
    },
    {
        id: 'builtin:badge', name: '星形徽章', group: '装饰',
        url: svg(`${HEAD}<path d='M60 6l9 22 24-9-9 24 22 9-22 9 9 24-24-9-9 22-9-22-24 9 9-24-22-9 22-9-9-24 24 9z' fill='#f4e6ea' stroke='#e0c3cd' stroke-width='2'/><circle cx='60' cy='60' r='20' fill='#fffdfa' stroke='#e0c3cd' stroke-width='1.6'/><path d='M60 48l4 9 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z' fill='#dfa9b8'/></svg>`),
    },
    {
        id: 'builtin:cherry', name: '樱桃', group: '装饰',
        url: svg(`${HEAD}<path d='M60 46c-4-12-14-18-26-16 6 10 16 14 26 16z' fill='#8fa87c'/><path d='M60 46c4-12 14-18 26-16-6 10-16 14-26 16z' fill='#a8bd93'/><path d='M60 46V28' stroke='#7d9a6b' stroke-width='3'/><circle cx='42' cy='76' r='18' fill='#d97f8c'/><circle cx='80' cy='80' r='16' fill='#e3939f'/><circle cx='36' cy='70' r='4' fill='#f0b6bf'/><circle cx='74' cy='74' r='3.4' fill='#f0b6bf'/></svg>`),
    },
    {
        id: 'builtin:checker', name: '棋盘格', group: '纸张',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><defs><pattern id='c' width='16' height='16' patternUnits='userSpaceOnUse'><rect width='8' height='8' fill='#f6bfd0'/><rect x='8' y='8' width='8' height='8' fill='#f6bfd0'/></pattern></defs><rect width='120' height='120' fill='#fff7f9'/><rect width='120' height='120' fill='url(#c)'/></svg>"),
    },
    {
        id: 'builtin:bow', name: '缎面蝴蝶结', group: '装饰',
        url: svg(`${HEAD}<g fill='#f3a8bd' stroke='#dd8ba4' stroke-width='2'><path d='M58 52C42 24 12 28 12 48c0 20 26 22 46 12z'/><path d='M62 52c16-28 46-24 46-4 0 20-26 22-46 12z'/><path d='M56 60c-8 16-14 30-20 40 12 2 20-8 26-22z'/><path d='M64 60c8 16 14 30 20 40-12 2-20-8-26-22z'/></g><path d='M24 38c9-5 17-1 21 6' stroke='#fbd6e0' stroke-width='3.4' fill='none'/><path d='M96 38c-9-5-17-1-21 6' stroke='#fbd6e0' stroke-width='3.4' fill='none'/><circle cx='60' cy='56' r='9' fill='#e894ac' stroke='#d7809b' stroke-width='2'/></svg>`),
    },
    {
        id: 'builtin:button', name: '纽扣', group: '装饰',
        url: svg(`${HEAD}<circle cx='60' cy='60' r='44' fill='#c3d2e2' stroke='#a7b9cd' stroke-width='3'/><circle cx='60' cy='60' r='32' fill='none' stroke='#b0c1d4' stroke-width='2'/><g fill='#8ea3ba'><circle cx='48' cy='50' r='5'/><circle cx='72' cy='50' r='5'/><circle cx='48' cy='70' r='5'/><circle cx='72' cy='70' r='5'/></g></svg>`),
    },
    {
        id: 'builtin:cup', name: '咖啡杯', group: '装饰',
        url: svg(`${HEAD}<path d='M34 44h52l-6 60a8 8 0 0 1-8 7H48a8 8 0 0 1-8-7z' fill='#fdfaf4' stroke='#ded4c4' stroke-width='2'/><path d='M30 36h60l-2 12H32z' fill='#e8ddcb' stroke='#d6c9b4' stroke-width='2'/><path d='M46 62h28M44 76h32' stroke='#d8cbb8' stroke-width='2.4'/><path d='M62 24c-4-6 4-10 0-16' stroke='#c9bda9' stroke-width='2.4' fill='none'/></svg>`),
    },
    {
        id: 'builtin:headphone', name: '耳机', group: '装饰',
        url: svg(`${HEAD}<path d='M22 70V58a38 38 0 0 1 76 0v12' fill='none' stroke='#e6a8bb' stroke-width='9' stroke-linecap='round'/><rect x='12' y='64' width='22' height='34' rx='9' fill='#f6c3d1' stroke='#dd9db0' stroke-width='2'/><rect x='86' y='64' width='22' height='34' rx='9' fill='#f6c3d1' stroke='#dd9db0' stroke-width='2'/></svg>`),
    },
    {
        id: 'builtin:star-outline', name: '空心星', group: '闪亮',
        url: svg(`${HEAD}<path d='M60 10l15 32 35 4-26 24 7 35-31-18-31 18 7-35-26-24 35-4z' fill='none' stroke='#6b7280' stroke-width='5' stroke-linejoin='round'/><path d='M60 22l11 24 26 3-19 18 5 26-23-13-23 13 5-26-19-18 26-3z' fill='none' stroke='#9aa1ab' stroke-width='2'/></svg>`),
    },
    {
        id: 'builtin:window', name: '木窗框', group: '装饰',
        url: svg(`${HEAD}<rect x='8' y='8' width='104' height='104' rx='4' fill='#b58a5e'/><rect x='20' y='20' width='80' height='80' fill='#f4ece0'/><path d='M60 20v80M20 60h80' stroke='#b58a5e' stroke-width='7'/><rect x='8' y='8' width='104' height='104' rx='4' fill='none' stroke='#9a7350' stroke-width='3'/></svg>`),
    },
    {
        id: 'builtin:binder', name: '长尾夹', group: '装饰',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 120'><path d='M18 34h24v58a8 8 0 0 1-8 8h-8a8 8 0 0 1-8-8z' fill='#d9bcc4' stroke='#c19ea8' stroke-width='2'/><path d='M22 34V18a8 8 0 0 1 16 0v16' fill='none' stroke='#b9bcc2' stroke-width='4'/><path d='M24 46h12M24 58h12' stroke='#c19ea8' stroke-width='2'/></svg>"),
    },

    {
        id: 'builtin:torn-edge', name: '撕边纸（上下）', group: '纸张',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 160'><path d='M0.0 10.94L9.09 15.3L18.18 10.0L27.27 16.72L36.36 10.63L45.45 15.3L54.55 10.4L63.64 16.9L72.73 10.61L81.82 16.86L90.91 9.34L100.0 15.36L109.09 9.65L118.18 16.13L127.27 9.95L136.36 17.49L145.45 10.74L154.55 15.08L163.64 8.65L172.73 16.02L181.82 10.48L190.91 15.84L200.0 10.07L200 147L200.0 142.61L190.91 149.55L181.82 144.44L172.73 150.47L163.64 143.62L154.55 151.39L145.45 142.9L136.36 149.9L127.27 144.47L118.18 151.1L109.09 142.53L100.0 149.1L90.91 143.16L81.82 151.17L72.73 143.36L63.64 149.57L54.55 143.0L45.45 150.83L36.36 144.5L27.27 150.61L18.18 144.43L9.09 149.13L0.0 144.14Z' fill='#fffdf8'/><path d='M0 22L200 18' stroke='#f2ebe1' stroke-width='1.2'/><path d='M0 140L200 144' stroke='#f2ebe1' stroke-width='1'/><g fill='#ffffff' opacity='0.5'><rect x='14' y='34' width='172' height='1.2'/><rect x='14' y='124' width='172' height='1.2'/></g></svg>"),
    },
    {
        id: 'builtin:torn-kraft', name: '牛皮撕纸', group: '纸张',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 160'><path d='M0.0 8.69L9.09 17.37L18.18 8.77L27.27 15.23L36.36 9.51L45.45 16.07L54.55 9.66L63.64 15.35L72.73 10.5L81.82 16.13L90.91 10.43L100.0 16.15L109.09 10.91L118.18 15.24L127.27 9.22L136.36 16.07L145.45 9.71L154.55 16.84L163.64 10.09L172.73 15.17L181.82 9.04L190.91 16.48L200.0 9.35L200 147L200.0 143.44L190.91 151.43L181.82 144.08L172.73 150.91L163.64 144.06L154.55 150.44L145.45 143.34L136.36 149.8L127.27 144.76L118.18 150.2L109.09 143.2L100.0 150.49L90.91 143.87L81.82 150.61L72.73 144.52L63.64 149.47L54.55 144.17L45.45 151.04L36.36 144.49L27.27 149.31L18.18 144.73L9.09 149.12L0.0 144.29Z' fill='#e6d5bd'/><path d='M0 20L200 16' stroke='#f4ead9' stroke-width='1.4' opacity='0.75'/><g stroke='#d8c3a6' stroke-width='0.9' opacity='0.7'><path d='M10 42L190 38M10 64L190 60M10 86L190 82M10 108L190 104M10 130L190 126'/></g></svg>"),
    },
    {
        id: 'builtin:washi', name: '和纸胶带', group: '胶带',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'><defs><linearGradient id='w' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='#efd8dd' stop-opacity='0.5'/><stop offset='0.45' stop-color='#f8e7ea' stop-opacity='0.86'/><stop offset='1' stop-color='#efd8dd' stop-opacity='0.55'/></linearGradient></defs><path d='M0 7L200 3L200 55L0 57Z' fill='url(#w)'/><path d='M0 7L200 3' stroke='#ffffff' stroke-opacity='0.65' stroke-width='2'/><path d='M0 55L200 57' stroke='#ffffff' stroke-opacity='0.4' stroke-width='1.4'/><g stroke='#ffffff' stroke-opacity='0.3' stroke-width='1.2'><path d='M0 18L200 15M0 30L200 27M0 42L200 39'/></g><g fill='#ffffff' opacity='0.42'><circle cx='28' cy='22' r='1.5'/><circle cx='74' cy='40' r='1.5'/><circle cx='122' cy='20' r='1.5'/><circle cx='168' cy='42' r='1.5'/></g></svg>"),
    },
    {
        id: 'builtin:badge-ring', name: '圆形徽章框', group: '装饰',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><circle cx='60' cy='60' r='57' fill='#fffdf9'/><circle cx='60' cy='60' r='57' fill='none' stroke='#e3d4c4' stroke-width='1.4'/><circle cx='60' cy='60' r='50' fill='none' stroke='#cbb8a3' stroke-width='1' stroke-dasharray='2.4 3.6'/><circle cx='60' cy='60' r='42' fill='none' stroke='#e9dccb' stroke-width='1.2'/><g fill='#d9c3ad'><circle cx='60' cy='9' r='1.7'/><circle cx='60' cy='111' r='1.7'/><circle cx='9' cy='60' r='1.7'/><circle cx='111' cy='60' r='1.7'/></g><g fill='#efdfcd'><circle cx='21' cy='21' r='1.2'/><circle cx='99' cy='21' r='1.2'/><circle cx='21' cy='99' r='1.2'/><circle cx='99' cy='99' r='1.2'/></g></svg>"),
    },
    {
        id: 'builtin:pearl-fine', name: '细珍珠串', group: '闪亮',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 26'><defs><linearGradient id='p' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#fffefc'/><stop offset='0.55' stop-color='#fbf5ec'/><stop offset='1' stop-color='#ece0cd'/></linearGradient></defs><g fill='url(#p)' stroke='#e2d4c0' stroke-width='0.55'><circle cx='6.0' cy='16.9' r='3.2'/><circle cx='17.0' cy='16.3' r='3.2'/><circle cx='28.0' cy='15.8' r='3.2'/><circle cx='39.0' cy='15.3' r='3.2'/><circle cx='50.0' cy='14.9' r='3.2'/><circle cx='61.0' cy='14.5' r='3.2'/><circle cx='72.0' cy='14.1' r='3.2'/><circle cx='83.0' cy='13.8' r='3.2'/><circle cx='94.0' cy='13.6' r='3.2'/><circle cx='105.0' cy='13.4' r='3.2'/><circle cx='116.0' cy='13.2' r='3.2'/><circle cx='127.0' cy='13.1' r='3.2'/><circle cx='138.0' cy='13.0' r='3.2'/><circle cx='149.0' cy='13.0' r='3.2'/><circle cx='160.0' cy='13.0' r='3.2'/><circle cx='171.0' cy='13.1' r='3.2'/><circle cx='182.0' cy='13.2' r='3.2'/><circle cx='193.0' cy='13.3' r='3.2'/><circle cx='204.0' cy='13.5' r='3.2'/><circle cx='215.0' cy='13.8' r='3.2'/><circle cx='226.0' cy='14.1' r='3.2'/><circle cx='237.0' cy='14.4' r='3.2'/><circle cx='248.0' cy='14.8' r='3.2'/><circle cx='259.0' cy='15.2' r='3.2'/><circle cx='270.0' cy='15.7' r='3.2'/><circle cx='281.0' cy='16.2' r='3.2'/><circle cx='292.0' cy='16.8' r='3.2'/></g><g fill='#ffffff' opacity='0.92'><circle cx='5.1' cy='15.7' r='1.05'/><circle cx='16.1' cy='15.2' r='1.05'/><circle cx='27.1' cy='14.6' r='1.05'/><circle cx='38.1' cy='14.1' r='1.05'/><circle cx='49.1' cy='13.7' r='1.05'/><circle cx='60.1' cy='13.3' r='1.05'/><circle cx='71.1' cy='13.0' r='1.05'/><circle cx='82.1' cy='12.7' r='1.05'/><circle cx='93.1' cy='12.4' r='1.05'/><circle cx='104.1' cy='12.2' r='1.05'/><circle cx='115.1' cy='12.1' r='1.05'/><circle cx='126.1' cy='11.9' r='1.05'/><circle cx='137.1' cy='11.9' r='1.05'/><circle cx='148.1' cy='11.9' r='1.05'/><circle cx='159.1' cy='11.9' r='1.05'/><circle cx='170.1' cy='11.9' r='1.05'/><circle cx='181.1' cy='12.0' r='1.05'/><circle cx='192.1' cy='12.2' r='1.05'/><circle cx='203.1' cy='12.4' r='1.05'/><circle cx='214.1' cy='12.6' r='1.05'/><circle cx='225.1' cy='12.9' r='1.05'/><circle cx='236.1' cy='13.3' r='1.05'/><circle cx='247.1' cy='13.6' r='1.05'/><circle cx='258.1' cy='14.1' r='1.05'/><circle cx='269.1' cy='14.5' r='1.05'/><circle cx='280.1' cy='15.1' r='1.05'/><circle cx='291.1' cy='15.6' r='1.05'/></g></svg>"),
    },
    {
        id: 'builtin:corner-flower', name: '小角花', group: '装饰',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><g fill='#f9ebf0' stroke='#e7cfd8' stroke-width='1.1'><ellipse cx='30' cy='19' rx='6.5' ry='8.5'/><ellipse cx='40' cy='28' rx='8.5' ry='6.5'/><ellipse cx='32' cy='37' rx='6.5' ry='8.5'/><ellipse cx='22' cy='28' rx='8.5' ry='6.5'/></g><circle cx='31' cy='28' r='3.8' fill='#edcf82'/><g fill='#f9ebf0' stroke='#e7cfd8' stroke-width='1'><ellipse cx='80' cy='46' rx='4.6' ry='6'/><ellipse cx='87' cy='52' rx='6' ry='4.6'/><ellipse cx='81' cy='58' rx='4.6' ry='6'/><ellipse cx='74' cy='52' rx='6' ry='4.6'/></g><circle cx='81' cy='52' r='2.6' fill='#edcf82'/><g fill='#f9ebf0' stroke='#e7cfd8' stroke-width='0.9'><ellipse cx='46' cy='86' rx='3.6' ry='4.8'/><ellipse cx='51' cy='90' rx='4.8' ry='3.6'/><ellipse cx='47' cy='94' rx='3.6' ry='4.8'/><ellipse cx='42' cy='90' rx='4.8' ry='3.6'/></g><circle cx='46' cy='90' r='2' fill='#edcf82'/><g fill='#e7cfd8' opacity='0.8'><circle cx='96' cy='30' r='1.6'/><circle cx='62' cy='70' r='1.4'/><circle cx='20' cy='62' r='1.4'/></g></svg>"),
    },
    {
        id: 'builtin:polaroid-stack', name: '双框相纸', group: '纸张',
        url: svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 200'><rect x='22' y='14' width='126' height='168' rx='2' fill='#f6f2ea' stroke='#e6e0d5'/><rect x='10' y='24' width='126' height='168' rx='2' fill='#ffffff' stroke='#e8e2d8'/><rect x='20' y='36' width='106' height='120' fill='#eeebe5'/><path d='M36 170h74' stroke='#e3ded4' stroke-width='1.8'/></svg>"),
    },
];

BUILTIN_ASSETS.push(...V10_ASSETS, ...V10_SKINS);

export const BUILTIN_MAP = new Map(BUILTIN_ASSETS.map(asset => [asset.id, asset]));
onRuntimeAsset(asset=>{if(!BUILTIN_MAP.has(asset.id)){BUILTIN_ASSETS.push(asset);BUILTIN_MAP.set(asset.id,asset);}});

export function builtinAssetUrl(id) {
    return BUILTIN_MAP.get(id)?.url || '';
}

export function isBuiltinAsset(id) {
    return typeof id === 'string' && (id.startsWith('builtin:') || id.startsWith('v10:'));
}

export function uid(prefix = 'star') {
    const random = globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    return `${prefix}-${random}`;
}

export function characterKey(character) {
    if (character?.avatar && character.avatar !== 'none') return `avatar:${character.avatar}`;
    return `name:${character?.name || 'unknown'}`;
}

function image(assetId, x, y, width, height, shape = 'none', extra = {}) {
    return {
        id: uid('el'), type: 'image', assetId, x, y, width, height,
        rotation: 0, z: 2, opacity: 1, shape, caption: '', cropZoom: 1, fit: 'cover',
        focusX: 50, focusY: 50, layer: 'back', ...extra,
    };
}

function text(value, x, y, width, height, extra = {}) {
    return {
        id: uid('el'), type: 'text', text: value, x, y, width, height,
        rotation: 0, z: 7, opacity: 1, fontSize: 10, fontFamily: SANS,
        color: '', align: 'left', stroke: 0, shadow: false, layer: 'back', ...extra,
    };
}

function sticker(glyph, x, y, size, extra = {}) {
    return {
        id: uid('el'), type: 'sticker', text: glyph, x, y, width: size, height: size,
        rotation: 0, z: 6, opacity: 1, fontSize: size * 0.78,
        fontFamily: SANS, color: '', align: 'center', stroke: 0,
        shadow: false, layer: 'back', ...extra,
    };
}

function bg(assetId, width, height, extra = {}) {
    return image(assetId, 0, 0, width, height, 'none', { z: 0, layer: 'back', ...extra });
}

function card(assetId, x, y, width, height, rotation = 0, extra = {}) {
    return image(assetId, x, y, width, height, 'none', { z: 2, rotation, fit: 'fill', ...extra });
}

function pic(x, y, width, height, shape = 'polaroid', rotation = 0, extra = {}) {
    return image('__avatar__', x, y, width, height, shape, { z: 3, rotation, ...extra });
}

function tape(assetId, x, y, width, height, rotation = 0, extra = {}) {
    return image(assetId, x, y, width, height, 'none', { z: 6, rotation, fit: 'fill', ...extra });
}

function cap(value, x, y, width, size = 9, extra = {}) {
    return text(value, x, y, width, size * 1.7, { fontSize: size, z: 8, fontFamily: MONO, ...extra });
}

function big(value, x, y, width, size, extra = {}) {
    return text(value, x, y, width, size * 1.35, { fontSize: size, z: 8, ...extra });
}

function halo(assetId, cx, cy, diameter, ratio = 0.63, extra = {}) {
    const size = diameter * ratio * 2;
    return image(assetId, cx - size / 2, cy - size / 2, size, size, 'none', { z: 2, ...extra });
}

function badge(x, y, size, label = '', extra = {}) {
    const { color = '#8a7268', layer = 'back', ...rest } = extra;
    const ring = image('builtin:badge-ring', x, y, size, size, 'none', { z: 7, layer, ...rest });
    if (!label) return [ring];
    const caption = text(label, x + size * 0.08, y + size * 0.37, size * 0.84, size * 0.26, {
        fontSize: size * 0.112,
        z: (Number(rest.z) || 7) + 1,
        fontFamily: MONO,
        color,
        align: 'center',
        layer,
    });
    return [ring, caption];
}

function makeScene(templateId, width, height) {
    const scene = buildV10Scene(templateId, width, height);
    return {
        elements: scene.elements,
        source: null,
        avatarUnits: scene.avatarUnits || 0,
        anchorX: scene.anchorX,
        anchorY: scene.anchorY,
        avatar: scene.avatar,
        groups: scene.groups,
        theme: scene.theme,
    };
}

function rescaleElements(elements, from, to) {
    if (!elements.length) return elements;
    const oldWidth = from.width;
    const oldHeight = from.height;
    const newWidth = to.width;
    const newHeight = to.height;
    if (oldWidth === newWidth && oldHeight === newHeight) return elements;
    const oldCenterX = oldWidth * from.anchorX;
    const oldCenterY = oldHeight * from.anchorY;
    const newCenterX = newWidth * to.anchorX;
    const newCenterY = newHeight * to.anchorY;
    const scale = Math.min(newWidth / oldWidth, newHeight / oldHeight);

    const spreadX = Math.min(1.75, Math.max(1, newWidth / Math.max(1, oldWidth * scale)));
    const spreadY = Math.min(1.75, Math.max(1, newHeight / Math.max(1, oldHeight * scale)));
    const clampInto = (value, size, extent) => {
        const bleed = extent * 0.04;
        if (size >= extent + bleed * 2) return (extent - size) / 2;
        return Math.min(extent - size + bleed, Math.max(-bleed, value));
    };
    const coversCanvas = element => element.x <= oldWidth * 0.04
        && element.y <= oldHeight * 0.04
        && element.width >= oldWidth * 0.92
        && element.height >= oldHeight * 0.92;

    const staysCentered = element => {
        const ex = element.x + element.width / 2;
        const ey = element.y + element.height / 2;
        const nearCenter = Math.abs(ex - oldWidth / 2) <= oldWidth * 0.06
            && Math.abs(ey - oldHeight / 2) <= oldHeight * 0.06;
        const small = element.width <= oldWidth * 0.8 && element.height <= oldHeight * 0.8;
        return nearCenter && small;
    };
    return elements.map(element => {
        if (coversCanvas(element)) {
            return { ...element, x: 0, y: 0, width: newWidth, height: newHeight };
        }
        const minimum = element.finish === 'flat' ? 0.25 : 4;
        const width = Math.max(minimum, element.width * scale);
        const height = Math.max(minimum, element.height * scale);
        if (staysCentered(element)) {
            return {
                ...element,
                x: newCenterX - width / 2,
                y: newCenterY - height / 2,
                width,
                height,
                fontSize: element.fontSize ? Math.max(3, element.fontSize * scale) : element.fontSize,
                stroke: element.stroke ? element.stroke * scale : element.stroke,
            };
        }
        const left = newCenterX + (element.x - oldCenterX) * scale * spreadX;
        const top = newCenterY + (element.y - oldCenterY) * scale * spreadY;
        return {
            ...element,
            x: clampInto(left, width, newWidth),
            y: clampInto(top, height, newHeight),
            width,
            height,
            fontSize: element.fontSize ? Math.max(3, element.fontSize * scale) : element.fontSize,
            stroke: element.stroke ? element.stroke * scale : element.stroke,
        };
    });
}

export function clampAvatarZoom(canvas, zoom) {
    const units = avatarUnits(canvas);
    if (!units) return zoom;
    const maximum = (Number(canvas?.height) || 300) * 0.72 / units;
    return Math.max(AVATAR_ZOOM.min, Math.min(zoom, maximum));
}

export function createConfig(key, name, templateId = 'free', layout = '') {
    const template = TEMPLATE_LIST.find(item => item.id === templateId) || TEMPLATE_LIST[0];
    const selectedLayout = LAYOUTS[layout] ? layout : template.layout;
    const preset = LAYOUTS[selectedLayout];

    const scene = makeScene(template.id, preset.width, preset.height);
    const elements = scene.source
        ? rescaleElements(
            scene.elements,
            { ...scene.source, anchorX: 0.5, anchorY: 0.5 },
            { width: preset.width, height: preset.height, anchorX: preset.anchorX, anchorY: preset.anchorY },
        )
        : scene.elements;

    const marker = mainPortrait({ elements, canvas: { width: preset.width, height: preset.height, anchorX: scene.anchorX, anchorY: scene.anchorY } });
    if (marker) marker.photoRole = 'main';

    const rawZoom = scene.avatarUnits
        ? scene.avatarUnits * preset.avatarScale / preset.width
        : (template.avatarRatio || 0.28) * preset.avatarScale;
    const zoom = Math.min(AVATAR_ZOOM.max, Math.max(AVATAR_ZOOM.min,
        Math.round(clampAvatarZoom(preset, rawZoom) * 100) / 100));
    // Keep the designed portrait rectangle when the native zoom limit is met.
    const sceneAvatar = { ...(scene.avatar || {}) };
    if (scene.avatar && scene.avatarUnits) {
        const compensation = scene.avatarUnits / (preset.width / preset.avatarScale * zoom);
        sceneAvatar.widthRatio *= compensation;
        sceneAvatar.heightRatio *= compensation;
    }
    return {
        version: CONFIG_VERSION,
        appVersion: APP_VERSION,
        development: DEVELOPMENT,
        characterKey: key,
        templateId: template.id,
        layout: selectedLayout,
        nickname: name || 'STARGAZE',
        subtitle: 'DEAR MY FAVORITE · STARGAZE',
        canvas: {
            width: preset.width,
            height: preset.height,

            anchorX: scene.anchorX == null ? preset.anchorX : scene.anchorX,
            anchorY: scene.anchorY == null ? preset.anchorY : scene.anchorY,
            avatarScale: preset.avatarScale,
            anchorMode: 'avatar',
        },
        sizeKey: selectedLayout,
        sizes: {},
        avatar: {
            shape: AVATAR_SHAPE_IDS.includes(template.avatarShape) ? template.avatarShape : 'circle',
            frameStyle: 'none',
            zoom: Math.min(AVATAR_ZOOM.max, Math.max(AVATAR_ZOOM.min, zoom)),
            widthRatio: 1,
            heightRatio: 1,
            rotate: 0,
            frame: AVATAR_FRAME.default,
            focusX: AVATAR_FOCUS.default,
            focusY: AVATAR_FOCUS.default,
            hidden: false,
            hiddenId: '',
            ...sceneAvatar,
        },
        theme: { ...(scene.theme || THEMES[template.id] || THEMES.school) },
        elements,
        groups: scene.groups || [],
        updatedAt: 0,
    };
}

export function applyBuiltInTemplate(config, templateId, layout = '') {
    const template = TEMPLATE_LIST.find(item => item.id === templateId) || TEMPLATE_LIST[0];
    const current = LAYOUTS[config.layout] ? config.layout : '';
    const selectedLayout = LAYOUTS[layout] ? layout : (current || template.layout);
    const next = createConfig(config.characterKey, config.nickname, template.id, selectedLayout);
    next.subtitle = config.subtitle || next.subtitle;
    return next;
}

export function setCanvasPreset(config, presetId) {
    const preset = LAYOUTS[presetId];
    if (!preset) return config;
    const old = config.canvas;

    const elements = rescaleElements(config.elements || [], {
        width: old.width || preset.width,
        height: old.height || preset.height,
        anchorX: Number.isFinite(old.anchorX) ? old.anchorX : 0.5,
        anchorY: Number.isFinite(old.anchorY) ? old.anchorY : 0.5,
    }, {
        width: preset.width,
        height: preset.height,
        anchorX: Number.isFinite(old.anchorX) ? old.anchorX : preset.anchorX,
        anchorY: Number.isFinite(old.anchorY) ? old.anchorY : preset.anchorY,
    });

    const rawZoom = Number(config.avatar?.zoom) || 1;
    return {
        ...config,
        layout: presetId,
        canvas: {
            width: preset.width,
            height: preset.height,

            anchorX: Number.isFinite(old.anchorX) ? old.anchorX : preset.anchorX,
            anchorY: Number.isFinite(old.anchorY) ? old.anchorY : preset.anchorY,
            avatarScale: preset.avatarScale,
            anchorMode: ANCHOR_MODE_IDS.includes(old.anchorMode) ? old.anchorMode : 'avatar',
        },
        avatar: {
            ...(config.avatar || {}),
            zoom: clampAvatarZoom(preset, rawZoom),
            frame: clampFrame(config.avatar?.frame),
            focusX: clampFocus(config.avatar?.focusX),
            focusY: clampFocus(config.avatar?.focusY),
            hiddenId: config.avatar?.hidden === true
                ? (elements.filter(element => element.type === 'image' && element.assetId === '__avatar__')
                    .reduce((best, item) => (!best || item.width * item.height > best.width * best.height ? item : best), null)?.id || '')
                : (config.avatar?.hiddenId || ''),
        },
        elements,
    };
}

function numberOr(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
}

export function clampFocus(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return AVATAR_FOCUS.default;
    return Math.min(AVATAR_FOCUS.max, Math.max(AVATAR_FOCUS.min, Math.round(number)));
}

export function clampFrame(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return AVATAR_FRAME.default;
    return Math.round(Math.min(AVATAR_FRAME.max, Math.max(AVATAR_FRAME.min, number)) * 100) / 100;
}

const ELEMENT_TYPES = ['image', 'text', 'sticker', 'tape', 'lace', 'frame'];

export function normalizeAvatarState(avatar) {
    const source = avatar || {};
    const shapeRotateRaw = source.shapeRotate;
    const hasShapeRotate = shapeRotateRaw !== null && shapeRotateRaw !== undefined && shapeRotateRaw !== ''
        && Number.isFinite(Number(shapeRotateRaw));
    const state = {
        shape: AVATAR_SHAPE_IDS.includes(source.shape) ? source.shape : 'circle',
        frameStyle: FRAME_IDS.includes(source.frameStyle)
            ? source.frameStyle
            : (FRAME_LEGACY[source.frameStyle] || 'none'),
        zoom: Math.min(AVATAR_ZOOM.max, Math.max(AVATAR_ZOOM.min, numberOr(source.zoom, 1))),
        widthRatio: clampAvatarBox(source.widthRatio),
        heightRatio: clampAvatarBox(source.heightRatio),
        rotate: clampRotate(source.rotate),
        frame: clampFrame(source.frame),
        focusX: clampFocus(source.focusX),
        focusY: clampFocus(source.focusY),
        hidden: source.hidden === true,
        hiddenId: String(source.hiddenId || ''),
        ...(source.photoTone?{photoTone:normalizeTone(source.photoTone)}:{}),
    };
                                   
    if (hasShapeRotate) state.shapeRotate = clampShapeRotate(shapeRotateRaw);
    return state;
}

// 导入配置的标识符会进入图层按钮属性；统一编码特殊字符，同时保持引用关系。
function safeIdentifier(value) {
    return String(value || '').slice(0, 200).replace(/[^a-zA-Z0-9_:\-]/g, ch => '_' + ch.codePointAt(0).toString(16) + '_');
}

function clampElement(element, index) {
    const safe = { ...element };
    safe.id = safeIdentifier(safe.id || uid('el'));
    safe.groupId = safeIdentifier(safe.groupId);
    if (!['main', 'secondary'].includes(safe.photoRole)) delete safe.photoRole;
    safe.type = ELEMENT_TYPES.includes(safe.type) ? safe.type : 'sticker';
    safe.x = numberOr(safe.x, 0);
    safe.y = numberOr(safe.y, 0);
    const minSize = safe.finish === 'flat' || String(safe.assetId || '').startsWith('v10:design-') ? 0.25 : 4;
    safe.width = Math.max(minSize, numberOr(safe.width, 24));
    safe.height = Math.max(minSize, numberOr(safe.height, 18));
    safe.rotation = numberOr(safe.rotation, 0);
    safe.z = numberOr(safe.z, index);
    safe.opacity = Math.min(1, Math.max(0.05, numberOr(safe.opacity, 1)));
    safe.layer = safe.layer === 'front' ? 'front' : 'back';

    safe.hidden = safe.hidden === true;
    safe.locked = safe.locked === true;
    if (safe.type === 'image') {
        safe.assetId = String(safe.assetId || '__avatar__');
        if(safe.photoTone)safe.photoTone=normalizeTone(safe.photoTone);
        safe.shape = FRAME_IDS.includes(safe.shape) ? safe.shape : (FRAME_LEGACY[safe.shape] || 'rect');
        safe.cropZoom = Math.min(3, Math.max(1, numberOr(safe.cropZoom, 1)));
        safe.focusX = Math.min(100, Math.max(0, numberOr(safe.focusX, 50)));
        safe.focusY = Math.min(100, Math.max(0, numberOr(safe.focusY, 50)));
        safe.caption = String(safe.caption || '');
        safe.fit = ['fill', 'contain', 'cover'].includes(safe.fit) ? safe.fit : 'cover';
    } else if (safe.type === 'text' || safe.type === 'sticker') {
        safe.text = String(safe.text ?? '');
        safe.fontSize = Math.max(3, numberOr(safe.fontSize, 10));
        safe.fontFamily = String(safe.fontFamily || SANS);
        safe.align = ['left', 'center', 'right'].includes(safe.align) ? safe.align : 'left';
        safe.stroke = Math.max(0, numberOr(safe.stroke, 0));
        safe.shadow = Boolean(safe.shadow);
    }
    return safe;
}

function migrateConfig(config, key, name) {
    const layout = LAYOUTS[config.layout] ? config.layout : 'collage';
    const preset = LAYOUTS[layout];
    const oldCanvas = {
        width: numberOr(config.canvas?.width, preset.width) || preset.width,
        height: numberOr(config.canvas?.height, preset.height) || preset.height,
        anchorX: numberOr(config.canvas?.anchorX, 0.5),
        anchorY: numberOr(config.canvas?.anchorY, 0.5),
    };

    const target = layout === CUSTOM_LAYOUT_ID ? { ...oldCanvas } : preset;
    const scale = Math.min(target.width / oldCanvas.width, target.height / oldCanvas.height);
    const oldCenterX = oldCanvas.width * oldCanvas.anchorX;
    const oldCenterY = oldCanvas.height * oldCanvas.anchorY;
    const newCenterX = target.width * target.anchorX;
    const newCenterY = target.height * target.anchorY;
    const coversCanvas = element => element.x <= oldCanvas.width * 0.04
        && element.y <= oldCanvas.height * 0.04
        && element.width >= oldCanvas.width * 0.92
        && element.height >= oldCanvas.height * 0.92;
    const elements = (Array.isArray(config.elements) ? config.elements : []).map((element, index) => {
        const source = {
            ...element,
            x: numberOr(element.x, 0),
            y: numberOr(element.y, 0),
            width: numberOr(element.width, 20),
            height: numberOr(element.height, 20),
        };
        if (coversCanvas(source)) {
            return clampElement({ ...source, x: 0, y: 0, width: target.width, height: target.height }, index);
        }
        return clampElement({
            ...source,
            x: newCenterX + (source.x - oldCenterX) * scale,
            y: newCenterY + (source.y - oldCenterY) * scale,
            width: Math.max(4, source.width * scale),
            height: Math.max(4, source.height * scale),
            fontSize: element.fontSize ? numberOr(element.fontSize, 8) * scale : element.fontSize,
            stroke: element.stroke ? numberOr(element.stroke, 0) * scale : element.stroke,
        }, index);
    });
    const templateId = TEMPLATE_LIST.some(item => item.id === config.templateId) ? config.templateId : 'ice';
    return {
        version: CONFIG_VERSION,
        appVersion: APP_VERSION,
        development: DEVELOPMENT,
        characterKey: key,
        templateId,
        layout,
        nickname: String(config.nickname || name || 'STARGAZE'),
        subtitle: String(config.subtitle || 'DEAR MY FAVORITE · STARGAZE'),
        canvas: {
            width: target.width,
            height: target.height,
            anchorX: target.anchorX,
            anchorY: target.anchorY,
            avatarScale: Math.min(80, Math.max(1.4, numberOr(config.canvas?.avatarScale, preset.avatarScale))),
            anchorMode: ANCHOR_MODE_IDS.includes(config.canvas?.anchorMode) ? config.canvas.anchorMode : 'avatar',
        },
        theme: { ...(THEMES[templateId] || THEMES.school), ...(config.theme || {}) },
        sizeKey: layout,
        sizes: {},
        avatar: normalizeAvatarState(config.avatar),
        elements: elements.length ? elements.slice(0, MAX_ELEMENTS) : makeElements(layout, name || 'STARGAZE', templateId),
        updatedAt: numberOr(config.updatedAt, 0),
    };
}

export function normalizeConfig(config, key = '', name = 'STARGAZE') {
    const fallback = createConfig(key || config?.characterKey || 'name:unknown', name);
    if (!config || typeof config !== 'object') return fallback;
    if (config.version !== CONFIG_VERSION) return migrateConfig(config, key || config.characterKey || fallback.characterKey, name);

    const layout = LAYOUTS[config.layout] ? config.layout : fallback.layout;
    const preset = LAYOUTS[layout];
    const theme = { ...fallback.theme, ...(config.theme || {}) };
    const width = Math.min(CANVAS_LIMITS.maxWidth, Math.max(CANVAS_LIMITS.minWidth, numberOr(config.canvas?.width, preset.width)));
    const height = Math.min(CANVAS_LIMITS.maxHeight, Math.max(CANVAS_LIMITS.minHeight, numberOr(config.canvas?.height, preset.height)));
    const oldMain = mainPortrait(config);
    const elements = Array.isArray(config.elements)
        ? config.elements.slice(0, MAX_ELEMENTS).map(clampElement)
        : fallback.elements;
    if (oldMain) { const marker = elements.find(e => e.id === safeIdentifier(oldMain.id)); if (marker) marker.photoRole = 'main'; }
    return {
        ...fallback,
        ...config,
        version: CONFIG_VERSION,
        appVersion: APP_VERSION,
        development: DEVELOPMENT,
        characterKey: key || String(config.characterKey || fallback.characterKey),
        layout,
        nickname: String(config.nickname || name || fallback.nickname),
        subtitle: String(config.subtitle || fallback.subtitle),
        canvas: {
            width,
            height,
            anchorX: Math.min(0.95, Math.max(0.05, numberOr(config.canvas?.anchorX, preset.anchorX))),
            anchorY: Math.min(0.95, Math.max(0.05, numberOr(config.canvas?.anchorY, preset.anchorY))),
            avatarScale: Math.min(80, Math.max(1.4, numberOr(config.canvas?.avatarScale, preset.avatarScale))),
            anchorMode: ANCHOR_MODE_IDS.includes(config.canvas?.anchorMode) ? config.canvas.anchorMode : 'avatar',
        },
        avatar: normalizeAvatarState(config.avatar),
        sizeKey: LAYOUTS[config.sizeKey] ? config.sizeKey : layout,
        sizes: normalizeSizeDrafts(config.sizes, theme),
        templateSizeDrafts: Object.fromEntries(Object.entries(config.templateSizeDrafts || {}).slice(0, 12)
            .filter(([id]) => TEMPLATE_LIST.some(template => template.id === id))
            .map(([id, drafts]) => [id, normalizeSizeDrafts(drafts, THEMES[id] || theme)])),
        theme,
        ...(config.shareMetadata?{shareMetadata:normalizeMetadata(config.shareMetadata)}:{}),
        elements,
        groups: normalizeGroups(config.groups),
        updatedAt: numberOr(config.updatedAt, 0),
    };
}

function normalizeGroups(list) {
    return Array.isArray(list)
        ? list.slice(0, 80).map((group, index) => ({
            id: safeIdentifier(group?.id || `grp-${index}`),
            name: String(group?.name || `分组 ${index + 1}`).slice(0, 40),
            visibilityMode: group?.visibilityMode === 'mask' ? 'mask' : '',
            collapsed: group?.collapsed === true,
            hidden: group?.hidden === true,
            locked: group?.locked === true,
            layer: group?.layer === 'front' ? 'front' : 'back',
            z: numberOr(group?.z, index),
        }))
        : [];
}

function normalizeSizeDrafts(sizes, baseTheme) {
    const output = {};
    if (!sizes || typeof sizes !== 'object') return output;
    for (const [key, state] of Object.entries(sizes).slice(0, 12)) {
        if (!state || typeof state !== 'object') continue;
        const layout = LAYOUTS[state.layout] ? state.layout : (LAYOUTS[key] ? key : CUSTOM_LAYOUT_ID);
        const preset = LAYOUTS[layout];
        output[String(key)] = {
            layout,
            templateId: TEMPLATE_LIST.some(t => t.id === state.templateId) ? state.templateId : '',
            canvas: {
                width: Math.min(CANVAS_LIMITS.maxWidth, Math.max(CANVAS_LIMITS.minWidth, numberOr(state.canvas?.width, preset.width))),
                height: Math.min(CANVAS_LIMITS.maxHeight, Math.max(CANVAS_LIMITS.minHeight, numberOr(state.canvas?.height, preset.height))),
                anchorX: Math.min(0.95, Math.max(0.05, numberOr(state.canvas?.anchorX, preset.anchorX))),
                anchorY: Math.min(0.95, Math.max(0.05, numberOr(state.canvas?.anchorY, preset.anchorY))),
                avatarScale: Math.min(80, Math.max(1.4, numberOr(state.canvas?.avatarScale, preset.avatarScale))),
                anchorMode: ANCHOR_MODE_IDS.includes(state.canvas?.anchorMode) ? state.canvas.anchorMode : 'avatar',
            },
            avatar: normalizeAvatarState(state.avatar),
            theme: { ...baseTheme, ...(state.theme || {}) },
            elements: Array.isArray(state.elements) ? state.elements.slice(0, MAX_ELEMENTS).map(clampElement) : [],
            groups: normalizeGroups(state.groups),
        };
    }
    return output;
}

function deepCopy(value) {
    if (globalThis.structuredClone) return globalThis.structuredClone(value);
    return JSON.parse(JSON.stringify(value));
}

export function captureSizeState(config) {
    return {
        layout: config.layout,
        templateId: config.templateId,
        canvas: deepCopy(config.canvas),
        avatar: deepCopy(config.avatar),
        theme: deepCopy(config.theme),
        elements: deepCopy(config.elements),
        groups: deepCopy(config.groups || []),
    };
}

export function applySizeState(config, state) {
    if (!state) return config;
    return {
        ...config,
        layout: state.layout,
        templateId: state.templateId || config.templateId,
        canvas: deepCopy(state.canvas),
        avatar: deepCopy(state.avatar),
        theme: deepCopy(state.theme),
        elements: deepCopy(state.elements),
        groups: deepCopy(state.groups || []),
    };
}

export function freshSizeState(source, presetId) {
    const layoutId = LAYOUTS[presetId] ? presetId : (presetId === CUSTOM_LAYOUT_ID ? CUSTOM_LAYOUT_ID : 'collage');
    const fresh = createConfig(source.characterKey, source.nickname, source.templateId, layoutId);
    return {
        layout: fresh.layout,
        canvas: { ...fresh.canvas },
        avatar: {
            ...fresh.avatar,
            hidden: false,
            hiddenId: '',
        },
        theme: { ...source.theme },
        elements: fresh.elements,
        groups: fresh.groups,
    };
}
