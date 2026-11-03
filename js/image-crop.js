/** focus 表示原图中的取景中心。DOM 的 object-view-box 与 PNG 导出共用同一裁切。 */
export function imageCrop(width, height, zoom = 1, focusX = 50, focusY = 50) {
    const clamp = (n, min, max) => Math.min(max, Math.max(min, Number(n) || 0));
    const scale = clamp(zoom || 1, 1, 3), w = width / scale, h = height / scale;
    return { x: clamp(width * clamp(focusX, 0, 100) / 100 - w / 2, 0, width - w),
        y: clamp(height * clamp(focusY, 0, 100) / 100 - h / 2, 0, height - h), w, h };
}
