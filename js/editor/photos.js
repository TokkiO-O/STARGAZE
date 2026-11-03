import { mainPortrait, clampFocus } from '../templates.js';
import {openCropDialog} from './crop-dialog.js';

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/** 照片位面板：默认跟随角色头像，替换只作用于选中的副图，取景彼此独立。 */
export class PhotoSlots {
    constructor(editor) { this.editor = editor; }

    items() {
        const { config } = this.editor;
        if (!config) return [];
        const main = mainPortrait(config);
        return config.elements.filter(e => e.type === 'image' && e.id !== main?.id
            && (e.photoRole === 'secondary' || e.assetId === '__avatar__'));
    }

    render() {
        const editor = this.editor, panels = editor.overlay?.querySelectorAll('.star-photo-slots');
        if (!panels?.length) return;
        const items = this.items();
        const markup = items.length ? items.map((e, i) => {
            const follows = e.assetId === '__avatar__';
            const source = follows ? editor.avatarUrl : editor.describeAsset(e.assetId)?.url;
            return `<div class="star-photo-slot ${editor.selectedId === e.id ? 'active' : ''}">
                <button type="button" class="star-photo-select" data-photo-action="select" data-photo-id="${e.id}" title="选择并调整此副图">
                    <img src="${escape(source || editor.avatarUrl)}" alt="" loading="lazy" decoding="async"/>
                    <span><b>${escape(e.slotName || `副图 ${i + 1}`)}</b><small>${follows ? '跟随主头像 · 独立取景' : '独立图片'}</small></span>
                </button>
                <button type="button" data-photo-action="replace" data-photo-id="${e.id}">替换</button>
                <button type="button" data-photo-action="crop-dialog" data-photo-id="${e.id}">取景</button>
                ${follows ? '' : `<button type="button" data-photo-action="follow" data-photo-id="${e.id}" title="重新使用角色头像">跟随</button>`}
            </div>`;
        }).join('') : '<small class="star-editor-hint">此画布暂时没有副图位。可从素材库添加角色头像。</small>';
        panels.forEach(panel => { panel.innerHTML = markup; });
        editor.overlay.querySelectorAll('[data-photo-count]').forEach(count => { count.textContent = items.length; });
    }

    inspector(element) {
        if (!this.items().some(e => e.id === element.id)) return '';
        return `<div class="star-photo-source"><strong>${element.assetId === '__avatar__' ? '跟随角色头像' : '独立副图'}</strong>
            <p>替换这张副图不会改变主头像或其他照片位。</p>
            <div><button type="button" data-photo-action="replace" data-photo-id="${element.id}">替换副图</button>
            <button type="button" data-photo-action="crop-dialog" data-photo-id="${element.id}">放大取景</button>
            <button type="button" data-photo-action="follow" data-photo-id="${element.id}">恢复跟随头像</button>
            <button type="button" data-photo-action="crop" data-photo-id="${element.id}">默认取景</button></div></div>`;
    }

    handleClick(event) {
        const button = event.target.closest('[data-photo-action]');
        if (!button) return false;
        const editor = this.editor;
        const element = editor.config.elements.find(e => e.id === button.dataset.photoId);
        if (!element) return true;
        const action = button.dataset.photoAction;
        if (action === 'select') {
            editor.selectElement(element.id);
            if (globalThis.matchMedia?.('(max-width: 760px)').matches) {
                const mobile = editor.overlay.querySelector('.star-mobile-photos');
                if (mobile) mobile.open = false;
            }
        }
        else if (action === 'replace') editor.openUpload(element.id);
        else if (action === 'crop-dialog') openCropDialog(editor,element.id);
        else if (action === 'follow') editor.mutate(() => {
            // 图片来源与取景分开处理：恢复跟随时保留用户刚刚调整的裁切。
            element.assetId = '__avatar__';
        });
        else if (action === 'crop') editor.mutate(() => {
            const crop = element.defaultCrop || {};
            const zoom = Number(crop.cropZoom);
            // 只恢复三个取景字段，旧模板中的额外元数据不能覆盖图片和摆位。
            element.cropZoom = Number.isFinite(zoom) && zoom > 0 ? Math.max(.2, Math.min(8, zoom)) : 1.25;
            element.focusX = clampFocus(crop.focusX ?? 50);
            element.focusY = clampFocus(crop.focusY ?? 40);
        });
        return true;
    }
}
