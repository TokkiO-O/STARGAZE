import { G, pattern, rowDots } from './base.js';

const STEEL = '#9aa1a9';
const DARK = '#2f3338';
const KHAKI = '#6b6450';
const AMBER = '#d9a13b';

export default [

    pattern('v10:mt-steel', '金属划痕板', '纸张', 12,
        "<g stroke='#8e949c' stroke-width='0.8' opacity='0.5'><path d='M0 0H12M0 0V12'/></g>"
        + "<g fill='#a8aeb6' opacity='0.35'><circle cx='3' cy='3' r='1'/><circle cx='9' cy='9' r='1'/></g>", '#c8cdd3'),
    pattern('v10:mt-canvas', '工装帆布', '纸张', 6,
        "<g stroke='#8c8570' stroke-width='0.7' opacity='0.55'><path d='M0 0H6M0 0V6'/></g>"
        + "<g stroke='#a39c85' stroke-width='0.4' opacity='0.5'><path d='M0 3H6M3 0V6'/></g>", '#b8b09a'),
    pattern('v10:mt-circuit', '电路线稿', '纸张', 24,
        "<g fill='none' stroke='#7d848c' stroke-width='1' opacity='0.75'>"
        + "<path d='M0 6H10V16H20'/><path d='M14 0V8H24'/><path d='M0 20H6V12'/></g>"
        + "<g fill='#6e757d' opacity='0.7'><circle cx='10' cy='16' r='1.6'/><circle cx='20' cy='16' r='1.6'/><circle cx='6' cy='12' r='1.6'/></g>", ''),
    G('v10:mt-frost', '磨砂塑料', '纸张', '0 0 120 120',
        "<rect width='120' height='120' fill='#e8ecf0' opacity='0.5'/>"
        + "<g stroke='#ffffff' stroke-width='1.4' opacity='0.55'>"
        + Array.from({ length: 7 }, (_, i) => `<path d='M${-20 + i * 26} 120L${20 + i * 26} 0'/>`).join('') + "</g>"),
    G('v10:mt-kraft', '档案牛皮卡', '纸张', '0 0 120 120',
        "<rect width='120' height='120' fill='#c9b183'/>"
        + "<g stroke='#a8905f' stroke-width='0.7' opacity='0.7'>"
        + Array.from({ length: 9 }, (_, i) => `<path d='M0 ${12 + i * 13}H120'/>`).join('') + "</g>"),

    G('v10:mt-rivet', '铆钉条', '装饰', '0 0 240 26',
        "<rect width='240' height='26' fill='#9aa1a9'/>"
        + Array.from({ length: 16 }, (_, i) => `<g><circle cx='${9 + i * 15}' cy='13' r='5.4' fill='#d6dbe1'/><circle cx='${9 + i * 15}' cy='12' r='2.4' fill='#eef1f4'/></g>`).join('')),
    G('v10:mt-rivet-dot', '铆钉', '装饰', '0 0 60 60',
        "<circle cx='30' cy='30' r='22' fill='#c2c8cf' stroke='#8e949c' stroke-width='2'/>"
        + "<circle cx='30' cy='27' r='11' fill='#e4e8ec'/><path d='M22 27H38' stroke='#aab1b8' stroke-width='2'/>"),
    G('v10:mt-screw', '螺丝', '装饰', '0 0 60 60',
        "<circle cx='30' cy='30' r='20' fill='#b6bcc4' stroke='#8b9299' stroke-width='2'/>"
        + "<path d='M18 30H42' stroke='#6e757d' stroke-width='4'/><path d='M18 22L42 38' stroke='#6e757d' stroke-width='2' opacity='0.6'/>"),
    G('v10:mt-gear', '齿轮', '装饰', '0 0 120 120',
        "<g fill='#b6bcc4'>" + Array.from({ length: 10 }, (_, i) => `<rect x='54' y='4' width='12' height='16' rx='2' transform='rotate(${i * 36} 60 60)'/>`).join('')
        + "</g><circle cx='60' cy='60' r='38' fill='#c6ccd3' stroke='#9aa1a9' stroke-width='2'/><circle cx='60' cy='60' r='12' fill='#eef1f4'/>"),
    G('v10:mt-chain', '粗链条', '装饰', '0 0 240 36',
        "<g fill='none' stroke='#9aa1a9' stroke-width='6'>"
        + Array.from({ length: 10 }, (_, i) => `<rect x='${4 + i * 24}' y='6' width='20' height='24' rx='10'/>`).join('') + "</g>"
        + "<g fill='none' stroke='#c8cdd3' stroke-width='2' opacity='0.8'>"
        + Array.from({ length: 10 }, (_, i) => `<rect x='${4 + i * 24}' y='6' width='20' height='24' rx='10'/>`).join('') + "</g>"),
    G('v10:mt-tape', '卷尺刻度', '装饰', '0 0 240 40',
        "<rect width='240' height='40' fill='#e6c766'/>"
        + "<g stroke='#3a3222' stroke-width='1.6'>"
        + Array.from({ length: 25 }, (_, i) => `<path d='M${4 + i * 9.6} 0v${i % 5 === 0 ? 20 : i % 2 === 0 ? 13 : 8}'/>`).join('') + "</g>"),
    G('v10:mt-webbing', '织带', '装饰', '0 0 240 40',
        "<rect width='240' height='40' fill='#6b6450'/>"
        + "<g stroke='#5a5443' stroke-width='2' opacity='0.85'>"
        + Array.from({ length: 24 }, (_, i) => `<path d='M${i * 10} 0V40'/>`).join('') + "</g>"
        + "<g stroke='#7d755e' stroke-width='0.8' opacity='0.6'>"
        + Array.from({ length: 4 }, (_, i) => `<path d='M0 ${6 + i * 10}H240'/>`).join('') + "</g>"),
    G('v10:mt-hazard', '警示条', '胶带', '0 0 120 30',
        "<rect width='120' height='30' fill='#e8c766'/>"
        + "<g stroke='#2f3338' stroke-width='9' opacity='0.85'>"
        + Array.from({ length: 6 }, (_, i) => `<path d='M${-10 + i * 24} 30L${6 + i * 24} 0'/>`).join('') + "</g>"),
    G('v10:mt-bolt', '警示虚线', '装饰', '0 0 240 20',
        "<path d='M0 10H240' stroke='#d9a13b' stroke-width='4' stroke-dasharray='12 10' opacity='0.9'/>"),
    G('v10:mt-gauge', '仪表盘', '装饰', '0 0 120 120',
        "<circle cx='60' cy='60' r='52' fill='#3a3f45' stroke='#9aa1a9' stroke-width='4'/>"
        + "<g stroke='#e8eef4' stroke-width='1.6'>"
        + Array.from({ length: 13 }, (_, i) => {
            const a = (-140 + i * 23.3) * Math.PI / 180;
            return `<path d='M${(60 + Math.cos(a) * 42).toFixed(1)} ${(60 + Math.sin(a) * 42).toFixed(1)}L${(60 + Math.cos(a) * 32).toFixed(1)} ${(60 + Math.sin(a) * 32).toFixed(1)}'/>`;
        }).join('') + "</g>"
        + "<path d='M60 60L84 38' stroke='#d9a13b' stroke-width='3' stroke-linecap='round'/><circle cx='60' cy='60' r='6' fill='#e8eef4'/>"),
    G('v10:mt-crack', '钢板裂痕', '装饰', '0 0 120 120',
        "<path d='M6 20L38 44L30 66L64 82L56 110' fill='none' stroke='#5b6167' stroke-width='2.4' stroke-linejoin='miter'/>"
        + "<path d='M38 44L58 40M64 82L92 74' fill='none' stroke='#5b6167' stroke-width='1.6'/>"),
    G('v10:mt-plate', '金属铭牌', '装饰', '0 0 240 80',
        "<rect x='2' y='2' width='236' height='76' rx='4' fill='#b8bfc6' stroke='#8b9299' stroke-width='2'/>"
        + "<rect x='10' y='10' width='220' height='60' rx='2' fill='none' stroke='#8b9299' stroke-width='1.2'/>"
        + "<g fill='#5b6167'>" + [0, 1, 2, 3].map(i => `<circle cx='${18 + i * 68}' cy='40' r='2.4'/>`).join('') + "</g>"),
    G('v10:mt-lock', '锁扣', '装饰', '0 0 80 120',
        "<rect x='10' y='46' width='60' height='66' rx='8' fill='#9aa1a9' stroke='#6e757d' stroke-width='2'/>"
        + "<path d='M24 46V28a16 16 0 0132 0v18' fill='none' stroke='#b6bcc4' stroke-width='7'/>"
        + "<circle cx='40' cy='76' r='7' fill='#2f3338'/>"),
    G('v10:mt-patch', '工装补丁', '装饰', '0 0 120 90',
        "<rect x='4' y='4' width='112' height='82' rx='4' fill='#8a8468'/>"
        + "<g stroke='#6f6a54' stroke-width='1.4' stroke-dasharray='4 4'><rect x='10' y='10' width='100' height='70' rx='2' fill='none'/></g>"),
    G('v10:mt-barcode', '条形码', '装饰', '0 0 120 70',
        "<rect width='120' height='70' fill='#f2f4f6'/>"
        + "<g fill='#1c2024'>" + Array.from({ length: 26 }, (_, i) => `<rect x='${6 + i * 4.2}' y='6' width='${i % 3 === 0 ? 2.4 : 1.2}' height='46'/>`).join('') + "</g>"
        + "<g fill='#1c2024' opacity='0.8'>" + Array.from({ length: 12 }, (_, i) => `<rect x='${6 + i * 9}' y='58' width='5' height='2'/>`).join('') + "</g>"),
    G('v10:mt-frag', '钢板碎片', '装饰', '0 0 120 100',
        "<path d='M6 18L52 4L112 22L104 76L58 96L10 74Z' fill='#b0b7be' stroke='#7d848c' stroke-width='2'/>"
        + "<g stroke='#8e949c' stroke-width='1' opacity='0.7'><path d='M22 30L94 40M20 56L96 62'/></g>"),
    G('v10:mt-holes', '冲孔带', '装饰', '0 0 240 24',
        "<rect width='240' height='24' fill='#a8aeb6' opacity='0.6'/>"
        + rowDots(240, 24, 12, 12, 9, '#2f3338')),
];
