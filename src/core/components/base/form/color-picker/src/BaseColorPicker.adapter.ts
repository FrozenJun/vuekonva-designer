import { BaseComponentAdapter } from '@/core/dtos/component-base.dto';
import { ElColorPicker, ColorFormat } from 'element-ui/types/color-picker';
import { ElementUIComponentSize } from 'element-ui/types/component';

export interface BaseColorPickerAdapter
  extends BaseComponentAdapter<ElColorPicker> {
  // 以下是 Element UI Attrs 和 events
  // @see https://element.eleme.cn/#/zh-CN/component/color-picker
  /** Whether to display the alpha slider */
  showAlpha?: boolean;

  /** Whether to disable the ColorPicker */
  disabled?: boolean;

  /** Size of ColorPicker */
  size?: ElementUIComponentSize;

  /** Whether to display the alpha slider */
  popperClass?: string;

  /** Custom class name for ColorPicker's dropdown */
  colorFormat?: ColorFormat;
  /** 预定义颜色 */
  predefine?: string[];
  on?: {
    modelChange?: (value: any, oldValue: any) => void;
    change?(currentVal: string): void;
    activeChange?(activeVal: string): void;
  };
}
