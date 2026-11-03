const bounded=(value,min,max,fallback)=>Number.isFinite(Number(value))?Math.max(min,Math.min(max,Number(value))):fallback;
export function normalizeTone(value={}){value=value&&typeof value==='object'?value:{};return {brightness:bounded(value.brightness,60,150,100),contrast:bounded(value.contrast,50,160,100),saturation:bounded(value.saturation,0,200,100),warmth:bounded(value.warmth,-50,50,0)};}
/** DOM 与 Canvas 共用同一串滤镜，只作用于照片，纸张和相框单独绘制。 */
export function toneFilter(value){
 const t=normalizeTone(value);if(t.brightness===100&&t.contrast===100&&t.saturation===100&&t.warmth===0)return 'none';
 const warmth=t.warmth?` sepia(${Math.abs(t.warmth)/125}) hue-rotate(${t.warmth>0?-t.warmth*.18:t.warmth*.9}deg)`:'';
 return `brightness(${t.brightness/100}) contrast(${t.contrast/100}) saturate(${t.saturation/100})${warmth}`;
}
