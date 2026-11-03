import {characterFields,isElementHidden,mainPortrait} from '../templates.js';

/** 创建单个可编辑节点，整幅绘制与属性局部更新使用相同的手柄和层序规则。 */
export function editorElement(editor,element){
 const fields=characterFields(editor.character),node=editor.renderer.buildElement(element,editor.config,editor.assetUrls,editor.avatarUrl,fields)||editor.renderer.buildElement(element,editor.config,editor.assetUrls,editor.avatarUrl,null);
 if(!node)return null;
 node.classList.add('star-editor-element');
 const px=(editor.stage.getBoundingClientRect().width||1)/editor.config.canvas.width;
 if(Math.min(element.width,element.height)*px<22)node.classList.add('star-editor-element-tiny');
 node.style.zIndex=String((element.layer==='front'?2000:100)+Math.round((Number(element.z)||0)*10));
 if(element.layer==='front')node.classList.add('star-editor-element-front');
 if(element.locked)node.classList.add('star-editor-locked');
 if(editor.selection.includes(element.id)){
  node.classList.add('star-editor-selected');
  if(element.id===editor.selectedId&&!element.locked)for(const [handle,label] of [['rotate','旋转'],['resize','缩放']]){
   const button=document.createElement('button');button.type='button';button.className='star-handle star-handle-'+handle;button.dataset.handle=handle;button.setAttribute('aria-label',label);node.append(button);
  }
 }
 return node;
}

export function patchEditorStage(editor,previous){
 if(!editor.stage||!previous||editor._stageSelection!==JSON.stringify(editor.selection))return false;
 for(const key of ['canvas','avatar','theme','groups'])if(JSON.stringify(previous[key])!==JSON.stringify(editor.config[key]))return false;
 const now=editor.config.elements,old=previous.elements;
 if(now.length!==old.length||now.some((e,i)=>e.id!==old[i].id||e.layer!==old[i].layer))return false;
 const main=mainPortrait(editor.config),oldById=new Map(old.map(e=>[e.id,e]));
 for(const element of now){
  if(element.id===main?.id||JSON.stringify(element)===JSON.stringify(oldById.get(element.id)))continue;
  const existing=editor.stage.querySelector(`[data-element-id="${element.id}"]`);
  if(isElementHidden(editor.config,element)){existing?.remove();continue;}
  const node=editorElement(editor,element);if(!node)continue;
  if(existing)existing.replaceWith(node);else editor.stage.append(node);
 }
 editor.rebuildNodeCache();return true;
}
