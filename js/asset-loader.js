// 导出前只检查当前设计引用的资源，不会自动下载尚未安装的主题。
let loader = null;
export function registerAssetLoader(value) { loader = value; }
export async function prepareAssets(ids) { if (loader) await loader([...new Set(ids)]); }
