import { CustomizeComponentAdapter } from './../../../../dtos/component-customize.dto';
import { FormAdapter } from './../../../base/form/form/src/BaseForm.adapter';

export interface CompFormAdapter extends CustomizeComponentAdapter {
  form: FormAdapter;
  formModel: { [name: string]: any };
  title?: string;
  className?: string;
  on?: {
    validated(isValid: boolean): void;
  };
  styles?: 'underline'[];
}
