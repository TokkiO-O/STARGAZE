/** 统一的示意头像：预览图不携带人物照片，也不会写入角色的实际头像。 */
export const PREVIEW_AVATAR='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="#e6e2dc"/><text x="400" y="410" text-anchor="middle" dominant-baseline="middle" font-family="Microsoft YaHei, Noto Sans SC, sans-serif" font-size="112" font-weight="600" letter-spacing="10" fill="#625c56">预览</text></svg>');

/** 缩略图中把示意文字居中，正式稿件仍保留各照片原本的独立取景。 */
export function stockPreview(config){
 const preview=structuredClone(config);
 if(preview.avatar)Object.assign(preview.avatar,{frame:1,focusX:50,focusY:50});
 for(const photo of preview.elements||[])if(photo.photoRole)Object.assign(photo,{assetId:'__avatar__',cropZoom:1,focusX:50,focusY:50});
 return preview;
}
