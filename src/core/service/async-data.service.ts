import { Canceler } from 'axios';

export interface AsyncType<D = any> {
  api(...args: any[]): Promise<any>;
  data?: D;
  params?: { [k: string]: any };
  handleData?(data: any): D | Promise<D>;
  immediate?: boolean;
  caller?: () => Promise<any> | undefined;
  loading?: boolean;
}

export type AsyncData<T = any> = T | AsyncType<T>;

export function isAsyncData(data: any): data is AsyncData {
  return data && typeof data.api === 'function';
}

export class AsyncDataService<T = any> {
  c?: Canceler;
  options!: AsyncType;

  get loading() {
    return !!this.options.loading;
  }

  constructor(options: AsyncType) {
    this.options = options;
    this.options.caller = this.send;
  }

  async send() {
    const { api, params, handleData } = this.options;
    // 如果c存在，说明之前调的接口未结束，执行c()可以abort之前的接口请求
    if (this.c) this.c();
    this.options.loading = true;
    const res = await api(params, this);
    this.options.loading = false;
    this.c = undefined;
    if (!res) return;
    this.options.data = handleData ? await handleData(res) : res;
    return this.options.data;
  }
}
