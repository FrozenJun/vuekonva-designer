import { BaseComponentAdapter } from './../../../../../dtos/component-base.dto';
import {
  DatePickerType,
  DatePickerOptions,
  ElDatePicker
} from 'element-ui/types/date-picker';
import {
  ElementUIComponentSize,
  ElementUIHorizontalAlignment
} from 'element-ui/types/component';

export interface BaseDatetimeAdapter
  extends BaseComponentAdapter<ElDatePicker> {
  on?: {
    modelChange?: (value: any, oldValue: any) => void;
    change?(value: any): void;
    blur?(vm: ElDatePicker): void;
    focus?(vm: ElDatePicker): void;
  };
  slots?: {
    'range-separator'?: string;
  };
  // 以下是 Element UI Attrs
  // @see https://element.eleme.cn/#/zh-CN/component/datetime-picker#attributes
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  /** Size of Input */
  size?: ElementUIComponentSize;

  /** Whether the input is editable */
  editable?: boolean;

  /** Whether to show clear button */
  clearable?: boolean;

  /** Placeholder for the start date in range mode */
  startPlaceholder?: string;

  /** Placeholder for the end date in range mode */
  endPlaceholder?: string;

  /** Type of the picker */
  type?: DatePickerType;

  /** Format of the picker */
  format?: string; // @see https://element.eleme.cn/#/zh-CN/component/date-picker#ri-qi-ge-shi

  /** Alignment */
  align?: ElementUIHorizontalAlignment;

  /** Custom class name for DatePicker's dropdown */
  popperClass?: string;

  /** Additional options, check the table below */
  pickerOptions?: DatePickerOptions;

  /** Range separator */
  rangeSeparator?: string;

  /** Default date of the calendar */
  defaultValue?: Date | number | string;

  /** Format of binding value. If not specified, the binding value will be a Date object */
  valueFormat?: string; // @see https://element.eleme.cn/#/zh-CN/component/date-picker#ri-qi-ge-shi

  /** name for the inner native input */
  name?: string;
}
