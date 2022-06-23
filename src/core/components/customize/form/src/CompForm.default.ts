import { BASE_FORM_DEFAULT_CONFIG } from './../../../base/form/form/src/BaseForm.default';
import { CompFormAdapter } from './CompForm.adapter';

export const COMP_FORM_DEFAULT_CONFIG: CompFormAdapter = {
  form: BASE_FORM_DEFAULT_CONFIG,
  formModel: {},
  title: '',
  on: {
    validated() {}
  }
};
