import { G, pattern } from './base.js';

const INK = '#33322e';
const HAZE = '#8fa3b5';
const PAPER = '#fdfaf2';
const SEAL = '#b5453f';

function fakeLines(w, rows, y0, gap, color, op) {
    let body = '';
    for (let i = 0; i < rows; i += 1) {
        const y = y0 + i * gap;
        const len = w * (0.5 + ((i * 37) % 40) / 100);
        body += `<rect x='${((w - len) / 2).toFixed(1)}' y='${y.toFixed(1)}' width='${len.toFixed(1)}' height='${(gap * 0.16).toFixed(1)}' fill='${color}' opacity='${op}'/>`;
    }
    return body;
}

export default [

    pattern('v10:lt-paper', '粗纤维信纸', '纸张', 10,
        "<path d='M0 10H10' stroke='#cfc7ba' stroke-width='0.5' opacity='0.7'/>"
        + "<g fill='#c9c0b0' opacity='0.35'><circle cx='3' cy='4' r='0.5'/><circle cx='7' cy='8' r='0.4'/></g>", '#fbf8f1'),
    pattern('v10:lt-lines', '竖线信笺', '纸张', 11,
        "<path d='M0 0V11' stroke='#d8d0c2' stroke-width='0.55' opacity='0.85'/>", '#fdfaf2'),
    pattern('v10:lt-watermark', '诗句水印', '纸张', 26,
        fakeLines(26, 4, 4, 6, '#b9b1a3', 0.35), ''),
    pattern('v10:lt-grid', '浅暗纹', '纸张', 14,
        "<path d='M0 14H14' stroke='#ddd5c7' stroke-width='0.4' opacity='0.6'/>", ''),

    G('v10:lt-seal', '火漆', '装饰', '0 0 120 120',
        "<path d='M60 12l10 10 14-4 2 14 12 8-8 12 4 14-14 2-8 12-12-8-12 8-8-12-14-2 4-14-8-12 12-8 2-14 14 4Z' fill='#b5453f' stroke='#8f322e' stroke-width='2'/>"
        + "<circle cx='60' cy='60' r='22' fill='none' stroke='#e8c9a8' stroke-width='2' opacity='0.8'/>"
        + "<text x='60' y='66' text-anchor='middle' font-size='16' fill='#e8c9a8' opacity='0.9'>S</text>"),
    G('v10:lt-feather', '羽毛笔', '装饰', '0 0 70 200',
        "<path d='M46 8C22 44 14 118 26 192' stroke='#b9ac9a' stroke-width='2.6' fill='none'/>"
        + Array.from({ length: 14 }, (_, i) => `<path d='M${34 + i * 0.7} ${16 + i * 12}l-16 -6' stroke='#cfc4b2' stroke-width='3' stroke-linecap='round'/>`).join('')
        + "<path d='M26 192l-4 8' stroke='#5b5750' stroke-width='2.4' stroke-linecap='round'/>"),
    G('v10:lt-olive', '橄榄枝', '装饰', '0 0 120 200',
        "<path d='M14 192C46 156 76 100 106 14' stroke='#a9b39a' stroke-width='2.4' fill='none'/>"
        + Array.from({ length: 9 }, (_, i) => {
            const x = 20 + i * 10;
            const y = 176 - i * 19;
            return `<ellipse cx='${x}' cy='${y}' rx='9' ry='4' fill='#c3cdb2' transform='rotate(${-34 + i * 8} ${x} ${y})'/>`
                + `<ellipse cx='${x + 14}' cy='${y - 6}' rx='9' ry='4' fill='#cfd8be' transform='rotate(${24 - i * 6} ${x + 14} ${y - 6})'/>`;
        }).join('')),
    G('v10:lt-ink', '墨点', '装饰', '0 0 120 120',
        "<g fill='#3c3a36' opacity='0.5'><circle cx='60' cy='56' r='20'/><circle cx='84' cy='72' r='7'/><circle cx='40' cy='80' r='4.5'/><circle cx='70' cy='88' r='2.6'/></g>"),
    G('v10:lt-smudge', '洇墨', '装饰', '0 0 160 100',
        "<g fill='#8fa3b5' opacity='0.22'><ellipse cx='60' cy='48' rx='48' ry='30'/><ellipse cx='104' cy='62' rx='30' ry='20'/>"
        + "<ellipse cx='34' cy='66' rx='20' ry='12'/></g>"),
    G('v10:lt-string', '红棉封绳', '装饰', '0 0 240 40',
        "<path d='M2 20C40 6 70 34 108 18S180 4 238 22' fill='none' stroke='#a8473f' stroke-width='2.6'/>"
        + "<path d='M2 20C40 6 70 34 108 18S180 4 238 22' fill='none' stroke='#c96b60' stroke-width='0.8' opacity='0.9'/>"),
    G('v10:lt-string-v', '竖封绳', '装饰', '0 0 40 240',
        "<path d='M20 2C6 40 34 70 18 108S4 180 22 238' fill='none' stroke='#a8473f' stroke-width='2.6'/>"),
    G('v10:lt-bookmark', '纸质书签', '装饰', '0 0 46 120',
        "<path d='M2 2H44V118L23 100L2 118Z' fill='#f6f2e6' stroke='#d6d0c0' stroke-width='1.2'/>"
        + "<g stroke='#b9b1a3' stroke-width='1.2' opacity='0.85'><path d='M10 24H36M10 36H30M10 48H36'/></g>"),
    G('v10:lt-dash', '细虚线', '装饰', '0 0 240 16',
        "<path d='M2 8H238' stroke='#9a9186' stroke-width='1.6' stroke-dasharray='7 6' opacity='0.8'/>"),
    G('v10:lt-dash-v', '竖虚线', '装饰', '0 0 16 240',
        "<path d='M8 2V238' stroke='#9a9186' stroke-width='1.6' stroke-dasharray='7 6' opacity='0.8'/>"),
    G('v10:lt-mailtag', '小邮签', '装饰', '0 0 120 44',
        "<path d='M2 2H96L118 22L96 42H2Z' fill='#f2eee4' stroke='#d6d0c0' stroke-width='1.2'/>"
        + "<g stroke='#b9b1a3' stroke-width='1.4'><path d='M14 16H72M14 28H60'/></g>"),
    G('v10:lt-frame', '细线边框', '装饰', '0 0 120 120',
        "<rect x='4' y='4' width='112' height='112' fill='none' stroke='#8d8474' stroke-width='1'/>"
        + "<rect x='9' y='9' width='102' height='102' fill='none' stroke='#8d8474' stroke-width='0.6' opacity='0.6'/>"),
    G('v10:lt-arc', '弧形文字线', '装饰', '0 0 240 60',
        "<path d='M6 52C60 4 180 4 234 52' fill='none' stroke='#b9b1a3' stroke-width='1.2' opacity='0.9'/>"),
];
