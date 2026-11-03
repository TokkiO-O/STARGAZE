import {THEME_CATALOG} from '../theme-catalog.js';
import {themePackages,prettyBytes} from '../packages/manager.js';
import {assetUrl} from '../assets/url.js';
import {editorDialog,escapeMarkup as esc} from './dialog.js';

export function openPackagePanel(editor,{focusId}={}){
 const manager=themePackages();if(!manager){editor.notify('主题管理器尚未就绪');return;}
 let unsubscribe=()=>{},notice='';
 const {dialog}=editorDialog(editor,'主题素材 · 自选安装',`
  <p class="star-dialog-hint">已连接 STARGAZE 官方素材仓库。选择需要的主题安装，每套包含九个尺寸，共用素材只保存一份。</p>
  <p class="star-dialog-hint">关闭此窗口或编辑器后，安装仍会继续。请保留当前页面，重新打开可查看进度和结果。</p>
  ${editor.store.storageMode==='localStorage'?'<p class="star-dialog-hint">当前浏览器的本地空间较少，大主题可能无法导入。容量不足时原有主题会保留；可换用普通浏览窗口继续编辑。</p>':''}
  <div class="star-dialog-actions"><button type="button" data-pkg-check>检查主题更新</button><button type="button" data-pkg-import>导入本地主题包</button></div>
  <p class="star-dialog-hint" data-pkg-message role="status" aria-live="polite"></p>
  <input type="file" accept=".json,application/json" data-pkg-file hidden>
  <div class="star-package-grid">${THEME_CATALOG.map(theme=>`<article class="star-package-card ${focusId===theme.id?'requested':''}" data-package="${theme.id}"><img src="${assetUrl('theme-previews/'+theme.id+'.webp')}" alt="${esc(theme.name)}预览" loading="lazy"><h3>${esc(theme.name)}</h3><small>素材 ${prettyBytes(theme.bytes)} · 九个尺寸</small><p data-pkg-state role="status"></p><progress data-pkg-progress max="1" hidden aria-label="安装进度"></progress><p data-pkg-error class="star-package-error" hidden></p><div data-pkg-actions></div></article>`).join('')}</div>`,{className:'star-package-dialog',onClose:()=>unsubscribe()});
 const list=dialog.querySelector('.star-package-grid'),message=dialog.querySelector('[data-pkg-message]');
 const inform=text=>{notice=text;update();};
 const update=()=>{
  if(!dialog.isConnected)return;
  message.textContent=manager.imports.size?'正在读取本地主题包…':manager.operations.size?`有 ${manager.operations.size} 套主题正在安装，关闭窗口后会继续`:(notice||manager.lastResult?.message||'选择主题即可安装，无需填写链接');
  for(const theme of THEME_CATALOG){
   const card=list.querySelector(`[data-package="${theme.id}"]`),installed=manager.status(theme.id),op=manager.operations.get(theme.id),remote=manager.remote?.catalog.themes.find(t=>t.id===theme.id),hasUpdate=installed&&remote&&installed.revision!==remote.revision,result=manager.results.get(theme.id);
   card.querySelector('[data-pkg-state]').textContent=op?`${op.phase} · ${op.done}/${op.total||'…'}`:installed?(hasUpdate?'已安装 · 有更新':'已安装 · 九个尺寸可用'):result&&!result.ok?'安装未完成':manager.legacy?'旧版素材可用':'未安装';
   card.dataset.installed=String(!!installed);
   const progress=card.querySelector('progress');progress.hidden=!op;if(op){progress.max=op.total||1;if(op.total)progress.value=op.done;else progress.removeAttribute('value');}
   const error=card.querySelector('[data-pkg-error]');error.hidden=!result||result.ok;error.textContent=result&&!result.ok?result.message:'';
   const actions=card.querySelector('[data-pkg-actions]'),signature=op?'busy':installed?'installed':'new';
   // 保留预览图片和焦点，只在按钮状态变化时更新控件。
   if(actions.dataset.state!==signature){actions.dataset.state=signature;actions.innerHTML=op?`<button type="button" data-pkg-cancel="${theme.id}">取消安装</button>`:`<button type="button" data-pkg-install="${theme.id}">${installed?'重新校验安装':'安装本主题'}</button>${installed?`<button type="button" data-pkg-remove="${theme.id}">移除</button>`:''}`;}
  }
 };
 unsubscribe=manager.onChange(update);update();
 const completed=id=>{
  if(!dialog.isConnected||editor.closed)return;
  notice=manager.lastResult?.message||'安装完成';update();
  editor.renderAssets();editor.renderTemplatePreviews();editor.renderAll();
  if(focusId===id&&editor.config){editor.mutate(()=>editor.applyTemplate(id));dialog.close();}
 };
 dialog.querySelector('[data-pkg-check]').addEventListener('click',async event=>{
  const button=event.currentTarget;button.disabled=true;inform('正在读取官方主题目录…');
  try{await manager.checkSource();inform('主题目录已更新，只在你点击安装时下载素材');}catch(error){inform(error.message);}finally{button.disabled=false;}
 });
 dialog.querySelector('[data-pkg-import]').addEventListener('click',()=>dialog.querySelector('[data-pkg-file]').click());
 dialog.querySelector('[data-pkg-file]').addEventListener('change',async event=>{
  const file=event.target.files?.[0];event.target.value='';if(!file)return;notice='';
  try{completed(await manager.importFile(file));}catch(error){inform(error.name==='AbortError'?'已取消安装，原有主题保留':error.message);}
 });
 list.addEventListener('click',async event=>{
  const cancel=event.target.closest('[data-pkg-cancel]');if(cancel){manager.cancel(cancel.dataset.pkgCancel);return;}
  const install=event.target.closest('[data-pkg-install]');if(install){notice='';try{completed(await manager.installRemote(install.dataset.pkgInstall));}catch(error){inform(error.name==='AbortError'?'已取消安装，原有主题保留':error.message);}return;}
  const remove=event.target.closest('[data-pkg-remove]');if(remove){
   if(!confirm('移除此主题？当前稿件和备份仍在引用的素材会保留。'))return;
   try{const result=await manager.remove(remove.dataset.pkgRemove,[editor.config,...editor.history,...editor.future]);inform(result.retained?`主题已移除，保留 ${result.retained} 张稿件用图`:'主题及未引用素材已移除');editor.renderAssets();editor.renderTemplatePreviews();}catch(error){inform(error.message);}
  }
 });
 return dialog;
}
