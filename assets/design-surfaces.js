import { G } from './base.js';

// Colour and type stay close to the original ten themes. These are editable
// layout surfaces; decorative artwork is registered separately in curated.js.
export const EDITORIAL_PALETTES = {
    school: { paper:'#f8fbfd', ink:'#34526b', soft:'#dcebf4', accent:'#6f9fbc', dark:'#26485d' },
    hk: { paper:'#f2e6ca', ink:'#302821', soft:'#d2bc99', accent:'#a54d39', dark:'#24201c' },
    y2k: { paper:'#fff7ff', ink:'#302440', soft:'#e9dafa', accent:'#df5caa', dark:'#3f3153' },
    french: { paper:'#fbf4ec', ink:'#5e4442', soft:'#ecd4d1', accent:'#aa6d7c', dark:'#6b4251' },
    mecha: { paper:'#d7dbdb', ink:'#242b2f', soft:'#858f95', accent:'#d7a63a', dark:'#252c31' },
    fairy: { paper:'#fff8e6', ink:'#604d37', soft:'#f4dfb5', accent:'#d58b49', dark:'#8b623f' },
    letter: { paper:'#f8f3e8', ink:'#48483e', soft:'#e5dece', accent:'#80826c', dark:'#3d433a' },
    stamp: { paper:'#f2ead6', ink:'#3e4030', soft:'#d2c7a7', accent:'#9c4b3e', dark:'#3e4e40' },
    gothic: { paper:'#282330', ink:'#eee4d8', soft:'#44394d', accent:'#baa5c8', dark:'#17151d' },
    sweetcool: { paper:'#fbf6ee', ink:'#3d4f5c', soft:'#dbe5e8', accent:'#a04150', dark:'#3d5264' },
};

export const DESIGN_SURFACES = [];
for (const [style, p] of Object.entries(EDITORIAL_PALETTES)) {
    const add=(key,name,body)=>DESIGN_SURFACES.push({
        ...G(`v10:design-${style}-${key}`,name,'版式底材','0 0 200 200',body), styleId:style, hidden:true,
    });
    for (const [key,name] of [['paper','主题底纸'],['soft','浅色衬纸'],['accent','主题色块'],['dark','深色衬纸'],['ink','文字色块']]) {
        add(key,name,`<rect width="200" height="200" fill="${p[key]}"/>`);
    }
    add('round','圆角便签',`<rect x="1" y="1" width="198" height="198" rx="18" fill="${p.soft}"/>`);
    add('disk','圆形衬纸',`<circle cx="100" cy="100" r="99" fill="${p.soft}"/>`);
    add('ring','细线圆环',`<circle cx="100" cy="100" r="96" fill="none" stroke="${p.accent}" stroke-width="1.2"/>`);
    add('border','细线版框',`<rect x="2" y="2" width="196" height="196" fill="none" stroke="${p.accent}" stroke-width="0.8"/>`);
    add('grid','方格底纹',`<defs><pattern id="g" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M16 0H0V16" fill="none" stroke="${p.accent}" stroke-width="0.5" opacity="0.24"/></pattern></defs><rect width="200" height="200" fill="url(#g)"/>`);
    add('rules','信笺横线',`<defs><pattern id="r" width="200" height="16" patternUnits="userSpaceOnUse"><path d="M0 15.5H200" stroke="${p.accent}" stroke-width="0.6" opacity="0.2"/></pattern></defs><rect width="200" height="200" fill="url(#r)"/>`);
    add('holo','千禧虹彩底纸',`<defs><linearGradient id="h" x2="1" y2="1"><stop stop-color="#ead8fd"/><stop offset="0.37" stop-color="#d8f1f9"/><stop offset="0.7" stop-color="#ffe0f0"/><stop offset="1" stop-color="#d8d7f3"/></linearGradient></defs><rect width="200" height="200" fill="url(#h)"/>`);
    add('damask','古堡菱纹',`<defs><pattern id="d" width="40" height="50" patternUnits="userSpaceOnUse"><path d="M20 2L38 25 20 48 2 25Z" stroke="${p.accent}" stroke-width="0.6" fill="none" opacity="0.16"/><path d="M20 16v18m-6-9h12" stroke="${p.accent}" stroke-width="0.5" opacity="0.12"/></pattern></defs><rect width="200" height="200" fill="url(#d)"/>`);
    add('tech','档案刻度与定位线',`<g stroke="${p.paper}" opacity="0.2" fill="none"><path d="M12 35V12h23M165 12h23v23M12 165v23h23M165 188h23v-23" stroke-width="1.4"/><path d="M45 100h110M100 45v110" stroke-dasharray="2 6" stroke-width="0.65"/></g>`);
    add('perf','集邮齿孔页',`<rect x="3" y="3" width="194" height="194" fill="${p.paper}" stroke="${p.soft}" stroke-width="5" stroke-dasharray="2 6"/><rect x="12" y="12" width="176" height="176" fill="none" stroke="${p.accent}" stroke-width="0.6"/>`);
}
