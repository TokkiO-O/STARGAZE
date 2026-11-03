export function normalizeMetadata(value={}){
 value=value&&typeof value==='object'?value:{};
 const clean=(name,max)=>String(value[name]||'').trim().slice(0,max);
 return {title:clean('title',80),author:clean('author',80),description:clean('description',1200),source:clean('source',1600),coverAssetId:clean('coverAssetId',200)};
}
