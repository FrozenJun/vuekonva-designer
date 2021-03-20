import { Canceler } from 'axios';
import { ProviderItem } from '../service/factory.service';

export interface AsyncData<D = any> {
  api(...args: any[]): Promise<any>;
  data?: any;
  params?: Record<string, any>;
  paramsGetter?: (...args: any[]) => Record<string, any>;
  handleData?(data: any): D | D[];
  handleKey?: string; // 存在时handleData处理仅handleKey部分 可使用path形式
  handleEach?: boolean; // handleData传入的是列表的每一项,处理数据是列表是生效
  afterSend?(asyncData: AsyncData<D>, ref: any): void;
  immediate?: boolean;
  send?: (() => Promise<any>) | undefined;
  set?: ((data: any) => void) | undefined;
  disableCache?: boolean; // 禁用数据存在时不重复请求
  disableParamsCache?: boolean; // 禁用相同params时不重复请求
  loading?: boolean;
  disableAbort?: boolean; // 禁用cancel接口功能
  c?: Canceler;
  _sendParams?: Record<string, any>; // 真正传给Api的参数，有时候params并不是最后的参数，比如表格还要带额外的查询，分页参数
  _oldParams?: Record<string, any>;
  providerName?: string; // 是否在FactroyServer注册AsyncData
  providerRegisterOpt?: ProviderItem; // 在FactroyServer注册AsyncData时的信息
}

export function isAsyncData(data: any): data is AsyncData {
  return data && typeof data.api === 'function';
}
