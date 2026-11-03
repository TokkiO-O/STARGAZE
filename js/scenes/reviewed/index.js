import {confirmedSizes} from './confirmed-sizes.js';
import {buildReviewedPoster} from './posters.js';
import {buildFrenchPoster} from './french-poster.js';
import {buildSizePage} from './layouts.js';
import {REVIEWED_SURFACES} from './page.js';

export {REVIEWED_SURFACES};

// 九种原生画幅各构建一次，编辑器取用时复制，彼此不会共享可变图层。
const SIZES={chip:[280,110],compact:[200,150],circle:[240,240],polaroid:[300,245],collage:[420,285],tower:[300,460],banner:[560,285],scroll:[820,225],poster:[680,390]};
const scenes=new Map();
function buildNativeScene(id,key){
 const [W,H]=SIZES[key];
 const confirmed=confirmedSizes.get(id+'/'+key);
 const page=key==='poster'?(id==='french'?buildFrenchPoster():buildReviewedPoster(id)):confirmed?confirmed():buildSizePage(id,key,W,H),scene=page.finish();
 for(const photo of scene.elements.filter(e=>e.photoRole)){photo.caption='';photo.showCaption=false;}
 for(const g of scene.groups)if(g.id.startsWith('hardware-'))g.name='固定与贴饰';
 scene.groups=scene.groups.filter(g=>scene.elements.some(e=>e.groupId===g.id));
 scenes.set(id+'/'+key,{W,H,scene});
}

export function reviewedScene(W,H,id,key){
 if(!scenes.has(id+'/'+key))buildNativeScene(id,key);
 const source=scenes.get(id+'/'+key);if(!source)throw new Error(`缺少素材修订构图：${id}/${key}`);
 const scene=structuredClone(source.scene);
 // 每次套用拥有自己的元素标识；副图位标识继续按主题与画幅稳定保存。
 for(const e of scene.elements)e.id+='-'+Math.random().toString(36).slice(2,8);
 if(W===source.W&&H===source.H)return scene;
 const sx=W/source.W,sy=H/source.H,uniform=Math.min(sx,sy);
 // 自定义画布沿用最接近比例的设计，实物保留原比例，照片重新裁切。
 for(const e of scene.elements){
  const cx=(e.x+e.width/2)*sx,cy=(e.y+e.height/2)*sy;
  const keepAspect=!e.photoRole&&e.fit==='contain';
  e.width*=keepAspect?uniform:sx;e.height*=keepAspect?uniform:sy;e.x=cx-e.width/2;e.y=cy-e.height/2;
 }
 const main=scene.elements.find(e=>e.photoRole==='main');
 scene.avatarUnits=Math.min(main.width,main.height);
 scene.avatar.widthRatio=main.width/scene.avatarUnits;scene.avatar.heightRatio=main.height/scene.avatarUnits;
 return scene;
}
