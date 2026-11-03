import { G, pattern, ringDots } from './base.js';

const PINK = '#ff8fd0';
const BLUE = '#4fc3ff';
const PURPLE = '#a45cff';

export default [

    G('v10:y2k-holo', '镭射渐变', '纸张', '0 0 120 120',
        "<defs><linearGradient id='h' x1='0' y1='0' x2='1' y2='1'>"
        + "<stop offset='0' stop-color='#ffd9f2'/><stop offset='0.35' stop-color='#d9e6ff'/><stop offset='0.65' stop-color='#d8fff2'/><stop offset='1' stop-color='#fff4cf'/>"
        + "</linearGradient></defs><rect width='120' height='120' fill='url(#h)'/>"
        + "<g stroke='#ffffff' stroke-width='1' opacity='0.5'><path d='M-20 30L60 -20M-20 80L100 -20M20 140L120 40'/></g>"),
    pattern('v10:y2k-grid', '像素网格', '纸张', 8,
        "<path d='M0 0H8M0 0V8' stroke='#c9b6ff' stroke-width='0.7' opacity='0.55'/>", ''),
    pattern('v10:y2k-brush', '金属拉丝', '纸张', 6,
        "<path d='M0 0H6' stroke='#ffffff' stroke-width='1.4' opacity='0.5'/><path d='M0 3H6' stroke='#c9ced8' stroke-width='0.8' opacity='0.5'/>", '#dfe6f0'),
    G('v10:y2k-sparkle', '闪粉', '闪亮', '0 0 120 120',
        Array.from({ length: 40 }, (_, i) => {
            const x = (i * 37) % 120;
            const y = (i * 61) % 120;
            const r = i % 5 === 0 ? 1.8 : 0.9;
            return `<circle cx='${x}' cy='${y}' r='${r}' fill='#ffffff' opacity='${i % 3 === 0 ? 0.9 : 0.6}'/>`;
        }).join('')),
    G('v10:y2k-bubble', '气泡色块', '纸张', '0 0 120 120',
        "<defs><linearGradient id='b' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#ffb8e6'/><stop offset='1' stop-color='#9fe4ff'/></linearGradient></defs>"
        + "<path d='M60 6c30 0 54 20 54 48s-24 48-54 48S6 82 6 54 30 6 60 6Z' fill='url(#b)' opacity='0.75'/>"
        + "<ellipse cx='44' cy='34' rx='14' ry='9' fill='#ffffff' opacity='0.5' transform='rotate(-20 44 34)'/>"),

    G('v10:y2k-chain', '金属链条', '装饰', '0 0 240 30',
        "<g fill='none' stroke='#c9ced8' stroke-width='3.4'>"
        + Array.from({ length: 16 }, (_, i) => `<ellipse cx='${8 + i * 15}' cy='15' rx='7' ry='9'/>`).join('') + "</g>"
        + "<g fill='none' stroke='#eef1f6' stroke-width='1.2' opacity='0.8'>"
        + Array.from({ length: 16 }, (_, i) => `<ellipse cx='${8 + i * 15}' cy='14' rx='6' ry='8'/>`).join('') + "</g>"),
    G('v10:y2k-chain-v', '竖链条', '装饰', '0 0 30 240',
        "<g fill='none' stroke='#c9ced8' stroke-width='3.4'>"
        + Array.from({ length: 16 }, (_, i) => `<ellipse cx='15' cy='${8 + i * 15}' rx='9' ry='7'/>`).join('') + "</g>"),

    G('v10:y2k-pixel-star', '像素星', '闪亮', '0 0 120 120',
        "<g fill='#ffe27a'><rect x='48' y='0' width='24' height='24'/><rect x='48' y='96' width='24' height='24'/>"
        + "<rect x='0' y='48' width='24' height='24'/><rect x='96' y='48' width='24' height='24'/>"
        + "<rect x='24' y='24' width='72' height='72'/></g><rect x='48' y='48' width='24' height='24' fill='#fff8d0'/>"),
    G('v10:y2k-sparkstar', '十字闪星', '闪亮', '0 0 120 120',
        "<path d='M60 2L66 48L112 60L66 72L60 118L54 72L8 60L54 48Z' fill='#ffffff'/>"
        + "<path d='M60 26L64 54L92 60L64 66L60 94L56 66L28 60L56 54Z' fill='#ffe9fb'/>"),
    G('v10:y2k-heart', '渐变爱心', '装饰', '0 0 120 110',
        "<defs><linearGradient id='lh' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#ffb3e2'/><stop offset='1' stop-color='#ff5aa8'/></linearGradient></defs>"
        + "<path d='M60 100C24 76 6 56 6 36A26 26 0 0160 26A26 26 0 01114 36C114 56 96 76 60 100Z' fill='url(#lh)' stroke='#ffffff' stroke-width='4'/>"),
    G('v10:y2k-pixelheart', '像素爱心', '装饰', '0 0 120 120',
        "<g fill='#ff5aa8'>" + [0, 1, 2, 3].map(i => '').join('')
        + "<rect x='12' y='24' width='24' height='24'/><rect x='84' y='24' width='24' height='24'/>"
        + "<rect x='12' y='48' width='96' height='24'/><rect x='24' y='72' width='72' height='24'/>"
        + "<rect x='48' y='96' width='24' height='24'/></g>"
        + "<rect x='24' y='36' width='12' height='12' fill='#ffd9ee'/>"),
    G('v10:y2k-diamond', '钻石贴纸', '闪亮', '0 0 120 100',
        "<path d='M60 6L108 40L60 94L12 40Z' fill='#cfefff' stroke='#8fd8ff' stroke-width='2'/>"
        + "<path d='M60 6L78 40H42Z' fill='#ffffff' opacity='0.9'/>"
        + "<path d='M12 40H108' stroke='#8fd8ff' stroke-width='1.4'/>"),

    G('v10:y2k-flip', '翻盖手机', '装饰', '0 0 90 150',
        "<rect x='12' y='4' width='66' height='142' rx='12' fill='#f2f3f7' stroke='#b9c0cc' stroke-width='2'/>"
        + "<rect x='20' y='14' width='50' height='40' rx='4' fill='#b9d8ff'/>"
        + "<circle cx='45' cy='78' r='14' fill='#dfe4ee' stroke='#b9c0cc'/>"
        + "<g fill='#c8ceda'>" + Array.from({ length: 9 }, (_, i) => `<rect x='${22 + (i % 3) * 16}' y='${100 + Math.floor(i / 3) * 12}' width='12' height='7' rx='1.5'/>`).join('') + "</g>"),
    G('v10:y2k-mp3', 'MP3', '装饰', '0 0 80 130',
        "<rect x='8' y='6' width='64' height='118' rx='10' fill='#e8ecf5' stroke='#b9c0cc' stroke-width='2'/>"
        + "<rect x='16' y='18' width='48' height='30' rx='3' fill='#9fe4ff'/>"
        + "<circle cx='40' cy='70' r='14' fill='#ffffff' stroke='#b9c0cc'/>"
        + "<circle cx='40' cy='70' r='5' fill='#b9c0cc'/>"),
    G('v10:y2k-cd', '光碟碎片', '闪亮', '0 0 120 120',
        "<defs><linearGradient id='c' x1='0' y1='0' x2='1' y2='1'>"
        + "<stop offset='0' stop-color='#e8f4ff'/><stop offset='0.4' stop-color='#ffe7f6'/><stop offset='0.7' stop-color='#e6fff4'/><stop offset='1' stop-color='#fff6dd'/>"
        + "</linearGradient></defs>"
        + "<path d='M60 4a56 56 0 11-40 96L60 60Z' fill='url(#c)' stroke='#cdd6e2' stroke-width='1.5'/>"
        + "<g fill='none' stroke='#ffffff' stroke-width='1.2' opacity='0.8'><path d='M28 22a44 44 0 0112-6'/><path d='M20 44a44 44 0 016-12'/></g>"),
    G('v10:y2k-burst', '爆炸贴', '装饰', '0 0 120 120',
        "<path d='M60 2L74 32L106 20L92 50L118 60L92 70L106 100L74 88L60 118L46 88L14 100L28 70L2 60L28 50L14 20L46 32Z' fill='#ffd0e4' stroke='#f79bc4' stroke-width='2'/>"),
    G('v10:y2k-bow', '镭射蝴蝶结', '装饰', '0 0 120 90',
        "<defs><linearGradient id='lb' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#ffb8e6'/><stop offset='1' stop-color='#9fe4ff'/></linearGradient></defs>"
        + "<path d='M54 45C36 22 6 26 8 45s28 24 46 2Z' fill='url(#lb)' stroke='#ffffff' stroke-width='3'/>"
        + "<path d='M66 45C84 22 114 26 112 45s-28 24-46 2Z' fill='url(#lb)' stroke='#ffffff' stroke-width='3'/>"
        + "<circle cx='60' cy='45' r='10' fill='#ffffff' opacity='0.9'/>"),
    G('v10:y2k-rainbow', '彩虹曲线', '装饰', '0 0 240 90',
        "<g fill='none' stroke-width='8' stroke-linecap='round'>"
        + "<path d='M10 80C50 10 190 10 230 80' stroke='#ff8fd0'/>"
        + "<path d='M28 80C62 26 178 26 212 80' stroke='#ffd166'/>"
        + "<path d='M46 80C74 42 166 42 194 80' stroke='#4fc3ff'/></g>"),
    G('v10:y2k-lips', '唇印', '装饰', '0 0 120 80',
        "<path d='M60 26c10-12 26-12 32 0c8 4 8 14-2 18c-10 6-22 10-30 18c-8-8-20-12-30-18c-10-4-10-14-2-18c6-12 22-12 32 0Z' fill='#f0479b' opacity='0.9'/>"),
    G('v10:y2k-zigzag', '锯齿边框', '装饰', '0 0 120 120',
        "<path d='M6 6H114L108 16L114 26L108 36L114 46L108 56L114 66L108 76L114 86L108 96L114 106L108 114H6L12 104L6 94L12 84L6 74L12 64L6 54L12 44L6 34L12 24L6 14Z' fill='none' stroke='#ff5aa8' stroke-width='3'/>"),
    G('v10:y2k-lightning', '闪电虚线', '装饰', '0 0 120 200',
        "<path d='M70 6L30 96h34L44 194' fill='none' stroke='#ffe27a' stroke-width='6' stroke-dasharray='14 10' stroke-linecap='round'/>"),
    G('v10:y2k-pixelfly', '像素蝴蝶', '装饰', '0 0 120 110',
        "<g fill='#a45cff'><rect x='12' y='20' width='36' height='30'/><rect x='72' y='20' width='36' height='30'/>"
        + "<rect x='20' y='54' width='28' height='24'/><rect x='72' y='54' width='28' height='24'/></g>"
        + "<g fill='#ffb8e6'><rect x='20' y='28' width='20' height='14'/><rect x='80' y='28' width='20' height='14'/></g>"
        + "<rect x='54' y='30' width='12' height='46' fill='#3d1f47'/>"),
    G('v10:y2k-neonframe', '炫彩渐变框', '装饰', '0 0 120 120',
        "<defs><linearGradient id='nf' x1='0' y1='0' x2='1' y2='1'>"
        + "<stop offset='0' stop-color='#ff8fd0'/><stop offset='0.5' stop-color='#a45cff'/><stop offset='1' stop-color='#4fc3ff'/></linearGradient></defs>"
        + "<rect x='4' y='4' width='112' height='112' rx='10' fill='none' stroke='url(#nf)' stroke-width='7'/>"),
    G('v10:y2k-dotband', '圆点带', '装饰', '0 0 240 30',
        ringDots(15, 15, 0, 1, 0, '') + Array.from({ length: 16 }, (_, i) => `<circle cx='${9 + i * 15}' cy='15' r='5' fill='#ff8fd0' opacity='0.8'/>`).join('')),
];
