import {captureSizeState,normalizeConfig,uid,mainPortrait} from '../templates.js';
import {sha256} from '../packages/integrity.js';

export const copy=value=>structuredClone(value);
export function currentDraft(editor){editor.commitSizeDraft();return copy(editor.config);}
export function applyDraft(editor,config){
 const next=normalizeConfig(copy(config),editor.key,editor.character.name);
 editor.mutate(()=>{editor.config=next;editor.selectedId=null;editor.selection=[];});
 return editor.refreshAssets();
}

/** 方案、历史和组合只存配置引用；图片仍在原素材库中共用一份。 */
export class StudioRepository{
 constructor(store,key){this.store=store;this.key=key;}
 async rows(kind,global=false){return (await this.store.getAll('configs')).filter(r=>r.kind===kind&&(global||r.characterKey===this.key)).sort((a,b)=>(b.updatedAt||b.createdAt)-(a.updatedAt||a.createdAt));}
 async saveScheme(config,name,id){
  const rows=await this.rows('studio-scheme');
  if(!id&&rows.length>=20)throw new Error('每位角色最多保留 20 套方案，请先移除不需要的方案');
  const key=id||'studio-scheme:'+uid('scheme'),existing=id?await this.store.get('configs',id):null;
  if(id&&(!existing||existing.characterKey!==this.key))throw new Error('找不到当前角色的这套方案');
  const draft=copy(config);draft.studioSchemeId=key;draft.studioSchemeName=String(name||existing?.name||'我的方案').trim().slice(0,60);
  const row={key,kind:'studio-scheme',characterKey:this.key,name:String(name||existing?.name||'我的方案').trim().slice(0,60),config:draft,createdAt:existing?.createdAt||Date.now(),updatedAt:Date.now()};
  await this.store.put('configs',row);return row;
 }
 async policy(){return (await this.store.get('configs','studio-policy:'+this.key))?.limit||10;}
 async setLimit(limit){
  if(![5,10,20].includes(limit))throw new Error('请选择 5、10 或 20 份');
  await this.store.put('configs',{key:'studio-policy:'+this.key,limit});
  for(const row of (await this.rows('studio-revision')).slice(limit))await this.store.remove('configs',row.key);
 }
 async revision(config,name){
  const draft=copy(config);delete draft.updatedAt;
  const digest=await sha256(new TextEncoder().encode(JSON.stringify(draft))),rows=await this.rows('studio-revision');
  if(rows[0]?.digest===digest){
   const row={...rows[0],name:String(name||rows[0].name).slice(0,60),updatedAt:Date.now()};await this.store.put('configs',row);return row;
  }
  const row={key:'studio-revision:'+uid('revision'),kind:'studio-revision',characterKey:this.key,name:String(name||'保存稿').slice(0,60),config:copy(config),digest,createdAt:Date.now(),updatedAt:Date.now()};
  await this.store.put('configs',row);
  const limit=await this.policy();for(const old of [row,...rows].slice(limit))await this.store.remove('configs',old.key);return row;
 }
 async roleRecords(){return [...await this.rows('studio-scheme'),...await this.rows('studio-revision')];}
 async library(){return await this.store.get('configs','studio-library')||{key:'studio-library',kind:'studio-library',favorites:[],tags:{},config:{elements:[]}};}
 async favorite(id){
  const row=await this.library(),set=new Set(row.favorites);set.has(id)?set.delete(id):set.add(id);row.favorites=[...set].slice(-500);
  row.config={elements:row.favorites.map(assetId=>({type:'image',assetId}))};await this.store.put('configs',row);return row;
 }
 async tag(id,text){const row=await this.library();row.tags[id]=String(text||'').split(/[,，、\s]+/).filter(Boolean).slice(0,6).map(t=>t.slice(0,20));await this.store.put('configs',row);return row;}
 async combination(editor,name){
  const main=mainPortrait(editor.config),items=editor.selectedElements().filter(e=>e.id!==main?.id);
  if(!items.length)throw new Error('先在画布中选择要保存的装饰图层；主头像由角色资料提供');
  if((await this.rows('studio-combination',true)).length>=50)throw new Error('组合库最多保留 50 组，请先移除不需要的组合');
  const minX=Math.min(...items.map(e=>e.x)),minY=Math.min(...items.map(e=>e.y)),maxX=Math.max(...items.map(e=>e.x+e.width)),maxY=Math.max(...items.map(e=>e.y+e.height));
  const elements=items.map(e=>({...copy(e),x:e.x-minX,y:e.y-minY}));
  const row={key:'studio-combination:'+uid('composition'),kind:'studio-combination',name:String(name||'素材组合').trim().slice(0,60),createdAt:Date.now(),updatedAt:Date.now(),config:{elements,groups:copy(editor.config.groups||[]),width:maxX-minX,height:maxY-minY,theme:copy(editor.config.theme)}};
  await this.store.put('configs',row);return row;
 }
 async insertCombination(editor,row,point){
  if(row.kind!=='studio-combination'||!Array.isArray(row.config?.elements))throw new Error('组合数据无效');
  for(const element of row.config.elements)if(element.type==='image'&&element.assetId!=='__avatar__'){
   const builtin=(await import('../templates.js')).BUILTIN_MAP.get(element.assetId);
   if(builtin?.available===false||!builtin&&!await this.store.getAsset(element.assetId))throw new Error('组合中有缺失素材，请先恢复对应主题或图片');
  }
  const c=row.config,cx=point?.x??editor.config.canvas.width/2,cy=point?.y??editor.config.canvas.height/2;
  const scale=Math.min(1,editor.config.canvas.width*.85/Math.max(1,c.width),editor.config.canvas.height*.85/Math.max(1,c.height)),group=uid('group');
  const items=c.elements.map((e,i)=>{const item={...copy(e),id:uid('el'),groupId:group,x:cx+(e.x-c.width/2)*scale,y:cy+(e.y-c.height/2)*scale,width:e.width*scale,height:e.height*scale,z:editor.nextZ()+i,locked:false};if(item.photoRole==='secondary')item.photoSlotId=uid('photo');else{delete item.photoRole;delete item.photoSlotId;}if(item.fontSize)item.fontSize*=scale;return item;});
  editor.mutate(()=>{editor.config.groups||=[];editor.config.groups.push({id:group,name:row.name,visibilityMode:'mask'});editor.config.elements.push(...items);editor.selection=items.map(e=>e.id);editor.selectedId=items[0]?.id;});await editor.refreshAssets();
 }
}
