import { ButtonAdapter } from './../../button/src/BaseButton.adapter';
import { BaseComponentAdapter } from '@/core/dtos/component-base.dto';
import { ElButtonGroup } from 'element-ui/types/button-group';

export interface ButtonGroupAdapter
  extends BaseComponentAdapter<ElButtonGroup> {
  buttons?: ButtonAdapter[];
  margin?: boolean; // 显示按钮之间的间隔
  on?: {};
  // @see https://element.eleme.cn/#/zh-CN/component/button
  [k: string]: any;
}

export interface ButtonGroupOutput {
  config?: ButtonGroupAdapter;
}
