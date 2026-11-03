import {
    ANCHOR_MODES,
    applyBuiltInTemplate,
    applySizeState,
    AVATAR_FOCUS,
    AVATAR_FRAME,
    AVATAR_SHAPES,
    AVATAR_ZOOM,
    AVATAR_ROTATE,
    avatarFrameVars,
    avatarImageStyle,
    avatarShapeFitScale,
    avatarShapeStyle,
    avatarShapeVars,
    shapeFollowsPhoto,
    shapeRotateOf,
    avatarUnits,
    avatarVisualSize,
    avatarViewBox,
    AVATAR_BOX,
    BUILTIN_ASSETS,
    BUILTIN_MAP,
    captureSizeState,
    characterFields,
    FRAMING_PRESETS,
    CANVAS_LIMITS,
    CANVAS_PRESETS,
    characterKey,
    clampAvatarBox,
    clampAvatarZoom,
    clampFocus,
    clampFrame,
    clampRotate,
    clampShapeRotate,
    createConfig,
    CUSTOM_LAYOUT_ID,
    FONT_OPTIONS,
    FRAME_STYLES,
    freshSizeState,
    isBuiltinAsset,
    LAYOUTS,
    mainPortrait,
    isElementHidden,
    avatarIsHidden,
    matchPresetId,
    normalizeAvatarState,
    photoShapeHit,
    photoViewBox,
    setCanvasPreset,
    shapeSampleStyle,
    STICKER_GROUPS,
    TEMPLATE_LIST,
    tuneAvatarForShape,
    uid,
    AVATAR_PLACEHOLDER,
} from './templates.js';
import { LIBRARY_OWNER } from './store.js';
import { ASPECT } from './scenes-assets.js';
import { PhotoSlots } from './editor/photos.js';
import { configStates, referencedAssets, templateConfig } from './config-data.js';
import { resolveText, textSize } from './text.js';
import {openStudio,refreshStudioTray,bindStudioTray,openPreflight} from './studio/index.js';
import {StudioRepository} from './studio/model.js';
import {toneFilter} from './photo-tone.js';
import {normalizeMetadata} from './template-meta.js';
import { APP_VERSION } from './version.js';
import { renderCollage, renderCollageBlob } from './exporter.js';
import {themePackages} from './packages/manager.js';
import {openPackagePanel} from './editor/package-panel.js';
import {assetUrl} from './assets/url.js';
import {editorElement,patchEditorStage} from './editor/scene-view.js';
import {openStoragePanel} from './editor/storage-panel.js';
import {openTemplateUpdate,restoreTemplateCheckpoint} from './editor/template-update.js';

function clone(value) {
    if (typeof structuredClone === 'function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
    })[character]);
}

function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
}

function canvasShapeMarkup(width, height, max = 26) {
    const ratio = Math.max(0.2, (Number(width) || 1) / (Number(height) || 1));
    const w = ratio >= 1 ? max : Math.round(max * ratio);
    const h = ratio >= 1 ? Math.round(max / ratio) : max;
    return `<i class="star-canvas-shape" style="width:${w}px;height:${h}px"></i>`;
}

export class StarEditor {
    constructor({ context, store, renderer, character, notify, onClose, onChange, key }) {
        this.photos = new PhotoSlots(this);
        this.context = context;
        this.store = store;
        this.renderer = renderer;
        this.character = character;
        this.notify = notify;
        this.onClose = onClose;
        this.onChange = onChange;
        this.key = key || characterKey(character);
        this.config = null;
        this.global = null;
        this.overlay = null;
        this.stage = null;
        this.selectedId = null;

        this.selection = [];

        this.selectionAnchor = null;
        this.layerQuery = '';
        this.viewZoom = 1;
        this.panning = null;
        this.marquee = null;
        this.spaceDown = false;
        this.baseStageSize = null;
        this.history = [];
        this.future = [];
        this.dirty = false;
        this.editRevision = 0;
        this.saveTimer = null;
        this.assetUrls = new Map();
        this.libraryAssets = [];
        this.ownedAssets = [];
        this.assetTab = 'builtin';
        this.assetQuery = '';
        this.assetStyle = 'all';
        this.assetKind='all';this.assetColor='all';
        this.snapGuides = { x: null, y: null };
        this.gesture = null;
        this.avatarDrag = null;
        this.draggingLayerId = null;
        this.lastHitPoint = null;
        this.lastHitId = null;
        this.mobileTab = 'canvas';

        this.foldState = { shape: true, layer: true, geometry: true };
        this.recentAssets = this.loadRecentAssets();
        this.controlHistoryTarget = null;
        this.replaceTargetId = null;
        this.closed = false;
        this.keydownHandler = event => this.onKeydown(event);
        this.resizeHandler = () => this.fitStage();
    }

    async open() {
        this.global = await this.store.getGlobal();
        this.config = (await this.store.getCharacterConfig(this.key, this.character.name)) || createConfig(this.key, this.character.name);
        if (!LAYOUTS[this.config.sizeKey]) this.config.sizeKey = this.config.layout;
        if (!this.config.sizes || typeof this.config.sizes !== 'object') this.config.sizes = {};
        this.boundTemplate = await this.store.getBoundTemplate(this.key);
        this.avatarUrl = this.character.avatarUrl
            || (this.character.avatar && this.character.avatar !== 'none'
                ? this.context.getThumbnailUrl('avatar', this.character.avatar)
                : AVATAR_PLACEHOLDER);
        this.overlay = document.createElement('div');
        this.overlay.className = 'stargaze-editor';
        this.overlay.setAttribute('role', 'dialog');
        this.overlay.setAttribute('aria-modal', 'true');
        this.overlay.setAttribute('aria-label', 'STARGAZE 头像拼贴编辑器');
        this.overlay.innerHTML = this.editorMarkup();
        this.overlay.dataset.starMobileTab = this.mobileTab;
        document.body.append(this.overlay);

        requestAnimationFrame(() => {
            this.overlay?.classList.add('is-open');
            document.body.classList.add('stargaze-editor-open');
            this.overlay?.classList.add('star-no-native-select');
        });
        this.overlay.querySelector('.star-editor-character').textContent = this.character.name;
        this.stage = this.overlay.querySelector('.star-editor-stage');
        this.scrollBox = this.overlay.querySelector('.star-stage-scroll');
        this.bindEvents();
        this.overlay.querySelector('[data-open-studio]').addEventListener('click',()=>openStudio(this));
        bindStudioTray(this);
        this.overlay.querySelector('[data-asset-kind]').addEventListener('change',event=>{this.assetKind=event.target.value;this.renderAssets();});
        this.overlay.querySelector('[data-asset-color]').addEventListener('change',event=>{this.assetColor=event.target.value;this.renderAssets();});
        this.overlay.querySelector('[data-open-packages]').addEventListener('click',()=>openPackagePanel(this));
        this.overlay.querySelector('[data-open-storage]').addEventListener('click',()=>openStoragePanel(this).catch(error=>this.notify(error.message)));
        this.overlay.querySelector('[data-restore-theme]').addEventListener('click',()=>restoreTemplateCheckpoint(this).catch(error=>this.notify(error.message)));
        await Promise.all([this.refreshAssets(), this.refreshCustomTemplates()]);
        this.renderAll();
        this.renderTemplatePreviews();
        await refreshStudioTray(this);
        this.setMobileTab(this.mobileTab);
        this._openBarTimer = setTimeout(() => {
            if (!this.stage?.querySelector('.star-avatar-bar:hover')) this.hideAvatarBar(0);
        }, 700);
        document.addEventListener('keydown', this.keydownHandler, true);
        window.addEventListener('resize', this.resizeHandler);
        return this;
    }

    // 编辑器界面：左侧模板/照片位/素材，中央画布，右侧图层与属性。
    editorMarkup() {
        const templateCards = TEMPLATE_LIST.map(template => `
            <button type="button" class="star-template-card" data-template="${template.id}">
                <span class="star-template-preview"><span class="star-template-frame" data-template-preview="${template.id}"><i>✦</i></span></span>
                <span class="star-template-card-title"><strong>${template.name}</strong><span class="star-template-colors">${template.colors.map(color => `<i style="background:${color}"></i>`).join('')}</span></span>
                <small>${template.description}</small>
            </button>`).join('');
        const canvasButtons = Object.entries(CANVAS_PRESETS).map(([id, preset]) => `
            <button type="button" class="star-canvas-button" data-canvas="${id}" title="${preset.hint}">
                ${canvasShapeMarkup(preset.width, preset.height)}
                <strong>${preset.name}</strong><small>${preset.width}×${preset.height}</small>
            </button>`).join('');
        const customButton = `
            <button type="button" class="star-canvas-button star-canvas-custom" data-canvas="${CUSTOM_LAYOUT_ID}" title="自定义画布：在画布上方的工具条里直接输入宽高">
                ${canvasShapeMarkup(4, 3)}
                <strong>自定义</strong><small>自由宽高</small>
            </button>`;
        const stickerMarkup = STICKER_GROUPS.map(group => `
            <div class="star-sticker-group">
                <strong>${group.name}</strong>
                <div class="star-sticker-grid">${group.items.map(glyph => `<button type="button" data-sticker="${escapeHtml(glyph)}" title="${group.name}">${glyph}</button>`).join('')}</div>
            </div>`).join('');
        return `
            <header class="star-editor-topbar">
                <div class="star-editor-brand"><span>✦</span><div><strong>STARGAZE</strong><small class="star-editor-character"></small></div></div>
                <div class="star-editor-top-actions">
                    <span class="star-editor-save-status">已载入</span>
                    <button type="button" data-open-studio>创作工具</button>
                    <button type="button" data-action="export" title="导出当前角色配置与图片">导出</button>
                    <button type="button" data-action="import" title="导入到当前角色">导入</button>
                    <button type="button" data-action="save" class="star-primary">保存</button>
                    <button type="button" data-open-storage>存储与备份</button>
                    <button type="button" data-action="close" class="star-icon-button" aria-label="关闭">×</button>
                </div>
            </header>
            <nav class="star-editor-mobile-nav">
                <button type="button" data-mobile-tab="canvas">画布</button>
                <button type="button" data-mobile-tab="avatar">照片</button>
                <button type="button" data-mobile-tab="assets">素材</button>
                <button type="button" data-mobile-tab="text">文字</button>
            </nav>
            <div class="star-editor-body">
                <aside class="star-editor-left">
                    <section data-panel="canvas"><div class="star-section-title"><h3>主题模板</h3><button type="button" data-open-packages>自选安装</button></div><div class="star-template-grid">${templateCards}</div><button type="button" class="star-wide-button" data-action="reset-theme">重新载入本主题九尺寸</button><button type="button" class="star-wide-button" data-restore-theme>恢复更新前稿件</button></section>
                    <section data-panel="canvas"><h3>画布尺寸</h3><div class="star-canvas-grid">${canvasButtons}${customButton}</div>
                        <small class="star-editor-hint">九种比例从「标签条」到「长手幅」逐级拉开，点一下整体换尺寸；只想改宽高就到画布上方那条工具条里直接填。</small>
                    </section>
                    <section data-panel="avatar" class="star-photo-panel">
                        <div class="star-section-title"><h3>副图位 <small data-photo-count></small></h3></div>
                        <small class="star-editor-hint">默认只用一张头像，副图采用不同取景；每一张也能单独替换。</small>
                        <div class="star-photo-slots"></div>
                    </section>
                    <section data-panel="assets">
                        <div class="star-section-title"><h3>素材库</h3><button type="button" data-action="upload">＋ 上传</button></div>
                        <div class="star-asset-tabs">
                            <button type="button" data-asset-tab="builtin">内置</button>
                            <button type="button" data-asset-tab="library">我的素材库</button>
                            <button type="button" data-asset-tab="owned">本角色</button>
                        </div>
                        <div class="star-asset-tools">
                            <input type="search" data-asset-search placeholder="搜索樱桃、胶带、珍珠…" aria-label="搜索素材" />
                            <select data-asset-style aria-label="按风格筛选素材">
                                <option value="all">全部风格</option><option value="basic">通用素材</option>
                                ${TEMPLATE_LIST.filter(template => template.id !== 'free').map(template => `<option value="${template.id}">${template.name}</option>`).join('')}
                                <option value="web">网络素材</option>
                            </select>
                        </div>
                        <div class="star-asset-extra-filters"><select data-asset-kind aria-label="素材用途"><option value="all">全部用途</option>${['纸张','固定与丝带','相框与小卡','花材与果实','主题小物'].map(k=>`<option>${k}</option>`).join('')}</select><select data-asset-color aria-label="素材色调"><option value="all">全部色调</option><option value="warm">暖色</option><option value="cool">冷色</option><option value="neutral">中性色</option></select></div>
                        <div class="star-studio-tray" data-studio-tray hidden></div>
                        <div class="star-asset-groups"></div>
                        <small class="star-editor-hint">点一下或拖到画布都能放置；上传图片会进入公共素材库，所有角色都能复用。</small>
                    </section>
                    <section data-panel="text"><h3>文字与贴纸</h3>${stickerMarkup}
                        <div class="star-decoration-actions">
                            <button type="button" data-action="add-tape" data-tape="washi">和纸</button>
                            <button type="button" data-action="add-tape" data-tape="clear">透明</button>
                            <button type="button" data-action="add-tape" data-tape="solid">纯色</button>
                            <button type="button" data-action="add-tape" data-tape="grid">格纹</button>
                            <button type="button" data-action="add-tape" data-tape="pink">粉胶</button>
                            <button type="button" data-action="add-tape" data-tape="blue">蓝胶</button>
                            <button type="button" data-action="add-tape" data-tape="mint">薄荷</button>
                            <button type="button" data-action="add-tape" data-tape="kraft">牛皮纸</button>
                        </div>
                    </section>
                    <section data-panel="canvas"><div class="star-section-title"><h3>我的模板</h3><button type="button" data-action="save-template">保存当前</button></div><div class="star-custom-templates"></div></section>
                </aside>
                <main class="star-editor-workspace">
                    <div class="star-editor-toolbar">
                        <button type="button" data-action="undo" title="撤销 Ctrl+Z">↶ 撤销</button>
                        <button type="button" data-action="redo" title="重做 Ctrl+Y">↷ 重做</button>
                        <span></span>
                        <button type="button" data-action="duplicate" title="复制 Ctrl+D">复制</button>
                        <button type="button" data-action="front">置顶</button>
                        <button type="button" data-action="back">置底</button>
                        <button type="button" data-action="delete" class="star-danger">删除</button>
                        <button type="button" data-action="merge-layers" title="把选中的多个元素合成一张图（Ctrl+E）">合并</button>
                        <button type="button" data-action="group-layers" title="建立分组文件夹（Ctrl+G），可折叠，类似 PS 图层组">文件夹</button>
                        <button type="button" data-action="ungroup-layers" title="解散编组（Ctrl+Shift+G）">解组</button>
                        <span></span>
                        <button type="button" data-action="random" class="star-toolbar-random" title="随机换一套风格与尺寸（按住 Alt 只换风格）">🎲 随机搭配</button>
                        <button type="button" data-action="export-image" title="导出模板：当前尺寸或全尺寸包">导出模板</button>
                        <button type="button" data-action="export-png" title="保存当前画布为 PNG 图片">存为图片</button>
                    </div>
                    <div class="star-canvas-bar">
                        <span class="star-canvas-bar-title">画布</span>
                        <label class="star-canvas-bar-field">宽<input type="number" data-bar-field="width" min="${CANVAS_LIMITS.minWidth}" max="${CANVAS_LIMITS.maxWidth}" step="10" /></label>
                        <span class="star-canvas-bar-times">×</span>
                        <label class="star-canvas-bar-field">高<input type="number" data-bar-field="height" min="${CANVAS_LIMITS.minHeight}" max="${CANVAS_LIMITS.maxHeight}" step="10" /></label>
                        <span class="star-canvas-bar-ratio"></span>
                        <span class="star-canvas-bar-spacer"></span>
                        <button type="button" data-action="fit-width" class="star-canvas-bar-action" title="只把画布拉宽到聊天区宽度，素材和头像保持原样">画布铺满宽度</button>
                        <button type="button" data-action="toggle-avatar" class="star-canvas-bar-action star-canvas-bar-toggle" title="把聊天区中间那个头像（原生头像 + 拼贴主图）一起收起来，位置与排版都不变">隐藏中间头像</button>
                    </div>
                    <div class="star-stage-scroll">
                        <div class="star-editor-stage"></div>
<div class="star-zoom-hud">
                            <button type="button" data-action="zoom-out" title="缩小 Ctrl+滚轮">−</button>
                            <b data-zoom-label>100%</b>
                            <button type="button" data-action="zoom-in" title="放大 Ctrl+滚轮">＋</button>
                            <button type="button" data-action="zoom-fit" title="缩放到刚好放进窗口（快捷键 0）">适应</button>
                        </div>
                    </div>
                    <div class="star-editor-gesture-hint">框选：空白/底纸上拖，或按住 Alt 从素材上拉框 · Ctrl点选 · Shift连选 · Ctrl+滚轮缩放 · 空格平移</div>
                </main>
                <aside class="star-editor-right">
                    <details class="star-mobile-photos" open>
                        <summary>副图位 <small data-photo-count></small> · 跟随头像或独立替换</summary>
                        <button type="button" data-action="deselect" class="star-wide-button">调整主头像</button>
                        <div class="star-photo-slots"></div>
                    </details>
                    <div class="star-layer-dock">
                        <div class="star-layer-head">
                            <strong>图层</strong>
                            <small class="star-layer-count">0</small>
                        </div>
                        <div class="star-layer-search-wrap">
                            <input type="search" class="star-layer-search" placeholder="搜索图层…" autocomplete="off" />
                        </div>
                        <div class="star-layer-tools">
                            <button type="button" data-action="layer-top" title="置顶">置顶</button>
                            <button type="button" data-action="layer-front" title="上移">上移</button>
                            <button type="button" data-action="layer-back" title="下移">下移</button>
                            <button type="button" data-action="layer-bottom" title="置底">置底</button>
                            <button type="button" data-action="layer-unlock" title="解锁全部">解锁</button>
                        </div>
                        <div class="star-layer-list" tabindex="0"></div>
                    </div>
                    <div class="star-inspector"></div>
                </aside>
            </div>
            <input type="file" class="star-upload-input" accept="image/png,image/jpeg,image/webp,image/gif" multiple hidden />
            <input type="file" class="star-import-input" accept="application/json,.json" hidden />
            <div class="star-context-menu" hidden>
                <button type="button" data-ctx="duplicate">复制</button>
                <button type="button" data-ctx="merge">合并图层</button>
                <button type="button" data-ctx="group">建立文件夹</button>
                <button type="button" data-ctx="ungroup">解散文件夹</button>
                <button type="button" data-ctx="front">上移一层</button>
                <button type="button" data-ctx="back">下移一层</button>
                <button type="button" data-ctx="top">置顶</button>
                <button type="button" data-ctx="bottom">置底</button>
                <button type="button" data-ctx="fit">框贴合内容</button>
                <button type="button" data-ctx="delete" class="star-danger">删除</button>
            </div>`;
    }

    renderTemplatePreviews() {
        // 模板缩略图按需绘制，避免同时创建数百个带图片的图层节点。
        this.previewObserver?.disconnect();
        const generation = this.previewGeneration = (this.previewGeneration || 0) + 1;
        let queue = Promise.resolve();
        const paint = preview => {
            queue = queue.then(async () => {
                if (this.closed || generation !== this.previewGeneration || !preview.isConnected) return;
                const template = TEMPLATE_LIST.find(t => t.id === preview.dataset.templatePreview);
                const packages=themePackages();
                if(template.id!=='free'&&packages&&!packages.ready(template.id)){
                    preview.innerHTML=`<img src="${assetUrl('theme-previews/'+template.id+'.webp')}" alt="${escapeHtml(template.name)}预览" loading="lazy"><small>点选安装 · 九个尺寸</small>`;return;
                }
                const config = createConfig('preview', 'STARGAZE', template.id, template.layout);
                preview.style.setProperty('--ar', String(config.canvas.width / config.canvas.height));
                if (!config.elements.length) { preview.textContent = '＋ 自由创作'; return; }
                const canvas = await renderCollage(config, { avatarUrl: this.avatarUrl, quality: .16 });
                if (this.closed || generation !== this.previewGeneration) return;
                preview.replaceChildren(canvas);
            }).catch(error => console.warn('[STARGAZE] 缩略图暂不可用', error));
        };
        const previews = this.overlay?.querySelectorAll('[data-template-preview]') || [];
        if (!globalThis.IntersectionObserver) { previews.forEach(paint); return; }
        this.previewObserver = new IntersectionObserver(entries => {
            for (const entry of entries) if (entry.isIntersecting) {
                this.previewObserver.unobserve(entry.target);
                paint(entry.target);
            }
        }, { root: this.overlay.querySelector('.star-editor-left'), rootMargin: '160px' });
        previews.forEach(preview => this.previewObserver.observe(preview));
    }

    bindEvents() {
        this.overlay.addEventListener('click', event => this.onClick(event));

        this.overlay.addEventListener('wheel', event => {
            const input = event.target.closest('input[type="number"], input[type="range"]');
            if (input && document.activeElement !== input) {

                if (input.type === 'number') input.blur();
            }
        }, { passive: true });

        this.overlay.querySelector('.star-upload-input').addEventListener('change', event => this.handleUpload(event));
        this.overlay.querySelector('.star-import-input').addEventListener('change', event => this.handleImport(event));
        this.overlay.querySelector('[data-asset-search]').addEventListener('input', event => {
            this.assetQuery = event.target.value.trim().toLowerCase();
            this.renderAssets();
        });
        this.overlay.querySelector('[data-asset-style]').addEventListener('change', event => {
            this.assetStyle = event.target.value;
            this.renderAssets();
        });
        this.overlay.addEventListener('dragstart', event => {
            const source = event.target.closest('[data-asset-drag]');
            if (!source) return;
            event.dataTransfer.setData('application/x-stargaze-asset', source.dataset.assetId);
            event.dataTransfer.effectAllowed = 'copy';
        });
        const inspector = this.overlay.querySelector('.star-inspector');
        inspector.addEventListener('focusin', event => this.beginControlEdit(event.target));
        inspector.addEventListener('focusout', event => {
            if (this.controlHistoryTarget === event.target) this.controlHistoryTarget = null;
        });
        inspector.addEventListener('input', event => this.onInspectorInput(event));
        inspector.addEventListener('change', event => this.onInspectorInput(event));

        inspector.addEventListener('toggle', event => {
            const fold = event.target.closest?.('[data-fold]');
            if (fold && inspector.contains(fold)) this.foldState[fold.dataset.fold] = fold.open;
        }, true);
        const bar = this.overlay.querySelector('.star-canvas-bar');
        bar?.addEventListener('focusin', event => this.beginControlEdit(event.target));
        bar?.addEventListener('input', event => this.onBarInput(event));
        bar?.addEventListener('change', event => this.onBarInput(event));

        const layerBox = this.overlay.querySelector('.star-layer-list');

        this.overlay.querySelector('.star-layer-list')?.addEventListener('dblclick', event => {
            const rename = event.target.closest('[data-action="group-rename"], [data-group-id].star-layer-name, .star-layer-folder-row .star-layer-name');
            const gid = rename?.dataset?.groupId || event.target.closest('[data-group-id]')?.dataset?.groupId;
            if (gid) {
                event.preventDefault();
                this.renameGroup(gid);
            }
        });
        const layerSearch = this.overlay.querySelector('.star-layer-search');
        layerSearch?.addEventListener('input', event => {
            this.layerQuery = String(event.target.value || '').trim().toLowerCase();
            this.renderLayerList();
        });
        layerBox?.addEventListener('contextmenu', event => {
            event.preventDefault();
            event.stopPropagation();
            const row = event.target.closest('[data-layer-row]');
            if (row) {
                const id = row.dataset.layerRow;
                if (!this.selection.includes(id)) this.selectWithModifiers(id, {});
            }
            this.showContextMenu(event);
        });
        layerBox?.addEventListener('wheel', event => {
            event.stopPropagation();
        }, { passive: true });
        layerBox?.addEventListener('dragstart', event => {
            const row = event.target.closest('[data-layer-row]');
            if (!row) return;
            this.draggingLayerId = row.dataset.layerRow;
            this.layerDropPlace = 'before';
            row.classList.add('is-dragging');
            event.dataTransfer?.setData('text/plain', this.draggingLayerId);
            event.dataTransfer.effectAllowed = 'move';
        });
        layerBox?.addEventListener('dragend', event => {
            layerBox.querySelectorAll('.is-dragging, .is-drop-target, .drop-before, .drop-after').forEach(node => {
                node.classList.remove('is-dragging', 'is-drop-target', 'drop-before', 'drop-after');
            });
            this.draggingLayerId = null;
            this.layerDropPlace = 'before';
        });
        layerBox?.addEventListener('dragover', event => {
            const row = event.target.closest('[data-layer-row], [data-group-row]');
            if (!row || !this.draggingLayerId) return;
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            layerBox.querySelectorAll('.is-drop-target, .drop-before, .drop-after').forEach(node => {
                node.classList.remove('is-drop-target', 'drop-before', 'drop-after');
            });
            const rect = row.getBoundingClientRect();
            const before = event.clientY < rect.top + rect.height / 2;
            this.layerDropPlace = before ? 'before' : 'after';
            row.classList.add('is-drop-target', before ? 'drop-before' : 'drop-after');
        });
        layerBox?.addEventListener('drop', event => {
            const row = event.target.closest('[data-layer-row], [data-group-row]');
            if (!row || !this.draggingLayerId) return;
            event.preventDefault();
            const place = this.layerDropPlace || 'before';
            if (row.dataset.groupRow) {

                this.moveLayerIntoGroup(this.draggingLayerId, row.dataset.groupRow, place);
            } else {
                this.reorderLayer(this.draggingLayerId, row.dataset.layerRow, place);
            }
            this.draggingLayerId = null;
            layerBox.querySelectorAll('.is-dragging, .is-drop-target, .drop-before, .drop-after').forEach(node => {
                node.classList.remove('is-dragging', 'is-drop-target', 'drop-before', 'drop-after');
            });
        });
        layerBox?.addEventListener('mouseover', event => {
            const row = event.target.closest('[data-layer-row]');
            if (row) this.highlightLayer(row.dataset.layerRow, true);
        });
        layerBox?.addEventListener('mouseout', event => {
            if (event.relatedTarget?.closest?.('[data-layer-row]')) return;
            this.highlightLayer(null, false);
        });
        this.stage.addEventListener('pointerdown', event => this.onPointerDown(event));

        const blockNativeSelect = event => {
            if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
            event.preventDefault();
        };
        this.overlay.addEventListener('selectstart', blockNativeSelect);
        this.overlay.addEventListener('dragstart', event => {
            if (event.target.closest('.star-layer-row[draggable="true"]')) return;
            if (event.target.closest('[data-asset-id], .star-asset-card, [data-studio-combination]')) return;
            event.preventDefault();
        });

        this.stage.addEventListener('click', event => {
            const quick = event.target.closest('[data-avatar-quick]');
            if (!quick || !quick.closest('.star-avatar-bar')) return;
            event.preventDefault();
            event.stopPropagation();
            this.onAvatarQuick(quick.dataset.avatarQuick, quick, event);
        }, true);
        this.stage.addEventListener('pointermove', event => {
            if (event.target.closest?.('.star-editor-avatar-guide')) this.showAvatarBar();
            this.onPointerMove(event);
        });
        this.stage.addEventListener('pointerover', event => {
            const bar = event.target.closest?.('.star-avatar-bar');
            if (bar) this.showAvatarBar(0);
            const guide = event.target.closest?.('.star-editor-avatar-guide');
            if (guide) this.showAvatarBar();
        });
        this.stage.addEventListener('pointerleave', () => this.hideAvatarBar(700));
        this.stage.addEventListener('pointerout', event => {
            if (event.target.closest?.('.star-avatar-bar') && !event.relatedTarget?.closest?.('.star-avatar-bar')) {
                this.hideAvatarBar(600);
            }
        });
        this.stage.addEventListener('pointerup', event => this.onPointerUp(event));
        this.stage.addEventListener('pointercancel', event => this.onPointerUp(event));
        this.stage.addEventListener('contextmenu', event => {
            event.preventDefault();
            event.stopPropagation();
            const node = event.target.closest('.stargaze-element');
            if (node && !this.selection.includes(node.dataset.elementId)) {
                this.selectElement(node.dataset.elementId);
            }
            this.showContextMenu(event);
        });

        this.overlay.addEventListener('contextmenu', event => {
            if (event.target.closest('.star-layer-list, .star-editor-stage, .star-stage-scroll')) {
                event.preventDefault();
            }
        });
        this.contextPointerHandler=event=>{
            const menu=this.overlay?.querySelector('.star-context-menu');
            if(menu&&!menu.hidden&&!menu.contains(event.target))menu.hidden=true;
        };
        document.addEventListener('pointerdown',this.contextPointerHandler,true);
        this.overlay.querySelector('.star-context-menu')?.addEventListener('click', event => {
            const btn = event.target.closest('[data-ctx]');
            if (!btn) return;
            this.onContextAction(btn.dataset.ctx);
            const menu = this.overlay.querySelector('.star-context-menu');
            if (menu) menu.hidden = true;
        });
        this.stage.addEventListener('dragover', event => {
            if (![...event.dataTransfer.types].includes('application/x-stargaze-asset')) return;
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
            this.stage.classList.add('star-asset-dragover');
        });
        this.stage.addEventListener('dragleave', event => {
            if (!this.stage.contains(event.relatedTarget)) this.stage.classList.remove('star-asset-dragover');
        });
        this.stage.addEventListener('drop', event => {
            const assetId = event.dataTransfer.getData('application/x-stargaze-asset');
            this.stage.classList.remove('star-asset-dragover');
            if (!assetId) return;
            event.preventDefault();
            this.addImageAt(assetId, this.stagePoint(event));
            this.rememberAsset(assetId);
            this.notify('素材已放到画布');
        });

        this.stage.addEventListener('wheel', event => this.onWheel(event), { passive: false });

        this.scrollBox?.addEventListener('wheel', event => {
            if (!(event.ctrlKey || event.metaKey)) return;
            event.preventDefault();
            this.setViewZoom(this.viewZoom * (event.deltaY > 0 ? 0.9 : 1.1));
        }, { passive: false });

        this.keyupHandler = event => {
            if (event.code === 'Space') this.spaceDown = false;
        };
        document.addEventListener('keyup', this.keyupHandler, true);
        this.blurHandler = () => { this.spaceDown = false; };
        window.addEventListener('blur', this.blurHandler);

    }

    async onClick(event) {
        if (this.photos.handleClick(event)) return;
        const mobile = event.target.closest('[data-mobile-tab]');
        if (mobile) {
            this.setMobileTab(mobile.dataset.mobileTab);
            return;
        }
        const template = event.target.closest('[data-template]');
        if (template) {
            const name = template.querySelector('strong')?.textContent?.trim()
                || template.dataset.template;
            if (this.dirty || this.config.elements.length > 0) {
                if (!confirm(`套用内置模板「${name}」？\n当前画布会被覆盖（可 Ctrl+Z 撤销）。`)) return;
            }
            this.selectedId = null;
            this.selection = [];
            this.mutate(() => {
                this.applyTemplate(template.dataset.template);
            });
            return;
        }
        const canvas = event.target.closest('[data-canvas]');
        if (canvas) {
            this.applyCanvas(canvas.dataset.canvas);
            return;
        }

        const quick = event.target.closest('[data-avatar-quick]');
        if (quick) {
            const now = Date.now();
            if (this._avatarQuickAt && now - this._avatarQuickAt < 320) return;
            this._avatarQuickAt = now;
            this.onAvatarQuick(quick.dataset.avatarQuick, quick, event);
            return;
        }

        const groupCollapse = event.target.closest('[data-action="group-collapse"]');
        if (groupCollapse) {
            this.toggleGroupCollapsed(groupCollapse.dataset.groupId);
            return;
        }
        const groupToggle = event.target.closest('[data-action="group-toggle"]');
        if (groupToggle) {
            this.toggleGroupVisible(groupToggle.dataset.groupId);
            return;
        }
        if (event.target.closest('[data-action="group-rename"]') && event.detail >= 2) {
            this.renameGroup(event.target.closest('[data-action="group-rename"]').dataset.groupId);
            return;
        }
        const groupRow = event.target.closest('[data-group-row]');
        if (groupRow && !event.target.closest('button')) {
            const gid = groupRow.dataset.groupRow;
            const members = this.config.elements.filter(el => el.groupId === gid).map(el => el.id);
            if (event.shiftKey && this.selectionAnchor) {

                this.setSelection(members);
            } else if (event.ctrlKey || event.metaKey) {
                const allOn = members.every(id => this.selection.includes(id));
                let next = new Set(this.selection);
                if (allOn) members.forEach(id => next.delete(id));
                else members.forEach(id => next.add(id));
                this.setSelection([...next]);
            } else {
                this.setSelection(members);
                this.selectionAnchor = members[0] || null;
            }
            return;
        }
        const layerRow = event.target.closest('[data-layer-row]');
        if (layerRow && !event.target.closest('.star-layer-row button')) {
            this.selectFromLayerList(layerRow.dataset.layerRow, event);
            return;
        }
        const shapeButton = event.target.closest('[data-avatar-shape]');
        if (shapeButton) {
            const next = shapeButton.dataset.avatarShape;
            if (this.config.avatar?.shape === next) return;
            this.mutate(() => {

                this.config.avatar = tuneAvatarForShape(this.config.avatar, next);
            });
            this.notify('已换成' + (AVATAR_SHAPES.find(shape => shape.id === next)?.name || next) + '，取景已自动微调');
            return;
        }
        const rotateButton = event.target.closest('[data-avatar-rotate]');
        if (rotateButton) {
            const action = rotateButton.dataset.avatarRotate;
            const current = clampRotate(this.config.avatar?.rotate);
            const STEPS = { 'coarse-right': 90, 'coarse-left': -90, right: 90, left: -90, 'fine-right': 15, 'fine-left': -15 };
            const next = action === 'reset'
                ? 0
                : clampRotate(current + (STEPS[action] ?? 15) * (event.shiftKey ? 6 : 1));
            if (next === current) return;
            this.mutate(() => {
                this.config.avatar = { ...(this.config.avatar || {}), rotate: next };
            }, false);
            this.syncRotateControls(next);
            return;
        }
        const shapeRotateButton = event.target.closest('[data-avatar-shape-rotate]');
        if (shapeRotateButton) {
            const action = shapeRotateButton.dataset.avatarShapeRotate;
            if (action === 'follow') {
                if (shapeFollowsPhoto(this.config)) return;
                this.mutate(() => {
                    const next = { ...(this.config.avatar || {}) };
                    delete next.shapeRotate;
                    this.config.avatar = next;
                }, false);
                this.syncRotateControls();
                this.syncAvatarGuide();
                this.notify('形状已重新跟随照片，转照片时形状一起转');
                return;
            }
            const SHAPE_STEPS = { 'coarse-right': 90, 'coarse-left': -90, right: 90, left: -90, 'fine-right': 15, 'fine-left': -15 };
            const currentShape = shapeRotateOf(this.config);
            const nextShape = action === 'reset'
                ? 0
                : clampRotate(currentShape + (SHAPE_STEPS[action] ?? 15) * (event.shiftKey ? 6 : 1));
            if (nextShape === currentShape && !shapeFollowsPhoto(this.config)) return;
            this.mutate(() => {
                this.config.avatar = { ...(this.config.avatar || {}), shapeRotate: nextShape };
            }, false);
            this.syncRotateControls();
            return;
        }
        const framing = event.target.closest('[data-framing]');
        if (framing) {
            this.applyFraming(framing.dataset.framing);
            return;
        }
        const photoFraming = event.target.closest('[data-photo-framing]');
        if (photoFraming) {
            this.applyPhotoFraming(photoFraming.dataset.photoFraming);
            return;
        }
        const token = event.target.closest('[data-insert-token]');
        if (token) {
            this.insertCharacterToken(token.dataset.insertToken);
            return;
        }
        const anchorMode = event.target.closest('[data-anchor-mode]');
        if (anchorMode) {
            const next = anchorMode.dataset.anchorMode === 'chat' ? 'chat' : 'avatar';
            if (this.config.canvas.anchorMode === next) return;
            this.mutate(() => {
                this.config.canvas.anchorMode = next;
            });
            return;
        }
        const layerButton = event.target.closest('[data-layer]');
        if (layerButton) {
            const element = this.selectedElement();
            if (!element) {
                this.notify('先在画布上选中一个元素');
                return;
            }
            const next = layerButton.dataset.layer === 'front' ? 'front' : 'back';
            if (element.layer === next) return;
            this.mutate(() => { element.layer = next; });
            return;
        }
        const avatarFrame = event.target.closest('[data-avatar-frame]');
        if (avatarFrame) {
            const next = avatarFrame.dataset.avatarFrame;
            if ((this.config.avatar?.frameStyle || 'none') === next) return;
            this.mutate(() => {
                this.config.avatar = { ...(this.config.avatar || {}), frameStyle: next };
            });
            this.notify(next === 'none' ? '已移除中间头像的相框' : `已套用「${FRAME_STYLES.find(item => item.id === next)?.name || next}」相框`);
            return;
        }
        const frame = event.target.closest('[data-frame]');
        if (frame) {
            const element = this.selectedElement();
            if (!element || element.type !== 'image') {
                this.notify('先在画布上选中一张图片，再套相框');
                return;
            }
            this.mutate(() => { element.shape = frame.dataset.frame; }, false);
            return;
        }
        const tab = event.target.closest('[data-asset-tab]');
        if (tab) {
            this.assetTab = tab.dataset.assetTab;
            this.renderAssets();
            return;
        }
        const sticker = event.target.closest('[data-sticker]');
        if (sticker) {
            this.addSticker(sticker.dataset.sticker);
            return;
        }
        const assetAction = event.target.closest('[data-asset-action]');
        if (assetAction) {
            const id = assetAction.dataset.assetId;
            const action = assetAction.dataset.assetAction;
            if (action === 'place') {
                this.addImage(id);
                this.rememberAsset(id);

                this.renderAssets();
            }
            if (action === 'delete') await this.deleteAsset(id);
            if (action === 'promote') await this.promoteAsset(id);
            return;
        }
        const custom = event.target.closest('[data-custom-action]');
        if (custom) {
            if (custom.dataset.customAction === 'apply') await this.applyCustomTemplate(custom.dataset.templateId);
            if (custom.dataset.customAction === 'delete') await this.deleteCustomTemplate(custom.dataset.templateId);
            return;
        }
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const action = button.dataset.action;
        const actions = {
            save: () => this.save(),
            close: () => this.close(),
            undo: () => this.undo(),
            redo: () => this.redo(),
            'reset-theme': () => this.resetTheme(),
            duplicate: () => this.duplicateSelected(),
            delete: () => this.deleteSelected(),
            'merge-layers': () => this.mergeSelected(),
            'group-layers': () => this.groupSelected(),
            'ungroup-layers': () => this.ungroupSelected(),
            front: () => this.layerToEdge('top'),
            back: () => this.layerToEdge('bottom'),
            'layer-front': () => this.nudgeLayer(1),
            'layer-back': () => this.nudgeLayer(-1),
            'layer-top': () => this.layerToEdge('top'),
            'layer-bottom': () => this.layerToEdge('bottom'),
            'layer-unlock': () => this.unlockAll(),
            upload: () => this.openUpload(),
            export: () => this.exportConfig(),
            'export-image': () => this.exportImage(),
            'export-png': () => this.exportPng(),
            import: () => this.overlay.querySelector('.star-import-input').click(),
            'save-template': () => this.saveCustomTemplate(),
            'fit-width': () => this.fitCanvasWidth(),
            'toggle-avatar': () => this.toggleAvatarHidden(),
            'add-text': () => this.addText(),
            'add-tape': () => this.addDecoration('tape', button.dataset.tape),
            replace: () => this.openUpload(this.selectedId),
            'focus-reset': () => this.resetAvatarFocus(),
            'avatar-box-reset': () => this.resetAvatarBox(),
            'photo-focus-reset': () => this.resetPhotoFocus(),
            deselect: () => this.selectElement(null),
            'bind-template': () => this.bindCharacterTemplate(),
            'wheel-hint': () => this.notify('把指针放到画布的头像上，滚轮 / 双指上下滑 = 调取景远近'),
            random: () => this.randomize(Boolean(event.altKey)),
            'zoom-in': () => this.setViewZoom(this.viewZoom * 1.25),
            'zoom-out': () => this.setViewZoom(this.viewZoom / 1.25),
            'zoom-fit': () => this.setViewZoom(1),
            'align-left': () => this.alignSelection('left'),
            'align-hcenter': () => this.alignSelection('hcenter'),
            'align-right': () => this.alignSelection('right'),
            'align-top': () => this.alignSelection('top'),
            'align-vcenter': () => this.alignSelection('vcenter'),
            'align-bottom': () => this.alignSelection('bottom'),
            'distribute-x': () => this.distributeSelection('x'),
            'distribute-y': () => this.distributeSelection('y'),
            'select-all': () => this.selectAll(),
            'layer-toggle': () => this.toggleLayerVisible(button.dataset.layerId),
            'layer-lock': () => this.toggleLayerLock(button.dataset.layerId),
        };
        await actions[action]?.();
    }

    setMobileTab(tab) {
        this.mobileTab = tab;
        this.overlay.dataset.starMobileTab = tab;
        const left = this.overlay.querySelector('.star-editor-left');
        const right = this.overlay.querySelector('.star-editor-right');
        const showRight = tab === 'avatar' || (tab === 'text' && Boolean(this.selectedElement()));
        left?.classList.toggle('star-mobile-active', !showRight);
        right?.classList.toggle('star-mobile-active', showRight);
        this.overlay.querySelectorAll('[data-mobile-tab]').forEach(button => {
            button.classList.toggle('active', button.dataset.mobileTab === tab);
        });
        this.fitStage();
    }

    resetAvatarFocus() {
        const x = clampFocus(this.config.avatar?.focusX);
        const y = clampFocus(this.config.avatar?.focusY);
        if (x === AVATAR_FOCUS.default && y === AVATAR_FOCUS.default) {
            this.notify('图片已经在正中了');
            return;
        }
        this.mutate(() => {
            this.config.avatar = {
                ...(this.config.avatar || {}),
                focusX: AVATAR_FOCUS.default,
                focusY: AVATAR_FOCUS.default,
            };
        });
    }

    resetAvatarBox() {
        const width = clampAvatarBox(this.config.avatar?.widthRatio);
        const height = clampAvatarBox(this.config.avatar?.heightRatio);
        if (width === 1 && height === 1) {
            this.notify('头像已经是 1:1 了');
            return;
        }
        this.mutate(() => {
            this.config.avatar = { ...(this.config.avatar || {}), widthRatio: 1, heightRatio: 1 };
        });
    }

    showAvatarBar(autoHide = 2200) {
        const bar = this.stage?.querySelector('.star-avatar-bar');
        if (!bar) return;
        bar.classList.add('is-visible');
        clearTimeout(this._avatarBarTimer);
        if (autoHide > 0) {
            this._avatarBarTimer = setTimeout(() => bar.classList.remove('is-visible'), autoHide);
        }
    }

    hideAvatarBar(delay = 500) {
        clearTimeout(this._avatarBarTimer);
        this._avatarBarTimer = setTimeout(() => {
            this.stage?.querySelector('.star-avatar-bar')?.classList.remove('is-visible');
        }, delay);
    }

    buildAvatarBar() {
        const bar = document.createElement('div');
        bar.className = 'star-avatar-bar';
        const shape = this.config.avatar?.shape || 'circle';
        const zoom = Math.round((this.config.avatar?.zoom || 1) * 100);
        const avatarRotate = clampRotate(this.config.avatar?.rotate);
        const hidden = avatarIsHidden(this.config);
        bar.innerHTML = `
            ${AVATAR_SHAPES.map(item => `<button type="button" class="star-avatar-bar-shape ${shape === item.id ? 'active' : ''}" data-avatar-quick="shape-set" data-shape-id="${item.id}" title="${item.name}"><i style="${shapeSampleStyle(item.id)}"></i><span>${item.name}</span></button>`).join('')}
            <i class="star-avatar-bar-sep"></i>
            ${FRAMING_PRESETS.map(preset => `<button type="button" class="star-avatar-bar-preset ${this.isFramingActive(preset) ? 'active' : ''}" data-avatar-quick="framing" data-framing-id="${preset.id}" title="${preset.hint}">${preset.name}</button>`).join('')}
            <i class="star-avatar-bar-sep"></i>
            <button type="button" data-avatar-quick="zoom-out" title="头像小一点">−</button>
            <b class="star-avatar-bar-zoom">${zoom}%</b>
            <button type="button" data-avatar-quick="zoom-in" title="头像大一点">＋</button>
            <i class="star-avatar-bar-sep"></i>
            <button type="button" data-avatar-quick="rotate-left" title="整体向左转 15°：照片和形状一起转（按住 Shift 转 90°）">⟲</button>
            <b class="star-avatar-bar-rotate" title="照片角度；形状单独固定时会显示「照片°·框°」">${Math.round(avatarRotate)}°</b>
            <button type="button" data-avatar-quick="rotate-right" title="整体向右转 15°：照片和形状一起转（按住 Shift 转 90°）">⟳</button>
            <i class="star-avatar-bar-sep"></i>
            <button type="button" data-avatar-quick="center" title="头像回到画面正中，图片也回到正中">居中</button>
            <button type="button" class="star-avatar-bar-hide ${hidden ? 'active' : ''}" data-avatar-quick="hide" title="隐藏 / 显示中间头像">${hidden ? '显示' : '隐藏'}</button>`;
        this.positionAvatarBar(bar);
        return bar;
    }

    positionAvatarBar(bar = this.stage?.querySelector('.star-avatar-bar')) {
        if (!bar || !this.config) return;
        const { height, anchorX, anchorY } = this.config.canvas;
        const half = avatarVisualSize(this.config).height / Math.max(1, height) * 50;
        const flip = anchorY * 100 + half > 74;
        bar.style.left = `${anchorX * 100}%`;
        bar.style.top = `${anchorY * 100 + (flip ? -half : half)}%`;
        bar.dataset.flip = flip ? '1' : '0';
    }

    onAvatarQuick(action, node, event) {
        this.showAvatarBar();
        if (action === 'shape-set') {
            const next = node.dataset.shapeId;
            if (!next || this.config.avatar?.shape === next) return;
            this.mutate(() => {
                this.config.avatar = tuneAvatarForShape(this.config.avatar, next);
            });
            this.notify(`已换成「${AVATAR_SHAPES.find(shape => shape.id === next)?.name || next}」`);
            return;
        }
        if (action === 'shape') {
            const list = AVATAR_SHAPES.map(shape => shape.id);
            const current = this.config.avatar?.shape || 'circle';
            const next = list[(list.indexOf(current) + 1) % list.length];
            this.mutate(() => {
                this.config.avatar = tuneAvatarForShape(this.config.avatar, next);
            });
            this.notify(`已换成「${AVATAR_SHAPES.find(shape => shape.id === next)?.name || next}」，取景已自动微调`);
            return;
        }
        if (action === 'framing') {
            this.applyFraming(node.dataset.framingId);
            return;
        }
        if (action === 'zoom-in' || action === 'zoom-out') {
            const current = Number(this.config.avatar?.zoom) || 1;
            const next = clamp(current + (action === 'zoom-in' ? 0.1 : -0.1), AVATAR_ZOOM.min, AVATAR_ZOOM.max);
            this.mutate(() => {
                this.config.avatar = { ...(this.config.avatar || {}), zoom: Math.round(next * 100) / 100 };
            }, false);
            return;
        }
        if (action === 'rotate-left' || action === 'rotate-right') {
            const coarse = event?.shiftKey === true;
            const step = (coarse ? AVATAR_ROTATE.step : AVATAR_ROTATE.fine) * (action === 'rotate-right' ? 1 : -1);
            this.mutate(() => {
                this.rotateAvatarBy(step);
            }, false);
            this.syncRotateControls();
            this.showAvatarBar();
            return;
        }
        if (action === 'center') {
            this.mutate(() => {
                this.config.canvas.anchorX = 0.5;
                this.config.canvas.anchorY = 0.5;
                this.config.avatar = {
                    ...(this.config.avatar || {}),
                    focusX: AVATAR_FOCUS.default,
                    focusY: AVATAR_FOCUS.default,
                };
            });
            this.notify('头像已回到画面正中');
            return;
        }
        if (action === 'hide') this.toggleAvatarHidden();
    }

    applyFraming(id) {
        const preset = FRAMING_PRESETS.find(item => item.id === id);
        if (!preset) return;
        this.mutate(() => {
            this.config.avatar = {
                ...(this.config.avatar || {}),
                frame: clampFrame(preset.frame),
                focusX: clampFocus(preset.focusX),
                focusY: clampFocus(preset.focusY),
            };
        });
        this.notify(`取景已切到「${preset.name}」`);
    }

    insertCharacterToken(key) {
        const labels = { birthday: '生日', title: '称号', name: '名字' };
        const token = `{{${key}|}}`;
        const selected = this.selectedElement();
        if (selected && (selected.type === 'text' || selected.type === 'sticker')) {
            this.mutate(() => {
                selected.text = `${selected.text}${token}`;
            }, false);
            this.notify(`已插入${labels[key] || key}字段`);
            return;
        }
        const { scale, cx, cy } = this.spawnPoint();
        const id = uid('el');
        this.mutate(() => {
            this.config.elements.push({
                id, type: 'text', text: token, x: cx - 60 * scale, y: cy + 52 * scale,
                width: 120 * scale, height: 20 * scale,
                rotation: 0, z: this.nextZ(), opacity: 1, fontSize: 11 * scale,
                fontFamily: FONT_OPTIONS[1].value, color: this.config.theme.ink,
                align: 'center', stroke: 0, shadow: false, layer: 'back',
            });
            this.selectedId = id;
            this.selection = [id];
        });
        this.notify(`已插入${labels[key] || key}字段，角色卡填了就会自动显示`);
    }

    async bindCharacterTemplate() {
        const template = TEMPLATE_LIST.find(item => item.id === this.config.templateId);
        const current = await this.store.getBoundTemplate(this.key);
        const next = current === this.config.templateId ? '' : this.config.templateId;
        await this.store.bindCharacterTemplate(this.key, next);
        this.boundTemplate = next;
        this.renderInspector();
        this.notify(next
            ? `已绑定「${template?.name || next}」：这个角色以后默认用它（已经单独调过的不会被覆盖）`
            : '已取消角色绑定');
    }

    loadRecentAssets() {
        try {
            const raw = globalThis.localStorage?.getItem('stargaze:recent-assets');
            const list = JSON.parse(raw || '[]');
            return Array.isArray(list) ? list.filter(id => typeof id === 'string').slice(0, 12) : [];
        } catch {
            return [];
        }
    }

    rememberAsset(id) {
        if (!id) return;
        this.recentAssets = [id, ...this.recentAssets.filter(item => item !== id)].slice(0, 12);
        try {
            globalThis.localStorage?.setItem('stargaze:recent-assets', JSON.stringify(this.recentAssets));
        } catch {

        }
    }

    currentSizeKey() {
        if (!this.config) return '';
        const key = this.config.sizeKey;
        return LAYOUTS[key] ? key : (LAYOUTS[this.config.layout] ? this.config.layout : CUSTOM_LAYOUT_ID);
    }

    // 尺寸草稿：切换比例时保存各自设计，提交后不原地改写历史中的稿件。
    commitSizeDraft() {
        if (!this.config) return;
        const key = this.currentSizeKey();
        if (!key) return;
        this.config.sizeKey = key;
        if (!this.config.sizes || typeof this.config.sizes !== 'object') this.config.sizes = {};
        this.config.sizes = { ...this.config.sizes, [key]: clone(captureSizeState(this.config)) };
    }

    sizeStateFor(presetId) {
        const saved = this.config.sizes?.[presetId];
        if (saved) return clone(saved);
        const fresh = presetId === CUSTOM_LAYOUT_ID
            ? { ...clone(captureSizeState(this.config)), layout: CUSTOM_LAYOUT_ID }
            : clone(freshSizeState(this.config, presetId));
        if (!this.config.sizes || typeof this.config.sizes !== 'object') this.config.sizes = {};
        this.config.sizes = { ...this.config.sizes, [presetId]: clone(fresh) };
        return fresh;
    }

    applyCanvas(presetId) {
        if (!LAYOUTS[presetId]) return;
        const key = this.currentSizeKey();
        const already = key === presetId;
        if (already) {
            this.notify(`已经在「${LAYOUTS[presetId]?.name || presetId}」这一档`);
            if (presetId === CUSTOM_LAYOUT_ID) {
                const input = this.overlay.querySelector('[data-bar-field="width"]');
                input?.focus();
                input?.select();
            }
            return;
        }
        this.pushHistory();
        this.commitSizeDraft();
        const state = this.sizeStateFor(presetId);
        this.config = applySizeState(this.config, state);
        this.config.sizeKey = presetId;
        this.config.layout = LAYOUTS[state.layout] ? state.layout : presetId;
        this.selectedId = null;
        this.selection = [];
        this.fitStage();
        this.renderAll();
        this.markDirty();
        if (presetId !== CUSTOM_LAYOUT_ID) {
            this.notify(`已切换到「${LAYOUTS[presetId]?.name || presetId}」，这个尺寸有自己独立的一份稿`);
        } else {
            const input = this.overlay.querySelector('[data-bar-field="width"]');
            input?.focus();
            input?.select();
        }
    }

    stretchBleedElements(oldWidth, oldHeight, newWidth) {
        if (newWidth <= oldWidth) return;
        for (const element of this.config.elements) {
            const bleed = element.x <= oldWidth * 0.03
                && element.y <= oldHeight * 0.03
                && element.height >= oldHeight * 0.9
                && element.width >= oldWidth * 0.4;
            if (bleed) {
                element.x = 0;
                element.width = newWidth;
            }
        }
    }

    onCanvasSizeChange(field, rawValue) {
        if (!this.config) return;
        const canvas = this.config.canvas;
        const isWidth = field === 'width';
        const minimum = isWidth ? CANVAS_LIMITS.minWidth : CANVAS_LIMITS.minHeight;
        const maximum = isWidth ? CANVAS_LIMITS.maxWidth : CANVAS_LIMITS.maxHeight;
        const next = Math.round(clamp(Number(rawValue) || minimum, minimum, maximum));
        if (canvas[field] === next) return;
        const oldWidth = canvas.width;
        const oldHeight = canvas.height;
        if (isWidth) {
            const factor = next / Math.max(1, canvas.width);
            canvas.avatarScale = clamp(canvas.avatarScale * factor, 1.4, 80);
        }
        canvas[field] = next;
        if (isWidth) this.stretchBleedElements(oldWidth, oldHeight, next);

        this.config.avatar = {
            ...(this.config.avatar || {}),
            zoom: clampAvatarZoom(canvas, Number(this.config.avatar?.zoom) || 1),
        };
        this.config.layout = matchPresetId(canvas.width, canvas.height) || CUSTOM_LAYOUT_ID;
        this.fitStage();
        this.renderStage();
        this.syncCanvasControls();
        this.markDirty();
    }

    fitCanvasWidth() {
        if (!this.config) return;
        const chat = document.querySelector('#chat');
        const avatarImage = document.querySelector('#chat .mes .avatar img');
        const chatWidth = chat?.clientWidth || 720;
        const avatarSize = avatarImage?.offsetWidth || 46;
        const globalScale = Number(this.global?.collageScale) || 1;
        const target = Math.max(180, chatWidth - 10);
        const oldWidth = Number(this.config.canvas.width) || 420;
        const oldHeight = Number(this.config.canvas.height) || 285;
        const oldScale = Number(this.config.canvas.avatarScale) || 10;
        const natural = avatarSize * oldScale * globalScale;
        const mounted = document.querySelector('#chat .stargaze-avatar-collage');
        const rendered = mounted?.getBoundingClientRect().width || 0;
        const current = rendered > 1 ? rendered : Math.min(natural, chatWidth - 8);
        const maxFactor = Math.min(
            CANVAS_LIMITS.maxWidth / Math.max(1, oldWidth),
            80 / Math.max(0.01, oldScale),
        );
        const factor = Math.min(target / Math.max(1, current), maxFactor);
        if (Math.abs(factor - 1) < 0.02) {
            this.notify('画布已经是聊天区满宽了');
            return;
        }
        this.mutate(() => {
            this.config.canvas.avatarScale = oldScale * factor;
            this.config.canvas.width = Math.round(clamp(oldWidth * factor, CANVAS_LIMITS.minWidth, CANVAS_LIMITS.maxWidth));

            this.stretchBleedElements(oldWidth, oldHeight, this.config.canvas.width);
            this.config.layout = matchPresetId(this.config.canvas.width, this.config.canvas.height) || CUSTOM_LAYOUT_ID;
        });
        this.notify(`画布已拉宽到 ${this.config.canvas.width} 单位 · 素材与头像保持原样`);
    }

    toggleAvatarHidden() {
        const next = !avatarIsHidden(this.config);
        const main = mainPortrait(this.config);
        this.mutate(() => {
            this.config.avatar = {
                ...(this.config.avatar || {}),
                hidden: next,
                hiddenId: next ? (main?.id || '') : '',
            };
            if (!next && main) {
                main.hidden = false;
                const group = this.config.groups?.find(g => g.id === main.groupId);
                if (group) group.hidden = false;
            }
        });
        this.notify(next
            ? '中间头像已完全隐藏（含工具条），排版占位仍保留'
            : '中间头像已恢复显示');
    }

    fitStage() {
        if (!this.stage || !this.config) return;
        const box = this.overlay?.querySelector('.star-stage-scroll');
        if (!box) return;
        const style = getComputedStyle(box);
        const padX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        const padY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        const availableWidth = Math.max(120, box.clientWidth - padX);
        const availableHeight = Math.max(90, box.clientHeight - padY);
        const ratio = this.config.canvas.width / this.config.canvas.height;
        let width = Math.min(availableWidth, availableHeight * ratio, 900);
        let height = width / ratio;
        if (height > availableHeight) {
            height = availableHeight;
            width = height * ratio;
        }
        this.baseStageSize = { width: Math.max(120, width), height: Math.max(90, height) };
        this.applyStageSize();
    }

    applyStageSize() {
        if (!this.stage || !this.baseStageSize) return;
        const zoom = this.viewZoom;
        this.stage.style.width = `${Math.round(this.baseStageSize.width * zoom)}px`;
        this.stage.style.height = `${Math.round(this.baseStageSize.height * zoom)}px`;
        const label = this.overlay?.querySelector('[data-zoom-label]');
        if (label) label.textContent = `${Math.round(zoom * 100)}%`;
    }

    setViewZoom(next) {
        const zoom = clamp(Number(next) || 1, 0.25, 4);
        if (Math.abs(zoom - this.viewZoom) < 0.001) return;
        this.viewZoom = zoom;
        this.applyStageSize();
    }

    renderAll(previous=null) {
        this.overlay.querySelector('.star-editor-character').textContent=this.character.name+(this.config.studioSchemeName?' · '+this.config.studioSchemeName:'');
        this.fitStage();
        if(!patchEditorStage(this,previous))this.renderStage();
        this.renderInspector();
        this.photos.render();
        this.syncCanvasControls();
        this.overlay.querySelectorAll('[data-template]').forEach(button => {
            button.classList.toggle('active', button.dataset.template === this.config.templateId);
        });
    }

    scheduleLiveTransform() {
        if (this._liveRaf) return;
        this._liveRaf = requestAnimationFrame(() => {
            this._liveRaf = 0;
            this.applyLiveElementStyles();
        });
    }

    rebuildNodeCache() {
        this._nodeCache = new Map();
        if (!this.stage) return;
        this.stage.querySelectorAll('.stargaze-element[data-element-id]').forEach(node => {
            this._nodeCache.set(node.dataset.elementId, node);
        });
        this._guideNode = this.stage.querySelector('.star-editor-avatar-guide');
    }

    applyLiveElementStyles() {
        if (!this.stage || !this.config) return;
        if (!this._nodeCache) this.rebuildNodeCache();
        const { width: W, height: H } = this.config.canvas;
        const ids = this.gesture?.startGroup
            ? this.gesture.startGroup.map(g => g.id)
            : (this.selection.length ? this.selection : null);
        const list = ids
            ? ids.map(id => this.config.elements.find(e => e.id === id)).filter(Boolean)
            : this.config.elements;
        for (const element of list) {
            if (isElementHidden(this.config, element)) continue;
            const node = this._nodeCache.get(element.id);
            if (!node) continue;
            node.style.left = `${element.x / W * 100}%`;
            node.style.top = `${element.y / H * 100}%`;
            node.style.width = `${element.width / W * 100}%`;
            node.style.height = `${element.height / H * 100}%`;
            node.style.transform = `rotate(${Number(element.rotation) || 0}deg)`;
            if (element.opacity != null) node.style.opacity = String(element.opacity);

            if (element.type === 'image') this.applyImageChrome(node, element);
            if (element.type === 'text' || element.type === 'sticker') {
                node.style.fontSize = `${textSize(element, resolveText(element.text, characterFields(this.character), this.config.nickname)) / W * 100}cqw`;
                node.style.color = element.color || this.config.theme.ink;
                node.style.fontFamily = element.fontFamily;
                node.style.textAlign = element.align || 'left';
                node.style.webkitTextStroke = element.stroke ? `${element.stroke / W * 100}cqw ${this.config.theme.paper}` : '0 transparent';
                node.style.textShadow = element.shadow ? `0 ${1 / W * 100}cqw ${2 / W * 100}cqw ${this.config.theme.accent}` : 'none';
                node.textContent = resolveText(element.text, characterFields(this.character), this.config.nickname);
            }
        }
        this.stage.querySelectorAll('.star-snap-guide').forEach(node => node.remove());
        this.renderSnapGuides();
        const guide = this._guideNode || this.stage.querySelector('.star-editor-avatar-guide');
        if (guide) {
            guide.style.left = `${this.config.canvas.anchorX * 100}%`;
            guide.style.top = `${this.config.canvas.anchorY * 100}%`;
            const controls = this.stage.querySelector('.star-avatar-control-layer');
            if (controls) controls.style.cssText = guide.style.cssText;
        }
    }

    applyImageChrome(node, element) {
        const frame = node.querySelector?.('.stargaze-image-frame') || node;
        const stroke = Number(element.stroke) || 0;
        const shadow = Boolean(element.shadow);
        if (stroke > 0) {
            frame.style.boxShadow = `0 0 0 ${stroke}px ${element.strokeColor || '#ffffff'}${shadow ? ', 0 4px 14px rgba(0,0,0,0.22)' : ''}`;
        } else if (shadow) {
            frame.style.boxShadow = '0 4px 14px rgba(0,0,0,0.22)';
        } else {
            frame.style.boxShadow = '';
        }
        if (element.shadowSoft) {
            frame.style.filter = `drop-shadow(0 ${element.shadowSoft}px ${element.shadowSoft * 1.4}px rgba(0,0,0,0.28))`;
        } else {
            frame.style.filter = '';
        }
    }

    // 画布预览：主头像由独立导轨绘制，标记层只用于识别和排序。
    renderStage() {
        if (!this.stage) return;

        if (this.marquee) {
            this.marquee.box?.remove();
            this.marquee = null;
            this.overlay?.classList.remove('star-is-marquee');
        }
        this.stage.dataset.layout = this.config.layout;
        for (const [key, value] of Object.entries(this.config.theme)) {
            const cssName = { paper: '--star-paper', accent: '--star-accent', ink: '--star-ink', soft: '--star-soft', secondary: '--star-secondary' }[key];
            if (cssName) this.stage.style.setProperty(cssName, value);
        }
        this.stage.replaceChildren();
        const elements = [...this.config.elements].sort((a, b) => a.z - b.z);

        const main=mainPortrait(this.config);
        for(const element of elements){
            if(element.id===main?.id||isElementHidden(this.config,element))continue;
            const node=editorElement(this,element);if(node)this.stage.append(node);
        }
        this._stageSelection=JSON.stringify(this.selection);

        const { width, height, anchorX, anchorY } = this.config.canvas;
        const size = avatarVisualSize(this.config);
        const avatarHidden = avatarIsHidden(this.config);
        const frameStyle = this.config.avatar?.frameStyle || 'none';
        const guide = document.createElement('div');
        guide.className = 'star-editor-avatar-guide';
        guide.dataset.starAvatarShape = frameStyle === 'none' ? (this.config.avatar?.shape || 'circle') : 'rect';
        guide.dataset.starAvatarFrame = frameStyle;
        guide.style.width = `${size.width / width * 100}%`;
        guide.style.height = `${size.height / height * 100}%`;
        guide.style.left = `${anchorX * 100}%`;
        guide.style.top = `${anchorY * 100}%`;
        guide.style.transform = 'translate(-50%, -50%)';
        const guideImage = document.createElement('img');
        guideImage.src = this.avatarUrl;
        if(this.config.avatar.photoTone)guideImage.style.filter=toneFilter(this.config.avatar.photoTone);
        guideImage.alt = '原生头像预览';
        guideImage.style.objectFit = 'cover';
        guideImage.style.objectPosition = `${clampFocus(this.config.avatar?.focusX)}% ${clampFocus(this.config.avatar?.focusY)}%`;
        guideImage.style.setProperty('object-view-box', avatarViewBox(this.config));
        const media = document.createElement('div');
        if (frameStyle === 'none') {
            media.className = 'star-avatar-media';
            avatarShapeVars(media, this.config.avatar?.shape);
            media.append(guideImage);
        } else {
            media.className = 'star-avatar-frame';
            avatarFrameVars(media, frameStyle);
            const inner = document.createElement('div');
            inner.className = 'stargaze-image-frame';
            inner.append(guideImage);
            media.append(inner);
        }
        avatarImageStyle(guideImage, this.config);
        avatarShapeStyle(media, this.config);
        const guideLabel = document.createElement('span');
        guideLabel.textContent = avatarHidden
            ? '原生头像已隐藏 · 仍可拖动'
            : `原生头像 · ${Math.round((this.config.avatar?.zoom || 1) * 100)}%`;
        const moveHandle = document.createElement('button');
        moveHandle.type = 'button';
        moveHandle.className = 'star-avatar-handle star-avatar-handle-move';
        moveHandle.dataset.avatarHandle = 'move';
        moveHandle.title = '拖动挪头像位置（按住头像本身也能拖）';
        moveHandle.setAttribute('aria-label', '拖动挪头像位置');
        moveHandle.textContent = '✥';
        const widthHandle = document.createElement('button');
        widthHandle.type = 'button';
        widthHandle.className = 'star-avatar-handle star-avatar-handle-width';
        widthHandle.dataset.avatarHandle = 'width';
        widthHandle.title = '左右拖：只改头像宽度';
        widthHandle.setAttribute('aria-label', '调整头像宽度');
        widthHandle.textContent = '↔';
        const heightHandle = document.createElement('button');
        heightHandle.type = 'button';
        heightHandle.className = 'star-avatar-handle star-avatar-handle-height';
        heightHandle.dataset.avatarHandle = 'height';
        heightHandle.title = '上下拖：只改头像高度';
        heightHandle.setAttribute('aria-label', '调整头像高度');
        heightHandle.textContent = '↕';
        const zoomHandle = document.createElement('button');
        zoomHandle.type = 'button';
        zoomHandle.className = 'star-avatar-handle star-avatar-handle-zoom';
        zoomHandle.dataset.avatarHandle = 'zoom';
        zoomHandle.title = '等比缩放头像';
        zoomHandle.setAttribute('aria-label', '等比缩放头像');
        zoomHandle.textContent = '⤢';
        const focusHandle = document.createElement('button');
        focusHandle.type = 'button';
        focusHandle.className = 'star-avatar-handle star-avatar-handle-focus';
        focusHandle.dataset.avatarHandle = 'focus';
        focusHandle.title = '拖动挪图片露出位置（脸被形状切掉时用它）';
        focusHandle.setAttribute('aria-label', '拖动挪图片露出位置');
        focusHandle.textContent = '◎';
        const rotateHandle = document.createElement('button');
        rotateHandle.type = 'button';
        rotateHandle.className = 'star-avatar-handle star-avatar-handle-rotate';
        rotateHandle.dataset.avatarHandle = 'rotate';
        rotateHandle.title = '拖动绕中心旋转（任意角度，按住 Shift 吸附 15°）';
        rotateHandle.setAttribute('aria-label', '拖动旋转头像');
        rotateHandle.textContent = '⟳';
        if (!avatarHidden) {
            guide.append(media);
            const controls = document.createElement('div');
            controls.className = 'star-avatar-control-layer';
            controls.style.cssText = guide.style.cssText;
            controls.append(guideLabel, moveHandle, widthHandle, heightHandle, zoomHandle, focusHandle, rotateHandle);
            this.stage.append(guide, controls);
            this.stage.append(this.buildAvatarBar());
            this.stage.querySelector('.star-avatar-bar')?.classList.remove('is-visible');
        }
        this.overlay.querySelectorAll('[data-action="undo"]').forEach(button => { button.disabled = !this.history.length; });
        this.overlay.querySelectorAll('[data-action="redo"]').forEach(button => { button.disabled = !this.future.length; });
        this.rebuildNodeCache();
        if (!this._skipLayerList) this.renderLayerList();
        this._skipLayerList = false;
    }

    renderLayerList() {
        const box = this.overlay?.querySelector('.star-layer-list');
        if (!box || !this.config) return;
        const savedScroll = box.scrollTop;
        const count = this.overlay.querySelector('.star-layer-count');
        if (count) count.textContent = String(this.config.elements.length);
        if (!this.config.elements.length) {
            box.innerHTML = '<small class="star-layer-empty">画布上还没有元素</small>';
            return;
        }
        if (!Array.isArray(this.config.groups)) this.config.groups = [];
        const q = (this.layerQuery || '').trim().toLowerCase();
        const matchQuery = (element, label = '') => {
            if (!q) return true;
            const name = `${label} ${element.text || ''} ${element.type || ''} ${element.assetId || ''}`.toLowerCase();
            return name.includes(q);
        };
        const main = mainPortrait(this.config);
        const byZ = list => [...list].sort((a, b) => (Number(b.z) || 0) - (Number(a.z) || 0));
        const groups = this.config.groups;

        const elementRow = (element, { indent = false } = {}) => {
            const active = this.selection.includes(element.id);
            const isMain = main && element.id === main.id;
            const asset = element.type === 'image' && !isMain ? this.describeAsset(element.assetId) : null;
            let name = isMain
                ? '角色主头像'
                : element.type === 'image'
                    ? (element.label || asset?.name || '图片')
                    : (element.label || element.text || this.elementTypeName(element.type));
            const thumb = element.type === 'image'
                ? `<img src="${escapeHtml(isMain ? this.avatarUrl : (asset?.url || this.avatarUrl))}" alt="" draggable="false" loading="lazy" decoding="async" />`
                : `<b>${element.type === 'sticker' ? '✦' : 'T'}</b>`;
            return `<div class="star-layer-row ${active ? 'active' : ''} ${element.hidden ? 'is-hidden' : ''} ${isMain ? 'is-main' : ''} ${indent ? 'is-child' : ''}"
                draggable="${element.locked ? 'false' : 'true'}" data-layer-row="${element.id}" data-layer-side="${element.layer === 'front' ? 'front' : 'back'}"
                style="content-visibility:auto;contain-intrinsic-size:auto 32px"
                title="${escapeHtml(String(name))}${isMain ? '（原生头像）' : ''}">
                <i class="star-layer-grip" aria-hidden="true">⋮⋮</i>
                <i class="star-layer-thumb">${thumb}</i>
                <span class="star-layer-name">${escapeHtml(String(name).slice(0, 18))}</span>
                <button type="button" class="star-layer-eye" data-action="layer-toggle" data-layer-id="${element.id}" title="${element.hidden ? '显示' : '隐藏'}">${element.hidden ? '◌' : '●'}</button>
                <button type="button" class="star-layer-lock ${element.locked ? 'active' : ''}" data-action="layer-lock" data-layer-id="${element.id}" title="${element.locked ? '解锁' : '锁定'}">${element.locked ? '🔒' : '🔓'}</button>
            </div>`;
        };

        const folderRow = (group, children) => {
            const childIds = children.map(c => c.id);
            const active = childIds.length && childIds.every(id => this.selection.includes(id));
            const collapsed = group.collapsed === true;
            const kids = collapsed ? '' : children.map(el => elementRow(el, { indent: true })).join('');
            return `<div class="star-layer-folder ${active ? 'active' : ''} ${group.hidden ? 'is-hidden' : ''} ${collapsed ? 'is-collapsed' : ''}" data-group-id="${group.id}">
                <div class="star-layer-row star-layer-folder-row ${active ? 'active' : ''}" data-group-row="${group.id}">
                    <button type="button" class="star-layer-caret" data-action="group-collapse" data-group-id="${group.id}" title="展开/折叠">${collapsed ? '▸' : '▾'}</button>
                    <i class="star-layer-thumb star-layer-folder-icon" aria-hidden="true">📁</i>
                    <span class="star-layer-name" data-action="group-rename" data-group-id="${group.id}" title="双击改名">${escapeHtml(group.name || '分组')}</span>
                    <small class="star-layer-folder-count">${children.length}</small>
                    <button type="button" class="star-layer-eye" data-action="group-toggle" data-group-id="${group.id}" title="${group.hidden ? '显示整组' : '隐藏整组'}">${group.hidden ? '◌' : '●'}</button>
                </div>
                <div class="star-layer-folder-children">${kids}</div>
            </div>`;
        };

        const buildSide = (side) => {
            const sideElements = this.config.elements.filter(el => (el.layer === 'front') === (side === 'front'));
            const sideGroups = byZ(groups.filter(g => (g.layer === 'front') === (side === 'front')));
            const groupedIds = new Set(sideElements.filter(el => el.groupId).map(el => el.id));
            const chunks = [];

            for (const group of sideGroups) {
                let children = byZ(sideElements.filter(el => el.groupId === group.id));
                if (q) {
                    const gName = String(group.name || '').toLowerCase();
                    if (!gName.includes(q)) {
                        children = children.filter(el => matchQuery(el, this.layerName(el)));
                    }
                }
                if (!children.length) continue;
                chunks.push({ z: Number(group.z) || 0, html: folderRow(group, children) });
            }

            for (const el of byZ(sideElements.filter(el => !el.groupId))) {
                if (q && !matchQuery(el, this.layerName(el))) continue;
                chunks.push({ z: Number(el.z) || 0, html: elementRow(el) });
            }
            chunks.sort((a, b) => b.z - a.z);
            return chunks.map(c => c.html).join('');
        };

        const frontHtml = buildSide('front');
        const backHtml = buildSide('back');
        const section = (title, html) => html
            ? `<div class="star-layer-group">${title}<small></small></div>${html}`
            : '';
        box.innerHTML = section('上层 · 压住头像', frontHtml) + section('下层 · 头像之下', backHtml);
        box.scrollTop = savedScroll;
    }

    reorderLayer(draggedId, targetId, place = 'before') {
        if (!draggedId || !targetId || draggedId === targetId) return;
        const dragged = this.config.elements.find(item => item.id === draggedId);
        const target = this.config.elements.find(item => item.id === targetId);
        if (!dragged || !target || dragged.locked) return;

        this.mutate(() => {

            dragged.layer = target.layer === 'front' ? 'front' : 'back';
            if (target.groupId) dragged.groupId = target.groupId;
            else delete dragged.groupId;

            const side = dragged.layer === 'front' ? 'front' : 'back';

            const sameBucket = item => (
                (item.layer === 'front' ? 'front' : 'back') === side
                && (item.groupId || null) === (dragged.groupId || null)
            );
            const ordered = this.config.elements
                .filter(sameBucket)
                .sort((a, b) => (Number(b.z) || 0) - (Number(a.z) || 0));

            const from = ordered.findIndex(item => item.id === draggedId);
            if (from >= 0) ordered.splice(from, 1);
            let to = ordered.findIndex(item => item.id === targetId);
            if (to < 0) to = ordered.length;
            if (place === 'after') to += 1;
            ordered.splice(to, 0, dragged);

            ordered.forEach((item, index) => {
                item.z = 10000 - index * 10;
            });
        }, false);
        this.notify(`已移动「${this.layerName(dragged)}」（插入排序）`);
    }

    moveLayerIntoGroup(draggedId, groupId, place = 'before') {
        const dragged = this.config.elements.find(item => item.id === draggedId);
        const group = (this.config.groups || []).find(item => item.id === groupId);
        if (!dragged || !group || dragged.locked) return;
        const children = this.config.elements
            .filter(item => item.groupId === groupId)
            .sort((a, b) => (Number(b.z) || 0) - (Number(a.z) || 0));
        const anchor = place === 'after' ? children[children.length - 1] : children[0];
        this.mutate(() => {
            dragged.groupId = groupId;
            dragged.layer = group.layer === 'front' ? 'front' : 'back';
        }, false);
        if (anchor) this.reorderLayer(draggedId, anchor.id, place === 'after' ? 'after' : 'before');
        else {
            this.mutate(() => { dragged.z = Number(group.z) || 100; }, false);
            this.notify(`已放入文件夹「${group.name || '分组'}」`);
        }
    }

    layerName(element) {
        if (!element) return '';
        if (mainPortrait(this.config)?.id === element.id) return '角色头像';
        if (element.label) return element.label;
        if (element.type === 'image') return this.describeAsset(element.assetId)?.name || '图片';
        return element.text || this.elementTypeName(element.type);
    }

    highlightLayer(id, on) {
        if (!this.stage) return;
        this.stage.querySelectorAll('.star-editor-hover').forEach(node => node.classList.remove('star-editor-hover'));
        if (!on || !id) return;
        const node = this.stage.querySelector(`.stargaze-element[data-element-id="${id}"]`);
        if (node) node.classList.add('star-editor-hover');
    }

    focusAvatar() {
        this.selectElement(null);
        this.setMobileTab('avatar');
        const guide = this.stage?.querySelector('.star-editor-avatar-guide');
        if (!guide) return;
        guide.classList.remove('star-guide-pulse');

        void guide.offsetWidth;
        guide.classList.add('star-guide-pulse');
        this.notify('中间头像就是原生头像：直接拖它、或用旁边那条工具条调');
    }

    selectFromLayerList(id, event = null) {

        if (mainPortrait(this.config)?.id === id) {
            this.focusAvatar();
            return;
        }
        const additive = !!(event && (event.ctrlKey || event.metaKey));
        const range = !!(event && event.shiftKey && !additive);
        this.selectWithModifiers(id, { additive, range });
    }

    layerOrderIds() {
        if (!this.config) return [];
        const byZ = list => [...list].sort((a, b) => (Number(b.z) || 0) - (Number(a.z) || 0));
        const visible = this.config.elements.filter(element => !element.hidden);
        const front = byZ(visible.filter(element => element.layer === 'front'));
        const back = byZ(visible.filter(element => element.layer !== 'front'));
        return [...front, ...back].map(element => element.id);
    }

    selectWithModifiers(id, { additive = false, range = false } = {}) {
        if (!id) {
            this.selectElement(null);
            this.selectionAnchor = null;
            return;
        }
        if (range && this.selectionAnchor) {
            const order = this.layerOrderIds();
            const a = order.indexOf(this.selectionAnchor);
            const b = order.indexOf(id);
            if (a >= 0 && b >= 0) {
                const [lo, hi] = a < b ? [a, b] : [b, a];
                const ids = order.slice(lo, hi + 1);
                this.setSelection(ids);
                this.notify(`已连续选中 ${ids.length} 个`);
                return;
            }
        }
        if (additive) {
            this.toggleSelection(id);
            this.selectionAnchor = id;
            return;
        }

        const groupIds = this.expandSelectionWithGroups([id], { expand: true });
        this.setSelection(groupIds);
        this.selectionAnchor = id;
    }

    toggleLayerVisible(id) {
        const element = this.config.elements.find(item => item.id === id);
        if (!element) return;

        if (mainPortrait(this.config)?.id === id) {
            this.toggleAvatarHidden();
            return;
        }
        this.mutate(() => { element.hidden = !element.hidden; });
    }

    toggleLayerLock(id) {
        const element = this.config.elements.find(item => item.id === id);
        if (!element) return;
        this.mutate(() => { element.locked = !element.locked; });
    }

    unlockAll() {
        const locked = this.config.elements.filter(element => element.locked);
        if (!locked.length) {
            this.notify('没有锁定的元素');
            return;
        }
        this.mutate(() => { for (const element of this.config.elements) element.locked = false; });
        this.notify(`已解锁 ${locked.length} 个元素`);
    }

    nudgeLayer(direction) {
        const element = this.selectedElement();
        if (!element) {
            this.notify('先在画布或图层列表里选中一个元素');
            return;
        }

        const side = element.layer === 'front' ? 'front' : 'back';
        const group = this.config.elements
            .filter(item => (item.layer === 'front' ? 'front' : 'back') === side)
            .sort((a, b) => (Number(a.z) || 0) - (Number(b.z) || 0));
        const index = group.findIndex(item => item.id === element.id);
        const target = group[index + direction];
        if (!target) {

            if (side === 'back' && direction > 0) {
                this.layerToEdge('top');
                return;
            }
            if (side === 'front' && direction < 0) {
                this.layerToEdge('bottom');
                return;
            }
            this.notify(direction > 0 ? '已经在最上层了' : '已经在最下层了');
            return;
        }
        this.mutate(() => {
            const a = Number(element.z) || 0;
            const b = Number(target.z) || 0;
            element.z = b;
            target.z = a;
        }, false);
    }

    layerToEdge(edge) {
        const element = this.selectedElement();
        if (!element) {
            this.notify('先在画布或图层列表里选中一个元素');
            return;
        }
        const others = this.config.elements.filter(item => item.id !== element.id);
        const maxZ = Math.max(0, ...others.map(item => Number(item.z) || 0));
        const minZ = Math.min(0, ...others.map(item => Number(item.z) || 0));
        this.mutate(() => {
            if (edge === 'top') {
                element.layer = 'front';
                element.z = maxZ + 0.4;
            } else {
                element.layer = 'back';
                element.z = minZ - 0.4;
            }
        }, false);
        this.notify(edge === 'top' ? '已置顶（压住头像）' : '已置底（沉到最下面）');
    }

    alignSelection(mode) {
        const items = this.selectedElements();
        if (!items.length) {
            this.notify('先选中要排列的元素');
            return;
        }
        const { width: W, height: H } = this.config.canvas;
        const box = items.length > 1
            ? {
                left: Math.min(...items.map(item => item.x)),
                top: Math.min(...items.map(item => item.y)),
                right: Math.max(...items.map(item => item.x + item.width)),
                bottom: Math.max(...items.map(item => item.y + item.height)),
            }
            : { left: 0, top: 0, right: W, bottom: H };
        this.mutate(() => {
            for (const item of items) {
                if (mode === 'left') item.x = box.left;
                if (mode === 'right') item.x = box.right - item.width;
                if (mode === 'hcenter') item.x = (box.left + box.right) / 2 - item.width / 2;
                if (mode === 'top') item.y = box.top;
                if (mode === 'bottom') item.y = box.bottom - item.height;
                if (mode === 'vcenter') item.y = (box.top + box.bottom) / 2 - item.height / 2;
            }
        }, false);
        this.notify(`已${({ left: '左对齐', right: '右对齐', hcenter: '水平居中', top: '顶对齐', bottom: '底对齐', vcenter: '垂直居中' })[mode]}`);
    }

    distributeSelection(axis) {
        const items = this.selectedElements();
        if (items.length < 3) {
            this.notify('至少选 3 个元素才能等距分布');
            return;
        }
        const horizontal = axis === 'x';
        const sorted = [...items].sort((a, b) => (horizontal ? a.x - b.x : a.y - b.y));
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const span = horizontal
            ? (last.x + last.width) - first.x
            : (last.y + last.height) - first.y;
        const used = sorted.reduce((sum, item) => sum + (horizontal ? item.width : item.height), 0);
        const gap = (span - used) / (sorted.length - 1);
        this.mutate(() => {
            let cursor = horizontal ? first.x : first.y;
            for (const item of sorted) {
                if (horizontal) item.x = cursor;
                else item.y = cursor;
                cursor += (horizontal ? item.width : item.height) + gap;
            }
        }, false);
        this.notify(horizontal ? '已水平等距' : '已垂直等距');
    }

    syncAvatarGuide() {
        const guide = this.stage?.querySelector('.star-editor-avatar-guide');
        if (!guide) return;
        const { width, height } = this.config.canvas;
        const size = avatarVisualSize(this.config);
        guide.style.width = `${size.width / width * 100}%`;
        guide.style.height = `${size.height / height * 100}%`;
        guide.style.left = `${this.config.canvas.anchorX * 100}%`;
        guide.style.top = `${this.config.canvas.anchorY * 100}%`;
        const shapeLayer = guide.querySelector('.star-avatar-media');
        if (shapeLayer) {
            avatarShapeVars(shapeLayer, this.config.avatar?.shape);
            avatarShapeStyle(shapeLayer, this.config);
        }
        const frameLayer = guide.querySelector('.star-avatar-frame');
        if (frameLayer) {
            avatarFrameVars(frameLayer, this.config.avatar?.frameStyle || 'none');
            avatarShapeStyle(frameLayer, this.config);
        }
        const image = guide.querySelector('img');
        if (image) {
            image.style.objectPosition = `${clampFocus(this.config.avatar?.focusX)}% ${clampFocus(this.config.avatar?.focusY)}%`;
            image.style.setProperty('object-view-box', avatarViewBox(this.config));
            avatarImageStyle(image, this.config);
        }
        const controls = this.stage.querySelector('.star-avatar-control-layer');
        if (controls) controls.style.cssText = guide.style.cssText;
        const label = controls?.querySelector('span');
        if (label && this.config.avatar?.hidden !== true) {
            label.textContent = `原生头像 · ${Math.round((this.config.avatar?.zoom || 1) * 100)}%`;
        }
        const zoomLabel = this.stage.querySelector('.star-avatar-bar-zoom');
        if (zoomLabel) zoomLabel.textContent = `${Math.round((this.config.avatar?.zoom || 1) * 100)}%`;
        this.syncRotateControls();
        this.positionAvatarBar();
    }

    syncAnchorControls() {
        const inspector = this.overlay.querySelector('.star-inspector');
        if (!inspector) return;
        for (const key of ['anchorX', 'anchorY']) {
            const input = inspector.querySelector(`[data-anchor-field="${key}"]`);
            if (!input) continue;
            const value = this.config.canvas[key];
            input.value = String(value);
            const label = input.closest('label')?.querySelector('span');
            if (label) label.textContent = `${Math.round(value * 100)}%`;
        }
    }

    syncFocusControls() {
        const inspector = this.overlay.querySelector('.star-inspector');
        if (!inspector) return;
        for (const key of ['focusX', 'focusY']) {
            const input = inspector.querySelector(`[data-focus-field="${key}"]`);
            if (!input) continue;
            const value = clampFocus(this.config.avatar?.[key]);
            input.value = String(value);
            const label = input.closest('label')?.querySelector('span');
            if (label) label.textContent = `${value}%`;
        }
        const frame = inspector.querySelector('[data-frame-field="frame"]');
        if (frame) {
            const value = clampFrame(this.config.avatar?.frame);
            frame.value = String(value);
            const label = frame.closest('label')?.querySelector('span');
            if (label) label.textContent = `${Math.round(value * 100)}%`;
        }
    }

    syncRotateControls(angle) {
        const photo = clampRotate(angle === undefined ? this.config?.avatar?.rotate : angle);
        const shape = shapeRotateOf(this.config);
        const following = shapeFollowsPhoto(this.config);
        const inspector = this.overlay?.querySelector('.star-inspector');
        if (inspector) {
            const range = inspector.querySelector('[data-avatar-field="rotate"]');
            if (range && document.activeElement !== range) range.value = String(photo);
            if (range) {
                const label = range.closest('label')?.querySelector('span');
                if (label) label.textContent = `${photo}°`;
            }
            const badge = inspector.querySelector('[data-rotate-label]');
            if (badge) badge.textContent = `${photo}°`;

            const shapeRange = inspector.querySelector('[data-avatar-field="shapeRotate"]');
            if (shapeRange && document.activeElement !== shapeRange) shapeRange.value = String(shape);
            if (shapeRange) {
                const label = shapeRange.closest('label')?.querySelector('span');
                if (label) label.textContent = `${shape}°`;
            }
            const shapeBadge = inspector.querySelector('[data-shape-rotate-label]');
            if (shapeBadge) shapeBadge.textContent = following ? `${shape}° 跟随` : `${shape}°`;
            const shapeHead = inspector.querySelector('[data-shape-rotate-head]');
            if (shapeHead) shapeHead.textContent = following ? '跟着照片一起转' : '已单独固定';
            const followButton = inspector.querySelector('[data-avatar-shape-rotate="follow"]');
            if (followButton) {
                followButton.classList.toggle('active', following);
                followButton.textContent = following ? '跟随中' : '跟随照片';
            }
        }
        const barLabel = this.stage?.querySelector('.star-avatar-bar-rotate');
        if (barLabel) barLabel.textContent = following ? `${photo}°` : `${photo}°·框${shape}°`;
    }

                                                     
    rotateAvatarBy(delta) {
        const avatar = { ...(this.config.avatar || {}) };
        const following = shapeFollowsPhoto(this.config);
        avatar.rotate = clampRotate(clampRotate(avatar.rotate) + delta);
        if (!following) avatar.shapeRotate = clampRotate(shapeRotateOf(this.config) + delta);
        this.config.avatar = avatar;
        return avatar.rotate;
    }

    syncCanvasControls() {
        if (!this.config) return;
        const { width, height } = this.config.canvas;
        const active = document.activeElement;
        const bar = this.overlay.querySelector('.star-canvas-bar');
        if (bar) {
            for (const field of ['width', 'height']) {
                const input = bar.querySelector(`[data-bar-field="${field}"]`);
                if (input && input !== active) input.value = String(this.config.canvas[field]);
            }
            const ratio = bar.querySelector('.star-canvas-bar-ratio');
            if (ratio) ratio.textContent = `${(width / height).toFixed(2)} : 1`;
        }
        this.overlay.querySelectorAll('[data-canvas-field]').forEach(input => {
            if (input === active) return;
            const field = input.dataset.canvasField;
            if (this.config.canvas[field] != null) input.value = String(this.config.canvas[field]);
        });
        const layoutId = this.config.layout === CUSTOM_LAYOUT_ID
            ? CUSTOM_LAYOUT_ID
            : (matchPresetId(width, height) || CUSTOM_LAYOUT_ID);
        this.overlay.querySelectorAll('[data-canvas]').forEach(button => {
            button.classList.toggle('active', button.dataset.canvas === layoutId);
        });
        const summary = this.overlay.querySelector('.star-inspector-summary span');
        if (summary) summary.textContent = `${this.config.elements.length} 个元素 · ${width} × ${height}`;

        const toggle = this.overlay.querySelector('[data-action="toggle-avatar"]');
        if (toggle) {
            const hidden = avatarIsHidden(this.config);
            toggle.classList.toggle('active', hidden);
            toggle.textContent = hidden ? '显示中间头像' : '隐藏中间头像';
            toggle.title = hidden
                ? '恢复显示聊天区中间的头像（位置与排版始终不变）'
                : '把聊天区中间那个头像收起来：原生头像和拼贴主图一起藏，位置与排版都不变';
        }
    }

    onBarInput(event) {
        const target = event.target;
        if (!target.matches('[data-bar-field]')) return;
        if (event.type === 'change') return;
        if (target.value === '') return;
        this.beginControlEdit(target);
        this.onCanvasSizeChange(target.dataset.barField, target.value);
    }

    renderInspector() {
        const inspector = this.overlay?.querySelector('.star-inspector');
        if (!inspector) return;
        const selected = this.selectedElement();
        inspector.innerHTML = selected ? this.elementInspectorMarkup(selected) : this.avatarInspectorMarkup();
    }

    foldOpen(id) {
        if (!this.foldState) this.foldState = { shape: true };
        return this.foldState[id] === true;
    }

    fold(id, title, body) {
        return `<details class="star-fold" data-fold="${id}" ${this.foldOpen(id) ? 'open' : ''}>
            <summary>${title}</summary>
            <div class="star-fold-body">${body}</div>
        </details>`;
    }

    avatarInspectorMarkup() {
        const preset = LAYOUTS[this.config.layout];
        const avatar = this.config.avatar || {};
        const focusX = clampFocus(avatar.focusX);
        const focusY = clampFocus(avatar.focusY);
        const anchorMode = this.config.canvas.anchorMode === 'chat' ? 'chat' : 'avatar';
        const hidden = avatar.hidden === true;
        const zoom = Math.round((avatar.zoom || 1) * 100);
        const boxWidth = Math.round(clampAvatarBox(avatar.widthRatio) * 100);
        const boxHeight = Math.round(clampAvatarBox(avatar.heightRatio) * 100);
        const frameStyle = avatar.frameStyle || 'none';
        const rotateNow = clampRotate(avatar.rotate);
        const shapeRotateNow = shapeRotateOf(this.config);
        const shapeFollowing = shapeFollowsPhoto(this.config);
        const shapeName = AVATAR_SHAPES.find(item => item.id === (avatar.shape || 'circle'))?.name || '圆形';

        const shapeBlock = `
            <div class="star-shape-grid">
                ${AVATAR_SHAPES.map(shape => `<button type="button" class="star-shape-button ${(avatar.shape || 'circle') === shape.id ? 'active' : ''}" data-avatar-shape="${shape.id}"><i style="${shapeSampleStyle(shape.id)}"></i>${shape.name}</button>`).join('')}
            </div>
            <label>整体大小 <span>${zoom}%</span><input type="range" min="${AVATAR_ZOOM.min}" max="${AVATAR_ZOOM.max}" step="${AVATAR_ZOOM.step}" value="${avatar.zoom || 1}" data-avatar-field="zoom" /></label>
            <label>头像宽度 <span>${boxWidth}%</span><input type="range" min="${AVATAR_BOX.min * 100}" max="${AVATAR_BOX.max * 100}" step="1" value="${boxWidth}" data-avatar-field="widthRatio" /></label>
            <label>头像高度 <span>${boxHeight}%</span><input type="range" min="${AVATAR_BOX.min * 100}" max="${AVATAR_BOX.max * 100}" step="1" value="${boxHeight}" data-avatar-field="heightRatio" /></label>
            <div class="star-rotate-group">
                <div class="star-rotate-head">照片旋转 <em>只转照片，形状不动</em></div>
                <div class="star-rotate-row">
                    <button type="button" data-avatar-rotate="coarse-left" title="向左转 90°">⟲90</button>
                    <button type="button" data-avatar-rotate="fine-left" title="向左转 15°">⟲15</button>
                    <span class="star-rotate-value" data-rotate-label>${rotateNow}°</span>
                    <button type="button" data-avatar-rotate="fine-right" title="向右转 15°">⟳15</button>
                    <button type="button" data-avatar-rotate="coarse-right" title="向右转 90°">⟳90</button>
                    <button type="button" data-avatar-rotate="reset" title="回到 0°">归零</button>
                </div>
                <label class="star-rotate-slider">任意角度 <span>${rotateNow}°</span><input type="range" min="0" max="359" step="1" value="${rotateNow}" data-avatar-field="rotate" /></label>
            </div>
            <div class="star-rotate-group">
                <div class="star-rotate-head">形状旋转 <em data-shape-rotate-head>${shapeFollowing ? '跟着照片一起转' : '已单独固定'}</em><button type="button" class="star-rotate-follow ${shapeFollowing ? 'active' : ''}" data-avatar-shape-rotate="follow" title="让形状重新跟照片同角度">${shapeFollowing ? '跟随中' : '跟随照片'}</button></div>
                <div class="star-rotate-row">
                    <button type="button" data-avatar-shape-rotate="coarse-left" title="形状向左转 90°">⟲90</button>
                    <button type="button" data-avatar-shape-rotate="fine-left" title="形状向左转 15°">⟲15</button>
                    <span class="star-rotate-value" data-shape-rotate-label>${shapeRotateNow}°</span>
                    <button type="button" data-avatar-shape-rotate="fine-right" title="形状向右转 15°">⟳15</button>
                    <button type="button" data-avatar-shape-rotate="coarse-right" title="形状向右转 90°">⟳90</button>
                    <button type="button" data-avatar-shape-rotate="reset" title="形状回到 0°">归零</button>
                </div>
                <label class="star-rotate-slider">任意角度 <span>${shapeRotateNow}°</span><input type="range" min="0" max="359" step="1" value="${shapeRotateNow}" data-avatar-field="shapeRotate" /></label>
            </div>
            <button type="button" data-action="avatar-box-reset" class="star-wide-button">宽高恢复 1:1</button>
            <button type="button" data-action="toggle-avatar" class="star-wide-button star-avatar-toggle ${hidden ? 'active' : ''}">${hidden ? '显示中间头像（当前已隐藏）' : '隐藏中间头像（原生头像 + 主图一起藏）'}</button>
            <div class="star-inspector-hint">按住头像本身就能拖位置；右中手柄只改宽、下手柄只改高、右下角等比缩放，左下角挪取景。</div>`;

        const frameBlock = `
            <div class="star-frame-grid">${FRAME_STYLES.map(frame => `
                <button type="button" class="star-frame-button ${frameStyle === frame.id ? 'active' : ''}" data-avatar-frame="${frame.id}"><i class="star-frame-sample-${frame.id}"></i>${frame.name}</button>`).join('')}</div>
            <div class="star-inspector-hint">相框会套在中间头像外面，取景、宽高、形状都还能继续调。</div>`;

        const framingBlock = `
            <div class="star-framing-row">
                ${FRAMING_PRESETS.map(item => `<button type="button" class="star-framing-button ${this.isFramingActive(item) ? 'active' : ''}" data-framing="${item.id}" title="${item.hint}">${item.name}</button>`).join('')}
            </div>
            <label>图片缩放（形状内） <span>${Math.round(clampFrame(avatar.frame) * 100)}%</span><input type="range" min="${AVATAR_FRAME.min}" max="${AVATAR_FRAME.max}" step="${AVATAR_FRAME.step}" value="${clampFrame(avatar.frame)}" data-frame-field="frame" /></label>
            <label>图片左右露出 <span>${focusX}%</span><input type="range" min="${AVATAR_FOCUS.min}" max="${AVATAR_FOCUS.max}" step="${AVATAR_FOCUS.step}" value="${focusX}" data-focus-field="focusX" /></label>
            <label>图片上下露出 <span>${focusY}%</span><input type="range" min="${AVATAR_FOCUS.min}" max="${AVATAR_FOCUS.max}" step="${AVATAR_FOCUS.step}" value="${focusY}" data-focus-field="focusY" /></label>
            <button type="button" data-action="focus-reset" class="star-wide-button">图片回到正中</button>
            <div class="star-inspector-hint">这三条只管「图片在形状里露出哪一块」，头像本身的摆放位置不动。脸被心形、星形切掉时，先把「图片缩放」调到 150% 再挪。</div>`;

        const positionBlock = `
            <div class="star-layer-switch">
                ${ANCHOR_MODES.map(mode => `<button type="button" class="star-layer-button ${anchorMode === mode.id ? 'active' : ''}" data-anchor-mode="${mode.id}" title="${mode.hint}">${mode.name}</button>`).join('')}
            </div>
            <label>头像水平位置 <span>${Math.round(this.config.canvas.anchorX * 100)}%</span><input type="range" min="0.05" max="0.95" step="0.01" value="${this.config.canvas.anchorX}" data-anchor-field="anchorX" /></label>
            <label>头像垂直位置 <span>${Math.round(this.config.canvas.anchorY * 100)}%</span><input type="range" min="0.05" max="0.95" step="0.01" value="${this.config.canvas.anchorY}" data-anchor-field="anchorY" /></label>
            <div class="star-inspector-hint">「跟随头像」是头像永远在画面正中；有的美化把头像钉在边角、推不动，就切「画布居中」。</div>`;

        const canvasBlock = `
            <div class="star-number-grid">
                ${this.canvasNumber('width', '宽', this.config.canvas.width, CANVAS_LIMITS.minWidth, CANVAS_LIMITS.maxWidth)}
                ${this.canvasNumber('height', '高', this.config.canvas.height, CANVAS_LIMITS.minHeight, CANVAS_LIMITS.maxHeight)}
            </div>
            <button type="button" data-action="fit-width" class="star-wide-button">画布铺满宽度（只拉宽画布）</button>
            <button type="button" data-action="add-text" class="star-wide-button">＋ 添加自定义文字</button>
            <div class="star-inspector-hint">改宽度时头像和素材的像素大小不变，画布只是变宽，多出来的地方可以摆新素材。</div>`;

        const themeBlock = `
            <div class="star-color-grid">
                ${this.colorControl('paper', '纸张')}${this.colorControl('accent', '强调')}${this.colorControl('ink', '文字')}${this.colorControl('soft', '柔色')}${this.colorControl('secondary', '辅助')}
            </div>`;

        const fieldsBlock = `
            <div class="star-token-row">
                <button type="button" data-insert-token="birthday">＋ 生日</button>
                <button type="button" data-insert-token="title">＋ 称号</button>
                <button type="button" data-insert-token="name">＋ 名字</button>
            </div>
            <button type="button" data-action="bind-template" class="star-wide-button ${this.boundTemplate === this.config.templateId ? 'active' : ''}">${this.boundTemplate === this.config.templateId ? '已绑定为这个角色的默认模板（点击取消）' : '把这个模板设为该角色的默认模板'}</button>
            <div class="star-inspector-hint">插进去的是 <code>{{birthday|兜底文案}}</code> 占位符：角色卡填了就显示真实值，没填就用兜底文案。</div>`;

        return `
            <div class="star-avatar-summary ${hidden ? 'is-hidden' : ''}">
                <span class="star-avatar-summary-thumb"><img style="${shapeSampleStyle(avatar.shape || 'circle')}" src="${escapeHtml(this.avatarUrl)}" alt="" /></span>
                <span class="star-avatar-summary-text"><strong>中间头像 · ${shapeName}</strong><small>${hidden ? '当前已隐藏，位置与排版不变' : `占画面 ${zoom}% · 拖圈挪位置`}</small></span>
            </div>
            ${this.fold('shape', '形状与大小', shapeBlock)}
            ${this.fold('avatarFrame', '相框', frameBlock)}
            ${this.fold('framing', '取景', framingBlock)}
            ${this.fold('position', '位置与展开基准', positionBlock)}
            ${this.fold('canvas', '画布尺寸', canvasBlock)}
            ${this.fold('theme', '主题配色', themeBlock)}
            ${this.fold('fields', '角色卡字段', fieldsBlock)}
            <div class="star-inspector-summary"><b>${preset ? preset.name : '自定义'}画布</b><span>${this.config.elements.length} 个元素 · ${this.config.canvas.width} × ${this.config.canvas.height}</span></div>`;
    }

    elementInspectorMarkup(selected) {
        const multiple = this.selection.length > 1;
        // 常用的副图来源操作放在折叠区外，选中照片后即可替换或恢复取景。
        const photoSource = !multiple && selected.type === 'image' ? this.photos.inspector(selected) : '';
        const alignBlock = `
            <div class="star-align-grid">
                <button type="button" data-action="align-left" title="左对齐">⇤</button>
                <button type="button" data-action="align-hcenter" title="水平居中">↔</button>
                <button type="button" data-action="align-right" title="右对齐">⇥</button>
                <button type="button" data-action="align-top" title="顶对齐">⤒</button>
                <button type="button" data-action="align-vcenter" title="垂直居中">↕</button>
                <button type="button" data-action="align-bottom" title="底对齐">⤓</button>
                <button type="button" data-action="distribute-x" title="水平等距">⋯</button>
                <button type="button" data-action="distribute-y" title="垂直等距">⋮</button>
            </div>`;
        const multiHeader = multiple
            ? `<div class="star-multi-badge">已选中 <b>${this.selection.length}</b> 个元素 · 拖动任意一个整组移动</div>${alignBlock}`
            : '';

        const layerBlock = `
            <div class="star-layer-switch">
                <button type="button" class="star-layer-button ${selected.layer === 'front' ? '' : 'active'}" data-layer="back">在头像下方</button>
                <button type="button" class="star-layer-button ${selected.layer === 'front' ? 'active' : ''}" data-layer="front">在头像上方</button>
            </div>
            <div class="star-inline-row">
                <button type="button" class="star-mini-toggle ${selected.hidden ? 'active' : ''}" data-action="layer-toggle" data-layer-id="${selected.id}">${selected.hidden ? '已隐藏' : '隐藏'}</button>
                <button type="button" class="star-mini-toggle ${selected.locked ? 'active' : ''}" data-action="layer-lock" data-layer-id="${selected.id}">${selected.locked ? '已锁定' : '锁定'}</button>
                <button type="button" class="star-mini-toggle" data-action="layer-front">上移一层</button>
                <button type="button" class="star-mini-toggle" data-action="layer-back">下移一层</button>
            </div>
            <div class="star-inspector-hint">「在头像上方」可以压住头像边缘；锁定后画布上拖不动，防止误操作。</div>`;

        const geometry = `
            <div class="star-number-grid">
                ${this.numberControl('x', 'X', selected.x, -800, 3200, 1)}${this.numberControl('y', 'Y', selected.y, -800, 3200, 1)}
                ${this.numberControl('width', '宽', selected.width, 4, 3200, 1)}${this.numberControl('height', '高', selected.height, 4, 3200, 1)}
                ${this.numberControl('rotation', '旋转°', selected.rotation, -360, 360, 1)}
            </div>
            <label>透明度 <span>${Math.round(selected.opacity * 100)}%</span><input type="range" min="0.05" max="1" step="0.05" value="${selected.opacity}" data-field="opacity" /></label>`;

        let specific = '';
        if (selected.type === 'image') {
            const photoChrome = `
                <h3>相框（${FRAME_STYLES.length} 种）</h3>
                <div class="star-frame-grid">${FRAME_STYLES.map(frame => `
                    <button type="button" class="star-frame-button ${selected.shape === frame.id ? 'active' : ''}" data-frame="${frame.id}"><i class="star-frame-sample-${frame.id}"></i>${frame.name}</button>`).join('')}</div>
                <button type="button" data-action="replace" class="star-wide-button">替换这张图片</button>
                ${selected.shape === 'polaroid' ? `<label>拍立得注记（可选，留空隐藏）<input data-field="caption" value="${escapeHtml(selected.caption || '')}" /></label>` : ''}
                <h3>描边与阴影</h3>
                <div class="star-number-grid">${this.numberControl('stroke', '描边粗细', selected.stroke || 0, 0, 20, 0.5)}</div>
                <label>描边颜色<input type="color" data-field="strokeColor" value="${escapeHtml(selected.strokeColor || '#ffffff')}" /></label>
                <label class="star-check"><input type="checkbox" data-field="shadow" ${selected.shadow ? 'checked' : ''} /> 投影阴影</label>
                <div class="star-number-grid">${this.numberControl('shadowSoft', '柔光阴影', selected.shadowSoft || 0, 0, 24, 1)}</div>
                <div class="star-inspector-hint">描边沿相框外缘；投影适合拍立得/纸片。柔光阴影用滤镜，重效果，少开几个即可。</div>`;
            specific = this.photoFramingBlock(selected) + photoChrome;
        } else if (selected.type === 'text' || selected.type === 'sticker') {
            specific = `
                <h3>文字样式</h3>
                <label>内容<textarea data-field="text" rows="3">${escapeHtml(selected.text)}</textarea></label>
                <label>字体<select data-field="fontFamily">${FONT_OPTIONS.map(font => `<option value="${escapeHtml(font.value)}" ${selected.fontFamily === font.value ? 'selected' : ''}>${font.name}</option>`).join('')}</select></label>
                <div class="star-number-grid">${this.numberControl('fontSize', '字号', selected.fontSize, 3, 160, 0.5)}${this.numberControl('stroke', '描边', selected.stroke, 0, 12, 0.1)}</div>
                <label>文字颜色<input type="color" data-field="color" value="${escapeHtml(selected.color || this.config.theme.ink)}" /></label>
                <label>对齐<select data-field="align"><option value="left" ${selected.align === 'left' ? 'selected' : ''}>左对齐</option><option value="center" ${selected.align === 'center' ? 'selected' : ''}>居中</option><option value="right" ${selected.align === 'right' ? 'selected' : ''}>右对齐</option></select></label>
                <label class="star-check"><input type="checkbox" data-field="shadow" ${selected.shadow ? 'checked' : ''} /> 柔和阴影</label>`;
        }

        const title = multiple
            ? `${this.selection.length} 个元素`
            : `${this.elementTypeName(selected.type)} #${escapeHtml(selected.id.slice(-6))}`;

        return `
            <div class="star-selected-title"><strong>${title}</strong><span>${multiple ? '多选' : ''}</span></div>
            ${multiHeader}
            ${photoSource}
            ${this.fold('layer', '层级与锁定', layerBlock)}
            ${this.fold('geometry', '位置与大小', geometry)}
            ${specific ? this.fold('detail', multiple ? '主选元素属性' : '元素属性', specific) : ''}
            ${this.fold('canvas', '画布尺寸', `
                <div class="star-number-grid">
                    ${this.canvasNumber('width', '宽', this.config.canvas.width, CANVAS_LIMITS.minWidth, CANVAS_LIMITS.maxWidth)}
                    ${this.canvasNumber('height', '高', this.config.canvas.height, CANVAS_LIMITS.minHeight, CANVAS_LIMITS.maxHeight)}
                </div>
                <button type="button" data-action="fit-width" class="star-wide-button">画布铺满宽度（只拉宽画布）</button>`)}`;
    }

    photoFramingBlock(element) {
        const zoom = Number(element.cropZoom) || 1;
        const focusX = clampFocus(element.focusX);
        const focusY = clampFocus(element.focusY);
        const isAvatarPhoto = element.assetId === '__avatar__';
        const sliders = `
            <label>图片缩放（形状内） <span>${Math.round(zoom * 100)}%</span><input type="range" min="${AVATAR_FRAME.min}" max="${AVATAR_FRAME.max}" step="${AVATAR_FRAME.step}" value="${zoom}" data-field="cropZoom" /></label>
            <label>图片左右露出 <span>${focusX}%</span><input type="range" min="${AVATAR_FOCUS.min}" max="${AVATAR_FOCUS.max}" step="${AVATAR_FOCUS.step}" value="${focusX}" data-field="focusX" /></label>
            <label>图片上下露出 <span>${focusY}%</span><input type="range" min="${AVATAR_FOCUS.min}" max="${AVATAR_FOCUS.max}" step="${AVATAR_FOCUS.step}" value="${focusY}" data-field="focusY" /></label>`;
        if (!isAvatarPhoto) {
            return `
                <h3>取景</h3>
                ${sliders}
                <button type="button" data-action="photo-focus-reset" class="star-wide-button">这张照片回到正中</button>`;
        }
        return `
            <h3>这张头像照片的取景</h3>
            <div class="star-framing-row">
                ${FRAMING_PRESETS.map(preset => `<button type="button" class="star-framing-button ${this.isPhotoFramingActive(element, preset) ? 'active' : ''}" data-photo-framing="${preset.id}" title="${preset.hint}">${preset.name}</button>`).join('')}
            </div>
            <div class="star-inspector-hint">这三个滑块只管<b>这一张</b>从素材库放进来的头像照片，不会动到画布中间那个原生头像。脸被相框切掉时，先把「图片缩放」调到 150% 左右，再挪左右 / 上下露出把脸摆进框里。</div>
            ${sliders}
            <button type="button" data-action="photo-focus-reset" class="star-wide-button">这张照片回到正中</button>
            <button type="button" data-action="deselect" class="star-wide-button">去调中间那个原生头像的取景</button>`;
    }

    isPhotoFramingActive(element, preset) {
        return Math.abs((Number(element.cropZoom) || 1) - preset.frame) < 0.06
            && Math.abs(clampFocus(element.focusY) - preset.focusY) < 2
            && Math.abs(clampFocus(element.focusX) - preset.focusX) < 2;
    }

    applyPhotoFraming(id) {
        const element = this.selectedElement();
        if (!element || element.type !== 'image') {
            this.notify('先在画布上选中一张图片');
            return;
        }
        const preset = FRAMING_PRESETS.find(item => item.id === id);
        if (!preset) return;
        this.mutate(() => {
            element.cropZoom = preset.frame;
            element.focusX = preset.focusX;
            element.focusY = preset.focusY;
        });
        this.notify(`这张照片已套用「${preset.name}」取景`);
    }

    resetPhotoFocus() {
        const element = this.selectedElement();
        if (!element) return;
        this.mutate(() => {
            element.cropZoom = 1;
            element.focusX = AVATAR_FOCUS.default;
            element.focusY = AVATAR_FOCUS.default;
        });
    }

    isFramingActive(preset) {
        return Math.abs(clampFrame(this.config.avatar?.frame) - preset.frame) < 0.06
            && Math.abs(clampFocus(this.config.avatar?.focusY) - preset.focusY) < 2
            && Math.abs(clampFocus(this.config.avatar?.focusX) - preset.focusX) < 2;
    }

    colorControl(field, label) {
        return `<label>${label}<input type="color" data-theme-field="${field}" value="${escapeHtml(this.config.theme[field])}" /></label>`;
    }

    numberControl(field, label, value, min, max, step) {
        const shown = Math.round(Number(value) * 10) / 10;
        return `<label>${label}<input type="number" data-field="${field}" value="${shown}" min="${min}" max="${max}" step="${step}" /></label>`;
    }

    canvasNumber(field, label, value, min, max) {
        return `<label>${label}<input type="number" data-canvas-field="${field}" value="${Math.round(Number(value))}" min="${min}" max="${max}" step="1" /></label>`;
    }

    elementTypeName(type) {
        return ({ image: '图片', text: '文字', sticker: '贴纸', tape: '胶带', lace: '蕾丝', frame: '相框底板' })[type] || '元素';
    }

    beginControlEdit(target) {
        if (!target.matches('[data-field], [data-canvas-field], [data-bar-field], [data-anchor-field], [data-theme-field], [data-avatar-field], [data-focus-field], [data-frame-field]')) return;
        if (this.controlHistoryTarget === target) return;
        this.pushHistory();
        this.controlHistoryTarget = target;
    }

    onInspectorInput(event) {
        const target = event.target;
        if (!target.matches('[data-field], [data-canvas-field], [data-anchor-field], [data-theme-field], [data-avatar-field], [data-focus-field], [data-frame-field]')) return;
        if (event.type === 'input' && (target.type === 'checkbox' || target.tagName === 'SELECT')) return;
        if (event.type === 'change' && !['checkbox', 'select-one'].includes(target.type) && target.tagName !== 'SELECT') return;
        if (target.type === 'number' && (target.value === '' || !Number.isFinite(Number(target.value)))) return;
        this.beginControlEdit(target);
        const value = target.type === 'checkbox' ? target.checked : target.value;
        if (target.dataset.frameField) {
            this.config.avatar = { ...(this.config.avatar || {}), frame: clampFrame(value) };
            const label = target.closest('label')?.querySelector('span');
            if (label) label.textContent = `${Math.round(clampFrame(value) * 100)}%`;
        } else if (target.dataset.focusField) {
            const field = target.dataset.focusField;
            this.config.avatar = { ...(this.config.avatar || {}), [field]: clampFocus(value) };
            const label = target.closest('label')?.querySelector('span');
            if (label) label.textContent = `${clampFocus(value)}%`;
        } else if (target.dataset.avatarField) {
            const field = target.dataset.avatarField;
            if (field === 'rotate') {
                const next = clampRotate(value);
                this.config.avatar = { ...(this.config.avatar || {}), rotate: next };
                const label = target.closest('label')?.querySelector('span');
                if (label) label.textContent = `${next}°`;
                this.syncRotateControls(next);
            } else if (field === 'shapeRotate') {
                const next = clampShapeRotate(value);
                this.config.avatar = { ...(this.config.avatar || {}), shapeRotate: next };
                const label = target.closest('label')?.querySelector('span');
                if (label) label.textContent = `${next}°`;
                this.syncRotateControls();
            } else if (field === 'widthRatio' || field === 'heightRatio') {
                const next = clampAvatarBox(Number(value) / 100);
                this.config.avatar = { ...(this.config.avatar || {}), [field]: next };
                const label = target.closest('label')?.querySelector('span');
                if (label) label.textContent = `${Math.round(next * 100)}%`;
            } else {
                this.config.avatar = { ...(this.config.avatar || {}), [field]: clamp(Number(value) || 1, AVATAR_ZOOM.min, AVATAR_ZOOM.max) };
                const label = target.closest('label')?.querySelector('span');
                if (label) label.textContent = `${Math.round(this.config.avatar[field] * 100)}%`;
            }
        } else if (target.dataset.themeField) {
            this.config.theme[target.dataset.themeField] = value;
        } else if (target.dataset.canvasField) {
            this.onCanvasSizeChange(target.dataset.canvasField, value);
            target.value = this.config.canvas[target.dataset.canvasField];
        } else if (target.dataset.anchorField) {
            this.config.canvas[target.dataset.anchorField] = clamp(Number(value) || 0.5, 0.05, 0.95);
            const label = target.previousElementSibling;
            if (label) label.textContent = `${Math.round(this.config.canvas[target.dataset.anchorField] * 100)}%`;
        } else {
            const element = this.selectedElement();
            if (!element) return;
            const field = target.dataset.field;
            const numeric = ['x', 'y', 'width', 'height', 'rotation', 'opacity', 'cropZoom', 'focusX', 'focusY', 'fontSize', 'stroke', 'shadowSoft'];
            element[field] = numeric.includes(field) ? Number(value) : value;
            // 新模板默认无注记；用户主动填写时显示，清空后也不回退到角色名。
            if (field === 'caption') element.showCaption = String(value).trim().length > 0;
            if (['width', 'height'].includes(field)) element[field] = Math.max(4, element[field]);

            const label = target.closest('label')?.querySelector('span');
            if (label) {
                if (field === 'cropZoom') label.textContent = `${Math.round(Number(value) * 100)}%`;
                else if (field === 'focusX' || field === 'focusY') label.textContent = `${Math.round(Number(value))}%`;
                else if (field === 'opacity') label.textContent = `${Math.round(Number(value) * 100)}%`;
                else if (field === 'rotation') label.textContent = `${Math.round(Number(value))}°`;
            }
        }
        this.future = [];

        const continuous = target.type === 'range' || target.type === 'number' || target.type === 'color'
            || target.dataset.focusField || target.dataset.frameField || target.dataset.avatarField || target.dataset.anchorField;
        if (event.type === 'input' && continuous) {
            this.scheduleLiveTransform();

            const el = this.selectedElement();
            if (el && (target.dataset.field === 'focusX' || target.dataset.field === 'focusY' || target.dataset.field === 'cropZoom'
                || target.dataset.focusField || target.dataset.frameField)) {
                this.syncSelectedImageCrop(el);
            }
            if (target.dataset.avatarField || target.dataset.focusField || target.dataset.frameField || target.dataset.anchorField) {
                this.syncAvatarGuide?.();
            }
        } else {
            this.renderStage();
        }
        this.markDirty();
    }

    syncSelectedImageCrop(element) {
        if (!this.stage || !element || element.type !== 'image') return;
        const node = this.stage.querySelector(`.stargaze-element[data-element-id="${element.id}"] img`);
        if (!node) return;
        const fx = Number(element.focusX);
        const fy = Number(element.focusY);
        if (Number.isFinite(fx) && Number.isFinite(fy)) {
            node.style.objectPosition = `${fx}% ${fy}%`;
        }
        node.style.setProperty('object-view-box', photoViewBox(element));
    }

    selectedElement() {
        return this.config?.elements.find(element => element.id === this.selectedId) || null;
    }

    selectedElements() {
        const map = new Map(this.config.elements.map(element => [element.id, element]));
        return this.selection.map(id => map.get(id)).filter(Boolean);
    }

    setSelection(ids) {
        const list = [...new Set((ids || []).filter(Boolean))]
            .filter(id => this.config.elements.some(element => element.id === id));
        this.selection = list;
        this.selectedId = list[0] || null;
        this.renderStage();
        this.renderInspector();
        this.renderLayerList();
        this.photos.render();
    }

    toggleSelection(id) {
        if (!id) return;
        const list = this.selection.includes(id)
            ? this.selection.filter(item => item !== id)
            : [...this.selection, id];
        this.setSelection(list);
    }

    selectAll() {
        this.setSelection(this.config.elements.filter(element => !element.hidden).map(element => element.id));
        this.notify(`已选中 ${this.selection.length} 个元素`);
    }

    selectElement(id) {
        if (this.selectedId === id && this.selection.length === (id ? 1 : 0)) return;
        this.setSelection(id ? [id] : []);

        if (id && globalThis.matchMedia?.('(max-width: 760px)').matches) {
            const photo = this.photos.items().some(e => e.id === id);
            this.setMobileTab(photo ? 'avatar' : 'text');
        }
    }

    // 撤销与重做：复制当前编辑图层，尺寸稿按提交版本共享，减少极繁模板的历史内存。
    snapshot() {
        return {
            elements: clone(this.config.elements),
            groups: clone(this.config.groups || []),
            canvas: clone(this.config.canvas),
            avatar: clone(this.config.avatar),
            theme: { ...this.config.theme },
            layout: this.config.layout,
            templateId: this.config.templateId,
            subtitle: this.config.subtitle,
            nickname: this.config.nickname,
            studioSchemeId:this.config.studioSchemeId,studioSchemeName:this.config.studioSchemeName,shareMetadata:clone(this.config.shareMetadata||{}),
            sizeKey: this.config.sizeKey,
            sizes: { ...(this.config.sizes || {}) },
            templateSizeDrafts: Object.fromEntries(Object.entries(this.config.templateSizeDrafts || {}).map(([id, states]) => [id, { ...states }])),
        };
    }

    restoreSnapshot(snapshot) {
        if (!snapshot) return;
        this.config = { ...this.config, ...clone(snapshot) };

        this.selection = this.selection.filter(id => this.config.elements.some(element => element.id === id));
        this.selectedId = this.selection[0] || null;
    }

    pushHistory() {
        if (!this.config) return;
        const previous=this.snapshot();this.history.push(previous);
        if (this.history.length > 60) this.history.shift();
        this.future = [];
        return previous;
    }

    mutate(callback, refreshInspector = true) {
        const previous=this.pushHistory();
        callback();
        if (this.selectedId && !this.selectedElement()) this.selectedId = null;
        this.selection = this.selection.filter(id => this.config.elements.some(element => element.id === id));
        if (refreshInspector) this.renderAll(previous);
        else {
            if(!patchEditorStage(this,previous))this.renderStage();
            this.renderInspector();
            this.syncCanvasControls();
        }
        this.markDirty();
    }

    undo() {
        if (!this.history.length) return;
        this.future.push(this.snapshot());
        this.restoreSnapshot(this.history.pop());
        this.renderAll();
        this.markDirty();
    }

    redo() {
        if (!this.future.length) return;
        this.history.push(this.snapshot());
        this.restoreSnapshot(this.future.pop());
        this.renderAll();
        this.markDirty();
    }

    nextZ() {
        return Math.max(0, ...this.config.elements.map(element => element.z)) + 1;
    }

    spawnPoint() {
        const scale = this.config.canvas.width / 400;
        return {
            scale,
            cx: this.config.canvas.width * this.config.canvas.anchorX,
            cy: this.config.canvas.height * this.config.canvas.anchorY,
        };
    }

    addText() {
        const id = uid('el');
        const { scale, cx, cy } = this.spawnPoint();
        this.mutate(() => {
            this.config.elements.push({
                id, type: 'text', text: '输入文字', x: cx + 26 * scale, y: cy + 40 * scale,
                width: 120 * scale, height: 26 * scale,
                rotation: 0, z: this.nextZ(), opacity: 1, fontSize: 14 * scale,
                fontFamily: FONT_OPTIONS[0].value, color: this.config.theme.ink,
                align: 'left', stroke: 0, shadow: false, layer: 'back',
            });
            this.selectedId = id;
            this.selection = [id];
        });
    }

    addSticker(glyph) {
        const id = uid('el');
        const { scale, cx, cy } = this.spawnPoint();
        this.mutate(() => {
            this.config.elements.push({
                id, type: 'sticker', text: glyph, x: cx + 26 * scale, y: cy - 8 * scale,
                width: 40 * scale, height: 40 * scale,
                rotation: 0, z: this.nextZ(), opacity: 1, fontSize: 32 * scale,
                fontFamily: FONT_OPTIONS[0].value, color: this.config.theme.accent,
                align: 'center', stroke: 0, shadow: false, layer: 'back',
            });
            this.selectedId = id;
            this.selection = [id];
        });
    }

    addDecoration(type, tapeStyle) {
        const id = uid('el');
        const { scale, cx, cy } = this.spawnPoint();
        const units = avatarUnits(this.config.canvas);
        const tapeStyles = ['washi', 'clear', 'solid', 'grid', 'pink', 'blue', 'mint', 'kraft'];
        const style = type === 'tape' ? (tapeStyle && tapeStyles.includes(tapeStyle) ? tapeStyle : tapeStyles[Math.floor(Math.random() * tapeStyles.length)]) : undefined;
        this.mutate(() => {
            const el = {
                id, type,
                x: type === 'lace' ? cx - units * 0.85 : cx - 10 * scale,
                y: type === 'lace' ? cy - units * 0.12 : cy - units * 0.9,
                width: type === 'lace' ? units * 1.7 : 100 * scale,
                height: type === 'lace' ? Math.max(14, units * 0.22) : 22 * scale,
                rotation: type === 'lace' ? (Math.random() * 10 - 5) : (20 + Math.random() * 30),
                z: this.nextZ(), opacity: type === 'tape' ? 0.88 : 0.9, layer: 'front',
            };
            if (style) el.tapeStyle = style;
            this.config.elements.push(el);
            this.selectedId = id;
            this.selection = [id];
        });
        this.notify(type === 'tape' ? `已添加胶带（${style}）` : '已添加蕾丝花边');
    }

    addImage(assetId) {
        this.addImageAt(assetId);
    }

    addImageAt(assetId, point = null) {
        const id = uid('el');
        const { scale, cx, cy } = this.spawnPoint();
        const ratio = Math.min(6, Math.max(0.2, ASPECT[assetId] || 0.82));
        const decorative = assetId.startsWith('builtin:') || assetId.startsWith('v10:');
        const width = 80 * scale;
        const height = decorative ? width / ratio : 96 * scale;
        const centerX = point?.x ?? cx + 68 * scale;
        const centerY = point?.y ?? cy - 2 * scale;
        this.mutate(() => {
            this.config.elements.push({
                id, type: 'image', assetId,
                x: centerX - width / 2, y: centerY - height / 2,
                width, height,
                rotation: 0, z: this.nextZ(), opacity: 1,
                shape: 'none', caption: '', showCaption: false,
                cropZoom: 1, focusX: 50, focusY: 50,
                fit: decorative ? 'fill' : (assetId === '__avatar__' ? 'cover' : 'contain'), layer: 'back',
            });
            this.selectedId = id;
            this.selection = [id];
        });
    }

    duplicateSelected() {
        const items = this.selectedElements();
        if (!items.length) return this.notify('请先选择要复制的元素');
        const { scale } = this.spawnPoint();
        const baseZ = this.nextZ();
        const copies = items.map((item, index) => {
            const copy = clone(item);
            copy.id = uid('el');
            if (copy.photoRole === 'main') copy.photoRole = 'secondary';
            if (copy.photoRole === 'secondary') { copy.photoSlotId = copy.id; copy.slotName = '副图 · 副本'; }
            copy.x += 8 * scale;
            copy.y += 8 * scale;
            copy.z = baseZ + index;
            return copy;
        });
        this.mutate(() => {
            this.config.elements.push(...copies);
            this.selection = copies.map(copy => copy.id);
            this.selectedId = this.selection[0] || null;
        });
    }

    deleteSelected() {
        const items = this.selectedElements();
        if (!items.length) return this.notify('请先选择要删除的元素');

        const mainId = mainPortrait(this.config)?.id;
        const isMain = items.some(item => item.id === mainId);
        const ids = new Set(items.map(item => item.id));
        this.mutate(() => {
            this.config.elements = this.config.elements.filter(element => !ids.has(element.id));
            this.selection = [];
            this.selectedId = null;
            if (isMain) this.config.avatar = { ...(this.config.avatar || {}), hidden: true, hiddenId: '' };
        });
        if (isMain) this.notify('中间主图已删除，原生头像也一起藏起来了（工具条里点「显示中间头像」可恢复）');
        else if (items.length > 1) this.notify(`已删除 ${items.length} 个元素`);
    }

    groupMembers(id) {
        const element = this.config.elements.find(item => item.id === id);
        if (!element?.groupId) return id ? [id] : [];
        return this.config.elements
            .filter(item => item.groupId === element.groupId && !item.hidden)
            .map(item => item.id);
    }

    expandSelectionWithGroups(ids, { expand = true } = {}) {
        if (!expand) return [...new Set(ids.filter(Boolean))];
        const out = new Set();
        for (const id of ids) {
            for (const member of this.groupMembers(id)) out.add(member);
        }
        return [...out];
    }

    groupSelected() {
        const items = this.selectedElements().filter(el => !el.locked);
        if (items.length < 2) {
            this.notify('至少选中 2 个未锁定元素才能建立分组文件夹');
            return;
        }
        if (!Array.isArray(this.config.groups)) this.config.groups = [];
        const groupId = uid('grp');
        const n = this.config.groups.length + 1;
        const layer = items.some(el => el.layer === 'front') ? 'front' : 'back';
        const z = Math.max(...items.map(el => Number(el.z) || 0));
        this.mutate(() => {
            this.config.groups.push({
                id: groupId,
                name: `分组 ${n}`,
                collapsed: false,
                hidden: false,
                locked: false,
                layer,
                z,
            });
            for (const el of items) {
                el.groupId = groupId;

                el.layer = layer;
            }
        }, false);
        this.notify(`已建立文件夹「分组 ${n}」（${items.length} 项）`);
    }

    ungroupSelected() {
        if (!Array.isArray(this.config.groups)) this.config.groups = [];
        const selectedGroupIds = new Set(
            this.selectedElements().map(el => el.groupId).filter(Boolean)
        );

        if (!selectedGroupIds.size) {
            this.notify('当前选中没有分组文件夹');
            return;
        }
        this.mutate(() => {
            for (const el of this.config.elements) {
                if (selectedGroupIds.has(el.groupId)) delete el.groupId;
            }
            this.config.groups = this.config.groups.filter(g => !selectedGroupIds.has(g.id));
        }, false);
        this.notify('已解散分组文件夹');
    }

    toggleGroupCollapsed(groupId) {
        const group = (this.config.groups || []).find(g => g.id === groupId);
        if (!group) return;
        group.collapsed = !group.collapsed;
        this.renderLayerList();
    }

    toggleGroupVisible(groupId) {
        const group = (this.config.groups || []).find(g => g.id === groupId);
        if (!group) return;
        this.mutate(() => {
            // 旧版本把组隐藏写入了每个子层；仅在首次迁移时清理旧掩码。
            const members = this.config.elements.filter(e => e.groupId === groupId);
            if (group.hidden && group.visibilityMode !== 'mask' && members.every(e => e.hidden)) {
                members.forEach(e => { e.hidden = false; });
            }
            group.hidden = !group.hidden;
            group.visibilityMode = 'mask';
        }, false);
    }

    renameGroup(groupId) {
        const group = (this.config.groups || []).find(g => g.id === groupId);
        if (!group) return;
        const name = prompt('分组文件夹名称', group.name || '分组');
        if (name == null) return;
        const next = String(name).trim().slice(0, 40);
        if (!next) return;
        this.mutate(() => { group.name = next; }, false);
    }

    async mergeSelected() {
        const mainId = mainPortrait(this.config)?.id;
        const items = this.selectedElements()
            .filter(el => !el.locked && el.id !== mainId)
            .sort((a, b) => (Number(a.z) || 0) - (Number(b.z) || 0));
        if (items.length < 2) {
            this.notify('至少选中 2 个未锁定元素才能合并（中间主头像不能合并）');
            return;
        }
        try {
            const pad = 2;
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (const el of items) {
                minX = Math.min(minX, el.x);
                minY = Math.min(minY, el.y);
                maxX = Math.max(maxX, el.x + el.width);
                maxY = Math.max(maxY, el.y + el.height);
            }
            minX -= pad; minY -= pad; maxX += pad; maxY += pad;
            const width = Math.max(8, maxX - minX);
            const height = Math.max(8, maxY - minY);
            const clones = items.map(el => ({
                ...clone(el),
                x: el.x - minX,
                y: el.y - minY,
                groupId: undefined,
            }));
            const tempConfig = {
                ...clone(this.config),
                canvas: { ...this.config.canvas, width, height, anchorX: 0.5, anchorY: 0.5 },
                elements: clones,
            };
            const { blob } = await renderCollageBlob(tempConfig, {
                fields: characterFields(this.character),
                avatarUrl: this.avatarUrl,
                assetUrls: this.assetUrls,
                quality: 2,
                transparent: true,
                skipAvatar: true,
                templateOnly: false,
            });
            if (!blob) throw new Error('无法生成合并图片');
            const asset = await this.store.saveAsset(blob, LIBRARY_OWNER, `合并图层 ${items.length}`);

            if (asset?.id && asset.blob) {
                const prev = this.assetUrls.get(asset.id);
                if (prev) URL.revokeObjectURL(prev);
                this.assetUrls.set(asset.id, URL.createObjectURL(asset.blob));
            }
            const newId = uid('el');
            const maxZ = Math.max(...items.map(el => Number(el.z) || 0));
            const layer = items.some(el => el.layer === 'front') ? 'front' : 'back';
            const removeIds = new Set(items.map(el => el.id));
            this.mutate(() => {
                this.config.elements = this.config.elements.filter(el => !removeIds.has(el.id));
                this.config.elements.push({
                    id: newId,
                    type: 'image',
                    assetId: asset.id,
                    x: minX,
                    y: minY,
                    width,
                    height,
                    rotation: 0,
                    z: maxZ,
                    opacity: 1,
                    shape: 'none',
                    caption: '', showCaption: false,
                    cropZoom: 1,
                    fit: 'fill',
                    focusX: 50,
                    focusY: 50,
                    layer,
                });
            }, false);
            this.setSelection([newId]);
            this.selectionAnchor = newId;
            await this.refreshAssets?.();
            this.notify(`已合并为 1 个图层（原 ${items.length} 个）`);
        } catch (error) {
            console.error(error);
            this.notify(`合并失败：${error.message || error}`);
        }
    }

    moveLayer(where) {
        const items = this.selectedElements();
        if (!items.length) return this.notify('请先选择要调整层级的元素');
        const ids = new Set(items.map(item => item.id));
        this.mutate(() => {
            if (where === 'front') {
                let top = this.nextZ();
                for (const item of items) item.z = top++;
            } else {
                const bottom = Math.min(...this.config.elements
                    .filter(element => !ids.has(element.id))
                    .map(element => Number(element.z) || 0), 0) - items.length;
                let cursor = bottom;
                for (const item of items) item.z = cursor++;
            }
        }, false);
    }

    async exportConfig() {
        try {
            const records=await new StudioRepository(this.store,this.key).roleRecords();
            const backup = await this.store.exportCharacter(this.config,{embedBuiltin:true,extraConfigs:records.map(r=>r.config)});
            backup.studioRecords=records;
            const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
            const safeName = String(this.character.name || 'STARGAZE').replace(/[\\/:*?"<>|]/g, '_');
            this.downloadBlob(blob, `STARGAZE-备份-${safeName}.json`);
            this.notify('已导出当前角色的配置与素材');
        } catch (error) {
            console.error(error);
            this.notify(`导出失败：${error.message || error}`);
        }
    }

    applyTemplate(templateId, layout = '') {
        const packages=themePackages();if(packages&&!packages.ready(templateId)){openPackagePanel(this,{focusId:templateId});return;}
        this.commitSizeDraft();
        const previousId = this.config.templateId;
        const drafts = clone(this.config.templateSizeDrafts || {});
        drafts[previousId] = clone(this.config.sizes || {});
        // A theme's independent size drafts belong to that theme, rather than
        // leaking into the next template when the user changes the style.
        const sizes = clone(drafts[templateId] || {});
        this.config = applyBuiltInTemplate(this.config, templateId, layout);
        this.config.templateSizeDrafts = drafts;
        this.config.sizes = sizes;
        const key = this.currentSizeKey();
        this.config.sizeKey = key;
        this.config.sizes = { ...this.config.sizes, [key]: clone(captureSizeState(this.config)) };
    }

    randomize(styleOnly = false) {
        const packages=themePackages();
        const pool = TEMPLATE_LIST.filter(template => template.id !== 'free'&&(!packages||packages.ready(template.id)));
        if(!pool.length){openPackagePanel(this);return;}
        const style = pool[Math.floor(Math.random() * pool.length)];
        const layouts = Object.keys(CANVAS_PRESETS);
        const layout = styleOnly ? this.config.layout : layouts[Math.floor(Math.random() * layouts.length)];
        this.selectedId = null;
        this.selection = [];
        this.mutate(() => {
            this.applyTemplate(style.id, layout);
            this.config.characterKey = this.key;
            this.config.nickname = this.character.name || this.config.nickname;
        });
        this.notify(`随机换到「${style.name}」${styleOnly ? '' : ` · ${LAYOUTS[layout]?.name || layout}`}`);
    }

    showContextMenu(event) {
        const menu = this.overlay?.querySelector('.star-context-menu');
        if (!menu) return;
        menu.hidden = false;
        const width = menu.offsetWidth || 160;
        const height = menu.offsetHeight || 260;
        const left = Math.min(window.innerWidth - width - 8, Math.max(8, event.clientX));
        const top = Math.min(window.innerHeight - height - 8, Math.max(8, event.clientY));
        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
    }

                                                    
    fitSelectedToContent() {
        const element = this.selectedElement();
        if (!element) return;
        const node = this.stage?.querySelector(`.stargaze-element[data-element-id="${element.id}"]`);
        const stageRect = this.stage?.getBoundingClientRect();
        if (!node || !stageRect?.width) return;
        const px = this.config.canvas.width / stageRect.width;
        const centerX = element.x + element.width / 2;
        const centerY = element.y + element.height / 2;
        let nextWidth = 0;
        let nextHeight = 0;
        if (element.type === 'text' || element.type === 'sticker') {
            const range = document.createRange();
            range.selectNodeContents(node);
            const rect = range.getBoundingClientRect();
            if (!rect.width || !rect.height) {
                this.notify('这段文字是空的，没东西可贴合');
                return;
            }
            nextWidth = rect.width * px + 4;
            nextHeight = rect.height * px + 4;
        } else if (element.type === 'image') {
            const img = node.querySelector('img');
            const nw = Number(img?.naturalWidth) || 0;
            const nh = Number(img?.naturalHeight) || 0;
            if (!nw || !nh) {
                this.notify('图片还没加载完，稍后再试');
                return;
            }
            const fit = Math.min(element.width / nw, element.height / nh);
            nextWidth = nw * fit;
            nextHeight = nh * fit;
        } else {
            this.notify('胶带、蕾丝这类元素本来就是按框画的，不用贴合');
            return;
        }
        const width = Math.max(8, nextWidth);
        const height = Math.max(8, nextHeight);
        this.mutate(() => {
            element.width = width;
            element.height = height;
            element.x = centerX - width / 2;
            element.y = centerY - height / 2;
        });
        this.notify('已把框收到内容大小，周围不会再点错了');
    }

    onContextAction(action) {
        const map = {
            duplicate: () => this.duplicateSelected(),
            merge: () => this.mergeSelected(),
            group: () => this.groupSelected(),
            ungroup: () => this.ungroupSelected(),
            front: () => this.nudgeLayer(1),
            back: () => this.nudgeLayer(-1),
            top: () => this.layerToEdge('top'),
            bottom: () => this.layerToEdge('bottom'),
            fit: () => this.fitSelectedToContent(),
            delete: () => this.deleteSelected(),
        };
        map[action]?.();
    }

    markDirty() {
        this.dirty = true;
        this.editRevision++;
        const status = this.overlay?.querySelector('.star-editor-save-status');
        if (status) status.textContent = this.global.autoSave ? '等待自动保存…' : '有未保存修改';
        clearTimeout(this.saveTimer);
        if (this.global.autoSave) this.saveTimer = setTimeout(() => this.save(), 700);
    }

    async save() {
        if (!this.config || this.closed) return;
        clearTimeout(this.saveTimer);
        if (this.dirty) this.commitSizeDraft();
        const revision = this.editRevision;
        try {
            const repo=new StudioRepository(this.store,this.key);
            const active=this.config.studioSchemeId?await this.store.get('configs',this.config.studioSchemeId):null;
            if(active?.kind==='studio-scheme'&&active.characterKey===this.key)this.config.studioSchemeName=active.name;
            else{delete this.config.studioSchemeId;delete this.config.studioSchemeName;}
            const draft=clone(this.config);
            const saved = await this.store.saveCharacterConfig(draft);
            if(active?.kind==='studio-scheme'&&active.characterKey===this.key)await repo.saveScheme(draft,active.name,active.key);
            this.config.updatedAt = saved.updatedAt;
            if (this.editRevision === revision) this.dirty = false;
            const status = this.overlay?.querySelector('.star-editor-save-status');
            if (status && !this.dirty) status.textContent = this.store.persistent ? '已保存到独立存储'
                : this.store.storageMode === 'localStorage' ? '已保存到浏览器本地' : '仅本次临时保存';
            this.renderer.schedule(0);
            this.onChange?.();
            return true;
        } catch (error) {
            console.error('[STARGAZE] 保存失败', error);
            this.notify(`保存失败：${error.message}`);
            return false;
        }
    }

    // 素材管理：同时收集当前画布、其他尺寸和主题草稿引用的图片。
    async refreshAssets() {
        const [library, owned] = await Promise.all([
            this.store.listLibraryAssets(),
            this.store.getAssetsForOwner(this.key),
        ]);
        const referencedIds = referencedAssets(this.config).filter(id => !isBuiltinAsset(id));
        const missing = [];
        for (const id of referencedIds) {
            if (!library.some(asset => asset.id === id) && !owned.some(asset => asset.id === id)) {
                const referenced = await this.store.getAsset(id);
                if (referenced) missing.push(referenced);
            }
        }
        this.libraryAssets = [...library, ...missing];
        this.ownedAssets = owned;
        for (const asset of [...this.libraryAssets, ...owned]) {
            if (!this.assetUrls.has(asset.id)) this.assetUrls.set(asset.id, URL.createObjectURL(asset.blob));
        }
        this.renderAssets();
    }

    assetCard(asset, trailing = '') {
        return `<div class="star-asset-card"><button type="button" draggable="true" data-asset-drag data-asset-action="place" data-asset-id="${asset.id}" title="${escapeHtml(asset.name)} · 点击或拖入画布"><img src="${escapeHtml(asset.url)}" alt="${escapeHtml(asset.name)}" draggable="false" loading="lazy" decoding="async" /><span>${escapeHtml(asset.name)}</span></button>${trailing}</div>`;
    }

    describeAsset(id) {
        const builtin = BUILTIN_MAP.get(id);
        if (builtin) return { id: builtin.id, name: builtin.name, url: builtin.url };
        if (id === '__avatar__') return { id, name: '角色头像', url: this.avatarUrl };
        const url = this.assetUrls.get(id);
        if (!url) return null;
        const owned = [...this.libraryAssets, ...this.ownedAssets].find(asset => asset.id === id);
        return { id, name: owned?.name || '上传图片', url };
    }

    builtinGroupsMarkup() {
        const groups = new Map();
        const seen=new Set();
        const query = this.assetQuery;
        const matches = asset => {
            const styleMatch = this.assetStyle === 'all'
                || (this.assetStyle === 'basic' ? !asset.styleId&&!asset.themeIds?.length : asset.styleId === this.assetStyle||asset.themeIds?.includes(this.assetStyle));
            if (!styleMatch) return false;
            if(this.assetKind!=='all'&&asset.kind!==this.assetKind)return false;
            if(this.assetColor!=='all'){
                const c=asset.color||'#b8b5af',rgb=[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
                const tag=Math.max(...rgb)-Math.min(...rgb)<35?'neutral':rgb[2]>rgb[0]+10?'cool':rgb[0]>rgb[2]+10?'warm':'neutral';
                if(tag!==this.assetColor)return false;
            }
            if (!query) return true;
            return `${asset.name} ${asset.group} ${asset.styleName || '通用'}`.toLowerCase().includes(query);
        };
        for (const asset of BUILTIN_ASSETS) {
            if (asset.hidden || asset.available===false || !matches(asset)) continue;
            const key=asset.materialHash||asset.url;if(seen.has(key))continue;seen.add(key);
            if (!groups.has(asset.group)) groups.set(asset.group, []);
            groups.get(asset.group).push(asset);
        }
        const filtered = [...groups.values()].flat();
        if (!filtered.length) return '<div class="star-asset-empty">没有找到匹配的素材。<br />试试“樱桃”“胶带”或切换风格。</div>';
        if (query || this.assetStyle !== 'all') {
            return `<details class="star-asset-group" open><summary>筛选结果<small>${filtered.length}</small></summary><div class="star-asset-list">${filtered.map(asset => this.assetCard(asset)).join('')}</div></details>`;
        }
        const recent = this.recentAssets.map(id=>BUILTIN_MAP.get(id)).filter(a=>a&&!a.hidden&&a.available!==false&&matches(a)).filter((a,i,all)=>all.findIndex(b=>(b.materialHash||b.url)===(a.materialHash||a.url))===i).slice(0,12);
        const recentBlock = recent.length
            ? `<details class="star-asset-group" open><summary>最近使用<small>${recent.length}</small></summary><div class="star-asset-list">${recent.map(asset => this.assetCard(asset)).join('')}</div></details>`
            : '';
        const rest = [...groups.entries()].map(([name, items], index) => `
            <details class="star-asset-group" ${index === 0 ? 'open' : ''}>
                <summary>${escapeHtml(name)}<small>${items.length}</small></summary>
                <div class="star-asset-list">${items.map(asset => this.assetCard(asset)).join('')}</div>
            </details>`).join('');
        return recentBlock + rest;
    }

    renderAssets() {
        const box = this.overlay?.querySelector('.star-asset-groups');
        if (!box) return;
        this.overlay.querySelectorAll('[data-asset-tab]').forEach(button => {
            button.classList.toggle('active', button.dataset.assetTab === this.assetTab);
        });
        const styleControl = this.overlay.querySelector('[data-asset-style]');
        if (styleControl) styleControl.disabled = this.assetTab !== 'builtin';
        this.overlay.querySelectorAll('[data-asset-kind],[data-asset-color]').forEach(control=>{control.disabled=this.assetTab!=='builtin';});
        const matches = asset => !this.assetQuery || String(asset.name || '').toLowerCase().includes(this.assetQuery);
        if (this.assetTab === 'builtin') {
            box.innerHTML = this.builtinGroupsMarkup();
            return;
        }
        if (this.assetTab === 'owned') {
            const owned = this.ownedAssets.filter(matches);
            const avatarCard = matches({ name: '角色头像' }) ? this.assetCard({ id: '__avatar__', name: '角色头像', url: this.avatarUrl }) : '';
            const cards = owned.map(asset => this.assetCard(
                { id: asset.id, name: asset.name, url: this.assetUrls.get(asset.id) },
                `<button type="button" class="star-asset-delete" data-asset-action="promote" data-asset-id="${asset.id}" title="放进公共素材库">↑</button>`,
            )).join('');
            box.innerHTML = (avatarCard || cards)
                ? `<div class="star-asset-list">${avatarCard}${cards}</div>`
                : '<div class="star-asset-empty">没有匹配的本角色素材。</div>';
            return;
        }
        const library = this.libraryAssets.filter(matches);
        box.innerHTML = library.length
            ? `<div class="star-asset-list">${library.map(asset => this.assetCard(
                { id: asset.id, name: asset.name, url: this.assetUrls.get(asset.id) },
                `<button type="button" class="star-asset-delete" data-asset-action="delete" data-asset-id="${asset.id}" title="从素材库删除">×</button>`,
            )).join('')}</div>`
            : `<div class="star-asset-empty">${this.assetQuery ? '没有匹配的素材。' : '素材库还是空的。<br />点「＋ 上传」放几张常用图片，之后所有角色都能直接用。'}</div>`;
    }

    async deleteAsset(id) {
        if (!confirm('从素材库移除这张图片？已用于设计中的图片会保留。')) return;
        const saved = [...await this.store.getAll('configs'), ...await this.store.listCustomTemplates()];
        const used = [this.config, ...this.history, ...this.future, ...saved]
            .some(config => referencedAssets(config).includes(id));
        if (used) {
            const asset = await this.store.getAsset(id);
            if (asset) await this.store.put('assets', { ...asset, ownerKey: '__archive__' });
        } else await this.store.deleteAsset(id);
        const url = this.assetUrls.get(id);
        if (url) URL.revokeObjectURL(url);
        this.assetUrls.delete(id);
        this.renderer.releaseAsset(id);
        await this.refreshAssets();
        this.renderAll();
        this.notify(used ? '已从素材库移出，设计中用到的图片仍保留' : '已移除图片');
    }

    async promoteAsset(id) {
        try {
            await this.store.promoteAssetToLibrary(id);
            await this.refreshAssets();
            this.assetTab = 'library';
            this.renderAssets();
            this.notify('已放进公共素材库');
        } catch (error) {
            this.notify(`操作失败：${error.message}`);
        }
    }

    openUpload(replaceId = null) {
        if (replaceId && replaceId === mainPortrait(this.config)?.id) {
            this.notify('主头像跟随角色资料。请在副图位中替换独立图片。');
            return;
        }
        this.replaceTargetId = replaceId;
        const input = this.overlay.querySelector('.star-upload-input');
        input.multiple = !replaceId;
        input.value = '';
        input.click();
    }

    async prepareImage(file) {
        if (file.size <= 2 * 1024 * 1024 || file.type === 'image/gif' || !globalThis.createImageBitmap) return file;
        let bitmap;
        try {
            bitmap = await createImageBitmap(file);
            const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
            if (scale === 1 && file.type === 'image/png') return file;
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(bitmap.width * scale));
            canvas.height = Math.max(1, Math.round(bitmap.height * scale));
            canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
            const blob = await new Promise(resolve => canvas.toBlob(resolve, file.type === 'image/png' ? 'image/png' : 'image/webp', 0.92));
            return blob || file;
        } catch {
            return file;
        } finally { bitmap?.close(); }
    }

    async handleUpload(event) {
        const files = [...event.target.files];
        const replaceId = this.replaceTargetId;
        this.replaceTargetId = null;
        if (!files.length) return;
        let added = 0;
        for (const file of files) {
            if (!file.type.startsWith('image/')) { this.notify(`${file.name} 不是图片`); continue; }
            if (file.size > 15 * 1024 * 1024) { this.notify(`${file.name} 超过 15MB，已跳过`); continue; }
            try {
                const asset = await this.store.saveAsset(await this.prepareImage(file), LIBRARY_OWNER, file.name);
                this.assetUrls.set(asset.id, URL.createObjectURL(asset.blob));
                if (replaceId) {
                    this.pushHistory();
                    // 上传期间可以切换尺寸；按元素 id 更新当时选中的副图，不误替换当前画布。
                    this.config.sizes = clone(this.config.sizes || {});
                    this.config.templateSizeDrafts = clone(this.config.templateSizeDrafts || {});
                    for (const state of configStates(this.config)) for (const target of state.elements) {
                        if (target.id !== replaceId) continue;
                        target.assetId = asset.id;
                        target.cropZoom = 1; target.focusX = 50; target.focusY = 50;
                    }
                } else this.addImage(asset.id);
                added++;
            } catch (error) { this.notify(`${file.name} 上传失败：${error.message}`); }
        }
        if (this.closed) return;
        await this.refreshAssets();
        this.renderAll();
        if (added) {
            this.assetTab = 'library'; this.renderAssets(); this.markDirty();
            this.notify(replaceId ? '已独立替换这张副图；其他照片继续跟随头像' : `已添加 ${added} 张图片到素材库`);
        }
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        anchor.rel = 'noopener';
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
            anchor.remove();
            URL.revokeObjectURL(url);
        }, 2500);
    }

    async exportImage() {
        try {
            if (!this.config) {
                this.notify('还没有可导出的配置');
                return;
            }
            if (!this.config.elements.length) {
                this.notify('画布还是空的，先排版再导出模板');
                return;
            }

            let scope = '1';
            try {
                const answer = prompt(
                    '导出模板：\n1 = 仅当前尺寸\n2 = 全部尺寸（一个模板包，导入后仍是一条「我的模板」）',
                    '1',
                );
                if (answer === null) {
                    this.notify('已取消导出');
                    return;
                }
                scope = String(answer).trim() || '1';
            } catch (err) {
                console.warn(err);
            }
            if (scope === '2') {
                await this.exportTemplatePack();
                return;
            }
            await this.exportCurrentTemplate();
        } catch (error) {
            console.error(error);
            this.notify(`导出失败：${error.message || error}`);
        }
    }

    async exportPng() {
        if(!await openPreflight(this,{gate:true})||this.closed)return;
        const button = this.overlay?.querySelector('[data-action="export-png"]');
        if (button) button.disabled = true;
        try {
            const { blob } = await renderCollageBlob(this.config, {
                avatarUrl: this.avatarUrl, assetUrls: this.assetUrls,
                fields: characterFields(this.character), quality: 2,
            });
            if (!blob) throw new Error('图片生成失败');
            const name = String(this.character.name || 'STARGAZE').replace(/[\\/:*?"<>|]/g, '_');
            this.downloadBlob(blob, `${name}-${this.currentSizeKey()}.png`);
            this.notify('当前画布已保存为 PNG');
        } catch (error) { this.notify(`图片导出失败：${error.message}`); }
        finally { if (button) button.disabled = false; }
    }

    async exportCurrentTemplate() {
        if(!await openPreflight(this,{gate:true})||this.closed)return;
        const defaultName = this.config.shareMetadata?.title||`${this.character.name || '我的'} · ${LAYOUTS[this.config.layout]?.name || '当前尺寸'}`;
        let finalName = defaultName;
        try {
            const name = prompt('模板名称：', defaultName);
            if (name === null) {
                this.notify('已取消导出');
                return;
            }
            finalName = name.trim() || defaultName;
        } catch (_) {                       }

        const button = this.overlay.querySelector('[data-action="export-image"]');
        const original = button?.textContent;
        if (button) {
            button.disabled = true;
            button.textContent = '导出中…';
        }
        this.notify('正在打包模板…');
        try {
            try { await this.save(); } catch (_) {          }
            const backup = await this.store.exportCharacter(templateConfig(this.config), { embedBuiltin: true });
            const cleaned = templateConfig(this.config);
            delete cleaned.characterKey;
            delete cleaned.updatedAt;
            delete cleaned.sizes;
            delete cleaned.sizeKey;
            const pack = {
                type: 'STARGAZE_TEMPLATE_PACK',
                version: 2,
                appVersion: APP_VERSION,
                metadata:normalizeMetadata(this.config.shareMetadata),
                name: String(finalName).slice(0, 80),
                exportedAt: new Date().toISOString(),
                assets: backup.assets || [],
                config: cleaned,
                variants: [{
                    layout: this.config.layout,
                    name: LAYOUTS[this.config.layout]?.name || this.config.layout,
                    config: cleaned,
                }],
            };
            const blob = new Blob([JSON.stringify(pack)], { type: 'application/json' });
            const file = `STARGAZE-模板-${String(finalName).replace(/[\\/:*?"<>|]/g, '_')}.json`;
            this.downloadBlob(blob, file);
            this.notify(`已导出模板「${finalName}」`);
        } catch (error) {
            console.error(error);
            this.notify(`导出失败：${error.message || error}`);
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = original || '导出模板';
            }
        }
    }

    variantConfigFor(presetId) {
        if (presetId === this.currentSizeKey()) return clone(this.config);
        const saved = this.config.sizes?.[presetId];
        const base = clone(this.config);
        const state = saved ? clone(saved) : clone(freshSizeState(this.config, presetId));
        return applySizeState(base, state);
    }

    variantPayload(presetId) {
        return templateConfig(this.variantConfigFor(presetId));
    }

    // 导入导出：模板包包含九尺寸及其全部图片，角色备份另保留工作草稿。
    async exportTemplatePack() {
        if(!await openPreflight(this,{all:true,gate:true})||this.closed)return;
        let packName = this.config.shareMetadata?.title||`${this.character.name || '我的'} · 全尺寸`;
        try {
            const answer = prompt('模板包名称：', packName);
            if (answer === null) {
                this.notify('已取消导出');
                return;
            }
            if (answer.trim()) packName = answer.trim();
        } catch (_) {       }

        const button = this.overlay.querySelector('[data-action="export-image"]');
        const original = button?.textContent;
        if (button) {
            button.disabled = true;
            button.textContent = '打包中…';
        }
        this.notify('正在打包全尺寸模板…');
        try {
            try { await this.save(); } catch (_) {       }
            const variants = Object.keys(CANVAS_PRESETS).map(presetId => ({
                layout: presetId, name: LAYOUTS[presetId]?.name || presetId,
                config: this.variantPayload(presetId),
            }));
            const base = await this.store.exportCharacter({ ...templateConfig(this.config), variants }, { embedBuiltin: true });
            const primary = variants.find(v => v.layout === this.config.layout) || variants[0];
            const pack = {
                type: 'STARGAZE_TEMPLATE_PACK',
                version: 2,
                appVersion: APP_VERSION,
                metadata:normalizeMetadata(this.config.shareMetadata),
                name: String(packName).slice(0, 80),
                exportedAt: new Date().toISOString(),
                assets: base.assets || [],
                config: primary.config,
                variants,
            };
            const blob = new Blob([JSON.stringify(pack)], { type: 'application/json' });
            const file = `STARGAZE-模板包-${String(packName).replace(/[\\/:*?"<>|]/g, '_')}.json`;
            this.downloadBlob(blob, file);
            this.notify(`已导出模板包「${packName}」（${variants.length} 个尺寸）`);
        } catch (error) {
            console.error(error);
            this.notify(`导出模板包失败：${error.message || error}`);
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = original || '导出模板';
            }
        }
    }

    async handleImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        try {
            const backup = JSON.parse(await file.text());
            if ((backup?.type === 'STARGAZE_TEMPLATE_PACK' || backup?.type === 'STAR_IDOL_TEMPLATE_PACK')) {
                const name = await this.importTemplatePack(backup);
                this.notify(`已导入「${name}」到我的模板（一套一条）`);
                await this.refreshCustomTemplates();
                await this.refreshAssets();
                return;
            }
            const imported = await this.store.importCharacter(backup, this.key, this.character.name);
            const addedAssets = Number(imported.importedAssets) || 0;
            delete imported.importedAssets;
            this.config = imported;
            if (!LAYOUTS[this.config.sizeKey]) this.config.sizeKey = this.config.layout;
            if (!this.config.sizes || typeof this.config.sizes !== 'object') this.config.sizes = {};
            this.selectedId = null;
            this.history = [];
            this.future = [];
            await this.refreshAssets();
            this.renderAll();
            this.dirty = false;
            this.renderer.schedule(0);
            this.notify(addedAssets
                ? `备份已导入当前角色，${addedAssets} 张图片已收进公共素材库`
                : '备份已导入当前角色');
        } catch (error) {
            this.notify(`导入失败：${error.message}`);
        } finally {
            event.target.value = '';
        }
    }

    async importTemplatePack(pack) {
        const saved = await this.store.importTemplatePack(pack, this.key, this.character.name);
        return saved.name;
    }

    async refreshCustomTemplates() {
        const templates = await this.store.listCustomTemplates();
        const container = this.overlay?.querySelector('.star-custom-templates');
        if (!container||this.closed) return;
        for(const template of templates){
            const id=normalizeMetadata(template.metadata||template.config?.shareMetadata).coverAssetId;
            if(id&&!this.assetUrls.has(id)){const asset=await this.store.getAsset(id);if(this.closed)return;if(asset?.blob&&!this.assetUrls.has(id))this.assetUrls.set(id,URL.createObjectURL(asset.blob));}
        }
        if(!container.isConnected||this.closed)return;
        container.innerHTML = templates.length ? templates.map(template => {
            const n = Array.isArray(template.variants) ? template.variants.length : 1,meta=normalizeMetadata(template.metadata||template.config?.shareMetadata),cover=this.assetUrls.get(meta.coverAssetId);
            const sizeHint = n > 1 ? `<small class="star-custom-template-meta">${n} 个尺寸</small>` : '';
            return `<div class="star-custom-template">
                <button type="button" data-custom-action="apply" data-template-id="${template.id}">
                    ${cover?`<img class="star-template-cover" src="${escapeHtml(cover)}" alt="${escapeHtml(template.name)}封面" loading="lazy">`:''}
                    <span>${escapeHtml(template.name)}</span>${sizeHint}${meta.author?`<small>${escapeHtml(meta.author)}</small>`:''}
                </button>
                <button type="button" data-custom-action="delete" data-template-id="${template.id}" title="删除模板">×</button>
                ${meta.description||meta.source?`<details class="star-template-description"><summary>模板介绍</summary><p>${escapeHtml(meta.description)}</p><small>${escapeHtml(meta.source)}</small></details>`:''}
            </div>`;
        }).join('') : '<small>还没有个人模板。可「保存当前」或导入模板包。</small>';
    }

    async saveCustomTemplate() {

        const snapshot = clone(this.config);
        if (!snapshot?.elements?.length) {
            this.notify('画布是空的，先排版再保存到我的模板');
            return;
        }
        const name = prompt('给这个模板起个名字：', `${this.character.name || '我的'} · 修改稿`);
        if (!name?.trim()) return;
        const allSizes = confirm('是否把这个模板存成全部画布尺寸？\n确定 = 一套里含全尺寸（每个尺寸用各自独立的那份稿；没改过的用内置构图）\n取消 = 只存当前尺寸');
        let variants;
        if (allSizes) {
            variants = [];
            for (const presetId of Object.keys(CANVAS_PRESETS)) {
                variants.push({
                    layout: presetId,
                    name: LAYOUTS[presetId]?.name || presetId,
                    config: this.variantPayload(presetId),
                });
            }
        }
        await this.store.saveCustomTemplate(name.trim(), snapshot, { variants });
        await this.refreshCustomTemplates();
        this.notify(allSizes
            ? `已把「当前修改稿」存入我的模板（含 ${variants.length} 个尺寸）`
            : '已把「当前修改稿」存入我的模板（仅当前尺寸）');
    }

    async applyCustomTemplate(id) {
        const template = (await this.store.listCustomTemplates()).find(item => item.id === id);
        if (!template?.config) { this.notify('找不到这个个人模板'); return; }
        if (!confirm(`套用「${template.name}」？可以撤销恢复当前设计。`)) return;
        this.pushHistory();
        this.commitSizeDraft();
        const currentKey = this.currentSizeKey();
        const sizes = {};
        for (const variant of template.variants || []) {
            if (!variant?.config) continue;
            const key = LAYOUTS[variant.layout] ? variant.layout : variant.config.layout;
            if (LAYOUTS[key]) sizes[key] = clone(captureSizeState(variant.config));
        }
        const fallback = template.config.layout === currentKey ? clone(template.config)
            : (LAYOUTS[currentKey] ? setCanvasPreset(clone(template.config), currentKey) : clone(template.config));
        const state = sizes[currentKey] || captureSizeState(fallback);
        this.config = applySizeState({ ...this.config, sizes }, state);
        this.config.templateId = template.config.templateId;
        this.config.shareMetadata=normalizeMetadata(template.metadata||template.config.shareMetadata);
        this.config.sizeKey = currentKey;
        this.config.characterKey = this.key;
        this.config.nickname = this.character.name || this.config.nickname;
        this.config.sizes[currentKey] = clone(captureSizeState(this.config));
        this.selectedId = null; this.selection = [];
        await this.refreshAssets();
        this.renderAll(); this.markDirty();
        this.notify(`已套用「${template.name}」，可撤销，各尺寸独立保存`);
    }

    resetTheme() { openTemplateUpdate(this); }

    async deleteCustomTemplate(id) {
        if (!confirm('确定删除这个个人模板吗？角色已经应用的拼贴不会受影响。')) return;
        await this.store.deleteCustomTemplate(id);
        await this.refreshCustomTemplates();
    }

    stagePoint(event) {
        const rect = this.stage.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) / rect.width * this.config.canvas.width,
            y: (event.clientY - rect.top) / rect.height * this.config.canvas.height,
        };
    }

    snapDraggedElement(element) {
        const { width: W, height: H } = this.config.canvas;
        const rect = this.stage.getBoundingClientRect();
        const thresholdX = 7 * W / Math.max(1, rect.width);
        const thresholdY = 7 * H / Math.max(1, rect.height);
        const snap = (values, targets, threshold) => {
            let best = null;
            for (const value of values) {
                for (const target of targets) {
                    const distance = Math.abs(value.value - target);
                    if (distance <= threshold && (!best || distance < best.distance)) best = { ...value, target, distance };
                }
            }
            return best;
        };
        const x = snap([
            { value: element.x + element.width / 2, delta: element.width / 2 },
            { value: element.x, delta: 0 },
            { value: element.x + element.width, delta: element.width },
        ], [0, W / 2, W], thresholdX);
        const y = snap([
            { value: element.y + element.height / 2, delta: element.height / 2 },
            { value: element.y, delta: 0 },
            { value: element.y + element.height, delta: element.height },
        ], [0, H / 2, H], thresholdY);
        if (x) element.x = x.target - x.delta;
        if (y) element.y = y.target - y.delta;
        this.snapGuides = { x: x?.target ?? null, y: y?.target ?? null };
    }

    renderSnapGuides() {
        if (!this.stage) return;
        const { width: W, height: H } = this.config.canvas;
        for (const axis of ['x', 'y']) {
            const value = this.snapGuides[axis];
            if (value == null) continue;
            const guide = document.createElement('i');
            guide.className = `star-snap-guide star-snap-guide-${axis}`;
            if (axis === 'x') guide.style.left = `${value / W * 100}%`;
            else guide.style.top = `${value / H * 100}%`;
            this.stage.append(guide);
        }
    }

    onWheel(event) {
        if (!this.config) return;

        if (event.ctrlKey || event.metaKey) return;
        if (!event.target.closest?.('.star-editor-avatar-guide')) return;
        event.preventDefault();
        const current = clampFrame(this.config.avatar?.frame);
        const next = clampFrame(current + (event.deltaY > 0 ? -0.08 : 0.08));
        if (next === current) return;
        if (!this.wheelHistory) {
            this.pushHistory();
            this.wheelHistory = true;
        }
        this.config.avatar = { ...(this.config.avatar || {}), frame: next };
        this.syncAvatarGuide();
        this.syncFocusControls();
        this.dirty = true;
        clearTimeout(this.wheelCommit);
        this.wheelCommit = setTimeout(() => {
            this.wheelHistory = false;
            this.renderInspector();
            this.markDirty();
        }, 320);
    }

                                                    
    localHit(element, point) {
        const w = Math.max(1, Number(element.width) || 1);
        const h = Math.max(1, Number(element.height) || 1);
        const cx = element.x + w / 2;
        const cy = element.y + h / 2;
        const rad = -(Number(element.rotation) || 0) * Math.PI / 180;
        const dx = point.x - cx;
        const dy = point.y - cy;
        const lx = dx * Math.cos(rad) - dy * Math.sin(rad) + w / 2;
        const ly = dx * Math.sin(rad) + dy * Math.cos(rad) + h / 2;
        const stageWidth = this.stage?.getBoundingClientRect().width || 0;
        const tol = stageWidth > 0 ? (8 * this.config.canvas.width) / stageWidth : 0;
        if (lx < -tol || ly < -tol || lx > w + tol || ly > h + tol) return null;
        return { lx, ly, w, h, tol };
    }

        
                           
                                          
                                    
       
    hitsVisibleContent(element, node, event) {
        if (element.type === 'text' || element.type === 'sticker') {
            if (node) {
                const range = document.createRange();
                range.selectNodeContents(node);
                const rects = [...range.getClientRects()].filter(rect => rect.width > 0 && rect.height > 0);
                if (rects.length) {
                    const pad = 6;
                    return rects.some(rect => (
                        event.clientX >= rect.left - pad && event.clientX <= rect.right + pad
                        && event.clientY >= rect.top - pad && event.clientY <= rect.bottom + pad
                    ));
                }
            }
            return true;
        }
        const hit = this.localHit(element, this.stagePoint(event));
        if (!hit) return false;
        if (element.type !== 'image') return true;
        if (element.shape && element.shape !== 'none' && element.shape !== 'rect') {
            const nx = hit.lx / hit.w;
            const ny = hit.ly / hit.h;
            const padX = hit.tol / hit.w;
            const padY = hit.tol / hit.h;
            const onShape = photoShapeHit(element.shape, nx, ny)
                || photoShapeHit(element.shape, nx + padX, ny)
                || photoShapeHit(element.shape, nx - padX, ny)
                || photoShapeHit(element.shape, nx, ny + padY)
                || photoShapeHit(element.shape, nx, ny - padY);
            if (!onShape) return false;
        }
        if (element.fit === 'contain') {
            const img = node?.querySelector('img');
            const nw = Number(img?.naturalWidth) || 0;
            const nh = Number(img?.naturalHeight) || 0;
            if (nw > 0 && nh > 0) {
                const fit = Math.min(hit.w / nw, hit.h / nh);
                const padX = (hit.w - nw * fit) / 2;
                const padY = (hit.h - nh * fit) / 2;
                if (hit.lx < padX - hit.tol || hit.lx > hit.w - padX + hit.tol) return false;
                if (hit.ly < padY - hit.tol || hit.ly > hit.h - padY + hit.tol) return false;
            }
        }
        return true;
    }

    stackAtPoint(point) {
        if (!this.config || !point) return [];
        const mainId = mainPortrait(this.config)?.id;
        return this.config.elements
            .filter(element => !isElementHidden(this.config, element) && element.id !== mainId)
            .filter(element => this.localHit(element, point))
            .sort((a, b) => {
                const la = a.layer === 'front' ? 1 : 0;
                const lb = b.layer === 'front' ? 1 : 0;
                if (la !== lb) return lb - la;
                return (Number(b.z) || 0) - (Number(a.z) || 0);
            })
            .map(element => element.id);
    }

    onPointerDown(event) {

        if (event.target.closest('.star-avatar-bar')) {
            event.stopPropagation();
            return;
        }

        if (event.button !== 0 && event.pointerType === 'mouse') return;

        if (this.spaceDown && this.scrollBox) {
            event.preventDefault();
            this.panning = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                left: this.scrollBox.scrollLeft,
                top: this.scrollBox.scrollTop,
            };
            this.scrollBox.classList.add('star-panning');
            return;
        }
        let guide = event.target.closest('.star-editor-avatar-guide, .star-avatar-control-layer');
        if (guide && !this.gesture && !this.avatarDrag) {
            event.preventDefault();
            const handle = event.target.closest('[data-avatar-handle]')?.dataset.avatarHandle || 'move';
            this.selectElement(null);
            guide = this.stage.querySelector('.star-editor-avatar-guide');
            this.stage.setPointerCapture(event.pointerId);
            const rect = guide.getBoundingClientRect();
            const mode = ['zoom', 'width', 'height', 'rotate'].includes(handle)
                ? handle
                : ((handle === 'focus' || event.shiftKey) ? 'focus' : 'anchor');
            if (mode === 'focus' && clampFrame(this.config.avatar?.frame) <= 1.01) {

                this.config.avatar = { ...(this.config.avatar || {}), frame: 1.5 };
                this.syncFocusControls();
                this.syncAvatarGuide();
            }
            const startPoint = this.stagePoint(event);
            const centerX = this.config.canvas.anchorX * this.config.canvas.width;
            const centerY = this.config.canvas.anchorY * this.config.canvas.height;
            this.avatarDrag = {
                pointerId: event.pointerId,
                startPoint,
                startAnchor: { x: this.config.canvas.anchorX, y: this.config.canvas.anchorY },
                startFocus: { x: clampFocus(this.config.avatar?.focusX), y: clampFocus(this.config.avatar?.focusY) },
                startZoom: Number(this.config.avatar?.zoom) || 1,
                startRotate: clampRotate(this.config.avatar?.rotate),
                startShapeRotate: shapeRotateOf(this.config),
                shapeLocked: !shapeFollowsPhoto(this.config),
                startAngle: Math.atan2(startPoint.y - centerY, startPoint.x - centerX) * 180 / Math.PI,
                startBox: {
                    width: clampAvatarBox(this.config.avatar?.widthRatio),
                    height: clampAvatarBox(this.config.avatar?.heightRatio),
                },
                mode,
                guideWidth: Math.max(1, rect.width),
                guideHeight: Math.max(1, rect.height),
                historyPushed: false,
            };
            this.showAvatarBar();
            guide.dataset.dragging = 'true';
            this.stage.classList.add('star-dragging', 'star-drag-preview');
            return;
        }
        let node = event.target.closest('.stargaze-element');
        let hitEl = node
            ? this.config.elements.find(item => item.id === node.dataset.elementId)
            : null;

                                             
                                          
        const onHandle = Boolean(event.target.closest('[data-handle]'));
        if (!onHandle && hitEl && !hitEl.locked && !this.hitsVisibleContent(hitEl, node, event)) {
            const point = this.stagePoint(event);
            const fallback = this.stackAtPoint(point)
                .filter(id => id !== hitEl.id)
                .map(id => this.config.elements.find(item => item.id === id))
                .find(item => item && this.hitsVisibleContent(
                    item,
                    this.stage.querySelector(`.stargaze-element[data-element-id="${item.id}"]`),
                    event,
                ));
            if (fallback) {
                hitEl = fallback;
                node = this.stage.querySelector(`.stargaze-element[data-element-id="${fallback.id}"]`) || node;
            } else {
                node = null;
                hitEl = null;
            }
        }

        const isBleedBg = hitEl && hitEl.width >= this.config.canvas.width * 0.88
            && hitEl.height >= this.config.canvas.height * 0.88
            && hitEl.x <= this.config.canvas.width * 0.08
            && hitEl.y <= this.config.canvas.height * 0.08;

        const forceMarquee = event.altKey || isBleedBg;
        if (!node || forceMarquee) {
            if (!this.gesture) {
                event.preventDefault();
                if (!(event.ctrlKey || event.metaKey || event.shiftKey)) {
                    this.selectElement(null);
                    this.selectionAnchor = null;
                }
                this.startMarquee(event);
            }
            return;
        }
        const hitId = node.dataset.elementId;

        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            this.selectWithModifiers(hitId, { additive: true });
            return;
        }
        if (event.shiftKey) {
            event.preventDefault();
            this.selectWithModifiers(hitId, { range: true });
            return;
        }

        this.pendingCycle = (!event.target.closest('[data-handle]')
            && this.selection.length === 1 && this.selection[0] === hitId)
            ? { id: hitId, cx: event.clientX, cy: event.clientY }
            : null;

        if (!this.selection.includes(hitId)) {
            this.selectElement(hitId);
            this.selectionAnchor = hitId;
        }
        const element = this.selectedElement();
        if (!element) return;
        if (element.locked) {
            this.notify('这个元素已锁定：先在图层列表里解锁再拖');
            return;
        }
        event.preventDefault();
        this.stage.setPointerCapture(event.pointerId);
        const point = this.stagePoint(event);
        if (!this.gesture) {
            const handle = event.target.closest('[data-handle]')?.dataset.handle || 'drag';
            const center = { x: element.x + element.width / 2, y: element.y + element.height / 2 };
            this.overlay?.classList.add('star-is-gesturing');
            this.gesture = {
                pointers: new Map([[event.pointerId, point]]), mode: handle,
                startElement: clone(element), startPoint: point, center,

                startGroup: this.selectedElements().map(item => clone(item)),
                startDistance: Math.hypot(point.x - center.x, point.y - center.y) || 1,
                startAngle: Math.atan2(point.y - center.y, point.x - center.x),
                historyPushed: false,
            };
        } else {
            this.gesture.pointers.set(event.pointerId, point);
            const points = [...this.gesture.pointers.values()];
            this.gesture.mode = 'pinch';
            this.gesture.startElement = clone(element);
            this.gesture.startDistance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) || 1;
            this.gesture.startAngle = Math.atan2(points[0].y - points[1].y, points[0].x - points[1].x);
        }
        this.stage.classList.add('star-dragging', 'star-drag-preview');
    }

    startMarquee(event) {
        const rect = this.stage.getBoundingClientRect();
        this.marquee = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            rect,
            moved: false,
            box: null,
            additive: !!(event.ctrlKey || event.metaKey || event.shiftKey),
            baseSelection: (event.ctrlKey || event.metaKey || event.shiftKey) ? [...this.selection] : [],
        };
        this.overlay?.classList.add('star-is-marquee');
        try { this.stage.setPointerCapture(event.pointerId); } catch (_) {               }
        window.getSelection?.()?.removeAllRanges?.();
    }

    ensureGestureHistory() {
        if (!this.gesture.historyPushed) {
            this.pushHistory();
            this.gesture.historyPushed = true;
        }
    }

        
                                
                                 
       
    applyElementScale(element, start, scale) {
        element.width = clamp(start.width * scale, 8, 1400);
        element.height = clamp(start.height * scale, 8, 1400);
        if (element.type !== 'text' && element.type !== 'sticker') return;
        const startFont = Number(start.fontSize) || 0;
        if (startFont <= 0) return;
        const applied = Math.min(
            element.width / Math.max(1, start.width),
            element.height / Math.max(1, start.height),
        );
        element.fontSize = Math.max(4, Math.min(420, Math.round(startFont * applied * 100) / 100));
    }

    onPointerMove(event) {
        if (this.panning && this.panning.pointerId === event.pointerId) {
            event.preventDefault();
            this.scrollBox.scrollLeft = this.panning.left - (event.clientX - this.panning.startX);
            this.scrollBox.scrollTop = this.panning.top - (event.clientY - this.panning.startY);
            return;
        }
        if (this.marquee && this.marquee.pointerId === event.pointerId) {
            event.preventDefault();
            window.getSelection?.()?.removeAllRanges?.();
            const dx = event.clientX - this.marquee.startX;
            const dy = event.clientY - this.marquee.startY;
            if (!this.marquee.moved && Math.hypot(dx, dy) < 4) return;
            this.marquee.moved = true;

            this.marquee.rect = this.stage.getBoundingClientRect();
            if (!this.marquee.box) {
                this.marquee.box = document.createElement('div');
                this.marquee.box.className = 'star-marquee';
                this.stage.append(this.marquee.box);
            }
            const rect = this.marquee.rect;
            const left = Math.min(this.marquee.startX, event.clientX) - rect.left;
            const top = Math.min(this.marquee.startY, event.clientY) - rect.top;
            this.marquee.box.style.left = `${left}px`;
            this.marquee.box.style.top = `${top}px`;
            this.marquee.box.style.width = `${Math.abs(dx)}px`;
            this.marquee.box.style.height = `${Math.abs(dy)}px`;
            return;
        }
        if (this.avatarDrag && this.avatarDrag.pointerId === event.pointerId) {
            event.preventDefault();
            if (!this.avatarDrag.historyPushed) {
                this.pushHistory();
                this.avatarDrag.historyPushed = true;
            }
            const point = this.stagePoint(event);
            const { width, height } = this.config.canvas;
            const units = avatarUnits(this.config.canvas) || 1;
            const startBox = this.avatarDrag.startBox;
            if (this.avatarDrag.mode === 'zoom') {
                const dx = (point.x - this.avatarDrag.startPoint.x) / this.avatarDrag.guideWidth;
                const dy = (point.y - this.avatarDrag.startPoint.y) / this.avatarDrag.guideHeight;
                const maxByHeight = height * 0.72 / Math.max(0.01, units * startBox.height);
                const next = clamp(this.avatarDrag.startZoom * (1 + (dx + dy) * 1.5), AVATAR_ZOOM.min, Math.min(AVATAR_ZOOM.max, maxByHeight));
                this.config.avatar = { ...(this.config.avatar || {}), zoom: Math.round(next * 100) / 100 };
                this.syncAvatarGuide();
                this.dirty = true;
                return;
            }
            if (this.avatarDrag.mode === 'rotate') {
                const cx = this.config.canvas.anchorX * width;
                const cy = this.config.canvas.anchorY * height;
                const angle = Math.atan2(point.y - cy, point.x - cx) * 180 / Math.PI;
                let next = clampRotate(this.avatarDrag.startRotate + (angle - this.avatarDrag.startAngle));
                if (event.shiftKey) next = clampRotate(Math.round(next / AVATAR_ROTATE.snap) * AVATAR_ROTATE.snap);
                const delta = next - this.avatarDrag.startRotate;
                const avatarNext = { ...(this.config.avatar || {}), rotate: next };
                if (this.avatarDrag.shapeLocked) {
                    avatarNext.shapeRotate = clampRotate(this.avatarDrag.startShapeRotate + delta);
                }
                this.config.avatar = avatarNext;
                this.syncAvatarGuide();
                this.dirty = true;
                return;
            }
            if (this.avatarDrag.mode === 'width') {
                const dx = (point.x - this.avatarDrag.startPoint.x) / this.avatarDrag.guideWidth;
                const next = clampAvatarBox(startBox.width * (1 + dx * 1.6));
                this.config.avatar = { ...(this.config.avatar || {}), widthRatio: next };
                this.syncAvatarGuide();
                this.dirty = true;
                return;
            }
            if (this.avatarDrag.mode === 'height') {
                const dy = (point.y - this.avatarDrag.startPoint.y) / this.avatarDrag.guideHeight;
                const zoom = Number(this.config.avatar?.zoom) || 1;
                const maxByHeight = clampAvatarBox(height * 0.72 / Math.max(0.01, units * zoom));
                const next = Math.min(clampAvatarBox(startBox.height * (1 + dy * 1.6)), maxByHeight);
                this.config.avatar = { ...(this.config.avatar || {}), heightRatio: next };
                this.syncAvatarGuide();
                this.dirty = true;
                return;
            }
            if (this.avatarDrag.mode === 'focus') {

                const dx = (point.x - this.avatarDrag.startPoint.x) / this.avatarDrag.guideWidth * 100;
                const dy = (point.y - this.avatarDrag.startPoint.y) / this.avatarDrag.guideHeight * 100;
                this.config.avatar = {
                    ...(this.config.avatar || {}),
                    focusX: clampFocus(this.avatarDrag.startFocus.x - dx),
                    focusY: clampFocus(this.avatarDrag.startFocus.y - dy),
                };
                this.syncAvatarGuide();
                this.syncFocusControls();
                this.dirty = true;
                return;
            }
            const dx = (point.x - this.avatarDrag.startPoint.x) / Math.max(1, width);
            const dy = (point.y - this.avatarDrag.startPoint.y) / Math.max(1, height);
            this.config.canvas.anchorX = clamp(this.avatarDrag.startAnchor.x + dx, 0.05, 0.95);
            this.config.canvas.anchorY = clamp(this.avatarDrag.startAnchor.y + dy, 0.05, 0.95);
            this.syncAvatarGuide();
            this.syncAnchorControls();
            this.dirty = true;
            return;
        }
        if (!this.gesture?.pointers.has(event.pointerId)) return;
        event.preventDefault();
        this.gesture.pointers.set(event.pointerId, this.stagePoint(event));
        if (this.gesture.mode === 'settled') return;
        this.ensureGestureHistory();
        const element = this.selectedElement();
        if (!element) return;
        const start = this.gesture.startElement;
        const points = [...this.gesture.pointers.values()];
        if (points.length >= 2) {
            const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) || 1;
            const angle = Math.atan2(points[0].y - points[1].y, points[0].x - points[1].x);
            const scale = clamp(distance / this.gesture.startDistance, 0.15, 6);
            this.applyElementScale(element, start, scale);
            element.rotation = start.rotation + (angle - this.gesture.startAngle) * 180 / Math.PI;
        } else if (this.gesture.mode === 'drag') {
            const point = points[0];
            element.x = start.x + point.x - this.gesture.startPoint.x;
            element.y = start.y + point.y - this.gesture.startPoint.y;
            if (event.altKey) this.snapGuides = { x: null, y: null };
            else this.snapDraggedElement(element);

            const movedX = element.x - start.x;
            const movedY = element.y - start.y;
            for (const ghost of this.gesture.startGroup) {
                if (ghost.id === element.id) continue;
                const target = this.config.elements.find(item => item.id === ghost.id);
                if (!target || target.locked) continue;
                target.x = ghost.x + movedX;
                target.y = ghost.y + movedY;
            }
        } else if (this.gesture.mode === 'resize') {
            const point = points[0];
            const distance = Math.hypot(point.x - this.gesture.center.x, point.y - this.gesture.center.y);
            const scale = clamp(distance / this.gesture.startDistance, 0.15, 6);
            this.applyElementScale(element, start, scale);
            element.x = this.gesture.center.x - element.width / 2;
            element.y = this.gesture.center.y - element.height / 2;
        } else if (this.gesture.mode === 'rotate') {
            const point = points[0];
            const angle = Math.atan2(point.y - this.gesture.center.y, point.x - this.gesture.center.x);
            element.rotation = start.rotation + (angle - this.gesture.startAngle) * 180 / Math.PI;
        }
        this.scheduleLiveTransform();
        this.dirty = true;
    }

    onPointerUp(event) {

        if (this.pendingCycle) {
            const pending = this.pendingCycle;
            this.pendingCycle = null;
            const still = Math.hypot(event.clientX - pending.cx, event.clientY - pending.cy) < 4;
            if (still && !this.gesture?.historyPushed) {
                const stack = this.stackAtPoint(this.stagePoint(event));
                const index = stack.indexOf(pending.id);
                if (stack.length > 1 && index >= 0) {
                    const next = stack[(index + 1) % stack.length];
                    if (next !== pending.id) {
                        this.selectElement(next);
                        const element = this.selectedElement();
                        this.notify(`已选中下一层：${this.layerName(element)}`);
                    }
                }
            }
        }
        if (this.panning && this.panning.pointerId === event.pointerId) {
            this.panning = null;
            this.scrollBox?.classList.remove('star-panning');
            return;
        }
        if (this.marquee) {
            const state = this.marquee;
            state.box?.remove();
            this.marquee = null;
            this.overlay?.classList.remove('star-is-marquee');
            try { this.stage?.releasePointerCapture?.(event.pointerId); } catch (_) {}
            if (state.moved) {

                state.rect = this.stage.getBoundingClientRect();
                const x1 = Math.min(state.startX, event.clientX);
                const x2 = Math.max(state.startX, event.clientX);
                const y1 = Math.min(state.startY, event.clientY);
                const y2 = Math.max(state.startY, event.clientY);
                const { width: W, height: H } = this.config.canvas;
                const rect = state.rect;
                const hit = this.config.elements.filter(element => {
                    if (element.hidden) return false;
                    const left = rect.left + element.x / W * rect.width;
                    const top = rect.top + element.y / H * rect.height;
                    const right = left + element.width / W * rect.width;
                    const bottom = top + element.height / H * rect.height;
                    return right > x1 && left < x2 && bottom > y1 && top < y2;
                }).map(element => element.id);
                const ids = state.additive
                    ? [...new Set([...(state.baseSelection || []), ...hit])]
                    : hit;
                this.setSelection(ids);
                if (hit.length) this.selectionAnchor = hit[hit.length - 1];
                if (ids.length) this.notify(state.additive ? `已追加选中，共 ${ids.length} 个` : `框选了 ${ids.length} 个元素`);
            }
            return;
        }
        if (this.avatarDrag && this.avatarDrag.pointerId === event.pointerId) {
            const changed = this.avatarDrag.historyPushed;
            this.avatarDrag = null;
            this.stage.classList.remove('star-dragging', 'star-drag-preview');
            this.stage.querySelectorAll('.star-editor-avatar-guide[data-dragging]').forEach(node => {
                delete node.dataset.dragging;
            });
            if (changed) {
                this.renderStage();
                this.renderInspector();
                this.markDirty();
            }
            return;
        }
        if (!this.gesture?.pointers.has(event.pointerId)) return;
        this.gesture.pointers.delete(event.pointerId);
        if (!this.gesture.pointers.size) {
            const changed = this.gesture.historyPushed;
            this.gesture = null;
            this.overlay?.classList.remove('star-is-gesturing');
            this.stage.classList.remove('star-dragging', 'star-drag-preview');
            this.snapGuides = { x: null, y: null };
            if (changed) {
                this.renderStage();
                this.renderInspector();
                this.markDirty();
            }
        } else {
            this.gesture.mode = 'settled';
        }
    }

    onKeydown(event) {
        if (this.closed) return;
        if([...(this.childDialogs||[])].some(dialog=>dialog.open))return;
        const editing = event.target.matches('input, textarea, select') || event.target.isContentEditable;
        if (editing) return;
        if (event.code === 'Space') {

            event.preventDefault();
            this.spaceDown = true;
            this.scrollBox?.classList.add('star-space');
            return;
        }
        if (event.key === 'Escape') {
            event.preventDefault();

            if (this.selection.length) this.selectElement(null);
            else this.close();
            return;
        }
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
            event.preventDefault();
            event.shiftKey ? this.redo() : this.undo();
        } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
            event.preventDefault();
            this.redo();
        } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'e') {
            event.preventDefault();
            this.mergeSelected();
        } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'g' && event.shiftKey) {
            event.preventDefault();
            this.ungroupSelected();
        } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'g') {
            event.preventDefault();
            this.groupSelected();
        } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') {
            event.preventDefault();
            this.duplicateSelected();
        } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
            event.preventDefault();
            this.selectAll();
        } else if (event.key === 'Delete' || event.key === 'Backspace') {
            event.preventDefault();
            this.deleteSelected();
        } else if (event.key === '0') {
            event.preventDefault();
            this.setViewZoom(1);
        } else if (event.key === '+' || event.key === '=') {
            event.preventDefault();
            this.setViewZoom(this.viewZoom * 1.25);
        } else if (event.key === '-') {
            event.preventDefault();
            this.setViewZoom(this.viewZoom / 1.25);
        } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key) && this.selection.length) {
            event.preventDefault();
            const distance = event.shiftKey ? 10 : 1;
            const dx = event.key === 'ArrowLeft' ? -distance : event.key === 'ArrowRight' ? distance : 0;
            const dy = event.key === 'ArrowUp' ? -distance : event.key === 'ArrowDown' ? distance : 0;
            this.mutate(() => {
                for (const element of this.selectedElements()) {
                    if (element.locked) continue;
                    element.x += dx;
                    element.y += dy;
                }
            }, false);
        } else if ((event.ctrlKey || event.metaKey) && event.shiftKey && this.selection.length >= 2) {
            const k = event.key.toLowerCase();
            const map = { l: 'left', r: 'right', c: 'center', t: 'top', b: 'bottom', m: 'middle' };
            if (map[k]) {
                event.preventDefault();
                this.alignSelection(map[k]);
            } else if (k === 'h') {
                event.preventDefault();
                this.distributeSelection('x');
            } else if (k === 'v') {
                event.preventDefault();
                this.distributeSelection('y');
            }
        }
    }

    // 生命周期清理：保存成功后关闭，并释放观察器、事件、动画帧和图片地址。
    async close() {
        if (this.closed) return;
        const autoSave = Boolean(this.global?.autoSave);
        if (this.dirty && !autoSave && !confirm('还有未保存的修改，确定关闭吗？')) return;
        if (this.dirty && autoSave && !(await this.save())) return;
        this.closed = true;
        for(const dialog of [...(this.childDialogs||[])])dialog.close();
        this.previewGeneration++;
        this.previewObserver?.disconnect();
        clearTimeout(this.saveTimer);
        clearTimeout(this._openBarTimer);
        clearTimeout(this._avatarBarTimer);
        if (this._liveRaf) {
            cancelAnimationFrame(this._liveRaf);
            this._liveRaf = 0;
        }
        document.removeEventListener('keydown', this.keydownHandler, true);
        if(this.contextPointerHandler)document.removeEventListener('pointerdown',this.contextPointerHandler,true);
        if (this.keyupHandler) document.removeEventListener('keyup', this.keyupHandler, true);
        if (this.blurHandler) window.removeEventListener('blur', this.blurHandler);

        window.removeEventListener('resize', this.resizeHandler);
        document.body.classList.remove('stargaze-editor-open');
        const overlay = this.overlay;
        if (overlay) {
            overlay.classList.remove('is-open');
            overlay.classList.add('is-closing');
            const done = () => {
                overlay.remove();
                for (const url of this.assetUrls.values()) URL.revokeObjectURL(url);
                this.assetUrls.clear();
                this.onClose?.();
            };

            let finished = false;
            const finish = () => {
                if (finished) return;
                finished = true;
                done();
            };
            overlay.addEventListener('transitionend', finish, { once: true });
            setTimeout(finish, 240);
        } else {
            for (const url of this.assetUrls.values()) URL.revokeObjectURL(url);
            this.assetUrls.clear();
            this.onClose?.();
        }
    }
}
