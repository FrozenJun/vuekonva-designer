import { BaseComponentAdapter } from '@/core/dtos/component-base.dto';
import {
  ElButton,
  ButtonType,
  ButtonNativeType
} from 'element-ui/types/button';
import { ElementUIComponentSize } from 'element-ui/types/component';

export interface ButtonAdapter extends BaseComponentAdapter<ElButton> {
  visable?: boolean;
  text?: string;
  hasPermission?: (permission: string) => boolean;
  permissionName?: string;
  on?: {
    click?: (e: Event) => void;
  };
  // @see https://element.eleme.cn/#/zh-CN/component/button
  /** Button size */
  size?: ElementUIComponentSize;

  /** Button type */
  type?: ButtonType;

  /** Determine whether it's a plain button */
  plain?: boolean;

  /** Determine whether it's a round button */
  round?: boolean;

  /** Determine whether it's loading */
  loading?: boolean;

  /** Disable the button */
  disabled?: boolean;

  /** Button icon, accepts an icon name of Element icon component */
  icon?: string;

  /** Same as native button's autofocus */
  autofocus?: boolean;

  /** Same as native button's type */
  nativeType?: ButtonNativeType;
  [k: string]: any;
}

export interface ButtonOutput {
  config?: ButtonAdapter;
}
