import { BaseComponentAdapter } from '@/core/dtos/component-base.dto';
import { ElCheckboxGroup } from 'element-ui/types/checkbox-group';
import { ElementUIComponentSize } from 'element-ui/types/component';
import { CheckboxAdapter } from '../../checkbox/src/BaseCheckbox.adapter';

export interface BaseCheckboxGroupAdapter
  extends BaseComponentAdapter<ElCheckboxGroup> {
  checkboxs: CheckboxAdapter[];
  // 以下是 Element UI Attrs 和 events
  // @see https://element.eleme.cn/#/zh-CN/component/checkbox-group
  /** Size of checkbox buttons or bordered checkboxes */
  size?: ElementUIComponentSize;

  /** Whether the nesting checkboxes are disabled */
  disabled?: boolean;

  /** Minimum number of checkbox checked */
  min?: number;

  /** Maximum number of checkbox checked */
  max?: number;

  /** Font color when button is active */
  textColor?: string;

  /** Border and background color when button is active */
  fill?: string;
  on?: {
    modelChange?: (value: any, oldValue: any) => void;
    change?(value: any[]): void;
  };
}
