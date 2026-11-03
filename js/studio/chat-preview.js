import {renderCollage} from '../exporter.js';
import {characterFields} from '../templates.js';
import {studioDialog,esc,status} from './views.js';

export function openChatPreview(editor){
 const chat=document.querySelector('#chat'),computed=chat?getComputedStyle(chat):null;
 // 酒馆聊天区常用透明底，沿父级寻找背景，避免深色皮肤出现白底白字。
 const foreground=(computed?.color||'').match(/[\d.]+/g)?.slice(0,3).map(Number)||[];
 let environmentColor=foreground.reduce((n,v)=>n+v,0)>450?'#252933':'#f5f2ef',environmentImage='none';
 for(let node=chat;node;node=node.parentElement){
  const style=getComputedStyle(node),parts=style.backgroundColor.match(/[\d.]+/g)?.map(Number)||[];
  if(environmentImage==='none'&&style.backgroundImage!=='none')environmentImage=style.backgroundImage;
  if(parts.length>=3&&(parts.length===3||parts[3]>=.95)){environmentColor=style.backgroundColor;break;}
 }
 const {dialog}=studioDialog(editor,'聊天效果预览',`<p class="star-dialog-hint">用示例消息检查版头大小和阅读空间，支持切换背景与屏幕宽度。</p><div class="star-studio-controls"><label>背景<select data-chat-mode><option value="current">当前环境</option><option value="light">浅色</option><option value="dark">深色</option><option value="custom">自选颜色</option></select></label><input type="color" value="#ece5ec" data-chat-color aria-label="自选背景颜色"><label>屏幕宽度<select data-chat-width><option value="390">手机 · 390</option><option value="768">平板 · 768</option><option value="1100" selected>电脑 · 1100</option></select></label></div><div class="star-chat-preview-scroll"><div class="star-chat-preview-surface"><article class="star-preview-message"><div data-chat-art></div><div class="star-preview-message-head"><strong>${esc(editor.character.name)}</strong><small>128 tokens</small></div><p data-chat-message>这是一段用于检查版头大小、层次和阅读空间的示例消息。</p></article><article class="star-preview-user">这样搭配的大小和层次是否合适？</article></div></div><label>示例消息<textarea data-chat-text rows="2" maxlength="1000">这是一段用于检查版头大小、层次和阅读空间的示例消息。</textarea></label><p data-studio-status role="status"></p>`,{className:'star-chat-preview-dialog'});
 const surface=dialog.querySelector('.star-chat-preview-surface');
 const paint=()=>{
  const mode=dialog.querySelector('[data-chat-mode]').value,dark=mode==='dark',color=mode==='custom'?dialog.querySelector('[data-chat-color]').value:dark?'#252933':mode==='current'?environmentColor:'#f5f2ef';
  surface.style.width=dialog.querySelector('[data-chat-width]').value+'px';surface.style.backgroundColor=color;surface.style.color=dark?'#e9e5ef':mode==='current'&&computed?.color?computed.color:'#36363c';surface.classList.toggle('is-dark',dark);
  if(mode==='current'&&computed){surface.style.fontFamily=computed.fontFamily;surface.style.backgroundImage=environmentImage;}else surface.style.backgroundImage='none';
  const art=dialog.querySelector('[data-chat-art]'),settings=editor.global,scale=Math.max(.5,Math.min(2,Number(settings.collageScale)||1));
  const preferred=60*(Number(editor.config.canvas.avatarScale)||4.8)*scale*(Number(editor.config.avatar.widthRatio)||1),width=Math.min(Number(dialog.querySelector('[data-chat-width]').value)-48,preferred,600);
  art.style.width=Math.max(120,width)+'px';dialog.querySelector('[data-chat-message]').textContent=dialog.querySelector('[data-chat-text]').value;
 };
 dialog.addEventListener('input',paint);dialog.addEventListener('change',paint);paint();
 void renderCollage(editor.config,{avatarUrl:editor.avatarUrl,assetUrls:editor.assetUrls,fields:characterFields(editor.character),quality:.8}).then(canvas=>{if(dialog.isConnected)dialog.querySelector('[data-chat-art]').replaceChildren(canvas);}).catch(e=>status(dialog,e.message));
}
