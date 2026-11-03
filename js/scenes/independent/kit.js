import { img } from '../../assets/base.js';
import { CollagePage } from '../collage-kit.js';
import { UNIQUE_SURFACES } from '../unique-surfaces.js';

const NAMES=new Map(UNIQUE_SURFACES.map(a=>[a.id,a.name]));
/** 只共享绘图原语；每个主题、每个固定尺寸的照片关系和排版在各自文件内定义。 */
export class Page extends CollagePage {
    plate(key,x=0,y=0,w=1,h=1,r=0,z=.2,front=false,group='bg') {
        const id='v10:unique-'+key;
        return this.add(img(id,x*this.W,y*this.H,w*this.W,h*this.H,{r,z,fit:'fill'}),NAMES.get(id)||'主题结构线',group,front);
    }
    paper(key,x=0,y=0,w=1,h=1,r=0,z=0,o=1,label='主题衬纸') {
        return this.surface(key,x,y,w,h,r,o,z,label);
    }
    upright(key,x,y,w,h,z=.3,label='主题纸张') { return this.paper(key,x,y,w,h,0,z,1,label); }
    rules(x,y,w,h,r=0,opacity=.4) { this.surface('ruled',x,y,w,h,r,opacity,.8,'手记横线'); }
    name(x,y,w,size=.08,r=-5,front=true) {
        return this.type('{{name|Mira}}',x,y,w,size,{font:this.p.hand,r,front,label:'角色姓名'});
    }
    note(value,x,y,w,size=.025,r=0,front=true) { return this.mono(value,x,y,w,size,{r,front,color:this.p.id==='mecha'?'paper':'ink',label:'细节注签 · '+value.replace(/\n/g,' ')}); }
    ornaments(rows,group='flowers') {
        for(const [slug,x,y,size,r=0,z=7,front=true] of rows)this.art(slug,x,y,size,r,front,group,z);
    }
    pearl(photo,scale=1.12) {
        const id=photo.width/photo.height<.85?'study-pearl-oval':'study-pearl-round';
        this.art(id,(photo.x+photo.width/2)/this.W,(photo.y+photo.height/2)/this.H,Math.max(photo.width,photo.height)/this.u*scale,photo.rotation,true,'left',5.3);
    }
    foot(value,x=.04,y=.96,w=.92,size=.022) { this.note(value,x,y,w,size); }
    window(x,y,w,h,r=0,z=1.3) { this.plate('window',x,y,w,h,r,z); }
    photo(x,y,w,h,shape=this.p.small,r=0,zoom=1.3,fx=50,fy=40,group='left',front=true) {
        // 新画幅里的宽副图保留完整面部；竖向副图可以展示更多衣着和姿态。
        // 已确认横幅的取景保持原设计。
        if(this.key!=='banner'&&fy>=60)fy=(w*this.W/(h*this.H)>1.02||shape==='polaroid')?28:48;
        return super.photo(x,y,w,h,shape,r,zoom,fx,fy,group,front);
    }
    stampMark(x,y,w=.15,h=.24,r=-12) { this.plate('postmark',x,y,w,h,r,7.2,true,'details'); }
    finish() {
        if(this.key!=='banner'&&this.avatar.widthRatio/this.avatar.heightRatio>1.25)this.avatar.focusY=22;
        if(this.p.id==='stamp'&&this.key!=='banner'){
            const photos=this.elements.filter(e=>e.photoRole);
            photos.forEach((photo,index)=>{
                const x=(photo.x-3)/this.W,y=(photo.y-3)/this.H,w=(photo.width+6)/this.W,h=(photo.height+6)/this.H;
                this.surface('border',x,y,w,h,photo.rotation,.62,1.3,'藏品独立装裱格',false,'bg');
                const yy=Math.min(.97,(photo.y+photo.height+3)/this.H);
                this.note(`PLATE / ${String(index+1).padStart(2,'0')}`,x+.01,yy,Math.min(w,.28),.018,photo.rotation);
            });
        }
        // 名称可长于示意名；姓名字组在预览与导出中按容器自动收紧。
        for(const element of this.elements)if(element.type==='text'&&element.text.includes('{{'))element.autoFit=true;
        return super.finish();
    }
}
