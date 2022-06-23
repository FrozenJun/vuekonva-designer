import { InputAdapter } from './../../input/src/BaseInput.adapter';
import { BaseComponentAdapter } from './../../../../../dtos/component-base.dto';
import { BaseTreeAdapter } from 'src/core/components/base/tree/src/BaseTree.adapter';

export interface BaseTreeSelectAdapter extends BaseComponentAdapter {
  label?: string;
  valueKey?: string;
  input?: InputAdapter;
  tree: BaseTreeAdapter;
  on?: {
    modelChange?: (value: any, oldValue: any) => void;
  };
}
