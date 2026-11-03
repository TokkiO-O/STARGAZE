/** 素材路径以扩展目录为基准。聊天页通常位于站点根目录，不能使用 document.baseURI。 */
const root = new URL('../../', import.meta.url);
export function assetUrl(path) {
    return new URL(path, root).href;
}
