/** 画布、聊天区和 PNG 导出共用占位文字规则；保留作者输入的换行与空格。 */
export function resolveText(value, fields = {}, nickname = '') {
    return String(value ?? '').replace(/\{\{\s*([a-z_]+)\s*(?:\|([^}]*))?\}\}/gi,
        (_match, key, fallback) => {
            const name = key.toLowerCase();
            const resolved = fields?.[name] || (name === 'name' ? nickname : '');
            return String(resolved || fallback || '').trim();
        });
}

let measureContext;
/** 模板姓名按已有字框收紧，预览、聊天和导出使用相同字号，避免长姓名挤出纸签。 */
export function textSize(element, text) {
    const maximum = Math.max(3, Number(element.fontSize) || 10);
    if (!element.autoFit) return maximum;
    measureContext ||= document.createElement('canvas').getContext('2d');
    measureContext.font = `${maximum}px ${element.fontFamily || 'sans-serif'}`;
    const lines = String(text ?? '').split('\n');
    const width = Math.max(1, ...lines.map(line => measureContext.measureText(line).width));
    const height = Math.max(1, Number(element.height) || maximum * 1.3);
    return Math.max(3, Math.min(maximum, maximum * element.width * .96 / width, height / (lines.length * 1.24)));
}
