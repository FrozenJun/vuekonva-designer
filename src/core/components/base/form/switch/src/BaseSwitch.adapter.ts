import { BaseComponentAdapter } from '@/core/dtos/component-base.dto';
import { ElSwitch } from 'element-ui/types/switch';

export interface BaseSwitchAdapter extends BaseComponentAdapter<ElSwitch> {
  // 以下是 Element UI Attrs 和 events
  // @see https://element.eleme.cn/#/zh-CN/component/switch#attributes
  disabled?: boolean;
  /** Width of Switch */
  width?: number;

  /** Class name of the icon displayed when in on state, overrides on-text */
  activeIconClass?: string;

  /** Class name of the icon displayed when in off state, overrides off-text */
  inactiveIconClass?: string;

  /** Text displayed when in on state */
  activeText?: string;

  /** Text displayed when in off state */
  inactiveText?: string;

  /** Background color when in on state */
  activeColor?: string;

  /** Background color when in off state */
  inactiveColor?: string;

  /** Switch value when in on state */
  activeValue?: string | boolean | number;

  /** Switch value when in off state */
  inactiveValue?: string | boolean | number;

  /** Input name of Switch */
  name?: string;

  /** Whether to trigger form validation */
  validateEvent?: boolean;
  on?: {
    modelChange?: (value: any, oldValue: any) => void;
    change?(value: string | boolean | number): void;
  };
}
