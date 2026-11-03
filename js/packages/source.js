import {bytesBase64,abortCheck} from './integrity.js';

export function parseSource(input){
 const text=String(input||'').trim();if(!text)return null;
 const match=text.match(/^(?:https:\/\/github\.com\/)?([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/);
 if(match)return {kind:'github',owner:match[1],repo:match[2]};
 const url=new URL(text);
 if(!['https:','http:'].includes(url.protocol))throw new Error('下载源需要 GitHub 仓库或 HTTP/HTTPS 地址');
 if(url.hostname==='github.com')throw new Error('请填写仓库主页地址，例如 github.com/用户名/仓库名');
 return {kind:'directory',base:url.href.replace(/\/?$/,'/')};
}

/** 所有酒馆写入经用户文件接口，素材不会写进扩展代码目录。 */
export class TavernFiles{
 constructor(context){this.context=context;this.csrf=null;}
 async headers(){
  const supplied=this.context?.getRequestHeaders?.();if(supplied)return {...supplied,'Content-Type':'application/json'};
  if(!this.csrf){const r=await fetch('/csrf-token',{credentials:'same-origin'});if(!r.ok)throw new Error('无法连接酒馆文件接口');this.csrf=(await r.json()).token;}
  return {'Content-Type':'application/json','X-CSRF-Token':this.csrf};
 }
 async post(route,body,signal){
  abortCheck(signal);const response=await fetch(route,{method:'POST',credentials:'same-origin',headers:await this.headers(),body:JSON.stringify(body),signal});
  if(!response.ok)throw new Error(`酒馆文件操作失败（${response.status}）`);return response;
 }
 async save(name,bytes,signal){
  const r=await this.post('/api/files/upload',{name,data:bytesBase64(bytes)},signal),data=await r.json();
  if(typeof data.path!=='string'||!/^\/?files\/stargaze-[a-z0-9_.-]+$/i.test(data.path))throw new Error('酒馆返回了无效的素材路径');
  return data.path;
 }
 async remove(path){
  if(!/^\/?files\/stargaze-[a-z0-9_.-]+$/i.test(path))throw new Error('只能移除 STARGAZE 管理的素材');
  await this.post('/api/files/delete',{path});
 }
 async verify(urls,signal){return await (await this.post('/api/files/verify',{urls},signal)).json();}
 async download(url,signal){
  // character 下载通道直接返回文件并清理临时副本，无需长期保存下载中转文件。
  const filename='stargaze-temp-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)+'.bin';
  try{return new Uint8Array(await (await this.post('/api/assets/download',{url,category:'character',filename},signal)).arrayBuffer());}
  catch(error){if(error.name==='AbortError')throw error;throw new Error('下载源无法直连，酒馆也未能代为下载；请检查网络或导入本地主题包');}
 }
}

export async function readBytes(url,{signal,limit=64*1024*1024,onProgress,tavern}={}){
 abortCheck(signal);let response;
 const apiAsset=/^https:\/\/api\.github\.com\/repos\/[^/]+\/[^/]+\/releases\/assets\//.test(url);
 try{response=await fetch(url,{signal,headers:apiAsset?{'Accept':'application/octet-stream'}:undefined});}
 catch(error){if(error.name==='AbortError'||!tavern)throw error;const bytes=await tavern.download(url,signal);if(bytes.length>limit)throw new Error('下载文件超过允许大小');onProgress?.(bytes.length,bytes.length);return bytes;}
 if(!response.ok)throw new Error(response.status===403||response.status===429?'下载源访问受限或达到访问次数限制，可稍后重试或本地导入':`下载失败（${response.status}），可重试或使用本地导入`);
 const length=Number(response.headers.get('content-length'))||0;if(length>limit)throw new Error('下载文件超过允许大小');
 if(!response.body){const bytes=new Uint8Array(await response.arrayBuffer());if(bytes.length>limit)throw new Error('下载文件超过允许大小');return bytes;}
 const reader=response.body.getReader(),parts=[];let total=0;
 try{while(true){abortCheck(signal);const {value,done}=await reader.read();if(done)break;total+=value.length;if(total>limit)throw new Error('下载文件超过允许大小');parts.push(value);onProgress?.(total,length);}}
 catch(error){await reader.cancel().catch(()=>{});throw error;}
 const bytes=new Uint8Array(total);let at=0;for(const part of parts){bytes.set(part,at);at+=part.length;}
 if(apiAsset&&bytes[0]===123){let info;try{info=JSON.parse(new TextDecoder().decode(bytes));}catch{}if(info?.browser_download_url)return await readBytes(info.browser_download_url,{signal,limit,onProgress,tavern});}
 return bytes;
}

export async function releaseSource(input,options={}){
 const source=parseSource(input);if(!source)throw new Error('请先设置 GitHub 仓库，或使用本地导入');
 if(source.kind==='directory')return {file:name=>new URL(name,source.base).href,label:source.base};
 const url=`https://api.github.com/repos/${source.owner}/${source.repo}/releases?per_page=5`;
 const bytes=await readBytes(url,{...options,limit:2*1024*1024}),releases=JSON.parse(new TextDecoder().decode(bytes));
 const release=(Array.isArray(releases)?releases:[releases]).find(r=>!r.draft&&r.assets?.some(a=>a.name==='stargaze-catalog.json'));
 if(!release)throw new Error('仓库发布附件中没有主题素材目录，请检查发布内容或使用本地导入');
 const assets=new Map((release.assets||[]).map(a=>[a.name,a.url||a.browser_download_url]));
 return {label:release.tag_name||'最新发布',file:name=>{const url=assets.get(name);if(!url)throw new Error(`发布附件缺少 ${name}`);return url;}};
}
