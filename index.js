import { StarStore } from './js/store.js';
import { ChatRenderer } from './js/renderer.js';
import { ThemePackages } from './js/packages/manager.js';
import { StargazeFloating } from './js/floating.js';

// 使用实际安装目录，仓库名大小写不同也能找到酒馆设置面板。
const extensionName = decodeURIComponent(new URL('.',import.meta.url).pathname.split('/').filter(Boolean).pop());
let store;
let renderer;
let floating;
let editor = null;
let openingEditor = false;
let packageManager=null;
let initialized=false;
let initializing=null;
let wandTimer=null;
const disposers=[];

function notify(message) {
    const existing = document.querySelector('.stargaze-toast');
    existing?.remove();
    const toast = document.createElement('div');
    toast.className = 'stargaze-toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.append(toast);
    setTimeout(() => toast.remove(), 3000);
}

function currentCharacter(context) {
    if (!context) return null;
    const id = context.characterId;
    const byId = id !== undefined && id !== null && id !== '' ? context.characters?.[id] : null;
    if (byId) return byId;
    const list = Array.isArray(context.characters) ? context.characters : [];
    const byName = list.find(item => item?.name && item.name === context.name2);
    return byName || null;
}

// 编辑器入口：复用当前实例，防止连点时打开多个窗口。
async function openEditor() {
    if (editor) {

        if (editor.overlay?.parentElement) editor.overlay.parentElement.append(editor.overlay);
        return;
    }
    if (openingEditor) return;
    let context;
    try {
        context = SillyTavern.getContext();
    } catch (error) {
        console.error('[STARGAZE] 读取酒馆上下文失败', error);
        notify('读不到酒馆上下文，请刷新页面后重试');
        return;
    }
    openingEditor=true;
    const isGroup=context.groupId!=null&&context.groupId!=='';
    const character = isGroup
        ? await (await import('./js/editor/group-picker.js')).chooseGroupCharacter(context)
        : currentCharacter(context);
    if (!character) {
        openingEditor=false;
        if(!isGroup)notify('请先打开一个角色聊天，再编辑该角色的头像拼贴');
        return;
    }
    openingEditor = true;
    let StarEditor;
    try { ({StarEditor}=await import('./js/editor.js')); }
    catch(error){openingEditor=false;notify(`编辑器加载失败：${error.message}`);return;}
    const instance = new StarEditor({
        context,
        store,
        renderer,
        character,
        notify,
        onClose: () => {
            if (editor === instance) editor = null;
            floating?.update();
        },
        onChange: () => floating?.update(),
    });
    editor = instance;
    try {
        await instance.open();
    } catch (error) {
        console.error('[STARGAZE] 编辑器打开失败', error);
        notify(`编辑器打开失败：${error.message}`);
        if (editor === instance) editor = null;
        await instance.close().catch(() => {});
    } finally {
        openingEditor = false;
    }
}

async function updateGlobalSettings(patch) {
    const current = await store.getGlobal();
    const next = { ...current, ...patch };
    await store.saveGlobal(next);
    floating?.syncSettings(next);
    return next;
}

// 酒馆设置面板：独立存储全局偏好，并通知聊天预览刷新。
async function setupSettingsPanel(context) {
    const html = await context.renderExtensionTemplateAsync(`third-party/${extensionName}`, 'settings');
    $('#extensions_settings2').append(html);
    $('#stargaze-theme-manager').on('click',async()=>{
        const {openPackagePanel}=await import('./js/editor/package-panel.js');
        const host={store,config:null,history:[],future:[],childDialogs:new Set(),notify,renderAssets:()=>{},renderTemplatePreviews:()=>{},renderAll:()=>{},mutate:fn=>fn(),applyTemplate:()=>{}};
        openPackagePanel(host);
    });
    const settings = await store.getGlobal();
    $('#stargaze-enabled').prop('checked', settings.enabled).on('change', async event => {
        await updateGlobalSettings({ enabled: event.target.checked });
        renderer.schedule(0);
    });
    $('#stargaze-display-mode').val(settings.displayMode).on('change', async event => {
        await updateGlobalSettings({ displayMode: event.target.value });
        renderer.schedule(0);
    });
    $('#stargaze-autosave').prop('checked', settings.autoSave).on('change', async event => {
        await updateGlobalSettings({ autoSave: event.target.checked });
    });
    $('#stargaze-scale')
        .val(settings.collageScale ?? 1)
        .on('input', async event => {
            const value = Number(event.target.value) || 1;
            $('#stargaze-scale-value').text(`${Math.round(value * 100)}%`);
            await updateGlobalSettings({ collageScale: value });
            renderer.schedule(0);
        });
    $('#stargaze-scale-value').text(`${Math.round((settings.collageScale ?? 1) * 100)}%`);
    $('#stargaze-mobile-max')
        .val(settings.mobileMaxElements ?? 60)
        .on('input', async event => {
            const value = Math.round(Number(event.target.value)) || 60;
            $('#stargaze-mobile-max-value').text(String(value));
            await updateGlobalSettings({ mobileMaxElements: value });
            renderer.schedule(0);
        });
    $('#stargaze-mobile-max-value').text(String(settings.mobileMaxElements ?? 60));
    $('#stargaze-floating').prop('checked', settings.floatingEnabled).on('change', async event => {
        await updateGlobalSettings({ floatingEnabled: event.target.checked });
    });
    $('#stargaze-lazy').prop('checked', settings.lazyRender !== false).on('change', async event => {
        await updateGlobalSettings({ lazyRender: event.target.checked });
        renderer.schedule(0);
    });
    $('#stargaze-animations').prop('checked', Boolean(settings.animations)).on('change', async event => {
        await updateGlobalSettings({ animations: event.target.checked });
        renderer.schedule(0);
    });
    $('#stargaze-storage-status').text(store.persistent
        ? '稿件与上传图片保存在当前浏览器；主题素材保存在酒馆用户文件中。换设备编辑稿件前请导出备份。'
        : store.error || '当前为临时存储模式，刷新后修改可能丢失。');
}

function setupWandEntry(attempt = 0) {
    const menu = document.getElementById('extensionsMenu');
    if (!menu) {
        if (attempt < 20) wandTimer=setTimeout(() => setupWandEntry(attempt + 1), 500);
        return;
    }
    if (document.getElementById('stargaze_wand_button')) return;
    const item = document.createElement('div');
    item.id = 'stargaze_wand_button';
    item.className = 'list-group-item flex-container flexGap5';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.title = '打开 STARGAZE 头像拼贴编辑器';
    const icon = document.createElement('div');
    icon.className = 'fa-solid fa-star extensionsMenuExtensionButton';
    const label = document.createElement('span');
    label.textContent = 'STARGAZE 头像拼贴';
    item.append(icon, label);

    item.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        void openEditor();
    });
    item.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            void openEditor();
        }
    });
    menu.append(item);
}

// 聊天生命周期：消息或角色变更后重新安排预览，不在输入过程中反复渲染。
function bindChatEvents(context) {
    const events = context.eventTypes || context.event_types || {};
    const schedule = () => renderer.schedule();
    for (const name of [
        'CHARACTER_MESSAGE_RENDERED',
        'USER_MESSAGE_RENDERED',
        'MORE_MESSAGES_LOADED',
        'MESSAGE_SWIPED',
        'MESSAGE_EDITED',
        'MESSAGE_DELETED',
        'MESSAGE_UPDATED',
        'CHARACTER_EDITED',
        'CHARACTER_RENAMED',
    ]) {
        if (events[name] && context.eventSource?.on){context.eventSource.on(events[name],schedule);disposers.push(()=>{const off=context.eventSource.off||context.eventSource.removeListener;off?.call(context.eventSource,events[name],schedule);});}
    }
    if (events.CHAT_CHANGED && context.eventSource?.on){const changed=async () => {
        if (editor) await editor.close();
        renderer.schedule(0);
        floating?.update();
    };context.eventSource.on(events.CHAT_CHANGED,changed);disposers.push(()=>{const off=context.eventSource.off||context.eventSource.removeListener;off?.call(context.eventSource,events.CHAT_CHANGED,changed);});}
    const resized=()=>renderer?.schedule(120);window.addEventListener('resize',resized);disposers.push(()=>window.removeEventListener('resize',resized));
    const assets=()=>{renderer?.collageCache.clear();renderer?.schedule(0);};window.addEventListener('stargaze-assets-changed',assets);disposers.push(()=>window.removeEventListener('stargaze-assets-changed',assets));
}

async function initializeOnce() {
    if(initialized)return;
    if (!globalThis.SillyTavern?.getContext) {
        console.error('[STARGAZE] 未找到 SillyTavern 扩展上下文');
        return;
    }
    const context = SillyTavern.getContext();
    store = await new StarStore().init();
    packageManager=await new ThemePackages({store,context}).init();
    renderer = new ChatRenderer(() => SillyTavern.getContext(), store);
    floating = new StargazeFloating({
        getContext: () => SillyTavern.getContext(),
        store,
        openEditor,
        notify,
    });
    await floating.init();
    setupWandEntry();
    try {
        await setupSettingsPanel(context);
    } catch (error) {
        console.error('[STARGAZE] 设置面板加载失败', error);
        notify('STARGAZE 设置面板加载失败，请确认扩展文件完整并刷新页面');
    }
    bindChatEvents(context);
    renderer.observe();
    await renderer.render();
    initialized=true;
    console.log(`[STARGAZE] v1.0.0 已加载，${store.persistent ? 'IndexedDB 独立存储' : '临时存储'}模式`);
}

function initialize(){
    if(initializing)return initializing;
    initializing=initializeOnce().finally(()=>{initializing=null;});
    return initializing;
}

jQuery(initialize);

// 酒馆生命周期只清理本扩展创建的节点、监听器和临时地址，不改动聊天内容。
export async function onDisable(){
    if(initializing)await initializing;
    if(editor&&!editor.closed){await editor.close();if(!editor.closed)throw new Error('请先保存或导出未保存的 STARGAZE 稿件');}
    editor=null;clearTimeout(wandTimer);for(const dispose of disposers.splice(0))dispose();
    document.querySelectorAll('.star-dialog').forEach(dialog=>dialog.close());
    renderer?.destroy();floating?.destroy();packageManager?.destroy();
    document.getElementById('stargaze_wand_button')?.remove();document.querySelectorAll('.stargaze-settings').forEach(node=>node.remove());
    initialized=false;openingEditor=false;
}
export async function onEnable(){await initialize();}
export async function onDelete(){await onDisable();}
