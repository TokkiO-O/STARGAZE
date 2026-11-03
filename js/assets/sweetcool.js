import { G, pattern } from './base.js';

export default [

    pattern('v10:sc-cream', '奶油纤维纸', '纸张', 24,
        "<path d='M2 5l7-1M14 18l6 1M5 22l3-2M18 7l4-2' stroke='#d8cfc2' stroke-width='0.45' opacity='0.48'/>"
        + "<g fill='#c7bdae' opacity='0.32'><circle cx='4' cy='14' r='0.55'/><circle cx='16' cy='3' r='0.45'/><circle cx='21' cy='13' r='0.5'/><circle cx='11' cy='10' r='0.35'/></g>"
        + "<path d='M0 12H24M12 0V24' stroke='#ffffff' stroke-width='0.35' opacity='0.5'/>", '#fffaf1'),
    pattern('v10:sc-floral', '雾霾蓝碎花', '纸张', 32,
        "<path d='M3 28C8 20 13 18 18 8M20 31c1-8 5-12 10-17' fill='none' stroke='#dce7e8' stroke-width='0.65' opacity='0.72'/>"
        + "<g fill='#f9f4e9' stroke='#e7ded3' stroke-width='0.25'>"
        + "<path d='M9 9c-5-5 2-8 3-3c1-6 7-3 4 1c6-1 6 5 1 5c3 5-3 7-5 2c-2 5-8 1-5-2c-5 1-6-5-1-5Z'/>"
        + "<path d='M25 21c-4-4 1-6 2-2c1-5 5-2 3 1c5-1 5 4 1 4c2 4-3 5-4 1c-2 4-6 1-4-2c-4 1-5-4-1-4Z'/></g>"
        + "<g fill='#c84b5c'><circle cx='11' cy='10' r='1.25'/><circle cx='27' cy='22' r='1'/></g>"
        + "<g fill='#7f9aab' opacity='0.7'><ellipse cx='6' cy='20' rx='2.8' ry='1.2' transform='rotate(-35 6 20)'/><ellipse cx='19' cy='16' rx='2.5' ry='1.1' transform='rotate(28 19 16)'/></g>", '#a9bdc9'),
    G('v10:sc-vellum', '褶皱硫酸纸', '纸张', '0 0 120 120',
        "<defs><linearGradient id='v' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#ffffff' stop-opacity='0.78'/><stop offset='0.45' stop-color='#e9f0f3' stop-opacity='0.42'/><stop offset='1' stop-color='#ffffff' stop-opacity='0.66'/></linearGradient>"
        + "<linearGradient id='f' x1='0' y1='0' x2='1' y2='0'><stop stop-color='#829cad' stop-opacity='0'/><stop offset='0.48' stop-color='#829cad' stop-opacity='0.22'/><stop offset='0.53' stop-color='#ffffff' stop-opacity='0.72'/><stop offset='1' stop-color='#ffffff' stop-opacity='0'/></linearGradient></defs>"
        + "<rect width='120' height='120' fill='url(#v)'/>"
        + "<path d='M-8 18L128 46L128 61L-8 31ZM18-8L48 128H63L31-8ZM-10 94L130 70V79L-10 105Z' fill='url(#f)'/>"
        + "<g fill='none' stroke-linecap='round'><path d='M0 25L120 52M27 0L56 120M0 99L120 75' stroke='#ffffff' stroke-width='1.1' opacity='0.68'/>"
        + "<path d='M0 29L120 56M31 0L60 120M0 103L120 79' stroke='#8fa6b4' stroke-width='0.55' opacity='0.25'/></g>"),

    G('v10:sc-cherry', '双樱桃', '甜酷', '0 0 120 120',
        "<defs><radialGradient id='r' cx='0.3' cy='0.22' r='0.82'><stop stop-color='#f77b88'/><stop offset='0.42' stop-color='#cf4055'/><stop offset='1' stop-color='#8f2037'/></radialGradient>"
        + "<linearGradient id='s' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#9ab3a0'/><stop offset='1' stop-color='#486d60'/></linearGradient></defs>"
        + "<path d='M34 69C39 40 57 30 65 17M86 72C83 43 72 31 65 17' fill='none' stroke='#557466' stroke-width='4' stroke-linecap='round'/>"
        + "<path d='M65 18C74 4 95 6 103 14C91 26 76 28 65 18Z' fill='url(#s)'/><path d='M68 18L96 13' stroke='#c2d0bd' stroke-width='1' opacity='0.7'/>"
        + "<circle cx='33' cy='80' r='26' fill='#7e2638' opacity='0.2'/><circle cx='32' cy='76' r='25' fill='url(#r)'/>"
        + "<circle cx='84' cy='82' r='25' fill='url(#r)'/><path d='M14 82c4 14 18 20 30 15' fill='none' stroke='#7e1e33' stroke-width='2' opacity='0.45'/>"
        + "<g fill='#ffd9dc' opacity='0.86'><ellipse cx='23' cy='65' rx='6' ry='9' transform='rotate(38 23 65)'/><ellipse cx='76' cy='72' rx='5' ry='8' transform='rotate(38 76 72)'/></g>"
        + "<g fill='#ffffff' opacity='0.72'><circle cx='20' cy='59' r='2.4'/><circle cx='73' cy='66' r='2'/></g>"),
    G('v10:sc-bow', '细缎蝴蝶结', '甜酷', '0 0 140 90',
        "<defs><linearGradient id='b' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#f18896'/><stop offset='0.38' stop-color='#c84358'/><stop offset='0.72' stop-color='#a72840'/><stop offset='1' stop-color='#e36b7b'/></linearGradient>"
        + "<linearGradient id='e' x1='0' y1='0' x2='0' y2='1'><stop stop-color='#ffd4d9'/><stop offset='1' stop-color='#b62f47'/></linearGradient></defs>"
        + "<path d='M65 40C43 10 8 11 10 35C12 57 42 58 65 44Z' fill='url(#b)' stroke='#9e2b40' stroke-width='1.2'/>"
        + "<path d='M75 40C97 10 132 11 130 35C128 57 98 58 75 44Z' fill='url(#b)' stroke='#9e2b40' stroke-width='1.2'/>"
        + "<path d='M62 47L43 84L62 76L70 86L72 49ZM78 47L97 84L78 76L70 86L68 49Z' fill='url(#b)' stroke='#9e2b40' stroke-width='1'/>"
        + "<path d='M60 33Q70 27 80 33L78 50Q70 55 62 50Z' fill='url(#e)' stroke='#a52c43'/>"
        + "<g fill='none' stroke='#ffd9de' stroke-linecap='round' opacity='0.66'><path d='M59 38C39 20 20 21 17 32' stroke-width='2.2'/><path d='M81 38C101 20 120 21 123 32' stroke-width='2.2'/><path d='M54 72L62 53M86 72L78 53' stroke-width='1.3'/></g>"),

    G('v10:sc-pearl-chain', '奶油珍珠链', '珍珠', '0 0 200 40',
        "<defs><radialGradient id='p' cx='0.3' cy='0.25' r='0.75'><stop stop-color='#ffffff'/><stop offset='0.45' stop-color='#fff9e9'/><stop offset='0.78' stop-color='#dfd8cf'/><stop offset='1' stop-color='#aebac2'/></radialGradient></defs>"
        + "<path d='M8 23Q100 4 192 23' fill='none' stroke='#93a6b2' stroke-width='1.3' opacity='0.7'/>"
        + Array.from({ length: 11 }, (_, i) => {
            const x = 10 + i * 18;
            const y = 22 - Math.sin((i / 10) * Math.PI) * 8;
            return `<circle cx='${x}' cy='${y.toFixed(1)}' r='8.2' fill='url(#p)' stroke='#c7c6c2' stroke-width='0.55'/><circle cx='${x - 2.4}' cy='${(y - 2.8).toFixed(1)}' r='2' fill='#ffffff' opacity='0.9'/>`;
        }).join('')),
    G('v10:sc-pearl-drop', '单颗珍珠吊坠', '珍珠', '0 0 60 100',
        "<defs><radialGradient id='p' cx='0.3' cy='0.24' r='0.8'><stop stop-color='#ffffff'/><stop offset='0.48' stop-color='#fff8e9'/><stop offset='0.8' stop-color='#d9d5cf'/><stop offset='1' stop-color='#9baeb9'/></radialGradient>"
        + "<linearGradient id='m'><stop stop-color='#f3f6f7'/><stop offset='0.5' stop-color='#9dabb4'/><stop offset='1' stop-color='#edf1f2'/></linearGradient></defs>"
        + "<ellipse cx='30' cy='20' rx='10' ry='15' fill='none' stroke='url(#m)' stroke-width='4'/><path d='M30 35V48' stroke='#9dabb4' stroke-width='3'/>"
        + "<circle cx='30' cy='68' r='23' fill='url(#p)' stroke='#bdc3c4' stroke-width='1'/><ellipse cx='22' cy='58' rx='6' ry='8' fill='#ffffff' opacity='0.82'/><path d='M17 82Q30 91 43 81' fill='none' stroke='#a8b4ba' opacity='0.4'/>"),
    G('v10:sc-pin', '银色安全别针', '甜酷', '0 0 70 140',
        "<defs><linearGradient id='m' x1='0' y1='0' x2='1' y2='0'><stop stop-color='#8295a2'/><stop offset='0.28' stop-color='#f7fafb'/><stop offset='0.52' stop-color='#adb9c0'/><stop offset='0.78' stop-color='#ffffff'/><stop offset='1' stop-color='#788d9a'/></linearGradient></defs>"
        + "<path d='M23 116L42 38C49 10 23 3 16 25C7 52 36 57 43 37L54 108C58 132 28 139 23 116Z' fill='none' stroke='url(#m)' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/>"
        + "<path d='M20 111L47 119L51 105L25 98Z' fill='url(#m)' stroke='#879aa5'/><path d='M29 105L43 110' stroke='#ffffff' stroke-width='2' opacity='0.8'/>"),

    G('v10:sc-heart', '樱桃釉光爱心', '甜酷', '0 0 110 110',
        "<defs><radialGradient id='h' cx='0.28' cy='0.2' r='0.9'><stop stop-color='#fb99a3'/><stop offset='0.38' stop-color='#d84c60'/><stop offset='1' stop-color='#9d263e'/></radialGradient></defs>"
        + "<path d='M55 96C43 82 10 62 10 35C10 10 42 5 55 28C68 5 100 10 100 35C100 62 67 82 55 96Z' fill='url(#h)' stroke='#98263d' stroke-width='1.6'/>"
        + "<path d='M24 34C25 21 39 18 46 29' fill='none' stroke='#ffd9dd' stroke-width='6' stroke-linecap='round' opacity='0.8'/>"
        + "<path d='M30 72Q52 88 73 70' fill='none' stroke='#851d34' stroke-width='2' opacity='0.32'/><circle cx='22' cy='25' r='3' fill='#ffffff' opacity='0.8'/>"),
    G('v10:sc-heart-line', '双线手绘爱心', '装饰', '0 0 110 100',
        "<path d='M55 88C42 74 13 58 12 34C11 13 39 8 55 30C71 8 99 13 98 34C97 58 68 74 55 88Z' fill='#fffaf1' fill-opacity='0.28' stroke='#a9bdc9' stroke-width='3' stroke-linejoin='round'/>"
        + "<path d='M55 78C44 67 22 53 22 36C22 24 39 20 55 40C71 20 88 24 88 36C88 53 66 67 55 78Z' fill='none' stroke='#c84b5c' stroke-width='1.4' stroke-dasharray='3 3'/>"),
    G('v10:sc-star', '蓝银渐变星星', '闪亮', '0 0 110 110',
        "<defs><linearGradient id='s' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#f7fbfc'/><stop offset='0.35' stop-color='#b9ccd7'/><stop offset='0.7' stop-color='#7895a9'/><stop offset='1' stop-color='#dce8ec'/></linearGradient></defs>"
        + "<path d='M55 7L67 40L103 43L75 65L84 101L55 81L26 101L35 65L7 43L43 40Z' fill='url(#s)' stroke='#718b9d' stroke-width='1.4' stroke-linejoin='round'/>"
        + "<path d='M55 16L63 45L91 47M42 47L25 47L42 62' fill='none' stroke='#ffffff' stroke-width='2.2' stroke-linecap='round' opacity='0.76'/>"
        + "<circle cx='46' cy='33' r='3' fill='#ffffff' opacity='0.8'/>"),
    G('v10:sc-sparkle', '四芒细闪', '闪亮', '0 0 100 100',
        "<defs><linearGradient id='s'><stop stop-color='#ffffff'/><stop offset='0.5' stop-color='#d5e3e9'/><stop offset='1' stop-color='#8ba5b5'/></linearGradient></defs>"
        + "<path d='M50 3C53 34 66 47 97 50C66 53 53 66 50 97C47 66 34 53 3 50C34 47 47 34 50 3Z' fill='url(#s)' stroke='#9db2bf' stroke-width='0.8'/>"
        + "<path d='M50 18V82M18 50H82' stroke='#ffffff' stroke-width='1.2' opacity='0.75'/><circle cx='50' cy='50' r='4' fill='#fffaf1'/>"),
    G('v10:sc-dash', '双色虚线轨迹', '装饰', '0 0 180 30',
        "<path d='M4 18C42 2 75 29 111 13S161 8 176 15' fill='none' stroke='#8fa9b9' stroke-width='2.4' stroke-linecap='round' stroke-dasharray='2 8'/>"
        + "<path d='M5 24C48 11 82 31 124 19S159 16 175 21' fill='none' stroke='#c84b5c' stroke-width='1' stroke-linecap='round' stroke-dasharray='5 6' opacity='0.8'/>"),

    G('v10:sc-frame', '奶油迷你相框', '纸品', '0 0 120 145',
        "<defs><linearGradient id='p' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#ffffff'/><stop offset='0.6' stop-color='#fff8eb'/><stop offset='1' stop-color='#e5ddd2'/></linearGradient>"
        + "<linearGradient id='b' x1='0' y1='0' x2='0' y2='1'><stop stop-color='#c8d8df'/><stop offset='1' stop-color='#8faaba'/></linearGradient></defs>"
        + "<rect x='8' y='8' width='106' height='132' rx='3' fill='#536474' opacity='0.18'/><rect x='4' y='4' width='108' height='132' rx='3' fill='url(#p)' stroke='#d8d0c6'/>"
        + "<rect x='14' y='14' width='88' height='91' fill='url(#b)' stroke='#9eb2bd' stroke-width='0.8'/><path d='M14 83L39 57L57 73L76 46L102 78V105H14Z' fill='#dfe9e9' opacity='0.6'/>"
        + "<circle cx='79' cy='35' r='10' fill='#fff8e9' opacity='0.8'/><path d='M26 120H81' stroke='#b4a99e' stroke-width='2' stroke-linecap='round'/><path d='M88 117C88 111 98 111 98 117C98 123 91 127 93 127C91 127 83 123 83 117C83 113 88 112 88 117Z' fill='#c84b5c'/>"),
    G('v10:sc-note', '蓝边折角便签', '纸品', '0 0 130 110',
        "<defs><linearGradient id='n' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#fffef8'/><stop offset='1' stop-color='#eee8dd'/></linearGradient></defs>"
        + "<path d='M7 9H124V83L99 105H7Z' fill='#536474' opacity='0.14'/><path d='M3 3H120V79L95 101H3Z' fill='url(#n)' stroke='#b7c8d1'/>"
        + "<path d='M95 101V79H120Z' fill='#c8d8df' stroke='#aebfc8'/><rect x='3' y='3' width='9' height='98' fill='#a9bdc9' opacity='0.8'/>"
        + "<g stroke='#9fb2bd' stroke-width='1.6' stroke-linecap='round' opacity='0.72'><path d='M26 29H96M26 45H105M26 61H82'/></g><path d='M28 82C28 73 42 73 42 82C42 90 35 94 35 94C35 94 22 88 22 81C22 75 28 74 28 82Z' fill='#c84b5c' opacity='0.86'/>"),
    G('v10:sc-torn', '奶油撕纸', '纸品', '0 0 180 110',
        "<defs><linearGradient id='t' x1='0' y1='0' x2='0' y2='1'><stop stop-color='#fffdf6'/><stop offset='1' stop-color='#e9e1d5'/></linearGradient></defs>"
        + "<path d='M4 12L17 7L28 12L41 5L53 10L69 4L82 11L96 6L111 12L126 5L139 10L153 4L176 11L172 29L178 43L171 58L176 73L169 88L173 102L151 98L139 105L124 99L107 106L91 100L73 105L58 99L41 104L27 98L9 103L12 85L5 71L11 54L4 39L10 25Z' fill='url(#t)' stroke='#d8cfc3' stroke-width='1.1'/>"
        + "<path d='M15 20L31 16M50 14L67 12M117 16L139 13M18 91L38 94M130 94L153 90' stroke='#ffffff' stroke-width='2' opacity='0.8'/>"
        + "<g stroke='#bdcbd1' stroke-width='1' opacity='0.58'><path d='M30 39H145M25 55H153M34 71H126'/></g><g fill='#c84b5c' opacity='0.45'><circle cx='23' cy='38' r='1.5'/><circle cx='21' cy='54' r='1.5'/><circle cx='28' cy='70' r='1.5'/></g>"),
    G('v10:sc-tag', '樱桃红小吊牌', '纸品', '0 0 100 130',
        "<defs><linearGradient id='r' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#df6a79'/><stop offset='1' stop-color='#a92e45'/></linearGradient></defs>"
        + "<path d='M16 15H84L94 39V120H6V39Z' fill='url(#r)' stroke='#962b40' stroke-width='1.2'/><circle cx='50' cy='30' r='8' fill='#fff8eb' stroke='#8f3444' stroke-width='2'/>"
        + "<path d='M50 22C47 8 59 2 67 7' fill='none' stroke='#9aaeb8' stroke-width='2'/><rect x='18' y='52' width='64' height='43' rx='2' fill='#fff8eb' opacity='0.94'/>"
        + "<path d='M28 66H71M28 78H60' stroke='#9aacb5' stroke-width='2' stroke-linecap='round'/><circle cx='73' cy='107' r='3' fill='#f6bdc4'/>"),
    G('v10:sc-tape-blue', '雾蓝星星小胶带', '胶带', '0 0 140 40',
        "<defs><linearGradient id='t'><stop stop-color='#dce8ec' stop-opacity='0.9'/><stop offset='0.5' stop-color='#9eb7c5' stop-opacity='0.76'/><stop offset='1' stop-color='#d7e4e9' stop-opacity='0.9'/></linearGradient></defs>"
        + "<path d='M2 4L10 1L18 4L27 1L36 4L45 1L54 4L63 1L72 4L81 1L90 4L99 1L108 4L117 1L126 4L138 2L136 37L125 34L116 38L106 34L96 38L86 34L76 38L66 34L56 38L46 34L36 38L26 34L16 38L3 35Z' fill='url(#t)'/>"
        + "<g fill='#fffaf1' opacity='0.82'>" + Array.from({ length: 7 }, (_, i) => `<path d='M${12 + i * 19} 10l2.2 6l6 .5l-4.7 3.8l1.5 6l-5-3.4l-5 3.4l1.5-6l-4.7-3.8l6-.5Z'/>`).join('') + "</g><path d='M5 7H134' stroke='#ffffff' stroke-width='1' opacity='0.55'/>"),
    G('v10:sc-tape-red', '樱桃格纹小胶带', '胶带', '0 0 140 40',
        "<defs><linearGradient id='t'><stop stop-color='#e78591' stop-opacity='0.82'/><stop offset='0.5' stop-color='#bd4054' stop-opacity='0.74'/><stop offset='1' stop-color='#e899a2' stop-opacity='0.84'/></linearGradient></defs>"
        + "<path d='M2 3L14 1L25 4L38 1L50 4L63 1L76 4L89 1L102 4L115 1L138 3L136 37L123 34L110 38L97 34L84 38L71 34L58 38L45 34L32 38L19 34L3 37Z' fill='url(#t)'/>"
        + "<g stroke='#fff4ec' stroke-width='1' opacity='0.56'><path d='M0 10H140M0 29H140M20 0V40M50 0V40M80 0V40M110 0V40'/></g><path d='M5 6H135' stroke='#ffffff' opacity='0.5'/>"),

    G('v10:sc-flower', '奶油五瓣小花', '花园', '0 0 120 120',
        "<defs><radialGradient id='p' cx='0.35' cy='0.25' r='0.85'><stop stop-color='#ffffff'/><stop offset='0.6' stop-color='#fff7e8'/><stop offset='1' stop-color='#c9d8dc'/></radialGradient>"
        + "<radialGradient id='c'><stop stop-color='#f6a0aa'/><stop offset='1' stop-color='#b83249'/></radialGradient></defs>"
        + "<g fill='url(#p)' stroke='#afc2cb' stroke-width='1'>" + [0, 72, 144, 216, 288].map(a => `<ellipse cx='60' cy='31' rx='17' ry='27' transform='rotate(${a} 60 60)'/>`).join('') + "</g>"
        + "<g fill='none' stroke='#ffffff' stroke-width='2' opacity='0.75'>" + [0, 72, 144, 216, 288].map(a => `<path d='M60 17V43' transform='rotate(${a} 60 60)'/>`).join('') + "</g>"
        + "<circle cx='60' cy='60' r='13' fill='url(#c)' stroke='#a83447'/><g fill='#ffe7dd'>" + [0, 60, 120, 180, 240, 300].map(a => `<circle cx='60' cy='52' r='1.8' transform='rotate(${a} 60 60)'/>`).join('') + "</g><circle cx='56' cy='55' r='3' fill='#ffffff' opacity='0.65'/>"),
    G('v10:sc-butterfly', '迷你雾蓝蝴蝶', '花园', '0 0 130 110',
        "<defs><linearGradient id='w' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#edf5f5'/><stop offset='0.45' stop-color='#a9c0cc'/><stop offset='1' stop-color='#69899e'/></linearGradient></defs>"
        + "<path d='M59 54C39 12 5 4 9 36C11 55 29 61 48 61C25 65 14 88 34 96C49 101 58 79 62 63Z' fill='url(#w)' stroke='#6f8d9e' stroke-width='1.2'/>"
        + "<path d='M71 54C91 12 125 4 121 36C119 55 101 61 82 61C105 65 116 88 96 96C81 101 72 79 68 63Z' fill='url(#w)' stroke='#6f8d9e' stroke-width='1.2'/>"
        + "<path d='M62 45C58 32 52 27 48 25M68 45C72 32 78 27 82 25' fill='none' stroke='#536c7b' stroke-width='1.4' stroke-linecap='round'/>"
        + "<path d='M65 43C58 43 58 78 65 88C72 78 72 43 65 43Z' fill='#4c6372'/><g fill='#c84b5c'><circle cx='29' cy='34' r='5'/><circle cx='101' cy='34' r='5'/><circle cx='37' cy='79' r='3.5'/><circle cx='93' cy='79' r='3.5'/></g>"
        + "<g fill='none' stroke='#ffffff' stroke-width='2' opacity='0.65'><path d='M17 28Q36 23 51 51M113 28Q94 23 79 51M29 87Q45 83 54 65M101 87Q85 83 76 65'/></g>"),
    G('v10:sc-bubble', '圆点泡泡', '装饰', '0 0 120 120',
        "<defs><radialGradient id='b' cx='0.3' cy='0.22' r='0.85'><stop stop-color='#ffffff' stop-opacity='0.9'/><stop offset='0.55' stop-color='#d9e6ea' stop-opacity='0.65'/><stop offset='1' stop-color='#8faaba' stop-opacity='0.5'/></radialGradient></defs>"
        + "<circle cx='57' cy='54' r='45' fill='url(#b)' stroke='#8fa8b6' stroke-width='1.3' stroke-dasharray='2 3'/><circle cx='91' cy='91' r='20' fill='url(#b)' stroke='#a0b5c0'/><circle cx='24' cy='98' r='10' fill='url(#b)' stroke='#a0b5c0'/>"
        + "<g fill='#c84b5c' opacity='0.76'><circle cx='38' cy='39' r='4'/><circle cx='67' cy='29' r='3'/><circle cx='76' cy='61' r='5'/><circle cx='43' cy='70' r='3'/><circle cx='93' cy='90' r='3'/></g>"
        + "<g fill='#ffffff' opacity='0.9'><circle cx='29' cy='27' r='6'/><circle cx='54' cy='48' r='3'/><circle cx='87' cy='84' r='4'/><circle cx='21' cy='95' r='2'/></g><path d='M20 55C22 31 41 15 62 14' fill='none' stroke='#ffffff' stroke-width='3' stroke-linecap='round' opacity='0.65'/>"),
];
