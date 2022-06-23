import { InputAdapter } from './../../input/src/BaseInput.adapter';
import {
  SuggestionPlacement,
  FetchSuggestions
} from 'element-ui/types/autocomplete';

export interface BaseAutocompleteAdapter extends InputAdapter {
  slots?: {
    prepend?: string;
    append?: string;
    prefix?: string;
    suffix?: string;
  };
  on?: {
    modelChange?: (value: any, oldValue: any) => void;
    select?(value: string | number): void;
    blur?(event: Event): void;
    focus?(event: Event): void;
    change?(value: string | number): void;
    clear?(): void;
  };

  // 以下是 Element UI Attrs
  // @see https://element.eleme.cn/#/zh-CN/component/input#autocomplete-attributes
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  /** Whether to show clear button */
  clearable?: boolean;

  /** Debounce delay when typing */
  debounce?: number;

  /** Placement of the popup menu */
  placement?: SuggestionPlacement;

  /** Name for the inner native input */
  name?: string;

  /** Key name of the input suggestion object for display */
  valueKey?: string;

  /** Whether to emit select event on enter when there is no autocomplete match */
  selectWhenUnmatched?: boolean;

  /** A method to fetch input suggestions. When suggestions are ready, invoke callback(data?:[]) to return them to Autocomplete */
  fetchSuggestions?: FetchSuggestions;

  /** Custom class name for autocomplete's dropdown */
  popperClass?: string;

  /** Whether show suggestions when input focus */
  triggerOnFocus?: boolean;

  /** Prefix icon class */
  prefixIcon?: string;

  /** Suffix icon class */
  suffixIcon?: string;

  /** Whether to hide the loading icon in remote search */
  hideLoading?: boolean;

  /** Whether to append the dropdown to body */
  popperAppendToBody?: boolean;
}
