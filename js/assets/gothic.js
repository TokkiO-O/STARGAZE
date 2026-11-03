import { G, pattern } from './base.js';

const SILVER = '#8b7f9c';
const WINE = '#5c2233';
const BONE = '#e8dcc6';
const DARK = '#1a1820';

export default [

    pattern('v10:gt-velvet', '暗天鹅绒', '纸张', 8,
        "<g stroke='#241f28' stroke-width='1.6' opacity='0.9'><path d='M0 4H8'/></g>"
        + "<g stroke='#2e2833' stroke-width='0.6' opacity='0.7'><path d='M0 7H8'/></g>", '#1a1820'),
    pattern('v10:gt-wallpaper', '暗纹壁纸', '纸张', 24,
        "<g fill='none' stroke='#3a3340' stroke-width='0.9' opacity='0.9'>"
        + "<path d='M12 2c5 0 8 4 8 9s-3 9-8 9-8-4-8-9 3-9 8-9Z'/>"
        + "<path d='M12 22c-3 0-5 2-5 2s2 2 5 2 5-2 5-2-2-2-5-2Z'/></g>", '#2c2533'),
    pattern('v10:gt-parchment', '羊皮卷', '纸张', 10,
        "<g stroke='#3a3026' stroke-width='0.5' opacity='0.5'><path d='M0 5H10'/></g>"
        + "<g fill='#6b5a44' opacity='0.4'><circle cx='3' cy='8' r='1'/></g>", '#3b3229'),
    G('v10:gt-veil', '半透黑纱', '纸张', '0 0 120 120',
        "<rect width='120' height='120' fill='#0b0a0e' opacity='0.26'/>"
        + "<g stroke='#2a2530' stroke-width='0.8' opacity='0.7'>"
        + Array.from({ length: 10 }, (_, i) => `<path d='M${i * 13} 0V120'/>`).join('') + "</g>"),

    G('v10:gt-frame', '雕花方框', '装饰', '0 0 120 120',
        "<rect x='10' y='10' width='100' height='100' fill='none' stroke='#b9a88f' stroke-width='3'/>"
        + "<rect x='18' y='18' width='84' height='84' fill='none' stroke='#8d7f6c' stroke-width='1.2'/>"
        + [0, 1, 2, 3].map(i => {
            const x = i % 2 ? 110 : 10;
            const y = i < 2 ? 10 : 110;
            return `<path d='M${x} ${y}c${i % 2 ? -10 : 10} 0 ${i % 2 ? -16 : 16} 6 ${i % 2 ? -16 : 16} 16c0-10 ${i % 2 ? 6 : -6} -16 ${i % 2 ? 16 : -16} -16' fill='none' stroke='#b9a88f' stroke-width='2.4'/>`;
        }).join('')),
    G('v10:gt-oval', '雕花椭圆框', '装饰', '0 0 140 160',
        "<ellipse cx='70' cy='80' rx='62' ry='73' fill='none' stroke='#b9a88f' stroke-width='3'/>"
        + "<ellipse cx='70' cy='80' rx='54' ry='65' fill='none' stroke='#7d6f5e' stroke-width='1'/>"
        + Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const x = 70 + Math.cos(a) * 62;
            const y = 80 + Math.sin(a) * 73;
            return `<circle cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' r='3.6' fill='#0f0e12' stroke='#b9a88f' stroke-width='1.2'/>`;
        }).join('')),
    G('v10:gt-arch', '尖拱窗棂', '装饰', '0 0 120 200',
        "<path d='M7 198V66a53 53 0 01106 0v132' fill='none' stroke='#c2b096' stroke-width='7'/>"
        + "<path d='M16 198V66a44 44 0 0188 0v132' fill='none' stroke='#8d7f6c' stroke-width='1.8'/>"
        + "<path d='M60 198V24M16 118H104' stroke='#a2937d' stroke-width='2.6'/>"
        + "<path d='M60 24c-21 20-35 48-35 82M60 24c21 20 35 48 35 82' fill='none' stroke='#8d7f6c' stroke-width='1.6'/>"
        + "<circle cx='60' cy='24' r='6' fill='none' stroke='#c2b096' stroke-width='2.4'/>"
        + "<path d='M0 198h22M98 198h22' stroke='#c2b096' stroke-width='5'/>"
        + "<g fill='none' stroke='#b9a88f' stroke-width='1.2' opacity='0.85'>"
        + "<path d='M60 118c-10-8-14-18-14-28M60 118c10-8 14-18 14-28'/>"
        + "<path d='M60 160c-12 8-18 20-18 32M60 160c12 8 18 20 18 32'/></g>"),
    G('v10:gt-scroll', '卷草雕花', '装饰', '0 0 120 120',
        "<g fill='none' stroke='#8d7f6c' stroke-width='2'>"
        + "<path d='M8 112C28 100 24 78 44 70S74 62 78 40'/>"
        + "<path d='M44 70c-10 2-14-8-6-12s12 6 6 12Z'/><path d='M78 40c10-4 14 6 6 10s-12-6-6-10Z'/></g>"),
    G('v10:gt-torn', '破碎边框', '装饰', '0 0 120 120', (() => {

        const jitter = [0, 7, 3, 11, 2, 8, 14, 4, 9, 1, 12, 5, 8, 2, 10, 6];
        let left = 'M8 4';
        let right = '';
        const step = 116 / jitter.length;
        jitter.forEach((value, i) => {
            const y = 4 + step * (i + 0.5);
            left += `L${(8 + value * 0.5).toFixed(1)} ${y.toFixed(1)}`;
        });
        for (let i = jitter.length - 1; i >= 0; i -= 1) {
            const y = 4 + step * (i + 0.5);
            right += `L${(112 - jitter[i] * 0.55).toFixed(1)} ${y.toFixed(1)}`;
        }
        return `<path d='${left}L112 4${right}Z' fill='none' stroke='#7d6f5e' stroke-width='1.8' opacity='0.9'/>`;
    })()),

    G('v10:gt-thorn', '荆棘', '装饰', '0 0 120 200', (() => {
        const bez = (p0, p1, p2, p3, t) => {
            const u = 1 - t;
            return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
                u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
        };
        const A = [[12, 192], [46, 156], [34, 104], [68, 78]];
        const B = [[68, 78], [102, 52], [104, 40], [112, 10]];
        const pts = [];
        for (let i = 0; i <= 10; i += 1) pts.push(bez(...A, i / 10));
        for (let i = 1; i <= 10; i += 1) pts.push(bez(...B, i / 10));
        const dirs = pts.map((point, i) => {
            const before = pts[Math.max(0, i - 1)];
            const after = pts[Math.min(pts.length - 1, i + 1)];
            const dx = after[0] - before[0];
            const dy = after[1] - before[1];
            const len = Math.hypot(dx, dy) || 1;
            return [dx / len, dy / len];
        });
        const spikes = pts.map((point, i) => {
            if (i % 2 === 1) return '';
            const [dx, dy] = dirs[i];
            const nx = -dy;
            const ny = dx;
            const s = 7.6 + (i % 4) * 1.9;
            const tip = [point[0] + nx * s, point[1] + ny * s];
            const a = [point[0] + dx * 1.9, point[1] + dy * 1.9];
            const b = [point[0] - dx * 1.9, point[1] - dy * 1.9];
            const back = (i % 4 === 0)
                ? `<path d='M${(point[0] - nx * 1.4).toFixed(1)} ${(point[1] - ny * 1.4).toFixed(1)}`
                    + `L${(point[0] - nx * (s * 0.55)).toFixed(1)} ${(point[1] - ny * (s * 0.55)).toFixed(1)}`
                    + `L${(point[0] + dx * 1.3).toFixed(1)} ${(point[1] + dy * 1.3).toFixed(1)}Z' fill='#6d5e50'/>`
                : '';
            return `<path d='M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${tip[0].toFixed(1)} ${tip[1].toFixed(1)}`
                + `L${b[0].toFixed(1)} ${b[1].toFixed(1)}Z' fill='#8d7a68'/>${back}`;
        }).join('');
        return "<path d='M12 192C46 156 34 104 68 78S104 40 112 10' stroke='#4f443a' stroke-width='4.2' fill='none' stroke-linecap='round'/>"
            + "<path d='M12 192C46 156 34 104 68 78S104 40 112 10' stroke='#9d8a75' stroke-width='1.2' fill='none' opacity='0.9'/>"
            + spikes;
    })()),
    G('v10:gt-web', '蛛网', '装饰', '0 0 120 120',
        "<g fill='none' stroke='#9c948a' stroke-width='1.1' opacity='0.7'>"
        + "<path d='M0 0L120 120M0 0L120 40M0 0L40 120M0 0V120M0 0H120'/>"
        + [26, 50, 74, 98].map(r => `<path d='M0 ${r}Q${r * 0.6} ${r * 0.6} ${r} 0'/>`).join('') + "</g>"),
    G('v10:gt-rose', '黑玫瑰', '装饰', '0 0 120 140',
        "<g fill='#5a3540' stroke='#8a5a68' stroke-width='0.9'>"
        + Array.from({ length: 8 }, (_, i) => `<ellipse cx='60' cy='42' rx='13' ry='20' transform='rotate(${i * 45} 60 58)'/>`).join('')
        + "</g>"
        + "<g fill='#3d2229' stroke='#9d6674' stroke-width='0.8'>"
        + Array.from({ length: 5 }, (_, i) => `<ellipse cx='60' cy='50' rx='8' ry='12' transform='rotate(${i * 72 + 24} 60 58)'/>`).join('')
        + "<circle cx='60' cy='58' r='5.4'/></g>"
        + "<path d='M60 80v52' stroke='#4a4038' stroke-width='3.2'/>"
        + "<path d='M60 100l-15-9M60 114l14-9' stroke='#4a4038' stroke-width='2.2'/>"),
    G('v10:gt-rose-cluster', '黑玫瑰簇', '装饰', '0 0 140 120', (() => {
        const rose = (cx, cy, r) => "<g fill='#5a3540' stroke='#8a5a68' stroke-width='0.8'>"
            + Array.from({ length: 7 }, (_, i) => `<ellipse cx='${cx}' cy='${(cy - r * 0.46).toFixed(1)}' rx='${(r * 0.36).toFixed(1)}' ry='${(r * 0.56).toFixed(1)}' transform='rotate(${(i * 51.4).toFixed(1)} ${cx} ${cy})'/>`).join('')
            + "</g><g fill='#3d2229' stroke='#9d6674' stroke-width='0.7'>"
            + Array.from({ length: 4 }, (_, i) => `<ellipse cx='${cx}' cy='${(cy - r * 0.28).toFixed(1)}' rx='${(r * 0.2).toFixed(1)}' ry='${(r * 0.3).toFixed(1)}' transform='rotate(${i * 90 + 20} ${cx} ${cy})'/>`).join('')
            + `<circle cx='${cx}' cy='${cy}' r='${(r * 0.13).toFixed(1)}'/></g>`;
        return "<path d='M12 106C38 94 60 98 80 106' stroke='#4a4038' stroke-width='2.6' fill='none'/>"
            + "<path d='M96 106c14-7 26-5 34 2' stroke='#4a4038' stroke-width='2' fill='none'/>"
            + rose(46, 54, 36) + rose(90, 42, 27) + rose(76, 84, 23)
            + "<g fill='#39402e' opacity='0.95'><ellipse cx='26' cy='86' rx='14' ry='6' transform='rotate(-28 26 86)'/>"
            + "<ellipse cx='112' cy='72' rx='12' ry='5.5' transform='rotate(24 112 72)'/></g>";
    })()),
    G('v10:gt-feather', '羽毛', '装饰', '0 0 60 180',
        "<path d='M42 8C20 48 12 112 22 174' stroke='#4a4038' stroke-width='2.4' fill='none'/>"
        + Array.from({ length: 12 }, (_, i) => `<path d='M${32 + i * 0.6} ${16 + i * 13}l-16 -6' stroke='#5d5147' stroke-width='3' stroke-linecap='round'/>`).join('')),

    G('v10:gt-candle', '烛台', '装饰', '0 0 80 140',
        "<rect x='36' y='40' width='10' height='66' fill='#d9cdb4'/>"
        + "<path d='M41 40c-7-9 7-14 0-24c9 7 7 14 0 24Z' fill='#f2c96a'/>"
        + "<path d='M18 106h46l-6 14H24Z' fill='#6f6154'/><rect x='38' y='106' width='6' height='10' fill='#4a4038'/>"),
    G('v10:gt-moon', '月相', '装饰', '0 0 240 40',
        Array.from({ length: 5 }, (_, i) => {
            const x = 24 + i * 48;
            const phase = [0.25, 0.55, 1, 0.55, 0.25][i];
            return `<circle cx='${x}' cy='20' r='15' fill='#0f0e12' stroke='#b9a88f' stroke-width='1.4'/>`
                + `<path d='M${x} 5a15 15 0 000 30a${(15 * phase).toFixed(1)} 15 0 000-30Z' fill='#e8dcc6'/>`;
        }).join('')),
    G('v10:gt-cross', '细十字架', '装饰', '0 0 60 120',
        "<path d='M26 8h8v32h24v8H34v64h-8V48H2v-8h24Z' fill='#8d7f6c' opacity='0.9'/>"),
    G('v10:gt-chain', '暗银链条', '装饰', '0 0 240 30',
        "<g fill='none' stroke='#8d7f6c' stroke-width='3'>"
        + Array.from({ length: 16 }, (_, i) => `<ellipse cx='${8 + i * 15}' cy='15' rx='7' ry='10'/>`).join('') + "</g>"),
    G('v10:gt-chain-v', '竖银链条', '装饰', '0 0 30 240',
        "<g fill='none' stroke='#8d7f6c' stroke-width='3'>"
        + Array.from({ length: 16 }, (_, i) => `<ellipse cx='15' cy='${8 + i * 15}' rx='10' ry='7'/>`).join('') + "</g>"),
    G('v10:gt-wax', '凝固蜡泪', '装饰', '0 0 120 120',
        "<g fill='#5c2233' stroke='#7a3243' stroke-width='1'>"
        + "<ellipse cx='60' cy='86' rx='40' ry='18'/>"
        + "<path d='M34 86c-4-14 4-22 10-16c4 4 2 12 4 16Z'/><path d='M72 88c0-18 10-26 16-18c5 7-2 14-4 18Z'/></g>"),
    G('v10:gt-raven', '乌鸦剪影', '装饰', '0 0 140 100',
        "<path d='M8 58c18-14 34-20 52-18c6-14 22-20 32-12c8 6 6 18-2 24c10 6 22 6 34 0c-10 14-26 20-44 18c-8 12-24 18-40 16L8 96l14-18C14 74 10 66 8 58Z' fill='#0f0e12' stroke='#2e2833' stroke-width='1'/>"),
    G('v10:gt-gem', '暗宝石', '装饰', '0 0 100 100',
        "<path d='M50 6L92 38L50 94L8 38Z' fill='#3a2438' stroke='#8b7f9c' stroke-width='1.6'/>"
        + "<path d='M50 6L68 38H32Z' fill='#6b4a63' opacity='0.9'/><path d='M8 38H92' stroke='#8b7f9c' stroke-width='1'/>"),
    G('v10:gt-lace', '黑蕾丝', '装饰', '0 0 240 40',
        "<rect width='240' height='22' fill='#151419' opacity='0.95'/>"
        + Array.from({ length: 16 }, (_, i) => `<circle cx='${(240 / 16) * (i + 0.5)}' cy='22' r='8' fill='#151419'/>`).join('')
        + "<g stroke='#5d5147' stroke-width='0.8' opacity='0.8'>"
        + Array.from({ length: 12 }, (_, i) => `<circle cx='${10 + i * 20}' cy='11' r='3.4' fill='none'/>`).join('') + "</g>"),
    G('v10:gt-silver', '暗银线条', '装饰', '0 0 240 40',
        "<path d='M2 30C50 4 96 34 144 16S208 4 238 22' fill='none' stroke='#8b7f9c' stroke-width='1.6' opacity='0.85'/>"),
    G('v10:gt-glow', '轮廓光', '闪亮', '0 0 120 120',
        "<circle cx='60' cy='60' r='52' fill='none' stroke='#8b7f9c' stroke-width='1' opacity='0.5'/>"
        + "<circle cx='60' cy='60' r='44' fill='none' stroke='#b9a88f' stroke-width='0.8' opacity='0.35' stroke-dasharray='2 6'/>"),
];
