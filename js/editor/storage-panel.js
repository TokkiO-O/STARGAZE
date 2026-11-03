import {referencedAssets} from '../config-data.js';
import {themePackages,prettyBytes} from '../packages/manager.js';
import {editorDialog,escapeMarkup as esc} from './dialog.js';

export async function openStoragePanel(editor){
 let busy=false;
 const {dialog}=editorDialog(editor,'存储与备份',`<p class="star-dialog-hint">清理前会同时检查角色、尺寸草稿、模板、更新备份和当前撤销历史。</p><div data-storage-summary role="status">正在统计…</div><div class="star-dialog-actions"><button type="button" data-storage-backup>备份当前角色</button><button type="button" data-storage-clean>清理未引用的上传图片</button><button type="button" data-storage-refresh>重新统计</button></div><div class="star-storage-list"></div>`);
 const summary=dialog.querySelector('[data-storage-summary]'),list=dialog.querySelector('.star-storage-list');
 const scan=async()=>{
  const [assets,configs,templates]=await Promise.all([editor.store.getAll('assets'),editor.store.getAll('configs'),editor.store.listCustomTemplates()]);
  const states=[...configs,...templates,editor.config,...editor.history,...editor.future];
  const count=new Map();for(const state of states)for(const id of referencedAssets(state))count.set(id,(count.get(id)||0)+1);
  return {assets:assets.filter(a=>a.ownerKey!=='__theme_packages__'),count,configs};
 };
 const refresh=async()=>{
  const {assets,count,configs}=await scan();if(!dialog.isConnected)return;
  const unused=assets.filter(a=>!count.has(a.id)),packages=themePackages(),packageBytes=packages?Object.values(packages.index.materials).reduce((n,a)=>n+a.bytes,0):0;
  summary.textContent=`上传图片 ${prettyBytes(assets.reduce((n,a)=>n+(a.blob?.size||0),0))} · 主题素材 ${prettyBytes(packageBytes)} · 未引用 ${unused.length} 张 · 更新备份 ${configs.filter(c=>c.kind==='theme-checkpoint').length} 份 · 角色方案 ${configs.filter(c=>c.kind==='studio-scheme').length} 套 · 历史稿件 ${configs.filter(c=>c.kind==='studio-revision').length} 份 · 素材组合 ${configs.filter(c=>c.kind==='studio-combination').length} 组`;
  list.innerHTML=assets.length?assets.map(a=>`<div><span>${esc(a.name)}</span><small>${prettyBytes(a.blob?.size||0)} · ${count.has(a.id)?`被 ${count.get(a.id)} 处设计或历史引用`:'未引用，可清理'}</small></div>`).join(''):'<p>暂无上传图片。主题素材可在“自选安装”中管理。</p>';
 };
 dialog.querySelector('[data-storage-backup]').addEventListener('click',()=>editor.overlay.querySelector('[data-action="export"]').click());
 dialog.querySelector('[data-storage-refresh]').addEventListener('click',()=>refresh().catch(e=>{summary.textContent=e.message;}));
 dialog.querySelector('[data-storage-clean]').addEventListener('click',async()=>{
  if(busy)return;busy=true;
  try{
   const {assets,count}=await scan(),unused=assets.filter(a=>!count.has(a.id));
   if(!unused.length){summary.textContent='没有可清理的未引用图片';return;}
   if(!confirm(`清理 ${unused.length} 张未引用的上传图片？已用于设计、模板和备份的图片会保留。`))return;
   for(const a of unused){await editor.store.remove('assets',a.id);const url=editor.assetUrls.get(a.id);if(url)URL.revokeObjectURL(url);editor.assetUrls.delete(a.id);editor.renderer.releaseAsset(a.id);}
   await editor.refreshAssets();await refresh();
  }catch(error){summary.textContent='清理未完成：'+error.message;}finally{busy=false;}
 });
 await refresh();
}
