import { G, pattern } from './base.js';

const CREAM = '#fdf0d5';
const MINT = '#bfe3c8';
const PEACH = '#ffc9c2';
const CRAYON = '#e8a05c';

export default [

    pattern('v10:fy-paper', '彩铅纸', '纸张', 5,
        "<g stroke='#e6d3ae' stroke-width='0.5' opacity='0.5'><path d='M0 0H5M0 0V5'/></g>"
        + "<g stroke='#f0e2c4' stroke-width='0.4' opacity='0.5'><path d='M0 2.5H5'/></g>", '#fffdf6'),
    pattern('v10:fy-crayontex', '蜡笔肌理', '纸张', 7,
        "<g stroke='#f0d9b4' stroke-width='1.6' opacity='0.55'><path d='M-2 8C2 3 5 10 9 5'/></g>", ''),
    G('v10:fy-watercolor', '水彩晕染', '纸张', '0 0 120 120',
        "<g opacity='0.5'><ellipse cx='40' cy='44' rx='38' ry='30' fill='#ffd9cf'/><ellipse cx='82' cy='72' rx='34' ry='28' fill='#cfe8d6'/>"
        + "<ellipse cx='58' cy='58' rx='26' ry='22' fill='#ffe9b8'/></g>"),
    G('v10:fy-crayonline', '蜡笔线', '装饰', '0 0 240 120',
        "<path d='M4 100C46 40 74 96 118 58S190 22 236 44' stroke='#f0a8b6' stroke-width='7' fill='none' stroke-linecap='round' opacity='0.75'/>"),

    G('v10:fy-cloud', '软云朵', '装饰', '0 0 160 100',
        "<path d='M40 84a22 22 0 010-44a28 28 0 0154-8a22 22 0 0122 52Z' fill='#ffffff' stroke='#e6dcc8' stroke-width='2'/>"),
    G('v10:fy-cloudband', '云朵花边', '装饰', '0 0 240 50',
        Array.from({ length: 6 }, (_, i) => `<g><circle cx='${20 + i * 40}' cy='34' r='18' fill='#ffffff' stroke='#e6dcc8' stroke-width='1.6'/>`
            + `<circle cx='${40 + i * 40}' cy='30' r='22' fill='#ffffff' stroke='#e6dcc8' stroke-width='1.6'/></g>`).join('')),
    G('v10:fy-rainbow', '彩虹', '装饰', '0 0 240 120',
        "<g fill='none' stroke-width='12' stroke-linecap='round'>"
        + "<path d='M16 112a104 104 0 01208 0' stroke='#ffc9cf'/><path d='M36 112a84 84 0 01168 0' stroke='#ffdca8'/>"
        + "<path d='M56 112a64 64 0 01128 0' stroke='#cfe6b8'/><path d='M76 112a44 44 0 0188 0' stroke='#bcd9f2'/></g>"),
    G('v10:fy-candy', '糖果', '装饰', '0 0 160 80',
        "<ellipse cx='80' cy='40' rx='34' ry='24' fill='#ffd6e2' stroke='#f2aec2' stroke-width='2'/>"
        + "<path d='M46 40L8 16V64Z' fill='#ffc2d4' stroke='#f2aec2' stroke-width='2'/>"
        + "<path d='M114 40L152 16V64Z' fill='#ffc2d4' stroke='#f2aec2' stroke-width='2'/>"),
    G('v10:fy-balloon', '气球', '装饰', '0 0 100 160',
        "<ellipse cx='50' cy='52' rx='36' ry='44' fill='#ffd9e6' stroke='#f0b3c9' stroke-width='2'/>"
        + "<path d='M50 96l-8 10h16Z' fill='#f0b3c9'/><path d='M50 106c10 14-10 22 0 44' stroke='#d9c7b8' stroke-width='2' fill='none'/>"),
    G('v10:fy-bear', '小熊', '装饰', '0 0 120 120',
        "<circle cx='32' cy='34' r='15' fill='#e3c6a4'/><circle cx='88' cy='34' r='15' fill='#e3c6a4'/>"
        + "<circle cx='60' cy='62' r='38' fill='#efd7ba'/><circle cx='47' cy='56' r='4' fill='#6b5645'/><circle cx='73' cy='56' r='4' fill='#6b5645'/>"
        + "<ellipse cx='60' cy='72' rx='9' ry='7' fill='#fff4e6'/><circle cx='60' cy='69' r='3.4' fill='#6b5645'/>"),
    G('v10:fy-rabbit', '小兔子', '装饰', '0 0 110 130',
        "<ellipse cx='38' cy='26' rx='9' ry='22' fill='#fdf3f0' stroke='#e5d3cd' stroke-width='1.6'/>"
        + "<ellipse cx='72' cy='26' rx='9' ry='22' fill='#fdf3f0' stroke='#e5d3cd' stroke-width='1.6'/>"
        + "<circle cx='55' cy='82' r='34' fill='#fdf3f0' stroke='#e5d3cd' stroke-width='1.6'/>"
        + "<circle cx='44' cy='78' r='3.6' fill='#6b5645'/><circle cx='66' cy='78' r='3.6' fill='#6b5645'/>"
        + "<path d='M55 88l-4 4h8Z' fill='#f0b3c9'/>"),
    G('v10:fy-cake', '纸杯蛋糕', '装饰', '0 0 110 130',
        "<path d='M18 60H92L82 120H28Z' fill='#ffe1c9' stroke='#e8c4a4' stroke-width='2'/>"
        + "<path d='M18 60c0-26 16-40 37-40s37 14 37 40Z' fill='#ffd9e6' stroke='#f0b3c9' stroke-width='2'/>"
        + "<circle cx='55' cy='22' r='7' fill='#f28a9e'/><path d='M28 78H82M26 94H84' stroke='#e8c4a4' stroke-width='2'/>"),
    G('v10:fy-grass', '小草野花', '装饰', '0 0 160 100',
        "<path d='M6 96C14 64 22 54 30 40M30 96C34 68 40 58 46 48M56 96C58 70 62 58 66 46M84 96C92 66 100 56 108 42M116 96C122 70 128 60 134 50'"
        + " stroke='#a8c99a' stroke-width='3.4' fill='none' stroke-linecap='round'/>"
        + "<g fill='#ffd9e6' stroke='#f0b3c9' stroke-width='1'>"
        + [[30, 36], [66, 42], [108, 38], [134, 46]].map(([x, y]) => `<circle cx='${x}' cy='${y}' r='6'/>`).join('') + "</g>"),
    G('v10:fy-dash', '蜡笔虚线', '装饰', '0 0 240 40',
        "<path d='M4 34C50 6 90 34 132 14S206 4 236 20' fill='none' stroke='#e8a05c' stroke-width='4' stroke-dasharray='10 9' stroke-linecap='round' opacity='0.8'/>"),
    G('v10:fy-cotton', '棉花团', '装饰', '0 0 120 100',
        "<g fill='#ffffff' stroke='#eadfcd' stroke-width='1.4'>"
        + "<circle cx='38' cy='52' r='22'/><circle cx='62' cy='40' r='24'/><circle cx='84' cy='56' r='20'/><circle cx='60' cy='66' r='20'/></g>"),
    G('v10:fy-house', '小房子', '装饰', '0 0 120 120',
        "<path d='M18 58L60 22L102 58V106H18Z' fill='#ffe1c9' stroke='#e8c4a4' stroke-width='2'/>"
        + "<path d='M10 58L60 16L110 58' fill='none' stroke='#f2aec2' stroke-width='7' stroke-linecap='round'/>"
        + "<rect x='50' y='76' width='20' height='30' fill='#cfe6d6' stroke='#a8c99a' stroke-width='2'/>"),
    G('v10:fy-bubble', '圆点泡泡', '装饰', '0 0 120 120',
        "<g fill='#ffffff' opacity='0.9' stroke='#e6dcc8' stroke-width='1'>"
        + [[28, 34, 12], [66, 24, 8], [88, 52, 14], [40, 70, 9], [72, 84, 11]].map(([x, y, r]) => `<circle cx='${x}' cy='${y}' r='${r}'/>`).join('')
        + "</g>"),
    G('v10:fy-bow', '圆角蝴蝶结', '装饰', '0 0 120 80',
        "<path d='M54 40C38 22 12 24 14 40s24 18 40 0Z' fill='#ffd9e6' stroke='#f0b3c9' stroke-width='2'/>"
        + "<path d='M66 40C82 22 108 24 106 40s-24 18-40 0Z' fill='#ffd9e6' stroke='#f0b3c9' stroke-width='2'/>"
        + "<circle cx='60' cy='40' r='9' fill='#ffc2d4' stroke='#f0b3c9' stroke-width='2'/>"),
    G('v10:fy-starsoft', '软星星', '闪亮', '0 0 120 120',
        "<path d='M60 12C64 40 80 56 108 60C80 64 64 80 60 108C56 80 40 64 12 60C40 56 56 40 60 12Z' fill='#fff3c9' stroke='#f0d98a' stroke-width='2'/>"),
    G('v10:fy-sun', '小太阳', '装饰', '0 0 120 120',
        "<circle cx='60' cy='60' r='26' fill='#ffe6a8' stroke='#f0cf7a' stroke-width='2'/>"
        + "<g stroke='#f0cf7a' stroke-width='4' stroke-linecap='round'>"
        + Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return `<path d='M${(60 + Math.cos(a) * 34).toFixed(1)} ${(60 + Math.sin(a) * 34).toFixed(1)}L${(60 + Math.cos(a) * 46).toFixed(1)} ${(60 + Math.sin(a) * 46).toFixed(1)}'/>`;
        }).join('') + "</g>"),
];
