import {THEME_CATALOG} from '../theme-catalog.js';
import {themePackages,prettyBytes} from '../packages/manager.js';
import {parseSource} from '../packages/source.js';
import {assetUrl} from '../assets/url.js';
import {editorDialog,escapeMarkup as esc} from './dialog.js';

export function openPackagePanel(editor,{focusId}={}){
 const manager=themePackages();if(!manager){editor.notify('主题管理器尚未就绪');return;}
 let unsubscribe=()=>{};
 const {dialog}=editorDialog(editor,'主题素材 · 自选安装',`
  <p class="star-dialog-hint">只安装你选择的主题，每套包含九个尺寸。共用素材只保存一份。</p>
  ${editor.store.storageMode==='localStorage'?'<p class="star-dialog-hint">当前浏览器的本地空间较少，大主题可能无法导入。容量不足时原有主题会保留；可换用普通浏览窗口继续编辑。</p>':''}
  <form class="star-package-source"><label>GitHub 仓库或下载源<input name="source" value="${esc(manager.source)}" placeholder="https://github.com/用户名/扩展仓库" autocomplete="off"></label><button type="submit">保存下载源</button><button type="button" data-pkg-check>检查更新</button></form>
  <p class="star-dialog-hint">同一个 GitHub 项目即可，主题素材放在 Releases 发布附件。没有下载源时可使用本地素材包。</p>
  <div class="star-dialog-actions"><button type="button" data-pkg-import>导入本地主题素材包</button><span data-pkg-message role="status"></span></div>
  <input type="file" accept=".json,application/json" data-pkg-file hidden>
  <div class="star-package-grid"></div>`,{className:'star-package-dialog',onClose:()=>unsubscribe()});
 const list=dialog.querySelector('.star-package-grid'),message=dialog.querySelector('[data-pkg-message]');
 const inform=text=>{message.textContent=text;};
 const update=()=>{
  if(!dialog.isConnected)return;
  list.innerHTML=THEME_CATALOG.map(theme=>{
   const installed=manager.status(theme.id),op=manager.operations.get(theme.id),remote=manager.remote?.catalog.themes.find(t=>t.id===theme.id),hasUpdate=installed&&remote&&installed.revision!==remote.revision;
   const state=op?`${op.phase} · ${op.done}/${op.total||'…'}`:installed?(hasUpdate?'有更新':'已安装'):manager.legacy?'旧版素材可用':'未安装';
   return `<article class="star-package-card ${focusId===theme.id?'requested':''}" data-package="${theme.id}"><img src="${assetUrl('theme-previews/'+theme.id+'.webp')}" alt="${esc(theme.name)}预览" loading="lazy"><h3>${esc(theme.name)}</h3><small>素材 ${prettyBytes(theme.bytes)} · 九个尺寸</small><p role="status">${esc(state)}</p><div>${op?`<button type="button" data-pkg-cancel="${theme.id}">取消</button>`:`<button type="button" data-pkg-install="${theme.id}">${installed?'重新校验安装':'安装本主题'}</button>${installed?`<button type="button" data-pkg-remove="${theme.id}">移除</button>`:''}`}</div></article>`;
  }).join('');
 };
 unsubscribe=manager.onChange(update);update();
 const completed=async id=>{
  inform('安装完成，可直接使用九个尺寸');editor.renderAssets();editor.renderTemplatePreviews();editor.renderAll();
  if(focusId===id){editor.mutate(()=>editor.applyTemplate(id));dialog.close();}
 };
 dialog.querySelector('form').addEventListener('submit',async event=>{
  event.preventDefault();try{const value=dialog.querySelector('[name="source"]').value.trim();if(value)parseSource(value);await manager.setSource(value);inform(value?'下载源已保存':'已清空下载源，可使用本地导入');}catch(error){inform(error.message);}
 });
 dialog.querySelector('[data-pkg-check]').addEventListener('click',async event=>{
  const button=event.currentTarget;button.disabled=true;inform('正在读取主题目录…');
  try{await manager.checkSource();inform('主题目录已更新，只在你点击安装时下载素材');}catch(error){inform(error.message);}finally{button.disabled=false;}
 });
 dialog.querySelector('[data-pkg-import]').addEventListener('click',()=>dialog.querySelector('[data-pkg-file]').click());
 dialog.querySelector('[data-pkg-file]').addEventListener('change',async event=>{
  const file=event.target.files?.[0];event.target.value='';if(!file)return;
  try{const id=await manager.importFile(file);await completed(id);}catch(error){inform(error.name==='AbortError'?'已取消安装，原有主题保留':error.message);}
 });
 list.addEventListener('click',async event=>{
  const cancel=event.target.closest('[data-pkg-cancel]');if(cancel){manager.cancel(cancel.dataset.pkgCancel);return;}
  const install=event.target.closest('[data-pkg-install]');if(install){try{await manager.installRemote(install.dataset.pkgInstall);await completed(install.dataset.pkgInstall);}catch(error){inform(error.name==='AbortError'?'已取消安装，原有主题保留':error.message);}return;}
  const remove=event.target.closest('[data-pkg-remove]');if(remove){
   if(!confirm('移除此主题？当前稿件和备份仍在引用的素材会保留。'))return;
   try{const result=await manager.remove(remove.dataset.pkgRemove,[editor.config,...editor.history,...editor.future]);inform(result.retained?`主题已移除，保留 ${result.retained} 张稿件用图`:'主题及未引用素材已移除');editor.renderAssets();editor.renderTemplatePreviews();}catch(error){inform(error.message);}
  }
 });
}
