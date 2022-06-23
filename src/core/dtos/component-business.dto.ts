export interface BusinessComponentAdapter {
  styles?: string[]; // 为当前组件赋予不同的状态样式
  on?: { [k: string]: Function | undefined }; // 监听组件事件的对象
}
