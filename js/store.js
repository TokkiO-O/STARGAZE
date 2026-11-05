import {normalizeMetadata} from './template-meta.js';
import { normalizeConfig, uid, BUILTIN_MAP } from './templates.js';
import { referencedAssets, remapAssets, templateConfig } from './config-data.js';
import { prepareAssets } from './asset-loader.js';
import { APP_VERSION } from './version.js';

const DB_NAME = 'stargaze-independent-store';
const STORES = ['configs', 'assets', 'templates'];

export const LIBRARY_OWNER = '__library__';

export const DEFAULT_GLOBAL_SETTINGS = {
    key: 'global',
    enabled: true,
    displayMode: 'all',
    autoSave: true,
    mobileMaxElements: 60,
    collageScale: 1,
    floatingEnabled: true,
    floatPos: null,

    lazyRender: true,

    animations: false,

    characterTemplates: {},
};

function clone(value) {
    if (typeof structuredClone === 'function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
}

function requestResult(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('IndexedDB request failed'));
    });
}

export function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error || new Error('无法读取图片'));
        reader.readAsDataURL(blob);
    });
}

export function dataUrlToBlob(dataUrl) {
    const match = /^data:([^;]+);base64,(.+)$/s.exec(dataUrl || '');
    if (!match) throw new Error('备份中存在无效图片数据');
    const binary = atob(match[2]);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
    return new Blob([bytes], { type: match[1] });
}

// 写入成功以事务提交为准；单个请求 success 后事务仍可能因磁盘等原因中止。
function transactionDone(transaction) {
    return new Promise((resolve, reject) => {
        transaction.oncomplete = resolve;
        transaction.onabort = transaction.onerror = () => reject(transaction.error || new Error('本地存储事务未完成'));
    });
}

async function sameBlob(a, b) {
    if (a.size !== b.size || a.type !== b.type) return false;
    const [left, right] = await Promise.all([a.arrayBuffer(), b.arrayBuffer()]);
    const x = new Uint8Array(left), y = new Uint8Array(right);
    return x.every((value, index) => value === y[index]);
}

export class StarStore {
    constructor() {
        this.db = null;
        this.persistent = false;
        this.storageMode = 'memory';
        this.error = null;
        this.memory = Object.fromEntries(STORES.map(name => [name, new Map()]));

        this.configCache = new Map();
        this.opening = null;
    }

    async init() {
        if (!globalThis.indexedDB) {
            this.error = '当前浏览器不支持 IndexedDB，本次只能临时使用。';
            return this;
        }
        try {
            await this.connect();
        } catch (error) {
            // 已有数据库断开时保留原存储后端，不以空白临时数据代替用户稿件。
            if (this.persistent) throw error;
            this.error = `独立存储不可用：${error.message}。本次只能临时使用。`;
            console.warn('[STARGAZE]', error);
        }
        return this;
    }

    invalidateConnection(db) {
        if (this.db !== db) return;
        this.db = null;
        this.configCache.clear();
    }

    /** 多个读写共用一次重连；不指定旧版本号，兼容其他页面已完成的数据库升级。 */
    async connect() {
        if (this.db) return this.db;
        if (this.opening) return this.opening;
        const opening = (async () => {
            const db = await new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME);
                let settled = false;
                request.onupgradeneeded = () => {
                    const db = request.result;
                    if (!db.objectStoreNames.contains('configs')) db.createObjectStore('configs', { keyPath: 'key' });
                    if (!db.objectStoreNames.contains('assets')) db.createObjectStore('assets', { keyPath: 'id' });
                    if (!db.objectStoreNames.contains('templates')) db.createObjectStore('templates', { keyPath: 'id' });
                };
                request.onsuccess = () => {
                    if (settled) { request.result.close(); return; }
                    settled = true; resolve(request.result);
                };
                const fail = error => { if (!settled) { settled = true; reject(error); } };
                request.onerror = () => fail(request.error || new Error('IndexedDB 打开失败'));
                request.onblocked = () => fail(new Error('本地数据库正在被其他页面使用，请稍后重试'));
            });
            // 必须捕获本次连接；旧连接的事件不能关闭重连后得到的新连接。
            db.onversionchange = () => { this.invalidateConnection(db); db.close(); };
            db.onclose = () => this.invalidateConnection(db);
            this.db = db;
            this.persistent = true;
            this.storageMode = 'indexedDB';
            this.error = null;
            this.configCache.clear();
            return db;
        })();
        this.opening = opening;
        try { return await opening; }
        finally { if (this.opening === opening) this.opening = null; }
    }

    /** 只重试尚未创建事务的失效连接，已提交的写入不会重复执行。 */
    async withObjectStore(storeName, mode, operation) {
        for (let attempt = 0; attempt < 2; attempt++) {
            const db = await this.connect();
            let transaction;
            try { transaction = db.transaction(storeName, mode); }
            catch (error) {
                if (attempt === 0 && error.name === 'InvalidStateError') {
                    this.invalidateConnection(db); db.close(); continue;
                }
                throw error;
            }
            const done = transactionDone(transaction);
            let request;
            try { request = operation(transaction.objectStore(storeName)); }
            catch (error) {
                try { transaction.abort(); } catch {}
                await done.catch(() => {}); throw error;
            }
            const [result] = await Promise.all([requestResult(request), done]);
            return result;
        }
    }

    async get(storeName, key) {
        if (!this.persistent) return clone(this.memory[storeName].get(key) || null);
        return (await this.withObjectStore(storeName, 'readonly', store => store.get(key))) || null;
    }

    async put(storeName, value) {
        const copy = clone(value);
        if (!this.persistent) {
            const key = storeName === 'assets' ? copy.id : storeName === 'templates' ? copy.id : copy.key;
            this.memory[storeName].set(key, copy);
            return copy;
        }
        await this.withObjectStore(storeName, 'readwrite', store => store.put(copy));
        return copy;
    }

    async remove(storeName, key) {
        if (!this.persistent) {
            this.memory[storeName].delete(key);
            return;
        }
        await this.withObjectStore(storeName, 'readwrite', store => store.delete(key));
    }

    async getAll(storeName) {
        if (!this.persistent) return clone([...this.memory[storeName].values()]);
        return await this.withObjectStore(storeName, 'readonly', store => store.getAll());
    }

    async getGlobal() {
        const saved = await this.get('configs', 'global');
        return { ...DEFAULT_GLOBAL_SETTINGS, ...(saved || {}), key: 'global' };
    }

    async saveGlobal(settings) {
        return await this.put('configs', { ...DEFAULT_GLOBAL_SETTINGS, ...settings, key: 'global' });
    }

    async getBoundTemplate(key) {
        const settings = await this.getGlobal();
        return settings.characterTemplates?.[key] || '';
    }

    async bindCharacterTemplate(key, templateId) {
        const settings = await this.getGlobal();
        const map = { ...(settings.characterTemplates || {}) };
        if (templateId) map[key] = templateId;
        else delete map[key];
        await this.saveGlobal({ ...settings, characterTemplates: map });
        return map[key] || '';
    }

    async getCharacterConfig(key, characterName = 'STARGAZE') {
        const cacheKey = `${key}|${characterName}`;
        const cached = this.configCache.get(cacheKey);
        if (cached) return clone(cached);
        const config = await this.get('configs', `character:${key}`);
        const normalized = config ? normalizeConfig(config, key, characterName) : null;
        if (normalized) this.configCache.set(cacheKey, clone(normalized));
        return normalized;
    }

    async saveCharacterConfig(config) {
        const normalized = normalizeConfig(config, config.characterKey, config.nickname);
        // 连续保存也有独立修订号，避免同一毫秒内的修改被聊天缓存误判为未变。
        const previous=Number(config.updatedAt);
        this.lastSavedAt=Math.max(Date.now(),Number.isFinite(previous)?previous+1:0,(this.lastSavedAt||0)+1);
        normalized.updatedAt = this.lastSavedAt;
        await this.put('configs', { ...normalized, key: `character:${normalized.characterKey}` });
        this.configCache.clear();
        return normalized;
    }

    async saveThemeCheckpoint(config) {
        const key=`theme-checkpoint:${config.characterKey}:${config.templateId}`;
        return await this.put('configs',{key,kind:'theme-checkpoint',themeId:config.templateId,characterKey:config.characterKey,createdAt:Date.now(),config:clone(config)});
    }

    async getThemeCheckpoint(characterKey,themeId) {
        return await this.get('configs',`theme-checkpoint:${characterKey}:${themeId}`);
    }

    async saveAsset(blob, ownerKey, name = 'image') {
        if (!(blob instanceof Blob)) throw new Error('请选择有效的图片文件');
        const asset = {
            id: uid('asset'),
            ownerKey,
            name: String(name).slice(0, 160),
            type: blob.type || 'image/png',
            blob,
            createdAt: Date.now(),
        };
        await this.put('assets', asset);
        return asset;
    }

    async getAsset(id) {
        return await this.get('assets', id);
    }

    async getAssetsForOwner(ownerKey) {
        const assets = await this.getAll('assets');
        return assets.filter(asset => asset.ownerKey === ownerKey).sort((a, b) => b.createdAt - a.createdAt);
    }

    async listLibraryAssets() {
        return await this.getAssetsForOwner(LIBRARY_OWNER);
    }

    async promoteAssetToLibrary(id) {
        const asset = await this.getAsset(id);
        if (!asset) throw new Error('素材不存在');
        const next = { ...asset, ownerKey: LIBRARY_OWNER };
        await this.put('assets', next);
        return next;
    }

    async deleteAsset(id) {
        await this.remove('assets', id);
    }

    // ---------- 备份与素材迁移：遍历所有尺寸/主题草稿 ----------
    async exportCharacter(config, { embedBuiltin = false, extraConfigs=[] } = {}) {
        const assets = [];
        const ids = [...new Set([config,...extraConfigs].flatMap(referencedAssets))];
        if (embedBuiltin) await prepareAssets(ids);
        for (const id of ids) {
            let asset = await this.getAsset(id);
            if (!asset && embedBuiltin) {
                const builtin = BUILTIN_MAP.get(id);
                if (builtin?.url) {
                    try { asset = { id, name: builtin.name, blob: await fetch(builtin.url).then(response => {
                        if (!response.ok) throw new Error('素材读取失败'); return response.blob();
                    }) }; } catch { throw new Error(`无法打包素材「${builtin.name}」，请检查图片是否仍可读取`); }
                }
            }
            if (asset?.blob) assets.push({ id, name: asset.name, type: asset.blob.type, dataUrl: await blobToDataUrl(asset.blob) });
        }
        return { type: 'STARGAZE_BACKUP', version: 1, appVersion: APP_VERSION, exportedAt: new Date().toISOString(), config: clone(config), assets };
    }

    /** 一个模板包只导入一次素材，九个尺寸共用映射，避免重复解码和写库。 */
    async importAssets(assets = []) {
        const library = await this.listLibraryAssets(), idMap = new Map();
        let added = 0;
        for (const asset of assets) {
            if (!asset?.id || !asset.dataUrl || idMap.has(asset.id)) continue;
            const blob = dataUrlToBlob(asset.dataUrl);
            if (!blob.type.startsWith('image/')) throw new Error('备份中包含非图片资源');
            const name = String(asset.name || 'imported-image').slice(0, 160);
            let same = null;
            for (const candidate of library.filter(item => item.name === name && item.blob?.size === blob.size)) {
                if (await sameBlob(candidate.blob, blob)) { same = candidate; break; }
            }
            if (same) { idMap.set(asset.id, same.id); continue; }
            const saved = await this.saveAsset(blob, LIBRARY_OWNER, name);
            library.push(saved); idMap.set(asset.id, saved.id); added++;
        }
        return { idMap, added };
    }

    async importCharacter(backup, currentKey, characterName) {
        if (!['STARGAZE_BACKUP', 'STAR_IDOL_BACKUP'].includes(backup?.type) || !backup.config || !Array.isArray(backup.assets))
            throw new Error('这不是有效的 STARGAZE 角色备份');
        const sources=(Array.isArray(backup.studioRecords)?backup.studioRecords:[]).slice(0,40).filter(r=>['studio-scheme','studio-revision'].includes(r?.kind)&&r.config);
        const existing=(await this.getAll('configs')).filter(r=>r.characterKey===currentKey),known=new Set(),planned=[];
        for(const source of sources){
            const origin=String(source.importedFrom||source.key||uid('origin'));
            if(known.has(source.kind+origin))continue;known.add(source.kind+origin);
            const prior=existing.find(r=>r.kind===source.kind&&(r.key===source.key||r.importedFrom===origin));
            planned.push({source,origin,prior,key:prior?.key||source.kind+':'+uid('import')});
        }
        if(existing.filter(r=>r.kind==='studio-scheme').length+planned.filter(r=>r.source.kind==='studio-scheme'&&!r.prior).length>20)throw new Error('导入后角色方案会超过 20 套，请先备份并移除不需要的方案');
        const { idMap, added } = await this.importAssets(backup.assets);
        const imported = remapAssets(clone(backup.config), idMap), records=[], schemeMap=new Map();
        // 角色方案及历史一起迁移；重复导入同一备份会更新对应稿件，不重复堆积。
        for(const {source,origin,prior,key} of planned){
            const config=normalizeConfig(remapAssets(clone(source.config),idMap),currentKey,characterName);config.nickname=characterName||config.nickname;
            if(source.kind==='studio-scheme')schemeMap.set(source.key,key);
            records.push({key,kind:source.kind,characterKey:currentKey,name:String(source.name||'导入稿件').slice(0,60),config,importedFrom:origin,createdAt:Number(source.createdAt)||Date.now(),updatedAt:Number(source.updatedAt)||Date.now()});
        }
        for(const record of records){
            const mapped=schemeMap.get(record.config.studioSchemeId);
            if(mapped)record.config.studioSchemeId=mapped;else{delete record.config.studioSchemeId;delete record.config.studioSchemeName;}
            if(record.kind==='studio-scheme'){record.config.studioSchemeId=record.key;record.config.studioSchemeName=record.name;}
        }
        const active=schemeMap.get(imported.studioSchemeId);
        if(active)imported.studioSchemeId=active;else{delete imported.studioSchemeId;delete imported.studioSchemeName;}
        imported.characterKey = currentKey; imported.nickname = characterName || imported.nickname;
        const created=[];
        try{
            for(const record of records){await this.put('configs',record);created.push(record.key);}
            const config=await this.saveCharacterConfig(imported);
            const revisions=(await this.getAll('configs')).filter(r=>r.kind==='studio-revision'&&r.characterKey===currentKey).sort((a,b)=>b.updatedAt-a.updatedAt);
            const limit=(await this.get('configs','studio-policy:'+currentKey))?.limit||10;
            for(const record of revisions.slice(limit))await this.remove('configs',record.key).catch(()=>{});
            return { ...config, importedAssets: added };
        }catch(error){for(const key of created){const prior=planned.find(p=>p.key===key)?.prior;if(prior)await this.put('configs',prior).catch(()=>{});else await this.remove('configs',key).catch(()=>{});}throw error;}
    }

    /** 导入模板只增加「我的模板」，不会悄悄覆盖当前角色的保存稿。 */
    async importTemplatePack(pack, key, name) {
        if (!['STARGAZE_TEMPLATE_PACK', 'STAR_IDOL_TEMPLATE_PACK'].includes(pack?.type)) throw new Error('这不是有效的 STARGAZE 模板包');
        const variants = Array.isArray(pack?.variants) ? pack.variants.filter(v => v?.config) : [];
        const rawPrimary = pack?.config || variants[0]?.config;
        const primary=rawPrimary?{...rawPrimary,shareMetadata:normalizeMetadata(pack.metadata||rawPrimary.shareMetadata)}:null;
        if (!primary) throw new Error('模板包里没有配置');
        const { idMap } = await this.importAssets(pack.assets || []);
        const convert = value => normalizeConfig(remapAssets({...clone(value),shareMetadata:normalizeMetadata(pack.metadata||value.shareMetadata)}, idMap), key, name);
        const mapped = variants.map(v => ({ layout: v.layout || v.config.layout, name: v.name || v.layout, config: convert(v.config) }));
        return this.saveCustomTemplate(String(pack.name || '导入的模板').slice(0, 60), convert(primary), { variants: mapped });
    }

    async listCustomTemplates() {
        const templates = await this.getAll('templates');
        return templates.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    async saveCustomTemplate(name, config, options = {}) {
        const clean = templateConfig;
        const template = {
            id: uid('template'),
            name: String(name || '我的模板').slice(0, 60),
            config: clean(config),
            metadata:normalizeMetadata(config.shareMetadata),
            updatedAt: Date.now(),
        };
        if (Array.isArray(options.variants) && options.variants.length) {
            template.variants = options.variants
                .filter(variant => variant?.config)
                .map(variant => ({
                    layout: String(variant.layout || variant.config.layout || ''),
                    name: String(variant.name || variant.layout || ''),
                    config: clean(variant.config),
                }));
        }
        await this.put('templates', template);
        return template;
    }

    async deleteCustomTemplate(id) {
        await this.remove('templates', id);
    }
}
