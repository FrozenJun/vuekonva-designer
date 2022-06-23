import { BASE_FORM_DEFAULT_CONFIG } from '../../../base/form/form/src/BaseForm.default';
import { CompAddEditDialogAdapter } from './CompAddEditDialog.adapter';
export const ADD_EDIT_DIALOG_DEFAULT: CompAddEditDialogAdapter = {
  form: BASE_FORM_DEFAULT_CONFIG,
  formModel: {},
  addApi() {},
  handleAddParam(v) {
    return v;
  },
  editApi() {},
  handleEditParam(v) {
    return v;
  },
  on: {
    success(res: any, name: string = '') {
      this.emit(this.COMPONENT_METHOD.gridUpdate, null, name);
    }
  }
};
