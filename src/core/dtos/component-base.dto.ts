import { Vue } from 'vue-property-decorator';

export interface BaseComponentAdapter<T = Vue> {
  name?: string; // 组件名称，用于区分相同组件
  ref?: T | null; // 组件引用
  styles?: string[]; // 为当前组件赋予不同的状态样式
  slots?: { [k: string]: string | undefined }; // 组件的slots集合
  on?: { [k: string]: Function | undefined }; // UI库组件的events
  [k: string]: any;
}

export const BASE_ADAPTER_KEYS = ['name', 'ref', 'styles', 'slots', 'on'];
