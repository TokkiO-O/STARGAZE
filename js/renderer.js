import {toneFilter} from './photo-tone.js';
import { resolveText, textSize } from './text.js';
import { AVATAR_PLACEHOLDER, avatarFrameVars, avatarRotateScaleFor, avatarShapeFitScale, photoRotateRelative, shapeRotateOf, shapeStyle, avatarViewBox, clampAvatarBox, clampRotate, builtinAssetUrl, characterFields, characterKey, createConfig, isBuiltinAsset, mainPortrait, isElementHidden, avatarIsHidden, photoViewBox, presetWidthRatio } from './templates.js';
import {assetRevision} from './assets/runtime.js';
import {themePackages} from './packages/manager.js';

const MIN_OVERLAY_WIDTH = 120;

function depthOf(element) {
    const explicit = Number(element?.depth);
    if (explicit >= 1 && explicit <= 4) return Math.round(explicit);
    const z = Number(element?.z) || 0;
    if (z <= 1) return 1;
    if (z <= 3) return 2;
    if (z <= 5) return 3;
    return 4;
}

export class ChatRenderer {
    constructor(getContext, store) {
        this.getContext = getContext;
        this.store = store;
        this.generation = 0;
        this.timer = null;
        this.assetUrls = new Map();
        this.observer = null;
        this.resizeObserver = null;
        this.viewObserver = null;
        this.nearViewport = new Set();
        this.observedMessages = new Set();
        this.configs = new WeakMap();
        this.globalScale = 1;
        this.collageCache=new Map();
    }

    observe() {
        const chat = document.querySelector('#chat');
        if (!chat) return;
        if (!this.observer) {
            this.observer = new MutationObserver(mutations => {
                const relevant = mutations.some(mutation => {
                    if (mutation.target.closest?.('.stargaze-avatar-collage, .stargaze-front-layer')) return false;
                    if (mutation.type === 'attributes') return mutation.target.matches?.('.avatar img');
                    return [...mutation.addedNodes, ...mutation.removedNodes].some(node => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return false;
                        return node.matches?.('.mes') || node.querySelector?.('.mes') || !node.closest?.('.stargaze-avatar-collage');
                    });
                });
                if (relevant) this.schedule();
            });
            this.observer.observe(chat, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
        }
        if (!this.resizeObserver && globalThis.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(() => this.repositionAll());
            this.resizeObserver.observe(chat);
        }
    }

    observeViewport(messages) {
        if (!globalThis.IntersectionObserver) return;
        const chat = document.querySelector('#chat');
        if (!chat) return;
        const current=new Set(messages);
        for(const message of this.observedMessages)if(!current.has(message)){
            this.viewObserver?.unobserve(message);this.nearViewport.delete(message);this.observedMessages.delete(message);delete message.dataset.stargazeObserved;
        }
        if (!this.viewObserver) {
            this.viewObserver = new IntersectionObserver(entries => {
                let entered = false;
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        if (!this.nearViewport.has(entry.target)) {
                            this.nearViewport.add(entry.target);
                            entered = true;
                        }
                    } else {
                        this.nearViewport.delete(entry.target);
                        this.suspendMessage(entry.target);
                    }
                }
                if (entered) this.schedule(80);
            }, { root: chat, rootMargin: '700px 0px' });
        }
        for (const message of messages) {
            if (message.dataset.stargazeObserved === '1') continue;
            message.dataset.stargazeObserved = '1';
            this.observedMessages.add(message);
            this.viewObserver.observe(message);
        }
    }

    isNear(message) {
        if (this.nearViewport.has(message)) return true;
        const chat = document.querySelector('#chat');
        if (!chat) return true;
        const box = chat.getBoundingClientRect();
        const rect = message.getBoundingClientRect();
        return rect.bottom > box.top - 700 && rect.top < box.bottom + 700;
    }

    suspendMessage(message){
        if(!message.classList.contains('stargaze-mounted')||message.dataset.starSuspended==='1')return;
        // 保留外层尺寸与原生头像位置，只回收离屏的装饰节点，滚动高度不跳动。
        message.querySelector(':scope > .stargaze-avatar-collage')?.replaceChildren();
        message.querySelector(':scope > .stargaze-front-layer')?.replaceChildren();
        message.dataset.starSuspended='1';message.dataset.stargazeSignature='';
    }

    cachedCollage(signature,build){
        let cached=this.collageCache.get(signature);
        if(cached){this.collageCache.delete(signature);this.collageCache.set(signature,cached);return {back:cached.back.cloneNode(true),front:cached.front.cloneNode(true)};}
        const layers=build();cached={back:layers.back.cloneNode(true),front:layers.front.cloneNode(true)};this.collageCache.set(signature,cached);
        if(this.collageCache.size>24)this.collageCache.delete(this.collageCache.keys().next().value);
        return layers;
    }

    schedule(delay = 100) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.render().catch(error => {
            console.error('[STARGAZE] 头像拼贴渲染失败', error);
        }), delay);
    }

    resolveCharacter(message, context) {
        const name = message.getAttribute('ch_name') || message.querySelector('.ch_name .name_text')?.textContent?.trim();
        if (name) {
            const exact = context.characters?.find(character => character?.name === name);
            if (exact) return exact;
        }
        const id = context.characterId;
        if (id !== undefined && id !== null && id !== '') return context.characters?.[id] || null;
        return null;
    }

    findAvatar(message) {
        const candidates = [
            message.querySelector(':scope > .avatar'),
            message.querySelector(':scope > .mesAvatarWrapper > .avatar'),
            message.querySelector('.mesAvatarWrapper .avatar'),
            message.querySelector(':scope > .mesAvatarWrapper'),
        ];
        for (const node of candidates) {
            if (node && node.querySelector('img')) return node;
        }
        for (const node of message.querySelectorAll('.avatar')) {
            if (!node.closest('.mes_text') && node.querySelector('img')) return node;
        }
        return null;
    }

    async getAssetUrl(id) {
        if (this.assetUrls.has(id)) return this.assetUrls.get(id);
        const asset = await this.store.getAsset(id);
        if (!asset?.blob) return '';
        const url = URL.createObjectURL(asset.blob);
        this.assetUrls.set(id, url);
        return url;
    }

    releaseAsset(id) {
        this.collageCache.clear();
        const url = this.assetUrls.get(id);
        if (url) URL.revokeObjectURL(url);
        this.assetUrls.delete(id);
    }

    visibleElements(config, globalSettings) {
        const elements = [...config.elements]
            .filter(element => !isElementHidden(config, element))
            .sort((a, b) => a.z - b.z);
        const max = Math.max(8, Number(globalSettings.mobileMaxElements) || 60);
        const isMobile = globalThis.matchMedia?.('(max-width: 640px)').matches;
        if (!isMobile || elements.length <= max) return elements;
        const area = Math.max(1, (config.canvas?.width || 420) * (config.canvas?.height || 285));
        const weight = { image: 1.35, text: 1.5, sticker: 0.85, tape: 0.9, lace: 0.7, frame: 1.1 };
        const keep = new Set(elements
            .map(element => ({
                element,
                score: (element.width * element.height) / area * (weight[element.type] || 1)
                    + (element.assetId === '__avatar__' ? 0.6 : 0)
                    + (Number(element.z) || 0) * 0.004,
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, max)
            .map(item => item.element.id));
        return elements.filter(element => keep.has(element.id));
    }

    buildElement(element, config, assetUrls, avatarUrl, fields = null) {

        const resolved = fields && (element.type === 'text' || element.type === 'sticker')
            ? resolveText(element.text, fields, config.nickname)
            : element.text;
        if ((element.type === 'text' || element.type === 'sticker') && !String(resolved ?? '').trim()) return null;
        const node = document.createElement('div');
        node.className = `stargaze-element stargaze-element-${element.type}`;
        node.dataset.elementId = element.id;
        if (element.photoRole) node.dataset.starPhotoRole = element.photoRole;
        if (element.finish) node.dataset.starFinish = element.finish;
        if (element.type === 'tape' && element.tapeStyle) node.dataset.tapeStyle = element.tapeStyle;
        if (element.type === 'image') node.dataset.starDepth = String(depthOf(element));
        node.style.left = `${element.x / config.canvas.width * 100}%`;
        node.style.top = `${element.y / config.canvas.height * 100}%`;
        node.style.width = `${element.width / config.canvas.width * 100}%`;
        node.style.height = `${element.height / config.canvas.height * 100}%`;

        node.style.zIndex = String(Math.round((Number(element.z) || 0) * 100));
        node.style.opacity = String(element.opacity);
        node.style.transform = `rotate(${element.rotation}deg)`;

        if (element.type === 'image') {
            node.classList.add(`stargaze-shape-${element.shape}`);
            const frame = document.createElement('div');
            frame.className = 'stargaze-image-frame';
            const image = document.createElement('img');
            image.alt = '';
            image.draggable = false;

            let source = '';
            if (element.assetId === '__avatar__') source = avatarUrl || '';
            else if (isBuiltinAsset(element.assetId)) source = builtinAssetUrl(element.assetId);
            else source = assetUrls.get(element.assetId) || '';
            if (!source) return null;
            image.src = source;
            if(element.photoTone)image.style.filter=toneFilter(element.photoTone);

            const focusX = Number(element.focusX);
            const focusY = Number(element.focusY);
            image.style.objectPosition = `${Number.isFinite(focusX) ? focusX : 50}% ${Number.isFinite(focusY) ? focusY : 50}%`;

            image.style.objectFit = element.fit === 'fill' ? 'fill'
                : (element.fit === 'contain' ? 'contain' : 'cover');
            if (image.style.objectFit === 'cover') {
                image.style.setProperty('object-view-box', photoViewBox(element));
            }

            image.addEventListener('error', () => {
                node.style.opacity = '0';
            }, { once: true });
            frame.append(image);
            if (element.shape === 'polaroid' && element.showCaption !== false) {
                const caption = document.createElement('span');
                caption.className = 'stargaze-polaroid-caption';
                caption.textContent = element.caption || config.nickname;

                caption.style.fontSize = `${Math.max(2.4, element.width / config.canvas.width * 100 * 0.15)}cqw`;
                frame.append(caption);
            }

            {
                const stroke = Number(element.stroke) || 0;
                const shadow = Boolean(element.shadow);
                const soft = Number(element.shadowSoft) || 0;
                const color = element.strokeColor || '#ffffff';
                if (stroke > 0) {
                    frame.style.boxShadow = `0 0 0 ${stroke}px ${color}${shadow ? ', 0 4px 14px rgba(0,0,0,0.22)' : ''}`;
                } else if (shadow) {
                    frame.style.boxShadow = '0 4px 14px rgba(0,0,0,0.22)';
                }
                if (soft > 0) {
                    frame.style.filter = `drop-shadow(0 ${soft}px ${soft * 1.4}px rgba(0,0,0,0.28))`;
                }
            }
            node.append(frame);
        } else if (element.type === 'text' || element.type === 'sticker') {
            node.textContent = resolved;
            node.style.color = element.color || config.theme.ink;
            node.style.fontFamily = element.fontFamily;
            node.style.fontSize = `${textSize(element, resolved) / config.canvas.width * 100}cqw`;
            node.style.textAlign = element.align;
            node.style.webkitTextStroke = element.stroke ? `${element.stroke / config.canvas.width * 100}cqw ${config.theme.paper}` : '0 transparent';
            node.style.textShadow = element.shadow ? `0 ${1 / config.canvas.width * 100}cqw ${2 / config.canvas.width * 100}cqw ${config.theme.accent}` : 'none';
        }
        return node;
    }

    createLayer(className, config, layerName) {
        const node = document.createElement('div');
        node.className = className;
        node.dataset.layer = layerName;
        node.dataset.layout = config.layout;
        node.setAttribute('aria-hidden', 'true');
        node.style.setProperty('--star-paper', config.theme.paper);
        node.style.setProperty('--star-accent', config.theme.accent);
        node.style.setProperty('--star-ink', config.theme.ink);
        node.style.setProperty('--star-soft', config.theme.soft);
        node.style.setProperty('--star-secondary', config.theme.secondary);
        return node;
    }

    buildCollage(config, character, assetUrls, avatarUrl, globalSettings) {
        const back = this.createLayer('stargaze-avatar-collage', config, 'back');
        const front = this.createLayer('stargaze-front-layer', config, 'front');
        if (globalSettings.animations) {
            back.classList.add('star-animated');
            front.classList.add('star-animated');
        }

        const fields = characterFields(character);

        const main = mainPortrait(config);
        const skipId = main ? main.id : null;
        for (const element of this.visibleElements(config, globalSettings)) {
            if (skipId && element.id === skipId) continue;
            const target = element.layer === 'front' ? front : back;
            const node = this.buildElement(element, config, assetUrls, avatarUrl, fields);
            if (node) target.append(node);
        }
        front.hidden = !front.childElementCount;
        return { back, front };
    }

    positionOverlay(message, image, layers, config) {
        const back = layers?.back;
        if (!message || !image || !back) return;
        const EDGE = 4;
        const chat = document.querySelector('#chat');
        const chatRect = chat?.getBoundingClientRect() || { left: 0, right: 720, width: 720 };
        const chatWidth = chatRect.width || 720;
        const anchorX = Math.min(0.95, Math.max(0.05, Number(config.canvas.anchorX) || 0.5));
        const anchorY = Math.min(0.95, Math.max(0.05, Number(config.canvas.anchorY) || 0.5));
        const ratio = Math.max(0.2, (Number(config.canvas.height) || 300) / (Number(config.canvas.width) || 420));

        const centerMode = config.canvas.anchorMode === 'chat';

        let imageRect = image.getBoundingClientRect();

        const avatarSize = image.offsetWidth || 40;
        const avatarVisual = imageRect.width || avatarSize;

        const currentInset = parseFloat(message.style.getPropertyValue('--star-inset')) || 0;
        const avatarCenter = imageRect.left + imageRect.width / 2 - currentInset;
        const naturalWidth = avatarSize * (Number(config.canvas.avatarScale) || 4.8) * this.globalScale * clampAvatarBox(config.avatar?.widthRatio);

        const maxByChat = Math.max(MIN_OVERLAY_WIDTH, chatWidth - EDGE * 2);
        const maxByHeight = Math.max(MIN_OVERLAY_WIDTH, (Math.max(180, (window.innerHeight || 800) * 0.62)) / ratio);

        const maxByPreset = Math.max(MIN_OVERLAY_WIDTH, chatWidth * presetWidthRatio(config.canvas));
        let width = Math.min(naturalWidth, maxByChat, maxByHeight, maxByPreset);
        width = Math.max(Math.min(MIN_OVERLAY_WIDTH, maxByChat), Math.round(width));
        let height = Math.round(width * ratio);

        const allowance = Math.max(0, chatRect.right - EDGE - avatarVisual / 2 - avatarCenter);
        let inset = 0;
        if (!centerMode) {
            inset = Math.max(0, chatRect.left + EDGE - avatarCenter + width * anchorX);
            if (inset <= 0.5) inset = 0;
            else inset = Math.min(inset, allowance);
        }
        width = Math.max(Math.min(MIN_OVERLAY_WIDTH, maxByChat), Math.round(Math.min(width, maxByChat)));
        height = Math.round(width * ratio);

        if (Math.abs(currentInset - inset) > 0.5) {
            if (inset > 0) {
                message.style.setProperty('--star-inset', `${Math.round(inset)}px`);
                message.dataset.starInset = '1';
            } else {
                message.style.removeProperty('--star-inset');
                delete message.dataset.starInset;
            }
            imageRect = image.getBoundingClientRect();
        }

        const fit = Math.min(1, width / Math.max(1, naturalWidth));
        this.applyAvatarStyle(message, config, fit);
        imageRect = image.getBoundingClientRect();

        const avatarHalf = imageRect.height / 2;
        const basePadTop = parseFloat(message.style.getPropertyValue('--star-pad-top')) || 0;
        const topExtra = Math.max(0, Math.round(EDGE + height * anchorY - avatarHalf - basePadTop));
        const blockOffset = Math.max(0, Math.round(avatarHalf + height * (1 - anchorY) + EDGE + 4));
        const topExtraNow = parseFloat(message.style.getPropertyValue('--star-top-extra')) || 0;
        const blockNow = parseFloat(message.style.getPropertyValue('--star-block-offset')) || 0;
        if (Math.abs(topExtraNow - topExtra) > 0.5) message.style.setProperty('--star-top-extra', `${topExtra}px`);
        if (Math.abs(blockNow - blockOffset) > 0.5) message.style.setProperty('--star-block-offset', `${blockOffset}px`);

        const place = () => {
            const box = message.getBoundingClientRect();
            const r = image.getBoundingClientRect();
            const chatBox = chat?.getBoundingClientRect() || box;
            const cx = r.left + r.width / 2 - box.left - message.clientLeft;
            const cy = r.top + r.height / 2 - box.top - message.clientTop;
            let left;
            if (centerMode) {

                left = (chatBox.left - box.left - message.clientLeft) + (chatBox.width - width) / 2;
            } else {
                left = cx - width * anchorX;

                const absLeft = left + box.left + message.clientLeft;
                if (absLeft < chatBox.left + EDGE) left += chatBox.left + EDGE - absLeft;
                else if (absLeft + width > chatBox.right - EDGE) left -= absLeft + width - (chatBox.right - EDGE);
            }
            for (const node of [back, layers.front]) {
                if (!node) continue;
                node.style.width = `${width}px`;
                node.style.height = `${height}px`;
                node.style.left = `${Math.round(left)}px`;
                node.style.top = `${Math.round(cy - height * anchorY)}px`;
            }
        };
        place();

        const block = message.querySelector(':scope > .mes_block');
        for (let pass = 0; pass < 4; pass += 1) {
            const ov = back.getBoundingClientRect();
            const box = message.getBoundingClientRect();
            const above = box.top + EDGE - ov.top;
            if (above > 0.5) {
                const cur = parseFloat(message.style.getPropertyValue('--star-top-extra')) || 0;
                message.style.setProperty('--star-top-extra', `${Math.round(cur + above + 1)}px`);
                place();
                continue;
            }

            if (block) {
                const gap = block.getBoundingClientRect().top - (ov.bottom + EDGE);
                if (Math.abs(gap) > 1) {
                    const cur = parseFloat(message.style.getPropertyValue('--star-block-offset')) || 0;
                    message.style.setProperty('--star-block-offset', `${Math.max(0, Math.round(cur - gap))}px`);
                    place();
                    continue;
                }
            }
            const below = ov.bottom - (box.bottom - EDGE);
            if (below > 0.5) {
                const cur = parseFloat(message.style.getPropertyValue('--star-block-offset')) || 0;
                message.style.setProperty('--star-block-offset', `${Math.round(cur + below + 1)}px`);
                place();
                continue;
            }
            break;
        }

        place();
    }

    applyAvatarStyle(message, config, fit = 1) {
        const frameStyle = config.avatar?.frameStyle || 'none';
        const shape = config.avatar?.shape || 'circle';
        const shapeRotate = shapeRotateOf(config);
        const zoom = (Number(config.avatar?.zoom) || 1) * this.globalScale * fit;
        const ratioX = clampAvatarBox(config.avatar?.widthRatio);
        const ratioY = clampAvatarBox(config.avatar?.heightRatio);
        const rotateScale = avatarRotateScaleFor(config);
        if (message.dataset.starAvatarFrame !== frameStyle) message.dataset.starAvatarFrame = frameStyle;
        const hidden = avatarIsHidden(config);
        if (message.dataset.starAvatarHidden !== (hidden ? '1' : '0')) {
            message.dataset.starAvatarHidden = hidden ? '1' : '0';
        }
        message.style.setProperty('--star-photo-tone',toneFilter(config.avatar?.photoTone));
        message.style.setProperty('--star-avatar-zoom', zoom.toFixed(3));
        message.style.setProperty('--star-avatar-zoom-x', (zoom * ratioX).toFixed(3));
        message.style.setProperty('--star-avatar-zoom-y', (zoom * ratioY).toFixed(3));
        message.style.setProperty('--star-avatar-rotate-scale', rotateScale.toFixed(4));
        message.style.setProperty('--star-avatar-rotate', `${photoRotateRelative(config)}deg`);
        message.style.setProperty('--star-avatar-shape-rotate', `${shapeRotate}deg`);
        message.style.setProperty('--star-avatar-shape-fit', avatarShapeFitScale(config).toFixed(4));
        message.style.setProperty('--star-paper', config.theme?.paper || '#fdfbf7');
        message.style.setProperty('--star-accent', config.theme?.accent || '#c9b8c8');
        message.style.setProperty('--star-ink', config.theme?.ink || '#5b5560');
        message.style.setProperty('--star-soft', config.theme?.soft || '#f0e8f5');
        message.style.setProperty('--star-secondary', config.theme?.secondary || '#d8d0de');
        this.liftAvatar(message);
        this.applyAvatarFrame(message, frameStyle, config);
        this.applyAvatarShape(message, shape, frameStyle !== 'none');
        const avatarNode = this.findAvatar(message);
        if (avatarNode) {
                                          
            const needClip = frameStyle === 'none' && shapeRotate !== 0;
            if (needClip) avatarNode.dataset.starShapeRotated = '1';
            else if (avatarNode.dataset.starShapeRotated) delete avatarNode.dataset.starShapeRotated;
        }
        message.style.setProperty('--star-avatar-view', avatarViewBox(config));
        const focusX = Number(config.avatar?.focusX);
        const focusY = Number(config.avatar?.focusY);
        message.style.setProperty('--star-avatar-focus-x', `${Number.isFinite(focusX) ? focusX : 50}%`);
        message.style.setProperty('--star-avatar-focus-y', `${Number.isFinite(focusY) ? focusY : 50}%`);
    }

    applyAvatarFrame(message, frameStyle, config) {
        const avatar = this.findAvatar(message);
        const image = avatar?.querySelector('img');
        if (!avatar || !image) return;
        const wrapper = avatar.querySelector(':scope > .star-avatar-frame');
        if (frameStyle === 'none') {
            if (!wrapper) return;
            const inner = wrapper.querySelector('img');
            if (inner) wrapper.replaceWith(inner);
            else wrapper.remove();
            return;
        }
        if (wrapper) {
            wrapper.className = 'star-avatar-frame';
            avatarFrameVars(wrapper, frameStyle);
            return;
        }
        const frame = document.createElement('div');
        frame.className = 'star-avatar-frame';
        avatarFrameVars(frame, frameStyle);
        const inner = document.createElement('div');
        inner.className = 'stargaze-image-frame';
        image.replaceWith(frame);
        inner.append(image);
        frame.append(inner);
    }

    applyAvatarShape(message, shape, skip) {
        const avatar = this.findAvatar(message);
        if (!avatar) return;
        if (skip) {
            avatar.style.clipPath = '';
            avatar.style.borderRadius = '';
            return;
        }
        const style = shapeStyle(shape);
        if (avatar.style.clipPath !== style.clipPath) avatar.style.clipPath = style.clipPath;
        if (avatar.style.borderRadius !== style.borderRadius) avatar.style.borderRadius = style.borderRadius;
    }

    liftAvatar(message) {
        const avatar = this.findAvatar(message);
        if (!avatar) return;
        const nodes = [avatar];
        const parent = avatar.parentElement;

        if (parent && parent !== message && parent.classList.contains('mesAvatarWrapper')) nodes.push(parent);
        for (const node of nodes) {
            if (!node) continue;
            if (getComputedStyle(node).position === 'static') {
                node.style.position = 'relative';
                node.dataset.starLifted = '1';
            }
            node.style.zIndex = '2';
        }
    }

    unmountMessage(message) {
        message.querySelector(':scope > .stargaze-avatar-collage')?.remove();
        message.querySelector(':scope > .stargaze-front-layer')?.remove();
        message.querySelectorAll('.star-avatar-frame').forEach(frame => {
            const image = frame.querySelector('img');
            if (image) frame.replaceWith(image);
            else frame.remove();
        });
        message.classList.remove('stargaze-mounted');
        for (const node of [this.findAvatar(message), message.querySelector(':scope > .mesAvatarWrapper')]) {
            if (!node) continue;
            node.style.removeProperty('z-index');
            if (node.dataset.starShapeRotated) delete node.dataset.starShapeRotated;
            if (node.dataset.starLifted) {
                node.style.removeProperty('position');
                delete node.dataset.starLifted;
            }
        }
        for (const name of ['--star-photo-tone','--star-inset', '--star-pad-top', '--star-top-extra', '--star-block-offset', '--star-avatar-zoom', '--star-avatar-zoom-x', '--star-avatar-zoom-y', '--star-avatar-rotate', '--star-avatar-rotate-scale', '--star-avatar-shape-rotate', '--star-avatar-shape-fit', '--star-avatar-focus-x', '--star-avatar-focus-y', '--star-avatar-view', '--star-paper', '--star-accent', '--star-ink', '--star-soft', '--star-secondary']) {
            message.style.removeProperty(name);
        }
        delete message.dataset.starAvatarFrame;
        delete message.dataset.starAvatarHidden;
        delete message.dataset.starInset;
        delete message.dataset.starLayout;
        delete message.dataset.stargazeSignature;
        this.configs.delete(message);
    }

    unmountAll() {
        document.querySelectorAll('#chat .mes.stargaze-mounted').forEach(message => this.unmountMessage(message));
    }

    repositionAll() {
        document.querySelectorAll('#chat .mes.stargaze-mounted').forEach(message => {
            const config = this.configs.get(message);
            const back = message.querySelector(':scope > .stargaze-avatar-collage');
            const front = message.querySelector(':scope > .stargaze-front-layer');
            const avatar = this.findAvatar(message);
            const image = avatar?.querySelector('img');
            if (!config || !back) return;
            this.positionOverlay(message, image, { back, front }, config);
        });
    }

    captureScrollAnchor() {
        const chat = document.querySelector('#chat');
        if (!chat) return null;
        const box = chat.getBoundingClientRect();
        const anchor = [...chat.querySelectorAll('.mes')]
            .find(message => message.getBoundingClientRect().bottom > box.top + 4);
        if (!anchor) return null;
        return { chat, anchor, top: anchor.getBoundingClientRect().top };
    }

    restoreScrollAnchor(state) {
        if (!state) return;
        const delta = state.anchor.getBoundingClientRect().top - state.top;
        if (Math.abs(delta) > 1) state.chat.scrollTop += delta;
    }

    mountMessage(message, layers, signature, config) {
        const avatar = this.findAvatar(message);
        const image = avatar?.querySelector('img');
        if (!avatar || !image) return false;
        this.unmountMessage(message);

        const computed = getComputedStyle(message);
        message.style.setProperty('--star-pad-top', `${parseFloat(computed.paddingTop) || 0}px`);
        layers.back.dataset.stargazeSignature = signature;
        message.dataset.stargazeSignature = signature;
        message.dataset.starLayout = config.layout;
        message.classList.add('stargaze-mounted');
        delete message.dataset.starSuspended;
        message.append(layers.back);
        if (layers.front && !layers.front.hidden) message.append(layers.front);
        this.configs.set(message, config);
        this.positionOverlay(message, image, layers, config);
        return true;
    }

    async render() {
        const generation = ++this.generation;
        const context = this.getContext();
        const globalSettings = await this.store.getGlobal();
        this.globalScale = Math.min(2, Math.max(0.5, Number(globalSettings.collageScale) || 1));
        if (!globalSettings.enabled) {
            this.unmountAll();
            return;
        }

        if (!document.querySelector('#chat .mes')) {
            this.unmountAll();
            return;
        }
        const messages = [...document.querySelectorAll('#chat .mes[is_user="false"]')]
            .filter(message => message.getAttribute('is_system') !== 'true' && !message.classList.contains('smallSysMes'));
        const lazy = globalSettings.lazyRender !== false;
        if (lazy) this.observeViewport(messages);
        const lastByCharacter = new Map();
        for (const message of messages) {
            const character = this.resolveCharacter(message, context);
            if (character) lastByCharacter.set(characterKey(character), message);
        }

        const scrollAnchor = lazy ? this.captureScrollAnchor() : null;
        // 一轮刷新中，同一角色的多条消息共用一次存储读取。
        const configByCharacter=new Map();
        for (const message of messages) {
            if (generation !== this.generation) return;
            const character = this.resolveCharacter(message, context);
            if (!character) {
                this.unmountMessage(message);
                continue;
            }
            const key = characterKey(character);
            if (globalSettings.displayMode === 'latest' && lastByCharacter.get(key) !== message) {
                this.unmountMessage(message);
                continue;
            }

            if (lazy && !this.isNear(message)) {
                this.suspendMessage(message);
                continue;
            }
            const boundTemplate = globalSettings.characterTemplates?.[key];
            let config=configByCharacter.get(key);
            if(!config){config=(await this.store.getCharacterConfig(key, character.name))||createConfig(key, character.name, boundTemplate || 'free');configByCharacter.set(key,config);}

            if (!config.elements.length) {
                this.unmountMessage(message);
                continue;
            }
            const packages=themePackages();
            if(packages&&config.elements.some(e=>e.type==='image'&&e.assetId!=='__avatar__'&&!packages.available(e.assetId))){this.unmountMessage(message);continue;}

            const avatarImage = this.findAvatar(message)?.querySelector('img');
            const avatarUrl = avatarImage?.currentSrc || avatarImage?.src
                || (character.avatar && character.avatar !== 'none' ? context.getThumbnailUrl('avatar', character.avatar) : AVATAR_PLACEHOLDER);
            // 角色头像或字段变化也会刷新跟随的副图与文字；仅配置时间戳不足以判断。
            const signature = [key, config.updatedAt, config.layout, config.templateId,assetRevision(),
                config.canvas.width, config.canvas.height, config.canvas.anchorX, config.canvas.anchorY,
                config.avatar?.shape, config.avatar?.zoom,JSON.stringify(config.avatar?.photoTone||null), config.avatar?.hidden ? 'hid' : 'vis',
                avatarUrl, JSON.stringify(characterFields(character)), globalSettings.mobileMaxElements,
                globalThis.matchMedia?.('(max-width: 640px)').matches ? 'mobile' : 'desktop',
                globalSettings.animations ? 'anim' : 'still'].join('|');
            const mountedOverlay = message.querySelector(':scope > .stargaze-avatar-collage');
            const mountedFront = message.querySelector(':scope > .stargaze-front-layer');
            if (message.dataset.stargazeSignature === signature && mountedOverlay) {
                const mountedImage = this.findAvatar(message)?.querySelector('img');
                this.configs.set(message, config);
                this.positionOverlay(message, mountedImage, { back: mountedOverlay, front: mountedFront }, config);
                continue;
            }
            const assetUrls = new Map();
            const ids = [...new Set(config.elements
                .filter(element => element.type === 'image' && element.assetId !== '__avatar__' && !isBuiltinAsset(element.assetId))
                .map(element => element.assetId))];
            for (const id of ids) assetUrls.set(id, await this.getAssetUrl(id));
            if (generation !== this.generation) return;
            const layers = this.cachedCollage(signature,()=>this.buildCollage(config, character, assetUrls, avatarUrl, globalSettings));
            this.mountMessage(message, layers, signature, config);
        }

        document.querySelectorAll('#chat .mes.stargaze-mounted').forEach(message => {
            if (!messages.includes(message)) this.unmountMessage(message);
        });
        this.restoreScrollAnchor(scrollAnchor);
    }

    destroy() {
        ++this.generation;
        this.collageCache.clear();
        document.querySelectorAll('[data-stargaze-observed]').forEach(message=>{delete message.dataset.stargazeObserved;delete message.dataset.starSuspended;});
        clearTimeout(this.timer);
        this.observer?.disconnect();
        this.resizeObserver?.disconnect();
        this.viewObserver?.disconnect();
        this.observer = null;
        this.resizeObserver = null;
        this.viewObserver = null;
        this.nearViewport.clear();
        this.observedMessages.clear();
        this.unmountAll();
        for (const url of this.assetUrls.values()) URL.revokeObjectURL(url);
        this.assetUrls.clear();
    }
}
