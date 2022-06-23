import { FormAdapter } from './../../form/src/BaseForm.adapter';
import { BaseComponentAdapter } from '@/core/dtos/component-base.dto';

interface FormListItem {
  form: FormAdapter;
  formModel: { [k: string]: any };
}

export interface BaseArrayFormAdapter extends BaseComponentAdapter {
  form: FormAdapter;
  formModel?: { [name: string]: any }; // 注意，仅用于初始化
  title?: string;
  titleClassName?: string;
  min?: number;
  max?: number;
  sort?: boolean;
  on?: {
    modelChange?(
      formModel: { [name: string]: any }[],
      oldFormModel: { [name: string]: any }[],
      formList: FormListItem[]
    ): void;
  };
}
