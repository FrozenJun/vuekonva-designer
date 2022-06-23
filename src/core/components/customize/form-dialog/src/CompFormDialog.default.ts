import { CompFormDialogAdapter } from './CompFormDialog.adapter';
import { DIALOG_DEFAULT } from '../../../base/dialog/src/BaseDialog.default';
import { BASE_FORM_DEFAULT_CONFIG } from '../../../base/form/form/src/BaseForm.default';

export const COMP_FORM_DIALOG_DEFAULT_CONFIG: CompFormDialogAdapter = {
  form: BASE_FORM_DEFAULT_CONFIG,
  formModel: {},
  dialog: DIALOG_DEFAULT,
  api() {},
  handleApiParam(apiParam: any) {
    return apiParam;
  },
  on: {
    success(name: string = '') {
      this.emit(this.COMPONENT_METHOD.gridUpdate, null, name);
    }
  }
};
