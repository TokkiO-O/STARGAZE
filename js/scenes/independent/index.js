import {reviewedScene} from '../reviewed/index.js';

/** 十个主题各有九份独立构图；旧文件保留作兼容和开发比对。 */
export function buildIndependentScene(W,H,style,key){return reviewedScene(W,H,style.id,key);}
