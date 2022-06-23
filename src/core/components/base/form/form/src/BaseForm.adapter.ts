import { BaseComponentAdapter } from '@/core/dtos/component-base.dto';
import { ElForm } from 'element-ui/types/form';
import { BaseFormItemAdapter } from '../../form-item/src/BaseFormItem.adapter';

export interface FormAdapter extends BaseComponentAdapter<ElForm> {
  itemWidth?: string;
  itemContentAlign?: 'left' | 'mid' | 'right';
  formItems: BaseFormItemAdapter[];
  max?: number; // 最多显示多少个formItem
  // 以下是 Element UI Attrs 和 events
  // @see https://element.eleme.cn/#/zh-CN/component/form#form-attributes
  labelWidth?: string;
  labelPosition?: 'right' | 'left' | 'top';
  inline?: boolean;
  hideRequiredAsterisk?: boolean;
  size?: 'medium' | 'small' | 'mini';
  disabled?: boolean;
  statusIcon?: boolean;
  labelSuffix?: string;
  on?: {
    validated?(isValid: boolean): void;
    formModelChange?(
      formModel: { [name: string]: any },
      oldFormModel: { [name: string]: any },
      config: FormAdapter
    ): void;
  };
}

export interface BaseFormOutput {
  reset?: Function;
  validate?: Function;
}
