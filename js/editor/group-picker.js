import {editorDialog,escapeMarkup as esc} from './dialog.js';

export function chooseGroupCharacter(context){
 const group=context.groups?.find(g=>String(g.id)===String(context.groupId));
 const members=group?.members||[],characters=(context.characters||[]).filter(c=>c&&(!members.length||members.includes(c.avatar)));
 if(!characters.length)return Promise.resolve(null);
 return new Promise(resolve=>{
  const host={childDialogs:new Set()},view=editorDialog(host,'选择要编辑的群聊角色',`<p class="star-dialog-hint">每位角色分别保存自己的模板、尺寸与副图。</p><div class="star-group-choices">${characters.map((c,i)=>`<button type="button" data-group-character="${i}">${esc(c.name)}</button>`).join('')}</div>`,{className:'star-group-picker',onClose:()=>resolve(null)});
  view.dialog.addEventListener('click',event=>{const button=event.target.closest('[data-group-character]');if(!button)return;resolve(characters[Number(button.dataset.groupCharacter)]);view.close();});
 });
}
