import { ElInput } from 'element-ui/types/input';
import { BaseComponentAdapter } from '@/core/dtos/component-base.dto';

export interface InputAdapter extends BaseComponentAdapter<ElInput> {
  slots?: {
    prepend?: string;
    append?: string;
    prefix?: string;
    suffix?: string;
  };
  on?: {
    modelChange?: (value: any, oldValue: any) => void;
    blur?(event: Event): void;
    focus?(event: Event): void;
    change?(value: string | number): void;
    clear?(): void;
    input?(v: string | number): void;
  };
  // 以下是 Element UI Attrs 和 events
  // @see https://element.eleme.cn/#/zh-CN/component/input
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  type?: string;
  maxlength?: number;
  minlength?: number;
  showWordLimit?: boolean; // 显示maxlength限制
  clearable?: boolean;
  showPassword?: boolean;
  prefixIcon?: string;
  suffixIcon?: string;
  autocomplete?: 'on' | 'off';
  name?: string;
  max?: string;
  min?: string;
  step?: string;
  autofocus?: boolean;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  form?: string;
  label?: string;
  tabindex?: string;
  // type = "textarea"时以下配置生效
  size?: 'medium' | 'small' | 'mini';
  rows?: number;
  autosize?: boolean | { minRow?: number; maxRow?: number };
}
