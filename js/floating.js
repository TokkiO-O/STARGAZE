import { AVATAR_PLACEHOLDER, characterKey, createConfig, LAYOUTS, TEMPLATE_LIST } from './templates.js';

export class StargazeFloating {
    constructor({ getContext, store, openEditor, notify }) {
        this.getContext = getContext;
        this.store = store;
        this.openEditor = openEditor;
        this.notify = notify;
        this.settings = null;
        this.element = null;
        this.avatarImage = null;
        this.drag = null;
        this.updateToken = 0;
        this.hasCharacter = false;
        this.lastPointerType = 'mouse';
        this.dragMoved = false;
        this.resizeHandler = () => {
            this.applyPosition();
            this.clampIntoView();
        };
    }

    async init() {
        this.settings = await this.store.getGlobal();
        this.build();
        this.bind();
        document.body.append(this.element);
        this.applyPosition();
        this.applyVisibility();
        await this.update();
        window.addEventListener('resize', this.resizeHandler);
        return this;
    }

    build() {
        this.element = document.createElement('section');
        this.element.id = 'stargaze-floating-window';
        this.element.className = 'stargaze-floating';
        this.element.setAttribute('aria-label', 'STARGAZE 头像拼贴悬浮窗');
        this.element.innerHTML = `
            <div class="stargaze-float-head" data-float-drag>
                <div class="stargaze-float-brand"><span>✦</span><strong>STARGAZE</strong></div>
                <button type="button" data-float-action="hide" class="stargaze-float-close" aria-label="隐藏悬浮窗">×</button>
            </div>
            <div class="stargaze-float-body">
                <div class="stargaze-float-avatar"><span></span><img alt="" /></div>
                <div class="stargaze-float-info"><strong>正在读取角色…</strong><small>原生头像 · 原位拼贴</small></div>
            </div>
            <button type="button" data-float-action="edit" class="stargaze-float-edit">编辑当前头像拼贴</button>
            <div class="stargaze-float-foot"><span>入口：魔法棒菜单</span><i></i></div>`;
        this.avatarImage = this.element.querySelector('.stargaze-float-avatar img');
        this.avatarImage.addEventListener('error', () => { this.avatarImage.src = AVATAR_PLACEHOLDER; }, { once: true });
        return this.element;
    }

    bind() {
        this.element.addEventListener('click', event => {
            const action = event.target.closest('[data-float-action]')?.dataset.floatAction;
            if (action === 'edit') { this.openEditor(); return; }
            if (action === 'hide') { this.hide(); return; }
            if (this.dragMoved) { this.dragMoved = false; return; }

            if (this.lastPointerType !== 'mouse') this.openEditor();
        });

        this.element.addEventListener('pointerenter', event => {
            if (event.pointerType === 'mouse') this.setOpen(true);
        });
        this.element.addEventListener('pointerleave', event => {
            if (event.pointerType === 'mouse' && !this.drag) this.setOpen(false);
        });
        this.element.addEventListener('pointerdown', event => {
            this.lastPointerType = event.pointerType || 'mouse';
            this.startDrag(event);
        });
        this.element.addEventListener('pointermove', event => this.moveDrag(event));
        this.element.addEventListener('pointerup', event => this.endDrag(event));
        this.element.addEventListener('pointercancel', event => this.endDrag(event));
    }

    resolveCharacter(context) {
        if (!context) return null;
        const id = context.characterId;
        const byId = id !== undefined && id !== null && id !== '' ? context.characters?.[id] : null;
        if (byId) return byId;
        const list = Array.isArray(context.characters) ? context.characters : [];
        return list.find(item => item?.name && item.name === context.name2) || null;
    }

    async update() {
        const token = ++this.updateToken;
        const context = this.getContext();
        const character = this.resolveCharacter(context);
        const editButton = this.element.querySelector('[data-float-action="edit"]');
        const nameNode = this.element.querySelector('.stargaze-float-info strong');
        const layoutNode = this.element.querySelector('.stargaze-float-info small');
        if (!character) {
            this.hasCharacter = false;
            this.element.classList.add('stargaze-no-character');
            this.avatarImage.removeAttribute('src');
            nameNode.textContent = '先打开单人角色聊天';
            layoutNode.textContent = '原生头像 · 原位拼贴';
            editButton.disabled = true;
            this.applyVisibility();
            return;
        }
        const key = characterKey(character);
        const config = (await this.store.getCharacterConfig(key, character.name)) || createConfig(key, character.name);
        if (token !== this.updateToken) return;
        this.hasCharacter = true;
        this.element.classList.remove('stargaze-no-character');
        this.element.style.setProperty('--stargaze-float-accent', config.theme.accent);
        this.avatarImage.src = character.avatar && character.avatar !== 'none'
            ? context.getThumbnailUrl('avatar', character.avatar)
            : AVATAR_PLACEHOLDER;
        nameNode.textContent = character.name;
        const template = TEMPLATE_LIST.find(item => item.id === config.templateId);
        layoutNode.textContent = `${template?.name || '自定义'} · ${LAYOUTS[config.layout]?.name || '拼贴'}`;
        editButton.disabled = false;
        this.applyVisibility();
    }

    applyVisibility() {
        if (!this.element || !this.settings) return;

        const visible = Boolean(this.settings.floatingEnabled) && this.hasCharacter;
        this.element.hidden = !visible;
        this.element.classList.toggle('stargaze-float-visible', visible);
        const checkbox = document.querySelector('#stargaze-floating');
        if (checkbox) checkbox.checked = Boolean(this.settings.floatingEnabled);
    }

    isOpen() {
        return Boolean(this.element?.classList.contains('is-open'));
    }

    setOpen(open) {
        if (!this.element || this.element.hidden) return;
        const next = Boolean(open);
        if (this.isOpen() === next) return;
        this.element.classList.toggle('is-open', next);

        if (!this.element.style.left) return;
        const settle = () => this.clampIntoView();
        this.element.addEventListener('transitionend', settle, { once: true });
        setTimeout(settle, 320);
    }

    clampIntoView() {
        if (!this.element || !this.element.style.left) return;
        const rect = this.element.getBoundingClientRect();
        const width = rect.width || 46;
        const height = rect.height || 46;
        const left = Math.min(Math.max(4, rect.left), Math.max(4, window.innerWidth - width - 4));
        const top = Math.min(Math.max(4, rect.top), Math.max(4, window.innerHeight - height - 4));
        if (Math.abs(left - rect.left) < 0.5 && Math.abs(top - rect.top) < 0.5) return;
        this.element.style.left = `${Math.round(left)}px`;
        this.element.style.top = `${Math.round(top)}px`;
    }

    applyPosition() {
        if (!this.element) return;
        const position = this.settings?.floatPos;
        if (!position || !Number.isFinite(position.x) || !Number.isFinite(position.y)) {
            this.element.style.removeProperty('left');
            this.element.style.removeProperty('top');
            this.element.style.removeProperty('right');
            this.element.style.removeProperty('bottom');
            return;
        }
        const rect = this.element.getBoundingClientRect();
        const width = rect.width || 46;
        const height = rect.height || 46;
        const x = Math.min(Math.max(4, position.x), Math.max(4, window.innerWidth - width - 4));
        const y = Math.min(Math.max(4, position.y), Math.max(4, window.innerHeight - height - 4));
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
        this.element.style.right = 'auto';
        this.element.style.bottom = 'auto';
    }

    startDrag(event) {
        if (event.button !== 0 && event.pointerType === 'mouse') return;
        if (event.target.closest('button') || !event.target.closest('[data-float-drag]')) return;
        const rect = this.element.getBoundingClientRect();
        this.drag = {
            pointerId: event.pointerId,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top,
            x: rect.left,
            y: rect.top,
            startX: event.clientX,
            startY: event.clientY,
            moved: false,
            pinned: false,
        };
        this.element.setPointerCapture(event.pointerId);
    }

    moveDrag(event) {
        if (!this.drag || event.pointerId !== this.drag.pointerId) return;
        const dx = event.clientX - this.drag.startX;
        const dy = event.clientY - this.drag.startY;
        if (!this.drag.moved && Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
        this.drag.moved = true;
        if (!this.drag.pinned) {
            this.drag.pinned = true;
            this.element.style.left = `${Math.round(this.drag.x)}px`;
            this.element.style.top = `${Math.round(this.drag.y)}px`;
            this.element.style.right = 'auto';
            this.element.style.bottom = 'auto';
            this.element.classList.add('stargaze-dragging');
        }
        event.preventDefault();
        const rect = this.element.getBoundingClientRect();
        const width = rect.width || 46;
        const height = rect.height || 46;
        const x = Math.min(Math.max(4, event.clientX - this.drag.offsetX), Math.max(4, window.innerWidth - width - 4));
        const y = Math.min(Math.max(4, event.clientY - this.drag.offsetY), Math.max(4, window.innerHeight - height - 4));
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    async endDrag(event) {
        if (!this.drag || event.pointerId !== this.drag.pointerId) return;
        const moved = this.drag.moved;
        this.dragMoved = moved;
        this.drag = null;
        this.element.classList.remove('stargaze-dragging');
        if (this.element.hasPointerCapture(event.pointerId)) this.element.releasePointerCapture(event.pointerId);
        if (!moved) return;
        const rect = this.element.getBoundingClientRect();
        const current = await this.store.getGlobal();
        this.settings = { ...current, floatPos: { x: Math.round(rect.left), y: Math.round(rect.top) } };
        await this.store.saveGlobal(this.settings);
    }

    async show() {
        if (!this.settings) return;
        if (!this.hasCharacter) {
            this.notify?.('先进入一个角色聊天，再来拼贴头像吧');
            return;
        }
        const current = await this.store.getGlobal();
        this.settings = { ...current, floatingEnabled: true };
        await this.store.saveGlobal(this.settings);
        this.applyVisibility();
        this.applyPosition();
        await this.update();
        this.setOpen(true);
        this.element.classList.remove('stargaze-float-pulse');
        void this.element.offsetWidth;
        this.element.classList.add('stargaze-float-pulse');
        setTimeout(() => this.element?.classList.remove('stargaze-float-pulse'), 700);
    }

    async hide() {
        if (!this.settings) return;
        const current = await this.store.getGlobal();
        this.settings = { ...current, floatingEnabled: false };
        await this.store.saveGlobal(this.settings);
        this.applyVisibility();
    }

    syncSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        this.applyVisibility();
    }

    destroy() {
        window.removeEventListener('resize', this.resizeHandler);
        this.element?.classList.remove('is-open');
        this.element?.remove();
        this.element = null;
    }
}
