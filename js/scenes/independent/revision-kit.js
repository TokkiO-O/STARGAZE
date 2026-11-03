import { CuratedPage, finishScene } from './curated-page.js';

/** 只复用装裱方法。照片关系、纸张边界和实物摆位在各主题的九份规格中分别编写。 */
export function revisedPage(W,H,profile,key,kind){
    const p=new CuratedPage(W,H,profile,key);
    if(kind==='gothic'){
        p.paper('dark');p.surface('damask',0,0,1,1,0,.85,.1,'暗紫织锦底纹');
        p.surface('pop',.025,.025,.95,.95,0,.17,.2,'酒红薄衬');
    }else if(kind==='stamp'){
        p.paper('soft');p.material('proof-textured-paper',0,0,1,1,0,.9,.1,'旧邮册纸面',false,'bg','cover');
        p.surface('grid',0,0,1,1,0,.25,.2,'邮册细格底纹');
    }else{
        p.paper('dark');p.material('proof-textured-paper',.018,.015,.964,.97,0,1,.1,'故事书旧纸',false,'bg','cover');
        p.surface('news',.028,.022,.94,.95,0,.55,.2,'旧书页的印刷肌理');
    }
    return p;
}

// 纸张用 cover 裁取原图，实物用 contain 保留外形；不拉伸花、书和邮票。
export function papers(p,rows){
    rows.forEach(([slug,x,y,w,h,r=0,o=1],i)=>p.material(slug,x,y,w,h,r,o,.7+i*.16,'',false,'bg','cover'));
}
export function objects(p,rows){
    for(const [slug,x,y,size,r=0,z=7,front=true] of rows)p.art(slug,x,y,size,r,front,front?'flowers':'details',z);
}
export function photographs(p,spec){
    p.hero(...spec.hero);
    const main=p.elements.find(e=>e.photoRole==='main');
    p.avatar.frameStyle=main.shape==='rect'?'rect':'none';
    if(p.p.id==='stamp'){
        // 主图保持矩形邮票，与副图邮票相配；齿孔纸只露出装裱边，不在相片中留空格。
        p.surface('perf',main.x/p.W-.016,main.y/p.H-.018,main.width/p.W+.032,main.height/p.H+.036,0,1,3.7,'主图邮票齿孔衬纸',false,'main');
    }
    p.avatar.frame=main.width/main.height>1.3?1.04:1.12;
    p.avatar.focusY=main.width/main.height>1.3?22:27;
    for(const row of spec.photos)p.photo(...row);
}
export function compose(p,spec){
    papers(p,spec.papers||[]);
    photographs(p,spec);
    objects(p,spec.objects||[]);
    if(spec.mark)p.stampMark(...spec.mark);
    return finishScene(p);
}
