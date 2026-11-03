import { ASPECT } from '../../assets/base.js';
import { MAXIMAL_ASSETS } from '../../assets/maximal.js';
import { REFINEMENT_ASSETS } from '../../assets/refinements.js';
import { REVISION_ASSETS } from '../../assets/revision.js';
import { CollagePage } from '../collage-kit.js';
import { Page as BasePage } from './kit.js';

const MATERIALS=new Map([...MAXIMAL_ASSETS,...REFINEMENT_ASSETS,...REVISION_ASSETS].map(a=>[a.id,{...a,identity:a.url.split('/assets/').pop()}]));
const OMIT=new Set(['film','blue-label','hanging-pearls','pearl-drape','study-pearl-curve']);
const EMPTY_LABEL=/(圆形日期标|收藏编号|圆形号码底|标题贴纸|文字票签|主像注签|肖像的手写注签|信末收藏标签)/;
const GROUP_NAMES={bg:'底纹与叠纸',main:'主头像',left:'副图与相册',right:'相片条与特写',flowers:'主题小物',hardware:'链条与装订',details:'票据与印记'};
const artworkGroup=e=>/^(flowers|hardware|details|left|right|main)-/.test(e.groupId||'');

/** 构图只使用纸张、照片与实物；人物姓名和可选注记由用户自行添加。 */
export class CuratedPage extends BasePage {
    constructor(W,H,profile,key){super(W,H,profile,key);this.usedArtwork=new Set();}
    type(){return null;}
    mono(){return null;}
    name(){return null;}
    note(){return null;}
    foot(){return null;}
    tag(){return null;}
    number(){return null;}
    resolveSlug(slug){
        return this.p.id==='school'&&slug==='study-camera'?'proof-soft-camera':slug;
    }
    material(slug,x,y,w,h,r=0,o=1,z=1.3,label='',front=false,group='bg',fit='contain'){
        slug=this.resolveSlug(slug);
        if(OMIT.has(slug))return null;
        const key=MATERIALS.get('v10:mx-'+slug)?.identity;
        const isArtwork=group!=='bg'&&!!key;
        if(isArtwork&&this.usedArtwork.has(key))return null;
        const e=super.material(slug,x,y,w,h,r,o,z,label,front,group,fit);
        if(!label&&slug.startsWith('rev-'))e.label=MATERIALS.get(e.assetId)?.name||slug;
        if(isArtwork){this.usedArtwork.add(key);e.artworkKey=key;}
        return e;
    }
    art(slug,...args){
        slug=this.resolveSlug(slug);
        const identity=MATERIALS.get('v10:mx-'+slug)?.identity;
        if(identity&&this.usedArtwork.has(identity))return null;
        const e=super.art(slug,...args);
        // 放在照片后方的实物也只使用一次；普通衬纸可用于不同照片的装裱。
        if(e&&identity){e.artworkKey=identity;this.usedArtwork.add(identity);}
        return e;
    }
    surface(key,x,y,w,h,r=0,o=1,z=1,label='版式衬纸',front=false,group='bg'){
        if(label==='桌面状态栏')return null;
        return super.surface(key,x,y,w,h,r,o,z,label,front,group);
    }
    photo(...args){const e=super.photo(...args);e.caption='';e.showCaption=false;return e;}
    /** 每一条摆位对应一件实物；同源别名会移动已有实物，不会再复制一份。 */
    place(slug,x,y,size,r=0,front=true,z=7,group='flowers'){
        slug=this.resolveSlug(slug);
        if(OMIT.has(slug))return null;
        const id='v10:mx-'+slug,key=MATERIALS.get(id)?.identity;
        const existing=key&&this.elements.find(e=>e.artworkKey===key);
        if(!existing)return this.art(slug,x,y,size,r,front,group,z);
        const ar=ASPECT[id]||1,d=size*this.u,w=ar>=1?d:d*ar,h=ar>=1?d/ar:d;
        const gid=group+'-'+(front?'front':'back');
        Object.assign(existing,{x:x*this.W-w/2,y:y*this.H-h/2,width:w,height:h,rotation:r,z,layer:front?'front':'back',groupId:gid,assetId:id,fit:'contain'});
        if(!this.groups.has(gid))this.groups.set(gid,{id:gid,name:GROUP_NAMES[group],z,layer:existing.layer,collapsed:group==='bg',visibilityMode:'mask'});
        return existing;
    }
}

/** 兼容最早确认的学园三尺寸，并统一关闭照片自动注记。 */
export function loadScene(scene,W,H,profile,key){
    const p=new CuratedPage(W,H,profile,key);
    Object.assign(p,{avatar:{...scene.avatar},units:scene.avatarUnits,anchorX:scene.anchorX,anchorY:scene.anchorY});
    p.groups=new Map(scene.groups.map(g=>[g.id,{...g}]));
    p.elements=scene.elements.filter(e=>e.type==='image'&&!EMPTY_LABEL.test(e.label||''));
    const kept=[];
    for(const e of p.elements){
        if(e.photoRole){
            e.caption='';e.showCaption=false;
            if(e.photoRole==='secondary'&&e.focusY>55){e.focusY=e.width/e.height>1.3?25:42;if(e.defaultCrop)e.defaultCrop.focusY=e.focusY;}
            if(e.photoRole==='secondary'&&e.width/e.height>1.6&&e.cropZoom>=1.7){e.focusY=27;if(e.defaultCrop)e.defaultCrop.focusY=e.focusY;}
            kept.push(e);continue;
        }
        let slug=e.assetId?.startsWith('v10:mx-')?e.assetId.slice(7):'';
        if(OMIT.has(slug))continue;
        const mapped=p.resolveSlug(slug);
        if(mapped!==slug){
            const id='v10:mx-'+mapped,ar=ASPECT[id]||1,d=Math.max(e.width,e.height),cx=e.x+e.width/2,cy=e.y+e.height/2;
            e.width=ar>=1?d:d*ar;e.height=ar>=1?d/ar:d;e.x=cx-e.width/2;e.y=cy-e.height/2;e.assetId=id;slug=mapped;
        }
        const identity=MATERIALS.get(e.assetId)?.identity;
        if(identity&&(artworkGroup(e)||e.artworkKey)){
            if(p.usedArtwork.has(identity))continue;
            p.usedArtwork.add(identity);e.artworkKey=identity;
        }
        kept.push(e);
    }
    p.elements=kept;p.photoCount=kept.filter(e=>e.photoRole==='secondary').length;
    const main=kept.find(e=>e.photoRole==='main');
    if(main){
        p.avatar.frame=main.width/main.height>1.4?1.06:1.16;
        p.avatar.focusY=main.width/main.height>1.4?22:28;
    }
    return p;
}

export function finishScene(p){
    for(const e of p.elements){
        if(e.photoRole){e.caption='';e.showCaption=false;}
        delete e.artworkKey; // 来源索引仅用于构图，保存稿不携带内部去重标记。
    }
    p.groups=new Map([...p.groups].filter(([id])=>p.elements.some(e=>e.groupId===id)));
    return CollagePage.prototype.finish.call(p);
}
