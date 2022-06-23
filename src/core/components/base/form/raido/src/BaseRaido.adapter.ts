import { BaseComponentAdapter } from '@/core/dtos/component-base.dto';
import { ElRadioGroup, RadioGroupSize } from 'element-ui/types/radio-group';

export interface BaseRaidoItemsConfig {
  text: string;
  // 以下是 Element UI Attrs 和 events
  // @see https://element.eleme.cn/#/zh-CN/component/raido
  /** The value of radio */
  label?: string | number | boolean;

  /** Whether radio is disabled */
  disabled?: boolean;

  /** Whether to add a border around Radio */
  border?: boolean;

  /** Native 'name' attribute */
  name?: string;
}

export interface BaseRaidoAdapter extends BaseComponentAdapter<ElRadioGroup> {
  raidos: BaseRaidoItemsConfig[];
  // 以下是 Element UI Attrs 和 events
  /** The size of radio buttons */
  size?: RadioGroupSize;

  /** Border and background color when button is active */
  fill?: string;

  /** Whether the nesting radios are disabled */
  disabled?: boolean;

  /** Font color when button is active */
  textColor?: string;
  on?: {
    modelChange?: (value: any, oldValue: any) => void;
    change?(currentRaido: string | number | boolean): void;
  };
}
