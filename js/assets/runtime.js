// 原生构图按需生成的纸面注册到同一素材表，避免启动时先构建九十份场景。
const assets=new Map(),listeners=new Set();
let revision=0;
export function registerRuntimeAsset(asset){
 if(assets.has(asset.id))return;
 assets.set(asset.id,asset);for(const listener of listeners)listener(asset);
}
export function onRuntimeAsset(listener){listeners.add(listener);for(const asset of assets.values())listener(asset);return ()=>listeners.delete(listener);}
export function assetRevision(){return revision;}
export function assetsChanged(){revision++;globalThis.dispatchEvent?.(new Event('stargaze-assets-changed'));}
