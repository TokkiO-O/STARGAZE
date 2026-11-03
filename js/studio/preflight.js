import {BUILTIN_MAP,CANVAS_PRESETS,LAYOUTS,isElementHidden} from '../templates.js';
import {themePackages} from '../packages/manager.js';
import {studioDialog,status,esc} from './views.js';

async function readableImage(blob){
 if(!blob?.size)return false;
 if(globalThis.createImageBitmap&&blob.type!=='image/svg+xml')try{const bitmap=await createImageBitmap(blob);const valid=bitmap.width>0&&bitmap.height>0;bitmap.close();return valid;}catch{}
 // 部分合法 SVG 可以作为图片绘制，但 createImageBitmap 不接受；用实际图片解码通道复核。
 const url=URL.createObjectURL(blob);
 try{return await new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(image.naturalWidth>0&&image.naturalHeight>0);image.onerror=()=>resolve(false);image.src=url;});}
 finally{URL.revokeObjectURL(url);}
}

export async function inspectDrafts(editor,{all=false}={}){
 const variants=all?Object.keys(CANVAS_PRESETS).map(layout=>({layout,config:editor.variantConfigFor(layout)})):[{layout:editor.currentSizeKey(),config:editor.config}];
 const issues=[],assets=new Map();let serverWarning=false;
 const add=(severity,layout,elementId,message)=>issues.push({severity,layout,elementId,message});
 for(const {layout,config} of variants){
  const seen=new Set(),groups=new Set();let hidden=0;
  if(!config.elements.length)add('warning',layout,'','这个尺寸尚未排版');
  if(config.elements.filter(e=>e.photoRole==='main').length>1)add('error',layout,'','存在多个主头像标记，请保留一个');
  for(const e of config.elements){
   if(seen.has(e.id))add('error',layout,e.id,'图层编号重复，请复制重建此图层');seen.add(e.id);if(e.groupId)groups.add(e.groupId);
   if(isElementHidden(config,e)){hidden++;continue;}
   if(![e.x,e.y,e.width,e.height].every(Number.isFinite)||e.width<=0||e.height<=0)add('error',layout,e.id,'图层的尺寸或位置无效');
   if(e.x+e.width<=0||e.y+e.height<=0||e.x>=config.canvas.width||e.y>=config.canvas.height)add('warning',layout,e.id,'图层完全位于画布外');
   else if(e.x<0||e.y<0||e.x+e.width>config.canvas.width||e.y+e.height>config.canvas.height)add('info',layout,e.id,'图层伸出画布边缘，导出时会裁切');
   if(['text','sticker'].includes(e.type)&&!String(e.text||'').trim())add('warning',layout,e.id,'文字图层为空');
   if(e.type==='image'&&e.assetId!=='__avatar__'){
    if(!assets.has(e.assetId)){
     const builtin=BUILTIN_MAP.get(e.assetId);let valid=!!builtin&&builtin.available!==false;
     if(!builtin){const asset=await editor.store.getAsset(e.assetId);valid=await readableImage(asset?.blob);}
     assets.set(e.assetId,{valid,url:builtin?.url});
    }
    if(!assets.get(e.assetId).valid)add('error',layout,e.id,'图片缺失或无法读取，请重新导入或恢复对应主题');
   }
  }
  if(hidden)add('info',layout,'',`有 ${hidden} 个隐藏图层，本次导出不会显示`);
  const empty=(config.groups||[]).filter(g=>!groups.has(g.id));if(empty.length)add('info',layout,'',`有 ${empty.length} 个空文件夹，可按需要整理`);
 }
 const files=themePackages()?.files,urls=[...new Set([...assets.values()].map(a=>a.url).filter(u=>/^\/?files\/stargaze-/.test(u||'')))];
 if(files&&urls.length){try{const verified=await files.verify(urls);for(const [id,a] of assets)if(verified[a.url]===false)for(const {layout,config} of variants)for(const e of config.elements)if(e.assetId===id&&!isElementHidden(config,e))add('error',layout,e.id,'酒馆中的素材文件已丢失，请重新校验安装主题');}catch{serverWarning=true;}}
 if(serverWarning)add('info',variants[0].layout,'','暂时无法连接酒馆检查素材文件，导出时仍会尝试读取');
 return issues;
}

/** 例行出血裁切只提示；缺图等错误会阻止导出，其他提醒可由用户确认后继续。 */
export async function openPreflight(editor,{all=false,gate=false}={}){
 const issues=await inspectDrafts(editor,{all});if(gate&&!issues.some(i=>i.severity!=='info'))return true;
 return await new Promise(resolve=>{
  let settled=false;const finish=value=>{if(!settled){settled=true;resolve(value);}};
  const errors=issues.filter(i=>i.severity==='error').length,warnings=issues.filter(i=>i.severity==='warning').length;
  const {dialog}=studioDialog(editor,gate?'导出前检查':'稿件自检',`<p class="star-dialog-hint">${errors} 项需要修复 · ${warnings} 项提醒 · ${issues.filter(i=>i.severity==='info').length} 项说明。点击图层可定位，检查不会自动删除内容。</p><div class="star-preflight-list">${issues.map((item,i)=>`<button type="button" data-issue="${i}" class="star-issue-${item.severity}"><b>${item.severity==='error'?'需修复':item.severity==='warning'?'提醒':'说明'}</b><span>${esc(LAYOUTS[item.layout]?.name||item.layout)} · ${esc(item.message)}</span></button>`).join('')||'<p>未发现缺图或排版问题。</p>'}</div><p data-studio-status role="status"></p><div class="star-dialog-actions">${gate?`<button type="button" data-preflight-cancel>返回编辑</button><button type="button" data-preflight-continue ${errors?'disabled':''}>${warnings?'确认后继续导出':'继续导出'}</button>`:'<button type="button" data-preflight-recheck>重新检查</button>'}</div>`,{className:'star-preflight-dialog',onClose:()=>finish(false)});
  dialog.addEventListener('click',async event=>{
   const b=event.target.closest('[data-issue]');if(b){const issue=issues[Number(b.dataset.issue)];dialog.close();if(editor.currentSizeKey()!==issue.layout)editor.applyCanvas(issue.layout);if(issue.elementId){editor.selectElement(issue.elementId);editor.overlay.querySelector(`[data-layer-id="${issue.elementId}"]`)?.scrollIntoView({block:'nearest'});}return;}
   if(event.target.closest('[data-preflight-cancel]'))dialog.close();
   if(event.target.closest('[data-preflight-continue]')){finish(true);dialog.close();}
   if(event.target.closest('[data-preflight-recheck]')){dialog.close();void openPreflight(editor,{all}).catch(e=>editor.notify(e.message));}
  });
 });
}
