import { G, pattern, rowDots } from './base.js';

const BROWN = '#6b4a33';
const WINE = '#8c3a2f';
const ORANGE = '#c07a3a';
const PAPER = '#f4e7cb';
const GOLD = '#c9a05a';

export default [

    pattern('v10:hk-news', '旧报纸', '纸张', 7,
        "<g fill='#8b7a63' opacity='0.55'><rect x='0' y='1' width='6' height='0.8'/><rect x='0' y='3.4' width='4.5' height='0.6'/>"
        + "<rect x='0' y='5.2' width='6' height='0.6'/></g>", '#f2e8d5'),
    pattern('v10:hk-halftone', '网点印刷', '纸张', 6,
        "<circle cx='1.5' cy='1.5' r='1.1' fill='#6b5a45' opacity='0.35'/><circle cx='4.5' cy='4.5' r='0.7' fill='#6b5a45' opacity='0.25'/>", ''),
    pattern('v10:hk-grain', '胶片颗粒', '纸张', 4,
        "<circle cx='1' cy='1' r='0.6' fill='#6b5a45' opacity='0.25'/><circle cx='3' cy='2.4' r='0.4' fill='#6b5a45' opacity='0.2'/>", ''),
    pattern('v10:hk-krafttex', '牛皮纸纹', '纸张', 9,
        "<g stroke='#a98a63' stroke-width='0.5' opacity='0.5'><path d='M0 3H9M0 6H9'/></g>", '#d9c09a'),

    G('v10:hk-sprocket', '胶片齿孔条', '装饰', '0 0 240 44',
        "<rect width='240' height='44' fill='#2a2521'/>"
        + rowDots(240, 44, 8, 16, 8, '#f6efe2') + rowDots(240, 44, 36, 16, 8, '#f6efe2')),
    G('v10:hk-film', '胶卷格', '装饰', '0 0 160 120',
        "<rect width='160' height='120' fill='#2a2521'/>"
        + "<rect x='18' y='16' width='124' height='88' fill='#4a4038'/>"
        + rowDots(160, 120, 8, 10, 8, '#f6efe2') + rowDots(160, 120, 112, 10, 8, '#f6efe2')),
    G('v10:hk-viewfinder', '取景框', '装饰', '0 0 120 120',
        "<g fill='none' stroke='#e8dcc2' stroke-width='3' opacity='0.9'>"
        + "<path d='M10 34V10H34M86 10h24v24M110 86v24H86M34 110H10V86'/></g>"
        + "<circle cx='60' cy='60' r='2.4' fill='#e8dcc2' opacity='0.8'/>"),
    G('v10:hk-split', '分镜格', '装饰', '0 0 120 240',
        "<g fill='none' stroke='#2a2521' stroke-width='3'>"
        + "<rect x='3' y='3' width='114' height='72'/><rect x='3' y='81' width='114' height='76'/><rect x='3' y='163' width='114' height='74'/></g>"),
    G('v10:hk-torn', '撕裂纸边', '装饰', '0 0 120 24',
        "<path d='M0 0H120V10L110 16L98 9L86 17L74 10L62 18L50 9L38 17L26 10L14 16L0 9Z' fill='#f2e8d5'/>"),
    G('v10:hk-kraft', '牛皮碎片', '装饰', '0 0 120 90',
        "<path d='M4 6L112 2L118 60L96 88L10 84Z' fill='#d9c09a' stroke='#b79b71' stroke-width='1'/>"
        + "<g stroke='#b79b71' stroke-width='0.8' opacity='0.6'><path d='M16 26H100M16 44H88M16 62H96'/></g>"),

    G('v10:hk-postmark', '邮戳', '装饰', '0 0 120 120',
        "<g fill='none' stroke='#9b5a44' stroke-width='2.2' opacity='0.82'>"
        + "<circle cx='60' cy='60' r='46' stroke-dasharray='4 4'/><circle cx='60' cy='60' r='36'/>"
        + "<path d='M28 60H92M60 28V92'/></g>"
        + "<text x='60' y='58' text-anchor='middle' font-size='14' fill='#9b5a44' opacity='0.85'>POST</text>"
        + "<text x='60' y='76' text-anchor='middle' font-size='11' fill='#9b5a44' opacity='0.75'>1999</text>"),
    G('v10:hk-postmark-sq', '方邮戳', '装饰', '0 0 120 120',
        "<g fill='none' stroke='#8c3a2f' stroke-width='2.2' opacity='0.8'>"
        + "<rect x='12' y='24' width='96' height='72' rx='4'/><rect x='20' y='32' width='80' height='56' rx='2' stroke-dasharray='3 3'/>"
        + "<path d='M12 60h96'/></g>"),
    G('v10:hk-stamp', '复古邮票', '装饰', '0 0 120 150',
        "<rect x='10' y='10' width='100' height='130' fill='#f0e2c2' stroke='#c9a05a' stroke-width='0'/>"
        + "<rect x='10' y='10' width='100' height='130' fill='none' stroke='#a4622f' stroke-width='2' stroke-dasharray='1 8' stroke-linecap='round'/>"
        + "<rect x='20' y='20' width='80' height='96' fill='none' stroke='#c9a05a' stroke-width='1.2'/>"
        + "<circle cx='60' cy='68' r='20' fill='none' stroke='#a4622f' stroke-width='1.4' opacity='0.8'/>"),
    G('v10:hk-postroute', '邮路虚线', '装饰', '0 0 240 24',
        "<path d='M0 12H240' stroke='#9b5a44' stroke-width='2' stroke-dasharray='9 7' opacity='0.75'/>"
        + "<path d='M0 12H240' stroke='#e8dcc2' stroke-width='0.8' stroke-dasharray='9 7' opacity='0.6'/>"),
    G('v10:hk-goldline', '烫金曲线', '装饰', '0 0 240 60',
        "<path d='M4 44C40 8 74 52 110 26S182 4 236 30' fill='none' stroke='#c9a05a' stroke-width='2.2' stroke-linecap='round'/>"
        + "<path d='M4 44C40 8 74 52 110 26S182 4 236 30' fill='none' stroke='#f0d9a4' stroke-width='0.8' stroke-linecap='round' opacity='0.9'/>"),

    G('v10:hk-vinyl', '黑胶碎块', '装饰', '0 0 120 120',
        "<path d='M60 6a54 54 0 11-38 92L60 60Z' fill='#1d1c1b'/>"
        + "<g fill='none' stroke='#3a3835' stroke-width='1.2'><path d='M22 26a46 46 0 0116-8'/><path d='M14 44a46 46 0 0110-12'/></g>"
        + "<circle cx='60' cy='60' r='9' fill='#d9c9a8'/>"),
    G('v10:hk-tape', '磁带碎片', '装饰', '0 0 120 80',
        "<path d='M6 8H96L114 40L96 72H6Z' fill='#3b332d' stroke='#211c18' stroke-width='1.4'/>"
        + "<circle cx='34' cy='40' r='13' fill='none' stroke='#8b7a63' stroke-width='3'/>"
        + "<circle cx='72' cy='40' r='13' fill='none' stroke='#8b7a63' stroke-width='3'/>"
        + "<path d='M34 40H72' stroke='#6b5a45' stroke-width='2'/>"),
    G('v10:hk-clock', '钟表刻度', '装饰', '0 0 120 120',
        "<circle cx='60' cy='60' r='54' fill='none' stroke='#8b7a63' stroke-width='1.6' opacity='0.85'/>"
        + Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const r1 = 44;
            const r2 = i % 3 === 0 ? 32 : 38;
            return `<path d='M${(60 + Math.sin(a) * r1).toFixed(1)} ${(60 - Math.cos(a) * r1).toFixed(1)}L${(60 + Math.sin(a) * r2).toFixed(1)} ${(60 - Math.cos(a) * r2).toFixed(1)}' stroke='#8b7a63' stroke-width='${i % 3 === 0 ? 3 : 1.6}'/>`;
        }).join('')),
    G('v10:hk-rose', '干玫瑰', '装饰', '0 0 120 120',
        "<g fill='#7a3b34' stroke='#5c2a26' stroke-width='1'>"
        + "<path d='M60 22c14 0 24 10 24 22S74 68 60 68 36 56 36 44s10-22 24-22Z'/>"
        + "<path d='M60 34c7 0 12 5 12 11s-5 11-12 11-12-5-12-11 5-11 12-11Z' fill='#8c3a2f'/></g>"
        + "<path d='M60 68v42' stroke='#5c4a35' stroke-width='3'/>"
        + "<path d='M60 88l-16-8M60 98l14-8' stroke='#5c4a35' stroke-width='2'/>"),
    G('v10:hk-lens', '镜头光斑', '闪亮', '0 0 120 120',
        "<circle cx='60' cy='60' r='48' fill='#f0d9a4' opacity='0.28'/>"
        + "<circle cx='60' cy='60' r='30' fill='#f6e8c8' opacity='0.35'/>"
        + "<circle cx='60' cy='60' r='14' fill='#fff6e2' opacity='0.5'/>"),
];
