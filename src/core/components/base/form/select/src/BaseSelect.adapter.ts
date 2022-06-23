import { BaseComponentAdapter } from './../../../../../dtos/component-base.dto';
import { ElementUIComponentSize } from 'element-ui/types/component';
import { ElSelect } from 'element-ui/types/select';
import { AsyncData } from '@/core/dtos/component.dto';

export interface SelectOptions {
  label: string;
  value: any;
  disabled?: boolean;
}

export interface BaseSelectAdapter extends BaseComponentAdapter<ElSelect> {
  options: SelectOptions[] | AsyncData<SelectOptions>;
  autoSendWhenModelChange?: boolean;
  autoSendWhenVisibleTrue?: boolean;
  slots?: {
    default?: string;
    prefix?: string;
    empty?: string;
  };
  on?: {
    modelChange?: (value: any, oldValue: any) => void;
    // 以下是 Element UI events
    // @see https://element.eleme.cn/#/zh-CN/component/select#select-events
    change?(value: string | number | boolean): void;
    visibleChange?(isVisible: boolean): void;
    removeTag?(removeTag: string): void;
    clear?(): void;
    blur?(event: Event): void;
    focus?(event: Event): void;
  };
  // 以下是 Element UI Attrs
  // @see https://element.eleme.cn/#/zh-CN/component/select#select-attributes
  disabled?: boolean;
  /** Whether multiple-select is activated */
  multiple?: boolean;
  /** value show way */
  collapseTags?: boolean;

  /** Unique identity key name for value, required when value is an object */
  valueKey?: string;

  /** Size of Input */
  size?: ElementUIComponentSize;

  /** Whether single select can be cleared */
  clearable?: boolean;

  /** Maximum number of options user can select when multiple is true. No limit when set to 0 */
  multipleLimit?: number;

  /** Same as autocomplete in native input */
  autocomplete?: string;

  /** The name attribute of select input */
  name?: string;

  /** Placeholder */
  placeholder?: string;

  /** Whether Select is filterable */
  filterable?: boolean;

  /** Whether creating new items is allowed. To use this, filterable must be true */
  allowCreate?: boolean;

  /** Custom filter method */
  filterMethod?(queryString: string): void;

  /** Whether options are loaded from server */
  remote?: boolean;

  /** Custom remote search method */
  remoteMethod?(queryString: string): void;

  /** Whether Select is loading data from server */
  loading?: boolean;

  /** Displayed text while loading data from server */
  loadingText?: string;

  /** Displayed text when no data matches the filtering query */
  noMatchText?: string;

  /** Displayed text when there is no options */
  noDataText?: string;

  /** Custom class name for Select's dropdown */
  popperClass?: string;

  /** Select first matching option on enter key. Use with filterable or remote */
  defaultFirstOption?: boolean;

  /** Whether to append the popper menu to body */
  popperAppendToBody?: boolean;
}
