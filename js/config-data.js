/**
 * 配置中的图片不只存在于当前画布，还可能存在于尺寸草稿、主题草稿和模板变体。
 * 备份、导入、删除素材统一走这里，避免漏掉其他尺寸里的独立副图。
 */
export function* configStates(root) {
    const seen = new WeakSet();
    function* visit(state) {
        if (!state || typeof state !== 'object' || seen.has(state)) return;
        seen.add(state);
        if (Array.isArray(state.elements)) yield state;
        if (state.config) yield* visit(state.config);
        for (const child of Object.values(state.sizes || {})) yield* visit(child);
        for (const drafts of Object.values(state.templateSizeDrafts || {})) {
            for (const child of Object.values(drafts || {})) yield* visit(child);
        }
        for (const variant of state.variants || []) yield* visit(variant.config);
    }
    yield* visit(root);
}

export function referencedAssets(config) {
    return [...new Set([...configStates(config)].flatMap(state=>[
        ...state.elements.filter(element=>element.type==='image'&&element.assetId!=='__avatar__').map(element=>element.assetId),
        state.shareMetadata?.coverAssetId,
    ]).filter(Boolean))];
}

export function remapAssets(config, idMap) {
    for (const state of configStates(config)) {
        if(idMap.has(state.shareMetadata?.coverAssetId))state.shareMetadata.coverAssetId=idMap.get(state.shareMetadata.coverAssetId);
        for (const element of state.elements) {
            if (element.type === 'image' && idMap.has(element.assetId)) element.assetId = idMap.get(element.assetId);
        }
    }
    return config;
}

/** 模板只包含导出的设计，不携带其他主题的个人工作草稿。角色备份仍保留全部草稿。 */
export function templateConfig(config) {
    const copy = typeof structuredClone === 'function' ? structuredClone(config) : JSON.parse(JSON.stringify(config));
    for (const key of ['key','characterKey','studioSchemeId','studioSchemeName','updatedAt','sizes','sizeKey','templateSizeDrafts']) delete copy[key];
    return copy;
}
