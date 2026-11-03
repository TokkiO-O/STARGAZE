import { G, pattern } from './base.js';

const BLUE = '#a8cfe8';
const BLUE_D = '#7fb0d6';
const CREAM = '#f6efdf';
const KRAFT = '#c8b08a';
const PINK = '#ffd3dd';

export default [

    pattern('v10:school-loose', '活页横线纸', '纸张', 8,
        "<path d='M0 8H8' stroke='#bcd3e4' stroke-width='0.55' opacity='0.85'/>", '#fdfcf6'),
    pattern('v10:school-grid', '方格暗纹', '纸张', 9,
        "<path d='M0 0H9M0 0V9' stroke='#c9d9e6' stroke-width='0.5' opacity='0.55'/>", ''),
    pattern('v10:school-dot', '点阵暗纹', '纸张', 10,
        "<circle cx='5' cy='5' r='0.9' fill='#bcd3e4' opacity='0.6'/>", ''),
    G('v10:school-vellum', '硫酸纸', '纸张', '0 0 120 120',
        "<rect width='120' height='120' fill='#ffffff' opacity='0.5'/>"
        + "<g stroke='#dfeaf3' stroke-width='0.35' opacity='0.55'>"
        + Array.from({ length: 9 }, (_, i) => `<path d='M${i * 15} 0V120'/>`).join('') + "</g>"
        + "<g stroke='#ffffff' stroke-width='0.5' opacity='0.8'>"
        + Array.from({ length: 9 }, (_, i) => `<path d='M0 ${i * 15}H120'/>`).join('') + "</g>"),

    G('v10:school-ring', '活页圆环', '装饰', '0 0 120 60',
        [16, 60, 104].map(x => `<g><ellipse cx='${x}' cy='30' rx='15' ry='27' fill='none' stroke='#c3d2df' stroke-width='6'/>`
            + `<ellipse cx='${x}' cy='30' rx='15' ry='27' fill='none' stroke='#eef4f9' stroke-width='2' opacity='0.85'/></g>`).join('')),
    G('v10:school-hole', '打孔圆孔', '装饰', '0 0 40 40',
        "<circle cx='20' cy='20' r='13' fill='#eef4fa' stroke='#cfdde9' stroke-width='2'/>"
        + "<circle cx='20' cy='20' r='9.5' fill='#dbe6f0'/>"),
    G('v10:school-clip', '回形针', '装饰', '0 0 60 120',
        "<path d='M20 102V30a14 14 0 0128 0v64a10 10 0 01-20 0V44' fill='none' stroke='#c9d6e2' stroke-width='6.5' stroke-linecap='round'/>"
        + "<path d='M20 102V30a14 14 0 0128 0v64a10 10 0 01-20 0V44' fill='none' stroke='#eef3f8' stroke-width='2' stroke-linecap='round' opacity='0.9'/>"),
    G('v10:school-bulldog', '长尾夹', '装饰', '0 0 60 120',
        "<path d='M22 44V22a10 10 0 0120 0v22' fill='none' stroke='#b9c6d3' stroke-width='3.4'/>"
        + "<rect x='10' y='44' width='40' height='30' rx='5' fill='#d3dee8' stroke='#aebbc8' stroke-width='1.6'/>"
        + "<path d='M18 74l-8 40M42 74l8 40' stroke='#aebbc8' stroke-width='3' stroke-linecap='round'/>"),

    G('v10:school-index', '索引贴', '装饰', '0 0 90 60',
        "<path d='M2 2H88V42L70 60H2Z' fill='#cfe6f6' stroke='#a8cfe8' stroke-width='1.2'/>"
        + "<path d='M70 42H88L70 60Z' fill='#b6d9ee'/>"
        + "<g stroke='#8fbfdd' stroke-width='2' stroke-linecap='round' opacity='0.9'><path d='M14 20H64M14 32H54'/></g>"),
    G('v10:school-index-kraft', '牛皮索引贴', '装饰', '0 0 90 60',
        "<path d='M2 2H88V42L70 60H2Z' fill='#ecdfc6' stroke='#c8b08a' stroke-width='1.2'/>"
        + "<path d='M70 42H88L70 60Z' fill='#dcc9a6'/>"),
    G('v10:school-sticky', '便利贴', '装饰', '0 0 120 120',
        "<path d='M4 4H116V96L96 116H4Z' fill='#fff6c9' stroke='#ecd98f' stroke-width='1.2'/>"
        + "<path d='M96 116V96H116Z' fill='#f6e7a6'/>"
        + "<g stroke='#dfc97c' stroke-width='2' stroke-linecap='round' opacity='0.75'>"
        + "<path d='M18 34H96M18 50H88M18 66H96M18 82H70'/></g>"),
    G('v10:school-bookmark', '纸质书签', '装饰', '0 0 46 120',
        "<path d='M2 2H44V118L23 100L2 118Z' fill='#f7f1e2' stroke='#d8c9a8' stroke-width='1.2'/>"
        + "<g stroke='#c8b08a' stroke-width='1.4' opacity='0.8'><path d='M10 22H36M10 34H30M10 46H36'/></g>"
        + `<circle cx='23' cy='70' r='8' fill='none' stroke='${BLUE_D}' stroke-width='1.6'/>`),
    G('v10:school-ruler', '透明直尺', '装饰', '0 0 240 60',
        "<rect x='1' y='8' width='238' height='44' rx='4' fill='#fff7e2' fill-opacity='0.82' stroke='#e3cf9f' stroke-width='1.4'/>"
        + "<g stroke='#c8ab6a' stroke-width='1.1'>"
        + Array.from({ length: 23 }, (_, i) => `<path d='M${8 + i * 10} 8v${i % 5 === 0 ? 18 : i % 2 === 0 ? 12 : 8}'/>`).join('')
        + "</g><g fill='#b99f6c' opacity='0.85'>"
        + Array.from({ length: 5 }, (_, i) => `<text x='${10 + i * 50}' y='46' font-size='11'>${(i + 1) * 5}</text>`).join('')
        + "</g>"),
    G('v10:school-pencil', '铅笔', '装饰', '0 0 240 34',
        "<rect x='30' y='8' width='186' height='18' fill='#f2d98a' stroke='#d9bd6a' stroke-width='1'/>"
        + "<path d='M30 8L6 17l24 9Z' fill='#f3e6c8' stroke='#d9bd6a'/><path d='M14 14.5L6 17l8 2.5Z' fill='#4a4a4a'/>"
        + "<rect x='216' y='8' width='20' height='18' fill='#e8b7c2' stroke='#d9a3b0'/>"
        + "<rect x='30' y='8' width='186' height='6' fill='#ffffff' opacity='0.45'/>"),
    G('v10:school-eraser', '橡皮', '装饰', '0 0 90 56',
        "<rect x='2' y='12' width='86' height='34' rx='4' fill='#fdfcf6' stroke='#d8cbb2' stroke-width='1.4'/>"
        + "<rect x='2' y='12' width='26' height='34' fill='#cfe0ee' stroke='#a8cfe8'/>"
        + "<g stroke='#cbbfa6' stroke-width='1.2' opacity='0.7'><path d='M40 22H78M40 32H70'/></g>"),
    G('v10:school-stampedge', '齿边邮票框', '装饰', '0 0 120 120',
        "<rect x='8' y='8' width='104' height='104' fill='#fdfcf6' stroke='#dbe7f1' stroke-width='0'/>"
        + "<rect x='8' y='8' width='104' height='104' fill='none' stroke='#a8cfe8' stroke-width='2' stroke-dasharray='1 9' stroke-linecap='round'/>"
        + "<rect x='17' y='17' width='86' height='86' fill='none' stroke='#cfe0ee' stroke-width='1'/>"),
    G('v10:school-tick', '小刻度', '装饰', '0 0 120 24',
        "<g stroke='#a8cfe8' stroke-width='1.3'>"
        + Array.from({ length: 13 }, (_, i) => `<path d='M${4 + i * 9.5} 0v${i % 3 === 0 ? 14 : 7}'/>`).join('') + "</g>"),
    G('v10:school-tape', '薄荷胶带', '胶带', '0 0 120 40',
        "<rect width='120' height='40' fill='#cfe8dd' opacity='0.88'/>"
        + "<g stroke='#ffffff' stroke-width='6' opacity='0.72'><path d='M-10 30L30 -10M20 40L60 0M50 40L90 0M80 40L120 0'/></g>"),
    G('v10:school-taperoll', '胶带卷', '装饰', '0 0 120 120',
        "<circle cx='60' cy='60' r='54' fill='#e7f2e9' stroke='#c3d9cb' stroke-width='2'/>"
        + "<circle cx='60' cy='60' r='30' fill='#fdfcf6' stroke='#c3d9cb' stroke-width='2'/>"
        + "<g stroke='#b9d6c6' stroke-width='1.2' opacity='0.8'>"
        + [40, 46, 52].map(r => `<circle cx='60' cy='60' r='${r}' fill='none'/>`).join('') + "</g>"),

    G('v10:school-sakura', '樱花', '装饰', '0 0 120 120',
        "<g fill='#ffd3dd' stroke='#f2b3c4' stroke-width='1'>"
        + [0, 72, 144, 216, 288].map(a => `<ellipse cx='60' cy='34' rx='13' ry='21' transform='rotate(${a} 60 60)'/>`).join('')
        + "</g><circle cx='60' cy='60' r='7' fill='#fff3f6' stroke='#f2b3c4'/>"),
    G('v10:school-petal', '花瓣', '装饰', '0 0 60 40',
        "<path d='M4 30C10 12 34 4 56 8c-6 18-28 26-52 22Z' fill='#ffd9e2' stroke='#f2b3c4' stroke-width='1'/>"),
    G('v10:school-star', '细线星', '闪亮', '0 0 120 120',
        "<path d='M60 8L70 48L110 58L70 68L60 108L50 68L10 58L50 48Z' fill='none' stroke='#8fbfdd' stroke-width='2' stroke-linejoin='round'/>"),
    G('v10:school-star-solid', '实心小星', '闪亮', '0 0 120 120',
        "<path d='M60 10L71 46L108 57L71 68L60 104L49 68L12 57L49 46Z' fill='#ffe6a8' stroke='#e9c96f' stroke-width='1.2'/>"),
    G('v10:school-cloud', '迷你云朵', '装饰', '0 0 120 70',
        "<path d='M28 56a16 16 0 010-32a20 20 0 0138-6a16 16 0 0116 38Z' fill='#ffffff' stroke='#dbe7f1' stroke-width='1.4'/>"),
    G('v10:school-bow', '缎带蝴蝶结', '装饰', '0 0 120 80',
        "<path d='M56 40C40 20 12 22 14 40s26 22 42 2Z' fill='#ffd9e2' stroke='#f2b3c4' stroke-width='1.4'/>"
        + "<path d='M64 40C80 20 108 22 106 40s-26 22-42 2Z' fill='#ffd9e2' stroke='#f2b3c4' stroke-width='1.4'/>"
        + "<rect x='52' y='32' width='16' height='16' rx='4' fill='#f7c3d0' stroke='#f2b3c4'/>"
        + "<path d='M56 48l-8 26M64 48l8 26' stroke='#f2b3c4' stroke-width='4' stroke-linecap='round'/>"),
    G('v10:school-washi', '和纸胶带', '胶带', '0 0 120 36',
        "<rect width='120' height='36' fill='#dceaf6' opacity='0.9'/>"
        + "<g fill='#ffffff' opacity='0.7'>"
        + Array.from({ length: 6 }, (_, i) => `<circle cx='${10 + i * 20}' cy='18' r='4'/>`).join('') + "</g>"),
];
