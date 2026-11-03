import {editorDialog,escapeMarkup as esc} from '../editor/dialog.js';
import {renderCollage} from '../exporter.js';
import {characterFields} from '../templates.js';

export {esc};
export function studioDialog(editor,title,body,options={}){return editorDialog(editor,title,body,{...options,className:'star-studio-dialog '+(options.className||'')});}
export function status(dialog,text){const node=dialog.querySelector('[data-studio-status]');if(node)node.textContent=text;}
export async function thumbnail(editor,config,box){
 try{const canvas=await renderCollage(config,{avatarUrl:editor.avatarUrl,assetUrls:editor.assetUrls,fields:characterFields(editor.character),quality:.22});if(box.isConnected)box.replaceChildren(canvas);}
 catch{if(box.isConnected)box.textContent='素材暂不可用，可先恢复对应主题';}
}
export const when=timestamp=>new Date(timestamp).toLocaleString('zh-CN',{hour12:false});
export function actionError(dialog,callback){return async event=>{try{await callback(event);}catch(error){status(dialog,error.message);}};}
