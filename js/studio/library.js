import {BUILTIN_ASSETS,BUILTIN_MAP} from '../templates.js';
import {StudioRepository} from './model.js';
import {studioDialog,status,esc,actionError} from './views.js';

function libraryAssets(editor){
 const seen=new Set();return [...BUILTIN_ASSETS.filter(a=>!a.hidden&&a.available!==false),...editor.libraryAssets,...editor.ownedAssets].filter(a=>{const key=a.materialHash||a.id;if(seen.has(key))return false;seen.add(key);return true;}).map(a=>({...a,url:a.url||editor.assetUrls.get(a.id)})).filter(a=>a.url);
}

async function loadFavorites(editor,library,limit=500){
 for(const id of library.favorites.slice(0,limit)){
  if(BUILTIN_MAP.has(id)||editor.libraryAssets.some(a=>a.id===id)||editor.ownedAssets.some(a=>a.id===id))continue;
  const asset=await editor.store.getAsset(id);if(editor.closed)return;
  if(asset?.blob){if(!editor.assetUrls.has(id))editor.assetUrls.set(id,URL.createObjectURL(asset.blob));editor.libraryAssets.push(asset);}
 }
}

/** 快捷栏中的组合可直接拖入画布，插入时重新分配图层编号，保持素材原图可编辑。 */
export async function refreshStudioTray(editor){
 const box=editor.overlay?.querySelector('[data-studio-tray]');if(!box||editor.closed)return;
 const repo=new StudioRepository(editor.store,editor.key),[library,combinations]=await Promise.all([repo.library(),repo.rows('studio-combination',true)]);
 await loadFavorites(editor,library,8);
 if(!box.isConnected||editor.closed)return;
 const assets=libraryAssets(editor),favorites=library.favorites.map(id=>assets.find(a=>a.id===id)).filter(Boolean).slice(0,8);
 box.innerHTML=favorites.map(a=>`<button type="button" draggable="true" data-asset-drag data-asset-action="place" data-asset-id="${esc(a.id)}" title="${esc(a.name)}"><img src="${esc(a.url)}" alt=""><span>${esc(a.name)}</span></button>`).join('')+combinations.slice(0,8).map(c=>`<button type="button" draggable="true" data-studio-combination="${esc(c.key)}" title="点击或拖入画布">▧ ${esc(c.name)}</button>`).join('');
 box.hidden=!favorites.length&&!combinations.length;
}

export function bindStudioTray(editor){
 const repo=new StudioRepository(editor.store,editor.key);
 editor.overlay.addEventListener('click',async event=>{const b=event.target.closest('[data-studio-combination]');if(!b)return;try{const row=await editor.store.get('configs',b.dataset.studioCombination);if(row)await repo.insertCombination(editor,row);}catch(error){editor.notify(error.message);}});
 editor.overlay.addEventListener('dragstart',event=>{const b=event.target.closest('[data-studio-combination]');if(!b)return;event.dataTransfer.setData('application/x-stargaze-combination',b.dataset.studioCombination);event.dataTransfer.effectAllowed='copy';});
 editor.stage.addEventListener('dragover',event=>{if(![...event.dataTransfer.types].includes('application/x-stargaze-combination'))return;event.preventDefault();event.stopImmediatePropagation();event.dataTransfer.dropEffect='copy';},{capture:true});
 editor.stage.addEventListener('drop',async event=>{const key=event.dataTransfer.getData('application/x-stargaze-combination');if(!key)return;event.preventDefault();event.stopImmediatePropagation();try{const row=await editor.store.get('configs',key);if(row)await repo.insertCombination(editor,row,editor.stagePoint(event));}catch(error){editor.notify(error.message);}},{capture:true});
}

export async function openLibrary(editor){
 const repo=new StudioRepository(editor.store,editor.key);let mode='all',query='',limit=48,library=await repo.library();
 await loadFavorites(editor,library);
 const {dialog}=studioDialog(editor,'收藏与素材组合',`<p class="star-dialog-hint">收藏、添加个人标签，或把选中的装饰图层存成组合。常用内容会出现在编辑器快捷栏，可点击或拖入画布。</p><div class="star-studio-tabs"><button data-library-mode="all" class="active">全部素材</button><button data-library-mode="favorites">我的收藏</button><button data-library-mode="combinations">素材组合</button></div><input type="search" data-library-query placeholder="搜索素材名称、个人标签或组合名称"><form data-combination-create><input name="name" maxlength="60" placeholder="组合名称"><button>保存画布选中图层为组合</button></form><p data-studio-status role="status"></p><div class="star-library-grid" data-library-list></div><button data-library-more>显示更多</button>`);
 const paint=async()=>{
  const list=dialog.querySelector('[data-library-list]');if(!list)return;
  dialog.querySelectorAll('[data-library-mode]').forEach(b=>b.classList.toggle('active',b.dataset.libraryMode===mode));
  if(mode==='combinations'){
   const rows=(await repo.rows('studio-combination',true)).filter(r=>r.name.toLowerCase().includes(query));if(!dialog.isConnected)return;
   list.innerHTML=rows.map(r=>`<article><strong>▧ ${esc(r.name)}</strong><small>${r.config.elements.length} 个独立图层</small><div><button data-combination-insert="${esc(r.key)}">插入画布</button><button data-combination-delete="${esc(r.key)}">移除</button></div></article>`).join('')||'<p>先在画布选中装饰图层，再保存组合。</p>';dialog.querySelector('[data-library-more]').hidden=true;return;
  }
  const all=libraryAssets(editor).filter(a=>(mode!=='favorites'||library.favorites.includes(a.id))&&`${a.name} ${(library.tags[a.id]||[]).join(' ')}`.toLowerCase().includes(query));
  list.innerHTML=all.slice(0,limit).map(a=>`<article><button data-library-insert="${esc(a.id)}" title="插入画布"><img src="${esc(a.url)}" alt="${esc(a.name)}" loading="lazy"></button><strong>${esc(a.name)}</strong><small>${esc((library.tags[a.id]||[]).join(' · '))||'暂无个人标签'}</small><div><button data-library-favorite="${esc(a.id)}" aria-pressed="${library.favorites.includes(a.id)}">${library.favorites.includes(a.id)?'★ 已收藏':'☆ 收藏'}</button><button data-library-tag="${esc(a.id)}">标签</button></div></article>`).join('')||'<p>没有匹配的素材。可先安装喜欢的主题或上传图片。</p>';dialog.querySelector('[data-library-more]').hidden=all.length<=limit;
 };
 dialog.querySelector('[data-library-query]').addEventListener('input',event=>{query=event.target.value.trim().toLowerCase();limit=48;void paint();});
 dialog.querySelector('[data-library-more]').addEventListener('click',()=>{limit+=48;void paint();});
 dialog.querySelector('form').addEventListener('submit',actionError(dialog,async event=>{event.preventDefault();const name=event.target.elements.name.value.trim();if(!name)throw new Error('请填写组合名称');await repo.combination(editor,name);mode='combinations';await paint();await refreshStudioTray(editor);status(dialog,'组合已保存，可从编辑器快捷栏拖入画布');}));
 dialog.addEventListener('click',actionError(dialog,async event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.dataset.libraryMode){mode=b.dataset.libraryMode;limit=48;await paint();}
  if(b.dataset.libraryFavorite){library=await repo.favorite(b.dataset.libraryFavorite);await paint();await refreshStudioTray(editor);}
  if(b.dataset.libraryTag){const id=b.dataset.libraryTag,text=prompt('个人标签，用逗号或空格分隔',(library.tags[id]||[]).join('，'));if(text===null)return;library=await repo.tag(id,text);await paint();}
  if(b.dataset.libraryInsert){editor.addImage(b.dataset.libraryInsert);dialog.close();}
  if(b.dataset.combinationInsert){const row=await editor.store.get('configs',b.dataset.combinationInsert);if(row)await repo.insertCombination(editor,row);dialog.close();}
  if(b.dataset.combinationDelete){if(!confirm('移除此素材组合？已经放入画布的图层会保留。'))return;await editor.store.remove('configs',b.dataset.combinationDelete);await paint();await refreshStudioTray(editor);}
 }));await paint();
}
