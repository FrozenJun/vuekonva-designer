import { BaseComponentAdapter } from '@/core/dtos/component-base.dto';
import { ElPagination } from 'element-ui/types/pagination';

export interface PaginationAdapter extends BaseComponentAdapter<ElPagination> {
  // 以下是 Element UI Attrs 和 events
  // @see https://element.eleme.cn/#/zh-CN/component/pagination#attributes
  layout?: string;
  pageSizes?: number[];
  currentPage?: number;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  small?: boolean;
  background?: boolean;
  pageSize?: number;
  total?: number;
  pageCount?: number;
  pagerCount?: number;
  popperClass?: string;
  prevText?: string;
  nextText?: string;
  on?: {
    resetPage?(currentPage: number): void;
    // 以下是 Element UI  events
    // @see https://element.eleme.cn/#/zh-CN/component/pagination#events
    sizeChange?(pageSize: number): void;
    currentChange?(currentPage: number): void;
    prevClick?(currentPage: number): void;
    nextClick?(currentPage: number): void;
  };
}

export interface BasePaginationOutput {
  page?: number;
  pageSize?: number;
  resetPage?: Function;
}
