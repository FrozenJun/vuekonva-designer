import { CustomizeComponentAdapter } from './../../../../dtos/component-customize.dto';
import { BaseTableOutput } from './../../../base/table/src/BaseTable.adapter';
import {
  PaginationAdapter,
  BasePaginationOutput
} from './../../../base/pagination/src/BasePagination.adapter';
import { BaseTableAdapter } from '../../../base/table/src/BaseTable.adapter';

export interface CompGridAdapter extends CustomizeComponentAdapter {
  table: BaseTableAdapter; // table组件的配置参数
  pagination?: PaginationAdapter; // pagination组件的配置参数z
  sink?: boolean; // grid是否沉底
  sinkAdapter?: number; // 偏移量，默认值失效时可设置调节
  hiddenPagination?: boolean; // 是否隐藏页脚
  on?: {
    resetPage?(page: number): void;
    updated?(payload: any): void;
  };
}

// type refType = { [k: string]: any } | any[];

// export interface CompGridAdapter extends CustomizeComponentAdapter {
//   table: BaseTableAdapter; // table组件的配置参数
//   pagination?: PaginationAdapter; // pagination组件的配置参数
//   data?: refType | AsyncData<refType>;
//   isPaginationBySelf?: boolean; // 是否需要前端分页
//   keys?: {
//     list?: string;
//     total?: string;
//     pageNo?: string;
//     pageSize?: string;
//   };
//   sink?: boolean; // grid是否沉底
//   sinkAdapter?: number; // 偏移量，默认值失效时可设置调节
//   hiddenPagination?: boolean; // 是否隐藏页脚
//   on?: {
//     resetPage?(page: number): void;
//     updated?(payload: any): void;
//   };
// }

export interface CompGridOutput extends BasePaginationOutput, BaseTableOutput {
  setParams(params: { [name: string]: any }): void;
}
