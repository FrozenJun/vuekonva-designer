import { BaseComponentAdapter } from './../../../../../dtos/component-base.dto';
import { ElementUIComponentSize } from 'element-ui/types/component';
import {
  CascaderOption,
  CascaderProps,
  CascaderNode
} from 'element-ui/types/cascader-panel';
import { ElCascader } from 'element-ui/types/cascader';

export interface CascaderOptions {
  label: string;
  value: any;
}

export interface BaseCascaderAdapter<V = any, D = CascaderOption>
  extends BaseComponentAdapter<ElCascader> {
  rendering?: boolean;
  on?: {
    modelChange?: (value: any, oldValue: any) => void;
    change?(value: any): void;
    expandChange?(parentValues: any[]): void;
    blur?(event: Event): void;
    focus?(event: Event): void;
    visibleChange?(isVisible: boolean): void;
    removeTag?(removeTag: string): void;
  };
  // 以下是 Element UI Attrs
  // @see https://element.eleme.cn/#/zh-CN/component/cascader#cascader-attributes
  /** Data of the options */
  options?: CascaderOption[];

  /** Configuration options */
  props?: CascaderProps<V, D>;

  /** Selected value */
  value?: V | V[];

  /** Size of Input */
  size?: ElementUIComponentSize;

  /** Input placeholder */
  placeholder?: string;

  /** Whether Cascader is disabled */
  disabled?: boolean;

  /** Whether selected value can be cleared */
  clearable?: boolean;

  /** Whether to display all levels of the selected value in the input */
  showAllLevels?: boolean;

  /** Whether to collapse selected tags in multiple selection mode */
  collapseTags?: boolean;

  /** Separator of option labels */
  separator?: string;

  /** Whether the options can be searched */
  filterable?: boolean;

  /** filter method to match options according to input keyword */
  filterMethod?: (node: CascaderNode<V, D>, keyword: string) => boolean;

  /** Debounce delay when typing filter keyword, in millisecond */
  debounce?: number;

  /** Custom class name for Cascader's dropdown */
  popperClass?: string;

  /** Hook function before filtering with the value to be filtered as its parameter */
  beforeFilter?: (value: string) => boolean | Promise<any>;
}
