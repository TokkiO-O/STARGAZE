import {BUILTIN_ASSETS,BUILTIN_MAP,createConfig,CANVAS_PRESETS} from '../templates.js';
import {THEME_CATALOG,MATERIAL_CATALOG} from '../theme-catalog.js';
import {registerAssetLoader} from '../asset-loader.js';
import {assetsChanged} from '../assets/runtime.js';
import {referencedAssets} from '../config-data.js';
import {sha256,base64Bytes,abortCheck} from './integrity.js';
import {TavernFiles,releaseSource,readBytes} from './source.js';

const EMPTY='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="#ebe7df"/><path d="M4 24L13 13 19 20 24 16 29 24Z" fill="#c0b9ae"/></svg>');
const INDEX_KEY='stargaze-theme-index',SOURCE_KEY='stargaze-theme-source';
const clone=value=>structuredClone(value);
const materialById=new Map(MATERIAL_CATALOG.flatMap(m=>m.ids.map(id=>[id,m])));
let current=null;
export function themePackages(){return current;}
export function prettyBytes(bytes){return bytes>=1e6?(bytes/1e6).toFixed(1)+' MB':Math.ceil(bytes/1024)+' KB';}

/** 安装器只处理用户选中的主题；共享图片按内容校验和存一份，安装成功后才切换索引。 */
export class ThemePackages{
 constructor({store,context=null,offline=false}){
  this.store=store;this.context=context;this.offline=offline;this.server=!!context&&!offline;
  this.files=this.server?new TavernFiles(context):null;this.index={key:INDEX_KEY,format:1,themes:{},materials:{}};
  this.urls=new Map();this.operations=new Map();this.listeners=new Set();this.source='';this.remote=null;this.legacy=false;this.mutation=Promise.resolve();this.destroyed=false;
 }
 async init(){
  // 启动只恢复已安装索引；下载操作只能由用户点选主题触发。
  current=this;const local=await this.store.get('configs',INDEX_KEY);
  const url=this.context?.extensionSettings?.STARGAZE?.themeIndexUrl||'/files/stargaze-theme-index.json';
  let saved=local;
  if(this.server&&url&&/^\/?files\/stargaze-[a-z0-9_.-]+$/i.test(url)){
   try{const r=await fetch('/'+url.replace(/^\//,''),{credentials:'same-origin'});if(r.ok)saved=await r.json();}catch{}
  }
  if(saved?.format===1&&saved.themes&&saved.materials)this.index=saved;
  this.source=(await this.store.get('configs',SOURCE_KEY))?.value||this.context?.extensionSettings?.STARGAZE?.themeSource||'';
  for(const a of BUILTIN_ASSETS)if(a.url&&!/^(data:|blob:)/.test(a.url)){
   a.originalUrl ||= a.url;a.available=false;a.url=EMPTY;
   const meta=materialById.get(a.id);if(meta){a.themeIds=meta.themes;a.kind=meta.kind;a.color=meta.color;a.packageManaged=true;}
  }
  // 覆盖更新时原来的素材目录可能仍在，仅探测本地旧文件，不下载任何主题。
  if(!this.offline&&location.protocol!=='file:'){
   const sample=BUILTIN_ASSETS.find(a=>a.originalUrl&&materialById.has(a.id));
   if(sample)try{this.legacy=(await fetch(sample.originalUrl,{method:'HEAD'})).ok;}catch{}
   if(this.legacy)for(const a of BUILTIN_ASSETS)if(a.originalUrl){a.available=true;a.url=a.originalUrl;}
  }
  await this.applyIndex();registerAssetLoader(ids=>this.ensure(ids));return this;
 }
 onChange(listener){this.listeners.add(listener);return ()=>this.listeners.delete(listener);}
 emit(){if(!this.destroyed)for(const listener of this.listeners)listener(this);}
 status(id){return this.index.themes[id]||null;}
 ready(id){return id==='free'||!!this.status(id)||this.legacy;}
 available(id){const a=BUILTIN_MAP.get(id);return !a||a.available!==false;}
 async ensure(ids){const missing=ids.filter(id=>BUILTIN_MAP.get(id)?.available===false);if(missing.length)throw new Error(`缺少 ${missing.length} 张主题素材，请先安装对应主题或导入含素材的模板`);}
 async applyIndex(){
  if(this.destroyed)return;
  // 酒馆使用用户文件地址，离线工作台使用可回收的 Blob 地址。
  for(const [hash,record] of Object.entries(this.index.materials)){
   let url=record.url;
   if(record.localId){const asset=await this.store.getAsset(record.localId);if(this.destroyed)return;if(!asset?.blob)continue;url=this.urls.get(hash);if(!url){url=URL.createObjectURL(asset.blob);this.urls.set(hash,url);}}
   if(!url||(!/^(blob:|data:image\/|\/?files\/stargaze-)/.test(url)))continue;
   if(/^files\//.test(url))url='/'+url;
   for(const id of record.ids){const a=BUILTIN_MAP.get(id);if(a){a.url=url;a.available=true;a.materialHash=hash;const meta=materialById.get(id);if(meta){a.themeIds=meta.themes;a.kind=meta.kind;a.color=meta.color;}}}
  }
  for(const [hash,url] of this.urls)if(!this.index.materials[hash]){URL.revokeObjectURL(url);this.urls.delete(hash);}
  assetsChanged();this.emit();
 }
 async setSource(value){
  const text=String(value||'').trim();await this.store.put('configs',{key:SOURCE_KEY,value:text});this.source=text;this.remote=null;
  if(this.context?.extensionSettings){this.context.extensionSettings.STARGAZE ||= {};this.context.extensionSettings.STARGAZE.themeSource=text;this.context.saveSettingsDebounced?.();}
  this.emit();
 }
 async checkSource(signal){
  const provider=await releaseSource(this.source,{signal,tavern:this.files});
  const bytes=await readBytes(provider.file('stargaze-catalog.json'),{signal,limit:1024*1024,tavern:this.files});
  const catalog=JSON.parse(new TextDecoder().decode(bytes));
  if(catalog.type!=='STARGAZE_RELEASE_CATALOG'||catalog.format!==1||!Array.isArray(catalog.themes))throw new Error('下载源中没有可用的 STARGAZE 素材目录');
  this.remote={provider,catalog};this.emit();return this.remote;
 }
 async installRemote(id){
  // 校验目录、主题清单、共享分片和图片，任何一步失败都不切换旧主题。
  if(this.operations.has(id))throw new Error('这个主题正在安装');
  const op={controller:new AbortController(),done:0,total:0,phase:'连接下载源'};this.operations.set(id,op);this.emit();
  try{
   const remote=this.remote||await this.checkSource(op.controller.signal);
   const theme=remote.catalog.themes.find(t=>t.id===id);if(!theme)throw new Error('该发布中没有这个主题');
   if(theme.manifest!==`theme-${id}.json`||!/^[a-f0-9]{64}$/.test(theme.manifestHash||''))throw new Error('主题目录不完整');
   const bytes=await readBytes(remote.provider.file(theme.manifest),{signal:op.controller.signal,limit:2*1024*1024,tavern:this.files});
   if(await sha256(bytes)!==theme.manifestHash)throw new Error('主题清单校验失败，请重试');
   const pack=JSON.parse(new TextDecoder().decode(bytes));
   const chunks=new Map();
   await this.install(pack,{op,load:async a=>{
    if(!a.bundle)return await readBytes(remote.provider.file(a.file),{signal:op.controller.signal,limit:8*1024*1024,tavern:this.files});
    const bundle=a.bundle;if(!/^[a-f0-9]{64}$/.test(bundle.sha256||'')||bundle.file!==`materials-${bundle.sha256.slice(0,24)}.json`)throw new Error('主题素材分片信息无效');
    if(!chunks.has(bundle.sha256)){
     const bytes=await readBytes(remote.provider.file(bundle.file),{signal:op.controller.signal,limit:8*1024*1024,tavern:this.files,onProgress:n=>{op.current=n;this.emit();}});
     if(bytes.length!==bundle.bytes||await sha256(bytes)!==bundle.sha256)throw new Error('素材分片校验失败，请重试');
     const data=JSON.parse(new TextDecoder().decode(bytes));if(data.format!==1||!Array.isArray(data.images))throw new Error('素材分片无效');chunks.set(bundle.sha256,data.images);
    }
    const row=chunks.get(bundle.sha256).find(row=>row.sha256===a.sha256);if(!row)throw new Error('素材分片中缺少图片');return base64Bytes(row.data);
   }});
  }finally{this.operations.delete(id);this.emit();}
 }
 async importFile(file){
  if(file.size>96*1024*1024)throw new Error('素材包超过 96 MB，请按主题分别导入');
  const pack=JSON.parse(await file.text());this.validate(pack);
  if(this.operations.has(pack.themeId))throw new Error('这个主题正在安装');
  const op={controller:new AbortController(),done:0,total:0,phase:'读取本地主题'};this.operations.set(pack.themeId,op);this.emit();
  try{await this.install(pack,{op,load:async a=>{
   const match=String(a.dataUrl||'').match(/^data:(image\/(?:webp|png|jpeg));base64,([A-Za-z0-9+/=\s]+)$/);
   if(!match)throw new Error('本地主题包中缺少图片数据');return base64Bytes(match[2]);
  }});return pack.themeId;}finally{this.operations.delete(pack.themeId);this.emit();}
 }
 validate(pack){
  // 素材包仅提供已知图片编号，不执行包内代码或覆盖用户自己的稿件。
  const theme=THEME_CATALOG.find(t=>t.id===pack?.themeId);
  if(pack?.type!=='STARGAZE_THEME_PACKAGE'||pack.format!==1||!theme||pack.sizes!==9||typeof pack.name!=='string'||pack.name.length>80||!/^[a-f0-9]{16}$/.test(pack.revision||'')||!Array.isArray(pack.materials)||pack.materials.length>250)throw new Error('这不是有效的九尺寸主题素材包');
  const all=new Set();let total=0;
  for(const a of pack.materials){
   if(!/^[a-f0-9]{64}$/.test(a.sha256||'')||!/^sg-[a-f0-9]{24}\.webp$/.test(a.file||'')||a.file!==`sg-${a.sha256.slice(0,24)}.webp`||a.mime!=='image/webp'||!Number.isInteger(a.bytes)||a.bytes<1||a.bytes>8*1024*1024||!Array.isArray(a.ids)||!a.ids.length)throw new Error('主题素材校验信息无效');
   total+=a.bytes;for(const id of a.ids){if(!BUILTIN_MAP.has(id)||!materialById.has(id)||!theme.assetIds.includes(id)||all.has(id))throw new Error('主题含有未知或重复的素材编号');all.add(id);}
  }
  if(total>64*1024*1024||!theme.assetIds.every(id=>all.has(id)))throw new Error('主题素材不完整或体积异常');
  return theme;
 }
 async install(pack,{op,load}){
  this.validate(pack);const signal=op.controller.signal;op.total=pack.materials.length;op.phase='下载与校验';
  const staged=[],valid=new Set(),existing=pack.materials.filter(a=>this.index.materials[a.sha256]);
  let verified={};
  if(this.server&&existing.length){try{verified=await this.files.verify(existing.map(a=>this.index.materials[a.sha256].url),signal);}catch(error){if(error.name==='AbortError')throw error;}}
  for(const a of existing){
   abortCheck(signal);const record=this.index.materials[a.sha256];
   if(this.server){
    if(verified[record.url]===false)continue;
    if(verified[record.url]===true&&!this.status(pack.themeId)){valid.add(a.sha256);continue;}
    try{const r=await fetch('/'+record.url.replace(/^\//,''),{signal,credentials:'same-origin'});if(r.ok&&await sha256(await r.arrayBuffer())===a.sha256)valid.add(a.sha256);}catch(error){if(error.name==='AbortError')throw error;}
   }else{
    const asset=await this.store.getAsset(record.localId);if(asset?.blob&&asset.blob.size===a.bytes&&(!this.status(pack.themeId)||await sha256(await asset.blob.arrayBuffer())===a.sha256))valid.add(a.sha256);
   }
  }
  for(const a of pack.materials){
   abortCheck(signal);
   if(!valid.has(a.sha256)){
    const bytes=await load(a);if(bytes.length!==a.bytes||await sha256(bytes)!==a.sha256)throw new Error(`素材「${a.name}」校验失败，旧版本仍保留`);
    if(String.fromCharCode(...bytes.subarray(0,4))!=='RIFF'||String.fromCharCode(...bytes.subarray(8,12))!=='WEBP')throw new Error('主题中包含无效图片');
    if(globalThis.createImageBitmap){const bitmap=await createImageBitmap(new Blob([bytes],{type:a.mime}));const valid=bitmap.width>0&&bitmap.height>0&&Math.max(bitmap.width,bitmap.height)<=8192;bitmap.close();if(!valid)throw new Error('主题图片尺寸异常');}
    staged.push({meta:a,bytes});
   }
   op.done++;op.current=0;this.emit();
  }
  // 安装提交串行化；两个主题同时下载也只保存一份共享文件。
  const commit=async()=>{
   abortCheck(signal);op.phase='保存主题';this.emit();const next=clone(this.index),created=[];
   let committed=false;
   try{
    for(const {meta:a,bytes} of staged){
     abortCheck(signal);if(next.materials[a.sha256]&&valid.has(a.sha256))continue;
     const previous=next.materials[a.sha256];
     let record={hash:a.sha256,ids:[...new Set([...(previous?.ids||[]),...a.ids])],bytes:a.bytes,mime:a.mime,name:a.name};
     if(this.server){record.url=await this.files.save('stargaze-'+a.sha256+'.webp',bytes,signal);if(!previous)created.push({server:record.url});}
     else{record.localId='stargaze-package-'+a.sha256;await this.store.put('assets',{id:record.localId,ownerKey:'__theme_packages__',blob:new Blob([bytes],{type:a.mime}),name:a.name,type:a.mime,createdAt:Date.now()});if(!previous)created.push({local:record.localId});}
     next.materials[a.sha256]=record;
    }
    for(const a of pack.materials){const r=next.materials[a.sha256];if(!r)throw new Error('共享素材未保存');r.ids=[...new Set([...r.ids,...a.ids])];}
    next.themes[pack.themeId]={id:pack.themeId,name:pack.name,revision:pack.revision,hashes:[...new Set(pack.materials.map(a=>a.sha256))],installedAt:Date.now(),sizes:9};
    for(const key of Object.keys(CANVAS_PRESETS))createConfig('theme-register','',pack.themeId,key);
    abortCheck(signal);await this.persist(next);committed=true;this.index=next;
    await this.applyIndex();
   }catch(error){
    if(!committed)for(const item of created){if(item.server)await this.files.remove(item.server).catch(()=>{});else await this.store.remove('assets',item.local).catch(()=>{});}
    throw error;
   }
  };
  const result=this.mutation.then(commit,commit);this.mutation=result.catch(()=>{});await result;
 }
 async persist(next){
  // 索引写入成功即提交；酒馆设置只记路径，本地镜像可随后重建。
  if(this.server){
   const bytes=new TextEncoder().encode(JSON.stringify(next));
   const url=await this.files.save('stargaze-theme-index.json',bytes);
   if(this.context?.extensionSettings){this.context.extensionSettings.STARGAZE ||= {};this.context.extensionSettings.STARGAZE.themeIndexUrl=url;try{this.context.saveSettingsDebounced?.();}catch{this.cacheWarning='主题已保存到酒馆，设置同步暂未完成';}}
   // 服务器文件是此模式下的提交点，本地镜像失败不能反向删除已提交素材。
   await this.store.put('configs',next).catch(()=>{this.cacheWarning='主题已保存到酒馆，本地索引缓存暂不可写';});return;
  }
  await this.store.put('configs',next);
 }
 cancel(id){this.operations.get(id)?.controller.abort();}
 async references(extra=[]){
  const states=[...await this.store.getAll('configs'),...await this.store.listCustomTemplates(),...extra];
  return new Set(states.flatMap(state=>referencedAssets(state)));
 }
 async remove(id,extra=[]){
  // 先收集所有尺寸、模板、备份和撤销历史，再删除不再使用的素材。
  if(this.operations.size)throw new Error('请先完成或取消正在进行的安装');
  const run=async()=>{
   const next=clone(this.index);delete next.themes[id];const refs=await this.references(extra);
   const installed=new Set(Object.values(next.themes).flatMap(t=>t.hashes)),removed=[];let retained=0;
   for(const [hash,a] of Object.entries(next.materials)){
    if(installed.has(hash))continue;
    if(a.ids.some(aid=>refs.has(aid))){retained++;continue;}
    removed.push(a);delete next.materials[hash];
   }
   await this.persist(next);this.index=next;
   for(const a of BUILTIN_ASSETS)if(a.packageManaged&&!this.legacy){a.available=false;a.url=EMPTY;}
   await this.applyIndex();
   for(const a of removed){if(a.localId)await this.store.remove('assets',a.localId);else if(a.url)await this.files.remove(a.url).catch(()=>{});}
   return {removed:removed.length,retained};
  };
  const result=this.mutation.then(run,run);this.mutation=result.catch(()=>{});return result;
 }
 destroy(){this.destroyed=true;for(const op of this.operations.values())op.controller.abort();for(const url of this.urls.values())URL.revokeObjectURL(url);this.urls.clear();this.listeners.clear();if(current===this){current=null;registerAssetLoader(null);}}
}
