import { G, pattern } from './base.js';

const ROSE = '#c88293';
const CREAM = '#fffbf8';
const LILAC = '#b3a6c4';

function scallop(y, count, r, fill) {
    let body = '';
    for (let i = 0; i < count; i += 1) {
        const x = (240 / count) * (i + 0.5);
        body += `<circle cx='${x.toFixed(1)}' cy='${y}' r='${r}' fill='${fill}'/>`;
        body += `<circle cx='${x.toFixed(1)}' cy='${y}' r='${(r * 0.34).toFixed(1)}' fill='none' stroke='${ROSE}' stroke-width='0.8' opacity='0.5'/>`;
    }
    return body;
}

export default [

    pattern('v10:fr-floral', '碎花布', '纸张', 28, (() => {
        const flower = (cx, cy, r, fill, stroke) => "<g fill='" + fill + "' stroke='" + stroke + "' stroke-width='0.55'>"
            + [0, 72, 144, 216, 288].map(a => `<ellipse cx='${cx}' cy='${(cy - r * 0.55).toFixed(1)}' rx='${(r * 0.4).toFixed(1)}' ry='${(r * 0.62).toFixed(1)}' transform='rotate(${a} ${cx} ${cy})'/>`).join('')
            + "</g>" + `<circle cx='${cx}' cy='${cy}' r='${(r * 0.24).toFixed(1)}' fill='#f0c882'/>`;
        return flower(7, 7, 4.8, '#eeb6c4', '#d99aa9') + flower(21, 20, 3.8, '#f4d2da', '#dfa8b6')
            + "<g fill='#a9c19c' opacity='0.9'><ellipse cx='18' cy='5' rx='3' ry='1.6' transform='rotate(-28 18 5)'/>"
            + "<ellipse cx='4' cy='22' rx='2.6' ry='1.4' transform='rotate(24 4 22)'/></g>";
    })(), '#fdf7f4'),
    pattern('v10:fr-linen', '亚麻', '纸张', 5,
        "<g stroke='#b8a396' stroke-width='0.5' opacity='0.75'><path d='M0 0H5M0 0V5'/></g>"
        + "<g stroke='#c4b3a8' stroke-width='0.4' opacity='0.6'><path d='M0 2.5H5'/></g>", '#faf3ee'),
    G('v10:fr-tulle', '薄纱', '纸张', '0 0 120 120',
        "<rect width='120' height='120' fill='#ffffff' opacity='0.5'/>"
        + "<g fill='none' stroke='#d8c3cc' stroke-width='1.1' opacity='0.85'>"
        + Array.from({ length: 5 }, (_, i) => `<path d='M-4 ${14 + i * 24}C30 ${4 + i * 24} 60 ${26 + i * 24} 124 ${10 + i * 24}'/>`).join('')
        + "</g>"
        + "<g fill='none' stroke='#ffffff' stroke-width='2.4' opacity='0.9'>"
        + Array.from({ length: 5 }, (_, i) => `<path d='M-4 ${10 + i * 24}C30 ${0 + i * 24} 60 ${22 + i * 24} 124 ${6 + i * 24}'/>`).join('')
        + "</g>"),
    pattern('v10:fr-embroidery', '刺绣卷草', '纸张', 30,
        "<path d='M4 26C10 12 22 8 26 16' fill='none' stroke='#bf9299' stroke-width='1' opacity='0.8'/>", ''),

    G('v10:fr-lace', '镂空蕾丝边', '蕾丝', '0 0 240 40',
        "<rect width='240' height='26' fill='#fffdfa' opacity='0.95'/>"
        + scallop(26, 16, 9, '#fffdfa')
        + "<g stroke='#c6a0a6' stroke-width='0.7' opacity='0.85'>"
        + Array.from({ length: 12 }, (_, i) => `<circle cx='${10 + i * 20}' cy='12' r='3.4' fill='none'/>`).join('') + "</g>"),
    G('v10:fr-lace-v', '竖蕾丝边', '蕾丝', '0 0 40 240',
        "<rect width='26' height='240' fill='#fffdfa' opacity='0.95'/>"
        + Array.from({ length: 16 }, (_, i) => `<circle cx='26' cy='${(240 / 16) * (i + 0.5)}' r='9' fill='#fffdfa'/>`).join('')
        + "<g stroke='#c6a0a6' stroke-width='0.7' opacity='0.8'>"
        + Array.from({ length: 12 }, (_, i) => `<circle cx='13' cy='${10 + i * 20}' r='3.4' fill='none'/>`).join('') + "</g>"),
    G('v10:fr-lace-ring', '环形蕾丝', '蕾丝', '0 0 240 240', (() => {
        let body = "<circle cx='120' cy='120' r='103' fill='none' stroke='#fffdf8' stroke-width='24'/>";
        for (let i = 0; i < 40; i += 1) {
            const a = (i / 40) * Math.PI * 2;
            body += `<circle cx='${(120 + Math.cos(a) * 103).toFixed(1)}' cy='${(120 + Math.sin(a) * 103).toFixed(1)}' r='11.5' fill='#fffdf8'/>`;
        }
        for (let i = 0; i < 36; i += 1) {
            const a = (i / 36) * Math.PI * 2 + 0.09;
            body += `<circle cx='${(120 + Math.cos(a) * 104).toFixed(1)}' cy='${(120 + Math.sin(a) * 104).toFixed(1)}' r='4.4' fill='#fdf7f4'/>`;
        }
        for (let i = 0; i < 28; i += 1) {
            const a = (i / 28) * Math.PI * 2;
            body += `<circle cx='${(120 + Math.cos(a) * 91).toFixed(1)}' cy='${(120 + Math.sin(a) * 91).toFixed(1)}' r='5.2' fill='none' stroke='#c6a0a6' stroke-width='1.2'/>`;
        }
        body += "<circle cx='120' cy='120' r='116' fill='none' stroke='#c9a2a8' stroke-width='1.4'/>";
        body += "<circle cx='120' cy='120' r='90' fill='none' stroke='#c9a2a8' stroke-width='1.2'/>";
        return body;
    })()),
    G('v10:fr-oval', '椭圆蕾丝框', '蕾丝', '0 0 120 150',
        "<ellipse cx='60' cy='75' rx='52' ry='70' fill='#fffdfa' stroke='#c9a2a8' stroke-width='1.4'/>"
        + "<ellipse cx='60' cy='75' rx='44' ry='62' fill='none' stroke='#c8a0a8' stroke-width='1' stroke-dasharray='3 3'/>"
        + "<g fill='#fffdfa' stroke='#c9a2a8' stroke-width='0.8'>"
        + Array.from({ length: 18 }, (_, i) => {
            const a = (i / 18) * Math.PI * 2;
            return `<circle cx='${(60 + Math.cos(a) * 53).toFixed(1)}' cy='${(75 + Math.sin(a) * 71).toFixed(1)}' r='5'/>`;
        }).join('') + "</g>"),
    G('v10:fr-pearlframe', '珍珠圆框', '蕾丝', '0 0 120 120',
        "<circle cx='60' cy='60' r='52' fill='none' stroke='#fffdfa' stroke-width='6'/>"
        + Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const px = (60 + Math.cos(a) * 52).toFixed(1);
            const py = (60 + Math.sin(a) * 52).toFixed(1);
            return `<circle cx='${px}' cy='${(Number(py) + 0.8).toFixed(1)}' r='4.6' fill='#cfb2ac'/>`
                + `<circle cx='${px}' cy='${py}' r='4.4' fill='#fffdf8' stroke='#c3a898' stroke-width='0.6'/>`
                + `<circle cx='${(Number(px) - 1.4).toFixed(1)}' cy='${(Number(py) - 1.4).toFixed(1)}' r='1.5' fill='#ffffff'/>`;
        }).join('')),
    G('v10:fr-pearl-chain', '珍珠链', '蕾丝', '0 0 240 24',
        Array.from({ length: 30 }, (_, i) => {
            const x = 4 + i * 8;
            const y = 12 + Math.sin(i / 2.4) * 2.4;
            return `<circle cx='${x.toFixed(1)}' cy='${(y + 0.7).toFixed(1)}' r='3.8' fill='#cfb2ac'/>`
                + `<circle cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' r='3.6' fill='#fffdf8' stroke='#c3a898' stroke-width='0.6'/>`
                + `<circle cx='${(x - 1.1).toFixed(1)}' cy='${(y - 1.1).toFixed(1)}' r='1.2' fill='#ffffff'/>`;
        }).join('')),
    G('v10:fr-pendant', '珍珠吊坠', '蕾丝', '0 0 40 60',
        "<path d='M20 2v14' stroke='#b09c8d' stroke-width='1.8'/>"
        + "<circle cx='20' cy='40' r='17' fill='#cfb2ac'/>"
        + "<circle cx='20' cy='37' r='16.4' fill='#fffdf8' stroke='#c9a2a8' stroke-width='1'/>"
        + "<circle cx='14' cy='31' r='5' fill='#ffffff'/>"),

    G('v10:fr-daisy', '雏菊', '装饰', '0 0 120 120',
        "<g fill='#fffdf8' stroke='#c1a695' stroke-width='1'>"
        + [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<ellipse cx='60' cy='34' rx='9' ry='17' transform='rotate(${a} 60 60)'/>`).join('')
        + "</g><circle cx='60' cy='60' r='9' fill='#f4d98a'/>"),
    G('v10:fr-lily', '铃兰', '装饰', '0 0 80 140',
        "<path d='M40 138C38 96 32 58 25 16' stroke='#7d9474' stroke-width='3.4' fill='none' stroke-linecap='round'/>"
        + [[30, 32], [47, 56], [27, 80], [45, 104]].map(([x, y]) => "<g>"
            + `<path d='M${x} ${y}c-10 2-13 13-6 19c7 6 16 2 16-8c0-6-4-10-10-11Z' fill='#fffdf8' stroke='#b5a496' stroke-width='1.1'/>`
            + `<circle cx='${x + 1}' cy='${y + 17}' r='2.6' fill='#c2a795'/></g>`).join('')
        + "<g fill='#8fa583'><ellipse cx='54' cy='122' rx='10' ry='4.2' transform='rotate(-24 54 122)'/>"
        + "<ellipse cx='30' cy='60' rx='9' ry='3.8' transform='rotate(28 30 60)'/></g>"),
    G('v10:fr-vine', '藤蔓', '装饰', '0 0 120 160',
        "<path d='M10 156C40 128 26 92 58 70S100 48 112 10' stroke='#8fa583' stroke-width='2.4' fill='none'/>"
        + Array.from({ length: 7 }, (_, i) => {
            const x = 20 + i * 14;
            const y = 140 - i * 19;
            return `<ellipse cx='${x}' cy='${y}' rx='7' ry='3.6' fill='#b3c9a5' transform='rotate(${-30 + i * 12} ${x} ${y})'/>`;
        }).join('')),
    G('v10:fr-rose', '干玫瑰', '装饰', '0 0 120 140',
        "<g fill='#a87078' stroke='#a8656f' stroke-width='1'>"
        + Array.from({ length: 9 }, (_, i) => `<ellipse cx='60' cy='28' rx='15' ry='23' transform='rotate(${i * 40} 60 50)'/>`).join('')
        + "</g><g fill='#b87b83' stroke='#a8656f' stroke-width='0.9'>"
        + Array.from({ length: 6 }, (_, i) => `<ellipse cx='60' cy='34' rx='10' ry='16' transform='rotate(${i * 60 + 18} 60 50)'/>`).join('')
        + "<circle cx='60' cy='50' r='7'/></g>"
        + "<path d='M60 74v64' stroke='#a9b39a' stroke-width='2.8'/>"
        + "<path d='M60 102l-16-9M60 118l14-9' stroke='#a9b39a' stroke-width='2.2'/>"),
    G('v10:fr-shell', '贝壳', '装饰', '0 0 120 100',
        "<path d='M60 92C24 92 8 60 12 34C30 52 42 56 60 56s30-4 48-22c4 26-12 58-48 58Z' fill='#fdf3ee' stroke='#bf9299' stroke-width='1.4'/>"
        + "<g stroke='#bf9299' stroke-width='1' opacity='0.9'><path d='M60 56V90M42 54L36 88M78 54l6 34M26 46L22 78M94 46l4 32'/></g>"),
    G('v10:fr-bow', '布艺蝴蝶结', '装饰', '0 0 120 80',
        "<path d='M54 40C38 20 10 24 12 40s26 20 42 0Z' fill='#d9b3ba' stroke='#b98d95' stroke-width='1.4'/>"
        + "<path d='M66 40C82 20 110 24 108 40s-26 20-42 0Z' fill='#d9b3ba' stroke='#b98d95' stroke-width='1.4'/>"
        + "<rect x='52' y='32' width='16' height='16' rx='5' fill='#c99ba3' stroke='#b98d95'/>"
        + "<path d='M56 48l-8 26M64 48l8 26' stroke='#b98d95' stroke-width='4' stroke-linecap='round'/>"),
    G('v10:fr-ribbon', '纱飘带', '装饰', '0 0 240 90',
        "<path d='M4 56C44 40 80 66 120 50S192 32 236 46' fill='none' stroke='#e0bfc6' stroke-width='13' stroke-linecap='round' opacity='0.62'/>"
        + "<path d='M4 56C44 40 80 66 120 50S192 32 236 46' fill='none' stroke='#ffffff' stroke-width='2.6' stroke-linecap='round' opacity='0.85'/>"),
    G('v10:fr-sparkle', '细闪', '闪亮', '0 0 120 120',
        Array.from({ length: 5 }, (_, i) => {
            const x = 16 + (i * 43) % 96;
            const y = 14 + (i * 57) % 96;
            const s = i % 2 === 0 ? 9 : 6;
            return `<path d='M${x} ${y - s}L${x + s * 0.3} ${y - s * 0.3}L${x + s} ${y}L${x + s * 0.3} ${y + s * 0.3}L${x} ${y + s}L${x - s * 0.3} ${y + s * 0.3}L${x - s} ${y}L${x - s * 0.3} ${y - s * 0.3}Z' fill='#fff6f2' stroke='${LILAC}' stroke-width='0.6'/>`;
        }).join('')),
    G('v10:fr-frame', '雕花相框', '装饰', '0 0 120 150',
        "<rect x='8' y='8' width='104' height='134' rx='6' fill='none' stroke='#c6a0a6' stroke-width='7'/>"
        + "<rect x='16' y='16' width='88' height='118' rx='4' fill='none' stroke='#ffffff' stroke-width='1.6'/>"
        + [0, 1, 2, 3].map(i => {
            const x = i % 2 ? 112 : 8;
            const y = i < 2 ? 8 : 142;
            return `<circle cx='${x}' cy='${y}' r='6' fill='#d9b3ba' stroke='#b98d95' stroke-width='1'/>`;
        }).join('')),
];
