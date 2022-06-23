export interface CustomizeComponentAdapter {
  name?: string; // 组件名称
  styles?: string[]; // 为当前组件赋予不同的状态样式
  slots?: { [k: string]: string | undefined };
  on?: { [k: string]: Function | undefined }; // 监听组件事件的对象
}
