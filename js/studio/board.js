import {CANVAS_PRESETS,LAYOUTS,captureSizeState} from '../templates.js';
import {copy} from './model.js';
import {studioDialog,status,esc,thumbnail,actionError} from './views.js';

/** 只同步明确勾选的数据字段，几何、图层顺序和各自的取景均保持原稿。 */
export function synchronizeSizes(editor,targets,{theme=false,photos=[]}={}){
 const source=copy(editor.config),sourcePhotos=source.elements.filter(e=>e.photoRole==='secondary'),current=editor.currentSizeKey();let changed=0,skipped=0;
 if(!theme&&!photos.length)throw new Error('请先选择要同步的配色或副图');
 if(!targets.length)throw new Error('请勾选目标尺寸');
 editor.mutate(()=>{
  editor.commitSizeDraft();const sizes={...editor.config.sizes};
  for(const key of new Set(targets)){
   if(key===current||!CANVAS_PRESETS[key])continue;
   const target=editor.variantConfigFor(key);if(theme)target.theme=copy(source.theme);
   const items=target.elements.filter(e=>e.photoRole==='secondary');
   for(const index of photos){const photo=sourcePhotos[index];if(!photo)continue;const match=items.find(e=>e.photoSlotId&&e.photoSlotId===photo.photoSlotId)||items[index];if(match){match.assetId=photo.assetId;changed++;}else skipped++;}
   sizes[key]=captureSizeState(target);
  }
  editor.config.sizes=sizes;
 });return {changed,skipped};
}

export function openSizeBoard(editor){
 editor.commitSizeDraft();const current=editor.currentSizeKey(),photos=editor.config.elements.filter(e=>e.photoRole==='secondary');
 const {dialog}=studioDialog(editor,'九尺寸总览',`<p class="star-dialog-hint">预览当前修改稿，点击任一尺寸继续编辑。同步只改勾选内容，每个尺寸的排版与取景分别保留。</p><div class="star-board-grid">${Object.entries(CANVAS_PRESETS).map(([key,p])=>`<article><label><input type="checkbox" data-sync-target="${key}" ${key===current?'disabled':''}>${esc(LAYOUTS[key].name)}${key===current?' · 当前':''}</label><button class="star-studio-thumb" data-size-edit="${key}" aria-label="编辑${esc(LAYOUTS[key].name)}"></button><small>${p.width} × ${p.height} · ${editor.config.sizes?.[key]?'已有稿件':'按本主题初始构图'}</small></article>`).join('')}</div><fieldset class="star-studio-options"><legend>从当前尺寸同步到勾选尺寸</legend><label><input type="checkbox" data-sync-theme>画布配色</label>${photos.map((p,i)=>`<label><input type="checkbox" data-sync-photo="${i}">副图 ${i+1} 来源 · ${p.assetId==='__avatar__'?'跟随头像':'独立图片'}</label>`).join('')}<button type="button" data-sync-apply>同步勾选内容</button></fieldset><p data-studio-status role="status"></p>`,{className:'star-size-board'});
 let generation=0;
 const paint=async()=>{const token=++generation;for(const key of Object.keys(CANVAS_PRESETS)){if(!dialog.isConnected||token!==generation)return;await thumbnail(editor,editor.variantConfigFor(key),dialog.querySelector(`[data-size-edit="${key}"]`));}};
 dialog.addEventListener('click',actionError(dialog,async event=>{
  const edit=event.target.closest('[data-size-edit]');if(edit){dialog.close();editor.applyCanvas(edit.dataset.sizeEdit);return;}
  if(event.target.closest('[data-sync-apply]')){
   const targets=[...dialog.querySelectorAll('[data-sync-target]:checked')].map(n=>n.dataset.syncTarget),photos=[...dialog.querySelectorAll('[data-sync-photo]:checked')].map(n=>Number(n.dataset.syncPhoto));
   const result=synchronizeSizes(editor,targets,{theme:dialog.querySelector('[data-sync-theme]').checked,photos});status(dialog,`已同步 ${targets.length} 个尺寸，可撤销。${result.skipped?'有 '+result.skipped+' 个目标副图位不存在，已跳过。':''}`);void paint();
  }
 }));void paint();
}
