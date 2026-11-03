export const escapeMarkup=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/** 编辑器的次级窗口统一管理焦点、Escape 和关闭清理，避免手机端残留遮罩。 */
export function editorDialog(editor,title,body,{className='',onClose}={}){
 const dialog=document.createElement('dialog');dialog.className='star-dialog '+className;
 dialog.innerHTML=`<header><h2>${escapeMarkup(title)}</h2><button type="button" data-dialog-close aria-label="关闭">×</button></header><div class="star-dialog-body">${body}</div>`;
 const previous=document.activeElement;document.body.append(dialog);editor.childDialogs ||= new Set();editor.childDialogs.add(dialog);
 let closed=false;
 const close=()=>{if(closed)return;closed=true;onClose?.();editor.childDialogs.delete(dialog);dialog.remove();if(previous?.isConnected)previous.focus();};
 dialog.querySelector('[data-dialog-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',close,{once:true});dialog.addEventListener('cancel',event=>{event.preventDefault();dialog.close();});
 dialog.showModal();return {dialog,close:()=>dialog.close()};
}
