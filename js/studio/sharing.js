import {renderCollage} from '../exporter.js';
import {characterFields} from '../templates.js';
import {normalizeMetadata} from '../template-meta.js';
import {studioDialog,status,esc,actionError} from './views.js';

export function openSharing(editor){
 const meta=normalizeMetadata(editor.config.shareMetadata);let coverBlob=null,tempUrl=null,removeCover=false;
 const {dialog}=studioDialog(editor,'模板封面与介绍',`<p class="star-dialog-hint">封面、作者和说明显示在模板介绍页，随模板一起导出。画面中的图层保持原稿。</p><label>模板标题<input name="title" maxlength="80" value="${esc(meta.title)}"></label><label>作者<input name="author" maxlength="80" value="${esc(meta.author)}"></label><label>模板说明<textarea name="description" rows="3" maxlength="1200">${esc(meta.description)}</textarea></label><label>素材来源与分享说明<textarea name="source" rows="3" maxlength="1600">${esc(meta.source)}</textarea></label><div class="star-share-cover"><img data-share-cover alt="模板封面" hidden><div><button data-cover-generate>用当前画布生成封面</button><button data-cover-upload>上传封面</button><button data-cover-remove>移除封面</button></div></div><input type="file" accept="image/png,image/jpeg,image/webp" data-share-file hidden><p data-studio-status role="status"></p><div class="star-dialog-actions"><button data-share-cancel>取消</button><button data-share-apply class="star-primary">保存模板信息</button></div>`,{className:'star-share-dialog',onClose:()=>{if(tempUrl)URL.revokeObjectURL(tempUrl);}});
 const preview=dialog.querySelector('[data-share-cover]');
 if(meta.coverAssetId){const old=editor.assetUrls.get(meta.coverAssetId);if(old){preview.src=old;preview.hidden=false;}}
 const acceptCanvas=async canvas=>{
  const small=document.createElement('canvas'),scale=Math.min(1,420/canvas.width,280/canvas.height);small.width=Math.max(1,Math.round(canvas.width*scale));small.height=Math.max(1,Math.round(canvas.height*scale));small.getContext('2d').drawImage(canvas,0,0,small.width,small.height);
  const blob=await new Promise(resolve=>small.toBlob(resolve,'image/webp',.82));if(!blob||blob.size>512*1024)throw new Error('封面无法生成，请换一张图片');
  if(!dialog.isConnected)return;if(tempUrl)URL.revokeObjectURL(tempUrl);coverBlob=blob;removeCover=false;tempUrl=URL.createObjectURL(blob);preview.src=tempUrl;preview.hidden=false;status(dialog,'封面已准备好，保存信息后生效');
 };
 dialog.addEventListener('click',actionError(dialog,async event=>{
  if(event.target.closest('[data-cover-generate]')){status(dialog,'正在生成封面…');await acceptCanvas(await renderCollage(editor.config,{avatarUrl:editor.avatarUrl,assetUrls:editor.assetUrls,fields:characterFields(editor.character),quality:.45}));}
  if(event.target.closest('[data-cover-upload]'))dialog.querySelector('[data-share-file]').click();
  if(event.target.closest('[data-cover-remove]')){coverBlob=null;removeCover=true;preview.removeAttribute('src');preview.hidden=true;}
  if(event.target.closest('[data-share-cancel]'))dialog.close();
  if(event.target.closest('[data-share-apply]')){
   let coverAssetId=removeCover?'':meta.coverAssetId;
   if(coverBlob){const asset=await editor.store.saveAsset(coverBlob,'__template_covers__','模板封面');if(editor.closed||!dialog.isConnected){await editor.store.remove('assets',asset.id);return;}coverAssetId=asset.id;editor.assetUrls.set(asset.id,URL.createObjectURL(asset.blob));}
   const next=normalizeMetadata(Object.fromEntries(['title','author','description','source'].map(key=>[key,dialog.querySelector(`[name="${key}"]`).value])));next.coverAssetId=coverAssetId;
   editor.mutate(()=>{editor.config.shareMetadata=next;});dialog.close();editor.notify('模板信息已保存，导出时会一并带上');
  }
 }));
 dialog.querySelector('[data-share-file]').addEventListener('change',actionError(dialog,async event=>{
  const file=event.target.files?.[0];event.target.value='';if(!file)return;if(file.size>20*1024*1024)throw new Error('封面原图超过 20 MB，请先缩小');
  const bitmap=await createImageBitmap(file);try{const canvas=document.createElement('canvas'),scale=Math.min(1,840/bitmap.width,560/bitmap.height);canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);await acceptCanvas(canvas);}finally{bitmap.close();}
 }));
}
