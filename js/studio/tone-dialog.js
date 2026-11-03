import {BUILTIN_MAP} from '../templates.js';
import {normalizeTone,toneFilter} from '../photo-tone.js';
import {studioDialog,esc,status} from './views.js';

export function openToneDialog(editor){
 const secondary=editor.config.elements.filter(e=>e.photoRole==='secondary'),selected=editor.selectedElement();
 const targets=[{id:'__main__',name:'主头像',assetId:'__avatar__',value:editor.config.avatar},...secondary.map((e,i)=>({id:e.id,name:'副图 '+(i+1),assetId:e.assetId,value:e}))];
 if(selected?.type==='image'&&!selected.photoRole)targets.push({id:selected.id,name:'选中图片',assetId:selected.assetId,value:selected});
 const work=new Map();let active=targets.find(t=>t.id===editor.selectedId)?.id||'__main__';
 const {dialog}=studioDialog(editor,'照片调色',`<p class="star-dialog-hint">分别调整主图或副图的色调。预览选中的照片，应用后可以撤销。</p><select data-tone-target>${targets.map(t=>`<option value="${esc(t.id)}" ${t.id===active?'selected':''}>${esc(t.name)}</option>`).join('')}</select><div class="star-tone-preview"><img data-tone-preview alt="照片色调预览"></div><div class="star-studio-tabs">${['原色','柔和','暖调','冷调','黑白'].map((s,i)=>`<button data-tone-preset="${i}">${s}</button>`).join('')}</div>${[['brightness','亮度',60,150],['contrast','对比度',50,160],['saturation','饱和度',0,200],['warmth','冷暖',-50,50]].map(([id,name,min,max])=>`<label class="star-studio-range">${name}<input type="range" min="${min}" max="${max}" step="1" data-tone="${id}"><output data-tone-value="${id}"></output></label>`).join('')}<p data-studio-status role="status"></p><div class="star-dialog-actions"><button data-tone-cancel>取消</button><button data-tone-apply class="star-primary">应用调色</button></div>`,{className:'star-tone-dialog'});
 const current=()=>work.get(active)||normalizeTone(targets.find(t=>t.id===active)?.value.photoTone);
 const paint=()=>{
  const target=targets.find(t=>t.id===active),tone=current(),img=dialog.querySelector('[data-tone-preview]');
  img.src=target.assetId==='__avatar__'?editor.avatarUrl:BUILTIN_MAP.get(target.assetId)?.url||editor.assetUrls.get(target.assetId)||'';img.style.filter=toneFilter(tone);
  for(const input of dialog.querySelectorAll('[data-tone]')){input.value=tone[input.dataset.tone];dialog.querySelector(`[data-tone-value="${input.dataset.tone}"]`).textContent=tone[input.dataset.tone];}
 };
 dialog.querySelector('[data-tone-target]').addEventListener('change',event=>{active=event.target.value;paint();});
 dialog.addEventListener('input',event=>{const field=event.target.dataset.tone;if(!field)return;work.set(active,normalizeTone({...current(),[field]:Number(event.target.value)}));paint();});
 dialog.addEventListener('click',event=>{
  const p=event.target.closest('[data-tone-preset]');if(p){const values=[{}, {contrast:90,saturation:88,brightness:105},{warmth:28,saturation:105},{warmth:-24,contrast:104},{saturation:0,contrast:108}];work.set(active,normalizeTone(values[Number(p.dataset.tonePreset)]));paint();}
  if(event.target.closest('[data-tone-cancel]'))dialog.close();
  if(event.target.closest('[data-tone-apply]')){if(!work.size){dialog.close();return;}editor.mutate(()=>{for(const [id,tone] of work){const target=id==='__main__'?editor.config.avatar:editor.config.elements.find(e=>e.id===id);if(target)target.photoTone=tone;}});dialog.close();}
 });paint();
}
