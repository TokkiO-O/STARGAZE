import {clampFocus,clampFrame} from '../templates.js';
import {editorDialog} from './dialog.js';

/** 裁切只作用于工作副本；按“应用”后一次提交，取消和 Escape 不修改原图层。 */
export function openCropDialog(editor,id){
 const original=editor.config.elements.find(e=>e.id===id);if(!original||original.photoRole!=='secondary')return;
 const work=structuredClone(original),ratio=work.width/work.height;
 const width=Math.min(540,Math.max(210,innerWidth-80)),height=Math.min(420,width/ratio),W=height*ratio;
 const {dialog}=editorDialog(editor,'副图取景',`
  <p class="star-dialog-hint">在照片上拖动调整位置，也可以使用下方滑块。只改变这张副图的取景。</p>
  <div class="star-crop-viewport" style="width:${W}px;height:${height}px"></div>
  <label>缩放 <input data-crop="cropZoom" type="range" min="1" max="3" step="0.01"></label>
  <label>左右 <input data-crop="focusX" type="range" min="0" max="100" step="1"></label>
  <label>上下 <input data-crop="focusY" type="range" min="0" max="100" step="1"></label>
  <div class="star-dialog-actions"><button type="button" data-crop-default>默认取景</button><button type="button" data-crop-cancel>取消</button><button type="button" data-crop-apply class="star-primary">应用取景</button></div>`,{className:'star-crop-dialog'});
 const viewport=dialog.querySelector('.star-crop-viewport');
 const redraw=()=>{
  for(const input of dialog.querySelectorAll('[data-crop]'))input.value=String(work[input.dataset.crop]??(input.dataset.crop==='cropZoom'?1:50));
  const photo={...work,x:0,y:0,width:W,height:height,rotation:0},config={...editor.config,canvas:{...editor.config.canvas,width:W,height:height}};
  const node=editor.renderer.buildElement(photo,config,editor.assetUrls,editor.avatarUrl);
  if(node){node.style.zIndex='1';viewport.replaceChildren(node);}
 };
 dialog.addEventListener('input',event=>{const field=event.target.dataset.crop;if(!field)return;work[field]=field==='cropZoom'?clampFrame(event.target.value):clampFocus(event.target.value);redraw();});
 let drag=null;
 viewport.addEventListener('pointerdown',event=>{if(event.button!==0)return;event.preventDefault();drag={id:event.pointerId,x:event.clientX,y:event.clientY,fx:work.focusX??50,fy:work.focusY??50};viewport.setPointerCapture(event.pointerId);});
 viewport.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;work.focusX=clampFocus(drag.fx-(event.clientX-drag.x)/W*100);work.focusY=clampFocus(drag.fy-(event.clientY-drag.y)/height*100);redraw();});
 viewport.addEventListener('pointerup',()=>{drag=null;});viewport.addEventListener('pointercancel',()=>{drag=null;});
 dialog.querySelector('[data-crop-default]').addEventListener('click',()=>{const crop=original.defaultCrop||{};work.cropZoom=clampFrame(crop.cropZoom??1.25);work.focusX=clampFocus(crop.focusX??50);work.focusY=clampFocus(crop.focusY??40);redraw();});
 dialog.querySelector('[data-crop-cancel]').addEventListener('click',()=>dialog.close());
 dialog.querySelector('[data-crop-apply]').addEventListener('click',()=>{
  const current=editor.config.elements.find(e=>e.id===id);if(current)editor.mutate(()=>{current.cropZoom=clampFrame(work.cropZoom??1);current.focusX=clampFocus(work.focusX??50);current.focusY=clampFocus(work.focusY??50);});
  dialog.close();
 });
 redraw();
}
