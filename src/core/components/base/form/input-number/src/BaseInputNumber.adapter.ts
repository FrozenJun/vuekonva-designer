import { BaseComponentAdapter } from '@/core/dtos/component-base.dto';
import { InputNumberSize, ElInputNumber } from 'element-ui/types/input-number';

export interface BaseInputNumberAdapter
  extends BaseComponentAdapter<ElInputNumber> {
  on?: {
    modelChange?: (value: any, oldValue: any) => void;
    change?(currentValue: number, oldValue: number): void;
    blur?(event: Event): void;
    focus?(event: Event): void;
  };
  // 以下是 Element UI Attrs
  // @see https://element.eleme.cn/#/zh-CN/component/input-number#attributes
  /** Binding value */
  /** The minimum allowed value */
  min?: number;

  /** The maximum allowed value */
  max?: number;

  /** Incremental step */
  step?: number;

  /** Size of the component */
  size?: InputNumberSize;

  /** Whether the component is disabled */
  disabled?: boolean;

  /** Whether to enable the control buttons */
  controls?: boolean;

  /** Debounce delay when typing, in milliseconds */
  debounce?: number;

  /** Position of the control buttons */
  controlsPosition?: string;

  /** Same as name in native input */
  name?: string;

  /** Precision of input value */
  precision?: number;

  /** whether input value can only be multiple of step */
  stepStrictly?: boolean;
}
