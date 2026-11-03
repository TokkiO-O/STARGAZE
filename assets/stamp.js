import { G, pattern } from './base.js';

const BROWN = '#8a6a45';
const BEAN = '#a4595a';
const CREAM = '#f7edd8';
const CARD = '#efe3c8';

function stampBody(w, h, inner, frame, fill = CREAM) {
    const r = Math.max(3, w * 0.03);
    const step = r * 2.2;
    let body = `<g fill='${fill}'>`;
    body += `<rect x='${r}' y='${r}' width='${(w - r * 2).toFixed(1)}' height='${(h - r * 2).toFixed(1)}'/>`;
    for (let x = r; x <= w - r + 0.01; x += step) {
        body += `<circle cx='${x.toFixed(1)}' cy='${r}' r='${r}'/>`;
        body += `<circle cx='${x.toFixed(1)}' cy='${(h - r).toFixed(1)}' r='${r}'/>`;
    }
    for (let y = r + step; y < h - r - step * 0.5; y += step) {
        body += `<circle cx='${r}' cy='${y.toFixed(1)}' r='${r}'/>`;
        body += `<circle cx='${(w - r).toFixed(1)}' cy='${y.toFixed(1)}' r='${r}'/>`;
    }
    body += '</g>';
    body += `<rect x='${frame}' y='${frame}' width='${(w - frame * 2).toFixed(1)}' height='${(h - frame * 2).toFixed(1)}' fill='none' stroke='${BROWN}' stroke-width='1.6'/>`;
    return body + (inner || '');
}

export default [

    G('v10:sp-sheet', '集邮黑卡', '纸张', '0 0 120 120',
        "<rect width='120' height='120' fill='#2b2a29'/>"
        + "<g stroke='#3d3b39' stroke-width='0.6'>" + Array.from({ length: 8 }, (_, i) => `<path d='M0 ${15 * i}H120'/>`).join('') + "</g>"),
    G('v10:sp-album', '收藏米卡', '纸张', '0 0 120 120',
        "<rect width='120' height='120' fill='#efe3c8'/>"
        + "<g fill='#dccbaa' opacity='0.6'>"
        + Array.from({ length: 30 }, (_, i) => `<circle cx='${(i * 37) % 120}' cy='${(i * 53) % 120}' r='0.7'/>`).join('') + "</g>"),
    pattern('v10:sp-perftex', '网点邮票底', '纸张', 5,
        "<circle cx='1.4' cy='1.4' r='0.9' fill='#a8905f' opacity='0.3'/><circle cx='3.6' cy='3.6' r='0.6' fill='#a8905f' opacity='0.22'/>", '#f7edd8'),
    G('v10:sp-sleeve', '护邮袋折痕', '纸张', '0 0 120 120',
        "<rect width='120' height='120' fill='#ffffff' opacity='0.28'/>"
        + "<g stroke='#ffffff' stroke-width='1' opacity='0.7'><path d='M0 40H120M0 78H120'/>"
        + "<path d='M0 40L120 78' opacity='0.35'/></g>"),

    G('v10:sp-perf', '齿孔框', '装饰', '0 0 120 120',
        "<rect x='6' y='6' width='108' height='108' fill='none' stroke='#efe6d4' stroke-width='12' stroke-dasharray='1 12' stroke-linecap='round'/>"),
    G('v10:sp-stamp', '齿孔邮票', '装饰', '0 0 120 150',
        stampBody(120, 150, "<rect x='14' y='14' width='92' height='106' fill='none' stroke='#c9a97a' stroke-width='0.8'/>"
            + "<text x='60' y='138' text-anchor='middle' font-size='11' fill='#8a6a45' opacity='0.85'>POSTA</text>", 6)),
    G('v10:sp-stamp-wide', '长条联票', '装饰', '0 0 240 90',
        stampBody(240, 90, "<g stroke='#c9a97a' stroke-width='1'><path d='M80 8V82M160 8V82'/></g>", 6)),
    G('v10:sp-block', '四方联', '装饰', '0 0 160 160',
        stampBody(160, 160, "<g stroke='#c9a97a' stroke-width='1'><path d='M80 6V154M6 80H154'/></g>", 6)),
    G('v10:sp-flower', '花卉票图', '装饰', '0 0 120 120',
        "<g fill='#e3b7bb' stroke='#c98f97' stroke-width='1'>"
        + [0, 60, 120, 180, 240, 300].map(a => `<ellipse cx='60' cy='38' rx='10' ry='16' transform='rotate(${a} 60 60)'/>`).join('') + "</g>"
        + "<circle cx='60' cy='60' r='8' fill='#f4d98a'/><path d='M60 68v42' stroke='#a9b39a' stroke-width='2.4'/>"),

    G('v10:sp-postmark', '纪念邮戳', '装饰', '0 0 120 120',
        "<g fill='none' stroke='#7d6a58' stroke-width='2' opacity='0.75'>"
        + "<circle cx='60' cy='60' r='44'/><circle cx='60' cy='60' r='34' stroke-dasharray='3 3'/>"
        + "<path d='M60 16V104M16 60H104'/></g>"
        + "<text x='60' y='50' text-anchor='middle' font-size='13' fill='#7d6a58' opacity='0.8'>STAR</text>"
        + "<text x='60' y='80' text-anchor='middle' font-size='13' fill='#7d6a58' opacity='0.8'>2026</text>"),
    G('v10:sp-postmark-sq', '方邮戳', '装饰', '0 0 130 100',
        "<g fill='none' stroke='#a4595a' stroke-width='2' opacity='0.8'>"
        + "<rect x='6' y='18' width='118' height='64' rx='3'/><rect x='13' y='25' width='104' height='50' rx='2' stroke-dasharray='3 3'/>"
        + "<path d='M6 50H124'/></g>"),
    G('v10:sp-steel', '纪念钢印', '装饰', '0 0 120 120',
        "<circle cx='60' cy='60' r='42' fill='none' stroke='#8a6a45' stroke-width='3' stroke-dasharray='2 4' opacity='0.8'/>"
        + "<circle cx='60' cy='60' r='30' fill='none' stroke='#8a6a45' stroke-width='1.2' opacity='0.7'/>"
        + "<path d='M60 34v52M34 60h52' stroke='#8a6a45' stroke-width='1.6' opacity='0.7'/>"),
    G('v10:sp-loupe', '放大镜', '装饰', '0 0 100 140',
        "<circle cx='44' cy='44' r='34' fill='#eaf2f7' fill-opacity='0.45' stroke='#b09a72' stroke-width='8'/>"
        + "<path d='M70 72l22 54' stroke='#b09a72' stroke-width='11' stroke-linecap='round'/>"),
    G('v10:sp-tweezers', '镊子', '装饰', '0 0 60 200',
        "<path d='M20 6L26 130L30 196M40 6L34 130L30 196' fill='none' stroke='#b6bcc4' stroke-width='4' stroke-linecap='round'/>"
        + "<path d='M20 6L26 130M40 6L34 130' fill='none' stroke='#e8ecf0' stroke-width='1.2' opacity='0.9'/>"),
    G('v10:sp-airmail', '航空虚线', '装饰', '0 0 240 20',
        "<g stroke='#a4595a' stroke-width='3' opacity='0.85'><path d='M0 6H240' stroke-dasharray='16 10'/></g>"
        + "<g stroke='#8fa3b5' stroke-width='3' opacity='0.7'><path d='M0 15H240' stroke-dasharray='16 10'/></g>"),
    G('v10:sp-string', '细邮绳', '装饰', '0 0 240 30',
        "<path d='M2 16C48 4 92 26 138 12S200 4 238 18' fill='none' stroke='#b09a72' stroke-width='2.4'/>"),
    G('v10:sp-postbox', '迷你邮筒', '装饰', '0 0 80 120',
        "<rect x='10' y='24' width='60' height='88' rx='8' fill='#a4595a' stroke='#8a4748' stroke-width='2'/>"
        + "<path d='M10 44a30 30 0 0160 0' fill='#b56a6a' stroke='#8a4748' stroke-width='2'/>"
        + "<rect x='24' y='54' width='32' height='7' rx='3' fill='#2b2a29'/>"),
];
