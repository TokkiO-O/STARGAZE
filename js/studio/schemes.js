import {StudioRepository,currentDraft,applyDraft} from './model.js';
import {studioDialog,status,esc,thumbnail,when,actionError} from './views.js';

export async function openSchemes(editor){
 const repo=new StudioRepository(editor.store,editor.key);
 const {dialog}=studioDialog(editor,'角色方案',`<p class="star-dialog-hint">每套分别保存主题、尺寸、取景和独立副图。切换时会保存当前方案，并留一份切换前历史稿。</p><form data-scheme-create><input name="name" maxlength="60" placeholder="方案名称，例如日常、剧情"><button>另存当前为新方案</button></form><p data-studio-status role="status"></p><div class="star-studio-cards" data-schemes></div>`);
 const paint=async()=>{
  const rows=await repo.rows('studio-scheme');if(!dialog.isConnected)return;
  dialog.querySelector('[data-schemes]').innerHTML=rows.map(r=>`<article><div class="star-studio-thumb" data-scheme-thumb="${esc(r.key)}"></div><strong>${esc(r.name)}</strong><small>${when(r.updatedAt)}${r.key===editor.config.studioSchemeId?' · 当前方案':''}</small><div><button data-scheme-use="${esc(r.key)}">切换</button><button data-scheme-overwrite="${esc(r.key)}">保存到此方案</button><button data-scheme-rename="${esc(r.key)}">改名</button><button data-scheme-delete="${esc(r.key)}">移除</button></div></article>`).join('')||'<p>还没有方案。可以先把当前稿件另存一套。</p>';
  for(const row of rows){const box=dialog.querySelector(`[data-scheme-thumb="${row.key}"]`);if(box)void thumbnail(editor,row.config,box);}
 };
 dialog.querySelector('form').addEventListener('submit',actionError(dialog,async event=>{event.preventDefault();const name=event.target.elements.name.value.trim();if(!name)throw new Error('请填写方案名称');const row=await repo.saveScheme(currentDraft(editor),name);editor.mutate(()=>{editor.config.studioSchemeId=row.key;editor.config.studioSchemeName=row.name;});const saved=await editor.save();event.target.reset();await paint();status(dialog,saved?'新方案已保存':'方案已保存，当前角色稿件暂未保存，请先导出备份或清理存储空间');}));
 dialog.addEventListener('click',actionError(dialog,async event=>{
  const b=event.target.closest('button');if(!b)return;
  const rows=await repo.rows('studio-scheme');
  if(b.dataset.schemeUse){
   if(b.dataset.schemeUse===editor.config.studioSchemeId){status(dialog,'已经在使用这套方案');return;}
   const row=rows.find(r=>r.key===b.dataset.schemeUse);if(!row)return;
   await repo.revision(currentDraft(editor),'切换方案前');if(!await editor.save())throw new Error('当前稿件未保存，暂未切换');
   await applyDraft(editor,{...row.config,studioSchemeId:row.key});if(!await editor.save())throw new Error('新方案已载入，但保存未完成；可关闭此窗口后保存或导出稿件');dialog.close();editor.notify('已切换到「'+row.name+'」');
  }
  if(b.dataset.schemeOverwrite){const row=rows.find(r=>r.key===b.dataset.schemeOverwrite);if(!row)return;if(!confirm('用当前稿件覆盖「'+row.name+'」？原稿会进入历史稿件。'))return;await repo.revision(row.config,'覆盖方案前 · '+row.name);await repo.saveScheme(currentDraft(editor),row.name,row.key);status(dialog,'方案已更新');await paint();}
  if(b.dataset.schemeRename){const row=rows.find(r=>r.key===b.dataset.schemeRename);if(!row)return;const name=prompt('新的方案名称',row.name);if(!name?.trim())return;await repo.saveScheme(row.config,name,row.key);if(editor.config.studioSchemeId===row.key)editor.mutate(()=>{editor.config.studioSchemeName=name.trim();});await paint();}
  if(b.dataset.schemeDelete){if(!confirm('移除此方案？当前画布和其他方案会保留。'))return;await editor.store.remove('configs',b.dataset.schemeDelete);if(editor.config.studioSchemeId===b.dataset.schemeDelete)editor.mutate(()=>{delete editor.config.studioSchemeId;delete editor.config.studioSchemeName;});await paint();}
 }));
 await paint();
}

export async function openRevisions(editor){
 const repo=new StudioRepository(editor.store,editor.key),limit=await repo.policy();
 const {dialog}=studioDialog(editor,'历史稿件',`<p class="star-dialog-hint">关闭编辑器后仍可找回。稿件共用图片，保留数量可调整；恢复操作可以撤销。</p><form data-revision-create><input name="name" maxlength="60" placeholder="稿件名称，例如初稿、调整配色后"><button>保存当前稿件</button></form><label>最多保留 <select data-revision-limit>${[5,10,20].map(n=>`<option ${limit===n?'selected':''}>${n}</option>`).join('')}</select> 份</label><p data-studio-status role="status"></p><div class="star-studio-cards" data-revisions></div>`);
 const paint=async()=>{
  const rows=await repo.rows('studio-revision');if(!dialog.isConnected)return;
  dialog.querySelector('[data-revisions]').innerHTML=rows.map(r=>`<article><div class="star-studio-thumb" data-revision-thumb="${esc(r.key)}"></div><strong>${esc(r.name)}</strong><small>${when(r.createdAt)}</small><div><button data-revision-use="${esc(r.key)}">恢复此稿</button><button data-revision-rename="${esc(r.key)}">改名</button><button data-revision-delete="${esc(r.key)}">移除</button></div></article>`).join('')||'<p>还没有历史稿件，保存一份关键修改即可。</p>';
  for(const row of rows)void thumbnail(editor,row.config,dialog.querySelector(`[data-revision-thumb="${row.key}"]`));
 };
 dialog.querySelector('form').addEventListener('submit',actionError(dialog,async event=>{event.preventDefault();await repo.revision(currentDraft(editor),event.target.elements.name.value.trim()||'保存稿');event.target.reset();await paint();status(dialog,'已保存，未变化的稿件会合并');}));
 dialog.querySelector('[data-revision-limit]').addEventListener('change',actionError(dialog,async event=>{const n=Number(event.target.value);if(n<await repo.policy()&&!confirm('缩减后只保留最近 '+n+' 份历史稿件，继续吗？')){event.target.value=await repo.policy();return;}await repo.setLimit(n);await paint();}));
 dialog.addEventListener('click',actionError(dialog,async event=>{
  const b=event.target.closest('button');if(!b)return;const rows=await repo.rows('studio-revision');
  if(b.dataset.revisionUse){const row=rows.find(r=>r.key===b.dataset.revisionUse);if(!row)return;await applyDraft(editor,row.config);dialog.close();editor.notify('已恢复「'+row.name+'」，可以撤销');}
  if(b.dataset.revisionRename){const row=rows.find(r=>r.key===b.dataset.revisionRename);if(!row)return;const name=prompt('稿件名称',row.name);if(!name?.trim())return;await editor.store.put('configs',{...row,name:name.trim().slice(0,60)});await paint();}
  if(b.dataset.revisionDelete){if(!confirm('移除这份历史稿件？当前画布会保留。'))return;await editor.store.remove('configs',b.dataset.revisionDelete);await paint();}
 }));await paint();
}
