import {openSchemes,openRevisions} from './schemes.js';
import {openSizeBoard} from './board.js';
import {openLibrary,refreshStudioTray,bindStudioTray} from './library.js';
import {openPreflight} from './preflight.js';
import {openChatPreview} from './chat-preview.js';
import {openToneDialog} from './tone-dialog.js';
import {openSharing} from './sharing.js';
import {studioDialog} from './views.js';

export {refreshStudioTray,bindStudioTray,openPreflight};
const tools=[
 ['schemes','角色方案','同一角色，多套搭配，一键切换',openSchemes],
 ['board','九尺寸总览','检查当前稿件，勾选内容同步',openSizeBoard],
 ['library','收藏与素材组合','个人标签、常用素材和可复用组合',openLibrary],
 ['preflight','稿件自检','检查缺图、越界、空图层与尺寸',e=>openPreflight(e,{all:true})],
 ['history','历史稿件','命名保存关键稿件，随时找回',openRevisions],
 ['chat','聊天预览','切换背景和屏幕宽度，检查阅读空间',openChatPreview],
 ['tone','照片调色','分别调整主图与副图的照片色调',openToneDialog],
 ['sharing','模板封面与介绍','封面、作者、说明和素材来源',openSharing],
];
export function openStudio(editor){
 const {dialog}=studioDialog(editor,'创作工具',`<div class="star-studio-home">${tools.map(([id,name,desc])=>`<button data-studio-tool="${id}"><strong>${name}</strong><span>${desc}</span></button>`).join('')}</div>`);
 dialog.addEventListener('click',event=>{const b=event.target.closest('[data-studio-tool]');if(!b)return;const tool=tools.find(t=>t[0]===b.dataset.studioTool);dialog.close();try{Promise.resolve(tool[3](editor)).catch(error=>editor.notify(error.message));}catch(error){editor.notify(error.message);}});
}
