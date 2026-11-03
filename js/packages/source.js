import {bytesBase64,abortCheck} from './integrity.js';

export const OFFICIAL_SOURCE='TokkiO-O/STARGAZE';
export const DEFAULT_INDEX_PATH='user/files/stargaze-theme-index.json';

/** 酒馆返回相对用户根目录的 user/files 路径；同时识别早期扩展的 files 路径。 */
export function managedFilePath(value){
 const path=typeof value==='string'?value.replace(/^\//,''):'';
 return /^(?:user\/)?files\/stargaze-[a-z0-9_.-]+$/i.test(path)?path:null;
}
export function managedFileUrl(value){const path=managedFilePath(value);return path?'/'+path:null;}

export function parseSource(input=OFFICIAL_SOURCE){
 const text=String(input||OFFICIAL_SOURCE).trim();
 const match=text.match(/^(?:https:\/\/github\.com\/)?([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/);
 if(match)return {kind:'github',owner:match[1],repo:match[2]};
 const url=new URL(text);
 if(!['https:','http:'].includes(url.protocol))throw new Error('下载源需要 GitHub 仓库或 HTTP/HTTPS 地址');
 if(url.hostname==='github.com')throw new Error('下载源需要 GitHub 仓库主页');
 return {kind:'directory',base:url.href.replace(/\/?$/,'/')};
}

/** 上传、检查和删除使用用户目录相对路径；显示图片时才加站点根斜线。 */
export class TavernFiles{
 constructor(context){this.context=context;this.csrf=null;}
 async headers(){
  const supplied=this.context?.getRequestHeaders?.();if(supplied)return {...supplied,'Content-Type':'application/json'};
  if(!this.csrf){const r=await fetch('/csrf-token',{credentials:'same-origin'});if(!r.ok)throw new Error('无法连接酒馆文件接口');this.csrf=(await r.json()).token;}
  return {'Content-Type':'application/json','X-CSRF-Token':this.csrf};
 }
 async post(route,body,signal){
  abortCheck(signal);const response=await fetch(route,{method:'POST',credentials:'same-origin',headers:await this.headers(),body:JSON.stringify(body),signal});
  if(!response.ok){const detail=(await response.text()).replace(/<[^>]*>/g,' ').trim().slice(0,160);throw new Error(`酒馆文件操作失败（${response.status}）${detail?'：'+detail:''}`);}
  return response;
 }
 async save(name,bytes,signal){
  if(!/^stargaze-[a-z0-9_.-]+$/i.test(name))throw new Error('素材文件名无效');
  const r=await this.post('/api/files/upload',{name,data:bytesBase64(bytes)},signal),data=await r.json(),path=managedFilePath(data.path);
  if(!path||path.split('/').pop()!==name)throw new Error('酒馆返回了无效的素材路径');
  return path;
 }
 async remove(value){
  const path=managedFilePath(value);if(!path)throw new Error('只能移除 STARGAZE 管理的素材');
  await this.post('/api/files/delete',{path});
 }
 async verify(urls,signal){
  const paths=urls.map(managedFilePath);if(paths.some(path=>!path))throw new Error('素材路径无效');
  const result=await (await this.post('/api/files/verify',{urls:paths},signal)).json();
  return Object.fromEntries(urls.map((url,i)=>[url,result[paths[i]]??result[url]]));
 }
 async download(url,signal){
  // character 通道直接返回下载内容，并清理酒馆的临时副本。
  const filename='stargaze-temp-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)+'.bin';
  return new Uint8Array(await (await this.post('/api/assets/download',{url,category:'character',filename},signal)).arrayBuffer());
 }
}

async function timed(signal,milliseconds,callback){
 abortCheck(signal);const controller=new AbortController(),abort=()=>controller.abort(signal.reason);
 signal?.addEventListener('abort',abort,{once:true});
 const timer=setTimeout(()=>controller.abort(new DOMException('下载超时','TimeoutError')),milliseconds);
 try{return await callback(controller.signal);}finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
}

async function responseBytes(response,{signal,limit,onProgress}){
 if(!response.ok){const error=new Error(response.status===403||response.status===429?'下载源访问受限，可稍后重试或本地导入':`下载失败（${response.status}）`);error.status=response.status;throw error;}
 const length=Number(response.headers.get('content-length'))||0;
 const tooLarge=()=>{const error=new Error('下载文件超过允许大小');error.sizeLimit=true;return error;};
 if(length>limit)throw tooLarge();
 if(!response.body){const bytes=new Uint8Array(await response.arrayBuffer());if(bytes.length>limit)throw tooLarge();return bytes;}
 const reader=response.body.getReader(),parts=[];let total=0;
 try{while(true){abortCheck(signal);const {value,done}=await reader.read();if(done)break;total+=value.length;if(total>limit)throw tooLarge();parts.push(value);onProgress?.(total,length);}}
 catch(error){await reader.cancel().catch(()=>{});throw error;}
 const bytes=new Uint8Array(total);let at=0;for(const part of parts){bytes.set(part,at);at+=part.length;}return bytes;
}

/** 浏览器被跨域或网络拦截时交给酒馆下载；两条通道都处理 GitHub 的附件元数据跳转。 */
export async function readBytes(url,{signal,limit=64*1024*1024,onProgress,tavern,redirects=0}={}){
 abortCheck(signal);let bytes;
 const apiAsset=/^https:\/\/api\.github\.com\/repos\/[^/]+\/[^/]+\/releases\/assets\//.test(url);
 try{bytes=await timed(signal,20000,async directSignal=>responseBytes(await fetch(url,{signal:directSignal,headers:apiAsset?{'Accept':'application/octet-stream'}:undefined}),{signal:directSignal,limit,onProgress}));}
 catch(error){
  abortCheck(signal);if(!tavern||error.sizeLimit)throw error;
  try{bytes=await timed(signal,60000,proxySignal=>tavern.download(url,proxySignal));}
  catch(proxyError){abortCheck(signal);throw new Error(`素材下载未完成，请重试或导入本地主题包。${proxyError.message}`);}
  if(bytes.length>limit)throw new Error('下载文件超过允许大小');onProgress?.(bytes.length,bytes.length);
 }
 if(redirects<3&&bytes.length&&bytes[0]===123){
  let info;try{info=JSON.parse(new TextDecoder().decode(bytes));}catch{}
  if(info?.browser_download_url&&info.browser_download_url!==url)return readBytes(info.browser_download_url,{signal,limit,onProgress,tavern,redirects:redirects+1});
 }
 return bytes;
}

export async function releaseSource(input=OFFICIAL_SOURCE,options={}){
 const source=parseSource(input);
 if(source.kind==='directory')return {file:name=>new URL(name,source.base).href,label:source.base};
 const url=`https://api.github.com/repos/${source.owner}/${source.repo}/releases?per_page=5`;
 const bytes=await readBytes(url,{...options,limit:2*1024*1024}),releases=JSON.parse(new TextDecoder().decode(bytes));
 const release=(Array.isArray(releases)?releases:[releases]).find(r=>!r.draft&&r.assets?.some(a=>a.name==='stargaze-catalog.json'));
 if(!release)throw new Error('官方仓库暂未提供主题目录，可稍后重试或导入本地主题包');
 const assets=new Map((release.assets||[]).map(a=>[a.name,a.url||a.browser_download_url]));
 return {label:release.tag_name||'最新发布',file:name=>{const url=assets.get(name);if(!url)throw new Error(`发布附件缺少 ${name}`);return url;}};
}
