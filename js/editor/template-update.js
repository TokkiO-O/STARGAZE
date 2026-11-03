import {CANVAS_PRESETS,createConfig,captureSizeState,applySizeState} from '../templates.js';
import {renderCollage} from '../exporter.js';
import {themePackages} from '../packages/manager.js';
import {openPackagePanel} from './package-panel.js';
import {editorDialog} from './dialog.js';

function replacement(editor,keepImages,keepCrop){
 const original=editor.config,id=original.templateId,key=editor.currentSizeKey(),sizes={};
 const current=captureSizeState(original);
 for(const size of Object.keys(CANVAS_PRESETS)){
  const fresh=createConfig(editor.key,editor.character.name,id,size);
  const old=size===key?current:original.sizes?.[size]||original.templateSizeDrafts?.[id]?.[size];
  if(old){
   const photos=(old.elements||[]).filter(e=>e.photoRole==='secondary');
   const freshPhotos=fresh.elements.filter(e=>e.photoRole==='secondary');
   freshPhotos.forEach((photo,index)=>{
    const source=photos.find(e=>e.photoSlotId&&e.photoSlotId===photo.photoSlotId)||photos[index];if(!source)return;
    if(keepImages)photo.assetId=source.assetId;
    if(keepCrop&&(keepImages||source.assetId==='__avatar__'))for(const field of ['cropZoom','focusX','focusY'])if(source[field]!=null)photo[field]=source[field];
   });
   if(keepCrop)for(const field of ['frame','focusX','focusY','rotate'])if(old.avatar?.[field]!=null)fresh.avatar[field]=old.avatar[field];
  }
  sizes[size]=captureSizeState(fresh);
 }
 let next={...structuredClone(original),sizes,templateSizeDrafts:{...original.templateSizeDrafts,[id]:structuredClone(sizes)}};
 if(sizes[key])next=applySizeState(next,sizes[key]);
 return next;
}

export function openTemplateUpdate(editor){
 const id=editor.config.templateId;if(id==='free'){editor.notify('自由画布不需要更新内置模板');return;}
 const packages=themePackages();if(packages&&!packages.ready(id)){openPackagePanel(editor,{focusId:id});return;}
 const {dialog}=editorDialog(editor,'更新本主题九尺寸',`
  <p class="star-dialog-hint">更新前会自动保存一份完整旧稿，之后可从“恢复更新前稿件”找回。</p>
  <label class="star-dialog-check"><input type="checkbox" data-update-images checked>保留已经替换的副图</label>
  <label class="star-dialog-check"><input type="checkbox" data-update-crop checked>保留已调整的主副图取景</label>
  <div class="star-update-previews"><div><strong>当前</strong><div data-update-before></div></div><div><strong>更新后</strong><div data-update-after></div></div></div>
  <p data-update-status role="status"></p><div class="star-dialog-actions"><button type="button" data-update-cancel>取消</button><button type="button" data-update-apply class="star-primary">应用更新</button></div>`,{className:'star-update-dialog'});
 let generation=0,candidate;
 const update=async()=>{
  const revision=++generation;candidate=replacement(editor,dialog.querySelector('[data-update-images]').checked,dialog.querySelector('[data-update-crop]').checked);
  try{
   const [before,after]=await Promise.all([renderCollage(editor.config,{avatarUrl:editor.avatarUrl,assetUrls:editor.assetUrls,quality:.25}),renderCollage(candidate,{avatarUrl:editor.avatarUrl,assetUrls:editor.assetUrls,quality:.25})]);
   if(!dialog.isConnected||revision!==generation)return;
   dialog.querySelector('[data-update-before]').replaceChildren(before);dialog.querySelector('[data-update-after]').replaceChildren(after);dialog.querySelector('[data-update-status]').textContent='九个尺寸分别更新，可撤销，也可从备份恢复。';
  }catch(error){if(dialog.isConnected)dialog.querySelector('[data-update-status]').textContent='预览暂不可用：'+error.message;}
 };
 dialog.addEventListener('change',()=>void update());dialog.querySelector('[data-update-cancel]').addEventListener('click',()=>dialog.close());
 dialog.querySelector('[data-update-apply]').addEventListener('click',async event=>{
  const button=event.currentTarget;button.disabled=true;
  try{
   await editor.store.saveThemeCheckpoint(editor.config);if(editor.closed||!dialog.isConnected)return;
   editor.mutate(()=>{editor.config=candidate;editor.selectedId=null;editor.selection=[];});dialog.close();editor.notify('九尺寸已更新，更新前稿件已备份');
  }catch(error){dialog.querySelector('[data-update-status]').textContent='未应用更新：'+error.message;button.disabled=false;}
 });
 void update();
}

export async function restoreTemplateCheckpoint(editor){
 const backup=await editor.store.getThemeCheckpoint(editor.key,editor.config.templateId);
 if(!backup?.config){editor.notify('本主题还没有更新备份');return;}
 if(!confirm('恢复本主题更新前的完整稿件？当前操作仍可撤销。'))return;
 editor.mutate(()=>{editor.config=structuredClone(backup.config);editor.selectedId=null;editor.selection=[];});editor.notify('已恢复更新前稿件');
}
