import { assetUrl } from './url.js';
import { ASPECT } from './base.js';

const CURATED = [
  {
    "slug": "blue-daisy",
    "name": "雾蓝雏菊",
    "aspect": 0.998246
  },
  {
    "slug": "blue-cassette",
    "name": "碎花磁带",
    "aspect": 1.559596
  },
  {
    "slug": "blue-star",
    "name": "奶蓝软星",
    "aspect": 1.040268
  },
  {
    "slug": "blue-bow",
    "name": "雾蓝缎带",
    "aspect": 1.053459
  },
  {
    "slug": "blue-cherries",
    "name": "银蓝樱桃",
    "aspect": 0.9
  },
  {
    "slug": "lined-note",
    "name": "横线撕纸便签",
    "aspect": 1.290541
  },
  {
    "slug": "paperclip",
    "name": "银色回形针",
    "aspect": 0.305419
  },
  {
    "slug": "star-clip",
    "name": "星形回形针",
    "aspect": 0.997512
  },
  {
    "slug": "vinyl",
    "name": "黑胶唱片",
    "aspect": 1.001689
  },
  {
    "slug": "radio",
    "name": "老式收音机",
    "aspect": 1.307292
  },
  {
    "slug": "envelope",
    "name": "牛皮信封",
    "aspect": 1.490683
  },
  {
    "slug": "newspaper",
    "name": "茶色报纸角",
    "aspect": 0.793207
  },
  {
    "slug": "ticket",
    "name": "入场票印章",
    "aspect": 2.181818
  },
  {
    "slug": "transit-ticket",
    "name": "旧车票印章",
    "aspect": 0.476667
  },
  {
    "slug": "seat",
    "name": "座位标签印章",
    "aspect": 2.977667
  },
  {
    "slug": "stamp-green",
    "name": "植物收藏邮票",
    "aspect": 0.805833
  },
  {
    "slug": "stamp-red",
    "name": "红花收藏邮票",
    "aspect": 0.805833
  },
  {
    "slug": "botanical",
    "name": "旧纸植物标本",
    "aspect": 0.3875
  },
  {
    "slug": "ivory-paper",
    "name": "象牙白肌理纸",
    "aspect": 0.433333
  },
  {
    "slug": "rose",
    "name": "豆沙玫瑰",
    "aspect": 1.145324
  },
  {
    "slug": "pink-bow",
    "name": "蔷薇蕾丝蝴蝶结",
    "aspect": 0.895833
  },
  {
    "slug": "cream-bow",
    "name": "香槟长缎带",
    "aspect": 0.619167
  },
  {
    "slug": "doily",
    "name": "镂空圆蕾丝纸",
    "aspect": 1.0
  },
  {
    "slug": "oval-lace",
    "name": "镂空椭圆蕾丝",
    "aspect": 1.270471
  },
  {
    "slug": "chrome-heart",
    "name": "液态银爱心",
    "aspect": 1.105991
  },
  {
    "slug": "chrome-star",
    "name": "液态银流星",
    "aspect": 0.699167
  },
  {
    "slug": "holo-cross",
    "name": "镭射四瓣星",
    "aspect": 1.001669
  },
  {
    "slug": "pixel-arrow",
    "name": "像素鼠标箭头",
    "aspect": 0.529963
  },
  {
    "slug": "chain",
    "name": "银色短链",
    "aspect": 3.387097
  },
  {
    "slug": "silver-rings",
    "name": "银色双环",
    "aspect": 1.203488
  },
  {
    "slug": "hazard",
    "name": "黄黑警戒带",
    "aspect": 9.72973
  },
  {
    "slug": "black-moth",
    "name": "暗纹黑蝶",
    "aspect": 1.842857
  },
  {
    "slug": "candle",
    "name": "古堡银色烛台",
    "aspect": 0.445
  },
  {
    "slug": "feather",
    "name": "黑羽毛",
    "aspect": 1.008122
  },
  {
    "slug": "story-bear",
    "name": "绘本白熊",
    "aspect": 1.0
  },
  {
    "slug": "story-cake",
    "name": "手绘草莓蛋糕",
    "aspect": 1.053333
  },
  {
    "slug": "rainbow",
    "name": "蜡笔彩虹",
    "aspect": 1.808333
  },
  {
    "slug": "doodle-stars",
    "name": "蜡笔星星",
    "aspect": 1.160853
  }
];

export const CURATED_ASSETS = CURATED.map(item => {
    const id = `v10:curated-${item.slug}`;
    ASPECT[id] = item.aspect;
    return { id, name: item.name, group: '精选素材', aspect: item.aspect,
        url: assetUrl(`assets/curated/${item.slug}.webp`) };
});
